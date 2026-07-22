#!/usr/bin/env python3
"""Render docs/weekly.md — the agenda for the Tuesday check-in call (21:30 UTC+8).

The daily digest answers "what moved since yesterday" and is written to be skimmed alone.
This answers "what happened since we last met", which is a different document: it covers a
full seven days, so it groups rather than lists, and it leads with tracked integrations
because that is the order the meeting runs in.

Week-over-week state comes from data/auto-state-weekly.yaml — a snapshot taken at the end
of each weekly run. Diffing against the *daily* snapshot would only ever show one day of
movement, which is the whole thing this page exists to avoid.

Outside activity is filtered out of the archives by date rather than re-collected, so the
weekly and daily views can never disagree about what happened.

Usage:
    GH_TOKEN=<token> python scripts/weekly.py     # render + roll the snapshot forward
    python scripts/weekly.py --selftest           # offline checks (no token, no pyyaml)
"""
import os
import sys

import digest  # scripts/digest.py — shared delta + grouping helpers

AUTO_STATE = "data/auto-state.yaml"
SNAPSHOT = "data/auto-state-weekly.yaml"
CANDIDATES = "data/candidates.yaml"
NEWS = "data/news.yaml"
WEEKLY_MD = "docs/weekly.md"
INTEGRATIONS = "data/integrations.yaml"

WINDOW_DAYS = 7


def window_start(today, days=WINDOW_DAYS):
    """First date included in the window. today is 'YYYY-MM-DD'."""
    import datetime
    d = datetime.date(int(today[:4]), int(today[5:7]), int(today[8:10]))
    return (d - datetime.timedelta(days=days)).isoformat()


def in_window(rows, start):
    """Archive rows whose activity falls on or after `start`, newest first."""
    kept = [r for r in rows or []
            if r.get("status") != "dismissed" and (r.get("updated_at") or "")[:10] >= start]
    kept.sort(key=lambda r: r.get("updated_at") or "", reverse=True)
    return kept


def _tracked_lines(old, new, names):
    """What the integrations we actively track did this week."""
    d = digest.compute_delta(old, new)
    out = []
    if not (d["state_changes"] or d["new_items"]):
        return ["_No tracked integration changed state this week._", ""]
    for url in d["state_changes"]:
        o, n = old.get(url, {}), new[url]
        moved = ("**merged**" if n.get("merged") and not o.get("merged")
                 else "`%s` → `%s`" % (o.get("state") or "—", n.get("state") or "—"))
        out.append("- **%s** — [%s](%s) — %s"
                   % (digest._label(url, names), digest._ref(url, n), url, moved))
    for url in d["new_items"]:
        out.append("- **%s** — [%s](%s) — now tracking, `%s`"
                   % (digest._label(url, names), digest._ref(url, new[url]), url,
                      new[url].get("state") or "—"))
    out.append("")
    return out


def _outside_lines(candidates, news):
    """A week of outside activity, one line per repo — detail lives on the archive page."""
    out = []
    if not candidates:
        out += ["_Nothing new outside the org this week._", ""]
    else:
        groups = digest.group_by_repo(candidates)
        out.append("%d items across %d repos:" % (len(candidates), len(groups)))
        out.append("")
        for repo, items in groups:
            stars = max((i.get("stars") or 0) for i in items)
            out.append("- **[%s](https://github.com/%s)** ⭐%s — %s"
                       % (repo, repo, stars, digest.summarise_kinds(items)))
        out.append("")
    if news:
        out += ["**Off GitHub**", ""]
        for n in news:
            out.append("- [%s](%s) — _%s_, %s" % (
                digest._trunc(n.get("title"), 90), n["url"], n.get("outlet") or "unknown",
                (n.get("updated_at") or "")[:10]))
        out.append("")
    return out


def render(old, new, names, candidates, news, today, checkins=None, start=None):
    """Build the weekly markdown. `old` is last week's auto-state snapshot."""
    start = start or window_start(today)
    out = ["# Weekly digest", "",
           "_Week of %s → %s · prepared for the Tuesday check-in (21:30 UTC+8)._" % (start, today),
           "",
           "## Tracked integrations", ""]
    out += _tracked_lines(old, new, names)
    out += ["## Outside activity", "",
            "_Everything below happened this week. Full history: "
            "[Outside activity](outside.md)._", ""]
    out += _outside_lines(candidates, news)
    checkin_lines = digest._checkin_lines(checkins)
    if checkin_lines:
        out += checkin_lines[1:]  # drop the leading blank; headings already spaced
    return "\n".join(out).rstrip() + "\n"


def main(argv):
    if "--selftest" in argv:
        return selftest()

    import yaml
    from datetime import datetime, timezone

    def load(path, default):
        if not os.path.exists(path):
            return default
        with open(path) as f:
            return yaml.safe_load(f) or default

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    new = load(AUTO_STATE, {})
    # First run has no weekly snapshot; fall back to current state so the section reads
    # "nothing changed" rather than announcing every tracked item as brand new.
    old = load(SNAPSHOT, None)
    if old is None:
        old = dict(new)

    names = {i.get("tracking_issue"): i.get("name")
             for i in load(INTEGRATIONS, []) if i and i.get("tracking_issue")}

    start = window_start(today)
    candidates = in_window(load(CANDIDATES, []), start)
    news = in_window(load(NEWS, []), start)

    checkin_data = None
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if token:
        import checkins as checkins_mod
        checkin_data = checkins_mod.gather(token)

    with open(WEEKLY_MD, "w") as f:
        f.write(render(old, new, names, candidates, news, today, checkins=checkin_data,
                       start=start))
    print("wrote %s (%d outside items, %d stories)" % (WEEKLY_MD, len(candidates), len(news)))

    # Roll the snapshot forward only after a successful render, so a crashed run repeats
    # the same window next time instead of silently swallowing a week of changes.
    with open(SNAPSHOT, "w") as f:
        f.write("# Auto-generated by scripts/weekly.py — last week's auto-state snapshot.\n")
        yaml.safe_dump(new, f, sort_keys=True, default_flow_style=False, allow_unicode=True)
    print("wrote %s (%d tracked items)" % (SNAPSHOT, len(new)))
    return 0


def selftest():
    assert window_start("2026-07-22") == "2026-07-15"
    assert window_start("2026-01-05") == "2025-12-29"  # crosses a year boundary

    rows = [{"url": "a", "updated_at": "2026-07-20T00:00:00Z"},
            {"url": "b", "updated_at": "2026-07-10T00:00:00Z"},          # too old
            {"url": "c", "updated_at": "2026-07-21T00:00:00Z", "status": "dismissed"},
            {"url": "d", "updated_at": "2026-07-16T00:00:00Z"}]
    kept = in_window(rows, "2026-07-15")
    assert [r["url"] for r in kept] == ["a", "d"], kept

    pr = "https://github.com/ACINQ/eclair/pull/2275"
    new = {pr: {"kind": "pull", "state": "MERGED", "merged": True,
                "last_activity": "2026-07-21T00:00:00Z"}}
    old = {pr: {"kind": "pull", "state": "OPEN", "merged": False,
                "last_activity": "2026-07-14T00:00:00Z"}}
    cands = [{"repo": "SatoshiPortal/bullbitcoin-mobile", "kind": "pr", "stars": 186,
              "url": "https://github.com/SatoshiPortal/bullbitcoin-mobile/pull/%d" % n,
              "updated_at": "2026-07-2%dT00:00:00Z" % n, "title": "payjoin %d" % n}
             for n in range(1, 4)]
    stories = [{"url": "https://bm/x", "outlet": "Bitcoin Magazine", "kind": "article",
                "title": "Async Payjoin explained", "updated_at": "2026-07-19T00:00:00Z"}]
    md = render(old, new, {pr: "LDK-Node"}, cands, stories, "2026-07-22")
    assert "Week of 2026-07-15 → 2026-07-22" in md, md
    assert "21:30 UTC+8" in md, md
    assert "**merged**" in md and "LDK-Node" in md, md
    # A week's worth of one repo is a single line with a count, not three rows.
    assert "3 PRs" in md and md.count("bullbitcoin-mobile/pull/") == 0, md
    assert "3 items across 1 repos" in md, md
    assert "Bitcoin Magazine" in md, md
    assert "[Outside activity](outside.md)" in md, md

    # Quiet week: both sections say so rather than rendering empty headings.
    quiet = render(new, new, {}, [], [], "2026-07-22")
    assert "No tracked integration changed state" in quiet, quiet
    assert "Nothing new outside the org this week" in quiet, quiet

    # Check-in follow-through is appended when the collector supplied it.
    md = render(new, new, {}, [], [], "2026-07-22", checkins={
        "date": "2026-07-21", "url": "https://example/d",
        "rows": [{"user": "spacebear21", "focus": "land the relay fix",
                  "prs": [{"url": "https://github.com/payjoin/rust-payjoin/pull/1755"}],
                  "issues": []}]})
    assert "## Check-in follow-through" in md and "rust-payjoin#1755" in md, md
    print("weekly selftest passed")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

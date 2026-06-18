#!/usr/bin/env python3
"""Render the daily digest markdown from two auto-state snapshots (old vs new) plus,
optionally, weekly check-in follow-through.

Phase 2 added the auto-state delta; Phase 3 appends a "Check-in follow-through" section
(commitments vs what shipped) supplied by scripts/checkins.py. Pure functions — no I/O,
no network, no YAML — so they are trivially testable offline (`python scripts/digest.py
--selftest`). The digest is the DELTA you read once at 8am, distinct from the Integrations
page (current-state snapshot).
"""
import sys


def _label(url, names):
    """Friendly integration name, falling back to the owner/repo[/#n] tail of the URL."""
    return (names or {}).get(url) or url.split("github.com/")[-1].rstrip("/")


def _ref(url, rec):
    """Short reference like 'PR #2275', 'issue #161', 'discussion #1764', or 'repo'."""
    kind = (rec or {}).get("kind", "?")
    if kind == "repo":
        return "repo"
    return "%s #%s" % (kind, url.rstrip("/").split("/")[-1])


def _trunc(s, n):
    """Trim to ~n chars on a word boundary with an ellipsis."""
    s = " ".join((s or "").split())
    return s if len(s) <= n else s[:n].rsplit(" ", 1)[0] + "…"


def _pr_label(url):
    """Compact link label like 'rust-payjoin#1610' from an issue/PR URL."""
    parts = url.rstrip("/").split("/")
    if len(parts) >= 4 and parts[-2] in ("pull", "issues") and parts[-1].isdigit():
        return "%s#%s" % (parts[-3], parts[-1])
    return parts[-1] if parts else url


def _links(items, cap=6):
    """Render shipped items as compact markdown links, capped with a '+N more'."""
    out = ["[%s](%s)" % (_pr_label(i["url"]), i["url"]) for i in items if i.get("url")]
    if len(out) > cap:
        out = out[:cap] + ["+%d more" % (len(out) - cap)]
    return ", ".join(out)


def compute_delta(old, new):
    """Classify each tracked URL's change between snapshots.

    Returns dict of url-lists: state_changes, new_items, activity, dropped. A state change
    (or a fresh merge) outranks bare activity; activity is a moved last_activity or comment count.
    """
    state_changes, new_items, activity = [], [], []
    for url, n in new.items():
        o = old.get(url)
        if o is None:
            new_items.append(url)
        elif o.get("state") != n.get("state") or (n.get("merged") and not o.get("merged")):
            state_changes.append(url)
        elif o.get("last_activity") != n.get("last_activity") or o.get("comments") != n.get("comments"):
            activity.append(url)
    dropped = [url for url in old if url not in new]
    return {"state_changes": state_changes, "new_items": new_items,
            "activity": activity, "dropped": dropped}


def _checkin_lines(checkins):
    """Markdown lines for the weekly check-in follow-through section (empty if no data)."""
    if not checkins or not checkins.get("rows"):
        return []
    out = ["", "## Check-in follow-through", "",
           "_%s · [thread](%s)_" % (checkins.get("date", "latest"), checkins.get("url", "")), ""]
    followups = []
    for r in checkins["rows"]:
        prs, iss, focus = r.get("prs") or [], r.get("issues") or [], r.get("focus")
        if not (focus or prs or iss):
            continue  # fully quiet this week — skip rather than call out
        out.append("- **%s** — committed: %s"
                   % (r["user"], ('"%s"' % _trunc(focus, 140)) if focus else "—"))
        out.append("    - shipped: %s" % (_links(prs + iss) or "—"))
        if focus and not prs and not iss:
            followups.append(r)
    if followups:
        out += ["", "_To follow up — committed, but no merged PRs/issues in public org repos "
                "since (could be fork, review, or off-GitHub work):_", ""]
        for r in followups:
            out.append('- **%s** — "%s"' % (r["user"], _trunc(r["focus"], 90)))
    return out


def _candidate_lines(candidates):
    """Markdown lines for newly-discovered external payjoin activity (empty if none)."""
    if not candidates:
        return []
    out = ["", "## New activity outside tracked repos", "",
           "_payjoin issues/PRs in repos we don't watch yet — triage in `data/candidates.yaml`._", ""]
    cap = 12
    for c in candidates[:cap]:
        out.append("- [%s](%s) · %s · ⭐%s · %s — %s" % (
            c["repo"], c["url"], c.get("kind", "?"), c.get("stars", 0),
            (c.get("updated_at") or "")[:10], _trunc(c.get("title"), 80)))
    if len(candidates) > cap:
        out.append("- _+%d more in `data/candidates.yaml`_" % (len(candidates) - cap))
    return out


def render(old, new, names, date_str, checkins=None, candidates=None):
    """Build the digest markdown string. date_str is the UTC date (YYYY-MM-DD)."""
    d = compute_delta(old, new)
    out = ["# Daily digest", "",
           "_As of %s (UTC) · tracking %d upstream items_" % (date_str, len(new)), ""]

    def line(url, extra=""):
        link = "[%s](%s)" % (_ref(url, new.get(url)), url)
        tail = (" — " + extra) if extra else ""
        return "- **%s** — %s%s" % (_label(url, names), link, tail)

    if not old:
        # First run: no previous snapshot to diff against.
        out += ["Initial snapshot — now tracking:", ""]
        for url in sorted(new, key=lambda u: _label(u, names).lower()):
            n = new[url]
            out.append(line(url, "`%s`, last activity %s"
                            % (n.get("state") or "—", (n.get("last_activity") or "")[:10])))
    elif not (d["state_changes"] or d["new_items"] or d["activity"] or d["dropped"]):
        # Quiet day: surface the most-recently-active item so the page is never blank.
        out += ["No upstream changes since the last refresh.", ""]
        if new:
            warm = max(new, key=lambda u: new[u].get("last_activity") or "")
            out.append("Most recently active: " + line(warm,
                       "last activity %s" % (new[warm].get("last_activity") or "")[:10]).lstrip("- "))
    else:
        if d["state_changes"]:
            out += ["## Changed", ""]
            for url in d["state_changes"]:
                o, n = old.get(url, {}), new[url]
                if n.get("merged") and not o.get("merged"):
                    transition = "**merged**"
                else:
                    transition = "`%s` → `%s`" % (o.get("state") or "—", n.get("state") or "—")
                out.append(line(url, transition))
            out.append("")
        if d["new_items"]:
            out += ["## Now tracking", ""]
            for url in d["new_items"]:
                out.append(line(url, "`%s`" % (new[url].get("state") or "—")))
            out.append("")
        if d["activity"]:
            out += ["## Activity", ""]
            for url in d["activity"]:
                o, n = old.get(url, {}), new[url]
                bits = []
                if o.get("comments") != n.get("comments"):
                    bits.append("%s→%s comments" % (o.get("comments", "?"), n.get("comments", "?")))
                if o.get("last_activity") != n.get("last_activity"):
                    bits.append("updated %s" % (n.get("last_activity") or "")[:10])
                out.append(line(url, ", ".join(bits)))
            out.append("")
        if d["dropped"]:
            out += ["## No longer tracked", ""]
            for url in d["dropped"]:
                out.append("- %s — %s" % (_label(url, names), url))
            out.append("")

    out += _checkin_lines(checkins)
    out += _candidate_lines(candidates)
    return "\n".join(out).rstrip() + "\n"


def selftest():
    new = {
        "https://github.com/ACINQ/eclair/pull/2275": {"kind": "pull", "state": "MERGED", "merged": True, "last_activity": "2025-07-21T00:00:00Z"},
        "https://github.com/bitcoinppl/cove": {"kind": "repo", "state": "ACTIVE", "last_activity": "2026-06-15T00:00:00Z", "open_issues": 83},
        "https://github.com/x/y/issues/9": {"kind": "issue", "state": "OPEN", "last_activity": "2026-06-16T00:00:00Z", "comments": 5},
    }
    assert "Initial snapshot" in render({}, new, {"https://github.com/bitcoinppl/cove": "Cove"}, "2026-06-16")
    assert "No upstream changes" in render(new, new, {}, "2026-06-16")
    old = dict(new)
    old["https://github.com/ACINQ/eclair/pull/2275"] = {"kind": "pull", "state": "OPEN", "merged": False, "last_activity": "2025-07-20T00:00:00Z"}
    old["https://github.com/x/y/issues/9"] = {"kind": "issue", "state": "OPEN", "last_activity": "2026-06-15T00:00:00Z", "comments": 2}
    md = render(old, new, {}, "2026-06-16")
    assert "## Changed" in md and "merged" in md and "2→5 comments" in md, md
    assert "## No longer tracked" in render({"https://github.com/gone/repo": {"kind": "repo"}}, new, {}, "2026-06-16")
    # check-in section: links rendered, neutral follow-up, fully-quiet people skipped
    checkins = {"date": "2026-06-08", "url": "https://example/d", "rows": [
        {"user": "alice", "focus": "ship the relay fix",
         "prs": [{"title": "fix", "url": "https://github.com/payjoin/rust-payjoin/pull/1610"}], "issues": []},
        {"user": "bob", "focus": "finish #1035", "prs": [], "issues": []},
        {"user": "ghost", "focus": None, "prs": [], "issues": []},
    ]}
    md = render(new, new, {}, "2026-06-16", checkins=checkins)
    assert "## Check-in follow-through" in md and "rust-payjoin#1610" in md, md
    assert "To follow up" in md and "bob" in md and "ghost" not in md, md
    cands = [{"repo": "BlueWallet/BlueWallet", "url": "https://github.com/BlueWallet/BlueWallet/issues/1",
              "kind": "issue", "stars": 3224, "updated_at": "2026-06-18T00:00:00Z", "title": "Payjoin support"}]
    md = render(new, new, {}, "2026-06-18", candidates=cands)
    assert "## New activity outside tracked repos" in md and "BlueWallet/BlueWallet" in md and "⭐3224" in md, md
    print("digest selftest passed")
    return 0


if __name__ == "__main__":
    sys.exit(selftest() if "--selftest" in sys.argv else 0)

#!/usr/bin/env python3
"""Render the daily digest markdown from two auto-state snapshots (old vs new).

Phase 2 of the tracker automation. Pure functions — no I/O, no network, no YAML — so they
are trivially testable offline (`python scripts/digest.py --selftest`). refresh.py loads the
previous snapshot (the committed auto-state.yaml), fetches the new one, and calls render()
to write docs/digest.md. The digest is the DELTA over the tracker state — the thing you read
once at 8am — distinct from the tracker page, which is the current-state snapshot.
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


def render(old, new, names, date_str):
    """Build the digest markdown string. date_str is the UTC date (YYYY-MM-DD)."""
    d = compute_delta(old, new)
    out = ["# Daily digest", "",
           "_As of %s (UTC) · tracking %d upstream items_" % (date_str, len(new)), ""]

    def line(url, extra=""):
        link = "[%s](%s)" % (_ref(url, new.get(url)), url)
        tail = (" — " + extra) if extra else ""
        return "- **%s** — %s%s" % (_label(url, names), link, tail)

    # First run: no previous snapshot to diff against.
    if not old:
        out += ["Initial snapshot — now tracking:", ""]
        for url in sorted(new, key=lambda u: _label(u, names).lower()):
            n = new[url]
            out.append(line(url, "`%s`, last activity %s"
                            % (n.get("state") or "—", (n.get("last_activity") or "")[:10])))
        return "\n".join(out).rstrip() + "\n"

    # Quiet day: surface the most-recently-active item so the page is never blank.
    if not (d["state_changes"] or d["new_items"] or d["activity"] or d["dropped"]):
        out += ["No upstream changes since the last refresh.", ""]
        if new:
            warm = max(new, key=lambda u: new[u].get("last_activity") or "")
            out.append("Most recently active: " + line(warm,
                       "last activity %s" % (new[warm].get("last_activity") or "")[:10]).lstrip("- "))
        return "\n".join(out).rstrip() + "\n"

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

    return "\n".join(out).rstrip() + "\n"


def selftest():
    new = {
        "https://github.com/ACINQ/eclair/pull/2275": {"kind": "pull", "state": "MERGED", "merged": True, "last_activity": "2025-07-21T00:00:00Z"},
        "https://github.com/bitcoinppl/cove": {"kind": "repo", "state": "ACTIVE", "last_activity": "2026-06-15T00:00:00Z", "open_issues": 83},
        "https://github.com/x/y/issues/9": {"kind": "issue", "state": "OPEN", "last_activity": "2026-06-16T00:00:00Z", "comments": 5},
    }
    # first run
    md = render({}, new, {"https://github.com/bitcoinppl/cove": "Cove"}, "2026-06-16")
    assert "Initial snapshot" in md and "Cove" in md, md
    # quiet day
    assert "No upstream changes" in render(new, new, {}, "2026-06-16")
    # state change + activity
    old = dict(new)
    old["https://github.com/ACINQ/eclair/pull/2275"] = {"kind": "pull", "state": "OPEN", "merged": False, "last_activity": "2025-07-20T00:00:00Z"}
    old["https://github.com/x/y/issues/9"] = {"kind": "issue", "state": "OPEN", "last_activity": "2026-06-15T00:00:00Z", "comments": 2}
    md = render(old, new, {}, "2026-06-16")
    assert "## Changed" in md and "merged" in md and "## Activity" in md and "2→5 comments" in md, md
    # dropped
    assert "## No longer tracked" in render({"https://github.com/gone/repo": {"kind": "repo"}}, new, {}, "2026-06-16")
    print("digest selftest passed")
    return 0


if __name__ == "__main__":
    sys.exit(selftest() if "--selftest" in sys.argv else 0)

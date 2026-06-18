#!/usr/bin/env python3
"""Refresh data/auto-state.yaml with the live upstream state of every tracking_issue.

Collector A of the tracker automation. Reads each `tracking_issue` URL in
data/integrations.yaml, batches them into ONE GitHub GraphQL request, and writes the
machine-verifiable state (issue/PR/discussion status, last activity, comment count, or
repo push/open-issue count) to data/auto-state.yaml, keyed by the tracking_issue URL.

It is read-only against upstream and NEVER edits integrations.yaml — the human file and
the machine file stay separate so the daily writer can't churn or leak the canonical data.

Usage:
    GH_TOKEN=<token> python scripts/refresh.py            # full refresh
    GH_TOKEN=<token> python scripts/refresh.py --probe    # fail-fast credential/rate check
    python scripts/refresh.py --selftest                  # offline checks (no token, no pyyaml)
"""
import json
import os
import re
import sys
import urllib.request

import checkins  # scripts/checkins.py — weekly check-in follow-through (Phase 3)
import digest  # scripts/digest.py — pure digest renderer (sits beside this file on sys.path)
import discover  # scripts/discover.py — external candidate discovery (Phase 4)

GRAPHQL_URL = "https://api.github.com/graphql"
INTEGRATIONS = "data/integrations.yaml"
AUTO_STATE = "data/auto-state.yaml"
DIGEST_MD = "docs/digest.md"

# Matches https://github.com/<owner>/<repo>[/(issues|pull|discussions)/<n>]
_URL_RE = re.compile(
    r"https?://github\.com/(?P<owner>[^/\s]+)/(?P<repo>[^/\s]+)"
    r"(?:/(?P<kind>issues|pull|discussions)/(?P<number>\d+))?/?$"
)

_KIND = {"issues": "issue", "pull": "pull", "discussions": "discussion", None: "repo"}

# GraphQL selection per kind (number is substituted for non-repo kinds).
_SELECTION = {
    "issue": "issue(number:%(n)d){ state updatedAt title comments{totalCount} }",
    "pull": "pullRequest(number:%(n)d){ state merged mergedAt updatedAt title comments{totalCount} }",
    "discussion": "discussion(number:%(n)d){ updatedAt title comments{totalCount} }",
    "repo": "pushedAt isArchived issues(states:OPEN){totalCount}",
}

# GraphQL field that holds the node, per kind (repo data sits directly on the repository).
_INNER = {"issue": "issue", "pull": "pullRequest", "discussion": "discussion"}


def parse_tracking_url(url):
    """Parse a tracking_issue URL into (owner, repo, kind, number) or None.

    kind is issue|pull|discussion|repo; number is an int, or None for a bare repo URL.
    """
    if not url:
        return None
    m = _URL_RE.match(url.strip())
    if not m:
        return None
    number = m.group("number")
    return (m.group("owner"), m.group("repo"), _KIND[m.group("kind")],
            int(number) if number else None)


def build_query(items):
    """items: list of (alias, owner, repo, kind, number) -> one GraphQL query string."""
    blocks = []
    for alias, owner, repo, kind, number in items:
        sel = _SELECTION[kind] % {"n": number or 0}
        blocks.append("  %s: repository(owner:%s, name:%s){ %s }"
                      % (alias, json.dumps(owner), json.dumps(repo), sel))
    return "query {\n" + "\n".join(blocks) + "\n}"


def flatten(kind, node):
    """Normalise a GraphQL repository node into a flat, stable auto-state record."""
    if node is None:
        return {"kind": kind, "state": "MISSING"}
    if kind == "repo":
        return {
            "kind": "repo",
            "state": "ARCHIVED" if node.get("isArchived") else "ACTIVE",
            "last_activity": node.get("pushedAt"),
            "open_issues": (node.get("issues") or {}).get("totalCount"),
        }
    inner = node.get(_INNER[kind])
    if inner is None:
        return {"kind": kind, "state": "MISSING"}
    rec = {
        "kind": kind,
        "state": inner.get("state"),               # None for discussions (no state enum)
        "last_activity": inner.get("updatedAt"),
        "comments": (inner.get("comments") or {}).get("totalCount"),
        "title": inner.get("title"),
    }
    if kind == "pull":
        rec["merged"] = inner.get("merged")
        rec["merged_at"] = inner.get("mergedAt")
    return {k: v for k, v in rec.items() if v is not None}


def run_query(query, token):
    """POST a GraphQL query; return the `data` object. Logs (but tolerates) partial errors."""
    body = json.dumps({"query": query}).encode()
    req = urllib.request.Request(GRAPHQL_URL, data=body, headers={
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
        "User-Agent": "payjoin-integrations-tracker-refresh",
    })
    with urllib.request.urlopen(req, timeout=30) as resp:
        payload = json.loads(resp.read().decode())
    if payload.get("errors"):
        # Partial failures (a renamed/deleted repo) come back as data+errors; surface, continue.
        sys.stderr.write("GraphQL errors: %s\n" % json.dumps(payload["errors"])[:1000])
    return payload.get("data") or {}


def selftest():
    cases = {
        "https://github.com/ACINQ/phoenix/issues/161": ("ACINQ", "phoenix", "issue", 161),
        "https://github.com/ACINQ/eclair/pull/2275": ("ACINQ", "eclair", "pull", 2275),
        "https://github.com/fedimint/fedimint/discussions/1764": ("fedimint", "fedimint", "discussion", 1764),
        "https://github.com/bitcoinppl/cove": ("bitcoinppl", "cove", "repo", None),
        "https://github.com/ValeraFinebits/btcpayserver-payjoin-plugin": ("ValeraFinebits", "btcpayserver-payjoin-plugin", "repo", None),
        "not a url": None,
    }
    ok = True
    for url, exp in cases.items():
        got = parse_tracking_url(url)
        if got != exp:
            ok = False
            print("  FAIL %s -> %r (expected %r)" % (url, got, exp))
        else:
            print("  ok   %s -> %r" % (url, got))
    q = build_query([("n0", "ACINQ", "phoenix", "issue", 161),
                     ("n1", "bitcoinppl", "cove", "repo", None)])
    assert "issue(number:161)" in q and "pushedAt" in q, q
    assert flatten("issue", None)["state"] == "MISSING"
    assert flatten("repo", {"isArchived": False, "pushedAt": "x", "issues": {"totalCount": 3}})["open_issues"] == 3
    print("  query/flatten checks passed")
    return 0 if ok else 1


def main(argv):
    if "--selftest" in argv:
        return selftest()

    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if not token:
        sys.exit("error: GH_TOKEN / GITHUB_TOKEN not set")

    if "--probe" in argv:
        data = run_query("query { viewer { login } rateLimit { remaining resetAt } }", token)
        print("probe ok:", json.dumps(data))
        return 0

    import yaml  # deferred so --selftest runs without pyyaml installed
    from datetime import datetime, timezone

    # Previous snapshot (the committed auto-state) = last run's state, for the digest delta.
    old = {}
    if os.path.exists(AUTO_STATE):
        with open(AUTO_STATE) as f:
            old = yaml.safe_load(f) or {}

    with open(INTEGRATIONS) as f:
        integrations = [i for i in (yaml.safe_load(f) or []) if i]

    items, url_by_alias, names = [], {}, {}
    for idx, entry in enumerate(integrations):
        url = entry.get("tracking_issue")
        parsed = parse_tracking_url(url)
        if not parsed:
            continue
        owner, repo, kind, number = parsed
        alias = "n%d" % idx
        items.append((alias, owner, repo, kind, number))
        url_by_alias[alias] = (url, kind)
        names[url] = entry.get("name")

    if not items:
        print("no tracking_issue URLs found; nothing to do")
        return 0

    data = run_query(build_query(items), token)
    state = {}
    for alias, (url, kind) in url_by_alias.items():
        state[url] = flatten(kind, data.get(alias))

    new = {url: state[url] for url in sorted(state)}
    with open(AUTO_STATE, "w") as f:
        f.write("# Auto-generated by scripts/refresh.py — do not edit by hand.\n")
        yaml.safe_dump(new, f, sort_keys=True, default_flow_style=False, allow_unicode=True)
    print("wrote %s (%d tracked items)" % (AUTO_STATE, len(new)))

    # Digest: the day-over-day delta (old vs new) plus weekly check-in follow-through,
    # rendered to a page read once each morning.
    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    checkin_data = checkins.gather(token)  # None on failure -> section omitted, digest still renders
    try:
        candidate_data = discover.update(token, yaml, date_str)  # writes data/candidates.yaml
    except Exception as e:
        sys.stderr.write("discover.update failed: %s\n" % e)
        candidate_data = None
    with open(DIGEST_MD, "w") as f:
        f.write(digest.render(old, new, names, date_str,
                              checkins=checkin_data, candidates=candidate_data))
    print("wrote %s" % DIGEST_MD)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

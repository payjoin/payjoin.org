#!/usr/bin/env python3
"""Phase 4: discover NEW payjoin activity outside the repos we already track.

Runs the `payjoin -org:payjoin` search (issues AND PRs, most-recently-updated) that Dan
flagged from day one, drops anything we already watch or that's our own fork, and records
fresh external issues/PRs in data/candidates.yaml — a REVIEW-ONLY queue, never auto-added
to integrations.yaml. The digest surfaces the recent untriaged ones.

Denylist = tracking_issue repos (auto) + payjoin org repo names / forks (auto) +
data/discovery-denylist.yaml (human). Each candidate carries a status you own
(new | watching | dismissed | promoted); the bot only ever adds 'new' and refreshes
updated_at/title/stars — it never touches your status.

GitHub requires `is:issue`/`is:pr` on issue search (a bare query returns 0), so this runs
two GraphQL searches and merges. Counts against the 5000/hr GraphQL budget, not REST's 30/min.
"""
import json
import re
import sys
import time
import urllib.error
import urllib.request

GRAPHQL = "https://api.github.com/graphql"
INTEGRATIONS = "data/integrations.yaml"
CANDIDATES = "data/candidates.yaml"
DENYLIST = "data/discovery-denylist.yaml"

# Payjoin org repo *names* (any owner) — forks/renames of our own work are noise.
PAYJOIN_REPO_NAMES = {
    "rust-payjoin", "payjoin.org", "payjoindevkit.org", "cja", "cja-2",
    "bitcoin-hpke", "ohttp", "bitcoin_uri", "bitcoin-uri-ffi", "research-docs",
    "multiparty-protocol-docs", "btsim", "tx-indexer", "uniffi-dart",
    "concurrent-psbt", "integrations-tracker",
}

_SEARCH_Q = """
query($q:String!){ search(query:$q, type:ISSUE, first:40){ nodes {
  __typename
  ... on Issue { title url updatedAt repository{nameWithOwner isFork stargazerCount} }
  ... on PullRequest { title url updatedAt repository{nameWithOwner isFork stargazerCount} }
}}}
"""


def _graphql(query, variables, token):
    body = json.dumps({"query": query, "variables": variables}).encode()
    for attempt in range(5):
        req = urllib.request.Request(GRAPHQL, data=body, headers={
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
            "User-Agent": "payjoin-integrations-tracker-discover",
        })
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                payload = json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            if e.code in (403, 429) and attempt < 4:
                time.sleep(2 ** attempt)
                continue
            raise
        if payload.get("errors"):
            raise RuntimeError("GraphQL errors: %s" % json.dumps(payload["errors"])[:500])
        return payload["data"]
    raise RuntimeError("graphql retries exhausted")


def search(token):
    """Merged, recency-sorted external payjoin issues+PRs (two searches; is:issue + is:pr)."""
    seen, out = set(), []
    for typ in ("is:issue", "is:pr"):
        q = "payjoin -org:payjoin %s sort:updated" % typ
        for n in _graphql(_SEARCH_Q, {"q": q}, token)["search"]["nodes"]:
            if not n or n["url"] in seen:
                continue
            seen.add(n["url"])
            repo = n["repository"]
            out.append({
                "url": n["url"],
                "repo": repo["nameWithOwner"],
                "kind": "pr" if n["__typename"] == "PullRequest" else "issue",
                "title": " ".join((n.get("title") or "").split())[:120],
                "stars": repo.get("stargazerCount") or 0,
                "is_fork": bool(repo.get("isFork")),
                "updated_at": n["updatedAt"],
            })
    out.sort(key=lambda c: c["updated_at"], reverse=True)
    return out


def tracked_repos(integrations):
    """owner/repo (lowercased) for every integration that has a tracking_issue."""
    repos = set()
    for entry in integrations:
        m = re.match(r"https?://github\.com/([^/]+/[^/]+)", entry.get("tracking_issue") or "")
        if m:
            repos.add(m.group(1).lower())
    return repos


def load_denylist(path, yaml):
    """Human denylist: 'owner/repo' (exact) or bare 'repo-name' (any owner)."""
    repos, names = set(), set()
    try:
        with open(path) as f:
            for r in ((yaml.safe_load(f) or {}).get("repos") or []):
                (repos if "/" in r else names).add(r.lower())
    except FileNotFoundError:
        pass
    return repos, names


def is_denied(c, tracked, deny_repos, deny_names):
    repo = c["repo"].lower()
    name = repo.split("/")[-1]
    return (c["is_fork"] or repo in tracked or repo in deny_repos
            or name in PAYJOIN_REPO_NAMES or name in deny_names)


def update(token, yaml, today):
    """Search, filter, merge into candidates.yaml; return active 'new' candidates for the digest."""
    with open(INTEGRATIONS) as f:
        integrations = [i for i in (yaml.safe_load(f) or []) if i]
    tracked = tracked_repos(integrations)
    deny_repos, deny_names = load_denylist(DENYLIST, yaml)

    results = [c for c in search(token) if not is_denied(c, tracked, deny_repos, deny_names)]

    try:
        with open(CANDIDATES) as f:
            existing = {c["url"]: c for c in (yaml.safe_load(f) or [])}
    except FileNotFoundError:
        existing = {}

    for c in results:
        prev = existing.get(c["url"])
        if prev:  # refresh facts, keep human-owned status + first_seen
            prev.update({"title": c["title"], "stars": c["stars"], "updated_at": c["updated_at"]})
        else:
            rec = {k: v for k, v in c.items() if k != "is_fork"}
            rec.update({"first_seen": today, "status": "new"})
            existing[c["url"]] = rec

    rows = sorted(existing.values(), key=lambda c: c.get("updated_at") or "", reverse=True)
    with open(CANDIDATES, "w") as f:
        f.write("# Discovered payjoin activity outside tracked repos. Bot appends; you own `status`.\n")
        f.write("# status: new | watching | dismissed | promoted  (bot only adds 'new')\n")
        yaml.safe_dump(rows, f, sort_keys=False, default_flow_style=False, allow_unicode=True)

    return [c for c in rows if c.get("status") == "new"]


def selftest():
    integrations = [{"tracking_issue": "https://github.com/ACINQ/eclair/pull/2275"}, {"name": "x"}]
    assert tracked_repos(integrations) == {"acinq/eclair"}
    tracked = {"acinq/eclair"}
    mk = lambda repo, fork=False: {"repo": repo, "is_fork": fork}
    assert is_denied(mk("ACINQ/eclair"), tracked, set(), set())            # tracked
    assert is_denied(mk("someone/rust-payjoin"), tracked, set(), set())    # payjoin name (fork/rename)
    assert is_denied(mk("x/y", fork=True), tracked, set(), set())          # fork
    assert is_denied(mk("noisy/repo"), tracked, {"noisy/repo"}, set())     # human denylist (repo)
    assert is_denied(mk("any/widget"), tracked, set(), {"widget"})         # human denylist (name)
    assert not is_denied(mk("BlueWallet/BlueWallet"), tracked, set(), set())  # genuine candidate
    print("discover selftest passed")
    return 0


if __name__ == "__main__":
    sys.exit(selftest() if "--selftest" in sys.argv else 0)

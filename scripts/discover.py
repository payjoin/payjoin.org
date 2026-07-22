#!/usr/bin/env python3
"""Discover payjoin activity happening OUTSIDE the repos we already track.

Four GitHub searches, all keyed on the bare keyword `payjoin -org:payjoin`:

  issues   GraphQL search(type:ISSUE) with is:issue     -> kind 'issue'
  prs      GraphQL search(type:ISSUE) with is:pr        -> kind 'pr'
  commits  REST /search/commits sort=author-date        -> kind 'commit'
  repos    REST /search/repositories sort=updated       -> kind 'repo'

Issues/PRs alone miss whole projects: work that lands as direct commits, and new repos
that have no payjoin issue yet, were invisible before commits+repos were added.

Everything merges into data/candidates.yaml — one append-only archive, deduped by URL,
carrying a human-owned `status` (new | watching | dismissed | promoted). The bot only ever
adds 'new' and refreshes title/stars/updated_at; it never overwrites your status. Rows you
have marked watching/promoted are kept forever; the rest age out after RETENTION_DAYS so
the file (and the site build that reads it) stays bounded.

The archive holds everything; the digest is deliberately narrow. A row is surfaced in the
digest when it is first discovered, and again only if it goes quiet for RESURFACE_DAYS and
then picks up fresh activity — an item you looked at yesterday does not come back tomorrow,
but one you last saw a fortnight ago does. `last_surfaced` on each row is what makes that
decision, and it is the reason the same twelve rows no longer repeat night after night.

Denylist = tracking_issue repos (auto) + payjoin org repo names / forks (auto) +
data/discovery-denylist.yaml (human).

Not covered: GitHub wiki search. `type=wikis` exists in the web UI but has no REST/GraphQL
endpoint (`GET /search/wikis` -> 404), so it would need HTML scraping of an authenticated
session. Left out deliberately rather than shipped as a fragile scraper.

Offline checks: python scripts/discover.py --selftest
"""
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

GRAPHQL = "https://api.github.com/graphql"
REST = "https://api.github.com"
INTEGRATIONS = "data/integrations.yaml"
CANDIDATES = "data/candidates.yaml"
DENYLIST = "data/discovery-denylist.yaml"

QUERY = "payjoin -org:payjoin"

# How far back the archive keeps untriaged rows. watching/promoted rows are exempt.
RETENTION_DAYS = 180

# A row already shown in the digest only comes back if it has been quiet this long and
# then moves again. Below this, new activity is visible on the Outside page but not the digest.
RESURFACE_DAYS = 7

# Pages of 100 to pull per REST search. Page 1 is the nightly delta; the extra pages
# backfill history on the first run (and re-heal if a night is missed).
COMMIT_PAGES = 3
REPO_PAGES = 1

# Payjoin org repo *names* (any owner) — forks/renames of our own work are noise.
PAYJOIN_REPO_NAMES = {
    "rust-payjoin", "payjoin.org", "payjoindevkit.org", "cja", "cja-2",
    "bitcoin-hpke", "ohttp", "bitcoin_uri", "bitcoin-uri-ffi", "research-docs",
    "multiparty-protocol-docs", "btsim", "tx-indexer", "uniffi-dart",
    "concurrent-psbt", "integrations-tracker",
}

# Machine-owned fields a re-run may overwrite on an existing row. Everything else on the
# row (status, first_seen, notes you add by hand) belongs to the human and is never touched.
FACT_KEYS = ("title", "stars", "updated_at", "outlet", "repo")

# A merge commit is the same event as the PR row we already have — pure duplicate.
_MERGE_COMMIT_RE = re.compile(r"^Merge (pull request #\d+|branch |remote-tracking )")

_SEARCH_Q = """
query($q:String!){ search(query:$q, type:ISSUE, first:100){ nodes {
  __typename
  ... on Issue { title url updatedAt repository{nameWithOwner isFork stargazerCount} }
  ... on PullRequest { title url updatedAt repository{nameWithOwner isFork stargazerCount} }
}}}
"""


def _request(url, token, data=None, agent="discover"):
    """GET/POST api.github.com with backoff on the secondary-rate-limit responses."""
    for attempt in range(5):
        req = urllib.request.Request(url, data=data, headers={
            "Authorization": "Bearer " + token,
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
            "User-Agent": "payjoin-integrations-tracker-" + agent,
        })
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            if e.code in (403, 429) and attempt < 4:
                time.sleep(2 ** attempt)
                continue
            raise
    raise RuntimeError("retries exhausted: %s" % url)


def _graphql(query, variables, token):
    payload = _request(GRAPHQL, token, json.dumps({"query": query, "variables": variables}).encode())
    if payload.get("errors"):
        raise RuntimeError("GraphQL errors: %s" % json.dumps(payload["errors"])[:500])
    return payload["data"]


def _rest_search(kind, params, token, pages):
    """Paginate a REST search endpoint; yields item dicts. Stops early on a short page."""
    for page in range(1, pages + 1):
        q = dict(params, per_page=100, page=page)
        payload = _request("%s/search/%s?%s" % (REST, kind, urllib.parse.urlencode(q)), token)
        items = payload.get("items") or []
        for item in items:
            yield item
        if len(items) < 100:
            return


def _iso(ts):
    """Normalise a git timestamp ('2026-07-21T12:44:16+03:00') to a sortable UTC 'Z' form.

    Commit search reports author-local offsets; issue/PR search reports Z. Comparing them raw
    would interleave wrongly, so shift by the offset and drop it.
    """
    if not ts:
        return ""
    m = re.match(r"^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2})$", ts)
    if not m:
        return ts
    date, hh, mm, ss, off = m.groups()
    if off == "Z":
        return "%sT%s:%s:%sZ" % (date, hh, mm, ss)
    import datetime
    dt = datetime.datetime(int(date[:4]), int(date[5:7]), int(date[8:10]),
                           int(hh), int(mm), int(ss), tzinfo=datetime.timezone.utc)
    sign = -1 if off[0] == "-" else 1
    dt -= sign * datetime.timedelta(hours=int(off[1:3]), minutes=int(off[4:6]))
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


def _rec(url, repo, kind, title, stars, updated_at, is_fork=False):
    return {"url": url, "repo": repo, "kind": kind,
            "title": " ".join((title or "").split())[:120],
            "stars": stars or 0, "is_fork": bool(is_fork), "updated_at": _iso(updated_at)}


def search_issues_prs(token):
    """External payjoin issues + PRs. Two searches because a bare query returns 0 on GitHub."""
    out = []
    for typ in ("is:issue", "is:pr"):
        for n in _graphql(_SEARCH_Q, {"q": "%s %s sort:updated" % (QUERY, typ)}, token)["search"]["nodes"]:
            if not n:
                continue
            repo = n["repository"]
            out.append(_rec(n["url"], repo["nameWithOwner"],
                            "pr" if n["__typename"] == "PullRequest" else "issue",
                            n.get("title"), repo.get("stargazerCount"), n["updatedAt"],
                            repo.get("isFork")))
    return out


def search_commits(token, pages=COMMIT_PAGES):
    """External commits whose message mentions payjoin, newest-authored first.

    Merge commits are dropped: they restate a PR we already record, which is exactly the
    duplication that made the feed unreadable.
    """
    out = []
    for item in _rest_search("commits", {"q": QUERY, "sort": "author-date", "order": "desc"},
                             token, pages):
        repo = item.get("repository") or {}
        message = (item.get("commit") or {}).get("message") or ""
        subject = message.split("\n")[0]
        if _MERGE_COMMIT_RE.match(subject):
            continue
        out.append(_rec(item.get("html_url"), repo.get("full_name"), "commit", subject,
                        repo.get("stargazers_count"),
                        ((item.get("commit") or {}).get("author") or {}).get("date"),
                        repo.get("fork")))
    return out


def search_repos(token, pages=REPO_PAGES):
    """Repos whose name/description/topics mention payjoin — catches projects with no issues."""
    out = []
    for item in _rest_search("repositories", {"q": "payjoin", "sort": "updated", "order": "desc"},
                             token, pages):
        out.append(_rec(item.get("html_url"), item.get("full_name"), "repo",
                        item.get("description") or item.get("full_name"),
                        item.get("stargazers_count"), item.get("pushed_at"), item.get("fork")))
    return out


def search(token):
    """All four collectors, merged and deduped by URL, most-recent activity first.

    A collector that fails is reported and skipped — one dead endpoint must not cost us the
    other three (and the nightly commit).
    """
    seen, out = set(), []
    for name, fn in (("issues/prs", search_issues_prs), ("commits", search_commits),
                     ("repos", search_repos)):
        try:
            found = fn(token)
        except Exception as e:  # noqa: BLE001 — one bad collector must not sink the run
            sys.stderr.write("discover: %s collector failed: %s\n" % (name, e))
            continue
        for c in found:
            if c["url"] and c["url"] not in seen:
                seen.add(c["url"])
                out.append(c)
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
    repo = (c.get("repo") or "").lower()
    name = repo.split("/")[-1]
    return (c.get("is_fork") or not repo or repo in tracked or repo in deny_repos
            or name in PAYJOIN_REPO_NAMES or name in deny_names)


def _date(day):
    import datetime
    return datetime.date(int(day[:4]), int(day[5:7]), int(day[8:10]))


def cutoff(today, days=RETENTION_DAYS):
    """The oldest updated_at date an untriaged row may keep. today is 'YYYY-MM-DD'."""
    import datetime
    return (_date(today) - datetime.timedelta(days=days)).isoformat()


def _quiet_long_enough(row, today, days=RESURFACE_DAYS):
    """True once `days` have passed since this row was last put in front of a human."""
    last = row.get("last_surfaced")
    if not last:
        return True  # never surfaced (e.g. rows predating this field) — eligible
    return (_date(today) - _date(last)).days >= days


def merge(existing, results, today, retention_days=RETENTION_DAYS):
    """Fold fresh results into the archive; return (rows, surfaced_urls).

    Existing rows keep their human `status` and original `first_seen`; only machine facts
    are refreshed. A row is surfaced when it is new, or when it moved after being quiet for
    RESURFACE_DAYS — so nothing repeats daily, but a stale thread that wakes up is not
    silently buried. Untriaged rows that have gone quiet past the retention window are
    dropped, so the archive can't grow without bound.
    """
    surfaced = []
    for c in results:
        prev = existing.get(c["url"])
        if prev:
            moved = (prev.get("updated_at") or "") != c["updated_at"]
            # Only machine-collected facts are refreshed, and only those the collector
            # actually reports — news rows have no stars, GitHub rows have no outlet.
            prev.update({k: c[k] for k in FACT_KEYS if k in c})
            prev.setdefault("kind", c["kind"])
            if moved and _quiet_long_enough(prev, today):
                prev["last_surfaced"] = today
                prev["resurfaced"] = True
                surfaced.append(c["url"])
        else:
            rec = {k: v for k, v in c.items() if k != "is_fork"}
            rec.update({"first_seen": today, "status": "new", "last_surfaced": today})
            existing[c["url"]] = rec
            surfaced.append(c["url"])

    keep_from = cutoff(today, retention_days)
    rows = []
    for r in existing.values():
        if r["url"] not in surfaced:
            r.pop("resurfaced", None)  # a one-run flag, not durable state
        if (r.get("status") in ("watching", "promoted")
                or (r.get("updated_at") or "")[:10] >= keep_from):
            rows.append(r)
    rows.sort(key=lambda c: c.get("updated_at") or "", reverse=True)
    return rows, surfaced


def update(token, yaml, today):
    """Search, filter, merge into candidates.yaml; return rows first seen today (for the digest)."""
    with open(INTEGRATIONS) as f:
        integrations = [i for i in (yaml.safe_load(f) or []) if i]
    tracked = tracked_repos(integrations)
    deny_repos, deny_names = load_denylist(DENYLIST, yaml)

    results = [c for c in search(token) if not is_denied(c, tracked, deny_repos, deny_names)]

    try:
        with open(CANDIDATES) as f:
            existing = {c["url"]: c for c in (yaml.safe_load(f) or []) if c and c.get("url")}
    except FileNotFoundError:
        existing = {}

    rows, fresh = merge(existing, results, today)
    with open(CANDIDATES, "w") as f:
        f.write("# Payjoin activity outside tracked repos (issues, PRs, commits, new repos).\n")
        f.write("# Bot appends and refreshes facts; you own `status`.\n")
        f.write("# status: new | watching | dismissed | promoted  (bot only adds 'new')\n")
        yaml.safe_dump(rows, f, sort_keys=False, default_flow_style=False, allow_unicode=True)

    by_url = {r["url"]: r for r in rows}
    return [by_url[u] for u in fresh if u in by_url]


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

    # Timestamps from commit search carry author-local offsets; they must sort against Z times.
    assert _iso("2026-07-21T12:44:16+03:00") == "2026-07-21T09:44:16Z"
    assert _iso("2026-07-21T18:48:09.000-05:00") == "2026-07-21T23:48:09Z"
    assert _iso("2026-07-21T12:52:57Z") == "2026-07-21T12:52:57Z"
    assert _iso(None) == ""

    # Merge commits restate a PR row we already hold — they must never reach the archive.
    assert _MERGE_COMMIT_RE.match("Merge pull request #2443 from SatoshiPortal/payjoin-upgrade")
    assert not _MERGE_COMMIT_RE.match("Gate payjoin at the rust layer (#838)")

    # merge(): status/first_seen survive a refresh, facts update, new rows are reported once.
    existing = {"u1": {"url": "u1", "repo": "a/b", "kind": "pr", "title": "old", "stars": 1,
                       "updated_at": "2026-07-01T00:00:00Z", "first_seen": "2026-06-01",
                       "last_surfaced": "2026-07-21", "status": "watching"}}
    results = [_rec("u1", "a/b", "pr", "new title", 9, "2026-07-20T00:00:00Z"),
               _rec("u2", "c/d", "commit", "fix payjoin", 2, "2026-07-20T00:00:00Z")]
    rows, surfaced = merge(existing, results, "2026-07-22")
    # u1 moved, but we showed it yesterday — it waits. u2 is new, so it surfaces.
    assert surfaced == ["u2"], surfaced
    r1 = [r for r in rows if r["url"] == "u1"][0]
    assert r1["status"] == "watching" and r1["first_seen"] == "2026-06-01", r1
    assert r1["title"] == "new title" and r1["stars"] == 9, r1

    # Re-running the identical results the next day surfaces nothing — no daily doubles.
    by_url = {r["url"]: r for r in rows}
    _, surfaced2 = merge(by_url, results, "2026-07-23")
    assert surfaced2 == [], surfaced2

    # ...but a week of quiet followed by real movement brings the item back, flagged.
    moved = [_rec("u2", "c/d", "commit", "fix payjoin again", 2, "2026-07-30T00:00:00Z")]
    rows4, surfaced4 = merge(by_url, moved, "2026-07-30")
    assert surfaced4 == ["u2"], surfaced4
    r2 = [r for r in rows4 if r["url"] == "u2"][0]
    assert r2["resurfaced"] is True and r2["last_surfaced"] == "2026-07-30", r2
    # Movement inside the quiet window still does not resurface it.
    _, surfaced5 = merge({r["url"]: r for r in rows4},
                         [_rec("u2", "c/d", "commit", "again", 2, "2026-08-01T00:00:00Z")],
                         "2026-08-01")
    assert surfaced5 == [], surfaced5
    assert _quiet_long_enough({}, "2026-07-22")  # rows predating last_surfaced are eligible

    # Retention: stale untriaged rows age out, triaged ones are kept regardless.
    aged = {
        "old": {"url": "old", "repo": "a/b", "kind": "commit", "updated_at": "2020-01-01T00:00:00Z",
                "status": "new", "first_seen": "2020-01-01"},
        "kept": {"url": "kept", "repo": "a/b", "kind": "pr", "updated_at": "2020-01-01T00:00:00Z",
                 "status": "watching", "first_seen": "2020-01-01"},
    }
    rows3, _ = merge(aged, [], "2026-07-22")
    assert [r["url"] for r in rows3] == ["kept"], rows3
    assert cutoff("2026-07-22", days=180) == "2026-01-23"
    print("discover selftest passed")
    return 0


if __name__ == "__main__":
    sys.exit(selftest() if "--selftest" in sys.argv else 0)

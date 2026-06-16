#!/usr/bin/env python3
"""Phase 3: weekly check-in follow-through.

Pulls the most recent 'Weekly Check-in' discussions from payjoin/rust-payjoin, reads each
contributor's stated Focus (their commitment), and cross-references what they actually
shipped in the org's public repos since that check-in. Surfaces 'holes' — committed,
nothing shipped.

Deterministic (no LLM): Focus is a tolerant regex extraction with a graceful fallback;
shipped is GitHub GraphQL search (counts against the 5000/hr GraphQL budget, not the
30/min REST search cap). gather() returns None on any failure so the digest degrades
gracefully. Robust commitment extraction + per-commitment outcome matching is the LLM phase.
"""
import json
import re
import sys
import time
import urllib.error
import urllib.request

GRAPHQL = "https://api.github.com/graphql"
CHECKIN_OWNER, CHECKIN_REPO = "payjoin", "rust-payjoin"
BOT = "payjoin-bot"

# Public org repos to credit activity against (mirrors rust-payjoin's standup_lib REPOS).
REPOS = [
    "payjoin/rust-payjoin", "payjoin/payjoin.org", "payjoin/payjoindevkit.org",
    "payjoin/cja", "payjoin/cja-2", "payjoin/bitcoin-hpke", "payjoin/ohttp",
    "payjoin/bitcoin_uri", "payjoin/bitcoin-uri-ffi", "payjoin/research-docs",
    "payjoin/multiparty-protocol-docs", "payjoin/btsim", "payjoin/tx-indexer",
    "Uniffi-Dart/uniffi-dart", "payjoin/concurrent-psbt",
]
REPO_FILTER = " ".join("repo:" + r for r in REPOS)

_MENTION = re.compile(r"@([A-Za-z0-9][A-Za-z0-9-]*)")

_DISCUSSIONS_Q = """
query($owner:String!, $name:String!) {
  repository(owner:$owner, name:$name) {
    discussions(first:8, orderBy:{field:CREATED_AT, direction:DESC}) {
      nodes {
        title url createdAt
        comments(first:40) {
          nodes { author{login} body
            replies(first:15){ nodes { author{login} body } } }
        }
      }
    }
  }
}
"""

_SEARCH_Q = """
query($q:String!){ search(query:$q, type:ISSUE, first:30){ nodes {
  ... on PullRequest { title url }
  ... on Issue { title url } } } }
"""


def _graphql(query, variables, token):
    body = json.dumps({"query": query, "variables": variables}).encode()
    for attempt in range(5):
        req = urllib.request.Request(GRAPHQL, data=body, headers={
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
            "User-Agent": "payjoin-integrations-tracker-checkins",
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


def extract_focus(body):
    """Best-effort text of the '### Focus' section, trimmed to ~200 chars. None if absent."""
    if not body:
        return None
    m = re.search(r"(?im)^#*\s*focus\s*:?\s*$", body) or re.search(r"(?im)\bfocus\b\s*:", body)
    if not m:
        return None
    rest = body[m.end():]
    nxt = re.search(r"(?m)^#{1,6}\s", rest)          # stop at the next header (### Bottleneck)
    chunk = " ".join((rest[: nxt.start()] if nxt else rest).split())
    return chunk[:200] or None


def participants(checkin):
    """Map contributor login -> their own reply body (or None) from a check-in node."""
    out = {}
    for c in checkin["comments"]["nodes"]:
        author = (c.get("author") or {}).get("login")
        if author and author != BOT:
            contributor = author
        else:
            mm = _MENTION.search(c.get("body") or "")
            contributor = mm.group(1) if mm else None
        if not contributor:
            continue
        reply_body = None
        for r in c["replies"]["nodes"]:
            if (r.get("author") or {}).get("login") == contributor:
                reply_body = r.get("body")
                break
        out.setdefault(contributor, reply_body)
    return out


def _shipped(user, since, token):
    prs = _graphql(_SEARCH_Q, {"q": "author:%s type:pr is:merged merged:>%s %s"
                               % (user, since, REPO_FILTER)}, token)["search"]["nodes"]
    iss = _graphql(_SEARCH_Q, {"q": "author:%s type:issue created:>%s %s"
                               % (user, since, REPO_FILTER)}, token)["search"]["nodes"]
    return [n for n in prs if n], [n for n in iss if n]


def gather(token):
    """Follow-through for the most recent judgeable check-in, or None on any failure."""
    try:
        data = _graphql(_DISCUSSIONS_Q, {"owner": CHECKIN_OWNER, "name": CHECKIN_REPO}, token)
        checkins = [d for d in data["repository"]["discussions"]["nodes"]
                    if d["title"].startswith("Weekly Check-in:")]
        if not checkins:
            return None
        # Target the 2nd-newest: the newest is usually <1 week old (too fresh to judge).
        target = checkins[1] if len(checkins) >= 2 else checkins[0]
        since = target["createdAt"][:10]
        rows = []
        for user, reply_body in sorted(participants(target).items(), key=lambda kv: kv[0].lower()):
            focus = extract_focus(reply_body)
            prs, iss = _shipped(user, since, token)
            rows.append({"user": user, "focus": focus, "prs": prs, "issues": iss,
                         "hole": bool(focus) and not prs and not iss})
        return {
            "title": target["title"],
            "url": target["url"],
            "date": target["title"].replace("Weekly Check-in: Week of ", "").strip() or since,
            "rows": rows,
        }
    except Exception as e:  # never let check-in collection break the digest
        sys.stderr.write("checkins.gather failed: %s\n" % e)
        return None


def selftest():
    assert extract_focus("### Shipped\nstuff\n### Focus\nfinish #1035\n### Bottleneck\nx") == "finish #1035"
    assert extract_focus("Focus: ship the relay fix") == "ship the relay fix"
    assert extract_focus("no section here") is None
    fake = {"comments": {"nodes": [
        {"author": {"login": BOT}, "body": "## alice\n@alice\nShipped",
         "replies": {"nodes": [{"author": {"login": "alice"}, "body": "### Focus\ndo X"}]}},
        {"author": {"login": "bob"}, "body": "/check-in",
         "replies": {"nodes": [{"author": {"login": BOT}, "body": "Shipped"}]}},
    ]}}
    p = participants(fake)
    assert p["alice"] and "do X" in p["alice"] and "bob" in p and p["bob"] is None, p
    print("checkins selftest passed")
    return 0


if __name__ == "__main__":
    sys.exit(selftest() if "--selftest" in sys.argv else 0)

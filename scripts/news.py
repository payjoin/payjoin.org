#!/usr/bin/env python3
"""Track payjoin mentions OFF GitHub — press, forums and newsletters.

Collectors (all keyless, all read-only):

  news       Google News RSS search for "payjoin"      -> kind 'article'
  delving    Delving Bitcoin Discourse search.json     -> kind 'forum'
  optech     Bitcoin Optech feed, payjoin items only   -> kind 'newsletter'
  hn         Hacker News (Algolia) search              -> kind 'hn'
  bitcoindev gnusha public-inbox Atom (mailing list)   -> kind 'mailing-list'

Results land in data/news.yaml using the same record shape and the same merge/surfacing
rules as data/candidates.yaml (see scripts/discover.py), so a story is shown once when
found and again only after a quiet spell — press syndication is the worst offender for
repeats and this is where it gets stopped.

Two extra dedupe passes matter here:
  * canonical URL — tracking parameters (utm_*, ?ref=) make one story look like many;
  * normalised headline — the same wire story runs at a dozen outlets under one headline.

Deliberately not collected, with the reason recorded so nobody re-litigates it blind:
  Reddit      — search.json returns an HTML block page to datacenter IPs; needs OAuth.
  Nostr       — NIP-50 relays (relay.nostr.band, search.nos.today, relay.damus.io) are not
                reachable from the collector host; probe failed with timeout / ENETUNREACH.
  X           — no keyless read path since the free API tier closed.
  Bitcoin Talk— board/topic RSS (index.php?action=.xml;type=rss) sits behind Cloudflare's
                "Just a moment…" JS challenge: a datacenter GET gets HTTP 403 + a challenge
                page, not the feed (same wall as Reddit). Would need a browser/session, and
                SMF has no keyword-search feed anyway — only recent-posts-per-board. Left out
                rather than shipped as a collector that 403s silently every night.

Offline checks: python scripts/news.py --selftest
"""
import json
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

NEWS_FILE = "data/news.yaml"

# What counts as a payjoin mention. "payjoin" is the marketing term; the BIP numbers catch
# protocol threads — chiefly Optech and the mailing list — that cite "BIP 77" (async
# payjoin) or "BIP 78" (serverless payjoin) without ever writing the word. The trailing \b
# stops "BIP 778"/"bip77x"; [\s-]? matches "bip77", "bip 77" and "bip-77" alike.
KEYWORD_RE = re.compile(r"payjoin|bip[\s-]?7[78]\b", re.I)

# Press about payjoin runs to a few dozen items a year, so nothing needs ageing out — and
# the handful of canonical write-ups (the Bitcoin Magazine explainers, the Cake Wallet
# launch coverage) are exactly what you want to still find years later. GitHub's retention
# window exists to contain a commit firehose; there is no equivalent pressure here.
RETENTION_DAYS = 3650

GOOGLE_NEWS = "https://news.google.com/rss/search?q=payjoin&hl=en-US&gl=US&ceid=US:en"
DELVING = "https://delvingbitcoin.org/search.json?q=" + urllib.parse.quote("payjoin order:latest")
OPTECH = "https://bitcoinops.org/feed.xml"
HN = ("https://hn.algolia.com/api/v1/search_by_date?query=payjoin&tags=story&hitsPerPage=50")
# gnusha public-inbox mirror of the bitcoindev list; `x=A` returns an Atom search feed.
# Query stays on "payjoin" rather than "payjoin OR bip77 OR bip78": every BIP 77/78 thread
# is *about* payjoin and says so somewhere, and a bare-BIP query pulls in unrelated BIP
# drafts (BIP 340, …) that the client filter would only have to throw back out again.
GNUSHA = "https://gnusha.org/pi/bitcoindev/?q=" + urllib.parse.quote("payjoin") + "&x=A"

_ATOM = "{http://www.w3.org/2005/Atom}"

UA = "payjoin-integrations-tracker-news"

# Query junk that makes one article look like several distinct ones.
_TRACKING_PARAM = re.compile(r"^(utm_|fbclid|gclid|mc_[ce]id|ref|source|at_)")


def _fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", "replace")


def canonical_url(url):
    """Strip tracking parameters and fragments so the same article dedupes to one row."""
    if not url:
        return ""
    parts = urllib.parse.urlsplit(url.strip())
    kept = [(k, v) for k, v in urllib.parse.parse_qsl(parts.query, keep_blank_values=True)
            if not _TRACKING_PARAM.match(k)]
    path = parts.path.rstrip("/") or "/"
    return urllib.parse.urlunsplit((parts.scheme, parts.netloc, path,
                                    urllib.parse.urlencode(kept), ""))


def normalise_title(title):
    """Fold a headline to a comparison key: no outlet suffix, no punctuation, no case.

    Google News appends ' - Outlet' and wire stories reuse one headline verbatim, so this
    is what actually collapses syndication down to a single row.
    """
    t = " ".join((title or "").split())
    t = re.sub(r"\s+[-–—|]\s+[^-–—|]{1,40}$", "", t)  # trailing ' - Outlet'
    return re.sub(r"[^a-z0-9]+", " ", t.lower()).strip()


def _rfc822(value):
    """RFC-822 pubDate -> 'YYYY-MM-DDTHH:MM:SSZ'. Returns '' when unparseable."""
    if not value:
        return ""
    try:
        from email.utils import parsedate_to_datetime
        import datetime
        dt = parsedate_to_datetime(value)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=datetime.timezone.utc)
        return dt.astimezone(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    except Exception:  # noqa: BLE001 — a bad date must not drop the story
        return ""


def _iso8601(value):
    """ISO timestamp (Discourse/Algolia) -> 'YYYY-MM-DDTHH:MM:SSZ'."""
    if not value:
        return ""
    m = re.match(r"^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})", value)
    return "%sT%sZ" % (m.group(1), m.group(2)) if m else ""


def _rec(url, kind, outlet, title, updated_at):
    return {"url": canonical_url(url), "kind": kind, "outlet": outlet,
            "title": " ".join((title or "").split())[:160], "updated_at": updated_at}


def _mentions(*fields):
    """True when any field mentions payjoin or a payjoin BIP number (77/78).

    Load-bearing for Hacker News: Algolia applies typo-tolerant OR matching, so a bare
    `query=payjoin` returns thousands of unrelated stories. Only this explicit check keeps
    that source honest, and it is cheap insurance on the others.
    """
    return any(KEYWORD_RE.search(f or "") for f in fields)


def parse_google_news(xml_text):
    """Google News RSS -> article records. Outlet comes from <source>, else the title tail."""
    out = []
    for item in ET.fromstring(xml_text).iter("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        src = item.find("source")
        outlet = (src.text or "").strip() if src is not None and src.text else ""
        if not outlet and " - " in title:
            outlet = title.rsplit(" - ", 1)[1].strip()
        headline = title.rsplit(" - ", 1)[0].strip() if outlet and title.endswith(outlet) else title
        if not link or not _mentions(title, item.findtext("description")):
            continue
        out.append(_rec(link, "article", outlet or "news", headline,
                        _rfc822(item.findtext("pubDate"))))
    return out


def parse_delving(json_text):
    """Delving Bitcoin Discourse search -> forum records (topic-level, newest post wins)."""
    data = json.loads(json_text)
    topics = {t["id"]: t for t in (data.get("topics") or [])}
    out, seen = [], set()
    for post in (data.get("posts") or []):
        topic = topics.get(post.get("topic_id"))
        if not topic or topic["id"] in seen:
            continue
        seen.add(topic["id"])
        out.append(_rec("https://delvingbitcoin.org/t/%s" % topic["id"], "forum",
                        "Delving Bitcoin", topic.get("title"),
                        _iso8601(post.get("created_at") or topic.get("last_posted_at"))))
    return out


def parse_optech(xml_text):
    """Bitcoin Optech feed -> newsletter records, keeping only payjoin-mentioning issues."""
    out = []
    root = ET.fromstring(xml_text)
    for item in list(root.iter("item")) + list(root.iter("{http://www.w3.org/2005/Atom}entry")):
        title = item.findtext("title") or item.findtext("{http://www.w3.org/2005/Atom}title") or ""
        link = item.findtext("link") or ""
        if not link:
            el = item.find("{http://www.w3.org/2005/Atom}link")
            link = el.get("href") if el is not None else ""
        body = " ".join(t or "" for t in (
            item.findtext("description"),
            item.findtext("{http://purl.org/rss/1.0/modules/content/}encoded"),
            item.findtext("{http://www.w3.org/2005/Atom}summary"),
            item.findtext("{http://www.w3.org/2005/Atom}content")))
        if not link or not _mentions(title, body):
            continue
        stamp = (_rfc822(item.findtext("pubDate"))
                 or _iso8601(item.findtext("{http://www.w3.org/2005/Atom}updated") or ""))
        out.append(_rec(link, "newsletter", "Bitcoin Optech", title, stamp))
    return out


def parse_hn(json_text):
    """Hacker News (Algolia) -> hn records, literal-keyword filtered (see _mentions)."""
    out = []
    for hit in (json.loads(json_text).get("hits") or []):
        title = hit.get("title") or hit.get("story_title") or ""
        url = hit.get("url") or hit.get("story_url") or (
            "https://news.ycombinator.com/item?id=%s" % hit.get("objectID"))
        if not _mentions(title, hit.get("story_text"), hit.get("comment_text"), url):
            continue
        out.append(_rec(url, "hn", "Hacker News", title, _iso8601(hit.get("created_at"))))
    return out


def _clean_subject(title):
    """Strip the list tag and any stack of Re:/Fwd: prefixes so a thread folds to one row."""
    t = " ".join((title or "").split())
    while True:
        n = re.sub(r"^\s*(re|fwd|aw)\s*:\s*", "", t, flags=re.I)
        n = re.sub(r"^\s*\[bitcoindev\]\s*", "", n, flags=re.I)
        if n == t:
            return t.strip()
        t = n


def parse_mailinglist(xml_text):
    """gnusha public-inbox Atom (bitcoindev) -> one mailing-list record per thread.

    A live thread is many 'Re:' messages, each at its own message-id URL; folding by cleaned
    subject keeps a single row pointing at the newest post. Entries carry the full message
    body in <content>, so the keyword filter sees quoted BIP numbers, not just the subject.
    """
    root = ET.fromstring(xml_text)
    by_thread = {}
    for e in root.iter(_ATOM + "entry"):
        title = e.findtext(_ATOM + "title") or ""
        content_el = e.find(_ATOM + "content")
        content = "".join(content_el.itertext()) if content_el is not None else ""
        if not _mentions(title, content):
            continue
        link_el = e.find(_ATOM + "link")
        link = link_el.get("href") if link_el is not None else ""
        if not link:
            continue
        subject = _clean_subject(title)
        updated = _iso8601(e.findtext(_ATOM + "updated") or "")
        key = re.sub(r"[^a-z0-9]+", " ", subject.lower()).strip()
        prev = by_thread.get(key)
        if prev is None or updated > prev[0]:
            by_thread[key] = (updated,
                              _rec(link, "mailing-list", "bitcoindev", subject, updated))
    return [rec for _, rec in by_thread.values()]


SOURCES = (
    ("google-news", GOOGLE_NEWS, parse_google_news),
    ("delving", DELVING, parse_delving),
    ("optech", OPTECH, parse_optech),
    ("hacker-news", HN, parse_hn),
    ("bitcoindev", GNUSHA, parse_mailinglist),
)


def dedupe(records):
    """Collapse one story appearing under several URLs or at several outlets.

    Ordered by URL first, then headline: the earliest-listed record wins, and callers pass
    records newest-first, so the surviving row is the freshest telling of the story.
    """
    by_url, by_title, out = set(), set(), []
    for r in records:
        key = normalise_title(r.get("title"))
        if not r.get("url") or r["url"] in by_url or (key and key in by_title):
            continue
        by_url.add(r["url"])
        if key:
            by_title.add(key)
        out.append(r)
    return out


def collect():
    """Fetch every source; a failing one is reported and skipped, never fatal."""
    out = []
    for name, url, parse in SOURCES:
        try:
            out.extend(parse(_fetch(url)))
        except Exception as e:  # noqa: BLE001 — one dead feed must not sink the run
            sys.stderr.write("news: %s collector failed: %s\n" % (name, e))
    out.sort(key=lambda r: r.get("updated_at") or "", reverse=True)
    return dedupe(out)


def update(yaml, today, discover):
    """Merge collected stories into news.yaml; return the rows to surface in the digest."""
    try:
        with open(NEWS_FILE) as f:
            existing = {r["url"]: r for r in (yaml.safe_load(f) or []) if r and r.get("url")}
    except FileNotFoundError:
        existing = {}

    rows, surfaced = discover.merge(existing, collect(), today, retention_days=RETENTION_DAYS)
    with open(NEWS_FILE, "w") as f:
        f.write("# Payjoin mentions off GitHub (press, forums, newsletters).\n")
        f.write("# Bot appends and refreshes facts; you own `status`.\n")
        f.write("# status: new | watching | dismissed | promoted  (bot only adds 'new')\n")
        yaml.safe_dump(rows, f, sort_keys=False, default_flow_style=False, allow_unicode=True)

    by_url = {r["url"]: r for r in rows}
    return [by_url[u] for u in surfaced if u in by_url]


def selftest():
    # Keyword match: "payjoin" plus the BIP numbers, case-insensitive and space/hyphen
    # tolerant; the trailing \b must not let "BIP 778" or "bip77x" through.
    assert _mentions("A note on PayJoin v2")
    assert _mentions("", "quotes BIP 77 for async") and _mentions("re: BIP-78 proposal")
    assert _mentions("bip77 relay design")
    assert not _mentions("BIP 778 covers something else") and not _mentions("bip340 aggregation")
    assert not _mentions("unrelated coinjoin thread", None)

    # Canonicalisation: tracking junk and trailing slashes must not fork one story into many.
    assert (canonical_url("https://x.com/a/b/?utm_source=news&id=7#top")
            == "https://x.com/a/b?id=7")
    assert canonical_url("https://x.com/a/") == canonical_url("https://x.com/a")
    assert canonical_url(None) == ""

    # Headline folding: outlet suffix and punctuation are noise when comparing stories.
    assert (normalise_title("Is Async Payjoin the HTTPS of Bitcoin? - Bitcoin Magazine")
            == normalise_title("Is Async Payjoin the HTTPS of Bitcoin?"))
    assert normalise_title("A | B News") == normalise_title("A")

    rss = """<?xml version="1.0"?><rss><channel>
      <item><title>Async Payjoin arrives - Bitcoin Magazine</title>
        <link>https://news.google.com/x?utm_source=g</link>
        <pubDate>Tue, 21 Jul 2026 09:30:00 GMT</pubDate>
        <source url="https://bitcoinmagazine.com">Bitcoin Magazine</source></item>
      <item><title>Async Payjoin arrives - Some Aggregator</title>
        <link>https://news.google.com/y</link>
        <pubDate>Tue, 21 Jul 2026 11:00:00 GMT</pubDate></item>
      <item><title>Unrelated altcoin news</title><link>https://news.google.com/z</link>
        <pubDate>Tue, 21 Jul 2026 12:00:00 GMT</pubDate></item>
    </channel></rss>"""
    arts = parse_google_news(rss)
    assert len(arts) == 2, arts                       # the off-topic item is dropped
    assert arts[0]["outlet"] == "Bitcoin Magazine" and arts[0]["title"] == "Async Payjoin arrives"
    assert arts[0]["updated_at"] == "2026-07-21T09:30:00Z", arts[0]
    assert arts[0]["url"] == "https://news.google.com/x"   # utm_ stripped
    assert len(dedupe(arts)) == 1, dedupe(arts)            # syndicated retelling collapses

    delving = json.dumps({
        "posts": [{"topic_id": 2354, "created_at": "2026-04-02T00:38:03.212Z"},
                  {"topic_id": 2354, "created_at": "2026-04-01T00:00:00.000Z"}],
        "topics": [{"id": 2354, "title": "How wallet fingerprints damage Payjoin privacy"}]})
    d = parse_delving(delving)
    assert len(d) == 1 and d[0]["url"] == "https://delvingbitcoin.org/t/2354", d
    assert d[0]["updated_at"] == "2026-04-02T00:38:03Z" and d[0]["kind"] == "forum", d

    optech = """<?xml version="1.0"?><rss><channel>
      <item><title>Newsletter #300</title><link>https://bitcoinops.org/en/newsletters/300/</link>
        <description>This week: payjoin v2 relay rotation.</description>
        <pubDate>Wed, 15 Jul 2026 00:00:00 +0000</pubDate></item>
      <item><title>Newsletter #299</title><link>https://bitcoinops.org/en/newsletters/299/</link>
        <description>Nothing relevant here.</description>
        <pubDate>Wed, 08 Jul 2026 00:00:00 +0000</pubDate></item>
    </channel></rss>"""
    o = parse_optech(optech)
    assert len(o) == 1 and o[0]["title"] == "Newsletter #300", o

    # Algolia returns typo-tolerant noise for this keyword; only literal matches survive.
    hn = json.dumps({"hits": [
        {"objectID": "1", "title": "Payjoin explained", "url": "https://ex.com/pj",
         "created_at": "2026-07-01T10:00:00Z"},
        {"objectID": "2", "title": "Show HN: menu photos", "url": "https://ex.com/menu",
         "created_at": "2026-07-02T10:00:00Z"}]})
    h = parse_hn(hn)
    assert len(h) == 1 and h[0]["title"] == "Payjoin explained", h
    assert h[0]["updated_at"] == "2026-07-01T10:00:00Z", h

    # Mailing list: a thread's Re: replies fold to one row at the newest post; the keyword
    # can live in the body (<content>) rather than the subject; off-topic threads drop.
    ml = """<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">
      <entry><title>Re: [bitcoindev] Re: v2 relay rotation</title>
        <link href="https://gnusha.org/pi/bitcoindev/msg-b/"/>
        <updated>2026-07-09T14:29:56Z</updated>
        <content type="text">More on the payjoin directory design.</content></entry>
      <entry><title>[bitcoindev] v2 relay rotation</title>
        <link href="https://gnusha.org/pi/bitcoindev/msg-a/"/>
        <updated>2026-07-07T00:00:00Z</updated>
        <content type="text">Kicking off a payjoin thread.</content></entry>
      <entry><title>[bitcoindev] BIP 340 aggregation</title>
        <link href="https://gnusha.org/pi/bitcoindev/msg-c/"/>
        <updated>2026-07-08T00:00:00Z</updated>
        <content type="text">Nothing relevant to this tracker.</content></entry>
    </feed>"""
    m = parse_mailinglist(ml)
    assert len(m) == 1, m                                  # two replies fold to one thread
    assert m[0]["title"] == "v2 relay rotation", m         # Re:/[bitcoindev] stripped
    assert m[0]["url"] == "https://gnusha.org/pi/bitcoindev/msg-b", m  # newest post wins (slash canonicalised off)
    assert m[0]["updated_at"] == "2026-07-09T14:29:56Z" and m[0]["kind"] == "mailing-list", m
    assert m[0]["outlet"] == "bitcoindev", m
    # body-only match survives even when the subject never says payjoin
    ml2 = """<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">
      <entry><title>[bitcoindev] a question about receiver flow</title>
        <link href="https://gnusha.org/pi/bitcoindev/q/"/>
        <updated>2026-07-01T00:00:00Z</updated>
        <content type="text">This concerns BIP 78 and its fallback.</content></entry></feed>"""
    assert len(parse_mailinglist(ml2)) == 1, "BIP-number body match must be kept"

    # A record with no headline key still dedupes by URL alone.
    assert len(dedupe([_rec("https://a/1", "article", "o", "", "x"),
                       _rec("https://a/1", "article", "o", "", "x")])) == 1

    # Old press is kept: GitHub's 180-day window would have dropped the canonical explainers.
    import discover
    old_story = {"https://bm/x": {"url": "https://bm/x", "kind": "article", "status": "new",
                                  "title": "Cake Wallet Introduces PayJoin V2",
                                  "updated_at": "2025-05-26T00:00:00Z", "first_seen": "2025-05-26"}}
    kept, _ = discover.merge(old_story, [], "2026-07-22", retention_days=RETENTION_DAYS)
    assert len(kept) == 1, kept
    dropped, _ = discover.merge(old_story, [], "2026-07-22", retention_days=180)
    assert dropped == [], dropped
    print("news selftest passed")
    return 0


if __name__ == "__main__":
    sys.exit(selftest() if "--selftest" in sys.argv else 0)

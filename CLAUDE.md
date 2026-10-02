# Project: Payjoin Integrations Tracker

Track Payjoin integration candidates with canonical YAML data rendered via MkDocs Material on GitHub Pages.

---

## Local Dev Server

```bash
# One-time setup (venv already exists at /tmp/yaml-test after first run)
python3 -m venv /tmp/yaml-test
/tmp/yaml-test/bin/python -m ensurepip --upgrade
/tmp/yaml-test/bin/pip install mkdocs mkdocs-material mkdocs-macros-plugin pyyaml

# Build only
/tmp/yaml-test/bin/mkdocs build

# Serve locally (default port 8000)
/tmp/yaml-test/bin/mkdocs serve
```

If port 8000 is busy, use `-a 127.0.0.1:PORT`. Kill with `lsof -ti:PORT | xargs kill`.

---

## Purpose

This tracker exists to:
1. **Decide sequencing** - Which integrations to prioritize
2. **Observe progress** - Without heroic effort, via observable artifacts
3. **Maintain canonical data** - Reviewable in PRs, renderable to a site

---

## Integration Classification

Every integration fits exactly one **primary class**.

**Principle**: Categorize by the most complicated function, but no more complicated. If it can do Lightning and isn't something more specific (Exchange, Mint, etc.), it's Lightning.

| Class | What it means | Payjoin relevance | Examples |
|-------|--------------|-------------------|----------|
| **On Chain Wallet** | Self-custodial Bitcoin-only wallet | Sender and/or receiver | Sparrow, Wasabi, Bitcoin Core, BDK-CLI, payjoin-cli |
| **Exchange / Custodian** | Custodial exchange, broker, or banking | High-volume send/receive, batching | Bull Bitcoin, Binance, Swan, River, Galoy/Blink/Bria |
| **Lightning** | Anything LN-capable (unless more specific) | Channel opens, consolidation | Zeus, Breez, Alby, Strike, LDK-Node, Blixt |
| **Mint** | Ecash mint | On-chain settlements | Cashu, Fedimint |
| **Payment Processor** | Merchant payment infrastructure | Receiving at scale | BTCPayServer, OpenNode |
| **Swap Service** | Atomic/submarine swaps | Cross-chain/layer settlement | Boltz, Portico |

---

## Protocol Surface Checklist

For each integration, track which Payjoin capabilities are relevant:

### Capabilities
- [ ] **Sending** - Can initiate Payjoin as sender
- [ ] **Receive Consolidation** - Receiver adds inputs to batch/consolidate UTXOs
- [ ] **Cut-through** - Receiver replaces output to forward payment (transaction cut-through)
- [ ] **Channel Open** - Receiver opens Lightning channel with incoming payment
- [ ] **Async Status** - Supports async Payjoin v2 status checking
- [ ] **Fallback** - Graceful fallback to standard transaction
- [ ] **OHTTP Relay Rotation** - Rotates OHTTP relays for privacy

### Native HTTP Client
Does the integration use a native HTTP client (fetch)? `true`, `false`, or `planned`.

### Sync Method
Document how the integration syncs: `full node`, `electrum`, `esplora`, `SPV`, `custodial`, etc.

### Sync Privacy
Track whether normal chain access preserves or undermines the privacy Payjoin
creates. This is an overlay, not a replacement for Payjoin priority.

Use these stages:

| Stage | Meaning |
|-------|---------|
| `unassessed` | Sync/backend shape unknown |
| `leaky_known` | Backend clustering risk is understood |
| `ohttp_candidate` | Requests can plausibly move behind OHTTP |
| `lookup_private` | Non-sync Esplora-style lookups use OHTTP |
| `broadcast_private` | Transaction broadcast uses OHTTP |
| `sync_sharded` | Sync queries are split per request/backend |
| `sync_hardened` | Timing, padding, and backend diversity reduce clustering |
| `client_side_discovery` | Compact-filter/SPV/full-node style discovery target |

Score sync privacy opportunities 1-5 on:

| Factor | Weight | Description |
|--------|--------|-------------|
| **Privacy leakage** | 5x | How badly current sync clusters wallet activity |
| **OHTTP tractability** | 3x | How easy it is to put relevant requests behind OHTTP |
| **Payjoin coupling** | 2x | How much chain access can undo Payjoin privacy |
| **Maintenance** | -1x | Lower is better: backend, retry, UX, support burden |

**Formula**: `5L + 3T + 2C - M`

### Error Handling
Qualitative notes on how failures are handled. Examples:
- "Retry-safe with idempotent requests"
- "Falls back to standard transaction on timeout"
- "No graceful degradation"

---

## Core Questions Per Integration

Answer these for every lead:

### 1. What can they integrate today?
- Custodial or self-custodial?
- Do they have a native HTTP client?

This determines **feasibility** without relying on roadmap promises.

### 2. What's the blocking constraint?
Pick the primary blocker:
- Engineering time
- Product priority
- Legal/compliance
- UX risk
- Missing infra (library / spec / test vectors)

> If they say "time" but have no open issues → not real.

### 3. What's the next observable artifact?
One of:
- PR
- Issue
- Test vector
- Design doc
- Prototype branch

> If you can't name it, it's not progress.

### 4. Who owns it?
- Name or role
- External vs internal to Payjoin project
- Single point of failure?

---

## Priority Scoring

Score each integration 1–5 on:

| Factor | Weight | Description |
|--------|--------|-------------|
| **Leverage** | 6x | How many other integrations benefit / ecosystem impact |
| **Feasibility** | 2x | Can ship in ≤90 days |
| **Maintenance** | -1x | Lower is better (1 = low maintenance) |

**Formula**: `6L + 2F - M`

**Spec Feedback** (qualitative, not in formula):
- `rigorous` - Will stress-test the spec (Core, Strike)
- `real_usage` - Real users surfacing issues (BB Mobile, Cake)
- `already_covered` - Similar to existing integrations
- `unknown` - Uncertain what we'd learn

---

## YAML Schema

Each integration lives in `data/integrations.yaml` or individual files under `integrations/`.

```yaml
name: Cake Wallet
class: on_chain_wallet
status: beta
language: Flutter
custody: self_custodial
native_http_client: planned
capabilities:
  sending: true
  receive_consolidation: true
  cut_through: false
  channel_open: false
  async_status: false
  fallback: false
  ohttp_relay_rotation: false
sync_method: esplora
sync_privacy:
  stage: ohttp_candidate
  current_backend: esplora
  query_shape: per_address_history
  client_ip_protection: tor_optional
  backend_clustering_risk: high
  target_sequence:
    - non_sync_esplora_ohttp
    - broadcast_ohttp
    - per_request_sync_ohttp
    - timing_shape_obfuscation
    - multi_backend_splitting
  scores:
    privacy_leakage: 5
    ohttp_tractability: 4
    payjoin_coupling: 5
    maintenance: 3
  next_artifact:
    type: design_doc
    description: "OHTTP sync privacy migration plan"
blocker: their_engineering_time
owner:
  internal: Spacebear
  external: "Konstantin @ Cake"
scores:
  leverage: 5
  feasibility: 5
  maintenance: 2
spec_feedback: real_usage
notes: "Context and rationale for scores"
next_artifact:
  type: pr
  description: "1.0 update PR"
  url: null
contact:
  name: N0izecore, Sethforprivacy
  last_contact: 2023-02-04
```

---

## Data Storage

- **Source of truth**: YAML in this repository
- **Rendered view**: MkDocs Material site on GitHub Pages
- **Updates**: Via pull requests (reviewable)

---

## Outside activity (keyword sweep)

Tracks everything mentioning **payjoin** outside the `payjoin` org, so ecosystem work
doesn't have to be noticed by hand.

| Collector | Source | Writes | Kinds |
|---|---|---|---|
| `scripts/discover.py` | GitHub GraphQL issue/PR search + REST commit + repo search | `data/candidates.yaml` | `issue` `pr` `commit` `repo` |
| `scripts/news.py` | Google News RSS, Delving Bitcoin, Bitcoin Optech, Hacker News, bitcoindev mailing list (gnusha public-inbox) | `data/news.yaml` | `article` `forum` `newsletter` `hn` `mailing-list` |

Both archives use one row shape and one merge rule (`discover.merge`): dedupe by URL,
refresh machine facts in place, never touch the human-owned `status`
(`new` | `watching` | `dismissed` | `promoted`). Rows marked `dismissed` are hidden from
the site; `watching`/`promoted` are never aged out.

**Three views, different jobs.**

| Page | Question it answers | Written by | When |
|---|---|---|---|
| `docs/digest.md` | What moved since yesterday? | `scripts/refresh.py` | nightly, 00:17 UTC |
| `docs/weekly.md` | What happened since we last met? | `scripts/weekly.py` | Tuesdays, 12:00 UTC |
| `docs/outside.md` | What happened on *that* day? | rendered from the archives at build time | every build |

The digest surfaces a row when first discovered, and again only if it went quiet for
`RESURFACE_DAYS` (7) and then moved. The Outside activity page is the browsable archive —
every row, grouped by the day the activity happened, newest first, with the page TOC acting
as a date jump-list. Look back a week there, not in the digest.

The **weekly digest** is the agenda for the Tuesday check-in call (21:30 UTC+8 = 13:30 UTC);
it renders at 12:00 UTC, ~90 minutes ahead. It leads with tracked integrations because that
is the order the meeting runs in, then summarises the week's outside activity one line per
repo, then the check-in follow-through. Week-over-week state is diffed against
`data/auto-state-weekly.yaml`, a snapshot rolled forward at the end of each weekly run —
diffing the nightly snapshot instead would only ever show a single day of movement. The
snapshot is rolled forward only after a successful render, so a failed run repeats the same
window rather than swallowing a week.

Retention differs by volume: GitHub rows age out after `discover.RETENTION_DAYS` (180)
because commits are a firehose; news keeps `news.RETENTION_DAYS` (10 years) because
payjoin press is a few dozen items a year and the canonical explainers stay useful.

**Forcing a refresh** (substantial news, don't want to wait for the 00:17 UTC cron):

```bash
gh workflow run refresh.yml -R payjoin/integrations-tracker
```

Re-running mid-day is safe — merging is by URL, so it refreshes rather than duplicates.

**Noise control**: add a repo to `data/discovery-denylist.yaml` (`owner/repo` for one repo,
a bare `repo-name` to match any owner), or set a row's `status: dismissed`.

**Not collected**, so nobody re-investigates blind:

| Source | Why not |
|---|---|
| GitHub wikis | `type=wikis` is web-UI only; `GET /search/wikis` returns 404. Would need scraping an authenticated session. |
| Reddit | `search.json` serves an HTML block page to datacenter IPs; needs OAuth credentials. |
| Nostr | NIP-50 relays (`relay.nostr.band`, `search.nos.today`, `relay.damus.io`) were unreachable from the collector host — timeout / ENETUNREACH. |
| X | No keyless read path since the free API tier closed. |
| Bitcoin Talk | Board/topic RSS (`index.php?action=.xml;type=rss`) is behind Cloudflare's "Just a moment…" JS challenge — a datacenter GET returns HTTP 403 + a challenge page, not the feed. SMF also has no keyword-search feed, only recent-posts-per-board. Would need a browser/authenticated session. |

Offline checks for every collector (no token, no network):

```bash
python scripts/discover.py --selftest
python scripts/news.py --selftest
python scripts/digest.py --selftest
python scripts/weekly.py --selftest
python scripts/refresh.py --selftest
python scripts/unlocks.py --selftest
```

---

## Unlock graph

`data/unlocks.yaml` is the dependency graph from today's artifacts to the North Star: one
record per node (a release, a binding, test vectors, a spec change, a corridor, a cohort of
candidates), with `blocked_by` / `blocks` edges, evidence URLs, a hand-set `status` and an
`owner`. It is rendered at `/unlocks/` as a mermaid graph plus tables, and it is the thing
the weekly check-in should be read against: "what moves node X this week" rather than
"are you blocked".

| File | Owned by | Contents |
|---|---|---|
| `data/unlocks.yaml` | humans, via PR | id, title, kind, wave, public, owner, blocked_by, blocks, evidence, status, note |
| `data/unlocks-auto.yaml` | `scripts/refresh.py` nightly | per node: `last_activity` (newest across its evidence URLs), `days_idle`, and the state of each URL (open / merged / closed / draft / active / archived / unstamped) |

Field values: `kind` is `artifact | spec | binding | corridor | cohort | integration`;
`wave` is `0`–`4` (the build order); `status` is `done | active | idle | not-started`.
An edge may be declared on either side (`a.blocks: [b]` or `b.blocked_by: [a]`); the code
takes the union. `owner` is a GitHub handle or empty. Leave it empty rather than guess:
the page lists unowned nodes on purpose.

**`public` is required on every node and is the visibility gate.** The repository is
private and the site is public (next section). `main.py` drops every node that is not
`public: true` before anything template-facing exists, so a private node never reaches a
page, the mermaid source, or `search_index.json`. The rule for setting it: nodes about our
own artifacts (releases, bindings, test vectors, spec PRs, BIP status, mailroom) are public,
as are integrations already listed on the public Integrations page. Any node that names a
company not already public there, and anything that reads as a pitch, is private. When
unsure, private. Private nodes still participate in the private graph, but the public
page's critical path and attention list are computed over public nodes only, so an edge
through a private node is simply not drawn.

**Validation runs at build time.** `main.py` calls `unlocks.validate` and raises on a
dangling id, a cycle, a missing `public`, or a bad `kind` / `wave` / `status`, which fails
`mkdocs build` (and therefore the Cloudflare deploy) instead of publishing a broken graph.
Run the same check by hand before opening a PR:

```bash
nix develop -c python scripts/unlocks.py check
```

**Staleness** comes from the nightly refresh: `refresh.py` passes the auto-state records it
already fetched to `unlocks.update`, fetches only the evidence URLs it did not know (one
extra GraphQL request), and writes `data/unlocks-auto.yaml`, which the workflow commits
alongside `auto-state.yaml`. Evidence URLs that are not GitHub issues, PRs, discussions or
repos (release pages, package registries) are kept and shown but reported `unstamped`.
To rebuild the sidecar from cached state without a token:

```bash
nix develop -c python scripts/unlocks.py stamp --offline
```

**Operating it.** Assigning, finishing and reprioritising are edits to one line of one
record, and `set` makes them without opening the file:

```bash
nix develop -c python scripts/unlocks.py set test-vectors owner=chavic
nix develop -c python scripts/unlocks.py set nuget-stable status=done
nix develop -c python scripts/unlocks.py set go-binding-spike wave=3
```

It rewrites only that record's line, keeps comments and ordering, validates the graph and
reverts if the change broke it. Commit the result. Without a checkout, the same edit runs from
the Actions tab: workflow "Set an unlock node" (`.github/workflows/unlock-set.yml`), which
commits to master as the bot and names the actor in the commit body. The node id is shown in the tooltip on the
page. Settable fields: `owner`, `status`, `wave`, `note`; edges and evidence are edited by
hand.

Waves are the build order, not time boxes. Nothing moves between waves on its own; a wave
is finished when every node in it is `done`, and the column header shows the count. When
priorities change, move the node (`wave=N`). The refresh never changes `status`, but the
attention list says "all evidence landed; mark done?" when every evidence PR of an open node
is merged or closed, which is the cue to set it.

**Adding a node**: append a record to `data/unlocks.yaml` with every field present (copy
a neighbour), point `evidence` at the PR or issue that will move when the work moves, set
`public` deliberately, run `check`, and open a PR.

Tests live in `tests/` and run with `nix develop -c python -m pytest`. They cover the
validator (dangling id, cycle, missing flags), the critical-path computation, offline
stamping, and a private-node leak check that builds the site from a fixture and asserts the
private title is absent from the page and from the search index.

---

## Hosting and visibility

**The repository is private. The site is public.** It is served by Cloudflare Pages at
`integrations-tracker.pages.dev`, rebuilt on every push to `master`. The project lives in the
foundation Cloudflare account (`dan@payjoin.org`, under the `payjoin.org` organization) — it
was moved there from a personal account in July 2026.

Build inputs are declared in `requirements.txt`, so the Cloudflare build command is a fixed
`pip install -r requirements.txt && mkdocs build` with output directory `site` and production
branch `master`. Keep them in the repo: they previously lived only in a dashboard field and
were lost when the project changed accounts. Getting the production branch wrong is the
classic failure here — Cloudflare defaults it to `main`, which builds every push as a preview
and leaves the production URL serving nothing.

That asymmetry is load-bearing. `data/integrations.yaml` holds CRM fields — deal values,
emails, phone numbers, account owners — and the only thing keeping them off the open
internet is the `PRIVATE_FIELDS` tuple in `main.py`, which strips them from the
template-facing copy at build time. **Any new page that renders integration rows must go
through that same filtered data**; reading the YAML directly in a template would publish
the CRM. The outside-activity archives (`candidates.yaml`, `news.yaml`) carry no private
fields and are derived entirely from public sources.

If the site is ever put behind Cloudflare Access, three things matter:

- Grant and board reports (OpenSats Q1, Spiral Q1, the Feb 2026 board update) link
  `/integrations/` publicly as evidence of work. Gating that path breaks those links; gating
  `/digest`, `/weekly` and `/outside` does not.
- **Gate the site root and add Bypass carve-outs** rather than gating those three pages
  individually. MkDocs publishes a site-wide search index at `/search/search_index.json`
  whose entries include the full text of the digest, weekly and outside pages, so gating them
  page-by-page leaves their contents readable in that one file. The carve-outs must include
  `/assets` and `/stylesheets`, or `/integrations/` renders unstyled for anonymous visitors.
- **Every hostname serving the site must be gated**, not just the canonical one. An un-gated
  second hostname — a custom domain added later, or the preview deployments — makes the
  policy bypassable.

**GitHub Pages is not an option** and should not be reattempted: Pages access control
requires GitHub Enterprise Cloud, so a site published from this private repo would be public
with no allowlist. A `deploy.yml` targeting GitHub Pages existed until July 2026 but had
never run — it triggered on `main` while the default branch is `master`, and Pages was
disabled on the repo.

---

## Site Structure

```
.
├── mkdocs.yml
├── docs/
│   ├── index.md          # What this tracker is
│   ├── integrations.md   # Table rendered from YAML
│   └── unlocks.md        # Unlock graph rendered from YAML
├── data/
│   ├── integrations.yaml # Canonical data
│   ├── unlocks.yaml      # Unlock graph (human-owned)
│   └── unlocks-auto.yaml # Unlock graph staleness (bot-owned)
└── .github/
    └── workflows/
        └── deploy.yml    # GitHub Pages deployment
```

---

## Constraints

- Prefer clarity over cleverness
- No JavaScript, no React, no custom tooling
- Everything reviewable in PRs
- Non-technical contributors may edit YAML
- No time estimates in planning

---

## GitHub Pages Setup

After pushing, enable Pages in GitHub UI:
1. Settings → Pages
2. Source: GitHub Actions
3. The deploy workflow handles the rest

---

## Status Pipeline

| Status | Meaning |
|--------|---------|
| `prospect` | We identified them |
| `contacted` | Reached out |
| `engaged` | Mutual interest confirmed |
| `draft` | Technical work started |
| `beta` | Integration in testing |
| `live` | Shipped |
| `stalled` | Blocked, unclear path forward |
| `lost` | Did not proceed |
| `duplicate` | Covered by another integration |

---

## Session State (Resume Here)

**Last updated**: 2026-01-23

### Completed (migrated to new schema)
- [x] Bull Bitcoin Mobile (beta, on_chain_wallet)
- [x] Bull Bitcoin Exchange (draft, exchange_custodian)
- [x] Cake Wallet (beta, on_chain_wallet)
- [x] bitmask-core (beta, on_chain_wallet) - status uncertain, may be closed source
- [x] nolooking LND (beta, lightning)
- [x] payjoin-cli (beta, on_chain_wallet)
- [x] BDK-CLI (beta, on_chain_wallet)
- [x] Boltz (draft, swap_service)
- [x] Foundation Devices (draft, on_chain_wallet)
- [x] Liana / WizardSardine (draft, on_chain_wallet)
- [x] Bria / Galoy (draft, exchange_custodian)
- [x] Cashu Dev Kit (draft, mint)
- [x] LDK-Node (draft, lightning)

### Next up (Negotiation tier)
- [ ] Diamond hands (Koji & Yuya)
- [ ] Strike (Tom Kirkpatrick)
- [ ] Zeus (Evan Kaloudis)
- [ ] Wasabi (Max Hillebrand)
- [ ] Electrum via Plugin
- [ ] Blixt (Hampus)
- [ ] Galoy (separate from Bria)
- [ ] Bitcoin Core (W0xit)

### Remaining tiers
- Qualified (10 entries)
- Contacted (25+ entries)
- Lead (40+ entries)

### Schema changes made this session
1. Renamed `own_networking_stack` → `native_http_client`
2. Dropped `psbt_control` as a tracked field
3. Added capabilities: `async_status`, `fallback`, `ohttp_relay_rotation`
4. Split Bull Bitcoin into Mobile + Exchange
5. Changed "non-custodial" → "self-custodial" terminology

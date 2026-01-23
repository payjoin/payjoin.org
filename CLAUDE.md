# Project: Payjoin Integrations Tracker

Track Payjoin integration candidates with canonical YAML data rendered via MkDocs Material on GitHub Pages.

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

## Site Structure

```
.
├── mkdocs.yml
├── docs/
│   ├── index.md          # What this tracker is
│   └── integrations.md   # Table rendered from YAML
├── data/
│   └── integrations.yaml # Canonical data
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

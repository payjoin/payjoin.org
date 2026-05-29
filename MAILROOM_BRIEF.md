# Payjoin Mailroom Infrastructure Partner Brief

## Purpose
Create a web page (and PDF export) recruiting infrastructure operators to run payjoin-mailroom. This is a sales/recruitment tool for Bitcoin companies, infrastructure operators, and privacy organizations.

## Terminology Rules (STRICT)
- ALWAYS "Async Payjoin", NEVER "Serverless Payjoin"
- "BIP 77" or "Payjoin V2" only when making a spec distinction
- "typical transaction", NEVER "normal payment" or "normal transaction"
- NEVER use emdashes. Use colons, commas, or periods instead.
- The binary is called `payjoin-mailroom` (recently renamed from payjoin-service)

## Branding
- Primary color: #F75390 (payjoin magenta, from payjoin.org)
- Darkened for text on white: #C93265 or #A82855
- Logo: monad.svg from https://payjoin.org/svg/monad.svg (yin-yang style symbol representing sender/receiver duality)
- Monad appears inline with "PAYJOIN FOUNDATION" in the header, nowhere else

## Content Structure

### Header
Monad logo inline with "PAYJOIN FOUNDATION" | Infrastructure Partner Brief

### Title
**Run Payjoin Infrastructure**
Deploy lightweight, zero-custody infrastructure that strengthens Bitcoin privacy for everyone

### What Is Payjoin Mailroom?
`payjoin-mailroom` is a single, lightweight binary that bundles the two server-side roles required by BIP 77 Async Payjoin:

- **Payjoin Directory**: a store-and-forward mailbox that holds small, ephemeral, end-to-end encrypted payloads so a sender and receiver can complete a payjoin asynchronously (they don't need to be online at the same time).
- **OHTTP Relay**: a simple HTTP proxy that separates client IP addresses from the directory, preventing the directory from correlating users with their network identity. No loopbacks between the relay and directory within the same instance.

Together, these two components are the backbone that makes async payjoin work for every wallet implementing BIP 77.

### Why Does This Matter?
Payjoin makes it possible to break Satoshi's original privacy concern: that all inputs to a transaction belong to one person.

With BIP 77, receivers no longer need to run a server. But this convenience depends on directory and relay infrastructure existing. Today, only a small handful of operators run these services. A single point of failure is a single point of censorship.

### Why Does It Matter Who Runs This?
Bitcoin privacy infrastructure works best when it's operated by entities that can sustain it long-term. We don't need a sprawling network of operators. Fewer directories means a larger anonymity set: the more users share a single directory, the harder traffic analysis becomes. But we do need **a few more resilient operators** for redundancy and resistance to censorship.

### Trust Model: YOU SEE NOTHING
All payjoin payloads are end-to-end encrypted with HPKE. The directory cannot read, forge, or correlate transaction contents. The OHTTP relay only sees encrypted blobs and never learns who is paying whom. No loopbacks between relay and directory roles. **You never touch bitcoin. You never see transactions. Zero custody risk.**

The separation also applies to your own wallet. If your organization ships a wallet, do not default it to your own directory when that wallet syncs through your own Electrum, Esplora or mempool backend. The backend already sees the user's IP address. Pointing the same user at your directory hands you their mailbox as well, and the relay in between protects nothing. Default your wallet to another operator's directory and let others default to yours.

V2 (BIP 77) payloads are fully end-to-end encrypted. V1 backwards-compatible requests (BIP 78) are plaintext, meaning the directory can see v1 sender IP addresses and transaction contents. V1 support is transitional and will be removed as wallets upgrade to V2. V1 is off unless an operator enables it.

### What You Need

| Requirement | Details |
|---|---|
| Server | A $5/month VPS is sufficient. Minimal CPU and RAM. |
| Domain + TLS | A domain name with a valid TLS certificate (Let's Encrypt works). |
| Roles | Listed operators run both roles, directory and relay, under one domain. |
| Storage | Very minimal. Only HPKE key material and config are persisted. Payjoin payloads are ephemeral. |
| Deployment | Docker image, Nix flake, or build from source. Inline config supported. |
| Bitcoin Node | **Not required.** Pure relay infrastructure. No chain access needed. |

### FAQ

**Can the operator steal or censor bitcoin?**
No. The service never holds keys, constructs transactions, or accesses a bitcoin node. All payloads are encrypted end-to-end. The worst an operator can do is go offline, in which case wallets automatically fall back to the typical (non-payjoin) transaction included in the BIP 21 URI. No funds are ever at risk.

**What is the service comparable to, architecturally?**
Think of a CDN or encrypted email relay. You forward opaque, encrypted blobs between parties. You cannot inspect, modify, or correlate the contents. Even a fully compromised operator learns nothing useful.

**What about OFAC compliance?**
payjoin-mailroom can screen plaintext V1 requests against a blocked-address list, such as the OFAC list, and can filter requests by IP address regardless of protocol version. BIP 77 sessions are encrypted end to end, so their contents cannot be screened. Operators can enforce their own compliance policies without any changes to the protocol.

**What data does the operator see?**
Aggregate metrics only: raw mailbox counts (roughly two per payjoin session). The operator never sees payload contents, Bitcoin addresses, or sender/receiver identity. OHTTP blinds client IP from the directory, and all payloads are encrypted end-to-end. The exception is V1 backwards-compatible requests, which are plaintext. V1 is transitional and off unless an operator enables it. This is less visibility than even Signal has running their own infrastructure, since Signal registers phone numbers and sees payload sizes. payjoin-mailroom does neither.

**Is there a revenue model?**
Public-good infrastructure, and it is mutual. Your mailroom serves other wallets' users, and your own wallet's users rely on other operators' mailrooms. Running one is a reputation signal that your organization takes Bitcoin privacy seriously.

### CTA
**Get Started**
github.com/payjoin/rust-payjoin/tree/master/payjoin-mailroom
Questions? Reach out at payjoin.org or open a Discussion on GitHub.

## Build Process

The PDF is generated from `mailroom-brief.html`, which is the styled HTML version of this markdown.

```bash
# 1. Edit MAILROOM_BRIEF.md (this file) with content changes
# 2. Apply changes to mailroom-brief.html (the styled HTML source)
# 3. Render with headless Chromium (Letter size and margins come from the @page CSS)
chromium --headless --disable-gpu --no-sandbox --print-to-pdf=static/mailroom-brief.pdf mailroom-brief.html
# 4. Check the page count and that the new text is present before committing
```

The HTML has `@page` CSS that handles print layout, so the browser print dialog with "Background graphics" on produces the same result.

## Design Notes
- The document was originally a 2-page Word doc with professional layout
- The "Trust Model" box has a pink/magenta accent background
- The "What You Need" table has alternating row shading
- The CTA is a full-width magenta box with white text
- Keep it concise, confident, not defensive
- The "Why Does It Matter Who Runs This?" section was deliberately reframed from a "legal risk" FAQ to avoid raising red flags. Don't reintroduce legal/risk framing.
- FinCEN 2019 guidance section 4.5.1(b) explicitly exempts "anonymizing software providers" from money transmitter status. This supports the mailroom's position but is intentionally NOT cited in the document. Don't mention it.

## Footer
payjoin.org · github.com/payjoin/rust-payjoin · BIP 77

## Recommended config

```toml
# Payjoin Mailroom recommended configuration
#
# Configuration can also be set via environment variables with the `PJ_`
# prefix.  Nested values use double underscores as separators, e.g.
# PJ_TELEMETRY__OPERATOR_DOMAIN="your-domain.example.com"

# Address and port to listen on
listener = "[::]:443"

# --- ACME TLS (requires `acme` feature) ---
[acme]
# Domain names for the TLS certificate
domains = ["your-domain.example.com"]
# Contact addresses for the ACME account
contact = ["mailto:contact@example.com"]

# --- Telemetry (requires `telemetry` feature) ---
[telemetry]
# OpenTelemetry Protocol (OTLP) endpoint to export telemetry to
endpoint = "https://otlp-gateway-prod-us-west-0.grafana.net/otlp"
# Authentication token for the OTLP endpoint (available upon request)
auth_token = "<base64 instanceID:token>"
# The domain you are running the payjoin-mailroom from.
# This serves as an identifier for metrics collection.
operator_domain = "your-domain.example.com"

# --- Access-control (requires `access-control` feature) ---
[access_control]
# ISO 3166-1 alpha-2 country codes whose requests should be blocked.
blocked_regions = ["CU", "IR", "KP", "SY"]

# --- V1 backwards compatibility (transitional) ---
# WARNING: V1 requests are NOT encrypted. The directory can see sender IP
# addresses and full transaction contents for V1 requests. V1 support exists
# for backwards compatibility with wallets that haven't upgraded to V2.
# Disable this section for the strongest privacy guarantees.
# (address screening requires `access-control` feature)
[v1]
# URL to periodically fetch an updated blocked-address list from.
blocked_addresses_url = "https://raw.githubusercontent.com/0xB10C/ofac-sanctioned-digital-currency-addresses/refs/heads/lists/sanctioned_addresses_XBT.txt"
```

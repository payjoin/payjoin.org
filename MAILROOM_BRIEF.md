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

Together, these two components are the backbone that makes async payjoin work for *every* wallet implementing BIP 77.

### Why Does This Matter?
Payjoin breaks the most damaging assumption in on-chain surveillance: that all inputs to a transaction belong to one person. By letting sender and receiver co-sign a single transaction, payjoin makes chain analysis dramatically harder, and **unlike mixing, every payjoin looks like a typical transaction.**

BIP 77 removed the last barrier to adoption: receivers no longer need to run servers. But this convenience depends on directory and relay infrastructure existing. Today, only a small handful of operators run these services. A single point of failure is a single point of censorship.

### Why Does It Matter Who Runs This?
Bitcoin privacy infrastructure works best when it's operated by entities that can sustain it long-term. The ideal operators are organizations with the resources, jurisdiction, and institutional will to keep infrastructure online: companies with legal counsel, organizations in privacy-respecting jurisdictions, and entities with a track record of supporting open-source infrastructure.

We don't need a sprawling network of operators. Fewer directories means a larger anonymity set: the more users share a single directory, the harder traffic analysis becomes. But we do need **a few more resilient operators** for redundancy and resistance to censorship.

### Trust Model: YOU SEE NOTHING
All payjoin payloads are end-to-end encrypted with HPKE. The directory cannot read, forge, or correlate transaction contents. The OHTTP relay only sees encrypted blobs and never learns who is paying whom. No loopbacks between relay and directory roles. **You never touch bitcoin. You never see transactions. Zero custody risk.**

### What You Need

| Requirement | Details |
|---|---|
| Server | A $5/month VPS is sufficient. Minimal CPU and RAM. |
| Domain + TLS | A domain name with a valid TLS certificate (Let's Encrypt works). |
| Storage | Very minimal. Only HPKE key material and config are persisted. Payjoin payloads are ephemeral. |
| Deployment | Docker image, Nix flake, or build from source. Inline config supported. |
| Bitcoin Node | **Not required.** Pure relay infrastructure. No chain access needed. |

### FAQ

**Can the operator steal or censor bitcoin?**
No. The service never holds keys, constructs transactions, or accesses a bitcoin node. All payloads are encrypted end-to-end. The worst an operator can do is go offline, in which case wallets automatically fall back to the typical (non-payjoin) transaction included in the BIP 21 URI. No funds are ever at risk.

**What is the service comparable to, architecturally?**
Think of a CDN or encrypted email relay. You forward opaque, encrypted blobs between parties. You cannot inspect, modify, or correlate the contents. Even a fully compromised operator learns nothing useful.

**What about OFAC compliance?**
payjoin-mailroom ships with built-in OFAC address list filtering and configurable IP address filtering. For backwards-compatible plaintext v1 requests, the service can screen Bitcoin addresses directly. BIP 77 encrypted sessions are opaque by design, so address screening is not possible, but IP filtering applies to all requests regardless of protocol version. Operators can enforce their own compliance policies without any changes to the protocol.

**What data does the operator see?**
Aggregate metrics only: raw mailbox counts (roughly two per payjoin session). The operator never sees payload contents, Bitcoin addresses, or sender/receiver identity. OHTTP blinds client IP from the directory, and all payloads are encrypted end-to-end. This is less visibility than even Signal has running their own infrastructure, since Signal registers phone numbers and sees payload sizes. payjoin-mailroom does neither.

**Is there a revenue model?**
Public-good infrastructure. Running a mailroom is a reputation signal that your organization takes Bitcoin privacy seriously. The BIP includes optional DoS-prevention auth tokens for the future, but current load is minimal.

**Who uses this infrastructure today?**
Bull Bitcoin (first mobile wallet with BIP 77 send + receive), Cake Wallet, and the payjoin-cli reference implementation all depend on this infrastructure, with more integrations in progress. The flagship directory is payjo.in, with OHTTP relays run by a few community members.

### CTA
**Get Started**
github.com/payjoin/rust-payjoin/tree/master/payjoin-mailroom
Questions? Reach out at payjoin.org or open a Discussion on GitHub.

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

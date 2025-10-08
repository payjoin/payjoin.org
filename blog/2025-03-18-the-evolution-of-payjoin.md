---
title: "The Evolution of Payjoin: From Two-Party Protocol to Multiparty Framework"
description: "Learn how Payjoin is evolving from a simple two-party protocol into a sophisticated multiparty transaction batching framework"
date: "2025-03-18"
authors:
  - name: Conor Okus
tags: [V3]
---

Payjoin is a transformative protocol that enables wallets to communicate and create collaborative, smarter, and more efficient Bitcoin transactions. It offers payment batching technology that exchanges and payment processors can use to [save on fees](https://payjoin.org/docs/how-payjoin-saves) and protect their own and their users' financial [privacy](https://payjoin.org/docs/why-payjoin/privacy) while [scaling](https://payjoin.org/docs/why-payjoin/scaling) Bitcoin.

BTCPayServer already supports PayJoin and in 2024, the project made significant progress with the implementation of [Async Payjoin in the Bull Bitcoin Mobile Wallet](https://www.bullbitcoin.com/blog/bull-bitcoin-wallet-payjoin) and ongoing development work in [Cake Wallet](https://github.com/cake-tech/cake_wallet/pull/1889).

# The Evolution of Payjoin

## Pay-to-Endpoint (P2EP) & Bustapay (BIP 79): Laying the Groundwork

Early efforts to improve Bitcoin payments explored ways for senders and receivers to batch transactions together. [Pay-to-Endpoint (P2EP)](https://blog.blockstream.com/en-improving-privacy-using-pay-to-endpoint/) introduced the idea of receivers contributing inputs by constructing their transaction over the web, making transfers more efficient and indistinguishable from standard transactions. By allowing both parties to contribute inputs, they could consolidate UTXOs, share the fixed cost of a transaction, and break the [common-input-ownership heuristic](https://en.bitcoin.it/wiki/Common-input-ownership_heuristic) used in blockchain analysis.

Building on this idea, [Bustapay (BIP 79)](https://github.com/bitcoin/bips/blob/master/bip-0079.mediawiki) provided a concrete protocol for merchants to build pay to endpoint batches with their clients. By sharing a payment request URL, merchant receivers could signal their ability to merge inputs with the sender’s. While adoption remained limited, the idea laid the foundation for Payjoin by showing that interactive transaction building could have a practical user experience offering unique benefits.

## Payjoin V1 (BIP 78): The Foundation

Building on Bustapay, [Payjoin V1 (BIP 78)](https://payjoin.org/docs/how-it-works/payjoin-v1-bip-78) refined sender-receiver transaction collaboration into an even more practical and extensible protocol. By standardizing wallet communication over an HTTP protocol, the standard Bitcoin URI request format, and leveraging [Partially Signed Bitcoin Transactions (PSBT)]((https://en.bitcoin.it/wiki/BIP_0174)), BIP 78 made adopting [the Payjoin experience](https://bitcoin.design/guide/case-studies/payjoin/) interoperable across different wallets and hardware devices.

However, Payjoin V1 has limitations. It requires both sender and receiver to be online simultaneously (synchronous communication), and for the receiver to host a server to facilitate coordination. Despite these challenges, real-world implementations of Payjoin in payment processing software demonstrate its viability, laying the groundwork for improved interactive transaction batching.

## Payjoin V2 (BIP 77): Asynchronous Communication

[Payjoin V2 (BIP 77)](https://payjoin.org/docs/how-it-works/payjoin-v2-bip-77) improves upon the limitations of V1 by introducing asynchronous communication, removing the need for both parties to be online at the same time. Instead of direct interaction, a mailbox server temporarily stores pending transactions, allowing the sender to submit a Payjoin request and the receiver to complete it later when they come online. Importantly, Messages between senders and receivers are end to end encrypted, meaning the mailbox server cannot see the details of the transactions it stores, preserving the privacy of each participant.

This version makes Payjoin more practical for everyday use, especially for merchants and services that can’t maintain real-time connections with senders. By enabling transactions to be completed more flexibly, Payjoin V2 expands the scope of transaction batching while preserving privacy.

# Looking to the Future: Payjoin V3

The next evolution in the Payjoin ecosystem aims to move beyond the two-party model to enable true multiparty batched transactions.

## The Limitations of Two-Party Payjoins

Current Payjoin versions face inherent limitations when extended to more complex payment scenarios. For example, when multiple people want to pay the same recipient, or one person wishes to pay multiple recipients in a single transaction, the current protocols cannot handle these scenarios because they're designed around a strict sender-receiver model.

Furthermore, two-party Payjoin faces a significant privacy limitation: because only two peers interact, they still each know each other's inputs and outputs. This means that while Payjoin provides privacy benefits against third-party observers, the participants themselves have complete visibility into each other's transaction details.

Multiparty Payjoin solves this "second-party privacy" issue inherent in the two-party model. By involving multiple participants, they might build transactions where no single party has complete knowledge of all inputs and outputs, thereby preserving privacy not just against blockchain observers but amongst the transaction participants themselves.

## The Multiparty Solution

Payjoin V3 will solve these limitations by introducing a collaborative model where multiple parties can contribute to a single transaction. This creates a flexible network of participants all working together to build more efficient transactions.

Unlike previous versions where transactions followed a rigid request-response pattern, V3 will allow transactions to be built collaboratively with multiple participants adding their inputs and outputs to create truly optimized Bitcoin transactions. This approach effectively enables [Greg Maxwell's transaction cut-through concept](https://bitcointalk.org/index.php?topic=281848.0) originally proposed in 2013, which suggested that Bitcoin transactions could be combined to improve privacy and efficiency on the network.

**It's important to note that the real benefits of this approach will initially be realized within single products** — such as exchanges or self-custodial wallets with large user bases. These efficiency and privacy gains may first emerge in closed ecosystems where a single entity can coordinate multiple users' transactions.

By implementing this collaborative framework, Payjoin V3 brings to life a long-standing idea in the Bitcoin ecosystem that has significant implications for both transaction efficiency and privacy.

# Implementation Roadmap

The development team has outlined a four-phase approach to implementing Payjoin V3:

## Phase 0: Multi-Sender, Single Receiver Payjoin (Current Phase)

In this initial phase, the goal is to validate the core multiparty concept through experimentation and testing. The team has developed a prototype demonstrating a 5-party transaction (4 senders and 1 receiver) and documenting tradeoffs and challenges. A multiparty Payjoin implementation is planned for [experimental release](https://github.com/payjoin/rust-payjoin/pull/434).

## Phase 1: Multi-Sender, Multi-Receiver Payjoin

Expanding on the previous phase, this stage introduces transactions where multiple receivers participate alongside multiple senders. This enhancement increases flexibility for batched transactions and improves UTXO management efficiency.

## Phase 2: Privacy Optimization

The team will implement privacy metrics by creating a formal framework that analyzes transaction privacy, building analysis tools to evaluate different scenarios, optimizing transaction patterns for maximum privacy benefits, and documenting findings to guide implementation decisions.

## Phase 3: Decentralized Market Mechanisms

The final phase focuses on developing a coalition formation protocol that enables unconnected Bitcoin users to contribute to batched transactions. This system will include a decentralized discovery protocol that matches compatible transaction partners while preserving privacy, sustainable economic incentive structures, cryptographic mechanisms that minimize required trust between participants, and optimized scaling strategies to support larger transaction coalitions.

# Looking Ahead

Payjoin is evolving from a simple two-party protocol into a sophisticated multiparty transaction framework that has the potential to transform how Bitcoin transactions are constructed and processed. The roadmap spans from experimental 5-party transactions to a full-fledged decentralized pseudo-mempool where transactions can wait for consolidation opportunities, building toward a more private, efficient, and scalable Bitcoin network.

In future posts, the team will make the case for services such as exchanges and e-cash mints with Lightning Network integration to leverage Payjoin in several scenarios, including:

- Efficient funding of single Lightning channels.
- Optimized batched opening and closing of multiple channels.
- Preserved customer privacy and efficiency when funding single splice-in/out operations.
- Coordinated funding of multiple splice operations across different channels.
- Cluster prevention making it harder to identify mint interactions through channel opens/closes, while also reducing transaction fees through more efficient consolidation.

Additional benefits that will be explored include fee savings through opportunistic UTXO consolidation, reduced costs via transaction [cut-through for batches](https://payjoin.org/docs/how-payjoin-saves#payjoin-payment-batching) and enhanced [Lightning Network efficiency](https://payjoin.org/docs/why-payjoin/lightning) through specialized Payjoin implementations for channel management. These innovations represent not just incremental improvements but foundational changes to how Bitcoin can function without protocol changes at scale while preserving user privacy.

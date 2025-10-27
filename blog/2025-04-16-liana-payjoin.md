---
title: Automatically Refresh Liana Inheritance Timelocks with Payjoin
description: Liana combines Payjoin and time locked inheritance to help you keep your Bitcoin private now and safe for those who'll need it later.
date: 2025-04-16
authors: arminsabouri
tags: [privacy, integrations, cut-through]
---


[Liana](https://wizardsardine.com/liana/) secures bitcoin such that after time passes, if and only if you haven't yet spent your coins, your heirs can spend them. This condition is called a "timelock" contract. To prevent unintentional activation of this inheritance policy, these timelocked coins require periodic refreshing by being spent into a new timelock. Liana's Payjoin integration automates timelock refresh as payments are received, boosting privacy and cutting costs.

<!-- truncate -->

Timelock contracts define some time in the future when funds can be spent by heirs. Before that, only the primary owner can spend the funds. However, there's a catch: most users do not frequently spend their Bitcoin. A [2024 study](https://www.sciencedirect.com/science/article/pii/S0378437124008045) found that the age of unspent coins follows a power-law distribution (see Figure 3 that study). In practice, this means coins are typically either spent soon after receipt or held for long periods. [Data also suggests](https://charts.bitbo.io/hodl-waves/) that most coins remain unspent for months or years. To avoid unintentionally triggering a recovery path, users often resort to reconciliation of their coins to reset timelocks.

<img alt="Liana time locked coins" src="/img/liana-expiring.png" />

But this reconciliation comes at a cost to privacy. These transactions create an identifiable on-chain footprint, making it easier for on-chain surveillance to estimate a user's balance and transaction history. This is primarily due to the [common input ownership heuristic](https://en.bitcoin.it/wiki/Common-input-ownership_heuristic), which assumes all inputs in a transaction belong to the same entity. Combined with unique transaction patterns that act like fingerprints, these heuristics allow on-chain analysts to cluster a user's addresses and glean sensitive information.

## Payjoin as a Privacy-Preserving Refresh

This is where Payjoin shines. When a user receives via Payjoin they get a chance to spend their own coins and tell the sender which outputs to create. In doing so Payjoin spends timelocked coins to refresh their timelocks while adding funds to their wallet.

<img alt="Liana Payjoin" src="/img/liana-batch-payment.svg" />

## Caveats

Note that the common-input heuristic is not defeated when using Payjoin with Liana's default [P2WSH](https://river.com/learn/terms/p/p2wsh/) inputs&mdash;unless both participants share similar wallet policies. Because the spending script is always revealed on-chain, it leaves a distinct fingerprint from other script types. Liana uses P2WSH by default to maintain compatibility with hardware wallets, which currently have limited support for [Taproot miniscript descriptors aka MiniTapscript](https://github.com/bitcoin/bitcoin/pull/27255).

[Taproot inputs](https://thebitcoinmanual.com/articles/pay-to-taproot-p2tr), which use a newer script type, do not suffer from this issue. With Taproot's key-path spending, the recovery script remains hidden unless it is invoked. Taproot makes it possible to conduct Payjoin transactions between users with different wallet policies and still break the common-input heuristic.

## Proof of Concept and Next Steps

During the MIT Bitcoin Hackathon, the Payjoin team developed a working proof of concept for both the Payjoin receiver and sender integrated with Liana. You can view the prototype [here](https://github.com/0xBEEFCAF3/liana/tree/payjoin-hackathon). In just 30 hours, the team successfully implemented the core functionality.

Looking ahead, we're coordinating closely with the Liana engineering team to bring this integration to production. This involves rigorous testing, refining the transaction construction logic, and ensuring compatibility with Liana's policy enforcement mechanisms. Together, we'll work toward a robust, production-ready release that empowers users with a privacy-preserving, fee-efficient way to manage their recovery paths.

This integration brings privacy and practicality to Bitcoin inheritance, showing how simple batching protocols like Payjoin can improve user experience without compromising privacy.

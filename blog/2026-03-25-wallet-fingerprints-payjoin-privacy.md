---
title: "How Wallet Fingerprints Damage Payjoin Privacy"
description: "Wallet software leaves subtle fingerprints in transactions. This post analyzes how those fingerprints can deanonymize Payjoin transactions through real-world examples."
date: "2026-03-25"
authors:
  - arminsabouri
tags:
  - privacy
  - research
---

When a wallet constructs a transaction, it makes dozens of small decisions: input ordering, coin selection, fee estimation, signature encoding. These choices vary systematically across implementations and can be used to identify wallets on-chain. These patterns are called wallet fingerprints.

Some fingerprints are deterministic. For example, Bitcoin Core grinds all ECDSA signatures to a low-r value, so [a single 72-byte signature immediately eliminates Core as the signer](https://b10c.me/blog/006-evolution-of-the-bitcoin-signature-length/#der-encoded-ecdsa-signatures). Others are probabilistic: fee rates follow characteristic distributions per wallet. Bugs become fingerprints too. Each dimension contributes independent evidence, and the evidence compounds. For a [comprehensive study of wallet fingerprints](https://ishaana.com/blog/wallet_fingerprinting/), see prior work by Ishaana Misra.

Fingerprints sharpen clustering, the process of grouping related outputs using behavioral heuristics. For background, see Yuval Kogman's blog post on [the history of wallet clustering](https://spiralbtc.substack.com/p/the-scroll-3-a-brief-history-of-wallet). Recent work in clustering uses wallet fingerprints to bolster existing heuristics such as [change identification](https://link.springer.com/chapter/10.1007/978-3-031-18283-9_19) showing meaningful improvements over naive heuristics. [Kappos et al.](https://www.usenix.org/conference/usenixsecurity22/presentation/kappos) showed that combining wallet fingerprints from adjacent transactions with value analysis improves clustering accuracy, validating the approach on ground truth data. This directly threatens Payjoin's privacy model, which relies on making the sender's and receiver's inputs indistinguishable. Fingerprints that partition the inputs restore the clustering Payjoin was designed to break.

This post applies that lens to real Payjoin transactions.

## Two Levels of Linkage

Payjoin transactions should appear indistinguishable from standard single-party transactions. Analysts applying conventional heuristics would misclassify the transaction, wrongly clustering the sender's and receiver's inputs together. So a Payjoin-aware analyst's first step is detecting artifacts of collaborative transactions.

[Simin Ghesmati et al.](https://eprint.iacr.org/2022/589.pdf) show how oddities in coin selection, specifically unnecessary inputs, can be used not only to detect Payjoin transactions but also to partition inputs and outputs by owner. Wallet fingerprints offer another signal for the same task.

If sender and receiver use different wallet software, their fingerprints may reveal which inputs and outputs belong to whom. Once you've inferred the ownership partition, standard Common Input Ownership Heuristic (CIOH) clustering applies within each owner's inputs. The Payjoin becomes analytically equivalent to a pair of regular transactions.

Wallet fingerprint signals operate at two levels:

- **Intra-transaction** signals help partition inputs and outputs by owner within a single transaction. Which outputs are change (returned to sender) and which are transfers (sent to receiver)? Correct change identification is critical because it connects the sender's current transaction to their next one. Fingerprints may reveal this directly: change outputs may inherit distinctive traits from the sender's software.
- **Inter-transaction** signals operate across the transaction graph:
  - **Backward:** Each input was created by some prior transaction that may carry its own fingerprint.
  - **Forward:** Each output may eventually be spent in a future transaction, revealing fingerprints.

The goal of chain analysis against a Payjoin is therefore:

1. Detect artifacts of collaboration.
2. Recover the sender/receiver partition using intra- and inter-transaction signals.
3. Apply standard heuristics within each partition.

## Example 1: Samourai Payjoin

**Transaction:** [`8dba6657...`](https://mempool.space/testnet/tx/8dba6657ab9bb44824b3317c8cc3f333c2f465d3668c678691a091cdd6e5984c)

Inspecting the transaction at the field level reveals nothing immediately suspicious. Both inputs share the same nSequence, the same P2WPKH scriptpubkey type, and superficially similar witness stacks. The signal emerges from the signature bytes directly.

Input 0's DER-encoded signature is **71 bytes**. The r-value is 32 bytes with no leading zero pad, meaning r < 2^255. This is a grinded, low-R signature. Input 1's signature is **72 bytes** (the r-value requires a leading `0x00` pad, meaning r ≥ 2^255). This is an ungrinded, high-R signature. A single wallet running a consistent signing policy would either grind all signatures or grind none. Observing one of each is a strong signal that two different signing implementations contributed inputs.

This signature asymmetry partitions the inputs: Party A owns the low-R input, Party B owns the high-R input. With input values of 50,000 and 3,999,216 sats, we can test both output assignments and see which one is more likely:

**Assignment 1:** Output 0 (9,752 sat) = Party A's output, Output 1 (4,039,216 sat) = Party B's output

- Party A: 50,000 in → 9,752 out, net outflow = 40,248
- Party B: 3,999,216 in → 4,039,216 out, net inflow = 40,000
- A pays B ≈ **40,000 sat** (+ 248 fee)

**Assignment 2:** Output 0 (9,752 sat) = Party B's output, Output 1 (4,039,216 sat) = Party A's output

- Party A: 50,000 in → 4,039,216 out, net inflow = ~4M
- Party B: 3,999,216 in → 9,752 out, net outflow = 3,989,464

Assignment 1 implies a payment of exactly 40,000 sat while Assignment 2 implies 3,989,216 sat. The [round-number heuristic](https://en.bitcoin.it/wiki/Privacy#Round_numbers) favors Assignment 1. The spending transactions reinforce it: [output 0](https://mempool.space/testnet/tx/167e8012a8789d9e4e84f63f4b6566bf53238b5f04e63f8e1f3321f71a7d4fba#vin=1) is spent with a low-r signature (matching Party A's input), [output 1](https://mempool.space/testnet/tx/4e123785c6aecd9f321d2c7a63bd58083fee49ab3c39be84330edb45a98a8a3f#vin=1) with a high-r signature (matching Party B's input).

The Payjoin is decomposed: an input/output ownership partition is inferred and the payment amount recovered.

## Example 2: PDK Demo Payjoin

**Transaction:** [`3c5436f1...`](https://mutinynet.com/tx/3c5436f1edf7d4c32a5ccf2448c1e963f52bb8a0fb6f8688d7e78a14e1cbe80b)

Both inputs are P2TR key path spends. Under [Taproot spending rules applying to P2TR](https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki), the default sighash is SIGHASH_ALL and the sighash byte may be omitted. Omitting it is the canonical form. Both options are consensus-valid. Input 0's witness is **64 bytes**. The sighash byte is omitted. Input 1's witness is **65 bytes**. An explicit `0x01` SIGHASH_ALL byte is appended. Including an explicit SIGHASH_ALL byte is typically a bug rather than an intentional policy.

Two inputs from the same wallet would apply a consistent sighash policy. The inconsistency partitions the inputs: Party A owns the input with the omitted sighash byte, Party B owns the input with the explicit sighash byte.

Unlike Example 1, the value assignment does not uniquely resolve the output partition. Both assignments are arithmetically consistent:

**Assignment 1:** Output 0 (59,014 sat) = Party A's output, Output 1 (864,506 sat) = Party B's output

- Party A: 51,514 in → 59,014 out, net inflow = 7,500
- Party B: 872,224 in → 864,506 out, net outflow = 7,718
- B pays A ≈ **7,500 sat** (+ 218 fee)

**Assignment 2:** Output 0 (59,014 sat) = Party B's output, Output 1 (864,506 sat) = Party A's output

- Party A: 51,514 in → 864,506 out, net inflow = 812,992
- Party B: 872,224 in → 59,014 out, net outflow = 813,210
- B pays A ≈ **812,992 sat** (+ 218 fee)

The round-number prior favors assignment 1, but it is not decisive. We can say with high confidence that the multi-party construction is detectable due to the wallet fingerprint signals; however, the ownership partition is not uniquely determined. The sighash inconsistency is a residual leak, but genuine ambiguity remains.

However, inspecting the [spending transaction](https://mutinynet.com/tx/828d97d3a2532121fbd8942d97e6225eb0529b5ba1c547f006b0e9c4541f4543#vin=1) of the second output reveals the explicit SIGHASH_ALL byte again, matching the second input. This strongly suggests the second output belongs to the same wallet as the second input, making Assignment 1 more likely.

## Example 3: Cake Wallet → Bull Bitcoin Mobile Payjoin

**Transaction:** [`8fb80573...`](https://mempool.space/tx/8fb80573d8871efee060a34dcb97fd12d5229444b7262b26358cd84912a04a75)

The first thing that sticks out is that both inputs carry nSequence = `0x01`. Cake Wallet sets a relative timelock via BIP-68 and Bull Bitcoin Mobile matches the nSequence value, so no intra-transaction asymmetry exists between the two inputs. The signing is also homogeneous: both inputs produce low-r signatures with the same SIGHASH flag. At the transaction level, the fingerprint analysis stalls.

The value assignment, however, does provide for a likely partitioning. Two possible assignments follow:

**Assignment 1:** Output 0 (29,358 sat) = Party B's output, Output 1 (429,919 sat) = Party A's output

- Party A: 440,337 in → 429,919 out, net outflow = 10,418
- Party B: 19,358 in → 29,358 out, net inflow = 10,000
- A pays B ≈ **10,000 sat** (+ 418 fee)

**Assignment 2:** Output 0 (29,358 sat) = Party A's output, Output 1 (429,919 sat) = Party B's output

- Party A: 440,337 in → 29,358 out, net outflow = 410,979
- Party B: 19,358 in → 429,919 out, net inflow = 410,561
- A pays B ≈ **410,561 sat** (+ 418 fee)

The round-number hypothesis overwhelmingly favors Assignment 1. Furthermore, the receiver's input (19,358 sat) is smaller than the sender's change (429,919 sat), consistent with UIH2: the sender had no UTXO small enough to contribute without creating large change, while the receiver's UTXO perfectly covers the payment increment. A likely partition is: output 0 (29,358) is the payment, input 1 (19,358) is the receiver's UTXO, and output 1 (429,919) is the sender's change.

The inter-transaction analysis then supports the input partitioning analysis. The prior transaction for [input 0](https://mempool.space/tx/9ecd77ab2115f12fd6d5ff46271f0a5e04ed03b267d6431f7b0991e0f0e23ef9#vout=1) has one input carrying nSequence = `0x01` and the other carrying `0xfffffffd`. This asymmetry partitions that transaction's inputs and identifies the 440,337 sat output as belonging to the party using nSequence = `0x01`, which flows directly into the Payjoin as input 0.

The prior transaction for [input 1](https://mempool.space/tx/3fbe17132477ae6e38709b5e8e12ff5054fc66b4dd03568fea92a7a5bac18a84#vout=1) uses only `0xfffffffd` across all inputs. Additionally, the transaction [spending output 1](https://mempool.space/tx/9232d5665f2e500f4a2c76e791e1d877b3ae19ec7d12e9d0e9c72f46f55ea758#vin=0) also sets nsequence to `0xfffffffd`.  This is consistent with Bull Bitcoin Mobile's standard behavior, providing strong evidence that output 1 and input 1 belong to the same wallet.

```
┌──────────────────────────┐
│ PRIOR TX (9ecd77...)     │
│                          │
│ in_0 [seq=1]             │
│ in_1 [seq=MAX-2]         │
│ ──────────────────────── │
│ out_0: 204,326           │
│ out_1: 440,337 ──────────────────┐
└──────────────────────────┘       │
                                   │   ┌──────────────────────────┐
                                   │   │ PAYJOIN TX (8fb805...)   │
                                   │   │ ──────────────────────── │
                                   └──►│ in_0 [seq=1]             │
                                   ┌──►│ in_1 [seq=1]             │
┌──────────────────────────┐       │   │ ──────────────────────── │
│ PRIOR TX (3fbe17...)     │       │   │ out_0:  29,358           │
│                          │       │   │ out_1: 429,919 ──────────────────┐
│ in_0 [seq=MAX-2]         │       │   └──────────────────────────┘       │
│ in_1 [seq=MAX-2]         │       │                                      │
│ ──────────────────────── │       │                                      │
│ out_0: 430,856           │       │   ┌──────────────────────────┐       │
│ out_1:  19,358 ──────────────────┘   │ SUBSEQUENT TX (9232d5...)│       │
└──────────────────────────┘           │ ──────────────────────── │       │
                                       │ in_0 [seq=MAX-2] ◄───────────────┘
                                       │ ...                      │
                                       └──────────────────────────┘
```

Both fingerprints persist across the transaction graph. Cake's `0x01` traces back to the prior transaction, Bull Bitcoin's `0xfffffffd` traces both backward and forward. What appeared ambiguous from the Payjoin alone becomes much clearer once adjacent transactions are inspected.

## Conclusions

These observations teach us that Payjoin's privacy preservation extends only as far as the homogeneity of the participating wallets's fingerprints. Fingerprint homogeneity at the transaction level is necessary but not sufficient. Any dimension on which the sender and receiver diverge becomes a partition signal. The analyst's job reduces to finding those divergences in wallet behaviors, and the transaction graph provides arbitrarily many observations to find them in.

While some of these wallet fingerprints are relatively [trivial to eliminate](https://github.com/cake-tech/cake_wallet/pull/3077), others are intrinsic to a particular wallet's design choices and goals and can't just be "fixed". Wallet developers should be aware of these potential privacy leaks when integrating Payjoin into their wallets.

The analysis in this post focuses on individual Payjoin transactions, but the approach generalizes. Wallet fingerprint distributions can serve as features for clusters. A cluster with consistent fingerprints is more credible than one with incompatible wallet traits. This points toward a broader class of attacks on Payjoin privacy. Future work would entail an automated, large-scale analysis that scores cluster plausibility using fingerprint distributions. We're currently building tooling for this as part of our [privacy metrics framework](https://github.com/payjoin/tx-indexer).

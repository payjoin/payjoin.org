---
title: "How Wallet Fingerprints Damage PayJoin Privacy"
description: "Wallet software leaves subtle fingerprints in transactions. This post analyzes how those fingerprints can deanonymize PayJoin transactions through real-world examples."
date: "2026-03-17"
authors:
  - arminsabouri
tags:
  - privacy
  - research
---

Every wallet is a piece of software with habits, and habits leave fingerprints. When a wallet constructs a transaction it makes dozens of small decisions: input ordering, locktime value, coin selection strategy, fee rate, signature encoding. These choices vary systematically across implementations (Bitcoin Core behaves differently from Trezor, which behaves differently from Ledger).

Some signals are deterministic: Bitcoin Core grinds all ECDSA signatures to a short r-value (low-R), so [a single 72-byte signature immediately eliminates Core as the signer](https://b10c.me/blog/006-evolution-of-the-bitcoin-signature-length/#der-encoded-ecdsa-signatures). Others are probabilistic: fee rates follow characteristic distributions per wallet. Some wallets have unintentional bugs that can also manifest as fingerprints. Each observable dimension contributes an independent piece of evidence that accumulates multiplicatively.

Once a fingerprint is identified, it can be used to [trivially guess the originating wallet](https://ishaana.com/blog/wallet_fingerprinting/) of a given transaction, and ultimately lead to learning private information about the participants in that transaction. This has significant implications for collaborative transaction protocols such as PayJoin.

## Two Levels of Linkage

**Intra-transaction** signals operate within a single transaction. The goal is to partition inputs and outputs by owner: which outputs in this transaction are change (returned to sender) and which are payments (sent to receiver)? Correct change identification is critical because it connects the sender's current transaction to their next one.

**Inter-transaction** signals operate across the transaction graph:
- **Backward:** Each input was created by some prior transaction that may carry a wallet fingerprint
- **Forward:** Each output will eventually be spent in some future transaction that may also carry a fingerprint

A PayJoin transaction with no intra-transaction fingerprints is a hidden node in a chain. Privacy is preserved at that node. Ideally it leads to false positives as an analyst would apply standard heuristics to the transaction.

But if sender and receiver use different wallet software, the fingerprints on either side of the PayJoin may tell you which inputs and outputs belong to whom.

Once you've inferred the ownership partition, standard Common Input Ownership Heuristic (CIOH) clustering applies within each owner's inputs. In other words, the PayJoin collapses back into a pair of regular transactions.

The goal of chain analysis against a PayJoin is therefore:
1. Detect the collaborative transaction.
2. Recover the sender/receiver input and output partition, using both intra- and inter-transaction signals.
3. Apply standard heuristics within each partition.

## Example 1: Ashigaru PayJoin

**Transaction:** [`8dba6657...`](https://mempool.space/fr/testnet/tx/8dba6657ab9bb44824b3317c8cc3f333c2f465d3668c678691a091cdd6e5984c)

Inspecting the transaction at the field level reveals nothing immediately suspicious. Both inputs share the same nSequence, the same P2WPKH scriptpubkey type, and superficially similar witness stacks. The signal emerges from the signature bytes directly.

Input 0's DER-encoded signature is **71 bytes**. The r-value is 32 bytes with no leading zero pad, meaning r < 2^255. This is a grinded, low-R signature. Input 1's signature is **72 bytes** (the r-value requires a leading `0x00` pad, meaning r ≥ 2^255). This is an ungrinded, high-R signature. A single wallet running a consistent signing policy would either grind all signatures or grind none. Observing one of each is a near-certain signal that two different signing implementations contributed inputs.

This signature asymmetry partitions the inputs: party A owns the low-R input, party B owns the high-R input. With input UTXO values of 50,000 and 3,999,216 sats, value conservation tests both output assignments:

**Assignment 1:** Output 0 (9,752 sat) = A's change, Output 1 (4,039,216 sat) = B's output

- Party A: 50,000 in → 9,752 out, net outflow = 40,248
- Party B: 3,999,216 in → 4,039,216 out, net inflow = 40,000
- Fee = 248 sat. Payment ≈ **40,000 sat**.

**Assignment 2:** Output 1 (4,039,216 sat) = A's change

- Party A: 50,000 in → 4,039,216 out (net inflow of ~4M sat). Less likely.

Assignment 1 is the unique valid solution. The payment amount of 40,000 sat retroactively confirms the assignment via the round-number heuristic. The PayJoin is fully decomposed: both input owners identified, both output owners identified, payment amount recovered.

## Example 2: PDK Demo PayJoin

**Transaction:** [`3c5436f1...`](https://mutinynet.com/tx/3c5436f1edf7d4c32a5ccf2448c1e963f52bb8a0fb6f8688d7e78a14e1cbe80b)

Both inputs are P2TR key-path spends. Under BIP-341, the default sighash is SIGHASH_ALL and the sighash byte may be omitted from the witness. Omitting it is the canonical form. Both options are consensus-valid. Input 0's witness is **64 bytes**. The sighash byte is omitted. Input 1's witness is **65 bytes**. An explicit `0x01` SIGHASH_ALL byte is appended. Including an explicit SIGHASH_ALL byte is typically a bug rather than an intentional policy.

Two inputs from the same wallet would apply a consistent sighash policy. The inconsistency partitions the inputs.

Unlike Example 1, value conservation does not uniquely resolve the output partition. Both assignments are arithmetically consistent:

- **Assignment 1:** Payment ≈ 7,500 sat (somewhat round), receiver output = 59,014 sat = receiver input (51,514) + payment. Canonical PayJoin geometry.
- **Assignment 2:** Payment ≈ 812,992 sat (not round), receiver output = 864,506 sat.

The round-number prior and the receiver-contributes-smaller-input convention both favor Assignment 1, but neither is decisive. The multi-party construction is detectable; the ownership partition is not uniquely determined. The sighash inconsistency is a residual leak, but genuine arithmetic ambiguity remains.

## Example 3: Cake Wallet → Bull Bitcoin Mobile PayJoin

**Transaction:** [`8fb80573...`](https://mempool.bullbitcoin.com/tx/8fb80573d8871efee060a34dcb97fd12d5229444b7262b26358cd84912a04a75)

This is where things get interesting.

Both inputs carry nSequence = `0x01`. Cake Wallet sets a relative timelock via BIP-68 and Bull Bitcoin Mobile matches the nSequence value, so no intra-transaction asymmetry exists between the two inputs. The signing is also homogeneous: both inputs produce low-R ECDSA signatures with the same SIGHASH flag. At the transaction level, the fingerprint analysis stalls.

Value conservation, however, is decisive. Output 0 is 29,358 sat; output 1 is 429,919 sat. Input 1 is 19,358 sat. Assignment 1 gives a payment of exactly **10,000 sat** (a perfectly round number), with output 0 being that payment and input 1 being the receiver's contributing UTXO. Assignment 2 yields a payment of 410,561 sat, which is not round. The round-number hypothesis here is overwhelming. Furthermore, the receiver's input (19,358 sat) is smaller than the sender's change (429,919 sat), consistent with UIH2: the sender had no UTXO small enough to contribute without producing large change, while the receiver's UTXO cleanly covers the payment increment. The partition is clear: output 0 (29,358) is the payment, input 1 (19,358) is the receiver's UTXO, output 1 (429,919) is the sender's change.

The inter-transaction layer then re-affirms the input partitioning analysis. The prior transaction for **input 0** ([`9ecd77ab...`](https://mempool.bullbitcoin.com/tx/9ecd77ab2115f12fd6d5ff46271f0a5e04ed03b267d6431f7b0991e0f0e23ef9#vout=1)) has one input carrying nSequence = `0x01` and the other carrying `nSequence::MAX`. This asymmetry partitions that transaction's inputs and, by value conservation, identifies the 440,337 sat output as belonging to the party using nSequence = `0x01`, which flows directly into the PayJoin as input 0.

The prior transaction for **input 1** ([`3fbe1713...`](https://mempool.bullbitcoin.com/tx/3fbe17132477ae6e38709b5e8e12ff5054fc66b4dd03568fea92a7a5bac18a84#vout=1)) uses only `nSequence::MAX` across all inputs. This is consistent with Bull Bitcoin Mobile's standard behavior, confirming this UTXO belongs to the receiver.

```
┌──────────────────────────┐
│ PRIOR TX (9ecd77...)     │
│                          │
│ in_0 [seq=1]             │
│ in_1 [seq=∞]             │
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
│                          │       │   │ out_1: 429,919           │
│ in_0 [seq=∞]             │       │   └──────────────────────────┘
│ in_1 [seq=∞]             │       │
│ ──────────────────────── │       │
│ out_0: 430,856           │       │
│ out_1:  19,358 ──────────────────┘
└──────────────────────────┘
```

The nSequence = `0x01` fingerprint is persistent across both transactions, carried by the same wallet through the spending chain. The backward channel propagates the party identity from the prior transaction into the PayJoin, collapsing the ownership partition. What appeared ambiguous from the PayJoin alone becomes fully determined once the input provenance is traced one hop back.

## Conclusions

These observations teach us that PayJoin's privacy preservation extends only as far as the uniformity of the participating wallets. Fingerprint uniformity at the transaction level is necessary but not sufficient. Any dimension on which the sender and receiver diverge becomes a partition signal. The analyst's job reduces to finding those divergences in wallet behaviors, and the transaction graph provides arbitrarily many observations to find them in.

While some of these wallet fingerprints are relatively [trivial to eliminate](https://github.com/cake-tech/cake_wallet/pull/3077), others are intrinsic to a particular wallet's design choices and goals and can't just be "fixed".

Future work would entail modeling this entire process, systematizing the monitoring and detection of fingerprints in popular open-source wallets, and fixing low-hanging fruit where possible.

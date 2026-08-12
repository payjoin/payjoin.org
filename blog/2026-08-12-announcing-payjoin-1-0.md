---
title: Announcing Payjoin 1.0
description: Payjoin Dev Kit's first stable release
date: 2026-08-12
authors: dangould
tags: [Announcement, PDK]
---

Payjoin Dev Kit's first stable release is here. The Rust library for [BIP 77](https://github.com/bitcoin/bips/blob/master/bip-0077.md) and [BIP 78](https://github.com/bitcoin/bips/blob/master/bip-0078.mediawiki) Payjoin is published as [1.0.0](https://crates.io/crates/payjoin). Wallets and services that want to let Bitcoin senders and receivers interact to transact can now depend on it or its [foreign language bindings](https://github.com/payjoin/rust-payjoin/tree/master/payjoin-ffi). Concretely that means clients can send and receive Payjoin without running a server, survive restarts and going offline, view standardized status information, and gracefully fall back or cancel interactions.

<!-- truncate -->

Payjoin is the base case for interactive transaction construction where both sender and receiver contribute. It creates an opportunity to save blockspace fees with multi-contributor batching, secure transaction cut-through settlement, and preserve privacy by breaking the assumption Satoshi left in [the whitepaper](https://bitcoin.org/bitcoin.pdf) that transaction inputs all come from the same owner.

There is much more to do. This release commits to the core [`payjoin`](https://docs.rs/payjoin) state machine API including the persisted session format so that sessions written today replay in future versions. Other Payjoin Dev Kit software is not yet stable, including our [`payjoin-ffi`](https://github.com/payjoin/rust-payjoin/tree/master/payjoin-ffi) bindings library, the [`payjoin-cli`](https://github.com/payjoin/rust-payjoin/tree/master/payjoin-cli) end-to-end reference implementation, and the [`payjoin-mailroom`](https://github.com/payjoin/rust-payjoin/tree/master/payjoin-mailroom) server that anyone can host so that clients don't have to; nor is the [BIP 77 spec](https://github.com/bitcoin/bips/blob/master/bip-0077.md), though its Draft status is nearing graduation to Complete.

This API was hard earned through pilot integrations with [Bull Bitcoin Mobile](https://www.bullbitcoin.com) and [Cake Wallet](https://cakewallet.com), which are compatible with the payjoin-cli reference. A number of other integrations are in flight and in review. 1.0 stability allows us to focus efforts on multiplying integrations from here.

To get started, go to [crates.io](https://crates.io/crates/payjoin), [docs.rs](https://docs.rs/payjoin), and check out the [`payjoin-cli` Quick Start](https://github.com/payjoin/rust-payjoin/tree/master/payjoin-cli#quick-start). This work was made possible by dozens of volunteer contributors and sponsors including [Spiral](https://spiral.xyz), [OpenSats](https://opensats.org), [HRF](https://hrf.org), [Maelstrom](https://maelstrom.fund), [Btrust](https://www.btrust.tech), and others, including individuals like you. Thank you.

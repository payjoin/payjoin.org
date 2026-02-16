---
sidebar_position: 1
title: Integrate Payjoin
---

# Integrate Payjoin

Payjoin Dev Kit (PDK) is the library for adding payjoin to your wallet or service. It handles the protocol — you bring your own wallet, key management, and networking.

PDK is IO-agnostic and implements both [BIP 77 (Payjoin V2)](https://github.com/bitcoin/bips/blob/master/bip-0077.mediawiki) and [BIP 78 (Payjoin V1)](https://github.com/bitcoin/bips/blob/master/bip-0078.mediawiki). V2 is the default and supports asynchronous, offline-capable payjoin.

## Try it hands-on

The fastest way to see payjoin in action is with `payjoin-cli`, the reference implementation:

```sh
cargo install payjoin-cli
```

The [payjoin-cli quickstart](https://github.com/payjoin/rust-payjoin/blob/master/payjoin-cli/README.md) walks through sending and receiving a payjoin in minutes.

## Rust

Add the crate to your project:

```toml
[dependencies]
payjoin = { version = "1.0.0-rc.1", features = ["send", "receive", "v2", "io"] }
```

The [API reference on docs.rs](https://docs.rs/payjoin/latest/payjoin/) documents the full send and receive interfaces. Both follow a typestate pattern — each protocol step is a distinct type, so the compiler catches misuse.

## Other languages

PDK provides bindings via [payjoin-ffi](https://github.com/payjoin/rust-payjoin/tree/master/payjoin-ffi) for:

- **Dart / Flutter** — [payjoin-flutter](https://github.com/payjoin/payjoin-flutter)
- **JavaScript**
- **Python**

## Who's using it

Payjoin is live in [BTCPay Server](https://btcpayserver.org), [Cake Wallet](https://cakewallet.com), [Bull Bitcoin](https://wallet.bullbitcoin.com), [Sparrow Wallet](https://sparrowwallet.com), and others.

See the [Bitcoin Design case study](https://bitcoin.design/guide/case-studies/payjoin/) for UX patterns and implementation guidance.

## Get help

Integrating and have questions? Reach out on [Discord](https://discord.gg/6rJD9R684h) or open an issue on [GitHub](https://github.com/payjoin/rust-payjoin).

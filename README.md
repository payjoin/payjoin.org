# Payjoin: Privacy Without Mixing

Payjoin brings privacy to bitcoin without changing the expected experience. It helps everyone, even those who don't use it. Payjoin transactions look normal and still confuse chain surveillance.

Payjoin is easy to integrate, but can only take off when software supports sending and receiving.

## The Problem

Satoshi said that transactions with multiple inputs "necessarily reveal that their inputs were owned by the same owner" in the bitcoin whitepaper. That assumes transactions only have one funding source.

Surveillance companies use this assumption to creep on bitcoin users.

## A Solution

Payjoin lets us build transactions with inputs from another owner that break that "common ownership assumption." It works as a default for wallets that support it because it has a seamless fallback inside of the BIP 21 unified payment standard.

## How to Payjoin

### Scan a Unified QR Code

This ia BIP21 URI with a payjoin parameter. If the scanner does not support payjoin, it can still fall back to the address.

![BIP21 URI with payjoin parmeter](./hrf-pj-qr.png)

Raw Data

```bip21
bitcoin:BC1QCVSR6K3TPVLGN9HGTZ97LTX6GTPXVDMYYQPGMV?pj=HTTPS://BTCPAY.HRF.ORG/BTC/pj
```

### How is it private?

The following [transaction](https://mempool.space/tx/58d68b22ab96b87a11c1fbd3090fee23f96f71a4115f96210ba776d0ae7d8d55) conforms to *unnecessary input heuristic*. It contributes more inputs than are typical for the outputs it produces. It could be a payjoin, but we can't know for sure.

It's normal to make transactions like this to [minimize future fees by merging coins](https://bitcoin.design/guide/how-it-works/coin-selection/#minimize-future-fees-merge-coins). Merging coins connects their histories and hurts privacy if this is not a payjoin.

By using payjoin, two parties come together to merge coins, save fees, and enhance privacy at the same time.

```pre
input 0:    198,209 sats    output 0:     288,535 sats
                         🔀
input 1:  1,797,496 sats    output 1:   1,705,291 sats
```

Because of payjoin, any of the following outcomes are plausible:

- Alice had input 0 and input 1. She paid Bob output 0 and made output 1 as change
- Alice had input 0 and input 1. She paid Bob output 1 and made output 0 as change
- Bob had input 0, Alice had input 1. Bob was paid 90,326 sats to output 0, Alice took output 1 as change.
- Bob had input 0, Alice had input 1. Bob was paid 1,507,082 sats to output 1, Alice took output 0 as change.

The possibility of that Alice and Bob may have both contributed via payjoin breaks the heuristic analysis used to harm bitcoin privacy. Payjoin not only makes it more difficult for someone looking at payjoin user history to figure out exactly how much money changed hands, it does so for every other transaction with two outputs too because it looks no different.

## How to Payjoin

### Send Payjoin

There are a number of softwares which [support sending payjoin](https://en.bitcoin.it/wiki/PayJoin_adoption).

1. Construct transaction as normal as a PSBT
2. Request the receiver process it over HTTP
3. Privacy is preserved.

Make sure your front end accepts bip21 payjoin uris. There is a huge number of reasons they improve your users' experience anyhow.

#### Support Sending Payjoin in my Wallet

Check out the payjoin SDK [sender documentation](https://docs.rs/payjoin/latest/payjoin/sender/index.html) for details.

### Request Payjoin

Requesting payjoin is more involved. As of today, doing so requires a hot wallet and a public `https://` or `.onion` endpoint. BTCPayServer and JoinMarket support it as does the alpha [payjoin-client tool for bitcoind](https://github.com/chaincase-app/payjoin/tree/master/payjoin-client).

#### Support Requesting Payjoin in my wallet

Check out the payjoin crate [receiver documentation](https://docs.rs/payjoin/latest/payjoin/receiver/index.html) for details. Lightning software is a great fit for payjoin since nodes already depend on hot wallets and public servers.

#### Serverless Payjoin

There is a [public proposal](https://gist.github.com/DanGould/243e418752fff760c9f6b23bba8a32f9) to remove the requirements to run a public server. Please leave your comments.

#### Async Payjoin

The "hot wallet" limitation may also be removed with an asynchronous payjoin protocol that lets the sender and receiver wait to receive signatures.

---

## Terminology

- Payjoin - This two-party transaction breaks the common-input ownership heuristic singled out by satoshi as the open privacy problem in the bitcoin whitepaper.
- P2EP (Pay-to-endpoint) - The method for two parties to create a payjoin over the internet
- Bitcoin URI - Universal Resource Identifier
- Unnecessary Input Heuristic - An assumption used by chain surveillance that there are more inputs than necessary to make what is assumed to be the primary transfer
- Common input ownership heuristic - The assumption that inputs to a transaction necessarily belong to the same entity

## Join the Discussion and Contribute

- [github](https://github.com/payjoin)
- [slack](https://bitcoindesign.slack.com/archives/C04Q2A8MLHH)

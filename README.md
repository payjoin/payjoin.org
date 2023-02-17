# Payjoin: Private Bitcoin by Default

Bitcoin privacy solutions have been covert, interactive minefields that require users to deep dive into research to have any benefit. Even after, they don't run out of ways to shoot themselves in the foot.
Payjoin brings privacy to bitcoin without much change at all to the expected experience. To make use of it, first we need wallet interoperability. Payjoin requires online interaction like lightning, and it fits inside [unified QRs](https://bitcoinqr.dev/). Payjoin will take off when wallets support sending and receiving to QRs with payjoin parameters.

## The Problem

Asking users to take steps to preserve their privacy as is like asking them to be asset managers.
Bitcoin transfers leave permanent records that can cause serious harm. privacy is a prerequisite to freedom. "Privacy in an open society requires anonymous transaction systems."

Satoshi said it himself, transactions with multiple inputs "necessarily reveal that their inputs were owned by the same owner." And so typical bitcoin transactions leak privacy about the history of their funds.

## A Solution

Turn on privacy by default with an optional BIP21 parameter

[BIP 21] defines a scheme to create a bitcoin "payment link." By default, it includes an on-chain address to send funds to.

BIP 21 was designed to be extensible. The spec allows for optional parameters in the URI. Those parameters allow us to specify a way to receive private payments

## Examples

### Unified QRs for Bitcoin

BIP21 URI with payjoin parameter

![BIP21 URI with payjoin parmeter](./hrf-pj-qr.png)

Raw Data

```bip21
bitcoin:bc1qcvsr6k3tpvlgn9hgtz97ltx6gtpxvdmyyqpgmv?amount=0.00419206&pj=https://btcpay.hrf.org/BTC/pj
```

BIP21 URI with BOLT 11 invoice

![BIP21 URI with BOLT 11 invoice](https://bitcoinqr.dev/qr-bip21-bolt11.png)

Raw Data

```bip21
bitcoin:BC1QYLH3U67J673H6Y6ALV70M0PL2YZ53TZHVXGG7U?amount=0.00001&label=sbddesign%3A%20For%20lunch%20Tuesday&message=For%20lunch%20Tuesday&lightning=LNBC10U1P3PJ257PP5YZTKWJCZ5FTL5LAXKAV23ZMZEKAW37ZK6KMV80PK4XAEV5QHTZ7QDPDWD3XGER9WD5KWM36YPRX7U3QD36KUCMGYP282ETNV3SHJCQZPGXQYZ5VQSP5USYC4LK9CHSFP53KVCNVQ456GANH60D89REYKDNGSMTJ6YW3NHVQ9QYYSSQJCEWM5CJWZ4A6RFJX77C490YCED6PEMK0UPKXHY89CMM7SCT66K8GNEANWYKZGDRWRFJE69H9U5U0W57RRCSYSAS7GADWMZXC8C6T0SPJAZUP6
```

BIP 21 URI with BOLT 11 invoice and payjoin parameter

### A payjoin *candidate*

The following [transaction](https://mempool.space/tx/58d68b22ab96b87a11c1fbd3090fee23f96f71a4115f96210ba776d0ae7d8d55) conforms to *unnecessary input heuristic*. That means it contributes more inputs than are typical for the outputs it produces. Sometimes a single user makes transactions like this to [minimize future fees by merging coins](https://bitcoin.design/guide/how-it-works/coin-selection/#minimize-future-fees-merge-coins). Merging coins also connects their histories, hurting otherwise preserved privacy. Two parties may come together to merge using payjoin instead to save fees and privacy at the same time.

```pre
i0:  198209 sats -> o0:   288535 sats
i1: 1797496 sats    o1:   1705291 sats
```

Any of the following analyses are plausible:

- Alice had input 0 and input 1. She paid Bob output 0 and made output 1 as change
- Alice had input 0 and input 1. She paid Bob output 1 and made output 0 as change
- Bob had input 0, Alice had input 1. Bob was paid 90,326 sats to output 0, Alice took output 1 as change.
- Bob had input 0, Alice had input 1. Bob was paid 1,507,082 sats to output 1, Alice took output 0 as change.

The possibility of that Alice and Bob may have both contributed via payjoin breaks common input ownership heuristic, the only privacy problem left open in the bitcoin paper. Payjoin not only makes it more difficult for someone looking at payjoin user history to figure out exactly how much money changed hands, it does so for every other transaction with two outputs.

## How to Payjoin

### Send Payjoin

There are a number of softwares which [support sending payjoin](https://en.bitcoin.it/wiki/PayJoin_adoption). All it takes is an internet connection.

Payjoin makes a transaction with the recipient in order to better preserve privacy. It does not change the unified QR experience

1. Construct transaction as normal as a PSBT
2. Request the receiver process it over HTTP
3. Privacy is preserved.

Make sure your front end accepts bip21 payjoin uris. There is a huge number of reasons they improve your users' experience anyhow.

#### Support Sending Payjoin in my Wallet

Check out the payjoin crate [sender documentation](https://docs.rs/payjoin/latest/payjoin/sender/index.html) for details. Send payjoin is so simple you can add it on any given Tuesday.

### Request Payjoin

Requesting payjoin is more involved. As of today, doing so requires a hot wallet and a public `https://` or `.onion` endpoint. BTCPayServer and JoinMarket support it as does the alpha [payjoin-client tool for bitcoind](https://github.com/chaincase-app/payjoin/tree/master/payjoin-client).

#### Support Requesting Payjoin in my wallet

Check out the payjoin crate [receiver documentation](https://docs.rs/payjoin/latest/payjoin/receiver/index.html) for details. Lightning software is a great fit for payjoin since nodes already depend on hot wallets and public servers.

#### Transcend Limits

There is a [public proposal](https://gist.github.com/DanGould/243e418752fff760c9f6b23bba8a32f9) to remove the requirements to run a public server. Please leave your comments.

The "hot wallet" limitation may be removed with an asynchronous payjoin protocol, so look out for that change, too.

## Terminology

- Payjoin - This two-party transaction breaks the common-input ownership heuristic singled out by satoshi as the open privacy problem in the bitcoin whitepaper.
- P2EP (Pay-to-endpoint) - The method for two parties to create a payjoin over the internet
- Bitcoin URI - Universal Resource Identifier
- Unnecessary Input Heuristic - An assumption used by chain surveillance that there are more inputs than necessary to make what is assumed to be the primary transfer
- Common input ownership heuristic - The assumption that inputs to a transaction necessarily belong to the same entity

## Join the Discussion and Contribute

- [github](https://github.com/payjoin)
- [slack](https://bitcoindesign.slack.com/archives/C04Q2A8MLHH)

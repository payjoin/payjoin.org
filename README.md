# Payjoin: Privacy without Mixing

Payjoin brings privacy to bitcoin without changing the expected experience. It helps everyone, even those who don't use it. Payjoin transactions look normal and still confuse chain surveillance.

Payjoin is easy to integrate, but can only take off when software supports sending and receiving via [the BIP 78 spec](https://github.com/bitcoin/bips/blob/master/bip-0078.mediawiki).

<a href="#send"><button name="start">Start with sending</button></a>

## The Problem

Satoshi said that transactions with multiple inputs "necessarily reveal that their inputs were owned by the same owner" in the bitcoin whitepaper. That assumes transactions only have one funding source.

Surveillance companies use th
assumption to creep on bitcoin users.

## A Solution

Payjoin lets us build transactions with inputs from another owner that break that "common ownership assumption." It works as a default for wallets that support it because it has a seamless fallback inside of the BIP 21 unified payment standard.

## How to Payjoin

### Scan a Unified QR Code

This is a BIP21 [unified URI](https://bitcoinqr.dev/) with a payjoin parameter. Even if a wallet does not support payjoin, it can still fall back to the address.

![BIP21 URI with payjoin parmeter](./hrf-pj-qr.png)

Raw Data

```bip21
bitcoin:BC1QCVSR6K3TPVLGN9HGTZ97LTX6GTPXVDMYYQPGMV?pj=HTTPS://BTCPAY.HRF.ORG/BTC/pj
```

### Try the Demo

Let's check out a payjoin flow. Bob is on the left trying to purchase some jewelry without his peers finding out. The merchant's point of sale is on the right. Click Bob's screen to scan the QR code and see just how easy it is to payjoin.

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F7BpOmi30JgG6gIaE0T7fL4%2FPayjoin-Designs-Bitcoin-Wallet-UI-Kit-%2526-Design-System%3Fpage-id%3D4263%253A62592%26node-id%3D4954%253A70101%26viewport%3D-4364%252C-2385%252C0.48%26scaling%3Dmin-zoom%26starting-point-node-id%3D4954%253A70101" allowfullscreen></iframe>

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

The possibility of that Alice and Bob may have both contributed via payjoin breaks the heuristic analysis used to harm bitcoin privacy. Payjoin not only makes it more difficult for someone looking at payjoin user history to figure out exactly how much money changed hands, it does so for every other transaction with many inputs and two outputs too. It looks no different.

## Use Payjoin with your Stack

### Send Payjoin

<a id="send"></a>

Sending payjoin is simple compared to lightning. It works anywhere with internet:

1. HTTP request a payjoin by sending a fallback transaction to the unified URI
2. Sign and broadcast the payjoin transaction response
3. Enjoy privacy and know you helped the whole network

Make sure your front end accepts bip21 payjoin uris. There are a huge number of reasons they improve your users' experience anyhow.

<a href="https://docs.rs/payjoin/latest/payjoin/sender/index.html" target="_blank"><button name="send">Read the SDK docs ▶</button></a>

### Receive Payjoin

Requesting payjoin requires a hot wallet and a public `https://` or `.onion` server endpoint.

1. Share a payjoin URI or QR code
2. Listen for a payjoin request
3. Respond with a payjoin proposal, having added receiver input
4. Wait for the sender to broadcast the transaction

Payjoin is a great fit for lightning nodes since they already depend on hot wallets on always-online servers.

<a href="https://docs.rs/payjoin/latest/payjoin/receiver/index.html" target="_blank"><button name="receive">Read the SDK docs ▶</button></a>

## Future Plans

### Serverless Payjoin

There is a [public proposal](https://gist.github.com/DanGould/243e418752fff760c9f6b23bba8a32f9) to allow anyone to receive a payjoin without running a public server. In order to advance Serverless Payjoin into a formal BIP specification we need your help with a second, independent implementation. Please share, leave your comments, and [join the development chat](https://t.me/chaincase/4109) to help.

### Async Payjoin

The "hot wallet" limitation may also be removed with an asynchronous payjoin protocol that lets the sender and receiver wait to receive signatures.

---

## Terminology

- Payjoin - This two-party transaction breaks the common-input ownership heuristic singled out by Satoshi as the open privacy problem in the bitcoin whitepaper.
- P2EP (Pay-to-endpoint) - The method for two parties to create a payjoin over the internet
- Bitcoin URI - Universal Resource Identifier
- Unnecessary Input Heuristic - An assumption used by chain surveillance that there are more inputs than necessary to make what is assumed to be the primary transfer
- Common input ownership heuristic - The assumption that inputs to a transaction necessarily belong to the same entity

## Join the Discussion and Contribute

- [github](https://github.com/payjoin)
- [chat on telegram](https://t.me/chaincase/1)
- [roadmap](https://github.com/orgs/payjoin/projects/1)

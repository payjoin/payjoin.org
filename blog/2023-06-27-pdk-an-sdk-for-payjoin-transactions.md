---
image: /img/og/2023-06-27-pdk-an-sdk-for-payjoin-transactions.png
title: "PDK: A Payjoin SDK"
description: Learn how PDK makes using Payjoin easy and the direction it will develop in our new blog.
date: 2023-06-27
authors: dangould
tags: [Bitcoin, PDK]
---


PDK is here to make Payjoin a drop in upgrade for all software touching Bitcoin. I cover the project's history, why you should consider it to add Payjoin to your stack, and some of the project's priorities moving forward. The PDK team will be updating this new blog with development updates, feature forecasts and the details of releases.

<!-- truncate -->

## What is PDK?

PDK began as a Rust Payjoin side project library developed by Martin Habovštiak, [@Kixunil](https://github.com/kixunil) in [2021](https://github.com/payjoin/rust-payjoin/commit/d70c447af622e2b9db34b833fe22a80ff3b2d223). Up until then, Payjoin had been cast as a merchant / client privacy tool, but Martin saw payjoin as something more. He showcased Payjoin as a generic interactive transaction coordinator early on. One of Martin's Rust Payjoin applications, [loptos](https://github.com/Kixunil/loptos), receives Payjoin to open batches of lightning channels from an external Payjoin sender, reducing fees and eliminating one whole transaction from typical channel funding flow. I now view Payjoin as the simplest way to deploy Greg Maxwell's 2013 [transaction cut-through](https://bitcointalk.org/index.php?topic=281848.0) idea to scale bitcoin and preserve privacy through fee saving incentives.

A couple months after Martin started, Alex Gladstein announced Human Rights Foundation [support](https://twitter.com/gladstein/status/1437796214376845315) of my work to make Payjoin mobile friendly. In the Payjoin deep dive that followed, I began to view Payjoin as a self-contained privacy system that can benefit any bitcoin settlement, much like Martin's loptos. But it seemed no Payjoin library with complete send and receive features existed. At best, reference software were tightly coupled to inner workings of the wallets they were attached to.  I found Martin's Rust Payjoin to be a worthy foundation on which to build such a library. Martin reviewed my early contributions to the library more thoroughly than clinical trials for new medications. Meanwhile, the success of [BDK](https://bitcoindevkit.org/) and [LDK](https://lightningdevkit.org) addressing mobile environments inspired me. A Payjoin Dev Kit could be flexible and safe enough to run everywhere.

## Why not add Payjoin to BDK?

You might think Payjoin is just bitcoin, so it belongs in BDK. When you take a look at the `bdk` crate you see that it's a wallet abstraction. That is meant to manage key material and synchronize apps with the network. Payjoin in contrast is an interactive transaction building protocol with some networking parameters. The two compliment each other well, and while the day where PDK's `payjoin` crate compiles as part of `bdk` may well come soon, in order to provide well engineered and reviewed components, PDK lives in its own repository for specialized scrutiny so each effort can focus on their individual strengths.

BDK is focused shipping a stable v1.0. Any software based on it before then must change to accomodate it. Like LDK, a key quality of Payjoin Dev Kit is doing no IO. BDK *does* do IO.

PDK is focused on making Payjoin integrations easy, reliable, and making using it foolproof.

As fortune would have it the partially signed Bitcoin transactions that power PDK live in a shared `rust-bitcoin` dependency that BDK makes extensive use of, making the two fit siblings. Keeping PDK separate from BDK while the two mature allow them to develop at speed while still maintaining broad compatibility and sharing design philosophy.

## Who uses PDK?

A few collaborators make use of PDK's compatibility to Payjoin from diverse computing environments. Some even use BDK.

[Bitcoin Core payjoin-cli extension](https://github.com/payjoin/rust-payjoin/tree/master/payjoin-cli) serves as a complete reference sample for sending and receiving Payjoin with the PDK. This is a good starting point for a self-guided tour of the kit to make your first Payjoins from the command line.

Hunter Beast took a gamble on an early PDK alpha, adding it to [BitMask Beta](https://beta.bitmask.app), the BDK-based Bitcoin, Lightning, and RGB web wallet compiled to WASM. Steve Meyers mentors Will Owens as a Summer of Bitcoin intern to support Payjoin in the BDK-CLI tool. Francis Pouliot engages closely with PDK to fulfil his [vow](https://twitter.com/francispouliot_/status/1138131827258986499) that Bull Bitcoin will be "the first Bitcoin company in the world to integrate pay-to-endpoint Bitcoin deposits and withdrawals." Now that a sturdy base exists for PDK, Payjoin stands a chance to evolve into every Bitcoin product.

For example, in the fall of 2022, Evan Lin, Nick Farrow, Armin Sabouri and I transformed loptos's Lightning Payjoin with a neat UI, documentation, and demos into [nolooking](https://github.com/chaincase-app/nolooking) and shipped it to the Umbrel app store. While it only batched channels in a non-canonical fake Payjoin hack at first, nolooking now leverages PDK to make canonical Payjoin transactions that do preserve privacy as a side effect of transaction cut-through batching.

After seeing how complex such an app could be, Conor Okus of Spiral suggested to channel the potential of Payjoin into a website to explain how it works and recruit wider support. That idea became [payjoin.org](https://payjoin.org) and brought new interest in many potential integrations. He pointed me to engage with the Bitcoin Design Community, where Stephen DeLorme and Christoph Ono helped me to issue a design challenge. [Yashraj](https://twitter.com/Yashraj__) accepted, went on to develop [The Payjoin Experience Case Study](https://bitcoin.design/guide/case-studies/payjoin/) in collaboration with Mogashni Naidoo, and presented his findings at the Canadian Bitcoin Conference.

Today, Matthias from Trident Wallet and Thunderbiscuit from BDK both help to launch foreign language bindings to catalyze [Payjoin adoption](https://en.bitcoin.it/wiki/PayJoin_adoption) beyond Rust. Floppy Disk Guy explores potential alternative coordination mechanisms, like Nostr. [BOB Space](https://www.bobspaces.net/) curates an environment for PDK development to thrive. A phalanx of many more unnamed supporters continue to raise this open-source groundwork with funding, infrastructure, integrations, bindings, design, protocol development, advice, documentation, thought provoking questions and more. Thank you all for your contributions to aim this distributed effort.

## What are PDK’s development priorities?

### A Robust Interface

Before PDK, Payjoin implementations were all tightly coupled to their wallet logic. PDK aims to be a thoughtful, beautiful interface with comprehensive error handling. In order to deliver the promise of reliable security and privacy, PDK must remove any chance for misuse downstream. PDK should also include best practices to deliver delightful experiences.

### Serverless, Asynchronous Payjoin

Version 1 wallets can't receive Payjoin unless they are running, online, and hosting a public HTTP endpoint. We’re developing solutions to these requirements in conjunction with the Bitcoin developer community at large. We must enable wallets with unstable connections or delays to account for hardware signing Payjoin receiving without hosting a public server too. I have a [pull request](https://github.com/payjoin/rust-payjoin/pull/21) open that proposes a protocol to fix this exact problem. It includes the original bitcoin-dev [mailing list post](https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2023-January/021364.html) on the Serverless Payjoin issue.

### Language Bindings

For now we only support Rust, but bindings are an active area of development. Bindings are in the proof of concept stage and [the approach](https://bitcoindevkit.org/blog/bindings-scope/) is being defined in collaboration with BDK and LDK. We prioritize fixing bugs for early adopters. Express your desire for C/C++, C#, Flutter/Dart, Kotlin/JVM, Python, Swift, and WASM in your project to get the ball rolling in the direction of your preferred language.

### Design Guidance

The Payjoin protocol was designed to request a bitcoin payment using the universal bitcoin URI and QR standard, [BIP 21](https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki). Most of a user's preferences regarding transaction construction, coin selection, and fees can be automated thanks in part to this standard. We want to make it as easy as possible for developers to go from the decision that they'll support payjoin to a production deployment, and that includes front end components and stories to make the experience seamless for users.

## Wrapping up

You should have a good idea about what PDK is about and where we're headed. Know someone supporting Payjoin or related application? Point them in my direction. I'm [@bitgould](https://twitter.com/bitgould). Follow the project on [Twitter](https://twitter.com/payjoindevkit). Hop into our [Discord](https://discord.gg/6rJD9R684h) or checkout GitHub [Discussions](https://github.com/orgs/payjoin/discussions) to get involved. Payjoin is scaling Bitcoin and reliable privacy is coming for the ride.

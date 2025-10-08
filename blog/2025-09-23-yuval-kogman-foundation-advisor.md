---
title: Yuval Kogman Joins Payjoin Foundation as Advisor
description: Payjoin Foundation Appoints Spiral Bitcoin Wizard to Advisory Board
date: 2025-09-23
authors:
  - name: Dan Gould
tags: [Announcement, Foundation, Advisor]
---

Spiral Bitcoin Wizard and longtime Bitcoin privacy developer Yuval Kogman joins
Payjoin Foundation as the first Advisory Board member. He draws on more than two
decades of programming experience. Few others can boast Yuval's dedication to
the Bitcoin privacy niche. He is perhaps best known for his work developing the
[WabiSabi](https://gnusha.org/pi/bitcoindev/CAAQdECAojQBLxOEdef1NHkVN6DGTcsFAZ5bB0eOHFTPGu6d+pQ@mail.gmail.com/)
DoS prevention protocol. His subsequent
[whistleblowing of privacy vulnerabilities in CoinJoin
implementations](https://groups.google.com/g/bitcoindev/c/CbfbEGozG7c),
including those touting WabiSabi integration, demonstrates his commitment to the
underlying principles.

Prior to his current focus on Payjoin, Yuval had already been working on a decentralized, multiparty
transaction batching protocol. We have joined forces to develop [this
next-generation batching](https://payjoindevkit.org/2025/03/18/the-evolution-of-payjoin/)
and deliver it via Payjoin Dev Kit.

For those still uninitiated,
Payjoin is the simplest way to build two-party batched transactions. Rather than
convincing a user to take some extra steps to try and "gain" privacy (by joining a CoinJoin round,
triggering a swap, etc.), payjoin automates a privacy-preserving interaction that
runs in the background when a user generates an address or hits "send" in their
wallet. By automating the creation of a batched transaction between one entity paying
another, payjoin gives both entities a chance to more efficiently
spend coins and protect all who use Bitcoin from [third-party
surveillance's most useful
heuristic](https://en.bitcoin.it/wiki/Common-input-ownership_heuristic) for
identifying balances and relationships of users without their consent.

The multiparty version we imagine lets transfers from Alice to Bob to Charlie
cut through one transaction. Such an interactive protocol can be more efficient than
[old-school payment batching](https://bitcoinops.org/en/payment-batching/), and
makes second-person privacy possible: we envision that people
making transfers to one another using such a mechanism will
produce transactions where neither party knows the others' addresses while preserving
a familiar user experience.

Yuval has been an informal advisor to the project for a number of years, helping us
shape the Payjoin Dev Kit API, troubleshoot reliability issues, and
design
[BIP 77 Async Payjoin](https://github.com/bitcoin/bips/blob/master/bip-0077.md)
to address former barriers to adoption. While
co-authoring the Async Payjoin specification together, he attended to nitty
gritty details including QR code scanning reliability, message uniformity, and
IP address metadata privacy. Preventing leaks of both private information and
potential failure is what keeps the Payjoin experience dependable.

More than that, Yuval is a friend to the team. He demands positive-sum
solutions where everybody wins and invests heavily in budding talent.
He is uncompromising when it comes to his values, so his advice keeps us
focused on the mission.

[Spiral](spiral.xyz)'s unwavering support for the Payjoin mission began in 2023, when they initially
[extended me a grant](https://nitter.net/spiralbtc/status/1747663472836431925) to lead Payjoin development. Since then, they have
funded multiple developers, including [Spacebear](https://nitter.net/spiralbtc/status/1961473589049245895), our team's integrations
expert. Payjoin also owes a debt of gratitude to Spiral for their
support of neighboring ecosystem projects. For example, we depend on `rust-bitcoin` for our
core bitcoin types, and Bitcoin Dev Kit for pioneering a foreign language
bindings strategy that makes deploying our code to various programming languages
possible. Thank you.

We can't wait to see where Yuval's help takes us from here. Thank you Yuval and
Spiral for your faith in the mission and the sacrifices you are making to
realize it.

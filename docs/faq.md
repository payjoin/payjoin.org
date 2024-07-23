---
sidebar-position: 4
title: FAQ
---

# Frequently Asked Questions

---

## Does Payjoin require changes to Bitcoin?

No. Payjoin was designed with ease of adoption in mind, and requiring consensus changes would be slow and difficult. Payjoin works as a protocol on top of Bitcoin.

## Can I add Payjoin to my wallet right now using Payjoin Dev Kit?

[PDK](https://payjoindevkit.org/) is a Rust library to help your wallet use Payjoin. If your wallet uses another language, we are creating bindings to other languages so it can be used across all sorts of different applications, including mobile apps. The Python bindings are nearly complete.

## Why doesn’t my wallet support Payjoin yet?

One of the great things about Payjoin is that it doesn’t require any consensus changes to Bitcoin. The flip side is that it’s up to individual wallets to implement it, and historically there haven’t been many tools to assist developers. Payjoin Dev Kit (PDK) aims to solve this problem as the de-facto library for Payjoin, and it includes Payjoin-cli as a reference implementation. Another barrier has been that the first version of Payjoin required an HTTPS server for a receiver to be running at the time a sender wanted to make a payment. This practically limited Payjoin’s utility to always-online wallets such as merchants. But with the recent development of [Payjoin V2](https://github.com/bitcoin/bips/pull/1483), receivers can create Payjoin transactions asynchronously while offline. This opens up adoption to all types of wallets. If there is a wallet you’d like to see adopt Payjoin or you are a wallet developer and who’d like to integrate it, check out our tutorials or reach out to us for help!
---
sidebar_position: 2
title: Scaling & Fees
---
# How Does Payjoin Scale Bitcoin?
The Bitcoin blockchain is limited by block size. Approximately every ten minutes a new block is added to the chain. New blocks are limited to around 2MB of data on [average](https://bitcoin.stackexchange.com/a/116350).

The simplest way to scale any database is batching, which is exactly what Payjoin does.

Payjoin enables multiple distinct parties to combine what would otherwise be distinct transaction intents into a joint transaction which lets them share transaction data they would otherwise both need to pay to add to the chain.

## Your Typical Payjoin
In a basic bitcoin transaction, a sender spends some bitcoin to a new transaction output paying someone and makes change from their funds at the same time. A third party looking at the transaction on chain could assume all input to a transaction must have come from that sender.

In Payjoin, the sender and receiver both contribute funds, breaking Satoshi's assumption. The payment amount plus receiver input amount both go to the receiver and the sender gets change. Because bitcoin is stored in distinct transaction outputs, and not accounts, such a transaction looks the same as one where a sender spent multiple inputs to a receiver and made change. By breaking the assumption from the whitepaper, Payjoin makes it much harder to be sure about who got paid how much.

The Payjoin using exclusively Pay-to-Taproot addresses (P2TR) [here](https://mutinynet.com/tx/3c5436f1edf7d4c32a5ccf2448c1e963f52bb8a0fb6f8688d7e78a14e1cbe80b) is 211.75 vB. An analogous P2TR payment [here](https://mutinynet.com/tx/2c45dc6fef9feb32b9741cc3e6197eda94e1b0c45675e18818bfadce9fa94e20) is 152.25 vB and P2TR consolidation [here](https://mutinynet.com/tx/ef9263ed05c07f7ba933389eee7bfd62372e3dc4d1e697f96b7c66a215cc9b46) is 168.5 vB, for a total of 320.75 vB. The separate payment and consolidation have to pay for 51% more block weight to be mined than the Payjoin. What other scaling solution achieves that kind of savings?

## Opportunistic Consolidation
Payjoin got its start as a way to make a collaborative transaction. A receiver combines their input with the sender's, effectively joining a [consolidation](https://bitcoin.stackexchange.com/questions/103194/confused-about-utxo-management-and-consolidation) transaction with a simple transfer. An observer looking at the Payjoin is cannot tell it apart from a simple transfer where all of the inputs come from the same entity.

## Transaction Cut-Through
Payjoin not only creates opportunity to batch consolidation, but may create any output with the incoming funds. Because Payjoin involves live interaction, the receiver may [open lightning channels](./lightning), forward funds to a different wallet, pay for goods and services, or batch forward transactions with incoming funds without first taking them into a new UTXO.
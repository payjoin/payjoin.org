---
sidebar_position: 1
title: Privacy
---
# Payjoin Privacy

Satoshi left exactly one privacy problem open in the whitepaper, that transactions with multiple inputs "necessarily reveal that their inputs were owned by the same owner." In early bitcoin software, this was true. But no consensus rule prevents transactions with inputs from multiple sources. Payjoin is the simplest solution.

In a basic bitcoin transaction, a sender spends some bitcoin to a new transaction output paying someone and makes change from their funds at the same time. A third party looking at the transaction on chain could assume all input to a transaction must have come from that sender.

In Payjoin, the sender and receiver both contribute funds, breaking Satoshi's assumption. The payment amount plus receiver input amount both go to the receiver and the sender gets change. Because bitcoin is stored in distinct transaction outputs, and not accounts, such a transaction looks the same as one where a sender spent multiple inputs to a receiver and made change. By breaking the assumption from the whitepaper, payjoin makes it much harder to be sure about who got paid how much.
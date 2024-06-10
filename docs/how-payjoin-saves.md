---
sidebar_position: 1
---

# How Can Payjoin Save 1/3 the Cost of Transacting?

Payjoin can save more than 1/3 of the cost of making normal transactions by batching them together.

Payjoin lets a sender and receiver combine their transactions when they use Bitcoin. This doesn't just save money. It fixes the biggest privacy problem Bitcoin network has at the same time, too.

Imagine Alice would like to send some sats to Joe. Before Payjoin, she'd make a transaction that looks like this:

```
Alice 500,000 sats  ->  200,000 sats to Joe
                        292,387 sats to Alice

(7,613 sats are fees for 152.25 vB at 50 sat/vB)
```

To understand the transaction, know that Bitcoin transactions spend stacks of bitcoin called [unspent transaction outputs (UTXOs)](https://unchained.com/blog/what-is-a-utxo-bitcoin/) to make new transaction outputs. To hold some bitcoin is to control a UTXO. UTXOs have their own denominations like banknotes, but they can hold any amount.

So Alice makes one new UTXO to Joe, and another that holds the change to herself, since UTXOs must be spent completely. The difference between the inputs and outputs is paid to the miners as fees. This example disregards explicit fees.

Before he gets paid by Alice, Joe knows he wants to consolidate the bitcoin from Alice with other bitcoin to Charlie, perhaps to exchange for local currency.

```
Joe 200,000 sats ->  491,575 sats to Charlie
Joe 300,000 sats 

(8,425 sats are fees for 168.5 vB at 50 sat/vB)
```

Block space is limited, and transactions pay for base costs of the transaction header, costs for each input and costs for each output. Making these two transactions cost

*2 × base costs + 3 × input costs + 3 × output costs*

If Joe knows he needs to pay charlie, he can Payjoin with Alice to save loads of fees.

Their Payjoin looks like this
```
Alice 500,000 sats ->  500,000 sats to Charlie
Joe   300,000 sats     289,412 sats to Alice

(10,588 sats are fees for 211.25 vB at 50 sat/vB)
```
Since Alice's payment to Joe "[cut-through](https://bitcointalk.org/index.php?topic=281848.0)" to Charlie,

1. Joe never had to spend fees on an output from Alice
2. Joe saved the fixed costs of making a second transaction
3. Alice and Joe have better preserved privacy.

If Charlie knows Payjoin exists, Charlie can't know for sure that transaction inputs all came from Joe. Nobody can assume all inputs to transactions come from one person anymore.

The payjoin only cost

*1 × base costs + 2 × input costs + 2 × output costs*

saving at least 1/3 of the cost of a regular transaction.[^1]

Any average Joe will need to consolidate outputs or make many transactions to spend his bitcoin. If he knows he will need to pay Charlie, ahead of time, he can even set up Payjoin to do that for him and save even more.

Sure, Alice pays for one more input than she would normally here. But if she receives payjoins she will save fees over time, too. She wants to do her part to scale bitcoin and save the network's privacy. As long as she can connect to the internet to communicate with Joe, she can get the privacy benefits. She can receive Payjoins in the future to save fees too.

[^1]: Let 𝑏 represent fixed costs, 𝑖 represent input costs, and 𝑜 represent output costs. The cost of the unbatched transactions is 2𝑏 + 3i + 3o. The cost of the batched transactions is 2𝑏 + 2𝑖 + 2𝑜. Thus, the savings from batching is calculated as 1/3(2𝑏 + 3𝑖 + 3𝑜) = 2/3(𝑏) + 𝑖 + 𝑜, which is less than 𝑏 + 𝑖 + 𝑜. In this example The unbatched virtual weight is 152.25 vB + 168.5 vB = 320.75 vB. The payjoin batched virtual weight is 211.25 vB. (211.25 vB / 320.75 vB) = ~0.66, so making these transactions without batching is over 1/3 smaller than with batching. Put another way (320.75 / 211.25 vB) = ~1.51, so making these transactions without batching costs more than 50% more than the cost of making them with payjoin.



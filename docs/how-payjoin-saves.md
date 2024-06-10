---
sidebar_position: 1
---

# How Can Payjoin Save 1/3 the Cost of a Transaction?

Payjoin can save more than 1/3 of the cost of making normal transactions by batching them together.

Payjoin lets a sender and receiver combine their wants when they use Bitcoin. This benefits privacy and saves money.

Imagine Alice would like to sell some sats to Joe. Before Payjoin, she'd make a transaction that looks like this:

```
Alice 1 sats ->  Joe 1 BTC
                 Alice 4 sats
```

To understand the transaction, know that Bitcoin transactions spend stacks of bitcoin called [unspent transaction outputs (UTXOs)](https://unchained.com/blog/what-is-a-utxo-bitcoin/) to make new transaction outputs. To hold some bitcoin is to control a UTXO. UTXOs have their own denominations like banknotes, but they can hold any amount.

So Alice makes one new UTXO to Joe, and another that holds the change to herself, since UTXOs must be spent completely. The difference between the inputs and outputs is paid to the miners as fees. This example disregards explicit fees.

Later, Joe wants to spend 2 of his bitcoin to Charlie. He has to combine some other UTXO with the 1 BTC from Alice in order to pay Charlie.

```
Joe 1 BTC -> Joe 2 BTC
Joe 1 BTC
```

Since block space is limited, and transactions take up some fixed amount of space each plus space for each input and output, making these two transactions costs

$2 x fixed costs + 3 x input costs + 3 x output costs$.

If Joe knows he needs to pay charlie, he can Payjoin with Alice to save loads of fees.

Their Payjoin looks like this
```
Alice 5 BTC ->  Charlie 5 BTC
Joe 1 BTC       Alice 4 BTC
```
Since Alice's payment to Joe "[cut-through](https://bitcointalk.org/index.php?topic=281848.0)" to Charlie,

1. Joe never had to spend fees on an output from Alice
2. Joe saved the fixed costs of making a second transaction
3. Alice and Joe have better preserved privacy.

If Charlie knows Payjoin exists, Charlie can't know for sure that transaction inputs all came from Joe. Nobody can assume all inputs to transactions come from one person anymore.

The payjoin only cost

1 × fixed costs + 2 × input costs + 2 × output costs

saving at least 1/3 of the cost of a regular transaction.[^1]

Any average Joe will need to consolidate outputs or make many transactions to spend his bitcoin. If he knows he will need to pay Charlie, ahead of time, he can even set up Payjoin to do that for him and save even more.

And Alice wants to do her part to scale bitcoin and save the network's privacy. As long as she can connect to the internet to communicate with Joe, she can get the privacy benefits. And hope that she will receive Payjoins in the future to save fees too.

[^1]: Let \( f \) represent fixed costs, \( i \) represent input costs, and \( o \) represent output costs. The cost of the unbatched transactions is \( 2f + 3i + 3o \). The cost of the batched transactions is \( 2f + 2i + 2o \). Thus, the savings from batching is calculated as \( \frac{1}{3}(2f + 3i + 3o) = \frac{2}{3}f + i + o \), which is less than \( f + i + o \).



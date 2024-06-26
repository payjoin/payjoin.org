---
sidebar_position: 1
---

# How Can Payjoin Save 1/3 the Cost of Transacting?

Payment batching is table stakes service for high-volume settlement services like exchanges and payment processors. But it has been limited to one party, the sender, combining multiple sends together. Ideally, multiple types of transfers could all be combined together. Imagine your deposit to an exchange was batched with withdrawals to others and lightning channel opens etc. This combination could save significant overhead to every transfer. And it provides an opportunity for much better privacy since, like bitcoin itself, only inputs and outputs are recorded but less information about which inputs and outputs are clustered would be revealed.

Transactions compete to get included in blocks according to network fees they pay since each block is limited to a fixed weight. At a high level, each transaction weight pays some base costs (𝑏), per-input costs (𝑖) and per-output costs (𝑜). In reality not all inputs and outputs have equal cost but the principle can be explained assuming they are, and be backed up by examples of real transaction. For example, a simple exchange could have 5 btc in their treasury and sell 1 bitcoin each to Alice, bob, and Carol.

```
Exchange 5 btc  ->  1 BTC to Alice
                   ~4 BTC minus fees to Exchange
```

```
Exchange 4 btc  ->  1 btc to Bob
                   ~3 BTC minus fees to Exchange
```

```
Exchange 3 btc  ->  1 btc to Carol
                   ~2 BTC minus fees to Exchange
```

Each transaction would cost the exchange 𝑏 + 𝑖 + 2𝑜, and they would pass the fees onto their customers in order to make a profit. The sum of these costs would be 3𝑏 + 3𝑖 + 6𝑜, which would come out of the final ~2 BTC change the exchange makes at last.

## Payment Batching

Batching helps the exchange save time and money in two ways. First, the overall cost to post such a transaction is cheaper than the sum of three individual transactions to produce the same result. Second, a single unspent output can fund multiple withdrawals.

your typical exchange withdrawal looks like this:

```
Exchange 5 btc  ->   1 btc to Alice
                     1 btc to Bob
                     1 btc to Carol
                    ~2 BTC minus fees to Exchange
```

All else equal, an exchange making this batch instead of three separate transactions will only pay 𝑏 + 𝑖 + 4𝑜 in fees, saving 2𝑏 + 2𝑖 + 2𝑜 compared to 3𝑏 + 3𝑖 + 6𝑜, at least 33% cheaper than making those three transactions separately. Second, the exchange does not have to wait for each withdrawal to settle before paying out the next one since they can service them all with a single UTXO. Sure, the exchange could keep multiple UTXOs ready for spending, but that is always going to be overhead of even more transactions in preparation.

## Payjoin Payment Batching

What if Dave the depositor can payjoin? He gets a benefit of breaking some privacy heuristics, and he can save the exchange some fees that might be able to be pased on to him. Payjoin lets the exchange fund withdrawals with Dave's deposit in the same transaction.

```
Dave     3 btc  ->  1 btc to Alice
Exchange 2 btc      1 btc to Bob
                    1 btc to Carol
                   ~2 BTC minus fees to Exchange
```

𝑏 + 2𝑖 + 4𝑜

Payjoin can save more than 1/3 of the cost of making normal transactions by batching them together.

Payjoin lets a sender and receiver combine their transactions when they use Bitcoin. This doesn't just save money. It fixes the biggest privacy problem the Bitcoin network has at the same time.

Imagine Alice would like to send some sats to Bob. Before Payjoin, she'd make a transaction that looks like this:

```
Alice 500,000 sats  ->  200,000 sats to Bob
                        292,387 sats to Alice

(7,613 sats are fees for 152.25 vB at 50 sat/vB)
```

To understand the transaction, know that Bitcoin transactions spend stacks of bitcoin called [unspent transaction outputs (UTXOs)](https://unchained.com/blog/what-is-a-utxo-bitcoin/) to make new transaction outputs. To hold some bitcoin is to control a UTXO. UTXOs have their own denominations like banknotes, but they can hold any amount.

So Alice makes one new UTXO to Bob, and another that holds the change to herself, since UTXOs must be spent completely. The difference between the inputs and outputs is paid to the miners as fees.

Before he gets paid by Alice, Bob knows he wants to consolidate the bitcoin from Alice with other bitcoin to Charlie, perhaps to exchange for local currency.

```
Bob 200,000 sats ->  491,575 sats to Charlie
Bob 300,000 sats 

(8,425 sats are fees for 168.5 vB at 50 sat/vB)
```

Space in the blockchain is limited, and transactions pay for base costs of the transaction header, costs for each input and costs for each output. Making these two transactions costs:

*2 × base costs + 3 × input costs + 3 × output costs*

If Bob knows he needs to pay Charlie, he can Payjoin with Alice to save loads of fees.

Their Payjoin looks like this

```
Alice 500,000 sats ->  500,000 sats to Charlie
Bob   300,000 sats     289,412 sats to Alice

(10,588 sats are fees for 211.25 vB at 50 sat/vB)
```

Since Alice's payment to Bob "[cut-through](https://bitcointalk.org/index.php?topic=281848.0)" to Charlie,

1. Bob never had to spend fees on an output from Alice
2. Bob saved the fixed costs of making a second transaction
3. Alice and Bob have better privacy.

If Charlie knows that Payjoin happens, Charlie can't know for sure that transaction inputs all came from Bob, or if he spent an old-school transaction. Nobody can assume all inputs to transactions come from one person anymore.

The Payjoin only cost

*1 × base costs + 2 × input costs + 2 × output costs*

saving at least 1/3 of the cost of a regular transaction.[^1]

Any old Bob will need to combine outputs or make many transactions to spend his bitcoin. Payjoin combines Bob's old output with the payment to save him the trouble. If he knows he will need to pay Charlie ahead of time, Payjoin can cut-through transactions to save even more.

Sure, Alice pays for one more input than she would normally here. But if she receives Payjoins she will save fees over time, too. She wants to do her part to scale bitcoin and save the network's privacy. As long as Alice and Bob can Payjoin, they'll both save money and get privacy benefits by default.

[^1]: Let 𝑏 represent fixed costs, 𝑖 represent input costs, and 𝑜 represent output costs. The cost of the unbatched transactions is 2𝑏 + 3i + 3o. The cost of the batched transactions is 2𝑏 + 2𝑖 + 2𝑜. Thus, the savings from batching is calculated as 1/3(2𝑏 + 3𝑖 + 3𝑜) = 2/3(𝑏) + 𝑖 + 𝑜, which is less than 𝑏 + 𝑖 + 𝑜. In this example The unbatched virtual weight is 152.25 vB + 168.5 vB = 320.75 vB. The payjoin batched virtual weight is 211.25 vB. (211.25 vB / 320.75 vB) = ~0.66, so making these transactions without batching is over 1/3 smaller than with batching. Put another way (320.75 / 211.25 vB) = ~1.51, so making these transactions without batching costs more than 50% more than the cost of making them with payjoin.



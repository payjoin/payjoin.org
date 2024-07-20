---
sidebar_position: 1
---

# How Can Payjoin Save 1/3 of the Cost of Transacting?

Payment batching is the most common way for high-volume settlement services like exchanges and payment processors to save fees. But it has been limited to one party, the sender, combining multiple sends together. Ideally, multiple types of transfers could all be combined together. Imagine your deposit to an exchange was batched with others' withdrawals. This combination saves significant overhead compared to making individual transfers, [scaling Bitcoin](./why-payjoin/scaling). It also results in better preserved [privacy](./why-payjoin/privacy) since, like bitcoin itself, only inputs and outputs are recorded, but less information about which inputs and outputs are clustered would be revealed, breaking the [common input heuristic](https://en.bitcoin.it/wiki/Common-input-ownership_heuristic)

Transactions compete to get included in blocks according to network fees they pay since each block is limited to a fixed weight. At a high level, each transaction weight pays some base costs (𝑏), per-input costs (𝑖) and per-output costs (𝑜). In reality not all inputs and outputs have equal cost but the principle can be explained assuming they do, and be backed up by real examples.

Take a fictional exchange with 5 BTC in their treasury selling 1 bitcoin each to Alice, bob, and Carol for example.

```
Exchange 5 btc  ->  1 btc to Alice
                   ~4 btc minus fees to Exchange
```

```
Exchange 4 btc  ->  1 btc to Bob
                   ~3 btc minus fees to Exchange
```

```
Exchange 3 btc  ->  1 btc to Carol
                   ~2 btc minus fees to Exchange
```

Each transaction would cost the exchange 𝑏 + 𝑖 + 2𝑜, and they would pass the fees onto their customers in order to make a profit. The sum of these costs would be 3𝑏 + 3𝑖 + 6𝑜, which would come out of the final ~2 BTC change the exchange keeps in the end.

## Old-school Payment Batching

Batching helps the exchange save time and money in two ways. First, the overall cost to post such a transaction is cheaper than the cost of making three individual transactions to produce the same result. Second, a single unspent output can fund multiple withdrawals without waiting for each one to settle.

your typical exchange withdrawal looks like this:

```
Exchange 5 btc  ->   1 btc to Alice
                     1 btc to Bob
                     1 btc to Carol
                    ~2 btc minus fees to Exchange
```

All else being equal, an exchange making this batch instead of three separate transactions will only pay 𝑏 + 𝑖 + 4𝑜 in fees, saving 2𝑏 + 2𝑖 + 2𝑜 compared to 3𝑏 + 3𝑖 + 6𝑜, at least 33% cheaper than making those three transactions separately. Second, the exchange does not have to wait for each withdrawal to settle before paying out the next one since they can service them all with a single UTXO. Sure, the exchange could keep multiple UTXOs ready for spending, but that is always going come at the cost of making even more transactions in preparation.

## Payjoin Payment Batching

What if Dave the depositor can payjoin? He gets a benefit of breaking some privacy heuristics, and he can save the exchange some fees that might be able to be pased on to him. Payjoin lets the exchange fund withdrawals with Dave's deposit in the same transaction.

```
Dave     3 btc  ->  1 btc to Alice
Exchange 2 btc      1 btc to Bob
                    1 btc to Carol
                   ~2 btc minus fees to Exchange
```

𝑏 + 2𝑖 + 4𝑜

Since Dave's sweep to the exchange "[cut-through](./why-payjoin/scaling#transaction-cut-through)" to Alice, Bob, and Carol,

1. The exchange never had to take on a new UTXO from Dave's deposit and pay fees to spend it.
2. The exchange saved the fixed costs of making a second transaction, since Dave paid them.
3. All parties enjoy better privacy since deposits and withdrawals are indistinguishable from an exchange consolidation, and these batched transactions are indistinguishable from individual transactions.

Dave knows that Payjoin was used, but not which outputs are withdrawals vs consolidations.
The Exchange can see everything as it could before, but an outside observer cannot without that information being leaked.
Alice, Bob, and Carol can't tell whether or not all inputs came from the exchange or include an outsider's deposit. They know they got paid and that's their main concern.

In total, the payjoin only cost

*1 × base costs + 2 × input costs + 2 × output costs*

saving at least 1/3 of the cost of a regular transaction, and fees were split between Dave and the Exchange by custom.[^1]

## Future Payjoin Batching

Bitcoin technically allows even more depositors to batch their transactions, too. Even though today's version of Payjoin only allows Dave to pay the exchange, future versions of Payjoin will allow others pay the exchange and each other in the same transaction too. More batching means more saving, and potentially more privacy too.

```
Dave     3 btc  ->  1 btc to Alice
Erin     1 btc      1 btc to Bob
Frank    2 btc      1 btc to Carol
Exchange 2 btc     ~5 btc minus fees to Exchange
```

However, such transactions are more difficult to coordinate, so it will take an effort to develop this new protocol and get it deployed. Integrating Payjoin V2 can save money, improve privacy, and help get to the next iteration that massively fixes bitcoin's privacy through batching. Batching Bitcoin, saving sats, and preserving privacy seem like different goals, but with a little communication, the three goals can be achieved in every single transaction.

[^1]: Let 𝑏 represent fixed costs, 𝑖 represent input costs, and 𝑜 represent output costs. The cost of the unbatched transactions is 2𝑏 + 3i + 3o. The cost of the batched transactions is 2𝑏 + 2𝑖 + 2𝑜. Thus, the savings from batching is calculated as 1/3(2𝑏 + 3𝑖 + 3𝑜) = 2/3(𝑏) + 𝑖 + 𝑜, which is less than 𝑏 + 𝑖 + 𝑜. In this example The unbatched virtual weight is 152.25 vB + 168.5 vB = 320.75 vB. The payjoin batched virtual weight is 211.25 vB. (211.25 vB / 320.75 vB) = ~0.66, so making these transactions without batching is over 1/3 smaller than with batching. Put another way (320.75 / 211.25 vB) = ~1.51, so making these transactions without batching costs more than 50% more than the cost of making them with payjoin.



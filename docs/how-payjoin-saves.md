---
sidebar_position: 1
---

# How Can Payjoin Save 16% on Transaction Fees?

Payment batching is the most common way for high-volume settlement services like exchanges and payment processors to save fees. But it has been limited to one party, the sender, combining multiple sends together. Ideally, multiple types of transfers could all be combined together. Imagine your deposit to an exchange was batched with others' withdrawals. This combination saves significant overhead compared to making individual transfers, [scaling Bitcoin](./why-payjoin/scaling). Before Payjoin, one could assume all inputs to a transaction were owned by sender. Payjoin breaks that [common input assumption](https://en.bitcoin.it/wiki/Common-input-ownership_heuristic) by including inputs owned by both sender and receiver, preserving [privacy](./why-payjoin/privacy) as a side effect. Implementing Payjoin batching is the next step to upgrade the whole Bitcoin network's scaling and privacy without any consensus change.

Transactions compete to get included in blocks according to network fees they pay since block space is limited. At a high level, each transaction pays for base costs (𝑏), per-input costs (𝑖) and per-output costs (𝑜). In reality not all inputs and outputs have equal cost but the principle can be understood assuming they do, and be backed up by real examples.

Take a fictional exchange with a 4 BTC coin in their treasury selling 1 bitcoin each to Alice, Bob, and Carol for example.

```
Exchange 4 btc  ->  1 btc to Alice
                   ~3 btc minus fees to Exchange
```

```
Exchange 3 btc  ->  1 btc to Bob
                   ~2 btc minus fees to Exchange
```

```
Exchange 2 btc  ->  1 btc to Carol
                   ~1 btc minus fees to Exchange
```

Each transaction would cost the exchange 𝑏 + 𝑖 + 2𝑜, and they would pass the fees onto their customers in order to make a profit. The sum of these costs would be 3𝑏 + 3𝑖 + 6𝑜, which would come out of the final ~2 BTC change the exchange keeps in the end. We're also ignoring some fees 𝑖 that would need to be paid to spend the change output in the future.

## Old-School Payment Batching

Batching helps the exchange save time and money in two ways. First, the overall cost to post such a transaction is cheaper than the cost of making three individual transactions to produce the same result. Second, a single unspent output can fund multiple withdrawals without waiting for each one to settle.

Your typical exchange withdrawal looks like this:

```
Exchange 4 btc  ->   1 btc to Alice
                     1 btc to Bob
                     1 btc to Carol
                    ~1 btc minus fees to Exchange
```

All else being equal, an exchange making this batch instead of three separate transactions will only pay 𝑏 + 𝑖 + 4𝑜 in fees, saving 2𝑏 + 2𝑖 + 2𝑜 compared to 3𝑏 + 3𝑖 + 6𝑜, at least 33% cheaper than making those three transactions separately. Second, the exchange does not have to wait for each withdrawal to settle before paying out the next one since they can service them all with a single UTXO. Sure, the exchange could keep multiple UTXOs ready for spending, but that is always going come at the cost of making even more transactions in preparation.

## Payjoin Payment Batching

What if Dave the depositor can payjoin? He gets a benefit of preserved privacy, and he can save the exchange some fees that could be passed on to him. Let's say Dave sweeps some bitcoins to the exchange:

```
Dave     3 btc  -> ~3 btc minus fees to Exchange
```

Without Payjoin, the exchange would have to take on a new UTXO from Dave's deposit and pay at least 𝑖 fees to spend it at some later date.

```
Exchange ~3 btc  ->  2 btc to Erin
(from Dave)         ~1 btc minus fees to Exchange
```

```
Exchange  4 btc ->    1 btc to Alice
                      1 btc to Bob
                      1 btc to Carol
                     ~2 btc minus fees to Exchange
```

The combined cost of these two withdrawals is 2𝑏 + 2𝑖 + 6𝑜. They also create 2 change outputs, which the exchange will have to pay 2𝑖 fees to spend in the future. Payjoin lets the exchange fund withdrawals with Dave's deposit in the same transaction:

```
Exchange 4 btc  ->  1 btc to Alice
                    1 btc to Bob
Exchange 3 btc      1 btc to Carol
(from Dave)         2 btc to Erin
                   ~2 btc minus fees to Exchange
```

Which only cost 𝑏 + 2𝑖 + 5𝑜, saving 𝑏 + 𝑜 compared to when Payjoin isn't used. On top of this, the exchange only creates one change output, which will cost 𝑖 fees to spend in the future. So the real comparison is 𝑏 + 3𝑖 + 5𝑜 versus 2𝑏 + 4𝑖 + 6𝑜, saving 𝑏 + 𝑖 + 𝑜 compared to when Payjoin isn't used, saving 16.66% the costs of transaction in this case.

Since Dave's sweep to the exchange "[cut-through](./why-payjoin/scaling#transaction-cut-through)" to Alice, Bob, Carol, and Erin,

1. The exchange never had to take on a new UTXO from Dave's deposit and pay fees to spend it.
2. The exchange saved the fixed costs of making a second transaction, since Dave paid them.
3. All parties enjoy better privacy since deposits and withdrawals are indistinguishable from an exchange consolidation, and these batched transactions are indistinguishable from individual transactions.

Dave knows that Payjoin was used, but not which outputs are withdrawals vs consolidations.
The exchange can see everything as it could before, but an outside observer cannot without that information being leaked.
Alice, Bob, Carol, Erin, or any outside observer can't tell whether or not all inputs came from the exchange or include a depositor's input. The exchange used less block space to save money they can pass onto the customer in the form of more competitive fees and the Bitcoin network sees more ambiguous transactions that helps everyone's privacy.

## Future Payjoin Batching

Bitcoin technically allows even more depositors to batch their transactions together too. Even though today's version of Payjoin only allows Dave to pay the exchange, future versions of Payjoin will allow others pay the exchange and each other in the same transaction too. More batching means more saving, and potentially more privacy too.

```
Dave     3 btc  ->  1 btc to Alice
Frank    1 btc      1 btc to Bob
Greg     2 btc      1 btc to Carol
Exchange 4 btc      2 btc to Erin
                    4 btc to Hal
                   ~1 btc minus fees to Exchange
```

However, such transactions are more complicated to coordinate, so it will take an effort to develop a new protocol and get it deployed. Integrating Payjoin V2 can save money, improve privacy, and help get to the next iteration that massively fixes Bitcoin's privacy through batching. Batching bitcoins, saving sats, and preserving privacy seem like different goals, but with a little joint effort all three can be satisfied in every single transaction.

---
image: /img/og/2023-05-09-interactive-payment-batching-is-better.png
title: Interactive Payment Batching is Better
description: Payjoin for More Than Privacy
date: 2023-05-09
authors: dangould
---

A high fee bitcoin always
[triggers](https://twitter.com/BTCsessions/status/1655733065426296832) a
[search](https://twitter.com/w_s_bitcoin/status/1655885695762808832) for
more efficient use of block space. Blockchain is a slow database, and
batching has got to be one of the oldest ways to optimize a database.
Lightning is interactive payment batching based on intermittent
settlement. Payjoin is interactive settlement batching. Merchant to
customer payjoin is what led to the formal [BIP 78
spec](https://github.com/bitcoin/bips/blob/master/bip-0078.mediawiki).
It's no surprise then that a merchant / customer frame stuck versus a
frame payment batching like lightning. Lightning has been batching for
scaling all along. The following outlines how payjoin fits into batched
transfer settlement infrastructure and how it helps prepare for the next
wave of blockspace scarcity while beating blockchain spies' most common
tools as a bonus.

<!-- truncate -->

The term \"payjoin\" is used to describe both an interactive way to
build transactions between peers on the web, aka Pay-to-Endpoint (P2EP),
and an ambiguous transaction structure, typically with many inputs and
two outputs that I dub *canonical payjoin*. Canonical payjoin looks like
transaction behavior that any wallet could make, but its inputs actually
come from more than one person. Breaking the assumption that all
transaction inputs belong to the same person breaks the foundation of
blockchain surveillance and the sole privacy problem left open in
Satoshi\'s whitepaper. In an effort to improve bitcoin\'s privacy
through payjoin adoption, I outline a number of ways payjoin can
significantly reduce fee expenditure and increase blockchain throughput
for both individual and enterprise circumstances.

Some of these new techniques preserve privacy for transactions otherwise
thought of as unambiguous and certainly traceable. The examples mostly
ignore mining fees for the sake of simplicity.

## Before the Batch

### **Naive Payments**

Payjoin without the joi is just payn. ouch.

    A's input0:  2 btc        output0:  4 btc B's address0
                         🔀
    A's input1:  3 btc        output1:  1 btc A's change

A typical bitcoin transfer from `A`lice to `B`ob looks like this. Note
that only the addresses and amounts are posted to chain with no further
relation between inputs and outputs. The named labels are not. Third
party analysts assume both inputs come from the same entity (because
they usually do). They also assume `output0` is the payment because
neither input is alone sufficient to make a payment of 4 btc.

### **Canonical Payjoin**

Payjoin foils that assumption because it lets Alice and Bob both
contribute inputs. What would be interpreted as a naive payment might
actually be a payjoin. Assuming both inputs always come from either Bob
or Alice is wrong.

    A's input0:  2 btc        output 0:  4 btc B's address0
                         🔀
    B's input1:  3 btc        output 1:  1 btc A's change

Alice only paid 1 btc to `output0`\'s 4 btc while merging it with Bob\'s
3 btc input too. Bob\'s 4 btc is not the 1 btc amount Alice paid, which
is not visible on chain.

## **Enter Output Substitution**

Payjoin [output
substitution](https://github.com/bitcoin/bips/blob/master/bip-0078.mediawiki#payment-output-substitution)
(`pjos`) lets a receiver like Bob substitute a proposed output with any
outputs of equal amount. BIP 78 `pjos` is insecure over relayed
communications and thus forbidden. BIP 78 receivers must run their own
authenticated server to use `pjos`. [Serverless
Payjoin](https://gist.github.com/DanGould/243e418752fff760c9f6b23bba8a32f9)
secures relayed `pjos`.

The following examines the use of this technique to prevent address
reuse, redirect funds to cold storage, forward payments, and batch
transactions for massive fee savings.

### **Minimum Effective Interaction**

Now for not-quite-payjoin but something still fun. Call that Payjoi. Joy
is back. Hah 🥁💥.

If Bob\'s wallet is empty or he\'s using a cold wallet this would still
work.

Imagine Bob\'s a bartender who posts his "payjoi" QR code on an the wall
at the bar:

    bitcoin:address0?pj=https://payjoin.bob.cash

Alice would scan it to propose the transaction as usual, but Bob returns
the payjoin proposal with one tiny change. By doing so he keeps his tips
private from nosy neighbors at the bar.

    A's input0:    2 btc        output0:  4 btc B's address1
                           🔀
    A's input1:    3 btc        output1:  1 btc A's change

See, Bob swapped `output0`\'s `address0` for `address1`. Other patrons
do not know of `address1` since Bob sent it online as a payjoin
proposal. They can't look up what they don\'t know.

### **Payment forwarding**

Toys aside, substitution is powerful. What if Bob planned to pay his
`C`loud provider next time he got paid. He could substitute Cloudy\'s
address instead of his `address1`.

    A's input0:    2 btc        output0:  4 btc C's address
                           🔀
    A's input1:    3 btc        output1:  1 btc A's change

Alice only sees Cloudy\'s address as unique, and the payjoin proposal is
authenticated by Bob, so both of them agree that this payjoin pays Bob.
Since transactions are atomic, Bob takes no custody of the funds going
to Cloudy either.

Bob could also turn this into a canonical payjoin by adding input. Or
instead, Bob could forward funds to his cold storage rather than to
Cloudy. That could be valuable if Bob\'s payjoin server hot wallet had
more funds than he was comfortable with keeping online. Alice even still
pays the miner fee as she would in any case. Bob saves the block space,
time, money and hassle of a making separate transaction to forward.

### **Receiver side Payment Batching**

We\'re going to make this more complex, because it scales bitcoin and
it\'s fun.

Imagine Bob is an exchange sitting on a few low-priority withdrawal
orders from `D`an of 0.6 btc and and `E`rin of 0.4 btc. When Alice
proposes a deposit, Bob may substitute a single output with many,
spreading the inbound amount from Alice across multiple addresses.
Instead of just *address* substitution he substitutes the entire output
with new ones.

    A's input 0:      2 btc        output 0:  0.99 btc  B's address0
                              🔀
    A's input1:       3 btc        output 1:  3    btc  A's change

                                   output 2:  0.4  btc  D's address

                                   output 3:  0.6  btc  E's address

Batching saves mining fees for Bob since Alice already pays for some
transaction fee. Bob can take any remaining mining fee costs from his
increased transaction\'s size out of his own output, `address0` shown
here receiving 0.99 btc to pay an additional 0.01 btc fee. Not shown,
Bob could even split Cloudy\'s output from the prior example to forward
Cloudy an exact invoice amount and keep the change.

[Prior](https://www.bullbitcoin.com/blog/announcing-batcher-by-bull-bitcoin-open-source-non-custodial-on-chain-wallet-batching-plugin-for-high-volume-bitcoin-enterprise-users)
[art](https://blog.bitgo.com/utxo-management-for-enterprise-wallets-5357dad08dd1)
[all](https://medium.com/@hasufly/an-analysis-of-batching-in-bitcoin-9bdf81a394e0)
[explores](https://bitcoinops.org/en/payment-batching/) sender-batched
transactions. It follows that inputs to batched transactions are assumed
to belong to the cluster of the entity making payments (Bob, in this
case). Receiver side payment batching kills this heuristic analysis,
providing multiple new interpretations for payments of few inputs and
many outputs.

### **Lightning Channels**

Yes, even [lightning channel
payjoin](https://chaincase.app/words/lightning-payjoin) outputs are
viable. Lightning channels are posted as 2-of-2 P2SH or P2TR addresses.

    A's input 0:  5 btc      output 0:  2 btc  B & his peer's ⚡️ channel
                         🔀
                             output 1:  3 btc  A's change

Bob\'s lightning output helps preserve privacy even more so because it
belongs to two parties, both Bob and his channel peer. When P2TR
channels are the norm, a stranger would not even know that `output0` is
for lightning. New standard lightning protocols allow for payjoin output
splicing and dual funded channels to achieve the common input
assumption-busting result even without BIP 78 as well.

### **Mix and Batch 🥣**

Combining it all forces multiple ambiguous interpretations of the
transaction graph. With basic networking, and no coordinator, Both Alice
and Bob can pay multiple parties beyond themselves, combine inputs and
consolidate funds without fear for being censored.

Interaction lets multiple ambiguous possibilities converge to preserve
bitcoin\'s inherent fungibility. No inconvenient, fee intensive,
pre-scheduled, time consuming mixing step required.

#### **Batch Sender and Receiver Transactions to Put a Cherry on Top 🍰**

    A's input 0:      2 btc    output 0:           1.5 btc  B's address1
                            🔀
    B's input 1:      4 btc    output 1:           2   btc  A's change

    B's input 2:      3 btc    output 2:           0.4 btc  B's ⚡️ channel

                               output 3:           2.5 btc  C's address
                               
                               output 4:           1   btc  E's address

                               output 5:           0.6 btc  D's address

                               output 6:           1   btc  F's address

Even though amounts aren\'t equal, these new payjoin constructions
provide significant ambiguity to foil vast swaths of heuristic analysis
being done today by breaking their most basic assumptions. Because of
payjoin\'s intra-transaction transfers from Alice to Bob, [CoinJoin
sudoku](http://www.coinjoinsudoku.com/advisory/) analysis does not
apply.

Even Alice and Bob preserve some privacy in the other\'s view. Even
though one knows the other\'s inputs, they cannot be certain that any of
their counterpart\'s outputs will end up in their counterpart\'s wallet
or if output substitution has been used.

## **Progress before rainbows 🌈 and unicorns 🦄**

Bob and Alice still know the subtransactions of their counterpart. As of
today, Bob still needs to run a server. They each know which inputs
belong to which counterpart. While two-party interaction can help a lot,
an adversarial counterparty could still report the other\'s chosen
inputs and outputs to build a cluster with an analysis firm. I know
those problems remain to be solved, but look how far ahead a simple HTTP
interaction can take us.

**Thanks** to Hunter Beast, Andrew \"Kukks\" Camilleri, Ishi, Kexkey,
Francis Pouliot, and Yashraj for reading drafts of this.

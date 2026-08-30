---
title: "How Cluster Fingerprints Damage Payjoin Privacy"
description: "Wallet clusters are fingerprintable not just based on the wallet software."
date: "2026-06-23"
authors:
- nothingmuch
tags:
- privacy
- research
---

Armin's [previous
post](https://payjoin.org/blog/2026/03/25/wallet-fingerprints-payjoin-privacy/)
on this subject, which demonstrates how fragile privacy can be in the presence
of transaction fingerprints originating from the wallet software, is not the
full story from the point of view of a deanonymization adversary.

Suppose Alice pays Bob in a typical Payjoin transaction. The input belonging to
Alice is associated with cluster A, and the one belonging to Bob is associated
with cluster B. The transaction looks like a regular on chain payment, and the
wallet fingerprints are consistent. A [naive analysis may
conclude](https://x.com/bitgould/status/2069257701289558330) that so long as
those fingerprints are identical there is no problem anymore.

In this case the adversary is missing (at most) [1.58 bits of
entropy](https://spiralbtc.substack.com/p/the-scroll-4-intersection-attacks),
needed to decide between three scenarios:

1. the transaction is not a PayJoin, implying that the two clusters should be
   merged into a single cluster based on the common input ownership heuristic.
2. the transaction is a Payjoin, and the first output belongs to Alice and
   should be merged into cluster A, the second belongs to Bob, and likewise
   should be assigned to cluster B.
2. the transaction is a Payjoin, but the first output belongs to Bob, while the
   second belongs to Alice.

Note that this upper bound on the entropy estimate assumes that these scenarios
are equally probable, i.e. the maximal uncertainty, but that assumes the
adversary is very limited, and can't look beyond just the transaction, which of
course is not a limitation any real adversary is constrained by.

In reality, the adversary has all of cluster A and cluster B to consider, and
even if all of the wallet fingerprints between clusters A and B are the
identical -- the exact same nLocktime patterns, signature grinding behavior,
etc -- these are not the only attributes a cluster will be associated with. The
larger the clusters the more information the adversary may be able to access.
To keep things simple, we can even assume that neither cluster has any KYC
information, or network level metadata such as IP addresses associated with it,
even though a real adversary will often have access to such information given
the state of Bitcoin.

## Cluster fingerprints not arising from software

So what information still labels a cluster?

### Feerates

Probably the most obvious is the feerates used. While wallet software can [leak
information](https://b10c.me/observations/03-blockchaincom-recommendations/)
through the choice of feerate they expose to users, even if we assume that is
consistent different users may make different choices based on their
circumstances.

If this pattern is consistent, suppose for instance that cluster A on average
targets a faster confirmation than cluster B, the spending transactions of the
two Payjoin outputs are more likely than not to follow this pattern as well, so
if Alice's preferences or constraints with regards to finality are distinct
enough from Bob's, that can distinguish their transactions even if they both
use the same fee estimation data and algorithms.

### Temporal patterns

Another widely understood cluster fingerprint is temporal activity patterns.
Do most of transactions of cluster A or B occur during business hours of a
particular time zone or region? Are these patterns easily distinguished? As
before, we must ask how well do the observed patterns of the post-Payjoin
spending transactions match these clusters.

### Value distribution

The distribution of values used in transactions (not just the Payjoin
transaction) can reveal information about the state of the wallet (especially
if many of a cluster's UTXOs are known, and coin selection algorithms can be
simulated). With knowledge of the value distribution in the (observed) cluster
as a whole, the subsequent transactions which use the outputs of the Payjoin
transaction can be evaluated in terms of how likely they are to be the result
of Alice or Bob's actions following that.

For example, an adversary may see a transaction that spends an output of the
Payjoin transaction, as well as one or more UTXOs that are not overtly
associated with cluster A or cluster B. Based on those coins' values, it would
have been more efficient to construct the same transaction using one of Alice's
UTXOs from cluster A, but the unlabeled coin would make more sense than all of
the coins in cluster B, then this is evidence (though not very strong evidence)
in favor of the interpretation where this post spend transaction involves Bob,
and not Alice.

### Clustering cascades

Note that the post-Payjoin transactions are also not isolated, and be linked to
post-Payjoin clusters of their own. The question then becomes: given clusters
A, B, C, and D, is it more reasonable to merge A with C and B with D or A with
D and B with C?

Such a link may be established unambiguously through a completely unrelated
transaction, for example suppose Bob spends his payment output, generating a
change output, and eventually uses that change output as one of the inputs to a
transaction which also needed some other UTXO to be used as input. If that
transaction is successfully clustered, then even though the Payjoin transaction
seems private on its own, in the context of this broader clustering structure
it may be trivial to assign the payment output to Bob and break the Payjoin
privacy model.

The distinction here from the concern raised in previous section is that in
this case any additional coins in the post spend are overtly linked to either
cluster A or cluster B. In other words, it's a structural property of the
cluster graphs, not just trying to decide based on the statistics of the
observables in the clusters which seems more likely.

This particular approach of course compounds with all of the previously
mentioned non software derived fingerprints, clustering is typically a problem
that lends itself to divide & conquer strategies. If information is revealed in
one transaction, supporting a particular clustering analysis (in a better
world, past the threshold of reasonable doubt) then this information can be fed
back and through a process of elimination propagate into the clustering
analysis of other transactions and clusters.

### Social graph

Perhaps the most damning of these is the curse of dimensionality. Since the
transaction graph is overt, and the cluster graph is just the transaction graph
with certain coin vertices fused together. Technically this would be a
multigraph since there can be more than one edge between any pair of clusters.
This is meaningful information for the adversary. Any edges between the
clusters indicate likely payments between those clusters' entities. The more
such links, the more economically related the owners of the clusters are. Since
this is derived from on chain data, information pertaining to the timing and
value of those payments is of course also observable.

As the saying goes, "tell me who your friends are and I will tell you who you
are": the relationships we have, social relationships, business relationships,
are very revealing, and unavoidable. Such graphs are incredibly rich sources of
information.

And indeed such leaks have indeed been the basis of several important results
in the privacy literature, in particular [several
papers](https://scholar.google.com/scholar?q=shmatikov+narayanan) by Vitaly
Shmatikov and Arvind Narayanan which all exploit this richness. [Shmatikov has
presented on this topic](https://www.youtube.com/watch?v=7HYh7HJT0fI) if you
prefer lectures and would like to learn more.

## Conclusion

Given the entropist "privacy budget", for lack of a better term, for Payjoin
transactions is so limited, even very weak signals may be sufficient to
overwhelm the ambiguity they generate even under the most favorable
circumstances.

While these observable properties of the clusters themselves are not as clear
cut as wallet fingerprints, even wallet-fingerprint-uniform clusters will
typically contain orders of magnitudes more information than is required for
deanonymization, and much of that information will be useful for
deanonymization.

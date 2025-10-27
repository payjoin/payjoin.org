---
title: Fees, BOB Radio, and Reinforcements
description: Just an update
date: 2023-05-12
authors: dangould
---

This past week's fee market demand brought up much discussion on
scaling. I'm seeing more frequent independent thinkers land on
interactive batching like payjoin as a solution. Lots of people
understand batching as when an enterprise sends lots of transfers to
many parties in one transaction. I call this single-source batching,
since only one party has input to the batch. Payjoin enables
multi-source batching, where two parties contribute to a batch paying
one another and various third parties while consolidating their own
wallets to save in fees.

<!-- truncate -->

Unlike single-source batching, multi-source optimizes payment flows
requiring sequential transactions, like exchange withdrawals to fund
lightning channels, into a single transaction. The new ability to batch
sequential transactions significantly improves [what was thought to be
the best case](https://bitcoinops.org/en/payment-batching/) fee savings
of payment batching. The release of this week's [interactive batching
with
payjoin](https://payjoin.substack.com/p/interactive-payment-batching-is-better)
essay could not have been timed any better. I'm happy to be able to
share even more payjoin progress updates with you this week too.

BOB Radio invited me to speak on [Bitcoin Privacy Tools and Practices
with Gandlaf21, Dan Gould & Giacomo
Zucco](https://youtu.be/1k3RaPA5cA0). Giacomo listed the three main
levels of privacy to concern yourself with, and we broke down how to
address each one, aiming past controversy to deliver actionable advice.
[BO฿ Space](https://www.bobspaces.net/), is a Bangkok based bitcoin
incubator and co-working space. Those building and designing on bitcoin
are encouraged to apply for residency. Their first cohort will be
anounced May 15.

Finally, I'd like to congratulate [Will
Owens](https://twitter.com/owenswill14). Payjoin has a new dedicated
contributor. Will has been recruited to [integrate payjoin into the
BDK-CLI](https://github.com/bitcoindevkit/bdk-cli/issues/149) by the
[Summer of Bitcoin](https://www.summerofbitcoin.org/) internship
program. He will deploy a second [Bitcoin Dev
Kit](https://github.com/bitcoindevkit/) payjoin integration, following
[BitMask](https://bitmask.app/)'s. This work should establish a common
pattern and documentation to integrate payjoin with any wallet using the
kit. Will's stated his goal "to help make Bitcoin more accessible,
secure, and private for all users" and his plan to use payjoin as an
entrypoint to address Bitcoin fungibility, privacy, security, and
efficiency in his application. Will, I am eagerly looking forward to
collaborating with you and witnessing the exceptional work we will
accomplish together. Congratulations.

<img alt="Art" src="/img/fees-bob-art.webp" />

Sincerely,

Dan

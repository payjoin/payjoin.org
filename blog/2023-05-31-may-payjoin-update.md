---
title: May Payjoin Update
description: Payjoin for Batching, Liana Timelocks, and Splicing, oh my!
date: 2023-05-31
authors: dangould
---

Hey Joiners,

Payjoin support and adoption has been growing this spring. May opened up
a number of discussions from new contributors for ideas to use payjoin
to solve problems other than privacy.

<!-- truncate -->

## Practical Payjoin Adoption

At the Miami Bitcoin Conference, "[A 60yo woman bought a Passport with
Payjoin in
person](https://twitter.com/sethforprivacy/status/1659687132175245316?s=20)"
from Foundation Devices. Real world adoption is the whole point, so I'm
celebrating this one. Cheers to the Foundation team for their leadership
in this direction.

BTCPayServer [fixed a payjoin
bug](https://github.com/btcpayserver/btcpayserver/issues/4689#event-9302415852)
for the next release. I'm excited to try it out. Thank you Kukks and
Pavlenex. The OG payjoin software continues to evolve.

The Payjoin Dev Kit library [payjoin
v0.8.0](https://crates.io/crates/payjoin/0.8.0) has been released.
Receiver error handling has been overhauled and tested with other
independent payjoin compatible software. Wallets who enjoy persistent
internet connectivity should reach out to evaluate an integration. It
works.

<img src="/img/construction-workers.webp" />

## New Advanced Payjoin Uses

You may have seen some of the new ways to use payjoin to reduce fees in
in [the last post about
batching](https://payjoin.substack.com/p/interactive-payment-batching-is-better).
Friends at Bitcoin Optech picked it up in [Newsletter #251](<https://bitcoinops.org/en/newsletters/2023/05/17/>). Dave Harding revived Greg Maxwell's [transaction
cut-through](https://bitcointalk.org/index.php?topic=281848.0) idea to
describe down this kind of cooperative batching. The payjoin protocol
handles the accounting authentication that Greg left as an open question
in the 2013 bitcointalk post introducing the idea. Thanks to Optech host
a twitter space where I was able to add more color on the idea next to
\@glozow, \@actuallyCarlaKC, Severin Bühler, Mike Shmidt, and Murch.
[Have a
listen](https://twitter.com/bitgould/status/1659171126889832448?s=20).

Dusty Daemon, the champion of lightning splicing exclaimed "[Payjoins
and Splicing are a match made in
heaven!](https://twitter.com/dusty_daemon/status/1657111629220270095)"
Dusty is funded by OkCoin to pursue splicing. I'm looking forward to
exploring this match in more depth this summer.

I was able to meet with the [Liana](https://wizardsardine.com/liana/)
team in Miami. Liana is a wallet that lets you recover coins after time
passes if you lose the keys. Project lead Édouard Paris introduced the
genius [idea](https://github.com/wizardsardine/liana/issues/534) to
leverage payjoin's interactivity to automatically refresh that timelock
upon receipt of funds. The advanced use cases just keep rolling in.

## Wrapping Up

As we look forward to June, it\'s clear that payjoin is more than a
simple protocol---it\'s an exciting space for experimentation,
collaboration and innovation. And it\'s a testament to the strength of
our community, which is never shy about exploring new ideas and pushing
boundaries.

Whether it\'s practical adoption, protocol improvements, or advanced use
cases, every advancement brings us one step closer to a more resilient
Bitcoin network. I would like to thank all contributors and supporters
who make this possible.

So here\'s to another month of sharing, learning, and growing. If you
have thoughts or ideas, don\'t hesitate to share. Your participation
helps drive the payjoin community forward.

And remember, every time you use payjoin, you\'re not just enhancing
your own privacy, you\'re also helping to strengthen the privacy of the
entire Bitcoin ecosystem. So keep joining, and let\'s make June the
biggest month yet for payjoin.

See you next month, joiners!

Best,

Dan

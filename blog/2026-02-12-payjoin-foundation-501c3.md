---
title: Payjoin Foundation Granted 501(c)(3) Status
description: Payjoin Foundation is now a recognized 501(c)(3) nonprofit organization
date: 2026-02-12
authors: dangould
tags: [Announcement, Foundation]
---

Payjoin Foundation has received approval from the Internal Revenue Service recognizing the Foundation as tax-exempt under Section 501(c)(3) of the Internal Revenue Code effective July 23, 2025. We announce it now because we have just received the determination letter from the IRS. We can now accept tax-deductible charitable contributions to support our mission to advance practical privacy in peer-to-peer digital transactions. We're finalizing our online donation flow; if you'd like to contribute now, please see our [donate page](/donate).

Having an organized foundation with a dedicated budget enables us to recruit talent
to solve specific problems rather than recommend an external org make a grant to each
individual contributor whose talents may serve the mission more effectively on deep
technical work than making it legible to an organization without a technical
mission.

I'll highlight [@chavic](https://github.com/chavic)'s work on Dart
bindings as an example. Before we met Chavic, we had [a controversial monthslong, fraught discussion](https://github.com/orgs/payjoin/discussions/673)
about all the work needed to be done to make Dart bindings work for those
implementations who were most interested in jumping on the chance to run
production Async Payjoin pilots.
Both Cake Wallet and Bull Bitcoin Mobile apps are
built in the Dart programming language, while Payjoin Dev Kit is built in Rust.
PDK's strategy is to maintain a strongly-typed, well-tested core in Rust that
we bind to various downstream languages for end users.

We reached out to Chavic, a young developer from
Zambia, because of his public experience building
Dart bindings from Rust outside of the Bitcoin space. Since "make all the library bindings
work" might be hard to convey to "make Freedom Money" donors, I'd wager his
applications to outside orgs would spend half a year or more in Bitcoin Grant
Purgatory. Instead, we recruited his help in the span of a week and updated our Dart
bindings before
that grant would get approved. Not only are we seeing the results of our teamwork with Chavic in Payjoin Dev Kit,
even [Bitcoin Dev
Kit](https://github.com/bitcoindevkit/bdk-ffi/issues/836) is using his work now.
This kind of recruiting is only possible by the same team that's having the
burning technical issues, and organization lets us move much faster in this regard.

Nonprofit structure also frees us from some limitations of for-profit orientation,
aligning our incentives with users' most pressing but hard-to-monetize concerns. Our accountability is to the public interest, not to quarterly
returns. This makes it easier for us to make hard decisions prioritizing a long
term view. Formalizing responsibility and accountability of Foundation
leadership helps donors and users know that decisions are not made lightly. It
also gives contributors clear direction and makes establishing a culture a more
explicit, deliberate endeavor based on a formal written mission and norms. The Foundation is overseen by [our board](https://payjoin.org/blog/2025/08/08/announcing-payjoin-foundation) and operated for public benefit. Donations do not provide control over technical direction. We'll publish periodic updates on our work and funding as our reporting practices mature.

Thanks to all of our [supporters](https://payjoin.org/supporters/), without
which this work would not be possible. OpenSats and [Cake
Wallet](https://payjoin.org/blog/2025/12/05/thank-you-cake-wallet) get a
shoutout here for being the very first to fund the Foundation itself. Thank you.

---
image: /img/og/2023-05-03-tracking-growth-in-payjoin-adoption.png
title: Tracking Growth in Payjoin Adoption
description: Dual-funding, Cahoots, ... SNICKER, and LNURL?
date: 2023-05-03
authors: dangould
---

[Payjoin adoption](https://en.bitcoin.it/wiki/PayJoin_adoption) has been
increasing steadily since its introduction in 2018. Payjoin started as a
privacy-enhancing technique to allow merchants to combine their Bitcoin
with customers, to save fees, and to better secure the origin and
destination of their funds. It makes it more difficult for third parties
to track and analyze Bitcoin transactions in general, which is a
significant benefit for anyone who values financial privacy. This past
week I documented the growth of the technology in a few big tables on
the Bitcoin wiki.

<!-- truncate -->

::: captioned-image-container
<figure>
<a
href="https://substackcdn.com/image/fetch/$s_!hQ2P!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8f86ee7e-a0f6-45a4-b2f5-d76c6fde10fb_1193x1239.png"
class="image-link image2 is-viewable-img" target="_blank"
data-component-name="Image2ToDOM"></a>
<div class="image2-inset">
<img
src="https://substack-post-media.s3.amazonaws.com/public/images/8f86ee7e-a0f6-45a4-b2f5-d76c6fde10fb_1193x1239.png"
title="The table of payjoin adoption status from the wiki"
class="sizing-normal"
data-attrs="{&quot;src&quot;:&quot;https://substack-post-media.s3.amazonaws.com/public/images/8f86ee7e-a0f6-45a4-b2f5-d76c6fde10fb_1193x1239.png&quot;,&quot;srcNoWatermark&quot;:null,&quot;fullscreen&quot;:null,&quot;imageSize&quot;:null,&quot;height&quot;:1239,&quot;width&quot;:1193,&quot;resizeWidth&quot;:null,&quot;bytes&quot;:350794,&quot;alt&quot;:&quot;The table of payjoin adoption status from the wiki&quot;,&quot;title&quot;:null,&quot;type&quot;:&quot;image/png&quot;,&quot;href&quot;:null,&quot;belowTheFold&quot;:false,&quot;topImage&quot;:true,&quot;internalRedirect&quot;:null,&quot;isProcessing&quot;:false,&quot;align&quot;:null,&quot;offset&quot;:false}"
srcset="https://substackcdn.com/image/fetch/$s_!hQ2P!,w_424,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8f86ee7e-a0f6-45a4-b2f5-d76c6fde10fb_1193x1239.png 424w, https://substackcdn.com/image/fetch/$s_!hQ2P!,w_848,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8f86ee7e-a0f6-45a4-b2f5-d76c6fde10fb_1193x1239.png 848w, https://substackcdn.com/image/fetch/$s_!hQ2P!,w_1272,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8f86ee7e-a0f6-45a4-b2f5-d76c6fde10fb_1193x1239.png 1272w, https://substackcdn.com/image/fetch/$s_!hQ2P!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8f86ee7e-a0f6-45a4-b2f5-d76c6fde10fb_1193x1239.png 1456w"
sizes="100vw" data-fetchpriority="high" width="1193" height="1239"
alt="The table of payjoin adoption status from the wiki" />
<div class="image-link-expand">
<div class="pencraft pc-display-flex pc-gap-8 pc-reset">
<div class="pencraft pc-reset icon-container restack-image">
<img
src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld2JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXJlZnJlc2gtY3ciPjxwYXRoIGQ9Ik0zIDEyYTkgOSAwIDAgMSA5LTkgOS43NSA5Ljc1IDAgMCAxIDYuNzQgMi43NEwyMSA4IiAvPjxwYXRoIGQ9Ik0yMSAzdjVoLTUiIC8+PHBhdGggZD0iTTIxIDEyYTkgOSAwIDAgMS05IDkgOS43NSA5Ljc1IDAgMCAxLTYuNzQtMi43NEwzIDE2IiAvPjxwYXRoIGQ9Ik04IDE2SDN2NSIgLz48L3N2Zz4="
class="lucide lucide-refresh-cw" />
</div>
<div class="pencraft pc-reset icon-container view-image">
<img
src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld2JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1heGltaXplMiBsdWNpZGUtbWF4aW1pemUtMiI+PHBvbHlsaW5lIHBvaW50cz0iMTUgMyAyMSAzIDIxIDkiPjwvcG9seWxpbmU+PHBvbHlsaW5lIHBvaW50cz0iOSAyMSAzIDIxIDMgMTUiPjwvcG9seWxpbmU+PGxpbmUgeDE9IjIxIiB4Mj0iMTQiIHkxPSIzIiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iMyIgeDI9IjEwIiB5MT0iMjEiIHkyPSIxNCI+PC9saW5lPjwvc3ZnPg=="
class="lucide lucide-maximize2 lucide-maximize-2" />
</div>
</div>
</div>
</div>
</figure>
:::

The BIP78 payjoin protocol has been gaining traction in recent years and
is now supported by several wallets beyond merchants. Recent additions
include the [BitMask](https://bitmask.app) browser extension (mainnet
launch impending),
[nolooking](https://github.com/chaincase-app/nolooking) for LND, and
[payjoin-client](https://github.com/payjoin/rust-payjoin) for Bitcoin
Core. BIP78 allows sender and recipient to negotiate a payjoin
transaction over the web, by allowing both parties to contribute
transaction inputs. This foils the primary heuristic strangers use to
surveil Bitcoin users. This protocol is gaining popularity as more users
become aware of its benefits and as more wallets support it. Still more
payjoins are made with protocols other than the most popular BIP78 even
if those making them might not think of them that way.

## Payjoin Beyond BIP78

In addition to BIP78, there are other ways to spend Bitcoin with inputs
from multiple sources that are still fundamentally payjoin transactions,
too. Having included them on the [Payjoin
Adoption](https://en.bitcoin.it/wiki/PayJoin_adoption) page their
relationship to payjoin should be examined.

[Dual-funded channels](https://bitcoinops.org/en/topics/dual-funding/)
(DFC) are a type of Lightning Network channel where both channel peers
contribute funds to the channel, rather than just one. This allows them
to transact on the Lightning Network in both directions in contrast to
channels with a source of funds on only one side. This can reduce
transaction costs and increase transaction speed. Sometimes classical
payjoins are called, Pay-to-Endpoint (P2EP), with emphasis on their
coordination using an interactive web address instead of a static
bitcoin address. Like P2EP, Lightning nodes establish channels via
publically addressable identifier.

Cahoots's Stowaway and Stonewallx2 are two other privacy-enhancing
Bitcoin transaction methods that combine inputs and outputs between
users to secure transaction details. Stowaway makes a payjoin, while
Stonewallx2 makes a 2-party equal ouptut CoinJoin. Cahoots methods use a
Tor-based
[Soroban](https://medium.com/samourai-wallet/wallet-update-0-99-96-introducing-soroban-adc9a36a7ddb)
rendezvous to a [PayNym](https://paynym.is/). PayNym serves as an
endpoint that can be looked up in a public directory to establish secure
connection over Tor relays.

## Payjoin sans P2EP

[SNICKER](https://gist.github.com/AdamISZ/2c13fb5819bd469ca318156e2cf25d79)
is another type of transaction where multiple users contribute input to
a transaction. Unlike P2EP, its users scan public data on the blockchain
to find eligible counterparties. They transact without ever
communicating directly. The SNICKER proposal is focused on equal amount
CoinJoins, but could in theory be used to make transactions including
transfers like payjoin, too (although between non-input-contributing
users). Because it's non-interactive and common-input heuristic
breaking, it serves us here to distinguish between payjoin and P2EP.

## P2EP sans Payjoin

[LNURL](https://github.com/lnurl/luds/blob/luds/01.md) is a protocol for
generating Lightning Network payment requests and for providing
additional Lightning-related information over the web. It enables
Lightning wallets and services to provide users with QR codes or links
that can be used to initiate Lightning payments or to access additional
Lightning-related features. LNURL can also be used to facilitate other
Lightning-related tasks such as opening channels and managing liquidity.
Being [nonchalantly ubiquitous](https://github.com/lnurl/luds#services)
in the lightning world, it proves the pay-to-endpoint concept is
convenient and valuable to users.

My week had a few interruptions, so I made the most of it by collecting
all of the payjoin projects evaluations in pockets of free time. Ready
to evaluate payjoin for your project? Get in touch.

Have a great week.

Dan

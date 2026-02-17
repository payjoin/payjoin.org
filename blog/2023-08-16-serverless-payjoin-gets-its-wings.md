---
image: /img/og/2023-08-16-serverless-payjoin-gets-its-wings.png
title: Serverless Payjoin Gets its Wings
description: We've got resources and lots of contributors. Time to find consensus.
date: 2023-08-16
authors: dangould
---


On July 27, HRF announced a 2 BTC bounty for a production deployment and
specification of a version 2 payjoin spec to receive payjoin without
hosting a server. This past week I proposed a new BIP and call for
feedback in search of consensus on what that spec should be. Many new
ideas were born. This is my attempt to make sense of them.

<!-- truncate -->

This idea first manifest itself in [this January mailing list
post](https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2023-January/021364.html),
inspired by attempts to address the hosting barrier with Tor or
application-specific payjoin implementations. Incompatible
implementations are the status quo, so payjoin use is limited in
practice. The good news is that community and industry show great
interest in coming to consensus so that a new version has as wide
adoption. The technology to guarantee privacy and usability is now
available to do so too.

Adam Gibson and Dave Harding helped define a concrete threat model and
proposed better crypto to address it. Symphonicbtc and Christopher Allen
proposed encoding specifics to improve user experience to keep payjoin
request QR codes small inside the bitcoin URI standard. Apparently, the
day after the bounty was announced, [Kukks submitted a slick proposal
using nostr](https://twitter.com/MrKukks/status/1690662070935564289)
extending [/dev/fd0's nostr payjoin
implementation](https://twitter.com/1440000bytes/status/1667281729286012929)
for both network transport and encryption. Contributors on Twitter,
Nostr, and Stacker News and in private all voiced feedback that they
want to see change and shared the features they want most.

## A way to send messages

To send payjoins we need a way for sender and receiver to communicate to
one another. To make it work when one party is offline, we need a box in
the middle to store and forward their messages. The original BIP
proposes WebTransport, a modern web standard with low latency in mobile
environments, and backwards compatible fallback to HTTP. WebSockets
could work fine as well.

Popular feedback has been to use nostr. I love nostr for sharing notes.
It's simple, censorship resistant, and has created a cult following. The
people I want to talk to share notes there too. Under the hood, Nostr
chooses WebSockets, JSON, and requires each message be signed. There are
already dozens of free relays anyone can post and listen to. Rijndael
[summed it
up](https://twitter.com/rot13maxi/status/1689306769422458880): "nostr is
MQTT for web devs," meaning anyone can publish and subscribe to the
messages they're interested in.

The main argument to use nostr transport is that relays are running for
free already so ([mistakenly) no payjoin-specific relay has to be
run](https://stacker.news/items/224197). Kukks's implementation uses
nprofile identifiers in the \`pj=\`URI parameter to share identities and
relays at the same time. I say this is mistaken because as-is, such a
solution would not be backwards compatible, and to make it backwards
compatible, it would need payjoin-specific components. Without them,
payjoin requests using nprofile identities would fail silently in
current implementations, leading to even more fragmentation users
already complain about. Fragmentation is the problem we'd like to
address in the first place. Ammending payjoin v1 instead of introducing
v2 closes the door on the opportunity for us to upgrade to PSBTv2 as
well.

<figure>
<img alt="Stacker News commenters share plight over incompatible payjoin protocols" src="/img/stacker-news.webp" />
  <figcaption>Stacker News commenters share plight over incompatible payjoin protocols</figcaption>
</figure>

PSBT version 1 was created to fascilitate cold storage signing and
multisig coordination. It was built before interactive protocols were as
popular so does not support input and output map mutation. [PSBT version
2 does](https://chaincase.app/words/interactive-transactions-psbt). I
see this opportunity to specify a new application protocol to inspire
software to upgrade. [Cooperative transaction building scales bitcoin by
batching
better](https://payjoin.substack.com/p/interactive-payment-batching-is-better),
saving fees as a result, and offering the opportunity to preserve
everyone's privacy with as in payjoin.

One worthwhile possibility is to convince the 10+ [extant BIP 78 payjoin
implementations](https://en.bitcoin.it/wiki/PayJoin_adoption) to just
upgrade in lockstep. They all have a history of collaboration. In my
opinion, we need unanimous support to justify such a change, and are
better off upgrading to a new payjoin version 2 so we can use PSBTv2
without hiccups.

The bigger issue I see with nostr as transport without payjoin-specific
components is that it would rely on nostr cryptosystems, namely NIP 4,
which comes with a damning [security
warning](https://github.com/nostr-protocol/nips/blob/master/04.md#security-warning):
"This standard does not go anywhere near what is considered the
state-of-the-art in encrypted communication between peers, and it leaks
metadata in the events, therefore **it must not be used for anything you
really need to keep secret.**"Payjoin messages really need to keep
secret. NIP 4 is not viable for payjoin.

## Well kept secrets

Payjoin is a technology whose users depend on it for privacy, and that
privacy only holds if the messages stay secret. The privacy basis for
payjoin transactions is their indistinguishably from many types of other
typical transactions and the inability of an outside observer to
distinguish which output belongs to a which input, even with knowledge
that the transaction you're looking at is payjoin. If the first message
coordinating a payjoin, the Fallback PSBT, were comrpromised, the result
would provide no privacy at all. The message it contains both the
transfer amount and the inputs belonging to the sender which the Payjoin
PSBT would otherwise protect.

The original Serverless Payjoin proposal encrypted the messages using a
symmetric key shared in the payjoin request URI for simplicity. Careful
consideration of user expectation will reveal that this can lead to an
attack. If the relay finds out the URI it would be able to decrypt
message contents and also forge messages as the receiver and steal funds
through output substitution, replacing the receiver's output with their
own. Bitcoin users understand that leaking addresses in URIs can leak
privacy, but don't expect doing so to put their funds at risk. This
attack can be prevented by sharing a receiver public key in the BIP 21
instead of a secret, and transmitting a sender public key inside the
first encrypted message.

Diffie-Hellman key exchange before messaging would allow both messages
to be protected from a single party key compromise with the cost of an
additional round of communication. I suggest Serverless Payjoin foregoes
this tradeoff for the sake of convenience, instead relying on
per-session asymmetric keys. That way, payjoins can be done in a single
round of communication while the only way messages would be exposed were
if they were compromised before or during the session as long as they
are safely deleted afterward and never reused.

## Metadata matters

While Nostr could be used for per-session encryption the same way, a
culture of key reuse and copying secrets into web pages has emerged as
the way to "log in." Even [Kukks's proposal accommodates key
reuse](https://github.com/Kukks/BTCPayServer.BIP78/blob/80f8d5f8c294cb9a88a76d7b8f5d08e80dac5182/BTCPayServer.BIP78.Nostr/README.md?plain=1#L56),
which gives me further pause about relying on Nostr standards for
message secrecy. Payjoin messages on Nostr would be trivial to identify.
A malicious relay could collect messages signed by reused keys and put
payjoin participants' privacy at risk.

Beyond the contents of the messages themselves, a relay having knowledge
of IP addresses associated with sender and receiver as well as the
timing of candidate payjoin transactions is in a special position to
carry out targeted attacks to spoil any privacy benefits. If it can
correlate IP address activity with on-chain transactions by timing, it
can reveal the underlying transfers that the payjoin would otherwise
keep private. Knowing the order of connections could reveal which IP was
the sender and which was the receiver. In order to keep payjoin data
secure, this metadata must be protected as well as message contents.

> To keep your secret is wisdom; but to expect others to keep it is folly
>
> --- Samuel Johnson

Adam Gibson and Matt Corallo have suggested that payjoin messages be
padded in order to prevent a relay from correlating them with
transactions on chain. I wholeheartedly agree. This simple change
protects users at virtually no cost. Whether to use a constant size
(based on the maximum size of the encreypted PSBT and parameters) or
random padding remains unspecified. I'd love to hear your suggestions
here.

Adam noted that timing could be used to correlate IP-related payloads
with on-chain activity on bitcoin-dev. He resurfaced Tor as a solution,
which I'd like to avoid. BIP 78 Tor receivers do exist, but they're
incompatible with senders who don't support Tor. In order for a
Serverless Payjoin solution to grow, new clients of version 2 should be
able to communicate with every other v2 client and not get siloed into
the choices of specific clients. And many wallets who'd prioritize
privacy to some extent still choose not to use Tor because of the
usability hurdles it presents.

A random delay between the sender receiving a transaction and
broadcasting it may be the simplest way to break up correlation between
the time a payjoin was coordinated and the time it made it into mempools
or on chain. Unfortunately this doesn't keep the relay from linking the
IPs to senders and receivers.

A hopeful alternative might be Oblivous HTTP. [OHTTP is a relatively new
IETF
standard](https://ietf-wg-ohai.github.io/oblivious-http/draft-ietf-ohai-ohttp.html)
that works on the same principles as Tor, but without the complexity of
its own decentralized consensus mechanism and the latency symptom of
sending requests over a great many hops. Instead, it does the minnimum
necessary to separate IP addresses from requests. OHTTP is supported by
iOS, Cloudflare, Chromium and Firefox, and has maturing libraries in
Rust and Go. [In Firefox it is used to separate a user's IP address from
its DNS
queries](https://ubunlog.com/en/Firefox-112-has-already-been-released-and-presents-improvements-in-menu-functions-and-more/).
I have confidence it will become widely available to support our goal of
payjoin adoption.

<figure>
<img alt="Overview of Oblivious HTTP" src="/img/oblivious-http.webp" />
<figcaption>Using OHTTP, payjoin sender and receiver each interact with the payjoin relay target resource through another oblivious relay resource so that the payjoin relay never sees their IP address. WebTransport is built on HTTP/3 and could be protected with OHTTP.</figcaption>
</figure>

In the context of a relayed payjoin it also makes a lot of sense. The
payjoin relay server would have to understand OHTTP as a gateway
Resource The receiver allocated buffer on the relay assumes the role of
target resource. It could take requests from any OHTTP relay resources
which would be operated by entities independent to the payjoin relay,
like VPN providers you pay to be independent or non-profit organizations
with reputations of being so.

Such an architecture would be a major simplification compared to Tor and
provide a similar privacy benefit by keeping the clients' IP addresses
from the payjoin relay, increasing the costs of targeted attacks
mentioned earlier by requiring collusion between multiple independent
entities. An architecture based on OHTTP could even allow backwards v1
compatibility for senders, but would not provide the same privacy
guarantees.

## Let's come to consensus

Serverless Payjoin is meant to lift barriers to adoption and increase
real world payjoin by improving compatibility across varied software
environments. A successful lift may require payjoin-specific relays, but
that's no news to bitcoin. Every wallet already runs some infrastructure
on behalf of themselves or their clients, and one payjoin relay could
support many wallets and services. The protocol is being vetted and
specified in public, so you'll be able to self-host too.

Getting encryption and metadata protected is as critical as the
transaction structure to maintain privacy. If we can't get the existing
implementations to commit to a timely upgrade, backwards compatibility
should be considered necessary to accomodate payjoin v1 senders. We
should take this opportunity to leverage PSBTv2. I'm confident in the
BIP process to deliver quality software and encourage feedback on [the
evolving BIP
gist](https://gist.github.com/DanGould/243e418752fff760c9f6b23bba8a32f9).
Thanks for your participation, bitcoin privacy is better for it.

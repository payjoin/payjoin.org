---
image: /img/og/2023-06-05-june-payjoin-media-multitudes.png
title: June Payjoin Media Multitudes
description: PDK, TFTC, BDK Integration, Payjoin + Nostr, A Payjoin V2 Protocol, the Boston Bitcoin Scene and UX Research
date: 2023-06-05
authors: dangould
---

Hi All,

Here's the past month of Payjoin progress recapped. We hit quite a few
media features and development milestones. Don't miss the [Payjoin UX
Research call
tomorrow](https://github.com/BitcoinDesign/Meta/issues/548?utm_source=substack&utm_medium=email)
with the Bitcoin Design Community.

<!-- truncate -->

## Payjoin Dev Kit is Launched

PDK is finally here to make Payjoin a drop in interactive transaction
system for any wallet or service. The [release
post](https://payjoindevkit.org/blog/pdk-an-sdk-for-payjoin-transactions/)
details the history of development and support as well as a high level
roadmap of PDK's approach to plugging payjoin in everywhere.

## PDK on TFTC

<iframe width="100%" height="300px" src="https://www.youtube.com/embed/3HIWfJjgfsY" title="Dan Gould | Bitcoin Privacy and the Payjoin Dev Kit" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Marty Bent got a whiff of PDK and wanted to chat right away. What
resulted is an audio FAQ on the current state of Payjoin and Payjoin Dev
Kit.

## Postr: Payjoin using Nostr

/dev/fd0 Proposed a version of Serveless Payjoin using Nostr to discover
one another, handle authentication, and encryption. This is one of the
slickest Payjoin proofs of concept I've ever seen.

FIXME
[POSTR video]

## Payjoin V2 Goals Defined

A handful of developers in Prague got the first look at a BIP draft for
a new version 2 Payjoin protocol. We came to rough consensus on the
goals of such a protocol. It surprised me to hear how much desire there
was for a more generic Pay-to-Endpoint standard.

It sounded like the devs in Prague were sick of scanning QR codes that
were too dense and want to have the option to push more data between
devices for interactive transaction negotiation over the internet beyond
payjoin. I like to think near-field communication (NFC) technology will
fix this problem, as it has largely replaced swiping magnetic strips for
credit cards.

Ignoring the QR problem to focus back on Payjoin specifics we came up
with this shortlist of goals: To enable receipt of a Payjoin without
hosting a secured public server or losing privacy when using a proxy, to
minimize upstream dependencies, To handle errors messaging in a way that
could work with multiple underlying transport protocols, and to make the
protocol asynchronous.

Getting the community involved to agree on what such a standard will
look like is the only way we're going to be able to deploy it across a
range of industry applications.

## BDK-CLI Payjoin Support Drafted

Will Owens has been hard at work integrating Payjoin into BDK (using
PDK, of course). [The
draft](https://github.com/bitcoindevkit/bdk-cli/pull/156) has been
released and review has already discovered some abstractions to
integrate Payjoin into BDK even more easily in the future.

This work also shines a light on Payjoin developer tooling as more
developers get their hands on integrations with different requirements
but common libraries.

## Privacy, Incentives, and Bitcoin as Religion on The Conor Chepnik Podcast

<iframe width="100%" height="300px" src="https://www.youtube.com/embed/7WHQuO0U4JE" title="Payjoin🟠🔀" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Conor and I jammed out in person to chat. Beyond the usual Payjoin
details we cover the Boston Bitcoin Scene, how Bitcoin can be viewed as
a Religion, BitDevs' service as a reliable plug and play Bitcoin Meetup
and some of the reasons contributing to Bitcoin is meaninful.

## BOB Space's First Cohort Begins

BOB Space collaboration started in earnest this past month. We're
getting organized and collaborating on infrastructure, design, and
development. I am looking forward to working more closely with this team
as time goes on. I'm grateful for all of the collaboration that's
already meshing together.

## [Payjoin UX Research Call](https://github.com/BitcoinDesign/Meta/issues/548?utm_source=substack&utm_medium=email) Tomorrow

This research will be presented to elicit community feedback in 2
parts:\
First I will walk through Payjoin, what it is and why it is important
for privacy, Next Yashraj will walk us through Case Study research done
in order to understand the Payjoin user experience. The incentives and
objectives for both senders & receivers, as well as payjoin UX on both
sides will be covered. Hope to see you there.

<div>

------------------------------------------------------------------------

</div>

Please give your feedback by [finding me on
Nostr](https://nostr.directory/p/bitgould) or on Twitter by [tweeting
\@bitgould](https://twitter.com/bitgould). Bitcoin privacy is being
solved thanks in no small part to your help.

Sending love to you & yours,

Dan

---
title: "Payjoin Probing Attacks: Facts, Mitigations, and Why Payjoin Still Wins for Privacy"
description: ""
date: "2025-03-31"
authors: dangould
tags: [privacy, integrations]
---


The following is a conclusive address of concerns around UTXO probing attacks on
Payjoin, clarification of why current mitigations are effective, and definitive
argument for Payjoin adoption. Payjoin, the fundamental interactive
transaction batching protocol, saves fees by reducing the effective size of
transfers and improves privacy by disrupting common blockchain surveillance
heuristics. While probing attacks exist in theory, they're costly to pull off,
mitigated in practice, and are not a meaningful barrier to adoption.

<!-- truncate -->

## The Probing Attack Explained

Probing entails an attacker initiating payjoins they plan to abort in order to learn
about the coins in a receiver's wallet. Because Payjoin receivers respond to
potential senders with payjoin proposals including their coins, senders
learn about those coins. If there were no cost to obtain a payjoin proposal, this
attack would earn attackers new information about receivers they could not otherwise obtain.

The earliest payjoin specifications explicitly address these attacks. See these sections [in BIP
79](https://github.com/bitcoin/bips/blob/master/bip-0079.mediawiki#contributed-input-choice)
and [in BIP 78](https://github.com/bitcoin/bips/blob/master/bip-0078.mediawiki#on-the-receiver-side-utxo-probing-attack).

## Current Probing Mitigations

### Minimum-value Policy

Minimum-value policies impose a floor price above which receivers will respond
to senders with payjoin proposals including receiver coins.

#### Minimum Fee Rate

Receivers may choose only to respond to senders providing a fallback transaction of a
minimum fee rate. If a sender aborts, the receiver may broadcast, spending the
sender's fallback fee.

#### Minimum Transfer

Receivers may choose only to respond to senders providing a fallback transaction
transferring the receiver a minimum amount. If a sender aborts, the receiver may
broadcast, costing the sender their transfer amount plus fees.

### Fallback Broadcast

Payment processors operating as Payjoin receivers should be the most concerned about
probing attacks since they respond to requests to make payjoins
automatically. Manual receivers generate requests for each would-be probing
attempt, which makes repeated attack requests a non-concern, since the receiver
will be necessarily aware that multiple requests are being made and aborted.

By specification, automated payment processors operating as Payjoin receivers must broadcast the
sender's valid fallback transaction after an expiration timeout if
receivers don't see their Payjoin broadcast. This enforces a
minimum relay fee rate policy by default.

The mechanism may also be implemented by manual peer-to-peer receivers
as an additional precaution. A broadcast may be triggered manually or
automatically after an appropriate amount of time passes, for example, after an Async
Payjoin session expires.

### Input Replay

Automated payment processors should respond to senders using fallback transactions containing
the same sender inputs with the same receiver input of their own. This secures
the floor cost imposed by the above mitigations.

### Session Policy Binding

In Async Payjoin, receive sessions are bound to the bitcoin URI used to request them.
Receivers may bind specific policies to specific URIs given to
individual senders depending on the perceived level of trust.

## Refuting Core Concerns

- **Claim**: Probing is costless<br/>
  **Reality**: Attackers must pay fees or risk paying the receiver the minimum
  value when their fallback is broadcast.

- **Claim**: Current mitigations are ineffective<br/>
  **Reality**: Correct implementations strictly limit info leaks and raise
  attacker costs significantly. No reports of probing abuse are known.

- **Claim**: Attackers can always spend enough resources to probe anyway<br/>
  **Reality**: Active attackers can, in theory, target privacy anyway (dust,
  Sybil attacks), but Payjoin shifts attacks from passive (cheap, scalable), to
  active (expensive, detectable).

- **Claim**: Avoid Payjoin entirely for safety<br/>
  **Reality**: Without Payjoin, normal consolidation leaks more information
  passively than probing would actively. Payjoin significantly reduces overall
  leakage, even for those who haven't yet adopted the protocol. Imagine a world
  without payjoin: someone who sends you bitcoin likely learns about coins of
  yours anyway once they're consolidated, because common input heuristic would
  hold without Payjoin adoption.

- **Claim**: Payjoin doesn't let you select coins, which would prevent leaks<br/>
  **Reality**: Payjoin is a peer-to-peer batching mechanism. Payjoin peers may
  select to use any coins based on local labels or any other preference.
  However, even complete label information alone is often insufficient to enable
  users to preserve the privacy of their activity. Coin selection is an
  unrelated concern.

## How Payjoin Plugs the Leaks

- **Breaks common input heuristic**: Breaks Satoshi's assumption that all inputs
  come from the sender.
- **Hurts change identification**: Makes it harder to determine which output is
  payment and which is change.
- **Eliminates standalone consolidations**: Receivers consolidate in a batch
  with their payments, making it cheaper to break the heuristics than leak info.
- **Improves global privacy**: Payjoins can look like non-payjoins,
  compounding difficulty for surveillance adversaries.

## Edge Cases and Real-World Context

Attacks exist in theory, particularly if implementation guidelines aren't
followed. Such cases are implementation issues — not Payjoin protocol flaws. The
Payjoin Dev Kit guides implementors to make misuse difficult.

While subtle attacks like dusting do occur on Bitcoin, probing Payjoin at scale
is costly and practically limited.

## How to Secure your Payjoin Implementation

- Use Payjoin Dev Kit to follow best practices by default.
- For custom implementations, follow the BIP guidelines and mitigation checklist in this article.
- Ask the Payjoin Dev Kit team for help to ensure your implementation takes
  appropriate precautions like request persistence and fallback broadcast.

## Why Payjoin Wins

Payjoin's savings and privacy benefits vastly outweigh theoretical probing
risks. Adopting Payjoin offers good will to the entire bitcoin network, since
higher rate of payjoin usage increases privacy for even non-payjoin
transactions. Payjoin Dev Kit abstracts the best practices to address known concerns
about probing to make Payjoin receivers strictly better off.

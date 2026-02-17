---
image: /img/og/2025-04-08-payjo-in-redis-misconfiguration.png
title: "Payjo.in Directory Security Incident: Misconfiguration May Have Exposed Some Payjoin v1 Messages"
description: Due to a docker misconfiguration the `payjo.in` directory server had an open redis database, allowing unauthorized parties to observe exchanges between pairs of senders which only support BIP 78 and receivers which support BIP 77.
date: 2025-04-08
authors: nothingmuch
tags: [security]
---


Due to a docker misconfiguration, the `payjo.in` directory server had an open
redis database, allowing unauthorized parties to observe exchanges between pairs
of senders which only support BIP 78 and receivers which support BIP 77.

Some payjoins which used the backwards compatibility of BIP 77 receivers with
BIP 78 senders during this period may thus not have the common input ownership
heuristic protection they otherwise would, but the unauthorized access does
not change the nature of the risk regarding the user custody of funds.

<!-- truncate -->

## Background

The payjoin directory is a store and forward server that allows BIP 77
receivers to accept both BIP 77 and BIP 78 payjoin requests from senders
asynchronously. Clients use GET requests to poll for messages, and POST
requests to send them. Messages are stored in a Redis database.

When both parties use BIP 77, messages exchanged through the directory are end
to end encrypted and all requests are made over Oblivious HTTP (OHTTP), so both
data and metadata are protected from the directory.

BIP 78 does not utilize such encryption, instead relying on the transport layer
for data privacy. Nor does it require the use of OHTTP (but some implementations
utilize Tor for metadata privacy). Therefore when a BIP 78 sender initiates a
payjoin to a BIP 77 receiver the directory server is able to observe the
sender's Original PSBT as well as the receiver's Proposall PSBT response.

## Misconfiguration

The `payjo.in` directory was configured using docker compose on an Ubuntu linux
host.

The docker compose setup [unnecessarily published the redis port on all
interfaces](https://github.com/payjoin/rust-payjoin/pull/413/files#diff-3f63197097d5d0eb6ccdd4dc7417f3ba7ffed24f3e0edba87bd4fa459cc83a84R43-R44).
Although the ufw firewall was configured to only allow ports that were meant to
be public, ufw is a frontend to iptables and [docker's use of iptables bypasses
ufw's
policies](https://docs.docker.com/engine/network/packet-filtering-firewalls/#docker-and-ufw),
which left port 6379 [publicly
accessible](https://www.shodan.io/host/172.81.183.21) without access control.

## Attack & Discovery

Unknown parties accessed the redis server through the publicly accessible port.
They configured the redis instance [as a readonly
replica](https://redis.io/docs/latest/commands/replicaof/) of an attacker
controlled master, which resulted in error responses from the directory.

Error responses were first reported on March 24th. Due to a bug
(since [fixed](https://github.com/payjoin/rust-payjoin/pull/630)), the errors
were misreported as related to bad client request. Restarting the service
seemed to resolve the issue, but upon closer investigation, they
were discovered to be operational errors, indicating the redis database was read
only. This was a result of misconfiguration that led to unauthorized access,
with the attacker issuing a `REPLICAOF` command making the directory's redis
database a readonly replica of an unrelated attacker controlled database.

Unfortunately logs from the full duration of the exposure were not retained,
since restarting the service through docker compose did not retain that
information. Only the period between April 1st and April 2nd were retained,
where the configured master was unavailable.

### Timeline

- 2025/03/24 18:24 UTC: Error responses first reported, server restarted
- 2025/04/02 17:01 UTC: Bad client request investigated and compromise discovered
- 2025/04/02 18:24 UTC: New server provisioned and started with secured redis port

## Impact

Use of the `KEYS`, `GET` and `PSYNC` Redis commands was not restricted,
potentially allowing any party to obtain a copy of any messages observed by the
directory. Whether or not a copy of the messages observed by the directory were
collected is unknown.

The messages exchanged between BIP 78 sends to BIP 77 receivers are not
encrypted, so their contents may have been leaked to unknown 3rd parties
through such access.

Knowledge of the Original PSBT allows interpretation of the final
payjoin transaction (if one is produced), because the sender and receiver's
inputs and outputs can be identified utilizing the information that is supposed
to stay off chain.

BIP 77 senders and receivers are unaffected due to HPKE based end to end
encryption. BIP 77 receivers which opted out of BIP 78 protocol initiations by
broadcasting the transaction extracted from the Original PSBT transaction were
also unaffected since the information exchanged ends up being publicly broadcast
in this scenario.

## Mitigation

The docker compose configuration was
[updated](https://github.com/payjoin/rust-payjoin/pull/634)
to no longer publish ports of internal services.

Preliminary vulnerability scanning is also now in place.

As an additional precaution, a new server was provisioned for the payjo.in
host.

On the operational side, hardening, and re-evaluation of logging, monitoring
and vulnerability scanning, as well as on the software side, simplification of
the service architecture to reduce the attack surface are also planned.

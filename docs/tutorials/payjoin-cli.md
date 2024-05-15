---
sidebar_position: 1
title: payjoin-cli
description: Learn how to do a payjoin with the reference implementation
---

Enough talk, let's do a payjoin! [Payjoin Dev Kit (PDK)](https://payjoindevkit.org/) ships with a reference implementation to demonstrate sender and receiver functionality, called `payjoin-cli`. It supports both version 1 and version 2.

In this tutorial, we'll look at doing a version 2 send and receive using `payjoin-cli`. Remember to reference the payjoin v2 flow below for reference:

![Payjoin v2 Flow](../how-it-works/img//v2.png)

Let's get started!

### Prerequisites
First, make sure you've read through and understand how [payjoin v1](./how-it-works/v1) and [payjoin v2](./how-it-works/v2) work.

Next, ensure you have [`cargo`](https://doc.rust-lang.org/cargo/getting-started/installation.html) and [Docker](https://docs.docker.com/get-docker/) installed. Then, install [`payjoin-cli`](https://github.com/payjoin/rust-payjoin/tree/master/payjoin-cli):
```shell
cargo install payjoin-cli --version 0.0.5-alpha --features v2
```

Check that it installed correctly and get a list of commands and options:
```shell
payjoin-cli --help
```

You should see:
```shell
Transfer bitcoin and preserve your privacy

Usage: payjoin-cli [OPTIONS] <COMMAND>

Commands:
  send
  receive
  help     Print this message or the help of the given subcommand(s)

Options:
  -r, --rpchost <rpchost>          The port of the bitcoin node
  -c, --cookie-file <cookie_file>  Path to the cookie file of the bitcoin node
      --rpcuser <rpcuser>          The username for the bitcoin node
      --rpcpass <rpcpass>          The password for the bitcoin node
      --ohttp-keys <ohttp_keys>    The ohttp key config as a base64 encoded string
      --ohttp-relay <ohttp_relay>  The ohttp relay url
  -e, --retry                      Retry the asynchronous payjoin request if it did not yet complete
  -h, --help                       Print help information
```


Next, we'll need to create two directories: one for the `sender`, and one for the `receiver`:

```shell
mkdir sender receiver
```
#### Setting up our regtest wallets

Let's create two [regtest](https://developer.bitcoin.org/examples/testing.html#regtest-mode) wallets and fund them. Remember, both the sender and receiver need UTXOs to be able to payjoin, so both wallets must be funded. 

We can use a tool called [`regtest-util`](https://github.com/jbesraa/regtest-util), which will set up two wallets named `sender` and `receiver` and fund them each with 5050 and 50 bitcoin, respectively.

```shell
cargo install regtest-util

regtest-util
```

You should see some output like:
```shell
77df377a06c87c6ba2e3ccec51bc2be30cb23c95b876b89ce2231e78d3ecfdaa
[/Users/username/.cargo/registry/src/index.crates.io-6f17d22bba15001f/regtest-util-0.1.0/src/main.rs:51:5] &wallets = []
[/Users/username/.cargo/registry/src/index.crates.io-6f17d22bba15001f/regtest-util-0.1.0/src/main.rs:53:9] "creating sender wallet" = "creating sender wallet"
[/Users/username/.cargo/registry/src/index.crates.io-6f17d22bba15001f/regtest-util-0.1.0/src/main.rs:59:9] "creating receiver wallet" = "creating receiver wallet"
[/Users/username/.cargo/registry/src/index.crates.io-6f17d22bba15001f/regtest-util-0.1.0/src/main.rs:93:5] "sender balance: {}" = "sender balance: {}"
[/Users/username/.cargo/registry/src/index.crates.io-6f17d22bba15001f/regtest-util-0.1.0/src/main.rs:93:5] sender_client.get_balances().unwrap().mine.trusted.to_btc() = 5050.0
[/Users/username/.cargo/registry/src/index.crates.io-6f17d22bba15001f/regtest-util-0.1.0/src/main.rs:97:5] "receiver balance: {}" = "receiver balance: {}"
[/Users/username/.cargo/registry/src/index.crates.io-6f17d22bba15001f/regtest-util-0.1.0/src/main.rs:97:5] receiver_client.get_balances().unwrap().mine.trusted.to_btc() = 50.0
```

If you see this, both your wallets have been setup and funded correctly on `localhost:18443/sender` and `localhost:18443/receiver`.

:::note

`18443` is the port used for regtest. `8333` is the port used for mainnet, testnet uses ..., and signet uses ...

The names `sender` and `receiver` are wallet names that have been preconfigured by our `regtest-util`. If you set this up yourself your wallet names may vary.

:::

### Setup `config.toml` Files

Both `sender` and `receiver` need a `config.toml` file specifying a few options to payjoin. The following options are possible:

```shell
# Note: either pass the .cookie file location or the rpcuser and rpcpass, not both.
bitcoind_cookie=
bitcoind_rpcuser=
bitcoind_rpcpass=
bitcoind_rpchost=


# Payjoin Parameters
# The payjoin directory server
pj_endpoint=
# The OHTTP relay that will forward requests to the OHTTP Gateway, which will forward to the pj_endpoint directory
ohttp_relay=
# Optional. The HPKE keys which need to be fetched ahead of time from the pj_endpoint for the payjoin packets to be encrypted. These can now be fetched and no longer need to be configured.
ohttp_keys=
```

There is a payjoin directory server running at https://payjo.in which we can use for this demo, and an OHTTP relay https://pj.bobspacebkk.com that will forward to the OHTTP Gateway that sends to https://payjo.in. We can setup our `config.toml` like so:

Create a `config.toml` in the `receiver` directory like so:

```
# receiver
#        |
#        config.toml
# 
# Default credentials for regtest-util docker instance.
bitcoind_rpcuser="foo"
bitcoind_rpcpass="qDDZdeQ5vw9XXFeVnXT4PZ--tGN2xNjjR4nrtyszZx0="
bitcoind_rpchost="http://localhost:18443/wallet/receiver"

pj_endpoint="https://payjo.in"
ohttp_relay="https://pj.bobspacebkk.com"
```

We'll create a very similar one in the `sender` directory, only with the wallet name changed to `sender`:

```
# sender
#        |
#        config.toml
# 
# Default credentials for regtest-util docker instance.
bitcoind_rpcuser="foo"
bitcoind_rpcpass="qDDZdeQ5vw9XXFeVnXT4PZ--tGN2xNjjR4nrtyszZx0="
bitcoind_rpchost="http://localhost:18443/wallet/sender"

pj_endpoint="https://payjo.in"
ohttp_relay="https://pj.bobspacebkk.com"
```

### Receiver asynchronous payjoin

Let's run `payjoin-cli --help` again:

```shell
payjoin-cli --help

Transfer bitcoin and preserve your privacy

Usage: payjoin-cli [OPTIONS] <COMMAND>

Commands:
  send
  receive
  help     Print this message or the help of the given subcommand(s)

Options:
  -r, --rpchost <rpchost>          The port of the bitcoin node
  -c, --cookie-file <cookie_file>  Path to the cookie file of the bitcoin node
      --rpcuser <rpcuser>          The username for the bitcoin node
      --rpcpass <rpcpass>          The password for the bitcoin node
      --ohttp-keys <ohttp_keys>    The ohttp key config as a base64 encoded string
      --ohttp-relay <ohttp_relay>  The ohttp relay url
  -e, --retry                      Retry the asynchronous payjoin request if it did not yet complete
  -h, --help                       Print help information
```

We are mainly interested in the `receive` command and the `--retry` option. The `--retry` option allows us to attempt to a previous command again, so that we don't have to be continuously online to receive the payjoin.

To start, in the `receiver` directory:

```shell
payjoin-cli receive 10000
```

You should see output like the following:

```shell
Listening at 0.0.0.0:3000. Configured to accept payjoin at BIP 21 Payjoin Uri:
bitcoin:bcrt1qhnp46xudlnz3uv6eppv82p8wm03pnc0kezuhcq?amount=0.0001&pj=https://payjo.in/An3zPJr9NyGgwCx9W-YsojUkMxv8-I7BXHK6nlN3a7z3&pjos=0&ohttp=AQAg3c9qovMZvPzLh8XHgD8q86WG7SmPQvPamCTvEoueKBsABAABAAM
```

This command has done a couple things:
- Fetched the OHTTP public key from the target (?)
- Enrolled a subdirectory `An3zPJr9NyGgwCx9W-YsojUkMxv8-I7BXHK6nlN3a7z3` at directory `payjo.in`
- Created a BIP 21 URI containing the desired address, amount, payjoin subdirectory (`&pj=https://payjo.in/An3zPJr9NyGgwCx9W-YsojUkMxv8-I7BXHK6nlN3a7z3`), [disabled output substitution](https://github.com/bitcoin/bips/blob/bc3123e1dab1c5b08d6f934b11b4d741107ac386/bip-0077.mediawiki#:~:text=To%20support%20version%201%20senders%20the%20directory%20acts%20as%20an%20unsecured%20payjoin%20server%20so%20pjos%3D0%20must%20be%20specified%20in%20the%20URI.) for backward compatibility with v1 payjoin (`&pjos=0`), and added the OHTTP key param `&ohttp=AQAg3c9qovMZvPzLh8XHgD8q86WG7SmPQvPamCTvEoueKBsABAABAAM`

The receiver can go offline at this point to wait for the **Original PSBT** from the sender, so that there's a fallback transaction in case the sender goes offline again. Try it by hitting `CTRL-C`:

```shell
Listening at 0.0.0.0:3000. Configured to accept payjoin at BIP 21 Payjoin Uri:
bitcoin:bcrt1qhnp46xudlnz3uv6eppv82p8wm03pnc0kezuhcq?amount=0.0001&pj=https://payjo.in/An3zPJr9NyGgwCx9W-YsojUkMxv8-I7BXHK6nlN3a7z3&pjos=0&ohttp=AQAg3c9qovMZvPzLh8XHgD8q86WG7SmPQvPamCTvEoueKBsABAABAAM
^C
receiver ~
```

Now we must (out of band) get this BIP 21 to the sender. In our case, let's copy it and set it as an environment variable to make the `send` command more reusable:

```shell
BIP_21="bitcoin:bcrt1qhnp46xudlnz3uv6eppv82p8wm03pnc0kezuhcq?amount=0.0001&pj=https://payjo.in/An3zPJr9NyGgwCx9W-YsojUkMxv8-I7BXHK6nlN3a7z3&pjos=0&ohttp=AQAg3c9qovMZvPzLh8XHgD8q86WG7SmPQvPamCTvEoueKBsABAABAAM"
```

Now, let's send it:

```shell
payjoin-cli send $BIP_21 --fee-rate=2
```

:::note

Note that optimal fee rates will vary in a real-world environment.

:::

You should see some output like:

```shell
payjoin-cli send $BIP_21 --fee-rate=2

Sending fallback request to https://pj.bobspacebkk.com/
Sent fallback transaction
```


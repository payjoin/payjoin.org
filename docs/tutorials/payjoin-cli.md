Enough talk, let's do a payjoin! [Payjoin Dev Kit (PDK)](https://payjoindevkit.org/) ships with a reference implementation to demonstrate sender and receiver functionality, called `payjoin-cli`. It supports both version 1 and version 2.

In this tutorial, we'll look at doing both a version 1 and a version 2 send and receive using `payjoin-cli`. Let's get started!
### Prerequisites
First, make sure you've read through and understand how [payjoin v1](/docs/how-it-works/v1) and [payjoin v2](/docs/how-it-works/v2) work. We will be performing the v2 flow below:

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

You should have [bitcoind/bitcoin-cli](https://bitcoin.org/en/download) installed and setup before continuing. Once installed, start the bitcoind regtest daemon:

```shell
bitcoind -regtest
```

You should see some output like:

```shell
2024-05-23T12:22:49Z Bitcoin Core version v26.99.0-4b1196a9855d (release build)
2024-05-23T12:22:49Z Script verification uses 7 additional threads
2024-05-23T12:22:49Z Using the 'arm_shani(1way,2way)' SHA256 implementation
2024-05-23T12:22:49Z Default data directory /Users/user/Library/Application Support/Bitcoin
2024-05-23T12:22:49Z Using data directory /Users/brandonlucas/Library/Application Support/Bitcoin/regtest
2024-05-23T12:22:49Z Config file: /Users/user/Library/Application Support/Bitcoin/bitcoin.conf
2024-05-23T12:22:49Z Config file arg: fallbackfee="0.00001"
2024-05-23T12:22:49Z Command-line arg: regtest=""
```

Then, in another terminal window, let's create a `sender` and `receiver` wallet:

```shell
bitcoin-cli -regtest createwallet sender

...

{
  "name": "sender"
}
```

```shell
bitcoin-cli -regtest createwallet receiver

...

{
  "name": "receiver"
}
```

Now, let's mine some regtest coins so that each wallet has UTXOs:

```shell
bitcoin-cli -regtest -rpcwallet="sender" generatetoaddress 200 "$(bitcoin-cli -regtest -rpcwallet="sender" getnewaddress)"
```

This command does the following:
- `-regtest`: Ensures that we're running commands on our local `regtest` network
- `-rpcwallet="sender"`: Chooses the `sender` wallet to run commands for
- `generatetoaddress`: This is a regtest-only command that quickly allows us to mine regtest coins. The first parameter is `nblocks` -- the number of blocks to mine. The second parameter is the address to send the block reward coins to: In this case we're passing the result of `getnewaddress` as the parameter, which will resolve to an address like: `bcrt1q4c8m92qq80pvr3gglruzf5jy3n7sn6munzeyyv`.
:::

::note: Coins generated from mined blocks are considered [*immature*](https://bitcoin.stackexchange.com/questions/1991/what-is-the-block-maturation-time) until after 101 confirmations, so we're mining 200 to allow us to immediately use some UTXOs.

:::

Let's do the same for our receiver:

```shell
bitcoin-cli -regtest -rpcwallet="receiver" generatetoaddress 200 "$(bitcoin-cli -regtest -rpcwallet="receiver" getnewaddress)"
```

Great! Now if we run `listunspent`, we can see our UTXOs

```shell
bitcoin-cli -regtest -rpcwallet="receiver" listunspent
```

```shell
bitcoin-cli -regtest -rpcwallet="sender" listunspent
```

You should see a list of objects like:

```shell
  {
    "txid": "0908b8a4d37206dd275e1caf628e0a9f7340b98ef6740172bcc5e5597fe16264",
    "vout": 0,
    "address": "bcrt1qspe0x0q42f0h0m3mu34s0nulqusgfdapukv3q9",
    "label": "",
    "scriptPubKey": "00148072f33c15525f77ee3be46b07cf9f072084b7a1",
    "amount": 0.00019073,
    "confirmations": 200,
    "spendable": true,
    "solvable": true,
    "desc": "wpkh([1f89cbf3/84h/1h/0h/0/0]02890c91e6b92c47ff9abe3324906614b805a859b0b8b9e9cdc7397b52dd735452)#smetlyuw",
    "parent_descs": [
      "wpkh(tpubD6NzVbkrYhZ4XfdTBENU12qqHj32MzXjngXtLcyG53oZa3tNEjCuKTAmUsvAC6A6QQuC87yrP4gw6QSEf8vcbW1gFS8YY4Enh3EMQTGHVbF/84h/1h/0h/0/*)#rmw7rh8q"
    ],
    "safe": true
  }
```

If so, then great! We can begin using `payjoin-cli`.

:::note

`18443` is the port used for regtest. `8333` is the port used for mainnet.

:::

### Setup `config.toml` Files

Both `sender` and `receiver` need a `config.toml` file specifying a few options to payjoin. 
There is a payjoin directory server running at https://payjo.in which we can use for this demo, and an OHTTP relay https://pj.bobspacebkk.com that will forward to the OHTTP Gateway that sends to https://payjo.in.

Here is a sample `example.config.toml`:

```shell
##
## Payjoin config.toml configuration file. Lines beginning with # are comments.
##

# Bitcoin RPC Connection Settings
# ------------------------------


# The RPC host of the wallet to connect to.
# For example, if the wallet is "sender", then default values are:
# 	- mainnet: http://localhost:8332/wallet/sender
# 	- testnet: http://localhost:18332/wallet/sender
# 	- regtest: http://localhost:18443/wallet/sender
# 	- signet: http://localhost:38332/wallet/sender
bitcoind_rpchost="http://localhost:18443/wallet/sender"


# The RPC .cookie file used only for local authentication to bitcoind.
# If rpcuser and rpcpassword are being used, this is not necessary.
# Found in data directory, which is located:
#	Linux: ~/.bitcoin/<NETWORK>/.cookie
# 	MacOS: ~/Library/Application Support/Bitcoin/<NETWORK>/.cookie
# 	Windows Vista and later: C:\Users\YourUserName\AppData\Roaming\Bitcoin\<NETWORK>\.cookie
# 	Windows XP: C:\Documents and Settings\YourUserName\Application Data\Bitcoin\<NETWORK>\.cookie
# bitcoind_cookie=


# The rpcuser to connect to (specified in bitcoin.conf).
bitcoind_rpcuser="user"


# The rpcpassword of the user to connect to (specified in bitcoin.conf).
bitcoind_rpcpassword="password"

## Payjoin Settings
## ----------------


# The payjoin endpoint which coordinates the transaction. In v2, this is the payjoin directory.
pj_endpoint="https://payjo.in"


# (v2 only) The OHTTP relay that will forward requests to the OHTTP Gateway, which will forward to the pj_endpoint directory.
ohttp_relay="https://pj.bobspacebkk.com"


# (v2 only, optional) The HPKE keys which need to be fetched ahead of time from the pj_endpoint for the payjoin packets to be encrypted.
# These can now be fetched and no longer need to be configured.
ohttp_keys="AQAg3c9qovMZvPzLh8XHgD8q86WG7SmPQvPamCTvEoueKBsABAABAAM"


# (v1, receiver only) The port for v1 receiving servers to bind to.
port="3000"
```

Note that this is a full list of possible options; we will only be using the necessary options for `sender` and `receiver` from above.

Create a `config.toml` in the `receiver` directory like so:

:::

:::note

If you did not set `rpcuser` and `rpcpassword` in your `<bitcoin-data-directory>/regtest/bitcoin.conf`, then you must set the `bitcoind_cookie` param to the `.cookie` file in the same directory

:::

```
# receiver
#        |
#        config.toml
# 
# Default credentials for regtest-util docker instance.
bitcoind_rpcuser="user"
bitcoind_rpcpass="password"
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
bitcoind_rpcuser="user"
bitcoind_rpcpass="password"
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
      --rpcpassword <rpcpassword>  The password for the bitcoin node
      --ohttp-keys <ohttp_keys>    The ohttp key config as a base64 encoded string
      --ohttp-relay <ohttp_relay>  The ohttp relay url
  -e, --retry                      Retry the asynchronous payjoin request if it did not yet complete
  -h, --help                       Print help information
```

We are mainly interested in the `receive` command and the `--retry` option. The `--retry` option allows us to attempt to a previous command again, so that we don't have to be continuously online to receive the payjoin.

To start, in the `receiver` directory:

```shell
# receiver
payjoin-cli receive 10000
```

You should see output like the following:

```shell
# receiver
Listening at 0.0.0.0:3000. Configured to accept payjoin at BIP 21 Payjoin Uri:
bitcoin:bcrt1qhnp46xudlnz3uv6eppv82p8wm03pnc0kezuhcq?amount=0.0001&pj=https://payjo.in/An3zPJr9NyGgwCx9W-YsojUkMxv8-I7BXHK6nlN3a7z3&pjos=0&ohttp=AQAg3c9qovMZvPzLh8XHgD8q86WG7SmPQvPamCTvEoueKBsABAABAAM
```

This command has done a couple things:
- Fetched the OHTTP public key from the target
- Enrolled a subdirectory `An3zPJr9NyGgwCx9W-YsojUkMxv8-I7BXHK6nlN3a7z3` at directory `https://payjo.in`
- Created a BIP 21 URI containing the desired address, amount, payjoin subdirectory (`&pj=https://payjo.in/An3zPJr9NyGgwCx9W-YsojUkMxv8-I7BXHK6nlN3a7z3`), [disabled output substitution](https://github.com/bitcoin/bips/blob/bc3123e1dab1c5b08d6f934b11b4d741107ac386/bip-0077.mediawiki#:~:text=To%20support%20version%201%20senders%20the%20directory%20acts%20as%20an%20unsecured%20payjoin%20server%20so%20pjos%3D0%20must%20be%20specified%20in%20the%20URI.) for backward compatibility with v1 payjoin (`&pjos=0`), and added the OHTTP key param `&ohttp=AQAg3c9qovMZvPzLh8XHgD8q86WG7SmPQvPamCTvEoueKBsABAABAAM`

The receiver can go offline at this point to wait for the **Original PSBT** from the sender, so that there's a fallback transaction in case the sender goes offline again. Try it by hitting `CTRL-C`, then re-running `payjoin-cli --retry` after sending to see what happens!

Now we must (out of band) get this BIP 21 to the sender. In our case, let's copy it and set it as an environment variable to make the `send` command more reusable:

```shell
# sender
BIP_21="bitcoin:bcrt1qhnp46xudlnz3uv6eppv82p8wm03pnc0kezuhcq?amount=0.0001&pj=https://payjo.in/An3zPJr9NyGgwCx9W-YsojUkMxv8-I7BXHK6nlN3a7z3&pjos=0&ohttp=AQAg3c9qovMZvPzLh8XHgD8q86WG7SmPQvPamCTvEoueKBsABAABAAM"
```

Now, let's send it:

```shell
# sender
payjoin-cli send $BIP_21 --fee-rate=2
```

:::note

Note that optimal fee rates will vary in a real-world environment.

:::

You should see some output like:

```shell
# sender
payjoin-cli send $BIP_21 --fee-rate=2

Sending fallback request to https://pj.bobspacebkk.com/
Sent fallback transaction
```

If so, great! Hit `CTRL-C` and go back to the `receiver` directory. We'll run the same command as before with the `--retry` option to continue our receiver session, check for the sender's `Original PSBT`, and add the receiver's outputs to turn it into a `Payjoin PSBT`.

```shell
# receiver
payjoin-cli --retry receive 10000
```


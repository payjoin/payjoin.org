# Receive Payjoin V2

We'll demostrate how you can receive an asynchronous [BIP 77: Payjoin Version 2](https://github.com/bitcoin/bips/pull/1483) using the `payjoin` crate in Payjoin Dev Kit. This should take about 30 minutes. This tutorial assumes you have a basic understanding of the Rust programming language and `cargo` installed, a running Signet Bitcoin Core node, and the ability to send a payjoin with [`payjoin-cli`](https://crates.io/crates/payjoin-cli).

The network parameters could be changed to support any Bitcoin network, but this tutorial will use the Bitcoin Signet network. We will ignore most errors and Payjoin Session persistence for simplicity. Reference the [`payjoin-cli` source](https://github.com/payjoin/rust-payjoin/tree/master/payjoin-cli) reference implementation for more information on those implementation details.

## Configure OHTTP Keys

First, you must bootstrap Oblivious HTTP (OHTTP) to connect to the Payjoin Directory without revealing your IP address.

Payojoin receivers must communicate with a Payjoin Directory via an Oblivious HTTP Relay. In order to speak OHTTP an OHTTP Key Configuration must be obtained. When TLS is available, this can be done through the HTTP CONNECT bootstrap mechanism as follows.

Create a new project depending on the following:

```sh
cargo new receive-payjoin-v2
cd receive-payjoin-v2
```

```toml
# Cargo.toml
[dependencies]
bitcoincore-rpc = "0.17.0"
payjoin = { version = "0.18.0", features = ["receive", "v2", "io"] }
reqwest = "0.12.0"
tokio = { version = "1.36.0", features = ["full"] }
url = "2.5.0"
```

Create an async main function to fetch the OHTTP keys from the Payjoin Directory. We will be returning a `Result` to return errors for the sake of a simple tutorial.

```rust
// src/main.rs
use url::Url;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let ohttp_relay = Url::parse("https://pj.bobspacebkk.com")?;
    let payjoin_directory = Url::parse("https://payjo.in")?;

    // Fetch keys using HTTP CONNECT method
    let ohttp_keys = payjoin::io::fetch_ohttp_keys(ohttp_relay.clone(), payjoin_directory.clone()).await?;
    println!("OHTTP keys: {:?}", ohttp_keys);
    Ok(())
}
```
## Connect Bitcoin Core

```sh
bitcoin-cli -signet createwallet receive
bitcoin-cli -signet getnewaddress
```

Fund the address and wait for a confirmation. You can get funds at [signetfaucet.com](https://signetfaucet.com/)

## Initialize a Payjoin Receiver Session

```rust
// src/main.rs

// ... Fetch keys

    // The RPC host of the wallet to connect to assuming 'receive'
    // is the name of your Core wallet.
    // For example values are:
    // - mainnet: http://localhost:8332/wallet/receive
    // - testnet: http://localhost:18332/wallet/receive
    // - regtest: http://localhost:18443/wallet/receive
    // - signet: http://localhost:38332/wallet/receive
    let bitcoind_rpc = "http://localhost:38332/wallet/receive";


    // TODO replace bitcoind_cookie with your core cookie path:
    // Linux: ~/.bitcoin/<NETWORK>/.cookie
    // MacOS: ~/Library/Application Support/Bitcoin/<NETWORK>/.cookie
    // Windows Vista and later: C:\Users\YourUserName\AppData\Roaming\Bitcoin\<NETWORK>\.cookie
    let bitcoind_cookie = "/Users/dan/Library/Application Support/Bitcoin/signet/.cookie";
    let bitcoind_cookie = bitcoincore_rpc::Auth::CookieFile(bitcoind_cookie.into());
    let bitcoind = bitcoincore_rpc::Client::new(bitcoind_rpc, bitcoind_cookie)?;
    let address = bitcoind.get_new_address(None, None)?;
    let mut session = payjoin::receive::v2::SessionInitializer::new(address.assume_checked(), payjoin_directory, ohttp_keys, ohttp_relay, std::time::Duration::from_secs(600));
    let (req, ctx) = session.extract_req()?;
    let http = reqwest::Client::new();
    let res = http
        .post(req.url)
        .body(req.body)
        .header("Content-Type", payjoin::V2_REQ_CONTENT_TYPE)
        .send()
        .await?;
    let mut session = session.process_res(res.bytes().await?.to_vec().as_slice(), ctx)?;

// ... Return Ok(())
```


## Listen on a Bitcoin URI with Payjoin Support

The URI represents the active Payjoin Session so the sender can reach you. Loop over the requests in order to await a proposal.

```rust
// src/main.rs

// ... let mut session = ...

    // Listen on a Bitcoin URI with payjoin support. You pick the Amount.
    let uri = session.pj_uri_builder().amount(payjoin::bitcoin::Amount::from_sat(88888)).build();
    println!("Payjoin URI:\n{}", uri);
    let proposal = loop {
        let (req, ctx) = session.extract_req()?;
        let res = http
            .post(req.url)
            .body(req.body)
            .header("Content-Type", payjoin::V2_REQ_CONTENT_TYPE)
            .send()
            .await?;
        match session.process_res(res.bytes().await?.to_vec().as_slice(), ctx)? {
            Some(proposal) => {
                break proposal;
            }
            None => {
                continue;
            }
        }
    };

// ... Ok(()) ...
```

## Validate Proposal using Check Methods

```rust
// src/main.rs

// ...

    let mut payjoin = proposal
    .check_broadcast_suitability(None, |tx| {
        Ok(bitcoind
            .test_mempool_accept(&[payjoin::bitcoin::consensus::encode::serialize_hex(&tx)])
            .unwrap()
            .first()
            .unwrap()
            .allowed)
    })
    .expect("Payjoin proposal should be broadcastable")
    .check_inputs_not_owned(|input| {
        let address =
            payjoin::bitcoin::Address::from_script(&input, payjoin::bitcoin::Network::Signet).unwrap();
        Ok(bitcoind.get_address_info(&address).unwrap().is_mine.unwrap())
    })
    .expect("Receiver should not own any of the inputs")
    .check_no_mixed_input_scripts()
    .expect("No mixed input scripts")
    .check_no_inputs_seen_before(|_| Ok(false))
    .expect("No inputs seen before")
    .identify_receiver_outputs(|output_script| {
        let address =
            payjoin::bitcoin::Address::from_script(&output_script, payjoin::bitcoin::Network::Signet)
                .unwrap();
        Ok(bitcoind.get_address_info(&address).unwrap().is_mine.unwrap())
    })
    .expect("Receiver should have at least one output");

// ... Ok(()) ...
```

## Augment the Proposal to Make a Batched Transaction

Time to add some input to the proposal to make it a Payjoin.

Import dependencies from `payjoin::bitcoin` and the `std` library.

```rust
// src/main.rs

// ...

   let available_inputs = bitcoind.list_unspent(None, None, None, None, None)?;
    let candidate_inputs: HashMap<Amount, OutPoint> = available_inputs
        .iter()
        .map(|i| (i.amount, OutPoint {txid: i.txid, vout: i.vout}))
        .collect();
    let selected_outpoint = payjoin.try_preserving_privacy(candidate_inputs).unwrap();
    let selected_utxo = available_inputs
        .iter()
        .find(|i| i.txid == selected_outpoint.txid && i.vout == selected_outpoint.vout).unwrap();
    let txo_to_contribute = payjoin::bitcoin::TxOut {
        value: selected_utxo.amount.to_sat(),
        script_pubkey: selected_utxo.script_pub_key.clone(),
    };
    let outpoint_to_contribute = OutPoint { txid: selected_utxo.txid, vout: selected_utxo.vout };
    payjoin.contribute_witness_input(txo_to_contribute, outpoint_to_contribute);

// ... Ok(()) ...
```

## Finalize the Payjoin and Return it to the Sender

Once inputs are added, the Payjoin needs to be signed and returned to the sender for broadcast.

```rust
// src/main.rs

// ...
    let mut payjoin = payjoin.finalize_proposal(
        |psbt| {
            Ok(bitcoind
                .wallet_process_psbt(&psbt.to_string(), None, None, Some(true))
            .map(|res| Psbt::from_str(&res.psbt).unwrap()).unwrap())
        },
        Some(payjoin::bitcoin::FeeRate::MIN)
    )?;
    let (req, ctx) = payjoin.extract_v2_req()?;
    let res = http
        .post(req.url)
        .body(req.body)
        .header("Content-Type", payjoin::V2_REQ_CONTENT_TYPE)
        .send()
        .await?;
    payjoin.process_res(res.bytes().await?.to_vec(), ctx)?;
    let payjoin_psbt = payjoin.psbt().clone();
    println!("response successful. Watch mempool for successful payjoin. TXID: {}", payjoin_psbt.extract_tx().clone().txid());
    Ok(())
}
```

That's all it takes to receive a Version 2 Payjoin. The looping allows a sender to send a proposal and receive a Payjoin in an asynchronous way. When you run this program it will output a Payjoin URI and listen for a proposal. When the sender sends a proposal, it will be validated and the inputs will be added to the proposal. The final Payjoin will be signed first by the receiver, then by the receiver and broadcast to the network.

Check your work by checking the source code for this [tutorial](https://github.com/payjoin/receive-payjoin-v2).

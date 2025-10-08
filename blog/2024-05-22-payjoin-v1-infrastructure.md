---
title: Notes on Payjoin V1 Infrastructure
description: A guide on setting up a payjoin receiver on signet
date: 2024-05-22
authors:
  - name: spacebear
tags: [PDK, Infrastructure]
---

[Payjoin V1](https://github.com/bitcoin/bips/blob/master/bip-0078.mediawiki) coordinates transactions between two parties who communicate over a public server endpoint secured by either TLS or Tor hidden service hosted by the receiver. This requires setting up either an HTTPS proxy or a Tor proxy when testing payjoins across different implementations.

## Setting up a HTTPS payjoin server with nginx

This guide requires a dedicated server that you can `ssh` into, with the ability to `sudo`, and a domain name pointing to that server.

### Configure a nginx proxy

First, ensure nginx is installed on the server or [install nginx](https://nginx.org/en/docs/install.html).

Then, we'll edit `/etc/nginx/nginx.conf` to proxy traffic to the payjoin server (more on that later) by adding the following block:

```conf
# nginx.conf
    server {
        server_name pj.example.com; # Replace this with your domain name

        location / {
            proxy_pass http://localhost:3000; # This is the port on which we'll run the payjoin server

            proxy_set_header        Host $host;
            proxy_set_header        X-Real-IP $remote_addr;
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header        X-Forwarded-Proto $scheme;
        }
    }
```

Note that the above configuration uses the `pj` subdomain to avoid conflicts with anything that may already be running on the root domain.

### Get a certificate

Next, we'll need to obtain a valid TLS certificate from a Certificate Authority. There are many ways to do this, but one free and relatively easy option is to use [certbot](https://certbot.eff.org/instructions), an open-source tool by [letsencrypt.org](https://letsencrypt.org).

Once certbot is installed, we can obtain a certificate and automatically update the nginx configuration:

```sh
sudo certbot -d <server_name from the nginx.conf above> --nginx
```

`/etc/nginx/nginx.conf` should now look something like this:

```conf
# nginx.conf
    server {
        server_name pj.example.com;

        location / {
            proxy_pass http://localhost:3000;

            proxy_set_header        Host $host;
            proxy_set_header        X-Real-IP $remote_addr;
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header        X-Forwarded-Proto $scheme;
        }

        listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    }
```

Verify the installation with `curl`:

```sh
$ curl -v https://<server_name>
* Host pj.example.com:443 was resolved.
* IPv6: (none)
* IPv4: 54.156.128.153
*   Trying 54.156.128.153:443...
* Connected to pj.example.com (54.156.128.153) port 443
* ALPN: curl offers h2,http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
*  CAfile: /etc/pki/tls/certs/ca-bundle.crt
*  CApath: none
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384 / X25519 / id-ecPublicKey
* ALPN: server accepted http/1.1
* Server certificate:
*  subject: CN=spacebear.dev
*  start date: Apr 18 01:37:16 2024 GMT
*  expire date: Jul 17 01:37:15 2024 GMT
*  subjectAltName: host "pj.example.com" matched cert's "pj.example.com"
*  issuer: C=US; O=Let's Encrypt; CN=R3
*  SSL certificate verify ok.
...

<html>
<head><title>502 Bad Gateway</title></head>
<body>
<center><h1>502 Bad Gateway</h1></center>
<hr><center>nginx/1.25.0</center>
</body>
</html>
```

If everything worked, we should see "SSL certificate verify ok."! We now have a legit HTTPS server proxying traffic to port 3000, but as indicated by the 502 error there is nothing running there. The next step is to setup a payjoin receiver to run on that port.

#### (Optional) Make a cronjob to auto-renew the certificate on a schedule

```
echo "0 0,12 * * * root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() * 3600)' && sudo certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
```

### Set up Bitcoin Core on signet

Because we're testing between wallets on different machines, regtest won't work (at least not trivially). We need a "real" Bitcoin network like signet. [Install Bitcoin Core](https://bitcoincore.org/) and edit `~/.bitcoin/bitcoin.conf`:

```conf
# bitcoin.conf
chain=signet
server=1
rpcuser=payjoin
rpcpassword=payjoin
```

`bitcoind` will take a few minutes to sync. In the meantime, let's create `sender` and `receiver` wallets and fund them. Use a signet faucet like \<https:\/\/signetfaucet.com/\> if you don't have any signet coins on hand.

### Install and run payjoin-cli receiver

Finally, we'll install (or build from source) [payjoin-cli](https://github.com/payjoin/rust-payjoin/tree/master/payjoin-cli#install-payjoin-cli) and make a `config.toml` in the directory we plan on running payjoin-cli from:

```toml
# config.toml
bitcoind_rpcuser = "payjoin"
bitcoind_rpcpass = "payjoin"
bitcoind_rpchost = "http://localhost:38332/wallet/receiver"
pj_endpoint = "https://pj.example.com"
```

This guide used [payjoin-cli v0.0.5-alpha](https://crates.io/crates/payjoin-cli/0.0.5-alpha). Configuration may change with newer versions.

We can now run the receiver:

```sh
$ payjoin-cli receive 10000
Listening at 0.0.0.0:3000. Configured to accept payjoin at BIP 21 Payjoin Uri:
bitcoin:tb1q9e5qgztf6w4zz2m3ts3w2zp3psdqpgmtdkf7y0?amount=0.0001&pj=https://pj.example.com&pjos=0
```

### Send payjoin

Send a payjoin to the BIP21 Uri generated above. This should work from any wallet that implements payjoin support, from any machine.

E.g. sending from joinmarket:

```sh
(jmvenv) $ sendpayment.py -m 0 wallet.jmdat "bitcoin:tb1q9e5qgztf6w4zz2m3ts3w2zp3psdqpgmtdkf7y0?amount=0.0001&pj=https://pj.example.com&pjos=0"
```

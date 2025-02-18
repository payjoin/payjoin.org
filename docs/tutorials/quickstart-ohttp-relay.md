# Quickstart ohttp relay

We'll demonstrate how you can setup an ohttp server on common cloud insfrastructure on something like [AWS Ubuntu](https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/gs-ubuntu.html) using the `ohttp-relay` crate in Payjoin Dev Kit. This should take about 30 minutes.

## Initial server setup

We will be using a basic Ubuntu server in our tutorial. In this tutorial we will be running the server as a docker container with nginx as a TLS proxy.

First, you must install docker and nginx on your server.

Install docker, nginx and the ningx stream module on a fresh Ubuntu server:

```sh
sudo apt update && sudo apt upgrade -y # Ubuntu

sudo apt install -y docker.io nginx libnginx-mod-stream #libnginx-mod-stream gives us access to the nginx stream module

sudo systemctl start docker nginx
sudo systemctl enable docker nginx
```

## Deploy ohttp-relay with Docker

We will want to build our docker image for our server to run as a container from.

Clone our ohttp-relay from github and then build the docker image.

```sh
git clone https://github.com/payjoin/ohttp-relay.git

cd ohttp-relay

sudo docker build -t ohttp-relay .
```

## Configure Nginx as a Reverse Proxy

Edit the existing `nginx.conf`.

```sh 
#/etc/nginx/nginx.conf
load_module /usr/lib/nginx/modules/ngx_mod_stream.so;
error_log /var/log/nginx/error.log debug;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

stream {
    server {
        listen 80;

        proxy_pass 127.0.0.1:3000;
    }

    server {
        listen 443 ssl;

        ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

        proxy_pass 127.0.0.1:3000;
    }
}
```

## Get a certificate

We need a valid TLS certificate from a Certificate Authority. The simplest option is to use [certbot](https://certbot.eff.org/instructions).
Once certbot is installed, we can obtain a certificate but because we are using the stream module we will need to ensure that the certificate path is correct as certbot cannot correct this automatically in this case.

```sh
sudo certbot certonly --standalone -d example.com
```

Confirm that the path to your ssl_cert and key are correct in your nginx.conf.

```sh
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

Restart your nginx service.

```sh
sudo systemctl restart nginx
```

## Automating ssl certification renewal

Automating certification renewal is critical to maximizing uptime and preventing any unexpected server downtime.
With automated renewal the server will update its ssl cert without any need for individual maintenance.

Check that your ssl renewal can be done cleanly.

```sh
sudo certbot renew --dry-run
```

Now create a new crontab file to make a cron jobs from.

```sh
sudo crontab -e
```

And now create the cron command to renew your cert. Its important to note that you shoul make sure you are running crontab as root to ensure it can have control over services.

```sh
0 0 * * * certbot renew --quiet --pre-hook "systemctl stop nginx" --post-hook "systemctl start nginx"
```

## Ensure the ohttp-relay runs persistently

We can use some built-in flags in docker to run our ohttp-relay in the background.

```sh
sudo docker run -d --restart unless-stopped --name ohttp-relay -p 3000:3000 \
    -e PORT=3000 \
    -e GATEWAY_ORIGIN=https://payjo.in \
    ohttp-relay
```

The `-d` flag ensures that our container will be running in the background and `--restart unless stopped` will ensure persistence even after logging and server reboots.

That's all it takes to setup an ohttp-relay. The looping allows a sender to send a proposal and receive a Payjoin in an asynchronous way. When you run this program you will participate in coordinating payjoins by relaying data between senders and receivers without leaking their IPs to each other or the payjoin directory.

## Testing

Check your work by running the curl request below to do a quick check to make sure your server is receiving well.

For testing we will include th `-vk and --proxy-insecure` flags to ensure we can get past any warnings or errors our curl request might send us with invalid cert signatures. For final checks in prod we recommend removing these flags to ensure your keys and certs are working and up-to-date.

This curl request should occur in 2 stages
1. The proxy CONNECT request that passes through your relay to the `https://payjo.in` directory
2. The GET request on `/.well-known/ohttp-gateway` that will return a binary encoded output
A successful test should return a 200/OK response on both of these steps

```sh
curl -vk --proxy-insecure --proxy https://{your-relay-public-ip} https://payjo.in/.well-known/ohttp-gateway --output - | xxd -p
```

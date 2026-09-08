# Payjoin Integration Tracker

This site tracks Payjoin integration candidates - a pipeline for Bitcoin wallet and service providers who may integrate the Payjoin protocol.

It also includes a research tracker for prioritization, bottlenecks, and grant reporting.

## North Star

**Grow payjoin volume from 500–1,000 payjoins/week today to 50,000/week.**

Weekly payjoin volume is the measure of success. Everything else this tracker counts, including integrations shipped, is an input toward that number, not the goal itself.

The target answers the challenge Greg Maxwell set in his 2013 thread [CoinJoin: Bitcoin privacy for the real world](https://bitcointalk.org/index.php?topic=279249.0) and its [bounty](https://bitcointalk.org/index.php?topic=279249.msg2983911#msg2983911) for "making improved transaction privacy a practical reality for Bitcoin users". 50,000 payjoins a week is what that practical reality looks like.

## Data Source

The canonical data lives in this repository at `data/integrations.yaml`. This YAML file is the single source of truth.

Research tracking data lives in `data/research.yaml`.

## Making Updates

To update integration data, submit a pull request modifying `data/integrations.yaml`.

To update research tracking, submit a pull request modifying `data/research.yaml`.

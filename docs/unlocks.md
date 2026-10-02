---
hide:
  - toc
---

# Unlocks

The path from today's artifacts to 50,000 payjoins a week, as a dependency graph. Each node
is something that has to ship, grouped into waves by build order. Hover a node to see what
feeds it and what it unlocks. Status and ownership are set by hand in `data/unlocks.yaml`;
activity is stamped nightly from each node's evidence links.

{% set stamped = unlock_stamped_at() %}
<p class="ug-muted" style="font-size:.7rem">Activity stamped {{ stamped or 'never' }} (UTC). Only nodes marked public are shown; the critical path and the attention list are computed over them at build time.</p>

{{ unlock_graph() }}

## Changing this page

Anyone with write access to the tracker repository can assign, finish or move a node. The
node id is in the tooltip; clicking a card copies the claim command.

| To | Run in the repository | Or in the Actions tab |
|----|------------------------|------------------------|
| assign someone | `python scripts/unlocks.py set <id> owner=<github handle>` | "Set an unlock node", field `owner` |
| mark it shipped | `python scripts/unlocks.py set <id> status=done` | field `status`, value `done` |
| move it to another wave | `python scripts/unlocks.py set <id> wave=<0-4>` | field `wave` |
| add a node, change edges or evidence | edit `data/unlocks.yaml`, run `python scripts/unlocks.py check`, open a PR | |

Status is never changed by a machine. When every evidence link of an open node has merged or
closed, the "Needs a person" list says so, and someone marks it done.

## How this page is built

Nodes live in `data/unlocks.yaml`; the nightly refresh writes `data/unlocks-auto.yaml` with
the newest activity across each node's evidence links. Only nodes marked `public: true` are
rendered here. The critical path and the attention list are computed from the data at build
time, not written by hand.

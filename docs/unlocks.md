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

## How this page is built

Nodes live in `data/unlocks.yaml`; the nightly refresh writes `data/unlocks-auto.yaml` with
the newest activity across each node's evidence links. Only nodes marked `public: true` are
rendered here. The critical path and the attention list are computed from the data at build
time, not written by hand.

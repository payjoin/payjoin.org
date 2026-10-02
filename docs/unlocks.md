# Unlocks

The path from today's artifacts to 50,000 payjoins a week, as a dependency graph. Each node
is something that has to ship. An arrow means the thing at the tail has to land before the
thing at the head can. Nodes are coloured by status and carry how many days since their
evidence last moved.

{% set stamped = unlock_stamped_at() %}
_Activity stamped {{ stamped or 'never' }} (UTC) from the evidence links below, refreshed nightly. Status and ownership are set by hand in `data/unlocks.yaml`._

**Legend**: green done · blue active · orange idle · grey not started

{{ unlock_mermaid() }}

{% set path = unlock_critical_path('bip77-complete') %}
{% if path %}
!!! note "Critical path"
    The longest chain of blockers ending at BIP 77 Complete, {{ path | length }} steps:

    {% for n in path %}{{ loop.index }}. **{{ n.title }}** — {{ n.status }}{% if n.auto and n.auto.days_idle is not none %}, {{ n.auto.days_idle }}d idle{% endif %}
    {% endfor %}
{% endif %}

## Unowned or idle more than {{ unlock_idle_days() }} days

{% set att = unlock_attention() %}
{% if att %}
| Node | Wave | Status | Why it is listed |
|------|-----:|--------|------------------|
{% for n, reasons in att -%}
| {{ n.title }} | {{ n.wave }} | {{ n.status }} | {{ reasons | join(', ') }} |
{% endfor %}
{% else %}
_Every open node has an owner and recent activity._
{% endif %}

## All nodes

| Node | Wave | Kind | Owner | Status | Days idle | Evidence |
|------|-----:|------|-------|--------|----------:|----------|
{% for n in unlock_nodes() -%}
| {{ n.title }} | {{ n.wave }} | {{ n.kind }} | {% if n.owner %}[@{{ n.owner }}](https://github.com/{{ n.owner }}){% else %}—{% endif %} | {{ n.status }} | {% if n.status == 'done' %}—{% elif n.auto and n.auto.days_idle is not none %}{{ n.auto.days_idle }}{% else %}—{% endif %} | {% for url in n.evidence or [] %}[{{ url | short_ref }}]({{ url }}){% if n.auto and n.auto.evidence[url] and n.auto.evidence[url].state not in ('unstamped', 'unknown') %} ({{ n.auto.evidence[url].state }}){% endif %}{% if not loop.last %}, {% endif %}{% endfor %} |
{% endfor %}

## Notes

{% for n in unlock_nodes() if n.note -%}
- **{{ n.title }}** — {{ n.note }}
{% endfor %}

## How this page is built

Nodes live in `data/unlocks.yaml`; the nightly refresh writes `data/unlocks-auto.yaml` with
the newest activity across each node's evidence links. Only nodes marked `public: true` are
rendered here. The critical path and the attention list are computed from the data at build
time, not written by hand.

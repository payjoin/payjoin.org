# Outside activity

Everything mentioning **payjoin** outside the `payjoin` org: issues, pull requests,
commits and new repos on GitHub, plus press, forum threads and newsletters off it.
Collected nightly. Use the date list on the right to jump back to a given day.

{% set totals = outside_totals() %}
{% if totals.count %}
**{{ totals.count }} items** across **{{ totals.repos }} repos**{% if totals.stories %} and
**{{ totals.stories }} off-GitHub stories**{% endif %}{% if totals.since %}, from
{{ totals.since }} to {{ totals.until }}{% endif %} — {{ totals.summary }}.

Days are dated by when the activity happened, not when we noticed it. Each item appears
once: rerunning the collectors refreshes a row in place rather than adding a second copy.
Anything marked `dismissed` in `data/candidates.yaml` or `data/news.yaml` is hidden here.

{% for day in outside_days() %}
## {{ day.date }}

_{{ day.summary }}_

{% for repo in day.repos %}
**[{{ repo.name }}]({{ repo.url }})** ⭐{{ repo.stars }} — {{ repo.summary }}

{% for item in repo.entries %}
- [{{ kind_label(item.kind) }}]({{ item.url }}) — {{ item.title or item.url }}
{%- endfor %}

{% endfor %}
{% if day.news %}
**Off GitHub**

{% for story in day.news %}
- [{{ story.title or story.url }}]({{ story.url }}) — _{{ story.outlet or 'unknown' }}_
{%- endfor %}
{% endif %}
{% endfor %}
{% else %}
Nothing collected yet. The nightly refresh (`.github/workflows/refresh.yml`) populates
`data/candidates.yaml` and `data/news.yaml`; run it by hand from the Actions tab when
something substantial breaks and you don't want to wait for the 00:17 UTC cron.
{% endif %}

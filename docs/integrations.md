# Integrations

**Score = 6🎯 + 2⚡ − 🔧** | 🎯 Leverage · ⚡ Feasibility · 🔧 Maintenance | 🔵 best → 🔴 worst

## Scored Integrations

| Name | Blocker | Score | 🎯 | ⚡ | 🔧 | Notes |
|------|---------|------:|:-:|:-:|:-:|-------|
{% for i in scored_integrations() -%}
| {% if i.tracking_issue %}[**{{ i.name }}**]({{ i.tracking_issue }}){% else %}**{{ i.name }}**{% endif %} | {{ i.blocker or '❓' }} | {{ i.priority_score }} | {{ i.scores.leverage | score_color }} | {{ i.scores.feasibility | score_color }} | {{ i.scores.maintenance | score_color(inverted=True) }} | {{ i.notes | truncate(60) }} |
{% endfor %}

---

## Unscored Integrations

### Engaged ({{ integrations_by_status('engaged') | rejectattr('scores', 'defined') | list | length }})

| Name | Language | Contact |
|------|----------|---------|
{% for i in integrations_by_status('engaged') if not i.scores -%}
| {{ i.name or i.company or '-' }} | {{ i.language or '-' }} | {{ i.contact.name if i.contact else '-' }} |
{% endfor %}

### Contacted ({{ integrations_by_status('contacted') | list | length }})

| Name | Company | Language |
|------|---------|----------|
{% for i in integrations_by_status('contacted') -%}
| {{ i.name or '-' }} | {{ i.company or '-' }} | {{ i.language or '-' }} |
{% endfor %}

### Prospect ({{ integrations_by_status('prospect') | list | length }})

| Name | Company |
|------|---------|
{% for i in integrations_by_status('prospect') -%}
| {{ i.name or i.company or '-' }} | {{ i.company or '-' }} |
{% endfor %}

---

## Recently changed (auto-tracked)

_Upstream issue / PR / discussion activity, refreshed nightly by `scripts/refresh.py`._

{% set rc = recently_changed(15) %}
{% if rc %}
| Integration | Upstream | State | Last activity |
|-------------|----------|-------|---------------|
{% for i in rc -%}
| {{ i.name }} | [{{ i.auto.kind }}]({{ i.tracking_issue }}) | {{ i.auto.state or '—' }} | {{ i.auto.last_activity[:10] }} |
{% endfor %}
{% else %}
_No auto-tracked activity yet — run the **Refresh tracker auto-state** workflow._
{% endif %}

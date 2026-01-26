# Integrations

**Score = 6🎯 + 2⚡ − 🔧** | 🎯 Leverage · ⚡ Feasibility · 🔧 Maintenance | 🔵 best → 🔴 worst

## Scored Integrations

| Name | Blocker | Score | 🎯 | ⚡ | 🔧 | Status | Spec |
|------|---------|------:|:-:|:-:|:-:|--------|------|
{% for i in scored_integrations() -%}
| {% if i.tracking_issue %}[**{{ i.name }}**]({{ i.tracking_issue }}){% else %}**{{ i.name }}**{% endif %} | {{ i.blocker or '❓ needs blocker' }} | {{ i.priority_score }} | {{ i.scores.leverage | score_color }} | {{ i.scores.feasibility | score_color }} | {{ i.scores.maintenance | score_color(inverted=True) }} | {{ i.status }} | {{ i.spec_feedback or '-' }} |
{% endfor %}

---

## Unscored Integrations

### Engaged ({{ integrations_by_status('engaged') | rejectattr('scores', 'defined') | list | length }})

| Name | Language | Contact |
|------|----------|---------|
{% for i in integrations_by_status('engaged') if not i.scores -%}
| {{ i.name or i.company or '-' }} | {{ i.language or '-' }} | {{ i.contact.name if i.contact else '-' }} |
{% endfor %}

### Contacted ({{ integrations_by_status('Contacted') | list | length }})

| Name | Company | Language |
|------|---------|----------|
{% for i in integrations_by_status('Contacted') -%}
| {{ i.name or '-' }} | {{ i.company or '-' }} | {{ i.language or '-' }} |
{% endfor %}

### Prospect ({{ integrations_by_status('prospect') | list | length }})

| Name | Company | Est. Value |
|------|---------|------------|
{% for i in integrations_by_status('prospect') -%}
| {{ i.name or i.company or '-' }} | {{ i.company or '-' }} | {{ i.estimated_value or '-' }} |
{% endfor %}

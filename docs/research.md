# Research Tracker

This page tracks research priorities and bottlenecks for grant-ready reporting.

## Scoring

Priority score = (5 * Impact) + (3 * Tractability) + (2 * Visibility) - Maintenance

## Scored Research

| Title | Status | Blocker | Score | Impact | Tractability | Visibility | Maintenance | Deliverable |
|-------|--------|---------|------:|:------:|:------------:|:----------:|:-----------:|-------------|
{% for r in scored_research() -%}
| **{{ r.title }}** | {{ r.status }} | {{ r.blocker.kind if r.blocker else 'none' }} | {{ r.priority_score }} | {{ r.scores.impact }} | {{ r.scores.tractability }} | {{ r.scores.visibility }} | {{ r.scores.maintenance }} | {{ r.deliverable.artifact if r.deliverable else '-' }} |
{% endfor %}

---

## Kanban

{% for status in research_statuses -%}
### {{ status }}

| Title | Area | Type | Blocker | Next action |
|-------|------|------|---------|-------------|
{% for r in research_by_status(status) -%}
| **{{ r.title }}** | {{ r.area }} | {{ r.type }} | {{ r.blocker.kind if r.blocker else 'none' }} | {{ r.blocker.next_action if r.blocker else '-' }} |
{% endfor %}

{% endfor %}

---

## Bottlenecks

{% for kind, items in research_by_blocker_kind().items() -%}
### {{ kind }}

| Title | Status | Owner | Next action |
|-------|--------|-------|-------------|
{% for r in items -%}
| **{{ r.title }}** | {{ r.status }} | {{ r.blocker.owner if r.blocker else '-' }} | {{ r.blocker.next_action if r.blocker else '-' }} |
{% endfor %}

{% endfor %}

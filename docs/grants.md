# Grant Deliverables

| Deliverable | Target date | Status | Grant alignment | Evidence |
|-------------|-------------|--------|-----------------|----------|
{% for r in grant_items() -%}
| {{ r.deliverable.artifact if r.deliverable else '-' }} | {{ r.deliverable.target_date if r.deliverable else '-' }} | {{ r.status }} | {{ r.deliverable.grant_alignment if r.deliverable else '-' }} | {% if r.evidence_paths %}{{ r.evidence_paths | join(', ') }}{% else %}-{% endif %} |
{% endfor %}

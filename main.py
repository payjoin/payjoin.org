import os
import yaml

def define_env(env):
    """Define variables and macros for mkdocs-macros."""

    # Load integrations data
    with open('data/integrations.yaml', 'r') as f:
        integrations = yaml.safe_load(f)

    # Filter out None entries and calculate priority score
    integrations = [i for i in integrations if i is not None]

    # Strip private CRM fields so they can never reach the rendered (public) site.
    # The canonical YAML retains them; they are removed only from template-facing data.
    PRIVATE_FIELDS = ('email', 'phone', 'estimated_value', 'expected_close', 'account_owner')
    for i in integrations:
        for f in PRIVATE_FIELDS:
            i.pop(f, None)

    for i in integrations:
        if i.get('scores'):
            s = i['scores']
            i['priority_score'] = 6 * s.get('leverage', 0) + 2 * s.get('feasibility', 0) - s.get('maintenance', 0)
        else:
            i['priority_score'] = None

        sync_privacy = i.get('sync_privacy') or {}
        sync_scores = sync_privacy.get('scores')
        if sync_scores:
            i['sync_privacy_score'] = (
                5 * sync_scores.get('privacy_leakage', 0)
                + 3 * sync_scores.get('ohttp_tractability', 0)
                + 2 * sync_scores.get('payjoin_coupling', 0)
                - sync_scores.get('maintenance', 0)
            )
        else:
            i['sync_privacy_score'] = None

    # Join machine-collected upstream state (data/auto-state.yaml), if present.
    # Written nightly by scripts/refresh.py, keyed by tracking_issue URL. Optional —
    # the build works whether or not the file exists yet.
    auto_state = {}
    if os.path.exists('data/auto-state.yaml'):
        with open('data/auto-state.yaml', 'r') as f:
            auto_state = yaml.safe_load(f) or {}
    for i in integrations:
        i['auto'] = auto_state.get(i.get('tracking_issue'))

    # Make available as variable
    env.variables['integrations'] = integrations

    # Filter helpers
    @env.macro
    def scored_integrations():
        """Return integrations with scores, sorted by priority"""
        scored = [i for i in integrations if i.get('scores')]
        return sorted(scored, key=lambda x: x.get('priority_score', 0), reverse=True)

    @env.macro
    def integrations_by_status(status):
        """Return integrations filtered by status (case-insensitive)."""
        s = (status or '').lower()
        return [i for i in integrations if (i.get('status') or '').lower() == s]

    @env.macro
    def recently_changed(limit=15):
        """Tracked integrations with upstream activity, newest first (needs auto-state)."""
        tracked = [i for i in integrations if i.get('auto') and i['auto'].get('last_activity')]
        return sorted(tracked, key=lambda x: x['auto']['last_activity'], reverse=True)[:limit]

    @env.macro
    def unscored_integrations():
        """Return integrations without scores"""
        return [i for i in integrations if not i.get('scores')]

    @env.macro
    def sync_privacy_opportunities():
        """Return integrations with sync privacy scores, sorted by priority."""
        scored = [i for i in integrations if i.get('sync_privacy_score') is not None]
        return sorted(scored, key=lambda x: x.get('sync_privacy_score', 0), reverse=True)

    @env.filter
    def score_color(value, inverted=False):
        """Return colored dot for score value (1-5). Blue=best, Red=worst."""
        colors = {5: '🔵', 4: '🟢', 3: '🟡', 2: '🟠', 1: '🔴'}
        if inverted:
            colors = {1: '🔵', 2: '🟢', 3: '🟡', 4: '🟠', 5: '🔴'}
        return colors.get(value, '⚪')

    @env.filter
    def truncate(text, length=50):
        """Truncate text with ellipsis."""
        if not text:
            return '-'
        if len(text) <= length:
            return text
        return text[:length].rsplit(' ', 1)[0] + '…'

    # Load research data
    with open('data/research.yaml', 'r') as f:
        research_items = yaml.safe_load(f)

    research_items = [r for r in research_items if r is not None]

    for r in research_items:
        scores = r.get('scores')
        if scores:
            impact = scores.get('impact', 0)
            tractability = scores.get('tractability', 0)
            visibility = scores.get('visibility', 0)
            maintenance = scores.get('maintenance', 0)
            r['priority_score'] = (5 * impact) + (3 * tractability) + (2 * visibility) - maintenance
        else:
            r['priority_score'] = None

    env.variables['research_items'] = research_items
    env.variables['research_statuses'] = [
        'backlog',
        'in_progress',
        'blocked',
        'review',
        'published',
    ]

    @env.macro
    def scored_research():
        """Return research items with scores, sorted by priority."""
        scored = [r for r in research_items if r.get('scores')]
        return sorted(scored, key=lambda x: x.get('priority_score', 0), reverse=True)

    @env.macro
    def research_by_status(status):
        """Return research items filtered by status."""
        return [r for r in research_items if r.get('status') == status]

    @env.macro
    def research_by_blocker_kind():
        """Return research items grouped by blocker kind."""
        buckets = {}
        for r in research_items:
            blocker = r.get('blocker') or {}
            kind = blocker.get('kind') or 'none'
            buckets.setdefault(kind, []).append(r)
        return buckets

    @env.macro
    def grant_items():
        """Return research items that have deliverables."""
        return [r for r in research_items if r.get('deliverable')]

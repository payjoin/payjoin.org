import os
import sys

import yaml

# scripts/unlocks.py holds the unlock-graph logic shared with the nightly refresh.
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scripts'))
import unlocks  # noqa: E402

# Kinds the Outside activity page knows how to label, in the order they read best.
_OUTSIDE_KINDS = (
    ('pr', 'PR', 'PRs'),
    ('issue', 'issue', 'issues'),
    ('commit', 'commit', 'commits'),
    ('repo', 'repo', 'repos'),
    ('article', 'article', 'articles'),
    ('forum', 'forum post', 'forum posts'),
    ('newsletter', 'newsletter', 'newsletters'),
    ('hn', 'HN post', 'HN posts'),
    ('mailing-list', 'mailing list post', 'mailing list posts'),
)
_KIND_LABEL = {k: (one, many) for k, one, many in _OUTSIDE_KINDS}


def _load_rows(path):
    """Read one of the collector archives. Missing file is normal (first run) -> []."""
    if not os.path.exists(path):
        return []
    with open(path, 'r') as f:
        return [r for r in (yaml.safe_load(f) or []) if r and r.get('url')]


def _summarise(rows):
    """'5 PRs, 1 issue' for a bucket of rows."""
    counts = {}
    for r in rows:
        counts[r.get('kind') or 'item'] = counts.get(r.get('kind') or 'item', 0) + 1
    parts = []
    for kind, one, many in _OUTSIDE_KINDS:
        n = counts.get(kind)
        if n:
            parts.append('%d %s' % (n, one if n == 1 else many))
    for kind, n in sorted(counts.items()):
        if kind not in _KIND_LABEL:
            parts.append('%d %s' % (n, kind))
    return ', '.join(parts)


def build_outside_days(candidates, news, max_days=90):
    """Group every archived outside-activity row into a day-by-day feed, newest first.

    The digest answers "what is new today"; this answers "what happened the week I was
    heads-down", which is why it groups by the day the activity happened (updated_at)
    rather than the day we noticed it. Rows you have dismissed drop out entirely.

    Returns [{date, count, summary, repos: [...], news: [...]}], newest day first.
    """
    days = {}
    for row in candidates:
        if row.get('status') == 'dismissed':
            continue
        day = (row.get('updated_at') or '')[:10]
        if not day:
            continue
        bucket = days.setdefault(day, {'repos': {}, 'news': []})
        bucket['repos'].setdefault(row.get('repo') or '?', []).append(row)
    for row in news:
        if row.get('status') == 'dismissed':
            continue
        day = (row.get('updated_at') or '')[:10]
        if not day:
            continue
        days.setdefault(day, {'repos': {}, 'news': []})['news'].append(row)

    out = []
    for day in sorted(days, reverse=True)[:max_days]:
        bucket = days[day]
        repos = []
        for name, rows in bucket['repos'].items():
            rows.sort(key=lambda r: r.get('updated_at') or '', reverse=True)
            repos.append({
                'name': name,
                'url': 'https://github.com/%s' % name,
                'stars': max((r.get('stars') or 0) for r in rows),
                'summary': _summarise(rows),
                'entries': rows,
                'newest': rows[0].get('updated_at') or '',
            })
        # Busiest repos first, then most recent — the day reads top-down by significance.
        repos.sort(key=lambda r: (len(r['entries']), r['newest']), reverse=True)
        stories = sorted(bucket['news'], key=lambda r: r.get('updated_at') or '', reverse=True)
        rows_today = [r for repo in repos for r in repo['entries']] + stories
        out.append({
            'date': day,
            'count': len(rows_today),
            'summary': _summarise(rows_today),
            'repos': repos,
            'news': stories,
        })
    return out


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

    # Outside-activity archives, written nightly by scripts/discover.py + scripts/news.py.
    # Both are optional: the site builds before either has ever run.
    outside_candidates = _load_rows('data/candidates.yaml')
    outside_news = _load_rows('data/news.yaml')

    @env.macro
    def outside_days(max_days=90):
        """Day-by-day feed of payjoin activity outside the org (see build_outside_days)."""
        return build_outside_days(outside_candidates, outside_news, max_days=max_days)

    @env.macro
    def outside_totals():
        """Headline counts for the Outside activity page."""
        live = [r for r in outside_candidates + outside_news if r.get('status') != 'dismissed']
        dated = sorted((r.get('updated_at') or '')[:10] for r in live if r.get('updated_at'))
        # NB: no key may be called 'items' — Jinja resolves `totals.items` to dict.items().
        return {
            'count': len(live),
            'repos': len({r.get('repo') for r in outside_candidates
                          if r.get('status') != 'dismissed' and r.get('repo')}),
            'stories': len([r for r in outside_news if r.get('status') != 'dismissed']),
            'since': dated[0] if dated else None,
            'until': dated[-1] if dated else None,
            'summary': _summarise(live),
        }

    @env.macro
    def kind_label(kind):
        """Singular display label for an activity kind ('pr' -> 'PR')."""
        return _KIND_LABEL.get(kind, (kind or 'item', ''))[0]

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

    # Unlock graph (data/unlocks.yaml + data/unlocks-auto.yaml). The site is public and
    # the repository is not: private nodes are dropped here, before anything template-facing
    # exists, the same way PRIVATE_FIELDS strips the CRM columns above. A broken graph
    # (dangling id, cycle, missing public flag) fails the build rather than publishing.
    unlock_errors = unlocks.validate(unlocks.load_nodes('data/unlocks.yaml'))
    if unlock_errors:
        raise ValueError('data/unlocks.yaml is invalid:\n  ' + '\n  '.join(unlock_errors))
    unlock_public = unlocks.public_nodes(unlocks.load_nodes('data/unlocks.yaml'))
    unlock_auto = unlocks.load_auto('data/unlocks-auto.yaml')
    for n in unlock_public:
        n['auto'] = unlock_auto['nodes'].get(n['id']) or {'last_activity': None, 'days_idle': None, 'evidence': {}}
    unlock_public.sort(key=lambda n: (n.get('wave', 9), n['id']))

    @env.macro
    def unlock_nodes():
        """Public unlock-graph nodes with their machine facts joined, in wave order."""
        return unlock_public

    @env.macro
    def unlock_mermaid():
        """The public unlock graph as a fenced mermaid block."""
        return '```mermaid\n' + unlocks.render_mermaid(unlock_public, unlock_auto['nodes']) + '\n```'

    @env.macro
    def unlock_graph(target='bip77-complete'):
        """The Unlocks page body: interactive graph, tiles, critical path, attention, table."""
        payload = unlocks.public_payload(unlock_public, unlock_auto['nodes'], target=target,
                                         stamped_at=unlock_auto.get('stamped_at'))
        return unlocks.render_html(payload)

    @env.macro
    def unlock_critical_path(target='bip77-complete'):
        """Longest chain of blockers ending at target, over public nodes only."""
        by_id = {n['id']: n for n in unlock_public}
        return [by_id[i] for i in unlocks.longest_chain(unlock_public, target)]

    @env.macro
    def unlock_attention(idle_days=unlocks.IDLE_DAYS):
        """Open public nodes with no owner, no evidence, or idle longer than idle_days."""
        return unlocks.attention(unlock_public, unlock_auto['nodes'], idle_days=idle_days)

    @env.macro
    def unlock_idle_days():
        return unlocks.IDLE_DAYS

    @env.macro
    def unlock_stamped_at():
        return unlock_auto.get('stamped_at')

    @env.filter
    def short_ref(url):
        """Compact label for an evidence URL ('rust-payjoin#1851', 'owner/repo')."""
        return unlocks.short_ref(url)

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

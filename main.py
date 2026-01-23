import yaml

def define_env(env):
    """Define variables and macros for mkdocs-macros"""

    # Load integrations data
    with open('data/integrations.yaml', 'r') as f:
        integrations = yaml.safe_load(f)

    # Filter out None entries and calculate priority score
    integrations = [i for i in integrations if i is not None]

    for i in integrations:
        if i.get('scores'):
            s = i['scores']
            i['priority_score'] = 6 * s.get('leverage', 0) + 2 * s.get('feasibility', 0) - s.get('maintenance', 0)
        else:
            i['priority_score'] = None

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
        """Return integrations filtered by status"""
        return [i for i in integrations if i.get('status') == status]

    @env.macro
    def unscored_integrations():
        """Return integrations without scores"""
        return [i for i in integrations if not i.get('scores')]

    @env.filter
    def score_color(value, inverted=False):
        """Return colored dot for score value (1-5). Blue=best, Red=worst."""
        colors = {5: '🔵', 4: '🟢', 3: '🟡', 2: '🟠', 1: '🔴'}
        if inverted:
            colors = {1: '🔵', 2: '🟢', 3: '🟡', 4: '🟠', 5: '🔴'}
        return colors.get(value, '⚪')

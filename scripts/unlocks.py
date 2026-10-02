#!/usr/bin/env python3
"""The unlock graph: validation, staleness stamping and rendering helpers.

data/unlocks.yaml is the human-owned graph (one record per node: id, title, kind, wave,
public, owner, blocked_by, blocks, evidence URLs, status, note). data/unlocks-auto.yaml is
the machine-owned sidecar: per node, the newest activity across its evidence URLs, the
state of each URL and how many days the node has been idle. The nightly refresh
(scripts/refresh.py) fetches the live state and writes the sidecar; the human file is
never written by a script.

This module has no network code. The refresh script hands it already-fetched records,
which keeps every function here runnable offline and testable.

Usage:
    python scripts/unlocks.py check                      # validate the graph; exit 1 on violations
    python scripts/unlocks.py stamp --offline [--today YYYY-MM-DD]
                                                         # rebuild the sidecar from cached state only
    python scripts/unlocks.py set <id> owner=<handle> [status=done] [wave=N]
                                                         # edit one node in place, then validate
    python scripts/unlocks.py --selftest                 # offline checks (no pyyaml needed)
"""
import os
import re
import sys
from datetime import date, datetime

UNLOCKS = "data/unlocks.yaml"
UNLOCKS_AUTO = "data/unlocks-auto.yaml"
AUTO_STATE = "data/auto-state.yaml"

KINDS = ("artifact", "spec", "binding", "corridor", "cohort", "integration")
STATUSES = ("done", "active", "idle", "not-started")
WAVES = (0, 1, 2, 3, 4)
IDLE_DAYS = 14

_ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")


# ----------------------------------------------------------------- loading

def load_nodes(path=UNLOCKS):
    import yaml  # deferred so --selftest runs without pyyaml
    with open(path) as f:
        return [n for n in (yaml.safe_load(f) or []) if n]


def load_auto(path=UNLOCKS_AUTO):
    """The machine sidecar, or an empty one when the refresh has not run yet."""
    import yaml
    if not os.path.exists(path):
        return {"stamped_at": None, "nodes": {}}
    with open(path) as f:
        data = yaml.safe_load(f) or {}
    data.setdefault("stamped_at", None)
    data.setdefault("nodes", {})
    return data


# ----------------------------------------------------------------- graph

def _ids(nodes):
    return [n.get("id") for n in nodes]


def edges(nodes):
    """Sorted set of (blocker, blocked) pairs, taking the union of both declarations."""
    out = set()
    for n in nodes:
        for b in n.get("blocked_by") or []:
            out.add((b, n["id"]))
        for b in n.get("blocks") or []:
            out.add((n["id"], b))
    return sorted(out)


def find_cycle(nodes):
    """Return one dependency cycle as a list of ids, or None when the graph is acyclic."""
    succ = {}
    for a, b in edges(nodes):
        succ.setdefault(a, []).append(b)
    WHITE, GREY, BLACK = 0, 1, 2
    colour = {i: WHITE for i in _ids(nodes)}
    for i in succ:
        colour.setdefault(i, WHITE)
    stack = []

    def visit(u):
        colour[u] = GREY
        stack.append(u)
        for v in succ.get(u, []):
            if colour.get(v, WHITE) == GREY:
                return stack[stack.index(v):] + [v]
            if colour.get(v, WHITE) == WHITE:
                found = visit(v)
                if found:
                    return found
        stack.pop()
        colour[u] = BLACK
        return None

    for u in sorted(colour):
        if colour[u] == WHITE:
            found = visit(u)
            if found:
                return found
    return None


def validate(nodes):
    """Every violation as a human-readable string; empty list means the graph is sound."""
    errors = []
    seen = set()
    for i, n in enumerate(nodes):
        nid = n.get("id")
        where = "node %d (%s)" % (i, nid or "no id")
        if not nid or not isinstance(nid, str) or not _ID_RE.match(nid):
            errors.append("%s: id must be a lowercase slug" % where)
            continue
        if nid in seen:
            errors.append("%s: duplicate id" % where)
        seen.add(nid)
        if not n.get("title"):
            errors.append("%s: missing title" % where)
        if n.get("kind") not in KINDS:
            errors.append("%s: kind must be one of %s" % (where, ", ".join(KINDS)))
        if n.get("wave") not in WAVES:
            errors.append("%s: wave must be one of %s" % (where, ", ".join(map(str, WAVES))))
        if not isinstance(n.get("public"), bool):
            errors.append("%s: public must be true or false" % where)
        if n.get("status") not in STATUSES:
            errors.append("%s: status must be one of %s" % (where, ", ".join(STATUSES)))
        for field in ("blocked_by", "blocks", "evidence"):
            if n.get(field) is not None and not isinstance(n.get(field), list):
                errors.append("%s: %s must be a list" % (where, field))
    ids = seen
    for n in nodes:
        nid = n.get("id")
        if not nid:
            continue
        for field in ("blocked_by", "blocks"):
            for ref in n.get(field) or []:
                if ref not in ids:
                    errors.append("%s: %s refers to unknown id %r" % (nid, field, ref))
                if ref == nid:
                    errors.append("%s: %s refers to itself" % (nid, field))
    if not errors:
        cycle = find_cycle(nodes)
        if cycle:
            errors.append("dependency cycle: " + " -> ".join(cycle))
    return errors


def public_nodes(nodes):
    """Only nodes explicitly marked public: true. Everything else never leaves the repo."""
    return [n for n in nodes if n.get("public") is True]


def longest_chain(nodes, target):
    """The longest blocked_by chain that ends at `target`, as a list of ids, start first.

    Computed over whichever nodes are passed in, so the public page sees only the public
    subgraph. Ties break on id so the result is stable between builds.
    """
    ids = set(_ids(nodes))
    if target not in ids:
        return []
    pred = {}
    for a, b in edges(nodes):
        if a in ids and b in ids:
            pred.setdefault(b, []).append(a)
    memo = {}

    def best(u):
        if u in memo:
            return memo[u]
        memo[u] = [u]  # guards against a cycle slipping through unvalidated data
        candidates = [best(p) + [u] for p in sorted(pred.get(u, []))]
        memo[u] = max(candidates, key=lambda c: (len(c), c)) if candidates else [u]
        return memo[u]

    return best(target)


# ----------------------------------------------------------------- stamping

def evidence_urls(nodes):
    """Every evidence URL across the graph, deduplicated and sorted."""
    return sorted({u for n in nodes for u in (n.get("evidence") or []) if u})


def evidence_state(rec):
    """Collapse a refresh.py auto-state record into open | merged | closed | draft | ..."""
    if not rec:
        return "unstamped"
    kind, state = rec.get("kind"), (rec.get("state") or "").upper()
    if state == "MISSING":
        return "missing"
    if kind == "pull":
        if rec.get("merged"):
            return "merged"
        if rec.get("draft"):
            return "draft"
        return "open" if state == "OPEN" else "closed"
    if kind == "issue":
        return "open" if state == "OPEN" else "closed"
    if kind == "repo":
        return "archived" if state == "ARCHIVED" else "active"
    if kind == "discussion":
        return "open"
    return "unknown"


def _parse_day(ts):
    if not ts:
        return None
    try:
        return datetime.strptime(str(ts)[:10], "%Y-%m-%d").date()
    except ValueError:
        return None


def stamp(nodes, records, today=None):
    """Per-node machine facts from already-fetched evidence records.

    records: {url: auto-state record} as produced by refresh.flatten (or cached from a
    previous run). A URL with no record is reported as `unstamped` rather than dropped,
    so a node never silently loses evidence. A node with no evidence gets
    last_activity: null and days_idle: null.
    """
    today = today or date.today()
    if isinstance(today, str):
        today = _parse_day(today)
    out = {}
    for n in nodes:
        ev = {}
        latest = None
        for url in n.get("evidence") or []:
            rec = records.get(url)
            entry = {"state": evidence_state(rec)}
            if rec and rec.get("last_activity"):
                entry["last_activity"] = rec["last_activity"]
                if latest is None or rec["last_activity"] > latest:
                    latest = rec["last_activity"]
            ev[url] = entry
        day = _parse_day(latest)
        out[n["id"]] = {
            "last_activity": latest,
            "days_idle": (today - day).days if day else None,
            "evidence": ev,
        }
    return out


def write_auto(auto_nodes, today, path=UNLOCKS_AUTO):
    import yaml
    data = {"stamped_at": str(today)[:10], "nodes": auto_nodes}
    with open(path, "w") as f:
        f.write("# Auto-generated by scripts/refresh.py via scripts/unlocks.py. Do not edit by hand.\n")
        yaml.safe_dump(data, f, sort_keys=True, default_flow_style=False, allow_unicode=True)
    return path


def cached_records(yaml_mod):
    """Evidence records already on disk: the tracker's auto-state plus the last sidecar."""
    records = {}
    if os.path.exists(AUTO_STATE):
        with open(AUTO_STATE) as f:
            records.update(yaml_mod.safe_load(f) or {})
    if os.path.exists(UNLOCKS_AUTO):
        with open(UNLOCKS_AUTO) as f:
            prev = yaml_mod.safe_load(f) or {}
        for node in (prev.get("nodes") or {}).values():
            for url, entry in (node.get("evidence") or {}).items():
                if url not in records and entry.get("last_activity"):
                    # Keep only what a cached entry can honestly say: when it last moved.
                    records[url] = {"kind": "cached", "last_activity": entry["last_activity"],
                                    "state": entry.get("state")}
    return records


def update(yaml_mod, date_str, known=None, fetch=None):
    """Nightly entry point used by refresh.py.

    known: records refresh.py already fetched this run ({url: record}); fetch: callable
    taking the URLs still missing and returning {url: record}. Returns the stamped nodes.
    """
    nodes = load_nodes()
    errors = validate(nodes)
    if errors:
        raise ValueError("unlocks.yaml invalid:\n  " + "\n  ".join(errors))
    records = dict(known or {})
    missing = [u for u in evidence_urls(nodes) if u not in records]
    if missing and fetch:
        records.update(fetch(missing) or {})
    stamped = stamp(nodes, records, today=date_str)
    write_auto(stamped, date_str)
    return stamped


# ----------------------------------------------------------------- rendering

_STATUS_CLASS = {"done": "done", "active": "active", "idle": "idle", "not-started": "notstarted"}


def mermaid_id(node_id):
    return "n_" + re.sub(r"[^A-Za-z0-9_]", "_", node_id)


def _label_text(s):
    return str(s).replace('"', "#quot;")


def idle_label(node, auto_entry):
    """'done', 'active · 12d idle', 'not-started · no evidence'."""
    status = node.get("status") or "?"
    if status == "done":
        return "done"
    days = (auto_entry or {}).get("days_idle")
    if days is None:
        return "%s · no evidence" % status
    return "%s · %dd idle" % (status, days)


def render_mermaid(nodes, auto_nodes):
    """Mermaid flowchart of the given nodes, grouped by wave, coloured by status.

    Only nodes marked public: true are drawn, whatever the caller passes, and edges are
    restricted to pairs that are both drawn.
    """
    nodes = public_nodes(nodes)
    ids = {n["id"] for n in nodes}
    lines = ["graph TD"]
    for wave in WAVES:
        in_wave = [n for n in nodes if n.get("wave") == wave]
        if not in_wave:
            continue
        lines.append('  subgraph wave%d["Wave %d"]' % (wave, wave))
        for n in sorted(in_wave, key=lambda x: x["id"]):
            label = "%s<br/>%s" % (_label_text(n.get("title")),
                                   _label_text(idle_label(n, auto_nodes.get(n["id"]))))
            lines.append('    %s["%s"]' % (mermaid_id(n["id"]), label))
        lines.append("  end")
    for a, b in edges(nodes):
        if a in ids and b in ids:
            lines.append("  %s --> %s" % (mermaid_id(a), mermaid_id(b)))
    lines += [
        "  classDef done fill:#2e7d32,stroke:#1b5e20,color:#ffffff",
        "  classDef active fill:#1565c0,stroke:#0d47a1,color:#ffffff",
        "  classDef idle fill:#ef6c00,stroke:#e65100,color:#ffffff",
        "  classDef notstarted fill:#546e7a,stroke:#37474f,color:#ffffff",
    ]
    for n in sorted(nodes, key=lambda x: x["id"]):
        lines.append("  class %s %s" % (mermaid_id(n["id"]), _STATUS_CLASS.get(n.get("status"), "notstarted")))
    return "\n".join(lines)


def attention(nodes, auto_nodes, idle_days=IDLE_DAYS):
    """Nodes that need a person: unowned, idle longer than idle_days, or with no evidence.

    Done nodes are excluded. Returns [(node, [reasons])] in wave order.
    """
    out = []
    for n in sorted(nodes, key=lambda x: (x.get("wave", 9), x["id"])):
        if n.get("status") == "done":
            continue
        reasons = []
        if not (n.get("owner") or "").strip():
            reasons.append("unowned")
        entry = auto_nodes.get(n["id"]) or {}
        days = entry.get("days_idle")
        if days is None:
            if n.get("evidence"):
                reasons.append("evidence not stamped yet")
            else:
                reasons.append("no evidence")
        elif days > idle_days:
            reasons.append("idle %dd" % days)
        states = [(entry.get("evidence") or {}).get(u, {}).get("state") for u in (n.get("evidence") or [])]
        if states and all(st in ("merged", "closed") for st in states):
            reasons.append("all evidence landed; mark done?")
        if reasons:
            out.append((n, reasons))
    return out


def short_ref(url):
    """'rust-payjoin#1851' for an issue/PR URL, 'owner/repo' for a repo, else the host."""
    parts = url.rstrip("/").split("/")
    if "github.com" in url and len(parts) >= 7 and parts[-2] in ("pull", "issues", "discussions"):
        return "%s#%s" % (parts[-3], parts[-1])
    if "github.com" in url and len(parts) >= 7 and parts[-3] == "releases" and parts[-2] == "tag":
        return parts[-1]
    if "github.com" in url and len(parts) == 5:
        return "%s/%s" % (parts[-2], parts[-1])
    return parts[2] if len(parts) > 2 else url




# ----------------------------------------------------------------- editing

SETTABLE = ("owner", "status", "wave", "note")


def set_fields(text, node_id, changes):
    """Rewrite scalar fields of one record in the raw YAML text, keeping everything else
    byte for byte (comments, ordering, blank lines). Returns the new text.

    Only the simple one-line fields in SETTABLE are supported; edges and evidence are
    edited by hand. Raises KeyError for an unknown node or missing field."""
    lines = text.split("\n")
    start = next((i for i, l in enumerate(lines) if l.rstrip() == "- id: %s" % node_id), None)
    if start is None:
        raise KeyError("no node with id %r" % node_id)
    end = next((i for i in range(start + 1, len(lines)) if lines[i].startswith("- id: ")), len(lines))
    for field, value in changes.items():
        if field not in SETTABLE:
            raise KeyError("field %r is not settable here (use the editor)" % field)
        idx = next((i for i in range(start + 1, end) if lines[i].startswith("  %s:" % field)), None)
        if idx is None:
            raise KeyError("node %r has no %r line" % (node_id, field))
        if field == "wave":
            rendered = str(int(value))
        elif field == "owner" and not value:
            rendered = '""'
        elif field in ("owner", "status") and re.match(r"^[A-Za-z0-9_.-]+$", str(value)):
            rendered = str(value)
        else:
            rendered = '"%s"' % str(value).replace("\\", "\\\\").replace('"', '\\"')
        lines[idx] = "  %s: %s" % (field, rendered)
    return "\n".join(lines)

# ----------------------------------------------------------------- page payload

WAVE_TITLES = {
    0: "In flight",
    1: "Shared spec artifacts",
    2: "Bindings as unlocks",
    3: "First movers",
    4: "Institutional corridors",
}


def public_payload(nodes, auto_nodes, target="bip77-complete", idle_days=IDLE_DAYS,
                   stamped_at=None):
    """Everything the Unlocks page needs, computed over the public subgraph only.

    Edges, the critical path and the attention list are all restricted to the nodes passed
    in, so a caller that passes public_nodes() can embed the result on a public page: no
    private id, title or note can appear in it.
    """
    nodes = sorted(nodes, key=lambda n: (n.get("wave", 9), n["id"]))
    ids = {n["id"] for n in nodes}
    pub_edges = [(a, b) for a, b in edges(nodes) if a in ids and b in ids]
    path = longest_chain(nodes, target)
    out_nodes = []
    for n in nodes:
        entry = auto_nodes.get(n["id"]) or {}
        ev_state = entry.get("evidence") or {}
        out_nodes.append({
            "id": n["id"],
            "title": n.get("title", n["id"]),
            "kind": n.get("kind"),
            "wave": n.get("wave"),
            "owner": (n.get("owner") or "").strip(),
            "status": n.get("status"),
            "note": n.get("note") or "",
            "days_idle": entry.get("days_idle"),
            "last_activity": entry.get("last_activity"),
            "evidence": [
                {"url": u, "ref": short_ref(u),
                 "state": (ev_state.get(u) or {}).get("state", "unstamped")}
                for u in (n.get("evidence") or [])
            ],
            "blocked_by": sorted(a for a, b in pub_edges if b == n["id"]),
            "blocks": sorted(b for a, b in pub_edges if a == n["id"]),
        })
    return {
        "generated": date.today().isoformat(),
        "stamped_at": stamped_at,
        "idle_days": idle_days,
        "target": target,
        "waves": [{"wave": w, "title": WAVE_TITLES.get(w, "Wave %d" % w)}
                  for w in WAVES if any(n.get("wave") == w for n in nodes)],
        "nodes": out_nodes,
        "edges": [list(e) for e in pub_edges],
        "critical_path": path,
        "attention": [{"id": n["id"], "reasons": reasons}
                      for n, reasons in attention(nodes, auto_nodes, idle_days=idle_days)],
    }


def _h(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace('"', "&quot;"))


def render_html(payload):
    """The Unlocks page body: the payload as JSON for docs/javascripts/unlocks.js, plus a
    server-rendered table so the page reads without JavaScript and is indexed by search.
    JSON is escaped so it cannot close its own script element."""
    import json
    data = json.dumps(payload, separators=(",", ":")).replace("</", "<\\/")
    by_id = {n["id"]: n for n in payload["nodes"]}
    rows = []
    for n in payload["nodes"]:
        idle = "" if n["status"] == "done" or n["days_idle"] is None else "%dd" % n["days_idle"]
        owner = ('<a href="https://github.com/%s">@%s</a>' % (_h(n["owner"]), _h(n["owner"]))
                 if n["owner"] else '<span class="ug-muted">unowned</span>')
        ev = ", ".join('<a href="%s">%s</a>%s' % (
            _h(e["url"]), _h(e["ref"]),
            "" if e["state"] in ("unstamped", "unknown") else " <span class=\"ug-muted\">(%s)</span>" % _h(e["state"]))
            for e in n["evidence"])
        rows.append(
            '<tr data-id="%s"><td>%s</td><td class="ug-num">%s</td><td>%s</td><td>%s</td>'
            '<td><span class="ug-status ug-s-%s">%s</span></td><td class="ug-num">%s</td><td>%s</td></tr>'
            % (_h(n["id"]), _h(n["title"]), n["wave"], _h(n["kind"]), owner,
               _h(n["status"]), _h(n["status"]), idle, ev))
    path_html = " ".join(
        '<li>%s</li>' % _h(by_id[i]["title"]) for i in payload["critical_path"] if i in by_id)
    return (
        '<div class="ug" id="unlock-graph" data-idle-days="%d">\n'
        '<script type="application/json" id="ug-data">%s</script>\n'
        '<div class="ug-tiles" id="ug-tiles"></div>\n'
        '<div class="ug-card ug-gwrap"><div class="ug-tiers" id="ug-graph"></div>'
        '<div class="ug-note" id="ug-focus">Hover a node to trace what feeds it and what it unlocks. Click to pin.</div></div>\n'
        '<h2 id="critical-path">Critical path</h2>\n'
        '<div class="ug-card"><ol class="ug-path" id="ug-path">%s</ol></div>\n'
        '<h2 id="needs-a-person">Needs a person</h2>\n'
        '<div class="ug-card" id="ug-attention"></div>\n'
        '<h2 id="all-nodes">All nodes</h2>\n'
        '<div class="ug-card ug-tablewrap"><table class="ug-table" id="ug-table"><thead><tr>'
        '<th>Node</th><th>Wave</th><th>Kind</th><th>Owner</th><th>Status</th><th>Idle</th><th>Evidence</th>'
        '</tr></thead><tbody>%s</tbody></table></div>\n'
        '<div class="ug-tip" id="ug-tip" hidden></div>\n'
        '</div>'
        % (payload["idle_days"], data, path_html, "\n".join(rows)))

# ----------------------------------------------------------------- CLI

def selftest():
    fixture = [
        {"id": "a", "title": "A", "kind": "artifact", "wave": 0, "public": True, "status": "done",
         "blocks": ["b"], "evidence": ["https://github.com/o/r/pull/1"]},
        {"id": "b", "title": "B", "kind": "spec", "wave": 1, "public": True, "status": "active",
         "blocked_by": ["a"], "evidence": ["https://github.com/o/r/pull/2"]},
        {"id": "c", "title": "Secret", "kind": "cohort", "wave": 2, "public": False,
         "status": "not-started", "blocked_by": ["b"]},
    ]
    assert validate(fixture) == [], validate(fixture)
    assert edges(fixture) == [("a", "b"), ("b", "c")]
    assert longest_chain(fixture, "c") == ["a", "b", "c"]
    assert longest_chain(public_nodes(fixture), "b") == ["a", "b"]
    bad = fixture + [{"id": "d", "title": "D", "kind": "spec", "wave": 1, "public": True,
                      "status": "idle", "blocked_by": ["nope"]}]
    assert any("unknown id 'nope'" in e for e in validate(bad)), validate(bad)
    cyc = [dict(n) for n in fixture]
    cyc[0]["blocked_by"] = ["c"]
    assert any(e.startswith("dependency cycle") for e in validate(cyc)), validate(cyc)
    recs = {"https://github.com/o/r/pull/1": {"kind": "pull", "state": "MERGED", "merged": True,
                                              "last_activity": "2026-09-01T00:00:00Z"},
            "https://github.com/o/r/pull/2": {"kind": "pull", "state": "OPEN", "draft": True,
                                              "last_activity": "2026-09-20T12:00:00Z"}}
    st = stamp(fixture, recs, today="2026-10-02")
    assert st["a"]["days_idle"] == 31 and st["a"]["evidence"][
        "https://github.com/o/r/pull/1"]["state"] == "merged", st["a"]
    assert st["b"]["days_idle"] == 12 and st["b"]["evidence"][
        "https://github.com/o/r/pull/2"]["state"] == "draft", st["b"]
    assert st["c"] == {"last_activity": None, "days_idle": None, "evidence": {}}, st["c"]
    mm = render_mermaid(fixture, st)
    assert "Secret" not in mm and "n_a --> n_b" in mm and "n_b --> n_c" not in mm, mm
    att = attention(public_nodes(fixture), st)
    assert [n["id"] for n, _ in att] == ["b"], att
    assert short_ref("https://github.com/payjoin/rust-payjoin/pull/1851") == "rust-payjoin#1851"
    assert short_ref("https://github.com/o/r") == "o/r"
    assert short_ref("https://www.nuget.org/packages/Payjoin") == "www.nuget.org"
    print("  unlocks selftest passed")
    return 0


def main(argv):
    if "--selftest" in argv:
        return selftest()
    cmd = argv[0] if argv else "check"
    if cmd == "check":
        errors = validate(load_nodes())
        if errors:
            for e in errors:
                print("error:", e)
            return 1
        print("%s: ok" % UNLOCKS)
        return 0
    if cmd == "stamp":
        import yaml
        if "--offline" not in argv:
            sys.exit("stamp runs from cached state only; pass --offline, or run scripts/refresh.py "
                     "for a live refresh")
        today = argv[argv.index("--today") + 1] if "--today" in argv else str(date.today())
        nodes = load_nodes()
        errors = validate(nodes)
        if errors:
            sys.exit("unlocks.yaml invalid:\n  " + "\n  ".join(errors))
        stamped = stamp(nodes, cached_records(yaml), today=today)
        print("wrote %s (%d nodes, %d with activity)" % (
            write_auto(stamped, today), len(stamped),
            sum(1 for v in stamped.values() if v["last_activity"])))
        return 0
    if cmd == "set":
        # unlocks.py set <id> owner=<handle> [status=done] [wave=N] [note=...]
        if len(argv) < 3 or any("=" not in a for a in argv[2:]):
            sys.exit("usage: unlocks.py set <id> field=value [field=value ...]  (fields: %s)"
                     % ", ".join(SETTABLE))
        node_id = argv[1]
        changes = dict(a.split("=", 1) for a in argv[2:])
        with open(UNLOCKS) as f:
            before = f.read()
        try:
            after = set_fields(before, node_id, changes)
        except KeyError as e:
            sys.exit("set: %s" % e)
        with open(UNLOCKS, "w") as f:
            f.write(after)
        errors = validate(load_nodes())
        if errors:
            with open(UNLOCKS, "w") as f:
                f.write(before)
            sys.exit("set: reverted, the change made the graph invalid:\n  " + "\n  ".join(errors))
        print("%s: %s" % (node_id, ", ".join("%s=%s" % kv for kv in changes.items())))
        return 0
    sys.exit(__doc__)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

"""Tests for the unlock graph: validator, stamping, critical path and the public filter.

Run with `python -m pytest` from the repository root (the nix devShell has pytest).
Tests that need mkdocs or jinja2 skip themselves when those are not importable.
"""
import json
import os
import shutil
import subprocess
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
sys.path.insert(0, ROOT)

import unlocks  # noqa: E402

PRIVATE_TITLE = "Zebra Custody Corp pilot"


def fixture_nodes():
    return [
        {"id": "hook", "title": "Fixed-ephemeral hook", "kind": "artifact", "wave": 1,
         "public": True, "owner": "", "blocked_by": [], "blocks": ["vectors"],
         "evidence": ["https://github.com/o/r/pull/1"], "status": "active", "note": "n1"},
        {"id": "vectors", "title": "Test vectors", "kind": "spec", "wave": 1,
         "public": True, "owner": "alice", "blocked_by": ["hook"], "blocks": ["bip77-complete"],
         "evidence": [], "status": "not-started", "note": ""},
        {"id": "specpr", "title": "Spec PR", "kind": "spec", "wave": 1,
         "public": True, "owner": "", "blocked_by": [], "blocks": ["bip77-complete"],
         "evidence": ["https://github.com/o/r/pull/2"], "status": "done", "note": ""},
        {"id": "bip77-complete", "title": "BIP Complete", "kind": "spec", "wave": 1,
         "public": True, "owner": "", "blocked_by": ["vectors", "specpr"], "blocks": ["secret"],
         "evidence": [], "status": "not-started", "note": ""},
        {"id": "secret", "title": PRIVATE_TITLE, "kind": "integration", "wave": 4,
         "public": False, "owner": "", "blocked_by": ["bip77-complete"], "blocks": [],
         "evidence": ["https://github.com/zebra/custody/issues/9"], "status": "not-started",
         "note": "pitch language that must never render"},
    ]


RECORDS = {
    "https://github.com/o/r/pull/1": {"kind": "pull", "state": "OPEN", "draft": True,
                                      "last_activity": "2026-09-03T16:51:39Z"},
    "https://github.com/o/r/pull/2": {"kind": "pull", "state": "MERGED", "merged": True,
                                      "merged_at": "2026-06-08T00:00:00Z",
                                      "last_activity": "2026-06-08T10:00:00Z"},
    "https://github.com/zebra/custody/issues/9": {"kind": "issue", "state": "OPEN",
                                                  "last_activity": "2026-10-01T00:00:00Z"},
}


# ----------------------------------------------------------------- validator

def test_fixture_is_valid():
    assert unlocks.validate(fixture_nodes()) == []


def test_validator_catches_dangling_id():
    nodes = fixture_nodes()
    nodes[1]["blocked_by"].append("does-not-exist")
    errors = unlocks.validate(nodes)
    assert any("unknown id 'does-not-exist'" in e for e in errors), errors


def test_validator_catches_cycle():
    nodes = fixture_nodes()
    nodes[0]["blocked_by"] = ["bip77-complete"]  # hook <- bip77-complete <- vectors <- hook
    errors = unlocks.validate(nodes)
    assert len(errors) == 1 and errors[0].startswith("dependency cycle"), errors
    assert "hook" in errors[0] and "bip77-complete" in errors[0]


def test_validator_requires_public_kind_wave():
    nodes = fixture_nodes()
    del nodes[0]["public"]
    nodes[1]["kind"] = "thing"
    nodes[2]["wave"] = 7
    errors = unlocks.validate(nodes)
    assert any("public must be true or false" in e for e in errors), errors
    assert any("kind must be one of" in e for e in errors), errors
    assert any("wave must be one of" in e for e in errors), errors


def test_seed_data_is_valid():
    yaml = pytest.importorskip("yaml")
    with open(os.path.join(ROOT, "data", "unlocks.yaml")) as f:
        nodes = [n for n in yaml.safe_load(f) if n]
    assert unlocks.validate(nodes) == []
    assert any(n["id"] == "bip77-complete" and n["public"] for n in nodes)


# ----------------------------------------------------------------- critical path

def test_critical_path_small_fixture():
    nodes = fixture_nodes()
    assert unlocks.longest_chain(nodes, "bip77-complete") == ["hook", "vectors", "bip77-complete"]
    # The private node extends the chain, but the public subgraph never sees it.
    assert unlocks.longest_chain(nodes, "secret") == ["hook", "vectors", "bip77-complete", "secret"]
    assert unlocks.longest_chain(unlocks.public_nodes(nodes), "secret") == []


def test_critical_path_tie_is_deterministic():
    nodes = fixture_nodes()
    nodes[2]["blocked_by"] = ["hook"]  # now hook->specpr->bip77-complete ties hook->vectors->bip77-complete
    chain = unlocks.longest_chain(nodes, "bip77-complete")
    assert chain == ["hook", "vectors", "bip77-complete"]


# ----------------------------------------------------------------- stamping

def test_offline_stamp():
    auto = unlocks.stamp(fixture_nodes(), RECORDS, today="2026-10-02")
    assert auto["hook"]["last_activity"] == "2026-09-03T16:51:39Z"
    assert auto["hook"]["days_idle"] == 29
    assert auto["hook"]["evidence"]["https://github.com/o/r/pull/1"]["state"] == "draft"
    assert auto["specpr"]["evidence"]["https://github.com/o/r/pull/2"]["state"] == "merged"
    assert auto["vectors"] == {"last_activity": None, "days_idle": None, "evidence": {}}


def test_stamp_keeps_unfetched_evidence_visible():
    auto = unlocks.stamp(fixture_nodes(), {}, today="2026-10-02")
    assert auto["hook"]["evidence"]["https://github.com/o/r/pull/1"] == {"state": "unstamped"}
    assert auto["hook"]["days_idle"] is None


def test_stamp_cli_offline_writes_sidecar(tmp_path, monkeypatch):
    yaml = pytest.importorskip("yaml")
    (tmp_path / "data").mkdir()
    with open(tmp_path / "data" / "unlocks.yaml", "w") as f:
        yaml.safe_dump(fixture_nodes(), f)
    with open(tmp_path / "data" / "auto-state.yaml", "w") as f:
        yaml.safe_dump(RECORDS, f)
    monkeypatch.chdir(tmp_path)
    assert unlocks.main(["stamp", "--offline", "--today", "2026-10-02"]) == 0
    with open(tmp_path / "data" / "unlocks-auto.yaml") as f:
        written = yaml.safe_load(f)
    assert written["stamped_at"] == "2026-10-02"
    assert written["nodes"]["hook"]["days_idle"] == 29
    # The human file is untouched by stamping.
    with open(tmp_path / "data" / "unlocks.yaml") as f:
        assert yaml.safe_load(f) == fixture_nodes()


def test_check_cli_fails_on_violation(tmp_path, monkeypatch, capsys):
    yaml = pytest.importorskip("yaml")
    nodes = fixture_nodes()
    nodes[0]["blocks"].append("ghost")
    (tmp_path / "data").mkdir()
    with open(tmp_path / "data" / "unlocks.yaml", "w") as f:
        yaml.safe_dump(nodes, f)
    monkeypatch.chdir(tmp_path)
    assert unlocks.main(["check"]) == 1
    assert "ghost" in capsys.readouterr().out


# ----------------------------------------------------------------- public filter

def test_attention_list():
    auto = unlocks.stamp(fixture_nodes(), RECORDS, today="2026-10-02")
    att = unlocks.attention(unlocks.public_nodes(fixture_nodes()), auto, idle_days=14)
    by_id = {n["id"]: reasons for n, reasons in att}
    assert "specpr" not in by_id  # done nodes are not listed
    assert by_id["hook"] == ["unowned", "idle 29d"]
    assert by_id["vectors"] == ["no evidence"]  # owned, but nothing observable yet
    assert "secret" not in by_id


def test_mermaid_never_emits_private_title():
    auto = unlocks.stamp(fixture_nodes(), RECORDS, today="2026-10-02")
    out = unlocks.render_mermaid(fixture_nodes(), auto)
    assert PRIVATE_TITLE not in out
    assert "zebra" not in out
    assert "n_hook --> n_vectors" in out
    assert "n_complete --> n_secret" not in out
    assert 'subgraph wave1["Wave 1"]' in out


class _StubEnv:
    """Just enough of the mkdocs-macros env for main.define_env."""

    def __init__(self):
        self.variables, self.macros, self.filters = {}, {}, {}

    def macro(self, fn):
        self.macros[fn.__name__] = fn
        return fn

    def filter(self, fn):
        self.filters[fn.__name__] = fn
        return fn


def _site_copy(tmp_path):
    """A minimal copy of the repository with the fixture graph in place of the real one."""
    yaml = pytest.importorskip("yaml")
    for name in ("mkdocs.yml", "main.py"):
        shutil.copy(os.path.join(ROOT, name), tmp_path / name)
    for d in ("docs", "scripts"):
        shutil.copytree(os.path.join(ROOT, d), tmp_path / d,
                        ignore=shutil.ignore_patterns("__pycache__"))
    (tmp_path / "data").mkdir()
    with open(tmp_path / "data" / "integrations.yaml", "w") as f:
        yaml.safe_dump([{"name": "Example Wallet", "status": "prospect", "class": "on_chain_wallet"}], f)
    with open(tmp_path / "data" / "research.yaml", "w") as f:
        yaml.safe_dump([], f)
    with open(tmp_path / "data" / "unlocks.yaml", "w") as f:
        yaml.safe_dump(fixture_nodes(), f)
    with open(tmp_path / "data" / "unlocks-auto.yaml", "w") as f:
        yaml.safe_dump({"stamped_at": "2026-10-02",
                        "nodes": unlocks.stamp(fixture_nodes(), RECORDS, today="2026-10-02")}, f)
    return tmp_path


def test_page_template_never_emits_private_title(tmp_path, monkeypatch):
    jinja2 = pytest.importorskip("jinja2")
    _site_copy(tmp_path)
    monkeypatch.chdir(tmp_path)
    import importlib
    main = importlib.import_module("main")
    env = _StubEnv()
    main.define_env(env)
    jenv = jinja2.Environment()
    jenv.filters.update(env.filters)
    with open(tmp_path / "docs" / "unlocks.md") as f:
        page = jenv.from_string(f.read()).render(**env.variables, **env.macros)
    assert PRIVATE_TITLE not in page
    assert "zebra" not in page
    assert "Fixed-ephemeral hook" in page and "BIP Complete" in page
    # critical path, computed: the server-rendered list starts at the hook
    path_html = page.split('<ol class="ug-path"', 1)[1].split("</ol>", 1)[0]
    assert path_html.lstrip().lstrip('id="ug-path">').lstrip().startswith("<li>Fixed-ephemeral hook</li>")
    assert "[rust-payjoin#" not in page  # fixture URLs only
    # Template-facing data must not contain the private node at all.
    assert all(n["public"] is True for n in env.macros["unlock_nodes"]())


def test_build_fails_on_invalid_graph(tmp_path, monkeypatch):
    yaml = pytest.importorskip("yaml")
    _site_copy(tmp_path)
    nodes = fixture_nodes()
    nodes[0]["blocks"].append("ghost")
    with open(tmp_path / "data" / "unlocks.yaml", "w") as f:
        yaml.safe_dump(nodes, f)
    monkeypatch.chdir(tmp_path)
    import importlib
    main = importlib.import_module("main")
    with pytest.raises(ValueError, match="ghost"):
        main.define_env(_StubEnv())


def test_site_build_excludes_private_node_from_page_and_search_index(tmp_path):
    pytest.importorskip("mkdocs")
    pytest.importorskip("material")
    pytest.importorskip("mkdocs_macros")
    _site_copy(tmp_path)
    proc = subprocess.run([sys.executable, "-m", "mkdocs", "build", "--strict", "-q"],
                          cwd=tmp_path, capture_output=True, text=True)
    assert proc.returncode == 0, proc.stderr
    page = (tmp_path / "site" / "unlocks" / "index.html").read_text()
    assert PRIVATE_TITLE not in page and "zebra" not in page
    assert "Fixed-ephemeral hook" in page
    index = (tmp_path / "site" / "search" / "search_index.json").read_text()
    assert PRIVATE_TITLE not in index and "zebra" not in index
    assert PRIVATE_TITLE in json.dumps(fixture_nodes())  # the fixture really carried it
    for root, _, files in os.walk(tmp_path / "site"):
        for name in files:
            path = os.path.join(root, name)
            if name.endswith((".html", ".json", ".xml", ".txt", ".js")):
                with open(path, errors="ignore") as f:
                    assert PRIVATE_TITLE not in f.read(), path


# ----------------------------------------------------------------- page payload

def test_payload_and_html_exclude_private_nodes():
    nodes = fixture_nodes()
    auto = unlocks.stamp(nodes, RECORDS, today="2026-10-02")
    pub = unlocks.public_nodes(nodes)
    payload = unlocks.public_payload(pub, auto, target="complete", stamped_at="2026-10-02")
    ids = {n["id"] for n in payload["nodes"]}
    assert "secret" not in ids
    for a, b in payload["edges"]:
        assert a in ids and b in ids
    for n in payload["nodes"]:
        assert all(x in ids for x in n["blocked_by"] + n["blocks"])
    assert all(i in ids for i in payload["critical_path"])
    assert all(a["id"] in ids for a in payload["attention"])
    html = unlocks.render_html(payload)
    assert PRIVATE_TITLE not in html
    assert "zebra" not in html
    assert 'id="ug-data"' in html and "</script>" in html
    # the JSON cannot terminate its own script element
    assert "<\\/" in html or "</" not in html.split('id="ug-data">', 1)[1].split("</script>", 1)[0]

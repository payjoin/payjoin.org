/* Unlocks page. Reads the JSON the build embeds (#ug-data) and draws the tiles, the
   wave-tiered dependency graph with hover tracing, the critical path and the attention
   list. The table is server-rendered; this file only makes it sortable. */
(function () {
  function init() {
    var root = document.getElementById('unlock-graph');
    var dataEl = document.getElementById('ug-data');
    if (!root || !dataEl || root.dataset.ready) return;
    root.dataset.ready = '1';
    var D = JSON.parse(dataEl.textContent);
    var byId = {};
    D.nodes.forEach(function (n) { byId[n.id] = n; });
    var up = {}, down = {};
    D.edges.forEach(function (e) {
      (down[e[0]] = down[e[0]] || []).push(e[1]);
      (up[e[1]] = up[e[1]] || []).push(e[0]);
    });
    var onPath = {};
    D.critical_path.forEach(function (id) { onPath[id] = true; });
    var STATUS = {
      'done': ['✓', 'done'],
      'active': ['●', 'active'],
      'idle': ['◔', 'idle'],
      'not-started': ['○', 'not started']
    };
    function esc(s) {
      return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }
    function chip(status) {
      var st = STATUS[status] || ['?', status];
      return '<span class="ug-status ug-s-' + esc(status) + '"><span class="ug-glyph">' + st[0] + '</span>' + esc(st[1]) + '</span>';
    }
    function idleText(n) {
      if (n.status === 'done' || n.days_idle == null) return '';
      return n.days_idle + 'd idle';
    }
    function closure(id, map) {
      var seen = {}, stack = [id];
      while (stack.length) {
        var x = stack.pop();
        (map[x] || []).forEach(function (y) { if (!seen[y]) { seen[y] = true; stack.push(y); } });
      }
      return seen;
    }

    /* tiles */
    var counts = { done: 0, active: 0, idle: 0, 'not-started': 0 }, unowned = 0, stale = 0;
    D.nodes.forEach(function (n) {
      counts[n.status] = (counts[n.status] || 0) + 1;
      if (n.status !== 'done' && !n.owner) unowned++;
      if (n.status !== 'done' && n.days_idle != null && n.days_idle > D.idle_days) stale++;
    });
    var tiles = [
      ['Nodes', D.nodes.length, 'public, of a larger private graph'],
      ['Done', counts.done, 'shipped'],
      ['Active', counts.active, 'moving'],
      ['Idle', stale, 'over ' + D.idle_days + ' days without activity'],
      ['Unowned', unowned, 'open nodes with nobody on them'],
      ['Critical path', D.critical_path.length, 'steps to ' + (byId[D.target] ? byId[D.target].title : D.target)]
    ];
    document.getElementById('ug-tiles').innerHTML = tiles.map(function (t) {
      return '<div class="ug-tile"><div class="ug-v">' + t[1] + '</div><div class="ug-k">' + esc(t[0]) + '</div><div class="ug-d">' + esc(t[2]) + '</div></div>';
    }).join('');

    /* graph */
    var graph = document.getElementById('ug-graph');
    graph.innerHTML = D.waves.map(function (w) {
      var nodes = D.nodes.filter(function (n) { return n.wave === w.wave; });
      var done = nodes.filter(function (n) { return n.status === 'done'; }).length;
      var pct = nodes.length ? Math.round(done / nodes.length * 100) : 0;
      return '<div class="ug-tier"><h4><span class="ug-wave">Wave ' + w.wave + '</span>' + esc(w.title) +
        '<span class="ug-prog" title="' + done + ' of ' + nodes.length + ' done">' + done + '/' + nodes.length + '</span></h4>' +
        '<div class="ug-bar" aria-hidden="true"><div class="ug-bar-fill" style="width:' + pct + '%"></div></div>' +
        nodes.map(function (n) {
          var meta = [n.kind, n.owner ? '@' + n.owner : 'unowned'];
          var idle = idleText(n);
          if (idle) meta.push(idle);
          return '<div class="ug-node ug-n-' + esc(n.status) + (onPath[n.id] ? ' ug-onpath' : '') + '" data-id="' + esc(n.id) + '" tabindex="0">' +
            '<div class="ug-row">' + chip(n.status) + (onPath[n.id] ? '<span class="ug-tag">critical path</span>' : '') + '</div>' +
            '<div class="ug-t">' + esc(n.title) + '</div>' +
            '<div class="ug-m">' + meta.map(esc).join(' · ') + '</div></div>';
        }).join('') + '</div>';
    }).join('');

    var nodeEls = Array.prototype.slice.call(graph.querySelectorAll('.ug-node'));
    var focusEl = document.getElementById('ug-focus');
    var tip = document.getElementById('ug-tip');
    var pinned = null;
    function trace(id) {
      var ups = closure(id, up), downs = closure(id, down);
      nodeEls.forEach(function (el) {
        var x = el.dataset.id;
        el.classList.toggle('is-focus', x === id);
        el.classList.toggle('is-up', !!ups[x]);
        el.classList.toggle('is-down', !!downs[x]);
        el.classList.toggle('is-dim', x !== id && !ups[x] && !downs[x]);
      });
      var n = byId[id];
      focusEl.innerHTML = '<b>' + esc(n.title) + '</b> — fed by ' + Object.keys(ups).length + ', unlocks ' + Object.keys(downs).length + (pinned ? ' · pinned, click again to release' : '');
    }
    function clear() {
      nodeEls.forEach(function (el) { el.classList.remove('is-focus', 'is-up', 'is-down', 'is-dim'); });
      focusEl.textContent = 'Hover a node to trace what feeds it and what it unlocks. Click to pin.';
    }
    function showTip(n, ev) {
      var evid = n.evidence.map(function (e) {
        return '<a href="' + esc(e.url) + '">' + esc(e.ref) + '</a>' + (e.state && e.state !== 'unstamped' && e.state !== 'unknown' ? ' <span class="ug-muted">' + esc(e.state) + '</span>' : '');
      }).join(', ');
      tip.innerHTML = '<div class="ug-tip-t">' + esc(n.title) + '</div>' +
        '<div class="ug-tip-id"><code>' + esc(n.id) + '</code> \u00B7 ' + esc(n.kind) + ' \u00B7 wave ' + n.wave + '</div>' +
        '<div class="ug-tip-r">' + chip(n.status) + (idleText(n) ? ' <span class="ug-muted">' + esc(idleText(n)) + '</span>' : '') + (n.last_activity ? ' <span class="ug-muted">last ' + esc(String(n.last_activity).slice(0, 10)) + '</span>' : '') + '</div>' +
        (n.note ? '<div class="ug-tip-n">' + esc(n.note) + '</div>' : '') +
        (evid ? '<div class="ug-tip-e">' + evid + '</div>' : '') +
        '<div class="ug-tip-cmd">claim: <code>' + esc(setCmd(n.id, 'owner', 'you')) + '</code><span class="ug-muted"> \u00B7 click the card to copy</span></div>';
      tip.hidden = false;
      moveTip(ev);
    }
    function moveTip(ev) {
      var pad = 14, w = tip.offsetWidth, h = tip.offsetHeight;
      var x = ev.clientX + pad, y = ev.clientY + pad;
      if (x + w > window.innerWidth - 8) x = ev.clientX - w - pad;
      if (y + h > window.innerHeight - 8) y = ev.clientY - h - pad;
      tip.style.left = x + 'px'; tip.style.top = y + 'px';
    }
    function setCmd(id, field, value) {
      return 'python scripts/unlocks.py set ' + id + ' ' + field + '=' + value;
    }
    function copyText(s, el) {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(s).then(function () {
        focusEl.innerHTML = 'Copied <code>' + esc(s) + '</code>. Run it in the tracker repo, or use the "Set an unlock node" workflow in the Actions tab.';
      }, function () {});
    }
    nodeEls.forEach(function (el) {
      el.addEventListener('mouseenter', function (ev) { if (!pinned) trace(el.dataset.id); showTip(byId[el.dataset.id], ev); });
      el.addEventListener('mousemove', moveTip);
      el.addEventListener('mouseleave', function () { tip.hidden = true; if (!pinned) clear(); });
      el.addEventListener('focus', function () { if (!pinned) trace(el.dataset.id); });
      el.addEventListener('blur', function () { if (!pinned) clear(); });
      el.addEventListener('click', function (ev) {
        if (ev.target.closest('a')) return;
        if (pinned === el.dataset.id) { pinned = null; clear(); return; }
        pinned = el.dataset.id; trace(pinned);
        copyText(setCmd(pinned, 'owner', 'you'), el);
      });
    });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && pinned) { pinned = null; clear(); } });

    /* critical path: chips with arrows */
    var pathEl = document.getElementById('ug-path');
    pathEl.innerHTML = D.critical_path.map(function (id, i) {
      var n = byId[id];
      return '<li class="ug-step ug-n-' + esc(n.status) + '" data-id="' + esc(id) + '">' + chip(n.status) + '<span class="ug-step-t">' + esc(n.title) + '</span>' + (idleText(n) ? '<span class="ug-muted">' + esc(idleText(n)) + '</span>' : '') + '</li>' + (i < D.critical_path.length - 1 ? '<li class="ug-arrow" aria-hidden="true">→</li>' : '');
    }).join('');

    /* attention */
    var att = document.getElementById('ug-attention');
    if (!D.attention.length) {
      att.innerHTML = '<p class="ug-muted">Every open node has an owner and recent activity.</p>';
    } else {
      att.innerHTML = '<table class="ug-table"><thead><tr><th>Node</th><th>Wave</th><th>Status</th><th>Why</th></tr></thead><tbody>' +
        D.attention.map(function (a) {
          var n = byId[a.id];
          return '<tr data-id="' + esc(a.id) + '"><td>' + esc(n.title) + '</td><td class="ug-num">' + n.wave + '</td><td>' + chip(n.status) + '</td><td>' + a.reasons.map(esc).join(', ') + '</td></tr>';
        }).join('') + '</tbody></table>';
    }

    /* table sorting + status chips */
    var table = document.getElementById('ug-table');
    table.querySelectorAll('td .ug-status').forEach(function (el) {
      var st = STATUS[el.textContent.trim()];
      if (st) el.innerHTML = '<span class="ug-glyph">' + st[0] + '</span>' + esc(st[1]);
    });
    var ths = table.querySelectorAll('th'), dir = 1, last = -1;
    ths.forEach(function (th, i) {
      th.addEventListener('click', function () {
        dir = (last === i) ? -dir : 1; last = i;
        var rows = Array.prototype.slice.call(table.tBodies[0].rows);
        rows.sort(function (a, b) {
          var x = a.cells[i].textContent.trim(), y = b.cells[i].textContent.trim();
          var nx = parseFloat(x), ny = parseFloat(y);
          if (!isNaN(nx) && !isNaN(ny)) return (nx - ny) * dir;
          return x.localeCompare(y) * dir;
        });
        rows.forEach(function (r) { table.tBodies[0].appendChild(r); });
        ths.forEach(function (t) { t.classList.remove('is-sorted'); });
        th.classList.add('is-sorted');
      });
    });
  }
  if (typeof document$ !== 'undefined' && document$.subscribe) document$.subscribe(init);
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/**
 * Dashboard — static, client-side. One component for every dashboard.
 * Data ships as ./data/dashboard/<key>.js (normalized states and scores only).
 */
(function () {
  const DATA = './data/dashboard/';
  const PLOTLY_SRC = './js/vendor/plotly.min.js';
  const HORIZONS = ['Long', 'Medium', 'Short'];
  const STATES = {
    '-2': { label: 'Strong ↓', color: '#324B5C', ink: '#FFFFFF' },
    '-1': { label: 'Turning ↓', color: '#AFC0CC', ink: '#181816' },
    '0': { label: 'Range', color: '#F1EFE8', ink: '#828075' },
    '1': { label: 'Turning ↑', color: '#E3C9B5', ink: '#181816' },
    '2': { label: 'Strong ↑', color: '#A05A32', ink: '#FFFFFF' }
  };
  const ACTIVITY = { '-1': 'Quiet', '0': 'Normal', '1': 'Elevated' };
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const FONT = { family: 'Inter, -apple-system, Segoe UI, sans-serif', size: 11, color: '#525049' };
  const CONFIG = { displaylogo: false, responsive: true, modeBarButtonsToRemove: ['toImage', 'lasso2d', 'select2d', 'zoom2d', 'pan2d', 'autoScale2d'] };

  const scripts = {};
  function loadScript(src) {
    if (!scripts[src]) {
      scripts[src] = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    return scripts[src];
  }
  const longDate = d => `${MONTHS[+d.slice(5, 7) - 1]} ${+d.slice(8, 10)}, ${d.slice(0, 4)}`;
  const pill = s => {
    const st = STATES[String(s)];
    return st ? `<span class="dash-pill" style="background:${st.color};color:${st.ink}">${st.label}</span>` : '<span class="dash-pill dash-pill-na">—</span>';
  };
  function stretchBar(v) {
    if (v == null) return '<span class="dash-muted">—</span>';
    const c = Math.max(-3, Math.min(3, v));
    const w = Math.abs(c) / 3 * 50;
    const side = c >= 0 ? `left:50%;width:${w}%;background:#A05A32` : `left:${50 - w}%;width:${w}%;background:#324B5C`;
    return `<div class="dash-stretch" title="${c >= 0 ? 'Above' : 'Below'} its anchor"><span class="dash-stretch-mid"></span><span class="dash-stretch-bar" style="${side}"></span></div>`;
  }

  function mount(root, key) {
    root.innerHTML = `
      <div class="dash">
        <div class="dash-head"></div>
        <div class="dash-summary"></div>
        <div class="dash-filters"></div>
        <div class="dash-table-wrap"><table class="dash-table"></table></div>
        <div class="dash-detail">
          <div class="dash-detail-title"></div>
          <div class="dash-plot"></div>
        </div>
        <div class="dash-legend"></div>
      </div>`;
    const el = sel => root.querySelector(sel);
    const state = { data: null, group: 'All', selected: null };
    el('.dash-table').innerHTML = '<tr><td class="dash-status">Loading dashboard…</td></tr>';

    Promise.all([loadScript(DATA + key + '.js'), window.Plotly ? null : loadScript(PLOTLY_SRC)]).then(() => {
      const data = (window.DASH_DATA || {})[key];
      if (!data) throw new Error('missing');
      state.data = data;
      const flat = data.groups.flatMap(g => g.items);
      state.selected = (flat.find(it => it.id === data.default) || flat[0] || {}).id;
      renderHead(); renderSummary(); renderFilters(); renderTable(); renderDetail(); renderLegend();
    }).catch(() => { el('.dash-table').innerHTML = '<tr><td class="dash-status">The dashboard could not load. Please try again later.</td></tr>'; });

    function items() { return state.data.groups.flatMap(g => g.items.map(it => Object.assign({ group: g.name }, it))); }

    function renderHead() {
      const d = state.data;
      el('.dash-head').innerHTML = `
        <div><span class="dash-kicker">${d.title}</span><span class="dash-asof">As of ${longDate(d.asOf)}</span></div>
        <div class="dash-meta">${d.count} indicators · ${d.groups.length} groups</div>`;
    }

    function renderSummary() {
      const all = items();
      el('.dash-summary').innerHTML = HORIZONS.map((h, j) => {
        const counts = { '-2': 0, '-1': 0, '0': 0, '1': 0, '2': 0 };
        all.forEach(it => { if (it.state[j] != null) counts[String(it.state[j])]++; });
        const n = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
        const segs = ['-2', '-1', '0', '1', '2'].filter(k => counts[k]).map(k =>
          `<span style="width:${counts[k] / n * 100}%;background:${STATES[k].color}" title="${STATES[k].label}: ${counts[k]}"></span>`).join('');
        const up = counts['2'], dn = counts['-2'];
        return `<div class="dash-sum-card">
          <div class="dash-sum-label">${h} horizon</div>
          <div class="dash-sum-bar">${segs}</div>
          <div class="dash-sum-note"><b>${up}</b> strong ↑ · <b>${dn}</b> strong ↓ · <b>${counts['0']}</b> range</div>
        </div>`;
      }).join('');
    }

    function renderFilters() {
      const names = ['All'].concat(state.data.groups.map(g => g.name));
      el('.dash-filters').innerHTML = names.map(n =>
        `<button data-g="${n}" class="${n === state.group ? 'active' : ''}">${n}</button>`).join('');
      root.querySelectorAll('.dash-filters button').forEach(b => b.addEventListener('click', () => {
        state.group = b.dataset.g;
        root.querySelectorAll('.dash-filters button').forEach(x => x.classList.toggle('active', x === b));
        const vis = items().filter(it => state.group === 'All' || it.group === state.group);
        if (!vis.some(it => it.id === state.selected) && vis.length) state.selected = vis[0].id;
        renderTable(); renderDetail();
      }));
    }

    function renderTable() {
      const head = `<thead><tr><th>Indicator</th>${HORIZONS.map(h => `<th class="c">${h}</th>`).join('')}<th class="c">Stretch</th><th class="c">Activity</th></tr></thead>`;
      const body = state.data.groups.filter(g => state.group === 'All' || g.name === state.group).map(g =>
        `<tr class="dash-group"><td colspan="6">${g.name}</td></tr>` + g.items.map(it => `
          <tr class="dash-row${it.id === state.selected ? ' selected' : ''}" data-id="${it.id}">
            <td class="dash-name">${it.label}</td>
            ${it.state.map(s => `<td class="c">${pill(s)}</td>`).join('')}
            <td class="c">${stretchBar(it.stretch)}</td>
            <td class="c"><span class="dash-act dash-act-${it.activity}">${ACTIVITY[String(it.activity)] || '—'}</span></td>
          </tr>`).join('')).join('');
      el('.dash-table').innerHTML = head + '<tbody>' + body + '</tbody>';
      root.querySelectorAll('.dash-row').forEach(r => r.addEventListener('click', () => {
        state.selected = r.dataset.id;
        root.querySelectorAll('.dash-row').forEach(x => x.classList.toggle('selected', x === r));
        renderDetail();
      }));
    }

    function renderDetail() {
      const it = items().find(x => x.id === state.selected);
      const ser = it && state.data.series[it.id];
      const plotEl = el('.dash-plot');
      if (!it || !ser) { plotEl.innerHTML = ''; return; }
      el('.dash-detail-title').innerHTML = `<b>${it.label}</b><span>${it.group} · past year</span>`;
      const x = state.data.dates;
      const scale = [];
      ['-2', '-1', '0', '1', '2'].forEach((k, i) => { scale.push([i / 5, STATES[k].color], [(i + 1) / 5, STATES[k].color]); });
      const labelOf = v => (v == null ? '—' : STATES[String(v)].label);
      const z = [ser.s, ser.m, ser.l];
      const heat = {
        type: 'heatmap', x, y: ['Short', 'Medium', 'Long'], z, zmin: -2.5, zmax: 2.5,
        colorscale: scale, showscale: false, xgap: 0, ygap: 3,
        text: z.map(row => row.map(labelOf)),
        hovertemplate: '%{x}<br>%{y}: %{text}<extra></extra>', yaxis: 'y', xaxis: 'x'
      };
      const line = {
        type: 'scatter', mode: 'lines', x, y: ser.v, line: { color: '#A05A32', width: 1.6 },
        fill: 'tozeroy', fillcolor: 'rgba(160,90,50,0.08)',
        hovertemplate: '%{x}<br>Stretch %{y:.1f}<extra></extra>', yaxis: 'y2', xaxis: 'x'
      };
      Plotly.newPlot(plotEl, [heat, line], {
        paper_bgcolor: '#FFFFFF', plot_bgcolor: '#FFFFFF', font: FONT, showlegend: false, height: 330,
        margin: { l: 70, r: 16, t: 8, b: 36 },
        hoverlabel: { bgcolor: '#FFFFFF', bordercolor: '#E5E3DB', font: { family: FONT.family, size: 11, color: '#181816' } },
        xaxis: { type: 'date', gridcolor: '#EFEDE6', linecolor: '#E5E3DB', tickformat: '%b %Y' },
        yaxis: { domain: [0.52, 1], fixedrange: true, tickfont: { size: 10.5 } },
        yaxis2: { domain: [0, 0.42], gridcolor: '#EFEDE6', zeroline: true, zerolinecolor: '#C9C6BB', fixedrange: true,
          title: { text: 'Stretch', font: { size: 10.5 } } }
      }, CONFIG);
    }

    function renderLegend() {
      el('.dash-legend').innerHTML =
        ['-2', '-1', '0', '1', '2'].map(k => `<span><i style="background:${STATES[k].color}"></i>${STATES[k].label}</span>`).join('') +
        `<span class="dash-legend-note">Normalized trend states and scores only · refreshed periodically</span>`;
    }
  }

  window.Dashboard = { mount };
})();

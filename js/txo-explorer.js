/**
 * TXO Volatility Explorer — static, client-side.
 * Data ships as .js files under ./data/txo/ (works on GitHub Pages and from disk).
 */
(function () {
  const DATA = './data/txo/';
  const PLOTLY_SRC = './js/vendor/plotly.min.js';
  const R = 0.015;
  const C = {
    ink: '#181816', ink2: '#525049', muted: '#828075', rule: '#E5E3DB', paper: '#FFFFFF',
    terracotta: '#A05A32', slate: '#324B5C', sand: '#E3C9B5'
  };
  const SURFACE_SCALE = [[0, '#EDF3F7'], [0.35, '#9FB3C1'], [0.7, '#E3C9B5'], [1, '#A05A32']];
  const FONT = { family: 'Inter, -apple-system, Segoe UI, sans-serif', size: 11, color: C.ink2 };

  // --- math -------------------------------------------------------------------
  function ncdf(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989422804014327 * Math.exp(-x * x / 2);
    const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return x >= 0 ? 1 - p : p;
  }
  function npdf(x) { return 0.3989422804014327 * Math.exp(-x * x / 2); }
  function greeks(F, K, T, vol, isCall) {
    if (!(F > 0 && K > 0 && T > 0 && vol > 0)) return null;
    const S = F * Math.exp(-R * T);
    const sq = Math.sqrt(T);
    const d1 = (Math.log(F / K) + 0.5 * vol * vol * T) / (vol * sq);
    const d2 = d1 - vol * sq;
    const df = Math.exp(-R * T);
    const common = -(S * npdf(d1) * vol) / (2 * sq);
    return {
      delta: isCall ? ncdf(d1) : ncdf(d1) - 1,
      gamma: npdf(d1) / (S * vol * sq),
      vega: S * npdf(d1) * sq / 100,
      theta: (isCall ? common - R * K * df * ncdf(d2) : common + R * K * df * ncdf(-d2)) / 365
    };
  }
  function ivAt(grid, ivs, m) {
    if (m < grid[0] || m > grid[grid.length - 1]) return null;
    let i = 0;
    while (i < grid.length - 2 && grid[i + 1] < m) i++;
    const a = ivs[i], b = ivs[i + 1];
    if (a == null || b == null) return a == null ? (Math.abs(m - grid[i + 1]) < 0.004 ? b : null) : (Math.abs(m - grid[i]) < 0.004 ? a : null);
    const w = (m - grid[i]) / (grid[i + 1] - grid[i]);
    return a + (b - a) * w;
  }
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const TENORS = [
    ['1W', 7, 2, 10, false], ['2W', 14, 11, 17, false], ['3W', 21, 18, 24, false],
    ['1M', 30, 25, 60, false], ['3M', 91, 61, 130, true], ['6M', 182, 131, 240, true]
  ];
  function isWednesdaySettled(e) {
    const wd = new Date(e[0] + 'T00:00:00Z').getUTCDay();
    return e[2] || wd === 3 || wd === 4;
  }
  function tenorExpiries(all) {
    const wed = all.filter(isWednesdaySettled);
    const out = [];
    for (const [label, target, lo, hi, monthlyOnly] of TENORS) {
      const pool = wed.filter(e => e[1] >= lo && e[1] <= hi && (!monthlyOnly || e[2]));
      if (!pool.length) continue;
      const e = pool.reduce((a, b) => Math.abs(b[1] - target) < Math.abs(a[1] - target) ? b : a);
      if (!out.some(x => x.e[0] === e[0])) out.push({ label, e });
    }
    return out;
  }
  const fmt = (v, nd = 1, suf = '') => (v == null || !isFinite(v) ? '—' : v.toFixed(nd) + suf);

  // --- data -------------------------------------------------------------------
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
  const store = () => (window.TXO_DATA = window.TXO_DATA || { months: {} });
  async function month(ym) {
    await loadScript(DATA + 'surfaces/' + ym + '.js').catch(() => null);
    return store().months[ym] || { days: {} };
  }
  async function day(dateStr) {
    const m = await month(dateStr.slice(0, 7));
    return m.days[dateStr] || null;
  }
  function loadPlotly() {
    return window.Plotly ? Promise.resolve() : loadScript(PLOTLY_SRC);
  }
  async function loadBase() {
    await Promise.all([loadScript(DATA + 'index.js'), loadScript(DATA + 'history.js')]);
    return [store().index, store().history];
  }
  function monthsBetween(a, b) {
    const out = [];
    let y = +a.slice(0, 4), m = +a.slice(5, 7);
    const yb = +b.slice(0, 4), mb = +b.slice(5, 7);
    while (y < yb || (y === yb && m <= mb)) {
      out.push(`${y}-${String(m).padStart(2, '0')}`);
      m++; if (m > 12) { m = 1; y++; }
    }
    return out;
  }
  function addDays(dateStr, n) {
    const d = new Date(dateStr + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  // --- layout helpers ---------------------------------------------------------
  function baseLayout(extra) {
    return Object.assign({
      paper_bgcolor: C.paper, plot_bgcolor: C.paper, font: FONT,
      margin: { l: 56, r: 16, t: 28, b: 44 }, showlegend: false,
      hoverlabel: { bgcolor: '#FFFFFF', bordercolor: C.rule, font: { family: FONT.family, size: 11, color: C.ink } }
    }, extra || {});
  }
  function axis(title, extra) {
    return Object.assign({ title: { text: title, font: { size: 10.5 } }, gridcolor: '#EFEDE6', zeroline: false, linecolor: C.rule }, extra || {});
  }
  const CONFIG = { displaylogo: false, responsive: true, modeBarButtonsToRemove: ['toImage', 'lasso2d', 'select2d'] };

  // --- component --------------------------------------------------------------
  function mount(root) {
    root.innerHTML = `
      <div class="txo-explorer">
        <div class="txo-controls">
          <label class="txo-field"><span>Date</span>
            <div class="txo-date-row">
              <button class="txo-step" data-step="-1" aria-label="Previous day">‹</button>
              <input type="date" class="txo-date" />
              <button class="txo-step" data-step="1" aria-label="Next day">›</button>
            </div>
          </label>
          <label class="txo-field"><span>Expiry</span><select class="txo-expiry"></select></label>
          <label class="txo-field"><span>Type</span>
            <div class="txo-seg"><button data-type="call" class="active">Call</button><button data-type="put">Put</button></div>
          </label>
          <label class="txo-field"><span>Strike</span><select class="txo-strike"></select></label>
        </div>
        <div class="txo-cards"></div>
        <div class="txo-tabs">
          <button data-tab="surface" class="active">Vol Surface</button>
          <button data-tab="smile">Smile & Greeks</button>
          <button data-tab="life">Contract Greeks</button>
          <button data-tab="history">IV Rank & History</button>
        </div>
        <div class="txo-plot"></div>
        <div class="txo-foot"></div>
      </div>`;
    const el = sel => root.querySelector(sel);
    const plotEl = el('.txo-plot');
    const state = { date: null, expiry: null, type: 'call', strike: null, tab: 'surface', idx: null, hist: null, grid: null, day: null };

    function setStatus(msg) { plotEl.innerHTML = `<div class="txo-status">${msg}</div>`; }
    setStatus('Loading explorer…');

    Promise.all([loadBase(), loadPlotly()]).then(async ([[idx, hist]]) => {
      state.idx = idx; state.hist = hist; state.grid = idx.grid;
      const dateEl = el('.txo-date');
      dateEl.min = hist.dates[0]; dateEl.max = hist.dates[hist.dates.length - 1];
      el('.txo-foot').textContent = `${idx.first} – ${idx.last} · fitted and aggregated values only`;
      await setDate(snapDate(idx.default || hist.dates[hist.dates.length - 1]));

      dateEl.addEventListener('change', e => setDate(snapDate(e.target.value)));
      root.querySelectorAll('.txo-step').forEach(b => b.addEventListener('click', () => {
        const i = state.hist.dates.indexOf(state.date) + (+b.dataset.step);
        if (i >= 0 && i < state.hist.dates.length) setDate(state.hist.dates[i]);
      }));
      el('.txo-expiry').addEventListener('change', e => {
        state.expiry = e.target.value;
        state.tenor = e.target.selectedOptions[0].textContent.split(' · ')[0];
        fillStrikes(); render();
      });
      el('.txo-strike').addEventListener('change', e => { state.strike = +e.target.value; render(); });
      root.querySelectorAll('.txo-seg button').forEach(b => b.addEventListener('click', () => {
        root.querySelectorAll('.txo-seg button').forEach(x => x.classList.toggle('active', x === b));
        state.type = b.dataset.type; render();
      }));
      root.querySelectorAll('.txo-tabs button').forEach(b => b.addEventListener('click', () => {
        root.querySelectorAll('.txo-tabs button').forEach(x => x.classList.toggle('active', x === b));
        state.tab = b.dataset.tab; render();
      }));
    }).catch(() => setStatus('The explorer could not load. Please try again later.'));

    function snapDate(d) {
      const ds = state.hist.dates;
      if (!d) return ds[ds.length - 1];
      let best = ds[0];
      for (const x of ds) { if (x <= d) best = x; else break; }
      return best;
    }

    async function setDate(d) {
      state.date = d;
      el('.txo-date').value = d;
      state.day = await day(d);
      const tenors = tenorExpiries(state.day || []);
      const expSel = el('.txo-expiry');
      expSel.innerHTML = tenors.map(({ label, e }) =>
        `<option value="${e[0]}">${label} · ${MONTHS[+e[0].slice(5, 7) - 1]} ${+e[0].slice(8, 10)} · ${e[1]}d</option>`).join('');
      const keep = tenors.find(t => t.label === state.tenor) || tenors.find(t => t.label === '1M') || tenors[0];
      state.expiry = keep ? keep.e[0] : null;
      state.tenor = keep ? keep.label : null;
      expSel.value = state.expiry || '';
      fillStrikes();
      render();
    }

    function currentExpiry() { return (state.day || []).find(e => e[0] === state.expiry) || null; }

    function fillStrikes() {
      const e = currentExpiry();
      const sSel = el('.txo-strike');
      if (!e) { sSel.innerHTML = ''; return; }
      const F = e[3], g = state.grid, ivs = e[4];
      const valid = g.filter((m, i) => ivs[i] != null);
      const lo = Math.ceil(F * valid[0] / 100) * 100, hi = Math.floor(F * valid[valid.length - 1] / 100) * 100;
      const strikes = [];
      for (let k = lo; k <= hi; k += 100) strikes.push(k);
      sSel.innerHTML = strikes.map(k => `<option value="${k}">${k.toLocaleString()}</option>`).join('');
      if (!strikes.includes(state.strike)) state.strike = strikes.reduce((a, b) => Math.abs(b - F) < Math.abs(a - F) ? b : a, strikes[0]);
      sSel.value = state.strike;
    }

    function histAt(key) {
      const i = state.hist.dates.indexOf(state.date);
      return i < 0 ? null : state.hist[key][i];
    }

    function renderCards() {
      const e = currentExpiry();
      let c = '';
      if (e && state.strike) {
        const vol = ivAt(state.grid, e[4], state.strike / e[3]);
        const g = vol ? greeks(e[3], state.strike, e[1] / 365, vol / 100, state.type === 'call') : null;
        c = `<div class="txo-card txo-card-contract">
          <div class="txo-card-label">Selected contract · ${state.strike.toLocaleString()} ${state.type}</div>
          <div class="txo-greeks">
            <div><b>${fmt(vol, 1, '%')}</b><span>IV</span></div>
            <div><b>${g ? fmt(g.delta, 2) : '—'}</b><span>Delta</span></div>
            <div><b>${g ? fmt(g.gamma * 1e4, 2) : '—'}</b><span>Gamma ×1e4</span></div>
            <div><b>${g ? fmt(g.vega, 1) : '—'}</b><span>Vega / 1 vol</span></div>
            <div><b>${g ? fmt(g.theta, 1) : '—'}</b><span>Theta / day</span></div>
          </div></div>`;
      }
      const iv30 = histAt('iv30'), rv = histAt('rv20');
      const cards = [
        ['30D ATM IV', fmt(iv30, 1, '%')],
        ['IV Rank · 1Y', fmt(histAt('rank'), 0)],
        ['IV Percentile · 1Y', fmt(histAt('pctl'), 0, '%')],
        ['25Δ Skew', fmt(histAt('rr25'), 1, ' pts')],
        ['20D Realized', fmt(rv, 1, '%')],
        ['IV − Realized', iv30 != null && rv != null ? fmt(iv30 - rv, 1, ' pts') : '—']
      ];
      el('.txo-cards').innerHTML = cards.map(([k, v]) =>
        `<div class="txo-card"><div class="txo-card-label">${k}</div><div class="txo-card-val">${v}</div></div>`).join('') + c;
    }

    async function render() {
      renderCards();
      if (!state.day) { setStatus('No surface available for this day.'); return; }
      plotEl.innerHTML = '';
      if (state.tab === 'surface') return drawSurface();
      if (state.tab === 'smile') return drawSmile();
      if (state.tab === 'life') return drawLife();
      return drawHistory();
    }

    function drawSurface() {
      const exps = state.day.filter(e => e[1] >= 5 && e[4].filter(v => v != null).length >= 5);
      const g = state.grid;
      const first = r => r.findIndex(v => v != null);
      const last = r => r.length - 1 - [...r].reverse().findIndex(v => v != null);
      const lo = Math.min(Math.max(...exps.map(e => first(e[4]))), g.findIndex(m => m >= 0.9 - 1e-9));
      const hi = Math.max(Math.min(...exps.map(e => last(e[4]))), g.findIndex(m => m >= 1.1 - 1e-9));
      const fill = r => r.map((v, i) => {
        if (v != null) return v;
        let j = 1;
        while (j < r.length) {
          if (r[i - j] != null) return r[i - j];
          if (r[i + j] != null) return r[i + j];
          j++;
        }
        return null;
      });
      const x = g.slice(lo, hi + 1).map(m => +(m * 100).toFixed(0));
      const nodes = exps.map(e => ({ t: e[1], iv: fill(e[4]).slice(lo, hi + 1) }));
      const t0 = nodes[0].t, t1 = nodes[nodes.length - 1].t, n = 28;
      const y = Array.from({ length: n }, (_, i) => Math.round(t0 + (t1 - t0) * i / (n - 1)));
      const z = y.map(t => {
        let k = nodes.findIndex(d => d.t >= t);
        if (k <= 0) return nodes[Math.max(k, 0)].iv;
        const a = nodes[k - 1], b = nodes[k], u = (t - a.t) / (b.t - a.t);
        return a.iv.map((va, j) => {
          const w = (1 - u) * va * va * a.t + u * b.iv[j] * b.iv[j] * b.t;
          return Math.sqrt(w / t);
        });
      });
      Plotly.newPlot(plotEl, [{
        type: 'surface', x, y, z, colorscale: SURFACE_SCALE, showscale: false,
        contours: { z: { show: true, usecolormap: true, width: 1, project: { z: false } } },
        hovertemplate: 'Moneyness %{x}%<br>%{y} days<br>IV %{z:.1f}%<extra></extra>'
      }], baseLayout({
        height: 520, margin: { l: 0, r: 0, t: 10, b: 0 },
        scene: {
          xaxis: { title: 'Moneyness (%)', gridcolor: C.rule, backgroundcolor: '#FAF9F5', showbackground: true },
          yaxis: { title: 'Days to expiry', gridcolor: C.rule, backgroundcolor: '#FAF9F5', showbackground: true },
          zaxis: { title: 'IV (%)', gridcolor: C.rule, backgroundcolor: '#FAF9F5', showbackground: true },
          camera: { eye: { x: -1.25, y: -1.3, z: 0.55 }, center: { x: 0, y: 0, z: -0.12 } },
          aspectmode: 'manual', aspectratio: { x: 1.3, y: 1.15, z: 0.8 }
        }
      }), CONFIG);
    }

    function strikeCurve(e) {
      const F = e[3], T = e[1] / 365, isCall = state.type === 'call';
      const rows = [];
      state.grid.forEach((m, i) => {
        if (e[4][i] == null) return;
        const K = Math.round(F * m);
        const g = greeks(F, K, T, e[4][i] / 100, isCall);
        rows.push({ K, iv: e[4][i], ...g });
      });
      return rows;
    }

    function drawSmile() {
      const e = currentExpiry();
      if (!e) return setStatus('No expiry selected.');
      const rows = strikeCurve(e);
      const K = rows.map(r => r.K);
      const line = (y, xa, ya, color) => ({ x: K, y, xaxis: xa, yaxis: ya, mode: 'lines', line: { color, width: 2 }, hovertemplate: '%{x:,}<br>%{y:.3f}<extra></extra>' });
      const vline = xa => ({ type: 'line', xref: xa, yref: xa.replace('x', 'y') + ' domain', x0: state.strike, x1: state.strike, y0: 0, y1: 1, line: { color: C.muted, width: 1, dash: 'dot' } });
      const fline = xa => ({ type: 'line', xref: xa, yref: xa.replace('x', 'y') + ' domain', x0: e[3], x1: e[3], y0: 0, y1: 1, line: { color: C.rule, width: 1 } });
      const traces = [
        line(rows.map(r => r.iv), 'x', 'y', C.terracotta),
        line(rows.map(r => r.delta), 'x2', 'y2', C.slate),
        line(rows.map(r => r.gamma * 1e4), 'x3', 'y3', C.slate),
        line(rows.map(r => r.vega), 'x4', 'y4', C.slate),
        line(rows.map(r => r.theta), 'x5', 'y5', C.slate)
      ];
      const shapes = ['x', 'x2', 'x3', 'x4', 'x5'].flatMap(a => [fline(a), vline(a)]);
      const ann = (t, xa, ya) => ({ text: t, xref: xa + ' domain', yref: ya + ' domain', x: 0, y: 1.12, showarrow: false, xanchor: 'left', font: { size: 11, color: C.ink } });
      Plotly.newPlot(plotEl, traces, baseLayout({
        height: 600, margin: { l: 56, r: 16, t: 30, b: 40 }, shapes,
        xaxis: axis('', { domain: [0, 1] }), yaxis: axis('IV (%)', { domain: [0.7, 1] }),
        xaxis2: axis('', { domain: [0, 0.47], anchor: 'y2' }), yaxis2: axis('', { domain: [0.36, 0.6], anchor: 'x2' }),
        xaxis3: axis('', { domain: [0.53, 1], anchor: 'y3' }), yaxis3: axis('', { domain: [0.36, 0.6], anchor: 'x3' }),
        xaxis4: axis('Strike', { domain: [0, 0.47], anchor: 'y4' }), yaxis4: axis('', { domain: [0, 0.26], anchor: 'x4' }),
        xaxis5: axis('Strike', { domain: [0.53, 1], anchor: 'y5' }), yaxis5: axis('', { domain: [0, 0.26], anchor: 'x5' }),
        annotations: [ann(`Smile · ${e[0]} · ${e[1]} days`, 'x', 'y'), ann('Delta', 'x2', 'y2'), ann('Gamma ×1e4', 'x3', 'y3'),
          ann('Vega per 1 vol point', 'x4', 'y4'), ann('Theta per day', 'x5', 'y5')]
      }), CONFIG);
    }

    async function drawLife() {
      const e = currentExpiry();
      if (!e) return setStatus('No expiry selected.');
      setStatus('Tracking contract…');
      const last = state.hist.dates[state.hist.dates.length - 1];
      const start = addDays(e[0], -120) < state.hist.dates[0] ? state.hist.dates[0] : addDays(e[0], -120);
      const end = e[0] < last ? e[0] : last;
      const months = monthsBetween(start, end);
      const packs = await Promise.all(months.map(month));
      const isCall = state.type === 'call', K = state.strike;
      const pts = [];
      packs.forEach(p => Object.keys(p.days).sort().forEach(d => {
        if (d < start || d > end) return;
        const ex = p.days[d].find(x => x[0] === e[0]);
        if (!ex) return;
        const vol = ivAt(state.grid, ex[4], K / ex[3]);
        if (vol == null) return;
        const g = greeks(ex[3], K, ex[1] / 365, vol / 100, isCall);
        if (g) pts.push({ d, iv: vol, ...g });
      }));
      if (!pts.length) return setStatus('This strike has no fitted history for the selected expiry.');
      plotEl.innerHTML = '';
      const x = pts.map(p => p.d);
      const tr = (key, i, color, scale = 1) => ({ x, y: pts.map(p => p[key] * scale), xaxis: 'x' + (i || ''), yaxis: 'y' + (i || ''), mode: 'lines', line: { color, width: 1.8 }, hovertemplate: '%{x}<br>%{y:.3f}<extra></extra>' });
      const panels = [['iv', 'IV (%)', C.terracotta, 1], ['delta', 'Delta', C.slate, 1], ['gamma', 'Gamma ×1e4', C.slate, 1e4], ['vega', 'Vega / 1 vol', C.slate, 1], ['theta', 'Theta / day', C.slate, 1]];
      const traces = panels.map((p, i) => tr(p[0], i ? i + 1 : '', p[2], p[3]));
      const layout = baseLayout({ height: 640, margin: { l: 60, r: 16, t: 34, b: 36 }, shapes: [], annotations: [] });
      const h = 1 / panels.length;
      panels.forEach((p, i) => {
        const k = i ? i + 1 : '';
        const top = 1 - i * h, bot = top - h + 0.045;
        layout['xaxis' + k] = axis('', { anchor: 'y' + k, showticklabels: i === panels.length - 1, matches: i ? 'x' : undefined });
        layout['yaxis' + k] = axis('', { domain: [bot, top - 0.01], anchor: 'x' + k });
        layout.annotations.push({ text: p[1], xref: 'paper', yref: 'paper', x: 0, y: top, yanchor: 'bottom', showarrow: false, xanchor: 'left', font: { size: 10.5, color: C.ink } });
        if (state.date >= x[0] && state.date <= x[x.length - 1]) {
          layout.shapes.push({ type: 'line', xref: 'x' + k, yref: 'y' + k + ' domain', x0: state.date, x1: state.date, y0: 0, y1: 1, line: { color: C.muted, width: 1, dash: 'dot' } });
        }
      });
      layout.annotations.push({ text: `${K.toLocaleString()} ${state.type} · expiry ${e[0]}`, xref: 'paper', yref: 'paper', x: 1, y: 1.045, xanchor: 'right', showarrow: false, font: { size: 11, color: C.ink2 } });
      Plotly.newPlot(plotEl, traces, layout, CONFIG);
    }

    function drawHistory() {
      const H = state.hist;
      const i = H.dates.indexOf(state.date);
      const lo = Math.max(0, i - 251);
      const past = H.iv30.slice(lo, i + 1).filter(v => v != null);
      const marker = { type: 'line', xref: 'x', yref: 'y domain', x0: state.date, x1: state.date, y0: 0, y1: 1, line: { color: C.muted, width: 1, dash: 'dot' } };
      const traces = [
        { x: H.dates, y: H.iv30, mode: 'lines', name: '30D ATM IV', line: { color: C.terracotta, width: 1.6 }, fill: 'tozeroy', fillcolor: 'rgba(227,201,181,0.35)' },
        { x: H.dates, y: H.rv20, mode: 'lines', name: '20D realized', line: { color: C.ink2, width: 1, dash: 'dash' } },
        { x: H.dates, y: H.rank, xaxis: 'x2', yaxis: 'y2', mode: 'lines', name: 'IV Rank', line: { color: C.slate, width: 1.4 } },
        { x: H.dates, y: H.pctl, xaxis: 'x2', yaxis: 'y2', mode: 'lines', name: 'IV Percentile', line: { color: C.terracotta, width: 1, dash: 'dot' } },
        { x: past, type: 'histogram', xaxis: 'x3', yaxis: 'y3', marker: { color: C.sand }, nbinsx: 24, name: 'Past year', hovertemplate: 'IV %{x}<br>%{y} days<extra></extra>' }
      ];
      const cur = H.iv30[i];
      Plotly.newPlot(plotEl, traces, baseLayout({
        height: 600, showlegend: true, legend: { orientation: 'h', x: 0, y: 1.08, font: { size: 10.5 } },
        margin: { l: 56, r: 16, t: 40, b: 40 },
        xaxis: axis('', { domain: [0, 1], anchor: 'y' }), yaxis: axis('Vol (%)', { domain: [0.55, 1] }),
        xaxis2: axis('', { domain: [0, 0.62], anchor: 'y2' }), yaxis2: axis('Rank / Percentile', { domain: [0, 0.4], range: [0, 100] }),
        xaxis3: axis('30D IV, past year (%)', { domain: [0.72, 1], anchor: 'y3' }), yaxis3: axis('Days', { domain: [0, 0.4], anchor: 'x3' }),
        shapes: [marker, Object.assign({}, marker, { xref: 'x2', yref: 'y2 domain' }),
          cur != null ? { type: 'line', xref: 'x3', yref: 'y3 domain', x0: cur, x1: cur, y0: 0, y1: 1, line: { color: C.terracotta, width: 2 } } : null].filter(Boolean),
        annotations: cur != null ? [{ text: 'selected day', xref: 'x3', yref: 'y3 domain', x: cur, y: 1, yanchor: 'bottom', showarrow: false, font: { size: 10, color: C.terracotta } }] : []
      }), CONFIG);
    }
  }

  window.TxoExplorer = { mount };
})();

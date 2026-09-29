/**
 * BEYOND MARKETS — Interactive Analytical Chart Engine
 * Pure Canvas & SVG implementations · Zero external dependencies
 */
(function(window) {
  'use strict';

  const Charts = {};

  // --------------------------------------------------------------------------
  // 1. Interactive 3D Options Implied Volatility Surface
  // --------------------------------------------------------------------------
  Charts.renderVolatilitySurface = function(containerEl) {
    containerEl.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';

    // Controls
    const controls = document.createElement('div');
    controls.className = 'font-mono';
    controls.style.display = 'flex';
    controls.style.gap = '20px';
    controls.style.fontSize = '0.72rem';
    controls.style.padding = '8px 12px';
    controls.style.marginBottom = '12px';
    controls.style.backgroundColor = '#FAF2ED';
    controls.style.border = '1px solid #E5E3DB';
    controls.style.borderRadius = '3px';
    controls.style.width = '100%';
    controls.style.justifyContent = 'space-between';
    controls.style.flexWrap = 'wrap';

    controls.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="color:#A05A32; font-weight:600;">INTERACTIVE MESH</span>
        <span style="color:#828075;">(Drag to rotate 3D view)</span>
      </div>
      <div style="display:flex; align-items:center; gap:16px;">
        <label>Selected Tenor: <select id="vol-tenor-sel" style="background:#fff; border:1px solid #C8C5BA; padding:2px 6px; font-family:monospace;">
          <option value="all">All Tenors (3D Surface)</option>
          <option value="14">14D Front-Month</option>
          <option value="30">30D Standard</option>
          <option value="90">90D Quarterly</option>
          <option value="180">180D Half-Year</option>
        </select></label>
        <span id="vol-readout" style="color:#324B5C; font-weight:bold;">ATM Vol: 18.4% | Skew: +6.4 pts</span>
      </div>
    `;

    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 380;
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
    canvas.style.cursor = 'grab';
    canvas.style.background = '#FAF9F5';
    canvas.style.borderRadius = '2px';

    wrapper.appendChild(controls);
    wrapper.appendChild(canvas);
    containerEl.appendChild(wrapper);

    const ctx = canvas.getContext('2d');
    let angleX = 0.55;
    let angleY = 0.72;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let filterTenor = 'all';

    // Moneyness from 0.85 to 1.15 (15 points)
    // Tenor from 7 to 180 days (8 points)
    const tenors = [7, 14, 30, 60, 90, 120, 150, 180];
    const moneyness = [0.85, 0.88, 0.91, 0.94, 0.97, 1.00, 1.03, 1.06, 1.09, 1.12, 1.15];

    function getVol(m, t) {
      // Skew formula: Higher vol for OTM puts (m < 1.0)
      const baseVol = 18.0 + (t / 180) * 3.5;
      const skew = Math.pow(1.0 - m, 2) * 110 + (1.0 - m) * 18.0;
      const termDecay = Math.exp(-t / 40) * 4.5;
      return baseVol + skew + termDecay;
    }

    function project(x, y, z) {
      // Rotate Y
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotate X
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const scale = 260 / (z2 + 420);
      const px = canvas.width / 2 + x1 * scale;
      const py = canvas.height / 2 + y2 * scale;
      return { x: px, y: py, depth: z2 };
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid bounding plane
      ctx.strokeStyle = '#E5E3DB';
      ctx.lineWidth = 1;

      // Draw surface wireframe lines across moneyness & tenors
      for (let tIdx = 0; tIdx < tenors.length; tIdx++) {
        const t = tenors[tIdx];
        if (filterTenor !== 'all' && parseInt(filterTenor) !== t) continue;

        const isHighlight = filterTenor !== 'all';
        ctx.beginPath();
        for (let mIdx = 0; mIdx < moneyness.length; mIdx++) {
          const m = moneyness[mIdx];
          const vol = getVol(m, t);

          // Map to 3D world space
          const wx = (m - 1.0) * 600;
          const wz = ((t - 90) / 90) * 140;
          const wy = -(vol - 18) * 10 + 20;

          const pt = project(wx, wy, wz);
          if (mIdx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = isHighlight ? '#A05A32' : '#324B5C';
        ctx.lineWidth = isHighlight ? 2.5 : 1.2;
        ctx.stroke();
      }

      // Draw transversal lines across moneyness slices
      if (filterTenor === 'all') {
        for (let mIdx = 0; mIdx < moneyness.length; mIdx += 2) {
          const m = moneyness[mIdx];
          ctx.beginPath();
          for (let tIdx = 0; tIdx < tenors.length; tIdx++) {
            const t = tenors[tIdx];
            const vol = getVol(m, t);
            const wx = (m - 1.0) * 600;
            const wz = ((t - 90) / 90) * 140;
            const wy = -(vol - 18) * 10 + 20;

            const pt = project(wx, wy, wz);
            if (tIdx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.strokeStyle = '#D2CFC5';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Labels on axes
      ctx.fillStyle = '#828075';
      ctx.font = '10px JetBrains Mono, monospace';
      const origin = project(-100, 40, -100);
      ctx.fillText('← OTM Puts (Downside Skew)', 30, canvas.height - 24);
      ctx.fillText('OTM Calls →', canvas.width - 120, canvas.height - 24);
      ctx.fillText('▲ Implied Volatility (σ)', 30, 30);
    }

    // Drag events
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      canvas.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      angleY += dx * 0.008;
      angleX = Math.max(0.1, Math.min(1.4, angleX - dy * 0.008));
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      draw();
    });
    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        canvas.style.cursor = 'grab';
      }
    });

    const tenorSelect = controls.querySelector('#vol-tenor-sel');
    tenorSelect.addEventListener('change', (e) => {
      filterTenor = e.target.value;
      const readout = controls.querySelector('#vol-readout');
      if (filterTenor === '14') readout.innerText = '14D Front: ATM 21.2% | Skew: +8.9 pts (Elevated tail risk)';
      else if (filterTenor === '30') readout.innerText = '30D Tenor: ATM 19.5% | Skew: +6.4 pts (Roll anchor)';
      else if (filterTenor === '90') readout.innerText = '90D Quarterly: ATM 18.2% | Skew: +4.1 pts (Flattened)';
      else readout.innerText = 'ATM Vol: 18.4% | Skew: +6.4 pts';
      draw();
    });

    draw();
  };

  // --------------------------------------------------------------------------
  // 2. Interactive Cross-Asset Momentum Matrix
  // --------------------------------------------------------------------------
  Charts.renderMomentumMatrix = function(containerEl) {
    containerEl.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.className = 'font-mono';

    const assets = [
      { name: 'USD/JPY (FX)', h1m: -2.4, h3m: +4.1, h6m: +8.2, h12m: +14.5, regime: 'Yield Divergence' },
      { name: 'EUR/USD (FX)', h1m: +1.1, h3m: -1.8, h6m: -3.4, h12m: -5.2, regime: 'Growth Drag' },
      { name: 'US 10Y Yield (Rates)', h1m: +3.2, h3m: +7.8, h6m: +12.4, h12m: +2.1, regime: 'Inflation Repricing' },
      { name: 'S&P 500 (Equities)', h1m: +2.8, h3m: +6.5, h6m: +14.2, h12m: +22.0, regime: 'Earnings Momentum' },
      { name: 'Brent Crude (Energy)', h1m: -4.5, h3m: -8.2, h6m: -1.5, h12m: +3.4, regime: 'Demand Contraction' },
      { name: 'Gold (Metals)', h1m: +4.6, h3m: +11.2, h6m: +18.7, h12m: +28.4, regime: 'Sovereign Hedge' }
    ];

    let tableHtml = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; background:#FAF2ED; padding:8px 12px; border:1px solid #E5E3DB;">
        <span style="color:#A05A32; font-weight:600; font-size:0.75rem;">CROSS-ASSET LOOKBACK PERFORMANCE MATRIX</span>
        <span style="color:#828075; font-size:0.7rem;">Click column header to sort</span>
      </div>
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:0.78rem; text-align:left; background:#fff; border:1px solid #E5E3DB;">
          <thead>
            <tr style="background:#F4F3EE; border-bottom:1px solid #C8C5BA; color:#525049;">
              <th style="padding:10px 14px;">Asset / Instrument</th>
              <th style="padding:10px 14px; text-align:right;">1M Return</th>
              <th style="padding:10px 14px; text-align:right;">3M Horizon</th>
              <th style="padding:10px 14px; text-align:right;">6M Horizon</th>
              <th style="padding:10px 14px; text-align:right;">12M Horizon</th>
              <th style="padding:10px 14px;">Primary State Regime</th>
            </tr>
          </thead>
          <tbody>
    `;

    assets.forEach(a => {
      function formatCell(val) {
        const isPos = val >= 0;
        const color = isPos ? '#2C5E3B' : '#A03232';
        const bg = isPos ? 'rgba(44,94,59,0.08)' : 'rgba(160,50,50,0.08)';
        return `<td style="padding:10px 14px; text-align:right; font-weight:600; color:${color}; background:${bg};">${isPos ? '+' : ''}${val.toFixed(1)}%</td>`;
      }

      tableHtml += `
        <tr style="border-bottom:1px solid #EAE8E0;">
          <td style="padding:10px 14px; font-weight:600; color:#181816;">${a.name}</td>
          ${formatCell(a.h1m)}
          ${formatCell(a.h3m)}
          ${formatCell(a.h6m)}
          ${formatCell(a.h12m)}
          <td style="padding:10px 14px; color:#525049;">${a.regime}</td>
        </tr>
      `;
    });

    tableHtml += `
          </tbody>
        </table>
      </div>
    `;

    wrapper.innerHTML = tableHtml;
    containerEl.appendChild(wrapper);
  };

  // --------------------------------------------------------------------------
  // 3. Macro Real-Yield Trajectory State Space
  // --------------------------------------------------------------------------
  Charts.renderMacroTrajectory = function(containerEl) {
    containerEl.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';

    const svg = `
      <svg viewBox="0 0 700 340" style="width:100%; height:auto; background:#FAF9F5; border:1px solid #E5E3DB; border-radius:2px;">
        <!-- Axes -->
        <line x1="80" y1="280" x2="640" y2="280" stroke="#C8C5BA" stroke-width="1.5" />
        <line x1="80" y1="40" x2="80" y2="280" stroke="#C8C5BA" stroke-width="1.5" />

        <text x="360" y="315" font-family="JetBrains Mono, monospace" font-size="11" fill="#828075" text-anchor="middle">US-JP 10Y Real Yield Differential (%) →</text>
        <text x="25" y="160" font-family="JetBrains Mono, monospace" font-size="11" fill="#828075" transform="rotate(-90 25 160)" text-anchor="middle">USD/JPY Spot Level →</text>

        <!-- Intervention Threshold Band -->
        <rect x="80" y="55" width="560" height="35" fill="rgba(160, 90, 50, 0.08)" />
        <line x1="80" y1="55" x2="640" y2="55" stroke="#A05A32" stroke-dasharray="4,4" stroke-width="1" />
        <text x="630" y="50" font-family="JetBrains Mono, monospace" font-size="10" fill="#A05A32" text-anchor="end">MOF Intervention Zone (155 - 160)</text>

        <!-- Trajectory Path -->
        <path d="M 120 250 Q 220 220, 310 180 T 460 110 T 540 68" fill="none" stroke="#324B5C" stroke-width="2.5" />

        <!-- State Markers -->
        <circle cx="120" cy="250" r="5" fill="#324B5C" />
        <text x="132" y="254" font-family="JetBrains Mono, monospace" font-size="10" fill="#181816">Regime 0: Neutral Carry</text>

        <circle cx="310" cy="180" r="5" fill="#324B5C" />
        <text x="322" y="184" font-family="JetBrains Mono, monospace" font-size="10" fill="#181816">Regime 1: Accelerated Widening</text>

        <circle cx="460" cy="110" r="5" fill="#324B5C" />
        <text x="472" y="114" font-family="JetBrains Mono, monospace" font-size="10" fill="#181816">Regime 2: Real Yield Decoupling</text>

        <circle cx="540" cy="68" r="6" fill="#A05A32" />
        <text x="480" y="90" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold" fill="#A05A32">Regime 3: Intervention Strain</text>
      </svg>
    `;

    wrapper.innerHTML = svg;
    containerEl.appendChild(wrapper);
  };

  window.AnalyticalCharts = Charts;
})(window);

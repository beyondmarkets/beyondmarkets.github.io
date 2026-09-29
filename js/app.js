/**
 * BEYOND MARKETS — Application Core & Routing Engine
 * Pure Vanilla JavaScript · Zero Dependencies · Static Execution
 */
(function(window) {
  'use strict';

  // Global publication store
  window.PUBLICATIONS = window.PUBLICATIONS || [];

  window.registerPublication = function(pub) {
    if (!pub || !pub.id) return;
    const existingIdx = window.PUBLICATIONS.findIndex(p => p.id === pub.id);
    if (existingIdx > -1) {
      window.PUBLICATIONS[existingIdx] = pub;
    } else {
      window.PUBLICATIONS.push(pub);
    }
  };

  // State
  const AppState = {
    currentRoute: 'home',
    currentSlug: null,
    selectedSection: 'all',
    selectedProduct: 'all',
    selectedTopic: 'all',
    searchQuery: '',
    searchOpen: false
  };

  function initApp() {
    setupEventListeners();
    handleHashChange();
  }

  function handleHashChange() {
    const rawHash = window.location.hash.replace(/^#/, '').trim();

    if (!rawHash || rawHash === 'home') {
      AppState.currentRoute = 'home';
      AppState.currentSlug = null;
      renderHomePage();
    } else if (rawHash === 'research' || rawHash === 'build' || rawHash === 'think') {
      AppState.currentRoute = rawHash;
      AppState.currentSlug = null;
      AppState.selectedSection = rawHash;
      renderArchivePage(rawHash);
    } else if (rawHash === 'about') {
      AppState.currentRoute = 'about';
      AppState.currentSlug = null;
      renderAboutPage();
    } else {
      // Find article by slug or id
      const article = window.PUBLICATIONS.find(p => p.slug === rawHash || p.id === rawHash);
      if (article) {
        AppState.currentRoute = 'article';
        AppState.currentSlug = rawHash;
        renderArticlePage(article);
      } else {
        AppState.currentRoute = 'home';
        AppState.currentSlug = null;
        renderHomePage();
      }
    }

    updateNavActiveState();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateNavActiveState() {
    document.querySelectorAll('.nav-item').forEach(item => {
      const link = item.querySelector('a');
      const href = link ? link.getAttribute('href') : '';
      if (
        (AppState.currentRoute === 'home' && (href === '#home' || href === '#')) ||
        (AppState.currentRoute === 'research' && href === '#research') ||
        (AppState.currentRoute === 'build' && href === '#build') ||
        (AppState.currentRoute === 'think' && href === '#think') ||
        (AppState.currentRoute === 'about' && href === '#about')
      ) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // Renderers
  // --------------------------------------------------------------------------

  function renderHomePage() {
    const mainEl = document.getElementById('app-main');
    if (!mainEl) return;

    const featuredList = window.PUBLICATIONS.filter(p => p.featured).slice(0, 4);

    mainEl.innerHTML = `
      <!-- Hero Section (Balanced 2-Column Editorial Layout) -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-grid">
            <!-- Left Column: Primary Position & Doctrine -->
            <div class="hero-main-col">
              <div>
                <div class="hero-meta">Independent Market Research</div>
                <h1 class="hero-title">BEYOND MARKETS</h1>
                <div class="hero-focus-tags">
                  <span>FX</span>
                  <span>·</span>
                  <span>Options</span>
                  <span>·</span>
                  <span>Derivatives</span>
                  <span>·</span>
                  <span>Cross-Asset</span>
                  <span>·</span>
                  <span>Macro</span>
                </div>
              </div>

              <div class="hero-lead-box">
                <p class="hero-lead">
                  An independent collection of research, observations, and ideas across markets and beyond. Exploring market behavior and cross-asset dynamics through quantitative research, visual analysis, structured observation, and independent thought.
                </p>
              </div>

              <div class="hero-doctrine-banner">
                <p>“From reality to model. From model to edge.”</p>
                <span>Independent market research, visualizations, and notes.</span>
              </div>
            </div>

            <!-- Right Column: Institutional Dispatch & Scope Card -->
            <div class="hero-dispatch-card">
              <div>
                <div class="dispatch-header">
                  <span class="dispatch-status">
                    <span class="dispatch-status-dot"></span>
                    ACTIVE INQUIRY DISPATCH
                  </span>
                  <span class="dispatch-badge font-mono">Q3 2026 CYCLE</span>
                </div>

                <div class="dispatch-body">
                  <div class="dispatch-focus-label">Current Focal Area</div>
                  <h3 class="dispatch-title">Where Strategies Work</h3>
                  <p class="dispatch-desc">
                    Mapping where trend, mean-reversion and range behavior show evidence — across asset classes, FX, equity indices and Treasury duration.
                  </p>

                  <div class="dispatch-stats-grid">
                    <div class="dispatch-stat-item">
                      <span class="stat-num">04</span>
                      <span class="stat-label">Studies</span>
                    </div>
                    <div class="dispatch-stat-item">
                      <span class="stat-num">${window.PUBLICATIONS.length || '07'}</span>
                      <span class="stat-label">Monographs</span>
                    </div>
                    <div class="dispatch-stat-item">
                      <span class="stat-num" style="font-size:0.95rem;">Multi-Asset</span>
                      <span class="stat-label">Coverage</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="dispatch-footer">
                <span style="display:inline-flex; gap:16px;">
                  <span class="dispatch-link" onclick="window.location.hash='#where-strategies-work-asset-classes'">Across Asset Classes →</span>
                  <span class="dispatch-link" onclick="window.location.hash='#where-strategies-work-fx'">FX →</span>
                </span>
                <a href="mailto:xiaohehazel@gmail.com" class="font-mono" style="color:var(--text-muted); text-decoration:underline;">
                  xiaohehazel@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Primary Pillars -->
      <section class="pillars-section">
        <div class="container">
          <div class="section-label">Primary Inquiry Dimensions</div>
          <div class="pillars-grid">
            <div class="pillar-card" onclick="window.location.hash='#research'">
              <div>
                <div class="pillar-num font-mono">01 / EMPIRICAL INVESTIGATION</div>
                <h3 class="pillar-title">What I Research</h3>
                <p class="pillar-desc">
                  Empirical market research, multi-asset factor behavior, regime classification dynamics, and structured quantitative investigation.
                </p>
              </div>
              <span class="pillar-link">Explore Research →</span>
            </div>

            <div class="pillar-card" onclick="window.location.hash='#build'">
              <div>
                <div class="pillar-num font-mono">02 / VISUAL & ANALYTICAL ARTIFACTS</div>
                <h3 class="pillar-title">What I Build</h3>
                <p class="pillar-desc">
                  Visual representations of market concepts, interactive options volatility surfaces, and analytical exploration tools.
                </p>
              </div>
              <span class="pillar-link">Explore Artifacts →</span>
            </div>

            <div class="pillar-card" onclick="window.location.hash='#think'">
              <div>
                <div class="pillar-num font-mono">03 / COMMENTARY & INTELLECTUAL NOTES</div>
                <h3 class="pillar-title">What I Think</h3>
                <p class="pillar-desc">
                  Market notes, macro state interpretations, product structural observations, and curated book and film notes.
                </p>
              </div>
              <span class="pillar-link">Explore Notes →</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Selections -->
      <section class="featured-section">
        <div class="container">
          <div class="section-label">Featured Selections</div>
          <div class="featured-grid">
            ${featuredList.map(pub => `
              <article class="featured-card" onclick="window.location.hash='#${pub.slug || pub.id}'">
                <div class="featured-image-box">
                  ${(pub.visual && pub.visual.imageSrc)
                    ? `<img src="${pub.visual.imageSrc}" alt="${pub.title}" loading="lazy" />`
                    : `<div class="featured-text-box"><p class="font-serif">“${(pub.pullQuote && pub.pullQuote.text) || pub.subtitle}”</p>${(pub.pullQuote && pub.pullQuote.attribution) ? `<span class="font-mono">— ${pub.pullQuote.attribution}</span>` : ''}</div>`}
                </div>
                <div class="featured-content">
                  <div class="featured-meta">
                    <span class="meta-tag font-mono">${pub.type}</span>
                    <span>·</span>
                    <span>${pub.readingTime || '5 min'}</span>
                  </div>
                  <h3 class="featured-card-title">${pub.title}</h3>
                  <p class="featured-card-desc">${pub.subtitle}</p>
                  <div class="featured-footer">
                    <span>${(pub.products || []).join(' · ')}</span>
                    <span style="color:var(--accent-terracotta);">Read Output →</span>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Archive Stream with Live Filters -->
      <section class="archive-section">
        <div class="container">
          <div class="section-label">Publication Archive & Chronological Stream</div>
          <div id="filter-bar-mount"></div>
          <div id="publication-list-mount"></div>
        </div>
      </section>
    `;

    renderFilterBar('filter-bar-mount');
    renderPublicationList('publication-list-mount');
  }

  function renderArchivePage(sectionName) {
    const mainEl = document.getElementById('app-main');
    if (!mainEl) return;

    const titles = {
      research: { title: 'What I Research', desc: 'Empirical research, factor behavior, and structured market investigations.' },
      build: { title: 'What I Build', desc: 'Visual, analytical, and conceptual artifacts, surfaces, and tools.' },
      think: { title: 'What I Think', desc: 'Market notes, macro state observations, and curated intellectual book & film essays.' }
    };

    const info = titles[sectionName] || titles.research;
    AppState.selectedSection = sectionName;

    mainEl.innerHTML = `
      <section class="hero-section" style="padding: 40px 0 28px;">
        <div class="container">
          <div class="hero-meta">Publication Pillar</div>
          <h1 class="hero-title">${info.title}</h1>
          <p class="hero-lead">${info.desc}</p>
        </div>
      </section>

      <section class="archive-section">
        <div class="container">
          <div id="filter-bar-mount"></div>
          <div id="publication-list-mount"></div>
        </div>
      </section>
    `;

    renderFilterBar('filter-bar-mount');
    renderPublicationList('publication-list-mount');
  }

  function renderFilterBar(mountId) {
    const mount = document.getElementById(mountId);
    if (!mount) return;

    // Preset topics requested:
    // strategy, derivative, regime, liquidity, credit, equity, fx, rates, macro, books, ideas, films
    const PRESET_TOPICS = [
      'strategy', 'derivative', 'regime', 'liquidity', 'credit',
      'equity', 'fx', 'rates', 'macro', 'books', 'ideas', 'films'
    ];
    const PRESET_PRODUCTS = [
      'FX', 'Rates', 'Options', 'Derivatives', 'Equities', 'Indices', 'Credit', 'Cross-Asset', 'Macro'
    ];

    // Collect topics: keep presets in order, dynamically append any new custom topics
    const topicsMap = new Map();
    PRESET_TOPICS.forEach(t => topicsMap.set(t.toLowerCase(), t));
    window.PUBLICATIONS.forEach(p => {
      (p.topics || []).forEach(top => {
        const lower = top.toLowerCase();
        if (!topicsMap.has(lower)) {
          topicsMap.set(lower, top.toLowerCase());
        }
      });
    });

    // Collect products: keep presets in order, dynamically append any new custom products
    const productsMap = new Map();
    PRESET_PRODUCTS.forEach(p => productsMap.set(p.toLowerCase(), p));
    window.PUBLICATIONS.forEach(p => {
      (p.products || []).forEach(prod => {
        const lower = prod.toLowerCase();
        if (!productsMap.has(lower)) {
          productsMap.set(lower, prod);
        }
      });
    });

    mount.innerHTML = `
      <div class="filter-bar">
        <div class="filter-tabs">
          <button class="filter-tab ${AppState.selectedSection === 'all' ? 'active' : ''}" data-section="all">All (${window.PUBLICATIONS.length})</button>
          <button class="filter-tab ${AppState.selectedSection === 'research' ? 'active' : ''}" data-section="research">What I Research</button>
          <button class="filter-tab ${AppState.selectedSection === 'build' ? 'active' : ''}" data-section="build">What I Build</button>
          <button class="filter-tab ${AppState.selectedSection === 'think' ? 'active' : ''}" data-section="think">What I Think</button>
        </div>

        <div class="filter-subtags">
          <span class="filter-subtag-label">Product / Asset:</span>
          <select id="sel-filter-product" class="filter-select">
            <option value="all">All Products</option>
            ${Array.from(productsMap.values()).map(pr => `<option value="${pr}" ${AppState.selectedProduct.toLowerCase() === pr.toLowerCase() ? 'selected' : ''}>${pr}</option>`).join('')}
          </select>

          <span class="filter-subtag-label">Topic:</span>
          <select id="sel-filter-topic" class="filter-select">
            <option value="all">All Topics</option>
            ${Array.from(topicsMap.values()).map(tp => `<option value="${tp}" ${AppState.selectedTopic.toLowerCase() === tp.toLowerCase() ? 'selected' : ''}>${tp}</option>`).join('')}
          </select>

          <div class="filter-results-count font-mono" id="filter-count-badge"></div>
        </div>
      </div>
    `;

    // Event listeners
    mount.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        AppState.selectedSection = tab.dataset.section;
        mount.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderPublicationList('publication-list-mount');
      });
    });

    const selProd = mount.querySelector('#sel-filter-product');
    if (selProd) {
      selProd.addEventListener('change', (e) => {
        AppState.selectedProduct = e.target.value;
        renderPublicationList('publication-list-mount');
      });
    }

    const selTop = mount.querySelector('#sel-filter-topic');
    if (selTop) {
      selTop.addEventListener('change', (e) => {
        AppState.selectedTopic = e.target.value;
        renderPublicationList('publication-list-mount');
      });
    }
  }

  function getFilteredPublications() {
    return window.PUBLICATIONS.filter(p => {
      // Section
      if (AppState.selectedSection !== 'all' && p.section !== AppState.selectedSection) {
        return false;
      }
      // Product
      if (AppState.selectedProduct !== 'all') {
        const selPrLower = AppState.selectedProduct.toLowerCase();
        const hasProd = (p.products || []).some(pr => {
          const prLower = pr.toLowerCase();
          return prLower === selPrLower || (selPrLower === 'derivatives' && (prLower === 'options' || prLower === 'derivative'));
        });
        if (!hasProd) return false;
      }
      // Topic
      if (AppState.selectedTopic !== 'all') {
        const selTopLower = AppState.selectedTopic.toLowerCase();
        const hasTop = (p.topics || []).some(t => {
          const tLower = t.toLowerCase();
          return tLower === selTopLower ||
                 tLower === selTopLower + 's' ||
                 tLower + 's' === selTopLower ||
                 (selTopLower === 'derivative' && (tLower === 'volatility' || tLower === 'surface' || tLower === 'options')) ||
                 (selTopLower === 'strategy' && tLower === 'systematic') ||
                 (selTopLower === 'films' && tLower === 'film');
        });
        if (!hasTop) return false;
      }
      // Search
      if (AppState.searchQuery.trim()) {
        const q = AppState.searchQuery.toLowerCase();
        const text = `${p.title} ${p.subtitle} ${(p.products || []).join(' ')} ${(p.topics || []).join(' ')} ${p.type} ${p.takeaway || ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date || '2026-01-01') - new Date(a.date || '2026-01-01'));
  }

  function renderPublicationList(mountId) {
    const mount = document.getElementById(mountId);
    if (!mount) return;

    const list = getFilteredPublications();
    const countBadge = document.getElementById('filter-count-badge');
    if (countBadge) {
      countBadge.innerText = `Showing ${list.length} publication${list.length === 1 ? '' : 's'}`;
    }

    if (list.length === 0) {
      mount.innerHTML = `
        <div style="background:#fff; border:1px solid var(--border-light); padding:40px; text-align:center; color:var(--text-muted);">
          <p class="font-serif" style="font-size:1.15rem; margin-bottom:8px; color:var(--text-primary);">No publications matched current criteria</p>
          <p class="font-mono" style="font-size:0.75rem;">Try resetting filters or adjusting search keyword.</p>
        </div>
      `;
      return;
    }

    mount.innerHTML = `
      <div class="publication-list">
        ${list.map(pub => `
          <div class="publication-row" onclick="window.location.hash='#${pub.slug || pub.id}'">
            <div class="row-meta">
              <span class="row-section-badge">${pub.section}</span>
              <span>${pub.date}</span>
              <span style="color:var(--text-secondary);">${pub.type}</span>
            </div>
            <div class="row-body">
              <h4 class="row-title">${pub.title}</h4>
              <p class="row-desc">${pub.subtitle}</p>
              <div class="row-tags">
                ${(pub.products || []).map(pr => `<span class="badge-tag">${pr}</span>`).join('')}
                ${(pub.topics || []).map(tp => `<span class="badge-tag" style="background:#FAF2ED; color:#A05A32;">${tp}</span>`).join('')}
              </div>
            </div>
            <div class="row-action font-mono">
              View Output →
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Article Page Renderer (Reusable Universal Publication Template)
  // --------------------------------------------------------------------------
  function renderArticlePage(pub) {
    const mainEl = document.getElementById('app-main');
    if (!mainEl) return;

    // Check if markdown content is present
    const hasMarkdown = !!pub.markdown;
    const renderedMarkdown = hasMarkdown ? window.MarkdownParser.parse(pub.markdown) : '';

    // Framework: What It Is → Evidence → Key Findings → Interpretation → Limits → Data / Method Note
    const toList = v => (Array.isArray(v) ? v : (v ? [v] : []));
    const interpretation = toList(pub.interpretation || pub.whyItMatters);
    const limits = toList(pub.limits);
    const hasFindings = (pub.keyObservations && pub.keyObservations.length > 0) || hasMarkdown;
    const labels = Object.assign({
      findings: 'KEY FINDINGS',
      interpretation: 'INTERPRETATION',
      limits: 'LIMITS',
      caption: 'Evidence'
    }, pub.labels || {});
    let sectionNo = 0;
    const nextNum = () => String(++sectionNo).padStart(2, '0');

    mainEl.innerHTML = `
      <article class="article-view">
        <div class="reading-container">
          <!-- Back Bar -->
          <div class="back-nav-bar">
            <span class="btn-back" onclick="window.history.back()">
              ← Back to Index
            </span>
            <div style="display:flex; gap:12px; align-items:center;">
              <span class="badge-tag font-mono" style="text-transform:uppercase;">${pub.status || 'Completed'}</span>
              <button class="btn-search font-mono" onclick="copyCitation('${pub.title}')">Cite / Share</button>
            </div>
          </div>

          <!-- Header -->
          <header class="article-header">
            <div class="article-meta-lead font-mono">
              <span>What I ${pub.section.charAt(0).toUpperCase() + pub.section.slice(1)}</span>
              <span>/</span>
              <span>${pub.type}</span>
            </div>
            <h1 class="article-title">${pub.title}</h1>
            <p class="article-subtitle">${pub.subtitle}</p>

            <div class="article-meta-bar">
              <div>
                <div class="meta-field-label">Date Published</div>
                <div class="meta-field-value">${pub.date}</div>
              </div>
              <div>
                <div class="meta-field-label">Reading Time</div>
                <div class="meta-field-value">${pub.readingTime || '5 min'}</div>
              </div>
              <div>
                <div class="meta-field-label">Products / Asset</div>
                <div class="meta-field-value">${(pub.products || []).join(', ') || 'Cross-Asset'}</div>
              </div>
              <div>
                <div class="meta-field-label">Topics</div>
                <div class="meta-field-value">${(pub.topics || []).join(' · ') || 'Systematic'}</div>
              </div>
            </div>
          </header>

          <!-- What It Is -->
          <section class="article-section-block">
            <div class="article-section-heading">
              <span class="heading-num font-mono">${nextNum()}</span>
              <span>WHAT IT IS</span>
            </div>
            <div class="article-prose">
              ${(pub.whatIsThis && pub.whatIsThis.length > 0)
                ? pub.whatIsThis.map((p, idx) => `<p class="${idx === 0 ? 'drop-cap-p' : ''}">${p}</p>`).join('')
                : '<p class="drop-cap-p">A structured investigation addressing specific market behavior under shifting liquidity regimes.</p>'
              }
            </div>
          </section>

          <!-- Selected Evidence -->
          ${pub.visual ? `
          <section class="article-section-block">
            <div class="article-section-heading">
              <span class="heading-num font-mono">${nextNum()}</span>
              <span>SELECTED EVIDENCE & ARTIFACT</span>
            </div>

            <div class="artifact-frame${pub.visual.wide ? ' artifact-wide' : ''}">
              <div class="artifact-toolbar">
                <span style="font-weight:600; color:var(--text-primary);">
                  ${(pub.visual && pub.visual.figureNumber) || 'Figure 01'} — Visual Artifact
                </span>
                <div class="artifact-toggle-btns">
                  ${(pub.interactiveChart || (pub.visual && pub.visual.interactiveAvailable)) ? `
                    <button class="artifact-toggle-btn active" id="btn-toggle-interactive">Interactive Model</button>
                    <button class="artifact-toggle-btn" id="btn-toggle-static">Publication Figure</button>
                  ` : `
                    <span class="font-mono" style="color:var(--text-muted); font-size:0.7rem;">High-Resolution Plate</span>
                  `}
                </div>
              </div>

              <div class="artifact-canvas-box" id="artifact-render-box">
                <!-- Rendered dynamically -->
              </div>

              <div class="artifact-caption">
                <strong>${labels.caption}:</strong> ${(pub.visual && pub.visual.caption) || 'Visualized empirical outputs from private market simulation.'}
              </div>
            </div>
          </section>
          ` : ''}

          <!-- Pull Quote -->
          ${pub.pullQuote ? `
            <div class="article-pull-quote">
              <div class="pull-quote-text font-serif">“${pub.pullQuote.text}”</div>
              ${pub.pullQuote.attribution ? `<div class="pull-quote-attr">— ${pub.pullQuote.attribution}</div>` : ''}
            </div>
          ` : ''}

          <!-- Key Findings (cards + tables / charts body) -->
          ${hasFindings ? `
            <section class="article-section-block">
              <div class="article-section-heading">
                <span class="heading-num font-mono">${nextNum()}</span>
                <span>${labels.findings}</span>
              </div>
              ${(pub.keyObservations && pub.keyObservations.length > 0) ? `
              <div class="observation-cards">
                ${pub.keyObservations.map((obs, idx) => `
                  <div class="observation-card">
                    <div>
                      <div class="observation-num font-mono">[${String(idx + 1).padStart(2, '0')}] ${obs.title}</div>
                      <p class="observation-detail">${obs.detail}</p>
                    </div>
                    ${obs.metric ? `
                      <div class="observation-metric font-mono">
                        <span class="metric-val">${obs.metric}</span>
                        ${obs.subnote ? `<span class="metric-sub">${obs.subnote}</span>` : ''}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
              ` : ''}
              ${hasMarkdown ? `
              <div class="article-prose findings-body">
                ${renderedMarkdown}
              </div>
              ` : ''}
            </section>
          ` : ''}

          <!-- Interpretation (why it matters) -->
          ${interpretation.length > 0 ? `
            <section class="article-section-block">
              <div class="article-section-heading">
                <span class="heading-num font-mono">${nextNum()}</span>
                <span>${labels.interpretation}</span>
              </div>
              <div class="article-prose">
                ${interpretation.map(p => `<p>${p}</p>`).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Limits (optional) -->
          ${limits.length > 0 ? `
            <section class="article-section-block">
              <div class="article-section-heading">
                <span class="heading-num font-mono">${nextNum()}</span>
                <span>${labels.limits}</span>
              </div>
              <ul class="limits-list">
                ${limits.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </section>
          ` : ''}

          <!-- Data / Method Note -->
          ${pub.dataNote ? `
            <div class="data-note">
              <span class="data-note-label font-mono">Data / Method Note</span>
              ${toList(pub.dataNote).map(p => `<p>${p}</p>`).join('')}
            </div>
          ` : ''}

          <!-- Publication Doctrine Footer -->
          <div class="publication-doctrine-box">
            <div class="doctrine-icon font-mono">⌖</div>
            <div class="doctrine-text font-mono">
              <p>From reality to model. From model to edge.</p>
              <span>Independent market research, visualizations, and notes.</span>
            </div>
          </div>
        </div>
      </article>
    `;

    // Mount visual / interactive chart
    setupArtifactMount(pub);
  }

  function setupArtifactMount(pub) {
    const mountBox = document.getElementById('artifact-render-box');
    if (!mountBox) return;

    const interactiveKind = pub.interactiveChart || (pub.visual && pub.visual.kind);
    const hasInteractive = interactiveKind && (interactiveKind === 'surface_3d' || interactiveKind === 'momentum_matrix' || interactiveKind === 'regime_path' || interactiveKind === 'txo_explorer' || interactiveKind === 'dashboard');
    const imageSrc = (pub.visual && pub.visual.imageSrc) || './charts/monograph_editorial.jpg';

    function showInteractive() {
      mountBox.innerHTML = '';
      if (interactiveKind === 'txo_explorer' && window.TxoExplorer) {
        window.TxoExplorer.mount(mountBox);
      } else if (interactiveKind === 'dashboard' && window.Dashboard) {
        window.Dashboard.mount(mountBox, pub.visual.dataKey);
      } else if (interactiveKind === 'surface_3d' && window.AnalyticalCharts.renderVolatilitySurface) {
        window.AnalyticalCharts.renderVolatilitySurface(mountBox);
      } else if (interactiveKind === 'momentum_matrix' && window.AnalyticalCharts.renderMomentumMatrix) {
        window.AnalyticalCharts.renderMomentumMatrix(mountBox);
      } else if (interactiveKind === 'regime_path' && window.AnalyticalCharts.renderMacroTrajectory) {
        window.AnalyticalCharts.renderMacroTrajectory(mountBox);
      } else {
        showStatic();
      }
    }

    function showStatic() {
      mountBox.innerHTML = `<img src="${imageSrc}" alt="${pub.title}" style="max-height:620px; width:auto; margin:0 auto; object-fit:contain;" />`;
    }

    // Default view
    if (hasInteractive) {
      showInteractive();
    } else {
      showStatic();
    }

    const btnInteractive = document.getElementById('btn-toggle-interactive');
    const btnStatic = document.getElementById('btn-toggle-static');

    if (btnInteractive && btnStatic) {
      btnInteractive.addEventListener('click', () => {
        btnInteractive.classList.add('active');
        btnStatic.classList.remove('active');
        showInteractive();
      });
      btnStatic.addEventListener('click', () => {
        btnStatic.classList.add('active');
        btnInteractive.classList.remove('active');
        showStatic();
      });
    }
  }

  // --------------------------------------------------------------------------
  // About Page
  // --------------------------------------------------------------------------
  function renderAboutPage() {
    const mainEl = document.getElementById('app-main');
    if (!mainEl) return;

    mainEl.innerHTML = `
      <section class="about-view">
        <div class="reading-container">
          <header class="about-header">
            <div class="hero-meta">Independent Market Research</div>
            <h1 class="about-title">About the Website</h1>
          </header>

          <div class="article-prose">
            <p style="font-size:1.05rem; line-height:1.75; color:var(--text-primary); margin-bottom:20px;">
              BEYOND MARKETS is an independent research publication exploring markets, derivatives, cross-asset dynamics, and ideas beyond the market.
            </p>
            <p class="drop-cap-p" style="font-size:1.02rem; line-height:1.75; color:var(--text-secondary); margin-bottom:28px;">
              I use market data, quantitative analysis, visual exploration, and structured observation to study how markets behave across different environments.
            </p>
            <p style="font-family:var(--font-mono); font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--accent-terracotta); margin-bottom:16px;">
              The site brings together selected work across three areas:
            </p>
          </div>

          <div class="pillars-grid" style="margin:20px 0 44px; grid-template-columns:1fr; gap:16px;">
            <div class="pillar-card" style="cursor:default;">
              <div>
                <div class="pillar-num font-mono">01 / EMPIRICAL INVESTIGATION</div>
                <h3 class="pillar-title">What I Research</h3>
                <p class="pillar-desc" style="margin-bottom:0;">
                  Empirical research and structured investigations into market behavior, systematic strategies, and cross-asset dynamics.
                </p>
              </div>
            </div>

            <div class="pillar-card" style="cursor:default;">
              <div>
                <div class="pillar-num font-mono">02 / VISUAL & ANALYTICAL ARTIFACTS</div>
                <h3 class="pillar-title">What I Build</h3>
                <p class="pillar-desc" style="margin-bottom:0;">
                  Visualizations, analytical tools, and conceptual frameworks for making market structure easier to observe and understand.
                </p>
              </div>
            </div>

            <div class="pillar-card" style="cursor:default;">
              <div>
                <div class="pillar-num font-mono">03 / COMMENTARY & INTELLECTUAL NOTES</div>
                <h3 class="pillar-title">What I Think</h3>
                <p class="pillar-desc" style="margin-bottom:0;">
                  Market notes, observations, and ideas — including selected notes on books, films, and subjects that shape how I think.
                </p>
              </div>
            </div>
          </div>

          <!-- Correspondence & Contact -->
          <div class="article-section-block">
            <div class="article-section-heading">
              <span class="heading-num font-mono">✉</span>
              <span>CORRESPONDENCE & CONTACT</span>
            </div>
            <div class="contact-card">
              <div class="contact-card-icon font-mono">✉</div>
              <div class="contact-card-content">
                <p class="contact-card-desc" style="font-size:0.95rem; margin-bottom:14px; color:var(--text-primary);">
                  For research inquiries, market discussions, feedback on published work, or intellectual exchange:
                </p>
                <div class="contact-email-row font-mono">
                  <a href="mailto:xiaohehazel@gmail.com" class="contact-email-link">xiaohehazel@gmail.com</a>
                  <button class="btn-search font-mono" id="btn-copy-email" onclick="copyContactEmail('xiaohehazel@gmail.com')">Copy Email</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // Global Event Listeners & Modals
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    window.addEventListener('hashchange', handleHashChange);

    // Keyboard shortcut ⌘K / Ctrl+K
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearchModal();
      }
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });

    const btnNavSearch = document.getElementById('btn-nav-search');
    if (btnNavSearch) {
      btnNavSearch.addEventListener('click', openSearchModal);
    }

    const btnSearchClose = document.getElementById('btn-search-close');
    if (btnSearchClose) {
      btnSearchClose.addEventListener('click', closeAllModals);
    }

    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        handleGlobalSearch(e.target.value);
      });
    }

    // Modal background click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllModals();
      });
    });
  }

  function openSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) {
      modal.classList.add('open');
      const input = document.getElementById('global-search-input');
      if (input) {
        input.value = '';
        input.focus();
        handleGlobalSearch('');
      }
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  }

  function handleGlobalSearch(query) {
    const resultsContainer = document.getElementById('search-results-list');
    if (!resultsContainer) return;

    const q = query.trim().toLowerCase();
    const matches = window.PUBLICATIONS.filter(p => {
      if (!q) return true;
      const combined = `${p.title} ${p.subtitle} ${(p.products || []).join(' ')} ${(p.topics || []).join(' ')} ${p.type}`.toLowerCase();
      return combined.includes(q);
    }).slice(0, 8);

    if (matches.length === 0) {
      resultsContainer.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-muted); font-size:0.85rem;">No publications found matching query</div>';
      return;
    }

    resultsContainer.innerHTML = matches.map(m => `
      <div class="search-result-item" onclick="window.location.hash='#${m.slug || m.id}'; closeSearchModal();">
        <div class="res-meta font-mono">What I ${m.section} · ${m.type}</div>
        <div class="res-title">${m.title}</div>
        <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">${m.subtitle}</div>
      </div>
    `).join('');
  }

  window.closeSearchModal = closeAllModals;

  window.copyCitation = function(title) {
    const citation = `${title}. BEYOND MARKETS Research Journal (2026). URL: ${window.location.href}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(citation).then(() => {
        alert('Citation copied to clipboard:\n\n' + citation);
      });
    }
  };

  window.copyContactEmail = function(email) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        const btn = document.getElementById('btn-copy-email');
        if (btn) {
          const original = btn.innerText;
          btn.innerText = 'Copied! ✓';
          setTimeout(() => { btn.innerText = original; }, 2000);
        } else {
          alert('Email copied to clipboard: ' + email);
        }
      });
    } else {
      alert('Email: ' + email);
    }
  };

  // Start app on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', initApp);

  window.App = {
    init: initApp,
    renderArticle: renderArticlePage
  };
})(window);

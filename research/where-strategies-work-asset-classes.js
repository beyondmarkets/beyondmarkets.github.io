/**
 * Publication: Where Do Strategies Work Across Asset Classes?
 * Series: Where Strategies Work (1 of 4)
 * Section: What I Research
 */
window.registerPublication({
  id: 'where-strategies-work-asset-classes',
  slug: 'where-strategies-work-asset-classes',
  section: 'research',
  type: 'Strategy Research',
  title: 'Where Do Strategies Work Across Asset Classes?',
  subtitle: 'Supportive evidence is sparse in every asset class. What really differs is which strategy family leads — and at which horizon.',
  products: ['Equities', 'Rates', 'Credit', 'Commodities', 'Cross-Asset'],
  topics: ['strategy', 'equity', 'rates', 'credit'],
  date: '2026-09-29',
  status: 'Active Inquiry',
  readingTime: '4 min read',
  featured: true,
  whatIsThis: [
    'A trading strategy that works in one market can fail in another. This study asks a simple question first: in which asset classes, and over which holding periods, do trend-following, mean-reversion and range strategies show the most evidence?'
  ],
  visual: {
    kind: 'image_monograph',
    imageSrc: './charts/where-strategies-work/asset_classes_evidence.png',
    figureNumber: 'Fig. 01',
    caption: 'Share of evaluated configurations showing supportive evidence in each asset class, with the horizon where that evidence clusters most.',
    interactiveAvailable: false
  },
  keyObservations: [
    {
      title: 'Evidence is sparse everywhere',
      detail: 'Across 6 asset classes, 39 markets and 158,000+ evaluated configurations, only a small minority show supportive evidence — in every class.',
      metric: '10–15%',
      subnote: 'supportive share, by class'
    },
    {
      title: 'Credit shows the broadest evidence',
      detail: 'US credit leads the group, with evidence spread from short to longer horizons.',
      metric: '15%',
      subnote: 'US Credit'
    },
    {
      title: 'Each class has its own leading strategy',
      detail: 'Mean reversion leads in equities, US Treasuries and commodities; range behavior leads in credit and sovereign bonds.',
      metric: '4 of 6',
      subnote: 'classes led by mean reversion'
    },
    {
      title: 'Horizon separates classes',
      detail: 'Developed-market equities lean toward longer horizons, while emerging-market equities and US Treasuries lean shorter.',
      metric: '20–60D vs 1–5D',
      subnote: 'DM equities vs Treasuries'
    }
  ],
  markdown: `
## Asset class overview

**Across 6 asset classes and 158,000+ evaluated configurations, stronger evidence is sparse — what differs most is the strategy family and the horizon where it appears.**

| Asset Class | Coverage | Robust Evidence | Observations | Leading Strategy | Dominant Horizon |
|---|---|---|---|---|---|
| **Developed-Market Equities** | 8 markets | **12%** | 3,936 / 34,115 | Mean Reversion | 20–60D |
| **Emerging-Market Equities** | 3 markets | **10%** | 1,325 / 12,639 | Mean Reversion | 1–5D |
| **US Treasuries** | 8 markets | **11%** | 3,488 / 31,063 | Mean Reversion | 1–5D |
| **US Credit** | 6 markets | **15%** | 3,639 / 24,301 | Range | 5–60D |
| **Global Sovereign Bonds** | 6 markets | **10%** | 2,414 / 23,122 | Range | 5–20D |
| **Commodities** | 8 markets | **12%** | 4,036 / 33,120 | Mean Reversion | 5–20D |

*Robust Evidence — share of evaluated configurations showing supportive evidence. Leading Strategy and Dominant Horizon — where that evidence appears most often.*

- Supportive evidence is a minority outcome in every class — no asset class is broadly "easy".
- Mean reversion leads in equities, US Treasuries and commodities; range behavior leads in credit and sovereign bonds.
- Trend following is the weakest family in most classes in this sample.

## Strategy × horizon, by asset class

**The strongest pockets are range behavior around the weekly horizon — in developed-market equities, credit, sovereign bonds and commodities — while trend following stays muted across the board.**

![Share of supportive evidence for each asset class, strategy family and horizon. Darker cells mark where evidence concentrates.](./charts/where-strategies-work/asset_classes_map.png)

- Weekly range behavior stands out in four of six asset classes.
- US Treasuries show their strongest mean-reversion evidence at the shortest horizon; commodities at the longest.
- Emerging-market equities are the exception: evidence is thinner and more scattered.

Continue the series → [FX](#where-strategies-work-fx) · [Equity Indices](#where-strategies-work-equity-indices) · [Treasury Curve](#where-strategies-work-duration)
  `,
  interpretation: [
    'The useful question is not whether a strategy works, but where. The same strategy family can look promising in one asset class and thin in the next, and the holding horizon often matters as much as the market itself.',
    'Knowing where evidence concentrates helps decide where to look first — and shows why applying one strategy uniformly across asset classes would dilute a local edge.'
  ],
  limits: [
    'Results describe where historical evidence appears; they are not forecasts or trading recommendations.',
    'Each asset class is represented by a small set of liquid ETFs, so results reflect those exposures rather than every instrument in the class.',
    'Evidence can shift as market environments change.'
  ],
  dataNote: 'Asset classes are represented using liquid ETFs to keep a consistent, price-based framework. US Treasuries span short-, intermediate- and long-duration exposures; US credit spans investment-grade, high-yield and other credit segments; commodities span precious metals, energy, base metals and agriculture. Figures show aggregated results only.'
});

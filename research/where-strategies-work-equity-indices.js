/**
 * Publication: Where Do Strategies Work in Equity Indices?
 * Series: Where Strategies Work (3 of 4)
 * Section: What I Research
 */
window.registerPublication({
  id: 'where-strategies-work-equity-indices',
  slug: 'where-strategies-work-equity-indices',
  section: 'research',
  type: 'Strategy Research',
  title: 'Where Do Strategies Work in Equity Indices?',
  subtitle: 'Mean reversion is the common thread across equity indices — but the depth of evidence varies widely by region, and US indices stand out.',
  products: ['Equities', 'Indices'],
  topics: ['strategy', 'equity'],
  date: '2026-09-29',
  status: 'Active Inquiry',
  readingTime: '4 min read',
  featured: false,
  whatIsThis: [
    'Equity indices from different regions are often assumed to behave alike. This study maps where trend-following, mean-reversion and range strategies show evidence across 11 developed- and emerging-market equity indices and four holding horizons.'
  ],
  visual: {
    kind: 'image_monograph',
    imageSrc: './charts/where-strategies-work/equity_indices_map.png',
    figureNumber: 'Fig. 01',
    caption: 'Evidence by equity index, strategy family and horizon — developed markets on top, emerging markets below.',
    interactiveAvailable: false
  },
  keyObservations: [
    {
      title: 'Mean reversion is the common thread',
      detail: 'Most equity indices show more promising mean-reversion evidence at one horizon or more.',
      metric: '8 of 11',
      subnote: 'indices with promising mean reversion'
    },
    {
      title: 'The Nasdaq-100 shows the broadest evidence',
      detail: 'Mean reversion at every horizon tested, and trend following from the weekly horizon onward.',
      metric: '17%',
      subnote: 'highest supportive share'
    },
    {
      title: 'Developed vs emerging horizons',
      detail: 'Developed-market evidence leans toward longer horizons; emerging-market evidence leans shorter.',
      metric: '20–60D vs 1–5D',
      subnote: 'developed vs emerging'
    },
    {
      title: 'Currency exposure changes the picture',
      detail: 'Japanese equities look different with and without currency hedging.',
      metric: '5D vs 20–60D',
      subnote: 'Japan: unhedged vs hedged'
    }
  ],
  markdown: `
## Developed vs emerging equity indices

**Across 11 equity indices and 46,000+ evaluated configurations, supportive evidence is sparse — developed markets lean toward longer horizons, emerging markets toward shorter ones.**

| Group | Coverage | Robust Evidence | Observations | Leading Strategy | Dominant Horizon |
|---|---|---|---|---|---|
| **Developed markets** | 8 indices | **12%** | 3,936 / 34,115 | Mean Reversion | 20–60D |
| **Emerging markets** | 3 indices | **10%** | 1,325 / 12,639 | Mean Reversion | 1–5D |

*Robust Evidence — share of evaluated configurations showing supportive evidence. Dominant Horizon — where that evidence appears most often.*

## Index by index

**Mean reversion appears in 8 of 11 indices; trend following appears mainly in US and European indices.**

| Index | Trend Following | Mean Reversion | Range | Evidence observed |
|---|---|---|---|---|
| US — S&P 500 | **More promising**<br>5D | **More promising**<br>5–60D | **More promising**<br>20D | 25 of 4,591 |
| US — Nasdaq-100 | **More promising**<br>5–60D | **More promising**<br>all horizons | Mixed | 24 of 4,366 |
| Japan | Limited | **More promising**<br>5D | Limited | 2 of 4,144 |
| Japan (FX-hedged) | Limited | **More promising**<br>20D | **More promising**<br>20–60D | 12 of 4,340 |
| United Kingdom | Limited | **More promising**<br>1D | Mixed | 1 of 3,934 |
| Eurozone | **More promising**<br>1D | Limited | Mixed | 1 of 4,220 |
| Europe | **More promising**<br>1D | **More promising**<br>1–5D | **More promising**<br>1D | 9 of 4,332 |
| Australia | Limited | **More promising**<br>5D | Limited | 1 of 4,188 |
| Emerging Markets (broad) | Limited | Limited | **More promising**<br>5D | 1 of 4,252 |
| South Korea | Limited | Mixed | Limited | 0 of 4,288 |
| Taiwan | Limited | **More promising**<br>1–5D | **More promising**<br>20D | 13 of 4,099 |

*More promising — stronger evidence observed (horizon shown). Mixed — supportive but less consistent. Limited — little evidence so far. Evidence observed — stronger results out of all specifications tested.*

### Nasdaq-100 — Strategy × Horizon

![Nasdaq-100: evidence by strategy family and horizon (number of specifications tested in brackets).](./charts/where-strategies-work/equity_us_nasdaq100.png)

**The Nasdaq-100 shows the broadest evidence of any index in the sample: mean reversion at every horizon tested, and trend following from the weekly horizon onward.**

### Japan (FX-hedged) — Strategy × Horizon

![Japan (FX-hedged): evidence by strategy family and horizon (number of specifications tested in brackets).](./charts/where-strategies-work/equity_japan_fx_hedged.png)

**Removing currency exposure changes the picture: hedged Japanese equities show range and mean-reversion evidence at longer horizons, while the unhedged index shows evidence only around the weekly horizon.**

Continue the series → [Across Asset Classes](#where-strategies-work-asset-classes) · [FX](#where-strategies-work-fx) · [Treasury Curve](#where-strategies-work-duration)
  `,
  interpretation: [
    'Equity indices share a common thread — mean reversion — but the depth of evidence varies widely by region. US indices show evidence across several strategy families and horizons, while some markets show very little.',
    'The Japan comparison is a reminder that what looks like a property of an equity market can partly reflect its currency exposure.'
  ],
  limits: [
    'Results describe where historical evidence appears; they are not forecasts or trading recommendations.',
    'Each market is represented by one liquid ETF, so results reflect that exposure, including its currency denomination.',
    'Emerging markets are covered by only three indices, so group-level conclusions there are less certain.'
  ],
  dataNote: 'Equity indices are represented using liquid, price-based ETFs — eight developed-market and three emerging-market exposures. Figures show aggregated results only.'
});

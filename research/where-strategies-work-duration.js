/**
 * Publication: Where Do Strategies Work Along the Treasury Curve?
 * Series: Where Strategies Work (4 of 4)
 * Section: What I Research
 */
window.registerPublication({
  id: 'where-strategies-work-duration',
  slug: 'where-strategies-work-duration',
  section: 'research',
  type: 'Strategy Research',
  title: 'Where Do Strategies Work Along the Treasury Curve?',
  subtitle: 'Mean-reversion evidence sits in the short and intermediate part of the curve — and fades at the long end.',
  products: ['Rates'],
  topics: ['strategy', 'rates'],
  date: '2026-09-29',
  status: 'Active Inquiry',
  readingTime: '4 min read',
  featured: false,
  whatIsThis: [
    'US Treasuries range from bills that mature in weeks to bonds that mature in decades, and they do not all behave the same way. This study maps where trend-following, mean-reversion and range strategies show evidence across eight Treasury exposures and four holding horizons.'
  ],
  visual: {
    kind: 'image_monograph',
    imageSrc: './charts/where-strategies-work/duration_map.png',
    figureNumber: 'Fig. 01',
    caption: 'Evidence by Treasury exposure, strategy family and horizon — short end on top, then intermediate to long maturities, then broad and inflation-linked exposures.',
    interactiveAvailable: false
  },
  keyObservations: [
    {
      title: 'Mean reversion carries the evidence',
      detail: 'Most Treasury exposures show more promising mean-reversion evidence; trend following and range behavior show very little.',
      metric: '5 of 8',
      subnote: 'exposures with promising mean reversion'
    },
    {
      title: 'The middle of the curve stands out',
      detail: 'Maturities from 1 to 10 years show mean-reversion evidence at the weekly and monthly horizons.',
      metric: '5–20D',
      subnote: 'intermediate maturities'
    },
    {
      title: 'The long end is quiet',
      detail: 'Long-dated Treasuries, the broad Treasury index and inflation-linked bonds show little evidence in any strategy family.',
      metric: '3 of 8',
      subnote: 'exposures with little evidence'
    },
    {
      title: 'Horizon lengthens with maturity',
      detail: 'Bills show their evidence at the shortest horizon; intermediate maturities at weekly to monthly horizons.',
      metric: '1D → 5–20D',
      subnote: 'bills → intermediate'
    }
  ],
  markdown: `
## Short end vs long end

**Across 8 Treasury exposures and 31,000+ evaluated configurations, supportive evidence is sparse — and it shifts toward longer horizons as maturity increases.**

| Segment | Coverage | Robust Evidence | Observations | Dominant Horizon |
|---|---|---|---|---|
| **Short end (bills to 3Y)** | 3 exposures | **12%** | 1,313 / 10,855 | 1–5D |
| **Intermediate to long (3Y to 20Y+)** | 3 exposures | **12%** | 1,415 / 12,202 | 5–20D |
| **Broad & inflation-linked** | 2 exposures | **9%** | 760 / 8,006 | 5–20D |

*Robust Evidence — share of evaluated configurations showing supportive evidence. Dominant Horizon — where that evidence appears most often.*

## Exposure by exposure

**Mean reversion appears from bills out to 10-year maturities, then disappears at the long end.**

| Exposure | Trend Following | Mean Reversion | Range | Evidence observed |
|---|---|---|---|---|
| T-Bills (1–3M) | Limited | **More promising**<br>1D · 60D | Limited | 4 of 3,373 |
| T-Bills (<1Y) | **More promising**<br>1D | **More promising**<br>1D | Mixed | 9 of 3,527 |
| Treasuries 1–3Y | Limited | **More promising**<br>5–20D | Limited | 7 of 3,955 |
| Treasuries 3–7Y | Limited | **More promising**<br>1–20D | Mixed | 5 of 4,109 |
| Treasuries 7–10Y | Limited | **More promising**<br>5–20D | Limited | 4 of 4,020 |
| Treasuries 20Y+ | Limited | Limited | Limited | 0 of 4,073 |
| Treasuries (broad) | Limited | Limited | Limited | 0 of 4,009 |
| Inflation-linked (TIPS) | Limited | Limited | Mixed | 0 of 3,997 |

*More promising — stronger evidence observed (horizon shown). Mixed — supportive but less consistent. Limited — little evidence so far. Evidence observed — stronger results out of all specifications tested.*

### Treasuries 3–7Y — Strategy × Horizon

![Treasuries 3–7Y: evidence by strategy family and horizon (number of specifications tested in brackets).](./charts/where-strategies-work/duration_treasuries_3_7y.png)

**The 3–7 year segment shows the broadest supportive evidence on the curve: mean reversion from the daily to the monthly horizon, with range behavior mixed.**

Continue the series → [Across Asset Classes](#where-strategies-work-asset-classes) · [FX](#where-strategies-work-fx) · [Equity Indices](#where-strategies-work-equity-indices)
  `,
  interpretation: [
    'Treasuries are often treated as one asset, but the curve is not uniform. Evidence clusters in the short and intermediate maturities, and the holding horizon where it appears lengthens as maturity increases.',
    'The quiet long end is as informative as the active middle: it marks where applying the same strategy would add little.'
  ],
  limits: [
    'Results describe where historical evidence appears; they are not forecasts or trading recommendations.',
    'Each maturity segment is represented by one liquid ETF, so results reflect that exposure rather than individual bonds.',
    'The sample spans several rate environments; evidence may shift as policy regimes change.'
  ],
  dataNote: 'US Treasuries are represented using liquid, price-based ETFs spanning bills, short, intermediate and long maturities, plus a broad Treasury index and inflation-linked bonds. Figures show aggregated results only.'
});

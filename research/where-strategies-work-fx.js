/**
 * Publication: Where Do Strategies Work in FX? G7 vs Emerging-Market Currencies
 * Series: Where Strategies Work (2 of 4)
 * Section: What I Research
 */
window.registerPublication({
  id: 'where-strategies-work-fx',
  slug: 'where-strategies-work-fx',
  section: 'research',
  type: 'Strategy Research',
  title: 'Where Do Strategies Work in FX? G7 vs Emerging-Market Currencies',
  subtitle: 'Mean reversion is the most common source of evidence in currencies — but G7 and emerging-market pairs find it at different horizons.',
  products: ['FX'],
  topics: ['strategy', 'fx'],
  date: '2026-09-29',
  status: 'Active Inquiry',
  readingTime: '5 min read',
  featured: true,
  whatIsThis: [
    'Currencies are often treated as one asset class, but major and emerging-market pairs behave differently. This study maps where trend-following, mean-reversion and range strategies show evidence across 16 currency pairs and four holding horizons.'
  ],
  visual: {
    kind: 'image_monograph',
    imageSrc: './charts/where-strategies-work/fx_evidence_map.png',
    figureNumber: 'Fig. 01',
    caption: 'Evidence by currency pair, strategy family and horizon — G7 pairs on top, emerging-market pairs below.',
    interactiveAvailable: false
  },
  keyObservations: [
    {
      title: 'Stronger evidence is sparse',
      detail: 'Across 16 FX products and 59,000+ evaluated configurations, stronger evidence is sparse — and highly dependent on market class and horizon.',
      metric: '59,554',
      subnote: 'configurations evaluated'
    },
    {
      title: 'Mean reversion dominates',
      detail: 'Most currency pairs show more promising mean-reversion evidence at one horizon or more.',
      metric: '11 of 16',
      subnote: 'pairs with promising mean reversion'
    },
    {
      title: 'G7 and EM differ by horizon',
      detail: 'G7 evidence clusters at shorter horizons; emerging-market evidence leans toward intermediate horizons.',
      metric: '1–5D vs 5–20D',
      subnote: 'G7 vs EM'
    },
    {
      title: 'Trend following is rare',
      detail: 'Only two currency pairs show more promising trend-following evidence at any horizon.',
      metric: '2 of 16',
      subnote: 'pairs with promising trend following'
    }
  ],
  markdown: `
## G7 vs emerging-market currencies

**Across 16 FX products and 59,000+ evaluated configurations, stronger evidence is sparse — and highly dependent on market class and horizon.**

| Group | Coverage | Robust Evidence | Observations | Leading Strategy | Dominant Horizon |
|---|---|---|---|---|---|
| **G7 currencies** | 7 pairs | **10%** | 2,673 / 26,562 | Mean Reversion | 1–5D |
| **Emerging-market currencies** | 9 pairs | **11%** | 3,619 / 32,992 | Mean Reversion | 5–20D |

*Robust Evidence — share of evaluated configurations showing supportive evidence. Dominant Horizon — where that evidence appears most often.*

## Inside G7

**EUR/USD tends to be more suitable for mean-reversion strategies than other G7 currencies — the evidence appears across every horizon tested.**

| Pair | Trend Following | Mean Reversion | Range | Evidence observed |
|---|---|---|---|---|
| EUR/USD | Limited | **More promising**<br>all horizons | Limited | 23 of 3,643 |
| GBP/USD | Limited | **More promising**<br>5D | Limited | 8 of 3,753 |
| AUD/USD | Limited | Mixed | **More promising**<br>5D | 1 of 3,811 |
| NZD/USD | **More promising**<br>60D | **More promising**<br>5D | Limited | 12 of 3,734 |
| USD/JPY | Limited | **More promising**<br>5D | Limited | 2 of 3,917 |
| USD/CAD | Limited | **More promising**<br>1D · 5D · 60D | Mixed | 13 of 3,918 |
| USD/CHF | Limited | Limited | Limited | 0 of 3,786 |

*More promising — stronger evidence observed (horizon shown). Mixed — supportive but less consistent. Limited — little evidence so far. Evidence observed — stronger results out of all specifications tested.*

### EUR/USD — Strategy × Horizon

![EUR/USD: evidence by strategy family and horizon (number of specifications tested in brackets).](./charts/where-strategies-work/fx_eurusd.png)

**Mean-reversion behavior in EUR/USD is more promising across short and longer horizons alike, while trend-following and range behavior show limited evidence.**

### AUD/USD — Strategy × Horizon

![AUD/USD: evidence by strategy family and horizon (number of specifications tested in brackets).](./charts/where-strategies-work/fx_audusd.png)

**The result suggests that range-based behavior is more promising for AUD/USD at the shorter horizon tested, while the evidence is weaker across other strategy–horizon combinations.**

## Inside emerging markets

**Emerging-market currencies also lean toward mean reversion, but evidence appears more often at intermediate horizons — and two pairs show little evidence in any strategy family.**

| Pair | Trend Following | Mean Reversion | Range | Evidence observed |
|---|---|---|---|---|
| USD/CNH | **More promising**<br>5D | **More promising**<br>20D | Limited | 5 of 3,767 |
| USD/HKD | Limited | **More promising**<br>5D | **More promising**<br>20D | 8 of 3,643 |
| USD/SGD | Limited | Limited | Limited | 0 of 3,902 |
| USD/KRW | Limited | Limited | Limited | 0 of 3,491 |
| USD/TWD | Limited | **More promising**<br>5–20D | Limited | 3 of 3,328 |
| USD/THB | Mixed | Limited | **More promising**<br>5D | 4 of 3,792 |
| USD/IDR | Limited | **More promising**<br>1–5D | Mixed | 2 of 3,554 |
| USD/INR | Limited | **More promising**<br>5D | Limited | 4 of 3,578 |
| USD/ZAR | Limited | **More promising**<br>60D | **More promising**<br>5D | 18 of 3,937 |

- USD/ZAR shows the most evidence among emerging-market pairs, across both mean-reversion and range behavior.
- USD/CNH is one of only two pairs in the whole FX sample with more promising trend-following evidence.

Continue the series → [Across Asset Classes](#where-strategies-work-asset-classes) · [Equity Indices](#where-strategies-work-equity-indices) · [Treasury Curve](#where-strategies-work-duration)
  `,
  interpretation: [
    'Currencies are not one homogeneous market. Mean reversion appears to be the most common source of evidence across both G7 and emerging-market pairs, but the horizon at which it shows up differs by group.',
    'A single FX strategy template applied across all pairs and horizons would mix a few pockets of evidence with large areas where evidence is thin.'
  ],
  limits: [
    'Results describe where historical evidence appears; they are not forecasts or trading recommendations.',
    'Some emerging-market currencies are managed or pegged, which can shape their behavior in ways that may not persist.',
    'Stronger results are few relative to everything tested, so individual cells are signals to investigate, not conclusions.'
  ],
  dataNote: 'FX is represented by exchange rates against the US dollar for 7 G7 and 9 emerging-market currencies. Figures show aggregated results only.'
});

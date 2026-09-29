/**
 * Publication: What Does the Taiwan Index Options Market Look Like?
 * Section: What I Build
 */
window.registerPublication({
  id: 'txo-options-statistics',
  slug: 'txo-options-statistics',
  section: 'build',
  type: 'Market Statistics',
  title: 'What Does the Taiwan Index Options Market Look Like?',
  subtitle: 'Volatility, skew, term structure and open interest in TXO options — 2023 to early 2026 in six pictures.',
  products: ['Options', 'Indices'],
  topics: ['derivative', 'equity'],
  date: '2026-09-29',
  status: 'Completed',
  readingTime: '4 min read',
  featured: false,
  whatIsThis: [
    'A statistical snapshot of Taiwan index options (TXO) from 2023 to early 2026. Option prices carry the market’s expectation of future swings, and these charts summarize how that expectation is distributed across strikes, expiries and time.'
  ],
  visual: {
    kind: 'image_monograph',
    imageSrc: './charts/txo-options/txo_vol_surface.png',
    figureNumber: 'Fig. 01',
    caption: 'Implied volatility across strikes and expiries on the latest trading day in the sample — short-dated downside strikes sit highest, and the surface flattens as expiries lengthen.',
    interactiveAvailable: false
  },
  keyObservations: [
    {
      title: 'Calm most of the time — until it is not',
      detail: 'Implied volatility spent most of the period in a narrow band, then jumped sharply in three short episodes.',
      metric: '~17% → 70%',
      subnote: 'typical level → April 2025 peak'
    },
    {
      title: 'Downside protection costs more',
      detail: 'Even on a calm day, strikes below the index are priced at far higher volatility than strikes at the money.',
      metric: '~2×',
      subnote: 'downside vs at-the-money, calm day'
    },
    {
      title: 'Stress flips the term structure',
      detail: 'Normally longer expiries carry slightly more volatility; under stress the nearest expiries jump far above the rest.',
      metric: 'Inverted',
      subnote: 'front above back under stress'
    },
    {
      title: 'Activity crowds near the money',
      detail: 'Calls and puts trade in near-equal volume, and most of it sits in strikes close to the index level.',
      metric: '~87%',
      subnote: 'volume close to the money'
    }
  ],
  markdown: `
## Daily evolution

![Index level (top) and 30-day at-the-money implied volatility against realized volatility (bottom), 2023 to early 2026.](./charts/txo-options/txo_daily_evolution.png)

**Three episodes stand out — August 2024, April 2025 and March 2026. Each time implied volatility jumped within days, then drifted back toward its usual range.**

## Smile and skew

![Near-month implied volatility by strike on a calm day and a stress day.](./charts/txo-options/txo_smile_skew.png)

**On a calm day the curve is a lopsided smile, tilted toward the downside. Under stress the whole curve lifts — and the tilt stays.**

## Term structure

![At-the-money implied volatility across expiries on the same calm and stress days.](./charts/txo-options/txo_term_structure.png)

**In calm markets the curve slopes gently upward. Under stress it inverts: near-term uncertainty is priced well above the long run.**

| Snapshot | Calm day | Stress day |
|---|---|---|
| Near-month, at the money | ~11% | **~39%** |
| Near-month, downside strike | ~20% | **~48%** |
| Nearest → farthest expiry | 10% → 15% | **49% → 30%** |
| Term structure shape | Upward | **Inverted** |

*Implied volatility, annualized. Calm and stress days are selected observations from the sample.*

## Strike × expiry

![Open interest by strike and expiry for calls and puts on the latest trading day; the dashed line marks the index level.](./charts/txo-options/txo_strike_expiry_oi.png)

**Open interest concentrates in the nearest expiries — calls stacked above the index, puts spread below it.**

## Put / call and moneyness

![Share of traded volume by moneyness, calls above the axis and puts below, 2023 to early 2026.](./charts/txo-options/txo_put_call_moneyness.png)

**The distribution is close to a mirror image: calls lean to strikes above the index, puts to strikes below, and about three-quarters of each side is out of the money.**

Explore any single day → [TXO Volatility Explorer](#txo-volatility-explorer)
  `,
  interpretation: [
    'An options board is a crowd’s forecast of risk. Put together, these views show how the market prices downside, near-term and long-term uncertainty — and where its positions actually sit.',
    'The shapes are persistent: a downside tilt, a crowded area near the money, and a term structure that flips under stress. Knowing the usual shape makes an unusual one easier to recognize.'
  ],
  limits: [
    'Figures describe 2023 to early 2026 only; single-day snapshots may not represent every day.',
    'Prices on thinly traded strikes and on extreme days can be noisy, so fine detail in the curves should not be over-read.',
    'This is a descriptive summary, not a forecast or a trading recommendation.'
  ],
  dataNote: 'Taiwan index options (TXO), regular trading session, January 2023 – March 2026, with the TAIEX as reference. Implied volatility is derived from daily prices; figures show aggregated and selected-day views only.'
});

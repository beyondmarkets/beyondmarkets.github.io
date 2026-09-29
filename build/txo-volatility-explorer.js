/**
 * Publication: TXO Volatility Explorer
 * Section: What I Build
 */
window.registerPublication({
  id: 'txo-volatility-explorer',
  slug: 'txo-volatility-explorer',
  section: 'build',
  type: 'Interactive Tool',
  title: 'TXO Volatility Explorer: How Expensive Is Taiwan Index Volatility Today?',
  subtitle: 'Pick a day, a contract and a strike — see the volatility surface, where implied volatility ranks against the past year, and how the Greeks move.',
  products: ['Options', 'Indices'],
  topics: ['derivative', 'equity'],
  date: '2026-09-29',
  status: 'Live · Updated Regularly',
  readingTime: 'Interactive',
  featured: true,
  labels: {
    findings: 'WHAT YOU CAN EXPLORE',
    caption: 'Interactive'
  },
  whatIsThis: [
    'A visual exploration of the structure and distribution of Taiwan index options data. Choose any trading day to see its volatility surface, how today’s implied volatility compares with the past year, and how the Greeks of a chosen contract behave.'
  ],
  visual: {
    kind: 'txo_explorer',
    wide: true,
    imageSrc: './charts/txo-options/txo_vol_surface.png',
    figureNumber: 'Tool 01',
    caption: 'choose a date, expiry, call or put and strike. All values are fitted and aggregated; the data is refreshed periodically.',
    interactiveAvailable: true
  },
  keyObservations: [
    {
      title: 'Pick a day, see the surface',
      detail: 'The implied volatility surface across strikes and expiries for any trading day in the past year, in 3D.',
      metric: '3D',
      subnote: 'surface by day'
    },
    {
      title: 'Cheap or expensive?',
      detail: 'IV Rank and IV Percentile place the day’s 30-day implied volatility within its past-year range.',
      metric: '1Y',
      subnote: 'rank & percentile'
    },
    {
      title: 'Pick a contract, see its Greeks',
      detail: 'Delta, gamma, vega and theta across strikes for the chosen expiry, with the selected strike highlighted.',
      metric: 'Δ Γ ν Θ',
      subnote: 'by strike'
    },
    {
      title: 'Follow a contract through time',
      detail: 'How implied volatility and the Greeks of one strike change as expiry approaches.',
      metric: 'Life',
      subnote: 'toward expiry'
    }
  ],
  dataNote: 'Taiwan index options (TXO), regular trading session, most recent twelve months, refreshed periodically. The explorer carries fitted and aggregated values only; it is a visualization, not a trading tool.'
});

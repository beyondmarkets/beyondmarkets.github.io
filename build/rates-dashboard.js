/**
 * Publication: Cross-Market Rates Dashboard
 * Section: What I Build
 */
window.registerPublication({
  id: 'rates-dashboard',
  slug: 'rates-dashboard',
  section: 'build',
  type: 'Dashboard',
  title: 'Cross-Market Rates Dashboard',
  subtitle: 'Trend, stretch and activity across US, Taiwan, Korea and Japan rates — in one view.',
  products: ['Rates', 'Swaps', 'Cross-Asset'],
  topics: ['rates', 'dashboard'],
  date: '2026-09-29',
  status: 'Live · Updated Regularly',
  readingTime: 'Dashboard',
  featured: false,
  labels: {
    caption: 'Interactive'
  },
  whatIsThis: [
    'A single view of where the main rates markets in the US, Taiwan, Korea and Japan stand today. Each indicator shows its trend state over three horizons, how far it sits from its longer-run anchor, and whether it is moving more or less than usual.'
  ],
  visual: {
    kind: 'dashboard',
    dataKey: 'rates',
    wide: true,
    imageSrc: './charts/dashboard/rates_dashboard.png',
    figureNumber: 'Dashboard 01',
    caption: 'select a group, then click any indicator to see how its trend states and stretch evolved over the past year. Normalized values only; refreshed periodically.',
    interactiveAvailable: true
  },
  dataNote: 'Government bond yields, interest-rate swaps, bond futures and related gauges for the US, Taiwan, Korea and Japan. The dashboard shows normalized states and scores only.'
});

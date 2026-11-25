// Page renderers for StatAtlas. Each function returns an HTML string for one
// hash route; main.js picks the renderer and wires up its controls.
import { COUNTRIES, GDP_SERIES, SERIES_YEARS, INDICATORS, byCode, gdpPerCapita, density, totals, YEAR } from './data.js';
import { barChart, columnChart, pairedBars } from './charts.js';
import { fmtPopulation, fmtGdp, fmtDollars, fmtPct, fmtSignedPct, fmtYears, fmtInt, fmtArea } from './format.js';

const SOURCE_LINE = 'Sources: World Bank World Development Indicators (July 2026 update); IMF World Economic Outlook; ILO modelled estimates. Reference year 2024.';

// ---------- shared pieces ----------

function countryLink(c) {
  return `<a class="country-chip" href="#/country/${c.code}">${c.name}</a>`;
}

function kpiCard(label, value, sub) {
  return `<div class="kpi"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div><div class="kpi-sub">${sub}</div></div>`;
}

function rankList(title, rows, format, unitNote) {
  const items = rows.map((r, i) =>
    `<li><span class="rank-num">${i + 1}</span><a href="#/country/${r.code}">${r.name}</a><span class="rank-val">${format(r.value)}</span></li>`).join('');
  return `<section class="panel"><h2>${title}</h2><p class="muted">${unitNote}</p><ol class="rank">${items}</ol></section>`;
}

function sortedBy(key, desc = true) {
  const value = (c) => (key === 'gdpPerCapita' ? gdpPerCapita(c) : key === 'gdp' ? c.gdpBillion : c[key]);
  return [...COUNTRIES].sort((a, b) => (desc ? value(b) - value(a) : value(a) - value(b)));
}

// ---------- home ----------

export function renderHome() {
  const t = totals();
  const topGdp = sortedBy('gdp').slice(0, 5).map((c) => ({ label: c.name, value: c.gdpBillion }));
  const topLife = sortedBy('lifeExpectancy').slice(0, 5).map((c) => ({ label: c.name, value: c.lifeExpectancy }));
  const fastest = sortedBy('growth').slice(0, 3);
  const regions = [...new Set(COUNTRIES.map((c) => c.region))];
  return `
  <section class="hero">
    <p class="eyebrow">12 economies · Reference year ${YEAR} · Updated November 2026</p>
    <h1>Every country, by the numbers.</h1>
    <p class="lede">Population, GDP, jobs, prices and how long people live — for the world’s
    largest economies, in one place, with every figure sourced and dated.</p>
    <div class="hero-actions">
      <a class="btn" href="#/countries">Browse all countries</a>
      <a class="btn btn-ghost" href="#/compare">Compare two countries</a>
    </div>
  </section>
  <section class="kpis">
    ${kpiCard('Countries covered', String(t.count), 'across 6 regions')}
    ${kpiCard('Combined population', fmtPopulation(t.population), 'about 48% of humanity')}
    ${kpiCard('Combined GDP', fmtGdp(t.gdpBillion), 'current US$, ' + YEAR)}
    ${kpiCard('Largest economy', 'United States', fmtGdp(29184) + ' · ' + fmtPopulation(340110000) + ' people')}
  </section>
  <div class="grid-2">
    <section class="panel">
      <h2>Largest economies</h2>
      <p class="muted">Nominal GDP, current US$, ${YEAR}. Click a country for its full profile.</p>
      ${barChart(topGdp, (v) => fmtGdp(v))}
      <p class="chart-links">${topGdp.map((r) => `<a href="#/country/${COUNTRIES.find((c) => c.name === r.label).code}">${r.label}</a>`).join(' · ')}</p>
    </section>
    <section class="panel">
      <h2>Longest lives</h2>
      <p class="muted">Life expectancy at birth, years, ${YEAR}.</p>
      ${barChart(topLife, (v) => fmtYears(v))}
      <p class="chart-links">${topLife.map((r) => `<a href="#/country/${COUNTRIES.find((c) => c.name === r.label).code}">${r.label}</a>`).join(' · ')}</p>
    </section>
  </div>
  <section class="panel">
    <h2>Fastest-growing economies</h2>
    <div class="growth-row">
      ${fastest.map((c) => `<a class="growth-card" href="#/country/${c.code}"><span class="growth-pct">${fmtSignedPct(c.growth)}</span><span class="growth-name">${c.name}</span><span class="muted">real GDP growth, ${YEAR}</span></a>`).join('')}
    </div>
  </section>
  <section class="panel">
    <h2>Browse by region</h2>
    <p class="muted">Pick a region to filter the country table.</p>
    <div class="chip-row">${regions.map((r) => `<a class="chip" href="#/countries?region=${encodeURIComponent(r)}">${r}</a>`).join('')}</div>
    <div class="chip-row">${COUNTRIES.map(countryLink).join('')}</div>
  </section>
  <p class="source-note">${SOURCE_LINE} <a href="#/sources">Sources &amp; methods →</a></p>`;
}

// ---------- countries table ----------

let tableState = { query: '', region: 'All regions', sort: 'gdp', dir: -1 };

export function setTableQueryFromHash(queryString) {
  const params = new URLSearchParams(queryString);
  const region = params.get('region');
  if (region) tableState.region = region;
}

const COLUMNS = [
  { key: 'name', label: 'Country' },
  { key: 'population', label: 'Population' },
  { key: 'gdp', label: 'GDP' },
  { key: 'gdpPerCapita', label: 'GDP per capita' },
  { key: 'growth', label: 'Growth' },
  { key: 'unemployment', label: 'Unemployment' },
  { key: 'inflation', label: 'Inflation' },
  { key: 'lifeExpectancy', label: 'Life expectancy' },
];

function tableValue(c, key) {
  if (key === 'gdpPerCapita') return gdpPerCapita(c);
  if (key === 'gdp') return c.gdpBillion;
  return c[key];
}

function tableCell(c, key) {
  switch (key) {
    case 'name': return `<a href="#/country/${c.code}"><strong>${c.name}</strong></a><br><span class="muted">${c.region}</span>`;
    case 'population': return fmtPopulation(c.population);
    case 'gdp': return fmtGdp(c.gdpBillion);
    case 'gdpPerCapita': return fmtDollars(gdpPerCapita(c));
    case 'growth': return fmtSignedPct(c.growth);
    case 'unemployment': return c.unemployment.toFixed(1) + '%';
    case 'inflation': return c.inflation.toFixed(1) + '%';
    case 'lifeExpectancy': return fmtYears(c.lifeExpectancy);
    default: return '';
  }
}

export function renderCountries() {
  const regions = ['All regions', ...new Set(COUNTRIES.map((c) => c.region))];
  let rows = COUNTRIES.filter((c) => {
    const q = tableState.query.trim().toLowerCase();
    const matchesQ = !q || c.name.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q);
    const matchesR = tableState.region === 'All regions' || c.region === tableState.region;
    return matchesQ && matchesR;
  });
  rows = [...rows].sort((a, b) => {
    const va = tableValue(a, tableState.sort);
    const vb = tableValue(b, tableState.sort);
    const cmp = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
    return cmp * tableState.dir;
  });
  const head = COLUMNS.map((col) => {
    const arrow = tableState.sort === col.key ? (tableState.dir === 1 ? ' ▲' : ' ▼') : '';
    return `<th><button class="th-btn" data-sort="${col.key}">${col.label}${arrow}</button></th>`;
  }).join('');
  const body = rows.map((c) => `<tr>${COLUMNS.map((col) => `<td>${tableCell(c, col.key)}</td>`).join('')}</tr>`).join('');
  return `
  <section class="page-head">
    <h1>All countries</h1>
    <p class="lede">Twelve economies, seven indicators, one table. Click any column heading to sort; type to search.</p>
  </section>
  <section class="panel">
    <div class="controls">
      <label>Search <input id="q" type="search" placeholder="Country or capital…" value="${tableState.query.replace(/"/g, '&quot;')}"></label>
      <label>Region
        <select id="region">${regions.map((r) => `<option ${r === tableState.region ? 'selected' : ''}>${r}</option>`).join('')}</select>
      </label>
      <span class="muted" id="count">${rows.length} of ${COUNTRIES.length} countries</span>
    </div>
    <div class="table-wrap"><table>
      <thead><tr>${head}</tr></thead>
      <tbody>${body || '<tr><td colspan="8">No countries match that search.</td></tr>'}</tbody>
    </table></div>
    <p class="source-note">${SOURCE_LINE}</p>
  </section>`;
}

export function wireCountries(root) {
  const q = root.querySelector('#q');
  const region = root.querySelector('#region');
  if (q) q.addEventListener('input', () => { tableState.query = q.value; rerender(); });
  if (region) region.addEventListener('change', () => { tableState.region = region.value; rerender(); });
  root.querySelectorAll('[data-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      if (tableState.sort === key) tableState.dir *= -1;
      else { tableState.sort = key; tableState.dir = key === 'name' ? 1 : -1; }
      rerender();
    });
  });
  function rerender() {
    const app = document.getElementById('app');
    app.innerHTML = renderCountries();
    wireCountries(app);
    const input = app.querySelector('#q');
    if (input && document.activeElement !== input) { /* keep focus simple */ }
    if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  }
}

// ---------- country detail ----------

export function renderCountry(code) {
  const c = byCode(code);
  if (!c) return `<section class="page-head"><h1>Country not found</h1><p class="lede">That code is not in our twelve. <a href="#/countries">See all countries →</a></p></section>`;
  const series = GDP_SERIES[c.code].map((v, i) => ({ label: String(SERIES_YEARS[i]), value: v }));
  const avg = {
    gdpPerCapita: COUNTRIES.reduce((s, x) => s + gdpPerCapita(x), 0) / COUNTRIES.length,
    unemployment: COUNTRIES.reduce((s, x) => s + x.unemployment, 0) / COUNTRIES.length,
    inflation: COUNTRIES.reduce((s, x) => s + x.inflation, 0) / COUNTRIES.length,
    lifeExpectancy: COUNTRIES.reduce((s, x) => s + x.lifeExpectancy, 0) / COUNTRIES.length,
  };
  const vsRows = [
    { label: 'GDP per capita', value: gdpPerCapita(c), avg: avg.gdpPerCapita, format: fmtDollars },
    { label: 'Unemployment', value: c.unemployment, avg: avg.unemployment, format: (v) => v.toFixed(1) + '%' },
    { label: 'Inflation', value: c.inflation, avg: avg.inflation, format: (v) => v.toFixed(1) + '%' },
    { label: 'Life expectancy', value: c.lifeExpectancy, avg: avg.lifeExpectancy, format: fmtYears },
  ];
  const vsBars = vsRows.map((r) => {
    const pct = Math.min(100, (r.value / Math.max(r.value, r.avg)) * 100);
    const avgPct = Math.min(100, (r.avg / Math.max(r.value, r.avg)) * 100);
    return `<div class="vs-row"><span class="vs-label">${r.label}</span>
      <div class="vs-bars"><div class="vs-bar" style="width:${pct.toFixed(1)}%"></div><span class="vs-val">${r.format(r.value)}</span></div>
      <div class="vs-bars avg"><div class="vs-bar" style="width:${avgPct.toFixed(1)}%"></div><span class="vs-val">12-country average ${r.format(r.avg)}</span></div></div>`;
  }).join('');
  return `
  <section class="page-head">
    <p class="crumb"><a href="#/countries">All countries</a> · ${c.region}</p>
    <h1>${c.name}</h1>
    <p class="lede">${c.note}</p>
  </section>
  <section class="kpis">
    ${kpiCard('Population', fmtPopulation(c.population), 'World Bank WDI, ' + YEAR)}
    ${kpiCard('GDP', fmtGdp(c.gdpBillion), 'current US$, ' + YEAR)}
    ${kpiCard('GDP per capita', fmtDollars(gdpPerCapita(c)), 'current US$, ' + YEAR)}
    ${kpiCard('Life expectancy', fmtYears(c.lifeExpectancy), 'at birth, ' + YEAR)}
  </section>
  <div class="grid-2">
    <section class="panel">
      <h2>GDP, 2019–${YEAR}</h2>
      <p class="muted">Nominal GDP, current US$ billions (World Bank WDI). The amber column is ${YEAR}.</p>
      ${columnChart(series, (v) => fmtGdp(v))}
    </section>
    <section class="panel">
      <h2>${c.name} vs the twelve</h2>
      <p class="muted">Teal is ${c.name}; grey is the average of all twelve countries.</p>
      ${vsBars}
    </section>
  </div>
  <div class="grid-2">
    <section class="panel">
      <h2>At a glance</h2>
      <dl class="facts">
        <div><dt>Capital</dt><dd>${c.capital}</dd></div>
        <div><dt>Region</dt><dd>${c.region}</dd></div>
        <div><dt>Income group</dt><dd>${c.income}</dd></div>
        <div><dt>Currency</dt><dd>${c.currency}</dd></div>
        <div><dt>Land area</dt><dd>${fmtArea(c.areaKm2)}</dd></div>
        <div><dt>Population density</dt><dd>${fmtInt(density(c))} people per km²</dd></div>
        <div><dt>Real GDP growth</dt><dd>${fmtSignedPct(c.growth)} (${YEAR}, IMF)</dd></div>
        <div><dt>Unemployment</dt><dd>${c.unemployment.toFixed(1)}% of labour force (${YEAR}, ILO)</dd></div>
        <div><dt>Inflation</dt><dd>${c.inflation.toFixed(1)}% consumer prices (${YEAR}, IMF)</dd></div>
      </dl>
    </section>
    <section class="panel">
      <h2>What to read into this</h2>
      <p>${c.name}’s economy is worth ${fmtGdp(c.gdpBillion)} — ${c.gdpBillion >= 1000 ? 'over a trillion dollars' : 'under a trillion dollars'} — shared among ${fmtPopulation(c.population)} people, or ${fmtDollars(gdpPerCapita(c))} per person. Prices rose ${c.inflation.toFixed(1)}% in ${YEAR}, ${c.unemployment.toFixed(1)}% of the labour force was unemployed, and a newborn could expect to live ${c.lifeExpectancy.toFixed(1)} years.</p>
      <p>Compare it directly: <a href="#/compare?a=${c.code}">compare ${c.name} with another country →</a></p>
      <p class="muted">Figures are rounded. Definitions and sources are on the <a href="#/sources">sources page</a>.</p>
    </section>
  </div>
  <p class="source-note">${SOURCE_LINE}</p>`;
}

// ---------- compare ----------

let compareState = { a: 'usa', b: 'chn' };

export function setCompareFromHash(queryString) {
  const params = new URLSearchParams(queryString);
  if (params.get('a') && byCode(params.get('a'))) compareState.a = params.get('a');
  if (params.get('b') && byCode(params.get('b'))) compareState.b = params.get('b');
}

export function renderCompare() {
  const a = byCode(compareState.a);
  const b = byCode(compareState.b);
  const options = (selected) => COUNTRIES.map((c) => `<option value="${c.code}" ${c.code === selected ? 'selected' : ''}>${c.name}</option>`).join('');
  const rows = [
    { label: 'Population', a: a.population, b: b.population, format: fmtPopulation },
    { label: 'GDP', a: a.gdpBillion, b: b.gdpBillion, format: fmtGdp },
    { label: 'GDP per capita', a: gdpPerCapita(a), b: gdpPerCapita(b), format: fmtDollars },
    { label: 'Growth', a: a.growth, b: b.growth, format: fmtSignedPct },
    { label: 'Unemployment', a: a.unemployment, b: b.unemployment, format: (v) => v.toFixed(1) + '%' },
    { label: 'Inflation', a: a.inflation, b: b.inflation, format: (v) => v.toFixed(1) + '%' },
    { label: 'Life expectancy', a: a.lifeExpectancy, b: b.lifeExpectancy, format: fmtYears },
  ];
  const tableRows = rows.map((r) => `<tr><td>${r.label}</td><td><strong>${r.format(r.a)}</strong></td><td><strong>${r.format(r.b)}</strong></td></tr>`).join('');
  const richer = gdpPerCapita(a) >= gdpPerCapita(b) ? a : b;
  const longer = a.lifeExpectancy >= b.lifeExpectancy ? a : b;
  return `
  <section class="page-head">
    <h1>Compare countries</h1>
    <p class="lede">Pick any two of the twelve and see them side by side. Teal is the first pick, amber the second.</p>
  </section>
  <section class="panel">
    <div class="controls">
      <label>First country <select id="cmp-a">${options(a.code)}</select></label>
      <span class="vs-word">vs</span>
      <label>Second country <select id="cmp-b">${options(b.code)}</select></label>
      <button class="btn btn-small" id="cmp-swap" type="button">Swap</button>
    </div>
    ${pairedBars(rows, a.name, b.name)}
    <div class="table-wrap"><table>
      <thead><tr><th>Indicator (${YEAR})</th><th><a href="#/country/${a.code}">${a.name}</a></th><th><a href="#/country/${b.code}">${b.name}</a></th></tr></thead>
      <tbody>${tableRows}</tbody>
    </table></div>
    <p><strong>In short:</strong> ${richer.name} has the higher GDP per person (${fmtDollars(gdpPerCapita(richer))}), and people live longest in ${longer.name} (${fmtYears(longer.lifeExpectancy)}). Read each country’s full profile: <a href="#/country/${a.code}">${a.name}</a> · <a href="#/country/${b.code}">${b.name}</a>.</p>
    <p class="source-note">${SOURCE_LINE}</p>
  </section>`;
}

export function wireCompare(root) {
  const selA = root.querySelector('#cmp-a');
  const selB = root.querySelector('#cmp-b');
  const swap = root.querySelector('#cmp-swap');
  const rerender = () => {
    const app = document.getElementById('app');
    app.innerHTML = renderCompare();
    wireCompare(app);
  };
  if (selA) selA.addEventListener('change', () => { compareState.a = selA.value; rerender(); });
  if (selB) selB.addEventListener('change', () => { compareState.b = selB.value; rerender(); });
  if (swap) swap.addEventListener('click', () => {
    const t = compareState.a; compareState.a = compareState.b; compareState.b = t; rerender();
  });
}

// ---------- rankings ----------

let rankingMetric = 'gdpPerCapita';

const RANKING_METRICS = [
  { key: 'gdpPerCapita', label: 'GDP per capita', format: fmtDollars, note: 'US$, current prices, 2024. Higher means more output per person.' },
  { key: 'lifeExpectancy', label: 'Life expectancy', format: fmtYears, note: 'Years a newborn can expect to live, 2024.' },
  { key: 'population', label: 'Population', format: fmtPopulation, note: 'People, 2024.' },
  { key: 'growth', label: 'GDP growth', format: fmtSignedPct, note: 'Real GDP growth, % per year, 2024.' },
  { key: 'unemployment', label: 'Unemployment (lowest first)', format: (v) => v.toFixed(1) + '%', note: '% of labour force, 2024. Lowest is best here.', asc: true },
  { key: 'inflation', label: 'Inflation (lowest first)', format: (v) => v.toFixed(1) + '%', note: 'Consumer prices, % per year, 2024. Lowest is best here.', asc: true },
];

export function renderRankings() {
  const metric = RANKING_METRICS.find((m) => m.key === rankingMetric);
  const value = (c) => (metric.key === 'gdpPerCapita' ? gdpPerCapita(c) : metric.key === 'gdp' ? c.gdpBillion : c[metric.key]);
  const rows = [...COUNTRIES].sort((a, b) => (metric.asc ? value(a) - value(b) : value(b) - value(a)));
  const buttons = RANKING_METRICS.map((m) =>
    `<button class="chip ${m.key === rankingMetric ? 'chip-on' : ''}" data-metric="${m.key}" type="button">${m.label}</button>`).join('');
  return `
  <section class="page-head">
    <h1>Rankings</h1>
    <p class="lede">The twelve countries, ranked on any indicator. Pick a metric — the chart and the list update together.</p>
  </section>
  <section class="panel">
    <div class="chip-row" id="metric-picks">${buttons}</div>
    <h2>${metric.label}</h2>
    <p class="muted">${metric.note}</p>
    ${barChart(rows.map((c) => ({ label: c.name, value: value(c) })), metric.format)}
    <ol class="rank">
      ${rows.map((c, i) => `<li><span class="rank-num">${i + 1}</span><a href="#/country/${c.code}">${c.name}</a><span class="rank-val">${metric.format(value(c))}</span></li>`).join('')}
    </ol>
    <p class="source-note">${SOURCE_LINE}</p>
  </section>`;
}

export function wireRankings(root) {
  root.querySelectorAll('[data-metric]').forEach((btn) => {
    btn.addEventListener('click', () => {
      rankingMetric = btn.dataset.metric;
      const app = document.getElementById('app');
      app.innerHTML = renderRankings();
      wireRankings(app);
    });
  });
}

// ---------- sources ----------

export function renderSources() {
  const defs = INDICATORS.map((d) =>
    `<tr><td><strong>${d.label}</strong></td><td>${d.unit}</td><td>${d.source}</td><td>${d.year}</td></tr>`).join('');
  return `
  <section class="page-head">
    <h1>Sources &amp; methods</h1>
    <p class="lede">Every figure on this site comes from a public statistical source, and every figure is dated. Nothing here is estimated by us.</p>
  </section>
  <section class="panel">
    <h2>Where the numbers come from</h2>
    <ul class="source-list">
      <li><strong>World Bank, World Development Indicators</strong> — population, nominal GDP, GDP per capita and life expectancy at birth. Reference year 2024, July 2026 update of the database.</li>
      <li><strong>International Monetary Fund, World Economic Outlook</strong> — real GDP growth and consumer-price inflation, 2024.</li>
      <li><strong>International Labour Organization, modelled estimates</strong> — unemployment as a share of the total labour force, 2024.</li>
      <li><strong>Land area</strong> — national statistical offices via the World Bank; Singapore’s 734 km² is its official land area.</li>
    </ul>
  </section>
  <section class="panel">
    <h2>Indicator definitions</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Indicator</th><th>Unit</th><th>Source</th><th>Year</th></tr></thead>
      <tbody>${defs}</tbody>
    </table></div>
  </section>
  <section class="panel">
    <h2>How to read the figures</h2>
    <ul class="source-list">
      <li><strong>GDP</strong> is nominal, in current US dollars — it is not adjusted for inflation or for differences in the cost of living. Use GDP per capita at purchasing power parity for cost-of-living comparisons.</li>
      <li><strong>GDP per capita</strong> is simply GDP divided by population, computed from the two columns shown, so the three figures always agree.</li>
      <li><strong>Unemployment</strong> follows the ILO definition: people without work who are available for and seeking work, as a share of the labour force. Definitions differ between national statistical offices.</li>
      <li><strong>Life expectancy</strong> is the average number of years a newborn would live if current mortality rates stayed the same.</li>
      <li>Figures are rounded for display. Sources revise their data; the values shown are those published in the July 2026 WDI update and the 2026 IMF outlooks.</li>
    </ul>
  </section>
  <section class="panel">
    <h2>About this site</h2>
    <p>StatAtlas is an independent reference site. It is not affiliated with the World Bank, the IMF or the ILO, and it reproduces their published figures with attribution. The site is a static page that runs entirely in your browser: it makes no network requests and stores nothing. Built November 2026.</p>
    <p><a href="#/">Back to the overview →</a></p>
  </section>`;
}

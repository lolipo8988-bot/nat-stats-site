// StatAtlas router: hash routes, no framework. The app element is re-rendered
// on every hash change, then the page's own controls are wired up.
import {
  renderHome, renderCountries, wireCountries, setTableQueryFromHash,
  renderCountry, renderCompare, wireCompare, setCompareFromHash,
  renderRankings, wireRankings, renderSources,
} from './views.js';

const app = document.getElementById('app');

function route() {
  const raw = window.location.hash.slice(1) || '/';
  const [path, query = ''] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  window.scrollTo(0, 0);
  if (parts.length === 0) {
    app.innerHTML = renderHome();
  } else if (parts[0] === 'countries') {
    setTableQueryFromHash(query);
    app.innerHTML = renderCountries();
    wireCountries(app);
  } else if (parts[0] === 'country' && parts[1]) {
    app.innerHTML = renderCountry(parts[1]);
  } else if (parts[0] === 'compare') {
    setCompareFromHash(query);
    app.innerHTML = renderCompare();
    wireCompare(app);
  } else if (parts[0] === 'rankings') {
    app.innerHTML = renderRankings();
    wireRankings(app);
  } else if (parts[0] === 'sources') {
    app.innerHTML = renderSources();
  } else {
    app.innerHTML = `<section class="page-head"><h1>Page not found</h1>
      <p class="lede">That page does not exist. <a href="#/">Back to the overview →</a></p></section>`;
  }
  document.querySelectorAll('nav a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    a.classList.toggle('active', href === '#' + (parts.length ? '/' + parts[0] : '/'));
  });
}

window.addEventListener('hashchange', route);
route();

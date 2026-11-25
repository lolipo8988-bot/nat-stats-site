// Small SVG chart builders. No chart library: every chart is a plain SVG
// string, so the site stays light and works with no network request.
// Both builders take { label, value } rows and return an <svg> string.

const NAVY = '#12324f';
const TEAL = '#0e8a7a';
const AMBER = '#d98a1f';
const GRID = '#d8dee3';

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Horizontal bars, largest first. `format` turns a value into its label text.
export function barChart(rows, format, options = {}) {
  const width = options.width || 640;
  const rowH = options.rowHeight || 44;
  const labelW = options.labelWidth || 150;
  const height = rows.length * rowH + 14;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const barMax = width - labelW - 92;
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart" xmlns="http://www.w3.org/2000/svg">`;
  rows.forEach((row, i) => {
    const y = 8 + i * rowH;
    const w = Math.max(2, (row.value / max) * barMax);
    const fill = row.highlight ? AMBER : i === 0 ? NAVY : TEAL;
    out += `<text x="0" y="${y + 19}" font-size="14" fill="${NAVY}">${esc(row.label)}</text>`;
    out += `<rect x="${labelW}" y="${y + 4}" width="${w}" height="20" rx="4" fill="${fill}"/>`;
    out += `<text x="${labelW + w + 8}" y="${y + 19}" font-size="13" font-weight="600" fill="${NAVY}">${esc(format(row.value))}</text>`;
  });
  out += '</svg>';
  return out;
}

// Vertical columns with a value label above each column.
export function columnChart(rows, format, options = {}) {
  const width = options.width || 640;
  const height = options.height || 260;
  const padB = 34;
  const padT = 30;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const slot = width / rows.length;
  const barW = Math.min(64, slot * 0.55);
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Column chart" xmlns="http://www.w3.org/2000/svg">`;
  out += `<line x1="0" y1="${height - padB}" x2="${width}" y2="${height - padB}" stroke="${GRID}" stroke-width="1"/>`;
  rows.forEach((row, i) => {
    const h = Math.max(2, ((row.value / max) * (height - padB - padT)));
    const x = i * slot + (slot - barW) / 2;
    const y = height - padB - h;
    const fill = i === rows.length - 1 ? AMBER : TEAL;
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW}" height="${h.toFixed(1)}" rx="4" fill="${fill}"/>`;
    out += `<text x="${(i * slot + slot / 2).toFixed(1)}" y="${(y - 8).toFixed(1)}" font-size="12" font-weight="600" text-anchor="middle" fill="${NAVY}">${esc(format(row.value))}</text>`;
    out += `<text x="${(i * slot + slot / 2).toFixed(1)}" y="${height - 12}" font-size="12" text-anchor="middle" fill="#5a6b78">${esc(row.label)}</text>`;
  });
  out += '</svg>';
  return out;
}

// Paired bars for the compare page: two values per row, one per country.
// Each row carries its own `format`, since rows use different units.
// Each value is printed just past its own bar, and the bars stop short of
// the right edge so the longest label still fits inside the viewBox.
export function pairedBars(rows, nameA, nameB) {
  const width = 640;
  const rowH = 58;
  const labelW = 132;
  const height = rows.length * rowH + 36;
  const max = Math.max(...rows.flatMap((r) => [r.a, r.b]), 1);
  const barMax = width - labelW - 150;
  let out = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Comparison chart" xmlns="http://www.w3.org/2000/svg">`;
  out += `<circle cx="${labelW + 6}" cy="10" r="5" fill="${TEAL}"/><text x="${labelW + 16}" y="14" font-size="12" font-weight="700" fill="${NAVY}">${esc(nameA)}</text>`;
  out += `<circle cx="${labelW + 176}" cy="10" r="5" fill="${AMBER}"/><text x="${labelW + 186}" y="14" font-size="12" font-weight="700" fill="${NAVY}">${esc(nameB)}</text>`;
  rows.forEach((row, i) => {
    const y = 26 + i * rowH;
    const wA = Math.max(2, (row.a / max) * barMax);
    const wB = Math.max(2, (row.b / max) * barMax);
    out += `<text x="0" y="${y + 15}" font-size="13" fill="${NAVY}">${esc(row.label)}</text>`;
    out += `<rect x="${labelW}" y="${y}" width="${wA}" height="16" rx="3" fill="${TEAL}"/>`;
    out += `<text x="${labelW + wA + 6}" y="${y + 13}" font-size="12" fill="${TEAL}">${esc(row.format(row.a))}</text>`;
    out += `<rect x="${labelW}" y="${y + 21}" width="${wB}" height="16" rx="3" fill="${AMBER}"/>`;
    out += `<text x="${labelW + wB + 6}" y="${y + 34}" font-size="12" fill="#9a6a14">${esc(row.format(row.b))}</text>`;
  });
  out += '</svg>';
  return out;
}

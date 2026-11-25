// Number formatting for the statistics site. Every figure shown on the site
// passes through these helpers so units and rounding stay consistent.

export function fmtPopulation(value) {
  if (value >= 1e9) return (value / 1e9).toFixed(2) + ' bn';
  if (value >= 1e6) return (value / 1e6).toFixed(1) + ' m';
  return String(Math.round(value));
}

export function fmtGdp(billion) {
  if (billion >= 1000) return '$' + (billion / 1000).toFixed(2) + ' tn';
  return '$' + Math.round(billion) + ' bn';
}

export function fmtDollars(value) {
  return '$' + Math.round(value).toLocaleString('en-US');
}

export function fmtPct(value) {
  const sign = value > 0 ? '+' : '';
  return sign + value.toFixed(1) + '%';
}

export function fmtSignedPct(value) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return sign + Math.abs(value).toFixed(1) + '%';
}

export function fmtYears(value) {
  return value.toFixed(1) + ' yrs';
}

export function fmtInt(value) {
  return Math.round(value).toLocaleString('en-US');
}

export function fmtArea(km2) {
  return fmtInt(km2) + ' km²';
}

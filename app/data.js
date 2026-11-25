// National statistics for 12 economies, reference year 2024 unless noted.
// Sources: World Bank World Development Indicators (July 2026 update) for
// population, GDP and life expectancy; IMF World Economic Outlook for real GDP
// growth and consumer-price inflation; ILO modelled estimates for unemployment.
// GDP per capita is GDP divided by population, computed by this file, so the
// three columns always agree. Figures are rounded for display; see sources
// page for definitions and the full source list. All values are 2024.
export const YEAR = 2024;

export const COUNTRIES = [
  {
    code: 'usa', name: 'United States', capital: 'Washington, D.C.',
    region: 'North America', income: 'High income', currency: 'US dollar (USD)',
    areaKm2: 9833517, population: 340110000, gdpBillion: 29184,
    growth: 2.8, unemployment: 4.0, inflation: 2.9, lifeExpectancy: 78.9,
    note: 'Largest economy in the world; about a quarter of global GDP.',
  },
  {
    code: 'chn', name: 'China', capital: 'Beijing',
    region: 'East Asia', income: 'Upper middle income', currency: 'Renminbi (CNY)',
    areaKm2: 9596961, population: 1408280000, gdpBillion: 18533,
    growth: 5.0, unemployment: 5.1, inflation: 0.2, lifeExpectancy: 78.6,
    note: 'Second-largest economy; the world’s largest population after India.',
  },
  {
    code: 'jpn', name: 'Japan', capital: 'Tokyo',
    region: 'East Asia', income: 'High income', currency: 'Yen (JPY)',
    areaKm2: 377975, population: 124516000, gdpBillion: 4026,
    growth: -0.1, unemployment: 2.5, inflation: 2.7, lifeExpectancy: 84.0,
    note: 'Highest life expectancy of the twelve; economy shrank slightly in 2024.',
  },
  {
    code: 'deu', name: 'Germany', capital: 'Berlin',
    region: 'Western Europe', income: 'High income', currency: 'Euro (EUR)',
    areaKm2: 357588, population: 84699000, gdpBillion: 4660,
    growth: -0.2, unemployment: 3.4, inflation: 2.5, lifeExpectancy: 81.0,
    note: 'Largest economy in Europe; second year of slight contraction in 2024.',
  },
  {
    code: 'ind', name: 'India', capital: 'New Delhi',
    region: 'South Asia', income: 'Lower middle income', currency: 'Indian rupee (INR)',
    areaKm2: 3287263, population: 1450935000, gdpBillion: 3912,
    growth: 6.5, unemployment: 4.2, inflation: 4.7, lifeExpectancy: 72.2,
    note: 'World’s most populous country and the fastest-growing large economy.',
  },
  {
    code: 'gbr', name: 'United Kingdom', capital: 'London',
    region: 'Northern Europe', income: 'High income', currency: 'Pound sterling (GBP)',
    areaKm2: 242495, population: 69281000, gdpBillion: 3644,
    growth: 1.1, unemployment: 4.3, inflation: 2.5, lifeExpectancy: 78.6,
    note: 'Sixth-largest economy; services make up about four-fifths of output.',
  },
  {
    code: 'fra', name: 'France', capital: 'Paris',
    region: 'Western Europe', income: 'High income', currency: 'Euro (EUR)',
    areaKm2: 543940, population: 68402000, gdpBillion: 3162,
    growth: 1.1, unemployment: 7.4, inflation: 2.0, lifeExpectancy: 82.8,
    note: 'Highest unemployment of the twelve, and the second-longest lives in Europe here.',
  },
  {
    code: 'bra', name: 'Brazil', capital: 'Brasília',
    region: 'South America', income: 'Upper middle income', currency: 'Brazilian real (BRL)',
    areaKm2: 8514877, population: 212557000, gdpBillion: 2171,
    growth: 3.4, unemployment: 6.6, inflation: 4.4, lifeExpectancy: 75.9,
    note: 'Largest economy in South America; inflation still the highest of the twelve.',
  },
  {
    code: 'can', name: 'Canada', capital: 'Ottawa',
    region: 'North America', income: 'High income', currency: 'Canadian dollar (CAD)',
    areaKm2: 9984670, population: 40097000, gdpBillion: 2241,
    growth: 1.5, unemployment: 6.5, inflation: 2.4, lifeExpectancy: 81.9,
    note: 'Second-largest country by land, with one of the lowest densities on Earth.',
  },
  {
    code: 'aus', name: 'Australia', capital: 'Canberra',
    region: 'Oceania', income: 'High income', currency: 'Australian dollar (AUD)',
    areaKm2: 7692024, population: 27004000, gdpBillion: 1790,
    growth: 1.0, unemployment: 4.0, inflation: 3.2, lifeExpectancy: 83.7,
    note: 'Third-longest lives of the twelve; a resource-rich, services-led economy.',
  },
  {
    code: 'mys', name: 'Malaysia', capital: 'Kuala Lumpur',
    region: 'South-east Asia', income: 'Upper middle income', currency: 'Malaysian ringgit (MYR)',
    areaKm2: 330803, population: 35558000, gdpBillion: 422,
    growth: 5.1, unemployment: 3.2, inflation: 1.8, lifeExpectancy: 76.8,
    note: 'Fast-growing South-east Asian economy; inflation the second-lowest here.',
  },
  {
    code: 'sgp', name: 'Singapore', capital: 'Singapore',
    region: 'South-east Asia', income: 'High income', currency: 'Singapore dollar (SGD)',
    areaKm2: 734, population: 6037000, gdpBillion: 547,
    growth: 4.4, unemployment: 2.0, inflation: 2.4, lifeExpectancy: 83.3,
    note: 'Highest GDP per person of the twelve, on the smallest land area.',
  },
];

// Nominal GDP, current US$ billions, 2019–2024 (World Bank WDI).
// Used for the six-year trend chart on each country page.
export const GDP_SERIES = {
  usa: [21540, 21323, 23594, 25744, 27721, 29184],
  chn: [14343, 14687, 17820, 17881, 17795, 18533],
  jpn: [5118, 5031, 5036, 4260, 4213, 4026],
  deu: [3888, 3847, 4277, 4090, 4526, 4660],
  ind: [2835, 2672, 3151, 3353, 3568, 3912],
  gbr: [2856, 2697, 3142, 3090, 3381, 3644],
  fra: [2729, 2642, 2959, 2785, 3052, 3162],
  bra: [1873, 1476, 1670, 1920, 2174, 2171],
  can: [1744, 1655, 2011, 2196, 2142, 2241],
  aus: [1397, 1330, 1559, 1727, 1729, 1790],
  mys: [365, 337, 374, 407, 399, 422],
  sgp: [375, 348, 425, 466, 505, 547],
};
export const SERIES_YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

// Indicator definitions shown on the country and sources pages.
export const INDICATORS = [
  { key: 'population', label: 'Population', unit: 'people', source: 'World Bank WDI', year: 2024 },
  { key: 'gdp', label: 'GDP', unit: 'US$ billion, current prices', source: 'World Bank WDI', year: 2024 },
  { key: 'gdpPerCapita', label: 'GDP per capita', unit: 'US$, current prices', source: 'World Bank WDI (computed)', year: 2024 },
  { key: 'growth', label: 'Real GDP growth', unit: '% per year', source: 'IMF World Economic Outlook', year: 2024 },
  { key: 'unemployment', label: 'Unemployment rate', unit: '% of labour force', source: 'ILO modelled estimates', year: 2024 },
  { key: 'inflation', label: 'Inflation (consumer prices)', unit: '% per year', source: 'IMF World Economic Outlook', year: 2024 },
  { key: 'lifeExpectancy', label: 'Life expectancy at birth', unit: 'years', source: 'World Bank WDI', year: 2024 },
];

export function gdpPerCapita(country) {
  return (country.gdpBillion * 1e9) / country.population;
}

export function density(country) {
  return country.population / country.areaKm2;
}

export function byCode(code) {
  return COUNTRIES.find((c) => c.code === code) || null;
}

export function totals() {
  const population = COUNTRIES.reduce((s, c) => s + c.population, 0);
  const gdp = COUNTRIES.reduce((s, c) => s + c.gdpBillion, 0);
  return { population, gdpBillion: gdp, count: COUNTRIES.length };
}

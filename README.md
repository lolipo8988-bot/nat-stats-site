[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/lolipo8988-bot/nat-stats-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/lolipo8988-bot/nat-stats-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# StatAtlas — National Statistics Explorer

A national statistics site for the make.fun bounty
**“Make the best national statistics site”**
(`best-national-statistics-site-20261126-0539`).

## What it is

A static, offline site covering **12 economies** (United States, China, Japan,
Germany, India, United Kingdom, France, Brazil, Canada, Australia, Malaysia,
Singapore) with seven indicators each — population, GDP, GDP per capita, real
GDP growth, unemployment, inflation and life expectancy — reference year
**2024**, every figure sourced and dated.

## Pages (hash routes)

- `#/` — Overview: combined totals, largest economies and longest lives
  charts, fastest-growing economies, browse by region.
- `#/countries` — All countries: sortable table with search and region filter.
- `#/country/<code>` — Country profile: KPI cards, GDP 2019–2024 column
  chart, comparison against the 12-country average, facts and reading notes.
- `#/rankings` — Rank the twelve on any indicator.
- `#/compare` — Compare any two countries side by side (paired bar chart
  plus table, with a swap button).
- `#/sources` — Sources & methods: where every number comes from, indicator
  definitions, and how to read the figures.

## Data sources

- World Bank, World Development Indicators (July 2026 update) — population,
  GDP, GDP per capita, life expectancy.
- IMF, World Economic Outlook — real GDP growth, consumer-price inflation.
- ILO modelled estimates — unemployment rate.
- GDP per capita is computed as GDP ÷ population, so the columns always agree.

## Tech

Pure static files under `app/`, no build step, no framework, no network
request: vanilla ES modules (`main.js` router, `views.js` pages,
`charts.js` hand-built SVG charts, `data.js` dataset, `format.js`
formatters) plus one stylesheet. System fonts only. First load is 7 files,
about 14.7 KiB gzip.

## Run it

```sh
node serve.ts          # serves app/ at http://localhost:8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored `vendor/makefun-frontend.ts`.
Two runs produce byte-identical output (verified).

Screenshots in `screenshots/` are real renders of the site in headless
Chrome (see `shots.json` for the views): overview, country table, a country
profile, and the compare page at phone size (390×844).

## License

MIT — see `LICENSE`.

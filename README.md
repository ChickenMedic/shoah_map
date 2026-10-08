# Never Again: A History of the Holocaust

An interactive educational site tracing the Holocaust from the origins of Nazi ideology to liberation in 1945.

## Running it

```
npm install
npm run dev      # local development server
npm run build    # type-check and build to dist/ (static files, can be hosted anywhere)
```

## Where the content lives

All content is plain data in `src/data/`; edit these files to add or correct material.

| File | Contents |
| --- | --- |
| `history.ts` | The long-form chapters (origins and Mein Kampf, persecution, T4, war, the “Final Solution”, liberation) |
| `timeline.ts` | Dated events, 1919–1945 |
| `sites.ts` | Main camps, killing centres, T4 centres, transit camps, ghettos and mass shooting sites shown on the map |
| `subcamps.json` | Subcamps of the main camps (generated, see below) |
| `transports.ts` | Deportation routes shown on the map |
| `perpetrators.ts` | Perpetrator biographies |
| `victims.ts` | Victims’ and survivors’ stories |
| `films.json` | Public-domain films from Wikimedia Commons (generated) |
| `images.json` | Photographs for sites and perpetrators, with licences (generated) |
| `siteHistories.ts` | Longer histories of the principal sites, shown in the map panel |
| `campColors.ts` | The colour of each main camp and its subcamps on the map |
| `media.ts` | Links to testimony archives |
| `sources.ts` | Sources and further reading |

## Generated data

Raw downloads live in `scripts/raw/`; each script below rebuilds one output from them.

| Script | Output | What it does |
| --- | --- | --- |
| `npm run data:beg` | `scripts/raw/beg.json` | Parses the German federal register of camps and subcamps (6. DV-BEG annex) for dates |
| `npm run data:dewiki` | `scripts/raw/dewiki.json` | Parses the German Wikipedia subcamp lists for dates and coordinates |
| `npm run data:subcamps` | `src/data/subcamps.json` | Merges Wikidata with the two sources above, matching entries by name |
| `npm run data:routes` | `src/data/routes.json` | Routes each deportation in `transports.ts` over the rail network (BRouter, OSRM fallback) |
| `npm run data:fronts` | `public/data/fronts/*.json` | Who held Europe month by month (Reich, occupied/allied states, Allies including retaken ground, neutrals): OpenHistoricalMap borders (via `scripts/fetch-ohm.mjs` for pre-war Reich versions and ww2-atlas extracts), raster control data for the occupied USSR, approximate front lines from 1943 |
| `npm run data:images` | `src/data/images.json` | One licensed Wikimedia Commons image per site and perpetrator |
| `npm run data:films` | `src/data/films.json` | Public-domain and freely licensed films from Wikimedia Commons |
| `npm run data:event-images` | `src/data/eventImages.json` | Lead images of the matching Wikipedia articles for timeline events and history chapters |
| `npm run data:names` | `public/data/names.json` | Names of victims recorded in Wikidata (144,000; about 2% of the dead, skewed to the Terezín database) |

The subcamp list is incomplete and has not been individually verified. Of 1,138 subcamps, 1,029 have coordinates
and 783 have an opening date; the ~300 located but undated ones are hidden on the time slider unless switched on.
Name matching between sources is automatic and will have made some wrong matches. Check against the USHMM
*Encyclopedia of Camps and Ghettos*.

Rail routes follow today's network. Country borders in the territory layer are from OpenHistoricalMap and are
sharp; the occupied Soviet interior is from raster war maps (about 1.5 km error) to December 1942. From January
1943 the fronts are month-end lines written for this site in `scripts/frontlines.mjs`, running town by town through
documented positions (straight between towns, so right at the scale of Europe, not of a battlefield). Pockets
(Budapest, the Ruhr, Courland, the western Netherlands in April 1945) cannot be shown by this method.

House style: no em dashes anywhere in the text.

## Accuracy

Figures are rounded scholarly estimates. Every factual claim should be checked against the sources listed on
the Sources page before the site is made public.

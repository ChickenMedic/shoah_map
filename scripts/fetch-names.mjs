// Fetches the names of people murdered in the Holocaust and in the Nazi "euthanasia" killings (1933–1945) from
// Wikidata and writes scripts/raw/names.json, which pack-names.mjs compresses into public/data/names.json for the Victims page. Run with: npm run data:names
//
// Important caveat: Wikidata only knows people who have an article, a memorial-database record or some other
// published trace. Whatever this script returns is a small, biased fraction of the six million, skewed toward the
// famous and toward the regions whose memorial databases have been imported into Wikidata (above all the Terezín
// Memorial database, which is why Czech and German Jews are heavily over-represented). It is a sample, not a count.
//
// Method. Two phases, so no single query comes near the endpoint's 60 s limit:
//   A. "selectors": cheap queries that return only item ids. A person is kept if they match ANY selector:
//        - place of death (P20) is a Nazi concentration camp, extermination camp, subcamp, ghetto in Nazi-occupied
//          Europe, Nazi euthanasia centre, or a named massacre site, with death between 1933 and 1945;
//        - the Holocaust / Aktion T4 / "Holocaust victim" / "perished in the Holocaust" appears as significant event
//          (P793), cause (P509) or manner (P1196) of death, or killed by (P157);
//        - subject has role (P2868) = Holocaust victim, this is how the memorial-database imports are modelled.
//      Each person is de-duplicated by Q-id; the selectors that matched are remembered for the report.
//   B. "details": labels, birth/death year, place of death and the English Wikipedia sitelink, fetched in batches
//      of ids with VALUES.
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const OUT = join(here, 'raw/names.json') // packed for the site by pack-names.mjs
const ENDPOINT = 'https://query.wikidata.org/sparql'
const UA = 'ShoahEducationProject/0.1 (samdawson93@outlook.com)'
const WD = 'http://www.wikidata.org/entity/'
const WIKI_SIZE_LIMIT = 2 * 1024 * 1024 // drop the `wiki` field above this size
const BATCH = 1000 // ids per detail query
const CONCURRENCY = 3
// Labels: English first, then "mul" (Wikidata's language-neutral label, which many items now carry instead of an
// English one), then the languages of the countries the victims came from. The label service falls back along this
// list and returns the bare Q-id when none exists; those entries are dropped.
const LANGS = 'en,mul,de,cs,nl,fr,pl,hu,sk,it,he,yi,ru,uk,lt,lv,et,ro,hr,sr,sl,el,da,no,sv,es,pt'

const DEATH_FILTER = `?i wdt:P570 ?d . FILTER(YEAR(?d) >= 1933 && YEAR(?d) <= 1945)`

// Place-of-death classes (instances, including of subclasses)
const PLACE_CLASSES = {
  'Nazi concentration camp': 'Q328468',
  'extermination camp': 'Q153813',
  subcamp: 'Q1719244',
  'ghetto in Nazi-occupied Europe': 'Q2583015',
  'Nazi euthanasia centre': 'Q104901283',
}
// Named sites that are not (reliably) in those classes
const SITES = {
  'Theresienstadt (ghetto item)': 'Q15111616',
  'Theresienstadt Small Fortress': 'Q318861',
  'Babi Yar': 'Q48766',
  'Ponary massacre': 'Q2005090',
  Paneriai: 'Q16468669',
  'Rumbula massacre': 'Q2350607',
  Rumbula: 'Q837083',
  'Ninth Fort': 'Q665266',
  'Maly Trostenets': 'Q316109',
  'Grafeneck Euthanasia Centre': 'Q319744',
  'Hartheim Euthanasia Centre': 'Q2464181',
  'Brandenburg Euthanasia Centre': 'Q1669561',
  'Sonnenstein Euthanasia Centre': 'Q324139',
  'Bernburg Euthanasia Centre': 'Q314979',
  'Hadamar Euthanasia Centre': 'Q470564',
}
// Event / cause items
const HOLOCAUST = 'Q2763' // The Holocaust
const PERISHED = 'Q105070530' // perished in the Holocaust
const VICTIM = 'Q5883980' // Holocaust victim
const T4 = 'Q154494' // Aktion T4
const HOMICIDE = 'Q149086'

const values = (ids) => Object.values(ids).map((q) => 'wd:' + q).join(' ')

/** The selector queries. Each returns a column ?i of humans. */
const SELECTORS = [
  ...Object.entries(PLACE_CLASSES).map(([name, q]) => [
    `died in a ${name}`,
    `SELECT DISTINCT ?i WHERE { ?pl wdt:P31/wdt:P279* wd:${q} . ?i wdt:P31 wd:Q5; wdt:P20 ?pl . ${DEATH_FILTER} }`,
  ]),
  [
    'died at a named killing site',
    `SELECT DISTINCT ?i WHERE { VALUES ?pl { ${values(SITES)} } ?i wdt:P31 wd:Q5; wdt:P20 ?pl . ${DEATH_FILTER} }`,
  ],
  [
    'Holocaust as significant event / cause / manner of death',
    `SELECT DISTINCT ?i WHERE { VALUES ?ev { wd:${HOLOCAUST} wd:${PERISHED} wd:${VICTIM} }
       ?i wdt:P31 wd:Q5 . { ?i wdt:P793 ?ev } UNION { ?i wdt:P509 ?ev } UNION { ?i wdt:P1196 ?ev }
       OPTIONAL { ?i wdt:P570 ?d } FILTER(!BOUND(?d) || (YEAR(?d) >= 1933 && YEAR(?d) <= 1945)) }`,
  ],
  [
    'killed in Aktion T4 (event / cause / manner of death / killed by)',
    `SELECT DISTINCT ?i WHERE { ?i wdt:P31 wd:Q5 .
       { ?i wdt:P793 wd:${T4} } UNION { ?i wdt:P509 wd:${T4} } UNION { ?i wdt:P1196 wd:${T4} } UNION { ?i wdt:P157 wd:${T4} }
       OPTIONAL { ?i wdt:P570 ?d } FILTER(!BOUND(?d) || (YEAR(?d) >= 1933 && YEAR(?d) <= 1945)) }`,
  ],
  [
    'homicide in a camp',
    `SELECT DISTINCT ?i WHERE { VALUES ?cls { wd:Q328468 wd:Q153813 wd:Q1719244 wd:Q2583015 } ?pl wdt:P31/wdt:P279* ?cls .
       ?i wdt:P31 wd:Q5; wdt:P1196 wd:${HOMICIDE}; wdt:P20 ?pl . ${DEATH_FILTER} }`,
  ],
  [
    'role: Holocaust victim (memorial-database imports)',
    `SELECT DISTINCT ?i WHERE { ?i wdt:P31 wd:Q5; wdt:P2868 wd:${VICTIM} .
       OPTIONAL { ?i wdt:P570 ?d } FILTER(!BOUND(?d) || (YEAR(?d) >= 1933 && YEAR(?d) <= 1945)) }`,
  ],
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Runs a SPARQL query, retrying on rate limits and server errors */
async function sparql(query, attempt = 0) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/sparql-results+json', 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'query=' + encodeURIComponent(query),
  })
  if (!res.ok) {
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      const wait = Number(res.headers.get('retry-after')) * 1000 || 2000 * 2 ** attempt
      console.warn(`  HTTP ${res.status}, retrying in ${wait} ms`)
      await sleep(wait)
      return sparql(query, attempt + 1)
    }
    throw new Error(`SPARQL ${res.status}: ${(await res.text()).slice(0, 500)}`)
  }
  return (await res.json()).results.bindings
}

const qid = (b, k) => b[k]?.value?.replace(WD, '')
/**
 * Year of a date binding, or undefined when the precision is coarser than a year. Many memorial-database records
 * only know the decade ("1940s"), which Wikidata stores as 1940-01-01 with precision 8; emitting that as 1940
 * would be wrong. Precision 9 = year, 10 = month, 11 = day.
 */
const year = (b, k, pk) => {
  const v = b[k]?.value
  const prec = Number(b[pk]?.value ?? 11)
  if (!v || prec < 9) return undefined
  const m = /^(-?\d+)-/.exec(v)
  return m ? Number(m[1]) : undefined
}
/** Keeps the more precise of two dates; `pk` names the precision column */
const pickDate = (cur, b, k, pk) => {
  const prec = Number(b[pk]?.value ?? 11)
  if (!b[k] || (cur && cur.prec >= prec)) return cur
  // a decade-precision date is still worth keeping as "1940s"
  const m = prec === 8 ? /^(-?\d{3})\d-/.exec(b[k].value) : null
  return { year: year(b, k, pk), decade: m ? m[1] + '0s' : undefined, prec }
}

/** Runs `fn` over `items` with limited concurrency */
async function pool(items, fn) {
  let next = 0
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < items.length) await fn(items[next++])
  }))
}

// ---- Phase A: selectors ----
const matched = new Map() // qid -> Set of selector names
const breakdown = {}
for (const [name, query] of SELECTORS) {
  const t = Date.now()
  const rows = await sparql(query)
  breakdown[name] = rows.length
  for (const b of rows) {
    const id = qid(b, 'i')
    if (!matched.has(id)) matched.set(id, new Set())
    matched.get(id).add(name)
  }
  console.log(`${name}: ${rows.length} (${Date.now() - t} ms), distinct so far ${matched.size}`)
}
const ids = [...matched.keys()]

// ---- Phase B: details ----
const people = new Map()
const batches = []
for (let i = 0; i < ids.length; i += BATCH) batches.push(ids.slice(i, i + BATCH))
let done = 0
await pool(batches, async (batch) => {
  const rows = await sparql(`SELECT ?i ?iLabel ?b ?bp ?d ?dp ?pl ?plLabel ?wiki WHERE {
    VALUES ?i { ${batch.map((q) => 'wd:' + q).join(' ')} }
    OPTIONAL { ?i p:P569 [ a wikibase:BestRank; psv:P569 [ wikibase:timeValue ?b; wikibase:timePrecision ?bp ] ] }
    OPTIONAL { ?i p:P570 [ a wikibase:BestRank; psv:P570 [ wikibase:timeValue ?d; wikibase:timePrecision ?dp ] ] }
    OPTIONAL { ?i wdt:P20 ?pl }
    OPTIONAL { ?wiki schema:about ?i; schema:isPartOf <https://en.wikipedia.org/> }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "${LANGS}". } }`)
  for (const b of rows) {
    const id = qid(b, 'i')
    const p = people.get(id) ?? {}
    p.name ??= b.iLabel?.value
    p.born = pickDate(p.born, b, 'b', 'bp')
    p.died = pickDate(p.died, b, 'd', 'dp')
    const place = b.plLabel?.value
    if (place && !/^Q\d+$/.test(place)) p.place ??= place
    p.wiki ??= b.wiki?.value
    people.set(id, p)
  }
  done++
  if (done % 10 === 0 || done === batches.length) console.log(`details: ${done}/${batches.length} batches`)
})

// ---- Assemble ----
let dropped = { unlabeled: 0, outOfRange: 0 }
const names = []
for (const [id, p] of people) {
  if (!p.name || /^Q\d+$/.test(p.name)) { dropped.unlabeled++; continue }
  const born = p.born?.year, died = p.died?.year
  if (died !== undefined && (died < 1933 || died > 1945)) { dropped.outOfRange++; continue }
  const e = { name: p.name.trim() }
  if (born !== undefined) e.born = born
  if (died !== undefined) e.died = died
  else if (p.died?.decade) e.diedApprox = p.died.decade
  if (p.place) e.place = p.place
  if (p.wiki) e.wiki = decodeURIComponent(p.wiki)
  names.push(e)
}
const collator = new Intl.Collator('en', { sensitivity: 'base' })
names.sort((a, b) => collator.compare(a.name, b.name) || collator.compare(a.place ?? '', b.place ?? ''))

const date = new Date().toISOString().slice(0, 10)
const serialize = (list) =>
  `{\n  "source": "Wikidata, retrieved ${date}",\n  "count": ${list.length},\n  "names": [\n` +
  list.map((e) => '    ' + JSON.stringify(e)).join(',\n') +
  '\n  ]\n}\n'

let json = serialize(names)
let withWiki = names.filter((e) => e.wiki).length
if (Buffer.byteLength(json) > WIKI_SIZE_LIMIT) {
  console.log(`output is ${(Buffer.byteLength(json) / 1e6).toFixed(1)} MB; dropping the wiki field (${withWiki} entries had one)`)
  for (const e of names) delete e.wiki
  json = serialize(names)
}
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, json)

// ---- Report ----
console.log('\nSelector breakdown (a person can match several):')
for (const [k, v] of Object.entries(breakdown)) console.log(`  ${v.toString().padStart(7)}  ${k}`)
console.log(`\ndistinct people matched: ${ids.length}`)
console.log(`dropped: ${dropped.unlabeled} without a readable label, ${dropped.outOfRange} with death outside 1933–1945`)
console.log(`written: ${names.length} names, ${(Buffer.byteLength(json) / 1e6).toFixed(2)} MB -> ${OUT}`)
console.log(`with English Wikipedia article: ${withWiki}; with death year: ${names.filter((e) => e.died).length}; with place: ${names.filter((e) => e.place).length}`)
console.log('\nSpot checks (namesakes are listed too):')
for (const check of ['Anne Frank', 'Janusz Korczak', 'Petr Ginz', 'Etty Hillesum', 'Charlotte Salomon', 'Edith Stein']) {
  const hits = names.filter((e) => e.name === check)
  const desc = hits.map((h) => `${h.born ?? '?'}–${h.died ?? '?'}, ${h.place ?? 'place unknown'}`).join('; ')
  console.log(`  ${hits.length ? 'found  ' : 'MISSING'} ${check}${hits.length ? ` (${desc})` : ''}`)
}

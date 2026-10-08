// Builds src/data/subcamps.json by merging three sources:
//   1. Wikidata (raw/camps_all.json), names, parent camps and coordinates. Re-fetch with:
//      curl -H "Accept: application/sparql-results+json" --data-urlencode "query@raw/q3.rq" https://query.wikidata.org/sparql -o raw/camps_all.json
//   2. The official German register of camps and subcamps (raw/beg.json, from parse-beg.mjs), dates
//   3. German Wikipedia subcamp lists (raw/dewiki.json, from parse-dewiki.mjs), dates and coordinates
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const read = (f) => JSON.parse(readFileSync(join(here, f), 'utf8'))
const rows = read('raw/camps_all.json').results.bindings
const beg = read('raw/beg.json').filter((b) => b.parent)
const dewiki = read('raw/dewiki.json')

// Wikidata parent entity -> main camp id used in src/data/sites.ts
const PARENTS = {
  Q151198: 'dachau', Q60684875: 'dachau', Q1719246: 'dachau',
  Q152802: 'buchenwald',
  Q160268: 'gross-rosen',
  Q312478: 'neuengamme', Q1719291: 'neuengamme',
  Q326193: 'stutthof',
  Q154498: 'sachsenhausen',
  Q274354: 'flossenburg', Q98671750: 'flossenburg',
  Q639319: 'natzweiler', Q1719400: 'natzweiler', Q47515160: 'natzweiler',
  Q160139: 'mauthausen', Q681748: 'mauthausen', Q1719374: 'mauthausen',
  Q7341: 'auschwitz', Q663764: 'auschwitz',
  Q684424: 'mittelbau-dora',
  Q159483: 'ravensbruck',
  Q697753: 'hinzert',
  Q705431: 'vaivara',
  Q697912: 'riga-kaiserwald',
  Q160135: 'majdanek',
  Q153713: 'herzogenbusch',
  Q18669828: 'kauen',
  Q160408: 'plaszow',
  Q7332: 'bergen-belsen',
}
// Main camps themselves (and the three Auschwitz main camps) are described in sites.ts, not here.
const SKIP = new Set(['Q151198', 'Q152802', 'Q160268', 'Q312478', 'Q326193', 'Q154498', 'Q274354', 'Q98671750',
  'Q639319', 'Q160139', 'Q7341', 'Q663764', 'Q684424', 'Q159483', 'Q697753', 'Q705431', 'Q697912', 'Q160135',
  'Q153713', 'Q18669828', 'Q160408', 'Q7332', 'Q662563', 'Q700356'])

const qid = (u) => u.split('/').pop()
const ym = (d) => (d ? d.slice(0, 7) : undefined)
const inRange = (d) => d && /^19(3[3-9]|4[0-5])/.test(d)

// ── 1. Wikidata base list ─────────────────────────────────
const byId = new Map()
for (const r of rows) {
  const id = qid(r.item.value)
  if (SKIP.has(id)) continue
  const parent = [r.org, r.parent].map((p) => p && PARENTS[qid(p.value)]).find(Boolean)
  if (!parent) continue
  const label = r.itemLabel?.value
  if (!label || /^Q\d+$/.test(label)) continue
  const cur = byId.get(id) ?? {
    id,
    name: label.replace(/\s+(concentration|labou?r) camp( complex)?$/i, '').replace(/^(KZ-)?Außenlager\s+/i, '')
      // Wikidata labels sometimes carry the kind of site in brackets; the parent camp is shown separately
      .replace(/\s*\((?:podobóz|KZ|Außenlager|concentration camp|subcamp|camp)[^)]*\)/i, '')
      .replace(/^"Mexico".*$/, 'Birkenau "Mexico" sector').trim(),
    parent,
  }
  if (r.coord && cur.lat === undefined) {
    const m = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(r.coord.value)
    if (m) { cur.lng = Number(Number(m[1]).toFixed(4)); cur.lat = Number(Number(m[2]).toFixed(4)) }
  }
  cur.country ??= r.countryLabel?.value
  if (inRange(r.start?.value) && !cur.opened) { cur.opened = ym(r.start.value); cur.dates = 'wikidata' }
  if (inRange(r.end?.value) && !cur.closed) cur.closed = ym(r.end.value)
  if (r.article) cur.wiki ??= r.article.value
  byId.set(id, cur)
}

// Wikidata sometimes holds two entities for one site; keep the better-located one.
const seen = new Map()
for (const c of byId.values()) {
  const key = c.parent + '|' + c.name.toLowerCase()
  const prev = seen.get(key)
  if (!prev || (prev.lat === undefined && c.lat !== undefined)) seen.set(key, c)
}
const list = [...seen.values()]

// ── 2 & 3. Match dates (and coordinates) from the register and Wikipedia ──
const NOISE = /\b(kz|aussenlager|aussenkommando|aussenarbeitslager|arbeitslager|nebenlager|lager|konzentrationslager|concentration|camp|subcamp|frauenlager|maennerlager|frauen|maenner|men|women|s|kommando|kdo|v|kreis|gemeinde|bei|stadt|landkreis|ober|nieder|an|der|am|im|in|und|the|of|ss|baubrigade|heute|codename|deckname)\b/g
const norm = (s) =>
  s.toLowerCase().replace(/ß/g, 'ss').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').replace(NOISE, ' ').replace(/\s+/g, ' ').trim()
const tokens = (s) => new Set(norm(s).split(' ').filter(Boolean))

function bestMatch(sub, candidates) {
  const a = tokens(sub.name)
  if (!a.size) return undefined
  const [first] = a
  let best = [], bestScore = 0
  for (const c of candidates) {
    if (c.parent !== sub.parent) continue
    const b = tokens(c.name)
    if (!b.has(first) && ![...b][0]?.startsWith(first)) continue
    const inter = [...a].filter((t) => b.has(t)).length
    if (!inter) continue
    const score = inter / Math.max(a.size, b.size) + (inter === a.size ? 0.01 : 0)
    if (score > bestScore + 1e-9) { best = [c]; bestScore = score } else if (Math.abs(score - bestScore) < 1e-9) best.push(c)
  }
  if (!best.length) return undefined
  // Several equally good candidates are fine if they agree on the opening date
  const starts = new Set(best.map((c) => ym(c.start)).filter(Boolean))
  return starts.size <= 1 ? best[0] : undefined
}

const stats = { beg: 0, dewiki: 0, coordsFromWiki: 0, added: 0 }
const usedWiki = new Set()
for (const sub of list) {
  const w = bestMatch(sub, dewiki)
  if (w) {
    usedWiki.add(w)
    if (!sub.opened && inRange(w.start)) { sub.opened = ym(w.start); sub.dates = 'wikipedia'; stats.dewiki++ }
    if (!sub.closed && inRange(w.end)) sub.closed = ym(w.end)
    if (sub.lat === undefined && w.lat !== undefined) { sub.lat = Number(w.lat.toFixed(4)); sub.lng = Number(w.lng.toFixed(4)); stats.coordsFromWiki++ }
  }
  const b = bestMatch(sub, beg)
  if (b) {
    if (!sub.opened && inRange(b.start)) { sub.opened = ym(b.start); sub.dates = 'register'; stats.beg++ }
    if (!sub.closed && inRange(b.end)) sub.closed = ym(b.end)
    sub.register = b.no
  }
}

// Wikipedia entries with coordinates that matched nothing in Wikidata are new sites
for (const w of dewiki) {
  if (usedWiki.has(w) || w.lat === undefined) continue
  if (list.some((s) => s.parent === w.parent && norm(s.name) === norm(w.name))) continue
  const sub = { id: 'dewiki-' + list.length, name: w.name.replace(/^KZ\s+/, ''), parent: w.parent, lat: Number(w.lat.toFixed(4)), lng: Number(w.lng.toFixed(4)) }
  if (inRange(w.start)) { sub.opened = ym(w.start); sub.dates = 'wikipedia' }
  if (inRange(w.end)) sub.closed = ym(w.end)
  const b = bestMatch(sub, beg)
  if (b) {
    if (!sub.opened && inRange(b.start)) { sub.opened = ym(b.start); sub.dates = 'register' }
    if (!sub.closed && inRange(b.end)) sub.closed = ym(b.end)
    sub.register = b.no
  }
  list.push(sub)
  stats.added++
}

// An opening date after the closing date is a parsing error; drop both rather than show nonsense
for (const s of list) if (s.opened && s.closed && s.opened > s.closed) { delete s.opened; delete s.closed; delete s.dates }

list.sort((a, b) => a.parent.localeCompare(b.parent) || a.name.localeCompare(b.name))
writeFileSync(join(here, '../src/data/subcamps.json'), JSON.stringify(list))

const by = {}
for (const c of list) by[c.parent] = (by[c.parent] ?? 0) + 1
console.log(`${list.length} subcamps; ${list.filter((c) => c.lat !== undefined).length} with coordinates; ${list.filter((c) => c.opened).length} with opening dates (${list.filter((c) => c.opened && c.lat !== undefined).length} with both)`)
console.log(stats, by)

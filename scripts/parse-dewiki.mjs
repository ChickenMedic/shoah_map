// Extracts subcamp names, dates and coordinates from the German Wikipedia subcamp lists saved in scripts/raw/de_*.json
// (fetched with the MediaWiki API, action=parse&prop=wikitext). Output: scripts/raw/dewiki.json
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const raw = join(here, 'raw')

const PAGES = {
  'de_Au__enlager_des_KZ_Dachau.json': 'dachau',
  'de_Liste_der_Au__enlager_des_KZ_Buchenwald.json': 'buchenwald',
  'de_Liste_der_Au__enlager_des_KZ_Mauthausen.json': 'mauthausen',
  'de_Liste_der_Au__enlager_des_KZ_Natzweiler_Struthof.json': 'natzweiler',
  'de_Liste_der_Au__enlager_des_KZ_Neuengamme.json': 'neuengamme',
  'de_Liste_der_Au__enlager_des_KZ_Gro___Rosen.json': 'gross-rosen',
  'de_Liste_der_Au__enlager_des_KZ_Riga_Kaiserwald.json': 'riga-kaiserwald',
  'de_Liste_der_Au__enlager_des_KZ_Flossenb__rg.json': 'flossenburg',
  'de_Liste_der_Au__enlager_des_KZ_Hinzert.json': 'hinzert',
  'de_Liste_der_Au__enlager_des_KZ_Sachsenhausen.json': 'sachsenhausen',
  'de_Liste_der_Au__enlager_des_KZ_Auschwitz_I__Stammlager_.json': 'auschwitz',
  'de_Liste_der_Au__enlager_des_KZ_Stutthof.json': 'stutthof',
  'de_Liste_der_Au__enlager_des_KZ_Ravensbr__ck.json': 'ravensbruck',
}

const MONTHS = { januar: 1, jan: 1, jänner: 1, februar: 2, feb: 2, märz: 3, mär: 3, april: 4, apr: 4, mai: 5, juni: 6, jun: 6, juli: 7, jul: 7, august: 8, aug: 8, september: 9, sept: 9, sep: 9, oktober: 10, okt: 10, november: 11, nov: 11, dezember: 12, dez: 12 }
const monthRe = Object.keys(MONTHS).sort((a, b) => b.length - a.length).join('|')
const pad = (n) => String(n).padStart(2, '0')

/** All dates in a string as YYYY-MM(-DD); years alone are ignored as too ambiguous */
function dates(text) {
  const out = []
  for (const m of text.matchAll(/data-sort-value="(\d{4})-?(\d{2})-?(\d{2})?"/g)) out.push(`${m[1]}-${m[2]}${m[3] ? '-' + m[3] : ''}`)
  for (const m of text.matchAll(/\{\{DatumZelle\|(\d{4})-(\d{2})(?:-(\d{2}))?/g)) out.push(`${m[1]}-${m[2]}${m[3] ? '-' + m[3] : ''}`)
  for (const m of text.matchAll(/\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/g)) out.push(`${m[3]}-${pad(m[2])}-${pad(m[1])}`)
  for (const m of text.matchAll(new RegExp(`(?:(\\d{1,2})\\.\\s*)?(${monthRe})\\.?\\s+(\\d{4})`, 'gi'))) {
    out.push(`${m[3]}-${pad(MONTHS[m[2].toLowerCase()])}${m[1] ? '-' + pad(m[1]) : ''}`)
  }
  // "7. April bis 11. September 1942": the first day/month borrows the year
  for (const m of text.matchAll(new RegExp(`(\\d{1,2})\\.\\s*(${monthRe})\\s+bis\\s+\\d{1,2}\\.\\s*(?:${monthRe})\\s+(\\d{4})`, 'gi'))) {
    out.push(`${m[3]}-${pad(MONTHS[m[2].toLowerCase()])}-${pad(m[1])}`)
  }
  return [...new Set(out.filter((d) => /^19(3[3-9]|4[0-5])/.test(d)))].sort()
}

/** Drops a leading cell attribute list such as `style="…" |` */
const stripAttrs = (s) => s.replace(/^[^|[\]{}]*=[^|[\]{}]*\|\s*/, '')

const clean = (s) =>
  stripAttrs(s).replace(/<ref[\s\S]*?<\/ref>|<ref[^>]*\/>/g, '').replace(/<[^>]+>/g, '').replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\[\[[^\]|]*\|([^\]]*)\]\]/g, '$1').replace(/\[\[([^\]]*)\]\]/g, '$1')
    .replace(/'{2,}/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

const coord = (s) => {
  const m = /\{\{Coordinate\s*\|[^}]*?NS=([-\d.]+)\s*\|[^}]*?EW=([-\d.]+)/.exec(s)
  return m ? { lat: Number(m[1]), lng: Number(m[2]) } : undefined
}

const nameOf = (s) =>
  clean(s).replace(/^(KZ[- ]?)?(Außenlager|Außenkommando|Außenarbeitslager|Arbeitslager|Nebenlager|AL|AK|Lager)\s*/i, '')
    .replace(/^(KZ[- ]?)?(Außenlager|Außenkommando)\s*/i, '').replace(/\s*\((?:heute|Codename|Deckname)[^)]*\)/gi, '').trim()

const out = []
for (const [file, parent] of Object.entries(PAGES)) {
  const text = JSON.parse(readFileSync(join(raw, file), 'utf8')).parse.wikitext
  let n = 0
  // Tables
  for (const table of text.split('{|').slice(1)) {
    const rows = table.split(/\n\|-/).slice(1)
    for (const row of rows) {
      // the first fragment is the row's own attribute list (`|- class="…"`), not a cell
      const cells = row.split(/\n\|\s?|\|\|/).slice(1).map((c) => c.trim()).filter((c) => c && !/^[+!]/.test(c))
      // The name is the first real text cell; <small> cells are region/district columns
      const nameCell = cells.find((c) => !/^<small>/.test(stripAttrs(c)) && /[A-Za-zÄÖÜäöü]{3}/.test(clean(c)) && !/^\d/.test(clean(c)) && clean(c).length > 2)
      if (!nameCell) continue
      const name = nameOf(nameCell)
      if (!name || name.length < 3) continue
      const ds = dates(row)
      // A single date is a closing date when the row says only "bis …"
      const endOnly = ds.length === 1 && /\bbis\b/.test(row) && !/\b(ab|von|seit)\b/.test(row)
      out.push({ parent, name, start: endOnly ? undefined : ds[0], end: ds.length > 1 || endOnly ? ds[ds.length - 1] : undefined, ...coord(row) })
      n++
    }
  }
  // Bulleted lists
  for (const line of text.split('\n').filter((l) => /^\*+\s*\S/.test(l))) {
    const name = nameOf(line.replace(/^\*+\s*/, '').split(/[,;(]/)[0])
    if (!name || name.length < 3 || /siehe/.test(line)) continue
    const ds = dates(line)
    if (!ds.length) continue // bullets without dates add nothing we do not have
    const endOnly = ds.length === 1 && /\bbis\b/.test(line)
    out.push({ parent, name, start: endOnly ? undefined : ds[0], end: ds.length > 1 || endOnly ? ds[ds.length - 1] : undefined })
    n++
  }
  console.log(parent.padEnd(16), n)
}
writeFileSync(join(raw, 'dewiki.json'), JSON.stringify(out, null, 1))
console.log(`${out.length} entries, ${out.filter((o) => o.start).length} with start dates, ${out.filter((o) => o.lat).length} with coordinates`)

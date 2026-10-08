// Parses the official German register of concentration camps and their subcamps
// (Anlage to the 6th implementing regulation of the Federal Compensation Act, BEG) into scripts/raw/beg.json.
// Source: https://www.gesetze-im-internet.de/begdv_6/anlage.html (saved as scripts/raw/beg.html)
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const html = readFileSync(join(here, 'raw/beg.html'), 'utf8')
const decode = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)).replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&')
const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
  .map((m) => [...m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => decode(c[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()))

const PARENTS = [
  ['Buchenwald', 'buchenwald'], ['Stutthof', 'stutthof'], ['Dora-Mittelbau', 'mittelbau-dora'], ['Auschwitz', 'auschwitz'],
  ['Ravensbrück', 'ravensbruck'], ['Flossenbürg', 'flossenburg'], ['Neuengamme', 'neuengamme'], ['Herzogenbusch', 'herzogenbusch'],
  ['Dachau', 'dachau'], ['Mauthausen', 'mauthausen'], ['Natzweiler', 'natzweiler'], ['Vaivara', 'vaivara'], ['Groß Rosen', 'gross-rosen'],
  ['Groß-Rosen', 'gross-rosen'], ['Sachsenhausen', 'sachsenhausen'], ['Lublin', 'majdanek'], ['Riga-Kaiserwald', 'riga-kaiserwald'],
  ['Riga', 'riga-kaiserwald'], ['Hinzert', 'hinzert'], ['Kauen', 'kauen'], ['Krakau-Plaszow', 'plaszow'], ['Bergen-Belsen', 'bergen-belsen'],
]
const toIso = (d) => { const [day, m, y] = d.split('.'); return `${y}-${m.padStart(2, '0')}-${day.padStart(2, '0')}` }

const entries = []
let cur = null
for (const r of rows) {
  const cells = r.filter(Boolean)
  if (/^\d+[a-z]?$/.test(r[0])) {
    cur = { no: r[0], text: [] }
    entries.push(cur)
    cells.shift()
  }
  if (cur) cur.text.push(...cells)
}

const out = []
for (const e of entries) {
  const name = e.text[0]
  if (!name || /, siehe /.test(name)) continue // cross-reference
  const all = e.text.join(' | ')
  const parentCell = e.text.slice(1).find((c) => PARENTS.some(([p]) => c.startsWith(p)))
  const parent = parentCell && PARENTS.find(([p]) => parentCell.startsWith(p))[1]
  const range = /(\d{1,2}\.\d{1,2}\.\d{4}) bis (\d{1,2}\.\d{1,2}\.\d{4})/.exec(all)
  const from = /(?:^|\| )ab (\d{1,2}\.\d{1,2}\.\d{4})/.exec(all)
  const until = /(?:^|\| )bis (\d{1,2}\.\d{1,2}\.\d{4})/.exec(all)
  const start = range ? toIso(range[1]) : from ? toIso(from[1]) : undefined
  const end = range ? toIso(range[2]) : until ? toIso(until[1]) : undefined
  out.push({ no: e.no, name: name.replace(/,\s*$/, ''), parent, start, end })
}
writeFileSync(join(here, 'raw/beg.json'), JSON.stringify(out, null, 1))
console.log(`${out.length} entries; ${out.filter((o) => o.parent).length} with a main camp; ${out.filter((o) => o.start).length} with an opening date; ${out.filter((o) => o.start && o.end).length} with both dates`)

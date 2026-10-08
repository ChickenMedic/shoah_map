// Packs scripts/raw/names.json (from fetch-names.mjs) into a compact form for lazy loading on the Victims page:
// public/data/names.json = { source, count, places: [...], names: ["Name|born|died|placeIndex", ...] }
// `died` is a year, or a decade such as 1940s when that is all the record holds
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const raw = JSON.parse(readFileSync(join(here, 'raw/names.json'), 'utf8'))
const places = []
const placeIndex = new Map()
const tidyPlace = (p) => p && p.replace(/\s+(concentration|extermination) camp$/i, '').replace(/ Ghetto$/i, ' ghetto')
const names = raw.names.map((n) => {
  const p = tidyPlace(n.place)
  let pi = ''
  if (p) {
    if (!placeIndex.has(p)) { placeIndex.set(p, places.length); places.push(p) }
    pi = String(placeIndex.get(p))
  }
  return [n.name.replace(/\|/g, '/'), n.born ?? '', n.died ?? '', pi].join('|').replace(/\|+$/, '')
})
mkdirSync(join(here, '../public/data'), { recursive: true })
const out = { source: raw.source, count: names.length, places, names }
writeFileSync(join(here, '../public/data/names.json'), JSON.stringify(out))
console.log(`${names.length} names, ${places.length} places, ${Math.round(JSON.stringify(out).length / 1024)} kB`)

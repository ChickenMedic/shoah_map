// Fetches boundary relations from OpenHistoricalMap (CC0) and stitches their ways into GeoJSON MultiPolygons.
// Used for the German Reich's borders before September 1939, which the ww2-atlas frames do not cover.
// Output: scripts/raw/ohm/<relation id>.json
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const out = join(here, 'raw/ohm')
mkdirSync(out, { recursive: true })

// Deutsches Reich versions, from the pre-Saar republic to the eve of the war
const RELATIONS = {
  2696515: 'German Reich 1922-06-20 to 1935-03-01',
  2694638: 'German Reich 1935-03-01 to 1936-07-03 (Saar returned)',
  2693085: 'German Reich 1936-07-03 to 1938-03-13',
  2704712: 'German Reich 1938-03-13 to 1938-11-21 (Austria annexed)',
  2704711: 'German Reich 1938-11-21 to 1939-03-16 (Sudetenland annexed)',
  2704710: 'German Reich 1939-03-16 to 1939-03-22 (Bohemia and Moravia occupied)',
}

/** Joins way geometries into closed rings by matching endpoints */
function stitch(ways) {
  const rings = []
  const pool = ways.map((w) => w.map((p) => [p.lon, p.lat]))
  while (pool.length) {
    let ring = pool.shift()
    let grew = true
    while (grew && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])) {
      grew = false
      const end = ring[ring.length - 1]
      for (let i = 0; i < pool.length; i++) {
        const w = pool[i]
        const a = w[0], b = w[w.length - 1]
        if (a[0] === end[0] && a[1] === end[1]) { ring = ring.concat(w.slice(1)); pool.splice(i, 1); grew = true; break }
        if (b[0] === end[0] && b[1] === end[1]) { ring = ring.concat(w.slice(0, -1).reverse()); pool.splice(i, 1); grew = true; break }
      }
    }
    if (ring.length >= 4) rings.push(ring)
  }
  return rings
}

const inside = (pt, ring) => {
  let c = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j]
    if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

for (const [id, label] of Object.entries(RELATIONS)) {
  const file = join(out, `${id}.json`)
  if (existsSync(file)) { console.log(`${id} cached`); continue }
  const q = `[out:json][timeout:180];relation(${id});out geom;`
  const res = await fetch('https://overpass-api.openhistoricalmap.org/api/interpreter', {
    method: 'POST', body: 'data=' + encodeURIComponent(q),
    headers: { 'User-Agent': 'ShoahEducationProject/0.1 (samdawson93@outlook.com)', 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  if (!res.ok) { console.error(`${id}: ${res.status}`); continue }
  const rel = (await res.json()).elements.find((e) => e.type === 'relation')
  const outers = stitch(rel.members.filter((m) => m.type === 'way' && m.role !== 'inner' && m.geometry).map((m) => m.geometry))
  const inners = stitch(rel.members.filter((m) => m.type === 'way' && m.role === 'inner' && m.geometry).map((m) => m.geometry))
  // Each hole belongs to the outer ring that contains it
  const polygons = outers.map((o) => [o, ...inners.filter((h) => inside(h[0], o))])
  writeFileSync(file, JSON.stringify({ id: Number(id), label, type: 'MultiPolygon', coordinates: polygons }))
  console.log(`${id} ${label}: ${outers.length} outer, ${inners.length} inner rings`)
  await new Promise((r) => setTimeout(r, 2000))
}

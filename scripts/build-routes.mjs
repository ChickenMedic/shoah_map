// Routes each deportation in src/data/transports.ts over the railway network using BRouter's rail profile
// (OpenStreetMap data, i.e. today's network, see the note in transports.ts) and writes src/data/routes.json.
// Usage: node scripts/build-routes.mjs            (only routes that are missing)
//        node scripts/build-routes.mjs --all      (re-route everything)
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const outFile = join(here, '../src/data/routes.json')
const existing = existsSync(outFile) ? JSON.parse(readFileSync(outFile, 'utf8')) : {}
const redoAll = process.argv.includes('--all')

// transports.ts is TypeScript; pull the fields we need with a light regex parse rather than a compiler.
const src = readFileSync(join(here, '../src/data/transports.ts'), 'utf8')
const points = Object.fromEntries([...src.matchAll(/^\s+(\w+): \[([-\d.]+), ([-\d.]+)\],/gm)].map((m) => [m[1], [Number(m[2]), Number(m[3])]]))
const latLng = (expr) => {
  const named = /^P\.(\w+)$/.exec(expr.trim())
  if (named) return points[named[1]]
  const lit = /\[([-\d.]+), ([-\d.]+)\]/.exec(expr)
  return [Number(lit[1]), Number(lit[2])]
}
// one object literal per transport; read each field with its own regex
const field = (block, name) => {
  const m = new RegExp(name + String.raw`: (P\.\w+|\[[^\]]+\])`).exec(block)
  return m ? latLng(m[1]) : undefined
}
const transports = src.split(/\n  \{\n/).slice(1).map((block) => ({
  id: /id: '([^']+)'/.exec(block)[1],
  // a deportation that began by ship is routed by rail from the port
  from: field(block, 'sea') ?? field(block, 'fromLatLng'),
  to: field(block, 'toLatLng'),
  railTo: field(block, 'railTo'),
  via: (/via: \[(.*)\],/.exec(block)?.[1] ?? '').split('], [').filter(Boolean).map((v) => latLng('[' + v.replace(/[[\]]/g, '') + ']')),
}))

/** Douglas–Peucker simplification; tolerance in degrees */
function simplify(pts, tol) {
  if (pts.length < 3) return pts
  const d2 = (p, a, b) => {
    const [x, y] = p, [x1, y1] = a, [x2, y2] = b
    const dx = x2 - x1, dy = y2 - y1
    const t = dx || dy ? Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy))) : 0
    return (x - (x1 + t * dx)) ** 2 + (y - (y1 + t * dy)) ** 2
  }
  let idx = 0, max = 0
  for (let i = 1; i < pts.length - 1; i++) {
    const d = d2(pts[i], pts[0], pts[pts.length - 1])
    if (d > max) { max = d; idx = i }
  }
  if (max <= tol * tol) return [pts[0], pts[pts.length - 1]]
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)]
}

const UA = { 'User-Agent': 'ShoahEducationProject/0.1 (samdawson93@outlook.com)' }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function brouter(stops) {
  const url = `https://brouter.de/brouter?lonlats=${stops.map(([lat, lng]) => `${lng},${lat}`).join('|')}&profile=rail&alternativeidx=0&format=geojson`
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: UA })
    if (res.status === 403) { await sleep(8000 * (attempt + 1)); continue } // rate limited
    if (!res.ok) throw new Error(`brouter ${res.status} ${(await res.text()).trim()}`)
    const f = (await res.json()).features[0]
    return { coords: f.geometry.coordinates, km: Number(f.properties['track-length']) / 1000, engine: 'brouter' }
  }
  throw new Error('brouter: rate limited')
}

// Fallback: an OSRM instance with a train profile, which snaps endpoints to the nearest track
async function osrm(stops) {
  const url = `https://signal.eu.org/osm/eu/route/v1/train/${stops.map(([lat, lng]) => `${lng},${lat}`).join(';')}?overview=full&geometries=geojson`
  const res = await fetch(url, { headers: UA })
  if (!res.ok) throw new Error(`osrm ${res.status}`)
  const r = (await res.json()).routes[0]
  return { coords: r.geometry.coordinates, km: r.distance / 1000, engine: 'osrm' }
}

async function route(t) {
  const stops = [t.from, ...t.via, t.railTo ?? t.to]
  let r
  try { r = await brouter(stops) } catch (e) { console.error(`  ${t.id}: ${e.message}; trying OSRM`); r = await osrm(stops) }
  const coords = r.coords.map(([lng, lat]) => [Number(lat.toFixed(4)), Number(lng.toFixed(4))])
  // make sure the line reaches the actual sites even where the track ends short of them
  const pts = [t.from, ...simplify(coords, 0.004), t.to]
  return { points: pts, km: Math.round(r.km), engine: r.engine }
}

const out = { ...existing }
for (const t of transports) {
  if (!redoAll && out[t.id]) continue
  try {
    out[t.id] = await route(t)
    console.log(`${t.id.padEnd(28)} ${String(out[t.id].km).padStart(5)} km  ${out[t.id].points.length} points  (${out[t.id].engine})`)
  } catch (e) {
    console.error(`${t.id}: ${e.message}`)
  }
  await sleep(3000)
}
writeFileSync(outFile, JSON.stringify(out))
console.log(`${Object.keys(out).length}/${transports.length} routes written`)

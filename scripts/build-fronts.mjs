// Builds public/data/fronts.json: German-controlled Europe month by month, 1933-01 … 1945-05, in two classes:
//   reich     the German Reich itself, including annexed territory (Saar 1935, Austria 1938, Sudetenland 1938,
//             Memel 1939, western Poland 1939, Alsace-Lorraine, Luxembourg, Eupen-Malmedy 1940 …)
//   occupied  territory under German occupation or administration, plus Germany's allies and client states
//
// Sources
//   • Political boundaries: OpenHistoricalMap (CC0), as dated boundary relations. Pre-war Reich versions are fetched
//     by fetch-ohm.mjs; the wartime polities come from ww2-atlas (data/territory/frames + geometry.json, which are
//     OHM extracts) with its faction-map.yaml deciding which were Axis or Axis-occupied on a given date.
//   • Occupied Soviet territory beyond the Reichskommissariats has no OHM boundary. For 1941-07 … 1942-12 we use
//     ww2-atlas's monthly control polygons (reverse-projected from public-domain Commons maps, ~1.5 km error),
//     restricted to the USSR's 1941 territory. From 1943 the December 1942 extent is cut back along approximate
//     front lines (ww2-atlas frontlines.yaml, CC BY 4.0, "tens of km" accuracy) and lines added here for Italy,
//     the western front and interim months. Frames from 1943 are therefore marked approx: true.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pc from 'polygon-clipping'
import { east, west, italy, regions } from './frontlines.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const raw = join(here, 'raw/ww2atlas')
const read = (f) => JSON.parse(readFileSync(join(raw, f), 'utf8'))
const geometry = read('geometry.json')
// Coordinates are snapped to a 0.001° grid so that boundaries shared between polities coincide exactly; near-coincident
// edges from different sources are what makes the clipping library fail
const snap = (mp) => mp.map((poly) => poly.map((ring) => ring.map(([x, y]) => [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000])))
const asMulti = (g) => snap(g.type === 'Polygon' ? [g.coordinates] : g.coordinates)

// The German-held area is kept to Europe; the Allied and neutral layers run from the Atlantic to the Pacific so that
// the Soviet Union, the Middle East and Africa appear whole rather than cut off at a box edge.
const EUROPE = [[[[-12, 30], [45, 30], [45, 75], [-12, 75], [-12, 30]]]]
// Everything is cut to this region (Europe, North Africa, the Near East); the map view is fenced inside it so the
// cut edges are never on screen
const REGION = [[[[-32, 14], [68, 14], [68, 84], [-32, 84], [-32, 14]]]]
const clip = (mp, to = EUROPE) => (mp.length ? pc.intersection(mp, to) : [])
/** Rounds and simplifies before a boolean operation, which keeps polygon-clipping from choking on near-degenerate slivers */
const coarse = (mp, tol = 0.02) => tidy(mp, tol).map((poly) => poly.map((ring) => [...ring, ring[0]]))
let differenceFailures = 0
/** a minus b, retried at coarser resolutions when the clipping library fails; `fallback` is returned if every attempt fails */
const safeDifference = (a, b, fallback = a) => {
  for (const tol of [0, 0.02, 0.05]) {
    try { return tol ? pc.difference(coarse(a, tol), coarse(b, tol)) : pc.difference(a, b) } catch { /* try coarser */ }
  }
  differenceFailures++
  return fallback
}
const union = (list) => (list.length ? pc.union(...list) : [])

// ── Reich border versions (OHM relation ids), by start date ──
const pre = Object.fromEntries(readdirSync(join(here, 'raw/ohm')).map((f) => { const g = JSON.parse(readFileSync(join(here, 'raw/ohm', f), 'utf8')); return [g.id, g.coordinates] }))
const REICH = [
  ['1922-06-20', pre[2696515]],
  ['1935-03-01', pre[2694638]],
  ['1936-07-03', pre[2693085]],
  ['1938-03-13', pre[2704712]],
  ['1938-11-21', pre[2704711]],
  ['1939-03-16', pre[2704710]],
  ['1939-03-22', asMulti(geometry[2704709])],
  ['1939-10-26', asMulti(geometry[2704716])],
  ['1940-06-01', asMulti(geometry[2704714])],
  ['1940-08-02', asMulti(geometry[2704713])],
  ['1941-04-14', asMulti(geometry[2704717])],
  ['1941-08-01', asMulti(geometry[2692712])],
].filter(([, g]) => g)
// The demarcation between the Western Allies and the Red Army in May 1945, the line that became the Iron Curtain:
// Lübeck Bay, the Elbe, the Harz, the Thuringian and Bavarian borders, the American stop line in Bohemia, the Enns
// in Austria, then the Yugoslav border to the Adriatic at Trieste and down the Adriatic to Albania and Greece. [lng, lat]
const CURTAIN = [[10.95, 54.1], [10.7, 53.4], [10.9, 52.9], [10.6, 52.3], [10.4, 51.6], [10.1, 51.0], [10.7, 50.4], [12.0, 50.3], [12.6, 50.3], [13.3, 49.9], [13.6, 49.3], [14.1, 48.9], [14.4, 48.6], [14.5, 48.2], [14.6, 47.7], [14.9, 47.3], [14.4, 46.8], [13.9, 46.5], [13.7, 45.7], [13.5, 45.0], [15.0, 43.5], [18.0, 42.0], [19.3, 41.2], [19.5, 39.8], [19.5, 14]]
// closed through the Baltic so that Denmark, Sweden and Finland fall on the western side
const BALTIC = [[29.0, 60.2], [25.5, 59.9], [23.0, 59.6], [21.0, 58.6], [20.0, 57.5], [19.5, 55.5], [14.5, 55.0], [12.9, 54.5]]
const SOVIET_SIDE = [[[...BALTIC, ...CURTAIN, [68, 14], [68, 84], [29.0, 84], BALTIC[0]]]]

const REICH_IDS = new Set([2696515, 2694638, 2693085, 2704712, 2704711, 2704710, 2704709, 2704716, 2704715, 2704714, 2704713, 2704717, 2692712])
const PROTECTORATE = asMulti(geometry[2704750])
const USSR_1941 = asMulti(geometry[2848812])
// Crimea was German from November 1941 (Sevastopol from July 1942) until April and May 1944; the raster source
// misses its south coast, so the peninsula is added outright for those months
const CRIMEA = pc.intersection(USSR_1941, [[[[32.3, 44.3], [36.7, 44.3], [36.7, 46.2], [32.3, 46.2], [32.3, 44.3]]]])

// ── Faction map: ohm_id -> rules [{control, from?}] ──
const factions = {}
{
  let cur
  for (const line of readFileSync(join(raw, 'faction-map.yaml'), 'utf8').split('\n')) {
    const single = /^\s{2}(\d+):\s*(\w+)?\s*(#.*)?$/.exec(line)
    const rule = /^\s{4}- \{ control: (\w+)(?:, from: ([\d-]+))? \}/.exec(line)
    if (single) { cur = single[1]; factions[cur] = single[2] ? [{ control: single[2] }] : [] } else if (rule && cur) factions[cur].push({ control: rule[1], from: rule[2] })
  }
}
const controlAt = (id, date) => {
  let c
  for (const r of factions[id] ?? []) if (!r.from || r.from <= date) c = r.control
  return c
}
// Corrections to the source: polities whose OHM start date precedes their real establishment
const NOT_BEFORE = { 2692529: '1941-07-17' /* Reichskommissariat Ostland */, 2693267: '1941-09-01' /* Reichskommissariat Ukraine */ }
// Polities missing from the OHM frames for part of their life: keep the last known boundary up to the given date
const EXTEND = {
  2692359: '1945-04-30', // Kingdom of Hungary: no OHM relation after 1943
  2692713: '1944-06-30', // Independent State of Croatia: gap between the 1943 and 1944 relations
  2695479: '1944-12-31', // Montenegro: Italian governorate ends in the data in 1943; German occupation until December 1944
  2695459: '1943-12-31', // Albania: Italian protectorate ends in the data in 1943; German occupation relation starts 1944
  // Italy after the armistice: the data holds only the Allied-run south and, from October, the Social Republic, leaving the
  // German operational zones (South Tyrol, Trieste, Ljubljana, Dalmatia) to nobody. The pre-armistice Italy is kept as the
  // occupied base and the Italian front line cuts the liberated south away month by month.
  2747832: '1945-04-30',
  2803189: '1943-01-31', // Italian Libya: the relation ends in 1942 in the data; the colony was lost piece by piece to January 1943
}
// Italy changed sides in September 1943 but the whole country stayed in German hands until the Allies fought their way
// up it, so from the armistice the Italian polities count as occupied; the Italian front line then cuts the south away.
const ITALY_IDS = new Set([2696324, 2747829, 2747832, 2794960, 2956707, 2956734])
const isItaly = (p) => ITALY_IDS.has(p.ohm_id) || /^Ital(y|ia)$/.test(p.name_en || p.name)
// Liechtenstein is marked Axis in the source; it was neutral
const NEUTRAL_OVERRIDE = new Set([2692807])
// Faction corrections: Tunisia was an Axis bridgehead from the Torch landings until May 1943
const FACTION_OVERRIDE = { 2690947: [{ control: 'allied' }, { control: 'axis_occupied', from: '1942-11-10' }, { control: 'allied', from: '1943-05-13' }] }
const overrideAt = (id, date) => { let c; for (const r of FACTION_OVERRIDE[id] ?? []) if (!r.from || r.from <= date) c = r.control; return c }

const keyframes = readdirSync(join(raw, 'frames')).map((f) => f.replace('.json', '')).sort()
const frameCache = {}
const polities = (date) => {
  const k = keyframes.filter((d) => d <= date).pop()
  return (frameCache[k] ??= read(`frames/${k}.json`).polities)
}

// ── Eastern military zone from the raster control layer ──
const rasterEast = (month) => {
  const polys = read(`data_territory_control_${month}.json`).features
    .filter((f) => f.properties.control === 'axis_occupied' || f.properties.control === 'axis')
    .map((f) => asMulti(f.geometry))
  return pc.intersection(union(polys), USSR_1941)
}

// ── Front lines for 1943–45 ──
// Month-end positions written for this site (scripts/frontlines.mjs); a few lines reuse ww2-atlas's (CC BY 4.0).
// The area beyond a front line, to subtract from the German-held area. Eastern lines close eastward along the
// latitude of their last point, so that the Balkans are not cut away until their own dates.
const eastOf = (line) => { const f = line[0], l = line[line.length - 1]; return [[[...line, [60, l[1]], [60, 61], [f[0], 61], f]]] }
// From the Franco-Swiss border down the Alps to Nice, so northern Italy is not cut away with France
const alps = [[6.5, 46.0], [7.0, 44.0], [7.5, 43.6]]
const westOf = (line) => {
  const f = line[0], l = line[line.length - 1]
  // close down the Alps when the line ends at the Swiss border or in the German south; otherwise straight out to sea
  const close = l[1] > 46 ? (l[0] > 9 ? [[10.5, 46.8], [7.0, 46.0], [7.0, 44.0], [7.5, 43.6]] : alps) : []
  return [[[...line, ...close, [-20, 30], [-20, f[1]], f]]]
}
const ADRIATIC = [[13.2, 44.5], [14.0, 42.8], [16.2, 42.2], [17.5, 41.5], [18.9, 40.9], [19.15, 40.0], [19.15, 30], [5, 30]]
const southOf = (line) => { const f = line[0], l = line[line.length - 1]; return [[[...line, ...ADRIATIC.filter((p) => p[1] < l[1] || p[1] <= 30), [5, f[1]], f]]] }
const box = (w, s, e, n) => [[[[w, s], [e, s], [e, n], [w, n], [w, s]]]]
// The latest line on each front defines it (so ground retaken by the Germans, as at Kharkov in March 1943, comes
// back); regions, once lost, stay lost.
// The hand-drawn lines are straight between towns. Rounding the corners (Chaikin's algorithm) and adding a little
// deterministic jitter gives them the irregular look of a real front without changing where they run.
const hash = (str) => { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) } return ((h >>> 0) % 10000) / 10000 - 0.5 }
const roughen = (line, key) => {
  const out = [line[0]]
  for (let i = 0; i < line.length - 1; i++) {
    const [x1, y1] = line[i], [x2, y2] = line[i + 1]
    const len = Math.hypot(x2 - x1, y2 - y1)
    const steps = Math.max(1, Math.round(len / 0.6))
    for (let k = 1; k <= steps; k++) {
      const t = k / steps
      const nx = -(y2 - y1) / len, ny = (x2 - x1) / len // unit normal
      const j = k < steps ? hash(key + i + ':' + k) * 0.18 : 0
      out.push([x1 + (x2 - x1) * t + nx * j, y1 + (y2 - y1) * t + ny * j])
    }
  }
  return out
}
const chaikin = (line, iterations = 2) => {
  let pts = line
  for (let n = 0; n < iterations; n++) {
    const next = [pts[0]]
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]
      next.push([x1 * 0.75 + x2 * 0.25, y1 * 0.75 + y2 * 0.25], [x1 * 0.25 + x2 * 0.75, y1 * 0.25 + y2 * 0.75])
    }
    next.push(pts[pts.length - 1])
    pts = next
  }
  return pts
}
const natural = (line, key) => chaikin(roughen(line, key)).map(([x, y]) => [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000])
const latestKey = (set, month) => Object.keys(set).filter((d) => d <= month).sort().pop()
const latest = (set, month) => { const k = latestKey(set, month); return k && set[k] }
const cutsFor = (month) => [
  // jitter is keyed to the line, not the month, so a front that has not moved does not wobble
  ...(latest(east, month) ? [eastOf(natural(latest(east, month), 'e' + latestKey(east, month)))] : []),
  ...(latest(west, month) ? [westOf(natural(latest(west, month), 'w' + latestKey(west, month)))] : []),
  ...(latest(italy, month) ? [southOf(natural(latest(italy, month), 'i' + latestKey(italy, month)))] : []),
  ...Object.keys(regions).filter((d) => d <= month).flatMap((d) => regions[d]).map((r) => (r[0] === 'box' ? box(r[1], r[2], r[3], r[4]) : [[[...r[1], r[1][0]]]])),
]

// ── Simplify for the browser ──
function simplifyRing(pts, tol) {
  const d2 = (p, a, b) => {
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const t = dx || dy ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))) : 0
    return (p[0] - (a[0] + t * dx)) ** 2 + (p[1] - (a[1] + t * dy)) ** 2
  }
  const dp = (s) => {
    if (s.length < 3) return s
    let idx = 0, max = 0
    for (let i = 1; i < s.length - 1; i++) { const d = d2(s[i], s[0], s[s.length - 1]); if (d > max) { max = d; idx = i } }
    if (max <= tol * tol) return [s[0], s[s.length - 1]]
    return [...dp(s.slice(0, idx + 1)).slice(0, -1), ...dp(s.slice(idx))]
  }
  const out = pts.length < 4 ? pts : dp(pts)
  return out.length >= 4 ? out : pts
}
/** Drops islets and slivers smaller than minArea square degrees; the background layers do not need them */
const ringArea = (r) => Math.abs(r.reduce((a, [x, y], i) => { const [x2, y2] = r[(i + 1) % r.length]; return a + x * y2 - x2 * y }, 0)) / 2
const prune = (mp, minArea) => mp.filter((poly) => ringArea(poly[0]) >= minArea)
/** Background layers: a little coarser than the German area, and without islets */
const background = (mp) => (mp.length ? tidy(prune(mp, 0.02), 0.03) : [])
// Rounding can make neighbouring points identical; those duplicates are what trips the clipping library, so they are removed
const dedupe = (ring) => ring.filter((p, i) => i === 0 || p[0] !== ring[i - 1][0] || p[1] !== ring[i - 1][1])
const tidy = (mp, tol = 0.015) =>
  mp.map((poly) => poly.map((ring) => dedupe(simplifyRing(ring, tol).map(([x, y]) => [Number(x.toFixed(2)), Number(y.toFixed(2))]))).filter((ring) => ring.length >= 3))
    .filter((poly) => poly.length && poly[0].length >= 3)

// ── Frames ──
const lastDay = (y, m) => `${y}-${String(m).padStart(2, '0')}-${new Date(y, m, 0).getDate()}`
const frames = []
let eastBase // December 1942 eastern zone, for the 1943+ cuts
let fullExtent // the German-held area at its greatest extent, December 1942
for (let y = 1933; y <= 1945; y++) {
  for (let m = 1; m <= (y === 1945 ? 5 : 12); m++) {
    const month = `${y}-${String(m).padStart(2, '0')}`
    const date = lastDay(y, m)
    let reich = REICH.filter(([d]) => d <= date).pop()[1]
    const parts = [], alliedParts = [], neutralParts = []
    if (date >= '1939-03-16') parts.push(PROTECTORATE)
    if (date >= '1939-09-01') {
      for (const [id, until] of Object.entries(EXTEND)) if (date <= until && !polities(date).some((p) => p.ohm_id === Number(id)) && geometry[id]) parts.push(asMulti(geometry[id]))
      for (const p of polities(date)) {
        if (REICH_IDS.has(p.ohm_id) || !geometry[p.ohm_id]) continue
        if (NOT_BEFORE[p.ohm_id] && date < NOT_BEFORE[p.ohm_id]) continue
        let c = overrideAt(p.ohm_id, date) ?? controlAt(p.ohm_id, date)
        if (isItaly(p) && date >= '1943-09-08') c = 'axis_occupied'
        if (NEUTRAL_OVERRIDE.has(p.ohm_id)) c = 'neutral'
        // the Soviet Union under the pact with Germany is shown as neutral until the invasion
        if (c === 'axis' || c === 'axis_occupied') parts.push(asMulti(geometry[p.ohm_id]))
        else if (c === 'allied' || c === 'allied_occupied') alliedParts.push(asMulti(geometry[p.ohm_id]))
        else if (c === 'neutral' || c === 'su') neutralParts.push(asMulti(geometry[p.ohm_id]))
      }
    } else {
      // before the war: everything else in Europe is simply "not Germany"; show the later neutrals as neutral
      for (const p of polities('1939-08-31')) {
        if (REICH_IDS.has(p.ohm_id) || !geometry[p.ohm_id]) continue
        const c = controlAt(p.ohm_id, '1939-08-31')
        if (c === 'neutral' || c === 'su' || NEUTRAL_OVERRIDE.has(p.ohm_id)) neutralParts.push(asMulti(geometry[p.ohm_id]))
      }
    }
    if (month >= '1941-11' && month <= '1944-04') parts.push(CRIMEA)
    if (month >= '1941-07' && month <= '1942-12') { eastBase = rasterEast(month); parts.push(eastBase) }
    else if (month > '1942-12') parts.push(eastBase)
    let occupied = clip(union(parts))
    reich = clip(reich)
    // Occupied area is drawn under the Reich, so take the Reich out of it
    if (occupied.length && reich.length) occupied = pc.difference(occupied, reich)

    const approx = month >= '1943-01'
    if (month === '1942-12') fullExtent = union([reich, occupied])
    if (approx) {
      for (const c of cutsFor(month)) { reich = pc.difference(reich, c); occupied = pc.difference(occupied, c) }
    }
    // The Allies: their own states, plus every piece of the December 1942 German area that has since been retaken
    let allied = clip(union(alliedParts), REGION)
    if (approx) allied = union([allied, safeDifference(fullExtent, union([reich, occupied]), [])])
    let neutral = clip(union(neutralParts), REGION)
    // The German area wins where the sources overlap, so that blue and red meet along one line
    const german = union([reich, occupied])
    if (allied.length && german.length) allied = safeDifference(allied, german)
    if (neutral.length && german.length) neutral = safeDifference(neutral, german)
    if (neutral.length && allied.length) neutral = safeDifference(neutral, allied)
    let soviet = []
    if (month === '1945-05') {
      soviet = pc.intersection(allied, SOVIET_SIDE)
      allied = safeDifference(allied, SOVIET_SIDE, allied)
    }
    frames.push({ month, approx, reich: tidy(reich), occupied: tidy(occupied), allied: background(allied), neutral: background(neutral), soviet: background(soviet) })
    process.stdout.write('.')
  }
}
// Drop months identical to the one before; the map shows the latest frame at or before the chosen month
const key = (f) => JSON.stringify([f.reich, f.occupied, f.allied, f.neutral, f.soviet])
const dedup = frames.filter((f, i) => i === 0 || key(f) !== key(frames[i - 1]))
// One file per frame so the map can fetch them lazily; index.json lists them
const dir = join(here, '../public/data/fronts')
mkdirSync(dir, { recursive: true })
for (const f of readdirSync(dir)) rmSync(join(dir, f))
let total = 0
for (const f of dedup) {
  const s = JSON.stringify({ reich: f.reich, occupied: f.occupied, allied: f.allied, neutral: f.neutral, soviet: f.soviet })
  total += s.length
  writeFileSync(join(dir, `${f.month}.json`), s)
}
writeFileSync(join(dir, 'index.json'), JSON.stringify(dedup.map((f) => ({ month: f.month, approx: f.approx }))))
console.log(`\n${dedup.length} distinct frames of ${frames.length} months, ${Math.round(total / 1024)} kB in total; ${differenceFailures} overlap removals fell back`)

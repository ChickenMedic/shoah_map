import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { kindMeta, siteById, sites } from '../data/sites'
import { transports } from '../data/transports'
import { campColors, destinationColors } from '../data/campColors'
import { siteHistories } from '../data/siteHistories'
import { timeline } from '../data/timeline'
import subcampData from '../data/subcamps.json'
import routeData from '../data/routes.json'
import imageData from '../data/images.json'
import type { CommonsImage, RouteGeometry, Site, SiteKind, Subcamp, Transport } from '../data/types'
import { formatDate, monthIndex, monthLabel } from '../util'
import YearSlider from '../YearSlider'

/** Something that happened at a place and a month: a dated event from the timeline, or a camp opening or being liberated */
type EventKind = 'event' | 'war' | 'opened' | 'closed'
type MapEvent = { id: string; month: number; date: string; title: string; text: string; latLng: [number, number]; site?: Site; kind: EventKind; link?: string }

/** How a site's end is described: liberated where Allied troops reached it, otherwise by what the Germans did to it */
const endingOf = (s: Site) => {
  if (s.liberated) return 'liberated'
  if (s.kind === 'ghetto') return 'liquidated'
  if (s.kind === 'extermination') return 'dismantled'
  if (s.kind === 'euthanasia') return 'closed'
  return 'evacuated'
}

const mapEvents: MapEvent[] = [
  ...timeline.filter((e) => e.place).map((e) => ({
    id: `t-${e.date}-${e.title}`, month: monthIndex(e.date), date: e.date, title: e.title, text: e.text, latLng: e.place!, kind: (e.military ? 'war' : 'event') as EventKind, link: e.link,
  })),
  ...sites.flatMap((s): MapEvent[] => {
    const opened = { id: `o-${s.id}`, month: monthIndex(s.opened), date: s.opened, title: `${s.name} opens`, text: s.summary, latLng: [s.lat, s.lng] as [number, number], site: s, kind: 'opened' as const }
    const closed = { id: `c-${s.id}`, month: monthIndex(s.closed), date: s.closed, title: `${s.name} ${endingOf(s)}`, text: s.liberated ? `${s.liberated}. ${s.summary}` : s.summary, latLng: [s.lat, s.lng] as [number, number], site: s, kind: 'closed' as const }
    // A massacre site "opening" is the massacre itself
    return s.kind === 'massacre' ? [{ ...opened, title: s.name, kind: 'event' }] : [opened, closed]
  }),
]
const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)
/** The label for one or more events at a place */
const tipHtml = (events: MapEvent[]) =>
  events.map((e) => `<span class="event-tip__item event-tip__item--${e.kind}" data-event="${esc(e.id)}"><span class="event-tip__date">${formatDate(e.date)}</span>${esc(e.title)}</span>`).join('')

/** The handful of moments most people will want to find first, in date order */
const KEY_TITLES = ['Hitler appointed Chancellor', 'The November Pogrom (“Kristallnacht”)', 'The Wannsee Conference', 'D-Day', 'Auschwitz-Birkenau liberated']
const keyMoments = KEY_TITLES.map((t) => mapEvents.find((e) => e.title === t)).filter((e): e is MapEvent => !!e).sort((a, b) => a.month - b.month)

/** How many months a popup stays on the map after its event */
const EVENT_LINGER = 2
/** Playback: milliseconds per month */
const SPEEDS = { slow: 1400, normal: 700, fast: 250 }

const subcamps = subcampData as Subcamp[]
const routes = routeData as unknown as Record<string, RouteGeometry>
const images = imageData as { sites: Record<string, CommonsImage>; people: Record<string, CommonsImage> }
const kinds = Object.keys(kindMeta) as SiteKind[]
const START = monthIndex('1933-01')
const END = monthIndex('1945-05')
const REICH_COLOR = '#b5565c'
const OCCUPIED_COLOR = '#8c4a50'
const DATA = `${import.meta.env.BASE_URL}data/fronts/`

type Selection = { type: 'site'; site: Site } | { type: 'transport'; transport: Transport } | { type: 'subcamp'; subcamp: Subcamp } | { type: 'event'; event: MapEvent } | null
type FrameIndex = { month: string; approx: boolean }
type Frame = { reich: number[][][][]; occupied: number[][][][]; allied?: number[][][][]; neutral?: number[][][][]; soviet?: number[][][][] }
const SOVIET_COLOR = '#9b6fd6'
const ALLIED_COLOR = '#4f7fc4'
const NEUTRAL_COLOR = '#e8e2d4'
const EVENT_COLORS: Record<EventKind, string> = { event: '#c9a35a', war: '#8fa3b8', opened: '#e4b04a', closed: '#6aa5e0' }

const datesLabel: Record<NonNullable<Subcamp['dates']>, string> = {
  wikidata: 'Wikidata',
  wikipedia: 'German Wikipedia',
  register: 'the German federal register of camps',
}

const colorOf = (s: Site) => campColors[s.id] ?? kindMeta[s.kind].color
const toLatLngs = (mp: number[][][][]) => mp.map((poly) => poly.map((ring) => ring.map(([lng, lat]) => [lat, lng] as [number, number])))
const transportById = Object.fromEntries(transports.map((t) => [t.id, t]))
const subcampById = new Map(subcamps.map((c) => [c.id, c]))

export default function MapPage() {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  // Everything is created once and shown or hidden, so that playback does not rebuild the map every month
  const built = useRef<{
    main: Map<string, L.CircleMarker>
    sub: Map<string, L.CircleMarker>
    route: Map<string, L.Polyline[]>
    event: Map<string, L.CircleMarker>
    groups: { main: L.LayerGroup; sub: L.LayerGroup; route: L.LayerGroup; event: L.LayerGroup; leader: L.LayerGroup }
    reich: L.Polygon
    occupied: L.Polygon
    allied: L.Polygon
    neutral: L.Polygon
    soviet: L.Polygon
  } | null>(null)
  const frames = useRef(new Map<string, Frame>())
  const [frameIndex, setFrameIndex] = useState<FrameIndex[]>([])
  const [loadedFrames, setLoadedFrames] = useState(0)

  const [month, setMonth] = useState<number | null>(START) // null = all periods; the map opens in January 1933
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>('normal')
  const [on, setOn] = useState<Record<SiteKind, boolean>>(() => Object.fromEntries(kinds.map((k) => [k, true])) as Record<SiteKind, boolean>)
  const [showSub, setShowSub] = useState(true)
  const [showUndated, setShowUndated] = useState(false)
  const [showRoutes, setShowRoutes] = useState(true)
  const [showFront, setShowFront] = useState(true)
  const [showEvents, setShowEvents] = useState(true)
  const [sel, setSel] = useState<Selection>(null)
  const [panelOpen, setPanelOpen] = useState(true)

  const select = (s: Selection) => { setSel(s); setPanelOpen(true) }
  const selectRef = useRef(select)
  selectRef.current = select

  useEffect(() => {
    // The view is fenced to Europe, North Africa and the Near East, which is also the extent of the territory data
    const m = L.map(el.current!, {
      center: [51, 15], zoom: 5, minZoom: 5, maxZoom: 15, zoomControl: false, fadeAnimation: false, preferCanvas: true,
      maxBounds: [[24, -24], [74, 56]], maxBoundsViscosity: 1,
    })
    L.control.zoom({ position: 'bottomright' }).addTo(m)
    // a click on empty map returns the panel to the layer list
    m.on('click', () => selectRef.current(null))
    // Esri's dark canvas has English labels. Present-day borders and names.
    const esri = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_{layer}/MapServer/tile/{z}/{y}/{x}'
    const attribution = 'Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors · present-day borders'
    L.tileLayer(esri.replace('{layer}', 'Base'), { attribution, maxNativeZoom: 16 }).addTo(m)
    L.tileLayer(esri.replace('{layer}', 'Reference'), { maxNativeZoom: 16, pane: 'shadowPane' }).addTo(m)

    // background layers have no outline: the German area's edge is the only line that matters
    // Territory is drawn with the SVG renderer: the canvas renderer sometimes skipped redraws of these large polygons
    const svg = L.svg({ padding: 0.5 })
    const neutral = L.polygon([], { renderer: svg, stroke: false, fillColor: NEUTRAL_COLOR, fillOpacity: 0.14, interactive: false }).addTo(m)
    const allied = L.polygon([], { renderer: svg, stroke: false, fillColor: ALLIED_COLOR, fillOpacity: 0.24, interactive: false }).addTo(m)
    const soviet = L.polygon([], { renderer: svg, stroke: false, fillColor: SOVIET_COLOR, fillOpacity: 0.26, interactive: false }).addTo(m)
    const occupied = L.polygon([], { renderer: svg, stroke: false, fillColor: OCCUPIED_COLOR, fillOpacity: 0.22, interactive: false }).addTo(m)
    const reich = L.polygon([], { renderer: svg, color: REICH_COLOR, weight: 1.4, opacity: 1, fillColor: REICH_COLOR, fillOpacity: 0.3, interactive: false }).addTo(m)
    const groups = { sub: L.layerGroup().addTo(m), route: L.layerGroup().addTo(m), main: L.layerGroup().addTo(m), leader: L.layerGroup().addTo(m), event: L.layerGroup().addTo(m) }

    // Dated events and camp openings: a small marker whose label stays open while the event is current
    const event = new Map<string, L.CircleMarker>()
    for (const e of mapEvents) {
      const isSite = e.kind === 'opened' || e.kind === 'closed'
      const marker = L.circleMarker(e.latLng, { radius: isSite ? 0.1 : e.kind === 'war' ? 5 : 4, color: EVENT_COLORS[e.kind], weight: 1.5, fillColor: '#0e0d0c', fillOpacity: 1, opacity: isSite ? 0 : 1 })
        .bindTooltip(tipHtml([e]), { permanent: true, direction: 'top', offset: [0, -8], className: `event-tip event-tip--${e.kind}`, interactive: true })
        .on('click', () => selectRef.current({ type: 'event', event: e }))
      // the label may list several events (see placeLabels); each line opens its own record
      marker.on('tooltipopen', (ev) => ev.tooltip.getElement()?.addEventListener('click', (click) => {
        const id = (click.target as HTMLElement).closest<HTMLElement>('[data-event]')?.dataset.event
        const ev2 = mapEvents.find((x) => x.id === id) ?? e
        selectRef.current({ type: 'event', event: ev2 })
      }))
      event.set(e.id, marker)
    }

    const sub = new Map<string, L.CircleMarker>()
    for (const c of subcamps) {
      if (c.lat === undefined) continue
      const color = campColors[c.parent] ?? kindMeta.concentration.color
      const undated = !c.opened
      sub.set(c.id, L.circleMarker([c.lat, c.lng!], {
        radius: 2.6, stroke: undated, color, weight: 1, opacity: 0.55, fill: !undated, fillColor: color, fillOpacity: 0.7,
      }).on('click', () => selectRef.current({ type: 'subcamp', subcamp: c })).bindTooltip(c.name, { direction: 'top', offset: [0, -4] }))
    }
    const main = new Map<string, L.CircleMarker>()
    for (const s of sites) {
      main.set(s.id, L.circleMarker([s.lat, s.lng], {
        radius: s.kind === 'extermination' ? 8 : 6, color: '#0e0d0c', weight: 1.5, fillColor: colorOf(s), fillOpacity: 1,
      }).on('click', () => selectRef.current({ type: 'site', site: s })).bindTooltip(s.name, { direction: 'top', offset: [0, -6] }))
    }
    // Routes take the colour of their destination; a route that fed two camps alternates both colours
    const route = new Map<string, L.Polyline[]>()
    for (const t of transports) {
      const geom = routes[t.id]
      const points = geom ? geom.points : [t.fromLatLng, t.toLatLng]
      const colors = t.toIds.map((id) => destinationColors[id] ?? '#e8e2d4')
      const base = { renderer: svg, weight: 2, opacity: 0.85 }
      const parts: L.Polyline[] = []
      if (colors.length === 1) {
        parts.push(L.polyline(points, { ...base, className: 'route', color: colors[0], dashArray: '14 6' }))
      } else {
        parts.push(L.polyline(points, { ...base, className: 'route', color: colors[0], dashArray: '10 10' }))
        parts.push(L.polyline(points, { ...base, className: 'route route--alt', color: colors[1], dashArray: '10 10', dashOffset: '10' }))
      }
      if (t.sea) parts.push(L.polyline(t.seaPath ?? [t.fromLatLng, t.sea], { ...base, className: 'route route--sea', color: colors[0], opacity: 0.5, dashArray: '2 6' }))
      for (const p of parts) {
        p.on('click', () => selectRef.current({ type: 'transport', transport: t })).bindTooltip(`${t.from} → ${t.to}`, { sticky: true })
      }
      route.set(t.id, parts)
    }
    built.current = { main, sub, route, event, groups, reich, occupied, allied, neutral, soviet }
    map.current = m
    if (import.meta.env.DEV) (window as unknown as { __map: L.Map }).__map = m

    fetch(`${DATA}index.json`).then((r) => r.json()).then(setFrameIndex).catch(() => setFrameIndex([]))
    return () => { m.remove(); map.current = null; built.current = null }
  }, [])

  // Fetch the frames in the background so playback does not stall
  useEffect(() => {
    if (!frameIndex.length) return
    let cancelled = false
    ;(async () => {
      for (const f of frameIndex) {
        if (cancelled) return
        if (frames.current.has(f.month)) continue
        try {
          const frame: Frame = await (await fetch(`${DATA}${f.month}.json`)).json()
          frames.current.set(f.month, frame)
          setLoadedFrames((n) => n + 1)
        } catch { /* a missing frame just means the previous one stays on screen */ }
      }
    })()
    return () => { cancelled = true }
  }, [frameIndex])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setMonth((cur) => {
        const next = (cur ?? START) + 1
        if (next >= END) setPlaying(false)
        return Math.min(next, END)
      })
    }, SPEEDS[speed])
    return () => clearInterval(id)
  }, [playing, speed])

  // Events close together on screen share one label listing them all, so that nothing floats away from its place.
  // Redone whenever the visible set or the map view changes.
  const placeLabels = () => {
    const b = built.current, m = map.current
    if (!b || !m) return
    const byId = new Map(mapEvents.map((e) => [e.id, e]))
    const visible = [...b.event.entries()].filter(([, mk]) => b.groups.event.hasLayer(mk))
      .map(([id, mk]) => ({ id, mk, e: byId.get(id)!, p: m.latLngToContainerPoint(mk.getLatLng()) }))
      .sort((a, c) => a.p.y - c.p.y || a.p.x - c.p.x)
    // Events within a short distance share one label; labels that would still collide are pushed sideways, not
    // merged, so a label always sits beside the places it describes.
    const RADIUS = 60
    const groups: typeof visible[] = []
    for (const v of visible) {
      const g = groups.find((grp) => grp.some((o) => Math.hypot(o.p.x - v.p.x, o.p.y - v.p.y) < RADIUS))
      if (g) g.push(v); else groups.push([v])
    }
    const centre = (g: typeof visible) => ({ x: g.reduce((s, v) => s + v.p.x, 0) / g.length, y: g.reduce((s, v) => s + v.p.y, 0) / g.length })
    const placed: { x: number; y: number; w: number; h: number }[] = []
    b.groups.leader.clearLayers()
    const collides = (bx: { x: number; y: number; w: number; h: number }) => placed.some((o) => bx.x < o.x + o.w + 4 && bx.x + bx.w + 4 > o.x && bx.y < o.y + o.h + 4 && bx.y + bx.h + 4 > o.y)
    for (const g of groups.sort((p, q) => centre(p).y - centre(q).y)) {
      const c = centre(g)
      const head = g.reduce((best, v) => (Math.hypot(v.p.x - c.x, v.p.y - c.y) < Math.hypot(best.p.x - c.x, best.p.y - c.y) ? v : best), g[0])
      for (const r of g) if (r !== head) r.mk.closeTooltip()
      const tip = head.mk.getTooltip()
      if (!tip) continue
      tip.setContent(tipHtml(g.map((v) => v.e).sort((p, q) => p.date.localeCompare(q.date))))
      if (!head.mk.isTooltipOpen()) head.mk.openTooltip()
      const el = tip.getElement()
      const w = el?.offsetWidth || 200, h = el?.offsetHeight || 30 + 34 * g.length
      // candidate positions, nearest first: above, beside, below, then further out; failing all, the least overlap
      const s = w / 2 + 14
      const tries: [number, number][] = [
        [0, -8], [s, h / 2 - 8], [-s, h / 2 - 8], [0, h + 16], [0, -8 - h - 6],
        [s, -8 - h / 2], [-s, -8 - h / 2], [s, h + 8], [-s, h + 8], [2 * s, h / 2 - 8], [-2 * s, h / 2 - 8], [0, -8 - 2 * (h + 6)],
      ]
      const overlap = (bx: { x: number; y: number; w: number; h: number }) => placed.reduce((sum, o) => sum + Math.max(0, Math.min(bx.x + bx.w, o.x + o.w) - Math.max(bx.x, o.x)) * Math.max(0, Math.min(bx.y + bx.h, o.y + o.h) - Math.max(bx.y, o.y)), 0)
      let chosen = tries[0], best = Infinity
      for (const t of tries) {
        const bx = { x: head.p.x + t[0] - w / 2, y: head.p.y + t[1] - h, w, h }
        if (!collides(bx)) { chosen = t; break }
        const ov = overlap(bx)
        if (ov < best) { best = ov; chosen = t }
      }
      placed.push({ x: head.p.x + chosen[0] - w / 2, y: head.p.y + chosen[1] - h, w, h })
      tip.options.offset = L.point(chosen[0], chosen[1])
      tip.update()
      // a label pushed away from its place gets a thin line back to it
      if (chosen !== tries[0]) {
        const anchor = m.containerPointToLatLng(L.point(head.p.x + chosen[0], head.p.y + chosen[1]))
        L.polyline([head.mk.getLatLng(), anchor], { color: '#c9a35a', weight: 1, opacity: 0.7, dashArray: '3 4', interactive: false }).addTo(b.groups.leader)
      }
    }
  }
  const placeRef = useRef(placeLabels)
  placeRef.current = placeLabels
  useEffect(() => {
    const m = map.current
    if (!m) return
    const h = () => placeRef.current()
    m.on('zoomend moveend', h)
    return () => { m.off('zoomend moveend', h) }
  }, [])

  const within = (a: string, b: string) => month === null || (monthIndex(a) <= month && month <= monthIndex(b))
  const subVisible = (c: Subcamp) => {
    if (c.lat === undefined || !showSub) return false
    const parent = siteById[c.parent]
    if (!on[parent.kind]) return false
    if (month === null) return true
    if (c.opened) return within(c.opened, c.closed ?? parent.closed)
    // No opening date on record: only shown on request, for the parent camp's whole period
    return showUndated && within(parent.opened, parent.closed)
  }

  const frameFor = useMemo(() => {
    if (!showFront || month === null) return undefined
    let f: FrameIndex | undefined
    for (const x of frameIndex) if (monthIndex(x.month) <= month) f = x
    return f
  }, [frameIndex, month, showFront])

  // Show and hide what the current month calls for
  useEffect(() => {
    const b = built.current
    if (!b) return
    const sync = <T extends L.Layer>(group: L.LayerGroup, layers: Iterable<[string, T | T[]]>, want: (id: string) => boolean) => {
      for (const [id, layer] of layers) {
        const list = Array.isArray(layer) ? layer : [layer]
        const show = want(id)
        for (const l of list) {
          if (show && !group.hasLayer(l)) group.addLayer(l)
          else if (!show && group.hasLayer(l)) group.removeLayer(l)
        }
      }
    }
    sync(b.groups.main, b.main, (id) => { const s = siteById[id]; return on[s.kind] && within(s.opened, s.closed) })
    sync(b.groups.sub, b.sub, (id) => subVisible(subcampById.get(id)!))
    // The railways existed throughout: every route stays on the map, faint, and lights up while its trains ran
    sync(b.groups.route, b.route, () => showRoutes)
    for (const [id, lines] of b.route) {
      const t = transportById[id]
      const active = within(t.start, t.end)
      // a line is just railway, in white, until its first deportation; it keeps the camp's colour afterwards
      const before = month !== null && month < monthIndex(t.start)
      const after = month !== null && month > monthIndex(t.end)
      for (const l of lines) {
        const path = (l as unknown as { _path?: SVGElement })._path
        path?.classList.toggle('route--moving', month !== null && active)
        path?.classList.toggle('route--before', before)
        path?.classList.toggle('route--after', after)
      }
    }
    // Events show for a couple of months after they happen; camp openings only for sites whose layer is on
    const eventById = new Map(mapEvents.map((e) => [e.id, e]))
    sync(b.groups.event, b.event, (id) => {
      const e = eventById.get(id)!
      if (!showEvents || month === null || e.month > month || e.month < month - EVENT_LINGER) return false
      return !e.site || on[e.site.kind]
    })
    placeRef.current()
    // Pick the latest loaded frame at or before the month, so a frame still downloading does not blank the layer
    let frame: Frame | undefined
    if (frameFor) for (const x of frameIndex) { if (monthIndex(x.month) <= month! && frames.current.has(x.month)) frame = frames.current.get(x.month) }
    b.reich.setLatLngs(frame ? toLatLngs(frame.reich) : [])
    b.occupied.setLatLngs(frame ? toLatLngs(frame.occupied) : [])
    b.allied.setLatLngs(frame?.allied ? toLatLngs(frame.allied) : [])
    b.neutral.setLatLngs(frame?.neutral ? toLatLngs(frame.neutral) : [])
    b.soviet.setLatLngs(frame?.soviet ? toLatLngs(frame.soviet) : [])
  }, [month, on, showSub, showUndated, showRoutes, showEvents, frameFor, loadedFrames]) // eslint-disable-line react-hooks/exhaustive-deps

  // Months in which something happens, for stepping through the story event by event
  const eventMonths = useMemo(() => [...new Set(mapEvents.filter((e) => (!e.site || on[e.site.kind]) && e.month >= START && e.month <= END).map((e) => e.month))].sort((a, b) => a - b), [on])
  const stepEvent = (cur: number | null, dir: 1 | -1) => {
    if (cur === null) return dir > 0 ? eventMonths[0] : eventMonths[eventMonths.length - 1]
    const next = dir > 0 ? eventMonths.find((m) => m > cur) : [...eventMonths].reverse().find((m) => m < cur)
    return next ?? cur
  }
  const selSubs = sel?.type === 'site' ? subcamps.filter((c) => c.parent === sel.site.id).sort((a, b) => (a.opened ?? '9').localeCompare(b.opened ?? '9') || a.name.localeCompare(b.name)) : []
  const datedCount = subcamps.filter((c) => c.opened && c.lat !== undefined).length
  const undatedCount = subcamps.filter((c) => !c.opened && c.lat !== undefined).length
  const campsWithSubs = sites.filter((s) => campColors[s.id])

  return (
    <div className="map-page">
      <div ref={el} className="map" />

      <details className="key-moments" open>
        <summary>Key moments</summary>
        <ol>
          {keyMoments.map((e) => {
            const reached = month === null || e.month <= month
            const latest = month !== null && reached && keyMoments.filter((k) => k.month <= month).pop() === e
            return (
              <li key={e.id} className={`${reached ? 'is-reached' : 'is-ahead'}${latest ? ' is-latest' : ''}`}>
                <button onClick={() => { setPlaying(false); setMonth(e.month); select({ type: 'event', event: e }) }}>
                  <span className="key-moments__date" style={{ color: reached ? EVENT_COLORS[e.kind] : undefined }}>{reached ? formatDate(e.date) : e.date.slice(0, 4)}</span>
                  {reached ? e.title : '…'}
                </button>
              </li>
            )
          })}
        </ol>
      </details>

      <aside className={panelOpen ? 'map-panel' : 'map-panel is-closed'}>
        <button className="map-panel__toggle" onClick={() => setPanelOpen(!panelOpen)} aria-expanded={panelOpen}>
          {panelOpen ? 'Hide panel' : 'Show panel'}
        </button>
        {panelOpen && (sel ? (
          <div className="map-detail">
            <button className="back" onClick={() => setSel(null)}>← Layers</button>
            {sel.type === 'site' && <SiteDetail site={sel.site} subs={selSubs} onSub={(c) => { select({ type: 'subcamp', subcamp: c }); map.current?.flyTo([c.lat!, c.lng!], 10) }} />}
            {sel.type === 'subcamp' && (
              <>
                <p className="kind" style={{ color: campColors[sel.subcamp.parent] }}>Subcamp of {siteById[sel.subcamp.parent].name}</p>
                <h2>{sel.subcamp.name}</h2>
                <dl>
                  <dt>In operation</dt>
                  <dd>
                    {sel.subcamp.opened || sel.subcamp.closed
                      ? `${sel.subcamp.opened ? formatDate(sel.subcamp.opened) : 'unknown'} to ${sel.subcamp.closed ? formatDate(sel.subcamp.closed) : 'unknown'}`
                      : 'Dates not on record'}
                  </dd>
                  {sel.subcamp.dates && <><dt>Dates from</dt><dd>{datesLabel[sel.subcamp.dates]}{sel.subcamp.register ? ` (register no. ${sel.subcamp.register})` : ''}</dd></>}
                  {sel.subcamp.country && <><dt>Country</dt><dd>{sel.subcamp.country}</dd></>}
                </dl>
                <p className="note">
                  Subcamp data is compiled automatically from Wikidata, German Wikipedia and the German federal register of camps, and has not been
                  individually verified.{' '}
                  {sel.subcamp.wiki && <a href={sel.subcamp.wiki} target="_blank" rel="noreferrer">Wikipedia article</a>}
                </p>
                <button className="back" onClick={() => select({ type: 'site', site: siteById[sel.subcamp.parent] })}>
                  About {siteById[sel.subcamp.parent].name} →
                </button>
              </>
            )}
            {sel.type === 'transport' && (
              <>
                <p className="kind">Deportation route</p>
                <h2>{sel.transport.from} → {sel.transport.to}</h2>
                <dl>
                  <dt>Period</dt><dd>{sel.transport.period}</dd>
                  <dt>People deported</dt><dd>{sel.transport.people}</dd>
                  {routes[sel.transport.id] && <><dt>Rail distance</dt><dd>About {routes[sel.transport.id].km.toLocaleString()} km</dd></>}
                </dl>
                <p>{sel.transport.note}</p>
                <p className="note">
                  Coloured by destination: {sel.transport.toIds.map((id, i) => <span key={id}><b style={{ color: destinationColors[id] }}>{siteById[id].name}</b>{i < sel.transport.toIds.length - 1 ? ' and ' : ''}</span>)}.
                  The line follows the railway network as it exists today, routed through documented intermediate stations where known.
                  Wartime routings varied from train to train.
                </p>
                {sel.transport.toIds.map((id) => (
                  <button key={id} className="back" onClick={() => select({ type: 'site', site: siteById[id] })}>About {siteById[id].name} →</button>
                ))}
              </>
            )}
            {sel.type === 'event' && (
              <>
                <p className="kind">{formatDate(sel.event.date)}</p>
                <h2>{sel.event.title}</h2>
                <p>{sel.event.text}</p>
                {sel.event.site && (
                  <button className="back" onClick={() => select({ type: 'site', site: sel.event.site! })}>About {sel.event.site.name} →</button>
                )}
                {sel.event.link && (
                  <p><a className="button" href={sel.event.link} target="_blank" rel="noreferrer">Read more</a></p>
                )}
                {!sel.event.site && <p className="note">The full sequence of events is on the Timeline page.</p>}
              </>
            )}
          </div>
        ) : (
          <div className="map-layers">
            <h1>Map of the camps</h1>
            <p className="note">Select a site, a route or an event for its history. Press play or step with the arrows to watch the system grow.</p>

            <details className="opt" open>
              <summary>
                <input type="checkbox" checked={kinds.every((k) => on[k])} ref={(el) => { if (el) el.indeterminate = kinds.some((k) => on[k]) && !kinds.every((k) => on[k]) }}
                  onClick={(e) => e.stopPropagation()} onChange={() => { const all = kinds.every((k) => on[k]); setOn(Object.fromEntries(kinds.map((k) => [k, !all])) as Record<SiteKind, boolean>) }} />
                <i className="dot-all" />
                <span>Camps and killing sites</span>
              </summary>
              <div className="opt__body">
                {kinds.map((k) => (
                  <label key={k} className="layer">
                    <input type="checkbox" checked={on[k]} onChange={() => setOn({ ...on, [k]: !on[k] })} />
                    <i style={{ background: kindMeta[k].color }} />
                    <span>{kindMeta[k].plural}<small>{kindMeta[k].blurb}</small></span>
                  </label>
                ))}
              </div>
            </details>

            <details className="opt">
              <summary>
                <input type="checkbox" checked={showSub} onClick={(e) => e.stopPropagation()} onChange={() => setShowSub(!showSub)} disabled={!on.concentration} />
                <i className="dot-small" style={{ background: kindMeta.concentration.color }} />
                <span>Subcamps</span>
              </summary>
              <div className="opt__body">
                <p className="note">{datedCount.toLocaleString()} satellite camps, each in the colour of its main camp, appearing in the month they opened.</p>
                <label className="layer">
                  <input type="checkbox" checked={showUndated} onChange={() => setShowUndated(!showUndated)} disabled={!showSub || !on.concentration} />
                  <i className="dot-small dot-hollow" />
                  <span>Include those without a known opening date<small>{undatedCount} more, shown hollow for their main camp’s whole period.</small></span>
                </label>
                <ul className="camp-legend">
                  {campsWithSubs.map((s) => (
                    <li key={s.id}><i style={{ background: campColors[s.id] }} /><button className="linkish" onClick={() => select({ type: 'site', site: s })}>{s.name}</button></li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="opt">
              <summary>
                <input type="checkbox" checked={showRoutes} onClick={(e) => e.stopPropagation()} onChange={() => setShowRoutes(!showRoutes)} />
                <i className="line" />
                <span>Deportation routes</span>
              </summary>
              <div className="opt__body">
                <p className="note">{transports.length} major rail deportations along the railway lines, in the colour of the camp they fed. A two-colour dash means the trains went to more than one camp. Routes light up and move while their trains were running; the rest stay faint.</p>
              </div>
            </details>

            <details className="opt">
              <summary>
                <input type="checkbox" checked={showEvents} onClick={(e) => e.stopPropagation()} onChange={() => setShowEvents(!showEvents)} />
                <i className="dot-event" />
                <span>Events</span>
              </summary>
              <div className="opt__body">
                <p className="note">
                  <b style={{ color: EVENT_COLORS.opened }}>Camps opening</b>, <b style={{ color: EVENT_COLORS.closed }}>camps liberated or closed</b>,{' '}
                  <b style={{ color: EVENT_COLORS.event }}>the laws, speeches and decisions</b> that led from persecution to murder, and{' '}
                  <b style={{ color: EVENT_COLORS.war }}>the campaigns of the war</b>. Shown with the time slider; the arrows step from one to the next.
                </p>
              </div>
            </details>

            <details className="opt">
              <summary>
                <input type="checkbox" checked={showFront} onClick={(e) => e.stopPropagation()} onChange={() => setShowFront(!showFront)} />
                <i className="area" />
                <span>Who held Europe</span>
              </summary>
              <div className="opt__body">
                <p className="note">
                  <b style={{ color: REICH_COLOR }}>The Reich</b>, growing with the Saar, Austria, the Sudetenland and annexed Poland;{' '}
                  <b style={{ color: '#c9888d' }}>German-occupied and allied states</b>; <b style={{ color: ALLIED_COLOR }}>the Allies</b>, including ground retaken from
                  Germany; <b>neutral countries</b> in white. In May 1945 the Allied area divides into the Western Allies and <b style={{ color: SOVIET_COLOR }}>the Soviet Union</b> along the line that became the Iron Curtain. Shown with the time slider. Borders from historical map data; the fronts from 1943 are drawn month by
                  month through the documented positions of the armies.
                </p>
              </div>
            </details>
          </div>
        ))}
      </aside>

      <div className="map-time">
        <button onClick={() => { if (month === null || month >= END) setMonth(START); setPlaying(!playing) }} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <div className="map-time__step" role="group" aria-label="Step between events">
          <button onClick={() => { setPlaying(false); setMonth(stepEvent(month, -1)) }} aria-label="Previous events" disabled={month !== null && month <= eventMonths[0]}>◀</button>
          <button onClick={() => { setPlaying(false); setMonth(stepEvent(month, 1)) }} aria-label="Next events" disabled={month !== null && month >= eventMonths[eventMonths.length - 1]}>▶</button>
        </div>
        <div className="map-time__slider">
          <output>{month === null ? 'All periods, 1933–1945' : monthLabel(month)}</output>
          <YearSlider
            min={START} max={END} value={month} onChange={(v) => { setPlaying(false); setMonth(v) }}
            ticks={[1933, 1935, 1937, 1939, 1941, 1943, 1945].map((y) => ({ value: monthIndex(`${y}-01`), label: String(y) }))}
            format={monthLabel} ariaLabel="Month"
          />
        </div>
        <select className="map-time__speed" value={speed} onChange={(e) => setSpeed(e.target.value as keyof typeof SPEEDS)} aria-label="Playback speed">
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </select>
        <button onClick={() => { setPlaying(false); setMonth(null) }} disabled={month === null}>Show all</button>
      </div>
    </div>
  )
}

function SiteDetail({ site, subs, onSub }: { site: Site; subs: Subcamp[]; onSub: (c: Subcamp) => void }) {
  const img = images.sites[site.id]
  const byYear = new Map<string, Subcamp[]>()
  for (const c of subs) {
    const k = c.opened ? c.opened.slice(0, 4) : 'Date unknown'
    byYear.set(k, [...(byYear.get(k) ?? []), c])
  }
  return (
    <>
      <p className="kind" style={{ color: colorOf(site) }}>{kindMeta[site.kind].label}</p>
      <h2>{site.name}</h2>
      {img && (
        <figure className="detail-figure">
          <img src={img.url} alt={img.description ?? site.name} loading="lazy" />
          <figcaption><a href={img.page} target="_blank" rel="noreferrer">Photograph source</a></figcaption>
        </figure>
      )}
      <dl>
        <dt>In operation</dt><dd>{site.period}</dd>
        <dt>Present-day country</dt><dd>{site.country}</dd>
        {site.deaths && <><dt>Estimated deaths</dt><dd>{site.deaths}</dd></>}
        {site.liberated && <><dt>Liberated</dt><dd>{site.liberated}</dd></>}
      </dl>
      {(siteHistories[site.id] ?? [site.summary]).map((p, i) => <p key={i}>{p}</p>)}
      {subs.length > 0 && (
        <details className="sublist-wrap">
          <summary>{subs.length} subcamps on record, by year opened</summary>
          {[...byYear.entries()].map(([year, list]) => (
            <div key={year}>
              <h4>{year} <span>{list.length}</span></h4>
              <ul className="sublist">
                {list.map((c) => (
                  <li key={c.id}>{c.lat !== undefined ? <button onClick={() => onSub(c)}>{c.name}</button> : c.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </details>
      )}
    </>
  )
}

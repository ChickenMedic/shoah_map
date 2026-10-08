import { useEffect, useMemo, useRef, useState } from 'react'
import { perpetratorGroups, perpetrators } from '../data/perpetrators'
import imageData from '../data/images.json'
import type { CommonsImage, Perpetrator } from '../data/types'

const images = imageData as { sites: Record<string, CommonsImage>; people: Record<string, CommonsImage> }
const byId = Object.fromEntries(perpetrators.map((p) => [p.id, p]))
const childrenOf = (id: string) => perpetrators.filter((p) => p.reportsTo === id)

// ── Tree layout ─────────────────────────────────────────
const W = 150, H = 158, HGAP = 18, VGAP = 60, ROWGAP = 26
type Laid = { p: Perpetrator; x: number; y: number; left: number; kids: Laid[]; width: number; height: number; grid?: { cols: number; rows: Laid[][] } }

const subtreeBottom = (l: Laid): number => Math.max(l.y + H, ...l.kids.map(subtreeBottom))
function moveSubtree(l: Laid, dx: number, dy = 0) { l.x += dx; l.left += dx; l.y += dy; for (const k of l.kids) moveSubtree(k, dx, dy) }

/**
 * Lays out a subtree top-down. Children that are single-file chains (a commandant, or Bouhler → Brack → Heyde) are
 * packed into a grid block so that sixteen commandants do not stretch the chart across the room; only subtrees that
 * are themselves wide spread out horizontally.
 */
function layout(p: Perpetrator, x: number, y: number, kidsOf: (id: string) => Perpetrator[] = childrenOf): Laid {
  const kids = kidsOf(p.id)
  if (!kids.length) return { p, x, y, left: x, kids: [], width: W, height: H }
  const childY = y + H + VGAP
  const all = kids.map((k) => layout(k, 0, childY, kidsOf))
  const narrow = all.filter((l) => l.width === W)
  const wide = all.filter((l) => l.width !== W)
  const useGrid = narrow.length > 3
  const blocks: { width: number; place: (x0: number) => void }[] = []
  for (const l of useGrid ? wide : all) blocks.push({ width: l.width, place: (x0) => moveSubtree(l, x0 - l.left) })
  let grid: Laid['grid']
  if (useGrid) {
    const cols = narrow.length > 12 ? 5 : narrow.length > 8 ? 4 : 3
    const rows: Laid[][] = []
    for (let i = 0; i < narrow.length; i += cols) rows.push(narrow.slice(i, i + cols))
    const width = cols * (W + HGAP) - HGAP
    blocks.push({
      width,
      place: (x0) => {
        let rowY = childY
        for (const row of rows) {
          row.forEach((l, i) => moveSubtree(l, x0 + i * (W + HGAP) - l.left, rowY - l.y))
          rowY = Math.max(...row.map(subtreeBottom)) + ROWGAP
        }
      },
    })
    grid = { cols, rows }
  }
  const total = blocks.reduce((s, b) => s + b.width, 0) + (blocks.length - 1) * HGAP
  const width = Math.max(W, total)
  let cx = x + (width - total) / 2
  for (const b of blocks) { b.place(cx); cx += b.width + HGAP }
  const laid: Laid = { p, x: x + (width - W) / 2, y, left: x, kids: all, width, height: 0, grid }
  laid.height = subtreeBottom(laid) - y
  return laid
}
function flatten(l: Laid, out: Laid[] = []): Laid[] { out.push(l); for (const k of l.kids) flatten(k, out); return out }

/** Connector paths from a node to its children */
function links(l: Laid, out: string[] = []): string[] {
  if (!l.kids.length) return out
  const px = l.x + W / 2, py = l.y + H
  const busY = py + VGAP / 2
  out.push(`M${px} ${py} V${busY}`)
  const firstRow = l.grid ? l.grid.rows[0] : []
  const heads = l.kids.filter((k) => !l.grid || !l.grid.rows.slice(1).some((r) => r.includes(k)))
  const xs = heads.map((k) => k.x + W / 2)
  out.push(`M${Math.min(...xs)} ${busY} H${Math.max(...xs)}`)
  for (const k of heads) { out.push(`M${k.x + W / 2} ${busY} V${k.y}`); links(k, out) }
  if (l.grid) {
    // rows below the first hang from the cell above them
    for (let r = 1; r < l.grid.rows.length; r++) {
      l.grid.rows[r].forEach((k, i) => {
        const above = l.grid!.rows[r - 1][i]
        out.push(`M${k.x + W / 2} ${subtreeBottom(above)} V${k.y}`)
        links(k, out)
      })
    }
  }
  void firstRow
  return out
}

export default function Perpetrators() {
  const [view, setView] = useState<'chain' | 'list'>('chain')
  const [open, setOpen] = useState<Perpetrator | null>(null)

  return (
    <div className={view === 'chain' ? 'wrap wrap--wide' : 'wrap'}>
      <header className="page-head">
        <h1>Perpetrators</h1>
        <p>
          The Holocaust was planned and carried out by people, most of them educated, many of them ordinary. These are {perpetrators.length} of those
          who bore the greatest responsibility, arranged as a chain of command so that decisions can be followed from Hitler down to the men who ran the
          camps. Hundreds of thousands more took part.
        </p>
        <div className="chips" role="group" aria-label="View">
          <button className={view === 'chain' ? 'chip is-on' : 'chip'} onClick={() => setView('chain')}>Chain of command</button>
          <button className={view === 'list' ? 'chip is-on' : 'chip'} onClick={() => setView('list')}>By role</button>
        </div>
      </header>

      {view === 'chain' ? (
        <OrgChart open={open} setOpen={setOpen} />
      ) : (
        perpetratorGroups.map((g) => (
          <section key={g.id} className="group">
            <h2>{g.label}</h2>
            <div className="cards">
              {perpetrators.filter((p) => p.group === g.id).map((p) => <PersonCard key={p.id} p={p} />)}
            </div>
          </section>
        ))
      )}
    </div>
  )
}

function OrgChart({ open, setOpen }: { open: Perpetrator | null; setOpen: (p: Perpetrator | null) => void }) {
  const hitler = perpetrators.find((p) => !p.reportsTo)!
  // focus = the person whose direct subordinates are shown; null shows the whole tree
  const [focus, setFocus] = useState<Perpetrator | null>(hitler)
  const root = useMemo(() => {
    if (!focus) return layout(hitler, 0, 0)
    // one level only: the focused person and the people who answered to them, in a row or a grid
    return layout(focus, 0, 0, (id) => (id === focus.id ? childrenOf(id) : []))
  }, [focus, hitler])
  const nodes = useMemo(() => flatten(root), [root])
  const paths = useMemo(() => links(root), [root])
  const frame = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const fit = () => { if (frame.current) setZoom(Math.max(0.35, Math.min(1, (frame.current.clientWidth - 32) / root.width))) }
  useEffect(fit, [root.width]) // eslint-disable-line react-hooks/exhaustive-deps

  // on the whole tree the scroll wheel zooms, keeping the point under the cursor where it is
  useEffect(() => {
    const f = frame.current
    if (!f || focus) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const r = f.getBoundingClientRect()
      const cx = e.clientX - r.left, cy = e.clientY - r.top
      setZoom((z) => {
        const nz = Math.max(0.3, Math.min(1.6, z * (e.deltaY < 0 ? 1.12 : 1 / 1.12)))
        const px = (f.scrollLeft + cx) / z, py = (f.scrollTop + cy) / z
        requestAnimationFrame(() => { f.scrollLeft = px * nz - cx; f.scrollTop = py * nz - cy })
        return nz
      })
    }
    f.addEventListener('wheel', onWheel, { passive: false })
    return () => f.removeEventListener('wheel', onWheel)
  }, [focus])

  // drag to pan the frame; a drag that moves more than a few pixels is not a click
  const drag = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null)
  const onDown = (e: React.MouseEvent) => {
    const f = frame.current
    if (!f || e.button !== 0) return
    drag.current = { x: e.clientX, y: e.clientY, left: f.scrollLeft, top: f.scrollTop, moved: false }
  }
  const onMove = (e: React.MouseEvent) => {
    const d = drag.current, f = frame.current
    if (!d || !f) return
    const dx = e.clientX - d.x, dy = e.clientY - d.y
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true
    f.scrollLeft = d.left - dx
    f.scrollTop = d.top - dy
  }
  const onUp = () => { if (drag.current) setTimeout(() => { drag.current = null }, 0) }
  const clickGuard = (e: React.MouseEvent) => { if (drag.current?.moved) { e.stopPropagation(); e.preventDefault() } }

  // the chain each selected person sits in, lit up on the chart
  const lineage = useMemo(() => {
    const st = new Set<string>()
    for (let p: Perpetrator | undefined = open ?? undefined; p; p = p.reportsTo ? byId[p.reportsTo] : undefined) st.add(p.id)
    return st
  }, [open])
  const trail: Perpetrator[] = []
  for (let p: Perpetrator | undefined = focus ?? undefined; p; p = p.reportsTo ? byId[p.reportsTo] : undefined) trail.unshift(p)

  const onNode = (p: Perpetrator) => {
    if (focus && p.id !== focus.id && childrenOf(p.id).length) { setFocus(p); setOpen(p); return }
    setOpen(open?.id === p.id ? null : p)
  }

  return (
    <section className="chart">
      <div className="chart__bar">
        <div>
          <p className="note">
            {focus
              ? 'Select a person to see who answered to them, or for their record. Drag the chart to move it.'
              : 'The whole chain of command. Drag to move, zoom with the scroll wheel or the buttons, select a person for their record.'}
          </p>
          <nav className="chart__trail" aria-label="Chain">
            {trail.map((p, i) => (
              <span key={p.id}>
                {i > 0 && <span className="chart__sep">›</span>}
                <button className="linkish" onClick={() => setFocus(p)} disabled={focus?.id === p.id}>{p.name}</button>
              </span>
            ))}
            {focus && focus.reportsTo && <span className="chart__sep">·</span>}
            {focus && focus.reportsTo && <button className="linkish" onClick={() => setFocus(byId[focus.reportsTo!])}>Up a level</button>}
          </nav>
        </div>
        <div className="chart__zoom" role="group" aria-label="View">
          <button onClick={() => { setFocus(focus ? null : hitler) }}>{focus ? 'Whole tree' : 'Simplified tree'}</button>
          <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.15))} aria-label="Zoom out">−</button>
          <button onClick={fit}>Fit</button>
          <button onClick={() => setZoom((z) => Math.min(1.4, z + 0.15))} aria-label="Zoom in">+</button>
        </div>
      </div>
      <div className="chart__layout">
        <div className={focus ? 'chart__frame chart__frame--compact' : 'chart__frame'} ref={frame} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} onClickCapture={clickGuard}>
          <div className="chart__canvas" style={{ width: root.width * zoom, height: root.height * zoom }}>
            <div className="chart__inner" style={{ width: root.width, height: root.height, transform: `scale(${zoom})` }}>
              <svg className="chart__links" width={root.width} height={root.height} aria-hidden="true">
                {paths.map((d, i) => <path key={i} d={d} />)}
              </svg>
              {nodes.map((n) => {
                const below = childrenOf(n.p.id).length
                return (
                  <button
                    key={n.p.id}
                    className={`node${open?.id === n.p.id ? ' node--open' : ''}${lineage.has(n.p.id) ? ' node--lineage' : ''}${open && !lineage.has(n.p.id) ? ' node--dim' : ''}`}
                    style={{ left: n.x, top: n.y, width: W, height: H }}
                    onClick={() => onNode(n.p)}
                  >
                    <Portrait p={n.p} size={60} />
                    <strong>{n.p.name}</strong>
                    <span>{n.p.life}</span>
                    <small>{n.p.role}</small>
                    {focus && below > 0 && n.p.id !== focus.id && <em className="node__more">{below} below</em>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        {open && (
          <aside className="chart__record">
            <button className="back" onClick={() => setOpen(null)}>Close</button>
            <div className="chart__record-head">
              <Portrait p={open} size={88} />
              <div>
                <p className="kind">{perpetratorGroups.find((g) => g.id === open.group)?.label}</p>
                <h2>{open.name}</h2>
                <p className="story__life">{open.life}</p>
              </div>
            </div>
            <p className="role">{open.role}</p>
            <p>{open.text}</p>
            <p className="fate"><strong>Fate</strong> {open.fate}</p>
            {open.reportsTo && <p className="note">Answered to <button className="linkish" onClick={() => { setOpen(byId[open.reportsTo!]); if (focus) setFocus(byId[open.reportsTo!]) }}>{byId[open.reportsTo].name}</button>.</p>}
            {childrenOf(open.id).length > 0 && (
              <p className="note">Subordinates here: {childrenOf(open.id).map((k, i, a) => <span key={k.id}><button className="linkish" onClick={() => { setOpen(k); if (focus) setFocus(open) }}>{k.name}</button>{i < a.length - 1 ? ', ' : ''}</span>)}.</p>
            )}
            {images.people[open.id] && <p className="note"><a href={images.people[open.id].page} target="_blank" rel="noreferrer">Photograph source</a></p>}
          </aside>
        )}
      </div>
    </section>
  )
}

function Portrait({ p, size = 56 }: { p: Perpetrator; size?: number }) {
  const img = images.people[p.id]
  return img ? (
    <img className="portrait" src={img.url} alt={p.name} width={size} height={size} loading="lazy" />
  ) : (
    <span className="portrait portrait--empty" style={{ width: size, height: size }} aria-hidden="true">{p.name.split(' ').map((w) => w[0]).slice(-2).join('')}</span>
  )
}

function PersonCard({ p }: { p: Perpetrator }) {
  const img = images.people[p.id]
  return (
    <article className="card card--person">
      <div className="card__head">
        <Portrait p={p} size={64} />
        <h3>{p.name} <span className="life">{p.life}</span></h3>
      </div>
      <p className="role">{p.role}</p>
      <p>{p.text}</p>
      <p className="fate"><strong>Fate</strong> {p.fate}</p>
      {img && <p className="note"><a href={img.page} target="_blank" rel="noreferrer">Photograph source</a></p>}
    </article>
  )
}

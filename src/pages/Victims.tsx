import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { victims, victimGroups } from '../data/victims'

type Name = { name: string; born?: number; died?: string; place?: string }

/** "1871–1942", "born 1871, died sometime in the 1940s", "died 1942" or nothing, depending on what the record holds */
const isYear = (d?: string) => !!d && /^\d{4}$/.test(d)
const lifeOf = (n: Name) => {
  if (n.born && isYear(n.died)) return `${n.born}–${n.died}`
  if (n.born && n.died) return `born ${n.born}, died sometime in the ${n.died}`
  if (n.born) return `born ${n.born}, date of death unknown`
  if (n.died) return isYear(n.died) ? `died ${n.died}` : `died sometime in the ${n.died}`
  return ''
}
type Packed = { source: string; count: number; places: string[]; names: string[] }

const unpack = (p: Packed): Name[] =>
  p.names.map((s) => {
    const [name, born, died, place] = s.split('|')
    return { name, born: born ? Number(born) : undefined, died: died || undefined, place: place ? p.places[Number(place)] : undefined }
  })

export default function Victims() {
  const [names, setNames] = useState<Name[] | null>(null)
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('All')
  const groups = ['All', ...Array.from(new Set(victims.map((s) => (s.survivor ? 'Survivors' : s.group))))]
  const shown = victims.filter((s) => group === 'All' || (group === 'Survivors' ? s.survivor : s.group === group && !s.survivor))

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/names.json`).then((r) => r.json()).then((p: Packed) => setNames(unpack(p))).catch(() => setNames([]))
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!names || q.length < 2) return []
    const out: Name[] = []
    for (const n of names) { if (n.name.toLowerCase().includes(q)) { out.push(n); if (out.length >= 200) break } }
    return out
  }, [names, query])

  return (
    <div className="victims">
      <section className="names-wall">
        <NamesCanvas names={names} />
        <div className="names-wall__text wrap">
          <h1>Victims</h1>
          <p>
            Read them slowly. {names ? `These ${names.length.toLocaleString()} names` : 'These names'} belong to tailors and schoolgirls, rabbis and
            seamstresses, doctors and shopkeepers, grandmothers from Vienna and boys from Prague. Each had a street they grew up on and a door they were
            taken from. Most were first shut into ghettos, walled off and starved, and then put on trains. At the camps a few were picked out to work:
            in quarries and factories, laying track, sorting the belongings of the dead. They were worked until they dropped, and they were the lucky
            ones. Everyone else went straight from the ramp to the gas chamber. Six million Jews were murdered, and millions of others beside them.
            The names drifting past are two in every hundred of the dead. Rest on a name and what little survives of them is here. <Link to="/sources">Source.</Link>
          </p>
        </div>
      </section>

      <section className="wrap wrap--narrow names-search">
        <h2>Type a name</h2>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a surname, a first name or a town to see who is recorded…" aria-label="Search names" disabled={!names} />
        {query.trim().length >= 2 && (
          <p className="note">{results.length === 200 ? 'First 200 matches' : `${results.length} ${results.length === 1 ? 'match' : 'matches'}`}{results.length === 0 ? '. The name may not be recorded in Wikidata; try the databases below.' : '.'}</p>
        )}
        {results.length > 0 && (
          <ul className="names-results">
            {results.map((n, i) => (
              <li key={i}>
                <strong>{n.name}</strong>
                <span>{[lifeOf(n), n.place].filter(Boolean).join(' · ')}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="wrap">
        <h2 className="section-title">Some of their stories</h2>
        <div className="chips" role="group" aria-label="Filter stories">
          {groups.map((g) => <button key={g} className={group === g ? 'chip is-on' : 'chip'} onClick={() => setGroup(g)}>{g}</button>)}
        </div>
        <div className="story-grid">
          {shown.map((v) => (
            <article key={v.id} className="story-card" id={v.id}>
              <header>
                <p className="story__group">{v.survivor ? 'Survivor' : v.group}</p>
                <h3>{v.name}</h3>
                <p className="story__life">{v.life}<br />{v.from}</p>
              </header>
              <p>{v.text}</p>
              {v.links && (
                <p className="story-card__links">
                  {v.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} →</a>)}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="wrap wrap--narrow names-search">
        <h2>Go deeper</h2>
        <p className="note">The names here are the few that Wikidata holds. The archives below hold millions more, with the documents behind them.</p>
        <div className="archives">
          <a className="archive-card" href="https://yvng.yadvashem.org/" target="_blank" rel="noreferrer">
            <strong>Yad Vashem</strong>
            <span>The Central Database of Shoah Victims’ Names holds more than 4.8 million names, gathered from Pages of Testimony and archives across the world. If you are looking for someone, start here.</span>
            <em>Search the names database →</em>
          </a>
          <a className="archive-card" href="https://collections.arolsen-archives.org/en/search" target="_blank" rel="noreferrer">
            <strong>Arolsen Archives</strong>
            <span>The International Center on Nazi Persecution holds some 30 million documents on 17.5 million people: camp records, deportation lists, displaced persons’ files.</span>
            <em>Search the archive →</em>
          </a>
        </div>
      </section>

      <section className="wrap toll">
        <h2>Those who were murdered</h2>
        <dl className="toll__grid">
          {victimGroups.map((g) => (
            <div key={g.name}>
              <dt>{g.figure}</dt>
              <dd><strong>{g.name}</strong>{g.text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

/** Names drifting slowly down the screen on a canvas, with a tooltip on hover */
function NamesCanvas({ names }: { names: Name[] | null }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [hover, setHover] = useState<{ x: number; y: number; n: Name } | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !names || names.length === 0) return
    const ctx = canvas.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    type Item = { n: Name; x: number; y: number; v: number; w: number; alpha: number; col: number }
    let items: Item[] = []
    let width = 0, height = 0, cols = 0, colWidth = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const font = '19px "EB Garamond", Georgia, serif'
    const pick = () => names[Math.floor(Math.random() * names.length)]
    const colSpeed: number[] = []

    const spawn = (col: number, y: number): Item => {
      const n = pick()
      ctx.font = font
      const w = ctx.measureText(n.name).width
      return { n, x: col * colWidth + 12 + Math.random() * Math.max(0, colWidth - w - 24), y, v: colSpeed[col], w, alpha: 0.45 + Math.random() * 0.4, col }
    }
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width; height = rect.height
      canvas.width = width * dpr; canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.max(2, Math.floor(width / 230)); colWidth = width / cols
      items = []
      for (let c = 0; c < cols; c++) {
        colSpeed[c] = 9 + Math.random() * 13
        let y = -Math.random() * 60
        while (y < height + 40) { items.push(spawn(c, y)); y += 34 + Math.random() * 40 }
      }
    }
    resize()
    window.addEventListener('resize', resize)

    let last = performance.now()
    let raf = 0
    const frame = (t: number) => {
      const dt = reduce ? 0 : Math.min(0.1, (t - last) / 1000)
      last = t
      ctx.clearRect(0, 0, width, height)
      ctx.font = font
      ctx.textBaseline = 'alphabetic'
      const tops = new Map<number, number>()
      for (const it of items) {
        it.y += it.v * dt
        const fade = Math.min(1, it.y / 80, (height - it.y) / 80)
        ctx.fillStyle = `rgba(232, 226, 212, ${Math.max(0, fade * it.alpha)})`
        ctx.fillText(it.n.name, it.x, it.y)
        tops.set(it.col, Math.min(tops.get(it.col) ?? Infinity, it.y))
      }
      items = items.filter((it) => it.y < height + 30)
      for (let c = 0; c < cols; c++) {
        const top = tops.get(c) ?? height
        if (top > 34 + Math.random() * 40) items.push(spawn(c, top - (34 + Math.random() * 40)))
      }
      if (!reduce) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left, y = e.clientY - rect.top
      const hit = items.find((it) => x >= it.x && x <= it.x + it.w && y <= it.y + 4 && y >= it.y - 18)
      setHover(hit ? { x, y, n: hit.n } : null)
    }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', () => setHover(null))
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); canvas.removeEventListener('mousemove', onMove) }
  }, [names])

  return (
    <div className="names-canvas">
      <canvas ref={ref} aria-label="Names of victims drifting down the screen" />
      {!names && <p className="names-canvas__loading">Loading the names…</p>}
      {hover && (
        <div className="names-tip" style={{ left: hover.x, top: hover.y }}>
          <strong>{hover.n.name}</strong>
          {lifeOf(hover.n) && <span>{lifeOf(hover.n)}</span>}
          {hover.n.place && <span>{hover.n.place}</span>}
        </div>
      )}
    </div>
  )
}

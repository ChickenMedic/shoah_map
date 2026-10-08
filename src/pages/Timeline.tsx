import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { eras, timeline } from '../data/timeline'
import eventImageData from '../data/eventImages.json'
import type { CommonsImage, TimelineEvent } from '../data/types'
import { formatDate, monthIndex } from '../util'
import YearSlider, { Star } from '../YearSlider'

const images = (eventImageData as { events: Record<string, CommonsImage> }).events
const events: TimelineEvent[] = [...timeline].sort((a, b) => a.date.localeCompare(b.date))
const MIN = monthIndex('1919-01')
const MAX = monthIndex('1945-12')
const DEPTH = 560 // px between one event and the next along the tunnel
const SHOWN = 7 // events visible ahead of the viewer

export default function Timeline() {
  // `target` is where the viewer wants to be; `progress` eases toward it every frame
  // the page can be opened at an event: /timeline?at=<date>|<title>
  const [params] = useSearchParams()
  const start = useMemo(() => { const at = params.get('at'); const i = at ? events.findIndex((e) => `${e.date}|${e.title}` === at) : -1; return Math.max(0, i) }, [params])
  const [progress, setProgress] = useState(start)
  const target = useRef(start)
  const raf = useRef(0)
  const tunnel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tick = () => {
      setProgress((p) => {
        const d = target.current - p
        return Math.abs(d) < 0.002 ? target.current : p + d * 0.12
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const go = (v: number) => { target.current = Math.max(0, Math.min(events.length - 1, v)) }
  const step = (n: number) => go(Math.round(target.current) + n)

  // wheel, keys and touch drive the tunnel; the page itself does not scroll while the pointer is over it
  useEffect(() => {
    const el = tunnel.current
    if (!el) return
    // wheel moves freely, then settles on the nearest event once the wheel stops
    let settle = 0
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      go(target.current + e.deltaY / 320)
      clearTimeout(settle)
      settle = window.setTimeout(() => go(Math.round(target.current)), 180)
    }
    let touchY: number | null = null
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY }
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return
      e.preventDefault()
      go(target.current + (touchY - e.touches[0].clientY) / 160)
      touchY = e.touches[0].clientY
    }
    const onTouchEnd = () => { touchY = null; go(Math.round(target.current)) }
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    return () => { el.removeEventListener('wheel', onWheel); el.removeEventListener('touchstart', onTouchStart); el.removeEventListener('touchmove', onTouchMove); el.removeEventListener('touchend', onTouchEnd); clearTimeout(settle) }
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); step(1) }
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); step(-1) }
      if (e.key === 'Home') go(0)
      if (e.key === 'End') go(events.length - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const current = events[Math.round(progress)] ?? events[0]
  const era = eras.find((e) => e.id === current.era)
  const monthOfIndex = (i: number) => monthIndex(events[Math.max(0, Math.min(events.length - 1, Math.round(i)))].date)
  const jumpToMonth = (m: number) => {
    let i = events.findIndex((e) => monthIndex(e.date) >= m)
    if (i < 0) i = events.length - 1
    go(i)
  }
  const ticks = useMemo(() => [1920, 1925, 1930, 1933, 1936, 1939, 1941, 1943, 1945].map((y) => ({ value: monthIndex(`${y}-01`), label: String(y) })), [])

  const first = Math.max(0, Math.floor(progress) - 1)
  const last = Math.min(events.length - 1, Math.ceil(progress) + SHOWN)

  return (
    <div className="tl">
      <header className="tl__head wrap">
        <div className="tl__title">
          <h1>Timeline</h1>
          <p className="note">Scroll, swipe or use the arrow keys to move down the years. Drag the star to jump.</p>
        </div>
        <YearSlider min={MIN} max={MAX} value={monthOfIndex(progress)} onChange={jumpToMonth} ticks={ticks} format={(v) => formatDate(`${Math.floor(v / 12)}-${String((v % 12) + 1).padStart(2, '0')}`)} ariaLabel="Year" />
      </header>

      <div className="tl__tunnel" ref={tunnel}>
        <div className="tl__era">
          <span>{era?.label}</span>
          <small>{era?.years}</small>
        </div>
        <div className="tl__stage">
          {events.slice(first, last + 1).map((e, k) => {
            const i = first + k
            const d = i - progress // 0 = in front of the viewer, positive = further down the tunnel
            if (d < -0.6) return null
            const z = -d * DEPTH
            const scale = 1 // perspective does the scaling
            // a card the viewer has passed fades fast and slides up out of the frame; cards ahead fade in with distance
            // the card in front is sharp; the ones behind it drop quickly to a dim, blurred presence that deepens with distance
            const far = d < 1 ? 1 : Math.max(0, 1 - (d - 1) / (SHOWN - 1)) ** 1.5
            const opacity = d < 0 ? Math.max(0, 1 + d / 0.5) : 0.2 * far + 0.8 * (1 - Math.min(1, d)) ** 1.8
            const blur = d <= 0 ? 0 : Math.min(5, 2 * d)
            const side = i % 2 === 0 ? -1 : 1
            const img = images[`${e.date}|${e.title}`]
            return (
              <article
                key={e.date + e.title}
                className={`tl__card tl__card--${e.era}${Math.abs(d) < 0.5 ? ' is-current' : ''}${e.military ? ' tl__card--war' : ''}`}
                style={{ transform: `translate(-50%, -50%) translate3d(${side * 70 * Math.min(1, Math.max(0, d))}px, ${d < 0 ? d * 420 : -36 * d}px, ${z}px) scale(${scale})`, opacity, filter: blur ? `blur(${blur.toFixed(1)}px)` : undefined, zIndex: 100 - i, pointerEvents: Math.abs(d) < 0.5 ? 'auto' : 'none' }}
                onClick={() => go(i)}
              >
                <div className="tl__mark"><Star size={28} /></div>
                <div className="tl__body">
                  <time dateTime={e.date}>{formatDate(e.date)}</time>
                  <h2>{e.title}</h2>
                  <p>{e.text}</p>
                  {e.link && <a href={e.link} target="_blank" rel="noreferrer" onClick={(ev) => ev.stopPropagation()}>Read more →</a>}
                </div>
                {img && (
                  <figure className="tl__figure">
                    <img src={img.url} alt={img.description || e.title} loading="lazy" draggable={false} className={(img.height ?? 0) > (img.width ?? 1) ? "is-portrait" : undefined} />
                    <figcaption><a href={img.page} target="_blank" rel="noreferrer" onClick={(ev) => ev.stopPropagation()}>Photograph source</a></figcaption>
                  </figure>
                )}
              </article>
            )
          })}
        </div>
        <div className="tl__controls">
          <button onClick={() => step(-1)} aria-label="Previous event" disabled={Math.round(progress) <= 0}>▲</button>
          <span>{Math.round(progress) + 1} of {events.length}</span>
          <button onClick={() => step(1)} aria-label="Next event" disabled={Math.round(progress) >= events.length - 1}>▼</button>
        </div>
      </div>
    </div>
  )
}

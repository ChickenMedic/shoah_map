import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { chapters } from '../data/history'
import { timeline } from '../data/timeline'
import filmData from '../data/films.json'
import eventImageData from '../data/eventImages.json'
import type { CommonsImage, Film } from '../data/types'
import { formatDate } from '../util'

const films = (filmData as { films: Film[] }).films
const eventImages = eventImageData as { events: Record<string, CommonsImage>; chapters: Record<string, CommonsImage> }
// each chapter draws on the timeline era of the same name
const eraOf: Record<string, string> = { origins: 'origins', persecution: 'persecution', t4: 't4', war: 'war', 'final-solution': 'genocide', collapse: 'collapse' }

export default function History() {
  const root = useRef<HTMLDivElement>(null)

  // chapters slide in from the side as they scroll into view
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) en.target.classList.add('is-in')
    }, { threshold: 0.18 })
    el.querySelectorAll('.ch__reveal').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return (
    <div className="history" ref={root}>
      <header className="page-head wrap wrap--narrow">
        <h1>History</h1>
        <p>How an ideology became a state, and a state became a machinery of murder. Six chapters, from a letter written in 1919 to the camps opened in 1945.</p>
        <nav className="chapter-nav" aria-label="Chapters">
          {chapters.map((c, i) => (
            <button key={c.id} onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth' })}>
              <span>{i + 1}</span> {c.title} <small>{c.years}</small>
            </button>
          ))}
        </nav>
      </header>

      {chapters.map((c, i) => {
        const left = i % 2 === 0
        const img = eventImages.chapters[c.id]
        const eraEvents = timeline.filter((e) => e.era === eraOf[c.id] && !e.military).sort((a, b) => a.date.localeCompare(b.date))
        const moments = eraEvents.filter((e) => eventImages.events[`${e.date}|${e.title}`]).slice(0, 3)
        const chapterFilms = films.filter((f) => f.chapter === c.id)
        return (
          <article key={c.id} id={c.id} className={`ch ${left ? 'ch--left' : 'ch--right'}`}>
            <div className="ch__head wrap">
              <div className="ch__reveal ch__text">
                <p className="chapter__years">Chapter {i + 1} · {c.years}</p>
                <h2>{c.title}</h2>
                <p className="chapter__lead">{c.lead}</p>
              </div>
              {img && (
                <figure className="ch__reveal ch__figure">
                  <img src={img.url} alt={img.description || c.title} loading="lazy" className={(img.height ?? 0) > (img.width ?? 1) ? "is-portrait" : undefined} />
                  <figcaption><a href={img.page} target="_blank" rel="noreferrer">Photograph source</a></figcaption>
                </figure>
              )}
            </div>
            <div className="wrap wrap--narrow ch__body">
              {c.paragraphs.map((p, j) => <p key={j} className="ch__reveal">{p}</p>)}
              {c.quote && (
                <blockquote className="pull ch__reveal">
                  <p>“{c.quote.text}”</p>
                  <cite>{c.quote.source}</cite>
                </blockquote>
              )}
            </div>
            {moments.length > 0 && (
              <div className="wrap ch__moments ch__reveal">
                {moments.map((e) => {
                  const im = eventImages.events[`${e.date}|${e.title}`]
                  return (
                    <Link key={e.date + e.title} to={`/timeline?at=${encodeURIComponent(e.date + "|" + e.title)}`} className="moment">
                      <img src={im.url} alt="" loading="lazy" className={(im.height ?? 0) > (im.width ?? 1) ? "is-portrait" : undefined} />
                      <span className="moment__date">{formatDate(e.date)}</span>
                      <strong>{e.title}</strong>
                    </Link>
                  )
                })}
              </div>
            )}
            {chapterFilms.length > 0 && (
              <p className="wrap wrap--narrow chapter__films">
                Films from this period: {chapterFilms.map((f, k) => <span key={f.id}><Link to="/films">{f.title}</Link>{k < chapterFilms.length - 1 ? '; ' : ''}</span>)}
              </p>
            )}
          </article>
        )
      })}
    </div>
  )
}

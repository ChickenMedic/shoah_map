import { useEffect, useRef, useState } from 'react'
import { archives } from '../data/media'
import filmData from '../data/films.json'
import { chapters } from '../data/history'
import type { Film } from '../data/types'

const films = (filmData as { films: Film[] }).films
// the films follow the history's chapters, with the survivors' testimony recorded after the war as a last group
const chapterTitle: Record<string, string> = { ...Object.fromEntries(chapters.map((c) => [c.id, c.title])), testimony: 'Survivors speak' }
const order = [...chapters.map((c) => c.id), 'testimony']
const minutes = (s?: number) => (s ? (s < 90 ? `${s} sec` : `${Math.round(s / 60)} min`) : '')

export default function Films() {
  const [active, setActive] = useState<Film | null>(null)
  const grouped = order.map((id) => ({ id, title: chapterTitle[id], films: films.filter((f) => f.chapter === id) })).filter((g) => g.films.length)

  return (
    <div className="wrap">
      <header className="page-head">
        <h1>Films</h1>
        <p>
          Footage shot at the time: newsreels of the 1930s, the Wehrmacht’s own propaganda films of the Warsaw ghetto, the Westerbork transport film,
          what Soviet and Allied cameramen recorded when the camps were opened in 1945, and the trials that followed. At the end, survivors speak for
          themselves. Everything here is in the public domain or freely licensed and plays directly from Wikimedia Commons. Some of it is very hard
          to watch; films showing the dead are blurred until you choose to see them.
        </p>
      </header>

      {grouped.map((g) => (
        <section key={g.id} className="group">
          <h2>{g.title}</h2>
          <div className="film-grid">
            {g.films.map((f) => {
              const isActive = active?.id === f.id
              return (
                // the film plays in its own card, which widens to the full row; choosing another card moves the player there
                <article key={f.id} className={isActive ? 'film film--active' : 'film'}>
                  {isActive ? (
                    <Player film={f} onClose={() => setActive(null)} />
                  ) : (
                    <button className={f.graphic ? 'film__poster film__poster--graphic' : 'film__poster'} onClick={() => setActive(f)} aria-label={`Play ${f.title}`}>
                      <img src={f.poster} alt="" loading="lazy" />
                      <span className="film__play" aria-hidden="true">▶</span>
                      {/* the still of a graphic film is blurred until the viewer chooses to see it */}
                      {f.graphic && <span className="film__veil"><strong>Graphic footage</strong><small>This film shows the dead. Select it to continue.</small></span>}
                      {f.duration && <span className="film__length">{minutes(f.duration)}</span>}
                    </button>
                  )}
                  <div className="film__meta">
                    <small>{f.year}{f.author ? ` · ${f.author}` : ''}{f.duration ? ` · ${minutes(f.duration)}` : ''}</small>
                    <h3>{isActive ? f.title : <button className="linkish" onClick={() => setActive(f)}>{f.title}</button>}</h3>
                    <p>{f.description}</p>
                    <p className="note"><a href={f.page} target="_blank" rel="noreferrer">{f.license}</a>, Wikimedia Commons</p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      ))}

      <section className="group">
        <h2>Testimony archives</h2>
        <p className="note">Survivor testimony is held by the archives below; most of it cannot be embedded here, but all of it can be watched on their sites.</p>
        <ul className="link-list">
          {archives.map((a) => (
            <li key={a.url}>
              <a href={a.url} target="_blank" rel="noreferrer">{a.name}</a>
              <span>{a.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/**
 * The sources a browser should try, in order. A browser plays the first <source> whose type it accepts and never falls
 * back if that file turns out not to decode, so the order matters: Commons' VP9 transcodes first, the one nearest 480p
 * leading, then the original upload as a last resort. Ogg originals are dropped altogether: their video is Theora, which
 * Chrome, Edge and Safari cannot decode, so they play as sound under a still image.
 */
function playable(film: Film) {
  const all = film.sources?.length ? film.sources : [{ src: film.url, type: 'video/webm' }]
  const isTranscode = (s: { src: string }) => s.src.includes('/transcoded/')
  return all
    .filter((s) => s.type === 'video/webm')
    .sort((a, b) => {
      if (isTranscode(a) !== isTranscode(b)) return isTranscode(a) ? -1 : 1
      return Math.abs((a.height ?? 480) - 480) - Math.abs((b.height ?? 480) - 480)
    })
}

/** The player, in the place of the film's still */
function Player({ film, onClose }: { film: Film; onClose: () => void }) {
  const [ready, setReady] = useState(!film.graphic)
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => { el.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [])
  const sources = playable(film)
  return (
    <div className="player" ref={el}>
      {ready ? (
        <video controls autoPlay playsInline poster={film.poster}>
          {sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
        </video>
      ) : (
        <div className="player__warning">
          <img src={film.poster} alt="" className="player__blur" />
          <div>
            <p>This film shows the bodies of the dead and the condition of survivors at liberation.</p>
            <button className="button" onClick={() => setReady(true)}>Play</button>
          </div>
        </div>
      )}
      <button className="player__close" onClick={onClose} aria-label="Stop and close the film">×</button>
    </div>
  )
}

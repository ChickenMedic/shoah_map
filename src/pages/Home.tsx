import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { victimGroups } from '../data/victims'
import subcamps from '../data/subcamps.json'
import { sites } from '../data/sites'
import { timeline } from '../data/timeline'
import { perpetrators } from '../data/perpetrators'
import filmData from '../data/films.json'
import eventImageData from '../data/eventImages.json'
import memorialImageData from '../data/memorialImages.json'
import { memorials } from '../data/memorials'
import type { CommonsImage } from '../data/types'
import CampFrieze from '../CampFrieze'
import FlipWord from '../FlipWord'
import Badge from '../Badge'

const images = (eventImageData as { events: Record<string, CommonsImage> }).events
const filmCount = (filmData as { films: unknown[] }).films.length
const memorialImages = memorialImageData as Record<string, CommonsImage>

const quotes = [
  { text: 'It happened, therefore it can happen again: this is the core of what we have to say.', who: 'Primo Levi, survivor of Auschwitz' },
  { text: 'For the dead and the living, we must bear witness.', who: 'Elie Wiesel, survivor of Auschwitz and Buchenwald' },
  { text: 'To forget the dead would be akin to killing them a second time.', who: 'Elie Wiesel, Night' },
  { text: 'I still believe, in spite of everything, that people are truly good at heart.', who: 'Anne Frank, diary, 15 July 1944' },
  { text: 'Where they burn books, they will in the end also burn people.', who: 'Heinrich Heine, 1821' },
  { text: 'The opposite of love is not hate, it’s indifference.', who: 'Elie Wiesel' },
]

// each section card carries a photograph already gathered for the timeline
const sections = [
  {
    to: '/history', title: 'History', image: '1933-05-10|Book burnings',
    text: 'How an ideology became a state, and a state became a machinery of murder.',
    facts: ['Six chapters, from a letter of 1919 to the camps opened in 1945', 'Hitler’s worldview and Mein Kampf', 'Aktion T4, the ghettos and the “Final Solution”'],
  },
  {
    to: '/timeline', title: 'Timeline', image: '1938-11-09|The November Pogrom (“Kristallnacht”)',
    text: 'The path from words to law to murder, one date at a time.',
    facts: [`${timeline.length} events, 1919 to 1945`, 'The war alongside the persecution', 'Photographs and documents for each step'],
  },
  {
    to: '/map', title: 'Map', image: '1942-07-22|The Great Deportation from Warsaw',
    text: 'Europe month by month: the front lines, the camps as they opened, and the trains.',
    facts: [`${sites.length} principal camps and killing sites`, `${subcamps.length.toLocaleString()} subcamps, appearing as they were built`, 'Deportation routes on the real railway lines'],
  },
  {
    to: '/perpetrators', title: 'Perpetrators', image: '1942-01-20|The Wannsee Conference',
    text: 'The chain of command from Hitler to the camp commandants.',
    facts: [`${perpetrators.length} people, from the Chancellery to the ramp`, 'Who decided, who organised, who carried it out', 'What became of each of them'],
  },
  {
    to: '/victims', title: 'Victims', image: '1944-05-15|The deportation of Hungary’s Jews',
    text: 'The names, and the lives behind some of them.',
    facts: ['More than 144,000 recorded names', 'Eighteen stories of the murdered and the survivors', 'Where to search for a family'],
  },
  {
    to: '/films', title: 'Films', image: '1945-04-15|Bergen-Belsen',
    text: 'Newsreels, the perpetrators’ own footage, and what the liberators filmed.',
    facts: [`${filmCount} films, all in the public domain`, 'From the Nuremberg rally to the Nuremberg trial', 'Shown with a warning where the footage is graphic'],
  },
  {
    to: '/memorials', title: 'Memorials', image: 'memorial:berlin-jews',
    text: 'Where the murdered are remembered, from the camp sites to the pavements of the cities.',
    facts: [`${memorials.length} memorials in ${new Set(memorials.map((m) => m.country)).size - 2} countries, and the Stolpersteine everywhere`, 'Berlin, Auschwitz, Treblinka, Amsterdam, Budapest, Kyiv', 'What each one chose to say, and how'],
  },
]

export default function Home() {
  const [qi, setQi] = useState(0)
  const [fading, setFading] = useState(false)
  useEffect(() => {
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => { setQi((i) => (i + 1) % quotes.length); setFading(false) }, 700)
    }, 9000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <section className="hero">
        <div className="hero__title">
          <h1 className="hero__word"><FlipWord /></h1>
          <p className="hero__sub">The Holocaust, 1933–1945</p>
        </div>
        <blockquote className={fading ? 'hero__quote is-fading' : 'hero__quote'}>
          <p>“{quotes[qi].text}”</p>
          <cite>{quotes[qi].who}</cite>
        </blockquote>
        <CampFrieze />
      </section>

      <section className="wrap wrap--narrow intro">
        <p>
          Between 1933 and 1945, Nazi Germany and its collaborators murdered six million Jews, two out of every three in Europe, along with
          millions of others they judged unworthy of life. It was not a sudden eruption. It was built, step by step, out of ideas, laws,
          institutions and the decisions of a great many people.
        </p>
        <p>
          This site follows that path: from a letter written in 1919, to a book, to a government, to the killing of disabled patients in German
          hospitals, to the gas chambers of occupied Poland. It is offered in memory of those who were murdered, and in the belief that
          understanding how it happened is the first obligation of “never again”.
        </p>
      </section>

      <section className="wrap">
        <div className="cards cards--home">
          {sections.map((s) => {
            const img = s.image.startsWith('memorial:') ? memorialImages[s.image.slice(9)] : images[s.image]
            return (
              <Link key={s.to} to={s.to} className="card card--link card--pic">
                {img && <img src={img.url} alt="" loading="lazy" />}
                <div className="card__body">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <ul className="card__facts">
                    {s.facts.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="wrap toll">
        <h2>Victims of the Nazis</h2>
        <p className="toll__lead">
          The badges are those the camps sewed onto prisoners’ clothing: the yellow star, and the triangles that sorted people by the
          reason they had been taken. Those killed in the hospitals and over the pits wore none; their marks here are the Red Army’s and the address the T4 programme was run from.
        </p>
        <dl className="toll__grid">
          {victimGroups.map((g) => (
            <div key={g.name}>
              <Badge kind={g.badge} />
              <div>
                <dt>{g.figure}</dt>
                <dd>
                  <strong>{g.name}</strong>
                  {g.text}
                </dd>
              </div>
            </div>
          ))}
        </dl>
        <p className="note">Figures are scholarly estimates; see <Link to="/sources">sources</Link>.</p>
      </section>
    </>
  )
}

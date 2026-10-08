import { sources } from '../data/sources'

export default function Sources() {
  return (
    <div className="wrap wrap--narrow">
      <header className="page-head">
        <h1>Sources and further reading</h1>
        <p>
          Figures on this site are scholarly estimates and are rounded. Where historians differ, the more conservative or the most widely cited
          figure is given.
        </p>
      </header>
      {sources.map((s) => (
        <section key={s.heading} className="group">
          <h2>{s.heading}</h2>
          <ul className="link-list">
            {s.items.map((i) => (
              <li key={i.name}>
                {'url' in i && i.url ? <a href={i.url} target="_blank" rel="noreferrer">{i.name}</a> : <span className="plain">{i.name}</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

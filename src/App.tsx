import { useEffect } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import History from './pages/History'
import Timeline from './pages/Timeline'
import MapPage from './pages/MapPage'
import Perpetrators from './pages/Perpetrators'
import Victims from './pages/Victims'
import Films from './pages/Films'
import Memorials from './pages/Memorials'
import Sources from './pages/Sources'
import FlipWord from './FlipWord'

const nav = [
  { to: '/history', label: 'History' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/map', label: 'Map' },
  { to: '/perpetrators', label: 'Perpetrators' },
  { to: '/victims', label: 'Victims' },
  { to: '/films', label: 'Films' },
  { to: '/memorials', label: 'Memorials' },
]

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  const isMap = pathname === '/map'

  return (
    <div className={isMap ? 'app app--map' : 'app'}>
      <header className="site-header">
        <NavLink to="/" className="brand">
          <FlipWord className="brand__word" interval={6000} />
          <span className="brand__tag">Never again</span>
        </NavLink>
        <nav aria-label="Main">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to}>{n.label}</NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/perpetrators" element={<Perpetrators />} />
          <Route path="/victims" element={<Victims />} />
          <Route path="/films" element={<Films />} />
          <Route path="/memorials" element={<Memorials />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!isMap && (
        <footer className="site-footer">
          <p className="site-footer__tag">Never again.</p>
          <p>
            An educational project in memory of the victims of National Socialism. <NavLink to="/sources">Sources and further reading</NavLink>
          </p>
        </footer>
      )}
    </div>
  )
}

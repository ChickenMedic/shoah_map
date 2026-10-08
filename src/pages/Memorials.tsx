import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { memorials } from '../data/memorials'
import memorialImageData from '../data/memorialImages.json'
import type { CommonsImage } from '../data/types'

const images = memorialImageData as Record<string, CommonsImage>
// the order the countries appear in, west to east, with the Europe-wide and the Israeli memorials at either end
const countryOrder = ['Europe', 'United Kingdom', 'France', 'Netherlands', 'Germany', 'Italy', 'Austria', 'Czech Republic', 'Hungary', 'Poland', 'Lithuania', 'Ukraine', 'Israel']
const ordered = [...memorials].sort((a, b) => countryOrder.indexOf(a.country) - countryOrder.indexOf(b.country))

export default function Memorials() {
  return (
    <div className="memorials">
      <header className="page-head wrap wrap--narrow">
        <h1>Memorials</h1>
        <p>
          The camps were torn down, burned or ploughed under; the ghettos were rebuilt as other streets. What stands in their place was argued over
          for decades, and much of it is recent. These are some of the places across Europe where the murdered are remembered: on the sites
          themselves, in the cities they were taken from, and in the pavements outside the houses where they lived.
        </p>
      </header>

      <MemorialMap />

      <section className="wrap mem-group">
        <div className="mem-grid">
          {ordered.map((m) => {
            const img = images[m.id]
            return (
              <article key={m.id} id={`mem-${m.id}`} className="mem">
                {img && (
                  <figure className="mem__figure">
                    <img src={img.url} alt={img.description || m.name} loading="lazy" className={(img.height ?? 0) > (img.width ?? 1) ? 'is-portrait' : undefined} />
                    <figcaption><a href={img.page} target="_blank" rel="noreferrer">Photograph source</a></figcaption>
                  </figure>
                )}
                <div className="mem__body">
                  <p className="mem__place">{m.country === 'Europe' ? m.place : `${m.place}, ${m.country}`} · {m.year}</p>
                  <h3>{m.name}</h3>
                  <p>{m.text}</p>
                  {m.url && <a href={m.url} target="_blank" rel="noreferrer">Visit the memorial’s site →</a>}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

/** A small map of where the memorials are; a marker scrolls to its entry */
function MemorialMap() {
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const m = L.map(el.current!, { center: [50, 14], zoom: 4, minZoom: 3, maxZoom: 12, zoomControl: false, scrollWheelZoom: false, attributionControl: true })
    L.control.zoom({ position: 'bottomright' }).addTo(m)
    const esri = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_{layer}/MapServer/tile/{z}/{y}/{x}'
    L.tileLayer(esri.replace('{layer}', 'Base'), { attribution: 'Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors', maxNativeZoom: 16 }).addTo(m)
    L.tileLayer(esri.replace('{layer}', 'Reference'), { maxNativeZoom: 16, pane: 'shadowPane' }).addTo(m)
    for (const mem of memorials) {
      const marker = L.circleMarker(mem.coords, { radius: 6, color: '#1a1710', weight: 1.5, fillColor: '#c9a35a', fillOpacity: 0.95 }).addTo(m)
      marker.bindTooltip(`${mem.name}<br><small>${mem.place}</small>`, { direction: 'top', offset: [0, -6], className: 'mem-tip' })
      marker.on('click', () => document.getElementById(`mem-${mem.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
    }
    return () => { m.remove() }
  }, [])
  return <div className="mem-map wrap"><div ref={el} className="mem-map__canvas" /></div>
}

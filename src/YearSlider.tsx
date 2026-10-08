import { useRef } from 'react'

/** A small yellow Star of David, the badge the Germans forced Jews to wear; used as the slider's thumb and as a marker */
export function Star({ size = 22, className }: { size?: number; className?: string }) {
  // the hexagram as one twelve-point silhouette, so the fill is solid and the outline clean; the two triangles are hinted inside
  const outline = 'M50 6 L62.7 28 L88.1 28 L75.4 50 L88.1 72 L62.7 72 L50 94 L37.3 72 L11.9 72 L24.6 50 L11.9 28 L37.3 28 Z'
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" shapeRendering="geometricPrecision">
      <path d={outline} fill="#f0c447" stroke="#1a1710" strokeWidth="4" strokeLinejoin="miter" />
      <path d="M62.7 28 L75.4 50 L62.7 72 L37.3 72 L24.6 50 L37.3 28 Z" fill="none" stroke="#1a1710" strokeWidth="1.6" strokeOpacity="0.35" />
    </svg>
  )
}

type Props = {
  min: number
  max: number
  value: number | null
  onChange: (v: number) => void
  /** value -> short label under the track; called for each tick */
  ticks: { value: number; label: string }[]
  /** value -> text shown above the thumb */
  format: (v: number) => string
  ariaLabel: string
}

/** A horizontal time slider drawn by hand: a track with year ticks, and a Star of David as the thumb */
export default function YearSlider({ min, max, value, onChange, ticks, format, ariaLabel }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const pct = (v: number) => ((v - min) / (max - min)) * 100
  const v = value ?? max

  const valueAt = (clientX: number) => {
    const r = track.current!.getBoundingClientRect()
    const t = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    return Math.round(min + t * (max - min))
  }
  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    onChange(valueAt(e.clientX))
    const move = (ev: PointerEvent) => onChange(valueAt(ev.clientX))
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 12 : 1
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); onChange(Math.min(max, v + step)) }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); onChange(Math.max(min, v - step)) }
    if (e.key === 'Home') onChange(min)
    if (e.key === 'End') onChange(max)
  }

  return (
    <div className="ys" ref={track} onPointerDown={onPointerDown}>
      <div className="ys__track" />
      <div className="ys__fill" style={{ width: `${pct(v)}%` }} />
      {ticks.map((t) => (
        <div key={t.value} className="ys__tick" style={{ left: `${pct(t.value)}%` }}><span>{t.label}</span></div>
      ))}
      <div
        className={value === null ? 'ys__thumb ys__thumb--idle' : 'ys__thumb'}
        style={{ left: `${pct(v)}%` }}
        role="slider" tabIndex={0} aria-label={ariaLabel} aria-valuemin={min} aria-valuemax={max} aria-valuenow={v} aria-valuetext={format(v)}
        onKeyDown={onKey}
      >
        <Star size={26} />
      </div>
    </div>
  )
}

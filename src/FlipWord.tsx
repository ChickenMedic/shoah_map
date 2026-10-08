import { useEffect, useState } from 'react'

// each change of word uses the next of these transitions in turn
const MODES = ['flip', 'rise', 'spread', 'dissolve', 'wipe', 'turn'] as const
type Mode = (typeof MODES)[number]

/** The word Shoah, alternating between the Hebrew and the English with a different quiet transition each time */
export default function FlipWord({ className, interval = 4500 }: { className?: string; interval?: number }) {
  const [hebrew, setHebrew] = useState(true)
  const [mode, setMode] = useState<Mode>('flip')

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      // set the transition first, then change the word on the next frame so the incoming face starts from the right pose
      setMode(MODES[i % MODES.length])
      requestAnimationFrame(() => requestAnimationFrame(() => setHebrew((v) => !v)))
    }, interval)
    return () => clearInterval(id)
  }, [interval])

  return (
    <span className={`fw fw--${mode} ${hebrew ? 'is-he' : 'is-en'}${className ? ' ' + className : ''}`} role="img" aria-label="Shoah">
      <span className="fw__face fw__face--he" lang="he" dir="rtl" aria-hidden="true">שׁוֹאָה</span>
      <span className="fw__face fw__face--en" aria-hidden="true">Shoah</span>
    </span>
  )
}

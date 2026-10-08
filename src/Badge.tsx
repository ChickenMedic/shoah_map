/**
 * The cloth badges the camps sewed on prisoners' uniforms: the yellow star, and the coloured triangles that sorted
 * people by the reason for their imprisonment.
 */
export type BadgeKind = 'star' | 'red' | 'red-p' | 'brown' | 'purple' | 'pink' | 'black' | 'soviet' | 't4' | 'none'

const colours: Record<string, string> = { red: '#b8312f', 'red-p': '#b8312f', brown: '#7a4a21', purple: '#6b3fa0', pink: '#d77aa6', black: '#2a2622' }

export default function Badge({ kind, size = 40 }: { kind: BadgeKind; size?: number }) {
  if (kind === 'none') return <span className="badge badge--none" style={{ width: size, height: size }} aria-hidden="true" />
  if (kind === 'soviet') {
    // the hammer and sickle, for the Red Army prisoners
    return (
      // the emblem as drawn on the flag of the USSR (public domain, Wikimedia Commons "Hammer and sickle.svg")
      <svg className="badge" width={size} height={size} viewBox="0 0 550 550" aria-hidden="true">
        <g fill="#ffd700" transform="translate(18,-824)">
          <path d="m 157.54301,922.36336 -16.97149,16.9707 -45.256019,45.2539 -56.570993,56.57034 62.227502,62.2246 56.571,-56.5684 299.82842,299.8124 a 32.001491,31.999993 0 0 0 45.25601,0 32.001491,31.999993 0 0 0 0,-45.2539 l -299.82646,-299.8143 16.9715,-16.97074 50.91448,-50.91015 z" />
          <path d="m 255.989,844.0001 c 0,0 168.00781,127.99997 168.00783,256 C 423.99684,1164 367.99425,1236 271.98975,1236 c -64.00296,0 -104.24119,-47.7637 -104.24119,-47.7637 l -11.31302,11.3125 a 16.000745,15.999996 0 0 0 -22.62801,0 16.000745,15.999996 0 0 0 -2.47863,3.2227 32.001491,31.999993 0 0 0 -31.464359,8.0918 32.001491,31.999993 0 0 0 -9.330512,21.5449 C 65.101725,1246.1605 22.969246,1272.9834 4.2643862,1308 l 0.029298,0.029 A 32.001491,31.999993 0 0 0 4.2643862,1340 32.001491,31.999993 0 0 0 47.979313,1351.7129 c 35.025561,-18.708 61.854737,-60.8518 75.605087,-86.2813 a 32.001491,31.999993 0 0 0 21.53616,-9.3144 32.001491,31.999993 0 0 0 7.93201,-13.2012 c 24.51647,23.0544 71.44493,57.084 134.93792,57.084 96.00451,0 200.00932,-72 200.00932,-199.9999 0,-160.00002 -232.01081,-256 -232.01081,-256 z" />
        </g>
      </svg>
    )
  }
  if (kind === 't4') {
    // Aktion T4 took its name from Tiergartenstrasse 4, the Berlin villa the killing was run from
    return (
      <svg className="badge" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
        <rect x="6" y="6" width="88" height="88" rx="6" fill="#4c4a46" stroke="#1a1710" strokeWidth="2.5" />
        <text x="38" y="68" textAnchor="middle" fontFamily="EB Garamond, Georgia, serif" fontSize="66" fill="#e8e2d4">T</text>
        <text x="72" y="88" textAnchor="middle" fontFamily="EB Garamond, Georgia, serif" fontSize="48" fill="#e8e2d4">4</text>
      </svg>
    )
  }
  if (kind === 'star') {
    return (
      <svg className="badge" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 6 L62.7 28 L88.1 28 L75.4 50 L88.1 72 L62.7 72 L50 94 L37.3 72 L11.9 72 L24.6 50 L11.9 28 L37.3 28 Z" fill="#f0c447" stroke="#1a1710" strokeWidth="3" />
        <path d="M62.7 28 L75.4 50 L62.7 72 L37.3 72 L24.6 50 L37.3 28 Z" fill="none" stroke="#1a1710" strokeWidth="1.5" strokeOpacity="0.35" />
      </svg>
    )
  }
  return (
    <svg className="badge" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      {/* the triangles were worn point down */}
      <path d="M8 16 H92 L50 90 Z" fill={colours[kind]} stroke="#1a1710" strokeWidth="3" strokeLinejoin="round" />
      {kind === 'red-p' && <text x="50" y="50" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="34" fill="#1a1710">P</text>}
    </svg>
  )
}

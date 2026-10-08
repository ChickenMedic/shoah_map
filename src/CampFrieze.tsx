/**
 * Line drawings of the best-known camps for the home page: the Birkenau gatehouse, the Auschwitz I gate with its
 * inscription, the Treblinka memorial field, the Buchenwald gate tower and the Mauthausen quarry stairs.
 */
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
const fine = { ...stroke, strokeWidth: 0.9 }

const drawings: { name: string; svg: React.ReactNode }[] = [
  {
    name: 'Auschwitz-Birkenau',
    svg: (
      <>
        <g {...stroke}>
          {/* the long low gatehouse with its central tower and the archway the trains ran through */}
          <path d="M6 78 H194" />
          <path d="M16 78 V52 H80 V34 H120 V52 H184 V78" />
          <path d="M76 34 L100 18 L124 34" /><path d="M80 44 H120" />
          <path d="M88 78 V62 Q100 50 112 62 V78" />
          <path d="M14 52 H80 M120 52 H186" />
        </g>
        <g {...fine}>
          <path d="M93 28 V38 H98 V28 Z M102 28 V38 H107 V28 Z" />
          <path d="M24 78 V62 H30 V78 M38 78 V62 H44 V78 M52 78 V62 H58 V78 M66 78 V62 H72 V78 M128 78 V62 H134 V78 M142 78 V62 H148 V78 M156 78 V62 H162 V78 M170 78 V62 H176 V78" />
          {/* the rails and sleepers running in */}
          <path d="M64 102 L90 78 M136 102 L110 78" />
          <path d="M70 96 H130 M77 90 H123 M83 85 H117 M88 81 H112" />
        </g>
      </>
    ),
  },
  {
    name: 'Auschwitz I',
    svg: (
      <>
        <g {...stroke}>
          {/* the gate: two brick posts, the iron arch, the bars, the lamp */}
          <path d="M40 92 V36 H56 V92 M144 92 V36 H160 V92" />
          <path d="M56 54 Q100 14 144 54" /><path d="M56 66 Q100 30 144 66" />
          <path d="M40 36 H56 M144 36 H160" />
        </g>
        <g {...fine}>
          <path d="M44 46 H52 M44 56 H52 M44 66 H52 M44 76 H52 M44 86 H52 M148 46 H156 M148 56 H156 M148 66 H156 M148 76 H156 M148 86 H156" />
          <path d="M64 92 V61 M74 92 V54 M84 92 V49.5 M94 92 V47.5 M106 92 V47.5 M116 92 V49.5 M126 92 V54 M136 92 V61" />
          <path d="M60 78 H140" />
          <path id="auschwitz-arc" d="M50 70 Q100 20 150 70" fill="none" stroke="none" />
        </g>
        {/* the iron letters sit in the curved band at the top of the gate */}
        <text fontFamily="Inter, Arial, sans-serif" fontSize="7" fontWeight="600" letterSpacing="1.1" fill="currentColor">
          <textPath href="#auschwitz-arc" startOffset="50%" textAnchor="middle">ARBEIT MACHT FREI</textPath>
        </text>
        <path d="M30 92 H170" {...fine} />
      </>
    ),
  },
  {
    name: 'Treblinka',
    svg: (
      <>
        <g {...stroke}>
          {/* the memorial: the granite monolith with its cleft and menorah, in a field of seventeen thousand stones */}
          <path d="M88 86 V30 H112 V86 M84 30 H116 M94 20 H106 L108 30 H92 Z" />
          <path d="M100 42 V58 M94 46 V58 M106 46 V58 M90 50 V58 M110 50 V58 M88 58 H112" />
        </g>
        <g {...stroke} strokeWidth={2.4}>
          <path d="M14 86 V76 M24 86 V70 M34 86 V80 M44 86 V72 M54 86 V78 M64 86 V74 M74 86 V80 M126 86 V78 M136 86 V72 M146 86 V80 M156 86 V74 M166 86 V78 M176 86 V70 M186 86 V80" />
        </g>
        <g {...fine}>
          <path d="M8 94 H192" />
          <path d="M19 94 V88 M29 94 V90 M39 94 V88 M49 94 V91 M59 94 V88 M69 94 V90 M79 94 V89 M121 94 V89 M131 94 V88 M141 94 V91 M151 94 V88 M161 94 V90 M171 94 V88 M181 94 V91" />
        </g>
      </>
    ),
  },
  {
    name: 'Buchenwald',
    svg: (
      <>
        <g {...stroke}>
          {/* the gate building with its clock tower; the words on the gate faced inward, to the prisoners */}
          <path d="M8 90 H192" />
          <path d="M22 90 V48 H178 V90" /><path d="M80 48 V22 H120 V48" /><path d="M76 22 H124 M84 14 H116 L122 22 L78 22 Z" />
          <path d="M88 90 V64 H112 V90" /><circle cx="100" cy="34" r="6" /><path d="M100 34 V29.5 M100 34 L103.5 36" />
          <path d="M32 90 V70 H44 V90 M52 90 V70 H64 V90 M136 90 V70 H148 V90 M156 90 V70 H168 V90" />
        </g>
        <g {...fine}>
          <path d="M22 80 H88 M112 80 H178" />
          <path d="M92 70 H108 M92 76 H108 M92 82 H108" />
        </g>
        <text x="100" y="60" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="6.5" letterSpacing="1.2" fill="currentColor">JEDEM DAS SEINE</text>
      </>
    ),
  },
  {
    name: 'Mauthausen',
    svg: (
      <>
        <g {...stroke}>
          {/* the Stairs of Death climbing out of the quarry to the camp wall and watchtower above */}
          <path d="M6 96 H24 V91 H34 V86 H44 V81 H54 V76 H64 V71 H74 V66 H84 V61 H94 V56 H104 V51 H114 V46 H124 V41 H134 V36 H194" />
          <path d="M150 36 V26 H190" /><path d="M166 26 V14 H178 V26" />
        </g>
        {/* the mass of the hill, as a faint wash */}
        <path d="M24 96 V91 H34 V86 H44 V81 H54 V76 H64 V71 H74 V66 H84 V61 H94 V56 H104 V51 H114 V46 H124 V41 H134 V36 H194 V96 Z" fill="currentColor" fillOpacity="0.12" stroke="none" />
        <g {...fine}>
          <path d="M170 18 H174 M154 30 H160 M182 30 H188" />
          <path d="M6 100 H194" />
        </g>
      </>
    ),
  },
]

export default function CampFrieze() {
  return (
    <ul className="frieze" aria-label="The camps">
      {drawings.map((d) => (
        <li key={d.name}>
          <svg viewBox="0 0 200 104" width="200" height="104" aria-hidden="true">{d.svg}</svg>
          <span>{d.name}</span>
        </li>
      ))}
    </ul>
  )
}

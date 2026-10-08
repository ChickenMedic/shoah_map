// Fetches one representative, freely licensed Wikimedia Commons image for each
// main site in src/data/sites.ts and each person in src/data/perpetrators.ts,
// writing the result (with attribution) to src/data/images.json.
//
// Usage: node scripts/fetch-images.mjs            (npm run data:images)
// No dependencies; Node >= 18 (global fetch).

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(root, 'src/data/images.json')
const UA = 'ShoahEducationProject/0.1 (samdawson93@outlook.com)'
const PAUSE_MS = 300

// ─── Input parsing (no TS compiler: regex over the object literals) ──────────

function parseEntries(file) {
  const src = readFileSync(path.join(root, file), 'utf8')
  const out = []
  // Each object starts with `id: '...'` on one line; grab the fields on that same line.
  const re = /^\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'([^\n]*)/gm
  let m
  while ((m = re.exec(src))) {
    const rest = m[3]
    const kind = /kind:\s*'([^']+)'/.exec(rest)?.[1]
    const life = /life:\s*'([^']+)'/.exec(rest)?.[1]
    out.push({ id: m[1], name: m[2], kind, life })
  }
  return out
}

// ─── HTTP helpers ────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getJSON(url) {
  await sleep(PAUSE_MS)
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`)
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
      return await res.json()
    } catch (e) {
      if (attempt === 2) throw e
      await sleep(1500 * (attempt + 1))
    }
  }
}

const WD = 'https://www.wikidata.org/w/api.php'
const COMMONS = 'https://commons.wikimedia.org/w/api.php'

function q(base, params) {
  const u = new URL(base)
  for (const [k, v] of Object.entries({ format: 'json', origin: '*', ...params })) u.searchParams.set(k, v)
  return u.toString()
}

// ─── Wikidata ────────────────────────────────────────────────────────────────

async function searchEntities(query) {
  const j = await getJSON(q(WD, { action: 'wbsearchentities', language: 'en', uselang: 'en', type: 'item', limit: 10, search: query }))
  return (j.search ?? []).map((s) => ({ id: s.id, label: s.label ?? '', description: s.description ?? '' }))
}

async function getClaims(id) {
  const j = await getJSON(q(WD, { action: 'wbgetentities', ids: id, props: 'claims', languages: 'en' }))
  return j.entities?.[id]?.claims ?? {}
}

function claimValues(claims, prop) {
  return (claims[prop] ?? [])
    .filter((c) => c.rank !== 'deprecated')
    .sort((a, b) => (b.rank === 'preferred') - (a.rank === 'preferred'))
    .map((c) => c.mainsnak?.datavalue?.value)
    .filter((v) => v != null)
}

function birthYear(claims) {
  const t = claimValues(claims, 'P569')[0]?.time
  const m = t && /^[+-](\d{4})/.exec(t)
  return m ? Number(m[1]) : null
}

// ─── Query construction ──────────────────────────────────────────────────────

// Hand-tuned Wikidata search strings where the site name alone is ambiguous or
// the Wikidata label differs from ours.
const SITE_QUERY = {
  auschwitz: ['Auschwitz', 'Auschwitz concentration camp', 'Auschwitz II-Birkenau'],
  treblinka: ['Treblinka extermination camp'],
  belzec: ['Bełżec extermination camp', 'Belzec extermination camp'],
  sobibor: ['Sobibor extermination camp', 'Sobibór extermination camp'],
  chelmno: ['Chełmno extermination camp', 'Kulmhof extermination camp'],
  majdanek: ['Majdanek concentration camp'],
  'maly-trostenets': ['Maly Trostenets extermination camp', 'Maly Trostinets', 'Trostinets'],
  plaszow: ['Płaszów concentration camp', 'Kraków-Płaszów concentration camp'],
  herzogenbusch: ['Herzogenbusch concentration camp', 'Kamp Vught'],
  hinzert: ['Hinzert concentration camp', 'SS-Sonderlager Hinzert'],
  'riga-kaiserwald': ['Kaiserwald concentration camp', 'Riga-Kaiserwald concentration camp'],
  kauen: ['Kauen concentration camp', 'Kovno concentration camp', 'Kaunas Ghetto'],
  vaivara: ['Vaivara concentration camp'],
  jasenovac: ['Jasenovac concentration camp'],
  grafeneck: ['Grafeneck Euthanasia Centre', 'Grafeneck Castle'],
  brandenburg: ['Brandenburg Euthanasia Centre', 'Brandenburg an der Havel Euthanasia Centre'],
  hartheim: ['Hartheim Euthanasia Centre', 'Hartheim Castle'],
  sonnenstein: ['Sonnenstein Euthanasia Centre', 'Pirna-Sonnenstein', 'Sonnenstein Castle'],
  bernburg: ['Bernburg Euthanasia Centre'],
  hadamar: ['Hadamar Euthanasia Centre', 'Hadamar Clinic'],
  westerbork: ['Westerbork transit camp', 'Kamp Westerbork'],
  drancy: ['Drancy internment camp'],
  mechelen: ['Mechelen transit camp', 'Kazerne Dossin'],
  theresienstadt: ['Theresienstadt Ghetto', 'Theresienstadt concentration camp'],
  fossoli: ['Fossoli camp', 'Fossoli di Carpi'],
  'warsaw-ghetto': ['Warsaw Ghetto'],
  'lodz-ghetto': ['Łódź Ghetto', 'Litzmannstadt Ghetto'],
  'krakow-ghetto': ['Kraków Ghetto'],
  'vilna-ghetto': ['Vilna Ghetto', 'Vilnius Ghetto'],
  'minsk-ghetto': ['Minsk Ghetto'],
  'riga-ghetto': ['Riga Ghetto'],
  'bialystok-ghetto': ['Białystok Ghetto'],
  'lwow-ghetto': ['Lwów Ghetto', 'Lviv Ghetto'],
  'budapest-ghetto': ['Budapest Ghetto'],
  'babyn-yar': ['Babi Yar', 'Babyn Yar'],
  ponary: ['Ponary massacre', 'Paneriai'],
  rumbula: ['Rumbula massacre'],
  kamianets: ['Kamianets-Podilskyi massacre'],
  'ninth-fort': ['Ninth Fort'],
}

const KIND_SUFFIX = {
  extermination: 'extermination camp',
  concentration: 'concentration camp',
  euthanasia: 'Euthanasia Centre',
  transit: 'transit camp',
  ghetto: '',
  massacre: 'massacre',
}

const baseName = (name) => name.replace(/\s*\(.*?\)\s*/g, '').trim()

function siteQueries(site) {
  const b = baseName(site.name)
  const list = [...(SITE_QUERY[site.id] ?? [])]
  const suffix = KIND_SUFFIX[site.kind] ?? ''
  if (suffix && !/ghetto/i.test(b)) list.push(`${b} ${suffix}`)
  list.push(b)
  return [...new Set(list)]
}

// Hand-tuned disambiguation for people with common names.
const PERSON_QUERY = {
  muller: ['Heinrich Müller (Gestapo)', 'Heinrich Müller Gestapo'],
  brandt: ['Karl Brandt physician', 'Karl Brandt'],
  koch: ['Karl-Otto Koch', 'Karl Otto Koch'],
  frank: ['Hans Frank Governor-General', 'Hans Frank'],
  kramer: ['Josef Kramer SS', 'Josef Kramer'],
  wirth: ['Christian Wirth SS', 'Christian Wirth'],
  weiss: ['Martin Gottfried Weiss', 'Martin Weiss SS', 'Martin Weiss'],
  hoppe: ['Paul-Werner Hoppe', 'Paul Werner Hoppe'],
  lange: ['Herbert Lange SS', 'Herbert Lange'],
  franz: ['Kurt Franz Treblinka', 'Kurt Franz'],
}

// Per-site rules for the Commons fallback (and for overriding a poor Wikidata P18):
//   search  – Commons full-text queries to try, in order
//   must    – regexes that must ALL match the folded "title + description" text
//   exclude – regex that must NOT match
//   skipP18 – ignore the Wikidata image (known to be a map / drawing / wrong building)
const SITE_RULES = {
  'mittelbau-dora': { search: ['Mittelbau-Dora memorial', 'KZ Mittelbau-Dora'], must: [/dora/] },
  kauen: {
    search: ['Kauno getas', 'Kovno ghetto', 'Kaunas ghetto'],
    must: [/kauno getas|kovno|kaunas ghetto|kauen|vilijampol/],
    exclude: /ninth fort|ix fort|recreation|form|registration/,
  },
  vaivara: { search: ['Vaivara koonduslaagri', 'Vaivara'], must: [/vaivara/, /koondus|holokaust|mälestus|concentration|memorial/] },
  fossoli: { search: ['Campo di Fossoli', 'Fossoli camp'], must: [/fossoli/], exclude: /titho/ },
  'minsk-ghetto': { search: ['Yama memorial Minsk', 'Minsk ghetto memorial'], must: [/minsk/], exclude: /bremen|hamburg|stolperstein/ },
  'bialystok-ghetto': { search: ['Białystok ghetto', 'Bialystok ghetto 1943'], must: [/bialyst|bia.ystok/, /ghetto|getto/], exclude: /synagog/ },
  kamianets: {
    skipP18: true, // Wikidata P18 is a deportation map; Commons has no photo of the site itself
    search: ['Gedenktafel Massaker von Kamenez-Podolsk', 'Kamianets-Podilskyi massacre'],
    must: [/kamenez|kamianets|kamenets|kamieniec|кам.янець/],
    exclude: /funkspruch|protest|png$/,
  },
  theresienstadt: {
    skipP18: true,
    search: ['Theresienstadt ghetto', 'Terezín ghetto museum', 'Terezín Small Fortress'],
    must: [/theresienstadt|terez.n/],
    exclude: /ausweis|eintrittskarte|formular|swingers|karte|certificate|stamp/,
  },
  brandenburg: {
    skipP18: true, // Wikidata P18 shows the Görden prison (1931), not the T4 killing centre
    search: ['Gedenkstätte für die Opfer der „Euthanasie“-Morde Brandenburg', 'Brandenburg Havel Euthanasie Gedenkstätte'],
    must: [/brandenburg|euthanasie/],
  },
  hinzert: { search: ['KZ Hinzert Gedenkstätte', 'Hinzert concentration camp'], must: [/hinzert/] },
}

const SITE_DESC = /concentration camp|extermination camp|death camp|killing cent|killing facilit|ghetto|nazi|massacre|mass execution|mass shooting|euthanasia|transit camp|internment camp|labou?r camp|camp|holocaust|aktion t4|action t4|fort|memorial|shooting/i
const PERSON_DESC = /\bSS\b|nazi|gestapo|german|austrian|schutzstaffel|holocaust|war criminal|physician|politician|officer|commandant/i

// ─── Commons ─────────────────────────────────────────────────────────────────

const BAD_FILE = /\.(svg|gif|pdf|djvu|ogv|webm|tif|tiff)$/i
const BAD_WORDS = /\b(map|maps|karte|plan|lageplan|flag|flagge|logo|coat|wappen|diagram|scheme|chart|stamp|briefmarke|emblem|insignia|seal|signature|unterschrift|autograph|grave|grab|tomb|banknote|coin|poster|plakat|book|cover|drawing|zeichnung|sketch|painting|gemälde|portrait of the painter|street sign|schild|reconstruction model|model|modell|wappen)\b/i

async function searchCommonsFiles(query, limit = 15) {
  const j = await getJSON(q(COMMONS, { action: 'query', list: 'search', srnamespace: 6, srlimit: limit, srsearch: query }))
  return (j.query?.search ?? []).map((s) => s.title)
}

const stripHTML = (s) =>
  (s ?? '')
    // Commons hides duplicate text in display:none spans (e.g. "Unknown author").
    .replace(/<span[^>]*display:\s*none[^>]*>.*?<\/span>/gis, '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

function cleanAuthor(s) {
  let a = stripHTML(s)
  a = a.replace(/^(.+?)\1$/, '$1') // "UnknownUnknown" -> "Unknown"
  // Wiki signatures: "--Name 16:09, 9 September 2007 (UTC)", "Name (talk) 09:46, 12 May 2020 (UTC)"
  a = a.replace(/\s*\(talk\)/g, '').replace(/\s*\d{1,2}:\d{2}, \d{1,2} \w+ \d{4} \(UTC\)/g, '')
  a = a.replace(/^-+\s*/, '').replace(/\s+/g, ' ').trim()
  if (a.length > 160) {
    // Keep the first sentence/clause of long essays.
    const cut = a.search(/[.;]\s/)
    a = (cut > 20 && cut < 160 ? a.slice(0, cut) : a.slice(0, 157).trimEnd() + '…')
  }
  return a
}

// Fold diacritics + lowercase for fuzzy keyword matching.
const fold = (s) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Licences that permit reuse (incl. commercial reuse and derivatives).
function licenceOK(short) {
  if (!short) return false
  const s = short.trim()
  if (/\b(NC|ND)\b|non-?commercial|no derivative/i.test(s)) return false
  return /^(public domain|pd\b|pd-|pdm|cc0|cc[- ]by(-sa)?\b|copyrighted free use|attribution|fal\b|gfdl)/i.test(s)
}

async function imageInfo(fileTitle) {
  const title = fileTitle.startsWith('File:') ? fileTitle : `File:${fileTitle}`
  const j = await getJSON(q(COMMONS, {
    action: 'query', prop: 'imageinfo', iiprop: 'url|extmetadata|size|mime', iiurlwidth: 900,
    iiextmetadatafilter: 'Artist|LicenseShortName|LicenseUrl|Credit|ImageDescription|Permission',
    titles: title, redirects: 1,
  }))
  const page = Object.values(j.query?.pages ?? {})[0]
  const ii = page?.imageinfo?.[0]
  if (!ii) return null
  const md = ii.extmetadata ?? {}
  const v = (k) => md[k]?.value
  return {
    file: page.title,
    url: (ii.thumburl ?? ii.url ?? '').replace(/\?utm_.*$/, ''), // drop Commons' tracking params
    page: ii.descriptionurl,
    author: cleanAuthor(v('Artist')) || cleanAuthor(v('Credit')) || '',
    credit: stripHTML(v('Credit')),
    license: stripHTML(v('LicenseShortName')),
    licenseUrl: v('LicenseUrl') ?? '',
    description: stripHTML(v('ImageDescription')).slice(0, 400),
    mime: ii.mime,
    width: ii.width,
    height: ii.height,
  }
}

// Description text that reveals a non-photograph (map, artwork, document).
const BAD_DESC = /\b(map|maps|karte|lageplan|plan of|site plan|painting|gouache|watercolou?r|aquarell|drawing|zeichnung|kresba|sketch|woodcut|engraving|lithograph|diagram|schematic|infographic|document|dokument|ausweis|form\b|formular|ticket|stamp|banknote)\b/i

function photoOK(info) {
  if (!info) return false
  if (BAD_FILE.test(info.file)) return false
  if (!/^image\/(jpeg|png|webp)$/.test(info.mime ?? '')) return false
  if (BAD_WORDS.test(info.file.replace(/^File:/, '').replace(/[_.-]/g, ' '))) return false
  if (BAD_DESC.test(info.description.slice(0, 120))) return false
  if ((info.width ?? 0) < 400) return false
  return true
}

function relevant(info, rule) {
  if (!rule) return true
  const text = fold(`${info.file} ${info.description}`)
  if (rule.exclude && rule.exclude.test(text)) return false
  return (rule.must ?? []).every((re) => re.test(text))
}

async function firstAcceptable(candidates, notes, { wantPhoto, rule }) {
  const seen = new Set()
  for (const c of candidates) {
    const t = c.startsWith('File:') ? c : `File:${c}`
    if (seen.has(t)) continue
    seen.add(t)
    const info = await imageInfo(t)
    if (!info) { notes.push(`  no imageinfo: ${t}`); continue }
    if (wantPhoto && !photoOK(info)) { notes.push(`  skipped (not a photo): ${info.file}`); continue }
    if (!relevant(info, rule)) { notes.push(`  skipped (not relevant): ${info.file}`); continue }
    if (!licenceOK(info.license)) { notes.push(`  skipped (licence "${info.license || '?'}"): ${info.file}`); continue }
    return info
  }
  return null
}

function pick(info) {
  return {
    file: info.file,
    url: info.url,
    page: info.page,
    author: info.author,
    license: info.license,
    licenseUrl: info.licenseUrl,
    description: info.description,
  }
}

// ─── Resolution ──────────────────────────────────────────────────────────────

async function findWikidataItem(queries, descRe, verify) {
  const tried = []
  for (const query of queries) {
    const results = await searchEntities(query)
    tried.push(`${query} -> ${results.length}`)
    const labelMatch = (r) => fold(r.label) === fold(query)
    // Exact label matches first, then candidates whose description looks right, then the rest.
    const ranked = [
      ...results.filter((r) => labelMatch(r)),
      ...results.filter((r) => !labelMatch(r) && descRe.test(r.description)),
      ...results.filter((r) => !labelMatch(r) && !descRe.test(r.description)),
    ]
    for (const r of ranked.slice(0, 5)) {
      const claims = await getClaims(r.id)
      const ok = await verify(r, claims, labelMatch(r), query)
      if (ok) return { item: r, claims }
    }
  }
  return { item: null, claims: null, tried }
}

// Wikidata classes that identify a Holocaust site item (checked via P31 "instance of").
const SITE_CLASSES = new Set([
  'Q328468', // Nazi concentration camp
  'Q152081', // concentration camp
  'Q153045', // extermination camp
  'Q1751976', // Nazi ghetto
  'Q143912', // ghetto
  'Q3010369', // massacre
  'Q750215', // mass murder
  'Q1763090', // Nazi euthanasia centre
  'Q4283968', // transit camp
  'Q1346147', // internment camp
  'Q10527830', // forced labour camp
  'Q1197685', // subcamp
  'Q5003624', // memorial
  'Q6027306', // Holocaust memorial
])

async function resolveSite(site, notes) {
  const queries = siteQueries(site)
  const { item, claims } = await findWikidataItem(queries, SITE_DESC, (r, claims, labelMatched, query) => {
    const isSiteClass = claimValues(claims, 'P31').some((v) => SITE_CLASSES.has(v.id))
    const handTuned = (SITE_QUERY[site.id] ?? []).includes(query)
    // An exact label match on one of our hand-tuned queries, or a recognised P31, is enough.
    if (labelMatched && (isSiteClass || SITE_DESC.test(r.description) || handTuned)) return true
    if (isSiteClass) return true
    // Otherwise the description must look like a camp/ghetto/massacre and not a person, town or film.
    if (!SITE_DESC.test(r.description)) return false
    if (/\b(film|novel|book|album|song|person|footballer|painter|human settlement|town in|city in|village in|suburb|quarter of)\b/i.test(r.description)) return false
    return true
  })
  if (!item) { notes.push(`  no Wikidata item found (queries: ${queries.join(' | ')})`); }
  else notes.push(`  Wikidata ${item.id} "${item.label}", ${item.description}`)

  const rule = SITE_RULES[site.id]
  // Default relevance rule: some substantial token of the site's name must appear in title/description.
  const tokens = fold(baseName(site.name)).split(/[\s-]+/).filter((t) => t.length >= 4)
  const effRule = rule ?? (tokens.length ? { must: [new RegExp(tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'))] } : null)

  const candidates = []
  if (claims && !rule?.skipP18) candidates.push(...claimValues(claims, 'P18'))

  // Wikidata's chosen image is trusted on subject (only photo + licence checks).
  let info = await firstAcceptable(candidates, notes, { wantPhoto: true })
  if (!info) {
    // Commons full-text search fallback; here the relevance rule applies.
    const b = baseName(site.name)
    const searches = [
      ...(rule?.search ?? []),
      item ? `"${item.label}"` : null,
      `"${b}" ${KIND_SUFFIX[site.kind] ?? ''}`.trim(),
      `${b} memorial`,
    ].filter(Boolean)
    for (const s of searches) {
      const files = await searchCommonsFiles(s)
      notes.push(`  Commons search "${s}" -> ${files.length}`)
      info = await firstAcceptable(files, notes, { wantPhoto: true, rule: effRule })
      if (info) { notes.push('  NOTE: image came from Commons search, not Wikidata P18'); break }
    }
  }
  return info
}

async function resolvePerson(p, notes) {
  const year = Number(/^(\d{4})/.exec(p.life ?? '')?.[1])
  const queries = [...(PERSON_QUERY[p.id] ?? []), p.name]
  const { item, claims } = await findWikidataItem(queries, PERSON_DESC, (r, claims) => {
    const by = birthYear(claims)
    if (!by) return false
    if (year && by !== year) return false
    return claimValues(claims, 'P31').some((v) => v.id === 'Q5') // instance of human
  })
  if (!item) { notes.push(`  no Wikidata item found (queries: ${queries.join(' | ')})`); return null }
  notes.push(`  Wikidata ${item.id} "${item.label}", ${item.description} (born ${birthYear(claims)})`)
  if (!PERSON_DESC.test(item.description)) notes.push(`  WARNING: description does not mention SS/Nazi/German`)

  const candidates = claimValues(claims, 'P18')
  let info = await firstAcceptable(candidates, notes, { wantPhoto: false })
  if (!info) {
    // Fallback: Commons search restricted to files whose title contains every part of the
    // name (folded), so "Dieter Wisliceny" cannot match a file about Günther-Eberhard Wisliceny.
    const tokens = fold(p.name).split(/[\s-]+/).filter((t) => t.length >= 3)
    const files = (await searchCommonsFiles(`"${p.name}"`, 20)).filter((f) => tokens.every((t) => fold(f).includes(t)))
    notes.push(`  Commons search "${p.name}" -> ${files.length} with full name`)
    info = await firstAcceptable(files, notes, { wantPhoto: true })
    if (info) notes.push(`  NOTE: image came from Commons search, not Wikidata P18, verify subject`)
  }
  return info
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const sites = parseEntries('src/data/sites.ts').filter((e) => e.kind)
  const people = parseEntries('src/data/perpetrators.ts').filter((e) => e.life)
  console.log(`Parsed ${sites.length} sites and ${people.length} people.\n`)

  const out = { sites: {}, people: {} }
  const missing = { sites: [], people: [] }

  for (const site of sites) {
    const notes = []
    try {
      const info = await resolveSite(site, notes)
      console.log(`[site] ${site.id} (${site.name})`)
      for (const n of notes) console.log(n)
      if (info) {
        out.sites[site.id] = pick(info)
        console.log(`  -> ${info.file} [${info.license}] by ${info.author || '?'}`)
      } else {
        missing.sites.push(site.id)
        console.log('  -> NOTHING ACCEPTABLE')
      }
    } catch (e) {
      missing.sites.push(site.id)
      console.log(`[site] ${site.id}: ERROR ${e.message}`)
    }
  }

  for (const p of people) {
    const notes = []
    try {
      const info = await resolvePerson(p, notes)
      console.log(`[person] ${p.id} (${p.name}, ${p.life})`)
      for (const n of notes) console.log(n)
      if (info) {
        out.people[p.id] = pick(info)
        console.log(`  -> ${info.file} [${info.license}] by ${info.author || '?'}`)
      } else {
        missing.people.push(p.id)
        console.log('  -> NOTHING ACCEPTABLE')
      }
    } catch (e) {
      missing.people.push(p.id)
      console.log(`[person] ${p.id}: ERROR ${e.message}`)
    }
  }

  // Reviewed by hand and rejected: Kamianets has no photograph of the site on Commons (only a plaque in Budapest),
  // the Wirth portrait's licence claim is doubtful for a 1940s photograph, and the only "Anton Kaindl" on Commons is the
  // grave of a Munich sculptor of the same name.
  delete out.sites.kamianets
  delete out.people.wirth
  delete out.people.kaindl
  writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
  console.log(`\nWrote ${OUT}`)
  console.log(`Sites with image: ${Object.keys(out.sites).length}/${sites.length}`)
  console.log(`People with image: ${Object.keys(out.people).length}/${people.length}`)
  if (missing.sites.length) console.log(`Missing sites: ${missing.sites.join(', ')}`)
  if (missing.people.length) console.log(`Missing people: ${missing.people.join(', ')}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

// Fetches one freely licensed Wikimedia Commons image for each timeline event and each history chapter, using the
// lead image of the matching English Wikipedia article. Output: src/data/eventImages.json. Run: npm run data:event-images
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const UA = 'ShoahEducationProject/0.1 (samdawson93@outlook.com)'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
async function getJSON(url) {
  await sleep(300)
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`)
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
      return await res.json()
    } catch (e) { if (attempt === 2) throw e; await sleep(1500 * (attempt + 1)) }
  }
}
const q = (base, params) => { const u = new URL(base); for (const [k, v] of Object.entries({ format: 'json', ...params })) u.searchParams.set(k, v); return u.toString() }
const stripHTML = (s) => (s ?? '').replace(/<[^>]*>/g, '').replace(/For documentary purposes the German Federal Archive[^.]*\./, '').replace(/\s+/g, ' ').trim()
const licenceOK = (s) => !!s && !/\b(NC|ND)\b|non-?commercial|no derivative/i.test(s) && /^(public domain|pd\b|pd-|pdm|cc0|cc[- ]by(-sa)?\b|copyrighted free use|attribution|fal\b|gfdl)/i.test(s.trim())

async function imageInfo(fileTitle) {
  const j = await getJSON(q('https://commons.wikimedia.org/w/api.php', {
    action: 'query', prop: 'imageinfo', iiprop: 'url|extmetadata|size|mime', iiurlwidth: 1200,
    iiextmetadatafilter: 'Artist|LicenseShortName|LicenseUrl|ImageDescription', titles: fileTitle, redirects: 1,
  }))
  const page = Object.values(j.query?.pages ?? {})[0]
  const ii = page?.imageinfo?.[0]
  if (!ii) return null
  const md = ii.extmetadata ?? {}
  return {
    file: page.title, url: (ii.thumburl ?? ii.url ?? '').replace(/\?utm_.*$/, ''), page: ii.descriptionurl,
    author: stripHTML(md.Artist?.value).slice(0, 120), license: stripHTML(md.LicenseShortName?.value), licenseUrl: md.LicenseUrl?.value ?? '',
    description: stripHTML(md.ImageDescription?.value).slice(0, 300), width: ii.width, height: ii.height, mime: ii.mime,
  }
}

/** The lead image of an English Wikipedia article, if its licence allows reuse */
async function leadImage(title) {
  const j = await getJSON(q('https://en.wikipedia.org/w/api.php', { action: 'query', prop: 'pageimages', piprop: 'name', titles: title, redirects: 1 }))
  const page = Object.values(j.query?.pages ?? {})[0]
  if (!page?.pageimage) return null
  const info = await imageInfo('File:' + page.pageimage)
  if (!info || !/^image\/(jpeg|png)$/.test(info.mime) || info.width < 400 || !licenceOK(info.license)) return null
  return info
}

// Timeline events whose link is not an English Wikipedia article, or which have no link: the article to take the image from
const EVENT_TITLES = {
  '1929-10': 'Great Depression in Germany', '1933-01-30': 'Adolf Hitler\'s rise to power', '1933-03-22': 'Dachau concentration camp',
  '1933-04-01': 'Nazi boycott of Jewish businesses', '1933-05-10': 'Nazi book burnings', '1935-09-15': 'Nuremberg Laws', '1936-07-12': 'Sachsenhausen concentration camp',
  '1938-07-06': 'Évian Conference', '1938-11-09': 'Kristallnacht', '1938-12-02': 'Kindertransport', '1939-01-30': 'Hitler\'s prophecy',
  '1939-08-18': 'Aktion T4', '1939-10': 'Aktion T4', '1940-01': 'Grafeneck Euthanasia Centre', '1939-09-21': 'Jewish ghettos in German-occupied Poland',
  '1940-04-30': 'Łódź Ghetto', '1940-06-14': 'Auschwitz concentration camp', '1940-11-16': 'Warsaw Ghetto', '1941-06-22': 'Einsatzgruppen',
  '1941-09-03': 'Zyklon B', '1941-09-29': 'Babi Yar', '1941-12-08': 'Chełmno extermination camp', '1942-01-20': 'Wannsee Conference',
  '1942-03-17': 'Operation Reinhard', '1942-03-26': 'Auschwitz concentration camp', '1942-07-22': 'Grossaktion Warsaw', '1942-12-16': 'Romani Holocaust',
  '1943-04-19': 'Warsaw Ghetto Uprising', '1943-08-02': 'Treblinka extermination camp', '1943-10-01': 'Rescue of the Danish Jews', '1943-11-03': 'Aktion Erntefest',
  '1944-05-15': 'The Holocaust in Hungary', '1944-08-02': 'Romani Holocaust', '1944-10-07': 'Sonderkommando', '1944-07-23': 'Majdanek concentration camp',
  '1945-01-17': 'Death marches during the Holocaust', '1945-01-27': 'Liberation of Auschwitz concentration camp', '1945-04-11': 'Buchenwald concentration camp',
  '1945-04-15': 'Bergen-Belsen concentration camp', '1945-04-29': 'Liberation of Dachau concentration camp', '1945-05-08': 'German Instrument of Surrender',
  '1945-11-20': 'Nuremberg trials',
}
// Events whose article's lead image is wrong for the moment (a 1920s portrait for 1933; the liberated gate for the camp's
// opening): the Commons file to use instead
const EVENT_FILES = {
  '1933-01-30': 'File:Bundesarchiv Bild 146-1972-026-11, Machtübernahme Hitlers.jpg',
  '1933-03-22': 'File:Bundesarchiv Bild 152-01-14, Dachau, Konzentrationslager 1933.jpg',
}
const CHAPTER_TITLES = {
  origins: 'Mein Kampf', persecution: 'Nuremberg Laws', t4: 'Aktion T4', war: 'Warsaw Ghetto', 'final-solution': 'Auschwitz concentration camp', collapse: 'Liberation of Auschwitz concentration camp',
}

const src = readFileSync(join(here, '../src/data/timeline.ts'), 'utf8')
// one chunk per event, from its date to the next event's date
const events = src.split(/(?=date: ')/).slice(1).map((chunk) => [null, /^date: '([^']+)'/.exec(chunk)[1], /title: '((?:[^'\\]|\\.)*)'/.exec(chunk)?.[1] ?? '', /link: '([^']+)'/.exec(chunk)?.[1]])
const seen = new Set()
const out = { events: {}, chapters: {} }
for (const m of events) {
  const [, date, title, link] = m
  const key = `${date}|${title}`
  if (seen.has(key)) continue
  seen.add(key)
  let article = EVENT_TITLES[date]
  if (!article && link?.startsWith('https://en.wikipedia.org/wiki/')) article = decodeURIComponent(link.slice('https://en.wikipedia.org/wiki/'.length)).replace(/_/g, ' ')
  if (!article && !EVENT_FILES[date]) { console.log('  (no article) ' + title); continue }
  try {
    const img = EVENT_FILES[date] ? await imageInfo(EVENT_FILES[date]) : await leadImage(article)
    console.log((img ? 'ok   ' : 'none ') + date + ' ' + title + '  <- ' + article)
    if (img) out.events[key] = img
  } catch (e) { console.log('fail ' + title + ': ' + e.message) }
}
for (const [id, article] of Object.entries(CHAPTER_TITLES)) {
  try { const img = await leadImage(article); if (img) out.chapters[id] = img; console.log((img ? 'ok   ' : 'none ') + 'chapter ' + id) } catch (e) { console.log('fail chapter ' + id) }
}
writeFileSync(join(here, '../src/data/eventImages.json'), JSON.stringify(out, null, 1))
console.log(`${Object.keys(out.events).length} event images, ${Object.keys(out.chapters).length} chapter images`)

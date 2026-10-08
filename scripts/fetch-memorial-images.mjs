// Fetches one freely licensed Wikimedia Commons photograph for each memorial in src/data/memorials.ts, from the lead
// image of its English Wikipedia article. Output: src/data/memorialImages.json. Run: npm run data:memorials
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
const stripHTML = (s) => (s ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
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
async function leadImage(title) {
  const j = await getJSON(q('https://en.wikipedia.org/w/api.php', { action: 'query', prop: 'pageimages', piprop: 'name', titles: title, redirects: 1 }))
  const page = Object.values(j.query?.pages ?? {})[0]
  if (!page?.pageimage) return null
  const info = await imageInfo('File:' + page.pageimage)
  if (!info || !/^image\/(jpeg|png)$/.test(info.mime) || info.width < 400 || !licenceOK(info.license)) return null
  return info
}

// Where the article's lead image shows the wartime site rather than the memorial, or there is no usable lead image,
// the Commons photograph of the memorial itself
const FILES = {
  'berlin-t4': 'File:Gedenkstaette-tiergartenstr4-02.jpg',
  'berlin-gleis-17': 'File:Berlin-Grunewald Mahnmal Gleis 17 02.jpg',
  dachau: 'File:"Never Again" memorial at Dachau by Wzwz.jpg',
  belsen: 'File:Bergen-Belsen - 2018-02-26 (010).jpg',
  belzec: 'File:Bełżec memorial - Crevasse 02.jpg',
  sobibor: 'File:Sobibór, Były hitlerowski obóz zagłady w Sobiborze - fotopolska.eu (224652).jpg',
  'warsaw-ghetto-heroes': 'File:2021 Warszawa Pomnik Bohaterów Getta, 1.jpg',
  mauthausen: 'File:4310 Mauthausen, KZ-Gedenkstätte Mauthausen Todesstiege 01 2023-07-12.jpg',
  'names-amsterdam': 'File:Holocaust Namenmonument 3 (Amsterdam).jpg',
  westerbork: 'File:Overzicht nationaal herdenkings monument van Kamp Westerbork - Hooghalen - 20420140 - RCE.jpg',
  'babyn-yar': 'File:Пам\'ятник «Менора» (1).jpg',
  ponary: 'File:Memorial to Jewish Holocaust - Paneriai - Outside Vilnius - Lithuania - 01 (27228628743).jpg',
  'yad-vashem': 'File:Yad Vashem Hall of Names by David Shankbone.jpg',
}

const src = readFileSync(join(here, '../src/data/memorials.ts'), 'utf8')
const entries = [...src.matchAll(/id: '([^']+)'[\s\S]*?article: '((?:[^'\\]|\\.)*)'/g)].map((m) => [m[1], m[2].replace(/\\'/g, "'")])
const out = {}
for (const [id, article] of entries) {
  try {
    const img = FILES[id] ? await imageInfo(FILES[id]) : await leadImage(article)
    console.log((img ? 'ok   ' : 'none ') + id + '  <- ' + article)
    if (img) out[id] = img
  } catch (e) { console.log('fail ' + id + ': ' + e.message) }
}
writeFileSync(join(here, '../src/data/memorialImages.json'), JSON.stringify(out, null, 1))
console.log(`${Object.keys(out).length} of ${entries.length} memorials have a photograph`)

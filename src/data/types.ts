export type Era = 'origins' | 'persecution' | 't4' | 'war' | 'genocide' | 'collapse'

export interface TimelineEvent {
  /** ISO-style date; may be YYYY, YYYY-MM or YYYY-MM-DD */
  date: string
  title: string
  text: string
  era: Era
  /** [lat, lng] where the event belongs on the map, if it has a place */
  place?: [number, number]
  /** A campaign or battle rather than an act of persecution; drawn differently on the map */
  military?: boolean
  /** Where to read more (USHMM Holocaust Encyclopedia or Wikipedia) */
  link?: string
}

export type SiteKind = 'concentration' | 'extermination' | 'euthanasia' | 'transit' | 'ghetto' | 'massacre'

export interface Site {
  id: string
  name: string
  kind: SiteKind
  lat: number
  lng: number
  /** Present-day country */
  country: string
  /** YYYY-MM */
  opened: string
  /** YYYY-MM */
  closed: string
  /** Display string for the period of operation */
  period: string
  liberated?: string
  /** Estimated deaths, as a display string */
  deaths?: string
  summary: string
}

export interface Subcamp {
  id: string
  name: string
  parent: string
  lat?: number
  lng?: number
  country?: string
  /** YYYY-MM */
  opened?: string
  /** YYYY-MM */
  closed?: string
  /** Where the dates came from */
  dates?: 'wikidata' | 'wikipedia' | 'register'
  /** Entry number in the German federal register of camps (BEG, 6th implementing regulation) */
  register?: string
  wiki?: string
}

/** One month's Axis-controlled area, from public/data/fronts.json; coordinates are GeoJSON [lng, lat] */
export interface FrontFrame {
  month: string
  approx: boolean
  axis: number[][][][]
}

/** Rail geometry for a transport, from src/data/routes.json; points are [lat, lng] */
export interface RouteGeometry {
  points: [number, number][]
  km: number
  engine?: string
}

export interface Transport {
  id: string
  from: string
  to: string
  /** Destination site ids (sites.ts), for colouring; more than one where a route fed several camps */
  toIds: string[]
  fromLatLng: [number, number]
  toLatLng: [number, number]
  /** Documented intermediate stations the rail routing must pass through */
  via?: [number, number][]
  /** For deportations that began by ship: the port where the rail journey started */
  sea?: [number, number]
  /** The ship's course, when a straight line from the origin to the port would cross land */
  seaPath?: [number, number][]
  /** Where the rail journey ended when the camp itself had no station */
  railTo?: [number, number]
  /** YYYY-MM */
  start: string
  /** YYYY-MM */
  end: string
  period: string
  people: string
  note: string
}

export interface Perpetrator {
  id: string
  name: string
  life: string
  role: string
  group: 'leadership' | 'ss' | 't4' | 'camps' | 'administration'
  /** id of the superior in the chain of command; absent for Hitler */
  reportsTo?: string
  text: string
  fate: string
}

export interface VictimStory {
  id: string
  name: string
  life: string
  from: string
  group: string
  text: string
  /** True for those who survived and bore witness */
  survivor?: boolean
  /** Museums, memorials and collections devoted to the person */
  links?: { label: string; url: string }[]
}

export interface Video {
  id: string
  title: string
  description: string
  /** 'youtube' and 'vimeo' take a video id in `src`; 'file' takes a path under /public or a URL */
  provider: 'youtube' | 'vimeo' | 'file'
  src: string
  credit: string
  /** Optional chapter id from history.ts this film belongs with */
  chapter?: string
}

export interface Chapter {
  id: string
  years: string
  title: string
  lead: string
  paragraphs: string[]
  quote?: { text: string; source: string }
}

/** A Wikimedia Commons image with attribution, from src/data/images.json */
export interface CommonsImage {
  file: string
  url: string
  page: string
  author?: string
  license: string
  licenseUrl?: string
  description?: string
  /** pixel size of the original, where the fetch recorded it */
  width?: number
  height?: number
}

/** A film on Wikimedia Commons, from src/data/films.json */
export interface Film {
  id: string
  title: string
  year: number
  description: string
  url: string
  poster: string
  duration?: number
  page: string
  author: string
  license: string
  licenseUrl?: string
  chapter: string
  graphic?: boolean
  sources?: { src: string; type: string; width?: number; height?: number }[]
}

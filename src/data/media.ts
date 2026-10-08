import type { Video } from './types'

// Add films and testimony here. Check the licence of anything you embed.
// Example:
// {
//   id: 'liberation-of-dachau',
//   title: 'The liberation of Dachau',
//   description: 'US Army Signal Corps footage, April–May 1945.',
//   provider: 'youtube',   // 'youtube' | 'vimeo' | 'file'
//   src: 'VIDEO_ID',       // for 'file', a path such as 'media/dachau.mp4' placed in /public
//   credit: 'US National Archives',
//   chapter: 'collapse',   // optional: a chapter id from history.ts
// },
export const videos: Video[] = []

export const archives = [
  {
    name: 'USC Shoah Foundation: Visual History Archive',
    url: 'https://sfi.usc.edu/',
    text: 'More than 55,000 video testimonies of survivors and witnesses.',
  },
  {
    name: 'USHMM: Steven Spielberg Film and Video Archive',
    url: 'https://collections.ushmm.org/search/?f%5Brecord_type_facet%5D%5B%5D=Film',
    text: 'Historical footage from the 1920s to 1948, much of it downloadable.',
  },
  {
    name: 'Yad Vashem: Video testimonies and films',
    url: 'https://www.yadvashem.org/',
    text: 'Survivor testimony, lectures and archival film.',
  },
  {
    name: 'Fortunoff Video Archive for Holocaust Testimonies',
    url: 'https://fortunoff.library.yale.edu/',
    text: 'Yale University’s collection of over 4,400 testimonies, begun in 1979.',
  },
]

// One colour per main concentration camp, shared by its subcamps on the map
export const campColors: Record<string, string> = {
  dachau: '#e4b04a',
  buchenwald: '#d9793b',
  sachsenhausen: '#c94f4f',
  mauthausen: '#b83a7c',
  flossenburg: '#8e5bc7',
  ravensbruck: '#6a78d8',
  neuengamme: '#3f8fd1',
  'gross-rosen': '#35b0b8',
  natzweiler: '#3fae7a',
  stutthof: '#8fbf3f',
  'bergen-belsen': '#d4c53c',
  'mittelbau-dora': '#e08a6a',
  auschwitz: '#f0ece2',
  majdanek: '#cfc3a5',
  plaszow: '#a67c52',
  herzogenbusch: '#7fb7a3',
  hinzert: '#b0a0d8',
  kauen: '#d99cae',
  vaivara: '#9cc9e8',
  'riga-kaiserwald': '#c7d59c',
}

// Deportation routes are coloured by destination: the camp colours above, plus the killing centres and ghettos
// that had no subcamps of their own
export const destinationColors: Record<string, string> = {
  ...campColors,
  treblinka: '#e06060',
  belzec: '#e08a3c',
  sobibor: '#d9c13c',
  chelmno: '#9ad36a',
  'maly-trostenets': '#b58aff',
  'riga-ghetto': '#6aa5e0',
  'lodz-ghetto': '#e0a0c0',
  'minsk-ghetto': '#c08ad8',
  'ninth-fort': '#d99cae',
  theresienstadt: '#a9b38c',
  'vienna-strasshof': '#8fa3b8',
}

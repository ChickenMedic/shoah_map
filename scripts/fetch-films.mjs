// Builds src/data/films.json: public-domain or freely licensed historical films hosted on Wikimedia Commons
// that the Films page can embed directly in an HTML5 <video> element.
//
//   node scripts/fetch-films.mjs            fetch metadata for the curated files below and write the JSON
//   node scripts/fetch-films.mjs --search   print Commons video hits for the discovery queries (no file written)
//
// The curated list is the result of the discovery searches: files were accepted only when Commons gives a clear
// public-domain or Creative Commons licence (checked again at run time from extmetadata), the media type is VIDEO,
// and the footage itself is historical. Titles, years, descriptions and chapter tags are maintained here;
// URLs, posters, durations, authors and licences come from the Commons API.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const OUT = join(here, '../src/data/films.json')
const API = 'https://commons.wikimedia.org/w/api.php'
const UA = 'ShoahEducationProject/0.1 (samdawson93@outlook.com)'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Search queries used to find candidates. `filetype:video` restricts CirrusSearch to video files. */
const SEARCHES = [
  'Nazi Concentration Camps 1945 filetype:video',
  'Death Mills filetype:video',
  'concentration camp 1945 filetype:video',
  'Signal Corps concentration camp filetype:video',
  'Buchenwald filetype:video',
  'Dachau 1945 filetype:video',
  'Bergen-Belsen filetype:video',
  'Mauthausen filetype:video',
  'Ohrdruf filetype:video',
  'Auschwitz 1945 filetype:video',
  'Nuremberg trial filetype:video',
  'Westerbork film filetype:video',
  'Warsaw ghetto film filetype:video',
  'Kristallnacht filetype:video',
  'Jews 1938 filetype:video',
  'Hitler Reichstag filetype:video',
  'Eichmann filetype:video',
  'deportation Jews film filetype:video',
]

/**
 * Curated films. `file` is the Commons title; everything else is editorial. `author` overrides the Commons credit
 * where that field holds a paragraph rather than a name.
 * chapter: origins | persecution | t4 | war | final-solution | collapse
 * graphic: footage shows bodies
 */
const FILMS = [
  {
    id: 'nuremberg-laws-1935',
    file: 'File:Adolf Hitler and Hermann Göring present the Nuremberg laws.webm',
    title: 'Hitler and Göring announce the Nuremberg Laws',
    year: 1935,
    chapter: 'persecution',
    graphic: false,
    description:
      'Newsreel record of the special Reichstag session held during the Nazi party rally in Nuremberg on 15 September 1935. Hitler speaks briefly, then Göring reads out the Reich Citizenship Law and the Law for the Protection of German Blood and German Honour, which stripped Jews of citizenship and criminalised marriage between Jews and non-Jews.',
  },
  {
    id: 'vienna-summer-1938',
    author: 'Lafayette P. Monson (Prelinger Archives)',
    file: 'File:0254 HM Monson Collection Vienna 1938 01 49 45 00.webm',
    title: 'Vienna, summer 1938',
    year: 1938,
    chapter: 'persecution',
    graphic: false,
    description:
      'Amateur footage shot by the American physician Lafayette P. Monson while passing through Vienna a few months after the Anschluss. It records an antisemitic Stürmer billboard in front of the State Opera and slogans daubed on a Jewish cafe and Jewish shops in the Leopoldstadt district.',
  },
  {
    id: 'warsaw-ghetto-propaganda-film-1942',
    file: 'File:Propaganda filming of the Warsaw Ghetto including arrivals, Jewish Council, police, prison.webm',
    title: 'Warsaw Ghetto: German propaganda footage',
    year: 1942,
    chapter: 'war',
    graphic: false,
    description:
      'Unfinished footage shot in the Warsaw ghetto by a Wehrmacht propaganda company in May 1942, two months before the mass deportations to Treblinka began. The scenes were staged to contrast wealthy and destitute Jews and the film was never released. This reel shows arrivals at the ghetto, the Jewish Council, the Jewish police and the ghetto prison.',
  },
  {
    id: 'westerbork-1944-act-1',
    file: 'File:Westerbork 1944 (Acte 1).webm',
    title: 'Westerbork 1944, act 1',
    year: 1944,
    chapter: 'final-solution',
    graphic: false,
    description:
      'The first reel of the film shot inside the Westerbork transit camp by the Jewish prisoner Rudolf Breslauer on the orders of the commandant, Albert Gemmeker. It includes the departure of the transport of 19 May 1944 to Auschwitz and Bergen-Belsen, among the very few surviving moving images of a deportation train. Breslauer was murdered at Auschwitz in 1945.',
  },
  {
    id: 'auschwitz-soviet-film-reel-1-1945',
    author: 'Soviet Army Film Unit (Central Documentary Film Studio)',
    file: 'File:Auschwitz (Ozwiecim) Reel 1 (1945).webm',
    title: 'Auschwitz, Soviet Army film, reel 1',
    year: 1945,
    chapter: 'final-solution',
    graphic: true,
    description:
      'Footage shot by Soviet Army cameramen after the Red Army reached Auschwitz on 27 January 1945, showing survivors behind the wire, the camp under snow, plans of the crematoria, the dead, and the evacuation of the sick and of children. The film was shown at Nuremberg as Prosecution Exhibit 228.',
  },
  {
    id: 'buchenwald-newsreel-1945',
    file: 'File:Buchenwald concentration camp newsreel.webm',
    title: 'Buchenwald, US Army newsreel',
    year: 1945,
    chapter: 'collapse',
    graphic: true,
    description:
      'A US Army Signal Corps newsreel filmed after the 6th Armored Division reached Buchenwald on 11 April 1945. It shows surviving prisoners, the crematorium and the piles of dead, and the citizens of nearby Weimar who were ordered to walk through the camp.',
  },
  {
    id: 'nordhausen-newsreel-1945',
    file: 'File:Nordhausen concentration camp newsreel.webm',
    title: 'Nordhausen (Boelcke-Kaserne), US Army newsreel',
    year: 1945,
    chapter: 'collapse',
    graphic: true,
    description:
      'Newsreel shot by the US Army Signal Corps after American troops reached the Boelcke-Kaserne at Nordhausen on 11 April 1945. The barracks had served as a dying camp for prisoners of Mittelbau-Dora who were too sick to work. The film records the dead and the German civilians made to bury them.',
  },
  {
    id: 'dachau-colour-sfp186-1945',
    author: 'US Army Air Forces, Special Film Project 186',
    file: 'File:SFP 186 - Dachau.webm',
    title: 'Dachau in colour, Special Film Project 186',
    year: 1945,
    chapter: 'collapse',
    graphic: true,
    description:
      'Silent colour footage shot at Dachau around 1 May 1945 by a cameraman of the US Army Air Forces Special Film Project 186, days after the camp was liberated on 29 April. It shows the camp and its survivors shortly after liberation, and the dead who were left behind.',
  },
  {
    id: 'gusen-mauthausen-1945',
    author: 'US Army Signal Corps',
    file: 'File:Gusen (War Crimes Commission film).webm',
    title: 'Mauthausen and Gusen, War Crimes Commission film',
    year: 1945,
    chapter: 'collapse',
    graphic: true,
    description:
      'Footage shot by US Army cameramen at the Gusen camp of the Mauthausen complex in Upper Austria after its liberation on 5 May 1945, catalogued under the title Mauthausen Concentration Camp. It formed part of the evidence film shown at the Nuremberg trial.',
  },
  {
    id: 'nazi-concentration-camps-1945',
    author: 'US Army Signal Corps, directed by George Stevens, James B. Donovan and E. Ray Kellogg',
    file: 'File:Nazi Concentration Camps.webm',
    title: 'Nazi Concentration Camps',
    year: 1945,
    chapter: 'collapse',
    graphic: true,
    description:
      'Compiled by the US Army Signal Corps from footage shot by Allied cameramen at Ohrdruf, Buchenwald, Dachau, Bergen-Belsen, Mauthausen and other camps as they were liberated in April and May 1945. It was entered in evidence at the Nuremberg trial on 29 November 1945 and runs just under an hour.',
  },
  {
    id: 'death-mills-1945',
    author: 'US War Department, Army Signal Corps, supervised by Billy Wilder',
    file: 'File:Death Mills (1945).webm',
    title: 'Death Mills (Die Todesmühlen)',
    year: 1945,
    chapter: 'collapse',
    graphic: true,
    description:
      'A US War Department documentary, supervised by Billy Wilder, assembled from liberation footage for screening to German civilians in the American occupation zone. It opens and closes at Gardelegen, where townspeople were ordered to carry crosses to the barn in which more than a thousand prisoners had been burned alive.',
  },
  {
    id: 'orphans-of-buchenwald-1945',
    file: 'File:Orphans of Buchenwald Ex-Prisoners Coming Home Air Views HQ and Camps (1945).webm',
    title: 'Orphans of Buchenwald and ex-prisoners coming home',
    year: 1945,
    chapter: 'collapse',
    graphic: false,
    description:
      'US Army footage from the weeks after liberation, released by the US National Archives. It shows the child survivors of Buchenwald, freed prisoners setting out for home, and aerial views of the camp and of Allied headquarters.',
  },
  {
    id: 'nuremberg-testimony-rajzman-sutzkever-1946',
    file: 'File:Samuel Raizman and Avraham Suzkever testify at Nuremberg Trial.webm',
    title: 'Survivors testify at Nuremberg: Samuel Rajzman and Abraham Sutzkever',
    year: 1946,
    chapter: 'collapse',
    graphic: false,
    description:
      'Signal Corps footage of the International Military Tribunal on 27 February 1946. Samuel Rajzman, a survivor of the Treblinka uprising, is sworn in and begins his account of the killing centre. The Yiddish poet Abraham Sutzkever, who survived the Vilna ghetto and fought with the partisans, also testifies.',
  },
  {
    id: 'nuremberg-verdict-newsreel-1946',
    file: 'File:1946-10-08 21 Nazi Chiefs Guilty.ogv',
    title: 'Twenty-one Nazi Chiefs Guilty (Universal Newsreel)',
    year: 1946,
    chapter: 'collapse',
    graphic: false,
    description:
      'Universal Newsreel report of 8 October 1946 on the judgment of the International Military Tribunal at Nuremberg at the end of a ten month trial. Universal placed its newsreel library in the public domain when it was donated to the US National Archives.',
  },
  {
    id: 'eichmann-trial-newsreel-1961',
    file: 'File:1961-04-13 Tale Of Century - Eichmann Tried For War Crimes.ogv',
    title: 'Eichmann Tried for War Crimes (Universal Newsreel)',
    year: 1961,
    chapter: 'collapse',
    graphic: false,
    description:
      'Universal Newsreel report from Jerusalem on the trial of Adolf Eichmann, who had organised the deportation of Jews to the killing centres and was seized in Argentina by Israeli agents in 1960. He sat in a bulletproof glass booth throughout the trial and was sentenced to death in December 1961.',
  },
  {
    id: 'anschluss-newsreel-1938',
    author: 'UFA newsreel, filed as evidence in the Ministries case at Nuremberg',
    file: 'File:"German Entry into Austria" 01 35 03 00 to 01 44 03 00.webm',
    title: 'The German entry into Austria',
    year: 1938,
    chapter: 'persecution',
    graphic: false,
    description:
      'A German UFA newsreel of the Anschluss in March 1938, with its original German narration: the army motorcade crossing the border, the entry into Vienna and the cheering crowds. Within days of these scenes the Jews of Vienna were being made to scrub pavements, and the first of 65,000 Austrian Jews to be murdered were on their way to Dachau.',
  },
  {
    id: 'kindertransport-prague-1939',
    file: 'File:Czech Jewish children evacuated via airplane (1939).webm',
    title: 'Children leave Prague for London',
    year: 1939,
    chapter: 'persecution',
    graphic: false,
    description:
      'Newsreel footage from Ruzyně airport, Prague, on 11 January 1939: some thirty children of refugees take leave of their parents and board two Dutch aircraft for London, the first of the Czech transports arranged by Nicholas Winton, who appears near the end wearing glasses. Winton’s trains brought 669 children to Britain before the war closed the route.',
  },
  {
    id: 'warsaw-ghetto-colour-1942',
    author: 'Willy Wist (private footage, via USHMM)',
    file: 'File:Warsaw Ghetto in color - Film 1942.webm',
    title: 'The Warsaw ghetto in colour',
    year: 1942,
    chapter: 'war',
    graphic: true,
    description:
      'Rare colour film shot privately in the Warsaw ghetto in about May 1942 by a German cameraman working with the propaganda unit. The gates open for a vehicle; market stalls and crowded pavements; Jews in armbands; and men loading the bodies of those who had died of hunger and typhus into a pit. In the ghetto that spring some 4,000 people were dying every month.',
  },
  {
    id: 'warsaw-ghetto-propaganda-film-reel-2-1942',
    file: 'File:Propaganda filming of the Warsaw Ghetto including prison, street, corpses, burial.webm',
    title: 'Warsaw Ghetto: German propaganda footage, second reel',
    year: 1942,
    chapter: 'war',
    graphic: true,
    description:
      'A second reel of the unfinished Wehrmacht propaganda film of May 1942: the ghetto prison, street scenes, the bodies of the dead lying on the pavements, and mass burials in the Jewish cemetery. The crew staged scenes of well-dressed Jews ignoring the dying; the dead themselves were not staged.',
  },
  {
    id: 'deportation-poland-1942',
    file: 'File:Deportation of Jews video (1942).webm',
    title: 'A deportation in occupied Poland',
    year: 1942,
    chapter: 'final-solution',
    graphic: false,
    description:
      'Twenty seconds of film, shot at an unidentified town in occupied Poland in 1942, showing Jews being marched off under guard by SS men and Polish “Blue” police. Scenes like this took place in hundreds of towns in that year, as the ghettos of the General Government were emptied into Bełżec, Sobibór and Treblinka.',
  },
  {
    id: 'westerbork-1944-remaining',
    file: 'File:Westerbork 1944 (restmateriaal 1).webm',
    title: 'Westerbork 1944, remaining material',
    year: 1944,
    chapter: 'final-solution',
    graphic: false,
    description:
      'Further footage from Rudolf Breslauer’s film of the Westerbork transit camp, shot in the spring of 1944 on the orders of the commandant, Gemmeker, to show a productive, orderly camp. The workshops and the camp farm are shown alongside the trains. Of the 107,000 people deported through Westerbork, about 5,000 survived.',
  },
  {
    id: 'auschwitz-soviet-film-reel-2-1945',
    author: 'Soviet Army Film Unit (Central Documentary Film Studio)',
    file: 'File:Auschwitz (Ozwiecim) Reel 2 (1945).webm',
    title: 'Auschwitz, Soviet Army film, reel 2',
    year: 1945,
    chapter: 'final-solution',
    graphic: true,
    description:
      'The second reel of the Soviet film shown at Nuremberg as Prosecution Exhibit 229. Children show the numbers tattooed on their arms; a procession of children moves inside the barbed wire; the camera records the remains of the dead, the warehouses of belongings and the medical examination of survivors.',
  },
  {
    id: 'hanover-ahlem-newsreel-1945',
    file: 'File:Hanover concentration camp newsreel (1945).webm',
    title: 'Hanover-Ahlem, US Army newsreel',
    year: 1945,
    chapter: 'collapse',
    graphic: true,
    description:
      'A US Army Signal Corps newsreel from the Ahlem camp outside Hanover, a subcamp of Neuengamme whose prisoners were worked in an asphalt mine, liberated by the US 84th Infantry Division on 10 April 1945. It shows the survivors and the dead found in the camp.',
  },
  {
    id: 'dora-tour-1945',
    author: 'US Army Signal Corps',
    file: 'File:Tour of Dora concentration camp.webm',
    title: 'Mittelbau-Dora: a congressional tour',
    year: 1945,
    chapter: 'collapse',
    graphic: true,
    description:
      'Signal Corps footage of 16 May 1945 following Congressman Everett Dirksen of Illinois and Commander John S. Young through Mittelbau-Dora, the camp whose prisoners dug the tunnels and built the V-2 rockets. Delegations of this kind were sent at Eisenhower’s request so that the camps could not later be denied.',
  },
  {
    id: 'mauthausen-signal-corps-1945',
    author: 'US Army Signal Corps',
    file: 'File:KESSELRING MEETING, ZELLAM SEE, AUSTRIA ; FIELD MARSHAL KESSELRING, BERTCHESGADEN, GERMANY; CONCENTRATION CAMP, MAUTHAUSEN, GERMANY (NAID 18128).webm',
    title: 'Mauthausen, US Army Signal Corps film',
    year: 1945,
    chapter: 'collapse',
    graphic: true,
    description:
      'A Signal Corps reel of 11 May 1945, six days after the liberation of Mauthausen. It opens with Field Marshal Kesselring’s surrender meeting at Zell am See and Berchtesgaden, then turns to the camp, where, in the National Archives’ words, the cameraman filmed the human wreckage as evidence of Nazi atrocities.',
  },
  {
    id: 'belsen-trial-newsreel-1945',
    author: 'French newsreel',
    file: 'File:Procès des bourreaux du camp de Belsen.webm',
    title: 'The Belsen trial',
    year: 1945,
    chapter: 'collapse',
    graphic: false,
    description:
      'A French newsreel from the British military court at Lüneburg, which tried the commandant Josef Kramer and 44 other SS staff and prisoner functionaries of Bergen-Belsen and Auschwitz between September and November 1945. Eleven, including Kramer and Irma Grese, were hanged on 13 December 1945.',
  },
  {
    id: 'nuremberg-testimony-boix-1946',
    author: 'US Army Signal Corps',
    file: 'File:Francisco Boix testimony at Nuremberg trials.webm',
    title: 'Francisco Boix testifies at Nuremberg',
    year: 1946,
    chapter: 'collapse',
    graphic: false,
    description:
      'On 29 January 1946 Francisco Boix, a Spanish Republican who had worked in the photographic laboratory of Mauthausen and smuggled out negatives taken by the SS, identifies the defendants Speer and Kaltenbrunner as visitors to the camp. His photographs were used in evidence at Nuremberg and Dachau.',
  },
  {
    id: 'nuremberg-testimony-sutzkever-szmaglewska-1946',
    author: 'US Army Signal Corps',
    file: 'File:Abraham Sutzkever and Seweryna Szmaglewska testify before the International Military Tribunal.webm',
    title: 'Sutzkever and Szmaglewska testify at Nuremberg',
    year: 1946,
    chapter: 'collapse',
    graphic: false,
    description:
      'The sitting of 27 February 1946. The poet Abraham Sutzkever, who survived two years in the Vilna ghetto and fought with the partisans, gives evidence; then Seweryna Szmaglewska, a Polish writer who spent more than two years in Birkenau, describes through an interpreter what she saw of the murder of children there.',
  },
  {
    id: 'krakow-auschwitz-trial-1947',
    author: 'The March of Time (Jean Pages)',
    file: 'File:The Trial of Forty German Butchers of Auschwitz Camp.webm',
    title: 'The Kraków Auschwitz trial',
    year: 1947,
    chapter: 'collapse',
    graphic: false,
    description:
      'March of Time footage shot in Kraków in November 1947, during the trial of forty members of the Auschwitz staff before the Polish Supreme National Tribunal. After scenes of the city, the camera goes into the courtroom where the former commandant Arthur Liebehenschel, Maria Mandl and others sat in the dock. Twenty-three were sentenced to death.',
  },
  {
    id: 'testimony-sobolewski-1992',
    author: 'Vancouver Holocaust Education Centre',
    file: 'File:Sigmund Sobolewski 1992 - resistance at auschwitz.webm',
    title: 'Sigmund Sobolewski: resistance at Auschwitz',
    year: 1992,
    chapter: 'testimony',
    graphic: false,
    description:
      'Sigmund Sobolewski was prisoner number 88, one of the 728 Polish political prisoners on the first transport to Auschwitz on 14 June 1940. He survived four and a half years in the camp. In this recording from 1992 he describes resistance inside Auschwitz.',
  },
  {
    id: 'testimony-boraks-nemetz-2010',
    author: 'Vancouver Holocaust Education Centre',
    file: 'File:Lillian Boraks Nemetz 2010 - warsaw ghetto.webm',
    title: 'Lillian Boraks-Nemetz: the Warsaw ghetto',
    year: 2010,
    chapter: 'testimony',
    graphic: false,
    description:
      'Lillian Boraks-Nemetz was a child in the Warsaw ghetto. She was smuggled out and survived the war in hiding under a false identity; much of her family was murdered. Here she recalls life inside the ghetto walls.',
  },
  {
    id: 'testimony-parker-2010',
    author: 'Vancouver Holocaust Education Centre',
    file: 'File:Peter Parker 2010 - 8 - Deportation to Auschwitz 1.webm',
    title: 'Peter Parker: deportation to Auschwitz',
    year: 2010,
    chapter: 'testimony',
    graphic: false,
    description:
      'The survivor Peter Parker describes being deported to Auschwitz: the sealed wagon, the journey, and the arrival on the ramp. Recorded by the Vancouver Holocaust Education Centre in 2010.',
  },
  {
    id: 'testimony-kornfeld-2013',
    author: 'Vancouver Holocaust Education Centre',
    file: 'File:Chaim Kornfeld 2013 - arrival at auschwitz 1.webm',
    title: 'Chaim Kornfeld: arrival at Auschwitz',
    year: 2013,
    chapter: 'testimony',
    graphic: false,
    description:
      'Chaim Kornfeld recalls the first hours at Auschwitz-Birkenau: the selection on the ramp, the separation of families, and what the older prisoners told the newcomers about where the smoke came from. Recorded in 2013.',
  },
  {
    id: 'testimony-sonnenschein-1990',
    author: 'Vancouver Holocaust Education Centre',
    file: 'File:Bronia Sonnenschein 1990 - stutthof.webm',
    title: 'Bronia Sonnenschein: Stutthof',
    year: 1990,
    chapter: 'testimony',
    graphic: false,
    description:
      'Bronia Sonnenschein, who survived the Łódź ghetto and Auschwitz, describes Stutthof, the camp east of Danzig to which she was sent in 1944 and where tens of thousands died of hunger, typhus and the death marches of 1945.',
  },
  {
    id: 'testimony-lowenberg-1993',
    author: 'United States Holocaust Memorial Museum (interviewer Joan Ringelheim)',
    file: 'File:Interview William J Lowenberg 1993 - KZ Außenlager Kaufering Landsberg - subcamp Dachau 1944 1945.webm',
    title: 'William J. Lowenberg: the Kaufering camps',
    year: 1993,
    chapter: 'testimony',
    graphic: false,
    description:
      'An excerpt from a 1993 oral history. William Lowenberg, deported from the Netherlands through Westerbork and Theresienstadt to Auschwitz, was sent in 1944 to Kaufering, the complex of Dachau subcamps whose prisoners built underground aircraft factories. He describes the earth huts, the hunger, the typhus and the mass graves.',
  },
  {
    id: 'testimony-reiter-1990',
    author: 'United States Holocaust Memorial Museum (interviewer Robert Buckley)',
    file: 'File:Interview Ernst Reiter 1990 - KZ Flossenbürg.webm',
    title: 'Ernst Reiter: a Jehovah’s Witness in Flossenbürg',
    year: 1990,
    chapter: 'testimony',
    graphic: false,
    description:
      'Ernst Reiter, born in Graz in 1915, became a Jehovah’s Witness in about 1931. After the Anschluss he refused military service and was sent to Flossenbürg, where Witnesses wore the purple triangle and could have freed themselves at any time by signing a declaration renouncing their faith. Most, like Reiter, refused.',
  },
  {
    id: 'testimony-friedlaender-2022',
    author: 'ZDF, Terra X',
    file: 'File:Interview mit Holocaust-Überlebender Margot Friedländer.webm',
    title: 'Margot Friedländer: Theresienstadt and after',
    year: 2022,
    chapter: 'testimony',
    graphic: false,
    description:
      'In German. Margot Friedländer, born in Berlin in 1921, hid in the city for fifteen months after her mother and brother were deported, was betrayed in 1944 and sent to Theresienstadt. She returned to Berlin in 2010 at the age of 88 and spoke to schools until shortly before her death in 2025, aged 103. Here she speaks of the beginning of her persecution and of what she asks of those who listen.',
  },
]

/** Licence short names Commons uses that we accept. */
const LICENCE_OK = /^(public domain|pd\b|cc0|cc[ -]by(?:[ -]sa)?\b)/i

async function api(params) {
  const u = new URL(API)
  for (const [k, v] of Object.entries({ ...params, format: 'json', formatversion: 2 })) u.searchParams.set(k, v)
  const res = await fetch(u, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${u}`)
  const json = await res.json()
  await sleep(300)
  return json
}

const strip = (s) =>
  (s ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

/** Drops the utm_* tracking parameters Commons appends to upload URLs. */
const clean = (url) => (url ? url.replace(/\?utm_[^#]*$/, '') : url)

function normaliseAuthor(artist, credit) {
  let a = strip(artist).replace(/(Unknown author)+/g, 'Unknown author')
  if (!a) a = strip(credit)
  return a.replace(/[–-]/g, '-')
}

/** Best WebM source: the tallest WebM among the transcodes and the original; a VP9 transcode wins a tie. */
function pickSource(sources) {
  const webm = sources.filter((s) => s.type.startsWith('video/webm'))
  if (!webm.length) return sources[0]
  return webm.sort((a, b) => b.height - a.height || (a.transcode ? -1 : 1))[0]
}

async function search() {
  for (const q of SEARCHES) {
    const r = await api({ action: 'query', list: 'search', srnamespace: 6, srsearch: q, srlimit: 50 })
    const hits = (r.query?.search ?? []).map((s) => s.title).filter((t) => /\.(webm|ogv|ogg|mp4)$/i.test(t))
    console.log(`\n${q}  (${hits.length} video hits)`)
    for (const t of hits) console.log('  ' + t)
  }
}

async function build() {
  const out = []
  const rejected = []
  for (const film of FILMS) {
    const r = await api({
      action: 'query',
      titles: film.file,
      prop: 'imageinfo|videoinfo|revisions',
      iiprop: 'url|extmetadata|size|mediatype|mime|duration',
      iiurlwidth: 900,
      viprop: 'derivatives',
      rvprop: 'content',
      rvslots: 'main',
    })
    const page = r.query?.pages?.[0]
    const ii = page?.imageinfo?.[0]
    if (!ii || page.missing) { rejected.push([film.file, 'not found on Commons']); continue }
    if (ii.mediatype !== 'VIDEO') { rejected.push([film.file, `mediatype ${ii.mediatype}`]); continue }

    const meta = ii.extmetadata ?? {}
    const licence = strip(meta.LicenseShortName?.value)
    if (!LICENCE_OK.test(licence)) { rejected.push([film.file, `licence "${licence}"`]); continue }

    // Licence URL: Commons gives one for CC licences; for PD link the licence template actually used on the page.
    const wikitext = page.revisions?.[0]?.slots?.main?.content ?? ''
    const template = wikitext.match(/\{\{((?:PD|pd|Cc|cc|CC)[^|}\n]*)/)?.[1]?.trim()
    const licenseUrl =
      meta.LicenseUrl?.value ??
      (template ? `https://commons.wikimedia.org/wiki/Template:${encodeURIComponent(template.replace(/ /g, '_'))}` : page.canonicalurl)

    const derivatives = page.videoinfo?.[0]?.derivatives ?? []
    const sources = derivatives
      .map((d) => ({ src: clean(d.src), type: d.type.split(';')[0], width: d.width, height: d.height, transcode: Boolean(d.transcodekey) }))
      .filter((s) => /^video\/(webm|mp4|ogg)$/.test(s.type))
    if (!sources.length) sources.push({ src: clean(ii.url), type: ii.mime === 'application/ogg' ? 'video/ogg' : ii.mime, width: ii.width, height: ii.height, transcode: false })
    const best = pickSource(sources)

    out.push({
      id: film.id,
      title: film.title,
      year: film.year,
      description: film.description,
      url: best.src,
      poster: clean(ii.thumburl),
      duration: ii.duration ? Math.round(ii.duration) : null,
      page: page.canonicalurl ?? ii.descriptionurl,
      author: film.author ?? normaliseAuthor(meta.Artist?.value, meta.Credit?.value),
      license: licence,
      licenseUrl,
      chapter: film.chapter,
      graphic: film.graphic,
      // transcodes before the original, the one nearest 480p first; the Films page applies the same order
      sources: sources
        .sort((a, b) => (a.transcode !== b.transcode ? (a.transcode ? -1 : 1) : Math.abs(a.height - 480) - Math.abs(b.height - 480)))
        .map(({ src, type, width, height }) => ({ src, type, width, height })),
    })
    console.log(`ok   ${film.id}  ${licence}  ${best.width}x${best.height}  ${Math.round(ii.duration ?? 0)}s`)
  }

  for (const [file, why] of rejected) console.warn(`skip ${file}: ${why}`)

  const text = JSON.stringify({ films: out }, null, 2) + '\n'
  // house style: no em dashes anywhere (hyphens in names are fine)
  if (text.includes('—')) throw new Error('em dash found in output text')
  writeFileSync(OUT, text)
  console.log(`\nwrote ${out.length} films to ${OUT}`)
}

if (process.argv.includes('--search')) await search()
else await build()

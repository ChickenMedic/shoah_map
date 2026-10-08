import type { Site, SiteKind } from './types'

export const kindMeta: Record<SiteKind, { label: string; plural: string; color: string; blurb: string }> = {
  extermination: {
    label: 'Killing centre',
    plural: 'Killing centres',
    color: '#d8d2c4',
    blurb: 'Camps built or adapted for the immediate murder of those deported to them.',
  },
  concentration: {
    label: 'Concentration camp',
    plural: 'Concentration camps',
    color: '#c9a35a',
    blurb: 'Main camps of the SS system, each the hub of a network of subcamps.',
  },
  euthanasia: {
    label: 'T4 killing centre',
    plural: 'T4 killing centres',
    color: '#8fa3b8',
    blurb: 'The six institutions where people with disabilities were gassed, 1940–41 and after.',
  },
  transit: {
    label: 'Transit camp',
    plural: 'Transit camps',
    color: '#a9b38c',
    blurb: 'Assembly points from which Jews and Roma were deported to the east.',
  },
  ghetto: {
    label: 'Ghetto',
    plural: 'Ghettos',
    color: '#b58a7a',
    blurb: 'A few of the more than 1,100 ghettos established in occupied eastern Europe.',
  },
  massacre: {
    label: 'Mass shooting site',
    plural: 'Mass shooting sites',
    color: '#a3545a',
    blurb: 'A few of the thousands of places where Jews were shot beside pits and ravines.',
  },
}

export const sites: Site[] = [
  // ── Killing centres ─────────────────────────────────────
  {
    id: 'auschwitz', name: 'Auschwitz-Birkenau', kind: 'extermination', lat: 50.0343, lng: 19.1795, country: 'Poland',
    opened: '1940-05', closed: '1945-01', period: 'May 1940 – 27 January 1945', liberated: 'Soviet Army, 27 January 1945',
    deaths: 'About 1.1 million, of whom about 1 million were Jews',
    summary: 'The largest Nazi camp complex: Auschwitz I (the main camp), Auschwitz II-Birkenau (the killing centre), and Auschwitz III-Monowitz (a labour camp for IG Farben), with more than 40 subcamps. Of some 1.3 million people deported here, about 1.1 million were murdered, Jews from across Europe, 70,000–75,000 Poles, 21,000 Roma and Sinti, 15,000 Soviet prisoners of war, and others.',
  },
  {
    id: 'treblinka', name: 'Treblinka', kind: 'extermination', lat: 52.6311, lng: 22.0519, country: 'Poland',
    opened: '1942-07', closed: '1943-11', period: '23 July 1942 – autumn 1943',
    deaths: 'About 925,000',
    summary: 'The deadliest of the Operation Reinhard camps. Victims, chiefly the Jews of Warsaw and central Poland, were murdered with engine exhaust within hours of arrival. After the prisoner revolt of 2 August 1943 the camp was demolished and a farmhouse built on the site.',
  },
  {
    id: 'belzec', name: 'Bełżec', kind: 'extermination', lat: 50.3717, lng: 23.4575, country: 'Poland',
    opened: '1942-03', closed: '1942-12', period: '17 March – December 1942',
    deaths: 'About 434,500',
    summary: 'The first Operation Reinhard camp, commanded initially by T4 veteran Christian Wirth. The Jews of Lublin, Lwów and Kraków were murdered here. Only a handful of people are known to have survived Bełżec.',
  },
  {
    id: 'sobibor', name: 'Sobibór', kind: 'extermination', lat: 51.4472, lng: 23.5936, country: 'Poland',
    opened: '1942-05', closed: '1943-10', period: 'May 1942 – October 1943',
    deaths: 'At least 167,000',
    summary: 'Jews from eastern Poland, the Netherlands, France, Slovakia and the Soviet Union were murdered here. On 14 October 1943 prisoners led by Leon Feldhendler and Soviet POW Alexander Pechersky killed SS men and broke out; about 300 escaped and some 50 survived the war.',
  },
  {
    id: 'chelmno', name: 'Chełmno (Kulmhof)', kind: 'extermination', lat: 52.1544, lng: 18.7222, country: 'Poland',
    opened: '1941-12', closed: '1945-01', period: 'December 1941 – March 1943; June 1944 – January 1945', liberated: 'Soviet Army, 17–20 January 1945, after the SS had fled',
    deaths: 'At least 152,000',
    summary: 'The first stationary killing centre, where victims were murdered in gas vans and buried, later burned, in the nearby forest. Most were Jews from the Łódź ghetto and the surrounding Warthegau region; about 4,300 Roma were also killed here.',
  },
  {
    id: 'majdanek', name: 'Majdanek (Lublin)', kind: 'extermination', lat: 51.2194, lng: 22.6003, country: 'Poland',
    opened: '1941-10', closed: '1944-07', period: 'October 1941 – 22 July 1944', liberated: 'Soviet Army, 22–23 July 1944',
    deaths: 'About 78,000, of whom about 59,000 were Jews',
    summary: 'A concentration camp on the edge of Lublin that also served as a killing centre, with gas chambers and mass shootings. On 3 November 1943 about 18,000 Jews were shot here in a single day during “Operation Harvest Festival”.',
  },
  {
    id: 'maly-trostenets', name: 'Maly Trostenets', kind: 'extermination', lat: 53.8511, lng: 27.7047, country: 'Belarus',
    opened: '1942-05', closed: '1944-06', period: 'May 1942 – June 1944', liberated: 'Soviet Army, 3 July 1944',
    deaths: 'Estimates range from 40,000 to over 200,000',
    summary: 'A killing site outside Minsk. Jews deported from Vienna, Germany and the Protectorate, along with Jews of the Minsk ghetto, were shot at pits in the Blagovshchina forest or murdered in gas vans.',
  },

  // ── Concentration camps ─────────────────────────────────
  {
    id: 'dachau', name: 'Dachau', kind: 'concentration', lat: 48.2703, lng: 11.4683, country: 'Germany',
    opened: '1933-03', closed: '1945-04', period: '22 March 1933 – 29 April 1945', liberated: 'US Army, 29 April 1945',
    deaths: 'At least 41,500',
    summary: 'The first regular concentration camp and the only one to operate for the entire twelve years of Nazi rule. Its organisation and regime of terror, devised by Theodor Eicke, became the model for all later camps. More than 200,000 people were imprisoned in Dachau and its subcamps.',
  },
  {
    id: 'sachsenhausen', name: 'Sachsenhausen', kind: 'concentration', lat: 52.766, lng: 13.2642, country: 'Germany',
    opened: '1936-07', closed: '1945-04', period: 'July 1936 – 22 April 1945', liberated: 'Soviet and Polish forces, 22 April 1945',
    deaths: 'Tens of thousands',
    summary: 'Built north of Berlin as a model camp, beside the Inspectorate that administered the whole camp system. In autumn 1941 at least 10,000 Soviet prisoners of war were shot here. More than 200,000 people passed through the camp.',
  },
  {
    id: 'buchenwald', name: 'Buchenwald', kind: 'concentration', lat: 51.0222, lng: 11.2489, country: 'Germany',
    opened: '1937-07', closed: '1945-04', period: 'July 1937 – 11 April 1945', liberated: 'US Army, 11 April 1945',
    deaths: 'About 56,000',
    summary: 'One of the largest camps on German soil, on the Ettersberg above Weimar. Around 280,000 people from across Europe were held in Buchenwald and its subcamps, many worked to death in armaments production.',
  },
  {
    id: 'flossenburg', name: 'Flossenbürg', kind: 'concentration', lat: 49.7353, lng: 12.3561, country: 'Germany',
    opened: '1938-05', closed: '1945-04', period: 'May 1938 – 23 April 1945', liberated: 'US Army, 23 April 1945',
    deaths: 'About 30,000',
    summary: 'Sited beside granite quarries owned by an SS company. Around 100,000 prisoners passed through the camp and its subcamps. The theologian Dietrich Bonhoeffer and other members of the German resistance were executed here in April 1945.',
  },
  {
    id: 'mauthausen', name: 'Mauthausen', kind: 'concentration', lat: 48.2567, lng: 14.5011, country: 'Austria',
    opened: '1938-08', closed: '1945-05', period: 'August 1938 – 5 May 1945', liberated: 'US Army, 5 May 1945',
    deaths: 'At least 90,000',
    summary: 'Established after the annexation of Austria, with its twin camp Gusen. Classified by the SS as the harshest category of camp: prisoners were worked to death carrying granite up the 186 “Stairs of Death” of the Wiener Graben quarry.',
  },
  {
    id: 'ravensbruck', name: 'Ravensbrück', kind: 'concentration', lat: 53.1906, lng: 13.1689, country: 'Germany',
    opened: '1939-05', closed: '1945-04', period: 'May 1939 – 30 April 1945', liberated: 'Soviet Army, 30 April 1945',
    deaths: 'About 28,000',
    summary: 'The largest concentration camp for women. Some 120,000 women and children from more than 30 countries were held here, along with 20,000 men in an adjoining camp. SS doctors performed medical experiments on Polish women prisoners.',
  },
  {
    id: 'neuengamme', name: 'Neuengamme', kind: 'concentration', lat: 53.4306, lng: 10.2336, country: 'Germany',
    opened: '1938-12', closed: '1945-05', period: 'December 1938 – May 1945', liberated: 'British Army, early May 1945',
    deaths: 'At least 42,900',
    summary: 'Founded as a subcamp of Sachsenhausen in a brickworks near Hamburg, independent from 1940. On 3 May 1945, some 7,000 evacuated prisoners died when British aircraft, unaware of who was aboard, sank the ships Cap Arcona and Thielbek in the Bay of Lübeck.',
  },
  {
    id: 'stutthof', name: 'Stutthof', kind: 'concentration', lat: 54.3289, lng: 19.1539, country: 'Poland',
    opened: '1939-09', closed: '1945-05', period: '2 September 1939 – 9 May 1945', liberated: 'Soviet Army, 9 May 1945',
    deaths: 'More than 60,000',
    summary: 'Opened east of Danzig on the second day of the war for Polish civilians. In 1944 tens of thousands of Jews, mostly women, arrived from the Baltic ghettos and Auschwitz. It was the last camp to be liberated.',
  },
  {
    id: 'gross-rosen', name: 'Gross-Rosen', kind: 'concentration', lat: 50.9989, lng: 16.2775, country: 'Poland',
    opened: '1940-08', closed: '1945-02', period: 'August 1940 – February 1945', liberated: 'Soviet Army, 13 February 1945',
    deaths: 'About 40,000',
    summary: 'A quarry camp in Lower Silesia that grew into a network of about 100 subcamps. Of roughly 125,000 prisoners, many were Jewish women sent to work in textile and armaments factories.',
  },
  {
    id: 'natzweiler', name: 'Natzweiler-Struthof', kind: 'concentration', lat: 48.4547, lng: 7.2536, country: 'France',
    opened: '1941-05', closed: '1944-09', period: 'May 1941 – September 1944', liberated: 'French and US troops, 23 November 1944; the camp had been evacuated in September',
    deaths: 'About 20,000',
    summary: 'The only main concentration camp on present-day French soil, in annexed Alsace. Many prisoners were resistance members held under the “Night and Fog” decree. In August 1943, 86 Jews were gassed here to supply a skeleton collection for an SS anatomist.',
  },
  {
    id: 'bergen-belsen', name: 'Bergen-Belsen', kind: 'concentration', lat: 52.7578, lng: 9.9078, country: 'Germany',
    opened: '1943-04', closed: '1945-04', period: 'April 1943 – 15 April 1945', liberated: 'British Army, 15 April 1945',
    deaths: 'About 52,000 camp prisoners, and some 20,000 Soviet prisoners of war',
    summary: 'First a prisoner-of-war camp, then a holding camp for Jews intended for exchange. In the last months of the war it became the destination for death marches; typhus and starvation killed tens of thousands.',
  },
  {
    id: 'mittelbau-dora', name: 'Mittelbau-Dora', kind: 'concentration', lat: 51.5353, lng: 10.7486, country: 'Germany',
    opened: '1943-08', closed: '1945-04', period: 'August 1943 – 11 April 1945', liberated: 'US Army, 11 April 1945',
    deaths: 'About 20,000',
    summary: 'Prisoners here excavated tunnels in the Harz mountains and assembled V-2 rockets underground. More people died building the V-2 than were killed by it as a weapon.',
  },
  {
    id: 'plaszow', name: 'Kraków-Płaszów', kind: 'concentration', lat: 50.0308, lng: 19.9672, country: 'Poland',
    opened: '1942-10', closed: '1945-01', period: 'Autumn 1942 – January 1945',
    deaths: 'Several thousand',
    summary: 'Built on two Jewish cemeteries as a forced-labour camp for survivors of the Kraków ghetto; a concentration camp from January 1944. Its commandant Amon Göth personally murdered prisoners. Oskar Schindler’s factory workers were drawn from this camp.',
  },
  {
    id: 'herzogenbusch', name: 'Herzogenbusch (Vught)', kind: 'concentration', lat: 51.6661, lng: 5.2583, country: 'Netherlands',
    opened: '1943-01', closed: '1944-09', period: 'January 1943 – September 1944', liberated: 'Canadian and Scottish troops, 26–27 October 1944; the camp had been evacuated in September',
    deaths: 'About 750',
    summary: 'The only SS main concentration camp in western Europe outside the Reich. About 31,000 people were held here, including 12,000 Jews, almost all deported onward via Westerbork, among them 1,269 children sent to Sobibór in June 1943.',
  },
  {
    id: 'hinzert', name: 'Hinzert', kind: 'concentration', lat: 49.6989, lng: 6.8931, country: 'Germany',
    opened: '1939-10', closed: '1945-03', period: 'October 1939 – March 1945', liberated: 'US Army, March 1945',
    deaths: 'At least 321',
    summary: 'A “special SS camp” near Trier, used above all for resistance prisoners from Luxembourg and France.',
  },
  {
    id: 'riga-kaiserwald', name: 'Riga-Kaiserwald', kind: 'concentration', lat: 57.0006, lng: 24.1489, country: 'Latvia',
    opened: '1943-03', closed: '1944-10', period: 'March 1943 – autumn 1944', liberated: 'Soviet Army, 13 October 1944; the prisoners had been moved to Stutthof',
    summary: 'Established for the survivors of the Latvian ghettos, who were put to forced labour for German firms. As the Red Army approached, the prisoners were shot or shipped to Stutthof.',
  },
  {
    id: 'kauen', name: 'Kauen (Kovno)', kind: 'concentration', lat: 54.9167, lng: 23.8833, country: 'Lithuania',
    opened: '1943-09', closed: '1944-07', period: 'Ghetto from August 1941; concentration camp autumn 1943 – July 1944', liberated: 'Soviet Army, 1 August 1944; the prisoners had been moved to Stutthof and Dachau',
    summary: 'The Kovno ghetto was converted into a concentration camp in 1943. In the “Great Action” of 29 October 1941, 9,200 of its inhabitants had been shot at the Ninth Fort in a single day.',
  },
  {
    id: 'vaivara', name: 'Vaivara', kind: 'concentration', lat: 59.3667, lng: 27.75, country: 'Estonia',
    opened: '1943-09', closed: '1944-06', period: 'September 1943 – 1944', liberated: 'Soviet Army, September 1944; most prisoners had been moved to Stutthof',
    summary: 'The hub of a network of labour camps in Estonia, where Jews deported from the Vilna and Kovno ghettos were worked in shale-oil production.',
  },
  {
    id: 'jasenovac', name: 'Jasenovac', kind: 'concentration', lat: 45.2814, lng: 16.9275, country: 'Croatia',
    opened: '1941-08', closed: '1945-04', period: 'August 1941 – April 1945', liberated: 'Yugoslav Partisans, 2 May 1945, after the last prisoners had broken out on 22 April',
    deaths: 'Between 77,000 and 99,000',
    summary: 'Not a German camp: the largest of the camps run by the Ustaša regime of the Nazi-allied Independent State of Croatia, where Serbs, Jews, Roma and political opponents were murdered.',
  },

  // ── T4 ──────────────────────────────────────────────────
  {
    id: 'grafeneck', name: 'Grafeneck', kind: 'euthanasia', lat: 48.3939, lng: 9.4286, country: 'Germany',
    opened: '1940-01', closed: '1940-12', period: 'January – December 1940',
    deaths: 'About 10,600',
    summary: 'A castle in the Swabian Jura, formerly a home for disabled people, converted into the first T4 gassing facility.',
  },
  {
    id: 'brandenburg', name: 'Brandenburg an der Havel', kind: 'euthanasia', lat: 52.4117, lng: 12.5544, country: 'Germany',
    opened: '1940-01', closed: '1940-10', period: 'January – October 1940',
    deaths: 'About 9,000',
    summary: 'A former prison in the town centre, where the method of gassing with carbon monoxide was demonstrated to T4’s leadership in January 1940.',
  },
  {
    id: 'hartheim', name: 'Hartheim', kind: 'euthanasia', lat: 48.2811, lng: 14.1139, country: 'Austria',
    opened: '1940-05', closed: '1944-12', period: 'May 1940 – December 1944',
    deaths: 'About 30,000',
    summary: 'A Renaissance castle near Linz. Some 18,000 patients were murdered here under T4, followed by about 12,000 prisoners from Mauthausen, Gusen and Dachau and forced labourers. Franz Stangl and Christian Wirth worked here before commanding death camps.',
  },
  {
    id: 'sonnenstein', name: 'Pirna-Sonnenstein', kind: 'euthanasia', lat: 50.9617, lng: 13.9478, country: 'Germany',
    opened: '1940-06', closed: '1942-09', period: 'June 1940 – summer 1942',
    deaths: 'About 14,750',
    summary: 'Once a pioneering psychiatric hospital. About 13,700 patients were gassed here, and more than 1,000 concentration camp prisoners under “Action 14f13”.',
  },
  {
    id: 'bernburg', name: 'Bernburg', kind: 'euthanasia', lat: 51.7911, lng: 11.7286, country: 'Germany',
    opened: '1940-11', closed: '1943-07', period: 'November 1940 – 1943',
    deaths: 'About 14,000',
    summary: 'Replaced Brandenburg. More than 9,000 patients were killed in a wing of the working psychiatric hospital, and about 5,000 prisoners from concentration camps.',
  },
  {
    id: 'hadamar', name: 'Hadamar', kind: 'euthanasia', lat: 50.4486, lng: 8.0422, country: 'Germany',
    opened: '1941-01', closed: '1945-03', period: 'January 1941 – March 1945',
    deaths: 'About 15,000',
    summary: 'Replaced Grafeneck. Over 10,000 people were gassed here in 1941; smoke from the crematorium was visible across the town. From 1942 a further 4,500 were killed by overdose and starvation, including forced labourers and children.',
  },

  // ── Transit camps ───────────────────────────────────────
  {
    id: 'westerbork', name: 'Westerbork', kind: 'transit', lat: 52.9167, lng: 6.6069, country: 'Netherlands',
    opened: '1942-07', closed: '1945-04', period: 'July 1942 – 12 April 1945', liberated: 'Canadian Army, 12 April 1945',
    summary: 'From here, usually on Tuesdays, trains carried about 100,000 Jews and 245 Sinti and Roma to Auschwitz, Sobibór, Theresienstadt and Bergen-Belsen. Anne Frank and her family were on the last transport to Auschwitz, on 3 September 1944.',
  },
  {
    id: 'drancy', name: 'Drancy', kind: 'transit', lat: 48.92, lng: 2.4533, country: 'France',
    opened: '1941-08', closed: '1944-08', period: 'August 1941 – 17 August 1944', liberated: '17 August 1944, handed to the Swedish consul and the Resistance as the Germans left Paris',
    summary: 'An unfinished housing estate north-east of Paris, guarded by French police until 1943. About 63,000 of the roughly 76,000 Jews deported from France passed through it.',
  },
  {
    id: 'mechelen', name: 'Mechelen (Malines)', kind: 'transit', lat: 51.0336, lng: 4.4786, country: 'Belgium',
    opened: '1942-07', closed: '1944-09', period: 'July 1942 – September 1944', liberated: 'British Army, 4 September 1944',
    summary: 'The Dossin barracks, midway between Antwerp and Brussels. From here 25,000 Jews and about 350 Roma were deported to Auschwitz. In April 1943 three young men stopped Transport XX with a single pistol and a lantern, allowing prisoners to escape.',
  },
  {
    id: 'theresienstadt', name: 'Theresienstadt (Terezín)', kind: 'transit', lat: 50.5106, lng: 14.1506, country: 'Czech Republic',
    opened: '1941-11', closed: '1945-05', period: '24 November 1941 – 8 May 1945', liberated: 'Soviet Army, 8–9 May 1945',
    deaths: 'About 33,000 died in the ghetto',
    summary: 'A garrison town turned ghetto and transit camp, presented to the outside world as a “model settlement” and staged for a Red Cross visit in June 1944. Of about 140,000 Jews sent here, some 88,000 were deported onward to their deaths. Of 15,000 children, only a small fraction survived.',
  },
  {
    id: 'fossoli', name: 'Fossoli', kind: 'transit', lat: 44.8236, lng: 10.9017, country: 'Italy',
    opened: '1943-12', closed: '1944-08', period: 'December 1943 – August 1944', liberated: 'Dismantled by the Germans in August 1944; the area was liberated in April 1945',
    summary: 'The main transit camp for Jews arrested in Italy. Primo Levi was deported from here to Auschwitz in February 1944.',
  },

  {
    id: 'vienna-strasshof', name: 'Strasshof', kind: 'transit', lat: 48.3167, lng: 16.65, country: 'Austria',
    opened: '1944-06', closed: '1945-04', period: 'June 1944 – April 1945', liberated: 'Soviet Army, April 1945',
    summary: 'A transit camp north-east of Vienna through which about 15,000 Hungarian Jews, mostly families, were sent to forced labour in Austrian farms and factories in the summer of 1944, under an agreement between Eichmann and the Budapest rescue committee. Unusually, most of them survived the war.',
  },

  // ── Ghettos ─────────────────────────────────────────────
  {
    id: 'warsaw-ghetto', name: 'Warsaw ghetto', kind: 'ghetto', lat: 52.2444, lng: 20.9931, country: 'Poland',
    opened: '1940-10', closed: '1943-05', period: 'October 1940 – May 1943',
    summary: 'The largest ghetto: more than 400,000 people in 1.3 square miles. About 83,000 died of hunger and disease; some 265,000 were deported to Treblinka in summer 1942. The uprising of April 1943 was the largest Jewish revolt of the war.',
  },
  {
    id: 'lodz-ghetto', name: 'Łódź ghetto (Litzmannstadt)', kind: 'ghetto', lat: 51.7931, lng: 19.4642, country: 'Poland',
    opened: '1940-02', closed: '1944-08', period: 'February 1940 – August 1944',
    summary: 'The second-largest ghetto and the longest-lived, kept in being as a vast workshop for the German army. Over 43,000 people died inside it; the rest were deported to Chełmno and, in August 1944, to Auschwitz.',
  },
  {
    id: 'krakow-ghetto', name: 'Kraków ghetto', kind: 'ghetto', lat: 50.0453, lng: 19.9544, country: 'Poland',
    opened: '1941-03', closed: '1943-03', period: 'March 1941 – 13–14 March 1943',
    summary: 'Established in the Podgórze district. Its inhabitants were deported to Bełżec in 1942; at the final liquidation some 2,000 people were shot in the streets and the rest sent to Płaszów or Auschwitz.',
  },
  {
    id: 'vilna-ghetto', name: 'Vilna ghetto', kind: 'ghetto', lat: 54.6792, lng: 25.2853, country: 'Lithuania',
    opened: '1941-09', closed: '1943-09', period: 'September 1941 – September 1943',
    summary: 'Vilna had been the “Jerusalem of Lithuania”. Most of its Jews were shot at Ponary. The ghetto’s underground, the FPO, issued the first call to armed Jewish resistance on 1 January 1942.',
  },
  {
    id: 'minsk-ghetto', name: 'Minsk ghetto', kind: 'ghetto', lat: 53.9097, lng: 27.5428, country: 'Belarus',
    opened: '1941-07', closed: '1943-10', period: 'July 1941 – October 1943',
    summary: 'The largest ghetto in the occupied Soviet Union, holding some 80,000 people, including Jews deported from Germany. Thousands escaped to join partisan units in the forests.',
  },
  {
    id: 'riga-ghetto', name: 'Riga ghetto', kind: 'ghetto', lat: 56.9403, lng: 24.1356, country: 'Latvia',
    opened: '1941-10', closed: '1943-11', period: 'October 1941 – November 1943',
    summary: 'Nearly all of its original inhabitants were shot at Rumbula in late 1941 to make room for Jews deported from Germany and Austria.',
  },
  {
    id: 'bialystok-ghetto', name: 'Białystok ghetto', kind: 'ghetto', lat: 53.1383, lng: 23.1642, country: 'Poland',
    opened: '1941-08', closed: '1943-08', period: 'August 1941 – August 1943',
    summary: 'About 50,000 Jews were confined here. When the ghetto was liquidated in August 1943, the underground mounted an armed uprising.',
  },
  {
    id: 'lwow-ghetto', name: 'Lwów ghetto', kind: 'ghetto', lat: 49.8531, lng: 24.0297, country: 'Ukraine',
    opened: '1941-11', closed: '1943-06', period: 'November 1941 – June 1943',
    summary: 'One of the largest ghettos, with over 100,000 inhabitants. Most were murdered at Bełżec or in the nearby Janowska camp.',
  },
  {
    id: 'budapest-ghetto', name: 'Budapest ghetto', kind: 'ghetto', lat: 47.4989, lng: 19.0617, country: 'Hungary',
    opened: '1944-11', closed: '1945-01', period: 'November 1944 – January 1945', liberated: 'Soviet Army, 17–18 January 1945',
    summary: 'Created by the fascist Arrow Cross regime. Thousands of Jews were shot on the banks of the Danube. Diplomats including Raoul Wallenberg and Carl Lutz sheltered tens of thousands in protected houses.',
  },

  // ── Mass shooting sites ─────────────────────────────────
  {
    id: 'babyn-yar', name: 'Babyn Yar', kind: 'massacre', lat: 50.4714, lng: 30.4489, country: 'Ukraine',
    opened: '1941-09', closed: '1943-11', period: '29–30 September 1941, and until 1943',
    deaths: '33,771 Jews in two days; up to 100,000 people in all',
    summary: 'A ravine on the edge of Kyiv. After the massacre of the city’s Jews, the site was used for two more years to murder Roma, Soviet prisoners of war, psychiatric patients and Ukrainian civilians.',
  },
  {
    id: 'ponary', name: 'Ponary (Paneriai)', kind: 'massacre', lat: 54.6264, lng: 25.1608, country: 'Lithuania',
    opened: '1941-07', closed: '1944-07', period: 'July 1941 – July 1944',
    deaths: 'About 70,000 Jews, and some 20,000 Poles and 8,000 Soviet POWs',
    summary: 'Unfinished fuel-storage pits in a forest outside Vilna, where German SS and Lithuanian auxiliaries shot most of the city’s Jews.',
  },
  {
    id: 'rumbula', name: 'Rumbula', kind: 'massacre', lat: 56.8853, lng: 24.2453, country: 'Latvia',
    opened: '1941-11', closed: '1941-12', period: '30 November and 8 December 1941',
    deaths: 'About 25,000',
    summary: 'On two days, the Jews of the Riga ghetto, and the first trainload of Jews deported from Berlin, were marched to a forest and shot.',
  },
  {
    id: 'kamianets', name: 'Kamianets-Podilskyi', kind: 'massacre', lat: 48.6833, lng: 26.5833, country: 'Ukraine',
    opened: '1941-08', closed: '1941-08', period: '27–28 August 1941',
    deaths: '23,600',
    summary: 'The first massacre on this scale. Many of the victims were Jews expelled from Hungary as “aliens”.',
  },
  {
    id: 'ninth-fort', name: 'Ninth Fort, Kaunas', kind: 'massacre', lat: 54.9447, lng: 23.8708, country: 'Lithuania',
    opened: '1941-10', closed: '1944-08', period: 'October 1941 – 1944',
    deaths: 'About 50,000',
    summary: 'A Tsarist-era fortress where the Jews of Kovno were shot, along with Jews deported from Germany, Austria and France.',
  },
  {
    id: 'bikernieki', name: 'Biķernieki forest', kind: 'massacre', lat: 56.9806, lng: 24.2089, country: 'Latvia',
    opened: '1941-07', closed: '1944-07', period: 'July 1941 – 1944',
    deaths: 'About 35,000, among them some 20,000 Jews deported from Germany, Austria and the Protectorate',
    summary: 'A pine forest on the eastern edge of Riga, the largest killing site in Latvia. Jews from the Reich who arrived at the Riga ghetto in 1941 and 1942 were taken here directly from the trains and shot into pits.',
  },
  {
    id: 'drobytsky-yar', name: 'Drobytsky Yar', kind: 'massacre', lat: 49.9647, lng: 36.3736, country: 'Ukraine',
    opened: '1941-12', closed: '1942-01', period: 'December 1941 – January 1942',
    deaths: 'About 15,000',
    summary: 'A ravine outside Kharkiv. The city’s Jews were first confined to barracks at a tractor factory, then marched here in the depths of winter and shot by Sonderkommando 4a and police units.',
  },
  {
    id: 'bohdanivka', name: 'Bohdanivka', kind: 'massacre', lat: 47.7, lng: 30.2, country: 'Ukraine',
    opened: '1941-12', closed: '1941-12', period: '21 – 31 December 1941',
    deaths: 'About 48,000',
    summary: 'A camp of pig farms on the Bug in Romanian-ruled Transnistria, into which Jews from Odessa and Bessarabia had been driven. Romanian gendarmes and Ukrainian auxiliaries shot and burned the inmates over ten days, in one of the largest single massacres of the Holocaust.',
  },
  {
    id: 'odessa', name: 'Odessa', kind: 'massacre', lat: 46.4825, lng: 30.7233, country: 'Ukraine',
    opened: '1941-10', closed: '1941-10', period: '22 – 24 October 1941',
    deaths: 'Between 25,000 and 34,000',
    summary: 'After a bomb destroyed the Romanian headquarters in the newly occupied city, Romanian troops hanged and shot thousands of Jews in the streets and burned some 20,000 more alive in warehouses at Dalnik. The survivors were deported to Transnistria.',
  },
  {
    id: 'bronna-gora', name: 'Bronna Góra', kind: 'massacre', lat: 52.6, lng: 25.05, country: 'Belarus',
    opened: '1942-06', closed: '1942-11', period: 'June – November 1942',
    deaths: 'About 50,000',
    summary: 'Pits beside a railway halt in the forests of western Belarus, where the Jews of the Brest, Pinsk, Kobryn and Bereza ghettos were brought by train and shot.',
  },
  {
    id: 'berdychiv', name: 'Berdychiv', kind: 'massacre', lat: 49.8989, lng: 28.5767, country: 'Ukraine',
    opened: '1941-09', closed: '1941-09', period: '15 September 1941',
    deaths: 'About 12,000 in a single day; some 30,000 in all',
    summary: 'A town that had been one of the great centres of Jewish life in Ukraine. Its Jews were shot at the airfield outside the town by Einsatzgruppe C and police battalions. Vasily Grossman, who grew up there, lost his mother in the massacre.',
  },
  {
    id: 'sosenki', name: 'Sosenki, Rivne', kind: 'massacre', lat: 50.6, lng: 26.3, country: 'Ukraine',
    opened: '1941-11', closed: '1941-11', period: '6 – 8 November 1941',
    deaths: 'About 17,500',
    summary: 'A pine grove outside Rivne, the administrative capital of Reichskommissariat Ukraine, where most of the city’s Jews were shot over two days.',
  },
  {
    id: 'simferopol', name: 'Simferopol', kind: 'massacre', lat: 44.9521, lng: 34.1024, country: 'Ukraine',
    opened: '1941-12', closed: '1941-12', period: 'December 1941',
    deaths: 'About 12,000 Jews and 1,500 Krymchaks',
    summary: 'Einsatzgruppe D shot the Jews of the Crimean capital, and the Krymchaks, a Turkic-speaking Jewish community found almost nowhere else, on the road to Feodosia.',
  },
  {
    id: 'daugavpils', name: 'Daugavpils (Pogulanka forest)', kind: 'massacre', lat: 55.9, lng: 26.45, country: 'Latvia',
    opened: '1941-07', closed: '1941-11', period: 'July – November 1941',
    deaths: 'About 14,000',
    summary: 'The Jews of Daugavpils, Latvia’s second city, were shot in the Pogulanka forest by Einsatzkommando units and Latvian auxiliaries over the summer and autumn of 1941.',
  },
  {
    id: 'skede', name: 'Šķēde dunes, Liepāja', kind: 'massacre', lat: 56.6, lng: 21.0, country: 'Latvia',
    opened: '1941-12', closed: '1941-12', period: '15 – 17 December 1941',
    deaths: '2,749',
    summary: 'The Jews of Liepāja, mostly women and children, were shot in the dunes north of the city. An SS man photographed the killings; the pictures, smuggled out by a Jewish electrician, are among the few of a massacre in progress.',
  },
  {
    id: 'janowska', name: 'Janowska and the Piaski sands, Lwów', kind: 'massacre', lat: 49.8533, lng: 23.9783, country: 'Ukraine',
    opened: '1941-10', closed: '1943-11', period: 'October 1941 – November 1943',
    deaths: 'Tens of thousands',
    summary: 'A forced-labour camp on Janowska Street whose adjoining sand pits served as the execution ground for the Jews of Lwów. In 1943 prisoners were forced to exhume and burn the bodies; the camp orchestra was made to play during the killings.',
  },
  {
    id: 'zmiyovskaya', name: 'Zmiyovskaya Balka, Rostov', kind: 'massacre', lat: 47.24, lng: 39.63, country: 'Russia',
    opened: '1942-08', closed: '1942-08', period: '11 – 12 August 1942',
    deaths: 'Between 15,000 and 27,000',
    summary: 'A ravine on the edge of Rostov-on-Don, the largest Holocaust killing site on the territory of present-day Russia, where Sonderkommando 10a shot the city’s Jews and killed the children in gas vans.',
  },
  {
    id: 'trawniki', name: 'Trawniki', kind: 'massacre', lat: 51.1333, lng: 22.9883, country: 'Poland',
    opened: '1943-11', closed: '1943-11', period: '3 November 1943',
    deaths: 'About 6,000',
    summary: 'The SS training camp where the auxiliary guards of the Reinhard camps were trained, beside a labour camp for Jews. On the first day of “Operation Harvest Festival” its Jewish prisoners were shot in pits behind the camp.',
  },
  {
    id: 'poniatowa', name: 'Poniatowa', kind: 'massacre', lat: 51.18, lng: 22.08, country: 'Poland',
    opened: '1943-11', closed: '1943-11', period: '4 November 1943',
    deaths: 'About 14,000',
    summary: 'A labour camp holding Jews deported from the Warsaw ghetto after the uprising. All were shot in a single day in zigzag trenches, to music from loudspeakers, during “Operation Harvest Festival”.',
  },
  {
    id: 'palmiry', name: 'Palmiry', kind: 'massacre', lat: 52.3333, lng: 20.7833, country: 'Poland',
    opened: '1939-12', closed: '1941-07', period: 'December 1939 – July 1941',
    deaths: 'About 1,700',
    summary: 'A clearing in the Kampinos forest near Warsaw where the Germans shot Polish political prisoners, intellectuals, athletes and politicians brought from Pawiak prison, in the campaign to destroy Poland’s leadership.',
  },
]

export const siteById = Object.fromEntries(sites.map((s) => [s.id, s])) as Record<string, Site>

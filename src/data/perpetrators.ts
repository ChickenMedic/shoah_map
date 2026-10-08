import type { Perpetrator } from './types'

export const perpetratorGroups: { id: Perpetrator['group']; label: string }[] = [
  { id: 'leadership', label: 'The leadership' },
  { id: 'ss', label: 'The SS and police apparatus' },
  { id: 't4', label: 'Aktion T4' },
  { id: 'camps', label: 'The camps' },
  { id: 'administration', label: 'Occupation and administration' },
]

// `reportsTo` gives the chain of command used for the hierarchy view. Where a person answered to more than one
// superior over time, the line that mattered most for the murder of the Jews is given.
export const perpetrators: Perpetrator[] = [
  // ── Leadership ──────────────────────────────────────────
  {
    id: 'hitler', name: 'Adolf Hitler', life: '1889–1945', group: 'leadership',
    role: 'Führer and Reich Chancellor',
    text: 'The author of the ideology and the ultimate authority for every stage of the persecution. No written order from Hitler for the murder of Europe’s Jews has been found, and none was needed: he authorised T4 in writing, set policy through speeches and private instructions to Himmler and others, and was kept informed of the results.',
    fate: 'Killed himself in his Berlin bunker on 30 April 1945.',
  },
  {
    id: 'himmler', name: 'Heinrich Himmler', life: '1900–1945', group: 'leadership', reportsTo: 'hitler',
    role: 'Reichsführer-SS and Chief of German Police',
    text: 'The chief architect of the genocide. Himmler controlled the SS, the police, the Einsatzgruppen and the concentration and extermination camps. He visited killing sites, drove the pace of the murder in person, and spoke of it openly to his generals at Posen in 1943.',
    fate: 'Captured by British forces in disguise; killed himself with cyanide on 23 May 1945.',
  },
  {
    id: 'goring', name: 'Hermann Göring', life: '1893–1946', group: 'leadership', reportsTo: 'hitler',
    role: 'Reich Marshal; head of the Four Year Plan',
    text: 'Founded the Gestapo in Prussia and the first concentration camps in 1933. He directed the expropriation of Jewish property after the 1938 pogrom, and in July 1941 signed the authorisation charging Heydrich with preparing a “total solution of the Jewish question”.',
    fate: 'Sentenced to death at Nuremberg; killed himself the night before his execution, 15 October 1946.',
  },
  {
    id: 'goebbels', name: 'Joseph Goebbels', life: '1897–1945', group: 'leadership', reportsTo: 'hitler',
    role: 'Reich Minister of Propaganda; Gauleiter of Berlin',
    text: 'Controlled press, film and radio, and filled them with antisemitic hatred. He instigated the November 1938 pogrom and pressed relentlessly for the deportation of Berlin’s Jews. His diaries show detailed knowledge of the extermination.',
    fate: 'Killed himself in Berlin on 1 May 1945, after he and his wife had their six children poisoned.',
  },
  {
    id: 'bormann', name: 'Martin Bormann', life: '1900–1945', group: 'leadership', reportsTo: 'hitler',
    role: 'Head of the Party Chancellery; Hitler’s secretary',
    text: 'Controlled access to Hitler and turned his wishes into party directives, including instructions on the treatment of Jews and of Slavic populations in the east. He attended the conferences at which the deportations were coordinated with the party.',
    fate: 'Died trying to escape Berlin on 2 May 1945; his remains were identified in 1972. He had been sentenced to death in absentia at Nuremberg.',
  },
  {
    id: 'speer', name: 'Albert Speer', life: '1905–1981', group: 'leadership', reportsTo: 'hitler',
    role: 'Minister of Armaments and War Production',
    text: 'Ran the war economy from 1942 on the labour of millions of foreign workers, prisoners of war and concentration camp prisoners, and pressed for more. As Berlin’s chief architect he had earlier organised the eviction of Jewish tenants to house Germans displaced by his building plans.',
    fate: 'Sentenced to twenty years at Nuremberg; released in 1966 and became a best-selling author, denying knowledge of the extermination.',
  },
  {
    id: 'frick', name: 'Wilhelm Frick', life: '1877–1946', group: 'leadership', reportsTo: 'hitler',
    role: 'Reich Minister of the Interior, 1933–43',
    text: 'His ministry drafted the laws that excluded Jews from German life, including the Nuremberg Laws of 1935, and administered the sterilisation and “euthanasia” policies. From 1943 he was Protector of Bohemia and Moravia.',
    fate: 'Sentenced to death at Nuremberg and hanged on 16 October 1946.',
  },

  // ── SS and police ───────────────────────────────────────
  {
    id: 'heydrich', name: 'Reinhard Heydrich', life: '1904–1942', group: 'ss', reportsTo: 'himmler',
    role: 'Chief of the Reich Security Main Office (RSHA)',
    text: 'Head of the Security Police and SD, commander of the Einsatzgruppen, and the official charged with organising the “Final Solution”. He convened and chaired the Wannsee Conference. Operation Reinhard was named for him after his death.',
    fate: 'Died on 4 June 1942 of wounds from an attack in Prague by Czechoslovak agents. In reprisal the Germans destroyed the village of Lidice.',
  },
  {
    id: 'kaltenbrunner', name: 'Ernst Kaltenbrunner', life: '1903–1946', group: 'ss', reportsTo: 'himmler',
    role: 'Chief of the RSHA from January 1943',
    text: 'Heydrich’s successor, with authority over the Gestapo, the SD and the Einsatzgruppen during the deportations of 1943 and 1944.',
    fate: 'Sentenced to death at Nuremberg and hanged on 16 October 1946.',
  },
  {
    id: 'muller', name: 'Heinrich Müller', life: '1900–1945?', group: 'ss', reportsTo: 'heydrich',
    role: 'Chief of the Gestapo (RSHA Office IV)',
    text: 'Eichmann’s direct superior. He attended the Wannsee Conference and signed orders governing deportations and the execution of Soviet prisoners of war.',
    fate: 'Last seen in Berlin on 1 May 1945. Probably died there; his fate was never established with certainty.',
  },
  {
    id: 'eichmann', name: 'Adolf Eichmann', life: '1906–1962', group: 'ss', reportsTo: 'muller',
    role: 'Head of RSHA Section IV B 4 (Jewish affairs)',
    text: 'The logistician of the deportations. His office arranged the arrest, assembly and rail transport of Jews from across Europe to the killing centres. He took the minutes at Wannsee, and in 1944 went to Budapest to direct the deportation of Hungary’s Jews in person.',
    fate: 'Escaped to Argentina. Captured by Israeli agents in 1960, tried in Jerusalem, and hanged on 1 June 1962.',
  },
  {
    id: 'brunner', name: 'Alois Brunner', life: '1912–2001 or 2010', group: 'ss', reportsTo: 'eichmann',
    role: 'Eichmann’s deputy; commandant of Drancy',
    text: 'Organised the deportation of some 47,000 Jews from Vienna, 43,000 from Salonika and 24,000 from France, where he ran the Drancy camp, and in 1944 the deportations from Slovakia.',
    fate: 'Fled to Syria, where he lived under protection in Damascus. Sentenced to death in absentia in France. Reports of his death there range from 2001 to 2010; he was never tried in person.',
  },
  {
    id: 'dannecker', name: 'Theodor Dannecker', life: '1913–1945', group: 'ss', reportsTo: 'eichmann',
    role: 'Eichmann’s representative in France, Bulgaria, Italy and Hungary',
    text: 'Organised the first deportations from France in 1942, including the Vél d’Hiv roundup, and the deportation of the Jews of Bulgarian-occupied Thrace and Macedonia to Treblinka.',
    fate: 'Killed himself in American custody in December 1945.',
  },
  {
    id: 'wisliceny', name: 'Dieter Wisliceny', life: '1911–1948', group: 'ss', reportsTo: 'eichmann',
    role: 'Eichmann’s adviser in Slovakia, Greece and Hungary',
    text: 'Negotiated the deportation of Slovakia’s Jews with its government, organised the deportations from Salonika, and was part of Eichmann’s unit in Budapest in 1944. His Nuremberg testimony was among the first detailed accounts of the deportation machinery.',
    fate: 'Tried in Bratislava and hanged in 1948.',
  },
  {
    id: 'pohl', name: 'Oswald Pohl', life: '1892–1951', group: 'ss', reportsTo: 'himmler',
    role: 'Head of the SS Economic and Administrative Main Office (WVHA)',
    text: 'Administered the concentration camp system from 1942, hiring out prisoners to German industry and processing the valuables, clothing, hair and dental gold taken from the dead.',
    fate: 'Sentenced to death by a US military tribunal; hanged at Landsberg on 7 June 1951.',
  },
  {
    id: 'eicke', name: 'Theodor Eicke', life: '1892–1943', group: 'ss', reportsTo: 'himmler',
    role: 'Commandant of Dachau; Inspector of Concentration Camps, 1934–39',
    text: 'Created the “Dachau model”, the regulations, punishments and trained brutality of the guards, and extended it to every camp. A generation of commandants, including Rudolf Höss, learned under him.',
    fate: 'Killed on the Eastern Front when his aircraft was shot down, 26 February 1943.',
  },
  {
    id: 'glucks', name: 'Richard Glücks', life: '1889–1945', group: 'ss', reportsTo: 'pohl',
    role: 'Inspector of Concentration Camps, 1939–45',
    text: 'Eicke’s successor as head of the Inspectorate, which from 1942 was Office Group D of Pohl’s WVHA. Every camp commandant answered to him. He selected the site of Auschwitz in 1940 and passed down the orders that governed the camps through the war.',
    fate: 'Killed himself in Flensburg on 10 May 1945.',
  },
  {
    id: 'kruger', name: 'Friedrich-Wilhelm Krüger', life: '1894–1945', group: 'ss', reportsTo: 'himmler',
    role: 'Higher SS and Police Leader, General Government',
    text: 'Himmler’s representative in occupied Poland, with authority over Globocnik and the SS and police leaders of the other districts during Operation Reinhard and the liquidation of the ghettos.',
    fate: 'Killed himself in Austria on 10 May 1945.',
  },
  {
    id: 'globocnik', name: 'Odilo Globocnik', life: '1904–1945', group: 'ss', reportsTo: 'kruger',
    role: 'SS and Police Leader, Lublin district',
    text: 'Ran Operation Reinhard: the building of Bełżec, Sobibór and Treblinka, the murder of some 1.7 million Jews, and the plunder of their belongings.',
    fate: 'Killed himself after capture by British troops in Austria, 31 May 1945.',
  },
  {
    id: 'stroop', name: 'Jürgen Stroop', life: '1895–1952', group: 'ss', reportsTo: 'kruger',
    role: 'SS and Police Leader, Warsaw',
    text: 'Commanded the destruction of the Warsaw ghetto during the uprising of April and May 1943, and compiled an illustrated report for Himmler titled “The Jewish Quarter of Warsaw Is No More”.',
    fate: 'Sentenced to death by an American court for shooting prisoners of war, then tried in Poland and hanged in Warsaw on 6 March 1952.',
  },
  {
    id: 'koppe', name: 'Wilhelm Koppe', life: '1896–1975', group: 'ss', reportsTo: 'himmler',
    role: 'Higher SS and Police Leader, Warthegau',
    text: 'Himmler’s representative in annexed western Poland. The gas-van unit that murdered psychiatric patients in 1939 and 1940 and then the Jews of the region at Chełmno operated under his authority.',
    fate: 'Lived under a false name in West Germany until 1960. Charged in 1964; the trial was abandoned on grounds of ill health. Died in 1975.',
  },
  {
    id: 'bach-zelewski', name: 'Erich von dem Bach-Zelewski', life: '1899–1972', group: 'ss', reportsTo: 'himmler',
    role: 'Higher SS and Police Leader, Central Russia; Chief of Anti-Partisan Units',
    text: 'Oversaw mass shootings of Jews in Belarus in 1941, including the massacres at Minsk and Mogilev, and the “anti-partisan” operations that destroyed thousands of villages. In 1944 he commanded the suppression of the Warsaw Uprising.',
    fate: 'Testified for the prosecution at Nuremberg and was never tried for his crimes in the east. Convicted in West Germany of political murders committed in 1934; died in prison in 1972.',
  },
  {
    id: 'ohlendorf', name: 'Otto Ohlendorf', life: '1907–1951', group: 'ss', reportsTo: 'heydrich',
    role: 'Commander of Einsatzgruppe D',
    text: 'An economist and lawyer by training. His unit murdered some 90,000 people in southern Ukraine and the Crimea in 1941 and 1942, as he testified at Nuremberg in a matter-of-fact tone.',
    fate: 'Sentenced to death in the Einsatzgruppen Trial; hanged at Landsberg on 7 June 1951.',
  },
  {
    id: 'nebe', name: 'Arthur Nebe', life: '1894–1945', group: 'ss', reportsTo: 'heydrich',
    role: 'Head of the Criminal Police; commander of Einsatzgruppe B',
    text: 'Led the Einsatzgruppe that followed Army Group Centre into Belarus in 1941, reporting more than 45,000 people shot by November. He experimented with killing psychiatric patients by explosives and exhaust gas, work that led to the gas van.',
    fate: 'Joined the conspiracy against Hitler in 1944; arrested after the July plot and executed in Berlin on 21 March 1945.',
  },
  {
    id: 'stahlecker', name: 'Franz Walter Stahlecker', life: '1900–1942', group: 'ss', reportsTo: 'heydrich',
    role: 'Commander of Einsatzgruppe A',
    text: 'His unit, operating in the Baltic states and toward Leningrad, reported about 250,000 Jews killed by early 1942, encouraging local pogroms in Kaunas and Riga in the first days of the invasion.',
    fate: 'Killed in a clash with Soviet partisans on 23 March 1942.',
  },
  {
    id: 'blobel', name: 'Paul Blobel', life: '1894–1951', group: 'ss', reportsTo: 'heydrich',
    role: 'Commander of Sonderkommando 4a; head of Aktion 1005',
    text: 'Commanded the unit that shot 33,771 Jews at Babyn Yar in September 1941. From 1942 he ran Aktion 1005, the programme to dig up and burn the bodies in the mass graves across eastern Europe to destroy the evidence of the killings.',
    fate: 'Sentenced to death in the Einsatzgruppen Trial; hanged at Landsberg on 7 June 1951.',
  },
  {
    id: 'jager', name: 'Karl Jäger', life: '1888–1959', group: 'ss', reportsTo: 'stahlecker',
    role: 'Commander of Einsatzkommando 3, Lithuania',
    text: 'His report of 1 December 1941 listed, place by place and day by day, 137,346 people shot by his unit, almost all of them Jews, and declared Lithuania free of Jews except for the workers in three ghettos.',
    fate: 'Lived as a farm worker until 1959, when he was identified and arrested. Killed himself in prison before trial.',
  },
  {
    id: 'jeckeln', name: 'Friedrich Jeckeln', life: '1895–1946', group: 'ss', reportsTo: 'himmler',
    role: 'Higher SS and Police Leader, occupied Soviet Union',
    text: 'Directed the massacres at Kamianets-Podilskyi, Babyn Yar and Rumbula. He devised a method in which victims were made to lie down on those already shot.',
    fate: 'Tried by a Soviet military court and hanged in Riga on 3 February 1946.',
  },

  // ── T4 ──────────────────────────────────────────────────
  {
    id: 'bouhler', name: 'Philipp Bouhler', life: '1899–1945', group: 't4', reportsTo: 'hitler',
    role: 'Head of the Chancellery of the Führer',
    text: 'Named with Karl Brandt in Hitler’s authorisation for the “euthanasia” killings. His office built and ran the T4 organisation, and later loaned its personnel to Operation Reinhard.',
    fate: 'Killed himself in American custody on 19 May 1945.',
  },
  {
    id: 'brandt', name: 'Karl Brandt', life: '1904–1948', group: 't4', reportsTo: 'hitler',
    role: 'Hitler’s escort physician; Reich Commissioner for Health',
    text: 'Co-director of the killing of people with disabilities, and implicated in medical experiments on camp prisoners.',
    fate: 'Lead defendant in the Doctors’ Trial at Nuremberg; hanged at Landsberg on 2 June 1948.',
  },
  {
    id: 'brack', name: 'Viktor Brack', life: '1904–1948', group: 't4', reportsTo: 'bouhler',
    role: 'Bouhler’s deputy; operational head of T4',
    text: 'Managed T4 day to day. In 1941 he offered his gassing personnel and expertise for use against Jews in the east, and proposed mass sterilisation by X-ray.',
    fate: 'Sentenced to death in the Doctors’ Trial; hanged on 2 June 1948.',
  },
  {
    id: 'heyde', name: 'Werner Heyde', life: '1902–1964', group: 't4', reportsTo: 'brack',
    role: 'Medical director of T4',
    text: 'A professor of psychiatry who recruited the doctors who filled in the forms selecting patients for death, and acted as a senior assessor himself.',
    fate: 'Practised medicine under a false name in Schleswig-Holstein until 1959. Killed himself in 1964, five days before his trial was due to begin.',
  },
  {
    id: 'wirth', name: 'Christian Wirth', life: '1885–1944', group: 't4', reportsTo: 'globocnik',
    role: 'T4 inspector; commandant of Bełżec; Inspector of the Reinhard camps',
    text: 'A police officer who supervised the first experimental gassing at Brandenburg, then carried the method to occupied Poland. He designed the killing process at Bełżec and oversaw Sobibór and Treblinka.',
    fate: 'Killed by Yugoslav partisans near Trieste on 26 May 1944.',
  },

  // ── Camps ───────────────────────────────────────────────
  {
    id: 'hoss', name: 'Rudolf Höss', life: '1901–1947', group: 'camps', reportsTo: 'glucks',
    role: 'Commandant of Auschwitz, 1940–43; returned 1944',
    text: 'Built Auschwitz from a barracks into the largest killing centre, introducing Zyklon B for mass murder. He returned in 1944 to oversee the murder of Hungary’s Jews. His family lived in a villa beside the camp.',
    fate: 'Testified at Nuremberg; tried in Poland and hanged at Auschwitz on 16 April 1947.',
  },
  {
    id: 'liebehenschel', name: 'Arthur Liebehenschel', life: '1901–1948', group: 'camps', reportsTo: 'glucks',
    role: 'Commandant of Auschwitz I, 1943–44; then Majdanek',
    text: 'Glücks’s long-serving deputy at the Inspectorate before taking over the Auschwitz main camp from Höss in November 1943, during the deportations from Theresienstadt, Italy and the Netherlands.',
    fate: 'Tried in Kraków and hanged on 24 January 1948.',
  },
  {
    id: 'baer', name: 'Richard Baer', life: '1911–1963', group: 'camps', reportsTo: 'glucks',
    role: 'Last commandant of Auschwitz, 1944–45; then Mittelbau-Dora',
    text: 'Took command of Auschwitz I in May 1944, as the Hungarian transports arrived, and oversaw the evacuation and death marches of January 1945.',
    fate: 'Arrested in 1960 while working as a forester under a false name. Died in custody in 1963 before the Frankfurt Auschwitz trial began.',
  },
  {
    id: 'kramer', name: 'Josef Kramer', life: '1906–1945', group: 'camps', reportsTo: 'glucks',
    role: 'Commandant of Natzweiler, Birkenau and Bergen-Belsen',
    text: 'Personally gassed 86 Jews at Natzweiler for an anatomical collection, ran Birkenau during the Hungarian deportations, and commanded Bergen-Belsen as tens of thousands died there.',
    fate: 'Convicted in the British Belsen Trial; hanged at Hamelin on 13 December 1945.',
  },
  {
    id: 'koch', name: 'Karl-Otto Koch', life: '1897–1945', group: 'camps', reportsTo: 'glucks',
    role: 'Commandant of Sachsenhausen, Buchenwald and Majdanek',
    text: 'Built Buchenwald and ran it through terror and personal enrichment. He was eventually prosecuted by the SS itself, for corruption and for murdering witnesses to it, not for the deaths of prisoners.',
    fate: 'Shot by the SS at Buchenwald in April 1945.',
  },
  {
    id: 'pister', name: 'Hermann Pister', life: '1885–1948', group: 'camps', reportsTo: 'glucks',
    role: 'Commandant of Buchenwald, 1942–45',
    text: 'Ran Buchenwald during its expansion into an armaments camp with more than a hundred subcamps, and during the death marches of April 1945.',
    fate: 'Sentenced to death by an American court at Dachau; died in prison in September 1948 before the sentence was carried out.',
  },
  {
    id: 'kaindl', name: 'Anton Kaindl', life: '1902–1948', group: 'camps', reportsTo: 'glucks',
    role: 'Commandant of Sachsenhausen, 1942–45',
    text: 'Commanded Sachsenhausen during the building of its gas chamber and the death march of April 1945.',
    fate: 'Sentenced to life imprisonment by a Soviet court; died in a camp in the Soviet Union in 1948.',
  },
  {
    id: 'ziereis', name: 'Franz Ziereis', life: '1905–1945', group: 'camps', reportsTo: 'glucks',
    role: 'Commandant of Mauthausen, 1939–45',
    text: 'Ran the harshest camp in the system for six years, including Gusen and the subcamps, and the killing of prisoners at Hartheim.',
    fate: 'Shot by American soldiers while trying to escape on 23 May 1945, and died of his wounds after giving a deathbed statement.',
  },
  {
    id: 'suhren', name: 'Fritz Suhren', life: '1908–1950', group: 'camps', reportsTo: 'glucks',
    role: 'Commandant of Ravensbrück, 1942–45',
    text: 'Commanded the women’s camp during the medical experiments, the growth of its subcamps and the gassings of early 1945.',
    fate: 'Escaped from British custody, was recaptured in 1949, tried by a French military court and executed on 12 June 1950.',
  },
  {
    id: 'pauly', name: 'Max Pauly', life: '1907–1946', group: 'camps', reportsTo: 'glucks',
    role: 'Commandant of Stutthof, then Neuengamme',
    text: 'Commanded Stutthof from 1939 and Neuengamme from 1942, during the Zyklon B murder of Soviet prisoners, the children’s experiments at Bullenhuser Damm and the evacuation to the Bay of Lübeck.',
    fate: 'Convicted in the British Neuengamme trial; hanged at Hamelin on 8 October 1946.',
  },
  {
    id: 'hoppe', name: 'Paul Werner Hoppe', life: '1910–1974', group: 'camps', reportsTo: 'glucks',
    role: 'Commandant of Stutthof, 1942–45',
    text: 'Commanded Stutthof as tens of thousands of Jewish women arrived from the Baltic ghettos and Auschwitz in 1944, and during the death marches of 1945.',
    fate: 'Sentenced in West Germany in 1957 to nine years for accessory to murder; released in 1960.',
  },
  {
    id: 'weiss', name: 'Martin Weiss', life: '1905–1946', group: 'camps', reportsTo: 'glucks',
    role: 'Commandant of Neuengamme, Dachau, Majdanek and the Mühldorf subcamps',
    text: 'One of the most widely employed commandants in the system, ending the war in charge of the Mühldorf camps where Jewish prisoners died building an underground aircraft factory for Dachau.',
    fate: 'Convicted in the American Dachau trial; hanged at Landsberg on 29 May 1946.',
  },
  {
    id: 'koegel', name: 'Max Koegel', life: '1895–1946', group: 'camps', reportsTo: 'glucks',
    role: 'Commandant of Ravensbrück, Majdanek and Flossenbürg',
    text: 'First commandant of Ravensbrück; commanded Majdanek while its gas chambers were installed, and Flossenbürg during its final death marches.',
    fate: 'Arrested in 1946 and killed himself in prison in June that year.',
  },
  {
    id: 'goth', name: 'Amon Göth', life: '1908–1946', group: 'camps', reportsTo: 'glucks',
    role: 'Commandant of Płaszów',
    text: 'Directed the liquidation of the Kraków and Tarnów ghettos and ran Płaszów by arbitrary murder, shooting prisoners himself.',
    fate: 'Tried in Kraków and hanged on 13 September 1946.',
  },
  {
    id: 'mengele', name: 'Josef Mengele', life: '1911–1979', group: 'camps', reportsTo: 'hoss',
    role: 'SS physician at Auschwitz-Birkenau',
    text: 'Took part in selections on the arrival ramp, sending people to the gas chambers, and conducted lethal experiments on prisoners, particularly twins, most of them children.',
    fate: 'Escaped to South America and was never tried. Drowned in Brazil in 1979.',
  },
  {
    id: 'stangl', name: 'Franz Stangl', life: '1908–1971', group: 'camps', reportsTo: 'wirth',
    role: 'Commandant of Sobibór and Treblinka',
    text: 'An Austrian policeman who went from the T4 centre at Hartheim to command two death camps, where around a million people were murdered.',
    fate: 'Fled to Brazil. Extradited in 1967, sentenced to life imprisonment in West Germany in 1970; died in prison in 1971.',
  },
  {
    id: 'eberl', name: 'Irmfried Eberl', life: '1910–1948', group: 'camps', reportsTo: 'wirth',
    role: 'Director of the T4 centres at Brandenburg and Bernburg; first commandant of Treblinka',
    text: 'The only physician to command a death camp. Under him Treblinka’s first weeks descended into chaos, with bodies piling up faster than they could be buried, and he was replaced by Stangl in August 1942.',
    fate: 'Arrested in 1948 and killed himself in his cell before trial.',
  },
  {
    id: 'franz', name: 'Kurt Franz', life: '1914–1998', group: 'camps', reportsTo: 'stangl',
    role: 'Deputy, then last commandant of Treblinka',
    text: 'Feared by the prisoners, who called him “the Doll”, he ran the camp’s daily brutality and set his dog on prisoners. He commanded Treblinka’s dismantling after the revolt. His photograph album of the camp, captioned “Beautiful Years”, was found at his home.',
    fate: 'Sentenced to life imprisonment at the Düsseldorf Treblinka trial in 1965; released in 1993. Died in 1998.',
  },
  {
    id: 'reichleitner', name: 'Franz Reichleitner', life: '1906–1944', group: 'camps', reportsTo: 'wirth',
    role: 'Commandant of Sobibór, 1942–43',
    text: 'Took over Sobibór from Stangl in September 1942 and commanded it during the deportations from the Netherlands and until the uprising of October 1943.',
    fate: 'Killed by Italian partisans near Fiume on 3 January 1944.',
  },
  {
    id: 'hering', name: 'Gottlieb Hering', life: '1887–1945', group: 'camps', reportsTo: 'wirth',
    role: 'Commandant of Bełżec, 1942',
    text: 'A police officer and T4 veteran who commanded Bełżec from August 1942 until its closure, and then the Poniatowa labour camp, where some 14,000 Jews were shot in November 1943.',
    fate: 'Died in a hospital in Württemberg on 9 October 1945, never tried.',
  },
  {
    id: 'lange', name: 'Herbert Lange', life: '1909–1945', group: 'camps', reportsTo: 'koppe',
    role: 'Commander of the gas-van unit; first commandant of Chełmno',
    text: 'His Sonderkommando murdered thousands of psychiatric patients in Poland and East Prussia with gas vans in 1939 and 1940, and in December 1941 began using them against Jews at Chełmno.',
    fate: 'Killed in the fighting in Berlin in April 1945.',
  },
  {
    id: 'bothmann', name: 'Hans Bothmann', life: '1911–1946', group: 'camps', reportsTo: 'koppe',
    role: 'Commandant of Chełmno, 1942–43 and 1944–45',
    text: 'Commanded Chełmno for most of its existence, including the murder of the Jews deported from Łódź in 1942 and again in 1944, and the shooting of the last prisoners in January 1945.',
    fate: 'Killed himself in British custody in April 1946.',
  },

  // ── Administration ──────────────────────────────────────
  {
    id: 'frank', name: 'Hans Frank', life: '1900–1946', group: 'administration', reportsTo: 'hitler',
    role: 'Governor-General of occupied Poland',
    text: 'Hitler’s lawyer, who ruled the territory in which the Reinhard camps and the largest ghettos stood. In December 1941 he told his officials: “We must annihilate the Jews wherever we find them.”',
    fate: 'Sentenced to death at Nuremberg and hanged on 16 October 1946.',
  },
  {
    id: 'buhler', name: 'Josef Bühler', life: '1904–1948', group: 'administration', reportsTo: 'frank',
    role: 'State Secretary of the General Government',
    text: 'Represented Frank at the Wannsee Conference, where he asked that the “Final Solution” begin in the General Government, since the Jews there were, he said, a danger as carriers of disease and most were unfit for work.',
    fate: 'Tried in Kraków and hanged on 22 August 1948.',
  },
  {
    id: 'stuckart', name: 'Wilhelm Stuckart', life: '1902–1953', group: 'administration', reportsTo: 'frick',
    role: 'State Secretary, Reich Ministry of the Interior',
    text: 'Co-author of the Nuremberg Laws and of the commentary that defined who was a Jew. At Wannsee he argued for the compulsory sterilisation of people of mixed descent.',
    fate: 'Sentenced to time served in the Ministries Trial in 1949. Died in a car crash in 1953.',
  },
  {
    id: 'rosenberg', name: 'Alfred Rosenberg', life: '1893–1946', group: 'administration', reportsTo: 'hitler',
    role: 'Party ideologue; Minister for the Occupied Eastern Territories',
    text: 'A principal source of Nazi racial doctrine and promoter of the forged “Protocols of the Elders of Zion”. His ministry governed the Baltic states, Belarus and Ukraine during the mass shootings, and his task force looted Jewish libraries and art across Europe.',
    fate: 'Sentenced to death at Nuremberg and hanged on 16 October 1946.',
  },
  {
    id: 'streicher', name: 'Julius Streicher', life: '1885–1946', group: 'administration', reportsTo: 'hitler',
    role: 'Publisher of Der Stürmer',
    text: 'For over twenty years his weekly paper printed obscene antisemitic caricature and calls for annihilation. He held no role in carrying out the killing; he was convicted for inciting it.',
    fate: 'Sentenced to death at Nuremberg for crimes against humanity; hanged on 16 October 1946.',
  },
  {
    id: 'greiser', name: 'Arthur Greiser', life: '1897–1946', group: 'administration', reportsTo: 'hitler',
    role: 'Gauleiter of the Warthegau',
    text: 'Ruled the annexed region of western Poland that included Łódź. He sought and received approval to murder 100,000 Jews in his territory, leading to the creation of Chełmno.',
    fate: 'Tried in Poland and hanged in Poznań on 21 July 1946.',
  },
  {
    id: 'biebow', name: 'Hans Biebow', life: '1902–1947', group: 'administration', reportsTo: 'greiser',
    role: 'Head of the German ghetto administration, Łódź',
    text: 'A coffee merchant who ran the Łódź ghetto as a business, profiting from its workshops and from the property of the deported, and personally organised the final deportations to Chełmno and Auschwitz in 1944.',
    fate: 'Tried in Łódź and hanged on 23 June 1947.',
  },
  {
    id: 'seyss-inquart', name: 'Arthur Seyss-Inquart', life: '1892–1946', group: 'administration', reportsTo: 'hitler',
    role: 'Reich Commissioner for the occupied Netherlands',
    text: 'Oversaw the registration, isolation and deportation of the Jews of the Netherlands, three-quarters of whom were murdered.',
    fate: 'Sentenced to death at Nuremberg and hanged on 16 October 1946.',
  },
]

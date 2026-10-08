import type { BadgeKind } from '../Badge'
import type { VictimStory } from './types'

// To add a story: append an entry below. Keep to what is documented, and add the source to sources.ts.
export const victims: VictimStory[] = [
  {
    id: 'anne-frank', name: 'Anne Frank', life: '1929–1945', from: 'Frankfurt am Main; Amsterdam', group: 'Jewish',
    text: 'Anne was four when her family fled Germany for Amsterdam. From July 1942 she hid with seven others in the annexe behind her father’s business, and kept a diary. Betrayed and arrested on 4 August 1944, the family was sent on the last train from Westerbork to Auschwitz. Anne and her sister Margot died of typhus at Bergen-Belsen in February or March 1945. She was fifteen. Her father Otto, the only survivor of the eight, published her diary in 1947.',
    links: [{label: 'Anne Frank House, Amsterdam',url: 'https://www.annefrank.org/en/'},{label: 'The diary, in the Anne Frank House collection',url: 'https://www.annefrank.org/en/anne-frank/the-diary/'}],
  },
  {
    id: 'korczak', name: 'Janusz Korczak', life: '1878–1942', from: 'Warsaw', group: 'Jewish',
    text: 'Henryk Goldszmit, paediatrician, children’s author and broadcaster known across Poland as Janusz Korczak, ran an orphanage on the principle that children have rights. When it was forced into the Warsaw ghetto he went with it. He repeatedly refused offers of rescue. In early August 1942 he walked with nearly 200 children and his staff to the Umschlagplatz and boarded the train to Treblinka with them.',
    links: [{label: 'Janusz Korczak at Yad Vashem',url: 'https://www.yadvashem.org/education/educational-materials/learning-environment/korczak.html'}],
  },
  {
    id: 'petr-ginz', name: 'Petr Ginz', life: '1928–1944', from: 'Prague', group: 'Jewish',
    text: 'By fourteen Petr had written five novels and filled diaries and sketchbooks. Deported alone to Theresienstadt in 1942, he founded and edited Vedem (“We Lead”), a secret weekly magazine written by the boys of his barracks. He was murdered at Auschwitz in the autumn of 1944, aged sixteen. A copy of his drawing of the Earth seen from the Moon was carried into space in 2003.',
    links: [{label: 'Petr Ginz at Yad Vashem',url: 'https://www.yadvashem.org/yv/en/exhibitions/ginz/index.asp'}],
  },
  {
    id: 'etty-hillesum', name: 'Etty Hillesum', life: '1914–1943', from: 'Middelburg; Amsterdam', group: 'Jewish',
    text: 'Etty’s diaries and letters record an inner life growing deeper as the world around her closed in. She chose to work in Westerbork, caring for those awaiting transport, and declined chances to hide. On 7 September 1943 she was deported with her parents and brother. She threw a postcard from the train: “We left the camp singing.” She died at Auschwitz on 30 November 1943.',
    links: [{label: 'Etty Hillesum Research Centre',url: 'https://www.ehoc.nl/'}],
  },
  {
    id: 'helene-berr', name: 'Hélène Berr', life: '1921–1945', from: 'Paris', group: 'Jewish',
    text: 'A student of English literature at the Sorbonne, Hélène began her journal in 1942, recording the first day she wore the yellow star through the streets of Paris. She worked clandestinely to place Jewish children in safe homes. Arrested with her parents in March 1944, she survived Auschwitz and a death march, and died at Bergen-Belsen days before its liberation.',
    links: [{label: 'Mémorial de la Shoah, Paris',url: 'https://www.memorialdelashoah.org/en/'}],
  },
  {
    id: 'rutka-laskier', name: 'Rutka Laskier', life: '1929–1943', from: 'Będzin, Poland', group: 'Jewish',
    text: 'Over four months in 1943, fourteen-year-old Rutka wrote in a school notebook about crushes and quarrels, and about what she had seen German soldiers do. “The rope around us is getting tighter and tighter,” she wrote. She hid the notebook under the floorboards and told a friend where to find it. She was deported to Auschwitz in August 1943. The diary was made public in 2006.',
    links: [{label: 'Rutka’s Notebook at Yad Vashem',url: 'https://www.yadvashem.org/yv/en/exhibitions/rutka/index.asp'}],
  },
  {
    id: 'charlotte-salomon', name: 'Charlotte Salomon', life: '1917–1943', from: 'Berlin', group: 'Jewish',
    text: 'In exile in the south of France, Charlotte painted her whole life in some 1,300 gouaches with text and musical cues, a work she titled Life? or Theatre? She gave the paintings to a friend, saying: “Keep this safe. It is my whole life.” She was arrested in September 1943 and murdered on arrival at Auschwitz on 10 October. She was twenty-six, and pregnant.',
    links: [{label: 'Life? or Theatre?, Jewish Museum Amsterdam',url: 'https://charlotte.jck.nl/'}],
  },
  {
    id: 'felix-nussbaum', name: 'Felix Nussbaum', life: '1904–1944', from: 'Osnabrück', group: 'Jewish',
    text: 'A painter whose late works, made in hiding in Brussels, are among the most direct artistic testimony of persecution, among them Self-Portrait with Jewish Identity Card. He and his wife, the painter Felka Platek, were denounced and deported on the last transport from Mechelen, on 31 July 1944. Both were murdered at Auschwitz.',
    links: [{label: 'Felix-Nussbaum-Haus, Osnabrück',url: 'https://www.osnabrueck.de/felix-nussbaum-haus/'}],
  },
  {
    id: 'settela-steinbach', name: 'Settela Steinbach', life: '1934–1944', from: 'Buchten, Netherlands', group: 'Sinti',
    text: 'For decades the girl in a headscarf glancing out from the closing door of a cattle car, filmed at Westerbork on 19 May 1944, was known only as an anonymous symbol of the deportation of the Jews. In 1994 a journalist established that she was Anna Maria “Settela” Steinbach, a nine-year-old Sinti girl. She was murdered at Birkenau with her mother and siblings, probably on the night the “Gypsy family camp” was liquidated.',
    links: [{label: 'Settela Steinbach, Westerbork Memorial',url: 'https://kampwesterbork.nl/en/'}],
  },
  {
    id: 'czeslawa-kwoka', name: 'Czesława Kwoka', life: '1928–1943', from: 'Wólka Złojecka, Poland', group: 'Polish',
    text: 'A Catholic girl from the Zamość region, which the SS was clearing of Poles to make way for German settlers. Czesława was deported to Auschwitz with her mother in December 1942. Her three identity photographs, taken by prisoner-photographer Wilhelm Brasse moments after a guard struck her, show a split lip and a child’s terror. She died on 12 March 1943, aged fourteen.',
    links: [{label: 'Auschwitz-Birkenau Memorial and Museum',url: 'https://www.auschwitz.org/en/'}],
  },
  {
    id: 'anna-lehnkering', name: 'Anna Lehnkering', life: '1915–1940', from: 'Sterkrade, Germany', group: 'Victims of “euthanasia”',
    text: 'Anna had learning difficulties as a child. Under the 1933 sterilisation law she was forcibly sterilised, and in 1936 committed to the Bedburg-Hau asylum. On 7 March 1940 she was taken to Grafeneck and murdered in the gas chamber, aged twenty-four. Her family was told she had died of peritonitis. Her niece discovered her name on a list in 2003 and has worked since to restore the names of T4’s victims.',
    links: [{label: 'The T4 memorial, Berlin',url: 'https://www.t4-denkmal.de/eng'}],
  },
  {
    id: 'august-dickmann', name: 'August Dickmann', life: '1910–1939', from: 'Dinslaken, Germany', group: 'Jehovah’s Witnesses',
    text: 'Imprisoned in Sachsenhausen for his faith, August refused to sign his military service papers when war began. On 15 September 1939 the camp was assembled to watch him shot, the first conscientious objector executed in the war. The SS expected the other Witnesses to renounce their beliefs. None did.',
    links: [{label: 'Jehovah’s Witnesses under Nazism, USHMM',url: 'https://encyclopedia.ushmm.org/content/en/article/jehovahs-witnesses'}],
  },
  {
    id: 'ringelblum', name: 'Emanuel Ringelblum', life: '1900–1944', from: 'Warsaw', group: 'Jewish',
    text: 'A historian who resolved that the story of the Warsaw ghetto would be written by its victims rather than its murderers. His secret group Oyneg Shabes gathered diaries, reports, posters, sweet wrappers, children’s essays, everything, and buried them in milk cans and metal boxes. Ringelblum, his wife Yehudis and their son Uri were discovered in hiding and shot in March 1944. Two of the three caches were dug from the ruins after the war.',
    links: [{label: 'The Ringelblum Archive, Jewish Historical Institute',url: 'https://www.jhi.pl/en/ringelblum-archive'}],
  },
  {
    id: 'anielewicz', name: 'Mordechai Anielewicz', life: '1919–1943', from: 'Warsaw', group: 'Jewish',
    text: 'Commander of the Jewish Combat Organisation (ŻOB) in the Warsaw Ghetto Uprising, at twenty-four. “The dream of my life has risen to become fact,” he wrote in his last letter. “Jewish armed resistance and revenge are facts.” He died on 8 May 1943 when the command bunker at Miła 18 was surrounded.',
    links: [{label: 'The Warsaw Ghetto Uprising, POLIN Museum',url: 'https://polin.pl/en'}],
  },
  {
    id: 'kolbe', name: 'Maximilian Kolbe', life: '1894–1941', from: 'Zduńska Wola, Poland', group: 'Polish',
    text: 'A Franciscan friar arrested in 1941. When ten men at Auschwitz were chosen to starve to death in reprisal for an escape, Kolbe volunteered to take the place of Franciszek Gajowniczek, a stranger who had cried out for his wife and children. After two weeks he was killed by injection on 14 August 1941. Gajowniczek lived until 1995.',
    links: [{label: 'Maximilian Kolbe, Auschwitz Museum',url: 'https://www.auschwitz.org/en/'}],
  },
  {
    id: 'primo-levi', name: 'Primo Levi', life: '1919–1987', from: 'Turin', group: 'Jewish', survivor: true,
    text: 'A chemist, arrested as a partisan and deported from Fossoli to Auschwitz in February 1944. Of the 650 people on his transport, about twenty returned. His training earned him work in the Buna laboratory at Monowitz, which helped him live. If This Is a Man, written within months of his return, remains one of the essential accounts of the camps.',
    links: [{label: 'Centro Internazionale di Studi Primo Levi',url: 'https://www.primolevi.it/en'}],
  },
  {
    id: 'elie-wiesel', name: 'Elie Wiesel', life: '1928–2016', from: 'Sighet, Transylvania', group: 'Jewish', survivor: true,
    text: 'Deported to Auschwitz at fifteen with the Jews of Sighet in May 1944. His mother and youngest sister were gassed on arrival; his father died at Buchenwald weeks before liberation. His memoir Night gave testimony a voice a generation after the war. He received the Nobel Peace Prize in 1986.',
    links: [{label: 'The Elie Wiesel Foundation for Humanity',url: 'https://eliewieselfoundation.org/'}],
  },
  {
    id: 'simone-veil', name: 'Simone Veil', life: '1927–2017', from: 'Nice', group: 'Jewish', survivor: true,
    text: 'Arrested at sixteen, the day after her final school exams, and deported from Drancy to Auschwitz. Her father, brother and mother did not survive. She became a magistrate, France’s Minister of Health, and the first President of the elected European Parliament. Her prisoner number, 78651, is engraved on her ceremonial sword.',
    links: [{label: 'Simone Veil, Mémorial de la Shoah',url: 'https://www.memorialdelashoah.org/en/'}],
  },
]

export const victimGroups: { name: string; figure: string; text: string; badge: BadgeKind }[] = [
  { badge: 'star', name: 'Jews', figure: 'About 6 million', text: 'Two-thirds of Europe’s Jewish population, including some 1.5 million children.' },
  { badge: 'soviet', name: 'Soviet prisoners of war', figure: 'About 3.3 million', text: 'Starved, shot or worked to death in German captivity.' },
  { badge: 'red-p', name: 'Polish civilians', figure: 'About 1.8 million', text: 'Non-Jewish Poles killed in executions, camps and reprisals.' },
  { badge: 'brown', name: 'Roma and Sinti', figure: '200,000–500,000', text: 'Murdered in camps and by shooting across Europe.' },
  { badge: 't4', name: 'People with disabilities', figure: '250,000–300,000', text: 'Killed under T4 and in the programmes that followed it.' },
  { badge: 'red', name: 'Political opponents and resisters', figure: 'Tens of thousands', text: 'Communists, socialists, trade unionists, and resistance members from every occupied country.' },
  { badge: 'purple', name: 'Jehovah’s Witnesses', figure: 'About 1,700', text: 'Persecuted for refusing allegiance to the regime and military service.' },
  { badge: 'pink', name: 'Gay men', figure: 'Thousands', text: 'Up to 15,000 were sent to concentration camps under Paragraph 175; most did not survive.' },
]

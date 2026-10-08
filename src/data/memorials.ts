export interface Memorial {
  id: string
  name: string
  place: string
  country: string
  coords: [number, number]
  /** when the memorial was dedicated or the site opened to the public */
  year: string
  text: string
  /** English Wikipedia article the photograph is taken from */
  article: string
  url?: string
}

export const memorials: Memorial[] = [
  {
    id: 'berlin-jews', name: 'Memorial to the Murdered Jews of Europe', place: 'Berlin', country: 'Germany', coords: [52.5139, 13.3789], year: '2005',
    text: 'A field of 2,711 concrete slabs on uneven ground beside the Brandenburg Gate, designed by Peter Eisenman. Visitors walk in among the slabs, which rise above head height as the ground falls away. Beneath it, the Information Centre holds the names and short biographies of victims, read aloud in the Room of Names.',
    article: 'Memorial to the Murdered Jews of Europe', url: 'https://www.stiftung-denkmal.de/en/',
  },
  {
    id: 'berlin-sinti-roma', name: 'Memorial to the Sinti and Roma Victims of National Socialism', place: 'Berlin', country: 'Germany', coords: [52.5184, 13.3745], year: '2012',
    text: 'A dark circular pool in the Tiergarten by Dani Karavan. A fresh flower is placed each day on the triangular stone at its centre, and the poem Auschwitz by the Roma poet Santino Spinelli runs round the rim. Around the pool, panels set out the chronology of the genocide of Europe’s Roma and Sinti.',
    article: 'Memorial to the Sinti and Roma Victims of National Socialism',
  },
  {
    id: 'berlin-homosexuals', name: 'Memorial to Homosexuals Persecuted under Nazism', place: 'Berlin', country: 'Germany', coords: [52.5134, 13.3760], year: '2008',
    text: 'A single leaning concrete slab at the edge of the Tiergarten, facing the memorial to the murdered Jews. Through a small window a film plays of two people kissing. It remembers the men convicted under Paragraph 175 and sent to the camps, and the women whose lives were destroyed by the same regime.',
    article: 'Memorial to Homosexuals Persecuted Under Nazism',
  },
  {
    id: 'berlin-t4', name: 'Memorial to the Victims of the “Euthanasia” Killings', place: 'Tiergartenstrasse 4, Berlin', country: 'Germany', coords: [52.5096, 13.3703], year: '2014',
    text: 'A long wall of blue glass on the site of the villa from which Aktion T4 was run, next to the Philharmonie. An open-air exhibition along its base tells of the 300,000 psychiatric patients and disabled people murdered in the killing centres and hospitals, and of the doctors who selected them.',
    article: 'Tiergartenstraße 4',
  },
  {
    id: 'berlin-gleis-17', name: 'Platform 17 memorial', place: 'Grunewald station, Berlin', country: 'Germany', coords: [52.4886, 13.2626], year: '1998',
    text: 'Along the edge of the platform from which most of Berlin’s Jews were deported, 186 cast-steel plates record every train: its date, the number of people aboard and its destination, from Łódź and Riga in 1941 to Theresienstadt and Auschwitz in 1945. Trees have been allowed to grow between the rails.',
    article: 'Platform 17 memorial',
  },
  {
    id: 'berlin-bebelplatz', name: 'The Empty Library', place: 'Bebelplatz, Berlin', country: 'Germany', coords: [52.5162, 13.3942], year: '1995',
    text: 'A glass plate set into the square where students burned some 20,000 books on 10 May 1933. Beneath it is a white room lined with empty shelves, with space for the books that were destroyed. Nearby, a plaque carries Heine’s line of 1821: where they burn books, they will in the end also burn people.',
    article: 'Bebelplatz',
  },
  {
    id: 'dachau', name: 'Dachau Concentration Camp Memorial Site', place: 'Dachau', country: 'Germany', coords: [48.2699, 11.4683], year: '1965',
    text: 'The first camp, opened in March 1933, became the first German memorial site in 1965, at the insistence of survivors. The Jourhaus gate, two reconstructed barracks, the crematorium and the religious memorials are preserved, with Nandor Glid’s bronze of emaciated figures caught in barbed wire at the roll-call square.',
    article: 'Dachau concentration camp', url: 'https://www.kz-gedenkstaette-dachau.de/en/',
  },
  {
    id: 'belsen', name: 'Bergen-Belsen Memorial', place: 'near Celle', country: 'Germany', coords: [52.7580, 9.9076], year: '1952',
    text: 'The British burned the typhus-ridden camp after its liberation; what remains is a heathland of mass graves marked with their counts: “Here rest 5,000 dead”. Among the memorials is a stone for Anne and Margot Frank, who died here in early 1945. The documentation centre opened in 2007.',
    article: 'Bergen-Belsen concentration camp', url: 'https://bergen-belsen.stiftung-ng.de/en/',
  },
  {
    id: 'stolpersteine', name: 'Stolpersteine', place: 'Streets across Europe', country: 'Europe', coords: [50.9375, 6.9603], year: 'since 1992',
    text: 'Small brass plates set into the pavement outside the last freely chosen home of a victim: “Here lived”, a name, a birth year, the date of deportation and the fate. Begun by the artist Gunter Demnig in Cologne, there are now more than 100,000 of them in over 1,200 towns, the largest decentralised memorial in the world.',
    article: 'Stolperstein', url: 'https://www.stolpersteine.eu/en/',
  },
  {
    id: 'auschwitz', name: 'Auschwitz-Birkenau State Museum', place: 'Oświęcim', country: 'Poland', coords: [50.0343, 19.1779], year: '1947',
    text: 'The two main camps are preserved as they were left: the brick blocks and the gate of Auschwitz I, the ramp, barracks and the ruins of the gas chambers and crematoria at Birkenau. At the end of the railway line, the International Monument of 1967 carries the same warning in 23 languages. Over two million people visit each year.',
    article: 'Auschwitz-Birkenau State Museum', url: 'https://www.auschwitz.org/en/',
  },
  {
    id: 'treblinka', name: 'Treblinka memorial', place: 'Treblinka', country: 'Poland', coords: [52.6314, 22.0528], year: '1964',
    text: 'Nothing was left of the death camp, so the sculptors Adam Haupt and Franciszek Duszeńko made a symbolic graveyard: a granite monolith split by a cleft, surrounded by 17,000 jagged stones, many inscribed with the name of a community whose Jews were murdered here. One stone alone bears a person’s name: Janusz Korczak and the children.',
    article: 'Treblinka extermination camp', url: 'https://muzeumtreblinka.eu/en/',
  },
  {
    id: 'belzec', name: 'Bełżec memorial', place: 'Bełżec', country: 'Poland', coords: [50.3714, 23.4594], year: '2004',
    text: 'The whole area of the camp is covered with a field of industrial slag, the ground where some 450,000 people lie. A single path cuts through it, sinking between walls of concrete until it ends at a wall bearing the words of Job: “Earth, do not cover my blood”. Round the edge run the names of the towns the victims came from.',
    article: 'Bełżec extermination camp',
  },
  {
    id: 'sobibor', name: 'Sobibór Museum and Memorial', place: 'Sobibór', country: 'Poland', coords: [51.4473, 23.5932], year: '2020',
    text: 'The site of the camp from which some 300 prisoners escaped in October 1943. Excavations after 2007 found the foundations of the gas chambers; the new museum and memorial, opened in 2020, protect the mound of ashes and the path the victims walked, lined with stones for individuals placed by their families.',
    article: 'Sobibor extermination camp', url: 'https://www.sobibor-memorial.eu/en',
  },
  {
    id: 'warsaw-ghetto-heroes', name: 'Monument to the Ghetto Heroes', place: 'Warsaw', country: 'Poland', coords: [52.2496, 20.9934], year: '1948',
    text: 'Nathan Rapoport’s bronze of the ghetto fighters, set in a wall of labradorite that had been ordered by the Nazis for a victory monument, stands where the Warsaw Ghetto Uprising began. In 1970 the West German chancellor Willy Brandt fell to his knees here. The POLIN Museum of the History of Polish Jews faces it across the square.',
    article: 'Ghetto Heroes Monument',
  },
  {
    id: 'judenplatz', name: 'Judenplatz Holocaust Memorial', place: 'Vienna', country: 'Austria', coords: [48.2116, 16.3697], year: '2000',
    text: 'Rachel Whiteread’s “Nameless Library”: a closed concrete room whose walls are the cast of shelves of books, their spines turned inward, their titles unreadable. Around its base are the names of the places where 65,000 Austrian Jews were murdered. It stands on the square where the city’s medieval synagogue was destroyed in 1421.',
    article: 'Judenplatz Holocaust Memorial',
  },
  {
    id: 'mauthausen', name: 'Mauthausen Memorial', place: 'Mauthausen', country: 'Austria', coords: [48.2566, 14.5017], year: '1949',
    text: 'The granite camp above the Danube, with the quarry and its 186 steps, was handed to Austria by the Soviet Union in 1947 and opened as a memorial two years later. Along the approach stand national monuments from more than twenty countries whose citizens died here, and a memorial to the camp’s Roma and Sinti and to the murdered Soviet prisoners.',
    article: 'Mauthausen concentration camp', url: 'https://www.mauthausen-memorial.org/en',
  },
  {
    id: 'hartheim', name: 'Hartheim Castle', place: 'Alkoven', country: 'Austria', coords: [48.2817, 14.1142], year: '2003',
    text: 'A Renaissance castle that was a home for disabled children before Aktion T4 turned it into a killing centre. About 30,000 people were gassed here between 1940 and 1944, including prisoners from Mauthausen and Dachau. The Learning and Memorial Site documents the killings and the history of the valuing of human life.',
    article: 'Hartheim Euthanasia Centre', url: 'https://www.schloss-hartheim.at/en/',
  },
  {
    id: 'anne-frank', name: 'Anne Frank House', place: 'Amsterdam', country: 'Netherlands', coords: [52.3752, 4.8840], year: '1960',
    text: 'The canal house on the Prinsengracht in whose rear annexe the Frank family and four others hid from July 1942 until their betrayal in August 1944. The rooms are kept empty, as Otto Frank wished. Anne’s original diary is displayed; more than a million people climb the steep stairs behind the bookcase each year.',
    article: 'Anne Frank House', url: 'https://www.annefrank.org/en/',
  },
  {
    id: 'names-amsterdam', name: 'National Holocaust Names Memorial', place: 'Amsterdam', country: 'Netherlands', coords: [52.3659, 4.9095], year: '2021',
    text: 'Daniel Libeskind’s walls of brick, each brick carrying a name, a birth date and the age at death of one of the 102,000 Jews and 220 Roma and Sinti deported from the Netherlands and murdered. Seen from above, the walls form the Hebrew letters of the word for “in memory of”.',
    article: 'National Holocaust Names Memorial',
  },
  {
    id: 'westerbork', name: 'Westerbork Memorial', place: 'Hooghalen', country: 'Netherlands', coords: [52.9167, 6.6069], year: '1970',
    text: 'The transit camp from which 93 trains left for Auschwitz, Sobibór, Theresienstadt and Bergen-Belsen. At the end of the line the rails rise and twist into the air. On the site of the roll-call ground stand 102,000 stones, one for each person deported, a Star of David on those of the Jews and a flame on those of the Roma and Sinti.',
    article: 'Westerbork transit camp', url: 'https://kampwesterbork.nl/en/',
  },
  {
    id: 'paris', name: 'Mémorial de la Shoah', place: 'Paris', country: 'France', coords: [48.8549, 2.3561], year: '2005',
    text: 'Built around the Tomb of the Unknown Jewish Martyr of 1956, with the Wall of Names listing the 76,000 Jews deported from France, most of them to Auschwitz, and the Wall of the Righteous naming the French people who hid and rescued Jews. Its archive holds the French deportation lists and the Drancy files.',
    article: 'Mémorial de la Shoah', url: 'https://www.memorialdelashoah.org/en/',
  },
  {
    id: 'shoes', name: 'Shoes on the Danube Bank', place: 'Budapest', country: 'Hungary', coords: [47.5039, 19.0449], year: '2005',
    text: 'Sixty pairs of iron shoes, in the styles of the 1940s, along the river below Parliament. In the winter of 1944 to 1945 the Arrow Cross militia lined Jews up here, ordered them to remove their shoes and shot them into the Danube. The sculptures are by Gyula Pauer, after an idea by the film director Can Togay.',
    article: 'Shoes on the Danube Bank',
  },
  {
    id: 'pinkas', name: 'Pinkas Synagogue', place: 'Prague', country: 'Czech Republic', coords: [50.0893, 14.4170], year: '1960',
    text: 'The walls of the sixteenth-century synagogue are inscribed, town by town, with the names and dates of some 78,000 Jews of Bohemia and Moravia murdered in the Holocaust. The communist authorities closed it and let the inscriptions decay; they were rewritten after 1989. Upstairs hang drawings made by children in Theresienstadt.',
    article: 'Pinkas Synagogue', url: 'https://www.jewishmuseum.cz/en/explore/sites/pinkas-synagogue/',
  },
  {
    id: 'babyn-yar', name: 'Babyn Yar', place: 'Kyiv', country: 'Ukraine', coords: [50.4719, 30.4475], year: '1976',
    text: 'The ravine where 33,771 Jews were shot in two days in September 1941, and tens of thousands more people in the two years after. The Soviet monument of 1976 did not mention Jews; the bronze menorah of 1991 does. A new Holocaust memorial centre has been under construction since 2016, interrupted by the war.',
    article: 'Babi Yar',
  },
  {
    id: 'ponary', name: 'Paneriai Memorial', place: 'Vilnius', country: 'Lithuania', coords: [54.6228, 25.1731], year: '1991',
    text: 'In the pine forest outside Vilnius, in pits dug for fuel tanks, German units and Lithuanian auxiliaries shot about 70,000 Jews, most of the Jewish population of the city, along with Poles and Soviet prisoners. Memorials stand at the pits; the Jewish memorial, with its inscription in Hebrew and Yiddish, was permitted only after independence.',
    article: 'Ponary massacre',
  },
  {
    id: 'risiera', name: 'Risiera di San Sabba', place: 'Trieste', country: 'Italy', coords: [45.6245, 13.7873], year: '1965',
    text: 'A rice-husking mill used by the SS as a police camp and the only camp in Italy with a crematorium. Several thousand Italian and Slovene partisans, hostages and Jews were killed here, and some 20,000 more passed through on their way to the camps in the Reich. It was made a national monument in 1965 and a museum in 1975.',
    article: 'Risiera di San Sabba',
  },
  {
    id: 'kindertransport', name: 'Kindertransport: The Arrival', place: 'Liverpool Street station, London', country: 'United Kingdom', coords: [51.5178, -0.0817], year: '2006',
    text: 'Frank Meisler’s bronze of five children with their suitcases, at the station where the Kindertransport trains from the Hook of Holland arrived. Meisler himself came this way from Danzig in 1939; his parents were murdered in Auschwitz. Nearly 10,000 children were brought to Britain between December 1938 and the outbreak of war.',
    article: 'Kindertransport – The Arrival',
  },
  {
    id: 'yad-vashem', name: 'Yad Vashem', place: 'Jerusalem', country: 'Israel', coords: [31.7743, 35.1757], year: '1953',
    text: 'Israel’s memorial to the Holocaust, on the Mount of Remembrance. The Hall of Names holds Pages of Testimony for more than 4.8 million victims; the Children’s Memorial reflects the light of a few candles into an infinity of stars while names are read; the Avenue of the Righteous honours those who risked their lives to rescue Jews.',
    article: 'Yad Vashem', url: 'https://www.yadvashem.org/',
  },
]

// Front positions at the end of each month, January 1943 to April 1945, written for this site from the standard
// accounts of the campaigns (the dates on which named towns changed hands). Each line is a chain of [lng, lat]
// points through documented positions; between the towns the line is straight, so it is right to the scale of a
// map of Europe (a few tens of kilometres), not to the scale of a battlefield. Eastern and western lines run north
// to south; Italian lines run west to east. The two lines from ww2-atlas that are reused are credited in
// build-fronts.mjs; the ww2-atlas Normandy beachhead line is the only one kept from that set.

export const east = {
  // After Stalingrad: Rzhev salient and Demyansk still held, Voronezh and Rostov lost, Kuban bridgehead forming
  '1943-01': [[30.3, 59.9], [31.3, 58.5], [32.5, 57.7], [31.2, 57.1], [30.5, 56.3], [34.3, 56.3], [34.3, 55.2], [34.3, 54.1], [36.5, 52.9], [38.1, 51.8], [38.1, 50.2], [38.9, 49.3], [39.5, 48.6], [39.9, 47.3], [39.0, 45.6], [37.8, 44.7]],
  // Kursk and Kharkov briefly Soviet, Rostov retaken; Rzhev about to be evacuated
  '1943-02': [[30.3, 59.9], [31.3, 58.5], [31.4, 58.0], [30.5, 56.3], [34.3, 56.3], [34.3, 55.2], [34.3, 54.1], [36.5, 52.9], [35.6, 51.7], [35.0, 50.9], [35.8, 49.9], [35.9, 48.5], [37.6, 48.8], [38.9, 47.2], [37.5, 45.3]],
  // Manstein's counterstroke: Kharkov and Belgorod German again, the Kursk salient formed (ww2-atlas line, 20 March)
  '1943-03': [[30.3, 59.9], [31.2, 57.1], [31.2, 55.6], [34.3, 54.1], [35.0, 52.9], [34.5, 52.1], [35.3, 51.5], [36.6, 50.6], [36.6, 50.0], [37.3, 49.4], [37.6, 48.8], [38.9, 47.2], [37.5, 45.3]],
  // Kursk: the salient after the German offensive failed, Orel about to fall
  '1943-07': [[30.3, 59.9], [31.3, 58.5], [31.4, 58.0], [30.5, 56.3], [31.2, 55.6], [34.3, 54.1], [36.1, 52.9], [35.2, 51.6], [36.6, 50.6], [36.6, 50.0], [37.3, 49.2], [37.6, 48.8], [38.9, 47.2], [37.5, 45.3]],
  // Orel, Belgorod, Kharkov and Taganrog retaken
  '1943-08': [[30.3, 59.9], [31.3, 58.5], [30.5, 56.3], [32.5, 54.8], [34.3, 54.1], [34.0, 53.0], [34.3, 52.0], [34.8, 51.0], [35.5, 50.0], [37.0, 49.0], [37.9, 48.1], [38.2, 47.3], [37.5, 45.3]],
  // The race to the Dnieper: Smolensk retaken, the Kuban evacuated, Crimea still held
  '1943-09': [[30.3, 59.9], [31.3, 58.5], [30.5, 56.3], [31.0, 55.2], [31.5, 54.5], [31.5, 53.5], [31.0, 52.5], [30.8, 51.4], [30.6, 50.5], [31.5, 49.5], [33.5, 48.7], [35.0, 48.0], [36.5, 47.5], [35.8, 46.4], [35.5, 46.0], [33.7, 46.3], [35.0, 45.9], [36.6, 45.4], [36.6, 42.0]],
  // Dnieper bridgeheads, Melitopol taken, Crimea cut off at Perekop
  '1943-10': [[30.3, 59.9], [31.3, 58.5], [30.5, 56.3], [30.5, 55.4], [31.0, 54.6], [30.5, 53.3], [30.9, 52.4], [30.5, 51.3], [30.4, 50.6], [31.0, 49.9], [32.5, 49.0], [33.3, 48.3], [34.8, 47.6], [33.7, 46.3], [35.0, 45.9], [36.6, 45.4], [36.6, 42.0]],
  // Kiev retaken (ww2-atlas line, 6 November), Gomel about to fall
  '1943-11': [[30.3, 59.9], [29.9, 56.0], [30.5, 54.4], [31.4, 52.6], [30.2, 50.5], [31.5, 49.6], [33.5, 48.2], [34.8, 47.6], [33.7, 46.3], [35.0, 45.9], [36.6, 45.4], [36.6, 42.0]],
  // Zhitomir retaken on New Year's Eve; the Korsun pocket about to form
  '1943-12': [[30.3, 59.9], [31.3, 58.5], [30.5, 56.3], [30.2, 55.2], [30.5, 54.4], [30.5, 53.3], [30.0, 52.5], [29.0, 51.8], [28.6, 50.3], [29.5, 49.5], [31.3, 49.4], [33.5, 48.4], [34.4, 47.6], [33.7, 46.3], [35.0, 45.9], [36.6, 45.4], [36.6, 42.0]],
  // Leningrad relieved, Novgorod retaken
  '1944-01': [[29.5, 59.4], [30.0, 58.6], [30.9, 58.5], [29.9, 56.0], [30.2, 55.2], [30.0, 52.9], [29.3, 52.0], [27.6, 50.9], [28.0, 49.4], [30.5, 48.7], [32.5, 48.3], [34.4, 47.6], [33.7, 46.3], [35.0, 45.9], [36.6, 45.4], [36.6, 42.0]],
  // Narva and Pskov reached, Lutsk and Rovno, Kryvyi Rih and Nikopol retaken
  '1944-02': [[28.2, 59.4], [27.8, 58.4], [28.5, 57.8], [29.4, 56.3], [30.2, 55.2], [29.2, 53.1], [27.6, 51.9], [25.3, 50.9], [26.8, 49.9], [28.5, 49.2], [30.0, 48.8], [33.2, 47.9], [34.0, 47.3], [33.7, 46.3], [35.0, 45.9], [36.6, 45.4], [36.6, 42.0]],
  // The spring offensive into Galicia and Bessarabia: Chernivtsi taken, Ternopil and Kovel encircled, Odessa about to fall
  '1944-03': [[28.2, 59.4], [27.6, 57.8], [29.4, 56.3], [30.2, 55.2], [29.2, 53.1], [27.0, 52.0], [25.0, 51.0], [25.3, 50.0], [25.6, 49.6], [26.0, 48.6], [27.6, 47.8], [29.0, 47.0], [30.5, 46.5], [30.7, 46.0], [33.7, 46.3], [35.0, 45.9], [36.6, 45.4], [36.6, 42.0]],
  // Odessa and most of Crimea retaken; the front settles on the Dniester (ww2-atlas line, 15 April, extended south)
  '1944-04': [[28.2, 59.4], [27.6, 57.5], [30.2, 55.2], [29.2, 53.1], [26.5, 51.9], [25.5, 50.7], [26.0, 49.3], [26.8, 47.6], [28.5, 47.0], [30.3, 46.3], [30.3, 45.8]],
  // Bagration under way: Vitebsk, Mogilev and Bobruisk fallen in the last days of June
  '1944-06': [[28.2, 59.4], [27.6, 57.5], [28.5, 56.3], [29.0, 55.0], [28.5, 54.0], [28.2, 53.5], [28.5, 52.9], [26.5, 51.9], [24.7, 51.2], [25.6, 49.6], [27.6, 47.2], [28.5, 47.0], [30.3, 46.3], [30.3, 45.8]],
  // Army Group Centre destroyed: Pskov, Daugavpils and Białystok taken, the Vistula reached, Lwów and Kaunas about to fall
  '1944-07': [[28.2, 59.4], [27.6, 57.5], [26.5, 55.9], [24.5, 55.5], [23.9, 54.9], [23.2, 53.1], [21.1, 52.2], [21.6, 50.7], [24.3, 49.7], [25.0, 47.9], [27.6, 47.2], [28.5, 47.0], [30.3, 46.3], [30.3, 45.8]],
  // Warsaw Uprising under way across the river; Tartu taken, Riga still held; Romania has changed sides
  '1944-08': [[28.2, 59.4], [27.0, 58.4], [26.0, 57.3], [25.0, 57.0], [24.0, 56.7], [23.3, 55.9], [23.3, 54.9], [22.5, 54.7], [21.0, 52.2], [21.4, 50.7], [22.5, 49.3], [24.3, 48.0], [25.0, 47.5], [22.6, 47.3], [22.3, 46.5], [21.5, 46.0], [20.7, 45.8], [20.3, 45.0]],
  // Tallinn taken, Riga encircled; the Red Army on Hungarian soil
  '1944-09': [[24.5, 57.3], [23.5, 56.3], [22.5, 55.5], [22.5, 54.7], [21.0, 52.2], [21.4, 50.7], [21.8, 49.2], [22.0, 48.4], [22.3, 47.8], [21.5, 46.8], [20.5, 46.2], [20.3, 45.0]],
  // Riga taken, Army Group North cut off in Courland; Debrecen and Belgrade retaken (ww2-atlas line, 15 October)
  '1944-10': [[21.0, 57.0], [21.5, 55.8], [22.5, 54.4], [21.0, 52.2], [21.4, 50.7], [21.8, 49.2], [21.3, 47.6], [20.2, 46.2], [19.5, 45.2]],
  // Into East Prussia; the Danube crossed south of Budapest
  '1944-11': [[21.0, 57.0], [20.0, 54.4], [21.0, 52.2], [21.4, 50.7], [21.3, 49.3], [20.5, 48.5], [19.5, 47.6], [19.0, 46.8], [18.7, 46.0], [18.5, 45.5], [19.3, 45.1]],
  // Budapest encircled
  '1944-12': [[21.0, 57.0], [20.0, 54.4], [21.0, 52.2], [21.4, 50.7], [21.3, 49.3], [20.3, 48.6], [18.9, 48.2], [18.8, 47.6], [18.5, 47.2], [18.2, 46.8], [17.6, 45.9]],
  // The Vistula-Oder offensive: Warsaw, Łódź and Kraków taken in a fortnight, the Oder reached at Küstrin
  '1945-01': [[21.0, 57.0], [20.0, 54.4], [18.6, 54.4], [19.4, 54.2], [17.5, 53.2], [16.3, 52.9], [15.0, 52.8], [14.6, 52.5], [15.0, 51.7], [17.3, 51.1], [18.3, 50.4], [19.0, 49.9], [19.3, 49.3], [18.9, 48.8], [18.8, 47.6], [18.5, 47.2], [18.2, 46.8], [17.6, 45.9]],
  // Breslau and Poznań encircled, Budapest fallen (ww2-atlas line, 15 February)
  '1945-02': [[21.0, 57.0], [20.0, 54.4], [14.6, 52.9], [14.6, 52.4], [15.0, 51.3], [17.5, 50.0], [18.5, 48.9], [18.6, 47.5], [17.6, 45.9]],
  // Danzig fallen, Küstrin fallen, the Red Army into Austria
  '1945-03': [[21.0, 57.0], [20.0, 54.4], [18.6, 54.6], [14.3, 54.0], [14.6, 52.9], [14.6, 52.4], [14.8, 51.5], [15.5, 50.9], [17.3, 50.3], [17.9, 49.6], [18.2, 48.8], [17.6, 48.3], [16.9, 48.0], [16.6, 47.5], [16.4, 46.9], [15.8, 46.4]],
  // Berlin surrounded, Vienna and Brno taken, the Elbe reached at Torgau
  '1945-04': [[13.0, 54.2], [12.5, 53.0], [12.0, 52.5], [12.9, 51.6], [13.5, 51.0], [14.0, 50.6], [16.0, 49.9], [16.9, 49.0], [16.4, 48.5], [15.6, 48.2], [15.0, 47.5], [15.2, 46.6]],
}

export const west = {
  // The Normandy beachhead at the end of June (ww2-atlas line, 30 June)
  '1944-06': [[-1.62, 49.64], [-1.30, 49.10], [-0.80, 49.05], [-0.36, 49.18], [-0.20, 49.30]],
  // Cobra: the Cotentin cleared, Avranches taken on the last day of the month
  '1944-07': [[-1.0, 49.4], [-1.4, 48.8], [-0.6, 49.0], [-0.3, 49.1], [0.0, 49.3]],
  // Paris liberated; Dragoon up the Rhône: Grenoble, Marseille and Nice taken
  '1944-08': [[2.4, 51.0], [2.0, 50.2], [3.5, 49.4], [4.0, 49.25], [4.8, 48.3], [5.4, 47.0], [5.7, 45.2], [6.5, 44.5], [7.0, 43.7]],
  // Antwerp and Brussels liberated, Market Garden, the Vosges and the Belfort gap reached
  '1944-09': [[3.9, 51.4], [4.5, 51.5], [5.0, 51.7], [5.9, 51.85], [6.0, 51.2], [6.1, 50.8], [6.3, 50.0], [6.4, 49.4], [6.3, 49.1], [6.4, 48.6], [6.8, 48.0], [6.9, 47.5], [7.0, 47.3]],
  // Aachen taken, the Scheldt cleared, Metz and Strasbourg liberated; the Colmar pocket remains
  '1944-11': [[4.2, 51.6], [5.0, 51.8], [5.9, 51.9], [6.0, 51.4], [6.3, 51.0], [6.4, 50.8], [6.4, 50.3], [6.3, 49.9], [6.5, 49.4], [6.9, 49.2], [7.2, 48.9], [7.7, 48.6], [7.5, 48.3], [7.3, 47.9], [7.5, 47.6], [7.6, 47.55]],
  // The Bulge at its furthest extent
  '1944-12': [[5.9, 51.9], [6.0, 51.4], [6.3, 51.0], [6.4, 50.8], [6.3, 50.5], [5.6, 50.3], [5.4, 50.2], [4.9, 50.1], [5.3, 49.9], [5.9, 49.6], [6.4, 49.4], [7.0, 49.15], [7.8, 49.0], [7.9, 48.7], [7.5, 48.3], [7.3, 47.9], [7.5, 47.6]],
  // The Bulge erased, the Colmar pocket being cleared
  '1945-01': [[5.9, 51.9], [6.0, 51.4], [6.3, 51.0], [6.4, 50.8], [6.4, 50.3], [6.3, 49.9], [6.4, 49.5], [7.0, 49.15], [7.8, 49.0], [7.9, 48.7], [7.6, 48.2], [7.5, 47.9], [7.6, 47.6]],
  // The Reichswald cleared and the Roer crossed; the Rhine reached opposite Düsseldorf
  '1945-02': [[6.1, 51.9], [6.4, 51.7], [6.5, 51.3], [6.6, 51.0], [6.6, 50.6], [6.4, 50.3], [6.5, 49.9], [6.6, 49.6], [7.0, 49.3], [7.8, 49.1], [8.2, 48.9], [7.8, 48.5], [7.6, 48.0], [7.6, 47.6]],
  // The Rhine crossed at Remagen, Oppenheim and Wesel; Frankfurt taken; the Ruhr about to be encircled
  '1945-03': [[7.0, 52.3], [7.6, 52.0], [8.2, 51.7], [8.7, 51.5], [8.8, 50.9], [8.9, 50.3], [9.2, 49.9], [9.0, 49.3], [8.6, 48.8], [8.2, 48.5], [7.8, 48.0], [7.6, 47.6]],
  // The Elbe and Mulde reached, Bremen, Nuremberg, Regensburg and Munich taken
  '1945-04': [[8.7, 53.9], [9.0, 53.5], [9.6, 53.3], [10.0, 53.4], [10.6, 53.0], [11.0, 52.9], [11.6, 52.4], [12.3, 51.9], [12.9, 51.6], [12.6, 51.0], [12.5, 50.8], [12.2, 50.3], [12.0, 49.6], [12.3, 49.0], [12.6, 48.5], [12.0, 48.1], [11.5, 47.6], [10.8, 47.4]],
}

export const italy = {
  // Salerno and Calabria; Foggia taken on 27 September, Naples about to fall
  '1943-09': [[14.2, 40.6], [14.9, 40.9], [15.6, 41.5], [16.0, 41.6]],
  // Naples taken, the Volturno and Termoli reached
  '1943-10': [[13.75, 41.25], [14.3, 41.3], [15.0, 41.7], [15.0, 42.0]],
  // The Gustav Line: Minturno, Cassino, Ortona
  '1944-01': [[13.6, 41.25], [13.85, 41.5], [14.3, 41.9], [14.4, 42.35]],
  // Rome taken on 4 June; the front north of the city by the end of the month
  '1944-06': [[11.1, 42.6], [12.0, 42.7], [12.6, 42.8], [13.6, 43.1]],
  // Livorno and Ancona taken
  '1944-07': [[10.4, 43.5], [11.5, 43.6], [12.5, 43.6], [13.6, 43.6]],
  // The Gothic Line breached at Rimini
  '1944-09': [[10.0, 44.1], [11.2, 44.2], [12.2, 44.0], [12.6, 44.0]],
  // Bologna taken, the Po crossed
  '1945-04': [[8.0, 44.9], [10.5, 45.0], [12.5, 45.2]],
}

// Regions that left German control on a date, not along a front
export const regions = {
  // North Africa: Torch puts Algeria in Allied hands; Cyrenaica, then Tripolitania, fall to the Eighth Army
  '1942-11': [['box', -9, 14, 8.6, 37.5], ['box', 20, 14, 26, 34]],
  '1942-12': [['box', 15, 14, 26, 34]],
  '1943-01': [['box', 39.3, 40, 50, 47.3], ['box', 9, 14, 26, 34]], // the Caucasus and Stavropol, abandoned after Stalingrad; the rest of Libya
  '1943-08': [['box', 12, 36.5, 16, 38.5]], // Sicily
  '1943-10': [['box', 8, 38.8, 10, 43.1], ['box', 36.5, 43.8, 39.5, 46.5]], // Sardinia and Corsica; the Kuban bridgehead
  // the Black Sea coast: Kherson, then Odessa and Bessarabia, then Crimea
  '1944-04': [['box', 29.5, 46.1, 42, 48]],
  '1944-05': [['box', 30, 44, 42, 48]], // Crimea and everything north of the Black Sea
  '1944-09': [['poly', [[20.2, 48.3], [27, 48.4], [30, 46], [29.7, 43.7], [28.6, 41.7], [26.2, 41.3], [22.5, 41.3], [22.3, 42.3], [22.9, 43.8], [20.3, 44.5], [20.2, 46.2]]], ['box', 19, 59.5, 45, 75]], // Romania and Bulgaria; Finland, East Karelia and the Arctic front
  '1944-11': [['box', 19, 34, 29, 41.5]], // Greece and Albania
  // the surrender: nothing remains in German hands after 8 May
  '1945-05': [['box', -32, 14, 68, 84]],
}

// Автосгенерировано scripts/fetch_unistroy_prices.mjs — 2026-07-29
// Источник: unistroy.ru, публичный API /api/flats/, активные лоты в продаже.
const PROJECTS = [
  /* ── Екатеринбург ── */
  { slug: 'skies', city: 'ekb', label: 'Небосклоны', rooms: [
    { label: 'Студия', count: 2, priceMin: 11988000, priceMax: 16113000, priceAvg: 14050500, priceP25: 11988000, areaP25: 75.5, priceP50: 16113000, areaP50: 100, priceP75: 16113000, areaP75: 100, areaMin: 75.5, areaMax: 100 },
  ]},
  { slug: 'parkblock', city: 'ekb', label: 'Парковый квартал 2.0', rooms: [
    { label: 'Студия', count: 18, priceMin: 6675000, priceMax: 7012000, priceAvg: 6819889, priceP25: 6740000, areaP25: 29.3, priceP50: 6843000, areaP50: 29.3, priceP75: 6875000, areaP75: 29.3, areaMin: 29.3, areaMax: 31.8 },
    { label: '1', count: 148, priceMin: 8082000, priceMax: 30220000, priceAvg: 9897392, priceP25: 8365000, areaP25: 39.2, priceP50: 8905000, areaP50: 32.7, priceP75: 9505000, areaP75: 44.3, areaMin: 32.7, areaMax: 143.2 },
    { label: '2', count: 314, priceMin: 7922000, priceMax: 18844000, priceAvg: 11830783, priceP25: 10241000, areaP25: 56.2, priceP50: 11842000, areaP50: 64.2, priceP75: 13036000, areaP75: 67.7, areaMin: 34.8, areaMax: 88.81 },
    { label: '3', count: 74, priceMin: 14810000, priceMax: 26010000, priceAvg: 17355054, priceP25: 15667000, areaP25: 82.6, priceP50: 16708000, areaP50: 88.8, priceP75: 17658000, areaP75: 101.4, areaMin: 63.3, areaMax: 119 },
  ]},
  { slug: 'riverside', city: 'ekb', label: 'Риверсайд', rooms: [
    { label: 'Студия', count: 127, priceMin: 4890000, priceMax: 12181000, priceAvg: 5667724, priceP25: 5299000, areaP25: 26.38, priceP50: 5411000, areaP50: 28.4, priceP75: 5543000, areaP75: 28.58, areaMin: 23.87, areaMax: 79.95 },
    { label: '1', count: 272, priceMin: 6117000, priceMax: 14441000, priceAvg: 7247419, priceP25: 6815000, areaP25: 38.92, priceP50: 7082000, areaP50: 39, priceP75: 7632000, areaP75: 48.81, areaMin: 33.86, areaMax: 81.82 },
    { label: '2', count: 233, priceMin: 7204000, priceMax: 16198000, priceAvg: 9482343, priceP25: 8801000, areaP25: 54.01, priceP50: 9476000, areaP50: 52.61, priceP75: 10109000, areaP75: 57.94, areaMin: 47.09, areaMax: 82.26 },
    { label: '3', count: 102, priceMin: 9827000, priceMax: 17788000, priceAvg: 12321588, priceP25: 11232000, areaP25: 72.06, priceP50: 11646000, areaP50: 84.97, priceP75: 13282000, areaP75: 98.21, areaMin: 70.48, areaMax: 105.53 },
    { label: '4', count: 2, priceMin: 15884000, priceMax: 18062000, priceAvg: 16973000, priceP25: 15884000, areaP25: 107.14, priceP50: 18062000, areaP50: 126.2, priceP75: 18062000, areaP75: 126.2, areaMin: 107.14, areaMax: 126.2 },
  ]},
  { slug: 'stadium', city: 'ekb', label: 'Стадиум', rooms: [
    { label: 'Студия', count: 16, priceMin: 4966000, priceMax: 5967000, priceAvg: 5328688, priceP25: 5010000, areaP25: 28, priceP50: 5038000, areaP50: 28, priceP75: 5659000, areaP75: 27.8, areaMin: 27.8, areaMax: 30.1 },
    { label: '1', count: 100, priceMin: 6400000, priceMax: 10414000, priceAvg: 7354340, priceP25: 6782000, areaP25: 34.6, priceP50: 7032000, areaP50: 45.4, priceP75: 7313000, areaP75: 39.2, areaMin: 34.6, areaMax: 53.7 },
    { label: '2', count: 158, priceMin: 7728000, priceMax: 14780000, priceAvg: 9251399, priceP25: 8327000, areaP25: 53.5, priceP50: 8973000, areaP50: 62.4, priceP75: 9823000, areaP75: 59.6, areaMin: 47.9, areaMax: 85.2 },
    { label: '3', count: 75, priceMin: 10680000, priceMax: 17901000, priceAvg: 11859920, priceP25: 11112000, areaP25: 85.6, priceP50: 11648000, areaP50: 85.7, priceP75: 12427000, areaP75: 99.4, areaMin: 81.9, areaMax: 104.2 },
    { label: '4', count: 6, priceMin: 13736000, priceMax: 14556000, priceAvg: 14365500, priceP25: 14427000, areaP25: 116.3, priceP50: 14491000, areaP50: 116.3, priceP75: 14528000, areaP75: 116.3, areaMin: 113, areaMax: 116.3 },
  ]},
  /* ── Казань ── */
  { slug: 'aqua', city: 'kzn', label: 'Аквамарин', rooms: [
    { label: 'Студия', count: 9, priceMin: 8900000, priceMax: 9890000, priceAvg: 9340000, priceP25: 9080000, areaP25: 32.1, priceP50: 9210000, areaP50: 32, priceP75: 9670000, areaP75: 32, areaMin: 31.9, areaMax: 32.2 },
    { label: '1', count: 10, priceMin: 9330000, priceMax: 12000000, priceAvg: 10109000, priceP25: 9420000, areaP25: 44.9, priceP50: 10070000, areaP50: 44.2, priceP75: 10580000, areaP75: 42.4, areaMin: 34.2, areaMax: 51.1 },
    { label: '2', count: 65, priceMin: 12040000, priceMax: 17200000, priceAvg: 14434462, priceP25: 13550000, areaP25: 63.8, priceP50: 14610000, areaP50: 66.9, priceP75: 15410000, areaP75: 61, areaMin: 46, areaMax: 76.6 },
    { label: '3', count: 23, priceMin: 16340000, priceMax: 18660000, priceAvg: 17184783, priceP25: 16690000, areaP25: 73.5, priceP50: 16890000, areaP50: 76.5, priceP75: 18140000, areaP75: 95.8, areaMin: 73.4, areaMax: 95.9 },
  ]},
  { slug: 'art16', city: 'kzn', label: 'Арт Премиум', rooms: [
    { label: '1', count: 12, priceMin: 17080000, priceMax: 63150000, priceAvg: 22869167, priceP25: 18900000, areaP25: 46.14, priceP50: 19400000, areaP50: 46.18, priceP75: 19700000, areaP75: 46.18, areaMin: 39.71, areaMax: 160.54 },
    { label: '2', count: 37, priceMin: 25210000, priceMax: 38520000, priceAvg: 30378378, priceP25: 26930000, areaP25: 58.7, priceP50: 30410000, areaP50: 60.18, priceP75: 32160000, areaP75: 70.34, areaMin: 58.7, areaMax: 77.52 },
    { label: '3', count: 22, priceMin: 34930000, priceMax: 45330000, priceAvg: 40212727, priceP25: 37050000, areaP25: 89.18, priceP50: 37700000, areaP50: 89.26, priceP75: 44070000, areaP75: 101.99, areaMin: 89.16, areaMax: 102.09 },
    { label: '5', count: 1, priceMin: 63660000, priceMax: 63660000, priceAvg: 63660000, priceP25: 63660000, areaP25: 155.78, priceP50: 63660000, areaP50: 155.78, priceP75: 63660000, areaP75: 155.78, areaMin: 155.78, areaMax: 155.78 },
  ]},
  { slug: 'atmos', city: 'kzn', label: 'Атмосфера', rooms: [
    { label: 'Студия', count: 25, priceMin: 5640000, priceMax: 7260000, priceAvg: 6264000, priceP25: 5820000, areaP25: 25.84, priceP50: 5880000, areaP50: 25.69, priceP75: 7150000, areaP75: 25.69, areaMin: 25.69, areaMax: 25.84 },
    { label: '1', count: 71, priceMin: 6610000, priceMax: 8230000, priceAvg: 7040845, priceP25: 6790000, areaP25: 33.69, priceP50: 6920000, areaP50: 38.43, priceP75: 7150000, areaP75: 38.17, areaMin: 33.69, areaMax: 47.16 },
    { label: '2', count: 95, priceMin: 7740000, priceMax: 10410000, priceAvg: 8633684, priceP25: 8570000, areaP25: 60.79, priceP50: 8640000, areaP50: 60.28, priceP75: 8690000, areaP75: 60.28, areaMin: 45.13, areaMax: 80 },
    { label: '3', count: 43, priceMin: 8680000, priceMax: 11500000, priceAvg: 10168372, priceP25: 9930000, areaP25: 75.6, priceP50: 10340000, areaP50: 81.22, priceP75: 10710000, areaP75: 81.69, areaMin: 59.53, areaMax: 81.69 },
  ]},
  { slug: 'yes_gorki', city: 'kzn', label: 'ЙЕС Горки', rooms: [
    { label: '1', count: 339, priceMin: 8010000, priceMax: 13140000, priceAvg: 9448732, priceP25: 8490000, areaP25: 22.06, priceP50: 9180000, areaP50: 27.98, priceP75: 9450000, areaP75: 28.6, areaMin: 21.63, areaMax: 47.65 },
  ]},
  { slug: 'letokzn', city: 'kzn', label: 'Лето', rooms: [
    { label: 'Студия', count: 16, priceMin: 9850000, priceMax: 11530000, priceAvg: 10252500, priceP25: 9910000, areaP25: 33.73, priceP50: 10150000, areaP50: 32.7, priceP75: 10200000, areaP75: 33.7, areaMin: 32.66, areaMax: 33.8 },
    { label: '1', count: 31, priceMin: 9840000, priceMax: 15000000, priceAvg: 11175774, priceP25: 10550000, areaP25: 36.86, priceP50: 10700000, areaP50: 36.59, priceP75: 11850000, areaP75: 43.42, areaMin: 32.95, areaMax: 52.62 },
    { label: '2', count: 64, priceMin: 10710000, priceMax: 18470000, priceAvg: 15105531, priceP25: 14680000, areaP25: 48.01, priceP50: 15310000, areaP50: 64.5, priceP75: 16370000, areaP75: 63.91, areaMin: 38.28, areaMax: 76.1 },
    { label: '3', count: 20, priceMin: 17840000, priceMax: 26300000, priceAvg: 19312000, priceP25: 18030000, areaP25: 71.84, priceP50: 18900000, areaP50: 87.43, priceP75: 18990000, areaP75: 82.37, areaMin: 71.84, areaMax: 109.28 },
  ]},
  { slug: 'statum', city: 'kzn', label: 'Статум', rooms: [
    { label: '1', count: 172, priceMin: 11110000, priceMax: 34860000, priceAvg: 14964302, priceP25: 12570000, areaP25: 37.79, priceP50: 13330000, areaP50: 41.5, priceP75: 13970000, areaP75: 44.98, areaMin: 31.11, areaMax: 138.9 },
    { label: '2', count: 193, priceMin: 14290000, priceMax: 22760000, priceAvg: 18071088, priceP25: 17470000, areaP25: 63.74, priceP50: 17890000, areaP50: 68.51, priceP75: 18580000, areaP75: 70.13, areaMin: 48.44, areaMax: 90 },
    { label: '3', count: 43, priceMin: 18400000, priceMax: 24800000, priceAvg: 21950465, priceP25: 21000000, areaP25: 89.74, priceP50: 21750000, areaP50: 90.87, priceP75: 23050000, areaP75: 104.01, areaMin: 72.69, areaMax: 106.84 },
    { label: '4', count: 1, priceMin: 33890000, priceMax: 33890000, priceAvg: 33890000, priceP25: 33890000, areaP25: 108.2, priceP50: 33890000, areaP50: 108.2, priceP75: 33890000, areaP75: 108.2, areaMin: 108.2, areaMax: 108.2 },
  ]},
  { slug: 'zalesnaia', city: 'kzn', label: 'Уникод на Залесной', rooms: [
    { label: 'Студия', count: 9, priceMin: 7230000, priceMax: 8200000, priceAvg: 7756667, priceP25: 7510000, areaP25: 36.48, priceP50: 7800000, areaP50: 33.56, priceP75: 8000000, areaP75: 33.56, areaMin: 33.56, areaMax: 36.48 },
    { label: '1', count: 93, priceMin: 7260000, priceMax: 9440000, priceAvg: 8572688, priceP25: 8310000, areaP25: 40.69, priceP50: 8610000, areaP50: 44.05, priceP75: 8840000, areaP75: 43.85, areaMin: 29.51, areaMax: 44.05 },
    { label: '2', count: 106, priceMin: 9000000, priceMax: 12000000, priceAvg: 10806132, priceP25: 10400000, areaP25: 60.83, priceP50: 10840000, areaP50: 64.98, priceP75: 11350000, areaP75: 62.68, areaMin: 44.01, areaMax: 67.44 },
    { label: '3', count: 51, priceMin: 12860000, priceMax: 15490000, priceAvg: 14013529, priceP25: 13670000, areaP25: 83.61, priceP50: 13900000, areaP50: 83.61, priceP75: 14300000, areaP75: 79.73, areaMin: 78.47, areaMax: 91.13 },
  ]},
  { slug: 'tech', city: 'kzn', label: 'Уникод на Технической', rooms: [
    { label: 'Студия', count: 40, priceMin: 8440000, priceMax: 8930000, priceAvg: 8674250, priceP25: 8570000, areaP25: 30.6, priceP50: 8650000, areaP50: 30.6, priceP75: 8780000, areaP75: 28, areaMin: 28, areaMax: 30.6 },
    { label: '1', count: 46, priceMin: 8600000, priceMax: 11090000, priceAvg: 9348696, priceP25: 8840000, areaP25: 33.4, priceP50: 9130000, areaP50: 33.4, priceP75: 9770000, areaP75: 38.2, areaMin: 29.9, areaMax: 44.65 },
    { label: '2', count: 76, priceMin: 11050000, priceMax: 15960000, priceAvg: 12645263, priceP25: 11590000, areaP25: 51.29, priceP50: 12050000, areaP50: 55, priceP75: 13370000, areaP75: 59.7, areaMin: 49, areaMax: 74.76 },
    { label: '3', count: 29, priceMin: 15250000, priceMax: 20420000, priceAvg: 17343448, priceP25: 15680000, areaP25: 75.4, priceP50: 16290000, areaP50: 78.31, priceP75: 19100000, areaP75: 92.8, areaMin: 72.4, areaMax: 98.82 },
  ]},
  { slug: 'unicum_amir', city: 'kzn', label: 'Уникум на Амирхана', rooms: [
    { label: '1', count: 40, priceMin: 11060000, priceMax: 39510000, priceAvg: 14213750, priceP25: 12300000, areaP25: 35.23, priceP50: 13160000, areaP50: 41.13, priceP75: 14960000, areaP75: 45.18, areaMin: 31.18, areaMax: 154.2 },
    { label: '2', count: 81, priceMin: 16010000, priceMax: 19600000, priceAvg: 17488765, priceP25: 16450000, areaP25: 56.72, priceP50: 17150000, areaP50: 60, priceP75: 18460000, areaP75: 65.38, areaMin: 55.05, areaMax: 67.31 },
    { label: '3', count: 34, priceMin: 20000000, priceMax: 27440000, priceAvg: 24565882, priceP25: 22420000, areaP25: 83.41, priceP50: 25120000, areaP50: 83.48, priceP75: 27160000, areaP75: 107.02, areaMin: 73.23, areaMax: 107.02 },
  ]},
  { slug: 'unicum_pob', city: 'kzn', label: 'Уникум на Проспекте Победы', rooms: [
    { label: 'Студия', count: 9, priceMin: 9540000, priceMax: 10470000, priceAvg: 10013333, priceP25: 9690000, areaP25: 27.91, priceP50: 9800000, areaP50: 27.91, priceP75: 10400000, areaP75: 31.47, areaMin: 27.91, areaMax: 31.47 },
    { label: '1', count: 8, priceMin: 11830000, priceMax: 12480000, priceAvg: 12222500, priceP25: 12140000, areaP25: 40.6, priceP50: 12210000, areaP50: 40.6, priceP75: 12430000, areaP75: 39.83, areaMin: 39.83, areaMax: 46.01 },
    { label: '2', count: 20, priceMin: 14570000, priceMax: 18640000, priceAvg: 16425500, priceP25: 15630000, areaP25: 70.23, priceP50: 16030000, areaP50: 70.23, priceP75: 17050000, areaP75: 71.36, areaMin: 57.42, areaMax: 88.71 },
    { label: '3', count: 28, priceMin: 17500000, priceMax: 22860000, priceAvg: 20955714, priceP25: 19590000, areaP25: 81.43, priceP50: 21750000, areaP50: 113.16, priceP75: 22010000, areaP75: 113.16, areaMin: 81.43, areaMax: 113.16 },
  ]},
  { slug: 'tsarciti', city: 'kzn', label: 'Царево Сити', rooms: [
    { label: 'Студия', count: 57, priceMin: 5800000, priceMax: 8080000, priceAvg: 6435614, priceP25: 6010000, areaP25: 24.17, priceP50: 6350000, areaP50: 25.84, priceP75: 6600000, areaP75: 29.7, areaMin: 23.49, areaMax: 34.54 },
    { label: '1', count: 141, priceMin: 6670000, priceMax: 10180000, priceAvg: 7560780, priceP25: 7270000, areaP25: 34.7, priceP50: 7440000, areaP50: 34.72, priceP75: 7740000, areaP75: 36.24, areaMin: 26, areaMax: 42.96 },
    { label: '2', count: 145, priceMin: 7870000, priceMax: 11590000, priceAvg: 9126207, priceP25: 8650000, areaP25: 50.16, priceP50: 9190000, areaP50: 46.07, priceP75: 9380000, areaP75: 59.83, areaMin: 45.44, areaMax: 66.05 },
    { label: '3', count: 52, priceMin: 9000000, priceMax: 13750000, priceAvg: 10441769, priceP25: 9850000, areaP25: 62.41, priceP50: 10350000, areaP50: 68.21, priceP75: 10580000, areaP75: 75.9, areaMin: 60.9, areaMax: 85.22 },
  ]},
  { slug: 'qkulagina', city: 'kzn', label: 'Q на Кулагина', rooms: [
    { label: 'Студия', count: 3, priceMin: 8520000, priceMax: 9900000, priceAvg: 9340000, priceP25: 9600000, areaP25: 33.72, priceP50: 9600000, areaP50: 33.72, priceP75: 9900000, areaP75: 26.96, areaMin: 26.96, areaMax: 33.72 },
    { label: '1', count: 40, priceMin: 9800000, priceMax: 13020000, priceAvg: 11000750, priceP25: 10680000, areaP25: 41.18, priceP50: 11060000, areaP50: 43.48, priceP75: 11190000, areaP75: 36.24, areaMin: 33.96, areaMax: 58.07 },
    { label: '2', count: 166, priceMin: 12310000, priceMax: 16560000, priceAvg: 13964819, priceP25: 13190000, areaP25: 62.02, priceP50: 13470000, areaP50: 68.16, priceP75: 14060000, areaP75: 77.12, areaMin: 56.02, areaMax: 92.9 },
    { label: '3', count: 89, priceMin: 14810000, priceMax: 18720000, priceAvg: 16194831, priceP25: 15370000, areaP25: 87.48, priceP50: 16390000, areaP50: 89.38, priceP75: 16670000, areaP75: 93.99, areaMin: 82.24, areaMax: 99.83 },
    { label: '4', count: 1, priceMin: 24750000, priceMax: 24750000, priceAvg: 24750000, priceP25: 24750000, areaP25: 151.8, priceP50: 24750000, areaP50: 151.8, priceP75: 24750000, areaP75: 151.8, areaMin: 151.8, areaMax: 151.8 },
  ]},
  /* ── mhchkala ── */
  { slug: 'grandbereg', city: 'mhchkala', label: 'Гранд Берег', rooms: [
    { label: 'Студия', count: 57, priceMin: 5608000, priceMax: 7209000, priceAvg: 5945193, priceP25: 5672000, areaP25: 28.11, priceP50: 5788000, areaP50: 28.7, priceP75: 6104000, areaP75: 30.31, areaMin: 28.11, areaMax: 35.24 },
    { label: '1', count: 43, priceMin: 7008000, priceMax: 9785000, priceAvg: 8500698, priceP25: 7687000, areaP25: 37.72, priceP50: 8688000, areaP50: 36.53, priceP75: 8885000, areaP75: 46.48, areaMin: 33.87, areaMax: 46.48 },
    { label: '2', count: 85, priceMin: 9644000, priceMax: 13378000, priceAvg: 11432094, priceP25: 11025000, areaP25: 72.01, priceP50: 11476000, areaP50: 74.55, priceP75: 11934000, areaP75: 79.19, areaMin: 56.02, areaMax: 83.05 },
    { label: '3', count: 27, priceMin: 10872000, priceMax: 15024000, priceAvg: 12376000, priceP25: 12263000, areaP25: 77.93, priceP50: 12351000, areaP50: 77.93, priceP75: 12485000, areaP75: 78.79, areaMin: 64.81, areaMax: 81.44 },
  ]},
  /* ── Пермь ── */
  { slug: 'berth', city: 'per', label: 'Причал', rooms: [
    { label: 'Студия', count: 1, priceMin: 5699000, priceMax: 5699000, priceAvg: 5699000, priceP25: 5699000, areaP25: 26.7, priceP50: 5699000, areaP50: 26.7, priceP75: 5699000, areaP75: 26.7, areaMin: 26.7, areaMax: 26.7 },
    { label: '1', count: 83, priceMin: 5510000, priceMax: 7740000, priceAvg: 7051205, priceP25: 6970000, areaP25: 38.34, priceP50: 7210000, areaP50: 38.34, priceP75: 7560000, areaP75: 39.91, areaMin: 28.86, areaMax: 39.91 },
    { label: '2', count: 42, priceMin: 7510000, priceMax: 9910000, priceAvg: 9377905, priceP25: 8960000, areaP25: 51.94, priceP50: 9440000, areaP50: 55.67, priceP75: 9710000, areaP75: 57.35, areaMin: 50.7, areaMax: 60.1 },
    { label: '3', count: 32, priceMin: 10520000, priceMax: 12270000, priceAvg: 11805313, priceP25: 11510000, areaP25: 70.61, priceP50: 12060000, areaP50: 75.61, priceP75: 12100000, areaP75: 75.61, areaMin: 70.05, areaMax: 77.92 },
  ]},
  { slug: 'unicum_engels', city: 'per', label: 'Уникум на Энгельса', rooms: [
    { label: 'Студия', count: 98, priceMin: 5970000, priceMax: 8700000, priceAvg: 7376939, priceP25: 6940000, areaP25: 29.1, priceP50: 7350000, areaP50: 30.45, priceP75: 7930000, areaP75: 29.09, areaMin: 23.4, areaMax: 33.01 },
    { label: '2', count: 75, priceMin: 8250000, priceMax: 12750000, priceAvg: 9793733, priceP25: 9020000, areaP25: 42.07, priceP50: 9830000, areaP50: 47.74, priceP75: 10470000, areaP75: 43.89, areaMin: 35.8, areaMax: 54.96 },
    { label: '3', count: 76, priceMin: 9360000, priceMax: 16980000, priceAvg: 10969342, priceP25: 10300000, areaP25: 47.5, priceP50: 10770000, areaP50: 55.3, priceP75: 11490000, areaP75: 58.59, areaMin: 47.5, areaMax: 76.62 },
    { label: '4', count: 13, priceMin: 13710000, priceMax: 19560000, priceAvg: 16083846, priceP25: 13780000, areaP25: 63.61, priceP50: 14480000, areaP50: 66.61, priceP75: 18790000, areaP75: 87.82, areaMin: 63.61, areaMax: 90.82 },
  ]},
  /* ── Санкт-Петербург ── */
  { slug: 'lisino', city: 'spb', label: 'Лисино Город-парк', rooms: [
    { label: 'Студия', count: 46, priceMin: 9075000, priceMax: 14656000, priceAvg: 10504676, priceP25: 10130000, areaP25: 29.3, priceP50: 10350000, areaP50: 29.45, priceP75: 10814000, areaP75: 32.3, areaMin: 27.1, areaMax: 40.8 },
    { label: '1', count: 148, priceMin: 11092000, priceMax: 35078000, priceAvg: 14551475, priceP25: 11928000, areaP25: 35.95, priceP50: 13760000, areaP50: 42.1, priceP75: 15197000, areaP75: 46.15, areaMin: 33.3, areaMax: 101.15 },
    { label: '2', count: 178, priceMin: 15270000, priceMax: 26861000, priceAvg: 20386664, priceP25: 18571000, areaP25: 57.77, priceP50: 19910000, areaP50: 62.1, priceP75: 21990000, areaP75: 68.35, areaMin: 46.9, areaMax: 81.05 },
    { label: '3', count: 68, priceMin: 22120000, priceMax: 37055000, priceAvg: 26798664, priceP25: 25677000, areaP25: 84.3, priceP50: 26740000, areaP50: 86.69, priceP75: 28120000, areaP75: 90.85, areaMin: 71.95, areaMax: 115.37 },
  ]},
  /* ── Тольятти ── */
  { slug: 'unicum_lenin', city: 'tlt', label: 'Уникум на Ленинском', rooms: [
    { label: 'Студия', count: 10, priceMin: 7144000, priceMax: 14907000, priceAvg: 10708000, priceP25: 7237000, areaP25: 41.14, priceP50: 10459000, areaP50: 68.62, priceP75: 13872000, areaP75: 91.29, areaMin: 41.14, areaMax: 93.89 },
    { label: '1', count: 13, priceMin: 7086000, priceMax: 21384000, priceAvg: 11806385, priceP25: 7670000, areaP25: 41.8, priceP50: 7800000, areaP50: 41.8, priceP75: 19997000, areaP75: 104.71, areaMin: 41.14, areaMax: 108.37 },
    { label: '2', count: 20, priceMin: 8893000, priceMax: 13140000, priceAvg: 11524150, priceP25: 10749000, areaP25: 61.94, priceP50: 11551000, areaP50: 66.45, priceP75: 12625000, areaP75: 71.43, areaMin: 51.22, areaMax: 73.69 },
    { label: '3', count: 12, priceMin: 10386000, priceMax: 14814000, priceAvg: 12968417, priceP25: 12302000, areaP25: 91.29, priceP50: 13357000, areaP50: 92.48, priceP75: 13757000, areaP75: 91.29, areaMin: 68.62, areaMax: 98.85 },
  ]},
  { slug: 'bulvar', city: 'tlt', label: 'Южный Бульвар', rooms: [
    { label: 'Студия', count: 2, priceMin: 9400000, priceMax: 10990000, priceAvg: 10195000, priceP25: 9400000, areaP25: 86.6, priceP50: 10990000, areaP50: 104.1, priceP75: 10990000, areaP75: 104.1, areaMin: 86.6, areaMax: 104.1 },
    { label: '1', count: 46, priceMin: 5680000, priceMax: 8070000, priceAvg: 6575543, priceP25: 5930000, areaP25: 36.19, priceP50: 6800000, areaP50: 41.6, priceP75: 6980000, areaP75: 42.44, areaMin: 35.22, areaMax: 49.03 },
    { label: '2', count: 47, priceMin: 7270000, priceMax: 10065000, priceAvg: 8512319, priceP25: 8190000, areaP25: 55.5, priceP50: 8400000, areaP50: 56.78, priceP75: 8470000, areaP75: 61.5, areaMin: 51.6, areaMax: 68.92 },
    { label: '3', count: 15, priceMin: 9300000, priceMax: 10810000, priceAvg: 10202333, priceP25: 9560000, areaP25: 68.57, priceP50: 10500000, areaP50: 80.11, priceP75: 10800000, areaP75: 80.11, areaMin: 68.57, areaMax: 80.11 },
    { label: '4', count: 7, priceMin: 10350000, priceMax: 12279000, priceAvg: 11497857, priceP25: 11064000, areaP25: 94.84, priceP50: 11314000, areaP50: 94.84, priceP75: 12238000, areaP75: 97.45, areaMin: 94.84, areaMax: 101.9 },
  ]},
];

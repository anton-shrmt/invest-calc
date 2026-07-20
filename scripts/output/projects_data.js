// Автосгенерировано scripts/fetch_unistroy_prices.mjs — 2026-07-20
// Источник: unistroy.ru, публичный API /api/flats/, активные лоты в продаже.
const PROJECTS = [
  /* ── Екатеринбург ── */
  { slug: 'skies', city: 'ekb', label: 'Небосклоны', rooms: [
    { label: 'Студия', count: 2, priceMin: 11988000, priceMax: 16113000, priceAvg: 14050500, priceP25: 11988000, areaP25: 75.5, priceP50: 16113000, areaP50: 100, priceP75: 16113000, areaP75: 100, areaMin: 75.5, areaMax: 100 },
  ]},
  { slug: 'parkblock', city: 'ekb', label: 'Парковый квартал 2.0', rooms: [
    { label: 'Студия', count: 18, priceMin: 6675000, priceMax: 7012000, priceAvg: 6819889, priceP25: 6740000, areaP25: 29.3, priceP50: 6843000, areaP50: 29.3, priceP75: 6875000, areaP75: 29.3, areaMin: 29.3, areaMax: 31.8 },
    { label: '1', count: 150, priceMin: 8082000, priceMax: 30220000, priceAvg: 9875900, priceP25: 8356000, areaP25: 38.5, priceP50: 8847000, areaP50: 40.7, priceP75: 9505000, areaP75: 44.3, areaMin: 32.7, areaMax: 143.2 },
    { label: '2', count: 323, priceMin: 7891000, priceMax: 18844000, priceAvg: 11817529, priceP25: 10241000, areaP25: 56.2, priceP50: 11812000, areaP50: 64.2, priceP75: 12985000, areaP75: 67.7, areaMin: 34.8, areaMax: 88.81 },
    { label: '3', count: 75, priceMin: 12689000, priceMax: 26010000, priceAvg: 17292840, priceP25: 15667000, areaP25: 82.6, priceP50: 16697000, areaP50: 98.1, priceP75: 17658000, areaP75: 101.4, areaMin: 63.3, areaMax: 119 },
  ]},
  { slug: 'riverside', city: 'ekb', label: 'Риверсайд', rooms: [
    { label: 'Студия', count: 125, priceMin: 4934000, priceMax: 12181000, priceAvg: 5632112, priceP25: 5284000, areaP25: 29.92, priceP50: 5361000, areaP50: 28.37, priceP75: 5533000, areaP75: 28.58, areaMin: 23.87, areaMax: 79.95 },
    { label: '1', count: 278, priceMin: 5670000, priceMax: 14441000, priceAvg: 7130568, priceP25: 6727000, areaP25: 45.64, priceP50: 7012000, areaP50: 38.92, priceP75: 7487000, areaP75: 35.08, areaMin: 33.7, areaMax: 81.82 },
    { label: '2', count: 235, priceMin: 6910000, priceMax: 16198000, priceAvg: 9407655, priceP25: 8756000, areaP25: 48.13, priceP50: 9359000, areaP50: 62.95, priceP75: 10091000, areaP75: 66.5, areaMin: 47.09, areaMax: 82.26 },
    { label: '3', count: 101, priceMin: 9969000, priceMax: 17788000, priceAvg: 12368733, priceP25: 11239000, areaP25: 79.18, priceP50: 11666000, areaP50: 84.97, priceP75: 13312000, areaP75: 100.76, areaMin: 72.06, areaMax: 105.53 },
    { label: '4', count: 3, priceMin: 15532000, priceMax: 18062000, priceAvg: 16492667, priceP25: 15884000, areaP25: 107.14, priceP50: 15884000, areaP50: 107.14, priceP75: 18062000, areaP75: 126.2, areaMin: 107.14, areaMax: 126.2 },
  ]},
  { slug: 'stadium', city: 'ekb', label: 'Стадиум', rooms: [
    { label: 'Студия', count: 17, priceMin: 4966000, priceMax: 5967000, priceAvg: 5311059, priceP25: 5010000, areaP25: 28, priceP50: 5029000, areaP50: 28, priceP75: 5659000, areaP75: 27.8, areaMin: 27.8, areaMax: 30.1 },
    { label: '1', count: 98, priceMin: 6400000, priceMax: 10414000, priceAvg: 7363520, priceP25: 6782000, areaP25: 34.6, priceP50: 7038000, areaP50: 41.1, priceP75: 7415000, areaP75: 39.4, areaMin: 34.6, areaMax: 53.7 },
    { label: '2', count: 159, priceMin: 7728000, priceMax: 14780000, priceAvg: 9259748, priceP25: 8330000, areaP25: 54.3, priceP50: 8971000, areaP50: 61, priceP75: 9843000, areaP75: 59.6, areaMin: 47.9, areaMax: 85.2 },
    { label: '3', count: 76, priceMin: 10680000, priceMax: 17901000, priceAvg: 11848908, priceP25: 11103000, areaP25: 86, priceP50: 11648000, areaP50: 85.7, priceP75: 12403000, areaP75: 94.4, areaMin: 81.9, areaMax: 104.2 },
    { label: '4', count: 7, priceMin: 13736000, priceMax: 14593000, priceAvg: 14398000, priceP25: 14455000, areaP25: 116.3, priceP50: 14491000, areaP50: 116.3, priceP75: 14556000, areaP75: 116.3, areaMin: 113, areaMax: 116.3 },
  ]},
  /* ── Казань ── */
  { slug: 'aqua', city: 'kzn', label: 'Аквамарин', rooms: [
    { label: 'Студия', count: 10, priceMin: 8910000, priceMax: 9780000, priceAvg: 9178000, priceP25: 9070000, areaP25: 32.1, priceP50: 9210000, areaP50: 32, priceP75: 9210000, areaP75: 31.9, areaMin: 29.3, areaMax: 32.1 },
    { label: '1', count: 3, priceMin: 10490000, priceMax: 10670000, priceAvg: 10583333, priceP25: 10590000, areaP25: 37.3, priceP50: 10590000, areaP50: 37.3, priceP75: 10670000, areaP75: 36.5, areaMin: 36.5, areaMax: 37.4 },
    { label: '2', count: 63, priceMin: 12000000, priceMax: 17200000, priceAvg: 14459365, priceP25: 13700000, areaP25: 62.8, priceP50: 14610000, areaP50: 66.9, priceP75: 15410000, areaP75: 61.1, areaMin: 46, areaMax: 76.6 },
    { label: '3', count: 25, priceMin: 16340000, priceMax: 18660000, priceAvg: 17177200, priceP25: 16690000, areaP25: 73.5, priceP50: 16890000, areaP50: 76.5, priceP75: 17440000, areaP75: 83.2, areaMin: 73.4, areaMax: 95.9 },
  ]},
  { slug: 'art16', city: 'kzn', label: 'Арт Премиум', rooms: [
    { label: '1', count: 12, priceMin: 17080000, priceMax: 63150000, priceAvg: 22869167, priceP25: 18900000, areaP25: 46.14, priceP50: 19400000, areaP50: 46.18, priceP75: 19700000, areaP75: 46.18, areaMin: 39.71, areaMax: 160.54 },
    { label: '2', count: 38, priceMin: 25210000, priceMax: 38520000, priceAvg: 30264474, priceP25: 26650000, areaP25: 58.7, priceP50: 30410000, areaP50: 60.18, priceP75: 32160000, areaP75: 70.34, areaMin: 58.7, areaMax: 77.52 },
    { label: '3', count: 22, priceMin: 34930000, priceMax: 45330000, priceAvg: 40212727, priceP25: 37050000, areaP25: 89.18, priceP50: 37700000, areaP50: 89.26, priceP75: 44070000, areaP75: 101.99, areaMin: 89.16, areaMax: 102.09 },
    { label: '5', count: 1, priceMin: 63660000, priceMax: 63660000, priceAvg: 63660000, priceP25: 63660000, areaP25: 155.78, priceP50: 63660000, areaP50: 155.78, priceP75: 63660000, areaP75: 155.78, areaMin: 155.78, areaMax: 155.78 },
  ]},
  { slug: 'atmos', city: 'kzn', label: 'Атмосфера', rooms: [
    { label: 'Студия', count: 25, priceMin: 5640000, priceMax: 7260000, priceAvg: 6264000, priceP25: 5820000, areaP25: 25.84, priceP50: 5880000, areaP50: 25.69, priceP75: 7150000, areaP75: 25.69, areaMin: 25.69, areaMax: 25.84 },
    { label: '1', count: 71, priceMin: 6610000, priceMax: 8230000, priceAvg: 7023662, priceP25: 6800000, areaP25: 34.44, priceP50: 6920000, areaP50: 38.43, priceP75: 7140000, areaP75: 38.17, areaMin: 33.69, areaMax: 47.16 },
    { label: '2', count: 96, priceMin: 7740000, priceMax: 10410000, priceAvg: 8591354, priceP25: 8500000, areaP25: 60.28, priceP50: 8640000, areaP50: 60.79, priceP75: 8690000, areaP75: 60.28, areaMin: 45.13, areaMax: 80 },
    { label: '3', count: 45, priceMin: 8680000, priceMax: 11500000, priceAvg: 10153778, priceP25: 9870000, areaP25: 75.6, priceP50: 10050000, areaP50: 75.39, priceP75: 10650000, areaP75: 81.22, areaMin: 59.53, areaMax: 81.69 },
  ]},
  { slug: 'yes_gorki', city: 'kzn', label: 'ЙЕС Горки', rooms: [
    { label: '1', count: 336, priceMin: 8170000, priceMax: 13140000, priceAvg: 9428155, priceP25: 8460000, areaP25: 22.29, priceP50: 9170000, areaP50: 28.6, priceP75: 9440000, areaP75: 30.69, areaMin: 21.63, areaMax: 47.65 },
  ]},
  { slug: 'letokzn', city: 'kzn', label: 'Лето', rooms: [
    { label: 'Студия', count: 16, priceMin: 9850000, priceMax: 11530000, priceAvg: 10252500, priceP25: 9910000, areaP25: 33.73, priceP50: 10150000, areaP50: 32.66, priceP75: 10200000, areaP75: 33.73, areaMin: 32.66, areaMax: 33.73 },
    { label: '1', count: 30, priceMin: 10150000, priceMax: 15000000, priceAvg: 11220300, priceP25: 10550000, areaP25: 36.86, priceP50: 10710000, areaP50: 36.59, priceP75: 11850000, areaP75: 43.42, areaMin: 32.95, areaMax: 52.62 },
    { label: '2', count: 62, priceMin: 10710000, priceMax: 22220000, priceAvg: 15318129, priceP25: 14780000, areaP25: 60.28, priceP50: 15400000, areaP50: 60.11, priceP75: 16600000, areaP75: 75.64, areaMin: 38.28, areaMax: 78.44 },
    { label: '3', count: 19, priceMin: 17840000, priceMax: 21840000, priceAvg: 18991053, priceP25: 18030000, areaP25: 73.67, priceP50: 18910000, areaP50: 87.43, priceP75: 19080000, areaP75: 87.43, areaMin: 71.84, areaMax: 87.43 },
  ]},
  { slug: 'statum', city: 'kzn', label: 'Статум', rooms: [
    { label: '1', count: 172, priceMin: 11110000, priceMax: 34860000, priceAvg: 14915988, priceP25: 12570000, areaP25: 37.78, priceP50: 13230000, areaP50: 37.88, priceP75: 13940000, areaP75: 48.41, areaMin: 31.11, areaMax: 138.9 },
    { label: '2', count: 197, priceMin: 14290000, priceMax: 23120000, priceAvg: 18055990, priceP25: 17470000, areaP25: 63.08, priceP50: 17930000, areaP50: 63.68, priceP75: 18580000, areaP75: 69.35, areaMin: 48.44, areaMax: 90 },
    { label: '3', count: 42, priceMin: 18400000, priceMax: 24800000, priceAvg: 21936190, priceP25: 21000000, areaP25: 89.74, priceP50: 21750000, areaP50: 90.87, priceP75: 23050000, areaP75: 104.01, areaMin: 72.69, areaMax: 106.84 },
    { label: '4', count: 1, priceMin: 33890000, priceMax: 33890000, priceAvg: 33890000, priceP25: 33890000, areaP25: 108.2, priceP50: 33890000, areaP50: 108.2, priceP75: 33890000, areaP75: 108.2, areaMin: 108.2, areaMax: 108.2 },
  ]},
  { slug: 'zalesnaia', city: 'kzn', label: 'Уникод на Залесной', rooms: [
    { label: 'Студия', count: 4, priceMin: 7230000, priceMax: 7700000, priceAvg: 7412500, priceP25: 7290000, areaP25: 36.48, priceP50: 7430000, areaP50: 36.48, priceP75: 7430000, areaP75: 36.48, areaMin: 36.48, areaMax: 36.48 },
    { label: '1', count: 42, priceMin: 7060000, priceMax: 8840000, priceAvg: 8348571, priceP25: 8120000, areaP25: 38.5, priceP50: 8400000, areaP50: 41.53, priceP75: 8640000, areaP75: 44.05, areaMin: 30.27, areaMax: 44.05 },
    { label: '2', count: 57, priceMin: 8510000, priceMax: 11500000, priceAvg: 10494561, priceP25: 10090000, areaP25: 57.78, priceP50: 10650000, areaP50: 62.79, priceP75: 11000000, areaP75: 62.79, areaMin: 47.64, areaMax: 67.44 },
    { label: '3', count: 30, priceMin: 12860000, priceMax: 15190000, priceAvg: 13761667, priceP25: 13510000, areaP25: 85.03, priceP50: 13690000, areaP50: 78.94, priceP75: 13830000, areaP75: 86.62, areaMin: 78.94, areaMax: 91.13 },
  ]},
  { slug: 'tech', city: 'kzn', label: 'Уникод на Технической', rooms: [
    { label: 'Студия', count: 40, priceMin: 8440000, priceMax: 8930000, priceAvg: 8674250, priceP25: 8570000, areaP25: 30.6, priceP50: 8650000, areaP50: 28, priceP75: 8780000, areaP75: 28, areaMin: 28, areaMax: 30.6 },
    { label: '1', count: 47, priceMin: 8600000, priceMax: 11250000, priceAvg: 9400851, priceP25: 8890000, areaP25: 32.7, priceP50: 9190000, areaP50: 35.66, priceP75: 9940000, areaP75: 38.2, areaMin: 29.9, areaMax: 44.65 },
    { label: '2', count: 76, priceMin: 11050000, priceMax: 15960000, priceAvg: 12645263, priceP25: 11590000, areaP25: 51.29, priceP50: 12050000, areaP50: 55, priceP75: 13370000, areaP75: 59.7, areaMin: 49, areaMax: 74.76 },
    { label: '3', count: 29, priceMin: 15250000, priceMax: 20420000, priceAvg: 17343448, priceP25: 15680000, areaP25: 75.4, priceP50: 16290000, areaP50: 78.31, priceP75: 19100000, areaP75: 92.8, areaMin: 72.4, areaMax: 98.82 },
  ]},
  { slug: 'unicum_amir', city: 'kzn', label: 'Уникум на Амирхана', rooms: [
    { label: '1', count: 40, priceMin: 11800000, priceMax: 39510000, priceAvg: 14224500, priceP25: 12300000, areaP25: 35.23, priceP50: 13160000, areaP50: 41.13, priceP75: 14960000, areaP75: 45.18, areaMin: 34.92, areaMax: 154.2 },
    { label: '2', count: 81, priceMin: 16010000, priceMax: 19600000, priceAvg: 17488765, priceP25: 16450000, areaP25: 56.72, priceP50: 17150000, areaP50: 60, priceP75: 18460000, areaP75: 65.38, areaMin: 55.05, areaMax: 67.31 },
    { label: '3', count: 34, priceMin: 20000000, priceMax: 27440000, priceAvg: 24565882, priceP25: 22420000, areaP25: 83.41, priceP50: 25120000, areaP50: 83.48, priceP75: 27160000, areaP75: 107.02, areaMin: 73.23, areaMax: 107.02 },
  ]},
  { slug: 'unicum_pob', city: 'kzn', label: 'Уникум на Проспекте Победы', rooms: [
    { label: 'Студия', count: 10, priceMin: 9540000, priceMax: 10470000, priceAvg: 10045000, priceP25: 9690000, areaP25: 27.91, priceP50: 10330000, areaP50: 31.47, priceP75: 10400000, areaP75: 31.47, areaMin: 27.91, areaMax: 31.47 },
    { label: '1', count: 8, priceMin: 11830000, priceMax: 12480000, priceAvg: 12210000, priceP25: 12140000, areaP25: 40.6, priceP50: 12210000, areaP50: 40.6, priceP75: 12380000, areaP75: 39.83, areaMin: 39.83, areaMax: 46.01 },
    { label: '2', count: 19, priceMin: 14570000, priceMax: 18640000, priceAvg: 16500526, priceP25: 15680000, areaP25: 70.23, priceP50: 16030000, areaP50: 70.23, priceP75: 17430000, areaP75: 88.71, areaMin: 57.42, areaMax: 88.71 },
    { label: '3', count: 29, priceMin: 17500000, priceMax: 22860000, priceAvg: 20892759, priceP25: 19540000, areaP25: 81.43, priceP50: 21710000, areaP50: 113.16, priceP75: 22010000, areaP75: 113.16, areaMin: 81.43, areaMax: 113.16 },
  ]},
  { slug: 'tsarciti', city: 'kzn', label: 'Царёво Сити', rooms: [
    { label: 'Студия', count: 60, priceMin: 5800000, priceMax: 8080000, priceAvg: 6492000, priceP25: 6030000, areaP25: 24.17, priceP50: 6360000, areaP50: 26.57, priceP75: 6670000, areaP75: 27.22, areaMin: 23.49, areaMax: 34.54 },
    { label: '1', count: 142, priceMin: 6670000, priceMax: 10180000, priceAvg: 7565845, priceP25: 7270000, areaP25: 34.71, priceP50: 7440000, areaP50: 34.72, priceP75: 7740000, areaP75: 34, areaMin: 26, areaMax: 42.96 },
    { label: '2', count: 153, priceMin: 7710000, priceMax: 11590000, priceAvg: 9095556, priceP25: 8630000, areaP25: 50.16, priceP50: 9180000, areaP50: 58.24, priceP75: 9370000, areaP75: 58.31, areaMin: 45.44, areaMax: 66.05 },
    { label: '3', count: 52, priceMin: 9000000, priceMax: 13750000, priceAvg: 10451962, priceP25: 9870000, areaP25: 62.18, priceP50: 10350000, areaP50: 71.34, priceP75: 10580000, areaP75: 75.9, areaMin: 60.9, areaMax: 85.22 },
  ]},
  { slug: 'qkulagina', city: 'kzn', label: 'Q на Кулагина', rooms: [
    { label: 'Студия', count: 3, priceMin: 8520000, priceMax: 9790000, priceAvg: 9303333, priceP25: 9600000, areaP25: 33.72, priceP50: 9600000, areaP50: 33.72, priceP75: 9790000, areaP75: 26.96, areaMin: 26.96, areaMax: 33.72 },
    { label: '1', count: 41, priceMin: 9800000, priceMax: 13020000, priceAvg: 11040244, priceP25: 10680000, areaP25: 41.18, priceP50: 11060000, areaP50: 43.48, priceP75: 11190000, areaP75: 43.48, areaMin: 33.96, areaMax: 58.07 },
    { label: '2', count: 166, priceMin: 12310000, priceMax: 16730000, priceAvg: 13983193, priceP25: 13190000, areaP25: 61.44, priceP50: 13470000, areaP50: 68.68, priceP75: 14120000, areaP75: 56.3, areaMin: 56.02, areaMax: 92.9 },
    { label: '3', count: 89, priceMin: 14810000, priceMax: 18720000, priceAvg: 16238876, priceP25: 15370000, areaP25: 87.48, priceP50: 16390000, areaP50: 92.07, priceP75: 16810000, areaP75: 95.87, areaMin: 82.24, areaMax: 99.83 },
    { label: '4', count: 2, priceMin: 18290000, priceMax: 24750000, priceAvg: 21520000, priceP25: 18290000, areaP25: 106.05, priceP50: 24750000, areaP50: 151.8, priceP75: 24750000, areaP75: 151.8, areaMin: 106.05, areaMax: 151.8 },
  ]},
  /* ── Махачкала ── */
  { slug: 'grandbereg', city: 'mhc', label: 'Гранд Берег', rooms: [
    { label: 'Студия', count: 56, priceMin: 5614000, priceMax: 7614000, priceAvg: 6228643, priceP25: 5752000, areaP25: 28.92, priceP50: 6119000, areaP50: 30.31, priceP75: 6516000, areaP75: 28.11, areaMin: 28.11, areaMax: 35.24 },
    { label: '1', count: 44, priceMin: 7414000, priceMax: 10233000, priceAvg: 8473682, priceP25: 8020000, areaP25: 36.53, priceP50: 8147000, areaP50: 37.72, priceP75: 8875000, areaP75: 41.53, areaMin: 33.87, areaMax: 46.48 },
    { label: '2', count: 85, priceMin: 9721000, priceMax: 13606000, priceAvg: 11847976, priceP25: 11579000, areaP25: 60.45, priceP50: 11831000, areaP50: 74.55, priceP75: 12492000, areaP75: 78.33, areaMin: 56.02, areaMax: 83.05 },
    { label: '3', count: 26, priceMin: 10814000, priceMax: 16130000, priceAvg: 12772231, priceP25: 12450000, areaP25: 77.93, priceP50: 12594000, areaP50: 78.79, priceP75: 12683000, areaP75: 78.79, areaMin: 64.81, areaMax: 81.44 },
  ]},
  /* ── Пермь ── */
  { slug: 'berth', city: 'per', label: 'Причал', rooms: [
    { label: 'Студия', count: 1, priceMin: 5699000, priceMax: 5699000, priceAvg: 5699000, priceP25: 5699000, areaP25: 26.7, priceP50: 5699000, areaP50: 26.7, priceP75: 5699000, areaP75: 26.7, areaMin: 26.7, areaMax: 26.7 },
    { label: '1', count: 84, priceMin: 5510000, priceMax: 7740000, priceAvg: 7039881, priceP25: 6970000, areaP25: 38.34, priceP50: 7210000, areaP50: 38.34, priceP75: 7560000, areaP75: 39.54, areaMin: 28.86, areaMax: 39.91 },
    { label: '2', count: 43, priceMin: 7510000, priceMax: 9909000, priceAvg: 9351442, priceP25: 8960000, areaP25: 51.94, priceP50: 9440000, areaP50: 55.67, priceP75: 9710000, areaP75: 57.35, areaMin: 50.7, areaMax: 60.1 },
    { label: '3', count: 31, priceMin: 10520000, priceMax: 12270000, priceAvg: 11808065, priceP25: 11510000, areaP25: 70.61, priceP50: 12060000, areaP50: 75.61, priceP75: 12100000, areaP75: 75.61, areaMin: 70.05, areaMax: 77.92 },
  ]},
  { slug: 'unicum_engels', city: 'per', label: 'Уникум на Энгельса', rooms: [
    { label: 'Студия', count: 98, priceMin: 5970000, priceMax: 8700000, priceAvg: 7376939, priceP25: 6940000, areaP25: 29.1, priceP50: 7350000, areaP50: 30.45, priceP75: 7930000, areaP75: 29.09, areaMin: 23.4, areaMax: 33.01 },
    { label: '2', count: 50, priceMin: 8250000, priceMax: 12750000, priceAvg: 10134400, priceP25: 9560000, areaP25: 47.62, priceP50: 10150000, areaP50: 36.95, priceP75: 10640000, areaP75: 43.89, areaMin: 35.8, areaMax: 54.96 },
    { label: '3', count: 63, priceMin: 9360000, priceMax: 16980000, priceAvg: 10952540, priceP25: 10130000, areaP25: 54.96, priceP50: 10550000, areaP50: 55.72, priceP75: 11560000, areaP75: 54.98, areaMin: 47.5, areaMax: 76.62 },
    { label: '4', count: 13, priceMin: 13710000, priceMax: 19560000, priceAvg: 16083846, priceP25: 13780000, areaP25: 63.61, priceP50: 14480000, areaP50: 66.61, priceP75: 18790000, areaP75: 87.82, areaMin: 63.61, areaMax: 90.82 },
  ]},
  /* ── Санкт-Петербург ── */
  { slug: 'lisino', city: 'spb', label: 'Лисино Город-парк', rooms: [
    { label: 'Студия', count: 46, priceMin: 9426000, priceMax: 14656000, priceAvg: 10512502, priceP25: 10130000, areaP25: 29.3, priceP50: 10350000, areaP50: 29.45, priceP75: 10814000, areaP75: 32.3, areaMin: 27.1, areaMax: 40.8 },
    { label: '1', count: 150, priceMin: 11092000, priceMax: 35078000, priceAvg: 14710909, priceP25: 11930000, areaP25: 35.85, priceP50: 13830000, areaP50: 42.1, priceP75: 15410000, areaP75: 45.55, areaMin: 33.3, areaMax: 101.15 },
    { label: '2', count: 177, priceMin: 16376000, priceMax: 26861000, priceAvg: 20753893, priceP25: 18610000, areaP25: 58.7, priceP50: 20020000, areaP50: 62.17, priceP75: 23403000, areaP75: 74, areaMin: 50.9, areaMax: 81.05 },
    { label: '3', count: 72, priceMin: 22120000, priceMax: 41008000, priceAvg: 27263788, priceP25: 25840000, areaP25: 85, priceP50: 26816000, areaP50: 88.05, priceP75: 28250000, areaP75: 90.72, areaMin: 71.95, areaMax: 126.72 },
  ]},
  { slug: 'upoint', city: 'spb', label: 'UPOINT', rooms: [
    { label: '2', count: 2, priceMin: 35140000, priceMax: 35160000, priceAvg: 35150000, priceP25: 35140000, areaP25: 144.8, priceP50: 35160000, areaP50: 138.4, priceP75: 35160000, areaP75: 138.4, areaMin: 138.4, areaMax: 144.8 },
  ]},
  /* ── Тольятти ── */
  { slug: 'unicum_lenin', city: 'tlt', label: 'Уникум на Ленинском', rooms: [
    { label: 'Студия', count: 12, priceMin: 8665000, priceMax: 14350000, priceAvg: 11600417, priceP25: 10968000, areaP25: 72.18, priceP50: 12000000, areaP50: 69.1, priceP75: 12150000, areaP75: 69.07, areaMin: 44.44, areaMax: 94.15 },
    { label: '1', count: 11, priceMin: 7200000, priceMax: 10255000, priceAvg: 8035727, priceP25: 7700000, areaP25: 41.8, priceP50: 7800000, areaP50: 41.8, priceP75: 8487000, areaP75: 44.44, areaMin: 41.8, areaMax: 56.82 },
    { label: '2', count: 19, priceMin: 8986000, priceMax: 13322000, priceAvg: 11283632, priceP25: 10919000, areaP25: 63.09, priceP50: 11000000, areaP50: 63.09, priceP75: 12159000, areaP75: 71.06, areaMin: 52.04, areaMax: 74.82 },
    { label: '3', count: 13, priceMin: 12490000, priceMax: 15045000, priceAvg: 13682769, priceP25: 13000000, areaP25: 92.83, priceP50: 13944000, areaP50: 92.83, priceP75: 14100000, areaP75: 92.83, areaMin: 92.83, areaMax: 100.39 },
  ]},
  { slug: 'bulvar', city: 'tlt', label: 'Южный Бульвар', rooms: [
    { label: 'Студия', count: 3, priceMin: 9400000, priceMax: 10990000, priceAvg: 9930000, priceP25: 9400000, areaP25: 86.3, priceP50: 9400000, areaP50: 86.3, priceP75: 10990000, areaP75: 104.1, areaMin: 86.3, areaMax: 104.1 },
    { label: '1', count: 50, priceMin: 5680000, priceMax: 8070000, priceAvg: 6604820, priceP25: 5920000, areaP25: 36.19, priceP50: 6800000, areaP50: 41.6, priceP75: 6990000, areaP75: 42.44, areaMin: 35.22, areaMax: 49.03 },
    { label: '2', count: 48, priceMin: 7270000, priceMax: 10086000, priceAvg: 8539833, priceP25: 8190000, areaP25: 55.5, priceP50: 8420000, areaP50: 56.78, priceP75: 8470000, areaP75: 61.5, areaMin: 51.6, areaMax: 68.92 },
    { label: '3', count: 17, priceMin: 9519000, priceMax: 10999000, priceAvg: 10282059, priceP25: 9604000, areaP25: 68.57, priceP50: 10526000, areaP50: 77.79, priceP75: 10885000, areaP75: 80.11, areaMin: 68.57, areaMax: 80.11 },
    { label: '4', count: 7, priceMin: 10350000, priceMax: 12279000, priceAvg: 11497857, priceP25: 11064000, areaP25: 94.84, priceP50: 11314000, areaP50: 94.84, priceP75: 12238000, areaP75: 97.45, areaMin: 94.84, areaMax: 101.9 },
  ]},
];

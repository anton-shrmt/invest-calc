// Автосгенерировано scripts/fetch_unistroy_prices.mjs — 2026-08-25
// Источник: unistroy.ru, публичный API /api/flats/, активные лоты в продаже.
const PROJECTS = [
  /* ── Екатеринбург ── */
  { slug: 'skies', city: 'ekb', label: 'Небосклоны', rooms: [
    { label: 'Студия', count: 3, priceMin: 4600000, priceMax: 16113000, priceAvg: 10900333, priceP25: 11988000, areaP25: 75.5, priceP50: 11988000, areaP50: 75.5, priceP75: 16113000, areaP75: 100, areaMin: 28.6, areaMax: 100 },
    { label: '1', count: 2, priceMin: 5900000, priceMax: 6000000, priceAvg: 5950000, priceP25: 5900000, areaP25: 36.7, priceP50: 6000000, areaP50: 35.3, priceP75: 6000000, areaP75: 35.3, areaMin: 35.3, areaMax: 36.7 },
    { label: '2', count: 2, priceMin: 7700000, priceMax: 9800000, priceAvg: 8750000, priceP25: 7700000, areaP25: 55.1, priceP50: 9800000, areaP50: 54.8, priceP75: 9800000, areaP75: 54.8, areaMin: 54.8, areaMax: 55.1 },
  ]},
  { slug: 'parkblock', city: 'ekb', label: 'Парковый квартал 2.0', rooms: [
    { label: 'Студия', count: 18, priceMin: 6675000, priceMax: 7047000, priceAvg: 6852111, priceP25: 6774000, areaP25: 29.3, priceP50: 6877000, areaP50: 29.3, priceP75: 6909000, areaP75: 29.3, areaMin: 29.3, areaMax: 31.8 },
    { label: '1', count: 145, priceMin: 7469000, priceMax: 30371000, priceAvg: 9747062, priceP25: 8377000, areaP25: 38.4, priceP50: 8716000, areaP50: 39.2, priceP75: 9385000, areaP75: 35.1, areaMin: 32.7, areaMax: 143.2 },
    { label: '2', count: 296, priceMin: 7791000, priceMax: 18844000, priceAvg: 11612449, priceP25: 10220000, areaP25: 56.5, priceP50: 11696000, areaP50: 64.2, priceP75: 12660000, areaP75: 67.7, areaMin: 34.8, areaMax: 88.81 },
    { label: '3', count: 72, priceMin: 12504000, priceMax: 25535000, priceAvg: 17251458, priceP25: 15746000, areaP25: 82.6, priceP50: 16781000, areaP50: 98.1, priceP75: 17734000, areaP75: 88.8, areaMin: 63.3, areaMax: 119 },
  ]},
  { slug: 'riverside', city: 'ekb', label: 'Риверсайд', rooms: [
    { label: 'Студия', count: 121, priceMin: 4934000, priceMax: 12181000, priceAvg: 5689744, priceP25: 5299000, areaP25: 26.38, priceP50: 5411000, areaP50: 28.4, priceP75: 5584000, areaP75: 28.58, areaMin: 23.87, areaMax: 79.95 },
    { label: '1', count: 261, priceMin: 5952000, priceMax: 14441000, priceAvg: 7254326, priceP25: 6816000, areaP25: 34.4, priceP50: 7107000, areaP50: 38.92, priceP75: 7638000, areaP75: 36.67, areaMin: 33.86, areaMax: 81.82 },
    { label: '2', count: 223, priceMin: 6965000, priceMax: 16198000, priceAvg: 9596812, priceP25: 8905000, areaP25: 59.16, priceP50: 9542000, areaP50: 63.44, priceP75: 10265000, areaP75: 54.55, areaMin: 47.09, areaMax: 82.26 },
    { label: '3', count: 103, priceMin: 9827000, priceMax: 17788000, priceAvg: 12324408, priceP25: 11239000, areaP25: 79.18, priceP50: 11646000, areaP50: 84.97, priceP75: 13312000, areaP75: 98.21, areaMin: 70.48, areaMax: 105.53 },
    { label: '4', count: 3, priceMin: 15532000, priceMax: 18062000, priceAvg: 16492667, priceP25: 15884000, areaP25: 107.14, priceP50: 15884000, areaP50: 107.14, priceP75: 18062000, areaP75: 126.2, areaMin: 107.14, areaMax: 126.2 },
  ]},
  { slug: 'stadium', city: 'ekb', label: 'Стадиум', rooms: [
    { label: 'Студия', count: 14, priceMin: 5001000, priceMax: 5967000, priceAvg: 5375357, priceP25: 5010000, areaP25: 28, priceP50: 5038000, areaP50: 28, priceP75: 5947000, areaP75: 30.1, areaMin: 27.8, areaMax: 30.1 },
    { label: '1', count: 93, priceMin: 6461000, priceMax: 10414000, priceAvg: 7381204, priceP25: 6816000, areaP25: 43, priceP50: 7038000, areaP50: 41.1, priceP75: 7415000, areaP75: 39.4, areaMin: 34.6, areaMax: 53.7 },
    { label: '2', count: 152, priceMin: 7833000, priceMax: 14780000, priceAvg: 9308789, priceP25: 8360000, areaP25: 57.8, priceP50: 8976000, areaP50: 63.1, priceP75: 9853000, areaP75: 61, areaMin: 47.9, areaMax: 85.2 },
    { label: '3', count: 73, priceMin: 10934000, priceMax: 17901000, priceAvg: 11888603, priceP25: 11131000, areaP25: 86, priceP50: 11676000, areaP50: 85.7, priceP75: 12427000, areaP75: 99.4, areaMin: 81.9, areaMax: 104.2 },
    { label: '4', count: 6, priceMin: 13736000, priceMax: 14556000, priceAvg: 14365500, priceP25: 14427000, areaP25: 116.3, priceP50: 14491000, areaP50: 116.3, priceP75: 14528000, areaP75: 116.3, areaMin: 113, areaMax: 116.3 },
  ]},
  /* ── goj ── */
  { slug: 'Avtorika', city: 'goj', label: 'Авторика', rooms: [
    { label: '1', count: 10, priceMin: 6436000, priceMax: 7966000, priceAvg: 7033900, priceP25: 6599000, areaP25: 31.38, priceP50: 6967000, areaP50: 34.73, priceP75: 7313000, areaP75: 38.17, areaMin: 31.38, areaMax: 38.26 },
    { label: '2', count: 23, priceMin: 6740000, priceMax: 8690000, priceAvg: 7534130, priceP25: 6956000, areaP25: 35.18, priceP50: 7099000, areaP50: 35.22, priceP75: 8364000, areaP75: 46.71, areaMin: 33.62, areaMax: 46.72 },
    { label: '3', count: 1, priceMin: 13270000, priceMax: 13270000, priceAvg: 13270000, priceP25: 13270000, areaP25: 66.38, priceP50: 13270000, areaP50: 66.38, priceP75: 13270000, areaP75: 66.38, areaMin: 66.38, areaMax: 66.38 },
  ]},
  /* ── Казань ── */
  { slug: 'aqua', city: 'kzn', label: 'Аквамарин', rooms: [
    { label: 'Студия', count: 9, priceMin: 8900000, priceMax: 9890000, priceAvg: 9321111, priceP25: 9010000, areaP25: 31.9, priceP50: 9300000, areaP50: 32, priceP75: 9670000, areaP75: 32, areaMin: 31.9, areaMax: 32.2 },
    { label: '1', count: 11, priceMin: 9330000, priceMax: 12000000, priceAvg: 10164545, priceP25: 9560000, areaP25: 39.3, priceP50: 10070000, areaP50: 44.2, priceP75: 10720000, areaP75: 39.2, areaMin: 34.2, areaMax: 51.1 },
    { label: '2', count: 65, priceMin: 11900000, priceMax: 17200000, priceAvg: 14338308, priceP25: 13500000, areaP25: 64.3, priceP50: 14270000, areaP50: 62.4, priceP75: 15370000, areaP75: 61.1, areaMin: 46, areaMax: 76.6 },
    { label: '3', count: 21, priceMin: 15540000, priceMax: 18330000, priceAvg: 17074762, priceP25: 16690000, areaP25: 73.5, priceP50: 16890000, areaP50: 76.5, priceP75: 17470000, areaP75: 83, areaMin: 73.4, areaMax: 95.9 },
  ]},
  { slug: 'art', city: 'kzn', label: 'Арт Премиум', rooms: [
    { label: '1', count: 14, priceMin: 17080000, priceMax: 96760000, priceAvg: 27877143, priceP25: 18900000, areaP25: 46.14, priceP50: 19400000, areaP50: 46.18, priceP75: 20810000, areaP75: 39.71, areaMin: 39.71, areaMax: 208.16 },
    { label: '2', count: 39, priceMin: 25210000, priceMax: 38520000, priceAvg: 30084103, priceP25: 26930000, areaP25: 58.7, priceP50: 30120000, areaP50: 77.49, priceP75: 32150000, areaP75: 77.52, areaMin: 58.7, areaMax: 77.52 },
    { label: '3', count: 19, priceMin: 36480000, priceMax: 45330000, priceAvg: 40121579, priceP25: 37130000, areaP25: 89.18, priceP50: 37600000, areaP50: 89.26, priceP75: 44400000, areaP75: 101.99, areaMin: 89.18, areaMax: 102.09 },
  ]},
  { slug: 'atmos', city: 'kzn', label: 'Атмосфера', rooms: [
    { label: 'Студия', count: 25, priceMin: 5640000, priceMax: 7190000, priceAvg: 5928400, priceP25: 5820000, areaP25: 25.9, priceP50: 5880000, areaP50: 25.6, priceP75: 5960000, areaP75: 25.3, areaMin: 25.3, areaMax: 26 },
    { label: '1', count: 65, priceMin: 6700000, priceMax: 8070000, priceAvg: 7032154, priceP25: 6800000, areaP25: 34.4, priceP50: 6930000, areaP50: 34.5, priceP75: 7190000, areaP75: 39.2, areaMin: 33.7, areaMax: 47.3 },
    { label: '2', count: 88, priceMin: 7740000, priceMax: 10410000, priceAvg: 8558977, priceP25: 8500000, areaP25: 60.4, priceP50: 8640000, areaP50: 60.3, priceP75: 8670000, areaP75: 54.4, areaMin: 45, areaMax: 79.7 },
    { label: '3', count: 42, priceMin: 9000000, priceMax: 11500000, priceAvg: 10246190, priceP25: 9930000, areaP25: 75.6, priceP50: 10400000, areaP50: 82.1, priceP75: 10710000, areaP75: 81.7, areaMin: 59.5, areaMax: 82.1 },
  ]},
  { slug: 'yes_gorki', city: 'kzn', label: 'ЙЕС Горки', rooms: [
    { label: '1', count: 323, priceMin: 8170000, priceMax: 14390000, priceAvg: 9397833, priceP25: 8540000, areaP25: 22.06, priceP50: 9190000, areaP50: 28.35, priceP75: 9410000, areaP75: 30.69, areaMin: 21.63, areaMax: 47.65 },
  ]},
  { slug: 'letokzn', city: 'kzn', label: 'Лето', rooms: [
    { label: 'Студия', count: 14, priceMin: 9870000, priceMax: 11530000, priceAvg: 10299286, priceP25: 9910000, areaP25: 33.9, priceP50: 10160000, areaP50: 34, priceP75: 10200000, areaP75: 33.8, areaMin: 32.5, areaMax: 34 },
    { label: '1', count: 27, priceMin: 9840000, priceMax: 15000000, priceAvg: 11345519, priceP25: 10610000, areaP25: 36.8, priceP50: 10760000, areaP50: 37.5, priceP75: 11870000, areaP75: 43.4, areaMin: 33.9, areaMax: 51.7 },
    { label: '2', count: 51, priceMin: 10710000, priceMax: 18470000, priceAvg: 15480000, priceP25: 15100000, areaP25: 61.2, priceP50: 15470000, areaP50: 60.5, priceP75: 16860000, areaP75: 75.8, areaMin: 38.3, areaMax: 76.1 },
    { label: '3', count: 14, priceMin: 17840000, priceMax: 26300000, priceAvg: 19773571, priceP25: 18790000, areaP25: 86.2, priceP50: 18990000, areaP50: 86.2, priceP75: 20530000, areaP75: 71, areaMin: 71, areaMax: 107.9 },
  ]},
  { slug: 'statum', city: 'kzn', label: 'Статум', rooms: [
    { label: '1', count: 151, priceMin: 11960000, priceMax: 34860000, priceAvg: 15058411, priceP25: 12630000, areaP25: 37.86, priceP50: 13330000, areaP50: 31.11, priceP75: 14040000, areaP75: 44.68, areaMin: 31.11, areaMax: 138.9 },
    { label: '2', count: 189, priceMin: 15420000, priceMax: 23120000, priceAvg: 18074444, priceP25: 17470000, areaP25: 63.08, priceP50: 17890000, areaP50: 68.51, priceP75: 18580000, areaP75: 70.13, areaMin: 49.07, areaMax: 89.5 },
    { label: '3', count: 43, priceMin: 18400000, priceMax: 24800000, priceAvg: 21950465, priceP25: 21000000, areaP25: 89.74, priceP50: 21750000, areaP50: 90.87, priceP75: 23050000, areaP75: 104.01, areaMin: 72.69, areaMax: 106.84 },
    { label: '4', count: 1, priceMin: 33890000, priceMax: 33890000, priceAvg: 33890000, priceP25: 33890000, areaP25: 108.2, priceP50: 33890000, areaP50: 108.2, priceP75: 33890000, areaP75: 108.2, areaMin: 108.2, areaMax: 108.2 },
  ]},
  { slug: 'ukod_zales', city: 'kzn', label: 'Уникод на Залесной', rooms: [
    { label: 'Студия', count: 8, priceMin: 7230000, priceMax: 8200000, priceAvg: 7817500, priceP25: 7700000, areaP25: 36.48, priceP50: 7900000, areaP50: 33.56, priceP75: 8000000, areaP75: 33.56, areaMin: 33.56, areaMax: 36.48 },
    { label: '1', count: 83, priceMin: 7650000, priceMax: 9440000, priceAvg: 8634096, priceP25: 8400000, areaP25: 38.77, priceP50: 8650000, areaP50: 36.42, priceP75: 8900000, areaP75: 36.92, areaMin: 29.51, areaMax: 44.05 },
    { label: '2', count: 99, priceMin: 9210000, priceMax: 12000000, priceAvg: 10837071, priceP25: 10430000, areaP25: 52.09, priceP50: 10900000, areaP50: 51.39, priceP75: 11400000, areaP75: 52.62, areaMin: 44.01, areaMax: 67.44 },
    { label: '3', count: 51, priceMin: 12860000, priceMax: 15490000, priceAvg: 14013529, priceP25: 13670000, areaP25: 83.61, priceP50: 13900000, areaP50: 83.61, priceP75: 14300000, areaP75: 79.73, areaMin: 78.47, areaMax: 91.13 },
  ]},
  { slug: 'tech', city: 'kzn', label: 'Уникод на Технической', rooms: [
    { label: 'Студия', count: 54, priceMin: 8440000, priceMax: 9020000, priceAvg: 8721852, priceP25: 8580000, areaP25: 28, priceP50: 8700000, areaP50: 28, priceP75: 8870000, areaP75: 30.6, areaMin: 28, areaMax: 30.6 },
    { label: '1', count: 67, priceMin: 8650000, priceMax: 11090000, priceAvg: 9258209, priceP25: 8950000, areaP25: 33.4, priceP50: 9140000, areaP50: 35.3, priceP75: 9420000, areaP75: 36.4, areaMin: 29.9, areaMax: 44.65 },
    { label: '2', count: 99, priceMin: 11050000, priceMax: 15920000, priceAvg: 12559697, priceP25: 11420000, areaP25: 53.59, priceP50: 11840000, areaP50: 51.29, priceP75: 13490000, areaP75: 59.7, areaMin: 49, areaMax: 74.76 },
    { label: '3', count: 29, priceMin: 15250000, priceMax: 20420000, priceAvg: 17343448, priceP25: 15680000, areaP25: 75.4, priceP50: 16290000, areaP50: 78.31, priceP75: 19100000, areaP75: 92.8, areaMin: 72.4, areaMax: 98.82 },
  ]},
  { slug: 'unicum_amir', city: 'kzn', label: 'Уникум на Амирхана', rooms: [
    { label: '1', count: 42, priceMin: 11810000, priceMax: 39510000, priceAvg: 14147619, priceP25: 12300000, areaP25: 35.98, priceP50: 13130000, areaP50: 35.98, priceP75: 14960000, areaP75: 45.18, areaMin: 32.57, areaMax: 154.2 },
    { label: '2', count: 80, priceMin: 16010000, priceMax: 19600000, priceAvg: 17491375, priceP25: 16440000, areaP25: 55.96, priceP50: 17150000, areaP50: 60, priceP75: 18460000, areaP75: 65.38, areaMin: 55.05, areaMax: 67.31 },
    { label: '3', count: 33, priceMin: 20100000, priceMax: 27440000, priceAvg: 24659091, priceP25: 22620000, areaP25: 83.48, priceP50: 25120000, areaP50: 83.48, priceP75: 27160000, areaP75: 107.02, areaMin: 73.23, areaMax: 107.02 },
  ]},
  { slug: 'unicum_pob', city: 'kzn', label: 'Уникум на Проспекте Победы', rooms: [
    { label: 'Студия', count: 8, priceMin: 9550000, priceMax: 10490000, priceAvg: 9981250, priceP25: 9700000, areaP25: 27.91, priceP50: 9810000, areaP50: 27.91, priceP75: 10410000, areaP75: 31.47, areaMin: 27.91, areaMax: 31.47 },
    { label: '1', count: 6, priceMin: 11830000, priceMax: 12440000, priceAvg: 12143333, priceP25: 12030000, areaP25: 44.07, priceP50: 12190000, areaP50: 40.6, priceP75: 12220000, areaP75: 40.6, areaMin: 39.83, areaMax: 44.07 },
    { label: '2', count: 15, priceMin: 15100000, priceMax: 18640000, priceAvg: 16726667, priceP25: 16030000, areaP25: 70.23, priceP50: 16330000, areaP50: 70.23, priceP75: 17430000, areaP75: 88.71, areaMin: 60.68, areaMax: 88.71 },
    { label: '3', count: 26, priceMin: 17510000, priceMax: 22870000, priceAvg: 20925769, priceP25: 19550000, areaP25: 81.43, priceP50: 21760000, areaP50: 113.16, priceP75: 22020000, areaP75: 113.16, areaMin: 81.43, areaMax: 113.16 },
  ]},
  { slug: 'tsarciti', city: 'kzn', label: 'Царево Сити', rooms: [
    { label: 'Студия', count: 56, priceMin: 5800000, priceMax: 8080000, priceAvg: 6445536, priceP25: 6030000, areaP25: 24.17, priceP50: 6360000, areaP50: 26.45, priceP75: 6600000, areaP75: 29.7, areaMin: 23.49, areaMax: 34.54 },
    { label: '1', count: 137, priceMin: 6700000, priceMax: 10180000, priceAvg: 7547007, priceP25: 7270000, areaP25: 34.7, priceP50: 7430000, areaP50: 34.7, priceP75: 7740000, areaP75: 34, areaMin: 26, areaMax: 42.96 },
    { label: '2', count: 140, priceMin: 7870000, priceMax: 11590000, priceAvg: 9122857, priceP25: 8650000, areaP25: 50.16, priceP50: 9180000, areaP50: 58.24, priceP75: 9370000, areaP75: 58.31, areaMin: 46.07, areaMax: 66.05 },
    { label: '3', count: 48, priceMin: 9000000, priceMax: 13010000, priceAvg: 10289417, priceP25: 9840000, areaP25: 61.93, priceP50: 10310000, areaP50: 71.38, priceP75: 10550000, areaP75: 71.94, areaMin: 60.9, areaMax: 76.3 },
  ]},
  { slug: 'qkulagina', city: 'kzn', label: 'Q на Кулагина', rooms: [
    { label: 'Студия', count: 4, priceMin: 8160000, priceMax: 9950000, priceAvg: 9082500, priceP25: 8520000, areaP25: 29.14, priceP50: 9700000, areaP50: 33.72, priceP75: 9700000, areaP75: 33.72, areaMin: 26.95, areaMax: 33.72 },
    { label: '1', count: 34, priceMin: 9800000, priceMax: 13020000, priceAvg: 11064118, priceP25: 10490000, areaP25: 43.48, priceP50: 11100000, areaP50: 43.48, priceP75: 11190000, areaP75: 43.48, areaMin: 33.96, areaMax: 58.07 },
    { label: '2', count: 159, priceMin: 12310000, priceMax: 16560000, priceAvg: 13986730, priceP25: 13190000, areaP25: 66.21, priceP50: 13470000, areaP50: 72.93, priceP75: 14120000, areaP75: 56.3, areaMin: 56.02, areaMax: 92.9 },
    { label: '3', count: 85, priceMin: 14810000, priceMax: 18640000, priceAvg: 16173059, priceP25: 15370000, areaP25: 87.48, priceP50: 16390000, areaP50: 89.38, priceP75: 16670000, areaP75: 93.99, areaMin: 82.24, areaMax: 99.83 },
    { label: '4', count: 2, priceMin: 18290000, priceMax: 24750000, priceAvg: 21520000, priceP25: 18290000, areaP25: 106.05, priceP50: 24750000, areaP50: 151.8, priceP75: 24750000, areaP75: 151.8, areaMin: 106.05, areaMax: 151.8 },
  ]},
  /* ── mhchkala ── */
  { slug: 'grandbereg', city: 'mhchkala', label: 'Гранд Берег', rooms: [
    { label: 'Студия', count: 53, priceMin: 5608000, priceMax: 7209000, priceAvg: 5889566, priceP25: 5672000, areaP25: 28.11, priceP50: 5778000, areaP50: 28.7, priceP75: 6050000, areaP75: 30.31, areaMin: 28.11, areaMax: 35.24 },
    { label: '1', count: 40, priceMin: 7414000, priceMax: 9785000, priceAvg: 8579950, priceP25: 8178000, areaP25: 35.52, priceP50: 8788000, areaP50: 34.66, priceP75: 8885000, areaP75: 46.48, areaMin: 33.87, areaMax: 46.48 },
    { label: '2', count: 83, priceMin: 9644000, priceMax: 13378000, priceAvg: 11449976, priceP25: 11202000, areaP25: 72.01, priceP50: 11476000, areaP50: 74.55, priceP75: 11992000, areaP75: 60.87, areaMin: 56.02, areaMax: 83.05 },
    { label: '3', count: 28, priceMin: 10872000, priceMax: 15024000, priceAvg: 12383786, priceP25: 12263000, areaP25: 77.93, priceP50: 12397000, areaP50: 78.79, priceP75: 12485000, areaP75: 78.79, areaMin: 64.81, areaMax: 81.44 },
  ]},
  /* ── Пермь ── */
  { slug: 'berth', city: 'per', label: 'Причал', rooms: [
    { label: 'Студия', count: 1, priceMin: 5699000, priceMax: 5699000, priceAvg: 5699000, priceP25: 5699000, areaP25: 26.7, priceP50: 5699000, areaP50: 26.7, priceP75: 5699000, areaP75: 26.7, areaMin: 26.7, areaMax: 26.7 },
    { label: '1', count: 80, priceMin: 5510000, priceMax: 7740000, priceAvg: 7080750, priceP25: 7030000, areaP25: 38.3, priceP50: 7290000, areaP50: 39.54, priceP75: 7560000, areaP75: 39.54, areaMin: 28.86, areaMax: 39.91 },
    { label: '2', count: 35, priceMin: 8655000, priceMax: 15900000, priceAvg: 9622057, priceP25: 9190000, areaP25: 56.11, priceP50: 9440000, areaP50: 55.67, priceP75: 9730000, areaP75: 57.35, areaMin: 51.8, areaMax: 60.1 },
    { label: '3', count: 27, priceMin: 10520000, priceMax: 12270000, priceAvg: 11789630, priceP25: 11510000, areaP25: 70.61, priceP50: 12040000, areaP50: 75.35, priceP75: 12100000, areaP75: 75.61, areaMin: 70.05, areaMax: 77.92 },
  ]},
  { slug: 'unicum_engels', city: 'per', label: 'Уникум на Энгельса', rooms: [
    { label: 'Студия', count: 95, priceMin: 6110000, priceMax: 8700000, priceAvg: 7411684, priceP25: 6980000, areaP25: 30.45, priceP50: 7360000, areaP50: 33.01, priceP75: 7930000, areaP75: 30.45, areaMin: 23.4, areaMax: 33.01 },
    { label: '2', count: 72, priceMin: 8250000, priceMax: 12750000, priceAvg: 9791528, priceP25: 8980000, areaP25: 42.01, priceP50: 9860000, areaP50: 49.35, priceP75: 10440000, areaP75: 43.89, areaMin: 35.8, areaMax: 54.96 },
    { label: '3', count: 76, priceMin: 9360000, priceMax: 16980000, priceAvg: 10969342, priceP25: 10300000, areaP25: 47.5, priceP50: 10770000, areaP50: 55.3, priceP75: 11490000, areaP75: 58.59, areaMin: 47.5, areaMax: 76.62 },
    { label: '4', count: 12, priceMin: 13710000, priceMax: 19560000, priceAvg: 16217500, priceP25: 13780000, areaP25: 63.61, priceP50: 17840000, areaP50: 85.35, priceP75: 18790000, areaP75: 87.82, areaMin: 63.61, areaMax: 90.82 },
  ]},
  /* ── Санкт-Петербург ── */
  { slug: 'lisino', city: 'spb', label: 'Лисино Город-парк', rooms: [
    { label: 'Студия', count: 39, priceMin: 9435000, priceMax: 14656000, priceAvg: 10573554, priceP25: 10133000, areaP25: 29.3, priceP50: 10350000, areaP50: 29.45, priceP75: 10814000, areaP75: 32.2, areaMin: 27.1, areaMax: 40.8 },
    { label: '1', count: 143, priceMin: 11092000, priceMax: 35078000, priceAvg: 14500016, priceP25: 11928000, areaP25: 35.95, priceP50: 13720000, areaP50: 42.1, priceP75: 14931000, areaP75: 45.1, areaMin: 33.3, areaMax: 101.15 },
    { label: '2', count: 178, priceMin: 16376000, priceMax: 26861000, priceAvg: 20419933, priceP25: 18605000, areaP25: 58.7, priceP50: 19910000, areaP50: 62.1, priceP75: 22010000, areaP75: 68.25, areaMin: 50.9, areaMax: 81.05 },
    { label: '3', count: 66, priceMin: 22120000, priceMax: 37055000, priceAvg: 26880502, priceP25: 25680000, areaP25: 84.8, priceP50: 26772000, areaP50: 88.08, priceP75: 28150000, areaP75: 90.72, areaMin: 71.95, areaMax: 115.37 },
  ]},
  { slug: 'upoint', city: 'spb', label: 'UPOINT', rooms: [
    { label: '2', count: 1, priceMin: 35160000, priceMax: 35160000, priceAvg: 35160000, priceP25: 35160000, areaP25: 138.4, priceP50: 35160000, areaP50: 138.4, priceP75: 35160000, areaP75: 138.4, areaMin: 138.4, areaMax: 138.4 },
  ]},
  /* ── Тольятти ── */
  { slug: 'unicum_lenin', city: 'tlt', label: 'Уникум на Ленинском', rooms: [
    { label: 'Студия', count: 9, priceMin: 7144000, priceMax: 14796000, priceAvg: 10241444, priceP25: 7237000, areaP25: 41.14, priceP50: 10386000, areaP50: 68.62, priceP75: 13809000, areaP75: 91.29, areaMin: 41.14, areaMax: 93.89 },
    { label: '1', count: 11, priceMin: 7613000, priceMax: 21384000, priceAvg: 12656091, priceP25: 7700000, areaP25: 41.8, priceP50: 7900000, areaP50: 41.8, priceP75: 20120000, areaP75: 104.71, areaMin: 41.8, areaMax: 108.37 },
    { label: '2', count: 16, priceMin: 10695000, priceMax: 13140000, priceAvg: 11986500, priceP25: 11496000, areaP25: 66.45, priceP50: 12543000, areaP50: 71.43, priceP75: 12718000, areaP75: 71.43, areaMin: 61.94, areaMax: 73.69 },
    { label: '3', count: 11, priceMin: 10386000, priceMax: 14814000, priceAvg: 12951091, priceP25: 12302000, areaP25: 91.29, priceP50: 13357000, areaP50: 92.48, priceP75: 14376000, areaP75: 92.48, areaMin: 68.62, areaMax: 98.85 },
  ]},
  { slug: 'bulvar', city: 'tlt', label: 'Южный Бульвар', rooms: [
    { label: 'Студия', count: 76, priceMin: 5040000, priceMax: 10990000, priceAvg: 5373553, priceP25: 5200000, areaP25: 32.17, priceP50: 5320000, areaP50: 32.48, priceP75: 5420000, areaP75: 32.93, areaMin: 30.53, areaMax: 104.1 },
    { label: '1', count: 262, priceMin: 5680000, priceMax: 8050000, priceAvg: 6575092, priceP25: 5950000, areaP25: 36.56, priceP50: 6550000, areaP50: 40.66, priceP75: 7030000, areaP75: 43.24, areaMin: 35.72, areaMax: 49.78 },
    { label: '2', count: 81, priceMin: 7797000, priceMax: 10065000, priceAvg: 8565136, priceP25: 8140000, areaP25: 55.5, priceP50: 8400000, areaP50: 56.78, priceP75: 9140000, areaP75: 62.42, areaMin: 53.4, areaMax: 68.92 },
    { label: '3', count: 14, priceMin: 9300000, priceMax: 10810000, priceAvg: 10179643, priceP25: 9540000, areaP25: 68.57, priceP50: 10500000, areaP50: 80.11, priceP75: 10800000, areaP75: 80.11, areaMin: 68.57, areaMax: 80.11 },
    { label: '4', count: 3, priceMin: 12196000, priceMax: 12279000, priceAvg: 12237667, priceP25: 12238000, areaP25: 97.45, priceP50: 12238000, areaP50: 97.45, priceP75: 12279000, areaP75: 97.45, areaMin: 97.45, areaMax: 97.45 },
  ]},
];

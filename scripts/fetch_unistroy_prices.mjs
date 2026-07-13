#!/usr/bin/env node
/**
 * Тянет актуальную базу квартир в продаже с unistroy.ru через их публичный
 * JSON API (/api/flats/, тот же, что использует сайт для /search) и
 * агрегирует по городу × ЖК × комнатности — в формате, готовом для вставки
 * в PROJECTS внутри investment_calculator.html.
 *
 * Использование:
 *   node scripts/fetch_unistroy_prices.mjs
 *
 * Требует Node 18+ (встроенный fetch) и заголовок User-Agent — без него
 * unistroy.ru отвечает 403 (базовая защита от ботов, без капчи). Без
 * ключей/авторизации — эндпоинт публичный, им пользуется сам сайт для /search.
 *
 * Если запускаешь через Bash-тул Claude Code: обычный sandboxed Bash не
 * имеет выхода в интернет (curl/fetch виснет и падает по таймауту) — нужно
 * dangerouslyDisableSandbox: true.
 *
 * Что делает:
 *   1. Постранично забирает ВСЕ лоты по ВСЕМ городам (без city= фильтра).
 *   2. Группирует по (city_code, project.slug, комнатность).
 *   3. Пишет три файла в scripts/output/:
 *      - projects_data.js   — готовый JS-массив в формате PROJECTS
 *      - summary.json       — то же плюс сырые тоталы по городам, для сверки
 *      - calculator_projects_data.js — данные выбранных ЖК для калькулятора;
 *        его подхватывает investment_calculator.html автоматически.
 *
 * ВАЖНО: этот скрипт даёт только ЦЕНЫ/ПЛОЩАДИ/КОЛ-ВО ЛОТОВ (данные о продаже).
 * Ставки аренды (RENT_RATES в калькуляторе) сюда не входят — они берутся из
 * отдельного прайс-листа УК (см. цены_для_калк.xlsx), unistroy.ru — сайт
 * продаж, не аренды.
 *
 * После запуска: свежий projects_data.js нужно вручную сверить с текущим
 * PROJECTS в investment_calculator.html (могли появиться новые ЖК, мог
 * измениться список городов с активными продажами и т.д.) и внести правки.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const API_BASE = 'https://unistroy.ru/api/flats/';
const PAGE_LIMIT = 1000;
const MAX_FETCH_ATTEMPTS = 5;
const REQUEST_TIMEOUT_MS = 45000;

// unistroy.ru отдаёт 403 без правдоподобного User-Agent (базовая защита от
// ботов, не капча/Cloudflare) — обычный fetch без заголовков блокируется.
const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Referer': 'https://unistroy.ru/search',
};

const CITY_NAMES = {
  kzn: 'Казань',
  spb: 'Санкт-Петербург',
  ekb: 'Екатеринбург',
  tlt: 'Тольятти',
  mhc: 'Махачкала',
  per: 'Пермь',
  ufa: 'Уфа',
};

// В калькулятор попадают только ЖК, для которых утверждены ставки аренды.
// art16, yes_gorki и upoint исключены по решению команды. Трёхкомнатные
// квартиры также не выводятся: они не являются целевым продуктом инвестора.
const CALCULATOR_PROJECT_SLUGS = new Set([
  'grandbereg',
  'aqua', 'atmos', 'letokzn', 'statum', 'zalesnaia', 'tech',
  'unicum_amir', 'unicum_pob', 'tsarciti', 'qkulagina',
  'skies', 'parkblock', 'riverside', 'stadium',
  'lisino',
  'berth', 'unicum_engels',
  'unicum_lenin', 'bulvar',
]);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPage(url, page) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(url, { headers: FETCH_HEADERS, signal: controller.signal });
      if (!res.ok) {
        // Ошибки клиента (кроме 429) повтором не исправить — сообщаем сразу.
        if (res.status < 500 && res.status !== 429) {
          throw new Error(`HTTP ${res.status}`);
        }
        lastError = new Error(`HTTP ${res.status}`);
      } else {
        return await res.json();
      }
    } catch (error) {
      lastError = error;
      // Не повторяем заведомо постоянные ошибки клиента, например 403.
      if (/^HTTP 4(?!29)/.test(error.message)) throw error;
    } finally {
      clearTimeout(timeout);
    }

    if (attempt < MAX_FETCH_ATTEMPTS) {
      const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
      process.stderr.write(`  страница ${page}: попытка ${attempt} не удалась (${lastError.message}); повтор через ${delay / 1000} с…\n`);
      await sleep(delay);
    }
  }

  const cause = lastError?.cause?.message || lastError?.message || 'неизвестная ошибка';
  throw new Error(`не удалось загрузить страницу ${page} после ${MAX_FETCH_ATTEMPTS} попыток: ${cause} (${url})`);
}

async function fetchAllFlats() {
  const results = [];
  let url = `${API_BASE}?limit=${PAGE_LIMIT}`;
  let page = 0;
  while (url) {
    page += 1;
    const data = await fetchPage(url, page);
    results.push(...data.results);
    process.stderr.write(`  страница ${page}: +${data.results.length} лотов (всего ${results.length} из ${data.count})\n`);
    url = data.next ? new URL(data.next, API_BASE).href : null;
  }
  return results;
}

function roomLabel(flat) {
  return flat.studio ? 'Студия' : String(flat.rooms);
}

const ROOM_SORT_ORDER = ['Студия', '1', '2', '3', '4', '5'];

// Возвращает фактический лот в позиции квантиля: P25 / P50 / P75.
// Метод ближайшего ранга сохраняет связку «цена + площадь» одного лота,
// вместо искусственного сочетания цены одной квартиры и площади другой.
function quantileLot(lots, percentile) {
  const sorted = [...lots].sort((a, b) => a.price - b.price);
  return sorted[Math.round((sorted.length - 1) * percentile)];
}

function aggregate(flats) {
  const groups = new Map(); // key: city|slug|room
  const projectMeta = new Map(); // slug -> {city, label}

  for (const f of flats) {
    const city = f.city_code;
    const slug = f.project.slug;
    const label = f.project.name;
    const room = roomLabel(f);
    const price = parseFloat(f.price);
    const area = parseFloat(f.area);
    if (!Number.isFinite(price) || !Number.isFinite(area)) continue;

    projectMeta.set(slug, { city, label });

    const key = `${city}|${slug}|${room}`;
    if (!groups.has(key)) groups.set(key, { city, slug, label, room, count: 0, lots: [] });
    const g = groups.get(key);
    g.count += 1;
    g.lots.push({ price, area });
  }

  // Собираем в структуру PROJECTS
  const byProject = new Map(); // slug -> { slug, city, label, rooms: [] }
  for (const g of groups.values()) {
    if (!byProject.has(g.slug)) {
      byProject.set(g.slug, { slug: g.slug, city: g.city, label: g.label, rooms: [] });
    }
    const prices = g.lots.map(lot => lot.price);
    const areas = g.lots.map(lot => lot.area);
    const p25 = quantileLot(g.lots, 0.25);
    const p50 = quantileLot(g.lots, 0.50);
    const p75 = quantileLot(g.lots, 0.75);
    byProject.get(g.slug).rooms.push({
      label: g.room,
      count: g.count,
      priceMin: Math.round(Math.min(...prices)),
      priceMax: Math.round(Math.max(...prices)),
      priceAvg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      priceP25: Math.round(p25.price), areaP25: Math.round(p25.area * 100) / 100,
      priceP50: Math.round(p50.price), areaP50: Math.round(p50.area * 100) / 100,
      priceP75: Math.round(p75.price), areaP75: Math.round(p75.area * 100) / 100,
      areaMin: Math.round(Math.min(...areas) * 100) / 100,
      areaMax: Math.round(Math.max(...areas) * 100) / 100,
    });
  }

  const projects = [...byProject.values()];
  for (const p of projects) {
    p.rooms.sort((a, b) => ROOM_SORT_ORDER.indexOf(a.label) - ROOM_SORT_ORDER.indexOf(b.label));
  }
  projects.sort((a, b) => (a.city + a.label).localeCompare(b.city + b.label, 'ru'));

  const cityTotals = {};
  for (const p of projects) {
    if (!cityTotals[p.city]) cityTotals[p.city] = { count: 0, projects: 0 };
    cityTotals[p.city].projects += 1;
    cityTotals[p.city].count += p.rooms.reduce((s, r) => s + r.count, 0);
  }

  return { projects, cityTotals };
}

function roomObjLine(r) {
  return `    { label: '${r.label}', count: ${r.count}, priceMin: ${r.priceMin}, priceMax: ${r.priceMax}, priceAvg: ${r.priceAvg}, priceP25: ${r.priceP25}, areaP25: ${r.areaP25}, priceP50: ${r.priceP50}, areaP50: ${r.areaP50}, priceP75: ${r.priceP75}, areaP75: ${r.areaP75}, areaMin: ${r.areaMin}, areaMax: ${r.areaMax} },`;
}

function toProjectsJs(projects) {
  const byCity = new Map();
  for (const p of projects) {
    if (!byCity.has(p.city)) byCity.set(p.city, []);
    byCity.get(p.city).push(p);
  }

  let out = `// Автосгенерировано scripts/fetch_unistroy_prices.mjs — ${new Date().toISOString().slice(0, 10)}\n`;
  out += `// Источник: unistroy.ru, публичный API /api/flats/, активные лоты в продаже.\n`;
  out += `const PROJECTS = [\n`;
  for (const [city, list] of byCity) {
    out += `  /* ── ${CITY_NAMES[city] || city} ── */\n`;
    for (const p of list) {
      out += `  { slug: '${p.slug}', city: '${p.city}', label: '${p.label}', rooms: [\n`;
      for (const r of p.rooms) out += roomObjLine(r) + '\n';
      out += `  ]},\n`;
    }
  }
  out += `];\n`;
  return out;
}

function toCalculatorProjectsJs(projects, fetchedAt) {
  const calculatorProjects = projects
    .filter(project => CALCULATOR_PROJECT_SLUGS.has(project.slug))
    .map(project => ({
      ...project,
      rooms: project.rooms.filter(room => room.label !== '3'),
    }))
    .filter(project => project.rooms.length > 0);

  return `// Автосгенерировано fetch_unistroy_prices.mjs — ${fetchedAt.slice(0, 10)}\n` +
    `// P25/P50/P75 рассчитаны по фактическим лотам; 3-комнатные исключены.\n` +
    `window.CALCULATOR_PROJECTS = ${JSON.stringify(calculatorProjects, null, 2)};\n`;
}

async function main() {
  process.stderr.write('Забираю все лоты с unistroy.ru/api/flats/ ...\n');
  const flats = await fetchAllFlats();
  process.stderr.write(`Готово: ${flats.length} лотов.\n`);

  const { projects, cityTotals } = aggregate(flats);
  const fetchedAt = new Date().toISOString();

  const here = path.dirname(fileURLToPath(import.meta.url));
  const outDir = path.join(here, 'output');
  await mkdir(outDir, { recursive: true });

  const jsPath = path.join(outDir, 'projects_data.js');
  await writeFile(jsPath, toProjectsJs(projects), 'utf8');

  const calculatorDataPath = path.join(outDir, 'calculator_projects_data.js');
  await writeFile(calculatorDataPath, toCalculatorProjectsJs(projects, fetchedAt), 'utf8');

  const summaryPath = path.join(outDir, 'summary.json');
  await writeFile(summaryPath, JSON.stringify({
    fetchedAt,
    totalFlats: flats.length,
    cityTotals: Object.fromEntries(
      Object.entries(cityTotals).map(([code, v]) => [`${code} (${CITY_NAMES[code] || code})`, v])
    ),
    projectCount: projects.length,
    projects,
  }, null, 2), 'utf8');

  process.stderr.write('\nПо городам:\n');
  for (const [code, v] of Object.entries(cityTotals)) {
    process.stderr.write(`  ${(CITY_NAMES[code] || code).padEnd(18)} ${String(v.count).padStart(5)} квартир, ${v.projects} ЖК\n`);
  }
  process.stderr.write(`\nЖК всего: ${projects.length}\n`);
  process.stderr.write(`\nФайлы:\n  ${jsPath}\n  ${calculatorDataPath}\n  ${summaryPath}\n`);
  process.stderr.write(`\ncalculator_projects_data.js будет автоматически использован калькулятором.\n`);
}

main().catch(err => {
  console.error('Ошибка:', err.message);
  process.exit(1);
});

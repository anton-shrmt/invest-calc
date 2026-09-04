import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const dataFile = path.join(root, 'scripts/output/calculator_projects_data.js');
const htmlFile = path.join(root, 'investment_calculator.html');

const context = { window: {}, console, setTimeout, clearTimeout, Date, Math, Number, JSON, URLSearchParams };
vm.createContext(context);
vm.runInContext(fs.readFileSync(dataFile, 'utf8'), context);

const html = fs.readFileSync(htmlFile, 'utf8');
const inlineScripts = [...html.matchAll(/<script>\s*([\s\S]*?)\s*<\/script>/g)].map(match => match[1]);
const inlineScript = inlineScripts.at(-1);
assert.ok(inlineScript, 'В HTML не найден основной скрипт калькулятора');
vm.runInContext(inlineScript.replace(/Calc\.init\(\);\s*$/, 'globalThis.Calc = Calc;'), context);

// Внешний файл с данными может загрузиться без ошибок, но содержать пустой
// массив. В этом случае встроенный снимок должен оставаться рабочим.
for (const [label, payload] of [
  ['отсутствующий', undefined],
  ['пустой', []],
  ['повреждённый', [{ slug: 'broken', city: 'unknown', label: '', rooms: [] }]],
]) {
  const fallbackWindow = {};
  if (payload !== undefined) fallbackWindow.CALCULATOR_PROJECTS = payload;
  const fallbackContext = {
    window: fallbackWindow, console, setTimeout, clearTimeout,
    Date, Math, Number, JSON, URLSearchParams,
  };
  vm.createContext(fallbackContext);
  vm.runInContext(inlineScript.replace(/Calc\.init\(\);\s*$/, 'globalThis.Calc = Calc;'), fallbackContext);
  assert.ok(fallbackContext.Calc.getProject('aqua'), `${label} CALCULATOR_PROJECTS должен включать fallback`);
}

const { Calc } = context;
assert.ok(Calc, 'Расчётный модуль не экспортирован в тестовый контекст');

assert.equal(Calc.data.mortgageRate, 17, 'Ставка ипотеки по умолчанию должна быть 17%');
assert.equal(Calc.data.mortgageYears, 30, 'Срок ипотеки по умолчанию должен быть 30 лет');
const appreciationByCity = vm.runInContext('APPRECIATION_BY_CITY', context);
assert.deepEqual(
  JSON.parse(JSON.stringify(appreciationByCity)),
  { kzn: 13, mhc: 18, ekb: 13, spb: 11, per: 12, tlt: 14 },
  'Ставки роста стоимости жилья по городам расходятся с согласованными',
);

// Пример из документа: 5 000 ₽/сутки и 265 дней должны дать около 624 500 ₽ владельцу.
const daily = Calc.getRentFigures('aqua', '1', 9_000_000).dailyAnnualIncome;
assert.ok(daily >= 624_000 && daily <= 625_000, `Посуточный доход расходится с базовым сценарием: ${daily}`);

const isRentalModelAvailable = vm.runInContext('isRentalModelAvailable', context);
const allocateUnits = vm.runInContext('allocateUnits', context);
const isIntegerInRange = vm.runInContext('isIntegerInRange', context);
assert.equal(isRentalModelAvailable('daily', 'aqua', 'Студия'), true, 'STR должна быть доступна для студии');
assert.equal(isRentalModelAvailable('daily', 'aqua', '1'), true, 'STR должна быть доступна для 1-комнатной квартиры');
assert.equal(isRentalModelAvailable('daily', 'aqua', '2'), false, 'STR не должна быть доступна для 2-комнатной квартиры');
assert.equal(isIntegerInRange(12.5, 1, 30), false, 'Дробный срок ипотеки не должен быть допустим');
assert.equal(isIntegerInRange(12, 1, 30), true, 'Целый срок ипотеки должен быть допустим');
assert.deepEqual(
  JSON.parse(JSON.stringify(allocateUnits(8_000_000, 0, 0))),
  { units: 0, nFull: 0, mortgagedUnits: 0, cashLeft: 8_000_000, naturalUnits: 0, targetUnits: 0, targetAffordable: false, shortfall: 0 },
  'Некорректная цена не должна порождать Infinity/NaN в распределении квартир',
);
assert.deepEqual(
  JSON.parse(JSON.stringify(Calc.getRentFigures('aqua', '1', 0))),
  { monthlyRent: 0, dailyGrossAnnual: 0, dailyAnnualIncome: 0, isEstimated: true },
  'Некорректная цена не должна порождать доходность с некорректными значениями',
);

Object.assign(Calc.data, {
  investAmount: 8_000_000, cityCode: 'kzn', searchAllCities: false,
  rentGrowth: 5, appreciation: 13, horizon: 5, depositRate: 11, depositMonthly: true,
  mortgageRate: 17, mortgageYears: 30,
});
const cityOnlyHint = Calc._computeHint();
assert.ok(
  cityOnlyHint.ranked.filter(strategy => strategy.model !== 'deposit').every(strategy => strategy.cityCode === 'kzn'),
  'Обычный поиск должен ограничиваться выбранным городом',
);
Calc.data.searchAllCities = true;
const globalHint = Calc._computeHint();
assert.ok(
  globalHint.ranked.some(strategy => strategy.model !== 'deposit' && strategy.cityCode !== 'kzn'),
  'Глобальный поиск должен включать объекты из других городов',
);
assert.ok(globalHint.ranked.length > cityOnlyHint.ranked.length, 'Глобальный поиск должен расширять список кандидатов');
Calc.data.searchAllCities = false;

Object.assign(Calc.data, {
  investAmount: 8_000_000, cityCode: 'kzn', projectSlug: 'aqua', roomLabel: '2',
  rentGrowth: 5, appreciation: 13, horizon: 5, depositRate: 11, depositMonthly: true,
  mortgageRate: 17, mortgageYears: 30,
});
const twoRoom = Calc.compute();
assert.deepEqual([...twoRoom.availableModels], ['longterm', 'guaranteed'], 'Для 2-комнатной квартиры должны остаться только LTR и гарантированная аренда');
assert.equal(twoRoom.daily, null, 'Посуточная модель не должна рассчитываться для 2-комнатной квартиры');
assert.notEqual(Calc._computeHint().selected.model, 'daily', 'Карточка выбора не должна рекомендовать STR для 2-комнатной квартиры');

Calc.data.investAmount = 999;
Calc.data.mortgageRate = -1;
Calc.data.mortgageYears = 99;
Calc._sanitizeData();
assert.equal(Calc.data.investAmount, 1_000_000, 'Сумма инвестиций должна ограничиваться минимумом');
assert.equal(Calc.data.mortgageRate, 1, 'Ставка ипотеки должна ограничиваться минимумом');
assert.equal(Calc.data.mortgageYears, 30, 'Срок ипотеки должен ограничиваться максимумом');
Calc.data.horizon = 5.5;
Calc.data.mortgageYears = 12.5;
Calc.data.unitsOverride = 2.5;
Calc._sanitizeData();
assert.equal(Calc.data.horizon, 5, 'Дробный горизонт не должен округляться');
assert.equal(Calc.data.mortgageYears, 30, 'Дробный срок ипотеки не должен округляться');
assert.equal(Calc.data.unitsOverride, 0, 'Дробное количество квартир не должно округляться');

Object.assign(Calc.data, {
  investAmount: 6_000_000, cityCode: 'mhc', projectSlug: 'grandbereg', roomLabel: '1',
  rentGrowth: 5, appreciation: 10, horizon: 5, depositRate: 11, depositMonthly: true,
  mortgageRate: 12, mortgageYears: 15,
});
const selectedRoom = Calc.getRoom(Calc.getProject(Calc.data.projectSlug), Calc.data.roomLabel);
const affordability = Calc.compute();
assert.equal(affordability.unitPrice, selectedRoom.priceP50, 'В расчёте должна использоваться типичная цена P50');
assert.equal(
  Math.round(affordability.requiredInvestAmount),
  Math.round(affordability.unitPrice * 0.30),
  'Минимальная сумма инвестиций должна считаться от 30% первоначального взноса',
);
assert.equal(
  Math.round(affordability.totalCost - affordability.principal + affordability.cashRemainder),
  6_000_000,
  'Первоначальный взнос и остаток должны точно укладываться в бюджет',
);

// Единое правило 30% первоначального взноса: минимум на одну ипотечную
// квартиру — ровно 30% её стоимости, меньше — уже недоступно.
const price = affordability.unitPrice;
Calc.data.investAmount = Math.round(price * 0.30);
const minimalCase = Calc.compute();
assert.equal(minimalCase.units, 1, 'На 30% от цены квартиры должна открываться ровно одна ипотечная квартира');
assert.equal(minimalCase.isAffordable, true, '30% от цены квартиры — проходной порог');

Calc.data.investAmount = Math.round(price * 0.30) - 1000;
const belowMinimal = Calc.compute();
assert.equal(belowMinimal.isAffordable, false, 'Меньше 30% от цены квартиры — уже недоступно');

// Потолок в 2 квартиры в ипотеку одновременно, даже если кэша хватает на
// больше: 4 полностью за нал + 2 в ипотеку, третья ипотечная не предлагается.
Calc.data.investAmount = Math.round(4.9 * price);
const cappedCase = Calc.compute();
assert.equal(cappedCase.mortgagedUnits, 2, 'Не больше 2 квартир в ипотеку одновременно');
assert.equal(cappedCase.units, 6, '4 квартиры за нал + 2 в ипотеку, третья ипотечная не предлагается');

// Ручное количество квартир (unitsOverride): меньше натурального —
// ровно запрошенное, остаток бюджета не теряется.
Calc.data.unitsOverride = 2;
const targetLess = Calc.compute();
assert.equal(targetLess.units, 2, 'unitsOverride меньше натурального максимума — ровно запрошенное количество');
assert.equal(targetLess.mortgagedUnits, 0, '2 квартиры укладываются в нал без ипотеки на этом бюджете');
assert.ok(targetLess.cashRemainder > 0, 'Неиспользованный остаток должен быть учтён как наличные');
assert.equal(targetLess.targetAffordable, true, '2 квартиры при бюджете на 6 — доступно');

// Больше натурального максимума — не блокируем, а показываем максимум
// доступного и нехватку бюджета для запрошенного количества.
Calc.data.unitsOverride = 10;
const targetMore = Calc.compute();
assert.equal(targetMore.targetAffordable, false, '10 квартир при бюджете на 6 — недоступно');
assert.equal(targetMore.units, 6, 'При недоступном количестве показываем максимум доступного, а не 0');
assert.ok(targetMore.unitsShortfall > 0, 'Нехватка бюджета для запрошенного количества должна быть посчитана');

Calc.data.unitsOverride = 0;

// Автоматическая ссылка не должна превращать объект в ручной выбор у
// получателя, включая случай с сохранённой предыдущей ручной сессией.
context.window.location = { origin: 'https://example.test', pathname: '/calculator' };
Calc.data.objectManualOverride = false;
const autoShareUrl = Calc.buildShareUrl();
const autoShareParams = new URL(autoShareUrl).searchParams;
assert.equal(autoShareParams.has('proj'), false, 'Автоматическая ссылка не должна фиксировать ЖК');
assert.equal(autoShareParams.has('room'), false, 'Автоматическая ссылка не должна фиксировать комнатность');
assert.equal(autoShareParams.has('qty'), false, 'Автоматическая ссылка не должна передавать qty=0');
Calc.data.objectManualOverride = true;
Calc.data.unitsOverride = 7;
context.window.location.search = `?${autoShareParams.toString()}`;
Calc._applyUrlParams();
assert.equal(Calc.data.objectManualOverride, false, 'Автоматическая ссылка должна сбрасывать старый ручной режим');
assert.equal(Calc.data.unitsOverride, 0, 'Автоматическая ссылка должна сбрасывать старое ручное количество');
Calc.data.objectManualOverride = true;
Calc.data.unitsOverride = 1;
const manualShareParams = new URL(Calc.buildShareUrl()).searchParams;
assert.equal(manualShareParams.has('proj'), true, 'Ручная ссылка должна фиксировать ЖК');
assert.equal(manualShareParams.has('room'), true, 'Ручная ссылка должна фиксировать комнатность');
assert.equal(manualShareParams.get('qty'), '1', 'Ручная ссылка должна передавать количество квартир');
Calc.data.managerPhone = '9261234567';
assert.equal(Calc._whatsAppDigits(), '79261234567', '10-значный номер должен дополняться кодом России');

// В PDF метка «Ваш выбор» должна относиться к той же комбинации, включая
// количество квартир, а не ко всем карточкам того же ЖК и комнатности.
Object.assign(Calc.data, {
  investAmount: 37_890_000, cityCode: 'tlt', searchAllCities: false,
  projectSlug: 'bulvar', roomLabel: '2', unitsOverride: 1,
  objectManualOverride: true, rentGrowth: 5, appreciation: 14,
  horizon: 5, depositRate: 11, depositMonthly: true,
  mortgageRate: 17, mortgageYears: 30,
});
const printTarget = { innerHTML: '' };
context.document = {
  getElementById: id => id === 'client-selection-print' ? printTarget : null,
  body: { classList: { add() {}, remove() {} } },
};
context.window.addEventListener = () => {};
context.window.print = () => {};
Calc._printClientSelection();
assert.equal(
  (printTarget.innerHTML.match(/>Ваш выбор</g) || []).length,
  1,
  'В PDF должна быть ровно одна карточка «Ваш выбор»',
);
Calc.data.managerName = '<img src=x onerror=alert(1)>';
Calc.data.managerPhone = '<script>alert(2)</script>';
Calc._printClientSelection();
assert.doesNotMatch(printTarget.innerHTML, /<(?:img|script)\b/i, 'Контакты не должны создавать HTML/JS в PDF');
assert.match(printTarget.innerHTML, /&lt;img/, 'Опасный текст должен быть экранирован, а не потерян');

console.log('calculator_regression: OK');

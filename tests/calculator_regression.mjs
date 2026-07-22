import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const dataFile = path.join(root, 'scripts/output/calculator_projects_data.js');
const htmlFile = path.join(root, 'investment_calculator.html');

const context = { window: {}, console, setTimeout, clearTimeout, Date, Math, Number, JSON };
vm.createContext(context);
vm.runInContext(fs.readFileSync(dataFile, 'utf8'), context);

const html = fs.readFileSync(htmlFile, 'utf8');
const inlineScripts = [...html.matchAll(/<script>\s*([\s\S]*?)\s*<\/script>/g)].map(match => match[1]);
const inlineScript = inlineScripts.at(-1);
assert.ok(inlineScript, 'В HTML не найден основной скрипт калькулятора');
vm.runInContext(inlineScript.replace(/Calc\.init\(\);\s*$/, 'globalThis.Calc = Calc;'), context);

const { Calc } = context;
assert.ok(Calc, 'Расчётный модуль не экспортирован в тестовый контекст');

// Пример из документа: 5 000 ₽/сутки и 265 дней должны дать около 624 500 ₽ владельцу.
const daily = Calc.getRentFigures('aqua', '1', 9_000_000).dailyAnnualIncome;
assert.ok(daily >= 624_000 && daily <= 625_000, `Посуточный доход расходится с базовым сценарием: ${daily}`);

Calc.data.investAmount = 999;
Calc.data.mortgageRate = -1;
Calc.data.mortgageYears = 99;
Calc._sanitizeData();
assert.equal(Calc.data.investAmount, 1_000_000, 'Сумма инвестиций должна ограничиваться минимумом');
assert.equal(Calc.data.mortgageRate, 1, 'Ставка ипотеки должна ограничиваться минимумом');
assert.equal(Calc.data.mortgageYears, 30, 'Срок ипотеки должен ограничиваться максимумом');

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

// «Сдаю сам» — доход между 0 и посуточной моделью, отдельно от remainder-бюджета сделки.
assert.ok(affordability.selfRent.wealthArr[5] > 0, 'Сдаю сам должен давать положительный итог в базовом сценарии');
assert.ok(
  affordability.selfRent.rentArr[1] < affordability.daily.rentArr[1],
  'Сдаю сам (долгосрочная логика) не должен обгонять посуточную аренду по доходу 1-го года',
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

console.log('calculator_regression: OK');

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
  Math.round(affordability.unitPrice / 1.45),
  'Минимальная сумма инвестиций должна считаться от лимита ипотеки 45%',
);
assert.equal(
  Math.round(affordability.totalCost - affordability.principal + affordability.cashRemainder),
  6_000_000,
  'Первоначальный взнос и остаток должны точно укладываться в бюджет',
);

console.log('calculator_regression: OK');

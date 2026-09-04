import assert from 'node:assert/strict';
import { loadCalculator } from './helpers/load_calculator.mjs';
import { goldenProjectsSource } from './helpers/golden_projects.mjs';

const { Calc, context } = loadCalculator();
const { Calc: GoldenCalc } = loadCalculator({ projectsSource: goldenProjectsSource });
const appreciation = { kzn: 13, mhc: 18, ekb: 13, nn: 13, spb: 11, per: 12, tlt: 14 };
const cityCodes = ['kzn', 'mhc', 'ekb', 'nn', 'spb', 'per', 'tlt'];

Object.assign(GoldenCalc.data, {
  investAmount: 8_000_000, cityCode: 'kzn', projectSlug: 'tech', roomLabel: '1',
  searchAllCities: false, objectManualOverride: false, unitsOverride: 0,
  rentalModel: 'daily',
  rentGrowth: 5, appreciation: 13, horizon: 5, depositRate: 11, depositMonthly: true,
  mortgageRate: 17, mortgageYears: 30,
});
const hint = GoldenCalc._computeHint();
assert.equal(hint.best.model, 'deposit', 'Если все объекты дают отрицательный поток, рекомендация должна выбрать вклад');
assert.ok(hint.ranked.filter(strategy => strategy.model !== 'deposit').every(strategy => strategy.flowYearOne >= 0));
const selected = hint.selected;
assert.equal(selected.model, 'daily', 'Ручной выбор должен продолжать рассчитывать посуточную модель');
assert.ok(selected.ownerRentYearOne / 12 > 125_000 && selected.ownerRentYearOne / 12 < 140_000, 'Выплата владельцу должна быть около 131 тыс. ₽/мес');
assert.ok(selected.mortMonthly > 140_000 && selected.mortMonthly < 150_000, 'Ипотека должна быть около 146 тыс. ₽/мес');
assert.ok(selected.flowYearOne < 0, 'Ручной выбор должен сохранять диагностику отрицательного потока');
assert.ok(selected.totalTopup > 0, 'Отрицательный поток обязан порождать последующие доплаты');
assert.equal(selected.userCapital, GoldenCalc.data.investAmount + selected.totalTopup);
assert.ok(Number.isFinite(selected.roi));
assert.equal(Math.round(selected.grossYearOne), 3_180_000, 'Golden: валовая аренда первого года');
assert.equal(Math.round(selected.ownerRentYearOne), 1_573_344, 'Golden: выплата владельцу до ипотеки');
assert.equal(Math.round(selected.mortMonthly), 146_559, 'Golden: ежемесячная ипотека');
assert.equal(Math.round(selected.flowYearOne), -185_369, 'Golden: поток первого года после ипотеки');
assert.equal(Math.round(selected.totalTopup), 316_172, 'Golden: суммарные доплаты за пять лет');
assert.equal(Math.round(selected.userCapital), 8_316_172, 'Golden: все вложения пользователя');
assert.equal(Math.round(selected.wealth), 23_702_705, 'Golden: итоговый капитал');
assert.equal(Number(selected.roi.toFixed(3)), 185.019, 'Golden: ROI на все вложения');

const budgets = [17_500_000, 17_600_000, 26_200_000, 26_400_000, 34_900_000, 35_200_000, 61_000_000, 61_600_000];
for (const budget of budgets) {
  let signature = null;
  for (const startCity of cityCodes) {
    Object.assign(Calc.data, { investAmount: budget, cityCode: startCity, appreciation: appreciation[startCity] || 13, searchAllCities: true, objectManualOverride: false, unitsOverride: 0 });
    const best = Calc._computeHint().best;
    const current = `${best.cityCode}|${best.projectSlug}|${best.roomLabel}|${best.units}|${best.model}|${Math.round(best.wealth)}|${Math.round(best.userCapital)}`;
    signature ||= current;
    assert.equal(current, signature, `Глобальный подбор зависит от стартового города при бюджете ${budget}`);
  }
}

// Every current calculator project/room must stay finite and callable at the
// product minimum/maximum and around the exact 30% affordability boundary.
const projects = context.window.CALCULATOR_PROJECTS;
let marketScenarios = 0;
for (const project of projects) {
  for (const room of project.rooms) {
    const price = Number(room.priceP50);
    const boundary = Math.ceil(price * 0.30);
    const scenarioBudgets = [...new Set([1_000_000, Math.max(1_000_000, boundary - 1), Math.max(1_000_000, boundary), Math.min(70_000_000, price), 70_000_000])];
    for (const investAmount of scenarioBudgets) {
      Object.assign(Calc.data, {
        investAmount, cityCode: project.city, projectSlug: project.slug,
        roomLabel: room.label, searchAllCities: false,
        objectManualOverride: true, unitsOverride: 0,
        rentGrowth: 5, appreciation: appreciation[project.city], horizon: 5,
        depositRate: 11, depositMonthly: true,
        mortgageRate: 17, mortgageYears: 30,
      });
      const result = Calc.compute();
      assert.ok(Number.isFinite(result.unitPrice) && result.unitPrice > 0, `${project.slug}/${room.label}: invalid unit price`);
      assert.ok(Number.isFinite(result.requiredInvestAmount), `${project.slug}/${room.label}: invalid affordability`);
      for (const model of result.availableModels) {
        for (const series of ['grossRentArr', 'rentArr', 'flowArr', 'cashArr', 'topupArr', 'userCapitalArr', 'equityArr', 'wealthArr']) {
          assert.ok(result[model][series].every(Number.isFinite), `${project.slug}/${room.label}/${investAmount}/${model}.${series}`);
        }
      }
      marketScenarios += 1;
    }
  }
}
assert.ok(marketScenarios >= 200, `Недостаточно полного покрытия рынка: ${marketScenarios}`);

const mortgageProject = Calc.getProject('grandbereg');
const mortgageRoom = Calc.getRoom(mortgageProject, '1');
Object.assign(Calc.data, { investAmount: Math.round(4.9 * Calc.priceForTier(mortgageRoom)), cityCode: 'mhc', projectSlug: 'grandbereg', roomLabel: '1', searchAllCities: false, unitsOverride: 0, objectManualOverride: true, appreciation: 18 });
const multi = Calc.compute();
assert.equal(multi.mortgagedUnits, 2, 'Должно поддерживаться ровно до двух ипотечных квартир');
for (const model of multi.availableModels) {
  const result = multi[model];
  for (const series of ['grossRentArr', 'rentArr', 'flowArr', 'cumArr', 'cashArr', 'topupArr', 'userCapitalArr', 'propArr', 'equityArr', 'wealthArr']) {
    assert.ok(result[series].every(Number.isFinite), `${model}.${series} содержит NaN/Infinity`);
  }
  assert.ok(result.topupArr.every((value, index, values) => index === 0 || value >= values[index - 1]), 'Доплаты не могут уменьшаться');
}

console.log('finance_golden: OK');

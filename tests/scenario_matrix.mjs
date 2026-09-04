import assert from 'node:assert/strict';
import vm from 'node:vm';
import { loadCalculator } from './helpers/load_calculator.mjs';

const { Calc, context } = loadCalculator();
const buildMortgageSchedule = vm.runInContext('buildMortgageSchedule', context);

const closeTo = (actual, expected, tolerance, message) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${message}: ${actual} != ${expected} (допуск ${tolerance})`,
  );
};

const assertFiniteSeries = (series, expectedLength, label) => {
  assert.equal(series.length, expectedLength, `${label}: неверная длина ряда`);
  assert.ok(series.every(Number.isFinite), `${label}: ряд содержит NaN/Infinity`);
};

// Независимая матрица помесячного ипотечного движка. Проверяет бухгалтерское
// тождество, границы срока и то, что снижение ставки/досрочные платежи не могут
// увеличить проценты или срок относительно сопоставимого базового графика.
let mortgageCases = 0;
for (const principal of [0, 1, 1_000, 5_000_000, 50_000_000]) {
  for (const annualRate of [0, 1, 12, 18, 40]) {
    for (const termYears of [1, 2, 15, 30]) {
      for (const horizonYears of [1, 5, 15, 30]) {
        const baseline = buildMortgageSchedule(
          principal, annualRate, termYears, horizonYears, false,
        );
        const refinanced = buildMortgageSchedule(
          principal, annualRate, termYears, horizonYears, true,
        );
        const accelerated = buildMortgageSchedule(
          principal, annualRate, termYears, horizonYears, false,
          () => 13_000,
        );
        const acceleratedAndRefinanced = buildMortgageSchedule(
          principal, annualRate, termYears, horizonYears, true,
          () => 13_000,
        );

        for (const [name, schedule] of [
          ['baseline', baseline],
          ['refinanced', refinanced],
          ['accelerated', accelerated],
          ['acceleratedAndRefinanced', acceleratedAndRefinanced],
        ]) {
          for (const field of [
            'initialMonthlyPayment', 'refinancedMonthlyPayment', 'refinanceBalance',
            'totalPaid', 'totalInterest', 'totalExtraPaid', 'payoffMonth',
            'termReductionMonths', 'overpay',
          ]) {
            assert.ok(Number.isFinite(schedule[field]), `${name}.${field}: NaN/Infinity`);
            assert.ok(schedule[field] >= 0, `${name}.${field}: отрицательное значение`);
          }
          for (const field of [
            'annualPayments', 'scheduledAnnualPayments', 'extraAnnualPayments',
            'balances', 'rates',
          ]) {
            assertFiniteSeries(schedule[field], horizonYears + 1, `${name}.${field}`);
          }
          assert.ok(schedule.payoffMonth <= termYears * 12, `${name}: погашение позже исходного срока`);
          closeTo(
            schedule.totalPaid,
            principal + schedule.totalInterest,
            Math.max(0.01, principal * 1e-10),
            `${name}: платежи должны равняться телу кредита и процентам`,
          );
          closeTo(schedule.overpay, schedule.totalInterest, 0.01, `${name}: переплата должна равняться процентам`);
        }

        assert.ok(accelerated.payoffMonth <= baseline.payoffMonth, 'Досрочный платёж увеличил срок');
        assert.ok(accelerated.totalInterest <= baseline.totalInterest + 0.01, 'Досрочный платёж увеличил проценты');
        if (annualRate > 12 && termYears > 2 && principal > 0) {
          assert.equal(refinanced.refinanceApplied, true, 'Допустимое рефинансирование не применилось');
          assert.ok(refinanced.totalInterest <= baseline.totalInterest + 0.01, 'Снижение ставки увеличило проценты');
          assert.ok(
            acceleratedAndRefinanced.totalInterest <= accelerated.totalInterest + 0.01,
            'Снижение ставки при досрочном погашении увеличило проценты',
          );
        } else {
          assert.equal(refinanced.refinanceApplied, false, 'Недопустимое рефинансирование применилось');
        }
        mortgageCases += 1;
      }
    }
  }
}

// Сквозная матрица пользовательских допущений. Проверяет конечность рядов,
// сохранение капитала, накопление доплат, депозитную траекторию и отсутствие
// ухудшения ипотечного графика при включении экспериментальных механизмов.
const projects = context.window.CALCULATOR_PROJECTS;
const project = projects.find(item => item.rooms.some(room => room.label === '1')) || projects[0];
const room = project.rooms.find(item => item.label === '1') || project.rooms[0];
const unitPrice = Number(room.priceP50);
const budgets = [...new Set([
  1_000_000,
  Math.max(1_000_000, Math.ceil(unitPrice * 0.30)),
  Math.min(70_000_000, Math.max(8_000_000, Math.ceil(unitPrice * 0.90))),
  70_000_000,
])];
let calculatorCases = 0;

for (const appreciationScenario of ['conservative', 'base', 'optimistic']) {
  for (const appreciationBaseRate of [0, 8.2, 25]) {
    for (const horizon of [1, 5, 10, 15]) {
      for (const depositDecline of [false, true]) {
        for (const refinancing of [false, true]) {
          for (const rentToMortgage of [false, true]) {
            for (const rentalModel of ['longterm', 'guaranteed', 'daily']) {
              for (const investAmount of budgets) {
                Object.assign(Calc.data, {
                  investAmount,
                  cityCode: project.city,
                  projectSlug: project.slug,
                  roomLabel: room.label,
                  searchAllCities: false,
                  objectManualOverride: true,
                  unitsOverride: 0,
                  rentalModel,
                  rentGrowth: 5,
                  appreciationScenario,
                  appreciationBaseRate,
                  horizon,
                  depositRate: 11,
                  depositDecline,
                  depositMonthly: true,
                  mortgageRate: 18,
                  mortgageYears: 30,
                  refinancing,
                  rentToMortgage,
                });
                const result = Calc.compute();
                const expectedLength = horizon + 1;
                assertFiniteSeries(result.depositArr, expectedLength, 'depositArr');
                assertFiniteSeries(result.depositRates, expectedLength, 'depositRates');
                assertFiniteSeries(result.appreciationRates, expectedLength, 'appreciationRates');
                assert.equal(result.depositRates[1], 11, 'Первый год вклада должен использовать введённую ставку');
                if (depositDecline) {
                  assert.ok(result.depositRates.slice(1).every(rate => rate <= 11), 'Прогноз повысил ставку вклада');
                } else {
                  assert.ok(result.depositRates.slice(1).every(rate => rate === 11), 'Фиксированная ставка вклада изменилась');
                }

                for (const modelId of result.availableModels) {
                  const model = result[modelId];
                  for (const field of [
                    'grossRentArr', 'rentArr', 'flowArr', 'cumArr', 'cashArr',
                    'topupArr', 'userCapitalArr', 'propArr', 'equityArr', 'wealthArr',
                  ]) {
                    assertFiniteSeries(model[field], expectedLength, `${modelId}.${field}`);
                  }
                  for (let year = 0; year <= horizon; year++) {
                    closeTo(
                      model.wealthArr[year],
                      model.equityArr[year] + model.cashArr[year],
                      0.01,
                      `${modelId}, год ${year}: итоговый капитал`,
                    );
                    closeTo(
                      model.userCapitalArr[year],
                      investAmount + model.topupArr[year],
                      0.01,
                      `${modelId}, год ${year}: все вложения пользователя`,
                    );
                    assert.ok(model.cashArr[year] >= -0.01, `${modelId}, год ${year}: отрицательный денежный остаток`);
                    if (year > 0) {
                      assert.ok(model.topupArr[year] >= model.topupArr[year - 1], `${modelId}: накопленные доплаты уменьшились`);
                    }
                  }
                  const schedule = model.mortgageSchedule;
                  closeTo(
                    schedule.totalPaid,
                    result.principal + schedule.totalInterest,
                    Math.max(0.01, result.principal * 1e-10),
                    `${modelId}: ипотечное бухгалтерское тождество`,
                  );
                  if (rentToMortgage) {
                    assert.ok(
                      schedule.payoffMonth <= model.mortgageScheduleWithoutRentPrepayment.payoffMonth,
                      `${modelId}: аренда увеличила срок ипотеки`,
                    );
                    assert.ok(
                      schedule.totalInterest <= model.mortgageScheduleWithoutRentPrepayment.totalInterest + 0.01,
                      `${modelId}: аренда увеличила проценты по ипотеке`,
                    );
                  }
                  if (refinancing && result.principal > 0) {
                    assert.ok(
                      schedule.totalInterest <= model.mortgageScheduleWithoutRefinancing.totalInterest + 0.01,
                      `${modelId}: рефинансирование увеличило проценты`,
                    );
                  }
                }
                calculatorCases += 1;
              }
            }
          }
        }
      }
    }
  }
}

assert.ok(mortgageCases >= 400, `Недостаточно ипотечных сценариев: ${mortgageCases}`);
assert.ok(calculatorCases >= 3_000, `Недостаточно сквозных сценариев: ${calculatorCases}`);

console.log(`scenario_matrix: OK (${mortgageCases} mortgage + ${calculatorCases} calculator cases)`);

import assert from 'node:assert/strict';
import vm from 'node:vm';
import { loadCalculator } from './helpers/load_calculator.mjs';
import { goldenProjectsSource } from './helpers/golden_projects.mjs';

const { Calc, context, html } = loadCalculator();

// LOGIC-001: единичная и полная стоимость остаются разными сущностями.
Object.assign(Calc.data, {
  cityCode: 'mhc', projectSlug: 'grandbereg', roomLabel: 'Студия',
  objectManualOverride: true, rentalModel: 'longterm', horizon: 5,
  appreciationScenario: 'base', rentGrowth: 5, depositRate: 11, depositMonthly: true,
  mortgageRate: 17, mortgageYears: 30,
});
for (const [units, budget] of [[2, 8_000_000], [9, 50_000_000]]) {
  Calc.data.unitsOverride = units;
  Calc.data.investAmount = budget;
  const result = Calc.compute();
  assert.equal(result.units, units, `Сценарий ×${units} должен купить заданное количество квартир`);
  const display = Calc._purchasePresentation(result);
  assert.equal(display.unitLabel, 'Цена одной квартиры');
  assert.match(display.purchaseLabel, new RegExp(`Стоимость покупки — ${units}`));
  assert.equal(Math.round(result.totalCost), Math.round(result.unitPrice * units));
  assert.match(display.scopeSuffix, new RegExp(`все ${units}`));
}

// LOGIC-002 / TRUST-001: периоды динамические, вклад назван вкладом,
// а headline и последняя строка detail используют одну wealth-серию.
assert.match(html, /id="cmp-cumulative-heading">Накоплено за 5 лет/);
assert.match(Calc.render.toString(), /Накоплено за \$\{H\}/);
assert.match(Calc.render.toString(), /Процентный доход за 1-й год/);
assert.match(Calc.render.toString(), /Накопленный процентный доход/);
assert.doesNotMatch(Calc.render.toString(), /isDeposit[^\n]+Валовая аренда/);
Calc.data.unitsOverride = 2;
Calc.data.investAmount = 8_000_000;
const detail = Calc.compute().longterm;
const last = Calc.data.horizon;
assert.ok(Math.abs(Math.round(detail.equityArr[last]) + Math.round(detail.cashArr[last]) - Math.round(detail.wealthArr[last])) <= 1);
assert.match(html, /id="detail-formula"/);
assert.match(Calc.render.toString(), /data-detail-total="\$\{i === H \? 'final'/);
// Фиксированная цена 9 140 000 ₽ сохраняет проверку остатка при обновлениях прайса.
const { Calc: RemainderCalc } = loadCalculator({ projectsSource: goldenProjectsSource });
Object.assign(RemainderCalc.data, { investAmount: 9_740_000, cityCode: 'kzn', projectSlug: 'tech', roomLabel: '1', unitsOverride: 0, objectManualOverride: false, appreciationScenario: 'base', horizon: 5, rentalModel: 'longterm' });
const defaultDetail = RemainderCalc.compute();
assert.equal(defaultDetail.units, 1);
assert.equal(Math.round(defaultDetail.cashRemainder), 600_000, 'После покупки должны оставаться 600 000 ₽ неиспользованных средств');
assert.match(Calc.render.toString(), /data-unused-cash/);

// FLOW-001: возврат в auto сбрасывает только manual overrides.
Object.assign(Calc.data, {
  investAmount: 12_300_000, horizon: 9, rentGrowth: 7, depositRate: 13,
  mortgageRate: 15, mortgageYears: 20, rentalModel: 'guaranteed',
  appreciationScenario: 'conservative',
  objectManualOverride: true, unitsOverride: 4,
});
const preserved = Object.fromEntries(['investAmount', 'horizon', 'rentGrowth', 'depositRate', 'mortgageRate', 'mortgageYears', 'rentalModel', 'appreciationScenario'].map(key => [key, Calc.data[key]]));
Calc._syncSelectionToBest = () => { Calc.data.projectSlug = 'aqua'; Calc.data.roomLabel = '1'; return true; };
Calc._saveLS = () => {};
Calc.compute = () => ({});
Calc.render = () => {};
Calc._returnToAutoSelection();
assert.equal(Calc.data.objectManualOverride, false);
assert.equal(Calc.data.unitsOverride, 0);
for (const [key, value] of Object.entries(preserved)) assert.equal(Calc.data[key], value, `${key} должен сохраниться`);
assert.match(html, /Ручной выбор/);
assert.match(html, /Вернуться к автоподбору/);

// INPUT-001: пустота и текст не считаются бюджетом, корректная сумма — считается.
const parseBudgetInput = value => vm.runInContext(`parseBudgetInput(${JSON.stringify(value)})`, context);
assert.equal(parseBudgetInput('').valid, false);
assert.equal(parseBudgetInput('abc').valid, false);
assert.deepEqual(JSON.parse(JSON.stringify(parseBudgetInput('8 500 000'))), { amount: 8_500_000, valid: true });
assert.match(html, /role="alert" aria-live="polite"/);
assert.match(Calc.init.toString(), /Расчёт пока не изменён/);

// STATE-001 / privacy: reset сохраняет профиль, отдельная команда очищает,
// URL и QR-state контакты не сериализуют.
context.window.location = { origin: 'https://example.test', pathname: '/investment_calculator.html', search: '' };
Calc.data.managerName = 'Анна';
Calc.data.managerPhone = '+7 999 000-00-00';
assert.doesNotMatch(Calc.buildShareUrl(), /Анна|999/);
Calc._clearContacts();
assert.equal(Calc.data.managerName, '');
assert.equal(Calc.data.managerPhone, '');
assert.match(html, /сохраняется при сбросе расчёта/);
assert.match(html, /Контакты профиля менеджера сохранятся отдельно/);
assert.match(html, /id="clear-contacts"/);

// A11Y / responsive / content / primary CTA / progressive disclosure.
assert.match(html, /name="appreciation-scenario"/);
assert.match(html, /id="appreciation-conservative"/);
assert.match(html, /id="appreciation-base"/);
assert.match(html, /id="appreciation-optimistic"/);
assert.match(html, /id="appreciation-base-rate-input"/);
assert.match(html, /id="deposit-decline-cb"/);
assert.match(html, /Рефинансирование/);
assert.match(html, /id="rent-to-mortgage-cb"/);
assert.match(html, /Аренда — в досрочное погашение/);
assert.match(html, /экспериментально/);
assert.match(html, /Сценарии — расчётные допущения, а не прогноз или гарантия роста/);
assert.doesNotMatch(html, /id="appreciation-input"|id="appreciation-output"/);
assert.match(Calc.init.toString(), /IntersectionObserver/);
assert.match(Calc.init.toString(), /intersectionRatio >= 0\.5/);
assert.match(html, /PDF текущего расчёта/);
assert.match(html, /PDF-подборка вариантов/);
assert.match(html, /id="primary-next-step">Добавить контакт менеджера/);
assert.match(Calc._updateWhatsAppButton.toString(), /Обсудить расчёт в WhatsApp/);
assert.match(html, /Показать все показатели/);
assert.match(html, /Показать остальные стратегии/);
assert.match(html, /mobile-extra-strategy/);
assert.match(html, /\.detail-card \{ grid-column: 1 \/ -1; min-width: 0; \}/);
assert.match(html, /\.detail-card \.table-wrap \{ min-width: 0; max-width: 100%; \}/);
assert.match(html, /Итоговый капитал<\/strong> — капитал в недвижимости/);
assert.match(html, /Ваш бюджет — собственные средства/);

console.log('usability_regression: OK');

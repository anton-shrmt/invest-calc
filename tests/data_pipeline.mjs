import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {
  CALCULATOR_CITY_PARAMETERS,
  normalizeCityCode,
  validateProjects,
  validateSourceFlat,
} from '../scripts/fetch_unistroy_prices.mjs';
import { root } from './helpers/load_calculator.mjs';

for (const alias of ['mhc', 'mhchkala', 'mahachkala']) assert.equal(normalizeCityCode(alias), 'mhc');
assert.equal(normalizeCityCode('perm'), 'per');
assert.throws(() => normalizeCityCode('mystery-city'), /неизвестный city_code/);

const validFlat = {
  city_code: 'mhchkala', rooms: 1, studio: false, price: '7500000', area: '42.3',
  project: { slug: 'grandbereg', name: 'Гранд Берег' },
};
assert.doesNotThrow(() => validateSourceFlat(validFlat));
assert.throws(() => validateSourceFlat({ ...validFlat, city_code: 'unknown' }), /неизвестный city_code/);
assert.throws(() => validateSourceFlat({ ...validFlat, price: 'NaN' }), /price/);

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'scripts/output/calculator_projects_data.js'), 'utf8'), context);
assert.doesNotThrow(() => validateProjects(context.window.CALCULATOR_PROJECTS, { calculatorOnly: true }));
assert.ok(Number.isFinite(Date.parse(context.window.CALCULATOR_PROJECTS_META?.fetchedAt)), 'Дата выгрузки должна быть ISO-датой');
const dataCities = new Set(context.window.CALCULATOR_PROJECTS.map(project => project.city));
for (const city of dataCities) assert.ok(CALCULATOR_CITY_PARAMETERS[city], `Нет финансовых параметров города ${city}`);

const corrupted = structuredClone(context.window.CALCULATOR_PROJECTS);
corrupted[0].rooms[0].priceP50 = 0;
assert.throws(() => validateProjects(corrupted, { calculatorOnly: true }), /priceP50/);

console.log('data_pipeline: OK');

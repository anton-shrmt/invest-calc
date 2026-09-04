#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { loadCalculator } from '../tests/helpers/load_calculator.mjs';

const baseUrl = (process.argv[2] || '').replace(/\/$/, '');
const expectedSha = process.argv[3] || process.env.GITHUB_SHA;
if (!baseUrl || !expectedSha) {
  console.error('Usage: node scripts/post_deploy_smoke.mjs <base-url> <expected-sha>');
  process.exit(2);
}

const get = async relative => {
  const response = await fetch(`${baseUrl}/${relative}`, { cache: 'no-store' });
  assert.equal(response.ok, true, `${relative}: HTTP ${response.status}`);
  return new Uint8Array(await response.arrayBuffer());
};
const text = bytes => new TextDecoder().decode(bytes);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let manifest = null;
let lastPublishedSha = 'неизвестен';
for (let attempt = 1; attempt <= 30; attempt += 1) {
  try {
    manifest = JSON.parse(text(await get('release-manifest.json')));
    lastPublishedSha = manifest.releaseSha || lastPublishedSha;
    if (manifest.releaseSha === expectedSha) break;
  } catch (error) {
    if (attempt === 30) throw error;
  }
  if (attempt === 30) break;
  console.log(`Ожидание публикации ${expectedSha.slice(0, 12)}: попытка ${attempt}/30, сейчас ${String(lastPublishedSha).slice(0, 12)}`);
  await sleep(10_000);
}
assert.equal(manifest?.releaseSha, expectedSha, `Опубликован другой release SHA: ${lastPublishedSha}`);
for (const [relative, expectedHash] of Object.entries(manifest.files)) {
  const actualHash = createHash('sha256').update(await get(relative)).digest('hex');
  assert.equal(actualHash, expectedHash, `Хеш опубликованного ${relative} не совпадает`);
}

const htmlSource = text(await get('investment_calculator.html'));
const projectsSource = text(await get('scripts/output/calculator_projects_data.js'));
assert.doesNotMatch(htmlSource, /api\.qrserver\.com|cdnjs\.cloudflare\.com|fonts\.googleapis\.com/);
assert.match(htmlSource, /Упрощённая модель/);
const { Calc } = loadCalculator({ htmlSource, projectsSource });
Object.assign(Calc.data, { investAmount: 8_000_000, cityCode: 'kzn', searchAllCities: false, objectManualOverride: false, unitsOverride: 0, rentGrowth: 5, appreciation: 13, horizon: 5, depositRate: 11, depositMonthly: true, mortgageRate: 17, mortgageYears: 30 });
const golden = Calc._computeHint().best;
assert.equal(Math.round(golden.grossYearOne), 3_180_000);
assert.equal(Math.round(golden.ownerRentYearOne), 1_573_344);
assert.equal(Math.round(golden.mortMonthly), 146_559);
assert.equal(Math.round(golden.flowYearOne), -185_369);
assert.equal(Math.round(golden.totalTopup), 316_172);
assert.equal(Math.round(golden.userCapital), 8_316_172);
assert.equal(Math.round(golden.wealth), 23_702_705);
assert.equal(Number(golden.roi.toFixed(3)), 185.019);
console.log(`post_deploy_smoke: OK (${expectedSha.slice(0, 12)})`);

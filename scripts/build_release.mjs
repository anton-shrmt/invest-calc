#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { validateProjects } from './fetch_unistroy_prices.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, '.release-dist');
const releaseSha = process.env.GITHUB_SHA || process.env.RELEASE_SHA || 'local';
const builtAt = new Date().toISOString();
const files = [
  'investment_calculator.html', '.nojekyll',
  'assets', 'vendor', 'scripts/output/calculator_projects_data.js',
];

const dataContext = { window: {} };
vm.createContext(dataContext);
vm.runInContext(await readFile(path.join(root, 'scripts/output/calculator_projects_data.js'), 'utf8'), dataContext);
validateProjects(dataContext.window.CALCULATOR_PROJECTS, { calculatorOnly: true });

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
for (const relative of files) {
  const source = path.join(root, relative);
  const target = path.join(outDir, relative);
  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target, { recursive: true });
}

// GitHub Pages may cache immutable-looking JS/font/image paths between
// deployments. The release HTML therefore pins every runtime asset and the
// generated data file to the exact commit SHA. A normal browser reload then
// cannot combine a new HTML document with an older release-meta or price file.
const releaseVersion = encodeURIComponent(releaseSha);
const htmlPath = path.join(outDir, 'investment_calculator.html');
let releaseHtml = await readFile(htmlPath, 'utf8');
const versionedAssets = [
  'release-meta.js',
  'vendor/qrcode.min.js',
  'vendor/chart.umd.min.js',
  'assets/favicon.svg',
  'assets/og-preview.svg',
  'assets/img/unistroy-logo.svg',
  'assets/font/TTNormsPro-Regular.woff2',
  'assets/font/TTNormsPro-Medium.woff2',
  'assets/font/TTNormsPro-Bold.woff2',
  'assets/font/TTNormsProTrlExp-DemiBold.woff2',
  'assets/font/TTNormsProTrlExp-Bold.woff2',
];
for (const asset of versionedAssets) {
  assertReplacement(asset, `${asset}?v=${releaseVersion}`);
}
assertReplacement(
  `document.write('<script src="scripts/output/calculator_projects_data.js?v=' + Math.floor(Date.now() / 43200000) + '"><' + '/script>');`,
  `document.write('<script src="scripts/output/calculator_projects_data.js?v=${releaseVersion}"><' + '/script>');`,
);
await writeFile(htmlPath, releaseHtml, 'utf8');

function assertReplacement(from, to) {
  if (!releaseHtml.includes(from)) throw new Error(`Не найден runtime asset для версионирования: ${from}`);
  releaseHtml = releaseHtml.split(from).join(to);
}

const releaseMeta = `window.CALCULATOR_RELEASE = ${JSON.stringify({ sha: releaseSha, builtAt })};\n` +
  `document.querySelector('meta[name="release-sha"]')?.setAttribute('content', ${JSON.stringify(releaseSha)});\n` +
  `window.dispatchEvent(new Event('release-ready'));\n`;
await writeFile(path.join(outDir, 'release-meta.js'), releaseMeta, 'utf8');

async function walk(directory, prefix = '') {
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(directory, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await walk(path.join(directory, entry.name), relative));
    else result.push(relative);
  }
  return result;
}

const artifactFiles = (await walk(outDir)).sort();
const hashes = {};
for (const relative of artifactFiles) {
  const bytes = await readFile(path.join(outDir, relative));
  hashes[relative] = createHash('sha256').update(bytes).digest('hex');
}
const manifest = {
  releaseSha, builtAt,
  priceDataFetchedAt: dataContext.window.CALCULATOR_PROJECTS_META?.fetchedAt || null,
  tests: ['calculator_regression', 'data_pipeline', 'finance_golden', 'security_accessibility'],
  files: hashes,
};
await writeFile(path.join(outDir, 'release-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
await writeFile(path.join(outDir, 'test-manifest.json'), `${JSON.stringify({ releaseSha, passed: manifest.tests }, null, 2)}\n`, 'utf8');
console.log(`build_release: OK (${releaseSha.slice(0, 12)}, ${artifactFiles.length + 2} files)`);

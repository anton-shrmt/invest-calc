import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const tests = [
  'calculator_regression.mjs',
  'data_pipeline.mjs',
  'finance_golden.mjs',
  'scenario_matrix.mjs',
  'security_accessibility.mjs',
  'usability_regression.mjs',
];
for (const test of tests) {
  const result = spawnSync(process.execPath, [path.join(here, test)], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log(`run_all: OK (${tests.length} suites)`);

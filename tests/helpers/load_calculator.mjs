import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(here, '../..');

export function loadCalculator({ projectsSource, htmlSource } = {}) {
  const context = { window: {}, console, setTimeout, clearTimeout, Date, Math, Number, JSON, URLSearchParams };
  vm.createContext(context);
  vm.runInContext(projectsSource || fs.readFileSync(path.join(root, 'scripts/output/calculator_projects_data.js'), 'utf8'), context);
  const html = htmlSource || fs.readFileSync(path.join(root, 'investment_calculator.html'), 'utf8');
  const inlineScripts = [...html.matchAll(/<script>\s*([\s\S]*?)\s*<\/script>/g)].map(match => match[1]);
  const inlineScript = inlineScripts.at(-1);
  assert.ok(inlineScript, 'В HTML не найден основной скрипт калькулятора');
  vm.runInContext(inlineScript.replace(/Calc\.init\(\);\s*$/, 'globalThis.Calc = Calc;'), context);
  return { context, Calc: context.Calc, html };
}

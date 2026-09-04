import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadCalculator, root } from './helpers/load_calculator.mjs';

const html = fs.readFileSync(path.join(root, 'investment_calculator.html'), 'utf8');
assert.doesNotMatch(html, /api\.qrserver\.com|chart\.js\/4\.4\.1|fonts\.googleapis\.com|cdnjs\.cloudflare\.com/);
assert.match(html, /vendor\/qrcode\.min\.js/);
assert.match(html, /vendor\/chart\.umd\.min\.js/);
assert.match(html, /<header class="page-header">/);
assert.match(html, /<main class="main-layout"/);
assert.match(html, /<footer class="page-footer"/);
assert.match(html, /input\[type="range"\]:focus-visible/);
assert.match(html, /prefers-reduced-motion/);
assert.match(html, /aria-controls="wb-qr"/);
assert.match(html, /id="chart-text"/);
assert.match(html, /data-theme="dark"/);
assert.doesNotMatch(html, /доход уже в первый год|Гарантированный доход: риск минимален/);
assert.match(html, /Упрощённая модель/);
assert.match(html, /налоги, ремонт, меблировку/);

const { Calc, context } = loadCalculator();
context.window.location = { origin: 'https://example.test', pathname: '/investment_calculator.html' };
Calc.data.managerName = '<img src=x onerror=alert(1)>';
Calc.data.managerPhone = '+7 999 123-45-67';
const share = new URL(Calc.buildShareUrl());
assert.equal(share.origin, 'https://example.test');
assert.equal(share.searchParams.has('mn'), false, 'Имя менеджера не должно попадать в URL');
assert.equal(share.searchParams.has('mp'), false, 'Телефон менеджера не должен попадать в URL');
assert.doesNotMatch(share.href, /9991234567|onerror/);
assert.doesNotMatch(Calc._updateQrImage.toString(), /https?:\/\//, 'QR не должен обращаться к сети');

console.log('security_accessibility: OK');

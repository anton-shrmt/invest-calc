# QA notes — investment_calculator.html

Session start. Baseline: `node tests/calculator_regression.mjs` → OK (all assertions pass).

## File map (built from one full read, ~2494 lines total)

- 1-496: `<style>`
- 498-770: HTML body markup
- 772-775: bootstrap script (document.write of data script tag, 12h cache window)
- 776-2492: main script
  - 783-790 `CITIES`, 793-800 `CITY_IN`
  - 806-908 `PROJECTS` fallback snapshot (hardcoded, dated 2026-07-13)
  - 910-913 `PRICE_DATA_META`
  - 915 `ROOM_ORDER` (defined — check if actually used anywhere)
  - 922-943 `RENT_RATES`
  - 949-956 `STR_*` constants (RENTED_DAYS=265, AGGREGATOR_FEE=.15, CLEANING_PER_DAY=500, OTHER_ANNUAL_COST=126400, OWNER_SHARE=.72)
  - 961-968 `RENT_YIELD` fallback table
  - 975-990 `RENTAL_PRODUCT_MATRIX`, `RENTAL_MODELS`, `isRentalModelAvailable()`
  - 996-1040 `MIN_DOWN_PAYMENT_SHARE`(.30), `MAX_MORTGAGED_UNITS`(2), `allocateUnits()`
  - 1043-1050 `APPRECIATION_BY_CITY`
  - 1055-1087 helpers: rub, pct, fmtM, parseAmt, fmtAmt, clamp, isNumberInRange, formatDataDate, dataAgeHours, escapeHtml, paybackYears
  - 1092-2471 `Calc` module
    - 1094-1116 `Calc.data` defaults
    - 1119-1126 getProject/getRoom/priceForTier/areaForTier
    - 1129-1145 `getRentFigures()`
    - 1148-1300 `compute()`
    - 1303-1659 `render(r)`
    - 1662-1690 `_bindMortgageInputs()`
    - 1694-1701 `_syncAppreciationToCity()`
    - 1704-1718 `_renderManagerCredit()` (escapeHtml used here)
    - 1719-1739 `_whatsAppDigits/_updateWhatsAppButton/_updateQrImage/buildWhatsAppUrl`
    - 1744-1935 `_computeHint()` (evalCombo, groupWealth, cumRentFn, bestModelFor inside)
    - 1937-1991 `_renderHint()`, `_renderSearchScope()`
    - 1993-2011 `_getClientSelection()`
    - 2013-2061 `_printClientSelection()`
    - 2066-2080 `_syncSelectionToBest()`
    - 2084-2091 `_recompute()` (debounce 300ms)
    - 2094-2116 `_saveLS/_setValidationMessage/_sanitizeData`
    - 2118-2154 `_stringFields/_urlParamMap/_applyUrlParams/buildShareUrl`
    - 2155-2178 `_loadLS()` (cascade validation)
    - 2184-2207 `_populateCitySelect/_populateProjectSelect/_populateRoomSelect`
    - 2209-2470 `init()` (event listeners)
  - 2474-2488 `pluralYr`, `pluralFlats`
  - 2491 `Calc.init();`

## Phase 1 — static audit vs CALCULATOR.md

Status: IN PROGRESS

### Formulas checked (manual line-by-line vs CALCULATOR.md §5-7)
- [x] STR economics (getRentFigures, 1130-1145) vs §4.3 — MATCHES. Independent calc below.
- [x] LTR yr formula (line 1252) `monthlyRent*11*0.88*g` vs §5.1 — MATCHES
- [x] Guaranteed yr formula (line 1254) `monthlyRent*12*0.75*g` vs §5.2 — MATCHES
- [x] STR yr formula (line 1256) `dailyAnnualIncome*g` vs §5.3 — MATCHES
- [x] Mortgage annuity (1189-1195) vs §6.3 — MATCHES
- [x] Mortgage balance (1211-1222) vs §6.3 — MATCHES
- [x] Deposit capitalization (1227-1232) vs §5.6 — MATCHES
- [x] allocateUnits (1005-1040) vs §6.1 — MATCHES formula-for-formula
- [x] ROI (1286) vs §7 — MATCHES
- [x] APPRECIATION_BY_CITY (1043-1050) vs §5.5 — MATCHES (kzn13/mhc18/ekb13/spb11/per12/tlt14)
- [x] RENTAL_PRODUCT_MATRIX (975-990) STR only Студия/1 — MATCHES §5.4

### Independent from-scratch calc (not via vm/code) — STR base scenario
daily=5000, days=265:
- gross = 5000*265 = 1,325,000
- aggregatorFee = 1,325,000*0.15 = 198,750
- cleaning = 500*265 = 132,500
- operatingProfit = 1,325,000 - 198,750 - 132,500 - 126,400 = 867,350
- owner = 867,350*0.72 = 624,492 ₽/year
Matches CALCULATOR.md §4.3 "≈624 500 ₽" and regression test bounds [624000,625000]. CONFIRMED, not a finding.

### XSS / escaping audit (grep all innerHTML sinks, 25 hits)
All innerHTML sinks reviewed. managerName/managerPhone (the only real user-free-text
fields) go through `escapeHtml()` at:
  - line 1711-1712 (_renderManagerCredit, footer)
  - line 2043 (_printClientSelection PDF)
No other sink interpolates managerName/managerPhone raw. sh-badge/alt-badge use
.textContent not innerHTML (1945, 1964) so safe regardless. Project/room labels (from
data file, not user input) are escaped defensively at line 1419 (escapeHtml(proj.label))
and 2031 in the PDF card. Will still try actual payload in manager fields in Phase 5 live test.

### Potential issue found — PROJECTS empty-array fallback bypass
`const PROJECTS = window.CALCULATOR_PROJECTS || [fallback array];` (line 806).
JS `||` treats `[]` (empty array) as truthy. If `calculator_projects_data.js` ever ships
`window.CALCULATOR_PROJECTS = []` (e.g. total scrape failure that still writes valid but
empty JS), the fallback snapshot does NOT kick in — PROJECTS becomes really empty.
Trace: getProject(undefined) → undefined; compute()'s `this.getRoom(project, ...)` does
`project.rooms.find(...)` → TypeError (project undefined) → uncaught crash.
Need to verify in Phase 2/4 with vm harness (not just theorize). Candidate Blocker if reproducible.

### Additional Phase 1 findings (static)
- **`ROOM_ORDER` (line 915) is dead code** — defined, grepped whole file, zero other references. Nit.
- **No `eval`/`new Function`** anywhere — no dynamic-code-execution risk. Confirmed clean.
- **Only ONE `document.activeElement` focus guard in the whole file** (line 1312, for `units-input`).
  The dynamically-injected mortgage rate/years inputs (`#mort-rate-input`/`#mort-years-input`,
  created via `ps.innerHTML = html` at lines 1376/1403) have NO such guard — every debounced
  `render()` call (300ms after any keystroke) fully replaces `purchase-status`'s innerHTML,
  destroying and recreating those inputs regardless of focus. Candidate Major UX bug —
  confirmed live in Phase 5 (see below).
- **`allocateUnits`/`getRentFigures` have no guard against `price<=0`** — would produce
  `Infinity`/`NaN` cascades (division by zero). Only reachable via corrupted upstream API
  data (not user-triggered), so kept as a low-probability Minor/theoretical note, not tested
  live (would require corrupting real listing data, out of scope — "не чини сам" upstream data
  per task rules).
- **`units-input` HTML `max="20"` can be visually exceeded** — when auto/natural units for a
  cheap property + large budget exceeds 20 (e.g. 37), `render()` sets the input's `.value` to
  that number programmatically, which browsers accept even though it exceeds the declared
  `max`. Cosmetic-only (field isn't user-typable at that point). Nit.

## Phase 2 — combinatorial/property-based (Node, via vm on REAL code) — DONE

Script: scratchpad `qa_phase2.mjs` (deleted after use, not committed). Loaded the real
`scripts/output/calculator_projects_data.js` (25 projects, dynamically read — not hardcoded)
+ the real inline `<script>` from `investment_calculator.html` via `vm`, same technique as
`tests/calculator_regression.mjs`.

**Final tally: 931 checks, 917 passed, 14 failed (all 14 = one confirmed bug, see Finding #2 below).**

- Section A (full permutation, all 25 projects × all rooms = 55 combos): budget conservation
  (totalCost−principal+cashRemainder≈investAmount), mortgagedUnits≤2, isAffordable threshold
  (exactly 30% of price), STR gating (Студия/1 only), wealthArr[0]===investAmount identity for
  every rental model — **all passed, 0 failures**.
- Section B (searchAllCities, all 6 starting cities): city-only scope pure, global scope wider
  and multi-city — **all passed, 0 failures**.
- Section C (unitsOverride: 0/auto,1,natural,natural+1,20 × 6 cities × 2 budgets, 60 scenarios):
  exact-units-when-affordable / capped-with-shortfall-when-not — **all passed, 0 failures**.
- Section D (continuous sweeps, 6 vars × 5 points = 30 scenarios): finite wealth, ROI formula,
  deposit non-decreasing, mortgage balance non-negative & hits 0 by mortgageYears — **all
  passed, 0 failures**.
- Section E (pluralization on 13 adversarial numbers incl. 11/21/25/101/111/121): **all 26
  checks passed** — `pluralFlats`/`pluralYr` are correct Russian pluralization, no bugs.
- Section F (malformed inputs — negative/NaN/Infinity/oversized on every numeric field, plus
  nonexistent city/project/room and corrupted JSON via the REAL `_loadLS()`): **all passed, 0
  failures** — sanitize + cascade validation fully absorb garbage input, never throws.
- Section G (PDF client-selection labeling, 53 eligible combos): **12/53 (≈23%) reproduced a
  confirmed bug** — see Finding #2.
- Section H (share-link state-machine hypothesis): **hypothesis confirmed true** — see Finding #3.
- Section I (PROJECTS=[] hypothesis): **hypothesis confirmed true (crash reproduced)** — see
  Finding #1.

**Methodology note (important, keep for report):** first pass of Section A/C/G showed 8 extra
failures of the form "hint.selected < compute best" for non-Kazan cities (berth/lisino/
unicum_engels). Root-caused via a targeted diagnostic (`diag1.mjs`) to a **test-harness bug**,
not a product bug: my test set `appreciation:13` (Kazan's rate) from a shared DEFAULTS object
while sweeping OTHER cities' projects, without calling `_syncAppreciationToCity()` first. Real
usage always keeps `d.appreciation` in sync with `d.cityCode` (via the city-select handler,
`_syncSelectionToBest()`, and `_loadLS()`), so this divergence is not reachable in the actual
app. After fixing the harness to sync appreciation per-city, all 8 false positives disappeared.
Documenting this so the "hint vs compute may diverge on mixed purchases" invariant from
CALCULATOR.md §10.3 is reported accurately: **confirmed equal on pure cash/pure mortgage, and
hint≥compute on genuine mixed purchases, exactly as designed — not a bug.**

### CONFIRMED FINDINGS so far (numbered for the final report)

**Finding #1 (candidate Blocker, contingent on upstream data integrity):** `const PROJECTS =
window.CALCULATOR_PROJECTS || [fallback array]` (line 806). JS `||` treats `[]` as truthy, so
if `calculator_projects_data.js` ever ships `window.CALCULATOR_PROJECTS = []` (explicit empty
array — e.g. a scrape that "succeeds" but filters everything out), the embedded fallback does
NOT kick in. `PROJECTS` stays `[]`. Reproduced live: `Calc.compute()` throws
`TypeError: Cannot read properties of undefined (reading 'rooms')` (from `getRoom()` at line
1120, since `getProject()` returns `undefined`). Uncaught — page would show a blank/broken
calculator. NOTE: this is different from the "file completely fails to load" case (§10 doesn't
mention this specific empty-array case; that case (Phase 4 below) works correctly because
`window.CALCULATOR_PROJECTS` is simply `undefined`, not `[]`, so `||` does fall back).

**Finding #2 (Major, confirmed reproducible, ~23% of eligible combos in this test):**
`_printClientSelection()`'s card marker logic (line 2025) — `isSelected = d.objectManualOverride
&& item.projectSlug === d.projectSlug && item.roomLabel === d.roomLabel` — does not check
`item.units`, unlike `_renderHint()`'s equivalent check (line 1960, which correctly adds `||
h.selected.units !== h.best.units`). When a user manually sets `unitsOverride` to a value
different from the auto/natural unit count for that same project+room (a realistic action —
e.g. manually capping purchase to 1 unit while budget allows 5), AND that project+room also
appears in the general top-5 market scan (`properties`) at its auto/natural unit count, the PDF
selection can contain TWO distinct cards for the same property (different `units`, correctly
NOT deduped since dedup key includes units) — and BOTH get labeled «Ваш выбор» in the printed
PDF, since the label check ignores units. Confirmed repro: ЖК «Южный Бульвар» (`bulvar`), 2-комн.,
invest=37 890 000 ₽ → cards `bulvar_2×1` and `bulvar_2×5` both marked "selected".

**Finding #3 (Major, confirmed reproducible, affects every single share link):**
`buildShareUrl()` (line 2145) unconditionally serializes ALL `_urlParamMap` fields including
`qty`/`proj`/`room`, regardless of `d.objectManualOverride`. Since `unitsOverride` defaults to
`0` (not empty string, not null), the `if (value === '' || value == null) continue;` guard never
skips it — **every** generated link (Скопировать ссылку / QR / WhatsApp) includes `qty=0` even
when the sender never touched "Объект недвижимости" and is in pure auto-recommend mode. Per
`_applyUrlParams()` (line 2143), the mere presence of `qty` (or `proj`/`room`) in the URL forces
`objectManualOverride=true` on load — so **every recipient of every shared link loses the
"auto-follows-best-deal" behavior** that's the core UX of §9.2, even if the sender was just
looking at the auto-recommended best option and never made a manual choice. Confirmed
end-to-end in the Node harness: (a) share URL from a pure-auto sender state contains
`qty=0`; (b) loading that URL sets `objectManualOverride=true` on the recipient; (c) a
subsequent budget change on the recipient's side leaves `_syncSelectionToBest()` a no-op
(`changed===false`) — the property selection silently stops tracking the best deal.

## Phase 3 — state machine (Node-testable slice DONE; DOM-event slice deferred to Phase 5)

Script: scratchpad `qa_phase3.mjs`. **13/13 checks passed, 0 failures.** Confirms via the real
`_loadLS()`:
- URL params override localStorage field-by-field (amt/room/qty tested individually).
- Fields absent from the URL keep their localStorage value (cityCode, managerName tested).
- `proj`/`room` in URL flips `objectManualOverride` to `true` even if localStorage said `false`.
- URL params that are NOT proj/room/qty (e.g. `amt`, `rg` alone) do NOT flip
  `objectManualOverride` — confirms the flip is specifically scoped to object-identity params,
  matching §9.2/§9.3 intent (modulo Finding #3 above, which is about what `buildShareUrl()`
  chooses to serialize, not about `_applyUrlParams()`'s own logic, which is correct in isolation).
- No URL params at all → pure localStorage passthrough, including `objectManualOverride: true`
  surviving untouched.
- Boolean URL encoding (`dm=0`, `all=1`) round-trips correctly to `depositMonthly`/`searchAllCities`.

**Deferred to Phase 5 (needs real DOM/clicks, not worth stubbing in vm):** UI-driven
`objectManualOverride` transitions (manual city/project/room/qty select → true or false per
§9.2), reset button behavior, F5 state restore, debounce race safety on rapid slider drag.

## Phase 4 — resilience (Node-testable slice DONE; Chart.js/staleness-badge deferred to Phase 5)

Script: scratchpad `qa_phase4_node.mjs`. **8/8 checks passed, 0 failures.** Confirms: when
`window.CALCULATOR_PROJECTS` is simply `undefined` (data file fails to load entirely — the
realistic failure mode, e.g. 404/network error on the `<script src=...>` tag), the embedded
fallback snapshot array (dated 2026-07-13 per `PRICE_DATA_META`) is used correctly, and
`priceForTier`/`areaForTier` degrade correctly to `priceAvg`/`(areaMin+areaMax)/2` since the
fallback rooms have no `priceP50`/`areaP50` fields — exactly as CALCULATOR.md §4.1 describes.
`compute()` succeeds normally against this fallback data. **Confirmed correct, not a bug** —
distinct from Finding #1 above (which is specifically about an explicit empty-array payload,
not a missing file).

**Deferred to Phase 5 (needs real browser):** Chart.js CDN blocked → `#chart-fallback` shown;
`PRICE_DATA_META.fetchedAt` >24h → yellow staleness badge. Both are simple, already-read
conditionals (line ~2237 for Chart, line ~1329 for staleness) with low complexity; will do one
live confirmation each per the degradation rule (don't cut resilience below one scenario/type).

## Phase 5 — visual (live browser, local static server on :8181) — IN PROGRESS

Server: `python3 -m http.server 8181` in repo root via `.claude/launch.json` (added this file
— not present before session; harmless, local dev config only, not a repo content change).

Confirmed so far (screenshots used: 12 so far of ≤25 budget; two were wasted on a transient
blank-pane rendering glitch after a `type` action — recovered via `window.scrollTo(0,0)`,
not an app bug, just a tool/pane quirk):

1. **Desktop default load** — banner/hint-card/table/chart all consistent (23 387 078 ₽ /
   192.3% ROI matches across banner, hint card, and table simultaneously). Chart renders via
   Chart.js correctly (line chart, 4 series, distinguishable). PASS.
2. **Mixed cash+mortgage scenario** — forced via manual room switch + budget tuning to
   "Покупаете 2 квартиры: 1 квартира наличными + ещё 1 квартира в ипотеку". Banner/hint
   cards/table numbers all consistent. PASS. Also used this scenario to confirm Finding #1 live
   (below).
3. **Mobile (375×812)** — single column, cards stack correctly. Comparison table: confirmed via
   DOM inspection `thead{display:none}` and every `<td>` carries correct `data-label`
   (screenshotted, labels/values render correctly stacked, winner row highlighted). PASS.
4. **Tablet (768×1024)** — single-column layout (matches `max-width:768px` breakpoint), no
   overlapping/broken elements. PASS.
5. **Validation error state** — typed "500000" (below 1,000,000 min) into budget field: confirmed
   `aria-invalid="true"`, status text "Введите сумму от 1 до 70 млн ₽. Расчёт пока не изменён.",
   AND confirmed the rest of the UI genuinely does not recompute (stayed on prior valid figures).
   PASS, screenshotted.
6. **Unaffordable banner** — SPB / Лисино Город-парк / Студия (P50 10 350 000 ₽) with budget
   1 000 000 ₽ (well under the 3 105 000 ₽ = 30% requirement): banner switches to "Вклад вместо
   выбранного объекта", price shows "Недоступно", required-investment badge shows exactly
   `unitPrice×0.30` = 3 105 000 ₽ (matches formula exactly), table/chart show only deposit row,
   footer note "Остаток 1 000 000 ₽ учтён как наличные без роста." All correct. PASS, screenshotted.
7. **QR panel** — opened, confirmed `#wb-qr` unhidden and `wb-qr-img.src`'s `data=` param decodes
   to a URL exactly matching current form state. PASS functionally — **and this run doubled as a
   live confirmation of Finding #3**: at the moment of this QR generation, `objectManualOverride`
   was verified false (`#property-auto-hint` visibly unhidden, "автоматически" text showing), yet
   the encoded share URL contained `proj=lisino&room=Студия&qty=0` regardless. Screenshotted.
8. **Reset button** (Phase-3 deferred item) — set managerName="Иван Петров", managerPhone
   "89261234567", changed several fields, clicked reset: confirmed URL becomes clean
   `.../investment_calculator.html` (no query string, real navigation not reload), manager
   name/phone preserved, everything else back to documented defaults (8M/kzn/aqua/1/etc — visually
   identical to the very first screenshot). PASS, matches CALCULATOR.md §9.4 exactly.
9. **F5 / reload restore** (Phase-3 deferred item) — changed horizon to 9 and budget to
   15 000 000 without saving-via-URL, did a real `navigate` reload of the bare URL (no query
   string): confirmed both values restored from `localStorage['calc_v5']` after reload. PASS.
10. **WhatsApp phone transform** — live click didn't yield an observable new tab/request (popup
    likely blocked by the automated-browser environment — tooling limitation, noted, not a
    finding), so verified instead via the Node harness directly against the real `_whatsAppDigits()`:
    `89261234567`→`79261234567`, `+7 926 123-45-67`→`79261234567`, `8-926-123-45-67`→`79261234567`,
    `9261234567` (10 digits, no country code) stays `9261234567` unchanged (button visibility
    threshold is `<10`, so this un-prefixed 10-digit case would still show the button with a
    technically-incomplete wa.me link — extremely low-probability edge case, Nit only, not
    reporting as a real finding given a sales manager enters their own number once).

### Finding #1 — LIVE CONFIRMED (mortgage rate/years input loses focus every re-render)
Reproduced exactly as hypothesized in Phase 1 static review: clicked into `#mort-rate-input`,
typed "9", waited 1s (past the 300ms debounce) — `document.activeElement` became `""` (nothing
focused), even though the typed value ("9") was correctly saved to `Calc.data.mortgageRate` and
re-rendered (payment recalculated 68 432→38 622 ₽/мес, confirming the data path works). Then
typed "5" immediately after with **no re-click** — value stayed "9" (the second keystroke went
nowhere, no focused element to receive it). This is a genuine, reproducible Major UX defect: a
user cannot type a multi-character mortgage rate/term (e.g. "9.5" or "15") without re-clicking
the field after literally every character once 300ms elapses. Root cause confirmed in Phase 1:
`render()` unconditionally replaces `#purchase-status.innerHTML` (investment_calculator.html:1376,
1403) whenever a mortgage section is shown, with no `document.activeElement` guard (contrast with
the guard that DOES exist for `#units-input` at line 1312).

### Finding #2 — LIVE CONFIRMED (PDF client-selection can show two "Ваш выбор" cards)
Node harness already reproduced this in 12/53 combos (Section G); did not re-stage the exact live
repro scenario via UI (would require constructing the precise ЖК/бюджет combo again — Node repro
is already deterministic and precise, spending more screenshots on an identical re-confirmation
would be low-value per the budget-discipline rule). Will still visually confirm the client-
selection print DOM population (mandatory checklist item #6) using the CURRENT unaffordable-SPB
scenario instead — that scenario has no "Ваш выбор" duplication risk (deposit-only), so it serves
the "does the print mode structurally work" check, while Finding #2's specific defect stays
backed by the Node reproduction (exact inputs recorded in the finding).

### Debounce race check (live)
Rapid-fired 4 `form_input` calls on the budget slider back-to-back (10M→20M→30M→45M, no
waiting between them) then checked state after 1s: `invest-input` immediately showed
"45 000 000" (undebounced echo), and after the debounce fired, ALL figures (banner, table,
"Остаток 36 580 000 ₽" cash-remainder note) were internally consistent with a single clean
computation at exactly 45,000,000 — no stale/blended intermediate state. Confirms `_recompute`'s
`clearTimeout`+`setTimeout` correctly coalesces rapid changes into one final computation. PASS,
not a bug.

### Environment limitation (not an app bug) — window.print() hangs this automated browser pane
Clicking "Сохранить PDF" (`print-btn`) or "Сформировать подборку" (`selection-pdf-btn`) calls
`window.print()`, which opens a native OS/browser print dialog. In this sandboxed browser-pane
tool, that native dialog cannot be dismissed by any available action (`key Escape`, `navigate`,
even a fresh `computer` screenshot all timed out / hung once); recovery required abandoning the
tab and opening a new one (`tabs_create`). This is a limitation of the automated testing
environment, not a defect in the calculator — a real user's browser presents the native print
dialog normally with working Cancel/Save controls. **However**, this DID let me capture the
`_printClientSelection()`-populated DOM content via `javascript_tool` in the brief window before
the hang (see Finding #2 live confirmation below), which is arguably better evidence than a
screenshot for a text-content bug.

### Finding #2 — SECOND live confirmation, exact repro from the report
Reconstructed the Node-harness repro live: Тольятти → Южный Бульвар → 2-комн., бюджет
37 890 000 ₽, unitsOverride вручную = 1 (auto/natural = 5). Clicked «Сформировать подборку»;
inspected `#client-selection-print` DOM immediately via JS:
```
[{"rank":"Лучший вариант","name":"Тольятти · Уникум на Ленинском, 1-комн. × 6"},
 {"rank":"Ваш выбор","name":"Тольятти · Южный Бульвар, 2-комн."},
 {"rank":"Альтернатива 1","name":"Тольятти · Южный Бульвар, 1-комн. × 6"},
 {"rank":"Ваш выбор","name":"Тольятти · Южный Бульвар, 2-комн. × 5"},
 {"rank":"Альтернатива 2","name":"Тольятти · Уникум на Ленинском, 2-комн. × 4"}]
```
Two cards both literally labeled **«Ваш выбор»** — one for the user's actual 1-unit manual
purchase, one for the same ЖК/comнатность at the auto/natural 5-unit count picked up separately
by the general market scan. Visually confirms the bug exactly as predicted from static review
and the Node harness. This is going in the report as CONFIRMED via two independent methods.

### Phase 4 — remaining live checks (scratch copies, served on :8282, never touched real repo files)
Built a scratch copy (`resilience_test/`) of `investment_calculator.html` (Chart.js `<script src>`
deliberately pointed at a nonexistent path) + a copy of the real `calculator_projects_data.js`
with only `fetchedAt` edited to `2026-07-19` (3 days stale). Confirmed via `javascript_tool`
(screenshots of this second tab hit a persistent renderer-blank tooling glitch unrelated to the
app — DOM/JS inspection used instead, which is the more precise signal for this kind of check
anyway):
- `window.Chart === null` (via `onerror="window.Chart=null"` correctly firing on the broken URL),
  `#chart` canvas `hidden=true`, `#chart-fallback` `hidden=false` — exactly per code at
  investment_calculator.html:2237,2270-2273. **PASS, not a bug.**
- `#project-info-display` correctly shows `<span class="badge badge-yellow">Данные старше 24
  часов — уточните актуальность у менеджера</span>` with "Обновлено: 19 июля 2026 г." — exactly
  per `dataAgeHours()`/freshnessNote logic at line 1328-1334. **PASS, not a bug.**
Cleaned up: stopped the scratch server, closed the scratch tab. Scratch files remain only in
the session scratchpad (outside the repo), to be deleted at session end per task rules.

**Screenshot budget used: 16 of ≤25** (several blank/wasted due to a recurring transient
pane-rendering glitch after certain scroll/print interactions — a tooling artifact, confirmed
harmless to the app itself since DOM/text checks around the same moments always showed correct
state).

## Phase 6 — final regression — DONE

`node tests/calculator_regression.mjs` re-run: `calculator_regression: OK` (unchanged, code was
never modified this session). Final report compiled to `QA_REPORT.md` at repo root. Suggested
8 additional regression assertions in the report (not implemented, per task boundary).

Corrected count: Section G's exact tally was **13/53** combos reproducing the duplicate
"Ваш выбор" label (not 12 as noted earlier mid-session — the 14 total Node failures = 13
duplicate-label + 1 expected-crash confirmation for PROJECTS=[]). Report uses the corrected 13/53.

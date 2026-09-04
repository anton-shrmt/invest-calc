# Release validation evidence

Date: 2026-09-04 (Europe/Moscow)

## Automated gates

```text
calculator_regression: OK
data_pipeline: OK
finance_golden: OK
security_accessibility: OK
run_all: OK (4 suites)
build_release: OK (16 files)
git diff --check: OK
```

The financial golden case is asserted exactly in `tests/finance_golden.mjs`
using a stable price fixture, and repeated against the public artifact by
`scripts/post_deploy_smoke.mjs`. The same suite separately executes every
current project/room at minimum, maximum and 30% affordability boundaries
(at least 200 live-market scenarios), so legitimate price updates do not
invalidate formula expectations while malformed market data still fails.

## Browser QA

Checked against the local release candidate through `http://127.0.0.1:4173`.

| View | Evidence |
|---|---|
| 1440 × 900 | no horizontal overflow; TT Norms Pro/Expanded loaded; light and dark render; all result metrics visible |
| 768 × 900/1024 | `scrollWidth = 768`; single-column layout; result dock `display: grid` and reaches full result |
| 375 × 812 | `scrollWidth = 375`; no global overflow; result dock complete; validation error adjacent to field |
| 188 × 406 (200% reflow equivalent) | `documentElement.scrollWidth = 188`, `body.scrollWidth = 188`; winner banner `clientWidth = scrollWidth = 176` |

Additional observed checks:

- keyboard Tab focus on the investment range: `outline: rgb(54, 75, 75) solid 3px`, offset 5 px;
- mortgage rate sequence `9` → 500 ms pause → `.5`: value `9.5`, focus retained;
- invalid annual rent growth `31`: value retained, `aria-invalid=true`, error connected by `aria-describedby` and visible under the field;
- QR expands with local `canvas`/`data:image/png`; its URL contains calculator parameters but no manager name or phone;
- baseline UI matches the golden case: gross 265 000 ₽/month, owner payout 131 112 ₽/month, mortgage −146 559 ₽/month, flow −15 447 ₽/month, top-up 316 172 ₽, user capital 8 316 172 ₽, wealth 23 702 705 ₽, ROI 185.0%;
- dark theme: field/body foreground `rgb(235, 241, 241)`; local chart remains visible and its theme tokens update.

Stored after-images:

- `after-desktop-1440x900.png`
- `after-tablet-768x1024.png`

The exact 375 px and 188 px checks were captured through the interactive
browser and are recorded as metrics above. Headless desktop browsers enforce a
minimum layout viewport near 500 CSS px, so a cropped CLI image is deliberately
not accepted as 375 px evidence.

## Public deployment

- Deployment candidate: `9c9062b2607bf724a75e0d7a2e5035f028898630`
- Workflow: <https://github.com/anton-shrmt/invest-calc/actions/runs/33840100062>
- Public URL: <https://anton-shrmt.github.io/invest-calc/investment_calculator.html>

Both the workflow gate and an independent local invocation returned:

```text
post_deploy_smoke: OK (9c9062b2607b)
```

This proves that the public `release-manifest.json` carried the expected SHA,
every published SHA-256 matched, external QR/CDN URLs were absent, and the
financial golden case executed successfully from the published HTML and data.

Independent interactive production QA then confirmed:

- release meta: `9c9062b2607bf724a75e0d7a2e5035f028898630`;
- price data: updated 4 September 2026, 5,589 source lots passed the pipeline;
- 1440 px: `scrollWidth = innerWidth = 1440`, chart visible, no console errors;
- 768 px: `scrollWidth = innerWidth = 768`, mobile result dock visible;
- 375 px: `scrollWidth = innerWidth = 375`, dock bounds 8…367 px;
- minimum production test viewport 240 px: `scrollWidth = innerWidth = 240`;
- dark theme colors: background `rgb(28, 39, 39)`, foreground and amount field
  `rgb(235, 241, 241)`;
- invalid rent growth `31`: value/focus retained, `aria-invalid=true`, adjacent
  error `Значение должно быть от 0 до 30. Расчёт пока не изменён.`;
- mortgage sequence `9` → 600 ms → `.5`: value `9.5`, focus retained;
- QR: expanded panel, local 140×140 canvas and `data:image/png;base64` image;
- keyboard focus on `#invest-slider`: 3 px solid outline with 5 px offset;
- console errors: none.

### Cache-coherence follow-up

After the successful `9c9062b` manifest check, an ordinary browser reload
still showed the previous release SHA in the footer because GitHub Pages had
served a cached `release-meta.js`. This was treated as a release defect rather
than ignored. `scripts/build_release.mjs` now appends the exact release SHA to
every runtime asset and the generated price-data URL. The post-deploy smoke
asserts those bindings in the published HTML, in addition to file hashes.

The final production SHA after this correction is verified in the operator's
post-deploy report using the same manifest/hash/golden gate and a warm-browser
reload.

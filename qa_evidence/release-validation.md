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
and repeated against the public artifact by `scripts/post_deploy_smoke.mjs`.

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

This section is completed by the final operator report after GitHub Pages
returns the expected `releaseSha` and all manifest hashes pass.

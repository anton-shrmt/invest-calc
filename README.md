# Инвестиционный калькулятор — Унистрой.Аренда

Калькулятор доходности недвижимости vs банковского вклада для клиентов Унистрой.Аренда.

**Демо:** см. GitHub Pages ссылку в настройках репозитория.

## Структура

- `investment_calculator.html` — калькулятор, standalone-файл (без сборки)
- `scripts/fetch_unistroy_prices.mjs` — тянет актуальные цены лотов с публичного API unistroy.ru
- `scripts/output/calculator_projects_data.js` — сгенерированные данные, подключаются калькулятором напрямую
- `цены_для_калк.xlsx` — прайс-лист ставок аренды по ЖК

## Автообновление цен

`.github/workflows/update-prices.yml` запускает `fetch_unistroy_prices.mjs` каждые 12 часов и коммитит изменения в `scripts/output/`, если цены обновились. Запустить вручную: вкладка Actions → Update flat prices → Run workflow.

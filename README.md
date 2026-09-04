# Инвестиционный калькулятор — Унистрой.Аренда

Публичный калькулятор сценариев покупки недвижимости и банковского вклада.

- Продакшен: <https://anton-shrmt.github.io/invest-calc/investment_calculator.html>
- Методика: [CALCULATOR.md](CALCULATOR.md)
- Памятка отдела продаж: [USER_GUIDE.md](USER_GUIDE.md)
- Предрелизный аудит и повторная приёмка: [QA_REPORT.md](QA_REPORT.md)

## Состав релиза

- `investment_calculator.html` — приложение без фреймворка;
- `scripts/output/calculator_projects_data.js` — проверенный снимок активных лотов;
- `vendor/` — локальные Chart.js и генератор QR;
- `assets/` — TT Norms Pro, фирменный логотип, favicon и Open Graph preview;
- `release-meta.js` и `release-manifest.json` — SHA релиза и SHA-256 каждого опубликованного файла;
- `.github/workflows/deploy-pages.yml` — тесты, атомарная сборка, GitHub Pages и post-deploy smoke.

Сборщик добавляет `?v=<release-sha>` ко всем runtime assets и файлу данных.
Это исключает смешивание нового HTML со старым закэшированным JS, шрифтом,
логотипом или прайсом после deployment.

В приложении нет обязательных внешних runtime-зависимостей. При повреждённом или
пустом файле данных оно использует встроенный проверенный снимок; при ошибке
Chart.js показывает текстовую альтернативу.

## Обновление цен

`scripts/fetch_unistroy_prices.mjs` получает активные лоты из публичного API
unistroy.ru, нормализует алиасы городов, проверяет закрытый словарь кодов и схемы
исходных/сгенерированных данных, затем атомарно записывает `scripts/output/`.
Неизвестный город, невалидная цена/площадь/комнатность или пустой результат
останавливают публикацию. Workflow `update-prices.yml` запускает тот же pipeline
каждые 12 часов и перед коммитом выполняет весь тестовый набор.

Источники финансовых предпосылок (`RENT_RATES`, `RENT_YIELD`,
`APPRECIATION_BY_CITY`) пока не имеют подтверждённых владельца, ссылки и даты
среза. Интерфейс и документация помечают это явно; перед клиентской сделкой
ставки должны быть подтверждены у владельца продукта.

## Локальная проверка

```bash
node tests/run_all.mjs
node scripts/build_release.mjs
python3 -m http.server 4173
```

Набор включает регрессионные тесты калькулятора, контракт данных, финансовые
golden cases с отрицательным потоком и несколькими ипотечными квартирами, а
также статические security/accessibility проверки.

Для проверки уже опубликованного артефакта:

```bash
node scripts/post_deploy_smoke.mjs \
  https://anton-shrmt.github.io/invest-calc \
  <полный-git-sha>
```

Smoke ждёт нужный SHA, проверяет manifest и хеши файлов, отсутствие внешних
QR/CDN-зависимостей и выполняет эталонный расчёт непосредственно из
опубликованного HTML и файла данных.

## Откат

1. Найти последний зелёный deployment в GitHub Actions.
2. Сделать `git revert <плохой-sha>` отдельным коммитом в публикуемой ветке.
3. Дождаться `Deploy calculator to GitHub Pages` и проверить release SHA в
   footer/manifest.
4. Запустить `post_deploy_smoke.mjs` для SHA откатного коммита.

Не копируйте файлы на Pages вручную: единицей релиза является только артефакт,
собранный workflow из одного commit SHA.

# Paywall «Зверята»

Мобильный paywall детской игры для открытия в webview. Тестовое задание AmayaSoft.

- **Сервис:** https://paywall.beglum.ru
- **Макет:** https://www.figma.com/design/58EucVHwVQWkQzIGqwtDqg
- **Стек:** Nuxt 4, TypeScript (strict), Postgres 16, Docker Compose

## Запуск

```bash
cp .env.example .env          # поменять пароль
docker compose up -d --build  # приложение на 127.0.0.1:8120
```

Без Docker: `pnpm i && pnpm dev`. В `NUXT_DATABASE_URL` указать адрес любого Postgres. Таблица создаётся при старте (`server/plugins/migrate.ts`).

## Структура

| Что | Где |
|---|---|
| Экран и состояния | `app/pages/index.vue`, `app/components/*` |
| Токены из Figma | `app/assets/css/main.css` |
| API | `server/api/offers.get.ts`, `purchase.post.ts`, `purchases.get.ts` |
| БД | `server/utils/db.ts` (клиент `postgres` без ORM), таблица `purchases(id, offer_id, device_id, created_at)` |
| Тарифы (общие для клиента и сервера) | `shared/offers.ts` |
| Выгрузка из Figma и эталоны | `design/` |

- `GET /api/offers` — список тарифов.
- `POST /api/purchase {offerId, deviceId}` — проверяет входные данные и записывает покупку.
- `GET /api/purchases?deviceId=` — используется для «Восстановить покупки».

`deviceId` приложение-хост передаёт в `?deviceId=`. Если параметра нет, генерируется UUID и сохраняется в cookie. Кнопка «Начать играть» сообщает хосту об успехе через `postMessage`, поддержаны мосты React Native, iOS WKWebView и Android.

## Как проверить

- **Демо-панель ⚙** в правом верхнем углу: чипы состояний (`default`, `loading`, `error`, `purchasing`, `success`, `restore-empty`, `restore-success`) переключают экран сразу, без сети. «Живой режим» возвращает работу с API. Переключатели «Медленная сеть» (+2 с) и «Ошибка сервера» (500) действуют на реальные запросы и сразу перезагружают тарифы. Выключается `NUXT_PUBLIC_DEMO_PANEL=false` — для боевого webview.
- Альтернатива и сверка с макетом — query-параметры: `?state=<состояние>` (без сети, панель скрыта), `?delay=2000`, `?fail=1`.
- Повторный «Восстановить покупки» с тем же `deviceId` находит покупку, с новым — показывает «покупок не найдено».

## Pixel perfect

`pnpm pixel-diff` снимает каждое состояние в Playwright при 375×812 и сравнивает с PNG-экспортом фрейма из Figma через pixelmatch. Сейчас расхождение по всем шести состояниям меньше 1% (default 0,53%, restore-empty 0,71%, success 0,03%). Геометрия текстов совпадает с Figma до пикселя. Остаток — разница в сглаживании шрифта Nunito между Figma и Chromium.

## Почему так

- **Свой VPS и Postgres.** Сервис и база живут в одном `docker compose`, внешних аккаунтов не нужно, покупки видны обычным `SELECT`. Перед сервисом стоит Caddy с автоматическим TLS.
- **Без UI-кита.** Один экран и точное попадание в макет: scoped CSS на токенах из Figma даёт меньше кода, чем переопределение чужих стилей.
- **Для webview:** `100dvh`, `safe-area-inset`, без зависимостей от hover, `touch-action: manipulation`. Зона нажатия ссылки не меньше 44 px. Повторное нажатие CTA во время покупки заблокировано.

## AI-инструменты

Claude Code, Figma MCP и Figma REST API. Через MCP нарисован макет. Через REST API выгружены экспорт фреймов, SVG и дерево узлов с точной геометрией. По этому дереву сделана вёрстка, затем выполнена сверка pixelmatch в цикле «снять → сравнить → поправить». Вручную проверены: макет, сценарии покупки и восстановления, записи в БД.

## Что сделал бы за следующие 2 часа

- Тесты API (vitest и тестовый Postgres) и e2e сценария покупки в Playwright.
- Идемпотентность покупки (ключ запроса, уникальность device+offer на период) и rate limit.
- Реальная проверка платежа: чек App Store / Google Play на сервере вместо доверия клиенту.
- a11y-аудит (роли radiogroup у тарифов, фокус, озвучка состояний), i18n цен и текстов.
- Тарифы из БД или конфига вместо константы, аналитика показов и конверсии.

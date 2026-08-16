# Только между нами / Just Between Us

Готовая к публикации в Yandex Games сюжетная messenger-game на React, TypeScript и Vite. В релизе две самостоятельные взрослые истории: психологический триллер «Квартира 47» с Камилой (31) и романтическая ночная интрига «После полуночи» с Лерой (24).

## Запуск

```bash
npm install
npm run dev
```

Локально автоматически используется `DevelopmentPlatform`: SDK, реклама и облако не нужны. Для принудительной проверки загрузки Yandex SDK добавьте `?yandex=1`.

## Проверки и релиз

```bash
npm test
npm run build
npm run release
```

Готовый архив получает версию из `package.json`, например `release/just-between-us-v0.3.0-yandex.zip`. Внутри `index.html` лежит непосредственно в корне.

## Что реализовано

- универсальный графовый `DialogueEngine` с условиями, эффектами, памятью и скрытыми отношениями;
- общий registry для нескольких чатов без специальных условий в UI или движке;
- Лера: 26 узлов, 56 выборов, 5 самостоятельных стартов, 7 достижимых концовок и 2 локализованных photo-message;
- Камила: существующий граф v0.2 с 29+ узлами и 7 концовками сохранён без переписывания;
- typing delay, серии сообщений, статусы, удалённые и системные сообщения;
- сохранение после каждого выбора и сообщения, цепочка миграций legacy → v2 → v3 без потери старого прогресса;
- обязательный Age Gate 18+ и версионированное юридическое согласие без хранения даты рождения или документов;
- реальный взвешенный LoadingManager: SDK, язык, Player Data, save/migration, локализация, графы и критические assets;
- динамический RU/EN transcript: сообщения сценария и ответы игрока разрешаются по стабильным ID;
- `LoadingAPI`, `GameplayAPI`, fullscreen, rewarded hints и управляемый sticky-banner Yandex Games;
- русская и английская локализация UI и обеих историй, включая photo caption/alt;
- вычисляемый ad-safe layout по device/orientation/visualViewport, без фиксированного универсального отступа;
- mobile, tablet, полноэкранный desktop, portrait/landscape и TV с remote focus navigation;
- development-only Dialogue Debugger;
- автоматическая проверка битых переходов, недостижимых узлов, возраста 18+, adult asset manifest и каждой концовки.

Sticky работает в API mode и впервые запрашивается только после осмысленного действия: открытия списка диалогов или истории. В консоли Yandex задайте portrait — снизу, landscape — справа, desktop — справа.

Подробности: [архитектура](docs/ARCHITECTURE.md), [добавление нового диалога](docs/ADD_NEW_DIALOGUE.md), [динамический язык](docs/DYNAMIC_LANGUAGE.md), [реклама](docs/ADS.md), [TV](docs/TV_SUPPORT.md), [release notes](docs/RELEASE_NOTES.md), [релиз](docs/RELEASE_CHECKLIST.md).

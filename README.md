# Только между нами / Just Between Us

Готовая к публикации в Yandex Games сюжетная messenger-game на React, TypeScript и Vite. Первая история — психологический триллер «Квартира 47» с Камилой (31 год), пятью самостоятельными стартами и семью концовками.

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

Готовый архив получает версию из `package.json`, например `release/just-between-us-v0.1.0-chat-alpha-yandex.zip`. Внутри `index.html` лежит непосредственно в корне.

## Что реализовано

- универсальный графовый `DialogueEngine` с условиями, эффектами, памятью и скрытыми отношениями;
- 29 сценарных узлов, 5 стартовых подходов, 7 достижимых концовок;
- typing delay, серии сообщений, статусы, удалённые и системные сообщения;
- сохранение после каждого выбора и сообщения, миграция local/cloud legacy-ключей в save v2;
- динамический RU/EN transcript: сообщения сценария и ответы игрока разрешаются по стабильным ID;
- `LoadingAPI`, `GameplayAPI`, fullscreen, rewarded hints и управляемый sticky-banner Yandex Games;
- русская и английская локализация UI и всей первой истории;
- mobile, tablet, полноэкранный desktop, portrait/landscape и TV с remote focus navigation;
- development-only Dialogue Debugger;
- автоматическая проверка битых переходов, недостижимых узлов и каждой концовки.

Sticky работает в API mode и впервые запрашивается только после осмысленного действия: открытия списка диалогов или истории. В консоли Yandex задайте portrait — снизу, landscape — справа, desktop — справа.

Подробности: [архитектура](docs/ARCHITECTURE.md), [добавление нового диалога](docs/ADD_NEW_DIALOGUE.md), [динамический язык](docs/DYNAMIC_LANGUAGE.md), [реклама](docs/ADS.md), [TV](docs/TV_SUPPORT.md), [релиз](docs/RELEASE_CHECKLIST.md).

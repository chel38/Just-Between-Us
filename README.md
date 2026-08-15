# Между строк / Between the Lines

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

Готовый архив появится в `release/just-between-us-v0.1-chat-alpha-yandex.zip`. Внутри `index.html` лежит непосредственно в корне.

## Что реализовано

- универсальный графовый `DialogueEngine` с условиями, эффектами, памятью и скрытыми отношениями;
- 29 сценарных узлов, 5 стартовых подходов, 7 достижимых концовок;
- typing delay, серии сообщений, статусы, удалённые и системные сообщения;
- сохранение после каждого выбора и сообщения, миграции, local/cloud providers;
- актуальные `LoadingAPI`, `GameplayAPI`, fullscreen и rewarded ads Yandex Games;
- русская и английская локализация UI и всей первой истории;
- mobile, desktop, portrait, landscape и safe-area;
- development-only Dialogue Debugger;
- автоматическая проверка битых переходов, недостижимых узлов и каждой концовки.

Подробности: [архитектура](docs/ARCHITECTURE.md), [добавление нового диалога](docs/ADD_NEW_DIALOGUE.md), [релиз](docs/RELEASE_CHECKLIST.md).

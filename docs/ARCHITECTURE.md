# Архитектура

## Слои

```text
React UI
  ↓
DialogueEngine / ConditionEngine / EffectsEngine / TypingEngine
  ↓
Content registry → localized dialogue graph
  ↓
SaveEngine → Local storage + Yandex cloud
  ↓
PlatformService → YandexPlatform | DevelopmentPlatform
```

UI не знает ID узлов и не содержит реплик Камилы. Он получает `DialogueDefinition`, отображает историю и передаёт выбранный `choice.id` движку.

## Основные каталоги

- `src/content/dialogues` — персонажи, графы, переводы, концовки;
- `src/engine/dialogue` — условия, эффекты, переходы, валидатор;
- `src/engine/saves` — версия сохранения, миграции и запись;
- `src/engine/typing` — человекоподобные задержки с паузой;
- `src/platform` — Yandex SDK и локальный fallback;
- `src/pages` и `src/components` — универсальный интерфейс;
- `src/content/locales` — тексты интерфейса.

## Почему граф хранится вне React

Компоненты остаются одинаковыми для десятков историй. Новый персонаж — это данные, локализация и ассеты. Одинаковые node/choice IDs в переводах позволяют переключать язык посреди истории без миграции сохранения.

## Длинные переписки

В сохранении остаётся вся история, но DOM показывает последние 160 сообщений. Это предотвращает деградацию скролла в историях на тысячи реплик. При необходимости окно легко заменить виртуальным списком без изменения сценарного формата.

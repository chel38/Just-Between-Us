# Динамический язык transcript

## Почему сохраняются ID

Готовая русская строка не позволяет восстановить английский текст. Поэтому новая запись содержит `sourceType`, стабильный `sourceId` и необязательный `fallbackText`:

- `script-message` / `system` → `ScriptMessage.id`;
- `player-choice` → `DialogueChoice.id`;
- `runtime` → fallback для несценарного текста.

`resolveTranscriptMessage(message, dialogue)` строит индекс текущего локализованного графа и разрешает сообщения и ответы игрока. При RU ↔ EN React получает новый `DialogueDefinition`, но progress и transcript IDs остаются теми же.

## Quotes и статусы

Цитата использует `quoteSourceId`; `quoteFallbackText` поддерживает старые или удалённые источники. Статус персонажа аналогично хранит `characterStatusSourceId`.

## Смена во время typing

Активный playback хранит progress отдельно от localized engine. После задержки он повторно получает сообщение по ID из актуального `engineRef`, поэтому добавляется ровно одна реплика уже на новом языке. Settings открывается как overlay: DialoguePage остаётся mounted, playback ставится на паузу и продолжает ту же последовательность после закрытия.

## Legacy fallback

Миграция v1 восстанавливает ID, когда это однозначно возможно. Если ID отсутствует, resolver показывает `fallbackText`, а затем legacy `text`; прогресс не удаляется.

# Сохранения v2

Новый local key: `just-between-us-save-v2`. Legacy key `between-lines-save-v1` читается, мигрируется и остаётся как страховочная копия; результат сразу записывается в новый key.

Новый Yandex Player Data key: `justBetweenUsSave`. Если его нет, `YandexPlatform` читает legacy `betweenLinesSave`; SaveEngine прогоняет ту же последовательную миграцию и записывает v2 через новый provider key. `getPlayer()`, `getData()` и `setData()` используются и для гостя: авторизация не является условием облачного сохранения.

`CURRENT_SAVE_VERSION = 2`. Миграция v1:

- переносит legacy `text` в `fallbackText`;
- восстанавливает script `sourceId` из `scriptMessageId`;
- восстанавливает player-choice `sourceId` по порядку `choiceHistory`;
- создаёт `revealedHints` для каждого dialogue progress;
- сохраняет settings, отношения, flags, узел, историю и endings.

Локальная запись происходит после каждого сообщения/choice/setting. Cloud writes объединяются в окно две секунды; `pagehide` запрашивает немедленный flush. При загрузке выбирается более свежая local/cloud копия.

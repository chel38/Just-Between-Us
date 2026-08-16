# Сохранения v3

Текущий local key: `just-between-us-save-v3`. Предыдущий `just-between-us-save-v2` и legacy `between-lines-save-v1` читаются, мигрируются и остаются как страховочные копии; результат сразу записывается в v3 key.

Новый Yandex Player Data key: `justBetweenUsSave`. Если его нет, `YandexPlatform` читает legacy `betweenLinesSave`; SaveEngine прогоняет ту же последовательную миграцию и записывает v2 через новый provider key. `getPlayer()`, `getData()` и `setData()` используются и для гостя: авторизация не является условием облачного сохранения.

`CURRENT_SAVE_VERSION = 3`. Последовательная цепочка legacy/v1 → v2:

- переносит legacy `text` в `fallbackText`;
- восстанавливает script `sourceId` из `scriptMessageId`;
- восстанавливает player-choice `sourceId` по порядку `choiceHistory`;
- создаёт `revealedHints` для каждого dialogue progress;
- сохраняет settings, отношения, flags, узел, историю и endings.

Миграция v2 → v3 ничего не сбрасывает и добавляет поддержку необязательного `legalConsent`. До явного принятия запись отсутствует, поэтому вернувшийся пользователь видит Age Gate, а Camila resume остаётся на точном прежнем узле. После согласия хранится только `{ accepted, version, acceptedAt }`; дата рождения, имя и документы не запрашиваются.

Локальная запись происходит после каждого сообщения/choice/setting. Cloud writes объединяются в окно две секунды; `pagehide` запрашивает немедленный flush. При загрузке выбирается более свежая local/cloud копия.

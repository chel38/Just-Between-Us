# Архив концовок

Первый экран строится только из `getDialogues(language)`. Каждая карточка использует avatar/name/title из своего `DialogueDefinition`, количество ID из `save.endings[dialogue.id]` и общее число собственных endings.

После выбора история передаётся в detail view. Helper `getEndingArchiveEntries()` фильтрует unlocked IDs по множеству endings выбранного definition, поэтому чужой ID не может увеличить счётчик или открыть карточку.

Replay очищает только `save.dialogs[dialogueId]`. Архив `save.endings[dialogueId]`, настройки и прогресс других диалогов сохраняются.

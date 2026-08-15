# Локализация

Поддерживаются `ru` и `en`. UI находится в `src/content/locales`, истории — в локализациях каждой папки диалога.

Режим `auto` сначала использует язык Yandex SDK, затем язык браузера. React обновляет `document.documentElement.lang`; перезагрузка страницы не выполняется.

Язык не входит в сценарный progress. `currentNodeId`, relationship, flags, choice history и ending ID одинаковы для RU и EN. Старые и новые сообщения, ответы игрока, системные события, статусы, цитаты, концовки, hints и previews разрешаются из текущего локализованного определения. Подробный формат — в [DYNAMIC_LANGUAGE.md](DYNAMIC_LANGUAGE.md).

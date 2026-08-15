# Yandex Games

Production загружает `/sdk.js`, вызывает `YaGames.init()` и работает только через `PlatformService`. Ошибка SDK показывает локализованный экран повтора и не маскируется development-режимом. Локально используется DevelopmentPlatform; `?yandex=1` включает реальный SDK, `?device=tv` — TV simulation.

Сразу после `YaGames.init()` читается `environment.i18n.lang`, затем до `getPlayer()` подписываются `game_api_pause` и `game_api_resume`. Поэтому стартовая реклама, сворачивание и переключение вкладки останавливают typing и звук даже во время загрузки Player Data.

`LoadingAPI.ready()` вызывается после загрузки сохранения и первого интерактивного render. Sticky при этом не вызывается. `GameplayAPI.start()` соответствует активному видимому диалогу; меню, модальные окна, скрытая вкладка, SDK pause и реклама вызывают stop.

Тип устройства берётся из `sdk.deviceInfo().type`: desktop/mobile/tablet/tv. Fullscreen спрятан за `screen.fullscreen.request()/exit()/status`; на mobile/tablet/TV он запрашивается из пользовательского открытия истории.

В консоли Yandex:

1. Включите `Use the API to display a sticky-banner`.
2. Mobile portrait: `At the bottom`.
3. Mobile landscape: `On the right`.
4. Desktop sticky: включён, позиция справа.
5. Отметьте поддерживаемые desktop/mobile/tablet/TV платформы после ручной проверки.

Сам iframe рекламного блока CSS игры не перемещает. Layout лишь резервирует безопасную область после подтверждённого SDK status. Подробнее: [ADS.md](ADS.md) и [TV_SUPPORT.md](TV_SUPPORT.md).

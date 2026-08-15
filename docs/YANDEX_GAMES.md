# Yandex Games

Production загружает `/sdk.js`, вызывает `YaGames.init()` и работает только через `PlatformService`. Локально используется DevelopmentPlatform; `?yandex=1` включает попытку реального SDK, `?device=tv` — TV simulation.

`LoadingAPI.ready()` вызывается после загрузки сохранения и первого интерактивного render. Sticky при этом не вызывается. `GameplayAPI.start()` соответствует активному видимому диалогу; меню, модальные окна, скрытая вкладка и реклама вызывают stop.

Тип устройства берётся из `sdk.deviceInfo().type`: desktop/mobile/tablet/tv. Fullscreen спрятан за `screen.fullscreen.request()/exit()/status`; запрос на TV делается только из пользовательского действия.

В консоли Yandex:

1. Включите `Use the API to display a sticky-banner`.
2. Mobile portrait: `At the bottom`.
3. Mobile landscape: `On the right`.
4. Desktop sticky: включён, позиция справа.
5. Отметьте поддерживаемые desktop/mobile/tablet/TV платформы после ручной проверки.

Сам iframe рекламного блока CSS игры не перемещает. Layout лишь резервирует безопасную область после подтверждённого SDK status. Подробнее: [ADS.md](ADS.md) и [TV_SUPPORT.md](TV_SUPPORT.md).

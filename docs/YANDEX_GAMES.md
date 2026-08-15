# Yandex Games

## Подключение

Production-адаптер динамически загружает `/sdk.js` — это актуальный относительный путь для архива, размещённого на серверах Yandex Games. При локальной разработке используется `DevelopmentPlatform`.

Официальная документация: [Connection and usage](https://yandex.com/dev/games/doc/en/sdk/sdk-about).

## Game Ready

`features.LoadingAPI.ready()` вызывается после загрузки сохранения, удаления собственного loading screen и commit интерактивного React-интерфейса. Вызов не привязан к искусственному таймеру.

## Gameplay API

`GameplayAPI.start()` отправляется при открытом активном диалоге и видимой вкладке. `stop()` — в меню, скрытой вкладке и перед рекламой. После закрытия рекламы вызывается `start()`.

Документация: [Game loading and gameplay markup](https://yandex.com/dev/games/doc/en/sdk/sdk-game-events).

## Игрок и язык

Авторизация не обязательна. `player.isAuthorized()` определяет, можно ли использовать cloud data. Язык берётся из `ysdk.environment.i18n.lang`, пользователь может переопределить его в настройках.

## Проверка на платформе

1. Загрузите релизный ZIP в консоль Yandex Games.
2. Откройте draft с debug panel.
3. Убедитесь, что индикатор loader становится зелёным одновременно с доступным меню.
4. Проверьте gameplay-индикатор в диалоге, меню, скрытой вкладке и рекламе.
5. Проверьте гостевой запуск без auth dialog.

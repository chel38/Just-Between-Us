# Соответствие требованиям Yandex Games

Аудит выполнен по официальным разделам [Требования](https://yandex.ru/dev/games/doc/ru/concepts/requirements), [Быстрый старт](https://yandex.ru/dev/games/doc/ru/concepts/quick-start), [SDK](https://yandex.ru/dev/games/doc/ru/sdk), [Добавление игры](https://yandex.ru/dev/games/doc/ru/console/add-new-game) и [Монетизация](https://yandex.ru/dev/games/doc/ru/services/about-monetization).

| Область | Реализация | Проверка |
| --- | --- | --- |
| Архив | `index.html` в корне, ASCII-пути без пробелов, распакованный размер строго меньше 100 MB | `scripts/create-release.mjs` |
| SDK и язык | `/sdk.js` → `YaGames.init()` → немедленное чтение `environment.i18n.lang`; локаль используется в UI и истории | platform/localization tests |
| Гостевой режим | Игра не требует авторизации; Player Data читается и пишется для гостя и авторизованного игрока | platform/save tests |
| Загрузка | `LoadingAPI.ready()` после сохранения и готового первого UI; при SDK error показан Retry | production preview |
| Игровой процесс | `GameplayAPI.start/stop` соответствует диалогу, меню, модальным окнам, рекламе, hidden и SDK pause | lifecycle tests + preview |
| Звук | Причины паузы независимы: visibility, SDK, gameplay, settings и реклама не могут преждевременно возобновить AudioContext | code audit |
| Экран | Нет системного scrollbar; `100dvh`, safe-area, portrait/landscape; fullscreen запрашивается по жесту на mobile/tablet/TV | responsive preview |
| TV | Стрелки, OK, Back; `HISTORY_BACK`; подтверждение выхода через `EVENTS.EXIT`; внешних ссылок и покупок нет | TV tests; device QA требуется |
| Сохранения | Запись после сообщения/выбора, local fallback, guest cloud, 2-секундное объединение cloud writes, `pagehide` flush | save tests |
| Реклама | Только SDK; interstitial в сценарной паузе; rewarded выдаёт награду только по `onRewarded`; звук и typing остановлены | ad tests + code audit |
| Интерфейс | Контекстное меню, выделение и drag изображений отключены; мышь, клавиатура, touch и пульт поддержаны | preview/device QA |
| Контент | Законченная авторская история, 5 начал, 7 финалов, RU/EN; нет внешнего AI, внешних ссылок или псевдорекламы | dialogue validator |
| Карточка | Иконка 512×512, обложка 800×470, реальные desktop/mobile JPG; название совпадает с интерфейсом | `promo/` |

## Что остаётся внешней проверкой

- Запустить игру через Yandex debug panel и проверить вызовы I18N, Game Ready, Gameplay start/stop, Player Data и рекламу.
- Выполнить ручной прогон на реальном Android/iOS, desktop и TV/пульте до отметки соответствующих платформ в консоли.
- Проверить фактическую доступность sticky/fullscreen/rewarded рекламы для приложения и позиции sticky в настройках консоли.
- Подключить монетизацию в РСЯ/кабинете владельца, если она нужна. Это договорное и финансовое действие вне кода игры.
- Сохранить обновлённый черновик и отдельно, после проверок, отправить его на модерацию.

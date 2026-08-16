# Release checklist

## Yandex

- [x] `/sdk.js` подключается до `YaGames.init()`;
- [x] Game Ready привязан к реальной готовности;
- [x] реальный LoadingManager монотонно проходит SDK/language/player/save/migration/content/assets/app до 100%;
- [x] auth не обязателен;
- [x] local/cloud progress для гостя и авторизованного игрока;
- [x] язык читается через `environment.i18n.lang` до `getPlayer()`;
- [x] `game_api_pause/resume` подписаны до Player Data;
- [x] production-ошибка SDK не маскируется mock-адаптером;
- [x] реклама только через SDK;
- [x] sticky API mode: нет initial show, layout резервируется только после user action;
- [x] rewarded hint выдаётся только после reward callback;
- [x] gameplay и звук останавливаются.
- [x] Age Gate показывается до gameplay; consent хранится с версией legal notice;
- [x] character/adult asset validator запрещает возраст ниже 18;

## Gameplay

- [x] по 5 стартовых сообщений с разными ветками у Камилы и Леры;
- [x] скрытые отношения и флаги;
- [x] по 2 good + 2 neutral + 2 bad + 1 secret в каждом чате;
- [x] blacklist и restart только одного диалога;
- [x] восстановление текущего узла и transcript;
- [x] валидатор и маршруты до всех концовок.
- [x] 2 photo-message Леры: lazy preload, retry fallback, RU/EN alt, `promoAllowed: false`;

## UI

- [x] desktop двухколоночный режим;
- [x] полноэкранный TV mode, overscan padding, стрелки/OK и SDK Back/Exit;
- [x] mobile portrait 390×844;
- [x] mobile landscape 844×390;
- [x] safe-area и `100dvh`-совместимая оболочка;
- [x] computed sticky reserve проверен на 390×844 … 3840×2160;
- [x] нет внешнего scrollbar или horizontal overflow;
- [x] ограниченное окно DOM для длинной истории.

## Каталог

- [x] PNG-иконка 512×512;
- [x] PNG-обложка 800×470;
- [x] 4 RU + 4 EN JPG desktop-скриншота production-сборки 1600×900;
- [x] 2 RU + 2 EN JPG mobile-скриншота production-сборки 900×1600;
- [x] название игры на desktop-скриншотах совпадает с карточкой;
- [x] тексты черновика на русском и английском;
- [x] нейтральный промо-стиль без эротики и платформенных бейджей.
- [x] story photo отсутствуют в promo, локали физически разделены;

## Перед загрузкой

1. `npm run release`.
2. Release script проверяет `index.html` в корне, ASCII-пути без пробелов и размер менее 100 MB в распакованном виде.
3. Проверьте ZIP и хеш итогового файла.
4. Загрузите в Yandex Games и повторите SDK-проверки в debug panel.
5. Загрузите файлы из `promo/` и укажите корректный рейтинг 18+ в консоли.
6. Включите sticky API mode и задайте portrait bottom, landscape/desktop right.
7. Не отправляйте на модерацию до ручного прогона debug panel на desktop, mobile и TV.

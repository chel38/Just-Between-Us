# Yandex Games visual materials

Актуальный набор для версии 0.3.0:

- `icon-512x512.png` — иконка 512×512;
- `icon-maskable-512x512.png` — вариант для круглой safe zone;
- `cover-800x470.png` — обложка 800×470 без локализованного текста;
- `screenshots/ru/desktop/*.jpg` — 4 русских production-кадра 1600×900;
- `screenshots/ru/mobile/*.jpg` — 2 русских production-кадра 900×1600;
- `screenshots/en/desktop/*.jpg` — 4 полностью английских production-кадра 1600×900;
- `screenshots/en/mobile/*.jpg` — 2 полностью английских production-кадра 900×1600.

## Актуальные screenshots

| Локаль | Desktop | Mobile |
|---|---|---|
| RU | `home.jpg`, `chats.jpg`, `chat-camila.jpg`, `endings.jpg` | `chats.jpg`, `lera-choices.jpg` |
| EN | `home.jpg`, `chats.jpg`, `chat-lera.jpg`, `endings.jpg` | `chats.jpg`, `lera-choices.jpg` |

Все кадры сняты из production build, без debugger, device switch, mock-рекламы и ошибок. `lera-choices` использует явно отмеченный `promoSafe` стартовый node и не содержит story photo.

Никогда не использовать в каталоге файлы из `public/assets/characters/lera/story/`: их manifest содержит `promoAllowed: false`. Identity reference и сюжетные кадры также не являются промо-материалами.

Материалы не входят в игровой ZIP: их загружают в отдельные поля Developer Console. Каталожные тексты находятся в `YANDEX_METADATA.md`.

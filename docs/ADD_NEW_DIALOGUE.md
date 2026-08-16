# Как добавить новый диалог

1. Скопируйте `src/content/dialogues/_template` в каталог с уникальным латинским ID.
2. Добавьте WebP-аватары в `public/assets/characters/<id>/` и заполните `Character`, включая совершеннолетний возраст и `writingProfile`; задайте `contentRating: '18+'`.
3. Создайте RU-граф. ID узлов, сообщений, вариантов и концовок должны быть уникальны внутри истории и стабильны навсегда.
4. Создайте естественную EN-локализацию с теми же ID. Для каждого узла с choices добавьте содержательный hint в обеих локалях.
5. Опишите endings. Они остаются внутри `DialogueDefinition`, поэтому физически не могут попасть в архив другой истории.
6. Добавьте только фабрику истории в `src/content/dialogues/index.ts`.

Если история содержит photo-message, добавьте локализованный `alt`, зарегистрируйте asset в `adultAssetManifest` и оставьте `promoAllowed: false`. Для промо явно помечайте только безопасные текстовые nodes через `promoSafe: true`.

После регистрации Chats, desktop sidebar и Endings подхватят новую историю автоматически. `App.tsx`, `DialoguePage`, SaveEngine и PlatformService менять не нужно.

Проверка:

```bash
npm run validate:dialogues
npm test
```

Валидатор проверяет уникальность dialogue/node/message/choice/ending ID, переходы, достижимость финалов, совпадение RU/EN ID и наличие локализованных hints.

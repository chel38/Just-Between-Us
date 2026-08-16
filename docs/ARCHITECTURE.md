# Архитектура Just Between Us

```text
LoadingManager → SDK/language/player/save/migration/content/assets/app
  ↓
Age Gate + React UI
  ↓
DialogueEngine / ConditionEngine / EffectsEngine / TypingEngine
  ↓
getDialogues(language) → локализованные DialogueDefinition
  ↓
SaveEngine v3 → localStorage + Yandex Player Data
  ↓
PlatformService → YandexPlatform | DevelopmentPlatform
```

`getDialogues(language)` — единый реестр Камилы, Леры и последующих историй для Home, Chats, активного диалога и архива концовок. `App.tsx` хранит активный `dialogueId`; функции открытия, обновления и replay работают с любым зарегистрированным ID. Персонажей UI напрямую не импортирует.

Transcript сохраняет стабильные `sourceType/sourceId`, а не использует готовый текст как источник истины. `transcriptResolver.ts` на каждом render берёт текст из текущего `DialogueDefinition`; `fallbackText` нужен только старым сохранениям или удалённому впоследствии контенту.

Photo-message использует тот же stable ID. Resolver меняет локализованные caption/alt при RU ↔ EN, сохраняя тот же asset. `storyImageLoader` подгружает фото только перед соответствующей репликой; ошибка даёт retry/placeholder и не останавливает граф. Story assets описаны в `adultAssetManifest`, проверяются по возрасту и всегда имеют `promoAllowed: false`.

`LoadingManager` получает реальные milestone из PlatformService и SaveEngine, валидирует локализацию/графы и считает фактически загруженные критические avatars. Story photo не входит в initial payload. 100% достигается только после mount приложения; `LoadingAPI.ready()` вызывается после удаления loading overlay.

В истории остаются все сообщения, DOM отображает последние 160. При смене языка, ориентации и размера layout компонент не пересоздаёт progress. Если пользователь был внизу переписки, `ResizeObserver` сохраняет позицию у последнего сообщения.

Platform abstraction включает LoadingAPI, GameplayAPI, cloud save, fullscreen/rewarded/sticky ads, `deviceInfo()` и fullscreen. React-компоненты не обращаются к `ysdk` напрямую.

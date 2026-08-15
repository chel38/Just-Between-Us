# Архитектура Just Between Us

```text
React UI
  ↓
DialogueEngine / ConditionEngine / EffectsEngine / TypingEngine
  ↓
getDialogues(language) → локализованные DialogueDefinition
  ↓
SaveEngine v2 → localStorage + Yandex Player Data
  ↓
PlatformService → YandexPlatform | DevelopmentPlatform
```

`getDialogues(language)` — единый реестр историй для Home, Chats, активного диалога и архива концовок. `App.tsx` хранит активный `dialogueId`; функции открытия, обновления и replay работают с любым зарегистрированным ID. Камилу UI напрямую не импортирует.

Transcript сохраняет стабильные `sourceType/sourceId`, а не использует готовый текст как источник истины. `transcriptResolver.ts` на каждом render берёт текст из текущего `DialogueDefinition`; `fallbackText` нужен только старым сохранениям или удалённому впоследствии контенту.

В истории остаются все сообщения, DOM отображает последние 160. При смене языка, ориентации и размера layout компонент не пересоздаёт progress. Если пользователь был внизу переписки, `ResizeObserver` сохраняет позицию у последнего сообщения.

Platform abstraction включает LoadingAPI, GameplayAPI, cloud save, fullscreen/rewarded/sticky ads, `deviceInfo()` и fullscreen. React-компоненты не обращаются к `ysdk` напрямую.

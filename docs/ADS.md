# Реклама

## Sticky

На loading, SDK init, save loading и сразу после `ready()` sticky не запрашивается. Первое осмысленное действие — открытие списка диалогов или конкретной истории. Тогда PlatformService проверяет `getBannerAdvStatus()`: уже видимый banner не вызывается повторно, `reason` считается недоступностью, иначе вызывается `showBannerAdv()`.

При подтверждённом status layout резервирует область снизу для mobile portrait и справа для landscape/desktop. Production не рисует собственную рекламу. DevelopmentPlatform только логирует явную debug simulation.

## Fullscreen и rewarded

Interstitial остаётся на сценарном `adBreak` и защищён save-флагом от повторения. Rewarded используется для косметической темы и node-specific hint. Hint ID сохраняется в `revealedHints`; текст берётся из текущей локали. Он появляется только если callback `onRewarded` был получен до закрытия. Close без reward и error возвращают `false`.

Platform ad coordinator не допускает два fullscreen-вызова одновременно, останавливает GameplayAPI, временно скрывает sticky, затем восстанавливает его только если banner был запрошен пользователем. UI использует отдельную причину паузы для рекламы; SDK-события pause/resume не могут преждевременно включить звук или typing. Ошибка рекламы не меняет progress.

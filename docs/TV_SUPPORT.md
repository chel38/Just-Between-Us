# TV support

TV определяется по `sdk.deviceInfo().type === 'tv'`; ширина viewport не используется как источник device type. Для разработки доступны `?device=tv` и Device → TV в debugger.

TV layout использует весь viewport, крупные bubbles/controls/avatar, 4% overscan-safe padding и контрастный focus outline. Desktop chat sidebar остаётся рядом с перепиской.

Глобальный focus manager ищет видимые интерактивные элементы и для ArrowUp/Down/Left/Right выбирает ближайший элемент в направлении. Enter/OK активирует текущий элемент. Escape, Backspace, BrowserBack и GoBack выполняют цепочку:

```text
Settings overlay → Dialogue → Chats → Home → exit confirmation
```

Back не мутирует progress. На входе в список choices фокус получает первый доступный ответ; hint и fullscreen доступны тем же пультом. Fullscreen запрашивается через PlatformService после пользовательского открытия истории, поскольку браузеры запрещают произвольный fullscreen без жеста.

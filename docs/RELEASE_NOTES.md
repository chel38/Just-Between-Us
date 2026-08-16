# Release notes

## 0.4.0 — Story Hub

- главный экран переработан в общий каталог историй вместо витрины одного активного диалога;
- на главной одновременно показаны доступные истории, их состояние, общий прогресс по финалам и решениям;
- добавлена отдельная мобильная навигация «Главная / Home»;
- добавлен двуязычный анонс нового диалога «Любовь / Lyubov» со статусом «Появится скоро / Coming soon»;
- исправлены относительные пути ресурсов для стабильной загрузки из вложенного каталога Yandex Games;
- интерфейс проверен в русской и английской локализациях на desktop и mobile.

## 0.3.2 — Yandex subpath asset hotfix

- исправлены относительные пути аватаров и photo-message Леры для вложенного каталога draft/release на сервере Яндекс Игр;
- устранён аварийный экран `Critical asset could not be loaded` после успешной инициализации SDK;
- сохранена совместимость локального preview и Yandex Games archive hosting.

## 0.3.1 — Yandex SDK hotfix

- исправлено чтение типа устройства через актуальный объект `ysdk.deviceInfo.type`;
- устранён аварийный экран после успешной инициализации SDK в draft/debug-режиме Яндекс Игр;
- тестовый SDK mock приведён в соответствие с актуальным контрактом платформы.

## 0.3.0 — After Midnight

- реальный взвешенный LoadingManager без таймера-имитации;
- Age Gate 18+ и версионированное юридическое согласие;
- migration save v2 → v3 без потери Camila progress, settings или endings;
- автоматический validator возраста персонажей и adult asset manifest;
- единый ad-safe sticky layout для portrait, landscape, desktop и TV;
- отдельные реальные RU/EN promo screenshots;
- второй полноценный диалог «После полуночи / After Midnight» с Лерой (24);
- 26 nodes, 56 choices, 19 hints, 7 endings, включая secret и blocked;
- 2 заранее созданных photo-message с единым identity reference, lazy preload, локализованным alt и retry fallback;
- новые тесты loading, legal consent, migration, viewport matrix, promo guard, Lera graph/endings/photos и dynamic language.

## 0.2.0

Рабочая Yandex Games база: DialogueEngine, save v2, динамический RU/EN transcript, Player Data, fullscreen/rewarded/sticky API, Gameplay/Loading API, desktop/mobile/tablet/TV и архив концовок.

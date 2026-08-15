export type UiLanguage = 'ru' | 'en';

const ui = {
  ru: {
    gameTitle: 'Между строк', gameSubtitle: 'Сюжетный мессенджер', continue: 'Продолжить', dialogues: 'Диалоги', endings: 'Концовки',
    settings: 'Настройки', about: 'Об игре', online: 'была недавно', newStory: 'Новая история', continueStory: 'Продолжить', completed: 'Завершено',
    storyLabel: 'ИСТОРИЯ 01', storyTitle: 'Квартира 47', storyTeaser: 'Один ключ. Пустая квартира. Ваше имя на стене.',
    storyMeta: 'Камила, 31 · психологический триллер', begin: 'Начать переписку', typing: 'Камила печатает', replyHint: 'Выберите сообщение',
    messageNormal: 'Обычная', messageFast: 'Быстрая', messageSpeed: 'Скорость сообщений', sound: 'Звук', soundVolume: 'Громкость звука',
    music: 'Музыка', musicVolume: 'Громкость музыки', vibration: 'Вибрация', animations: 'Уменьшить анимации', language: 'Язык',
    automatic: 'Автоматически', russian: 'Русский', english: 'English', appearance: 'Внешний вид', messages: 'Сообщения', audio: 'Аудио',
    allEndings: 'Архив концовок', endingsFound: 'Найдено', hiddenEnding: 'Неизвестная концовка', replay: 'Начать историю заново',
    restartTitle: 'Начать сначала?', restartBody: 'Прогресс только этой истории будет удалён. Другие истории и открытые концовки сохранятся.',
    cancel: 'Отмена', restart: 'Начать заново', blockedTitle: 'Вас добавили в чёрный список', storyComplete: 'История завершена',
    endingOf: 'Концовка', of: 'из', hint: 'Намёк на выбор', watchAd: 'Посмотреть рекламу', hintUnavailable: 'Реклама сейчас недоступна',
    hintWarm: 'Этот ответ звучит тепло.', hintBold: 'Этот ответ звучит уверенно.', hintCareful: 'Этот ответ обозначает границы.',
    hintWitty: 'Этот ответ разряжает напряжение.', hintRisky: 'Этот ответ может открыть редкую ветку.',
    aboutTitle: 'Истории живут между строк', aboutText: 'Все ответы заранее написаны, а выборы меняют доверие, подозрение и память персонажей. В игре нет генеративного ИИ и свободного текстового ввода.',
    privacyText: 'Прогресс гостя хранится на устройстве. Авторизованным игрокам доступно облачное сохранение Yandex Games.',
    ageNotice: 'Все персонажи романтических историй — совершеннолетние. Камила — 31 год.',
    back: 'Назад', locked: 'Скоро', statusNew: 'новая история', unread: 'непрочитанных', noMessages: 'Вы начинаете этот разговор.',
    earlier: 'Более ранние сообщения скрыты для производительности', chapter: 'Глава', theme: 'Тема', midnight: 'Полночь', violet: 'Фиолетовый туман',
    themeReward: 'Открыть тему за рекламу', themeUnlocked: 'Тема открыта', adNote: 'Основная история всегда доступна без рекламы.',
  },
  en: {
    gameTitle: 'Between the Lines', gameSubtitle: 'Interactive story messenger', continue: 'Continue', dialogues: 'Chats', endings: 'Endings',
    settings: 'Settings', about: 'About', online: 'seen recently', newStory: 'New story', continueStory: 'Continue', completed: 'Complete',
    storyLabel: 'STORY 01', storyTitle: 'Apartment 47', storyTeaser: 'One key. An empty apartment. Your name on the wall.',
    storyMeta: 'Camila, 31 · psychological thriller', begin: 'Start conversation', typing: 'Camila is typing', replyHint: 'Choose a message',
    messageNormal: 'Normal', messageFast: 'Fast', messageSpeed: 'Message speed', sound: 'Sound', soundVolume: 'Sound volume',
    music: 'Music', musicVolume: 'Music volume', vibration: 'Vibration', animations: 'Reduce motion', language: 'Language',
    automatic: 'Automatic', russian: 'Русский', english: 'English', appearance: 'Appearance', messages: 'Messages', audio: 'Audio',
    allEndings: 'Ending archive', endingsFound: 'Found', hiddenEnding: 'Unknown ending', replay: 'Restart story',
    restartTitle: 'Start over?', restartBody: 'Only this story’s progress will be deleted. Other stories and unlocked endings stay.',
    cancel: 'Cancel', restart: 'Restart', blockedTitle: 'You have been blocked', storyComplete: 'Story complete',
    endingOf: 'Ending', of: 'of', hint: 'Choice hint', watchAd: 'Watch ad', hintUnavailable: 'Ad is unavailable right now',
    hintWarm: 'This answer sounds warm.', hintBold: 'This answer sounds confident.', hintCareful: 'This answer sets a boundary.',
    hintWitty: 'This answer eases the tension.', hintRisky: 'This answer may open a rare route.',
    aboutTitle: 'Stories live between the lines', aboutText: 'Every reply is authored in advance. Your choices change trust, suspicion, and character memory. There is no generative AI or free-text input.',
    privacyText: 'Guest progress stays on this device. Authorized players can use Yandex Games cloud saves.',
    ageNotice: 'Every character in a romantic story is an adult. Camila is 31.',
    back: 'Back', locked: 'Soon', statusNew: 'new story', unread: 'unread', noMessages: 'You begin this conversation.',
    earlier: 'Earlier messages hidden for performance', chapter: 'Chapter', theme: 'Theme', midnight: 'Midnight', violet: 'Violet haze',
    themeReward: 'Unlock theme with ad', themeUnlocked: 'Theme unlocked', adNote: 'The main story is always available without ads.',
  },
} as const;

export type UiStrings = (typeof ui)['ru'] | (typeof ui)['en'];
export const getUi = (language: UiLanguage): UiStrings => ui[language];

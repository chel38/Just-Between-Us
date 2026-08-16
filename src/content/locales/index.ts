import type { LanguageSetting } from '../../types/save';

export type UiLanguage = 'ru' | 'en';

const ru = {
  gameTitle: 'Только между нами', gameSubtitle: 'Сюжетный мессенджер', continue: 'Продолжить', dialogues: 'Диалоги', endings: 'Концовки',
  settings: 'Настройки', about: 'Об игре', online: 'была недавно', newStory: 'Новая история', continueStory: 'Продолжить', completed: 'Завершено',
  storyLabel: 'ИСТОРИЯ 01', storyTitle: 'Квартира 47', storyTeaser: 'Один ключ. Пустая квартира. Ваше имя на стене.',
  storyMeta: 'Камила, 31 · психологический триллер', begin: 'Начать переписку', typing: 'печатает…', replyHint: 'Выберите сообщение',
  messageNormal: 'Обычная', messageFast: 'Быстрая', messageSpeed: 'Скорость сообщений', sound: 'Звук', soundVolume: 'Громкость звука',
  music: 'Музыка', musicVolume: 'Громкость музыки', vibration: 'Вибрация', animations: 'Уменьшить анимации', language: 'Язык',
  automatic: 'Автоматически', russian: 'Русский', english: 'English', appearance: 'Внешний вид', messages: 'Сообщения', audio: 'Аудио',
  allEndings: 'Архив концовок', endingsFound: 'Найдено', hiddenEnding: 'Неизвестная концовка', replay: 'Начать историю заново',
  restartTitle: 'Начать сначала?', restartBody: 'Прогресс только этой истории будет удалён. Другие истории и открытые концовки сохранятся.',
  cancel: 'Отмена', restart: 'Начать заново', blockedTitle: 'Вас добавили в чёрный список', storyComplete: 'История завершена',
  endingOf: 'Концовка', of: 'из', hint: '▶ Реклама → получить намёк', hintUnavailable: 'Реклама сейчас недоступна',
  aboutTitle: 'Только между нами', aboutText: 'Интерактивная сюжетная игра в формате мессенджера.',
  ageNotice: 'Все персонажи и изображённые лица в игре являются совершеннолетними (18+). Камила — 31 год, Лера — 24 года. Персонажи, события и переписки являются вымышленными.', version: 'Версия',
  back: 'Назад', statusNew: 'новая история', unread: 'непрочитанных', noMessages: 'Вы начинаете этот разговор.',
  earlier: 'Более ранние сообщения скрыты для производительности', chapter: 'Глава', theme: 'Тема', midnight: 'Полночь', violet: 'Фиолетовый туман',
  themeReward: 'Открыть тему за рекламу', themeUnlocked: 'Тема открыта', adNote: 'Основная история всегда доступна без рекламы.',
  today: 'Сегодня', unknownEndingsDescription: 'Неоткрытые финалы остаются тайной.', chooseStory: 'Выберите историю',
  opened: 'Открыто', openingApproaches: 'стартовых подходов', endingsCount: 'концовок', choicesRemembered: 'решения запоминаются',
  menu: 'Меню', exitTitle: 'Выйти из игры?', exitBody: 'Ваш прогресс сохранён. Вы сможете продолжить позже.', exit: 'Выйти',
  loading: 'Загрузка', loadingError: 'Не удалось подключиться к платформе. Проверьте соединение и попробуйте снова.', retry: 'Повторить',
  loadingPlatform: 'Подготовка платформы', loadingSdk: 'Подключение SDK', loadingLanguage: 'Определение языка', loadingPlayer: 'Загрузка игрока',
  loadingSave: 'Загрузка прогресса', loadingMigration: 'Обновление сохранения', loadingLocalization: 'Подготовка перевода',
  loadingDialogues: 'Проверка историй', loadingCriticalAssets: 'Загрузка интерфейса', loadingApp: 'Запуск приложения', loadingReady: 'Готово',
  stickyStatus: 'Sticky status', fullscreen: 'Полный экран', getHint: 'Получить намёк', photoLoadError: 'Фото не загрузилось', photoRetry: 'Повторить',
};

type UiSchema = { [Key in keyof typeof ru]: string };

const en: UiSchema = {
  gameTitle: 'Just Between Us', gameSubtitle: 'Interactive story messenger', continue: 'Continue', dialogues: 'Chats', endings: 'Endings',
  settings: 'Settings', about: 'About', online: 'seen recently', newStory: 'New story', continueStory: 'Continue', completed: 'Complete',
  storyLabel: 'STORY 01', storyTitle: 'Apartment 47', storyTeaser: 'One key. An empty apartment. Your name on the wall.',
  storyMeta: 'Camila, 31 · psychological thriller', begin: 'Start conversation', typing: 'is typing…', replyHint: 'Choose a message',
  messageNormal: 'Normal', messageFast: 'Fast', messageSpeed: 'Message speed', sound: 'Sound', soundVolume: 'Sound volume',
  music: 'Music', musicVolume: 'Music volume', vibration: 'Vibration', animations: 'Reduce motion', language: 'Language',
  automatic: 'Automatic', russian: 'Русский', english: 'English', appearance: 'Appearance', messages: 'Messages', audio: 'Audio',
  allEndings: 'Ending archive', endingsFound: 'Found', hiddenEnding: 'Unknown ending', replay: 'Restart story',
  restartTitle: 'Start over?', restartBody: 'Only this story’s progress will be deleted. Other stories and unlocked endings stay.',
  cancel: 'Cancel', restart: 'Restart', blockedTitle: 'You have been blocked', storyComplete: 'Story complete',
  endingOf: 'Ending', of: 'of', hint: '▶ Ad → get a hint', hintUnavailable: 'Ad is unavailable right now',
  aboutTitle: 'Just Between Us', aboutText: 'An interactive story game presented as a messenger.',
  ageNotice: 'All characters and persons depicted in the game are adults (18+). Camila is 31 and Lera is 24. The characters, events, and conversations are fictional.', version: 'Version',
  back: 'Back', statusNew: 'new story', unread: 'unread', noMessages: 'You begin this conversation.',
  earlier: 'Earlier messages hidden for performance', chapter: 'Chapter', theme: 'Theme', midnight: 'Midnight', violet: 'Violet haze',
  themeReward: 'Unlock theme with ad', themeUnlocked: 'Theme unlocked', adNote: 'The main story is always available without ads.',
  today: 'Today', unknownEndingsDescription: 'Unknown endings stay hidden.', chooseStory: 'Choose a story',
  opened: 'Unlocked', openingApproaches: 'opening approaches', endingsCount: 'endings', choicesRemembered: 'choices are remembered',
  menu: 'Menu', exitTitle: 'Exit the game?', exitBody: 'Your progress is saved. You can continue later.', exit: 'Exit',
  loading: 'Loading', loadingError: 'Could not connect to the platform. Check your connection and try again.', retry: 'Retry',
  loadingPlatform: 'Preparing platform', loadingSdk: 'Connecting SDK', loadingLanguage: 'Detecting language', loadingPlayer: 'Loading player',
  loadingSave: 'Loading progress', loadingMigration: 'Updating save', loadingLocalization: 'Preparing language',
  loadingDialogues: 'Validating stories', loadingCriticalAssets: 'Loading interface', loadingApp: 'Starting application', loadingReady: 'Ready',
  stickyStatus: 'Sticky status', fullscreen: 'Fullscreen', getHint: 'Get a hint', photoLoadError: 'Photo could not load', photoRetry: 'Retry',
};

const ui: Record<UiLanguage, UiSchema> = { ru, en };

export type UiStrings = UiSchema;
export const getUi = (language: UiLanguage): UiStrings => ui[language];

const russianPortalLanguages = new Set(['ru', 'be', 'kk', 'uk', 'uz']);

export function resolveUiLanguage(setting: LanguageSetting, portalLanguage?: string): UiLanguage {
  if (setting === 'ru' || setting === 'en') return setting;
  const normalized = portalLanguage?.trim().toLowerCase().split(/[-_]/)[0] ?? '';
  return russianPortalLanguages.has(normalized) ? 'ru' : 'en';
}

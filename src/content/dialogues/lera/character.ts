import type { Character, Ending } from '../../../types/dialogue';

export const leraCharacters: Record<'ru' | 'en', Character> = {
  ru: {
    id: 'lera', name: 'Лера', age: 24, role: 'девушка из галереи', status: 'дома, в сети после полуночи', accent: 'уверенная, игривая',
    avatar: './assets/characters/lera/avatar.webp', avatarLarge: './assets/characters/lera/avatar-large.webp',
    summary: 'Уверенная 24-летняя девушка: любит проверять реакцию, скрывает уязвимость за иронией и особенно ценит честность и уважение к границам.',
    writingProfile: { capitalization: 'mixed', emojiFrequency: 'medium', doubleMessageFrequency: 'high', punctuationStyle: 'casual', averageMessageLength: 'mixed', typoFrequency: 'rare' },
  },
  en: {
    id: 'lera', name: 'Lera', age: 24, role: 'the woman from the gallery', status: 'home, online after midnight', accent: 'confident, playful',
    avatar: './assets/characters/lera/avatar.webp', avatarLarge: './assets/characters/lera/avatar-large.webp',
    summary: 'A confident 24-year-old woman who tests reactions, hides vulnerability behind irony, and cares deeply about honesty and boundaries.',
    writingProfile: { capitalization: 'mixed', emojiFrequency: 'medium', doubleMessageFrequency: 'high', punctuationStyle: 'casual', averageMessageLength: 'mixed', typoFrequency: 'rare' },
  },
};

export const leraEndings: Record<'ru' | 'en', Ending[]> = {
  ru: [
    { id: 'lera_good_open', title: 'Без масок', description: 'Игра закончилась честным разговором. Утром вы продолжите уже без проверок.', type: 'good', number: 1 },
    { id: 'lera_good_date', title: 'Кофе после полуночи', description: 'Лера принимает приглашение. Флирт получает реальный адрес и время.', type: 'good', number: 2 },
    { id: 'lera_neutral_morning', title: 'До завтра', description: 'Вы сохраняете интригу и откладываете решение до утра.', type: 'neutral', number: 3 },
    { id: 'lera_neutral_distance', title: 'Красивый эпизод', description: 'Переписка остаётся яркой ночью без обещаний продолжения.', type: 'neutral', number: 4 },
    { id: 'lera_bad_cold', title: 'Проверка не пройдена', description: 'Недоверие и давление гасят интерес Леры.', type: 'bad', number: 5 },
    { id: 'lera_bad_blocked', title: 'Чёрный список', description: 'После повторного нарушения границ Лера блокирует контакт.', type: 'bad', number: 6, blocked: true },
    { id: 'lera_secret_known', title: 'Я тебя помню', description: 'Вы первым собираете детали той встречи. Лера признаётся, что узнала вас сразу.', type: 'secret', number: 7 },
  ],
  en: [
    { id: 'lera_good_open', title: 'No Masks', description: 'The game ends in an honest conversation. In the morning, you will continue without tests.', type: 'good', number: 1 },
    { id: 'lera_good_date', title: 'Coffee After Midnight', description: 'Lera accepts the invitation. The flirting gets a real place and time.', type: 'good', number: 2 },
    { id: 'lera_neutral_morning', title: 'Until Tomorrow', description: 'You keep the intrigue and leave the decision until morning.', type: 'neutral', number: 3 },
    { id: 'lera_neutral_distance', title: 'A Beautiful Episode', description: 'The chat remains one vivid night with no promise of a sequel.', type: 'neutral', number: 4 },
    { id: 'lera_bad_cold', title: 'Test Failed', description: 'Distrust and pressure extinguish Lera’s interest.', type: 'bad', number: 5 },
    { id: 'lera_bad_blocked', title: 'Blocked', description: 'After repeated boundary violations, Lera blocks the contact.', type: 'bad', number: 6, blocked: true },
    { id: 'lera_secret_known', title: 'I Remember You', description: 'You connect the details of that meeting first. Lera admits she recognized you immediately.', type: 'secret', number: 7 },
  ],
};

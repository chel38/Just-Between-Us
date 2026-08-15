import type { Character, Ending } from '../../../types/dialogue';

export const camilaCharacters: Record<'ru' | 'en', Character> = {
  ru: {
    id: 'camila',
    name: 'Камила',
    age: 31,
    role: 'соседка, архитектор-реставратор',
    status: 'была недавно',
    accent: '#c8a8ff',
    avatar: './assets/characters/camila/avatar.webp',
    avatarLarge: './assets/characters/camila/avatar-large.webp',
    summary: 'Замечает детали, не любит голосовые и шутит, когда ей страшно.',
    writingProfile: {
      capitalization: 'mixed',
      emojiFrequency: 'medium',
      doubleMessageFrequency: 'medium',
      punctuationStyle: 'casual',
      averageMessageLength: 'short',
      typoFrequency: 'rare',
    },
  },
  en: {
    id: 'camila',
    name: 'Camila',
    age: 31,
    role: 'neighbor, restoration architect',
    status: 'seen recently',
    accent: '#c8a8ff',
    avatar: './assets/characters/camila/avatar.webp',
    avatarLarge: './assets/characters/camila/avatar-large.webp',
    summary: 'Notices details, hates voice notes, and jokes when she is scared.',
    writingProfile: {
      capitalization: 'mixed',
      emojiFrequency: 'medium',
      doubleMessageFrequency: 'medium',
      punctuationStyle: 'casual',
      averageMessageLength: 'short',
      typoFrequency: 'rare',
    },
  },
};

export const camilaEndings: Record<'ru' | 'en', Ending[]> = {
  ru: [
    { id: 'good_dawn', title: 'До рассвета', description: 'Правда вышла наружу, а вы остались по одну сторону двери.', type: 'good', number: 1 },
    { id: 'good_equal', title: 'Без чужих сценариев', description: 'Вы начали заново — теперь без проверок и спрятанных ключей.', type: 'good', number: 2 },
    { id: 'neutral_archive', title: 'Тихий архив', description: 'Улика сохранилась. Переписка — нет.', type: 'neutral', number: 3 },
    { id: 'neutral_truth', title: 'Честный конец', description: 'Вы сказали друг другу правду слишком поздно, но всё-таки сказали.', type: 'neutral', number: 4 },
    { id: 'bad_erased', title: 'Стёртая переписка', description: 'К утру квартира была пуста, а ваши сообщения исчезли.', type: 'bad', number: 5 },
    { id: 'bad_blocked', title: 'Чёрный список', description: 'Камила решила, что ещё один риск ей не нужен.', type: 'bad', number: 6, blocked: true },
    { id: 'secret_0714', title: '07:14', description: 'Одно несовпадение во времени привело к человеку, которого считали пропавшим.', type: 'secret', number: 7 },
  ],
  en: [
    { id: 'good_dawn', title: 'Before Dawn', description: 'The truth came out, and you stayed on the same side of the door.', type: 'good', number: 1 },
    { id: 'good_equal', title: 'No More Scripts', description: 'You started over — without tests or hidden keys this time.', type: 'good', number: 2 },
    { id: 'neutral_archive', title: 'The Quiet Archive', description: 'The evidence survived. The conversation did not.', type: 'neutral', number: 3 },
    { id: 'neutral_truth', title: 'An Honest Ending', description: 'You told each other the truth too late, but you told it.', type: 'neutral', number: 4 },
    { id: 'bad_erased', title: 'Deleted Chat', description: 'By morning the apartment was empty and your messages were gone.', type: 'bad', number: 5 },
    { id: 'bad_blocked', title: 'Blocked', description: 'Camila decided she did not need one more risk.', type: 'bad', number: 6, blocked: true },
    { id: 'secret_0714', title: '07:14', description: 'One wrong timestamp led to someone everyone thought was gone.', type: 'secret', number: 7 },
  ],
};

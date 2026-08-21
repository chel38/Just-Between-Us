import type { Character, Ending } from '../../../types/dialogue';

export const lubovCharacters: Record<'ru' | 'en', Character> = {
  ru: {
    id: 'lubov',
    name: 'Любовь',
    age: 31,
    role: 'жена игрока',
    status: 'у Кати, в сети',
    accent: 'сдержанная, защитная, честная только после давления фактами',
    avatar: './assets/characters/lubov/avatar.png',
    avatarLarge: './assets/characters/lubov/avatar-large.png',
    summary: 'Ваша жена. Один далёкий кадр у отеля за вечер превращает шесть лет брака в цепочку вопросов, признаний и решений.',
    writingProfile: { capitalization: 'mixed', emojiFrequency: 'none', doubleMessageFrequency: 'high', punctuationStyle: 'casual', averageMessageLength: 'mixed', typoFrequency: 'rare' },
  },
  en: {
    id: 'lubov',
    name: 'Lyubov',
    age: 31,
    role: 'the player’s wife',
    status: 'at Katya’s, online',
    accent: 'controlled, defensive, honest only after facts close in',
    avatar: './assets/characters/lubov/avatar.png',
    avatarLarge: './assets/characters/lubov/avatar-large.png',
    summary: 'Your wife. One distant photo outside a hotel turns six years of marriage into a night of questions, admissions, and decisions.',
    writingProfile: { capitalization: 'mixed', emojiFrequency: 'none', doubleMessageFrequency: 'high', punctuationStyle: 'casual', averageMessageLength: 'mixed', typoFrequency: 'rare' },
  },
};

export const lubovEndings: Record<'ru' | 'en', Ending[]> = {
  ru: [
    { id: 'lubov_end_period', title: 'Точка', description: 'Вы закончили брак холодно и окончательно. Кольцо осталось рядом с ключами.', type: 'neutral', number: 1 },
    { id: 'lubov_end_war', title: 'Война', description: 'Разговор закончился адвокатами, имуществом и обещанием больше не уступать ни сантиметра.', type: 'bad', number: 2 },
    { id: 'lubov_end_blocked', title: 'Заблокировано', description: 'После повторных унижений Любовь прекращает переписку. Ответов больше не будет.', type: 'bad', number: 3, blocked: true },
    { id: 'lubov_end_separate', title: 'Поживём отдельно', description: 'Любовь остаётся у Кати. Вы договорились не решать судьбу восьми лет за одну ночь.', type: 'neutral', number: 4 },
    { id: 'lubov_end_honest_divorce', title: 'Честный развод', description: 'Брак окончен, но вы сохранили достаточно уважения, чтобы не превращать раздел жизни в месть.', type: 'good', number: 5 },
    { id: 'lubov_end_try_again', title: 'Попробуем', description: 'Контакт с Артёмом прекращён. Вы не простили — вы только согласились проверить, можно ли построить доверие заново.', type: 'good', number: 6 },
    { id: 'lubov_end_without_trust', title: 'Вместе без доверия', description: 'Вы остались из-за квартиры, денег и страха перемен. Между вами теперь живёт проверка.', type: 'bad', number: 7 },
    { id: 'lubov_end_whole_truth', title: 'Вся правда', description: 'Ни одна дата и ни одно сообщение больше не спрятаны. Правда не спасла брак, но вернула вам право решать осознанно.', type: 'secret', number: 8 },
    { id: 'lubov_end_chooses_him', title: 'Она выбирает его', description: 'Любовь отказалась обещать, что прекратит связь. В этой ночи закончился не только разговор.', type: 'bad', number: 9 },
  ],
  en: [
    { id: 'lubov_end_period', title: 'Full Stop', description: 'You ended the marriage quietly and finally. The ring stayed beside the keys.', type: 'neutral', number: 1 },
    { id: 'lubov_end_war', title: 'War', description: 'The conversation ended with lawyers, property, and a promise that neither side would yield an inch.', type: 'bad', number: 2 },
    { id: 'lubov_end_blocked', title: 'Blocked', description: 'After repeated humiliation, Lyubov ends the chat. There will be no more answers.', type: 'bad', number: 3, blocked: true },
    { id: 'lubov_end_separate', title: 'Living Apart', description: 'Lyubov stays at Katya’s. You agree not to decide the fate of eight years in one night.', type: 'neutral', number: 4 },
    { id: 'lubov_end_honest_divorce', title: 'An Honest Divorce', description: 'The marriage is over, but you preserve enough respect not to turn dividing a life into revenge.', type: 'good', number: 5 },
    { id: 'lubov_end_try_again', title: 'We’ll Try', description: 'Contact with Artyom is over. You have not forgiven her—you have only agreed to see whether trust can be rebuilt.', type: 'good', number: 6 },
    { id: 'lubov_end_without_trust', title: 'Together Without Trust', description: 'You stay for the apartment, money, and fear of change. Suspicion now lives between you.', type: 'bad', number: 7 },
    { id: 'lubov_end_whole_truth', title: 'The Whole Truth', description: 'No date and no message remains hidden. The truth did not save the marriage, but it returned your right to choose knowingly.', type: 'secret', number: 8 },
    { id: 'lubov_end_chooses_him', title: 'She Chooses Him', description: 'Lyubov refuses to promise she will end the affair. More than the chat ends tonight.', type: 'bad', number: 9 },
  ],
};

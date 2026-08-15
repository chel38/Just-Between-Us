import type { Character } from '../../../types/dialogue';

// Unique character identifier / Уникальный идентификатор персонажа.
export const templateCharacter: Character = {
  id: 'replace_me',
  name: 'Replace me',
  age: 25, // Explicitly 18+ / Явно укажите совершеннолетний возраст.
  role: 'character role',
  status: 'seen recently',
  accent: '#a98bd8',
  avatar: './assets/characters/replace_me/avatar.webp',
  avatarLarge: './assets/characters/replace_me/avatar-large.webp',
  summary: 'One sentence about voice, goal, and tension.',
  writingProfile: {
    capitalization: 'standard',
    emojiFrequency: 'low',
    doubleMessageFrequency: 'medium',
    punctuationStyle: 'casual',
    averageMessageLength: 'mixed',
    typoFrequency: 'rare',
  },
};

import type { DialogueNode } from '../../../types/dialogue';

// Keep IDs stable across every localization / ID одинаковы во всех локализациях.
export const templateNodes: DialogueNode[] = [
  {
    id: 'start',
    chapter: 1,
    messages: [], // The player always writes first / Игрок всегда пишет первым.
    choices: [
      // Add exactly five meaningful choices with five different destinations.
      // Добавьте ровно пять содержательных вариантов с разными переходами.
    ],
  },
];

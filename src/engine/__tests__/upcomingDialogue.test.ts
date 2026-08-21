import { describe, expect, it } from 'vitest';
import { getDialogues } from '../../content/dialogues';
import { getUpcomingDialogues } from '../../content/dialogues/upcoming';

describe('upcoming dialogue announcements', () => {
  it('removes Lyubov from coming soon after registering the complete story', () => {
    expect(getUpcomingDialogues('ru')).toEqual([]);
    expect(getUpcomingDialogues('en')).toEqual([]);
    expect(getDialogues('ru').some((dialogue) => dialogue.id === 'lubov')).toBe(true);
  });
});

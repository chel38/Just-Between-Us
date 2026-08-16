import { describe, expect, it } from 'vitest';
import { getDialogues } from '../../content/dialogues';
import { getUpcomingDialogues } from '../../content/dialogues/upcoming';

describe('upcoming dialogue announcements', () => {
  it('announces Lyubov in both supported languages', () => {
    expect(getUpcomingDialogues('ru')).toEqual([
      expect.objectContaining({ id: 'lyubov', characterName: 'Любовь', status: 'Появится скоро' }),
    ]);
    expect(getUpcomingDialogues('en')).toEqual([
      expect.objectContaining({ id: 'lyubov', characterName: 'Lyubov', status: 'Coming soon' }),
    ]);
  });

  it('does not register the unfinished announcement as a playable story', () => {
    expect(getDialogues('ru').some((dialogue) => dialogue.id === 'lyubov')).toBe(false);
  });
});

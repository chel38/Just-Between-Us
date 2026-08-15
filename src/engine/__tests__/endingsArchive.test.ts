import { describe, expect, it } from 'vitest';
import { getCamilaDialogue } from '../../content/dialogues/camila';
import { getEndingArchiveEntries } from '../../pages/EndingsPage';

describe('ending archive separation', () => {
  it('keeps unlocked endings scoped to their dialogue', () => {
    const first = { ...getCamilaDialogue('en'), id: 'story-a', endings: getCamilaDialogue('en').endings.slice(0, 2) };
    const second = { ...getCamilaDialogue('en'), id: 'story-b', endings: getCamilaDialogue('en').endings.slice(2, 4) };
    const entries = getEndingArchiveEntries([first, second], {
      'story-a': [first.endings[0].id, second.endings[0].id],
      'story-b': [second.endings[1].id, first.endings[1].id],
    });
    expect(entries[0].unlocked).toEqual([first.endings[0].id]);
    expect(entries[1].unlocked).toEqual([second.endings[1].id]);
  });
});

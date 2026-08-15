import { describe, expect, it } from 'vitest';
import { migrateSave } from '../saves/migrations';

describe('save migrations', () => {
  it('recovers an empty or partial save safely', () => {
    const fresh = migrateSave(null);
    expect(fresh.saveVersion).toBe(1);
    expect(fresh.settings.messageSpeed).toBe('normal');

    const partial = migrateSave({ saveVersion: 1, settings: { messageSpeed: 'fast' } } as never);
    expect(partial.settings.messageSpeed).toBe('fast');
    expect(partial.settings.soundEnabled).toBe(true);
    expect(partial.dialogs).toEqual({});
  });
});

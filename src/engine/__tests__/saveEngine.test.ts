import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PlatformService } from '../../platform/platform';
import { CURRENT_SAVE_VERSION, type GameSave } from '../../types/save';
import { migrateSave } from '../saves/migrations';
import { LEGACY_STORAGE_KEY, SaveEngine, STORAGE_KEY } from '../saves/saveEngine';

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  setItem(key: string, value: string): void { this.values.set(key, value); }
  removeItem(key: string): void { this.values.delete(key); }
  clear(): void { this.values.clear(); }
}

const storage = new MemoryStorage();

function platformMock(cloud: GameSave | null = null) {
  const saveCloud = vi.fn(async () => undefined);
  const platform: PlatformService = {
    kind: 'development', language: 'ru', authorized: Boolean(cloud), deviceType: 'desktop', isTV: false,
    loadCloudSave: async () => cloud, saveCloud, ready: async () => undefined,
    gameplayStart: () => undefined, gameplayStop: () => undefined,
    showFullscreenAd: async () => false, showRewardedAd: async () => false,
    getStickyBannerStatus: async () => ({ stickyAdvIsShowing: false }),
    showStickyBanner: async () => ({ stickyAdvIsShowing: true }),
    hideStickyBanner: async () => ({ stickyAdvIsShowing: false }),
    requestFullscreen: async () => false, exitFullscreen: async () => false, getFullscreenStatus: () => 'off',
  };
  return { platform, saveCloud };
}

describe('save migrations', () => {
  beforeEach(() => { storage.clear(); vi.stubGlobal('localStorage', storage); });

  it('recovers an empty or partial save safely', () => {
    const fresh = migrateSave(null);
    expect(fresh.saveVersion).toBe(CURRENT_SAVE_VERSION);
    expect(fresh.settings.messageSpeed).toBe('normal');

    const partial = migrateSave({ saveVersion: 1, settings: { messageSpeed: 'fast' } } as never);
    expect(partial.settings.messageSpeed).toBe('fast');
    expect(partial.settings.soundEnabled).toBe(true);
    expect(partial.dialogs).toEqual({});
  });

  it('migrates legacy transcript text and restores player choice source IDs', () => {
    const migrated = migrateSave({
      saveVersion: 1,
      dialogs: { camila: {
        dialogueId: 'camila', status: 'active', currentNodeId: 'warm_1', relationship: { trust: 0, attraction: 0, suspicion: 0, irritation: 0, curiosity: 0, respect: 0 },
        flags: [], choiceHistory: ['start_warm'], seenNodes: ['start', 'warm_1'], endingsUnlocked: [], awaitingChoice: false,
        processedMessageIds: ['warm_1_a'], startedAt: 1, updatedAt: 2, unread: 0,
        history: [
          { id: 'p1', sender: 'player', text: 'legacy choice', kind: 'message', timestamp: 1 },
          { id: 's1', scriptMessageId: 'warm_1_a', sender: 'character', text: 'legacy reply', kind: 'message', timestamp: 2 },
        ],
      } },
      settings: undefined, endings: {}, globalFlags: [], lastOpenedDialog: 'camila', updatedAt: 2,
    } as never);
    expect(migrated.dialogs.camila.history[0]).toMatchObject({ sourceType: 'player-choice', sourceId: 'start_warm', fallbackText: 'legacy choice' });
    expect(migrated.dialogs.camila.history[1]).toMatchObject({ sourceType: 'script-message', sourceId: 'warm_1_a', fallbackText: 'legacy reply' });
    expect(migrated.dialogs.camila.revealedHints).toEqual({});
  });

  it('reads the old local key, keeps it, and writes the v2 key', async () => {
    storage.setItem(LEGACY_STORAGE_KEY, JSON.stringify({ saveVersion: 1, dialogs: {}, endings: {}, globalFlags: [], lastOpenedDialog: null, updatedAt: 10 }));
    const { platform } = platformMock();
    const loaded = await new SaveEngine(platform).load();
    expect(loaded.saveVersion).toBe(2);
    expect(storage.getItem(STORAGE_KEY)).not.toBeNull();
    expect(storage.getItem(LEGACY_STORAGE_KEY)).not.toBeNull();
  });

  it('rewrites a legacy cloud payload through the new cloud provider key path', async () => {
    const legacyCloud = migrateSave({ saveVersion: 1, dialogs: {}, endings: {}, globalFlags: [], lastOpenedDialog: null, updatedAt: 30 } as never);
    legacyCloud.saveVersion = 1;
    const { platform, saveCloud } = platformMock(legacyCloud);
    const loaded = await new SaveEngine(platform).load();
    expect(loaded.saveVersion).toBe(2);
    expect(saveCloud).toHaveBeenCalledWith(expect.objectContaining({ saveVersion: 2 }), true);
  });
});

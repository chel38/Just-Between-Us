import type { PlatformService } from '../../platform/platform';
import type { GameSave } from '../../types/save';
import { createDefaultSave } from '../../types/save';
import { migrateSave } from './migrations';

export const STORAGE_KEY = 'just-between-us-save-v2';
export const LEGACY_STORAGE_KEY = 'between-lines-save-v1';

const log = (...args: unknown[]) => {
  if (import.meta.env.DEV) console.info('[SaveEngine]', ...args);
};

export class SaveEngine {
  private cloudTimer: number | null = null;
  private latest: GameSave = createDefaultSave();

  constructor(private readonly platform: PlatformService) {}

  async load(): Promise<GameSave> {
    let local: GameSave | null = null;
    let usedLegacyLocal = false;
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      const legacy = current ? null : localStorage.getItem(LEGACY_STORAGE_KEY);
      usedLegacyLocal = !current && Boolean(legacy);
      const serialized = current ?? legacy;
      local = serialized ? migrateSave(JSON.parse(serialized) as GameSave) : null;
    } catch (error) {
      log('Local save could not be read.', error);
    }
    const cloud = await this.platform.loadCloudSave();
    this.latest = migrateSave(
      cloud && (!local || cloud.updatedAt > local.updatedAt) ? cloud : local,
    );
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.latest));
      if (usedLegacyLocal) log('Legacy local save migrated to v2.');
    } catch (error) {
      log('Migrated local save could not be persisted.', error);
    }
    // Yandex Player stores progress for guests as well as authorized users.
    // The platform adapter is a no-op when no Player instance is available.
    try { await this.platform.saveCloud(this.latest, true); }
    catch (error) { log('Cloud v2 migration will retry on the next save.', error); }
    return structuredClone(this.latest);
  }

  save(save: GameSave): void {
    this.latest = { ...save, updatedAt: Date.now() };
    // Dialogue progress is saved immediately after every choice/message so closing
    // the browser can never roll the story back.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.latest));
    } catch (error) {
      log('Local save failed; gameplay continues.', error);
    }
    if (this.cloudTimer) window.clearTimeout(this.cloudTimer);
    this.cloudTimer = window.setTimeout(() => void this.flushCloud(false), 2_000);
  }

  async flushCloud(flush = true): Promise<void> {
    if (this.cloudTimer) window.clearTimeout(this.cloudTimer);
    this.cloudTimer = null;
    try {
      await this.platform.saveCloud(this.latest, flush);
    } catch (error) {
      log('Cloud save failed; local copy is intact.', error);
    }
  }
}

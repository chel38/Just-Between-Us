import type { PlatformService } from '../../platform/platform';
import type { GameSave } from '../../types/save';
import { createDefaultSave } from '../../types/save';
import { migrateSave } from './migrations';

const STORAGE_KEY = 'between-lines-save-v1';

const log = (...args: unknown[]) => {
  if (import.meta.env.DEV) console.info('[SaveEngine]', ...args);
};

export class SaveEngine {
  private cloudTimer: number | null = null;
  private latest: GameSave = createDefaultSave();

  constructor(private readonly platform: PlatformService) {}

  async load(): Promise<GameSave> {
    let local: GameSave | null = null;
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      local = serialized ? migrateSave(JSON.parse(serialized) as GameSave) : null;
    } catch (error) {
      log('Local save could not be read.', error);
    }
    const cloud = await this.platform.loadCloudSave();
    this.latest = migrateSave(
      cloud && (!local || cloud.updatedAt > local.updatedAt) ? cloud : local,
    );
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

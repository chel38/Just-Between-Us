import { describe, expect, it } from 'vitest';
import { LOADING_STAGES, LoadingManager } from '../../services/loadingManager';

describe('LoadingManager', () => {
  it('is monotonic and reaches 100 only after every real stage completes', () => {
    const manager = new LoadingManager();
    const seen: number[] = [];
    manager.subscribe((snapshot) => seen.push(snapshot.progress));
    manager.update('criticalAssets', 0.5);
    manager.begin('dialogues');
    manager.update('criticalAssets', 0.25);
    expect(manager.snapshot.progress).toBeLessThan(100);
    LOADING_STAGES.forEach(({ id }) => manager.complete(id));
    expect(manager.snapshot).toMatchObject({ progress: 100, status: 'ready', stage: 'ready' });
    expect(seen.every((value, index) => index === 0 || value >= seen[index - 1])).toBe(true);
  });

  it('keeps a failed attempt below ready and a fresh retry can complete', () => {
    const failed = new LoadingManager();
    failed.complete('platform');
    failed.fail('sdk', new Error('offline'));
    LOADING_STAGES.forEach(({ id }) => failed.complete(id));
    expect(failed.snapshot.status).toBe('error');
    expect(failed.snapshot.progress).toBeLessThan(100);

    const retry = new LoadingManager();
    LOADING_STAGES.forEach(({ id }) => retry.complete(id));
    expect(retry.snapshot.status).toBe('ready');
  });
});

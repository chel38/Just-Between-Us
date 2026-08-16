export type LoadingStageId =
  | 'platform'
  | 'sdk'
  | 'language'
  | 'player'
  | 'save'
  | 'migration'
  | 'localization'
  | 'dialogues'
  | 'criticalAssets'
  | 'app'
  | 'ready';

export interface LoadingStageDefinition {
  id: LoadingStageId;
  weight: number;
}

export interface LoadingSnapshot {
  progress: number;
  stage: LoadingStageId;
  status: 'loading' | 'ready' | 'error';
  error?: Error;
}

export const LOADING_STAGES: readonly LoadingStageDefinition[] = [
  { id: 'platform', weight: 5 },
  { id: 'sdk', weight: 14 },
  { id: 'language', weight: 5 },
  { id: 'player', weight: 8 },
  { id: 'save', weight: 11 },
  { id: 'migration', weight: 8 },
  { id: 'localization', weight: 7 },
  { id: 'dialogues', weight: 12 },
  { id: 'criticalAssets', weight: 20 },
  { id: 'app', weight: 7 },
  { id: 'ready', weight: 3 },
] as const;

type Listener = (snapshot: LoadingSnapshot) => void;

export class LoadingManager {
  private readonly progressByStage = new Map<LoadingStageId, number>();
  private readonly listeners = new Set<Listener>();
  private snapshotValue: LoadingSnapshot = { progress: 0, stage: 'platform', status: 'loading' };

  constructor() {
    LOADING_STAGES.forEach(({ id }) => this.progressByStage.set(id, 0));
  }

  get snapshot(): LoadingSnapshot { return this.snapshotValue; }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.snapshotValue);
    return () => this.listeners.delete(listener);
  }

  begin(stage: LoadingStageId): void {
    if (this.snapshotValue.status !== 'loading' || this.snapshotValue.stage === stage) return;
    this.snapshotValue = { ...this.snapshotValue, stage };
    this.emit();
  }

  update(stage: LoadingStageId, fraction: number): void {
    if (this.snapshotValue.status !== 'loading') return;
    const normalized = Math.max(0, Math.min(1, fraction));
    const previous = this.progressByStage.get(stage) ?? 0;
    if (normalized <= previous) return;
    this.progressByStage.set(stage, normalized);
    this.publish(stage);
  }

  complete(stage: LoadingStageId): void { this.update(stage, 1); }

  fail(stage: LoadingStageId, error: unknown): void {
    if (this.snapshotValue.status !== 'loading') return;
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    this.snapshotValue = { ...this.snapshotValue, stage, status: 'error', error: normalizedError };
    this.emit();
  }

  private publish(stage: LoadingStageId): void {
    const weighted = LOADING_STAGES.reduce(
      (sum, definition) => sum + definition.weight * (this.progressByStage.get(definition.id) ?? 0),
      0,
    );
    const progress = Math.max(this.snapshotValue.progress, Math.min(100, Math.round(weighted)));
    const ready = LOADING_STAGES.every(({ id }) => (this.progressByStage.get(id) ?? 0) === 1);
    this.snapshotValue = { progress: ready ? 100 : Math.min(99, progress), stage, status: ready ? 'ready' : 'loading' };
    this.emit();
  }

  private emit(): void { this.listeners.forEach((listener) => listener(this.snapshotValue)); }
}

export async function preloadCriticalAssets(
  assets: readonly string[],
  manager: LoadingManager,
  imageFactory: () => HTMLImageElement = () => new Image(),
): Promise<void> {
  if (assets.length === 0) {
    manager.complete('criticalAssets');
    return;
  }
  let completed = 0;
  await Promise.all(assets.map((asset) => new Promise<void>((resolve, reject) => {
    const image = imageFactory();
    image.onload = () => {
      completed += 1;
      manager.update('criticalAssets', completed / assets.length);
      resolve();
    };
    image.onerror = () => reject(new Error(`Critical asset could not be loaded: ${asset}`));
    image.src = asset;
  })));
}

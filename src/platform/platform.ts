import type { GameSave } from '../types/save';

export interface PlatformService {
  readonly kind: 'yandex' | 'development';
  readonly language: string;
  readonly authorized: boolean;
  loadCloudSave(): Promise<GameSave | null>;
  saveCloud(save: GameSave, flush?: boolean): Promise<void>;
  ready(): Promise<void>;
  gameplayStart(): void;
  gameplayStop(): void;
  showFullscreenAd(): Promise<boolean>;
  showRewardedAd(): Promise<boolean>;
}

const log = (...args: unknown[]) => {
  if (import.meta.env.DEV) console.info('[YandexSDK]', ...args);
};

export class DevelopmentPlatform implements PlatformService {
  readonly kind = 'development' as const;
  readonly authorized = false;
  readonly language = navigator.language.slice(0, 2) || 'ru';

  async loadCloudSave(): Promise<GameSave | null> { return null; }
  async saveCloud(): Promise<void> { /* Guest progress is stored locally. */ }
  async ready(): Promise<void> { log('Development Game Ready'); }
  gameplayStart(): void { log('Gameplay started'); }
  gameplayStop(): void { log('Gameplay stopped'); }
  async showFullscreenAd(): Promise<boolean> { log('Fullscreen ad simulated'); return false; }
  async showRewardedAd(): Promise<boolean> { log('Rewarded ad simulated'); return true; }
}

export class YandexPlatform implements PlatformService {
  readonly kind = 'yandex' as const;
  readonly language: string;
  readonly authorized: boolean;

  private constructor(
    private readonly sdk: YandexGamesSdk,
    private readonly player: YandexPlayer | null,
  ) {
    this.language = sdk.environment.i18n?.lang ?? sdk.environment.browser?.lang ?? 'ru';
    this.authorized = player?.isAuthorized() ?? false;
  }

  static async create(): Promise<YandexPlatform> {
    await loadYandexSdk();
    if (!window.YaGames) throw new Error('Yandex Games SDK did not expose YaGames.');
    const sdk = await window.YaGames.init();
    let player: YandexPlayer | null = null;
    try {
      player = await sdk.getPlayer();
    } catch (error) {
      log('Player is unavailable, continuing as guest.', error);
    }
    log('Initialized', { authorized: player?.isAuthorized() ?? false });
    return new YandexPlatform(sdk, player);
  }

  async loadCloudSave(): Promise<GameSave | null> {
    if (!this.player || !this.authorized) return null;
    try {
      const data = await this.player.getData(['betweenLinesSave']);
      return (data.betweenLinesSave as GameSave | undefined) ?? null;
    } catch (error) {
      log('Cloud load failed; local progress remains available.', error);
      return null;
    }
  }

  async saveCloud(save: GameSave, flush = false): Promise<void> {
    if (!this.player || !this.authorized) return;
    await this.player.setData({ betweenLinesSave: save }, flush);
  }

  async ready(): Promise<void> {
    await this.sdk.features.LoadingAPI?.ready();
  }

  gameplayStart(): void { this.sdk.features.GameplayAPI?.start(); }
  gameplayStop(): void { this.sdk.features.GameplayAPI?.stop(); }

  showFullscreenAd(): Promise<boolean> {
    return new Promise((resolve) => {
      let settled = false;
      this.sdk.adv.showFullscreenAdv({
        callbacks: {
          onOpen: () => this.gameplayStop(),
          onClose: (wasShown) => {
            this.gameplayStart();
            if (!settled) { settled = true; resolve(wasShown); }
          },
          onError: (error) => {
            log('Fullscreen ad unavailable.', error);
            this.gameplayStart();
            if (!settled) { settled = true; resolve(false); }
          },
        },
      });
    });
  }

  showRewardedAd(): Promise<boolean> {
    return new Promise((resolve) => {
      let rewarded = false;
      this.sdk.adv.showRewardedVideo({
        callbacks: {
          onOpen: () => this.gameplayStop(),
          onRewarded: () => { rewarded = true; },
          onClose: () => { this.gameplayStart(); resolve(rewarded); },
          onError: (error) => { log('Rewarded ad unavailable.', error); this.gameplayStart(); resolve(false); },
        },
      });
    });
  }
}

let sdkLoadPromise: Promise<void> | null = null;
function loadYandexSdk(): Promise<void> {
  if (window.YaGames) return Promise.resolve();
  if (sdkLoadPromise) return sdkLoadPromise;
  sdkLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    // Relative /sdk.js is required when the game archive is hosted by Yandex Games.
    script.src = '/sdk.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load /sdk.js'));
    document.head.append(script);
    window.setTimeout(() => reject(new Error('Yandex SDK loading timed out.')), 8_000);
  });
  return sdkLoadPromise;
}

export async function createPlatform(): Promise<PlatformService> {
  const isLocalPreview = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const yandexRequested = (!import.meta.env.DEV && !isLocalPreview) || new URLSearchParams(location.search).has('yandex');
  if (yandexRequested) {
    try {
      return await YandexPlatform.create();
    } catch (error) {
      log('Falling back to development adapter.', error);
    }
  }
  return new DevelopmentPlatform();
}

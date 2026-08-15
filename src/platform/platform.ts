import type { GameSave } from '../types/save';

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'tv';
export type Orientation = 'portrait' | 'landscape';
export type RewardedSimulation = 'reward' | 'close' | 'error';
export type StickyBannerReason = 'ADV_IS_NOT_CONNECTED' | 'UNKNOWN';

export interface StickyBannerStatus {
  stickyAdvIsShowing: boolean;
  reason?: StickyBannerReason;
}

export interface PlatformService {
  readonly kind: 'yandex' | 'development';
  readonly language: string;
  readonly authorized: boolean;
  readonly deviceType: DeviceType;
  readonly isTV: boolean;
  loadCloudSave(): Promise<GameSave | null>;
  saveCloud(save: GameSave, flush?: boolean): Promise<void>;
  ready(): Promise<void>;
  gameplayStart(): void;
  gameplayStop(): void;
  showFullscreenAd(): Promise<boolean>;
  showRewardedAd(): Promise<boolean>;
  getStickyBannerStatus(): Promise<StickyBannerStatus>;
  showStickyBanner(): Promise<StickyBannerStatus>;
  hideStickyBanner(): Promise<StickyBannerStatus>;
  requestFullscreen(): Promise<boolean>;
  exitFullscreen(): Promise<boolean>;
  getFullscreenStatus(): 'on' | 'off';
}

const CLOUD_KEY = 'justBetweenUsSave';
const LEGACY_CLOUD_KEY = 'betweenLinesSave';

const log = (...args: unknown[]) => {
  if (import.meta.env.DEV) console.info('[YandexSDK]', ...args);
};

function requestedDevelopmentDevice(): DeviceType {
  const requested = new URLSearchParams(location.search).get('device');
  return requested === 'mobile' || requested === 'tablet' || requested === 'tv' || requested === 'desktop'
    ? requested
    : 'desktop';
}

export class DevelopmentPlatform implements PlatformService {
  readonly kind = 'development' as const;
  readonly authorized = false;
  readonly language = navigator.language.slice(0, 2) || 'ru';
  private currentDeviceType = requestedDevelopmentDevice();
  private stickyVisible = false;
  private rewardedSimulation: RewardedSimulation = 'reward';
  private fullscreen = false;
  readonly debugMetrics = { stickyShowCalls: 0, stickyHideCalls: 0, rewardedCalls: 0 };

  get deviceType(): DeviceType { return this.currentDeviceType; }
  get isTV(): boolean { return this.currentDeviceType === 'tv'; }
  setDeviceType(deviceType: DeviceType): void { this.currentDeviceType = deviceType; log('Mock device', deviceType); }
  setRewardedSimulation(result: RewardedSimulation): void { this.rewardedSimulation = result; log('Mock rewarded result', result); }

  async loadCloudSave(): Promise<GameSave | null> { return null; }
  async saveCloud(): Promise<void> { /* Guest progress is stored locally. */ }
  async ready(): Promise<void> { log('Development Game Ready'); }
  gameplayStart(): void { log('Gameplay started'); }
  gameplayStop(): void { log('Gameplay stopped'); }
  async showFullscreenAd(): Promise<boolean> {
    const restoreSticky = this.stickyVisible;
    this.gameplayStop();
    if (restoreSticky) await this.hideStickyBanner();
    log('Fullscreen ad simulated');
    if (restoreSticky) await this.showStickyBanner();
    this.gameplayStart();
    return false;
  }
  async showRewardedAd(): Promise<boolean> {
    const restoreSticky = this.stickyVisible;
    this.debugMetrics.rewardedCalls += 1;
    this.gameplayStop();
    if (restoreSticky) await this.hideStickyBanner();
    log('Rewarded ad simulated', this.rewardedSimulation);
    const rewarded = this.rewardedSimulation === 'reward';
    if (restoreSticky) await this.showStickyBanner();
    this.gameplayStart();
    return rewarded;
  }
  async getStickyBannerStatus(): Promise<StickyBannerStatus> { return { stickyAdvIsShowing: this.stickyVisible }; }
  async showStickyBanner(): Promise<StickyBannerStatus> {
    if (!this.stickyVisible) {
      this.debugMetrics.stickyShowCalls += 1;
      this.stickyVisible = true;
      if (import.meta.env.DEV) console.info('[StickyBanner]', 'Mock sticky shown');
    }
    return this.getStickyBannerStatus();
  }
  async hideStickyBanner(): Promise<StickyBannerStatus> {
    if (this.stickyVisible) {
      this.debugMetrics.stickyHideCalls += 1;
      this.stickyVisible = false;
      if (import.meta.env.DEV) console.info('[StickyBanner]', 'Mock sticky hidden');
    }
    return this.getStickyBannerStatus();
  }
  async requestFullscreen(): Promise<boolean> { this.fullscreen = true; return true; }
  async exitFullscreen(): Promise<boolean> { this.fullscreen = false; return true; }
  getFullscreenStatus(): 'on' | 'off' { return this.fullscreen ? 'on' : 'off'; }
}

export class YandexPlatform implements PlatformService {
  readonly kind = 'yandex' as const;
  readonly language: string;
  readonly authorized: boolean;
  readonly deviceType: DeviceType;
  private stickyRequested = false;
  private adInFlight = false;

  private constructor(
    private readonly sdk: YandexGamesSdk,
    private readonly player: YandexPlayer | null,
  ) {
    this.language = sdk.environment.i18n?.lang ?? sdk.environment.browser?.lang ?? 'ru';
    this.authorized = player?.isAuthorized() ?? false;
    this.deviceType = sdk.deviceInfo().type;
  }

  get isTV(): boolean { return this.deviceType === 'tv'; }

  static async create(): Promise<YandexPlatform> {
    await loadYandexSdk();
    if (!window.YaGames) throw new Error('Yandex Games SDK did not expose YaGames.');
    const sdk = await window.YaGames.init();
    let player: YandexPlayer | null = null;
    try { player = await sdk.getPlayer(); }
    catch (error) { log('Player is unavailable, continuing as guest.', error); }
    log('Initialized', { authorized: player?.isAuthorized() ?? false, deviceType: sdk.deviceInfo().type });
    return new YandexPlatform(sdk, player);
  }

  async loadCloudSave(): Promise<GameSave | null> {
    if (!this.player || !this.authorized) return null;
    try {
      const data = await this.player.getData([CLOUD_KEY, LEGACY_CLOUD_KEY]);
      return (data[CLOUD_KEY] as GameSave | undefined)
        ?? (data[LEGACY_CLOUD_KEY] as GameSave | undefined)
        ?? null;
    } catch (error) {
      log('Cloud load failed; local progress remains available.', error);
      return null;
    }
  }

  async saveCloud(save: GameSave, flush = false): Promise<void> {
    if (!this.player || !this.authorized) return;
    await this.player.setData({ [CLOUD_KEY]: save }, flush);
  }

  async ready(): Promise<void> { await this.sdk.features.LoadingAPI?.ready(); }
  gameplayStart(): void { this.sdk.features.GameplayAPI?.start(); }
  gameplayStop(): void { this.sdk.features.GameplayAPI?.stop(); }

  async getStickyBannerStatus(): Promise<StickyBannerStatus> {
    try { return await this.sdk.adv.getBannerAdvStatus(); }
    catch (error) { log('Sticky status unavailable.', error); return { stickyAdvIsShowing: false, reason: 'UNKNOWN' }; }
  }

  async showStickyBanner(): Promise<StickyBannerStatus> {
    this.stickyRequested = true;
    const current = await this.getStickyBannerStatus();
    if (current.stickyAdvIsShowing || current.reason) return current;
    try { return await this.sdk.adv.showBannerAdv(); }
    catch (error) { log('Sticky banner unavailable.', error); return { stickyAdvIsShowing: false, reason: 'UNKNOWN' }; }
  }

  async hideStickyBanner(): Promise<StickyBannerStatus> {
    this.stickyRequested = false;
    return this.hideStickyForAd();
  }

  private async hideStickyForAd(): Promise<StickyBannerStatus> {
    const current = await this.getStickyBannerStatus();
    if (!current.stickyAdvIsShowing) return current;
    try { return await this.sdk.adv.hideBannerAdv(); }
    catch (error) { log('Sticky banner could not be hidden.', error); return current; }
  }

  private async prepareAd(): Promise<boolean> {
    if (this.adInFlight) return false;
    this.adInFlight = true;
    this.gameplayStop();
    await this.hideStickyForAd();
    return true;
  }

  private async finishAd(): Promise<void> {
    if (this.stickyRequested) await this.showStickyBanner();
    this.gameplayStart();
    this.adInFlight = false;
  }

  async showFullscreenAd(): Promise<boolean> {
    if (!await this.prepareAd()) return false;
    return new Promise((resolve) => {
      let settled = false;
      const finish = (result: boolean) => {
        if (settled) return;
        settled = true;
        void this.finishAd().finally(() => resolve(result));
      };
      try {
        this.sdk.adv.showFullscreenAdv({ callbacks: {
          onClose: (wasShown) => finish(wasShown),
          onError: (error) => { log('Fullscreen ad unavailable.', error); finish(false); },
        } });
      } catch (error) {
        log('Fullscreen ad call failed.', error);
        finish(false);
      }
    });
  }

  async showRewardedAd(): Promise<boolean> {
    if (!await this.prepareAd()) return false;
    return new Promise((resolve) => {
      let rewarded = false;
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        void this.finishAd().finally(() => resolve(rewarded));
      };
      try {
        this.sdk.adv.showRewardedVideo({ callbacks: {
          onRewarded: () => { rewarded = true; },
          onClose: finish,
          onError: (error) => { rewarded = false; log('Rewarded ad unavailable.', error); finish(); },
        } });
      } catch (error) {
        rewarded = false;
        log('Rewarded ad call failed.', error);
        finish();
      }
    });
  }

  async requestFullscreen(): Promise<boolean> {
    try { await this.sdk.screen.fullscreen.request(); return this.getFullscreenStatus() === 'on'; }
    catch (error) { log('Fullscreen request unavailable.', error); return false; }
  }
  async exitFullscreen(): Promise<boolean> {
    try { await this.sdk.screen.fullscreen.exit(); return this.getFullscreenStatus() === 'off'; }
    catch (error) { log('Fullscreen exit unavailable.', error); return false; }
  }
  getFullscreenStatus(): 'on' | 'off' { return this.sdk.screen.fullscreen.status; }
}

let sdkLoadPromise: Promise<void> | null = null;
function loadYandexSdk(): Promise<void> {
  if (window.YaGames) return Promise.resolve();
  if (sdkLoadPromise) return sdkLoadPromise;
  sdkLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
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
    try { return await YandexPlatform.create(); }
    catch (error) { log('Falling back to development adapter.', error); }
  }
  return new DevelopmentPlatform();
}

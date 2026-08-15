interface YandexPlayer {
  isAuthorized(): boolean;
  getData(keys?: string[]): Promise<Record<string, unknown>>;
  setData(data: Record<string, unknown>, flush?: boolean): Promise<void>;
}

interface YandexGamesSdk {
  environment: { i18n?: { lang?: string }; browser?: { lang?: string } };
  getPlayer(): Promise<YandexPlayer>;
  features: {
    LoadingAPI?: { ready(): Promise<void> | void };
    GameplayAPI?: { start(): Promise<void> | void; stop(): Promise<void> | void };
  };
  deviceInfo(): {
    type: 'desktop' | 'mobile' | 'tablet' | 'tv';
    isMobile(): boolean;
    isDesktop(): boolean;
    isTablet(): boolean;
    isTV(): boolean;
  };
  screen: {
    fullscreen: {
      readonly STATUS_ON: 'on';
      readonly STATUS_OFF: 'off';
      readonly status: 'on' | 'off';
      request(): Promise<void>;
      exit(): Promise<void>;
    };
  };
  adv: {
    getBannerAdvStatus(): Promise<{ stickyAdvIsShowing: boolean; reason?: 'ADV_IS_NOT_CONNECTED' | 'UNKNOWN' }>;
    showBannerAdv(): Promise<{ stickyAdvIsShowing: boolean; reason?: 'ADV_IS_NOT_CONNECTED' | 'UNKNOWN' }>;
    hideBannerAdv(): Promise<{ stickyAdvIsShowing: boolean }>;
    showFullscreenAdv(options: {
      callbacks: {
        onOpen?(): void;
        onClose?(wasShown: boolean): void;
        onError?(error: unknown): void;
      };
    }): void;
    showRewardedVideo(options: {
      callbacks: {
        onOpen?(): void;
        onRewarded?(): void;
        onClose?(wasShown: boolean): void;
        onError?(error: unknown): void;
      };
    }): void;
  };
  auth?: { openAuthDialog(): Promise<void> };
}

interface Window {
  YaGames?: { init(options?: { signed?: boolean }): Promise<YandexGamesSdk> };
}

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
  adv: {
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

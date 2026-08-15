import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPlatform, DevelopmentPlatform } from '../../platform/platform';

describe('development ad lifecycle', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { language: 'en-US' });
    vi.stubGlobal('location', { search: '' });
  });

  it('does not show sticky initially, shows after an action once, and hides it', async () => {
    const platform = new DevelopmentPlatform();
    expect(platform.debugMetrics.stickyShowCalls).toBe(0);
    expect((await platform.getStickyBannerStatus()).stickyAdvIsShowing).toBe(false);
    await platform.showStickyBanner();
    await platform.showStickyBanner();
    expect(platform.debugMetrics.stickyShowCalls).toBe(1);
    expect((await platform.getStickyBannerStatus()).stickyAdvIsShowing).toBe(true);
    await platform.hideStickyBanner();
    expect(platform.debugMetrics.stickyHideCalls).toBe(1);
    expect((await platform.getStickyBannerStatus()).stickyAdvIsShowing).toBe(false);
  });

  it.each([
    ['reward', true],
    ['close', false],
    ['error', false],
  ] as const)('unlocks a reward only for %s', async (outcome, expected) => {
    const platform = new DevelopmentPlatform();
    platform.setRewardedSimulation(outcome);
    expect(await platform.showRewardedAd()).toBe(expected);
  });

  it('reads the SDK i18n language immediately after init and before player loading', async () => {
    const startupEvents: string[] = [];
    const listeners = new Map<string, () => void>();
    const sdk = {
      environment: {
        get i18n() {
          startupEvents.push('i18n');
          return { lang: 'en' };
        },
        browser: { lang: 'ru' },
      },
      getPlayer: async () => {
        startupEvents.push('player');
        throw new Error('Guest session');
      },
      EVENTS: { EXIT: 'EXIT' as const, HISTORY_BACK: 'HISTORY_BACK' as const, ACCOUNT_SELECTION_DIALOG_OPENED: 'ACCOUNT_SELECTION_DIALOG_OPENED' as const, ACCOUNT_SELECTION_DIALOG_CLOSED: 'ACCOUNT_SELECTION_DIALOG_CLOSED' as const },
      on: (eventName: string, listener: () => void) => { startupEvents.push(`on:${eventName}`); listeners.set(eventName, listener); },
      off: () => undefined,
      dispatchEvent: async () => undefined,
      features: {},
      deviceInfo: () => ({
        type: 'desktop' as const,
        isMobile: () => false,
        isDesktop: () => true,
        isTablet: () => false,
        isTV: () => false,
      }),
      screen: { fullscreen: { STATUS_ON: 'on' as const, STATUS_OFF: 'off' as const, status: 'off' as const, request: async () => {}, exit: async () => {} } },
      adv: {},
    };
    vi.stubGlobal('location', { hostname: 'localhost', search: '?yandex' });
    vi.stubGlobal('window', { YaGames: { init: async () => sdk } });

    const platform = await createPlatform();

    expect(platform.kind).toBe('yandex');
    expect(platform.language).toBe('en');
    expect(startupEvents).toEqual(['i18n', 'on:game_api_pause', 'on:game_api_resume', 'player']);
  });

  it('pauses on SDK lifecycle events and persists guest progress through Player', async () => {
    const listeners = new Map<string, () => void>();
    const setData = vi.fn(async () => undefined);
    const sdk = {
      environment: { i18n: { lang: 'ru' }, browser: { lang: 'en' } },
      getPlayer: async () => ({ isAuthorized: () => false, getData: async () => ({}), setData }),
      EVENTS: { EXIT: 'EXIT' as const, HISTORY_BACK: 'HISTORY_BACK' as const, ACCOUNT_SELECTION_DIALOG_OPENED: 'ACCOUNT_SELECTION_DIALOG_OPENED' as const, ACCOUNT_SELECTION_DIALOG_CLOSED: 'ACCOUNT_SELECTION_DIALOG_CLOSED' as const },
      on: (eventName: string, listener: () => void) => { listeners.set(eventName, listener); }, off: () => undefined,
      dispatchEvent: async () => undefined,
      features: {},
      deviceInfo: () => ({ type: 'desktop' as const, isMobile: () => false, isDesktop: () => true, isTablet: () => false, isTV: () => false }),
      screen: { fullscreen: { STATUS_ON: 'on' as const, STATUS_OFF: 'off' as const, status: 'off' as const, request: async () => {}, exit: async () => {} } },
      adv: {},
    };
    vi.stubGlobal('location', { hostname: 'localhost', search: '?yandex' });
    vi.stubGlobal('window', { YaGames: { init: async () => sdk } });
    const platform = await createPlatform();
    const paused = vi.fn();
    const resumed = vi.fn();
    platform.subscribeLifecycle(paused, resumed);

    listeners.get('game_api_pause')?.();
    expect(platform.lifecyclePaused).toBe(true);
    expect(paused).toHaveBeenCalledOnce();
    listeners.get('game_api_resume')?.();
    expect(platform.lifecyclePaused).toBe(false);
    expect(resumed).toHaveBeenCalledOnce();

    const save = { updatedAt: 1 } as never;
    await platform.saveCloud(save, true);
    expect(platform.authorized).toBe(false);
    expect(setData).toHaveBeenCalledWith({ justBetweenUsSave: save }, true);
  });

  it('uses SDK history and exit events on TV', async () => {
    const listeners = new Map<string, () => void>();
    const dispatchEvent = vi.fn(async () => undefined);
    const sdk = {
      environment: { i18n: { lang: 'ru' } },
      getPlayer: async () => ({ isAuthorized: () => false, getData: async () => ({}), setData: async () => undefined }),
      EVENTS: { EXIT: 'EXIT' as const, HISTORY_BACK: 'HISTORY_BACK' as const, ACCOUNT_SELECTION_DIALOG_OPENED: 'ACCOUNT_SELECTION_DIALOG_OPENED' as const, ACCOUNT_SELECTION_DIALOG_CLOSED: 'ACCOUNT_SELECTION_DIALOG_CLOSED' as const },
      on: (eventName: string, listener: () => void) => { listeners.set(eventName, listener); }, off: () => undefined, dispatchEvent,
      features: {},
      deviceInfo: () => ({ type: 'tv' as const, isMobile: () => false, isDesktop: () => false, isTablet: () => false, isTV: () => true }),
      screen: { fullscreen: { STATUS_ON: 'on' as const, STATUS_OFF: 'off' as const, status: 'on' as const, request: async () => {}, exit: async () => {} } },
      adv: {},
    };
    vi.stubGlobal('location', { hostname: 'localhost', search: '?yandex' });
    vi.stubGlobal('window', { YaGames: { init: async () => sdk } });
    const platform = await createPlatform();
    const back = vi.fn();
    platform.subscribeHistoryBack(back);

    listeners.get('HISTORY_BACK')?.();
    expect(back).toHaveBeenCalledOnce();
    await platform.exitGame();
    expect(dispatchEvent).toHaveBeenCalledWith('EXIT');
  });
});

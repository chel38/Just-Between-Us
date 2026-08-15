import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DevelopmentPlatform } from '../../platform/platform';

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
});

import { describe, expect, it } from 'vitest';
import { calculateDeviceLayout } from '../../hooks/useDeviceLayout';
import type { DeviceType } from '../../platform/platform';

const viewports = [
  [390, 844, 'mobile'], [430, 932, 'mobile'], [844, 390, 'mobile'], [1024, 768, 'tablet'],
  [1280, 720, 'desktop'], [1366, 768, 'desktop'], [1920, 1080, 'desktop'], [2560, 1440, 'desktop'],
  [3440, 1440, 'desktop'], [3840, 2160, 'tv'],
] as const;

describe('ad-safe responsive layout', () => {
  it.each(viewports)('calculates one bounded reserve for %ix%i %s', (width, height, deviceType) => {
    const withoutSticky = calculateDeviceLayout({ deviceType: deviceType as DeviceType, viewportWidth: width, viewportHeight: height, stickyVisible: false });
    const withSticky = calculateDeviceLayout({ deviceType: deviceType as DeviceType, viewportWidth: width, viewportHeight: height, stickyVisible: true });
    expect(withoutSticky.stickyEdge).toBe('none');
    expect(withoutSticky.stickyReserveBottom + withoutSticky.stickyReserveRight).toBe(0);
    if (withSticky.orientation === 'portrait' && deviceType !== 'tv') {
      expect(withSticky.stickyEdge).toBe('bottom');
      expect(withSticky.stickyReserveBottom).toBeGreaterThan(0);
      expect(withSticky.stickyReserveBottom).toBeLessThan(height / 3);
    } else {
      expect(withSticky.stickyEdge).toBe('right');
      expect(withSticky.stickyReserveRight).toBeGreaterThan(0);
      expect(withSticky.stickyReserveRight).toBeLessThan(width / 2);
    }
  });
});

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { DeviceType, Orientation } from '../platform/platform';

export type StickyEdge = 'none' | 'bottom' | 'right';

export interface DeviceLayout {
  deviceType: DeviceType;
  orientation: Orientation;
  isTV: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  viewportWidth: number;
  viewportHeight: number;
  stickyEdge: StickyEdge;
  stickyReserveRight: number;
  stickyReserveBottom: number;
  cssVariables: CSSProperties;
}

export interface DeviceLayoutInput {
  deviceType: DeviceType;
  forcedOrientation?: Orientation;
  viewportWidth: number;
  viewportHeight: number;
  stickyVisible: boolean;
}

const clamp = (minimum: number, value: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

export function calculateDeviceLayout(input: DeviceLayoutInput): DeviceLayout {
  const { deviceType, viewportWidth, viewportHeight, stickyVisible } = input;
  const orientation = input.forcedOrientation ?? (viewportHeight >= viewportWidth ? 'portrait' : 'landscape');
  const portraitBanner = orientation === 'portrait' && (deviceType === 'mobile' || deviceType === 'tablet');
  const stickyEdge: StickyEdge = !stickyVisible ? 'none' : portraitBanner ? 'bottom' : 'right';
  const bottom = stickyEdge === 'bottom'
    ? Math.round(clamp(72, viewportHeight * (deviceType === 'tablet' ? 0.11 : 0.12), 120))
    : 0;
  const rightRatio = deviceType === 'tv' ? 0.16 : deviceType === 'desktop' ? 0.18 : 0.19;
  const rightMinimum = deviceType === 'tv' ? 220 : deviceType === 'desktop' ? 180 : deviceType === 'tablet' ? 150 : 120;
  const rightMaximum = deviceType === 'tv' ? 400 : deviceType === 'desktop' ? 340 : deviceType === 'tablet' ? 280 : 240;
  const right = stickyEdge === 'right'
    ? Math.round(clamp(rightMinimum, viewportWidth * rightRatio, rightMaximum))
    : 0;

  return {
    deviceType,
    orientation,
    isTV: deviceType === 'tv',
    isDesktop: deviceType === 'desktop',
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    viewportWidth,
    viewportHeight,
    stickyEdge,
    stickyReserveRight: right,
    stickyReserveBottom: bottom,
    cssVariables: {
      '--app-viewport-width': `${viewportWidth}px`,
      '--app-viewport-height': `${viewportHeight}px`,
      '--sticky-reserve-right': `${right}px`,
      '--sticky-reserve-bottom': `${bottom}px`,
    } as CSSProperties,
  };
}

function readViewport(): { width: number; height: number } {
  const viewport = window.visualViewport;
  return {
    width: Math.round(viewport?.width ?? window.innerWidth),
    height: Math.round(viewport?.height ?? window.innerHeight),
  };
}

export function useDeviceLayout(deviceType: DeviceType, forcedOrientation?: Orientation, stickyVisible = false): DeviceLayout {
  const [viewport, setViewport] = useState(readViewport);
  useEffect(() => {
    const visualViewport = window.visualViewport;
    const update = () => setViewport(readViewport());
    visualViewport?.addEventListener('resize', update);
    visualViewport?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      visualViewport?.removeEventListener('resize', update);
      visualViewport?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);
  return useMemo(() => calculateDeviceLayout({
    deviceType,
    forcedOrientation,
    viewportWidth: viewport.width,
    viewportHeight: viewport.height,
    stickyVisible,
  }), [deviceType, forcedOrientation, stickyVisible, viewport.height, viewport.width]);
}

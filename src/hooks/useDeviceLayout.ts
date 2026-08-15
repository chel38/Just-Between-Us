import { useEffect, useMemo, useState } from 'react';
import type { DeviceType, Orientation } from '../platform/platform';

export interface DeviceLayout {
  deviceType: DeviceType;
  orientation: Orientation;
  isTV: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
}

function viewportOrientation(): Orientation {
  return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
}

export function useDeviceLayout(deviceType: DeviceType, forcedOrientation?: Orientation): DeviceLayout {
  const [orientation, setOrientation] = useState<Orientation>(viewportOrientation);
  useEffect(() => {
    const media = window.matchMedia('(orientation: portrait)');
    const update = () => setOrientation(media.matches ? 'portrait' : 'landscape');
    media.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => { media.removeEventListener('change', update); window.removeEventListener('resize', update); };
  }, []);
  return useMemo(() => {
    const activeOrientation = forcedOrientation ?? orientation;
    return {
      deviceType,
      orientation: activeOrientation,
      isTV: deviceType === 'tv',
      isDesktop: deviceType === 'desktop',
      isPortrait: activeOrientation === 'portrait',
      isLandscape: activeOrientation === 'landscape',
    };
  }, [deviceType, forcedOrientation, orientation]);
}

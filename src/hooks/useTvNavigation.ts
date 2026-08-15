import { useEffect } from 'react';

export type SpatialDirection = 'up' | 'down' | 'left' | 'right';
export interface FocusRect { left: number; right: number; top: number; bottom: number; }

const focusSelector = 'button:not(:disabled), [href], select:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])';
const keyDirections: Partial<Record<string, SpatialDirection>> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };

export const isTvActivationKey = (key: string): boolean => key === 'Enter' || key === 'OK';

export function findSpatialTarget(rects: FocusRect[], currentIndex: number, direction: SpatialDirection): number {
  const current = rects[currentIndex];
  if (!current) return rects.length ? 0 : -1;
  const cx = (current.left + current.right) / 2;
  const cy = (current.top + current.bottom) / 2;
  let best = -1;
  let bestScore = Number.POSITIVE_INFINITY;
  rects.forEach((rect, index) => {
    if (index === currentIndex) return;
    const x = (rect.left + rect.right) / 2;
    const y = (rect.top + rect.bottom) / 2;
    const primary = direction === 'down' ? y - cy : direction === 'up' ? cy - y : direction === 'right' ? x - cx : cx - x;
    if (primary <= 0) return;
    const cross = direction === 'up' || direction === 'down' ? Math.abs(x - cx) : Math.abs(y - cy);
    const score = primary + cross * 1.8;
    if (score < bestScore) { best = index; bestScore = score; }
  });
  return best;
}

export function useTvNavigation(enabled: boolean, onBack: () => void, dependency: unknown): void {
  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Backspace' || event.key === 'BrowserBack' || event.key === 'GoBack') {
        event.preventDefault();
        onBack();
        return;
      }
      if (isTvActivationKey(event.key) && document.activeElement instanceof HTMLElement) {
        event.preventDefault();
        document.activeElement.click();
        return;
      }
      const direction = keyDirections[event.key];
      if (!direction) return;
      const elements = [...document.querySelectorAll<HTMLElement>(focusSelector)].filter((element) => element.offsetParent !== null);
      if (!elements.length) return;
      event.preventDefault();
      const currentIndex = elements.indexOf(document.activeElement as HTMLElement);
      const target = currentIndex < 0 ? 0 : findSpatialTarget(elements.map((element) => element.getBoundingClientRect()), currentIndex, direction);
      if (target >= 0) elements[target].focus({ preventScroll: false });
    };
    window.addEventListener('keydown', onKeyDown);
    requestAnimationFrame(() => {
      if (!document.activeElement || document.activeElement === document.body) document.querySelector<HTMLElement>(focusSelector)?.focus();
    });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, onBack, dependency]);
}

export function calculateTypingDelay(
  textLength: number,
  speed: 'normal' | 'fast',
  random = Math.random(),
): number {
  if (speed === 'fast') {
    return Math.round(Math.max(240, Math.min(1_350, 180 + textLength * 8 + random * 180)));
  }
  return Math.round(Math.max(620, Math.min(5_200, 420 + textLength * 25 + random * 620)));
}

export async function pausableDelay(
  duration: number,
  signal: AbortSignal,
  isPaused: () => boolean,
): Promise<void> {
  let remaining = duration;
  let previous = performance.now();
  while (remaining > 0) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    await new Promise<void>((resolve) => window.setTimeout(resolve, Math.min(100, remaining)));
    const current = performance.now();
    if (!isPaused()) remaining -= current - previous;
    previous = current;
  }
}

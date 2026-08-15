import type { GameSettings } from '../types/save';

export class SoundService {
  private context: AudioContext | null = null;
  private readonly pauseReasons = new Set<string>();

  notify(settings: GameSettings): void {
    if (this.pauseReasons.size > 0 || !settings.soundEnabled || settings.soundVolume <= 0) return;
    try {
      this.context ??= new AudioContext();
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 520;
      gain.gain.setValueAtTime(0.0001, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.001, settings.soundVolume * 0.04), this.context.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.12);
      oscillator.connect(gain).connect(this.context.destination);
      oscillator.start();
      oscillator.stop(this.context.currentTime + 0.13);
    } catch { /* Audio is optional; a blocked context must not affect gameplay. */ }
  }

  pause(reason = 'manual'): void {
    this.pauseReasons.add(reason);
    void this.context?.suspend();
  }

  resume(reason = 'manual'): void {
    this.pauseReasons.delete(reason);
    if (this.pauseReasons.size === 0) void this.context?.resume();
  }
}

export const soundService = new SoundService();

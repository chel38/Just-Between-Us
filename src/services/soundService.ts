import type { GameSettings } from '../types/save';

export class SoundService {
  private context: AudioContext | null = null;

  notify(settings: GameSettings): void {
    if (!settings.soundEnabled || settings.soundVolume <= 0) return;
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

  pause(): void { void this.context?.suspend(); }
  resume(): void { void this.context?.resume(); }
}

export const soundService = new SoundService();

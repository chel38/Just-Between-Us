import type { DialogueProgress } from './dialogue';

export type LanguageSetting = 'auto' | 'ru' | 'en';

export interface LegalConsent {
  accepted: boolean;
  version: number;
  acceptedAt: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  soundVolume: number;
  musicEnabled: boolean;
  musicVolume: number;
  messageSpeed: 'normal' | 'fast';
  vibration: boolean;
  reducedMotion: boolean;
  language: LanguageSetting;
  unlockedThemes: string[];
  activeTheme: 'midnight' | 'violet';
}

export interface GameSave {
  saveVersion: number;
  dialogs: Record<string, DialogueProgress>;
  settings: GameSettings;
  endings: Record<string, string[]>;
  globalFlags: string[];
  lastOpenedDialog: string | null;
  legalConsent?: LegalConsent;
  updatedAt: number;
}

export const CURRENT_SAVE_VERSION = 3;

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  soundVolume: 0.7,
  musicEnabled: false,
  musicVolume: 0.35,
  messageSpeed: 'normal',
  vibration: true,
  reducedMotion: false,
  language: 'auto',
  unlockedThemes: ['midnight'],
  activeTheme: 'midnight',
};

export function createDefaultSave(): GameSave {
  return {
    saveVersion: CURRENT_SAVE_VERSION,
    dialogs: {},
    settings: { ...DEFAULT_SETTINGS },
    endings: {},
    globalFlags: [],
    lastOpenedDialog: null,
    updatedAt: Date.now(),
  };
}

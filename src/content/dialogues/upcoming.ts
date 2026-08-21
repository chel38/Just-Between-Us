import type { UiLanguage } from '../locales';

export interface UpcomingDialogue {
  id: string;
  characterName: string;
  preview: string;
  status: string;
}

const localizedUpcomingDialogues: Record<UiLanguage, UpcomingDialogue[]> = {
  ru: [],
  en: [],
};

export function getUpcomingDialogues(language: UiLanguage): UpcomingDialogue[] {
  return localizedUpcomingDialogues[language];
}

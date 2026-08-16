import type { UiLanguage } from '../locales';

export interface UpcomingDialogue {
  id: string;
  characterName: string;
  preview: string;
  status: string;
}

const localizedUpcomingDialogues: Record<UiLanguage, UpcomingDialogue[]> = {
  ru: [
    {
      id: 'lyubov',
      characterName: 'Любовь',
      preview: 'Новая история уже готовится.',
      status: 'Появится скоро',
    },
  ],
  en: [
    {
      id: 'lyubov',
      characterName: 'Lyubov',
      preview: 'A new story is already in the works.',
      status: 'Coming soon',
    },
  ],
};

export function getUpcomingDialogues(language: UiLanguage): UpcomingDialogue[] {
  return localizedUpcomingDialogues[language];
}

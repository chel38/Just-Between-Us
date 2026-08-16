import type { DialogueDefinition } from '../../types/dialogue';

export interface AdultStoryAsset {
  id: string;
  characterId: string;
  characterAge: number;
  contentRating: '18+';
  promoAllowed: false;
  asset: string;
}

export const ADULT_STORY_ASSETS: readonly AdultStoryAsset[] = [
  {
    id: 'lera-night-01',
    characterId: 'lera',
    characterAge: 24,
    contentRating: '18+',
    promoAllowed: false,
    asset: '/assets/characters/lera/story/night-01.webp',
  },
  {
    id: 'lera-night-02',
    characterId: 'lera',
    characterAge: 24,
    contentRating: '18+',
    promoAllowed: false,
    asset: '/assets/characters/lera/story/night-02.webp',
  },
] as const;

export function validateAdultStoryAssets(dialogues: readonly DialogueDefinition[]): void {
  const issues: string[] = [];
  const assets = new Map(ADULT_STORY_ASSETS.map((entry) => [entry.asset, entry]));
  for (const dialogue of dialogues) {
    for (const message of dialogue.nodes.flatMap((node) => node.messages)) {
      if (message.kind !== 'photo' || !message.image) continue;
      const manifest = assets.get(message.image);
      if (!manifest) issues.push(`${dialogue.id}/${message.id}: photo is missing from the adult asset manifest.`);
      else {
        if (manifest.characterId !== dialogue.character.id) issues.push(`${dialogue.id}/${message.id}: photo character does not match the dialogue.`);
        if (manifest.characterAge !== dialogue.character.age || manifest.characterAge < 18) issues.push(`${dialogue.id}/${message.id}: photo age metadata is invalid.`);
        if (manifest.contentRating !== '18+' || manifest.promoAllowed !== false) issues.push(`${dialogue.id}/${message.id}: adult photo must be rated 18+ and blocked from promo.`);
      }
      if (!message.alt?.trim()) issues.push(`${dialogue.id}/${message.id}: localized photo alt is missing.`);
    }
  }
  if (issues.length) throw new Error(`AdultAssetValidationError:\n${issues.join('\n')}`);
}

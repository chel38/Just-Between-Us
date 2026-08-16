import type { DialogueDefinition } from '../../types/dialogue';

export interface AdultStoryAsset {
  id: string;
  characterId: string;
  characterAge: number;
  contentRating: '18+';
  promoAllowed: false;
  asset: string;
  identityReference: string;
  purpose: 'relationship' | 'story-clue';
}

export const ADULT_STORY_ASSETS: readonly AdultStoryAsset[] = [
  {
    id: 'lera_lingerie_photo_01',
    characterId: 'lera',
    characterAge: 24,
    contentRating: '18+',
    promoAllowed: false,
    asset: './assets/characters/lera/story/lera-lingerie-01.png',
    identityReference: './assets/characters/lera/identity-reference.webp',
    purpose: 'relationship',
  },
  {
    id: 'lera_gallery_photo_01',
    characterId: 'lera',
    characterAge: 24,
    contentRating: '18+',
    promoAllowed: false,
    asset: './assets/characters/lera/story/night-02.webp',
    identityReference: './assets/characters/lera/identity-reference.webp',
    purpose: 'story-clue',
  },
] as const;

export function validateAdultStoryAssets(dialogues: readonly DialogueDefinition[]): void {
  const issues: string[] = [];
  const manifestIds = new Set<string>();
  const manifestAssets = new Set<string>();
  for (const entry of ADULT_STORY_ASSETS) {
    if (manifestIds.has(entry.id)) issues.push(`${entry.id}: duplicate adult asset ID.`);
    if (manifestAssets.has(entry.asset)) issues.push(`${entry.asset}: duplicate adult asset path.`);
    manifestIds.add(entry.id);
    manifestAssets.add(entry.asset);
  }
  const assets = new Map(ADULT_STORY_ASSETS.map((entry) => [entry.asset, entry]));
  const usedAssets = new Set<string>();
  for (const dialogue of dialogues) {
    for (const message of dialogue.nodes.flatMap((node) => node.messages)) {
      if (message.kind !== 'photo' || !message.image) continue;
      usedAssets.add(message.image);
      const manifest = assets.get(message.image);
      if (!manifest) issues.push(`${dialogue.id}/${message.id}: photo is missing from the adult asset manifest.`);
      else {
        if (manifest.characterId !== dialogue.character.id) issues.push(`${dialogue.id}/${message.id}: photo character does not match the dialogue.`);
        if (manifest.characterAge !== dialogue.character.age || manifest.characterAge < 18) issues.push(`${dialogue.id}/${message.id}: photo age metadata is invalid.`);
        if (manifest.contentRating !== '18+' || manifest.promoAllowed !== false) issues.push(`${dialogue.id}/${message.id}: adult photo must be rated 18+ and blocked from promo.`);
        if (!manifest.identityReference) issues.push(`${dialogue.id}/${message.id}: identity reference is missing.`);
      }
      if (!message.alt?.trim()) issues.push(`${dialogue.id}/${message.id}: localized photo alt is missing.`);
    }
  }
  for (const entry of ADULT_STORY_ASSETS) {
    if (!usedAssets.has(entry.asset)) issues.push(`${entry.id}: adult asset is not used by any dialogue photo message.`);
  }
  if (issues.length) throw new Error(`AdultAssetValidationError:\n${issues.join('\n')}`);
}

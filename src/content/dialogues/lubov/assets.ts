export interface LubovAssetManifestEntry {
  id: string;
  type: 'photo';
  asset: string;
  source: string;
  adultCharacters: true;
  characterAge?: number;
  secondAdultAge?: number;
  promoAllowed: false;
  localizationMode: 'localized-alt-and-caption';
  storyPurpose: string;
  identityReference?: string;
}

export const LUBOV_ASSETS: readonly LubovAssetManifestEntry[] = [
  { id: 'lubov_proof_embrace_01', type: 'photo', asset: './assets/characters/lubov/story/proof-embrace.png', source: 'Denis, distant phone photo', adultCharacters: true, characterAge: 31, secondAdultAge: 34, promoAllowed: false, localizationMode: 'localized-alt-and-caption', storyPurpose: 'Starts the confrontation and proves romantic intimacy.', identityReference: './assets/characters/lubov/identity-reference.png' },
  { id: 'lubov_proof_hotel_02', type: 'photo', asset: './assets/characters/lubov/story/proof-hotel.png', source: 'Denis, distant phone photo', adultCharacters: true, characterAge: 31, secondAdultAge: 34, promoAllowed: false, localizationMode: 'localized-alt-and-caption', storyPurpose: 'Breaks the one-kiss story by showing the hotel entrance.', identityReference: './assets/characters/lubov/identity-reference.png' },
  { id: 'lubov_suitcase_photo', type: 'photo', asset: './assets/characters/lubov/story/packed-suitcase.png', source: 'Lyubov, shared apartment', adultCharacters: true, promoAllowed: false, localizationMode: 'localized-alt-and-caption', storyPurpose: 'Makes the temporary separation physically real.' },
  { id: 'lubov_keys_photo', type: 'photo', asset: './assets/characters/lubov/story/keys.png', source: 'Lyubov, shared apartment', adultCharacters: true, promoAllowed: false, localizationMode: 'localized-alt-and-caption', storyPurpose: 'Confirms that spare keys were left behind.' },
  { id: 'lubov_ring_keys_photo', type: 'photo', asset: './assets/characters/lubov/story/ring-and-keys.png', source: 'Lyubov, shared apartment', adultCharacters: true, promoAllowed: false, localizationMode: 'localized-alt-and-caption', storyPurpose: 'Provides the final visual full stop for divorce endings.' },
] as const;

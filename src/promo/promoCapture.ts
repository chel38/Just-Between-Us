import type { DialogueDefinition } from '../types/dialogue';

export function isPromoCaptureMode(locationLike: Pick<Location, 'hostname' | 'search'> = window.location): boolean {
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(locationLike.hostname);
  return local && new URLSearchParams(locationLike.search).get('promo') === '1';
}

export function getPromoSafeNodeIds(dialogue: DialogueDefinition): string[] {
  return dialogue.nodes
    .filter((node) => node.promoSafe === true && node.messages.every((message) => message.kind !== 'photo'))
    .map((node) => node.id);
}

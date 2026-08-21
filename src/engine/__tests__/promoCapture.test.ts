import { describe, expect, it } from 'vitest';
import { getLeraDialogue } from '../../content/dialogues/lera';
import { getLubovDialogue } from '../../content/dialogues/lubov';
import { getPromoSafeNodeIds, isPromoCaptureMode } from '../../promo/promoCapture';

describe('promo capture guard', () => {
  it('only enables ad-free capture on an explicit local URL', () => {
    expect(isPromoCaptureMode({ hostname: '127.0.0.1', search: '?promo=1' } as Location)).toBe(true);
    expect(isPromoCaptureMode({ hostname: 'games.example', search: '?promo=1' } as Location)).toBe(false);
    expect(isPromoCaptureMode({ hostname: 'localhost', search: '' } as Location)).toBe(false);
  });

  it('exposes only explicitly safe Lera nodes with no photo messages', () => {
    const dialogue = getLeraDialogue('en');
    const safeIds = getPromoSafeNodeIds(dialogue);
    expect(safeIds).toContain('lera_start');
    expect(safeIds).toContain('lera_flirt_entry');
    expect(safeIds).not.toContain('lera_photo_scene');
    expect(safeIds.every((id) => dialogue.nodes.find((node) => node.id === id)?.messages.every((message) => message.kind !== 'photo'))).toBe(true);
  });

  it('never exposes Lyubov evidence, forwarded messages, or documents to promo capture', () => {
    const dialogue = getLubovDialogue('ru');
    const safeIds = getPromoSafeNodeIds(dialogue);
    expect(safeIds).toContain('lubov_why');
    expect(safeIds).not.toContain('lubov_start');
    expect(safeIds.every((id) => dialogue.nodes.find((node) => node.id === id)?.messages.every((message) => message.kind !== 'photo' && message.kind !== 'attachment'))).toBe(true);
  });
});

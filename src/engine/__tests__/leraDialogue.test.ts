/// <reference types="node" />
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ADULT_STORY_ASSETS, validateAdultStoryAssets } from '../../content/assets/adultAssetManifest';
import { getDialogues } from '../../content/dialogues';
import { getLeraDialogue } from '../../content/dialogues/lera';
import { DialogueEngine } from '../dialogue/dialogueEngine';
import { resolveTranscriptMessage } from '../dialogue/transcriptResolver';
import { validateDialogue, validateDialoguePair } from '../dialogue/dialogueValidator';

function playRoute(choiceIds: string[]) {
  const dialogue = getLeraDialogue('ru');
  const engine = new DialogueEngine(dialogue);
  let progress = engine.createProgress();
  let now = 100;
  for (const choiceId of choiceIds) {
    expect(engine.availableChoices(progress).map((choice) => choice.id), `at ${progress.currentNodeId}`).toContain(choiceId);
    progress = engine.choose(progress, choiceId, now++);
    for (const message of engine.pendingMessages(progress)) {
      progress = engine.appendScriptMessage(progress, message, message.text ?? '', now++);
    }
    progress = engine.finishCurrentNode(progress, now++);
  }
  return { dialogue, engine, progress };
}

describe('Lera dialogue graph', () => {
  it.each(['ru', 'en'] as const)('validates the complete %s graph', (language) => {
    expect(() => validateDialogue(getLeraDialogue(language))).not.toThrow();
  });

  it('has five distinct starts, complete localization, hints, photos, and seven endings', () => {
    const ru = getLeraDialogue('ru');
    const en = getLeraDialogue('en');
    const start = ru.nodes.find((node) => node.id === ru.startNodeId)!;
    expect(start.choices).toHaveLength(5);
    expect(new Set(start.choices!.map((choice) => choice.next)).size).toBe(5);
    expect(() => validateDialoguePair(ru, en)).not.toThrow();
    expect(ru.nodes).toHaveLength(26);
    expect(ru.nodes.flatMap((node) => node.choices ?? [])).toHaveLength(56);
    expect(ru.nodes.filter((node) => node.choices?.length).every((node) => Boolean(node.hint))).toBe(true);
    expect(ru.nodes.flatMap((node) => node.messages).filter((message) => message.kind === 'photo')).toHaveLength(2);
    expect(ru.endings).toHaveLength(7);
    expect(ru.endings.filter((ending) => ending.type === 'good')).toHaveLength(2);
    expect(ru.endings.filter((ending) => ending.type === 'neutral')).toHaveLength(2);
    expect(ru.endings.filter((ending) => ending.type === 'bad')).toHaveLength(2);
    expect(ru.endings.filter((ending) => ending.type === 'secret')).toHaveLength(1);
    expect(ru.endings.some((ending) => ending.blocked)).toBe(true);
    const englishText = en.nodes.flatMap((node) => [
      ...node.messages.flatMap((message) => [message.text ?? '', message.alt ?? '']),
      ...(node.choices ?? []).map((choice) => choice.text),
      node.hint ?? '',
    ]).join(' ');
    expect(englishText).not.toMatch(/[А-Яа-яЁё]/);
  });

  const routes: Record<string, string[]> = {
    lera_good_open: ['lera_start_calm', 'lera_calm_space', 'lera_check_honest', 'lera_truth_respect', 'lera_respect_words', 'lera_no_photo_why', 'lera_deleted_wait', 'lera_reveal_careful', 'lera_final_open'],
    lera_good_date: ['lera_start_flirt', 'lera_flirt_subtle', 'lera_check_tease', 'lera_truth_play', 'lera_play_surprise', 'lera_photo_warm', 'lera_deleted_wait', 'lera_reveal_honest', 'lera_final_date'],
    lera_neutral_morning: ['lera_start_calm', 'lera_calm_space', 'lera_check_honest', 'lera_truth_respect', 'lera_respect_words', 'lera_no_photo_why', 'lera_deleted_ask', 'lera_reveal_careful', 'lera_final_morning'],
    lera_neutral_distance: ['lera_start_ironic', 'lera_ironic_match', 'lera_check_tease', 'lera_truth_play', 'lera_play_words', 'lera_no_photo_why', 'lera_deleted_ask', 'lera_reveal_suspicious', 'lera_final_distance'],
    lera_bad_cold: ['lera_start_risky', 'lera_risky_demand', 'lera_pressure_double'],
    lera_bad_blocked: ['lera_start_risky', 'lera_risky_demand', 'lera_pressure_insult'],
    lera_secret_known: ['lera_start_risky', 'lera_risky_honest', 'lera_truth_respect', 'lera_respect_clue', 'lera_gallery_truth', 'lera_deleted_guess', 'lera_outfit_person', 'lera_reveal_honest', 'lera_final_secret'],
  };

  it.each(Object.entries(routes))('reaches authored ending %s', (endingId, route) => {
    expect(playRoute(route).progress.endingId).toBe(endingId);
  });

  it('keeps adult photos out of promo and verifies every asset on disk', () => {
    const dialogues = getDialogues('ru');
    expect(() => validateAdultStoryAssets(dialogues)).not.toThrow();
    expect(ADULT_STORY_ASSETS.every((asset) => asset.characterAge >= 18 && asset.contentRating === '18+' && asset.promoAllowed === false)).toBe(true);
    ADULT_STORY_ASSETS.forEach((asset) => expect(existsSync(join(process.cwd(), 'public', asset.asset.replace(/^\//, '')))).toBe(true));
    const lera = getLeraDialogue('ru');
    const photoNodes = lera.nodes.filter((node) => node.messages.some((message) => message.kind === 'photo'));
    expect(photoNodes.every((node) => node.promoSafe !== true)).toBe(true);
  });

  it('translates an existing photo transcript RU → EN without changing its image', () => {
    const route = ['lera_start_calm', 'lera_calm_space', 'lera_check_honest', 'lera_truth_respect', 'lera_respect_mood'];
    const { progress } = playRoute(route);
    const photo = progress.history.find((message) => message.sourceId === 'lera_photo_one')!;
    const ru = resolveTranscriptMessage(photo, getLeraDialogue('ru'));
    const en = resolveTranscriptMessage(photo, getLeraDialogue('en'));
    expect(ru.image).toBe('/assets/characters/lera/story/night-01.webp');
    expect(en.image).toBe(ru.image);
    expect(ru.alt).toContain('взрослая женщина 24 лет');
    expect(en.alt).toContain('adult woman age 24');
    expect(en.text).not.toMatch(/[А-Яа-яЁё]/);
    expect(getLeraDialogue('en').nodes.find((node) => node.id === progress.currentNodeId)?.hint).toBeTruthy();
  });

  it('keeps Camila and Lera ending archives separated by dialogue ID', () => {
    const dialogues = getDialogues('en');
    const ids = Object.fromEntries(dialogues.map((dialogue) => [dialogue.id, dialogue.endings.map((ending) => ending.id)]));
    expect(ids.camila.every((id: string) => !id.startsWith('lera_'))).toBe(true);
    expect(ids.lera.every((id: string) => id.startsWith('lera_'))).toBe(true);
  });
});

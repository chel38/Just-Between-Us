/// <reference types="node" />
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ADULT_STORY_ASSETS, validateAdultStoryAssets } from '../../content/assets/adultAssetManifest';
import { getDialogues } from '../../content/dialogues';
import { getLeraDialogue } from '../../content/dialogues/lera';
import { auditLeraScenario, serializeLeraScenarioLogic } from '../../content/dialogues/lera/scenarioAudit';
import { DialogueEngine } from '../dialogue/dialogueEngine';
import { resolveTranscriptMessage } from '../dialogue/transcriptResolver';
import { validateDialogue, validateDialoguePair } from '../dialogue/dialogueValidator';

const legacyNodeIds = [
  'lera_start', 'lera_calm_entry', 'lera_ironic_entry', 'lera_confident_entry', 'lera_flirt_entry',
  'lera_risky_entry', 'lera_midnight_check', 'lera_truth_game', 'lera_boundary_respect',
  'lera_boundary_play', 'lera_boundary_pressure', 'lera_photo_scene', 'lera_no_photo_scene',
  'lera_warning_scene', 'lera_gallery_clue', 'lera_deleted_scene', 'lera_outfit_scene', 'lera_reveal',
  'lera_final_choice', 'lera_end_open', 'lera_end_date', 'lera_end_morning', 'lera_end_distance',
  'lera_end_cold', 'lera_end_blocked', 'lera_end_secret',
];

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
  it.each(['ru', 'en'] as const)('validates the complete %s graph and scenario audit', (language) => {
    const dialogue = getLeraDialogue(language);
    expect(() => validateDialogue(dialogue)).not.toThrow();
    expect(auditLeraScenario(dialogue)).toEqual([]);
  });

  it('keeps every legacy node ID for exact currentNodeId save compatibility', () => {
    const ids = new Set(getLeraDialogue('ru').nodes.map((node) => node.id));
    expect(legacyNodeIds.every((id) => ids.has(id))).toBe(true);
  });

  it('keeps RU and EN graph logic, flags, effects, events, images, and context identical', () => {
    const ru = getLeraDialogue('ru');
    const en = getLeraDialogue('en');
    expect(() => validateDialoguePair(ru, en)).not.toThrow();
    expect(en.nodes.map(serializeLeraScenarioLogic)).toEqual(ru.nodes.map(serializeLeraScenarioLogic));
  });

  it('has five real player-first openings with distinct replies and remembered tone flags', () => {
    const dialogue = getLeraDialogue('ru');
    const start = dialogue.nodes.find((node) => node.id === dialogue.startNodeId)!;
    expect(start.messages).toHaveLength(0);
    expect(start.choices).toHaveLength(5);
    expect(new Set(start.choices!.map((choice) => choice.next)).size).toBe(5);
    expect(start.choices!.every((choice) => choice.effects?.setFlags?.some((flag) => flag.startsWith('lera_started_')))).toBe(true);
    const replies = start.choices!.map((choice) => dialogue.nodes.find((node) => node.id === choice.next)!.messages.map((message) => message.text).join('\n'));
    expect(new Set(replies).size).toBe(5);
  });

  it('states one contact canon and never claims Lera wrote first or that they already met', () => {
    const ru = getLeraDialogue('ru');
    const en = getLeraDialogue('en');
    const characterText = (dialogue: typeof ru) => dialogue.nodes.flatMap((node) => node.messages.filter((message) => message.sender === 'character').map((message) => message.text ?? '')).join('\n');
    expect(characterText(ru)).toContain('это я попросила Надю передать тебе мой контакт');
    expect(characterText(en)).toContain('I asked Nadia to give you my contact');
    expect(characterText(ru)).not.toMatch(/написала первой|написать решила я сама|Надя дала мне твой контакт|после нашей встречи/i);
    expect(characterText(en)).not.toMatch(/texted first|I decided to text|Nadia gave me your contact|after we met/i);
    expect(characterText(ru)).toContain('мы тогда даже толком не познакомились');
    expect(characterText(en)).toContain('we never really met that night');
  });

  it('keeps the whole messenger story remote, including the future-date ending', () => {
    const contexts = getLeraDialogue('ru').nodes.map((node) => node.sceneContext!);
    expect(contexts.every((context) => context.playerLocation === 'player_home')).toBe(true);
    expect(contexts.every((context) => context.characterLocation === 'lera_home')).toBe(true);
    expect(contexts.every((context) => context.playerLocation !== context.characterLocation)).toBe(true);
  });

  it('has two good, two neutral, two bad, and one secret ending', () => {
    const endings = getLeraDialogue('ru').endings;
    expect(endings).toHaveLength(7);
    expect(endings.filter((ending) => ending.type === 'good')).toHaveLength(2);
    expect(endings.filter((ending) => ending.type === 'neutral')).toHaveLength(2);
    expect(endings.filter((ending) => ending.type === 'bad')).toHaveLength(2);
    expect(endings.filter((ending) => ending.type === 'secret')).toHaveLength(1);
    expect(endings.some((ending) => ending.blocked)).toBe(true);
  });

  const routes: Record<string, string[]> = {
    lera_good_open: ['lera_start_calm', 'lera_calm_space', 'lera_check_honest', 'lera_truth_respect', 'lera_respect_clue', 'lera_gallery_lie', 'lera_deleted_wait', 'lera_outfit_person', 'lera_reveal_careful', 'lera_final_open'],
    lera_good_date: ['lera_start_flirt', 'lera_flirt_subtle', 'lera_check_tease', 'lera_truth_play', 'lera_play_surprise', 'lera_no_photo_why', 'lera_photo_warm', 'lera_deleted_wait', 'lera_outfit_person', 'lera_reveal_honest', 'lera_final_date'],
    lera_neutral_morning: ['lera_start_confident', 'lera_confident_clear', 'lera_check_honest', 'lera_truth_respect', 'lera_respect_words', 'lera_no_photo_gallery', 'lera_gallery_lie', 'lera_deleted_ask', 'lera_outfit_person', 'lera_reveal_careful', 'lera_final_morning'],
    lera_neutral_distance: ['lera_start_ironic', 'lera_ironic_match', 'lera_check_tease', 'lera_truth_play', 'lera_play_words', 'lera_no_photo_gallery', 'lera_gallery_lie', 'lera_deleted_ask', 'lera_outfit_person', 'lera_reveal_suspicious', 'lera_final_distance'],
    lera_bad_cold: ['lera_start_risky', 'lera_risky_demand', 'lera_pressure_double'],
    lera_bad_blocked: ['lera_start_risky', 'lera_risky_demand', 'lera_pressure_apologize', 'lera_warning_demand'],
    lera_secret_known: ['lera_start_calm', 'lera_calm_space', 'lera_check_honest', 'lera_truth_respect', 'lera_respect_words', 'lera_no_photo_why', 'lera_photo_expression', 'lera_gallery_truth', 'lera_deleted_guess', 'lera_outfit_detail', 'lera_reveal_careful', 'lera_final_secret'],
  };

  it.each(Object.entries(routes))('reaches authored ending %s through a distinct QA route', (endingId, route) => {
    expect(playRoute(route).progress.endingId).toBe(endingId);
  });

  it('programmatically reaches the voluntary lingerie photo only after trust, attraction, respect, and no pressure', () => {
    const route = ['lera_start_calm', 'lera_calm_space', 'lera_check_honest', 'lera_truth_respect', 'lera_respect_words', 'lera_no_photo_why'];
    const { progress } = playRoute(route);
    expect(progress.currentNodeId).toBe('lera_photo_scene');
    expect(progress.flags).toContain('lera_received_lingerie_photo');
    expect(progress.flags).not.toContain('lera_pushed_for_photo');
    expect(progress.relationship).toMatchObject({ trust: 9, attraction: 2, respect: 7 });
    const photo = progress.history.find((message) => message.sourceId === 'lera_photo_one')!;
    expect(photo.image).toBe('./assets/characters/lera/story/lera-lingerie-01.png');
  });

  it('keeps both adult photos out of promo and verifies assets and identity references on disk', () => {
    const dialogues = getDialogues('ru');
    expect(() => validateAdultStoryAssets(dialogues)).not.toThrow();
    const leraAssets = ADULT_STORY_ASSETS.filter((asset) => asset.characterId === 'lera');
    expect(leraAssets.map((asset) => asset.purpose).sort()).toEqual(['relationship', 'story-clue']);
    expect(leraAssets.every((asset) => asset.characterAge === 24 && asset.contentRating === '18+' && asset.promoAllowed === false)).toBe(true);
    for (const asset of leraAssets) {
      expect(existsSync(join(process.cwd(), 'public', asset.asset.replace(/^\.\//, '')))).toBe(true);
      expect(existsSync(join(process.cwd(), 'public', asset.identityReference.replace(/^\.\//, '')))).toBe(true);
    }
    const photoNodes = getLeraDialogue('ru').nodes.filter((node) => node.messages.some((message) => message.kind === 'photo'));
    expect(photoNodes).toHaveLength(2);
    expect(photoNodes.every((node) => node.promoSafe !== true)).toBe(true);
  });

  it('resolves existing photo transcripts RU → EN without changing their assets', () => {
    const route = ['lera_start_calm', 'lera_calm_space', 'lera_check_honest', 'lera_truth_respect', 'lera_respect_words', 'lera_no_photo_why'];
    const { progress } = playRoute(route);
    const photo = progress.history.find((message) => message.sourceId === 'lera_photo_one')!;
    const ru = resolveTranscriptMessage(photo, getLeraDialogue('ru'));
    const en = resolveTranscriptMessage(photo, getLeraDialogue('en'));
    expect(en.image).toBe(ru.image);
    expect(ru.alt).toContain('24 лет');
    expect(en.alt).toContain('age 24');
    expect(en.text).not.toMatch(/[А-Яа-яЁё]/);
  });

  it('keeps Camila and Lera ending archives separated by dialogue ID', () => {
    const dialogues = getDialogues('en');
    const ids = Object.fromEntries(dialogues.map((dialogue) => [dialogue.id, dialogue.endings.map((ending) => ending.id)]));
    expect(ids.camila.every((id: string) => !id.startsWith('lera_'))).toBe(true);
    expect(ids.lera.every((id: string) => id.startsWith('lera_'))).toBe(true);
  });
});

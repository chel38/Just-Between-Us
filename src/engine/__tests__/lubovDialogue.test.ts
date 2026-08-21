/// <reference types="node" />
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getDialogues } from '../../content/dialogues';
import { LUBOV_ASSETS } from '../../content/dialogues/lubov/assets';
import { estimateLubovRouteMinutes } from '../../content/dialogues/lubov/durationEstimator';
import { getLubovDialogue } from '../../content/dialogues/lubov';
import { auditLubovScenario, serializeLubovLogic } from '../../content/dialogues/lubov/scenarioAudit';
import { DialogueEngine } from '../dialogue/dialogueEngine';
import { resolveTranscriptMessage } from '../dialogue/transcriptResolver';
import { validateDialogue, validateDialoguePair } from '../dialogue/dialogueValidator';

function playRoute(choiceIds: readonly string[], language: 'ru' | 'en' = 'ru') {
  const dialogue = getLubovDialogue(language);
  const engine = new DialogueEngine(dialogue);
  let progress = engine.createProgress();
  let now = 1_000;
  const drain = () => {
    for (const pending of engine.pendingMessages(progress)) progress = engine.appendScriptMessage(progress, pending, pending.text ?? '', now++);
    progress = engine.finishCurrentNode(progress, now++);
  };
  if (!progress.awaitingChoice) drain();
  for (const choiceId of choiceIds) {
    expect(engine.availableChoices(progress).map((choice) => choice.id), `at ${progress.currentNodeId}`).toContain(choiceId);
    progress = engine.choose(progress, choiceId, now++);
    drain();
  }
  return { dialogue, progress };
}

const fullTruthPrefix = [
  'lubov_start_explain', 'lubov_reaction_explain_notice', 'lubov_ask_who', 'lubov_ask_man_continue',
  'lubov_first_questions_timeline', 'lubov_evidence_count_minutes', 'lubov_partial_show_chat',
  'lubov_chat_offer_all', 'lubov_planned_chat_lie', 'lubov_forward_stay_answer',
  'lubov_forward_answer_hurt', 'lubov_full_admission_crosscheck', 'lubov_timeline_crosscheck_chat',
  'lubov_full_chat_love', 'lubov_rage_peak_take_responsibility', 'lubov_after_rage_why',
  'lubov_why_responsibility', 'lubov_love_question_husband', 'lubov_loved_me_choice',
  'lubov_artem_choice_cut', 'lubov_caught_question_thanks', 'lubov_tonight_shared_home',
  'lubov_suitcase_keys', 'lubov_keys_context_fair', 'lubov_property_transition_mortgage',
  'lubov_mortgage_list', 'lubov_bank_acknowledge',
] as const;

const hostilePrefix = [
  'lubov_start_rage', 'lubov_reaction_rage_repeat', 'lubov_ask_call_lie', 'lubov_call_lie_repeat',
  'lubov_first_questions_katya', 'lubov_evidence_one_kiss', 'lubov_partial_accuse', 'lubov_chat_offer_all',
  'lubov_planned_chat_lie', 'lubov_forward_stay_answer', 'lubov_forward_answer_rage',
  'lubov_full_admission_crosscheck', 'lubov_timeline_crosscheck_chat', 'lubov_full_chat_caps',
  'lubov_rage_peak_cold', 'lubov_after_rage_why', 'lubov_why_blame', 'lubov_love_question_husband',
  'lubov_loved_me_choice', 'lubov_artem_choice_no_promise', 'lubov_caught_question_rage', 'lubov_tonight_decide',
] as const;

const routes: Record<string, readonly string[]> = {
  lubov_end_period: [...fullTruthPrefix, 'lubov_final_divorce', 'lubov_divorce_tone_period'],
  lubov_end_honest_divorce: [...fullTruthPrefix, 'lubov_final_divorce', 'lubov_divorce_tone_honest'],
  lubov_end_try_again: [...fullTruthPrefix, 'lubov_final_try'],
  lubov_end_whole_truth: [...fullTruthPrefix, 'lubov_final_divorce', 'lubov_divorce_tone_whole_truth'],
  lubov_end_separate: [...fullTruthPrefix, 'lubov_final_separate'],
  lubov_end_without_trust: [...hostilePrefix, 'lubov_suitcase_keys', 'lubov_keys_context_change_locks', 'lubov_property_boundary_double', 'lubov_property_transition_mortgage', 'lubov_mortgage_keep', 'lubov_bank_accuse', 'lubov_final_practical'],
  lubov_end_war: [...hostilePrefix, 'lubov_suitcase_throw', 'lubov_property_boundary_double', 'lubov_property_transition_mortgage', 'lubov_mortgage_war', 'lubov_bank_accuse', 'lubov_final_war'],
  lubov_end_chooses_him: [...hostilePrefix, 'lubov_suitcase_keys', 'lubov_keys_context_fair', 'lubov_property_transition_mortgage', 'lubov_mortgage_list', 'lubov_bank_not_point', 'lubov_final_him'],
  lubov_end_blocked: ['lubov_start_rage', 'lubov_reaction_rage_repeat', 'lubov_ask_who', 'lubov_ask_man_continue', 'lubov_first_questions_truth', 'lubov_evidence_one_kiss', 'lubov_partial_show_chat', 'lubov_chat_offer_last', 'lubov_forward_stay_insult', 'lubov_boundary_one_repeat'],
};

describe('Lyubov — The Last Lie', () => {
  it.each(['ru', 'en'] as const)('validates the complete %s graph and scenario logic', (language) => {
    const dialogue = getLubovDialogue(language);
    expect(() => validateDialogue(dialogue)).not.toThrow();
    expect(auditLubovScenario(dialogue)).toEqual([]);
  });

  it('keeps RU and EN IDs, effects, conditions, events, attachments, and locations identical', () => {
    const ru = getLubovDialogue('ru');
    const en = getLubovDialogue('en');
    expect(() => validateDialoguePair(ru, en)).not.toThrow();
    expect(en.nodes.map(serializeLubovLogic)).toEqual(ru.nodes.map(serializeLubovLogic));
  });

  it('starts with the player sending distant evidence, then exposes five distinct openings', () => {
    const dialogue = getLubovDialogue('ru');
    const engine = new DialogueEngine(dialogue);
    const progress = engine.createProgress();
    expect(progress.awaitingChoice).toBe(false);
    expect(engine.pendingMessages(progress)[0]).toMatchObject({ sender: 'player', kind: 'attachment', attachment: { id: 'lubov_proof_embrace_01', promoAllowed: false } });
    const played = playRoute([], 'ru').progress;
    expect(new DialogueEngine(dialogue).availableChoices(played)).toHaveLength(5);
  });

  it('keeps every story asset private, adult, present on disk, and used by the graph', () => {
    expect(LUBOV_ASSETS).toHaveLength(5);
    for (const asset of LUBOV_ASSETS) {
      expect(asset.adultCharacters).toBe(true);
      expect(asset.promoAllowed).toBe(false);
      expect(existsSync(join(process.cwd(), 'public', asset.asset.replace(/^\.\//, '')))).toBe(true);
    }
    const used = new Set(getLubovDialogue('ru').nodes.flatMap((node) => node.messages.map((message) => message.attachment?.asset).filter(Boolean)));
    expect(LUBOV_ASSETS.every((asset) => used.has(asset.asset))).toBe(true);
  });

  it.each(Object.entries(routes))('reaches authored ending %s through accumulated state', (endingId, route) => {
    expect(playRoute(route).progress.endingId).toBe(endingId);
  });

  it('reaches nine distinct endings, including one secret and an earned block', () => {
    expect(new Set(Object.keys(routes))).toEqual(new Set(getLubovDialogue('ru').endings.map((ending) => ending.id)));
    expect(getLubovDialogue('ru').endings.filter((ending) => ending.type === 'secret')).toHaveLength(1);
    expect(getLubovDialogue('ru').endings.some((ending) => ending.blocked)).toBe(true);
  });

  it.each(Object.entries(routes).filter(([ending]) => ending !== 'lubov_end_blocked'))('estimates main route %s at roughly 40–50 minutes', (_endingId, route) => {
    const minutes = estimateLubovRouteMinutes(getLubovDialogue('ru'), route);
    expect(minutes).toBeGreaterThanOrEqual(40);
    expect(minutes).toBeLessThanOrEqual(50);
  });

  it('localizes saved attachments dynamically without changing stable evidence or entry IDs', () => {
    const { progress } = playRoute(fullTruthPrefix.slice(0, 14));
    const screenshot = progress.history.find((message) => message.attachment?.id === 'lubov_planned_chat_01')!;
    const ru = resolveTranscriptMessage(screenshot, getLubovDialogue('ru')).attachment!;
    const en = resolveTranscriptMessage(screenshot, getLubovDialogue('en')).attachment!;
    expect(en.id).toBe(ru.id);
    expect(en.entries?.map((entry) => entry.id)).toEqual(ru.entries?.map((entry) => entry.id));
    expect(en.entries?.map((entry) => entry.text).join(' ')).not.toMatch(/[А-Яа-яЁё]/);
  });

  it('registers Lyubov as a real third dialogue instead of an upcoming placeholder', () => {
    expect(getDialogues('en').map((dialogue) => dialogue.id)).toEqual(['camila', 'lera', 'lubov']);
  });
});

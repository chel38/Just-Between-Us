import { describe, expect, it } from 'vitest';
import { getCamilaDialogue } from '../../content/dialogues/camila';
import { auditCamilaScenario, serializeScenarioLogic } from '../../content/dialogues/camila/scenarioAudit';

const legacyNodeIds = [
  'start', 'warm_1', 'warm_2', 'bold_1', 'bold_2', 'flirt_1', 'flirt_2', 'careful_1', 'careful_2',
  'risky_1', 'risky_2', 'crossing', 'stairwell', 'threshold', 'archive', 'recording', 'interlude',
  'midnight', 'second_room', 'fracture', 'mark', 'aftershock', 'reckoning', 'decision',
  'end_good_dawn', 'end_good_equal', 'end_neutral_archive', 'end_neutral_truth', 'end_bad_erased',
  'end_bad_blocked', 'end_secret',
];

describe('Camila scenario consistency', () => {
  it.each(['ru', 'en'] as const)('passes location, timeline, message, and meeting audit in %s', (language) => {
    expect(auditCamilaScenario(getCamilaDialogue(language))).toEqual([]);
  });

  it('keeps every legacy node ID for exact currentNodeId save compatibility', () => {
    const ids = new Set(getCamilaDialogue('ru').nodes.map((node) => node.id));
    expect(legacyNodeIds.every((id) => ids.has(id))).toBe(true);
  });

  it('keeps RU and EN transitions, conditions, effects, events, and scene contexts identical', () => {
    const ru = getCamilaDialogue('ru').nodes.map(serializeScenarioLogic);
    const en = getCamilaDialogue('en').nodes.map(serializeScenarioLogic);
    expect(en).toEqual(ru);
  });

  it('gives all five opening approaches a distinct first response from the remote workshop', () => {
    const dialogue = getCamilaDialogue('ru');
    const start = dialogue.nodes.find((node) => node.id === 'start')!;
    const destinations = start.choices!.map((choice) => dialogue.nodes.find((node) => node.id === choice.next)!);
    expect(new Set(destinations.map((node) => node.messages.map((message) => message.text).join('\n'))).size).toBe(5);
    expect(destinations.every((node) => node.sceneContext?.characterLocation === 'restoration_workshop')).toBe(true);
  });

  it('keeps the player remote during the stairwell, apartment 47, and door-threat scenes', () => {
    const nodes = new Map(getCamilaDialogue('ru').nodes.map((node) => [node.id, node]));
    expect(nodes.get('stairwell')?.sceneContext).toMatchObject({ playerLocation: 'apartment_46', characterLocation: 'stairwell_floor_6' });
    expect(nodes.get('archive')?.sceneContext).toMatchObject({ playerLocation: 'apartment_46', characterLocation: 'apartment_47' });
    expect(nodes.get('midnight')?.sceneContext).toMatchObject({ playerLocation: 'apartment_46', characterLocation: 'apartment_39' });
    expect(nodes.get('mark')?.sceneContext).toMatchObject({ playerLocation: 'apartment_46', characterLocation: 'apartment_39' });
  });

  it('reserves physical colocation for good and secret ending payoffs', () => {
    const dialogue = getCamilaDialogue('ru');
    const colocated = dialogue.nodes
      .filter((node) => node.sceneContext?.playerLocation === node.sceneContext?.characterLocation)
      .map((node) => node.id);
    expect(colocated).toEqual(['end_good_dawn', 'end_good_equal', 'end_secret']);
  });

  it('gates the 07:14 and secret deductions behind facts the player actually observed', () => {
    const nodes = new Map(getCamilaDialogue('ru').nodes.map((node) => [node.id, node]));
    for (const choiceId of ['recording_time', 'midnight_code', 'reckoning_secret']) {
      const choice = [...nodes.values()].flatMap((node) => node.choices ?? []).find((item) => item.id === choiceId)!;
      expect(choice.conditions?.requiresFlags).toContain('noticed_time');
    }
    const finalSecret = nodes.get('decision')!.choices!.find((choice) => choice.id === 'final_secret')!;
    expect(finalSecret.conditions?.requiresFlags).toEqual(expect.arrayContaining(['solved_mirror', 'kept_copy', 'called_her_bluff']));
  });

  it('shows visible follow-up messages for stairwell and door-threat decisions', () => {
    const dialogue = getCamilaDialogue('ru');
    const thresholdFlags = dialogue.nodes.find((node) => node.id === 'threshold')!.messages
      .flatMap((message) => message.conditions?.requiresFlags ?? []);
    expect(thresholdFlags).toEqual(expect.arrayContaining(['observed_mark', 'tested_mark', 'spoke_to_mark', 'chose_safety']));

    const aftershockFlags = dialogue.nodes.find((node) => node.id === 'aftershock')!.messages
      .flatMap((message) => message.conditions?.requiresFlags ?? []);
    expect(aftershockFlags).toEqual(expect.arrayContaining(['gave_camila_choice', 'police_have_evidence', 'set_trap', 'opened_door']));
  });
});

import { describe, expect, it } from 'vitest';
import { getCamilaDialogue } from '../../content/dialogues/camila';
import { DialogueEngine } from '../dialogue/dialogueEngine';
import { validateDialogue } from '../dialogue/dialogueValidator';

describe('Camila dialogue graph', () => {
  it.each(['ru', 'en'] as const)('validates the %s graph without broken paths', (language) => {
    expect(() => validateDialogue(getCamilaDialogue(language))).not.toThrow();
  });

  it('starts with exactly five real branches', () => {
    const dialogue = getCamilaDialogue('ru');
    const start = dialogue.nodes.find((node) => node.id === dialogue.startNodeId)!;
    expect(start.messages).toHaveLength(0);
    expect(start.choices).toHaveLength(5);
    expect(new Set(start.choices!.map((choice) => choice.next)).size).toBe(5);
  });

  it('contains two good, two neutral, two bad, and one secret ending', () => {
    const endings = getCamilaDialogue('ru').endings;
    expect(endings).toHaveLength(7);
    expect(endings.filter((ending) => ending.type === 'good')).toHaveLength(2);
    expect(endings.filter((ending) => ending.type === 'neutral')).toHaveLength(2);
    expect(endings.filter((ending) => ending.type === 'bad')).toHaveLength(2);
    expect(endings.filter((ending) => ending.type === 'secret')).toHaveLength(1);
  });

  it('has complete English story text', () => {
    const dialogue = getCamilaDialogue('en');
    const text = dialogue.nodes.flatMap((node) => [
      ...node.messages.map((message) => message.text ?? ''),
      ...(node.choices ?? []).map((choice) => choice.text),
    ]).join(' ');
    expect(text).not.toMatch(/[А-Яа-яЁё]/);
    expect(text).not.toContain('Translation unavailable');
  });
});

describe('reachable authored endings', () => {
  const routes: Record<string, string[]> = {
    secret_0714: ['start_risky','risky_stay','risky_copy','crossing_copy','stairs_observe','threshold_metadata','archive_privacy','recording_time','interlude_empathy','midnight_code','second_share','fracture_bluff','mark_choice','after_stay','reckoning_secret','final_secret'],
    good_dawn: ['start_careful','careful_details','careful_ten','crossing_meet','stairs_retreat','threshold_metadata','archive_privacy','recording_silence','interlude_empathy','midnight_call','second_question','fracture_mark','mark_choice','after_stay','reckoning_honest','final_dawn'],
    good_equal: ['start_flirt','flirt_keep','flirt_support','crossing_meet','stairs_observe','threshold_metadata','archive_privacy','recording_silence','interlude_accept_fact','midnight_go','second_question','fracture_mark','mark_choice','after_stay','reckoning_honest','final_equal'],
    neutral_truth: ['start_risky','risky_photo','risky_accuse','crossing_copy','stairs_signal','threshold_camila','archive_read','recording_fact','interlude_accept_fact','midnight_camera','second_question','fracture_stop','mark_trap','after_distance','reckoning_end','final_truth'],
    neutral_archive: ['start_warm','warm_return','warm_question','crossing_meet','stairs_retreat','threshold_leave','archive_privacy','recording_silence','interlude_empathy','midnight_call','second_question','fracture_mark','mark_police','after_distance','reckoning_end','final_archive'],
    bad_erased: ['start_bold','bold_hold','bold_lie','crossing_copy','stairs_signal','threshold_camila','archive_destroy','recording_angry','interlude_leave','midnight_camera','second_lie_copy','fracture_stop','mark_open','after_condemn','reckoning_end','final_erased'],
    bad_blocked: ['start_flirt','flirt_keep','flirt_support','crossing_meet','stairs_signal','threshold_camila','archive_read','recording_angry','interlude_leave','midnight_camera','second_question','fracture_stop','mark_open','after_condemn','reckoning_end','final_block'],
  };

  it.each(Object.entries(routes))('reaches %s with accumulated state', (endingId, choiceIds) => {
    const dialogue = getCamilaDialogue('ru');
    const engine = new DialogueEngine(dialogue);
    let progress = engine.createProgress();
    for (const choiceId of choiceIds) {
      expect(engine.availableChoices(progress).map((choice) => choice.id), `at ${progress.currentNodeId}`).toContain(choiceId);
      progress = engine.choose(progress, choiceId);
      progress = engine.finishCurrentNode(progress);
    }
    expect(progress.endingId).toBe(endingId);
  });
});

import type { Conditions, DialogueChoice, DialogueNode, Effects, ScriptMessage, StoryAttachment } from '../../../types/dialogue';
import type { LubovAttachmentId } from './attachments';
import { lubovSceneContexts } from './sceneContext';

export type LubovCopy = Record<string, string>;

export function buildLubovNodes(copy: LubovCopy, attachments: Record<LubovAttachmentId, StoryAttachment>): DialogueNode[] {
  const message = (id: string, sender: ScriptMessage['sender'] = 'character', extra: Partial<ScriptMessage> = {}): ScriptMessage => ({
    id,
    sender,
    text: copy[id],
    typing: sender === 'character',
    ...extra,
  });
  const attached = (id: string, sender: ScriptMessage['sender'], attachmentId: LubovAttachmentId, extra: Partial<ScriptMessage> = {}): ScriptMessage => message(id, sender, { kind: 'attachment', attachment: attachments[attachmentId], ...extra });
  const choice = (id: string, next: string, effects?: Effects, conditions?: Conditions, tone?: DialogueChoice['tone']): DialogueChoice => ({ id, text: copy[id], next, effects, conditions, tone });
  const node = (id: string, chapter: number, messages: ScriptMessage[], choices?: DialogueChoice[], extra: Partial<DialogueNode> = {}): DialogueNode => ({
    id,
    chapter,
    messages,
    choices,
    hint: choices?.length ? copy[`hint_${id}`] : undefined,
    sceneContext: lubovSceneContexts[id],
    ...extra,
  });

  return [
    node('lubov_start', 1, [
      attached('lubov_start_proof', 'player', 'lubov_proof_embrace_01', { delayMs: 120, typing: false }),
      message('lubov_start_source', 'system', { kind: 'system', delayMs: 350, typing: false }),
    ], [
      choice('lubov_start_explain', 'lubov_reaction_explain', { trust: 1, curiosity: 1, setFlags: ['lubov_started_cold', 'lubov_proof_one_sent'] }, undefined, 'careful'),
      choice('lubov_start_deny', 'lubov_reaction_deny', { trust: 1, irritation: 1, setFlags: ['lubov_started_shocked', 'lubov_proof_one_sent'] }, undefined, 'warm'),
      choice('lubov_start_ultimatum', 'lubov_reaction_ultimatum', { respect: 1, suspicion: 1, setFlags: ['lubov_started_ultimatum', 'lubov_proof_one_sent'] }, undefined, 'bold'),
      choice('lubov_start_sarcastic', 'lubov_reaction_sarcastic', { irritation: 2, curiosity: 1, setFlags: ['lubov_started_sarcastic', 'lubov_proof_one_sent'] }, undefined, 'witty'),
      choice('lubov_start_rage', 'lubov_reaction_rage', { irritation: 4, respect: -1, setFlags: ['lubov_started_rage', 'lubov_proof_one_sent'] }, undefined, 'risky'),
    ]),

    node('lubov_reaction_explain', 1, [message('lubov_reaction_explain_1', 'character', { typingInterrupted: true }), message('lubov_reaction_explain_2'), message('lubov_reaction_explain_3')], [
      choice('lubov_reaction_explain_notice', 'lubov_first_version', { curiosity: 2, suspicion: 1, setFlags: ['lubov_noticed_source_question'] }, undefined, 'careful'),
      choice('lubov_reaction_explain_source', 'lubov_first_version', { trust: 1, setFlags: ['lubov_named_denis'] }, undefined, 'careful'),
      choice('lubov_reaction_explain_repeat', 'lubov_first_version', { irritation: 1 }, undefined, 'bold'),
    ]),
    node('lubov_reaction_deny', 1, [message('lubov_reaction_deny_1', 'character', { typingInterrupted: true }), message('lubov_reaction_deny_2'), message('lubov_reaction_deny_3')], [
      choice('lubov_reaction_deny_notice', 'lubov_first_version', { curiosity: 2, suspicion: 1, setFlags: ['lubov_noticed_source_question'] }, undefined, 'careful'),
      choice('lubov_reaction_deny_confirm', 'lubov_first_version', { irritation: 1, setFlags: ['lubov_player_accepts_identity'] }, undefined, 'bold'),
      choice('lubov_reaction_deny_source', 'lubov_first_version', { trust: 1, setFlags: ['lubov_named_denis'] }, undefined, 'warm'),
    ]),
    node('lubov_reaction_ultimatum', 1, [message('lubov_reaction_ultimatum_1', 'character', { typingInterrupted: true }), message('lubov_reaction_ultimatum_2'), message('lubov_reaction_ultimatum_3')], [
      choice('lubov_reaction_ultimatum_notice', 'lubov_first_version', { curiosity: 2, setFlags: ['lubov_noticed_source_question'] }, undefined, 'careful'),
      choice('lubov_reaction_ultimatum_truth', 'lubov_first_version', { respect: 1, suspicion: 1 }, undefined, 'bold'),
      choice('lubov_reaction_ultimatum_source', 'lubov_first_version', { trust: 1, setFlags: ['lubov_named_denis'] }, undefined, 'careful'),
    ]),
    node('lubov_reaction_sarcastic', 1, [message('lubov_reaction_sarcastic_1', 'character', { typingInterrupted: true }), message('lubov_reaction_sarcastic_2'), message('lubov_reaction_sarcastic_3')], [
      choice('lubov_reaction_sarcastic_notice', 'lubov_first_version', { curiosity: 2, setFlags: ['lubov_noticed_source_question'] }, undefined, 'careful'),
      choice('lubov_reaction_sarcastic_drop', 'lubov_first_version', { respect: 1, irritation: -1 }, undefined, 'warm'),
      choice('lubov_reaction_sarcastic_press', 'lubov_first_version', { irritation: 2 }, undefined, 'risky'),
    ]),
    node('lubov_reaction_rage', 1, [message('lubov_reaction_rage_1', 'character', { typingInterrupted: true }), message('lubov_reaction_rage_2'), message('lubov_reaction_rage_3')], [
      choice('lubov_reaction_rage_notice', 'lubov_first_version', { curiosity: 2, irritation: -1, setFlags: ['lubov_noticed_source_question'] }, undefined, 'careful'),
      choice('lubov_reaction_rage_repeat', 'lubov_first_version', { irritation: 2, respect: -1 }, undefined, 'risky'),
      choice('lubov_reaction_rage_control', 'lubov_first_version', { respect: 2, irritation: -2, setFlags: ['lubov_player_self_control'] }, undefined, 'careful'),
    ]),

    node('lubov_first_version', 2, [
      message('lubov_first_version_1'),
      message('lubov_first_version_2'),
      message('lubov_first_version_3'),
      message('lubov_first_version_4'),
      message('lubov_first_version_5', 'character', { conditions: { requiresFlags: ['lubov_noticed_source_question'] } }),
    ], [
      choice('lubov_ask_who', 'lubov_ask_man', { curiosity: 1 }, undefined, 'careful'),
      choice('lubov_ask_where', 'lubov_ask_place', { curiosity: 1 }, undefined, 'careful'),
      choice('lubov_ask_katya_choice', 'lubov_ask_katya', { suspicion: 2, setFlags: ['lubov_remembered_katya'] }, undefined, 'bold'),
      choice('lubov_ask_call_lie', 'lubov_call_lie', { irritation: 2, suspicion: 2 }, undefined, 'risky'),
    ], { onEnter: { setFlags: ['lubov_claimed_one_kiss'] } }),

    node('lubov_ask_man', 2, [message('lubov_ask_man_1'), message('lubov_ask_man_2'), message('lubov_ask_man_3'), message('lubov_ask_man_4')], [
      choice('lubov_ask_man_continue', 'lubov_first_questions', { curiosity: 1 }, undefined, 'careful'),
      choice('lubov_ask_man_married', 'lubov_first_questions', { suspicion: 1, irritation: 1, setFlags: ['lubov_asked_if_artem_knew'] }, undefined, 'bold'),
      choice('lubov_ask_man_feelings', 'lubov_first_questions', { trust: -1, curiosity: 1 }, undefined, 'warm'),
    ]),
    node('lubov_ask_place', 2, [message('lubov_ask_place_1'), message('lubov_ask_place_2'), message('lubov_ask_place_3'), message('lubov_ask_place_4')], [
      choice('lubov_ask_place_date', 'lubov_first_questions', { curiosity: 2, setFlags: ['lubov_locked_location'] }, undefined, 'careful'),
      choice('lubov_ask_place_inside', 'lubov_first_questions', { suspicion: 2 }, undefined, 'bold'),
      choice('lubov_ask_place_katya', 'lubov_first_questions', { suspicion: 2, setFlags: ['lubov_remembered_katya'] }, undefined, 'careful'),
    ]),
    node('lubov_ask_katya', 2, [message('lubov_ask_katya_1'), message('lubov_ask_katya_2'), message('lubov_ask_katya_3'), message('lubov_ask_katya_4')], [
      choice('lubov_ask_katya_exact', 'lubov_first_questions', { curiosity: 2, suspicion: 1, setFlags: ['lubov_locked_katya_claim'] }, undefined, 'careful'),
      choice('lubov_ask_katya_angry', 'lubov_first_questions', { irritation: 2, respect: -1 }, undefined, 'risky'),
      choice('lubov_ask_katya_calm', 'lubov_first_questions', { respect: 1, setFlags: ['lubov_player_self_control'] }, undefined, 'warm'),
    ]),
    node('lubov_call_lie', 2, [message('lubov_call_lie_1'), message('lubov_call_lie_2'), message('lubov_call_lie_3'), message('lubov_call_lie_4')], [
      choice('lubov_call_lie_specific', 'lubov_first_questions', { curiosity: 2, setFlags: ['lubov_demands_specifics'] }, undefined, 'careful'),
      choice('lubov_call_lie_repeat', 'lubov_first_questions', { irritation: 2, respect: -1 }, undefined, 'risky'),
      choice('lubov_call_lie_listen', 'lubov_first_questions', { trust: 1, setFlags: ['lubov_player_listens'] }, undefined, 'warm'),
    ]),

    node('lubov_first_questions', 3, [
      message('lubov_first_questions_1'),
      message('lubov_first_questions_2'),
      message('lubov_first_questions_3'),
      message('lubov_first_questions_4'),
      message('lubov_first_questions_5', 'character', { conditions: { requiresFlags: ['lubov_asked_if_artem_knew'] } }),
    ], [
      choice('lubov_first_questions_timeline', 'lubov_evidence_break', { curiosity: 3, suspicion: 1, setFlags: ['lubov_timeline_requested'] }, undefined, 'careful'),
      choice('lubov_first_questions_katya', 'lubov_evidence_break', { suspicion: 2, setFlags: ['lubov_remembered_katya'] }, undefined, 'bold'),
      choice('lubov_first_questions_married', 'lubov_evidence_break', { irritation: 1, curiosity: 1, setFlags: ['lubov_asked_if_artem_knew'] }, undefined, 'careful'),
      choice('lubov_first_questions_truth', 'lubov_evidence_break', { respect: 1, trust: 1, setFlags: ['lubov_requested_full_truth'] }, undefined, 'warm'),
    ]),

    node('lubov_evidence_break', 3, [
      attached('lubov_evidence_old_message', 'player', 'lubov_old_message_katya', { delayMs: 250, typing: false }),
      message('lubov_evidence_fourteen', 'player', { delayMs: 600, typing: false }),
      attached('lubov_evidence_hotel', 'player', 'lubov_proof_hotel_02', { delayMs: 750, typing: false }),
      message('lubov_evidence_silence', 'system', { kind: 'status', delayMs: 1400, typing: false }),
      message('lubov_evidence_reply_1', 'character', { typingInterrupted: true, delayMs: 3600 }),
      message('lubov_evidence_reply_2'),
      message('lubov_evidence_reply_3'),
    ], [
      choice('lubov_evidence_count_minutes', 'lubov_partial_admission', { curiosity: 3, suspicion: 2, setFlags: ['lubov_caught_timestamp'] }, undefined, 'careful'),
      choice('lubov_evidence_how_many', 'lubov_partial_admission', { curiosity: 2, setFlags: ['lubov_asked_count'] }, undefined, 'bold'),
      choice('lubov_evidence_one_kiss', 'lubov_partial_admission', { irritation: 2, suspicion: 2, setFlags: ['lubov_named_contradiction'] }, undefined, 'risky'),
      choice('lubov_evidence_start_over', 'lubov_partial_admission', { respect: 2, trust: 1, setFlags: ['lubov_player_self_control'] }, undefined, 'warm'),
    ], { onEnter: { setFlags: ['lubov_old_message_forwarded', 'lubov_proof_two_sent', 'lubov_one_kiss_disproved'] } }),

    node('lubov_partial_admission', 4, [message('lubov_partial_1'), message('lubov_partial_2'), message('lubov_partial_3'), message('lubov_partial_4'), message('lubov_partial_5'), message('lubov_partial_6')], [
      choice('lubov_partial_show_chat', 'lubov_chat_offer', { curiosity: 2, setFlags: ['lubov_requested_chat'] }, undefined, 'careful'),
      choice('lubov_partial_dates_only', 'lubov_timeline_partial', { curiosity: 2, respect: 1, setFlags: ['lubov_requested_dates'] }, undefined, 'careful'),
      choice('lubov_partial_no_files', 'lubov_no_chat', { trust: 1, setFlags: ['lubov_declined_chat'] }, undefined, 'warm'),
      choice('lubov_partial_accuse', 'lubov_chat_offer', { irritation: 2, suspicion: 2, setFlags: ['lubov_player_accuses_planning'] }, undefined, 'risky'),
    ], { onEnter: { setFlags: ['lubov_four_meetings_admitted', 'lubov_physical_two_months'] } }),

    node('lubov_chat_offer', 4, [message('lubov_chat_offer_1'), message('lubov_chat_offer_2'), message('lubov_chat_offer_3'), message('lubov_chat_offer_4')], [
      choice('lubov_chat_offer_all', 'lubov_planned_chat', { curiosity: 3, setFlags: ['lubov_requested_context'] }, undefined, 'careful'),
      choice('lubov_chat_offer_dates', 'lubov_timeline_partial', { respect: 1, curiosity: 1, setFlags: ['lubov_requested_dates'] }, undefined, 'careful'),
      choice('lubov_chat_offer_last', 'lubov_forward_stay', { curiosity: 2, setFlags: ['lubov_requested_last_message'] }, undefined, 'bold'),
      choice('lubov_chat_offer_refuse', 'lubov_no_chat', { trust: 1, setFlags: ['lubov_declined_chat'] }, undefined, 'warm'),
    ]),
    node('lubov_planned_chat', 4, [
      message('lubov_planned_chat_1'),
      attached('lubov_planned_chat_attachment', 'character', 'lubov_planned_chat_01', { delayMs: 1200 }),
      message('lubov_planned_chat_2'),
      message('lubov_planned_chat_3'),
    ], [
      choice('lubov_planned_chat_lie', 'lubov_forward_stay', { irritation: 2, suspicion: 2, setFlags: ['lubov_named_planned_lie'] }, undefined, 'bold'),
      choice('lubov_planned_chat_hurt', 'lubov_forward_stay', { trust: 1, respect: 1, setFlags: ['lubov_expressed_hurt'] }, undefined, 'warm'),
      choice('lubov_planned_chat_context', 'lubov_forward_stay', { curiosity: 2, setFlags: ['lubov_kept_auditing'] }, undefined, 'careful'),
    ], { onEnter: { setFlags: ['lubov_chat_shown', 'lubov_planned_lie_proven'] } }),
    node('lubov_timeline_partial', 4, [message('lubov_timeline_partial_1'), message('lubov_timeline_partial_2'), message('lubov_timeline_partial_3'), message('lubov_timeline_partial_4'), message('lubov_timeline_partial_5')], [
      choice('lubov_timeline_partial_forward', 'lubov_forward_stay', { curiosity: 2 }, undefined, 'careful'),
      choice('lubov_timeline_partial_chat', 'lubov_planned_chat', { curiosity: 2, setFlags: ['lubov_requested_context'] }, undefined, 'bold'),
      choice('lubov_timeline_partial_enough', 'lubov_forward_stay', { trust: 1, setFlags: ['lubov_accepts_dates_for_now'] }, undefined, 'warm'),
    ], { onEnter: { setFlags: ['lubov_dates_shown'] } }),
    node('lubov_no_chat', 4, [message('lubov_no_chat_1'), message('lubov_no_chat_2'), message('lubov_no_chat_3'), message('lubov_no_chat_4')], [
      choice('lubov_no_chat_ask_feelings', 'lubov_forward_stay', { trust: 1, curiosity: 1 }, undefined, 'warm'),
      choice('lubov_no_chat_one_message', 'lubov_forward_stay', { curiosity: 2, setFlags: ['lubov_requested_last_message'] }, undefined, 'careful'),
      choice('lubov_no_chat_regret', 'lubov_forward_stay', { suspicion: 1 }, undefined, 'bold'),
    ], { onEnter: { setFlags: ['lubov_chat_withheld'] } }),

    node('lubov_forward_stay', 4, [message('lubov_forward_stay_1'), attached('lubov_forward_stay_attachment', 'character', 'lubov_forward_stay'), message('lubov_forward_stay_2'), message('lubov_forward_stay_3')], [
      choice('lubov_forward_stay_answer', 'lubov_forward_answer', { curiosity: 3, setFlags: ['lubov_asked_for_her_answer'] }, undefined, 'careful'),
      choice('lubov_forward_stay_meaning', 'lubov_full_admission', { trust: 1, curiosity: 1 }, undefined, 'warm'),
      choice('lubov_forward_stay_insult', 'lubov_boundary_one', { irritation: 3, respect: -3, setFlags: ['lubov_humiliated_once'] }, undefined, 'risky'),
    ], { onEnter: { setFlags: ['lubov_forward_seen'] } }),
    node('lubov_forward_answer', 4, [message('lubov_forward_answer_1'), attached('lubov_forward_answer_attachment', 'character', 'lubov_forward_answer'), message('lubov_forward_answer_2'), message('lubov_forward_answer_3'), message('lubov_forward_answer_4')], [
      choice('lubov_forward_answer_hurt', 'lubov_full_admission', { trust: 1, respect: 1, setFlags: ['lubov_expressed_hurt'] }, undefined, 'warm'),
      choice('lubov_forward_answer_fact', 'lubov_full_admission', { curiosity: 2, setFlags: ['lubov_kept_auditing'] }, undefined, 'careful'),
      choice('lubov_forward_answer_rage', 'lubov_full_admission', { irritation: 2, respect: -1 }, undefined, 'risky'),
    ], { onEnter: { setFlags: ['lubov_answer_seen'] } }),
    node('lubov_boundary_one', 4, [message('lubov_boundary_one_1'), message('lubov_boundary_one_2'), message('lubov_boundary_one_3'), message('lubov_boundary_one_4')], [
      choice('lubov_boundary_one_apologize', 'lubov_full_admission', { respect: 3, irritation: -2, setFlags: ['lubov_repaired_first_boundary'] }, undefined, 'warm'),
      choice('lubov_boundary_one_cold', 'lubov_full_admission', { respect: 1, irritation: 1, setFlags: ['lubov_player_cold'] }, undefined, 'careful'),
      choice('lubov_boundary_one_repeat', 'lubov_end_blocked_node', { irritation: 4, respect: -4, setFlags: ['lubov_abusive_repeat'] }, undefined, 'risky'),
    ]),

    node('lubov_full_admission', 5, [message('lubov_full_admission_1'), message('lubov_full_admission_2'), message('lubov_full_admission_3'), message('lubov_full_admission_4'), message('lubov_full_admission_5'), message('lubov_full_admission_6'), message('lubov_full_admission_7')], [
      choice('lubov_full_admission_crosscheck', 'lubov_timeline_crosscheck', { curiosity: 3, suspicion: 1, setFlags: ['lubov_wants_exact_timeline'] }, undefined, 'careful'),
      choice('lubov_full_admission_last_chat', 'lubov_full_chat', { curiosity: 3, setFlags: ['lubov_wants_full_chat'] }, undefined, 'bold'),
      choice('lubov_full_admission_believe', 'lubov_rage_peak', { trust: 2, respect: 1, setFlags: ['lubov_believes_timeline'] }, undefined, 'warm'),
      choice('lubov_full_admission_manipulation', 'lubov_rage_peak', { irritation: 2, suspicion: 2 }, undefined, 'risky'),
    ], { onEnter: { setFlags: ['lubov_full_admission', 'lubov_timeline_fixed'] } }),
    node('lubov_timeline_crosscheck', 5, [message('lubov_timeline_crosscheck_1'), message('lubov_timeline_crosscheck_2'), message('lubov_timeline_crosscheck_3'), message('lubov_timeline_crosscheck_4'), message('lubov_timeline_crosscheck_5')], [
      choice('lubov_timeline_crosscheck_chat', 'lubov_full_chat', { curiosity: 2, setFlags: ['lubov_wants_full_chat'] }, undefined, 'careful'),
      choice('lubov_timeline_crosscheck_enough', 'lubov_rage_peak', { trust: 1, respect: 1 }, undefined, 'warm'),
      choice('lubov_timeline_crosscheck_rage', 'lubov_rage_peak', { irritation: 2 }, undefined, 'risky'),
    ], { onEnter: { setFlags: ['lubov_timeline_checked', 'lubov_named_contradiction'] } }),
    node('lubov_full_chat', 5, [message('lubov_full_chat_1'), attached('lubov_full_chat_attachment', 'character', 'lubov_full_chat_02', { delayMs: 1600 }), message('lubov_full_chat_2'), message('lubov_full_chat_3'), message('lubov_full_chat_4')], [
      choice('lubov_full_chat_love', 'lubov_rage_peak', { curiosity: 2, trust: 1, setFlags: ['lubov_asked_meaning_of_love'] }, undefined, 'warm'),
      choice('lubov_full_chat_choice', 'lubov_rage_peak', { suspicion: 2, setFlags: ['lubov_noticed_no_choice'] }, undefined, 'careful'),
      choice('lubov_full_chat_caps', 'lubov_rage_peak', { irritation: 3, respect: -1 }, undefined, 'risky'),
    ], { onEnter: { setFlags: ['lubov_full_chat_seen'] } }),

    node('lubov_rage_peak', 5, [message('lubov_rage_peak_1'), message('lubov_rage_peak_2'), message('lubov_rage_peak_3'), message('lubov_rage_peak_4'), message('lubov_rage_peak_5'), message('lubov_rage_peak_6'), message('lubov_rage_peak_7', 'system', { kind: 'status', delayMs: 1300, typing: false }), message('lubov_rage_peak_8')], [
      choice('lubov_rage_peak_hurt', 'lubov_after_rage', { trust: 1, respect: 1, irritation: -1, setFlags: ['lubov_expressed_hurt'] }, undefined, 'warm'),
      choice('lubov_rage_peak_cold', 'lubov_after_rage', { respect: 1, setFlags: ['lubov_player_cold'] }, undefined, 'careful'),
      choice('lubov_rage_peak_take_responsibility', 'lubov_after_rage', { trust: 2, respect: 2, irritation: -2, setFlags: ['lubov_player_owned_marriage_distance'] }, undefined, 'warm'),
      choice('lubov_rage_peak_humiliate', 'lubov_boundary_two', { irritation: 4, respect: -4, setFlags: ['lubov_humiliated_twice'] }, undefined, 'risky'),
    ]),
    node('lubov_boundary_two', 5, [message('lubov_boundary_two_1'), message('lubov_boundary_two_2'), message('lubov_boundary_two_3'), message('lubov_boundary_two_4')], [
      choice('lubov_boundary_two_apologize', 'lubov_after_rage', { respect: 3, irritation: -2, setFlags: ['lubov_repaired_second_boundary'] }, undefined, 'warm'),
      choice('lubov_boundary_two_end_marriage', 'lubov_after_rage', { respect: 1, setFlags: ['lubov_player_cold'] }, undefined, 'careful'),
      choice('lubov_boundary_two_repeat', 'lubov_end_blocked_node', { irritation: 5, respect: -5, setFlags: ['lubov_abusive_repeat'] }, undefined, 'risky'),
    ]),
    node('lubov_after_rage', 6, [message('lubov_after_rage_1'), message('lubov_after_rage_2'), message('lubov_after_rage_3'), message('lubov_after_rage_4'), message('lubov_after_rage_5')], [
      choice('lubov_after_rage_why', 'lubov_why', { curiosity: 2 }, undefined, 'careful'),
      choice('lubov_after_rage_love', 'lubov_love_question', { curiosity: 2 }, undefined, 'bold'),
      choice('lubov_after_rage_caught', 'lubov_caught_question', { curiosity: 2, suspicion: 1 }, undefined, 'careful'),
      choice('lubov_after_rage_done', 'lubov_tonight', { trust: -1, setFlags: ['lubov_skipped_emotional_answers'] }, undefined, 'risky'),
    ], { onEnter: { setFlags: ['lubov_rage_passed'] } }),

    node('lubov_why', 6, [message('lubov_why_1'), message('lubov_why_2'), message('lubov_why_3'), message('lubov_why_4'), message('lubov_why_5'), message('lubov_why_6'), message('lubov_why_7')], [
      choice('lubov_why_responsibility', 'lubov_love_question', { trust: 2, respect: 2, setFlags: ['lubov_heard_accountability'] }, undefined, 'warm'),
      choice('lubov_why_not_excuse', 'lubov_love_question', { respect: 1, suspicion: 1, setFlags: ['lubov_rejected_excuse'] }, undefined, 'careful'),
      choice('lubov_why_blame', 'lubov_love_question', { irritation: 2, respect: -1 }, undefined, 'risky'),
    ], { promoSafe: true }),
    node('lubov_love_question', 6, [message('lubov_love_question_1'), message('lubov_love_question_2'), message('lubov_love_question_3'), message('lubov_love_question_4'), message('lubov_love_question_5')], [
      choice('lubov_love_question_husband', 'lubov_loved_me', { curiosity: 2, trust: 1 }, undefined, 'warm'),
      choice('lubov_love_question_caught', 'lubov_caught_question', { curiosity: 2 }, undefined, 'careful'),
      choice('lubov_love_question_choose', 'lubov_artem_choice', { suspicion: 2 }, undefined, 'bold'),
    ], { promoSafe: true }),
    node('lubov_loved_me', 6, [message('lubov_loved_me_1'), message('lubov_loved_me_2'), message('lubov_loved_me_3'), message('lubov_loved_me_4'), message('lubov_loved_me_5')], [
      choice('lubov_loved_me_caught', 'lubov_caught_question', { trust: 1, curiosity: 1 }, undefined, 'careful'),
      choice('lubov_loved_me_choice', 'lubov_artem_choice', { suspicion: 1 }, undefined, 'bold'),
      choice('lubov_loved_me_silence', 'lubov_caught_question', { respect: 1, setFlags: ['lubov_allowed_silence'] }, undefined, 'warm'),
    ], { promoSafe: true }),
    node('lubov_artem_choice', 6, [message('lubov_artem_choice_1'), message('lubov_artem_choice_2'), message('lubov_artem_choice_3'), message('lubov_artem_choice_4')], [
      choice('lubov_artem_choice_cut', 'lubov_caught_question', { trust: 2, respect: 1, setFlags: ['lubov_cut_artem'] }, undefined, 'warm'),
      choice('lubov_artem_choice_no_promise', 'lubov_caught_question', { trust: -2, suspicion: 2, setFlags: ['lubov_wont_cut_artem'] }, undefined, 'bold'),
      choice('lubov_artem_choice_not_my_order', 'lubov_caught_question', { respect: 2, setFlags: ['lubov_requires_own_choice'] }, undefined, 'careful'),
    ]),
    node('lubov_caught_question', 6, [message('lubov_caught_question_1'), message('lubov_caught_question_2'), message('lubov_caught_question_3'), message('lubov_caught_question_4'), message('lubov_caught_question_5'), message('lubov_caught_question_6')], [
      choice('lubov_caught_question_thanks', 'lubov_tonight', { trust: 2, respect: 2, setFlags: ['lubov_rewarded_honesty'] }, undefined, 'warm'),
      choice('lubov_caught_question_late', 'lubov_tonight', { respect: 1, setFlags: ['lubov_truth_too_late'] }, undefined, 'careful'),
      choice('lubov_caught_question_rage', 'lubov_tonight', { irritation: 2, respect: -1 }, undefined, 'risky'),
    ], { onEnter: { setFlags: ['lubov_no_plan_to_confess'] }, promoSafe: true }),

    node('lubov_tonight', 7, [message('lubov_tonight_1'), message('lubov_tonight_2'), message('lubov_tonight_3'), message('lubov_tonight_4')], [
      choice('lubov_tonight_katya', 'lubov_suitcase', { respect: 1, setFlags: ['lubov_stays_katya'] }, undefined, 'careful'),
      choice('lubov_tonight_get_things', 'lubov_suitcase', { irritation: 1, setFlags: ['lubov_collects_things_later'] }, undefined, 'bold'),
      choice('lubov_tonight_shared_home', 'lubov_suitcase', { respect: 2, setFlags: ['lubov_acknowledged_shared_home'] }, undefined, 'warm'),
      choice('lubov_tonight_decide', 'lubov_suitcase', { trust: -1, setFlags: ['lubov_player_withdraws'] }, undefined, 'risky'),
    ]),
    node('lubov_suitcase', 7, [message('lubov_suitcase_1'), attached('lubov_suitcase_attachment', 'character', 'lubov_suitcase_photo'), message('lubov_suitcase_2'), message('lubov_suitcase_3'), message('lubov_suitcase_4')], [
      choice('lubov_suitcase_keys', 'lubov_keys_context', { curiosity: 1 }, undefined, 'careful'),
      choice('lubov_suitcase_days', 'lubov_keys_context', { respect: 1, setFlags: ['lubov_temporary_separation_open'] }, undefined, 'warm'),
      choice('lubov_suitcase_throw', 'lubov_property_boundary', { irritation: 3, respect: -3, setFlags: ['lubov_property_threat'] }, undefined, 'risky'),
      choice('lubov_suitcase_pause', 'lubov_property_transition', { respect: 2, setFlags: ['lubov_pause_requested'] }, undefined, 'careful'),
    ], { onEnter: { setFlags: ['lubov_suitcase_sent'] } }),
    node('lubov_keys_context', 7, [message('lubov_keys_context_1'), message('lubov_keys_context_2'), message('lubov_keys_context_3'), message('lubov_keys_context_4')], [
      choice('lubov_keys_context_fair', 'lubov_property_transition', { respect: 2, setFlags: ['lubov_property_fair'] }, undefined, 'warm'),
      choice('lubov_keys_context_change_locks', 'lubov_property_boundary', { irritation: 3, respect: -2, setFlags: ['lubov_lock_threat'] }, undefined, 'risky'),
      choice('lubov_keys_context_tomorrow', 'lubov_property_transition', { respect: 1, setFlags: ['lubov_pause_requested'] }, undefined, 'careful'),
    ]),
    node('lubov_property_boundary', 7, [message('lubov_property_boundary_1'), message('lubov_property_boundary_2'), message('lubov_property_boundary_3'), message('lubov_property_boundary_4')], [
      choice('lubov_property_boundary_step_back', 'lubov_property_transition', { respect: 3, irritation: -1, setFlags: ['lubov_property_fair'] }, undefined, 'warm'),
      choice('lubov_property_boundary_lawyer', 'lubov_property_transition', { respect: 1, setFlags: ['lubov_lawyer_needed'] }, undefined, 'careful'),
      choice('lubov_property_boundary_double', 'lubov_property_transition', { irritation: 4, respect: -3, setFlags: ['lubov_property_hostile'] }, undefined, 'risky'),
    ]),
    node('lubov_property_transition', 7, [message('lubov_property_transition_1'), message('lubov_property_transition_2'), message('lubov_property_transition_3'), message('lubov_property_transition_4'), message('lubov_property_transition_5')], [
      choice('lubov_property_transition_mortgage', 'lubov_mortgage', { curiosity: 2, setFlags: ['lubov_property_audit'] }, undefined, 'careful'),
      choice('lubov_property_transition_money', 'lubov_bank', { suspicion: 2, setFlags: ['lubov_money_audit'] }, undefined, 'bold'),
      choice('lubov_property_transition_lawyer', 'lubov_mortgage', { respect: 1, setFlags: ['lubov_lawyer_needed', 'lubov_property_fair'] }, undefined, 'careful'),
      choice('lubov_property_transition_not_tonight', 'lubov_final_decision', { respect: 1, setFlags: ['lubov_property_deferred'] }, undefined, 'warm'),
    ]),
    node('lubov_mortgage', 7, [message('lubov_mortgage_1'), attached('lubov_mortgage_attachment', 'character', 'lubov_mortgage_document'), message('lubov_mortgage_2'), message('lubov_mortgage_3'), message('lubov_mortgage_4')], [
      choice('lubov_mortgage_list', 'lubov_bank', { respect: 2, setFlags: ['lubov_property_fair'] }, undefined, 'careful'),
      choice('lubov_mortgage_sell', 'lubov_bank', { trust: 1, setFlags: ['lubov_sell_apartment_option'] }, undefined, 'warm'),
      choice('lubov_mortgage_keep', 'lubov_bank', { suspicion: 1, setFlags: ['lubov_buyout_option'] }, undefined, 'bold'),
      choice('lubov_mortgage_war', 'lubov_bank', { irritation: 3, respect: -2, setFlags: ['lubov_property_hostile'] }, undefined, 'risky'),
    ], { onEnter: { setFlags: ['lubov_mortgage_seen'] } }),
    node('lubov_bank', 7, [message('lubov_bank_1'), attached('lubov_bank_attachment', 'character', 'lubov_bank_balance'), message('lubov_bank_2'), message('lubov_bank_3'), message('lubov_bank_4'), message('lubov_bank_5')], [
      choice('lubov_bank_acknowledge', 'lubov_final_decision', { trust: 2, respect: 1, setFlags: ['lubov_property_fair'] }, undefined, 'warm'),
      choice('lubov_bank_freeze', 'lubov_final_decision', { suspicion: 1, setFlags: ['lubov_joint_signatures'] }, undefined, 'careful'),
      choice('lubov_bank_accuse', 'lubov_final_decision', { irritation: 2, trust: -1, setFlags: ['lubov_money_accusation'] }, undefined, 'risky'),
      choice('lubov_bank_not_point', 'lubov_final_decision', { respect: 1, setFlags: ['lubov_kept_emotional_focus'] }, undefined, 'warm'),
    ], { onEnter: { setFlags: ['lubov_bank_seen'] } }),

    node('lubov_final_decision', 8, [message('lubov_final_1'), message('lubov_final_2'), message('lubov_final_3'), message('lubov_final_4'), message('lubov_final_5')], [
      choice('lubov_final_divorce', 'lubov_divorce_tone', { setFlags: ['lubov_divorce_chosen'] }, undefined, 'careful'),
      choice('lubov_final_separate', 'lubov_end_separate_node', { setFlags: ['lubov_temporary_separation'] }, undefined, 'warm'),
      choice('lubov_final_try', 'lubov_end_try_again_node', { setFlags: ['lubov_repair_attempt'] }, { requiresFlags: ['lubov_cut_artem', 'lubov_full_admission'], forbiddenFlags: ['lubov_abusive_repeat', 'lubov_property_hostile'], minRelationship: { trust: 3, respect: 3 } }, 'warm'),
      choice('lubov_final_practical', 'lubov_end_without_trust_node', { setFlags: ['lubov_stay_practical'] }, { maxRelationship: { trust: 2 } }, 'risky'),
      choice('lubov_final_him', 'lubov_end_chooses_him_node', { setFlags: ['lubov_chooses_artem'] }, { requiresFlags: ['lubov_wont_cut_artem'] }, 'bold'),
      choice('lubov_final_war', 'lubov_end_war_node', { setFlags: ['lubov_legal_war'] }, { requiresFlags: ['lubov_property_hostile'] }, 'risky'),
    ]),
    node('lubov_divorce_tone', 8, [message('lubov_divorce_tone_1'), message('lubov_divorce_tone_2'), message('lubov_divorce_tone_3')], [
      choice('lubov_divorce_tone_period', 'lubov_end_period_node', { setFlags: ['lubov_marriage_over'] }, undefined, 'careful'),
      choice('lubov_divorce_tone_honest', 'lubov_end_honest_divorce_node', { setFlags: ['lubov_honest_divorce'] }, { requiresFlags: ['lubov_full_admission', 'lubov_property_fair'], forbiddenFlags: ['lubov_abusive_repeat', 'lubov_property_hostile'], minRelationship: { respect: 3 } }, 'warm'),
      choice('lubov_divorce_tone_whole_truth', 'lubov_end_whole_truth_node', { setFlags: ['lubov_whole_truth'] }, { requiresFlags: ['lubov_chat_shown', 'lubov_answer_seen', 'lubov_full_chat_seen', 'lubov_timeline_checked', 'lubov_mortgage_seen', 'lubov_bank_seen', 'lubov_rewarded_honesty'], minRelationship: { curiosity: 8, respect: 4 } }, 'careful'),
    ]),

    node('lubov_end_period_node', 8, [message('lubov_end_period_1'), attached('lubov_end_period_attachment', 'character', 'lubov_ring_keys_photo'), message('lubov_end_period_2'), message('lubov_end_period_3')], undefined, { endingId: 'lubov_end_period', onEnter: { setFlags: ['lubov_ring_sent'] } }),
    node('lubov_end_war_node', 8, [message('lubov_end_war_1'), message('lubov_end_war_2'), attached('lubov_end_war_attachment', 'character', 'lubov_ring_keys_photo'), message('lubov_end_war_3')], undefined, { endingId: 'lubov_end_war', onEnter: { setFlags: ['lubov_ring_sent'] } }),
    node('lubov_end_blocked_node', 8, [message('lubov_end_blocked_1'), message('lubov_end_blocked_2'), message('lubov_end_blocked_3', 'system', { kind: 'status', typing: false })], undefined, { endingId: 'lubov_end_blocked' }),
    node('lubov_end_separate_node', 8, [message('lubov_end_separate_1'), attached('lubov_end_separate_attachment', 'character', 'lubov_keys_photo'), message('lubov_end_separate_2'), message('lubov_end_separate_3')], undefined, { endingId: 'lubov_end_separate', onEnter: { setFlags: ['lubov_keys_sent'] } }),
    node('lubov_end_honest_divorce_node', 8, [message('lubov_end_honest_divorce_1'), attached('lubov_end_honest_divorce_attachment', 'character', 'lubov_ring_keys_photo'), message('lubov_end_honest_divorce_2'), message('lubov_end_honest_divorce_3')], undefined, { endingId: 'lubov_end_honest_divorce', onEnter: { setFlags: ['lubov_ring_sent'] } }),
    node('lubov_end_try_again_node', 8, [message('lubov_end_try_again_1'), message('lubov_end_try_again_2'), message('lubov_end_try_again_3'), message('lubov_end_try_again_4'), message('lubov_end_try_again_5')], undefined, { endingId: 'lubov_end_try_again' }),
    node('lubov_end_without_trust_node', 8, [message('lubov_end_without_trust_1'), message('lubov_end_without_trust_2'), message('lubov_end_without_trust_3'), message('lubov_end_without_trust_4')], undefined, { endingId: 'lubov_end_without_trust' }),
    node('lubov_end_whole_truth_node', 8, [message('lubov_end_whole_truth_1'), message('lubov_end_whole_truth_2'), attached('lubov_end_whole_truth_attachment', 'character', 'lubov_keys_photo'), message('lubov_end_whole_truth_3'), message('lubov_end_whole_truth_4')], undefined, { endingId: 'lubov_end_whole_truth', onEnter: { setFlags: ['lubov_keys_sent'] } }),
    node('lubov_end_chooses_him_node', 8, [message('lubov_end_chooses_him_1'), message('lubov_end_chooses_him_2'), attached('lubov_end_chooses_him_attachment', 'character', 'lubov_ring_keys_photo'), message('lubov_end_chooses_him_3')], undefined, { endingId: 'lubov_end_chooses_him', onEnter: { setFlags: ['lubov_ring_sent'] } }),
  ];
}

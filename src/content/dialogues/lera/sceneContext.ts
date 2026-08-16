import type { SceneContext } from '../../../types/dialogue';

const remote = (
  time: string,
  sceneGoal: string,
  knownFacts: string[],
  immediateRisk: SceneContext['immediateRisk'] = 'low',
): SceneContext => ({
  time,
  playerLocation: 'player_home',
  characterLocation: 'lera_home',
  sceneGoal,
  knownFacts,
  immediateRisk,
});

export const leraSceneContexts: Record<string, SceneContext> = {
  lera_start: remote('00:17', 'player_starts_chat', ['nadia_gave_lera_contact_to_player']),
  lera_calm_entry: remote('00:18', 'respond_to_calm_opening', ['player_wrote_first', 'nadia_gave_lera_contact_to_player']),
  lera_ironic_entry: remote('00:18', 'respond_to_ironic_opening', ['player_wrote_first', 'nadia_gave_lera_contact_to_player']),
  lera_confident_entry: remote('00:18', 'respond_to_confident_opening', ['player_wrote_first', 'shared_gallery_event']),
  lera_flirt_entry: remote('00:18', 'respond_to_flirty_opening', ['player_wrote_first', 'shared_gallery_event']),
  lera_risky_entry: remote('00:18', 'respond_to_direct_opening', ['player_wrote_first', 'nadia_gave_lera_contact_to_player']),
  lera_midnight_check: remote('00:21', 'understand_why_player_wrote', ['player_wrote_first', 'shared_gallery_event', 'nadia_passed_contact']),
  lera_truth_game: remote('00:24', 'set_mutual_boundaries', ['player_wrote_first', 'lera_recognizes_player', 'player_may_remember_gallery']),
  lera_boundary_respect: remote('00:28', 'test_respect_without_pressure', ['mutual_no_rule', 'lera_is_home']),
  lera_boundary_play: remote('00:28', 'separate_teasing_from_pressure', ['mutual_no_rule', 'lera_is_home']),
  lera_boundary_pressure: remote('00:28', 'stop_entitlement', ['player_pressured_lera', 'lera_boundary_is_explicit'], 'medium'),
  lera_no_photo_scene: remote('00:32', 'reward_patience_with_trust', ['player_did_not_request_photo', 'lera_is_testing_boundaries']),
  lera_photo_scene: remote('00:36', 'lera_voluntarily_deepens_trust', ['player_did_not_request_photo', 'lera_is_24', 'photo_is_private']),
  lera_warning_scene: remote('00:36', 'give_clear_final_boundary', ['lera_already_said_no', 'another_push_ends_chat'], 'medium'),
  lera_gallery_clue: remote('00:39', 'verify_player_gallery_memory', ['shared_gallery_event', 'lera_recognizes_player']),
  lera_deleted_scene: remote('00:43', 'show_vulnerability_without_forcing_it', ['lera_is_about_to_reveal_recognition', 'player_response_is_remembered']),
  lera_outfit_scene: remote('00:47', 'prove_gallery_identity_with_dress_photo', ['shared_gallery_event', 'red_staircase_detail', 'they_did_not_meet']),
  lera_reveal: remote('00:51', 'reveal_contact_truth_and_motivation', ['lera_asked_nadia_to_pass_her_contact', 'player_wrote_first', 'lera_recognized_player']),
  lera_final_choice: remote('00:56', 'choose_future_after_the_test', ['contact_truth_revealed', 'boundaries_and_honesty_have_consequences']),
  lera_end_open: remote('00:58', 'promise_honest_continuation', ['contact_truth_revealed', 'mutual_trust'], 'resolved'),
  lera_end_date: remote('00:58', 'arrange_first_real_meeting_tomorrow', ['they_have_not_met_yet', 'mutual_attraction', 'mutual_respect'], 'resolved'),
  lera_end_morning: remote('00:58', 'pause_until_morning', ['contact_truth_revealed'], 'resolved'),
  lera_end_distance: remote('00:58', 'close_without_promises', ['contact_truth_revealed'], 'resolved'),
  lera_end_cold: remote('00:58', 'end_after_mistrust_or_disrespect', ['trust_failed_or_boundaries_conflicted'], 'resolved'),
  lera_end_blocked: remote('00:58', 'block_after_repeated_boundary_violation', ['lera_said_no_twice', 'player_continued_pressure'], 'resolved'),
  lera_end_secret: remote('00:58', 'confirm_mutual_recognition', ['player_remembered_red_staircase', 'contact_truth_revealed', 'boundaries_respected'], 'resolved'),
};

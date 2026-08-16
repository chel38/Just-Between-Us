import type { DialogueNode } from '../../../../types/dialogue';

export const leraEnNodes: DialogueNode[] = [
  { id: 'lera_start', chapter: 1, messages: [], promoSafe: true, choices: [
    { id: 'lera_start_calm', text: 'Can’t sleep? We can just talk.', next: 'lera_calm_entry', tone: 'careful', effects: { trust: 1, respect: 1, setFlags: ['lera_started_calm'] } },
    { id: 'lera_start_ironic', text: 'Do they hand out honest answers after midnight?', next: 'lera_ironic_entry', tone: 'witty', effects: { curiosity: 1, attraction: 1, setFlags: ['lera_started_ironic'] } },
    { id: 'lera_start_confident', text: 'You were waiting for me to finally text.', next: 'lera_confident_entry', tone: 'bold', effects: { attraction: 1, suspicion: 1, setFlags: ['lera_started_confident'] } },
    { id: 'lera_start_flirt', text: 'Your “online” looks dangerously good at 12:17 😏', next: 'lera_flirt_entry', tone: 'warm', effects: { attraction: 2, setFlags: ['lera_started_flirty', 'lera_played_along'] } },
    { id: 'lera_start_risky', text: 'Skip the small talk. Why did you leave me your contact?', next: 'lera_risky_entry', tone: 'risky', effects: { curiosity: 2, suspicion: 1, setFlags: ['lera_started_risky'] } },
  ] },
  { id: 'lera_calm_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_calm_a', sender: 'character', text: 'can’t sleep' },
    { id: 'lera_calm_b', sender: 'character', text: 'and “just talk” sounds suspiciously safe 🙂', typingInterrupted: true },
  ], choices: [
    { id: 'lera_calm_space', text: 'No catch. You set the pace.', next: 'lera_midnight_check', effects: { trust: 2, respect: 2, setFlags: ['lera_respected_boundary'] } },
    { id: 'lera_calm_question', text: 'Safe—until you tell me why you reached out first.', next: 'lera_truth_game', effects: { curiosity: 2, suspicion: 1, setFlags: ['lera_noticed_mystery'] } },
  ] },
  { id: 'lera_ironic_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_ironic_a', sender: 'character', text: 'only one' },
    { id: 'lera_ironic_b', sender: 'character', text: 'the rest are beautifully worded lies 🙃' },
  ], choices: [
    { id: 'lera_ironic_match', text: 'Then I’ll save my honest answer for later.', next: 'lera_midnight_check', effects: { attraction: 2, respect: 1, setFlags: ['lera_played_along'] } },
    { id: 'lera_ironic_push', text: 'Start with a lie. I’ll try to catch it.', next: 'lera_truth_game', effects: { curiosity: 2, irritation: 1, setFlags: ['lera_called_bluff'] } },
  ] },
  { id: 'lera_confident_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_confident_a', sender: 'character', text: 'confident' },
    { id: 'lera_confident_b', sender: 'character', text: 'I like it about sixty percent 😏', reaction: '👀' },
  ], choices: [
    { id: 'lera_confident_clear', text: 'I’ll earn the other forty with honesty.', next: 'lera_midnight_check', effects: { trust: 1, respect: 3, setFlags: ['lera_confidence_without_pressure'] } },
    { id: 'lera_confident_bet', text: 'Bet it reaches a hundred by morning?', next: 'lera_truth_game', effects: { attraction: 2, suspicion: 1, setFlags: ['lera_played_along'] } },
  ] },
  { id: 'lera_flirt_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_flirt_a', sender: 'character', text: 'dangerously good?' },
    { id: 'lera_flirt_b', sender: 'character', text: 'that is the worst compliment this week' },
    { id: 'lera_flirt_c', sender: 'character', text: '...and somehow I’m smiling 🤭', delayMs: 560 },
  ], choices: [
    { id: 'lera_flirt_subtle', text: 'Then the wording worked.', next: 'lera_midnight_check', effects: { attraction: 3, respect: 1, setFlags: ['lera_played_along'] } },
    { id: 'lera_flirt_direct', text: 'That smile is only the beginning.', next: 'lera_boundary_pressure', effects: { attraction: 1, irritation: 2, setFlags: ['lera_too_direct'] } },
  ] },
  { id: 'lera_risky_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_risky_a', sender: 'character', text: 'oh. straight to interrogation' },
    { id: 'lera_risky_b', sender: 'character', text: 'maybe I wanted to see if you would text at all' },
  ], choices: [
    { id: 'lera_risky_honest', text: 'I did. Now give me your honest version.', next: 'lera_truth_game', effects: { curiosity: 3, respect: 1, setFlags: ['lera_called_bluff'] } },
    { id: 'lera_risky_demand', text: 'You left the contact. Prove this isn’t a game.', next: 'lera_boundary_pressure', effects: { irritation: 3, suspicion: 2, respect: -2, setFlags: ['lera_pushed_for_photo'] } },
  ] },
  { id: 'lera_midnight_check', chapter: 2, promoSafe: true, messages: [
    { id: 'lera_check_a', sender: 'character', text: 'okay' },
    { id: 'lera_check_b', sender: 'character', text: 'one question with no pretty versions' },
    { id: 'lera_check_c', sender: 'character', text: 'why did you text right now?' },
  ], choices: [
    { id: 'lera_check_honest', text: 'Because you stayed on my mind after we met.', next: 'lera_truth_game', effects: { trust: 2, curiosity: 1, setFlags: ['lera_admitted_memory'] } },
    { id: 'lera_check_tease', text: 'I’m checking whether you really are bolder at night.', next: 'lera_truth_game', effects: { attraction: 2, setFlags: ['lera_played_along'] } },
    { id: 'lera_check_lie', text: 'I happened to see the contact. No reason.', next: 'lera_truth_game', effects: { suspicion: 3, trust: -1, setFlags: ['lera_caught_lie'] } },
  ] },
  { id: 'lera_truth_game', chapter: 2, messages: [
    { id: 'lera_truth_a', sender: 'character', text: 'almost nothing here happens “by accident”' },
    { id: 'lera_truth_b', sender: 'character', text: 'rule of the game: I can choose not to answer. so can you' },
    { id: 'lera_truth_c', sender: 'character', text: 'deal?' },
  ], choices: [
    { id: 'lera_truth_respect', text: 'Deal. “No” does not need an explanation.', next: 'lera_boundary_respect', effects: { trust: 2, respect: 2, setFlags: ['lera_respected_boundary'] } },
    { id: 'lera_truth_play', text: 'Deal. But can we still tease each other?', next: 'lera_boundary_play', effects: { attraction: 2, respect: 1, setFlags: ['lera_played_along'] } },
    { id: 'lera_truth_push', text: 'Rules are boring. We both know where this is going.', next: 'lera_boundary_pressure', effects: { irritation: 3, respect: -2, setFlags: ['lera_pushed_for_photo'] } },
  ] },
  { id: 'lera_boundary_respect', chapter: 2, messages: [
    { id: 'lera_respect_a', sender: 'character', text: 'good answer' },
    { id: 'lera_respect_b', sender: 'character', text: 'I just got home and changed 😅' },
    { id: 'lera_respect_c', sender: 'character', text: 'and yes, that was a test' },
  ], choices: [
    { id: 'lera_respect_mood', text: 'Show me the mood, not proof.', next: 'lera_photo_scene', conditions: { minRelationship: { trust: 2, respect: 3 }, forbiddenFlags: ['lera_pushed_for_photo'] }, effects: { attraction: 1 } },
    { id: 'lera_respect_words', text: 'No photo needed. Tell me what you were testing.', next: 'lera_no_photo_scene', effects: { trust: 2, respect: 2, setFlags: ['lera_chose_words'] } },
    { id: 'lera_respect_clue', text: 'Were you testing me—or remembering the gallery?', next: 'lera_gallery_clue', effects: { curiosity: 3, respect: 2, setFlags: ['lera_secret_clue'] } },
  ] },
  { id: 'lera_boundary_play', chapter: 2, messages: [
    { id: 'lera_play_a', sender: 'character', text: 'teasing is allowed' },
    { id: 'lera_play_b', sender: 'character', text: 'demanding isn’t. can you tell the difference?' },
  ], choices: [
    { id: 'lera_play_surprise', text: 'I can. Surprise me only if you want to.', next: 'lera_photo_scene', conditions: { minRelationship: { attraction: 4, respect: 1 }, forbiddenFlags: ['lera_pushed_for_photo'] }, effects: { trust: 1, respect: 1 } },
    { id: 'lera_play_words', text: 'I can. Words are enough tonight.', next: 'lera_no_photo_scene', effects: { trust: 2, respect: 2, setFlags: ['lera_chose_words', 'lera_respected_boundary'] } },
    { id: 'lera_play_prove', text: 'The difference is whether you dare to send a photo.', next: 'lera_warning_scene', effects: { irritation: 2, respect: -2, setFlags: ['lera_pushed_for_photo'] } },
  ] },
  { id: 'lera_boundary_pressure', chapter: 2, messages: [
    { id: 'lera_pressure_a', sender: 'character', text: 'stop' },
    { id: 'lera_pressure_b', sender: 'character', text: 'confidence without respect turns into noise fast' },
  ], choices: [
    { id: 'lera_pressure_apologize', text: 'Fair. I pushed too far. I won’t do it again.', next: 'lera_warning_scene', effects: { trust: 1, respect: 2, irritation: -2, setFlags: ['lera_apologized'] } },
    { id: 'lera_pressure_double', text: 'You started this game.', next: 'lera_end_cold', effects: { irritation: 3, respect: -2 } },
    { id: 'lera_pressure_insult', text: 'Then don’t waste my time.', next: 'lera_end_blocked', effects: { irritation: 5, respect: -4, setFlags: ['lera_ignored_no'] } },
  ] },
  { id: 'lera_photo_scene', chapter: 3, messages: [
    { id: 'lera_photo_preface', sender: 'character', text: 'okay' },
    { id: 'lera_photo_one', sender: 'character', kind: 'photo', text: 'here’s my mood. just between us 🙃', image: '/assets/characters/lera/story/night-01.webp', alt: 'Lera, an adult woman age 24, takes an evening selfie at home in a closed black pajama shirt.' },
    { id: 'lera_photo_after', sender: 'character', text: 'and don’t draw conclusions too early' },
  ], choices: [
    { id: 'lera_photo_expression', text: 'I’m looking at the smile, not the shirt.', next: 'lera_gallery_clue', effects: { trust: 2, respect: 2, setFlags: ['lera_noticed_expression'] } },
    { id: 'lera_photo_warm', text: 'You look exactly how you sound: confident.', next: 'lera_deleted_scene', effects: { attraction: 2, trust: 1 } },
    { id: 'lera_photo_more', text: 'Beautiful. Got anything bolder?', next: 'lera_warning_scene', effects: { irritation: 3, respect: -3, setFlags: ['lera_pushed_for_photo'] } },
  ] },
  { id: 'lera_no_photo_scene', chapter: 3, messages: [
    { id: 'lera_no_photo_a', sender: 'character', text: 'not many people hear “I changed” without turning it into a photo request' },
    { id: 'lera_no_photo_b', sender: 'character', text: 'I’ll remember that ❤️', reaction: '🙂' },
  ], choices: [
    { id: 'lera_no_photo_why', text: 'Why does that matter so much to you?', next: 'lera_deleted_scene', effects: { trust: 2, curiosity: 1 } },
    { id: 'lera_no_photo_gallery', text: 'Because someone crossed that line before? At the gallery?', next: 'lera_gallery_clue', effects: { curiosity: 2, setFlags: ['lera_secret_clue'] } },
  ] },
  { id: 'lera_warning_scene', chapter: 3, messages: [
    { id: 'lera_warning_a', sender: 'character', text: 'I told you where the boundary is' },
    { id: 'lera_warning_b', sender: 'character', text: 'now you choose whether to hear it or argue' },
  ], choices: [
    { id: 'lera_warning_listen', text: 'I hear you. The photo topic is closed.', next: 'lera_deleted_scene', effects: { respect: 2, irritation: -2, setFlags: ['lera_respected_boundary'] } },
    { id: 'lera_warning_argue', text: 'It’s just a photo. You’re making it complicated.', next: 'lera_end_cold', effects: { irritation: 3, respect: -2 } },
    { id: 'lera_warning_demand', text: 'Send it or we’re done.', next: 'lera_end_blocked', effects: { irritation: 5, respect: -4, setFlags: ['lera_ignored_no'] } },
  ] },
  { id: 'lera_gallery_clue', chapter: 3, messages: [
    { id: 'lera_gallery_a', sender: 'character', text: 'why do you keep coming back to the gallery?' },
    { id: 'lera_gallery_b', sender: 'character', text: 'we supposedly never even met there 🤨' },
  ], choices: [
    { id: 'lera_gallery_truth', text: 'You stood by the painting with the red staircase and fixed the artist label.', next: 'lera_deleted_scene', effects: { trust: 3, curiosity: 2, setFlags: ['lera_secret_clue', 'lera_remembered_detail'] } },
    { id: 'lera_gallery_lie', text: 'Nadia told me everything. Absolutely everything.', next: 'lera_deleted_scene', effects: { suspicion: 4, trust: -2, setFlags: ['lera_caught_lie'] } },
  ] },
  { id: 'lera_deleted_scene', chapter: 4, messages: [
    { id: 'lera_deleted_a', sender: 'character', text: 'I was going to write something else' },
    { id: 'lera_deleted_b', sender: 'system', kind: 'deleted', text: 'Message deleted' },
    { id: 'lera_deleted_c', sender: 'character', text: 'changed my mind' },
  ], choices: [
    { id: 'lera_deleted_wait', text: 'You don’t have to send it. I’ll wait.', next: 'lera_reveal', effects: { trust: 3, respect: 2, setFlags: ['lera_respected_boundary'] } },
    { id: 'lera_deleted_ask', text: 'Was it a confession or another test?', next: 'lera_reveal', effects: { curiosity: 2, attraction: 1 } },
    { id: 'lera_deleted_guess', text: 'You wanted to admit you recognized me back then.', next: 'lera_outfit_scene', conditions: { requiresFlags: ['lera_secret_clue'], minRelationship: { respect: 3 } }, effects: { trust: 2, curiosity: 2 } },
    { id: 'lera_deleted_crude', text: 'Probably another photo. Shame you deleted it.', next: 'lera_end_cold', effects: { irritation: 4, respect: -3 } },
  ] },
  { id: 'lera_outfit_scene', chapter: 4, messages: [
    { id: 'lera_outfit_a', sender: 'character', text: 'almost right' },
    { id: 'lera_photo_two', sender: 'character', kind: 'photo', text: 'I wore this dress at the gallery. remember now?', image: '/assets/characters/lera/story/night-02.webp', alt: 'Lera, an adult woman age 24, shows a closed dark plum dress in a mirror in an evening room.' },
    { id: 'lera_outfit_b', sender: 'character', text: 'I noticed you before you walked up to the painting' },
  ], choices: [
    { id: 'lera_outfit_detail', text: 'Now I do. And I know why the color felt familiar.', next: 'lera_reveal', effects: { trust: 2, attraction: 2, setFlags: ['lera_remembered_detail'] } },
    { id: 'lera_outfit_person', text: 'I remember the dress. But why you stayed quiet matters more.', next: 'lera_reveal', effects: { trust: 2, respect: 2 } },
  ] },
  { id: 'lera_reveal', chapter: 5, messages: [
    { id: 'lera_reveal_a', sender: 'character', text: 'Nadia gave me your contact' },
    { id: 'lera_reveal_b', sender: 'character', text: 'but I decided to text on my own' },
    { id: 'lera_reveal_c', sender: 'character', text: 'I wanted to know if you remembered me or just a pretty version of that night' },
  ], choices: [
    { id: 'lera_reveal_honest', text: 'I remember you. We can make the pretty version together.', next: 'lera_final_choice', effects: { trust: 3, attraction: 2, respect: 1, setFlags: ['lera_shared_intent'] } },
    { id: 'lera_reveal_careful', text: 'I don’t remember everything. I won’t pretend I do.', next: 'lera_final_choice', effects: { trust: 3, respect: 2, setFlags: ['lera_chose_honesty'] } },
    { id: 'lera_reveal_suspicious', text: 'So this whole chat was a test?', next: 'lera_final_choice', effects: { suspicion: 3, irritation: 1 } },
  ] },
  { id: 'lera_final_choice', chapter: 5, messages: [
    { id: 'lera_final_a', sender: 'character', text: 'the test is over' },
    { id: 'lera_final_b', sender: 'character', text: 'what do you want now?' },
  ], choices: [
    { id: 'lera_final_open', text: 'Keep going honestly. No masks, no tests.', next: 'lera_end_open', conditions: { minRelationship: { trust: 4, respect: 3 } } },
    { id: 'lera_final_date', text: 'Coffee tomorrow. I’m even more confident in person.', next: 'lera_end_date', conditions: { minRelationship: { attraction: 3, respect: 4 } } },
    { id: 'lera_final_morning', text: 'Let’s sleep and continue in the morning.', next: 'lera_end_morning' },
    { id: 'lera_final_distance', text: 'Let this night stay a beautiful story.', next: 'lera_end_distance' },
    { id: 'lera_final_accuse', text: 'I don’t like being played. This is where it ends.', next: 'lera_end_cold' },
    { id: 'lera_final_block', text: 'Send more photos first. Then I’ll decide.', next: 'lera_end_blocked', conditions: { requiresFlags: ['lera_pushed_for_photo'] } },
    { id: 'lera_final_secret', text: 'You recognized me by the red staircase and waited for me to recognize you.', next: 'lera_end_secret', conditions: { requiresFlags: ['lera_secret_clue', 'lera_respected_boundary'], minRelationship: { respect: 3 } } },
  ] },
  { id: 'lera_end_open', chapter: 6, endingId: 'lera_good_open', messages: [{ id: 'lera_end_open_a', sender: 'character', text: 'deal. first honest message tomorrow at 10:00 ❤️' }] },
  { id: 'lera_end_date', chapter: 6, endingId: 'lera_good_date', messages: [{ id: 'lera_end_date_a', sender: 'character', text: 'coffee. 7:30. and try not to be late 😏' }] },
  { id: 'lera_end_morning', chapter: 6, endingId: 'lera_neutral_morning', messages: [{ id: 'lera_end_morning_a', sender: 'character', text: 'sensible. good night... or morning already 🙂' }] },
  { id: 'lera_end_distance', chapter: 6, endingId: 'lera_neutral_distance', messages: [{ id: 'lera_end_distance_a', sender: 'character', text: 'beautiful nights are allowed to be the only one' }] },
  { id: 'lera_end_cold', chapter: 6, endingId: 'lera_bad_cold', messages: [{ id: 'lera_end_cold_a', sender: 'character', text: 'I think we wanted different things from this chat. bye' }] },
  { id: 'lera_end_blocked', chapter: 6, endingId: 'lera_bad_blocked', messages: [{ id: 'lera_end_blocked_a', sender: 'system', kind: 'statusChanged', text: 'Lera blocked you' }] },
  { id: 'lera_end_secret', chapter: 6, endingId: 'lera_secret_known', messages: [
    { id: 'lera_end_secret_a', sender: 'character', text: 'finally' },
    { id: 'lera_end_secret_b', sender: 'character', text: 'I recognized you in the first second. I just wanted you to remember on your own 🤭' },
  ] },
];

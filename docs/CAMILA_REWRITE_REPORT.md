# Camila rewrite — developer report

## Outcome

The Camila story keeps its five opening approaches, apartment 47, the key, the two envelopes, Alina, Mark, the archive, relationship memory, seven endings, all legacy node IDs, all legacy message IDs, all legacy choice IDs, and all ending IDs.

The central staging rule is now explicit and testable: the player and Camila remain in different locations until `end_good_dawn`, `end_good_equal`, or `end_secret`. The story no longer asks them to keep texting while standing on the same landing.

## Old vs new

| Old node | Problem | New solution |
| --- | --- | --- |
| `start` and five openings | The objects were not fully consistent between the envelope and key openings. Camila’s location was unknown. | Every opening refers to the same blue envelope/key event. Each response is distinct, and Camila immediately says she is at her workshop, at least thirty minutes away. |
| `risky_1` → `risky_2` | A risky player could remain in 47 while the graph silently treated later scenes as if they were safe. | Every risky choice returns the player to apartment 46 before convergence. The phone and 07:14 can be photographed before leaving. |
| `crossing` | Camila instructed the player to meet her on a camera-free landing, forcing a mid-story physical meeting. | Camila travels home while the player stays in apartment 46. They agree on check-ins, backups, live location, and a remote plan. |
| `stairwell` | Both characters were physically present but continued issuing messenger commands such as dropping a cup. | Only Camila is on the stairs. The player receives incomplete information from home and offers cautious, observational, retreat, or controlled-test advice. Mark is introduced by role, prior key access, clothing, behavior, and his left-hand scar. |
| `threshold` | Camila somehow opened the player’s envelope after the implied meeting; the next entry into 47 had no strong cause. | Camila returns to apartment 39 and finds a second matching envelope that appeared during the stairwell check. Its fresh photo shows open 47 and a visible Alina folder, giving the next action a concrete cause. |
| `archive` | “I went inside anyway” made Camila reckless only because the plot needed the archive. The player often sounded like an NPC commander. | Camila calls 112 on relevant paths, goes up only to document an already open door, sees Alina’s folder and Mark’s access sheet through the gap, and makes an explicit adult decision when the door begins closing. Choices use natural advice and limit collection to necessary evidence. |
| `recording` | The recorder appeared without clarifying what Camila took or where she was. | Camila identifies the exact folder, list, and access log she takes, finds the recorder in Alina’s folder, then states she is leaving 47 before confessing. |
| `interlude` | The deleted message was decorative, and Camila delivered a dense confession without first restoring physical safety. | Camila confirms she is locked in apartment 39. The deleted line is revealed as fear that she has become like Alina. Her selection of the player, rental intervention, planted key, and lack of involvement with the envelopes are separated into short messages. |
| `midnight` | Location after the archive was ambiguous, and one choice sent the player physically to Camila. | Camila is clearly at home; the player remains in apartment 46. The disconnect, shadow, note, and childhood phrase all advance the threat. The former travel choice now keeps both behind separate locked doors on a live call. |
| `second_room` | The old photo did not carry enough useful information for the later mirror solution. | The photo establishes Alina’s red scarf and a small burn on her right hand, creating a fair clue before the secret deduction. |
| `fracture` | Several answers guessed the culprit without first grounding access, time, or source quality. | The splice, closed tram route, and three nights of Mark’s key-log access appear before the choice. The secret route requires asking for original, uncropped files rather than making a lucky accusation. |
| `mark` | The threat appeared, but the path to police intervention was inconsistent across choices. | Camila calls 112 immediately after the fresh door photo. Every choice now changes her response while the common fact of an incoming unit supports the next scene. |
| `aftershock` | Camila ignored the selected tactic, Mark was identified too quickly, and her old involvement arrived as another abrupt twist. | Conditional messages acknowledge police sharing, the trap, the autonomy choice, or the rejected chain idea. The mirrored hand remains ambiguous. A page Camila deliberately removed from 47 reveals her signature and sets up accountability. |
| `reckoning` | Mark was suddenly detained with no elapsed time or operational cause. | A `01:26` system event marks a jump of more than an hour. Police follow the service route, find Mark, the second key, server, and forms, then request separate morning statements. |
| `decision` | The secret hand/scar deduction was internally contradictory, and meetings were not clearly first meetings. | Mark’s scar is consistently left-handed; the corrected frame shows a right-hand mark matching Alina’s earlier burn. Good and secret choices explicitly schedule the first physical meeting only after the threat is contained. |
| good endings | Coffee appeared without making the delayed meeting structurally meaningful. | Camila is outside with two coffees only after statements are arranged; her message asks the player to come down, turning the meeting into a payoff. |
| bad endings | Blocking and evidence loss felt like mechanical punishment. | The erased route explains why destroyed route pages sever the server from victims. The blocked route recalls the repeated loss of Camila’s agency before she ends contact. |

## Compatibility

- No DialogueEngine rewrite.
- No node was renamed or removed.
- No legacy message, choice, flag, or ending ID was removed.
- `currentNodeId`, `processedMessageIds`, `choiceHistory`, transcript `sourceId`, and unlocked endings therefore remain readable without a save migration.
- A few new conditional message IDs expose consequences: `threshold_retreat`, `archive_called`, `archive_waited`, `after_police`, `after_trap`, `after_open`, and `reckoning_time`.
- Historical flags `agreed_meet`, `made_her_come`, and `went_to_camila` remain as compatibility aliases. New semantic flags (`agreed_remote_plan`, `requested_safe_return`, `kept_live_contact`) are set alongside them.
- `sceneContext` is optional development metadata and is never rendered or persisted.

## Seven-route scenario pass

| Pass | Opening and strategy | Ending | Location/logic result |
| --- | --- | --- | --- |
| good | careful opening, safety, privacy, emergency call, accountability | `good_dawn` | Remote through the full investigation; first meeting at the entrance. |
| bad | bold opening, lies, destruction, pressure | `bad_erased` | Evidence loss and Mark’s release follow the selected actions. |
| neutral | warm opening, boundary, minimal evidence, distance | `neutral_archive` | Case survives while the personal chat ends. |
| secret | risky opening, 07:14, off-device copy, original-file audit | `secret_0714` | All three early clues are required; first meeting occurs at the station. |
| most flirty | flirt opening, respect after the joke, honest coffee boundary | `good_equal` | Flirt pauses during danger and returns only after the threat is resolved. |
| most cautious | careful opening, retreat, privacy, 112, no door opening | `good_dawn` | Travel time, locked doors, and remote check-ins remain explicit. |
| most conflictual | persistent suspicion, accusation, rejection of boundaries | `bad_blocked` | Camila refers to the repeated removal of her agency before blocking the player. |

For every pass:

- player location is explicit in `sceneContext`;
- Camila location is explicit in `sceneContext` and supported by the text;
- Mark location is stated when known and `unknown` when it is not;
- each node has a concrete scene goal and known-fact set;
- the selected choice is available from accumulated conditions/effects;
- topics advance by cause and consequence rather than an unrelated switch;
- neither character uses knowledge that the route has not introduced;
- no pre-ending scene colocates the player and Camila.

## Automated coverage

`camilaScenario.test.ts` verifies:

- every Camila node has complete scene metadata;
- the core timeline never moves backwards across midnight;
- player and Camila locations remain different before permitted endings;
- only the two good endings and secret ending colocate them;
- all legacy node IDs remain present;
- RU and EN transitions, effects, conditions, status events, delays, and scene contexts are identical;
- message and choice lengths stay within messenger-oriented limits;
- pre-ending character messages do not imply an accidental physical meeting.

The existing graph test still traverses all seven authored endings with real accumulated flags and relationship values, while the registry validator checks duplicates, missing next nodes, unreachable nodes, dead ends, endings, IDs, and localization coverage.

import { DialogueEngine } from '../../../engine/dialogue/dialogueEngine';
import type { DialogueDefinition, ScriptMessage } from '../../../types/dialogue';

const countWords = (text: string | undefined): number => text?.trim().split(/\s+/u).filter(Boolean).length ?? 0;

function attachmentReviewSeconds(message: ScriptMessage): number {
  const type = message.attachment?.type;
  if (type === 'chat_screenshot') return 55;
  if (type === 'document') return 42;
  if (type === 'photo') return 32;
  if (type === 'forwarded_message') return 20;
  return 0;
}

/** Development estimate for a deliberate first playthrough of this emotionally dense story. */
export function estimateLubovRouteMinutes(dialogue: DialogueDefinition, choiceIds: readonly string[]): number {
  const engine = new DialogueEngine(dialogue);
  let progress = engine.createProgress();
  let seconds = 0;
  let index = 0;

  const consume = () => {
    for (const pending of engine.pendingMessages(progress)) {
      seconds += countWords(pending.text) / 115 * 60;
      seconds += pending.delayMs !== undefined
        ? Math.min(pending.delayMs, 5_200) / 1_000
        : pending.sender === 'character' ? Math.min(5_200, 730 + (pending.text?.length ?? 0) * 25) / 1_000 : 0.35;
      seconds += pending.kind === 'delay' ? (pending.delayMs ?? 500) / 1_000 : 2.2;
      seconds += attachmentReviewSeconds(pending);
      progress = engine.appendScriptMessage(progress, pending, pending.text ?? '', 10_000 + index++);
    }
    progress = engine.finishCurrentNode(progress, 20_000 + index++);
  };

  if (!progress.awaitingChoice) consume();
  for (const choiceId of choiceIds) {
    const selected = engine.availableChoices(progress).find((candidate) => candidate.id === choiceId);
    if (!selected) throw new Error(`Duration route cannot choose ${choiceId} at ${progress.currentNodeId}.`);
    seconds += countWords(selected.text) / 115 * 60 + 29;
    progress = engine.choose(progress, choiceId, 30_000 + index++);
    consume();
  }
  return seconds / 60;
}

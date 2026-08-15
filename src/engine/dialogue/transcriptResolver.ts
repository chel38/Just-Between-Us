import type { DialogueDefinition, ScriptMessage, TranscriptMessage } from '../../types/dialogue';

interface TranscriptLookup {
  messages: Map<string, ScriptMessage>;
  choices: Map<string, string>;
}

const lookupCache = new WeakMap<DialogueDefinition, TranscriptLookup>();

function getLookup(dialogue: DialogueDefinition): TranscriptLookup {
  const cached = lookupCache.get(dialogue);
  if (cached) return cached;
  const messages = new Map<string, ScriptMessage>();
  const choices = new Map<string, string>();
  for (const node of dialogue.nodes) {
    node.messages.forEach((message) => messages.set(message.id, message));
    node.choices?.forEach((choice) => choices.set(choice.id, choice.text));
  }
  const lookup = { messages, choices };
  lookupCache.set(dialogue, lookup);
  return lookup;
}

export function resolveSourceText(
  sourceId: string | undefined,
  sourceType: TranscriptMessage['sourceType'],
  dialogue: DialogueDefinition,
): string | undefined {
  if (!sourceId) return undefined;
  const lookup = getLookup(dialogue);
  if (sourceType === 'player-choice') return lookup.choices.get(sourceId);
  return lookup.messages.get(sourceId)?.text ?? lookup.choices.get(sourceId);
}

export function resolveTranscriptMessage(
  message: TranscriptMessage,
  dialogue: DialogueDefinition,
): { text: string; quote?: string } {
  const legacySourceId = message.sourceId ?? message.scriptMessageId;
  const inferredType = message.sourceType ?? (message.sender === 'player' ? 'player-choice' : message.sender === 'system' ? 'system' : 'script-message');
  const text = resolveSourceText(legacySourceId, inferredType, dialogue)
    ?? message.fallbackText
    ?? message.text
    ?? '';
  const quote = resolveSourceText(message.quoteSourceId, undefined, dialogue)
    ?? message.quoteFallbackText
    ?? message.quote;
  return { text, quote };
}

export function resolveLastMessage(progressHistory: TranscriptMessage[] | undefined, dialogue: DialogueDefinition): string | undefined {
  const last = progressHistory?.at(-1);
  return last ? resolveTranscriptMessage(last, dialogue).text : undefined;
}

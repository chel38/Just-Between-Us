import { applyEffects } from './effectsEngine';
import { meetsConditions } from './conditionEngine';
import {
  EMPTY_RELATIONSHIP,
  type DialogueChoice,
  type DialogueDefinition,
  type DialogueNode,
  type DialogueProgress,
  type ScriptMessage,
  type TranscriptMessage,
} from '../../types/dialogue';

export class DialogueEngine {
  constructor(private readonly definition: DialogueDefinition) {}

  createProgress(): DialogueProgress {
    const start = this.getNode(this.definition.startNodeId);
    return {
      dialogueId: this.definition.id,
      status: 'available',
      currentNodeId: start.id,
      history: [],
      relationship: { ...EMPTY_RELATIONSHIP },
      flags: [],
      choiceHistory: [],
      seenNodes: [start.id],
      endingsUnlocked: [],
      awaitingChoice: start.messages.length === 0,
      processedMessageIds: [],
      revealedHints: {},
      startedAt: null,
      updatedAt: Date.now(),
      unread: 0,
    };
  }

  getNode(id: string): DialogueNode {
    const node = this.definition.nodes.find((candidate) => candidate.id === id);
    if (!node) throw new Error(`[DialogueEngine] Unknown node: ${id}`);
    return node;
  }

  getScriptMessage(id: string): ScriptMessage | undefined {
    for (const node of this.definition.nodes) {
      const message = node.messages.find((candidate) => candidate.id === id);
      if (message) return message;
    }
    return undefined;
  }

  availableChoices(progress: DialogueProgress): DialogueChoice[] {
    return (this.getNode(progress.currentNodeId).choices ?? []).filter((choice) =>
      meetsConditions(choice.conditions, progress),
    );
  }

  pendingMessages(progress: DialogueProgress): ScriptMessage[] {
    return this.getNode(progress.currentNodeId).messages.filter(
      (message) =>
        !progress.processedMessageIds.includes(message.id) &&
        meetsConditions(message.conditions, progress),
    );
  }

  choose(progress: DialogueProgress, choiceId: string, now = Date.now()): DialogueProgress {
    const choice = this.availableChoices(progress).find((candidate) => candidate.id === choiceId);
    if (!choice) throw new Error(`[DialogueEngine] Choice ${choiceId} is unavailable.`);
    const destination = this.getNode(choice.next);
    const playerMessage: TranscriptMessage = {
      id: `player-${choice.id}-${now}`,
      sourceType: 'player-choice',
      sourceId: choice.id,
      fallbackText: choice.text,
      sender: 'player',
      kind: 'message',
      timestamp: now,
      status: 'read',
    };

    let next: DialogueProgress = {
      ...progress,
      status: 'active',
      currentNodeId: destination.id,
      history: [...progress.history, playerMessage],
      choiceHistory: [...progress.choiceHistory, choice.id],
      seenNodes: progress.seenNodes.includes(destination.id)
        ? progress.seenNodes
        : [...progress.seenNodes, destination.id],
      awaitingChoice: false,
      startedAt: progress.startedAt ?? now,
      updatedAt: now,
    };
    next = applyEffects(next, choice.effects);
    next = applyEffects(next, destination.onEnter);
    return next;
  }

  appendScriptMessage(
    progress: DialogueProgress,
    message: ScriptMessage,
    text: string,
    now = Date.now(),
  ): DialogueProgress {
    const processed = [...progress.processedMessageIds, message.id];
    if (message.kind === 'delay') {
      return { ...progress, processedMessageIds: processed, updatedAt: now };
    }

    const transcript: TranscriptMessage = {
      id: `script-${message.id}-${now}`,
      sourceType: message.sender === 'system' ? 'system' : 'script-message',
      sourceId: message.id,
      fallbackText: text,
      scriptMessageId: message.id,
      sender: message.sender === 'system' ? 'system' : message.sender === 'player' ? 'player' : 'character',
      kind: message.kind ?? 'message',
      timestamp: now,
      reaction: message.reaction,
      quoteSourceId: message.quoteSourceId,
      quoteFallbackText: message.quote,
      quote: message.quote,
      image: message.image,
      alt: message.alt,
      attachment: message.attachment,
    };
    const characterState = message.kind === 'statusChanged'
      ? { characterStatus: text, characterStatusSourceId: message.id }
      : message.kind === 'avatarChanged' && message.image
        ? { characterAvatar: message.image }
        : {};
    return {
      ...progress,
      ...characterState,
      history: [...progress.history, transcript],
      processedMessageIds: processed,
      updatedAt: now,
    };
  }

  finishCurrentNode(progress: DialogueProgress, now = Date.now()): DialogueProgress {
    const node = this.getNode(progress.currentNodeId);
    if (!node.endingId) {
      return { ...progress, awaitingChoice: true, updatedAt: now };
    }

    const ending = this.definition.endings.find((candidate) => candidate.id === node.endingId);
    if (!ending) throw new Error(`[DialogueEngine] Unknown ending: ${node.endingId}`);
    const endingsUnlocked = progress.endingsUnlocked.includes(ending.id)
      ? progress.endingsUnlocked
      : [...progress.endingsUnlocked, ending.id];
    const status = ending.blocked
      ? 'blocked'
      : ending.type === 'good' || ending.type === 'secret'
        ? 'completed_good'
        : ending.type === 'neutral'
          ? 'completed_neutral'
          : 'completed_bad';

    return {
      ...progress,
      status,
      endingId: ending.id,
      endingsUnlocked,
      awaitingChoice: false,
      updatedAt: now,
    };
  }
}

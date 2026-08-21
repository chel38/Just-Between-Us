import type { DialogueDefinition } from '../../../types/dialogue';
import { LUBOV_ASSETS } from './assets';

const requiredEndings = [
  'lubov_end_period', 'lubov_end_war', 'lubov_end_blocked', 'lubov_end_separate',
  'lubov_end_honest_divorce', 'lubov_end_try_again', 'lubov_end_without_trust',
  'lubov_end_whole_truth', 'lubov_end_chooses_him',
];

export function auditLubovScenario(dialogue: DialogueDefinition): string[] {
  const issues: string[] = [];
  const nodes = new Map(dialogue.nodes.map((node) => [node.id, node]));
  const start = nodes.get(dialogue.startNodeId);
  if (!start || start.messages[0]?.sender !== 'player' || start.messages[0]?.attachment?.id !== 'lubov_proof_embrace_01') {
    issues.push('The player must send the first evidence attachment before Lyubov replies.');
  }
  if (start?.choices?.length !== 5 || new Set(start.choices.map((choice) => choice.next)).size !== 5) {
    issues.push('The opening must contain five distinct approaches and replies.');
  }
  for (const node of dialogue.nodes) {
    const context = node.sceneContext;
    if (!context) issues.push(`${node.id}: scene context is missing.`);
    else {
      if (context.playerLocation !== 'shared_apartment') issues.push(`${node.id}: player location changed without cause.`);
      if (context.characterLocation !== 'katya_apartment') issues.push(`${node.id}: Lyubov location changed without cause.`);
      if (context.playerLocation === context.characterLocation) issues.push(`${node.id}: spouses cannot be colocated during the messenger story.`);
    }
    if (node.promoSafe && node.messages.some((message) => message.kind === 'photo' || message.kind === 'attachment')) {
      issues.push(`${node.id}: promo-safe node contains private evidence.`);
    }
    for (const message of node.messages.filter((candidate) => candidate.kind === 'attachment')) {
      if (!message.attachment?.source || !message.attachment.storyPurpose || message.attachment.promoAllowed !== false) {
        issues.push(`${node.id}/${message.id}: attachment lacks source, purpose, or promo guard.`);
      }
    }
  }
  const endingIds = dialogue.endings.map((ending) => ending.id);
  requiredEndings.forEach((id) => { if (!endingIds.includes(id)) issues.push(`${id}: required ending is missing.`); });
  if (dialogue.endings.length < 9) issues.push('Lyubov needs at least nine endings.');
  const authored = dialogue.nodes.flatMap((node) => [
    ...node.messages.map((message) => message.text ?? ''),
    ...(node.choices?.map((choice) => choice.text) ?? []),
  ]).join('\n');
  if (dialogue.character.name === 'Любовь' && /Любовь написала первой|я написала первой/iu.test(authored)) issues.push('Lyubov must not write first.');
  if (dialogue.character.name === 'Lyubov' && /Lyubov (?:wrote|texted) first|I (?:wrote|texted) first/iu.test(authored)) issues.push('Lyubov must not write first.');
  const photoAssets = new Set(dialogue.nodes.flatMap((node) => node.messages.map((message) => message.attachment?.asset).filter(Boolean)));
  LUBOV_ASSETS.forEach((asset) => { if (!photoAssets.has(asset.asset)) issues.push(`${asset.id}: manifested story asset is unreachable from the graph.`); });
  return issues;
}

export function serializeLubovLogic(node: DialogueDefinition['nodes'][number]): unknown {
  return {
    id: node.id,
    chapter: node.chapter,
    endingId: node.endingId,
    onEnter: node.onEnter,
    adBreak: node.adBreak,
    promoSafe: node.promoSafe,
    sceneContext: node.sceneContext,
    messages: node.messages.map((message) => ({
      id: message.id,
      sender: message.sender,
      kind: message.kind,
      delayMs: message.delayMs,
      typing: message.typing,
      typingInterrupted: message.typingInterrupted,
      conditions: message.conditions,
      attachment: message.attachment ? {
        id: message.attachment.id,
        type: message.attachment.type,
        asset: message.attachment.asset,
        entryIds: message.attachment.entries?.map((entry) => entry.id),
        fieldCount: message.attachment.fields?.length,
        promoAllowed: message.attachment.promoAllowed,
      } : undefined,
    })),
    choices: node.choices?.map((choice) => ({ id: choice.id, next: choice.next, effects: choice.effects, conditions: choice.conditions, tone: choice.tone })),
  };
}

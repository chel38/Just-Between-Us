import type { DialogueDefinition } from '../../types/dialogue';

export class DialogueValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`DialogueValidationError:\n${issues.join('\n')}`);
    this.name = 'DialogueValidationError';
  }
}

export function validateDialogue(dialogue: DialogueDefinition): void {
  const issues: string[] = [];
  const ids = new Set<string>();
  const endingIds = new Set(dialogue.endings.map((ending) => ending.id));
  const nodes = new Map(dialogue.nodes.map((node) => [node.id, node]));

  for (const node of dialogue.nodes) {
    if (ids.has(node.id)) issues.push(`${dialogue.id}/${node.id}: duplicate node ID.`);
    ids.add(node.id);
    if (!node.messages) issues.push(`${dialogue.id}/${node.id}: messages are missing.`);
    if (!node.endingId && (!node.choices || node.choices.length === 0)) {
      issues.push(`${dialogue.id}/${node.id}: node has no choices or ending.`);
    }
    if (node.endingId && !endingIds.has(node.endingId)) {
      issues.push(`${dialogue.id}/${node.id}: ending "${node.endingId}" does not exist.`);
    }
    const choiceIds = new Set<string>();
    for (const choice of node.choices ?? []) {
      if (!choice.text.trim()) issues.push(`${dialogue.id}/${node.id}/${choice.id}: choice text is empty.`);
      if (choiceIds.has(choice.id)) issues.push(`${dialogue.id}/${node.id}/${choice.id}: duplicate choice ID.`);
      choiceIds.add(choice.id);
      if (!nodes.has(choice.next)) {
        issues.push(`${dialogue.id}/${node.id} -> next "${choice.next}" does not exist.`);
      }
    }
    for (const message of node.messages) {
      if (message.kind !== 'delay' && !message.text?.trim()) {
        issues.push(`${dialogue.id}/${node.id}/${message.id}: message text is empty.`);
      }
    }
  }

  if (!nodes.has(dialogue.startNodeId)) {
    issues.push(`${dialogue.id}: start node "${dialogue.startNodeId}" does not exist.`);
  }

  const reachable = new Set<string>();
  const stack = nodes.has(dialogue.startNodeId) ? [dialogue.startNodeId] : [];
  while (stack.length) {
    const id = stack.pop()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    nodes.get(id)?.choices?.forEach((choice) => stack.push(choice.next));
  }
  for (const id of nodes.keys()) {
    if (!reachable.has(id)) issues.push(`${dialogue.id}/${id}: node is unreachable.`);
  }

  const reverse = new Map<string, string[]>();
  for (const node of dialogue.nodes) {
    node.choices?.forEach((choice) => reverse.set(choice.next, [...(reverse.get(choice.next) ?? []), node.id]));
  }
  const canReachEnding = new Set<string>();
  const endingStack = dialogue.nodes.filter((node) => node.endingId).map((node) => node.id);
  while (endingStack.length) {
    const id = endingStack.pop()!;
    if (canReachEnding.has(id)) continue;
    canReachEnding.add(id);
    reverse.get(id)?.forEach((previous) => endingStack.push(previous));
  }
  for (const id of reachable) {
    if (!canReachEnding.has(id)) issues.push(`${dialogue.id}/${id}: path cannot reach an ending.`);
  }

  for (const ending of dialogue.endings) {
    if (!dialogue.nodes.some((node) => node.endingId === ending.id)) {
      issues.push(`${dialogue.id}: ending "${ending.id}" has no incoming path.`);
    }
  }

  if (issues.length) throw new DialogueValidationError(issues);
}

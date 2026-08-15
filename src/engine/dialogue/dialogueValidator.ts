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
  const endingIds = new Set<string>();
  const messageIds = new Set<string>();
  const choiceIds = new Set<string>();
  const nodes = new Map(dialogue.nodes.map((node) => [node.id, node]));

  for (const ending of dialogue.endings) {
    if (endingIds.has(ending.id)) issues.push(`${dialogue.id}/${ending.id}: duplicate ending ID.`);
    endingIds.add(ending.id);
  }

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
    for (const choice of node.choices ?? []) {
      if (!choice.text.trim()) issues.push(`${dialogue.id}/${node.id}/${choice.id}: choice text is empty.`);
      if (choiceIds.has(choice.id)) issues.push(`${dialogue.id}/${node.id}/${choice.id}: duplicate choice ID in dialogue.`);
      choiceIds.add(choice.id);
      if (!nodes.has(choice.next)) {
        issues.push(`${dialogue.id}/${node.id} -> next "${choice.next}" does not exist.`);
      }
    }
    for (const message of node.messages) {
      if (messageIds.has(message.id)) issues.push(`${dialogue.id}/${node.id}/${message.id}: duplicate message ID in dialogue.`);
      messageIds.add(message.id);
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

export function validateDialogueRegistry(dialogues: DialogueDefinition[]): void {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const dialogue of dialogues) {
    if (ids.has(dialogue.id)) issues.push(`${dialogue.id}: duplicate dialogue ID in registry.`);
    ids.add(dialogue.id);
    try { validateDialogue(dialogue); }
    catch (error) {
      if (error instanceof DialogueValidationError) issues.push(...error.issues);
      else throw error;
    }
  }
  if (issues.length) throw new DialogueValidationError(issues);
}

export function validateDialoguePair(primary: DialogueDefinition, localized: DialogueDefinition): void {
  const issues: string[] = [];
  if (primary.id !== localized.id) issues.push(`Dialogue IDs differ: ${primary.id} / ${localized.id}.`);
  compareIds('node', primary.nodes.map((node) => node.id), localized.nodes.map((node) => node.id), issues);
  compareIds('message', primary.nodes.flatMap((node) => node.messages.map((message) => message.id)), localized.nodes.flatMap((node) => node.messages.map((message) => message.id)), issues);
  compareIds('choice', primary.nodes.flatMap((node) => node.choices?.map((choice) => choice.id) ?? []), localized.nodes.flatMap((node) => node.choices?.map((choice) => choice.id) ?? []), issues);
  compareIds('ending', primary.endings.map((ending) => ending.id), localized.endings.map((ending) => ending.id), issues);
  const localizedNodes = new Map(localized.nodes.map((node) => [node.id, node]));
  primary.nodes.forEach((node) => {
    const translated = localizedNodes.get(node.id);
    if (node.choices?.length && (!node.hint?.trim() || !translated?.hint?.trim())) issues.push(`${primary.id}/${node.id}: localized hint is missing.`);
  });
  if (issues.length) throw new DialogueValidationError(issues);
}

function compareIds(label: string, primary: string[], localized: string[], issues: string[]): void {
  const primaryIds = new Set(primary);
  const localizedIds = new Set(localized);
  primaryIds.forEach((id) => { if (!localizedIds.has(id)) issues.push(`${label} "${id}" is missing from localized dialogue.`); });
  localizedIds.forEach((id) => { if (!primaryIds.has(id)) issues.push(`${label} "${id}" exists only in localized dialogue.`); });
}

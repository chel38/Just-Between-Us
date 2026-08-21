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

  if (!Number.isInteger(dialogue.character.age) || dialogue.character.age < 18) {
    issues.push(`${dialogue.id}: character age must be an integer of at least 18.`);
  }
  if (dialogue.contentRating !== '18+') issues.push(`${dialogue.id}: content rating must be 18+.`);

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
      if (message.kind === 'photo') {
        if (!message.image?.trim()) issues.push(`${dialogue.id}/${node.id}/${message.id}: photo asset is missing.`);
        if (!message.alt?.trim()) issues.push(`${dialogue.id}/${node.id}/${message.id}: localized photo alt is missing.`);
        if (node.promoSafe === true) issues.push(`${dialogue.id}/${node.id}/${message.id}: story photo cannot be marked promo-safe.`);
      }
      if (message.kind === 'attachment') {
        const attachment = message.attachment;
        if (!attachment) issues.push(`${dialogue.id}/${node.id}/${message.id}: attachment metadata is missing.`);
        else {
          if (!attachment.id.trim() || !attachment.title.trim() || !attachment.source.trim() || !attachment.storyPurpose.trim()) {
            issues.push(`${dialogue.id}/${node.id}/${message.id}: attachment identity, source, title, and story purpose are required.`);
          }
          if (attachment.promoAllowed !== false) issues.push(`${dialogue.id}/${node.id}/${message.id}: story attachment must be blocked from promo.`);
          if (attachment.type === 'photo' && (!attachment.asset?.trim() || !attachment.alt?.trim())) {
            issues.push(`${dialogue.id}/${node.id}/${message.id}: photo attachment requires asset and localized alt.`);
          }
          if ((attachment.type === 'chat_screenshot' || attachment.type === 'forwarded_message') && !attachment.entries?.length) {
            issues.push(`${dialogue.id}/${node.id}/${message.id}: chat attachment requires localized entries.`);
          }
          if (attachment.type === 'document' && !attachment.fields?.length) {
            issues.push(`${dialogue.id}/${node.id}/${message.id}: document attachment requires localized fields.`);
          }
          if (node.promoSafe === true) issues.push(`${dialogue.id}/${node.id}/${message.id}: attachment node cannot be marked promo-safe.`);
        }
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
    if (!translated) return;
    const primaryLogic = structuralNodeLogic(node);
    const localizedLogic = structuralNodeLogic(translated);
    if (JSON.stringify(primaryLogic) !== JSON.stringify(localizedLogic)) {
      issues.push(`${primary.id}/${node.id}: localized graph logic differs from the primary language.`);
    }
  });
  if (issues.length) throw new DialogueValidationError(issues);
}

function structuralNodeLogic(node: DialogueDefinition['nodes'][number]): unknown {
  return {
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
      reaction: message.reaction,
      quoteSourceId: message.quoteSourceId,
      image: message.image,
      attachment: message.attachment ? {
        id: message.attachment.id,
        type: message.attachment.type,
        asset: message.attachment.asset,
        promoAllowed: message.attachment.promoAllowed,
        adultCharacters: message.attachment.adultCharacters,
        entryIds: message.attachment.entries?.map((entry) => entry.id),
        fieldCount: message.attachment.fields?.length,
      } : undefined,
      conditions: message.conditions,
    })),
    choices: node.choices?.map((choice) => ({
      id: choice.id,
      next: choice.next,
      effects: choice.effects,
      conditions: choice.conditions,
      tone: choice.tone,
    })),
  };
}

function compareIds(label: string, primary: string[], localized: string[], issues: string[]): void {
  const primaryIds = new Set(primary);
  const localizedIds = new Set(localized);
  primaryIds.forEach((id) => { if (!localizedIds.has(id)) issues.push(`${label} "${id}" is missing from localized dialogue.`); });
  localizedIds.forEach((id) => { if (!primaryIds.has(id)) issues.push(`${label} "${id}" exists only in localized dialogue.`); });
}

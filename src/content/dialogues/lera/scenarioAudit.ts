import type { DialogueDefinition, DialogueNode } from '../../../types/dialogue';

const contactContradictions = [
  /почему ты написала первой/i,
  /написать решила я сама/i,
  /после нашей встречи/i,
  /why (?:did )?you (?:text|reach out) first/i,
  /I decided to text/i,
  /after we met/i,
];

export function auditLeraScenario(dialogue: DialogueDefinition): string[] {
  const issues: string[] = [];
  const nodes = new Map(dialogue.nodes.map((node) => [node.id, node]));

  for (const node of dialogue.nodes) {
    const context = node.sceneContext;
    if (!context) {
      issues.push(`${node.id}: sceneContext is missing.`);
      continue;
    }
    if (!context.time || !context.playerLocation || !context.characterLocation || !context.sceneGoal) {
      issues.push(`${node.id}: sceneContext is incomplete.`);
    }
    if (context.playerLocation === context.characterLocation) {
      issues.push(`${node.id}: Lera and the player are colocated while still chatting.`);
    }
    if (node.id !== dialogue.startNodeId && context.knownFacts.length === 0) {
      issues.push(`${node.id}: knownFacts is empty.`);
    }

    const sourceMinutes = timelineMinutes(context.time);
    for (const choice of node.choices ?? []) {
      const destination = nodes.get(choice.next);
      const destinationMinutes = destination?.sceneContext ? timelineMinutes(destination.sceneContext.time) : null;
      if (sourceMinutes === null || destinationMinutes === null) continue;
      if (destinationMinutes < sourceMinutes) {
        issues.push(`${node.id} -> ${choice.next}: timeline moves backwards.`);
      }
    }
  }

  const authoredText = dialogue.nodes.flatMap((node) => [
    ...node.messages.map((message) => message.text ?? ''),
    ...(node.choices ?? []).map((choice) => choice.text),
  ]).join('\n');
  for (const pattern of contactContradictions) {
    if (pattern.test(authoredText)) issues.push(`Contact canon contradiction matched ${pattern}.`);
  }
  const characterText = dialogue.nodes.flatMap((node) => node.messages
    .filter((message) => message.sender === 'character')
    .map((message) => message.text ?? '')).join('\n');
  if (/надя дала мне твой контакт|Nadia gave me your contact/i.test(characterText)) {
    issues.push('A Lera message reverses the direction of the contact handoff.');
  }

  const start = nodes.get(dialogue.startNodeId);
  if (start?.messages.length !== 0 || start?.choices?.length !== 5) {
    issues.push('The player must start the chat through exactly five opening choices.');
  }

  const revealText = nodes.get('lera_reveal')?.messages.map((message) => message.text).join(' ') ?? '';
  const canonicalReveal = dialogue.id === 'lera' && dialogue.character.name === 'Лера'
    ? /попросила Надю передать тебе мой контакт/i
    : /asked Nadia to give you my contact/i;
  if (!canonicalReveal.test(revealText)) issues.push('The canonical contact handoff is not stated in the reveal.');

  const photos = dialogue.nodes.flatMap((node) => node.messages).filter((message) => message.kind === 'photo');
  if (photos.length !== 2) issues.push(`Expected exactly two story photos, found ${photos.length}.`);
  const lingerie = photos.find((message) => message.id === 'lera_photo_one');
  if (lingerie?.image !== './assets/characters/lera/story/lera-lingerie-01.png') {
    issues.push('The relationship photo is not connected to the stable Lera lingerie asset.');
  }
  if (!lingerie?.alt?.match(/24/)) issues.push('The relationship photo alt must state Lera’s adult age 24.');

  const photoEntry = nodes.get('lera_no_photo_scene')?.choices?.find((choice) => choice.id === 'lera_no_photo_why');
  const minimum = photoEntry?.conditions?.minRelationship;
  if (!minimum?.trust || !minimum.attraction || !minimum.respect) {
    issues.push('The voluntary relationship photo must require trust, attraction, and respect.');
  }
  if (!photoEntry?.conditions?.forbiddenFlags?.includes('lera_pushed_for_photo')) {
    issues.push('The relationship photo must be forbidden after pressure.');
  }

  const blocked = nodes.get('lera_end_blocked')?.messages ?? [];
  const statusIndex = blocked.findIndex((message) => message.kind === 'statusChanged');
  if (statusIndex < 1 || !blocked.slice(0, statusIndex).some((message) => message.sender === 'character')) {
    issues.push('Blacklist ending needs an emotional boundary message before the system status.');
  }

  return issues;
}

export function serializeLeraScenarioLogic(node: DialogueNode): unknown {
  return {
    id: node.id,
    chapter: node.chapter,
    endingId: node.endingId,
    onEnter: node.onEnter,
    adBreak: node.adBreak,
    promoSafe: node.promoSafe,
    sceneContext: node.sceneContext,
    messages: node.messages.map(({ id, kind, delayMs, typing, typingInterrupted, image, conditions }) => ({
      id, kind, delayMs, typing, typingInterrupted, image, conditions,
    })),
    choices: node.choices?.map(({ id, next, effects, conditions, tone }) => ({
      id, next, effects, conditions, tone,
    })),
  };
}

function timelineMinutes(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return (hours < 6 ? hours + 24 : hours) * 60 + minutes;
}

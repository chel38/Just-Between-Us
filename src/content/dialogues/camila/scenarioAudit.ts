import type { DialogueDefinition, DialogueNode } from '../../../types/dialogue';

const firstMeetingNodes = new Set(['end_good_dawn', 'end_good_equal', 'end_secret']);
const chronologicalCore = [
  'crossing',
  'stairwell',
  'threshold',
  'archive',
  'recording',
  'interlude',
  'midnight',
  'second_room',
  'fracture',
  'mark',
  'aftershock',
  'reckoning',
  'decision',
];

const prematureMeetingPatterns = [
  /\bя (?:уже )?(?:рядом|у твоей двери)\b/i,
  /\b(?:подойди ко мне|встретимся на лестнице|я иду к тебе|i am coming over|i am outside your door|meet me on the stairs)\b/i,
];

export function auditCamilaScenario(dialogue: DialogueDefinition): string[] {
  const issues: string[] = [];
  const nodes = new Map(dialogue.nodes.map((node) => [node.id, node]));

  for (const node of dialogue.nodes) {
    const scene = node.sceneContext;
    if (!scene) {
      issues.push(`${node.id}: sceneContext is missing.`);
      continue;
    }
    if (!scene.time || !scene.playerLocation || !scene.characterLocation || !scene.sceneGoal) {
      issues.push(`${node.id}: sceneContext is incomplete.`);
    }
    if (node.id !== 'start' && scene.knownFacts.length === 0) {
      issues.push(`${node.id}: knownFacts is empty.`);
    }
    if (!firstMeetingNodes.has(node.id) && scene.playerLocation === scene.characterLocation) {
      issues.push(`${node.id}: player and Camila are colocated before a permitted first meeting.`);
    }
    if (firstMeetingNodes.has(node.id) && scene.playerLocation !== scene.characterLocation) {
      issues.push(`${node.id}: the first-meeting payoff does not colocate the characters.`);
    }

    for (const message of node.messages) {
      const text = message.text ?? '';
      if (message.kind !== 'delay' && text.length > 280) {
        issues.push(`${node.id}/${message.id}: messenger message is ${text.length} characters.`);
      }
      if (!firstMeetingNodes.has(node.id) && prematureMeetingPatterns.some((pattern) => pattern.test(text))) {
        issues.push(`${node.id}/${message.id}: text implies a premature physical meeting.`);
      }
    }
    for (const choice of node.choices ?? []) {
      if (choice.text.length > 230) issues.push(`${node.id}/${choice.id}: choice is ${choice.text.length} characters.`);
    }
  }

  const expectedLocations: Record<string, [string, string]> = {
    crossing: ['apartment_46', 'transit_to_building'],
    stairwell: ['apartment_46', 'stairwell_floor_6'],
    archive: ['apartment_46', 'apartment_47'],
    interlude: ['apartment_46', 'apartment_39'],
    midnight: ['apartment_46', 'apartment_39'],
    mark: ['apartment_46', 'apartment_39'],
    reckoning: ['apartment_46', 'apartment_39'],
  };
  for (const [nodeId, [playerLocation, characterLocation]] of Object.entries(expectedLocations)) {
    const scene = nodes.get(nodeId)?.sceneContext;
    if (scene?.playerLocation !== playerLocation || scene.characterLocation !== characterLocation) {
      issues.push(`${nodeId}: expected ${playerLocation} / ${characterLocation}.`);
    }
  }

  let previousMinutes = -1;
  for (const nodeId of chronologicalCore) {
    const node = nodes.get(nodeId);
    const minutes = node?.sceneContext ? timelineMinutes(node.sceneContext.time) : null;
    if (minutes === null) {
      issues.push(`${nodeId}: time is not a concrete HH:mm value.`);
      continue;
    }
    if (minutes < previousMinutes) issues.push(`${nodeId}: timeline moves backwards.`);
    previousMinutes = minutes;
  }

  return issues;
}

export function serializeScenarioLogic(node: DialogueNode): unknown {
  return {
    id: node.id,
    chapter: node.chapter,
    endingId: node.endingId,
    onEnter: node.onEnter,
    adBreak: node.adBreak,
    promoSafe: node.promoSafe,
    sceneContext: node.sceneContext,
    messages: node.messages.map(({ id, kind, delayMs, typing, typingInterrupted, conditions }) => ({
      id, kind, delayMs, typing, typingInterrupted, conditions,
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

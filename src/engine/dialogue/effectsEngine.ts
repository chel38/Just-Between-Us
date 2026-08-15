import type { DialogueProgress, Effects, RelationshipKey } from '../../types/dialogue';

const relationshipKeys: RelationshipKey[] = [
  'trust',
  'attraction',
  'suspicion',
  'irritation',
  'curiosity',
  'respect',
];

export function applyEffects(progress: DialogueProgress, effects?: Effects): DialogueProgress {
  if (!effects) return progress;
  const flags = new Set(progress.flags);
  effects.setFlags?.forEach((flag) => flags.add(flag));
  effects.clearFlags?.forEach((flag) => flags.delete(flag));

  const relationship = { ...progress.relationship };
  relationshipKeys.forEach((key) => {
    const delta = effects[key];
    if (typeof delta === 'number') {
      relationship[key] = Math.max(-10, Math.min(20, relationship[key] + delta));
    }
  });

  return { ...progress, flags: [...flags], relationship };
}

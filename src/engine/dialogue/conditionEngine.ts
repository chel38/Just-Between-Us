import type { Conditions, DialogueProgress } from '../../types/dialogue';

export function meetsConditions(
  conditions: Conditions | undefined,
  progress: DialogueProgress,
): boolean {
  if (!conditions) return true;
  const flags = new Set(progress.flags);
  const choices = new Set(progress.choiceHistory);

  if (conditions.requiresFlags?.some((flag) => !flags.has(flag))) return false;
  if (conditions.forbiddenFlags?.some((flag) => flags.has(flag))) return false;
  if (conditions.requiresChoices?.some((choice) => !choices.has(choice))) return false;

  for (const [key, value] of Object.entries(conditions.minRelationship ?? {})) {
    if (progress.relationship[key as keyof typeof progress.relationship] < (value ?? 0)) return false;
  }
  for (const [key, value] of Object.entries(conditions.maxRelationship ?? {})) {
    if (progress.relationship[key as keyof typeof progress.relationship] > (value ?? 0)) return false;
  }
  return true;
}

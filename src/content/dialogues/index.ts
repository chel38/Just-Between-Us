import type { DialogueDefinition } from '../../types/dialogue';
import { getCamilaDialogue } from './camila';
import { getLeraDialogue } from './lera';
import { getLubovDialogue } from './lubov';

export function getDialogues(language: 'ru' | 'en'): DialogueDefinition[] {
  return [getCamilaDialogue(language), getLeraDialogue(language), getLubovDialogue(language)];
}

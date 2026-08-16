import type { DialogueDefinition } from '../../types/dialogue';
import { getCamilaDialogue } from './camila';
import { getLeraDialogue } from './lera';

export function getDialogues(language: 'ru' | 'en'): DialogueDefinition[] {
  return [getCamilaDialogue(language), getLeraDialogue(language)];
}

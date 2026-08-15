import type { DialogueDefinition } from '../../types/dialogue';
import { getCamilaDialogue } from './camila';

export function getDialogues(language: 'ru' | 'en'): DialogueDefinition[] {
  return [getCamilaDialogue(language)];
}

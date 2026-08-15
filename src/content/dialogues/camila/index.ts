import type { DialogueDefinition } from '../../../types/dialogue';
import { camilaCharacters, camilaEndings } from './character';
import { camilaEnNodes } from './localization/en';
import { camilaRuNodes } from './localization/ru';

export function getCamilaDialogue(language: 'ru' | 'en'): DialogueDefinition {
  return {
    id: 'camila',
    title: language === 'ru' ? 'Квартира 47' : 'Apartment 47',
    startNodeId: 'start',
    character: camilaCharacters[language],
    nodes: language === 'ru' ? camilaRuNodes : camilaEnNodes,
    endings: camilaEndings[language],
  };
}

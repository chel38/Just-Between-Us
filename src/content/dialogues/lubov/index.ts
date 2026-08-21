import type { DialogueDefinition } from '../../../types/dialogue';
import { getLubovAttachments } from './attachments';
import { lubovCharacters, lubovEndings } from './character';
import { buildLubovNodes } from './graph';
import { lubovEnCopy } from './localization/en';
import { lubovRuCopy } from './localization/ru';

export function getLubovDialogue(language: 'ru' | 'en'): DialogueDefinition {
  return {
    id: 'lubov',
    title: language === 'ru' ? 'Последняя ложь' : 'The Last Lie',
    contentRating: '18+',
    startNodeId: 'lubov_start',
    character: lubovCharacters[language],
    nodes: buildLubovNodes(language === 'ru' ? lubovRuCopy : lubovEnCopy, getLubovAttachments(language)),
    endings: lubovEndings[language],
  };
}

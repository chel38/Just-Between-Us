import type { DialogueDefinition } from '../../../types/dialogue';
import { camilaCharacters, camilaEndings } from './character';
import { camilaEnNodes } from './localization/en';
import { camilaRuNodes } from './localization/ru';

const hints: Record<'ru' | 'en', Record<string, string>> = {
  ru: {
    start: 'Манера первого сообщения задаст тон доверию: Камила замечает и тепло, и границы.',
    warm_1: 'Её резкость сейчас похожа на тревогу. Спокойствие поможет услышать больше.',
    warm_2: 'Она уже признала странность. Полезнее уточнить риск, чем давить любопытством.',
    bold_1: 'Камила просит конкретную деталь и одновременно защищает адрес.',
    bold_2: 'Даже небольшая ложь о ключе может стать важнее самого ключа.',
    flirt_1: 'Шутка сработала, но она быстро проверяет, умеете ли вы стать серьёзнее.',
    flirt_2: 'За иронией появилась настоящая потеря. Сейчас важнее уважить её темп.',
    careful_1: 'Она начинает с безопасности — подробный и спокойный ответ поддержит этот ритм.',
    careful_2: 'Десять минут не отменяют ваших границ. Можно помочь, не отдавая контроль.',
    risky_1: 'Она даёт кодовое слово и чёткие инструкции: сначала выберитесь из опасного места.',
    risky_2: 'Точные наблюдения здесь ценнее обвинений, но источник её знаний тоже важен.',
    crossing: 'Встреча безопаснее, когда улики и ваше местоположение не зависят от одного телефона.',
    stairwell: 'Неожиданное поведение Марка можно проверить, не превращая проверку в прямую схватку.',
    threshold: 'Бумажный снимок всё ещё оставляет цифровые следы, а личная граница остаётся допустимым выбором.',
    archive: 'Сохранить доказательства можно так, чтобы не раскрывать чужую личную жизнь.',
    recording: 'Признание неполное. Отделите то, что Камила знала, от того, что вы о ней предполагаете.',
    interlude: 'Понимание причины не обязывает принимать способ, которым вами манипулировали.',
    midnight: 'При неизвестном человеке за дверью связь и фиксация событий надёжнее импульсивного выхода.',
    second_room: 'Повторяющиеся формулировки могут быть не посланием, а способом управлять вашими решениями.',
    fracture: 'Монтаж меняет смысл записи: проверьте, кому выгодна именно эта версия.',
    mark: 'Камила больше всего боится снова лишиться выбора — совет может вернуть его ей.',
    aftershock: 'После угрозы честность о ваших мотивах важнее попытки выглядеть безупречно.',
    reckoning: 'У вас достаточно фактов, чтобы разделить спасение людей, наказание виновного и личные отношения.',
    decision: 'Финальное решение отражает не только доверие к Камиле, но и вашу политику обращения с уликами.',
  },
  en: {
    start: 'Your first message sets the trust level: Camila notices both warmth and boundaries.',
    warm_1: 'Her sharpness sounds like fear. Staying calm may help her say more.',
    warm_2: 'She has admitted something is wrong. Clarifying the risk matters more than pushing.',
    bold_1: 'Camila asks for one precise detail while protecting the address.',
    bold_2: 'A small lie about the key may matter more than the key itself.',
    flirt_1: 'The joke landed, but she is checking whether you can become serious when needed.',
    flirt_2: 'There is real loss behind the irony. Respecting her pace matters now.',
    careful_1: 'She starts with safety; a detailed, calm answer matches that rhythm.',
    careful_2: 'Ten minutes do not erase your boundaries. You can help without giving up control.',
    risky_1: 'She gave a code word and clear steps: get out of danger before investigating.',
    risky_2: 'Precise observations beat accusations here, though the source of her knowledge still matters.',
    crossing: 'A meeting is safer when evidence and your location do not depend on one phone.',
    stairwell: 'You can test Mark’s unexpected behavior without turning it into a confrontation.',
    threshold: 'A paper photo can retain digital clues, and refusing to enter is still a valid boundary.',
    archive: 'Evidence can be preserved without exposing everyone else’s private life.',
    recording: 'The confession is incomplete. Separate what Camila knew from what you assume.',
    interlude: 'Understanding her reason does not require accepting the manipulation.',
    midnight: 'With someone outside, a live connection and a time log are safer than rushing out.',
    second_room: 'Repeated phrases may be instructions designed to steer you, not a genuine message.',
    fracture: 'Editing changes the recording’s meaning. Ask who benefits from this exact version.',
    mark: 'Camila fears losing her agency again; advice can return the decision to her.',
    aftershock: 'After a threat, honesty about your motives matters more than looking flawless.',
    reckoning: 'You now have enough facts to separate saving people, accountability, and your relationship.',
    decision: 'The final choice reflects both your trust in Camila and how you handle the evidence.',
  },
};

export function getCamilaDialogue(language: 'ru' | 'en'): DialogueDefinition {
  const nodes = language === 'ru' ? camilaRuNodes : camilaEnNodes;
  return {
    id: 'camila',
    title: language === 'ru' ? 'Квартира 47' : 'Apartment 47',
    startNodeId: 'start',
    character: camilaCharacters[language],
    nodes: nodes.map((node) => ({ ...node, hint: hints[language][node.id] })),
    endings: camilaEndings[language],
  };
}

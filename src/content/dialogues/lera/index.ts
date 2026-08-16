import type { DialogueDefinition } from '../../../types/dialogue';
import { leraCharacters, leraEndings } from './character';
import { leraEnNodes } from './localization/en';
import { leraRuNodes } from './localization/ru';

const hints: Record<'ru' | 'en', Record<string, string>> = {
  ru: {
    lera_start: 'Лера запомнит не только тон первого сообщения, но и то, насколько вы уверены без давления.',
    lera_calm_entry: 'Спокойствие работает лучше, когда оставляет собеседнице право задавать темп.',
    lera_ironic_entry: 'Она приглашает в игру, но проверяет, не превратите ли вы шутку в нападение.',
    lera_confident_entry: 'Уверенность нравится Лере, пока не начинает звучать как право на её внимание.',
    lera_flirt_entry: 'Флирт уже принят. Следующий шаг покажет, умеете ли вы не торопить его.',
    lera_risky_entry: 'Прямой вопрос может сработать, если после него вы готовы услышать неудобный ответ.',
    lera_midnight_check: 'Она спрашивает о мотиве. Красивый ответ слабее честного, если детали не совпадут.',
    lera_truth_game: 'Её правило — настоящая граница, а не препятствие, которое нужно обойти.',
    lera_boundary_respect: 'Фото не должно быть доказательством интереса. Лера сама решит, чем поделиться.',
    lera_boundary_play: 'Поддразнивание остаётся взаимным только пока оба могут спокойно остановиться.',
    lera_boundary_pressure: 'Сейчас важна не эффектная реплика, а способность признать и исправить давление.',
    lera_photo_scene: 'То, что она прислала фото добровольно, не означает согласия на следующий запрос.',
    lera_no_photo_scene: 'Отказ от запроса открыл больше доверия, чем могла бы открыть фотография.',
    lera_warning_scene: 'Она сформулировала границу второй раз. Спорить с ней — осознанный выбор с последствиями.',
    lera_gallery_clue: 'Точная деталь подтвердит память. Выдуманный источник только усилит подозрение.',
    lera_deleted_scene: 'Удалённое сообщение принадлежит ей. Терпение может оказаться убедительнее догадки.',
    lera_outfit_scene: 'Смысл фотографии — в общей памяти о встрече, а не в оценке её внешности.',
    lera_reveal: 'Она признаёт свою игру. Теперь честность важнее попытки выиграть разговор.',
    lera_final_choice: 'Финальный ответ определит, станет ли эта ночь началом, границей или разгаданным секретом.',
  },
  en: {
    lera_start: 'Lera will remember both the tone of the first message and whether confidence comes without pressure.',
    lera_calm_entry: 'Calm works best when it leaves her free to set the pace.',
    lera_ironic_entry: 'She is inviting you to play while checking whether the joke turns into an attack.',
    lera_confident_entry: 'Lera likes confidence until it starts sounding like entitlement to her attention.',
    lera_flirt_entry: 'The flirt has landed. The next step shows whether you can let it breathe.',
    lera_risky_entry: 'A direct question can work if you are ready to hear an inconvenient answer.',
    lera_midnight_check: 'She is asking about motive. A pretty answer is weaker than an honest one if details do not match.',
    lera_truth_game: 'Her rule is a real boundary, not an obstacle to work around.',
    lera_boundary_respect: 'A photo should not be proof of interest. Lera will decide what she wants to share.',
    lera_boundary_play: 'Teasing stays mutual only while both people can stop without a fight.',
    lera_boundary_pressure: 'The important move now is not a clever line but recognizing and correcting pressure.',
    lera_photo_scene: 'A voluntary photo is not consent to another request.',
    lera_no_photo_scene: 'Not asking for proof created more trust than a photo could have.',
    lera_warning_scene: 'She stated the boundary a second time. Arguing is now a deliberate choice with consequences.',
    lera_gallery_clue: 'A precise detail confirms memory. An invented source only raises suspicion.',
    lera_deleted_scene: 'The deleted message belongs to her. Patience may be more convincing than a guess.',
    lera_outfit_scene: 'The photo is about a shared memory, not a rating of her appearance.',
    lera_reveal: 'She admits to the game. Honesty now matters more than winning the conversation.',
    lera_final_choice: 'The final answer decides whether this night becomes a beginning, a boundary, or a solved secret.',
  },
};

export function getLeraDialogue(language: 'ru' | 'en'): DialogueDefinition {
  const nodes = language === 'ru' ? leraRuNodes : leraEnNodes;
  return {
    id: 'lera',
    title: language === 'ru' ? 'После полуночи' : 'After Midnight',
    contentRating: '18+',
    startNodeId: 'lera_start',
    character: leraCharacters[language],
    nodes: nodes.map((node) => ({ ...node, hint: hints[language][node.id] })),
    endings: leraEndings[language],
  };
}

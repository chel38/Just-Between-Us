import type { DialogueDefinition } from '../../../types/dialogue';
import { leraCharacters, leraEndings } from './character';
import { leraEnNodes } from './localization/en';
import { leraRuNodes } from './localization/ru';
import { leraSceneContexts } from './sceneContext';

const hints: Record<'ru' | 'en', Record<string, string>> = {
  ru: {
    lera_start: 'Надя уже передала вам контакт Леры. Первое сообщение задаст тон, но первым всегда пишете вы.',
    lera_calm_entry: 'Спокойный старт работает, если не превращать её ожидание в требование объяснений.',
    lera_ironic_entry: 'Лера принимает игру. Хорошая шутка оставляет обоим право не защищаться.',
    lera_confident_entry: 'Наблюдательность привлекает Леру, а право на её внимание — нет.',
    lera_flirt_entry: 'Флирт уже принят. Дайте ему развиваться без ускорения.',
    lera_risky_entry: 'Прямой вопрос допустим. Требование доказательств — уже давление.',
    lera_midnight_check: 'Она проверяет не красоту ответа, а его честность и связь с галереей.',
    lera_truth_game: 'Правило «нет» — реальная граница, а не препятствие в игре.',
    lera_boundary_respect: 'Отсутствие просьбы о фото может сказать больше самой смелой реплики.',
    lera_boundary_play: 'Поддразнивание остаётся взаимным только пока оба могут спокойно остановиться.',
    lera_boundary_pressure: 'Исправить давление можно только признанием, а не новой попыткой выиграть спор.',
    lera_no_photo_scene: 'Иногда отсутствие давления говорит больше, чем самый смелый ответ.',
    lera_photo_scene: 'Она поделилась снимком по собственной инициативе. Это не приглашение просить следующий.',
    lera_warning_scene: 'Лера сформулировала границу ещё раз. Следующее давление завершит разговор.',
    lera_gallery_clue: 'Точная деталь открывает секретный путь; честная неуверенность лучше выдумки.',
    lera_deleted_scene: 'Удалённое сообщение принадлежит ей. Терпение может оказаться убедительнее догадки.',
    lera_outfit_scene: 'Платье подтверждает общую галерею; важнее понять, почему Лера искала продолжения.',
    lera_reveal: 'Теперь известна правда о контакте. Ответьте на признание, а не пытайтесь победить проверку.',
    lera_final_choice: 'Предыдущие честность, уважение и память определяют доступные финалы.',
  },
  en: {
    lera_start: 'Nadia already gave you Lera’s contact. Your first message sets the tone, and you always write first.',
    lera_calm_entry: 'A calm opening works when her anticipation does not become a demand for answers.',
    lera_ironic_entry: 'Lera accepts the game. A good joke leaves neither person defending themselves.',
    lera_confident_entry: 'Lera likes perception, not entitlement to her attention.',
    lera_flirt_entry: 'The flirt has landed. Let it develop without rushing it.',
    lera_risky_entry: 'A direct question is fair. Demanding proof is pressure.',
    lera_midnight_check: 'She is testing honesty and the link to the gallery, not the prettiest answer.',
    lera_truth_game: '“No” is a real boundary, not an obstacle in the game.',
    lera_boundary_respect: 'Not asking for a photo can say more than the boldest line.',
    lera_boundary_play: 'Teasing stays mutual only while both people can stop without a fight.',
    lera_boundary_pressure: 'Pressure can only be repaired by owning it, not by trying to win again.',
    lera_no_photo_scene: 'Sometimes not applying pressure says more than the boldest answer.',
    lera_photo_scene: 'She shared the photo on her own terms. It is not an invitation to ask for another.',
    lera_warning_scene: 'Lera has stated the boundary again. More pressure will end the conversation.',
    lera_gallery_clue: 'A precise detail opens the secret path; honest uncertainty beats invention.',
    lera_deleted_scene: 'The deleted message belongs to her. Patience may be more convincing than a guess.',
    lera_outfit_scene: 'The dress proves the shared gallery. Why Lera wanted a continuation matters more.',
    lera_reveal: 'The contact story is finally clear. Respond to the admission instead of trying to win the test.',
    lera_final_choice: 'Your earlier honesty, respect, and memory decide which endings are available.',
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
    nodes: nodes.map((node) => ({
      ...node,
      hint: hints[language][node.id],
      sceneContext: leraSceneContexts[node.id],
    })),
    endings: leraEndings[language],
  };
}

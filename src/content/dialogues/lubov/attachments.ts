import type { StoryAttachment } from '../../../types/dialogue';

export type LubovAttachmentId =
  | 'lubov_proof_embrace_01'
  | 'lubov_old_message_katya'
  | 'lubov_proof_hotel_02'
  | 'lubov_planned_chat_01'
  | 'lubov_forward_stay'
  | 'lubov_forward_answer'
  | 'lubov_full_chat_02'
  | 'lubov_suitcase_photo'
  | 'lubov_mortgage_document'
  | 'lubov_bank_balance'
  | 'lubov_keys_photo'
  | 'lubov_ring_keys_photo';

const common = {
  promoAllowed: false as const,
  adultCharacters: true,
};

export function getLubovAttachments(language: 'ru' | 'en'): Record<LubovAttachmentId, StoryAttachment> {
  if (language === 'ru') return {
    lubov_proof_embrace_01: { ...common, id: 'lubov_proof_embrace_01', type: 'photo', title: 'Кадр у отеля «Север»', subtitle: 'Снято издалека с парковки', source: 'Денис · камера телефона', sourceTimestamp: 'Сегодня, 22:31', asset: './assets/characters/lubov/story/proof-embrace.png', alt: 'Далёкий ночной кадр с парковки: взрослая 31-летняя Любовь и взрослый 34-летний Артём обнимаются у освещённого входа в отель.', storyPurpose: 'Запускает конфликт и доказывает романтическую близость.' },
    lubov_old_message_katya: { ...common, id: 'lubov_old_message_katya', type: 'forwarded_message', title: 'Старое сообщение', subtitle: 'Из вашего чата', source: 'Переписка супругов', sourceTimestamp: '12 июля, 01:03', entries: [{ id: 'katya_old_1', author: 'Любовь', timestamp: '01:03', text: 'Я уже у Кати. Ложись без меня ❤️' }], storyPurpose: 'Фиксирует заявленное алиби за четырнадцать минут до входа в отель.' },
    lubov_proof_hotel_02: { ...common, id: 'lubov_proof_hotel_02', type: 'photo', title: 'Вход в «Север»', subtitle: 'Второй далёкий кадр', source: 'Денис · камера телефона', sourceTimestamp: '12 июля, 01:17', asset: './assets/characters/lubov/story/proof-hotel.png', alt: 'Далёкий ночной кадр через парковку: взрослая 31-летняя Любовь и взрослый 34-летний Артём вместе входят в освещённый отель.', storyPurpose: 'Опровергает версию об одном случайном поцелуе и связывает фото со старым сообщением.' },
    lubov_planned_chat_01: { ...common, id: 'lubov_planned_chat_01', type: 'chat_screenshot', title: 'Переписка с Артёмом', subtitle: 'Контекст вечера 12 июля', source: 'Телефон Любови', sourceTimestamp: '11–12 июля', entries: [
      { id: 'plan_1', author: 'Артём', timestamp: '22:18', text: 'Ты сегодня сможешь?' },
      { id: 'plan_2', author: 'Любовь', timestamp: '22:20', text: 'после одиннадцати' },
      { id: 'plan_3', author: 'Артём', timestamp: '22:21', text: 'А дома что скажешь?' },
      { id: 'plan_4', author: 'Любовь', timestamp: '22:24', text: 'что останусь у Кати' },
      { id: 'plan_5', author: 'Артём', timestamp: '22:25', text: 'уверена?' },
      { id: 'plan_6', author: 'Любовь', timestamp: '22:27', text: 'нет\nно всё равно приеду' },
    ], storyPurpose: 'Показывает, что встреча и ложное алиби были запланированы заранее.' },
    lubov_forward_stay: { ...common, id: 'lubov_forward_stay', type: 'forwarded_message', title: 'Сообщение Артёма', source: 'Чат Любови и Артёма', sourceTimestamp: '2 августа, 00:42', entries: [{ id: 'stay_1', author: 'Артём', timestamp: '00:42', text: 'Ты сегодня останешься?' }], storyPurpose: 'Открывает вопрос о продолжительности встречи и эмоциональной роли мужа.' },
    lubov_forward_answer: { ...common, id: 'lubov_forward_answer', type: 'forwarded_message', title: 'Ответ Любови', source: 'Чат Любови и Артёма', sourceTimestamp: '2 августа, 00:45', entries: [{ id: 'answer_1', author: 'Любовь', timestamp: '00:45', text: 'До утра не смогу. Он заметит.' }], storyPurpose: 'Показывает, как Любовь описывала мужа внутри двойной жизни.' },
    lubov_full_chat_02: { ...common, id: 'lubov_full_chat_02', type: 'chat_screenshot', title: 'Последний скрытый фрагмент', subtitle: 'Разговор 18 августа', source: 'Телефон Любови', sourceTimestamp: '18 августа, 23:12–23:18', entries: [
      { id: 'full_1', author: 'Артём', timestamp: '23:12', text: 'Ты правда собираешься оставаться с ним?' },
      { id: 'full_2', author: 'Любовь', timestamp: '23:14', text: 'я не знаю' },
      { id: 'full_3', author: 'Артём', timestamp: '23:16', text: 'Ты говоришь ему, что любишь?' },
      { id: 'full_4', author: 'Любовь', timestamp: '23:18', text: 'да\nи я уже не понимаю что это теперь значит' },
    ], storyPurpose: 'Доказывает эмоциональную привязанность и отсутствие принятого решения.' },
    lubov_suitcase_photo: { ...common, id: 'lubov_suitcase_photo', type: 'photo', title: 'Чемодан на несколько дней', subtitle: 'Собран до поездки к Кате', source: 'Любовь · общая квартира', sourceTimestamp: 'Сегодня, 21:58', asset: './assets/characters/lubov/story/packed-suitcase.png', alt: 'Открытый тёмно-бордовый чемодан с повседневными вещами на несколько дней в спальне общей квартиры.', storyPurpose: 'Делает временный разъезд бытовой реальностью.' },
    lubov_mortgage_document: { ...common, id: 'lubov_mortgage_document', type: 'document', title: 'Справка по ипотеке', subtitle: 'Вымышленные данные · не юридический документ', source: 'Семейная папка документов', sourceTimestamp: 'Актуально на 21 августа', fields: [
      { label: 'Объект', value: 'Совместная квартира' },
      { label: 'Заёмщики', value: 'Оба супруга' },
      { label: 'Остаток долга', value: '3 870 000 ₽', emphasis: true },
      { label: 'Ежемесячный платёж', value: '68 400 ₽' },
      { label: 'Следующий платёж', value: '5 сентября' },
    ], storyPurpose: 'Подтверждает совместную собственность и незакрытый долг.' },
    lubov_bank_balance: { ...common, id: 'lubov_bank_balance', type: 'document', title: 'Совместный накопительный счёт', subtitle: 'Фиктивный экран банковского приложения', source: 'Телефон Любови', sourceTimestamp: 'Сегодня, 23:54', fields: [
      { label: 'Доступно', value: '1 240 000 ₽', emphasis: true },
      { label: 'Последняя операция', value: '+ 65 000 ₽' },
      { label: 'Снятия за 90 дней', value: '0 ₽' },
      { label: 'Статус', value: 'Без изменений' },
    ], storyPurpose: 'Подтверждает, что семейные накопления не тратились на связь.' },
    lubov_keys_photo: { ...common, id: 'lubov_keys_photo', type: 'photo', title: 'Ключи на столе', subtitle: 'Запасной комплект', source: 'Любовь · общая квартира', sourceTimestamp: 'Сегодня, 22:02', asset: './assets/characters/lubov/story/keys.png', alt: 'Обычные квартирные и автомобильный ключи лежат на тёмном столе рядом с пустой запиской.', storyPurpose: 'Подтверждает практическую договорённость о разъезде.' },
    lubov_ring_keys_photo: { ...common, id: 'lubov_ring_keys_photo', type: 'photo', title: 'Кольцо и ключи', subtitle: 'Последнее фото этой ночи', source: 'Любовь · общая квартира', sourceTimestamp: 'Сегодня, 22:04', asset: './assets/characters/lubov/story/ring-and-keys.png', alt: 'Обручальное кольцо лежит отдельно рядом с квартирными и автомобильным ключами на тёмном столе.', storyPurpose: 'Ставит визуальную точку в окончательных ветках развода.' },
  };

  return {
    lubov_proof_embrace_01: { ...common, id: 'lubov_proof_embrace_01', type: 'photo', title: 'Outside the Sever Hotel', subtitle: 'Shot from across the parking lot', source: 'Denis · phone camera', sourceTimestamp: 'Today, 10:31 PM', asset: './assets/characters/lubov/story/proof-embrace.png', alt: 'A distant night photo across a parking lot: 31-year-old adult Lyubov and 34-year-old adult Artyom embracing outside a lit hotel entrance.', storyPurpose: 'Starts the confrontation and proves romantic intimacy.' },
    lubov_old_message_katya: { ...common, id: 'lubov_old_message_katya', type: 'forwarded_message', title: 'Old message', subtitle: 'From your chat', source: 'The spouses’ chat', sourceTimestamp: 'July 12, 1:03 AM', entries: [{ id: 'katya_old_1', author: 'Lyubov', timestamp: '1:03 AM', text: 'I’m already at Katya’s. Go to bed without me ❤️' }], storyPurpose: 'Fixes her stated alibi fourteen minutes before the hotel entrance.' },
    lubov_proof_hotel_02: { ...common, id: 'lubov_proof_hotel_02', type: 'photo', title: 'Entering the Sever', subtitle: 'Second distant frame', source: 'Denis · phone camera', sourceTimestamp: 'July 12, 1:17 AM', asset: './assets/characters/lubov/story/proof-hotel.png', alt: 'A distant night photo across a parking lot: 31-year-old adult Lyubov and 34-year-old adult Artyom entering a lit hotel together.', storyPurpose: 'Breaks the one-kiss claim and links the image to the old message.' },
    lubov_planned_chat_01: { ...common, id: 'lubov_planned_chat_01', type: 'chat_screenshot', title: 'Chat with Artyom', subtitle: 'Context from the night of July 12', source: 'Lyubov’s phone', sourceTimestamp: 'July 11–12', entries: [
      { id: 'plan_1', author: 'Artyom', timestamp: '10:18 PM', text: 'Can you make it tonight?' },
      { id: 'plan_2', author: 'Lyubov', timestamp: '10:20 PM', text: 'after eleven' },
      { id: 'plan_3', author: 'Artyom', timestamp: '10:21 PM', text: 'What will you say at home?' },
      { id: 'plan_4', author: 'Lyubov', timestamp: '10:24 PM', text: 'that I’m staying at Katya’s' },
      { id: 'plan_5', author: 'Artyom', timestamp: '10:25 PM', text: 'You sure?' },
      { id: 'plan_6', author: 'Lyubov', timestamp: '10:27 PM', text: 'no\nbut I’m still coming' },
    ], storyPurpose: 'Shows that both the meeting and the false alibi were planned.' },
    lubov_forward_stay: { ...common, id: 'lubov_forward_stay', type: 'forwarded_message', title: 'Message from Artyom', source: 'Lyubov and Artyom’s chat', sourceTimestamp: 'August 2, 12:42 AM', entries: [{ id: 'stay_1', author: 'Artyom', timestamp: '12:42 AM', text: 'Are you staying tonight?' }], storyPurpose: 'Opens the question of how long she stayed and the husband’s place in the double life.' },
    lubov_forward_answer: { ...common, id: 'lubov_forward_answer', type: 'forwarded_message', title: 'Lyubov’s reply', source: 'Lyubov and Artyom’s chat', sourceTimestamp: 'August 2, 12:45 AM', entries: [{ id: 'answer_1', author: 'Lyubov', timestamp: '12:45 AM', text: 'I can’t stay until morning. He’ll notice.' }], storyPurpose: 'Shows how Lyubov described her husband inside the double life.' },
    lubov_full_chat_02: { ...common, id: 'lubov_full_chat_02', type: 'chat_screenshot', title: 'The last hidden fragment', subtitle: 'Conversation from August 18', source: 'Lyubov’s phone', sourceTimestamp: 'August 18, 11:12–11:18 PM', entries: [
      { id: 'full_1', author: 'Artyom', timestamp: '11:12 PM', text: 'Are you really going to stay with him?' },
      { id: 'full_2', author: 'Lyubov', timestamp: '11:14 PM', text: 'I don’t know' },
      { id: 'full_3', author: 'Artyom', timestamp: '11:16 PM', text: 'Do you tell him you love him?' },
      { id: 'full_4', author: 'Lyubov', timestamp: '11:18 PM', text: 'yes\nand I don’t know what that means anymore' },
    ], storyPurpose: 'Proves emotional attachment and that no decision had been made.' },
    lubov_suitcase_photo: { ...common, id: 'lubov_suitcase_photo', type: 'photo', title: 'A suitcase for a few days', subtitle: 'Packed before going to Katya’s', source: 'Lyubov · shared apartment', sourceTimestamp: 'Today, 9:58 PM', asset: './assets/characters/lubov/story/packed-suitcase.png', alt: 'An open dark burgundy suitcase with ordinary clothes for a few days in the shared apartment bedroom.', storyPurpose: 'Makes the temporary separation physically real.' },
    lubov_mortgage_document: { ...common, id: 'lubov_mortgage_document', type: 'document', title: 'Mortgage statement', subtitle: 'Fictional data · not a legal document', source: 'Family document folder', sourceTimestamp: 'Current as of August 21', fields: [
      { label: 'Property', value: 'Joint apartment' },
      { label: 'Borrowers', value: 'Both spouses' },
      { label: 'Balance remaining', value: '₽3,870,000', emphasis: true },
      { label: 'Monthly payment', value: '₽68,400' },
      { label: 'Next payment', value: 'September 5' },
    ], storyPurpose: 'Confirms joint ownership and outstanding debt.' },
    lubov_bank_balance: { ...common, id: 'lubov_bank_balance', type: 'document', title: 'Joint savings account', subtitle: 'Fictional banking app screen', source: 'Lyubov’s phone', sourceTimestamp: 'Today, 11:54 PM', fields: [
      { label: 'Available', value: '₽1,240,000', emphasis: true },
      { label: 'Last transaction', value: '+ ₽65,000' },
      { label: 'Withdrawals in 90 days', value: '₽0' },
      { label: 'Status', value: 'Unchanged' },
    ], storyPurpose: 'Confirms that the affair did not use the family savings.' },
    lubov_keys_photo: { ...common, id: 'lubov_keys_photo', type: 'photo', title: 'Keys on the table', subtitle: 'Spare set', source: 'Lyubov · shared apartment', sourceTimestamp: 'Today, 10:02 PM', asset: './assets/characters/lubov/story/keys.png', alt: 'Ordinary apartment and car keys on a dark table beside a blank folded note.', storyPurpose: 'Confirms the practical separation agreement.' },
    lubov_ring_keys_photo: { ...common, id: 'lubov_ring_keys_photo', type: 'photo', title: 'Ring and keys', subtitle: 'The final photo tonight', source: 'Lyubov · shared apartment', sourceTimestamp: 'Today, 10:04 PM', asset: './assets/characters/lubov/story/ring-and-keys.png', alt: 'A wedding band lies separately beside apartment and car keys on a dark wooden table.', storyPurpose: 'Provides a visual full stop for final divorce branches.' },
  };
}

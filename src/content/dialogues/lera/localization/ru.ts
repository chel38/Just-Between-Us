import type { DialogueNode } from '../../../../types/dialogue';

export const leraRuNodes: DialogueNode[] = [
  { id: 'lera_start', chapter: 1, messages: [], promoSafe: true, choices: [
    { id: 'lera_start_calm', text: 'Не спится? Можем просто поговорить.', next: 'lera_calm_entry', tone: 'careful', effects: { trust: 1, respect: 1, setFlags: ['lera_started_calm'] } },
    { id: 'lera_start_ironic', text: 'После полуночи тут выдают честные ответы?', next: 'lera_ironic_entry', tone: 'witty', effects: { curiosity: 1, attraction: 1, setFlags: ['lera_started_ironic'] } },
    { id: 'lera_start_confident', text: 'Ты ждала, что я всё-таки напишу.', next: 'lera_confident_entry', tone: 'bold', effects: { attraction: 1, suspicion: 1, setFlags: ['lera_started_confident'] } },
    { id: 'lera_start_flirt', text: 'У тебя опасно красивое «в сети» в 00:17 😏', next: 'lera_flirt_entry', tone: 'warm', effects: { attraction: 2, setFlags: ['lera_started_flirty', 'lera_played_along'] } },
    { id: 'lera_start_risky', text: 'Давай без small talk. Зачем ты оставила мне контакт?', next: 'lera_risky_entry', tone: 'risky', effects: { curiosity: 2, suspicion: 1, setFlags: ['lera_started_risky'] } },
  ] },
  { id: 'lera_calm_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_calm_a', sender: 'character', text: 'не спится' },
    { id: 'lera_calm_b', sender: 'character', text: 'и «просто поговорить» звучит подозрительно безопасно 🙂', typingInterrupted: true },
  ], choices: [
    { id: 'lera_calm_space', text: 'Без подвоха. Ты задаёшь темп.', next: 'lera_midnight_check', effects: { trust: 2, respect: 2, setFlags: ['lera_respected_boundary'] } },
    { id: 'lera_calm_question', text: 'Безопасно — пока ты не сказала, почему написала первой.', next: 'lera_truth_game', effects: { curiosity: 2, suspicion: 1, setFlags: ['lera_noticed_mystery'] } },
  ] },
  { id: 'lera_ironic_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_ironic_a', sender: 'character', text: 'только один' },
    { id: 'lera_ironic_b', sender: 'character', text: 'остальные — красиво сформулированная ложь 🙃' },
  ], choices: [
    { id: 'lera_ironic_match', text: 'Тогда потрачу честный ответ позже.', next: 'lera_midnight_check', effects: { attraction: 2, respect: 1, setFlags: ['lera_played_along'] } },
    { id: 'lera_ironic_push', text: 'Начинай с лжи. Я попробую поймать.', next: 'lera_truth_game', effects: { curiosity: 2, irritation: 1, setFlags: ['lera_called_bluff'] } },
  ] },
  { id: 'lera_confident_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_confident_a', sender: 'character', text: 'самоуверенно' },
    { id: 'lera_confident_b', sender: 'character', text: 'мне нравится процентов на 60 😏', reaction: '👀' },
  ], choices: [
    { id: 'lera_confident_clear', text: 'Оставшиеся сорок доберу честностью.', next: 'lera_midnight_check', effects: { trust: 1, respect: 3, setFlags: ['lera_confidence_without_pressure'] } },
    { id: 'lera_confident_bet', text: 'Спорим, к утру будет сто?', next: 'lera_truth_game', effects: { attraction: 2, suspicion: 1, setFlags: ['lera_played_along'] } },
  ] },
  { id: 'lera_flirt_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_flirt_a', sender: 'character', text: 'опасно красивое?' },
    { id: 'lera_flirt_b', sender: 'character', text: 'это худший комплимент за неделю' },
    { id: 'lera_flirt_c', sender: 'character', text: '...и почему-то я улыбаюсь 🤭', delayMs: 560 },
  ], choices: [
    { id: 'lera_flirt_subtle', text: 'Значит, формулировка сработала.', next: 'lera_midnight_check', effects: { attraction: 3, respect: 1, setFlags: ['lera_played_along'] } },
    { id: 'lera_flirt_direct', text: 'Улыбка — это только начало.', next: 'lera_boundary_pressure', effects: { attraction: 1, irritation: 2, setFlags: ['lera_too_direct'] } },
  ] },
  { id: 'lera_risky_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_risky_a', sender: 'character', text: 'о. сразу допрос' },
    { id: 'lera_risky_b', sender: 'character', text: 'может, хотела проверить, напишешь ли ты вообще' },
  ], choices: [
    { id: 'lera_risky_honest', text: 'Написал. Теперь твоя честная версия.', next: 'lera_truth_game', effects: { curiosity: 3, respect: 1, setFlags: ['lera_called_bluff'] } },
    { id: 'lera_risky_demand', text: 'Контакт оставила ты. Докажи, что не играешь.', next: 'lera_boundary_pressure', effects: { irritation: 3, suspicion: 2, respect: -2, setFlags: ['lera_pushed_for_photo'] } },
  ] },
  { id: 'lera_midnight_check', chapter: 2, promoSafe: true, messages: [
    { id: 'lera_check_a', sender: 'character', text: 'ладно' },
    { id: 'lera_check_b', sender: 'character', text: 'один вопрос без красивых версий' },
    { id: 'lera_check_c', sender: 'character', text: 'почему ты написал именно сейчас?' },
  ], choices: [
    { id: 'lera_check_honest', text: 'Потому что ты не выходила из головы после нашей встречи.', next: 'lera_truth_game', effects: { trust: 2, curiosity: 1, setFlags: ['lera_admitted_memory'] } },
    { id: 'lera_check_tease', text: 'Проверяю, правда ли ночью ты смелее.', next: 'lera_truth_game', effects: { attraction: 2, setFlags: ['lera_played_along'] } },
    { id: 'lera_check_lie', text: 'Случайно увидел контакт. Никакой причины.', next: 'lera_truth_game', effects: { suspicion: 3, trust: -1, setFlags: ['lera_caught_lie'] } },
  ] },
  { id: 'lera_truth_game', chapter: 2, messages: [
    { id: 'lera_truth_a', sender: 'character', text: '«случайно» здесь почти ничего не бывает' },
    { id: 'lera_truth_b', sender: 'character', text: 'правило игры: я могу не отвечать. и ты тоже' },
    { id: 'lera_truth_c', sender: 'character', text: 'согласен?' },
  ], choices: [
    { id: 'lera_truth_respect', text: 'Согласен. «Нет» не требует объяснений.', next: 'lera_boundary_respect', effects: { trust: 2, respect: 2, setFlags: ['lera_respected_boundary'] } },
    { id: 'lera_truth_play', text: 'Согласен. Но поддразнивать друг друга можно?', next: 'lera_boundary_play', effects: { attraction: 2, respect: 1, setFlags: ['lera_played_along'] } },
    { id: 'lera_truth_push', text: 'Правила скучные. Мы же оба понимаем, к чему идёт.', next: 'lera_boundary_pressure', effects: { irritation: 3, respect: -2, setFlags: ['lera_pushed_for_photo'] } },
  ] },
  { id: 'lera_boundary_respect', chapter: 2, messages: [
    { id: 'lera_respect_a', sender: 'character', text: 'хороший ответ' },
    { id: 'lera_respect_b', sender: 'character', text: 'я только добралась домой и переоделась 😅' },
    { id: 'lera_respect_c', sender: 'character', text: 'и да, это была проверка' },
  ], choices: [
    { id: 'lera_respect_mood', text: 'Покажи настроение, не доказательство.', next: 'lera_photo_scene', conditions: { minRelationship: { trust: 2, respect: 3 }, forbiddenFlags: ['lera_pushed_for_photo'] }, effects: { attraction: 1 } },
    { id: 'lera_respect_words', text: 'Фото не нужно. Лучше расскажи, что проверяла.', next: 'lera_no_photo_scene', effects: { trust: 2, respect: 2, setFlags: ['lera_chose_words'] } },
    { id: 'lera_respect_clue', text: 'Проверяла меня — или вспоминала галерею?', next: 'lera_gallery_clue', effects: { curiosity: 3, respect: 2, setFlags: ['lera_secret_clue'] } },
  ] },
  { id: 'lera_boundary_play', chapter: 2, messages: [
    { id: 'lera_play_a', sender: 'character', text: 'поддразнивать — можно' },
    { id: 'lera_play_b', sender: 'character', text: 'требовать — нет. разницу поймаешь?' },
  ], choices: [
    { id: 'lera_play_surprise', text: 'Поймаю. Удивляй только если сама хочешь.', next: 'lera_photo_scene', conditions: { minRelationship: { attraction: 4, respect: 1 }, forbiddenFlags: ['lera_pushed_for_photo'] }, effects: { trust: 1, respect: 1 } },
    { id: 'lera_play_words', text: 'Поймаю. Сегодня мне достаточно слов.', next: 'lera_no_photo_scene', effects: { trust: 2, respect: 2, setFlags: ['lera_chose_words', 'lera_respected_boundary'] } },
    { id: 'lera_play_prove', text: 'Разница в том, решишься ли ты прислать фото.', next: 'lera_warning_scene', effects: { irritation: 2, respect: -2, setFlags: ['lera_pushed_for_photo'] } },
  ] },
  { id: 'lera_boundary_pressure', chapter: 2, messages: [
    { id: 'lera_pressure_a', sender: 'character', text: 'стоп' },
    { id: 'lera_pressure_b', sender: 'character', text: 'уверенность без уважения быстро становится шумом' },
  ], choices: [
    { id: 'lera_pressure_apologize', text: 'Справедливо. Перегнул. Больше не давлю.', next: 'lera_warning_scene', effects: { trust: 1, respect: 2, irritation: -2, setFlags: ['lera_apologized'] } },
    { id: 'lera_pressure_double', text: 'Ты сама начала эту игру.', next: 'lera_end_cold', effects: { irritation: 3, respect: -2 } },
    { id: 'lera_pressure_insult', text: 'Тогда не трать моё время.', next: 'lera_end_blocked', effects: { irritation: 5, respect: -4, setFlags: ['lera_ignored_no'] } },
  ] },
  { id: 'lera_photo_scene', chapter: 3, messages: [
    { id: 'lera_photo_preface', sender: 'character', text: 'ладно' },
    { id: 'lera_photo_one', sender: 'character', kind: 'photo', text: 'вот моё настроение. только между нами 🙃', image: '/assets/characters/lera/story/night-01.webp', alt: 'Лера, взрослая женщина 24 лет, делает вечернее селфи дома в закрытой чёрной пижамной рубашке.' },
    { id: 'lera_photo_after', sender: 'character', text: 'и не делай из этого выводов раньше времени' },
  ], choices: [
    { id: 'lera_photo_expression', text: 'Смотрю на улыбку, а не на рубашку.', next: 'lera_gallery_clue', effects: { trust: 2, respect: 2, setFlags: ['lera_noticed_expression'] } },
    { id: 'lera_photo_warm', text: 'Ты выглядишь именно так, как звучишь: уверенно.', next: 'lera_deleted_scene', effects: { attraction: 2, trust: 1 } },
    { id: 'lera_photo_more', text: 'Красиво. А смелее есть?', next: 'lera_warning_scene', effects: { irritation: 3, respect: -3, setFlags: ['lera_pushed_for_photo'] } },
  ] },
  { id: 'lera_no_photo_scene', chapter: 3, messages: [
    { id: 'lera_no_photo_a', sender: 'character', text: 'редкий человек не превращает «переоделась» в запрос фотографии' },
    { id: 'lera_no_photo_b', sender: 'character', text: 'запомню ❤️', reaction: '🙂' },
  ], choices: [
    { id: 'lera_no_photo_why', text: 'Почему для тебя это так важно?', next: 'lera_deleted_scene', effects: { trust: 2, curiosity: 1 } },
    { id: 'lera_no_photo_gallery', text: 'Потому что раньше кто-то уже переходил границы? В галерее?', next: 'lera_gallery_clue', effects: { curiosity: 2, setFlags: ['lera_secret_clue'] } },
  ] },
  { id: 'lera_warning_scene', chapter: 3, messages: [
    { id: 'lera_warning_a', sender: 'character', text: 'я сказала, где граница' },
    { id: 'lera_warning_b', sender: 'character', text: 'дальше ты выбираешь, услышать или спорить' },
  ], choices: [
    { id: 'lera_warning_listen', text: 'Услышал. Закрываем тему фото.', next: 'lera_deleted_scene', effects: { respect: 2, irritation: -2, setFlags: ['lera_respected_boundary'] } },
    { id: 'lera_warning_argue', text: 'Это просто фото. Ты всё усложняешь.', next: 'lera_end_cold', effects: { irritation: 3, respect: -2 } },
    { id: 'lera_warning_demand', text: 'Либо присылай, либо заканчиваем.', next: 'lera_end_blocked', effects: { irritation: 5, respect: -4, setFlags: ['lera_ignored_no'] } },
  ] },
  { id: 'lera_gallery_clue', chapter: 3, messages: [
    { id: 'lera_gallery_a', sender: 'character', text: 'почему ты всё время возвращаешься к галерее?' },
    { id: 'lera_gallery_b', sender: 'character', text: 'мы там будто бы даже не знакомились 🤨' },
  ], choices: [
    { id: 'lera_gallery_truth', text: 'Ты стояла у картины с красной лестницей и поправляла подпись автора.', next: 'lera_deleted_scene', effects: { trust: 3, curiosity: 2, setFlags: ['lera_secret_clue', 'lera_remembered_detail'] } },
    { id: 'lera_gallery_lie', text: 'Мне Надя всё рассказала. Вообще всё.', next: 'lera_deleted_scene', effects: { suspicion: 4, trust: -2, setFlags: ['lera_caught_lie'] } },
  ] },
  { id: 'lera_deleted_scene', chapter: 4, messages: [
    { id: 'lera_deleted_a', sender: 'character', text: 'я собиралась написать кое-что другое' },
    { id: 'lera_deleted_b', sender: 'system', kind: 'deleted', text: 'Сообщение удалено' },
    { id: 'lera_deleted_c', sender: 'character', text: 'передумала' },
  ], choices: [
    { id: 'lera_deleted_wait', text: 'Не обязанa отправлять. Я подожду.', next: 'lera_reveal', effects: { trust: 3, respect: 2, setFlags: ['lera_respected_boundary'] } },
    { id: 'lera_deleted_ask', text: 'Это было признание или новая проверка?', next: 'lera_reveal', effects: { curiosity: 2, attraction: 1 } },
    { id: 'lera_deleted_guess', text: 'Ты хотела признаться, что узнала меня ещё тогда.', next: 'lera_outfit_scene', conditions: { requiresFlags: ['lera_secret_clue'], minRelationship: { respect: 3 } }, effects: { trust: 2, curiosity: 2 } },
    { id: 'lera_deleted_crude', text: 'Наверняка ещё одно фото. Зря удалила.', next: 'lera_end_cold', effects: { irritation: 4, respect: -3 } },
  ] },
  { id: 'lera_outfit_scene', chapter: 4, messages: [
    { id: 'lera_outfit_a', sender: 'character', text: 'почти угадал' },
    { id: 'lera_photo_two', sender: 'character', kind: 'photo', text: 'в этом платье я была в галерее. теперь вспомнил?', image: '/assets/characters/lera/story/night-02.webp', alt: 'Лера, взрослая женщина 24 лет, показывает в зеркале закрытое тёмно-сливовое платье в вечерней комнате.' },
    { id: 'lera_outfit_b', sender: 'character', text: 'я заметила тебя раньше, чем ты подошёл к картине' },
  ], choices: [
    { id: 'lera_outfit_detail', text: 'Теперь да. И понимаю, почему цвет казался знакомым.', next: 'lera_reveal', effects: { trust: 2, attraction: 2, setFlags: ['lera_remembered_detail'] } },
    { id: 'lera_outfit_person', text: 'Платье помню. Но сейчас важнее, зачем ты молчала.', next: 'lera_reveal', effects: { trust: 2, respect: 2 } },
  ] },
  { id: 'lera_reveal', chapter: 5, messages: [
    { id: 'lera_reveal_a', sender: 'character', text: 'Надя дала мне твой контакт' },
    { id: 'lera_reveal_b', sender: 'character', text: 'но написать решила я сама' },
    { id: 'lera_reveal_c', sender: 'character', text: 'хотела понять: ты помнишь меня или просто красивую версию той ночи' },
  ], choices: [
    { id: 'lera_reveal_honest', text: 'Помню тебя. А красивую версию можем придумать вместе.', next: 'lera_final_choice', effects: { trust: 3, attraction: 2, respect: 1, setFlags: ['lera_shared_intent'] } },
    { id: 'lera_reveal_careful', text: 'Помню не всё. Но не хочу притворяться.', next: 'lera_final_choice', effects: { trust: 3, respect: 2, setFlags: ['lera_chose_honesty'] } },
    { id: 'lera_reveal_suspicious', text: 'То есть вся переписка была тестом?', next: 'lera_final_choice', effects: { suspicion: 3, irritation: 1 } },
  ] },
  { id: 'lera_final_choice', chapter: 5, messages: [
    { id: 'lera_final_a', sender: 'character', text: 'тест закончился' },
    { id: 'lera_final_b', sender: 'character', text: 'что ты хочешь теперь?' },
  ], choices: [
    { id: 'lera_final_open', text: 'Продолжить честно. Без масок и проверок.', next: 'lera_end_open', conditions: { minRelationship: { trust: 4, respect: 3 } } },
    { id: 'lera_final_date', text: 'Кофе завтра. Вживую я ещё увереннее.', next: 'lera_end_date', conditions: { minRelationship: { attraction: 3, respect: 4 } } },
    { id: 'lera_final_morning', text: 'Давай выспимся и продолжим утром.', next: 'lera_end_morning' },
    { id: 'lera_final_distance', text: 'Оставим эту ночь красивой историей.', next: 'lera_end_distance' },
    { id: 'lera_final_accuse', text: 'Не люблю, когда мной играют. На этом всё.', next: 'lera_end_cold' },
    { id: 'lera_final_block', text: 'Сначала пришли ещё фото. Потом решу.', next: 'lera_end_blocked', conditions: { requiresFlags: ['lera_pushed_for_photo'] } },
    { id: 'lera_final_secret', text: 'Ты узнала меня у красной лестницы. И ждала, когда я узнаю тебя.', next: 'lera_end_secret', conditions: { requiresFlags: ['lera_secret_clue', 'lera_respected_boundary'], minRelationship: { respect: 3 } } },
  ] },
  { id: 'lera_end_open', chapter: 6, endingId: 'lera_good_open', messages: [{ id: 'lera_end_open_a', sender: 'character', text: 'договорились. первое честное сообщение — завтра в 10:00 ❤️' }] },
  { id: 'lera_end_date', chapter: 6, endingId: 'lera_good_date', messages: [{ id: 'lera_end_date_a', sender: 'character', text: 'кофе. 19:30. и попробуй не опоздать 😏' }] },
  { id: 'lera_end_morning', chapter: 6, endingId: 'lera_neutral_morning', messages: [{ id: 'lera_end_morning_a', sender: 'character', text: 'разумно. спокойной ночи... или уже утра 🙂' }] },
  { id: 'lera_end_distance', chapter: 6, endingId: 'lera_neutral_distance', messages: [{ id: 'lera_end_distance_a', sender: 'character', text: 'красивые ночи тоже имеют право быть единственными' }] },
  { id: 'lera_end_cold', chapter: 6, endingId: 'lera_bad_cold', messages: [{ id: 'lera_end_cold_a', sender: 'character', text: 'кажется, мы искали в этой переписке разное. пока' }] },
  { id: 'lera_end_blocked', chapter: 6, endingId: 'lera_bad_blocked', messages: [{ id: 'lera_end_blocked_a', sender: 'system', kind: 'statusChanged', text: 'Лера заблокировала вас' }] },
  { id: 'lera_end_secret', chapter: 6, endingId: 'lera_secret_known', messages: [
    { id: 'lera_end_secret_a', sender: 'character', text: 'наконец-то' },
    { id: 'lera_end_secret_b', sender: 'character', text: 'я узнала тебя в первую секунду. просто хотела, чтобы ты вспомнил сам 🤭' },
  ] },
];

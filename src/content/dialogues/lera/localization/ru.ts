import type { DialogueNode } from '../../../../types/dialogue';

export const leraRuNodes: DialogueNode[] = [
  { id: 'lera_start', chapter: 1, messages: [], promoSafe: true, choices: [
    { id: 'lera_start_calm', text: 'Привет. Надя передала твой контакт. Не спится?', next: 'lera_calm_entry', tone: 'careful', effects: { trust: 1, respect: 1, setFlags: ['lera_started_calm'] } },
    { id: 'lera_start_ironic', text: 'После полуночи тут выдают честные ответы? Надя адресом поделилась.', next: 'lera_ironic_entry', tone: 'witty', effects: { curiosity: 1, attraction: 1, setFlags: ['lera_started_ironic'] } },
    { id: 'lera_start_confident', text: 'Кажется, мы были в одной галерее. Решил проверить, совпадение ли это.', next: 'lera_confident_entry', tone: 'bold', effects: { attraction: 1, curiosity: 1, setFlags: ['lera_started_confident'] } },
    { id: 'lera_start_flirt', text: 'После той галереи у твоего «в сети» подозрительно красивый вид 😏', next: 'lera_flirt_entry', tone: 'warm', effects: { trust: 1, attraction: 2, setFlags: ['lera_started_flirty', 'lera_played_along'] } },
    { id: 'lera_start_risky', text: 'Давай без small talk. Зачем Надя передала мне именно твой контакт?', next: 'lera_risky_entry', tone: 'risky', effects: { curiosity: 2, suspicion: 1, setFlags: ['lera_started_risky'] } },
  ] },
  { id: 'lera_calm_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_calm_a', sender: 'character', text: 'не спится' },
    { id: 'lera_calm_b', sender: 'character', text: 'и ты всё-таки написал 🙂' },
  ], choices: [
    { id: 'lera_calm_space', text: 'Без подвоха. Можем просто поговорить.', next: 'lera_midnight_check', effects: { trust: 2, respect: 2, setFlags: ['lera_respected_boundary'] } },
    { id: 'lera_calm_question', text: '«Всё-таки» звучит так, будто ты ждала.', next: 'lera_midnight_check', effects: { curiosity: 2, trust: 1, setFlags: ['lera_noticed_mystery'] } },
  ] },
  { id: 'lera_ironic_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_ironic_a', sender: 'character', text: 'только один' },
    { id: 'lera_ironic_b', sender: 'character', text: 'остальные придётся заслужить 🙃' },
  ], choices: [
    { id: 'lera_ironic_match', text: 'Тогда честный ответ пока приберегу.', next: 'lera_midnight_check', effects: { attraction: 2, trust: 1, respect: 1, setFlags: ['lera_played_along'] } },
    { id: 'lera_ironic_push', text: 'Начинай с вопроса. Посмотрим, насколько он честный.', next: 'lera_midnight_check', effects: { curiosity: 2, respect: 1, setFlags: ['lera_called_bluff'] } },
  ] },
  { id: 'lera_confident_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_confident_a', sender: 'character', text: 'наблюдательно' },
    { id: 'lera_confident_b', sender: 'character', text: 'или самоуверенно. я ещё не решила 😏', reaction: '👀' },
  ], choices: [
    { id: 'lera_confident_clear', text: 'Начну с наблюдательности. Самоуверенность оставлю на потом.', next: 'lera_midnight_check', effects: { trust: 2, respect: 2, setFlags: ['lera_confidence_without_pressure'] } },
    { id: 'lera_confident_bet', text: 'К утру решишь. Я никуда не тороплюсь.', next: 'lera_midnight_check', effects: { attraction: 2, trust: 1, respect: 1, setFlags: ['lera_played_along'] } },
  ] },
  { id: 'lera_flirt_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_flirt_a', sender: 'character', text: 'подозрительно красивый?' },
    { id: 'lera_flirt_b', sender: 'character', text: 'это ужасный комплимент' },
    { id: 'lera_flirt_c', sender: 'character', text: '...но почему-то работает 🤭', delayMs: 560 },
  ], choices: [
    { id: 'lera_flirt_subtle', text: 'Значит, оставим его в протоколе.', next: 'lera_midnight_check', effects: { attraction: 2, trust: 1, respect: 1, setFlags: ['lera_played_along'] } },
    { id: 'lera_flirt_direct', text: 'Принято. Дальше ничего за тебя не додумываю.', next: 'lera_midnight_check', effects: { trust: 2, respect: 2, setFlags: ['lera_respected_boundary'] } },
  ] },
  { id: 'lera_risky_entry', chapter: 1, promoSafe: true, messages: [
    { id: 'lera_risky_a', sender: 'character', text: 'о. сразу допрос' },
    { id: 'lera_risky_b', sender: 'character', text: 'может, мне было интересно, напишешь ли ты вообще' },
  ], choices: [
    { id: 'lera_risky_honest', text: 'Написал. Теперь можно начать без допроса.', next: 'lera_midnight_check', effects: { curiosity: 2, trust: 1, respect: 1, setFlags: ['lera_called_bluff'] } },
    { id: 'lera_risky_demand', text: 'Тогда докажи, что это не очередная игра.', next: 'lera_boundary_pressure', effects: { irritation: 3, suspicion: 2, respect: -2, setFlags: ['lera_pushed_for_photo'] } },
  ] },
  { id: 'lera_midnight_check', chapter: 2, promoSafe: true, messages: [
    { id: 'lera_check_calm', sender: 'character', text: 'хорошо. просто поговорим', conditions: { requiresFlags: ['lera_started_calm'] } },
    { id: 'lera_check_ironic', sender: 'character', text: 'ладно. трачу на тебя тот самый честный вопрос', conditions: { requiresFlags: ['lera_started_ironic'] } },
    { id: 'lera_check_confident', sender: 'character', text: 'проверим твою наблюдательность', conditions: { requiresFlags: ['lera_started_confident'] } },
    { id: 'lera_check_flirty', sender: 'character', text: 'раз комплимент сработал — продолжим 😏', conditions: { requiresFlags: ['lera_started_flirty'] } },
    { id: 'lera_check_risky', sender: 'character', text: 'без допроса так без допроса', conditions: { requiresFlags: ['lera_started_risky'] } },
    { id: 'lera_check_a', sender: 'character', text: 'почему ты написал именно сейчас?' },
    { id: 'lera_check_b', sender: 'character', text: 'не днём. не сразу после Нади. а после полуночи' },
    { id: 'lera_check_c', sender: 'character', text: 'только без красивой версии' },
  ], choices: [
    { id: 'lera_check_honest', text: 'После той галереи ты почему-то не выходила у меня из головы.', next: 'lera_truth_game', effects: { trust: 2, attraction: 1, curiosity: 1, setFlags: ['lera_admitted_memory'] } },
    { id: 'lera_check_tease', text: 'Ночью проще написать то, что весь день откладывал.', next: 'lera_truth_game', effects: { attraction: 2, trust: 1, setFlags: ['lera_played_along'] } },
    { id: 'lera_check_lie', text: 'Надя переслала контакт. Я просто нажал на него.', next: 'lera_truth_game', effects: { suspicion: 3, trust: -1, setFlags: ['lera_caught_lie'] } },
  ] },
  { id: 'lera_truth_game', chapter: 2, messages: [
    { id: 'lera_truth_lie', sender: 'character', text: 'нет. «просто нажал» тебе совсем не идёт 🤨', conditions: { requiresFlags: ['lera_caught_lie'] } },
    { id: 'lera_truth_a', sender: 'character', text: 'тогда маленькая проверка' },
    { id: 'lera_truth_b', sender: 'character', text: 'я могу не отвечать. ты тоже' },
    { id: 'lera_truth_c', sender: 'character', text: 'и «нет» никто не уговаривает. договорились?' },
  ], choices: [
    { id: 'lera_truth_respect', text: 'Договорились. «Нет» не требует объяснений.', next: 'lera_boundary_respect', effects: { trust: 2, respect: 2, setFlags: ['lera_respected_boundary'] } },
    { id: 'lera_truth_play', text: 'Договорились. Но поддразнивать друг друга можно?', next: 'lera_boundary_play', effects: { trust: 1, attraction: 2, respect: 2, setFlags: ['lera_played_along'] } },
    { id: 'lera_truth_push', text: 'Правила скучные. Мы оба понимаем, к чему всё идёт.', next: 'lera_boundary_pressure', effects: { irritation: 3, respect: -2, setFlags: ['lera_pushed_for_photo'] } },
  ] },
  { id: 'lera_boundary_respect', chapter: 2, messages: [
    { id: 'lera_respect_a', sender: 'character', text: 'хороший ответ' },
    { id: 'lera_respect_b', sender: 'character', text: 'я только добралась домой' },
    { id: 'lera_respect_c', sender: 'character', text: 'и наконец переоделась 😅' },
  ], choices: [
    { id: 'lera_respect_mood', text: 'Главное, что ты дома. Можно без доказательств.', next: 'lera_no_photo_scene', effects: { trust: 1, respect: 2, setFlags: ['lera_gave_space'] } },
    { id: 'lera_respect_words', text: 'Фото не нужно. Лучше скажи, что именно ты проверяешь.', next: 'lera_no_photo_scene', effects: { trust: 2, respect: 2, setFlags: ['lera_chose_words', 'lera_gave_space'] } },
    { id: 'lera_respect_clue', text: 'Ты проверяешь меня — или вспоминаешь ту галерею?', next: 'lera_gallery_clue', effects: { curiosity: 3, respect: 2, setFlags: ['lera_secret_clue'] } },
  ] },
  { id: 'lera_boundary_play', chapter: 2, messages: [
    { id: 'lera_play_a', sender: 'character', text: 'поддразнивать — можно' },
    { id: 'lera_play_b', sender: 'character', text: 'требовать — нет. разницу поймаешь?' },
  ], choices: [
    { id: 'lera_play_surprise', text: 'Поймаю. Удивишь — только если сама захочешь.', next: 'lera_no_photo_scene', conditions: { minRelationship: { trust: 3, attraction: 4, respect: 2 }, forbiddenFlags: ['lera_pushed_for_photo'] }, effects: { trust: 2, respect: 2, setFlags: ['lera_gave_space'] } },
    { id: 'lera_play_words', text: 'Поймаю. Сегодня мне достаточно слов.', next: 'lera_no_photo_scene', effects: { trust: 2, respect: 2, setFlags: ['lera_chose_words', 'lera_respected_boundary', 'lera_gave_space'] } },
    { id: 'lera_play_prove', text: 'Разница в том, решишься ли ты всё-таки прислать фото.', next: 'lera_warning_scene', effects: { irritation: 2, respect: -2, setFlags: ['lera_pushed_for_photo'] } },
  ] },
  { id: 'lera_boundary_pressure', chapter: 2, messages: [
    { id: 'lera_pressure_a', sender: 'character', text: 'стоп' },
    { id: 'lera_pressure_b', sender: 'character', text: 'ты сейчас требуешь от меня доказательство интереса' },
    { id: 'lera_pressure_c', sender: 'character', text: 'я в такое не играю' },
  ], choices: [
    { id: 'lera_pressure_apologize', text: 'Справедливо. Я перегнул. Больше не давлю.', next: 'lera_warning_scene', effects: { trust: 1, respect: 2, irritation: -2, setFlags: ['lera_apologized'] } },
    { id: 'lera_pressure_double', text: 'Но эту игру начала ты.', next: 'lera_end_cold', effects: { irritation: 3, respect: -2 } },
    { id: 'lera_pressure_insult', text: 'Тогда объясни, зачем вообще было передавать контакт.', next: 'lera_warning_scene', effects: { irritation: 3, respect: -2, setFlags: ['lera_pushed_for_photo'] } },
  ] },
  { id: 'lera_no_photo_scene', chapter: 3, messages: [
    { id: 'lera_no_photo_a', sender: 'character', text: 'вот это я и проверяла' },
    { id: 'lera_no_photo_b', sender: 'character', text: 'обычно после «переоделась» сразу просят фото' },
    { id: 'lera_no_photo_c', sender: 'character', text: 'а ты не попросил' },
  ], choices: [
    { id: 'lera_no_photo_why', text: 'Не торопись. Мне интересна ты, а не доказательство.', next: 'lera_photo_scene', conditions: { minRelationship: { trust: 5, attraction: 1, respect: 5 }, forbiddenFlags: ['lera_pushed_for_photo'] }, effects: { attraction: 1, setFlags: ['lera_respected_boundary'] } },
    { id: 'lera_no_photo_gallery', text: 'Ты проверяешь, заметил ли я тебя ещё в галерее?', next: 'lera_gallery_clue', effects: { curiosity: 2, respect: 1, setFlags: ['lera_secret_clue'] } },
  ] },
  { id: 'lera_photo_scene', chapter: 3, onEnter: { setFlags: ['lera_received_lingerie_photo'] }, messages: [
    { id: 'lera_photo_preface', sender: 'character', text: 'не тороплюсь' },
    { id: 'lera_photo_bridge', sender: 'character', text: 'но ты сейчас сделал ровно то, чего я не ожидала' },
    { id: 'lera_photo_pause', sender: 'system', kind: 'delay', delayMs: 850 },
    { id: 'lera_photo_ready', sender: 'character', text: 'ладно...' },
    { id: 'lera_photo_one', sender: 'character', kind: 'photo', text: 'это мой выбор. и это остаётся между нами 😏', image: './assets/characters/lera/story/lera-lingerie-01.png', alt: 'Лера, взрослая женщина 24 лет, делает ночное селфи дома в закрытом непрозрачном тёмно-сливовом комплекте нижнего белья.' },
    { id: 'lera_photo_after', sender: 'character', text: 'теперь мне правда интересна твоя реакция' },
  ], choices: [
    { id: 'lera_photo_expression', text: 'Красиво. Но мне интереснее, почему ты решила прислать это именно сейчас.', next: 'lera_gallery_clue', effects: { trust: 2, respect: 2, setFlags: ['lera_respectful_photo_reaction'] } },
    { id: 'lera_photo_warm', text: 'Теперь сложнее делать вид, что разговор совершенно невинный 😏', next: 'lera_deleted_scene', effects: { attraction: 3, trust: 1, respect: 1, setFlags: ['lera_respectful_photo_reaction'] } },
    { id: 'lera_photo_more', text: 'Красиво. А смелее ничего нет?', next: 'lera_warning_scene', effects: { irritation: 3, respect: -3, setFlags: ['lera_pushed_for_photo'] } },
  ] },
  { id: 'lera_warning_scene', chapter: 3, messages: [
    { id: 'lera_warning_apology', sender: 'character', text: 'извинение принято', conditions: { requiresFlags: ['lera_apologized'] } },
    { id: 'lera_warning_a', sender: 'character', text: 'но тему фото я закрыла' },
    { id: 'lera_warning_b', sender: 'character', text: 'если снова начнёшь давить — разговор закончится. серьёзно' },
  ], choices: [
    { id: 'lera_warning_listen', text: 'Услышал. Больше к этому не возвращаюсь.', next: 'lera_deleted_scene', effects: { respect: 2, irritation: -2, setFlags: ['lera_respected_boundary'] } },
    { id: 'lera_warning_argue', text: 'Это просто фото. Ты всё усложняешь.', next: 'lera_end_cold', effects: { irritation: 3, respect: -2 } },
    { id: 'lera_warning_demand', text: 'Либо присылай, либо заканчиваем.', next: 'lera_end_blocked', effects: { irritation: 5, respect: -4, setFlags: ['lera_ignored_no'] } },
  ] },
  { id: 'lera_gallery_clue', chapter: 3, messages: [
    { id: 'lera_gallery_photo', sender: 'character', text: 'потому что ты не просил. это многое меняет', conditions: { requiresFlags: ['lera_received_lingerie_photo'] } },
    { id: 'lera_gallery_direct', sender: 'character', text: 'да. наконец-то ты спросил прямо', conditions: { forbiddenFlags: ['lera_received_lingerie_photo'] } },
    { id: 'lera_gallery_a', sender: 'character', text: 'давай конкретно' },
    { id: 'lera_gallery_b', sender: 'character', text: 'что ты на самом деле запомнил обо мне в галерее?' },
  ], choices: [
    { id: 'lera_gallery_truth', text: 'Ты стояла у картины с красной лестницей и поправила подпись автора.', next: 'lera_deleted_scene', effects: { trust: 3, curiosity: 2, setFlags: ['lera_secret_clue', 'lera_remembered_detail'] } },
    { id: 'lera_gallery_lie', text: 'Честно? Помню тёмное платье и красную лестницу. Лицо — смутно.', next: 'lera_deleted_scene', effects: { trust: 2, respect: 2, setFlags: ['lera_chose_honesty'] } },
  ] },
  { id: 'lera_deleted_scene', chapter: 4, messages: [
    { id: 'lera_deleted_lie', sender: 'character', text: 'и да, я заметила твоё «просто нажал» в начале', conditions: { requiresFlags: ['lera_caught_lie'] } },
    { id: 'lera_deleted_a', sender: 'character', text: 'я сейчас написала слишком честную вещь' },
    { id: 'lera_deleted_b', sender: 'system', kind: 'deleted', text: 'Сообщение удалено' },
    { id: 'lera_deleted_c', sender: 'character', text: 'ладно. пока оставим так' },
  ], choices: [
    { id: 'lera_deleted_wait', text: 'Не обязана возвращать сообщение. Я не тороплю.', next: 'lera_outfit_scene', effects: { trust: 3, respect: 2, setFlags: ['lera_respected_boundary'] } },
    { id: 'lera_deleted_ask', text: 'Это было признание или ещё одна проверка?', next: 'lera_outfit_scene', effects: { curiosity: 2, attraction: 1 } },
    { id: 'lera_deleted_guess', text: 'Ты хотела написать, что узнала меня ещё тогда.', next: 'lera_outfit_scene', conditions: { requiresFlags: ['lera_secret_clue'], minRelationship: { respect: 3 } }, effects: { trust: 2, curiosity: 2 } },
    { id: 'lera_deleted_crude', text: 'Наверняка ещё одно фото. Зря удалила.', next: 'lera_end_cold', effects: { irritation: 4, respect: -3 } },
  ] },
  { id: 'lera_outfit_scene', chapter: 4, messages: [
    { id: 'lera_outfit_a', sender: 'character', text: 'проще показать одну деталь' },
    { id: 'lera_photo_two', sender: 'character', kind: 'photo', text: 'в этом платье я была в галерее', image: './assets/characters/lera/story/night-02.webp', alt: 'Лера, взрослая женщина 24 лет, показывает в зеркале закрытое тёмно-сливовое платье, в котором была в галерее.' },
    { id: 'lera_outfit_b', sender: 'character', text: 'мы тогда даже толком не познакомились' },
    { id: 'lera_outfit_c', sender: 'character', text: 'но я заметила тебя раньше, чем ты подошёл к красной лестнице' },
  ], choices: [
    { id: 'lera_outfit_detail', text: 'Теперь уверен. Я запомнил и платье, и то, как ты поправила подпись.', next: 'lera_reveal', effects: { trust: 2, attraction: 2, setFlags: ['lera_remembered_detail'] } },
    { id: 'lera_outfit_person', text: 'Платье помогло. Но важнее понять, почему ты решила найти меня потом.', next: 'lera_reveal', effects: { trust: 2, respect: 2 } },
  ] },
  { id: 'lera_reveal', chapter: 5, messages: [
    { id: 'lera_reveal_start_calm', sender: 'character', text: 'ты начал с «можем просто поговорить». неплохое начало', conditions: { requiresFlags: ['lera_started_calm'] } },
    { id: 'lera_reveal_start_ironic', sender: 'character', text: 'помнишь мой один честный ответ? вот он', conditions: { requiresFlags: ['lera_started_ironic'] } },
    { id: 'lera_reveal_start_confident', sender: 'character', text: 'твоя наблюдательность всё-таки победила 😏', conditions: { requiresFlags: ['lera_started_confident'] } },
    { id: 'lera_reveal_start_flirty', sender: 'character', text: 'похоже, тот ужасный комплимент пережил эту ночь', conditions: { requiresFlags: ['lera_started_flirty'] } },
    { id: 'lera_reveal_start_risky', sender: 'character', text: 'ладно. ты хотел без small talk — держи', conditions: { requiresFlags: ['lera_started_risky'] } },
    { id: 'lera_reveal_a', sender: 'character', text: 'это я попросила Надю передать тебе мой контакт' },
    { id: 'lera_reveal_b', sender: 'character', text: 'сама я тебе не писала' },
    { id: 'lera_reveal_c', sender: 'character', text: 'хотела увидеть, решишься ли ты написать' },
    { id: 'lera_reveal_d', sender: 'character', text: 'и вспомнишь ли меня, а не просто красивое платье' },
  ], choices: [
    { id: 'lera_reveal_honest', text: 'Я запомнил тебя. А теперь хочу узнать без проверок.', next: 'lera_final_choice', effects: { trust: 3, attraction: 2, respect: 1, setFlags: ['lera_shared_intent', 'lera_contact_truth_revealed'] } },
    { id: 'lera_reveal_careful', text: 'Помню не всё. Но не стану придумывать то, чего не было.', next: 'lera_final_choice', effects: { trust: 3, respect: 2, setFlags: ['lera_chose_honesty', 'lera_contact_truth_revealed'] } },
    { id: 'lera_reveal_suspicious', text: 'То есть вся переписка была одной большой проверкой?', next: 'lera_final_choice', effects: { suspicion: 3, irritation: 1, setFlags: ['lera_contact_truth_revealed'] } },
  ] },
  { id: 'lera_final_choice', chapter: 5, messages: [
    { id: 'lera_final_lie', sender: 'character', text: 'только не прячься снова за «случайно». я это помню', conditions: { requiresFlags: ['lera_caught_lie'] } },
    { id: 'lera_final_pressure', sender: 'character', text: 'и мои границы тоже остаются границами', conditions: { requiresFlags: ['lera_pushed_for_photo'] } },
    { id: 'lera_final_a', sender: 'character', text: 'проверка закончилась' },
    { id: 'lera_final_b', sender: 'character', text: 'чего ты хочешь теперь — честно?' },
  ], choices: [
    { id: 'lera_final_open', text: 'Продолжить честно. Без масок и новых проверок.', next: 'lera_end_open', conditions: { minRelationship: { trust: 6, respect: 5 }, maxRelationship: { irritation: 2 } } },
    { id: 'lera_final_date', text: 'Кофе завтра. Вживую познакомимся уже по-настоящему.', next: 'lera_end_date', conditions: { minRelationship: { trust: 4, attraction: 5, respect: 5 }, forbiddenFlags: ['lera_pushed_for_photo'] } },
    { id: 'lera_final_morning', text: 'Давай выспимся и продолжим утром.', next: 'lera_end_morning' },
    { id: 'lera_final_distance', text: 'Оставим эту ночь красивой историей без обещаний.', next: 'lera_end_distance' },
    { id: 'lera_final_accuse', text: 'Мне не подходят такие проверки. На этом остановимся.', next: 'lera_end_cold' },
    { id: 'lera_final_block', text: 'Тогда сначала пришли ещё фото. Потом решу.', next: 'lera_end_blocked', conditions: { requiresFlags: ['lera_pushed_for_photo'] } },
    { id: 'lera_final_secret', text: 'Ты узнала меня у красной лестницы и ждала, когда я вспомню тебя сам.', next: 'lera_end_secret', conditions: { requiresFlags: ['lera_secret_clue', 'lera_remembered_detail', 'lera_respected_boundary', 'lera_chose_honesty'], forbiddenFlags: ['lera_caught_lie', 'lera_pushed_for_photo'], minRelationship: { trust: 6, respect: 5 } } },
  ] },
  { id: 'lera_end_open', chapter: 6, endingId: 'lera_good_open', messages: [
    { id: 'lera_end_open_a', sender: 'character', text: 'договорились' },
    { id: 'lera_end_open_b', sender: 'character', text: 'первое сообщение без тестов — завтра в 10:00 ❤️' },
  ] },
  { id: 'lera_end_date', chapter: 6, endingId: 'lera_good_date', messages: [
    { id: 'lera_end_date_a', sender: 'character', text: 'кофе. завтра в 19:30' },
    { id: 'lera_end_date_b', sender: 'character', text: 'и на этот раз мы правда познакомимся 😏' },
  ] },
  { id: 'lera_end_morning', chapter: 6, endingId: 'lera_neutral_morning', messages: [{ id: 'lera_end_morning_a', sender: 'character', text: 'разумно. спокойной ночи... или уже утра 🙂' }] },
  { id: 'lera_end_distance', chapter: 6, endingId: 'lera_neutral_distance', messages: [{ id: 'lera_end_distance_a', sender: 'character', text: 'иногда одной честной ночи достаточно. береги себя' }] },
  { id: 'lera_end_cold', chapter: 6, endingId: 'lera_bad_cold', messages: [
    { id: 'lera_end_cold_a', sender: 'character', text: 'кажется, мы искали в этой переписке разное' },
    { id: 'lera_end_cold_b', sender: 'character', text: 'дальше без меня. пока' },
  ] },
  { id: 'lera_end_blocked', chapter: 6, endingId: 'lera_bad_blocked', messages: [
    { id: 'lera_end_blocked_prelude_a', sender: 'character', text: 'я уже сказала нет' },
    { id: 'lera_end_blocked_prelude_b', sender: 'character', text: 'если ты этого не слышишь, нам правда не о чем говорить' },
    { id: 'lera_end_blocked_a', sender: 'system', kind: 'statusChanged', text: 'Лера больше не принимает сообщения' },
  ] },
  { id: 'lera_end_secret', chapter: 6, endingId: 'lera_secret_known', messages: [
    { id: 'lera_end_secret_a', sender: 'character', text: 'наконец-то' },
    { id: 'lera_end_secret_b', sender: 'character', text: 'я узнала тебя сразу. но хотела, чтобы ты вспомнил сам 🤭' },
    { id: 'lera_end_secret_c', sender: 'character', text: 'теперь можно начать без загадок' },
  ] },
];

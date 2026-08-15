import type { DialogueNode, ScriptMessage } from '../../../../types/dialogue';

const c = (
  id: string,
  text: string,
  extra: Partial<ScriptMessage> = {},
): ScriptMessage => ({ id, sender: 'character', text, typing: true, ...extra });

const s = (id: string, text: string, extra: Partial<ScriptMessage> = {}): ScriptMessage => ({
  id,
  sender: 'system',
  text,
  kind: 'system',
  typing: false,
  ...extra,
});

export const camilaRuNodes: DialogueNode[] = [
  {
    id: 'start', chapter: 1, messages: [], choices: [
      { id: 'start_warm', text: 'Камила, привет. У меня, кажется, твой конверт. Спасти его от моей любопытности?', next: 'warm_1', tone: 'warm', effects: { trust: 2, curiosity: 1, setFlags: ['warm_start'] } },
      { id: 'start_bold', text: 'Ты оставила ключ под моим ковриком. Скажи, что это было специально.', next: 'bold_1', tone: 'bold', effects: { respect: 1, curiosity: 2, setFlags: ['bold_start'] } },
      { id: 'start_flirt', text: 'Если это твой способ позвать меня на свидание, то ключ — довольно мрачный флирт.', next: 'flirt_1', tone: 'witty', effects: { attraction: 2, irritation: 1, setFlags: ['flirt_start'] } },
      { id: 'start_careful', text: 'Привет. Не хочу тревожить, но у моей двери лежит вещь с твоими инициалами.', next: 'careful_1', tone: 'careful', effects: { trust: 1, respect: 2, setFlags: ['careful_start'] } },
      { id: 'start_risky', text: 'Я открыл пустую квартиру напротив твоим ключом. Там на стене моё имя.', next: 'risky_1', tone: 'risky', effects: { suspicion: 2, curiosity: 3, setFlags: ['risky_start', 'saw_wall'] } },
    ],
  },
  {
    id: 'warm_1', chapter: 1, messages: [
      c('warm_1_a', 'не открывай.'),
      c('warm_1_b', 'Это прозвучало резче, чем я хотела. Привет.'),
      c('warm_1_c', 'На конверте есть синяя полоска? И маленькая цифра 47 в углу?'),
    ], choices: [
      { id: 'warm_return', text: 'Всё на месте. Могу просто принести его тебе.', next: 'warm_2', effects: { trust: 2, respect: 1, setFlags: ['offered_return'] } },
      { id: 'warm_photo', text: 'Не открою. Но фото конверта отправлю — проверь сама.', next: 'warm_2', effects: { trust: 1, curiosity: 1, setFlags: ['sent_envelope_photo'] } },
      { id: 'warm_tease', text: 'Теперь фраза «не открывай» будет жить у меня в голове весь вечер.', next: 'warm_2', effects: { attraction: 1, irritation: 1, setFlags: ['teased_early'] } },
    ],
  },
  {
    id: 'warm_2', chapter: 1, messages: [
      c('warm_2_a', 'Спасибо. Серьёзно.'),
      c('warm_2_b', 'Я оставила его не у той двери. Похоже, сегодня у меня талант к катастрофам.'),
      c('warm_2_c', 'Только странно: я не подписывала конверт своими инициалами.'),
      c('warm_2_d', 'Он холодный? Как будто лежал на улице?'),
    ], choices: [
      { id: 'warm_notice', text: 'Холодный, и край влажный. Его принесли недавно.', next: 'crossing', effects: { respect: 1, curiosity: 2, setFlags: ['noticed_envelope'] } },
      { id: 'warm_question', text: 'Камила, что находится в квартире 47?', next: 'crossing', effects: { suspicion: 1, respect: 1, setFlags: ['asked_47'] } },
      { id: 'warm_open_offer', text: 'Если там опасность, лучше скажи сейчас. Я не люблю быть случайной частью чужого плана.', next: 'crossing', effects: { trust: 1, respect: 2, setFlags: ['set_boundary'] } },
    ],
  },
  {
    id: 'bold_1', chapter: 1, messages: [
      c('bold_1_a', 'Под твоим ковриком?'),
      c('bold_1_b', 'Я не оставляла.'),
      c('bold_1_c', 'Покажи бородку ключа. Только не весь кадр — номер квартиры не снимай.'),
    ], choices: [
      { id: 'bold_comply', text: 'Отправил. И да, я уже заметил, что он старше нашего дома.', next: 'bold_2', effects: { respect: 2, curiosity: 1, setFlags: ['sent_key_photo'] } },
      { id: 'bold_hold', text: 'Сначала объясни, почему ты боишься номера на фото.', next: 'bold_2', effects: { suspicion: 2, respect: 1, setFlags: ['demanded_context'] } },
      { id: 'bold_joke', text: 'Ни адреса, ни отпечатков. У меня неожиданно строгий курс молодого сообщника.', next: 'bold_2', effects: { attraction: 1, trust: 1, setFlags: ['joked_accomplice'] } },
    ],
  },
  {
    id: 'bold_2', chapter: 1, messages: [
      c('bold_2_a', '...это он.'),
      c('bold_2_b', 'Ключ от квартиры 47. Она пустует шесть лет.'),
      c('bold_2_c', 'И последние два месяца кто-то пытается убедить меня, что это неправда.'),
      c('bold_2_d', 'Ты его голыми руками брал?'),
    ], choices: [
      { id: 'bold_truth', text: 'Брал. Но положил в чистый пакет — привычка с работы.', next: 'crossing', effects: { trust: 2, respect: 1, setFlags: ['preserved_key'] } },
      { id: 'bold_lie', text: 'Нет. Я вообще образец криминалистической дисциплины.', next: 'crossing', effects: { suspicion: 2, setFlags: ['lied_about_key'] } },
      { id: 'bold_invite', text: 'Приходи за ним. Заодно расскажешь, почему пустая квартира пишет тебе письма.', next: 'crossing', effects: { attraction: 1, curiosity: 2, setFlags: ['invited_camila'] } },
    ],
  },
  {
    id: 'flirt_1', chapter: 1, messages: [
      c('flirt_1_a', 'Мрачный флирт — это свечи на кладбище.'),
      c('flirt_1_b', 'А ключ под ковриком — плохой день и, возможно, уголовное дело.'),
      c('flirt_1_c', 'Он латунный? На головке насечка в виде половины круга?'),
    ], choices: [
      { id: 'flirt_serious', text: 'Да. Убираю шутки: скажи, что мне с ним делать.', next: 'flirt_2', effects: { trust: 2, respect: 1, setFlags: ['became_serious'] } },
      { id: 'flirt_keep', text: 'Совпадает. Но свидание с уголовным делом всё ещё звучит интригующе.', next: 'flirt_2', effects: { attraction: 2, irritation: 1, setFlags: ['kept_flirting'] } },
      { id: 'flirt_boundary', text: 'Совпадает. И я не двинусь с места, пока ты не объяснишь риск.', next: 'flirt_2', effects: { respect: 2, suspicion: 1, setFlags: ['set_boundary'] } },
    ],
  },
  {
    id: 'flirt_2', chapter: 1, messages: [
      c('flirt_2_a', 'Ладно. Одно очко за самообладание.'),
      c('flirt_2_b', 'Этим ключом моя сестра закрыла квартиру 47 в последний раз.'),
      c('flirt_2_c', 'Через сутки она исчезла.'),
      c('flirt_2_d', 'Шесть лет назад. Так что давай пока без свидания, хорошо?'),
    ], choices: [
      { id: 'flirt_apology', text: 'Прости. Я не знал. Ключ останется у меня, пока ты не решишь, как безопаснее.', next: 'crossing', effects: { trust: 2, respect: 2, setFlags: ['apologized'] } },
      { id: 'flirt_support', text: 'Хорошо. Тогда не свидание — просто два взрослых человека и странный ключ.', next: 'crossing', effects: { attraction: 1, trust: 1, setFlags: ['offered_support'] } },
      { id: 'flirt_probe', text: 'Исчезла — или решила, чтобы все так думали?', next: 'crossing', effects: { curiosity: 2, suspicion: 1, setFlags: ['suspected_alina'] } },
    ],
  },
  {
    id: 'careful_1', chapter: 1, messages: [
      c('careful_1_a', 'Привет.'),
      c('careful_1_b', 'Сначала: ты в квартире? Дверь закрыта?'),
      c('careful_1_c', 'Теперь можешь описать вещь. Не фотографируй коридор.'),
    ], choices: [
      { id: 'careful_details', text: 'Я дома, дверь закрыта. Латунный ключ, бирка «К. М.», свежая царапина.', next: 'careful_2', effects: { trust: 2, respect: 2, setFlags: ['noticed_scratch'] } },
      { id: 'careful_why', text: 'Я в безопасности. Почему ты сразу спросила про дверь?', next: 'careful_2', effects: { curiosity: 2, setFlags: ['asked_safety'] } },
      { id: 'careful_call', text: 'Всё закрыто. Если писать небезопасно, просто поставь точку — я позвоню в полицию.', next: 'careful_2', effects: { trust: 2, respect: 1, setFlags: ['offered_police'] } },
    ],
  },
  {
    id: 'careful_2', chapter: 1, messages: [
      c('careful_2_a', 'Ты хорошо смотришь.'),
      c('careful_2_b', 'Царапина свежая. Я вчера видела этот ключ в сейф-пакете у управляющего.'),
      c('careful_2_c', 'Он уверял, что понятия не имеет, от какой он двери.'),
      c('careful_2_d', 'И пожалуйста, пока не звони. Мне нужны десять минут и человек, который не паникует.'),
    ], choices: [
      { id: 'careful_ten', text: 'У тебя десять минут. После этого решаем вместе, кому звонить.', next: 'crossing', effects: { respect: 2, trust: 1, setFlags: ['gave_ten_minutes'] } },
      { id: 'careful_refuse', text: 'Нет. Ты можешь просить помощи, но не распоряжаться моей безопасностью.', next: 'crossing', effects: { respect: 2, irritation: 1, setFlags: ['set_boundary'] } },
      { id: 'careful_manager', text: 'Как зовут управляющего и почему ключ оказался именно у меня?', next: 'crossing', effects: { curiosity: 2, suspicion: 1, setFlags: ['asked_manager'] } },
    ],
  },
  {
    id: 'risky_1', chapter: 1, messages: [
      c('risky_1_a', 'Выйди оттуда.'),
      c('risky_1_b', 'Не трогай стену. Не включай свет. И не стой напротив окна.'),
      c('risky_1_c', 'Когда окажешься в своей квартире, напиши слово «чайник». Без шуток.'),
    ], choices: [
      { id: 'risky_leave', text: 'Чайник. Я дома. Дверь заперта, ключ у меня.', next: 'risky_2', effects: { trust: 2, respect: 1, setFlags: ['left_47', 'kept_key'] } },
      { id: 'risky_photo', text: 'Сначала снял стену и коридор, потом вышел. Чайник.', next: 'risky_2', effects: { suspicion: 1, curiosity: 2, setFlags: ['photographed_wall', 'kept_copy'] } },
      { id: 'risky_stay', text: 'Нет. Тут на столе телефон, и он показывает 07:14. Объясняй.', next: 'risky_2', effects: { irritation: 2, curiosity: 3, setFlags: ['noticed_time', 'stayed_in_47'] } },
    ],
  },
  {
    id: 'risky_2', chapter: 1, messages: [
      c('risky_2_a', 'Хорошо. Дышу.'),
      c('risky_2_b', 'Имя на стене было напечатано или написано от руки?'),
      c('risky_2_c', 'И дата рядом — сегодняшняя?'),
      c('risky_2_d', 'От ответа зависит, врёт мне один человек или уже двое.'),
    ], choices: [
      { id: 'risky_exact', text: 'Маркером. Почерк ровный, дата вчерашняя. А время 07:14 повторяется дважды.', next: 'crossing', effects: { respect: 2, curiosity: 2, setFlags: ['noticed_time', 'gave_exact_details'] } },
      { id: 'risky_copy', text: 'Я всё снял. Копия уже не на телефоне, так что удалить её незаметно не получится.', next: 'crossing', effects: { trust: 1, respect: 1, suspicion: 1, setFlags: ['kept_copy'] } },
      { id: 'risky_accuse', text: 'Сначала скажи, откуда ты знаешь про дату. Ты ведь ждала, что я туда зайду?', next: 'crossing', effects: { suspicion: 3, irritation: 1, setFlags: ['called_her_early'] } },
    ],
  },
  {
    id: 'crossing', chapter: 2, messages: [
      c('crossing_warm', 'Ты мог просто сделать вид, что ничего не видел. Спасибо, что написал.', { conditions: { requiresFlags: ['warm_start'] } }),
      c('crossing_bold', 'Ненавижу признавать, но твой тон сейчас полезнее моей паники.', { conditions: { requiresFlags: ['bold_start'] } }),
      c('crossing_flirt', 'И да: если мы переживём этот вечер, я пересмотрю своё решение насчёт свидания.', { conditions: { requiresFlags: ['flirt_start'], minRelationship: { attraction: 3 } } }),
      c('crossing_careful', 'Ты единственный сегодня спросил не «что там?», а «безопасно ли это». Я заметила.', { conditions: { requiresFlags: ['careful_start'] } }),
      c('crossing_risky', 'Ты уже видел больше, чем должен был. Значит, половинчатые ответы только навредят.', { conditions: { requiresFlags: ['risky_start'] } }),
      c('crossing_a', 'Квартира 47 принадлежала моей сестре Алине. Ей было 34, когда она пропала.'),
      c('crossing_b', 'Она исследовала, как люди принимают решения под давлением. Не университетское исследование. Частное.'),
      c('crossing_c', 'В 22:40 спустись на лестничную площадку между шестым и седьмым. Камер там нет.'),
    ], choices: [
      { id: 'crossing_meet', text: 'Приду. Но если ты снова что-то недоговоришь, я ухожу.', next: 'stairwell', effects: { respect: 2, trust: 1, setFlags: ['agreed_meet', 'set_boundary'] } },
      { id: 'crossing_copy', text: 'Сначала отправь мне то, что не должно исчезнуть, если ты не придёшь.', next: 'stairwell', effects: { respect: 2, suspicion: 1, setFlags: ['requested_backup', 'kept_copy'] } },
      { id: 'crossing_police', text: 'Я приду, но геолокацию и время встречи уже получит мой друг.', next: 'stairwell', effects: { trust: 1, respect: 2, setFlags: ['shared_location'] } },
      { id: 'crossing_wait', text: 'Нет. Ты приходишь к моей двери, остаёшься в коридоре и всё объясняешь.', next: 'stairwell', effects: { irritation: 1, respect: 2, setFlags: ['made_her_come'] } },
    ],
  },
  {
    id: 'stairwell', chapter: 2, messages: [
      s('stairwell_status', 'Камила в сети'),
      c('stairwell_a', 'Я на месте. Серое пальто, бумажный стакан, крайне неубедительное спокойствие.'),
      c('stairwell_b', 'Не подходи сразу. На пролёте ниже мужчина в синей куртке.'),
      c('stairwell_c', 'Это Марк, управляющий. Тот, у кого вчера был ключ.'),
      c('stairwell_d', 'Он делает вид, что чинит датчик. Датчик сняли в мае.'),
    ], choices: [
      { id: 'stairs_observe', text: 'Пусть думает, что я тебя не знаю. Пройду мимо и посмотрю на реакцию.', next: 'threshold', effects: { respect: 2, curiosity: 1, setFlags: ['observed_mark'] } },
      { id: 'stairs_confront', text: 'Подойду к нему как жилец: спрошу про свет. Ты не показывайся.', next: 'threshold', effects: { respect: 1, suspicion: 1, setFlags: ['spoke_to_mark'] } },
      { id: 'stairs_retreat', text: 'Никакого геройства. Возвращаемся по разным лестницам и говорим из квартир.', next: 'threshold', effects: { trust: 1, respect: 2, setFlags: ['chose_safety'] } },
      { id: 'stairs_signal', text: 'Урони стакан. Если он посмотрит сначала на меня, значит, ждал именно меня.', next: 'threshold', effects: { curiosity: 2, suspicion: 1, setFlags: ['tested_mark'] } },
    ],
  },
  {
    id: 'threshold', chapter: 2, messages: [
      c('threshold_a', 'Он ушёл.'),
      c('threshold_observe', 'И посмотрел не на меня. На твою дверь.', { conditions: { requiresFlags: ['observed_mark'] } }),
      c('threshold_test', 'Ты был прав. Стакан ещё падал, а он уже смотрел на тебя.', { conditions: { requiresFlags: ['tested_mark'] } }),
      c('threshold_spoke', '«Свет проверяю». В доме с автоматическим журналом неисправностей. Милый человек.', { conditions: { requiresFlags: ['spoke_to_mark'] } }),
      c('threshold_b', 'Я открыла конверт. Внутри снимок квартиры 47, сделанный сегодня утром.'),
      c('threshold_c', 'На снимке стол. На столе папка с твоим именем.'),
      c('threshold_d', 'Теперь плохая часть: почерк на обороте похож на почерк Алины.'),
    ], choices: [
      { id: 'threshold_alina', text: 'Значит, сначала проверяем версию, что Алина жива.', next: 'archive', effects: { trust: 1, curiosity: 2, setFlags: ['believed_alina_alive'] } },
      { id: 'threshold_camila', text: 'Или ты подделала почерк, чтобы я продолжил. У тебя была такая возможность?', next: 'archive', effects: { suspicion: 2, irritation: 1, setFlags: ['questioned_camila'] } },
      { id: 'threshold_metadata', text: 'Снимок бумажный, но источник цифровой. Ищем отражения, время, модель камеры.', next: 'archive', effects: { respect: 2, curiosity: 2, setFlags: ['checked_metadata'] } },
      { id: 'threshold_leave', text: 'Папка с моим именем — граница. Я помогу сохранить улику, но внутрь не пойду.', next: 'archive', effects: { respect: 2, trust: -1, setFlags: ['refused_entry'] } },
    ],
  },
  {
    id: 'archive', chapter: 2, messages: [
      s('archive_status', '22:58 · квартира 47'),
      c('archive_a', 'Я всё-таки внутри. Не ругайся — дверь уже была открыта.', { typingInterrupted: true }),
      c('archive_boundary', 'И да, я помню, что ты просил без самодеятельности. Можешь ругаться.', { conditions: { requiresFlags: ['set_boundary'] } }),
      c('archive_b', 'Папки здесь. Двенадцать имён. У каждой — распечатки переписок, маршруты, реакции на «случайные» события.'),
      c('archive_c', 'Твоя начинается с даты, когда ты ответил на объявление о квартире.'),
      c('archive_d', 'На полях пометка: «не ведётся на срочность; реагирует на несправедливость». Узнаёшь себя?'),
    ], choices: [
      { id: 'archive_save', text: 'Снимай каждую страницу и сразу загружай копии. Потом будем возмущаться.', next: 'recording', effects: { trust: 2, respect: 2, setFlags: ['saved_evidence', 'kept_copy'] } },
      { id: 'archive_privacy', text: 'Чужие папки не читаем. Берём мою, список имён и доказательство слежки.', next: 'recording', effects: { respect: 3, trust: 1, setFlags: ['protected_privacy', 'saved_evidence'] } },
      { id: 'archive_read', text: 'Найди свою папку. Если это эксперимент, ты тоже могла быть участницей.', next: 'recording', effects: { curiosity: 2, suspicion: 1, setFlags: ['found_camila_file'] } },
      { id: 'archive_destroy', text: 'Эти данные опасны для всех двенадцати. Фиксируем обложки и уничтожаем содержимое.', next: 'recording', effects: { respect: 1, suspicion: 1, setFlags: ['destroyed_archive'] } },
    ],
  },
  {
    id: 'recording', chapter: 3, messages: [
      c('recording_a', 'Нашла диктофон.'),
      c('recording_b', 'На нём одна запись. Голос Алины: «Если Камила привела тринадцатого, значит, она опять решила за другого человека».'),
      c('recording_c', 'Тринадцатый — это ты.'),
      c('recording_d', 'Мне нужно сказать тебе кое-что раньше, чем запись скажет за меня.'),
      c('recording_e', 'Я знала о твоей папке. Не всё. Но знала, что она существует.'),
    ], choices: [
      { id: 'recording_silence', text: 'Продолжай. Я дослушаю, не перебивая.', next: 'interlude', effects: { trust: 1, respect: 1, setFlags: ['heard_her_out'] } },
      { id: 'recording_angry', text: 'Ты дала мне ключ, чтобы проверить реакцию. Не Марк. Ты.', next: 'interlude', effects: { irritation: 3, suspicion: 2, setFlags: ['accused_key_plant'] } },
      { id: 'recording_fact', text: 'Что именно ты знала до сегодняшнего вечера? Без красивой версии.', next: 'interlude', effects: { respect: 2, suspicion: 1, setFlags: ['demanded_full_truth'] } },
      { id: 'recording_time', text: 'Сначала скажи, почему телефон в квартире застыл на 07:14.', next: 'interlude', conditions: { requiresFlags: ['noticed_time'] }, effects: { curiosity: 2, setFlags: ['pressed_0714'] } },
    ],
  },
  {
    id: 'interlude', chapter: 3, adBreak: true, messages: [
      s('interlude_deleted', 'Камила удалила сообщение', { kind: 'deleted' }),
      c('interlude_a', 'Я нашла тебя не случайно.'),
      c('interlude_b', 'Три месяца назад ты в домовом чате поймал поддельный сбор денег. Спокойно, по фактам, без травли.'),
      c('interlude_c', 'Алина выбирала людей, которыми легко управлять страхом или лестью. Ты не совпадал с её моделью.'),
      c('interlude_d', 'Я помогла твоей заявке на квартиру оказаться сверху. Думала, ты заметишь слежку и поможешь доказать её.'),
      c('interlude_e', 'Ключ оставила я. Конверт — нет.'),
    ], choices: [
      { id: 'interlude_accept_fact', text: 'Помочь можно было попросить. Манипуляция не становится заботой из-за хорошей цели.', next: 'midnight', effects: { respect: 3, trust: 1, setFlags: ['named_manipulation'] } },
      { id: 'interlude_empathy', text: 'Ты искала сестру и зашла слишком далеко. Я понимаю причину, но не оправдываю способ.', next: 'midnight', effects: { trust: 2, respect: 2, setFlags: ['showed_empathy'] } },
      { id: 'interlude_flirt_hurt', text: 'Значит, даже наш «несостоявшийся вечер» был частью проверки?', next: 'midnight', conditions: { requiresFlags: ['flirt_start'] }, effects: { attraction: -1, trust: -1, setFlags: ['questioned_attraction'] } },
      { id: 'interlude_leave', text: 'Сохрани доказательства. После этого больше не пиши мне.', next: 'midnight', effects: { irritation: 3, trust: -3, setFlags: ['asked_no_contact'] } },
    ],
  },
  {
    id: 'midnight', chapter: 3, messages: [
      s('midnight_status_off', 'Камила не в сети', { kind: 'statusChanged' }),
      { id: 'midnight_pause', sender: 'system', kind: 'delay', delayMs: 900, text: 'пауза' },
      s('midnight_status_on', 'Камила в сети', { kind: 'statusChanged' }),
      c('midnight_a', 'В коридоре кто-то есть.'),
      c('midnight_b', 'Не Марк. Шаги легче.'),
      c('midnight_c', 'Под дверью появилась записка: «Вторую комнату нельзя закрыть снаружи».'),
      c('midnight_d', 'Это фраза Алины. Она говорила так про чужую память.'),
    ], choices: [
      { id: 'midnight_call', text: 'Звони 112, не открывай. Я остаюсь на связи и записываю время.', next: 'second_room', effects: { trust: 2, respect: 2, setFlags: ['called_emergency'] } },
      { id: 'midnight_camera', text: 'Посмотри через камеру телефона из-за угла, не показываясь.', next: 'second_room', effects: { curiosity: 1, respect: 1, setFlags: ['filmed_corridor'] } },
      { id: 'midnight_code', text: 'Ответь под дверью: «07:14». Если это Алина, она поймёт.', next: 'second_room', conditions: { requiresFlags: ['noticed_time'] }, effects: { curiosity: 3, suspicion: 1, setFlags: ['used_0714_code'] } },
      { id: 'midnight_go', text: 'Я иду к тебе. Дверь не открывай никому, включая меня, пока не назову цвет ключа.', next: 'second_room', effects: { trust: 2, attraction: 1, setFlags: ['went_to_camila'] } },
    ],
  },
  {
    id: 'second_room', chapter: 3, messages: [
      c('second_a', 'Записка была прикреплена к обороту старого фото.'),
      c('second_b', 'На фото мы с Алиной. Мне двадцать пять, ей тридцать четыре. Это неделя перед её исчезновением.'),
      c('second_c', 'На обороте сегодняшняя дата и ещё одна фраза: «Спроси тринадцатого, что он сохранил».'),
      c('second_saved', 'Похоже, речь о твоей копии. Кто-то знает, что она есть.', { conditions: { requiresFlags: ['kept_copy'] } }),
      c('second_none', 'Если мы ничего не сохранили, она ведёт нас к пустому месту.', { conditions: { forbiddenFlags: ['kept_copy', 'saved_evidence'] } }),
      c('second_d', 'Скажи честно: у тебя осталась копия стены, ключа или папок?'),
    ], choices: [
      { id: 'second_share', text: 'Да. Зашифрованная копия. Отправлю полиции, а тебе — после того как выйдешь.', next: 'fracture', conditions: { requiresFlags: ['kept_copy'] }, effects: { trust: 2, respect: 2, setFlags: ['shared_evidence_truthfully'] } },
      { id: 'second_lie_copy', text: 'Нет, ничего не осталось.', next: 'fracture', conditions: { requiresFlags: ['kept_copy'] }, effects: { trust: -2, suspicion: 3, setFlags: ['lied_about_copy'] } },
      { id: 'second_admit_none', text: 'Нет. И сейчас это выглядит нашей главной ошибкой.', next: 'fracture', conditions: { forbiddenFlags: ['kept_copy'] }, effects: { trust: 1, respect: 1, setFlags: ['admitted_no_copy'] } },
      { id: 'second_question', text: 'Осталась. Но почему записка обращается ко мне через тебя, если автор рядом?', next: 'fracture', effects: { curiosity: 2, suspicion: 1, setFlags: ['questioned_messenger'] } },
    ],
  },
  {
    id: 'fracture', chapter: 4, messages: [
      c('fracture_lie', 'Подожди. Ты сказал, что копии нет. Но раньше специально вынес её с телефона.', { conditions: { requiresFlags: ['lied_about_copy', 'kept_copy'] } }),
      c('fracture_key_lie', 'И ещё: на фото ключа видны твои пальцы. Ты говорил, что не брал его руками.', { conditions: { requiresFlags: ['lied_about_key'] } }),
      c('fracture_a', 'Я перечитала запись Алины. Там склейка после слова «тринадцатого».'),
      c('fracture_b', 'В фоне звонит трамвай. Такой маршрут закрыли за год до её исчезновения.'),
      c('fracture_c', 'Запись новая. Кто-то собрал её из старых фрагментов.'),
      c('fracture_d', 'Марк мог. Но тогда откуда записка с нашей детской фразой?'),
    ], choices: [
      { id: 'fracture_bluff', text: 'От тебя. Ты проверяешь, замечу ли я несовпадение. Хватит. Покажи исходный файл.', next: 'mark', effects: { respect: 3, suspicion: 1, setFlags: ['called_her_bluff'] } },
      { id: 'fracture_mark', text: 'У Марка был доступ к квартире и вашим архивам. Сначала проверяем его устройства.', next: 'mark', effects: { trust: 1, curiosity: 2, setFlags: ['focused_on_mark'] } },
      { id: 'fracture_alina', text: 'Алина жива и наблюдает. И ей важно, выбираешь ты за меня или нет.', next: 'mark', effects: { curiosity: 3, trust: 1, setFlags: ['believed_alina_alive'] } },
      { id: 'fracture_stop', text: 'Мне всё равно, кто автор. Я выхожу из вашей игры и передаю материалы полиции.', next: 'mark', effects: { respect: 2, trust: -2, setFlags: ['left_game'] } },
    ],
  },
  {
    id: 'mark', chapter: 4, messages: [
      s('mark_deleted', 'Сообщение удалено', { kind: 'deleted' }),
      c('mark_a', 'Марк написал мне. «Отдай ключ и папку тринадцатого. Остальное не твоё».'),
      c('mark_b', 'Он прислал фото моей двери. Сделано минуту назад.'),
      c('mark_c', 'Но на отражении в глазке — красный шарф.'),
      c('mark_d', 'Марк сегодня был в синем. Красный шарф носила Алина.'),
      c('mark_e', 'Я сейчас очень хочу открыть дверь. Скажи что-нибудь разумное.'),
    ], choices: [
      { id: 'mark_police', text: 'Разумное: не открывай. Полиция уже едет, фото и переписку я отправил им.', next: 'aftershock', effects: { trust: 3, respect: 2, setFlags: ['police_have_evidence'] } },
      { id: 'mark_choice', text: 'Решение твоё. Но сначала спроси себя: Алина просила бы ключ — или чтобы ты выбрала сама?', next: 'aftershock', effects: { trust: 2, respect: 3, setFlags: ['gave_camila_choice'] } },
      { id: 'mark_trap', text: 'Напиши, что ключ в квартире 47. Пусть человек отойдёт от твоей двери.', next: 'aftershock', effects: { curiosity: 2, suspicion: 1, setFlags: ['set_trap'] } },
      { id: 'mark_open', text: 'Открой на цепочке и включи запись. Иногда единственный выход — закончить сцену.', next: 'aftershock', effects: { irritation: 1, curiosity: 1, setFlags: ['opened_door'] } },
    ],
  },
  {
    id: 'aftershock', chapter: 4, messages: [
      c('after_a', 'Я не открыла.'),
      c('after_choice', 'Потому что впервые за вечер это был мой выбор, а не чья-то инструкция.', { conditions: { requiresFlags: ['gave_camila_choice'] } }),
      c('after_b', 'Человек ушёл. Камера у лифта поймала только красный шарф и левую руку.'),
      c('after_c', 'На руке шрам. У Алины такого не было. У Марка есть.'),
      c('after_d', 'Шарф был приманкой. Он хотел, чтобы я открыла.'),
      c('after_e', 'Я нашла в папке последний лист. Подпись моя.'),
      c('after_f', 'Шесть лет назад я помогала Алине сортировать анкеты. Я называла это «безопасностью участников». Очень удобное слово.'),
    ], choices: [
      { id: 'after_accountability', text: 'Тогда твоя задача не оправдаться, а помочь всем двенадцати узнать правду.', next: 'reckoning', effects: { respect: 3, trust: 1, setFlags: ['asked_accountability'] } },
      { id: 'after_stay', text: 'Ты была частью этого. Но сегодня ты можешь выбрать, чем история закончится.', next: 'reckoning', effects: { trust: 3, attraction: 1, setFlags: ['stayed_with_camila'] } },
      { id: 'after_distance', text: 'Я помогу довести дело до конца. После — между нами будет дистанция.', next: 'reckoning', effects: { respect: 2, trust: -1, setFlags: ['chose_distance'] } },
      { id: 'after_condemn', text: 'Ты ничем не лучше Алины и Марка. Просто твоя версия звучит симпатичнее.', next: 'reckoning', effects: { irritation: 4, trust: -3, setFlags: ['condemned_camila'] } },
    ],
  },
  {
    id: 'reckoning', chapter: 4, messages: [
      c('reckoning_a', 'Марк задержан. В его кладовой нашли сервер и оригиналы анкет.'),
      c('reckoning_b', 'Алины среди найденных записей после исчезновения нет. Только автоматические письма и монтажи.'),
      c('reckoning_0714', 'Но 07:14 — время покупки билета на её имя. Через два года после исчезновения.', { conditions: { requiresFlags: ['pressed_0714'] } }),
      c('reckoning_c', 'Следователь просит нас приехать утром. Отдельно.'),
      c('reckoning_d', 'До утра четыре часа. И один вопрос, который я не имею права формулировать за тебя.'),
      c('reckoning_e', 'Что будет с нами после этого чата?'),
    ], choices: [
      { id: 'reckoning_honest', text: 'Сначала даём показания. Потом кофе. И один честный разговор без загадок.', next: 'decision', effects: { trust: 2, attraction: 2, respect: 1, setFlags: ['offered_honest_start'] } },
      { id: 'reckoning_partners', text: 'Мы найдём Алину и предупредим остальных. О личном решим после.', next: 'decision', effects: { trust: 2, respect: 2, setFlags: ['chose_partnership'] } },
      { id: 'reckoning_end', text: 'После показаний — ничего. Но я не жалею, что ответил.', next: 'decision', effects: { respect: 1, setFlags: ['ended_contact'] } },
      { id: 'reckoning_secret', text: 'Сначала проверим билет на 07:14. Красный шарф отвлекал от левой руки — а фото Алины зеркальное.', next: 'decision', conditions: { requiresFlags: ['noticed_time', 'kept_copy', 'called_her_bluff'] }, effects: { curiosity: 3, respect: 2, setFlags: ['solved_mirror'] } },
    ],
  },
  {
    id: 'decision', chapter: 4, messages: [
      c('decision_secret', 'Ты прав. На оригинале шрам справа. На кадре у двери — отражение, значит, тоже справа. Это не Марк.', { conditions: { requiresFlags: ['solved_mirror'] } }),
      c('decision_secret_2', 'Я нашла номер билета. Конечная — маленькая станция у Байкала. Утренний поезд приходит в 07:14.', { conditions: { requiresFlags: ['solved_mirror'] } }),
      c('decision_good', 'Знаешь, что странно? Я впервые не пытаюсь предугадать твой ответ.', { conditions: { minRelationship: { trust: 7, respect: 6 } } }),
      c('decision_low', 'Кажется, мы дошли до правды разными дорогами. И не обязаны дальше идти одной.', { conditions: { maxRelationship: { trust: 4 } } }),
      c('decision_a', 'Я не удалю эту переписку. Даже те места, где очень хочется.'),
      c('decision_b', 'Твой ход. Последний на сегодня.'),
    ], choices: [
      { id: 'final_secret', text: 'В 06:40 встречаемся на вокзале. Если это Алина, решение говорить с ней примешь ты.', next: 'end_secret', conditions: { requiresFlags: ['solved_mirror', 'kept_copy', 'called_her_bluff'], minRelationship: { respect: 5 } } },
      { id: 'final_dawn', text: 'Не удаляй. Встретим рассвет, дадим показания и попробуем доверять без подсказок.', next: 'end_good_dawn', conditions: { requiresFlags: ['saved_evidence', 'stayed_with_camila'], minRelationship: { trust: 7, respect: 6 } } },
      { id: 'final_equal', text: 'Кофе — да. Но ключи, тесты и решения за другого остаются в этой ночи.', next: 'end_good_equal', conditions: { requiresFlags: ['offered_honest_start', 'named_manipulation'], minRelationship: { attraction: 3, respect: 6 } } },
      { id: 'final_truth', text: 'Я верю фактам, не тебе. Может быть, когда-нибудь это изменится.', next: 'end_neutral_truth', conditions: { minRelationship: { suspicion: 5 } } },
      { id: 'final_erased', text: 'Пусть архив исчезнет. Иногда безопасность важнее чужой правды.', next: 'end_bad_erased', conditions: { requiresFlags: ['destroyed_archive'] } },
      { id: 'final_block', text: 'Удаляй. И больше никогда не пытайся превратить меня в участника своей игры.', next: 'end_bad_blocked', conditions: { minRelationship: { irritation: 6 } } },
      { id: 'final_archive', text: 'Сохрани переписку для следствия. На этом всё, Камила.', next: 'end_neutral_archive' },
    ],
  },
  {
    id: 'end_good_dawn', chapter: 5, endingId: 'good_dawn', messages: [
      c('egd_a', 'Договорились.'), c('egd_b', 'И спасибо, что каждый раз возвращал мне мой собственный выбор.'),
      c('egd_c', 'Я у подъезда. Без ключей. С двумя стаканами кофе.'), s('egd_s', 'История завершена'),
    ],
  },
  {
    id: 'end_good_equal', chapter: 5, endingId: 'good_equal', messages: [
      c('ege_a', 'Справедливо.'), c('ege_b', 'Тогда начнём с простого: мне 31, я терпеть не могу голосовые и правда хочу выпить с тобой кофе.'),
      c('ege_c', 'Это не тест.)'), s('ege_s', 'История завершена'),
    ],
  },
  {
    id: 'end_neutral_archive', chapter: 5, endingId: 'neutral_archive', messages: [
      c('ena_a', 'Поняла.'), c('ena_b', 'Файл у следователя. Твоё имя уберут из копий для остальных.'),
      c('ena_c', 'Береги себя.'), s('ena_s', 'История завершена'),
    ],
  },
  {
    id: 'end_neutral_truth', chapter: 5, endingId: 'neutral_truth', messages: [
      c('ent_a', 'Не буду спорить.'), c('ent_b', 'Доверие нельзя получить правильной формулировкой. Особенно мне.'),
      c('ent_c', 'Если когда-нибудь изменится — мой номер у тебя есть.'), s('ent_s', 'История завершена'),
    ],
  },
  {
    id: 'end_bad_erased', chapter: 5, endingId: 'bad_erased', messages: [
      c('ebe_a', 'Я сделала, как ты сказал.'), c('ebe_b', 'Папки сгорели в старой печи. Сервер Марка оказался пуст.'),
      c('ebe_c', 'Он вышел через сутки. А утром квартира 47 снова была заперта.'),
      s('ebe_s', 'Камила больше не появлялась в сети.'),
    ],
  },
  {
    id: 'end_bad_blocked', chapter: 5, endingId: 'bad_blocked', messages: [
      c('ebb_a', 'Наверное, ты прав.'), c('ebb_b', 'Но я больше не хочу, чтобы ты был частью этой истории. И своей тоже.'),
      s('ebb_s', 'Камила больше не принимает сообщения.'), s('ebb_s2', 'Вас добавили в чёрный список.'),
    ],
  },
  {
    id: 'end_secret', chapter: 5, endingId: 'secret_0714', messages: [
      s('es_status', '07:14 · станция Слюдянка'), c('es_a', 'Она здесь.'),
      c('es_b', 'Седая прядь, красный шарф. Живая.'), c('es_c', 'Алина сказала, что оставила конверт, чтобы я наконец попросила помощи, а не выбрала помощника.'),
      c('es_d', 'Я ещё не знаю, прощу ли её. Но впервые это действительно моё решение.'),
      c('es_e', 'Ты рядом?'), s('es_s', 'Секретная концовка открыта'),
    ],
  },
];

import type { DialogueNode, ScriptMessage } from '../../../../types/dialogue';
import { camilaSceneContexts } from '../sceneContext';

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

const authoredCamilaRuNodes: DialogueNode[] = [
  {
    id: 'start', chapter: 1, messages: [], choices: [
      { id: 'start_warm', text: 'Камила, привет. У моей двери синий конверт с твоими инициалами. Это твоё?', next: 'warm_1', tone: 'warm', effects: { trust: 2, curiosity: 1, setFlags: ['warm_start'] } },
      { id: 'start_bold', text: 'Из конверта у моей двери выпал ключ с цифрой 47. Ты его оставила?', next: 'bold_1', tone: 'bold', effects: { respect: 1, curiosity: 2, setFlags: ['bold_start'] } },
      { id: 'start_flirt', text: 'Если ключ в синем конверте — приглашение на свидание, то у тебя довольно мрачный флирт.', next: 'flirt_1', tone: 'witty', effects: { attraction: 2, irritation: 1, setFlags: ['flirt_start'] } },
      { id: 'start_careful', text: 'Привет. Не хочу тревожить, но под моим ковриком конверт с твоими инициалами и чем-то металлическим внутри.', next: 'careful_1', tone: 'careful', effects: { trust: 1, respect: 2, setFlags: ['careful_start'] } },
      { id: 'start_risky', text: 'Ключ из твоего конверта открыл пустую квартиру напротив. №47. На стене моё имя, и я пока внутри.', next: 'risky_1', tone: 'risky', effects: { suspicion: 2, curiosity: 3, setFlags: ['risky_start', 'saw_wall'] } },
    ],
  },
  {
    id: 'warm_1', chapter: 1, messages: [
      c('warm_1_a', 'привет. сначала не открывай, ладно?'),
      c('warm_1_b', 'Я ещё в мастерской. До дома минимум полчаса.'),
      c('warm_1_c', 'На нём есть синяя полоска и маленькая цифра 47 в углу?'),
    ], choices: [
      { id: 'warm_return', text: 'Да. Он целый. Уберу в квартиру и отдам, когда ты вернёшься.', next: 'warm_2', effects: { trust: 2, respect: 1, setFlags: ['offered_return'] } },
      { id: 'warm_photo', text: 'Совпадает. Не открою, но могу прислать фото с обеих сторон.', next: 'warm_2', effects: { trust: 1, curiosity: 1, setFlags: ['sent_envelope_photo'] } },
      { id: 'warm_tease', text: 'Совпадает. Теперь «не открывай» будет жить у меня в голове весь вечер 😅', next: 'warm_2', effects: { attraction: 1, irritation: 1, setFlags: ['teased_early'] } },
    ],
  },
  {
    id: 'warm_2', chapter: 1, messages: [
      c('warm_2_a', 'спасибо. серьёзно'),
      c('warm_2_b', 'Только я не покупала такие конверты и не писала на нём свои инициалы.'),
      c('warm_2_c', 'Если не вскрывать: внутри на ощупь один металлический предмет?'),
      c('warm_2_d', 'И край влажный? Я весь день была в помещении.'),
    ], choices: [
      { id: 'warm_notice', text: 'Да: один предмет, конверт холодный, край влажный. Его принесли недавно.', next: 'crossing', effects: { respect: 1, curiosity: 2, setFlags: ['noticed_envelope'] } },
      { id: 'warm_question', text: 'Один предмет. Но сначала скажи прямо: что связано с квартирой 47?', next: 'crossing', effects: { suspicion: 1, respect: 1, setFlags: ['asked_47'] } },
      { id: 'warm_open_offer', text: 'Если это опасно, скажи сейчас. Я помогу, но не хочу случайно оказаться частью чужого плана.', next: 'crossing', effects: { trust: 1, respect: 2, setFlags: ['set_boundary'] } },
    ],
  },
  {
    id: 'bold_1', chapter: 1, messages: [
      c('bold_1_a', 'Под твоим ковриком? Я его туда не клала.'),
      c('bold_1_b', 'Я ещё в мастерской, так что это точно не ошибка дверью.'),
      c('bold_1_c', 'Сними только бородку ключа и бирку. Номер твоей квартиры в кадр не бери.'),
    ], choices: [
      { id: 'bold_comply', text: 'Отправил крупно. На бирке 47, а сам ключ явно старше новой двери.', next: 'bold_2', effects: { respect: 2, curiosity: 1, setFlags: ['sent_key_photo'] } },
      { id: 'bold_hold', text: 'Сначала объясни, почему ты сразу подумала о моём адресе и камере.', next: 'bold_2', effects: { suspicion: 2, respect: 1, setFlags: ['demanded_context'] } },
      { id: 'bold_joke', text: 'Ни адреса, ни отпечатков. У меня неожиданно строгий курс молодого сообщника.', next: 'bold_2', effects: { attraction: 1, trust: 1, setFlags: ['joked_accomplice'] } },
    ],
  },
  {
    id: 'bold_2', chapter: 1, messages: [
      c('bold_2_a', '...да. это он'),
      c('bold_2_b', 'Ключ от квартиры 47. Она напротив тебя и пустует шесть лет.'),
      c('bold_2_c', 'Вчера этот ключ был в сейф-пакете у управляющего. Сегодня он у тебя.'),
      c('bold_2_d', 'Ты брал его голыми руками? Не ругаю, мне нужно понимать.'),
    ], choices: [
      { id: 'bold_truth', text: 'Брал. Потом положил в чистый пакет — старая рабочая привычка.', next: 'crossing', effects: { trust: 2, respect: 1, setFlags: ['preserved_key'] } },
      { id: 'bold_lie', text: 'Нет. Я вообще образец криминалистической дисциплины.', next: 'crossing', effects: { suspicion: 2, setFlags: ['lied_about_key'] } },
      { id: 'bold_invite', text: 'Ключ убрал. Когда вернёшься, объясни, почему пустая квартира шлёт мне конверты.', next: 'crossing', effects: { attraction: 1, curiosity: 2, setFlags: ['invited_camila'] } },
    ],
  },
  {
    id: 'flirt_1', chapter: 1, messages: [
      c('flirt_1_a', 'Мрачный флирт — это свечи на кладбище 😏'),
      c('flirt_1_b', 'А ключ от чужой квартиры — уже повод убрать шутки.'),
      c('flirt_1_c', 'Он латунный? На головке насечка в виде половины круга?'),
    ], choices: [
      { id: 'flirt_serious', text: 'Да. Шутки убрал. Скажи, что с ним делать, пока ты не дома.', next: 'flirt_2', effects: { trust: 2, respect: 1, setFlags: ['became_serious'] } },
      { id: 'flirt_keep', text: 'Совпадает. Но свидание с уголовным делом всё ещё звучит интригующе.', next: 'flirt_2', effects: { attraction: 2, irritation: 1, setFlags: ['kept_flirting'] } },
      { id: 'flirt_boundary', text: 'Совпадает. Я остаюсь дома, а ты объясняешь, в чём риск.', next: 'flirt_2', effects: { respect: 2, suspicion: 1, setFlags: ['set_boundary'] } },
    ],
  },
  {
    id: 'flirt_2', chapter: 1, messages: [
      c('flirt_2_a', 'Ладно. Одно очко за умение стать серьёзным 😏'),
      c('flirt_2_b', 'Этим ключом моя сестра Алина закрыла квартиру 47 в последний раз.'),
      c('flirt_2_c', 'На следующий день она пропала.'),
      c('flirt_2_d', 'Шесть лет назад. Поэтому давай пока без свидания, хорошо?'),
    ], choices: [
      { id: 'flirt_apology', text: 'Прости. Я не знал. Ключ будет у меня в пакете, пока мы не решим, как безопаснее.', next: 'crossing', effects: { trust: 2, respect: 2, setFlags: ['apologized'] } },
      { id: 'flirt_support', text: 'Хорошо. Сейчас мы просто два взрослых человека, странный ключ и много вопросов.', next: 'crossing', effects: { attraction: 1, trust: 1, setFlags: ['offered_support'] } },
      { id: 'flirt_probe', text: 'Она пропала сама или кто-то помог ей исчезнуть?', next: 'crossing', effects: { curiosity: 2, suspicion: 1, setFlags: ['suspected_alina'] } },
    ],
  },
  {
    id: 'careful_1', chapter: 1, messages: [
      c('careful_1_a', 'Привет.'),
      c('careful_1_b', 'Сначала скажи: ты уже дома и дверь закрыта?'),
      c('careful_1_c', 'Я в мастерской. Опиши предмет, но не снимай коридор и номер квартиры.'),
    ], choices: [
      { id: 'careful_details', text: 'Я дома, дверь закрыта. Латунный ключ, бирка 47, свежая царапина у бородки.', next: 'careful_2', effects: { trust: 2, respect: 2, setFlags: ['noticed_scratch'] } },
      { id: 'careful_why', text: 'Я в безопасности. Почему ты первым делом спросила про дверь?', next: 'careful_2', effects: { curiosity: 2, setFlags: ['asked_safety'] } },
      { id: 'careful_call', text: 'Всё закрыто. Если писать небезопасно, отправь точку — я вызову помощь.', next: 'careful_2', effects: { trust: 2, respect: 1, setFlags: ['offered_police'] } },
    ],
  },
  {
    id: 'careful_2', chapter: 1, messages: [
      c('careful_2_a', 'Ты хорошо смотришь.'),
      c('careful_2_b', 'Эта царапина свежая. Вчера ключ лежал в сейф-пакете у управляющего.'),
      c('careful_2_c', 'Его зовут Марк. Он сказал, что не знает, от какой ключ двери.'),
      c('careful_2_d', 'Я еду домой. Дай мне полчаса и пока никуда не выходи.'),
    ], choices: [
      { id: 'careful_ten', text: 'Хорошо. Напиши из машины и сразу после входа в дом. Потом решим, кому звонить.', next: 'crossing', effects: { respect: 2, trust: 1, setFlags: ['gave_ten_minutes'] } },
      { id: 'careful_refuse', text: 'Помогу, но моей безопасностью не распоряжайся. Я остаюсь дома по своему решению.', next: 'crossing', effects: { respect: 2, irritation: 1, setFlags: ['set_boundary'] } },
      { id: 'careful_manager', text: 'Почему ключ был у Марка и почему оказался именно под моей дверью?', next: 'crossing', effects: { curiosity: 2, suspicion: 1, setFlags: ['asked_manager'] } },
    ],
  },
  {
    id: 'risky_1', chapter: 1, messages: [
      c('risky_1_a', 'Выйди оттуда. Сейчас.'),
      c('risky_1_b', 'Я в мастерской и не смогу быстро помочь. Не трогай стену и не подходи к окну.'),
      c('risky_1_c', 'Вернись в свою квартиру, запри дверь и напиши «чайник». Без шуток.'),
    ], choices: [
      { id: 'risky_leave', text: 'Чайник. Я дома, дверь заперта, ключ в пакете.', next: 'risky_2', effects: { trust: 2, respect: 1, setFlags: ['left_47', 'kept_key'] } },
      { id: 'risky_photo', text: 'Снял только стену и стол, потом вышел. Чайник. Копия сохранена.', next: 'risky_2', effects: { suspicion: 1, curiosity: 2, setFlags: ['photographed_wall', 'kept_copy'] } },
      { id: 'risky_stay', text: 'Я задержался, снял старый телефон на столе и вернулся домой. На экране 07:14. Почему это важно?', next: 'risky_2', effects: { irritation: 2, curiosity: 3, setFlags: ['noticed_time', 'stayed_in_47'] } },
    ],
  },
  {
    id: 'risky_2', chapter: 1, messages: [
      c('risky_2_a', 'Хорошо. Теперь я хотя бы могу дышать.'),
      c('risky_2_b', 'Имя было напечатано или написано от руки?'),
      c('risky_2_c', 'Рядом была дата? Просто факт, без догадок.'),
      c('risky_2_d', 'Я пытаюсь понять, кто заходил туда сегодня.'),
    ], choices: [
      { id: 'risky_exact', text: 'Я дома. Имя маркером, дата вчерашняя. 07:14 повторяется на телефоне и листке.', next: 'crossing', effects: { respect: 2, curiosity: 2, setFlags: ['noticed_time', 'gave_exact_details'] } },
      { id: 'risky_copy', text: 'Я уже дома. Всё снял и вынес копию с телефона. Незаметно удалить её не получится.', next: 'crossing', effects: { trust: 1, respect: 1, suspicion: 1, setFlags: ['kept_copy'] } },
      { id: 'risky_accuse', text: 'Я дома. Но ты слишком быстро поняла, что там опасно. Что ты знала о 47 до моего сообщения?', next: 'crossing', effects: { suspicion: 3, irritation: 1, setFlags: ['called_her_early'] } },
    ],
  },
  {
    id: 'crossing', chapter: 2, messages: [
      c('crossing_warm', 'Ты мог просто закрыть дверь и забыть. Спасибо, что написал.', { conditions: { requiresFlags: ['warm_start'] } }),
      c('crossing_bold', 'Ненавижу признавать, но твоя прямота сейчас полезнее моей паники.', { conditions: { requiresFlags: ['bold_start'] } }),
      c('crossing_flirt', 'И если мы спокойно закончим этот вечер, я вернусь к разговору про кофе 👀', { conditions: { requiresFlags: ['flirt_start'], minRelationship: { attraction: 3 } } }),
      c('crossing_careful', 'Ты первым спросил про безопасность, а не про содержимое. Я заметила.', { conditions: { requiresFlags: ['careful_start'] } }),
      c('crossing_risky', 'Ты уже видел №47 изнутри. Значит, половинчатые ответы только навредят.', { conditions: { requiresFlags: ['risky_start'] } }),
      c('crossing_a', 'Квартира 47 принадлежала моей сестре Алине. Она пропала шесть лет назад.'),
      c('crossing_b', 'Марк — управляющий домом. Вчера ключ был у него. Он последний, кто видел Алину в том подъезде.'),
      c('crossing_c', 'Я выехала из мастерской. До дома около тридцати минут. Ты остаёшься у себя, я сначала зайду домой и проверю лестницу. Пишем всё время.'),
    ], choices: [
      { id: 'crossing_meet', text: 'Остаюсь дома. Напиши у подъезда и не подходи к 47, пока не проверим, где Марк.', next: 'stairwell', effects: { respect: 2, trust: 1, setFlags: ['agreed_meet', 'agreed_remote_plan', 'set_boundary'] } },
      { id: 'crossing_copy', text: 'Перед дорогой пришли номер машины и то, что не должно исчезнуть, если связь оборвётся.', next: 'stairwell', effects: { respect: 2, suspicion: 1, setFlags: ['requested_backup', 'kept_copy'] } },
      { id: 'crossing_police', text: 'Я остаюсь дома, а друг получит твою геолокацию и время прибытия. Это страховка, не слежка.', next: 'stairwell', effects: { trust: 1, respect: 2, setFlags: ['shared_location'] } },
      { id: 'crossing_wait', text: 'Сначала зайди к себе и запри дверь. Никаких разговоров с Марком один на один.', next: 'stairwell', effects: { irritation: 1, respect: 2, setFlags: ['made_her_come', 'requested_safe_return'] } },
    ],
  },
  {
    id: 'stairwell', chapter: 2, messages: [
      s('stairwell_status', '22:18 · Камила на лестнице между шестым и седьмым этажом'),
      c('stairwell_a', 'Я в доме. Ты у себя? Не выходи.'),
      c('stairwell_b', 'Этажом выше мужчина в синей куртке. Стоит у 47.'),
      c('stairwell_c', 'Это Марк, управляющий. Тот, у кого вчера был ключ. На левой кисти длинный светлый шрам.'),
      c('stairwell_d', 'Он делает вид, что чинит датчик. Датчик сняли ещё в мае.'),
    ], choices: [
      { id: 'stairs_observe', text: 'Не иди следом. Из-за угла отметь время и что у него в руках, потом возвращайся домой.', next: 'threshold', effects: { respect: 2, curiosity: 1, setFlags: ['observed_mark'] } },
      { id: 'stairs_confront', text: 'Позвони ему как жилец и спроси про свет. Не показывайся — посмотрим, какую версию он даст.', next: 'threshold', effects: { respect: 1, suspicion: 1, setFlags: ['spoke_to_mark'] } },
      { id: 'stairs_retreat', text: 'Не проверяй его одна. Вернись в квартиру, запри дверь и продолжим оттуда.', next: 'threshold', effects: { trust: 1, respect: 2, setFlags: ['chose_safety'] } },
      { id: 'stairs_signal', text: 'Если можешь сделать это из укрытия, урони стакан и посмотри, куда он глянет первым. Потом сразу домой.', next: 'threshold', effects: { curiosity: 2, suspicion: 1, setFlags: ['tested_mark'] } },
    ],
  },
  {
    id: 'threshold', chapter: 2, messages: [
      c('threshold_a', 'Я дома. Дверь закрыта. Марк ушёл вниз.'),
      c('threshold_observe', 'Перед уходом он сфотографировал твою дверь. Я видела экран.', { conditions: { requiresFlags: ['observed_mark'] } }),
      c('threshold_test', 'Стакан ещё падал, а он уже смотрел на твою дверь. Значит, ждал реакции от тебя.', { conditions: { requiresFlags: ['tested_mark'] } }),
      c('threshold_spoke', 'По телефону он сказал, что проверяет свет. В доме автоматический журнал неисправностей — и там пусто.', { conditions: { requiresFlags: ['spoke_to_mark'] } }),
      c('threshold_retreat', 'Ты был прав насчёт отступить. На лестнице я думала хуже, чем сейчас за закрытой дверью.', { conditions: { requiresFlags: ['chose_safety'] } }),
      c('threshold_b', 'Под моей дверью второй синий конверт. Его не было, когда я уходила.'),
      c('threshold_c', 'Внутри свежий снимок открытой 47. На столе папка с твоим именем.'),
      c('threshold_d', 'На обороте: «Алина, личное». Почерк очень похож на её.'),
    ], choices: [
      { id: 'threshold_alina', text: 'Допустим, Алина жива. Но сначала сохрани конверт и звони 112: кто-то был у обеих дверей.', next: 'archive', effects: { trust: 1, curiosity: 2, setFlags: ['believed_alina_alive', 'called_emergency'] } },
      { id: 'threshold_camila', text: 'Кто, кроме тебя и Марка, знал про ключ, Алину и обе наши двери?', next: 'archive', effects: { suspicion: 2, irritation: 1, setFlags: ['questioned_camila'] } },
      { id: 'threshold_metadata', text: 'Сфотографируй снимок и оборот крупно. Время, отражения и бумага могут выдать автора.', next: 'archive', effects: { respect: 2, curiosity: 2, setFlags: ['checked_metadata'] } },
      { id: 'threshold_leave', text: 'Не входи в 47. Убери конверт в пакет, держись за закрытой дверью и дождись помощи.', next: 'archive', effects: { respect: 2, trust: -1, setFlags: ['refused_entry'] } },
    ],
  },
  {
    id: 'archive', chapter: 2, messages: [
      s('archive_status', '22:36 · Камила у квартиры 47'),
      c('archive_called', '112 знает адрес. Экипаж пока не назначили; оператор велел не входить.', { conditions: { requiresFlags: ['called_emergency'] } }),
      c('archive_waited', 'Я позвонила 112. Адрес записали, но свободного экипажа пока нет.', { conditions: { requiresFlags: ['refused_entry'] } }),
      c('archive_a', 'Я поднялась только снять открытую дверь. Через щель увидела папку «Алина М.» и лист журнала с фамилией Марка. Дверь начала закрываться, и я вошла. Это моё решение.'),
      c('archive_boundary', 'Знаю, ты просил без самодеятельности. Я оставила дверь открытой и держу телефон в руке.', { conditions: { requiresFlags: ['set_boundary'] } }),
      c('archive_b', 'Здесь двенадцать папок: имена, куски переписок, маршруты и реакции на подстроенные события.'),
      c('archive_c', 'Твоя начинается с дня, когда ты ответил на объявление о квартире.'),
      c('archive_d', 'На полях: «не ведётся на срочность; реагирует на несправедливость». Кто-то наблюдал заранее.'),
    ], choices: [
      { id: 'archive_save', text: 'Сфотографируй страницы с именами, датами и доступом Марка. Сразу отправь копии, потом выходи.', next: 'recording', effects: { trust: 2, respect: 2, setFlags: ['saved_evidence', 'kept_copy'] } },
      { id: 'archive_privacy', text: 'Чужие личные переписки не читай. Нужны список имён, моя папка и доказательство слежки.', next: 'recording', effects: { respect: 3, trust: 1, setFlags: ['protected_privacy', 'saved_evidence'] } },
      { id: 'archive_read', text: 'Проверь папку со своим именем. Возможно, Алина наблюдала и за тобой.', next: 'recording', effects: { curiosity: 2, suspicion: 1, setFlags: ['found_camila_file'] } },
      { id: 'archive_destroy', text: 'Если там реальные адреса, сохрани обложки и журнал доступа, а страницы с маршрутами уничтожь.', next: 'recording', effects: { respect: 1, suspicion: 1, setFlags: ['destroyed_archive'] } },
    ],
  },
  {
    id: 'recording', chapter: 3, messages: [
      c('recording_a', 'Я беру папку Алины, список имён и журнал доступа. Остальное оставляю.'),
      c('recording_b', 'В папке маленький диктофон. Одна запись, голос Алины: «Если Камила привела тринадцатого, значит, опять решила за другого».'),
      c('recording_c', 'Тринадцатый — это ты.'),
      c('recording_d', 'Я выхожу из 47. Но до того, как запись скажет остальное, мне нужно сказать самой.'),
      c('recording_e', 'Я знала, что твоя папка существует. Не знала содержимое, но знала про неё.'),
    ], choices: [
      { id: 'recording_silence', text: 'Сначала выйди и запри свою дверь. Потом расскажешь всё, я не перебью.', next: 'interlude', effects: { trust: 1, respect: 1, setFlags: ['heard_her_out'] } },
      { id: 'recording_angry', text: 'Ты знала про папку и дала мне ключ. Это была проверка моей реакции?', next: 'interlude', effects: { irritation: 3, suspicion: 2, setFlags: ['accused_key_plant'] } },
      { id: 'recording_fact', text: 'Что именно ты знала до сегодняшнего вечера? Только факты.', next: 'interlude', effects: { respect: 2, suspicion: 1, setFlags: ['demanded_full_truth'] } },
      { id: 'recording_time', text: 'И почему в 47 время 07:14 повторяется дважды? Ты знала об этом?', next: 'interlude', conditions: { requiresFlags: ['noticed_time'] }, effects: { curiosity: 2, setFlags: ['pressed_0714'] } },
    ],
  },
  {
    id: 'interlude', chapter: 3, adBreak: true, messages: [
      s('interlude_deleted', 'Камила удалила сообщение', { kind: 'deleted' }),
      c('interlude_a', 'Я вышла и заперлась у себя. Удалённое было: «боюсь, что стала похожа на Алину». Потому что это правда.'),
      c('interlude_b', 'Три месяца назад ты разоблачил поддельный сбор в домовом чате. Спокойно, по фактам, без травли.'),
      c('interlude_c', 'Алина выбирала людей, которыми легко управлять страхом или лестью. Ты не подходил под её схему.'),
      c('interlude_d', 'Я помогла твоей заявке на квартиру оказаться сверху. Надеялась, ты заметишь слежку и поможешь её доказать.'),
      c('interlude_e', 'Ключ под коврик положила я. Синие конверты — нет.'),
    ], choices: [
      { id: 'interlude_accept_fact', text: 'Ты могла просто попросить. Хорошая цель не делает манипуляцию заботой.', next: 'midnight', effects: { respect: 3, trust: 1, setFlags: ['named_manipulation'] } },
      { id: 'interlude_empathy', text: 'Ты искала сестру и зашла слишком далеко. Причину я понимаю, способ — нет.', next: 'midnight', effects: { trust: 2, respect: 2, setFlags: ['showed_empathy'] } },
      { id: 'interlude_flirt_hurt', text: 'То есть даже разговор про кофе был частью проверки?', next: 'midnight', conditions: { requiresFlags: ['flirt_start'] }, effects: { attraction: -1, trust: -1, setFlags: ['questioned_attraction'] } },
      { id: 'interlude_leave', text: 'Передай доказательства полиции. После этого больше мне не пиши.', next: 'midnight', effects: { irritation: 3, trust: -3, setFlags: ['asked_no_contact'] } },
    ],
  },
  {
    id: 'midnight', chapter: 3, messages: [
      s('midnight_status_off', 'Камила не в сети', { kind: 'statusChanged' }),
      { id: 'midnight_pause', sender: 'system', kind: 'delay', delayMs: 1200, text: 'пауза' },
      s('midnight_status_on', 'Камила снова в сети', { kind: 'statusChanged' }),
      c('midnight_a', 'кто-то стоит у моей двери'),
      c('midnight_b', 'Не стучит. Через глазок вижу только тень. Я не открываю.'),
      c('midnight_c', 'Под дверь протолкнули записку: «Вторую комнату нельзя закрыть снаружи».'),
      c('midnight_d', 'Это фраза Алины. В детстве она так говорила про память.'),
    ], choices: [
      { id: 'midnight_call', text: 'Звони 112 и не открывай. Я остаюсь в чате и фиксирую время каждого сообщения.', next: 'second_room', effects: { trust: 2, respect: 2, setFlags: ['called_emergency'] } },
      { id: 'midnight_camera', text: 'Если можешь не подходить вплотную, поставь телефон с записью напротив глазка. Замок не трогай.', next: 'second_room', effects: { curiosity: 1, respect: 1, setFlags: ['filmed_corridor'] } },
      { id: 'midnight_code', text: 'Напиши «07:14» на бумаге и вытолкни под дверь. Не отвечай голосом и не открывай.', next: 'second_room', conditions: { requiresFlags: ['noticed_time'] }, effects: { curiosity: 3, suspicion: 1, setFlags: ['used_0714_code'] } },
      { id: 'midnight_go', text: 'Включи громкую связь и отойди в дальнюю комнату. Я не выйду к тебе: две запертые двери сейчас безопаснее.', next: 'second_room', effects: { trust: 2, attraction: 1, setFlags: ['went_to_camila', 'kept_live_contact'] } },
    ],
  },
  {
    id: 'second_room', chapter: 3, messages: [
      c('second_a', 'Человек ушёл. Записка была прикреплена к старой фотографии.'),
      c('second_b', 'Мы с Алиной за неделю до её исчезновения. На ней красный шарф, на правой руке маленький след от ожога.'),
      c('second_c', 'На обороте сегодняшняя дата и ещё одна фраза: «Спроси тринадцатого, что он сохранил».'),
      c('second_saved', 'Похоже, автор знает про твою копию. Значит, следил за нашими действиями сегодня.', { conditions: { requiresFlags: ['kept_copy'] } }),
      c('second_none', 'Если копий нет, доказательства остались только у меня на бумаге.', { conditions: { forbiddenFlags: ['kept_copy', 'saved_evidence'] } }),
      c('second_d', 'Скажи честно: у тебя сохранилось фото стены, ключа или страниц?'),
    ], choices: [
      { id: 'second_share', text: 'Да, зашифрованная копия. Сейчас отправлю полиции, а тебе — когда они подтвердят получение.', next: 'fracture', conditions: { requiresFlags: ['kept_copy'] }, effects: { trust: 2, respect: 2, setFlags: ['shared_evidence_truthfully'] } },
      { id: 'second_lie_copy', text: 'Нет. Ничего не сохранилось.', next: 'fracture', conditions: { requiresFlags: ['kept_copy'] }, effects: { trust: -2, suspicion: 3, setFlags: ['lied_about_copy'] } },
      { id: 'second_admit_none', text: 'Нет. И теперь это выглядит нашей главной ошибкой.', next: 'fracture', conditions: { forbiddenFlags: ['kept_copy'] }, effects: { trust: 1, respect: 1, setFlags: ['admitted_no_copy'] } },
      { id: 'second_question', text: 'Копия есть. Но откуда автор знал, что ты сразу спросишь о ней именно меня?', next: 'fracture', effects: { curiosity: 2, suspicion: 1, setFlags: ['questioned_messenger'] } },
    ],
  },
  {
    id: 'fracture', chapter: 4, messages: [
      c('fracture_lie', 'Подожди. Сейчас ты сказал, что копии нет. Раньше специально вынес её с телефона.', { conditions: { requiresFlags: ['lied_about_copy', 'kept_copy'] } }),
      c('fracture_key_lie', 'И на первом фото ключа видны твои пальцы. Ты говорил, что не трогал его.', { conditions: { requiresFlags: ['lied_about_key'] } }),
      c('fracture_a', 'Я прослушала файл ещё раз. После слова «тринадцатого» слышна склейка.'),
      c('fracture_b', 'На фоне звонит старый трамвай. Этот маршрут закрыли за год до исчезновения Алины.'),
      c('fracture_c', 'Запись собрали недавно из старых фрагментов.'),
      c('fracture_d', 'В журнале, который я вынесла, ключ Марка открывал 47 последние три ночи. Сегодня — в 07:14.'),
    ], choices: [
      { id: 'fracture_bluff', text: 'Не угадывай автора. Пришли исходный файл и фото записки без обрезки — проверим склейку и отражения.', next: 'mark', effects: { respect: 3, suspicion: 1, setFlags: ['called_her_bluff'] } },
      { id: 'fracture_mark', text: 'У Марка был доступ к квартире, архиву и старым записям. Сначала проверять нужно его устройства.', next: 'mark', effects: { trust: 1, curiosity: 2, setFlags: ['focused_on_mark'] } },
      { id: 'fracture_alina', text: 'Детскую фразу Марк мог не знать. Возможно, Алина жива, но это пока только версия.', next: 'mark', effects: { curiosity: 3, trust: 1, setFlags: ['believed_alina_alive'] } },
      { id: 'fracture_stop', text: 'Кто бы это ни сделал, мы больше не играем по его правилам. Всё передаём полиции.', next: 'mark', effects: { respect: 2, trust: -2, setFlags: ['left_game'] } },
    ],
  },
  {
    id: 'mark', chapter: 4, messages: [
      s('mark_deleted', 'Камила удалила сообщение', { kind: 'deleted' }),
      c('mark_a', 'С номера Марка: «Верни ключ и папку тринадцатого. Остальное не твоё».'),
      c('mark_b', 'Следом фото моей двери. Снято минуту назад. Я сразу позвонила 112; экипаж заходит со двора.'),
      c('mark_c', 'В глазке отражается красный шарф.'),
      c('mark_d', 'Марк был в синей куртке. Красный шарф носила Алина, но это может быть приманка.'),
      c('mark_e', 'Я хочу открыть и закончить эту неизвестность. Скажи что-нибудь разумное.'),
    ], choices: [
      { id: 'mark_police', text: 'Разумное: не открывай. Дошли оператору всю переписку и геолокацию. Я отправлю свою копию.', next: 'aftershock', effects: { trust: 3, respect: 2, setFlags: ['police_have_evidence'] } },
      { id: 'mark_choice', text: 'Решение твоё. Но дверь можно открыть позже; закрыть последствия уже не получится.', next: 'aftershock', effects: { trust: 2, respect: 3, setFlags: ['gave_camila_choice'] } },
      { id: 'mark_trap', text: 'Напиши, что ключ остался в 47. Если человек уйдёт туда, камера покажет маршрут, а ты останешься за дверью.', next: 'aftershock', effects: { curiosity: 2, suspicion: 1, setFlags: ['set_trap'] } },
      { id: 'mark_open', text: 'Если всё-таки решишь говорить, не снимай цепочку и включи запись. Но безопаснее дождаться 112.', next: 'aftershock', effects: { irritation: 1, curiosity: 1, setFlags: ['opened_door'] } },
    ],
  },
  {
    id: 'aftershock', chapter: 4, messages: [
      c('after_a', 'Я не открыла.'),
      c('after_choice', 'Потому что впервые за вечер сама решила, а не выполнила чужую инструкцию.', { conditions: { requiresFlags: ['gave_camila_choice'] } }),
      c('after_police', '112 уже видел фото. Они велели не подходить к двери и отправили второй экипаж к служебному входу.', { conditions: { requiresFlags: ['police_have_evidence'] } }),
      c('after_trap', 'Я написала про ключ в 47. Через минуту человек пошёл к лестнице; камера сохранила маршрут.', { conditions: { requiresFlags: ['set_trap'] } }),
      c('after_open', 'Я почти взялась за цепочку, но увидела, как снаружи проверяют ручку. Нет. Такое не открывают.', { conditions: { requiresFlags: ['opened_door'] } }),
      c('after_b', 'Камера у лифта поймала красный шарф и руку. Кадр зеркальный и слишком тёмный.'),
      c('after_c', 'Шрам Марка на левой кисти. На кадре отметина будто справа, но по отражению нельзя быть уверенной.'),
      c('after_d', 'Человек ушёл к служебной лестнице. Полиция уже внутри дома.'),
      c('after_e', 'Я посмотрела последний лист, который вынесла из 47. Внизу моя подпись.'),
      c('after_f', 'Шесть лет назад я помогала Алине сортировать анкеты. Она называла это «безопасностью участников». Я не спросила достаточно.'),
    ], choices: [
      { id: 'after_accountability', text: 'Тогда не оправдывайся. Помоги всем двенадцати узнать, что с их данными сделали.', next: 'reckoning', effects: { respect: 3, trust: 1, setFlags: ['asked_accountability'] } },
      { id: 'after_stay', text: 'Ты была частью начала. Сейчас можешь стать частью честного конца.', next: 'reckoning', effects: { trust: 3, attraction: 1, setFlags: ['stayed_with_camila'] } },
      { id: 'after_distance', text: 'Я помогу довести дело до показаний. После этого между нами останется дистанция.', next: 'reckoning', effects: { respect: 2, trust: -1, setFlags: ['chose_distance'] } },
      { id: 'after_condemn', text: 'Ты знала достаточно, чтобы остановиться, но всё равно выбрала меня без спроса. Я не могу это забыть.', next: 'reckoning', effects: { irritation: 4, trust: -3, setFlags: ['condemned_camila'] } },
    ],
  },
  {
    id: 'reckoning', chapter: 4, messages: [
      s('reckoning_time', '01:26 · спустя больше часа'),
      c('reckoning_a', 'Марка задержали у служебного помещения. При нём был второй ключ, а в кладовой нашли сервер и оригиналы анкет.'),
      c('reckoning_b', 'На сервере — монтажи и автоматические письма после исчезновения Алины. Новой записи с ней нет.'),
      c('reckoning_0714', 'Но 07:14 оказалось временем покупки билета на имя Алины. Через два года после её исчезновения.', { conditions: { requiresFlags: ['pressed_0714'] } }),
      c('reckoning_c', 'Следователь ждёт нас в девять утра. Отдельно, чтобы показания не смешались.'),
      c('reckoning_d', 'До утра несколько часов. И один вопрос, который я не имею права формулировать за тебя.'),
      c('reckoning_e', 'Что будет с нами после этого чата?'),
    ], choices: [
      { id: 'reckoning_honest', text: 'Сначала показания. Потом, если оба захотим, кофе и разговор без загадок.', next: 'decision', effects: { trust: 2, attraction: 2, respect: 1, setFlags: ['offered_honest_start'] } },
      { id: 'reckoning_partners', text: 'Сначала предупредим остальных и выясним, что стало с Алиной. Личное подождёт.', next: 'decision', effects: { trust: 2, respect: 2, setFlags: ['chose_partnership'] } },
      { id: 'reckoning_end', text: 'После показаний — ничего. Но я не жалею, что ответил тебе сегодня.', next: 'decision', effects: { respect: 1, setFlags: ['ended_contact'] } },
      { id: 'reckoning_secret', text: 'Пришли исходный кадр у двери и старое фото Алины. Зеркальное изображение могло поменять руки местами.', next: 'decision', conditions: { requiresFlags: ['noticed_time', 'kept_copy', 'called_her_bluff'] }, effects: { curiosity: 3, respect: 2, setFlags: ['solved_mirror'] } },
    ],
  },
  {
    id: 'decision', chapter: 4, messages: [
      c('decision_secret', 'Ты прав. После разворота кадра отметина у человека на правой руке. У Марка шрам слева. Это был не он.', { conditions: { requiresFlags: ['solved_mirror'] } }),
      c('decision_secret_2', 'На старом фото у Алины маленький ожог именно справа. А билет ведёт на станцию у Байкала: поезд приходит в 07:14.', { conditions: { requiresFlags: ['solved_mirror'] } }),
      c('decision_good', 'Знаешь, что странно? Я впервые не пытаюсь заранее угадать твой ответ.', { conditions: { minRelationship: { trust: 7, respect: 6 } } }),
      c('decision_low', 'Мы дошли до фактов разными дорогами. И не обязаны дальше идти одной.', { conditions: { maxRelationship: { trust: 4 } } }),
      c('decision_a', 'Я сохраню эту переписку для следствия. Даже те места, которые хочется стереть.'),
      c('decision_b', 'Твой ход. Последний на сегодня.'),
    ], choices: [
      { id: 'final_secret', text: 'В 06:40 встречаемся на вокзале впервые. Если это Алина, решать, говорить ли с ней, будешь ты.', next: 'end_secret', conditions: { requiresFlags: ['solved_mirror', 'kept_copy', 'called_her_bluff'], minRelationship: { respect: 5 } } },
      { id: 'final_dawn', text: 'Не удаляй. Утром дадим показания, а потом впервые встретимся у подъезда — без проверок.', next: 'end_good_dawn', conditions: { requiresFlags: ['saved_evidence', 'stayed_with_camila'], minRelationship: { trust: 7, respect: 6 } } },
      { id: 'final_equal', text: 'Кофе — да. Но ключи, тесты и решения за другого остаются в этой ночи.', next: 'end_good_equal', conditions: { requiresFlags: ['offered_honest_start', 'named_manipulation'], minRelationship: { attraction: 3, respect: 6 } } },
      { id: 'final_truth', text: 'Я верю фактам, не тебе. Может быть, когда-нибудь это изменится.', next: 'end_neutral_truth', conditions: { minRelationship: { suspicion: 5 } } },
      { id: 'final_erased', text: 'Удалим опасные страницы. Иногда безопасность людей важнее полноты архива.', next: 'end_bad_erased', conditions: { requiresFlags: ['destroyed_archive'] } },
      { id: 'final_block', text: 'После показаний удали мой номер. Я больше не хочу быть частью твоих решений.', next: 'end_bad_blocked', conditions: { minRelationship: { irritation: 6 } } },
      { id: 'final_archive', text: 'Сохрани чат для следствия. На этом наша переписка заканчивается, Камила.', next: 'end_neutral_archive' },
    ],
  },
  {
    id: 'end_good_dawn', chapter: 5, endingId: 'good_dawn', messages: [
      c('egd_a', 'договорились 🙂'),
      c('egd_b', 'После такой ночи два кофе — уже не романтика, а первая помощь 😅'),
      c('egd_c', 'Я у подъезда. Без ключей. С двумя стаканами. Выйдешь?'),
      s('egd_s', 'История завершена'),
    ],
  },
  {
    id: 'end_good_equal', chapter: 5, endingId: 'good_equal', messages: [
      c('ege_a', 'Справедливо.'),
      c('ege_b', 'Тогда без тестов: мне 31, я терпеть не могу голосовые и правда хочу выпить с тобой кофе.'),
      c('ege_c', 'Я у подъезда. Это не проверка 😅'),
      s('ege_s', 'История завершена'),
    ],
  },
  {
    id: 'end_neutral_archive', chapter: 5, endingId: 'neutral_archive', messages: [
      c('ena_a', 'Поняла.'),
      c('ena_b', 'Следователь получил файлы. Имена остальных закроют в копиях дела.'),
      c('ena_c', 'Спасибо, что довёл это до конца. Береги себя.'),
      s('ena_s', 'История завершена'),
    ],
  },
  {
    id: 'end_neutral_truth', chapter: 5, endingId: 'neutral_truth', messages: [
      c('ent_a', 'Не буду спорить.'),
      c('ent_b', 'Доверие нельзя получить одной правильной фразой. Особенно после того, что сделала я.'),
      c('ent_c', 'Если когда-нибудь это изменится — мой номер у тебя есть.'),
      s('ent_s', 'История завершена'),
    ],
  },
  {
    id: 'end_bad_erased', chapter: 5, endingId: 'bad_erased', messages: [
      c('ebe_a', 'Я уничтожила страницы с маршрутами, как мы решили.'),
      c('ebe_b', 'Без них сервер не удалось связать с конкретными людьми.'),
      c('ebe_c', 'Марка отпустили. Утром 47 снова была заперта. Я больше не могу продолжать этот разговор.'),
      s('ebe_s', 'Камила больше не появлялась в сети.'),
    ],
  },
  {
    id: 'end_bad_blocked', chapter: 5, endingId: 'bad_blocked', messages: [
      c('ebb_a', 'Весь вечер я просила вернуть мне право решать. А ты отвечал так, будто уже вынес приговор.'),
      c('ebb_b', 'Не надо больше ничего советовать. Я сама разберусь.'),
      s('ebb_s', 'Камила больше не принимает сообщения.'),
      s('ebb_s2', 'Вас добавили в чёрный список.'),
    ],
  },
  {
    id: 'end_secret', chapter: 5, endingId: 'secret_0714', messages: [
      s('es_status', '07:14 · станция Слюдянка'),
      c('es_a', 'Я вижу тебя. И её.'),
      c('es_b', 'Седая прядь, красный шарф, ожог на правой руке. Алина жива.'),
      c('es_c', 'Она призналась: конверты оставила сама. Хотела, чтобы я наконец попросила помощи, а не выбрала помощника.'),
      c('es_d', 'Я ещё не знаю, прощу ли её. Но это решение будет моим.'),
      c('es_e', 'Побудь рядом, ладно?'),
      s('es_s', 'Секретная концовка открыта'),
    ],
  },
];

export const camilaRuNodes: DialogueNode[] = authoredCamilaRuNodes.map((node) => ({
  ...node,
  sceneContext: camilaSceneContexts[node.id],
}));

import type { LegalConsent } from '../types/save';

export const LEGAL_NOTICE_VERSION = 1;

export interface LegalCopy {
  gateTitle: string;
  gateBody: string;
  gateAdults: string;
  checkbox: string;
  continueLabel: string;
  detailsTitle: string;
  paragraphs: readonly string[];
}

export const LEGAL_COPY: Record<'ru' | 'en', LegalCopy> = {
  ru: {
    gateTitle: '18+',
    gateBody: '«Только между нами» содержит темы, разговоры и изображения, предназначенные исключительно для взрослой аудитории.',
    gateAdults: 'Все персонажи и изображённые в игре лица являются совершеннолетними.',
    checkbox: 'Я подтверждаю, что мне исполнилось 18 лет.',
    continueLabel: 'Мне есть 18 — Продолжить',
    detailsTitle: 'Возрастные ограничения и ответственность',
    paragraphs: [
      'Продолжая использование игры «Только между нами», Пользователь подтверждает, что достиг возраста 18 лет и вправе использовать материалы, предназначенные для совершеннолетней аудитории, в соответствии с применимым законодательством.',
      'Пользователь подтверждает достоверность предоставленного им сведения о достижении совершеннолетия и самостоятельно несёт ответственность за соблюдение применимых возрастных ограничений и правил платформы.',
      'Разработчик не осуществляет самостоятельную документальную проверку возраста или личности Пользователя, если такая проверка прямо не требуется применимым законодательством или правилами платформы. В максимально допустимой применимым законодательством степени Разработчик не несёт ответственности за последствия доступа к Игре лицом, которое предоставило недостоверное подтверждение возраста или использовало Игру в нарушение установленных возрастных ограничений.',
      'Ничто в настоящем уведомлении не исключает и не ограничивает ответственность, которая в силу применимого законодательства не может быть исключена или ограничена.',
    ],
  },
  en: {
    gateTitle: '18+',
    gateBody: '“Just Between Us” contains themes, conversations, and imagery intended exclusively for an adult audience.',
    gateAdults: 'All characters and persons depicted in the game are adults.',
    checkbox: 'I confirm that I am at least 18 years old.',
    continueLabel: 'I am 18+ — Continue',
    detailsTitle: 'Age Restrictions and Responsibility',
    paragraphs: [
      'By continuing to use “Just Between Us”, the User confirms that they are at least 18 years old and are legally permitted to access material intended for an adult audience under applicable law.',
      'The User confirms that the age information they provide is accurate and accepts responsibility for complying with applicable age restrictions and platform rules.',
      "The Developer does not independently verify the User's identity or documentary proof of age unless such verification is expressly required by applicable law or platform rules. To the fullest extent permitted by applicable law, the Developer shall not be responsible for consequences resulting from access to the Game by a person who has provided a false age confirmation or used the Game in violation of applicable age restrictions.",
      'Nothing in this notice excludes or limits any liability that cannot lawfully be excluded or limited under applicable law.',
    ],
  },
};

export function isLegalConsentCurrent(consent: LegalConsent | undefined): boolean {
  return Boolean(consent?.accepted && consent.version === LEGAL_NOTICE_VERSION);
}

export function createLegalConsent(now = Date.now()): LegalConsent {
  return { accepted: true, version: LEGAL_NOTICE_VERSION, acceptedAt: now };
}

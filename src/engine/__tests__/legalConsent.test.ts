import { describe, expect, it } from 'vitest';
import { createLegalConsent, isLegalConsentCurrent, LEGAL_NOTICE_VERSION } from '../../legal/legalNotice';
import { migrateSave } from '../saves/migrations';

describe('versioned adult consent', () => {
  it('blocks a new or migrated v0.2 user until the current notice is accepted', () => {
    const migrated = migrateSave({ saveVersion: 2, dialogs: {}, endings: {}, globalFlags: [], lastOpenedDialog: null, updatedAt: 1 } as never);
    expect(isLegalConsentCurrent(migrated.legalConsent)).toBe(false);
    migrated.legalConsent = createLegalConsent(123);
    expect(migrated.legalConsent).toEqual({ accepted: true, version: LEGAL_NOTICE_VERSION, acceptedAt: 123 });
    expect(isLegalConsentCurrent(migrated.legalConsent)).toBe(true);
    expect(isLegalConsentCurrent({ ...migrated.legalConsent, version: LEGAL_NOTICE_VERSION - 1 })).toBe(false);
  });
});

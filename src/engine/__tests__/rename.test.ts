import { describe, expect, it } from 'vitest';
import { getUi } from '../../content/locales';
import appSource from '../../App.tsx?raw';
import localesSource from '../../content/locales/index.ts?raw';
import aboutSource from '../../pages/AboutPage.tsx?raw';
import indexSource from '../../../index.html?raw';
import readmeSource from '../../../README.md?raw';
import releaseNotesSource from '../../../RELEASE_NOTES.md?raw';
import metadataSource from '../../../promo/YANDEX_METADATA.md?raw';

describe('product rename', () => {
  it('uses the new localized title', () => {
    expect(getUi('ru').gameTitle).toBe('Только между нами');
    expect(getUi('en').gameTitle).toBe('Just Between Us');
  });

  it('does not ship old user-facing titles in UI or metadata', () => {
    const productionText = [appSource, localesSource, aboutSource, indexSource, readmeSource, releaseNotesSource, metadataSource].join('\n');
    expect(productionText).not.toMatch(/Между строк|Between the Lines/);
  });
});

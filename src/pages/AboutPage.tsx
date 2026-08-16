import { MessageCircleMore, ShieldCheck } from 'lucide-react';
import type { UiStrings } from '../content/locales';
import type { UiLanguage } from '../content/locales';
import { LEGAL_COPY } from '../legal/legalNotice';
import { APP_VERSION } from '../version';

export function AboutPage({ ui, language }: { ui: UiStrings; language: UiLanguage }) {
  const legal = LEGAL_COPY[language];
  return (
    <div className="page prose-page">
      <header className="page-header"><div><span className="eyebrow">{ui.gameTitle}</span><h1>{ui.about}</h1></div></header>
      <section className="about-card about-card--lead"><span className="about-card__icon"><MessageCircleMore /></span><div><h2>{ui.aboutTitle}</h2><p>{ui.aboutText}</p></div></section>
      <section className="about-grid about-grid--single">
        <article className="about-card"><ShieldCheck /><h3>18+</h3><p>{ui.ageNotice}</p></article>
      </section>
      <details className="legal-details">
        <summary>{legal.detailsTitle}</summary>
        <div>{legal.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </details>
      <footer className="version-note">{ui.version}: {APP_VERSION}</footer>
    </div>
  );
}

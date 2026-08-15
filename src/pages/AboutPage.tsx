import { BotOff, Cloud, ShieldCheck } from 'lucide-react';
import type { UiStrings } from '../content/locales';

export function AboutPage({ ui }: { ui: UiStrings }) {
  return (
    <div className="page prose-page">
      <header className="page-header"><div><span className="eyebrow">{ui.gameTitle}</span><h1>{ui.about}</h1></div></header>
      <section className="about-card about-card--lead"><span className="about-card__icon"><BotOff /></span><div><h2>{ui.aboutTitle}</h2><p>{ui.aboutText}</p></div></section>
      <section className="about-grid">
        <article className="about-card"><Cloud /><h3>Local + Cloud</h3><p>{ui.privacyText}</p></article>
        <article className="about-card"><ShieldCheck /><h3>18+</h3><p>{ui.ageNotice}</p></article>
      </section>
      <footer className="version-note">Between the Lines · v0.1 chat-alpha</footer>
    </div>
  );
}

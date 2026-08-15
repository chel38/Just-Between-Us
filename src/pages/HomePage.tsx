import { ArrowRight, KeyRound, MessageCircleMore, ShieldCheck } from 'lucide-react';
import type { UiStrings } from '../content/locales';
import type { DialogueProgress } from '../types/dialogue';
import { Avatar } from '../components/Avatar';

interface HomePageProps {
  ui: UiStrings;
  progress?: DialogueProgress;
  avatar: string;
  onOpen: () => void;
}

export function HomePage({ ui, progress, avatar, onOpen }: HomePageProps) {
  const hasProgress = Boolean(progress?.history.length);
  return (
    <div className="page home-page">
      <header className="home-topline"><span>{ui.storyLabel}</span><span className="age-pill">18+</span></header>
      <section className="story-hero">
        <div className="story-hero__glow" />
        <div className="story-hero__content">
          <span className="eyebrow">{ui.gameSubtitle}</span>
          <h1>{ui.storyTitle}</h1>
          <p>{ui.storyTeaser}</p>
          <div className="story-person">
            <Avatar src={avatar} name="Camila" size="lg" online />
            <div><strong>{ui.storyMeta}</strong><span>{ui.online}</span></div>
          </div>
          <button className="button button--primary button--wide" onClick={onOpen}>
            {hasProgress ? ui.continue : ui.begin}<ArrowRight size={18} />
          </button>
        </div>
        <div className="story-hero__artifact" aria-hidden="true">
          <div className="artifact-phone">
            <span className="artifact-phone__notch" />
            <MessageCircleMore />
            <i /><i /><i />
            <div className="artifact-key"><KeyRound /></div>
          </div>
        </div>
      </section>
      <section className="feature-strip" aria-label="features">
        <div><MessageCircleMore /><span><strong>5</strong> {ui.language === 'Language' ? 'opening approaches' : 'стартовых подходов'}</span></div>
        <div><ShieldCheck /><span><strong>7</strong> {ui.language === 'Language' ? 'endings' : 'концовок'}</span></div>
        <div><KeyRound /><span>{ui.language === 'Language' ? 'choices are remembered' : 'решения запоминаются'}</span></div>
      </section>
    </div>
  );
}

import { ArrowRight, KeyRound, MessageCircleMore, ShieldCheck } from 'lucide-react';
import type { UiStrings } from '../content/locales';
import type { DialogueDefinition, DialogueProgress } from '../types/dialogue';
import { Avatar } from '../components/Avatar';

interface HomePageProps {
  ui: UiStrings;
  progress?: DialogueProgress;
  dialogue: DialogueDefinition;
  onOpen: () => void;
}

export function HomePage({ ui, progress, dialogue, onOpen }: HomePageProps) {
  const hasProgress = Boolean(progress?.history.length);
  const openingCount = dialogue.nodes.find((node) => node.id === dialogue.startNodeId)?.choices?.length ?? 0;
  return (
    <div className="page home-page">
      <header className="home-topline"><span>{ui.storyLabel}</span><span className="age-pill">18+</span></header>
      <section className="story-hero">
        <div className="story-hero__glow" />
        <div className="story-hero__content">
          <span className="eyebrow">{ui.gameSubtitle}</span>
          <h1>{dialogue.title}</h1>
          <p>{ui.storyTeaser}</p>
          <div className="story-person">
            <Avatar src={dialogue.character.avatarLarge} name={dialogue.character.name} size="lg" online onlineLabel={ui.online} />
            <div><strong>{dialogue.character.name}, {dialogue.character.age} · {dialogue.character.role}</strong><span>{dialogue.character.status}</span></div>
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
        <div><MessageCircleMore /><span><strong>{openingCount}</strong> {ui.openingApproaches}</span></div>
        <div><ShieldCheck /><span><strong>{dialogue.endings.length}</strong> {ui.endingsCount}</span></div>
        <div><KeyRound /><span>{ui.choicesRemembered}</span></div>
      </section>
    </div>
  );
}

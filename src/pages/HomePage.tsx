import { ArrowRight, Clock3, MessageCircleMore, ShieldCheck, Sparkles } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import type { UpcomingDialogue } from '../content/dialogues/upcoming';
import type { UiLanguage, UiStrings } from '../content/locales';
import type { DialogueDefinition, DialogueProgress } from '../types/dialogue';

interface HomePageProps {
  ui: UiStrings;
  language: UiLanguage;
  dialogues: DialogueDefinition[];
  upcomingDialogues: UpcomingDialogue[];
  progresses: Record<string, DialogueProgress>;
  onOpenDialogue: (dialogueId: string) => void;
  onOpenChats: () => void;
}

export function HomePage({ ui, language, dialogues, upcomingDialogues, progresses, onOpenDialogue, onOpenChats }: HomePageProps) {
  const endingCount = dialogues.reduce((total, dialogue) => total + dialogue.endings.length, 0);
  const unlockedEndingCount = new Set(Object.values(progresses).flatMap((progress) => progress.endingsUnlocked)).size;
  const decisionsMade = Object.values(progresses).reduce((total, progress) => total + progress.choiceHistory.length, 0);

  return (
    <div className="page home-hub">
      <header className="home-topline"><span>{ui.storyCollection}</span><span className="age-pill">18+</span></header>

      <section className="home-hub__hero">
        <div className="home-hub__copy">
          <span className="eyebrow">{ui.gameSubtitle}</span>
          <h1>{ui.homeTitle}</h1>
          <p>{ui.homeIntro}</p>
          <button className="button button--primary" onClick={onOpenChats} data-tv-focus>
            {ui.openStoryList}<ArrowRight size={18} />
          </button>
        </div>
        <div className="home-hub__signal" aria-hidden="true">
          <span className="home-hub__pulse"><MessageCircleMore /></span>
          <i /><i /><i />
          <strong>{dialogues.length + upcomingDialogues.length}</strong>
        </div>
      </section>

      <section className="home-stories" aria-labelledby="home-stories-title">
        <header><div><span className="eyebrow">{ui.availableNow}</span><h2 id="home-stories-title">{ui.availableStories}</h2></div><button onClick={onOpenChats}>{ui.openStoryList}<ArrowRight size={15} /></button></header>
        <div className="home-story-grid">
          {dialogues.map((dialogue, index) => {
            const progress = progresses[dialogue.id];
            const hasProgress = Boolean(progress?.history.length);
            const complete = progress?.status.startsWith('completed') || progress?.status === 'blocked';
            const state = complete ? ui.completed : hasProgress ? ui.continueStory : ui.statusNew;
            return (
              <button key={dialogue.id} className="home-story-card" onClick={() => onOpenDialogue(dialogue.id)} autoFocus={index === 0} data-tv-focus>
                <span className="home-story-card__top"><Avatar src={dialogue.character.avatarLarge} name={dialogue.character.name} size="lg" online={!complete} onlineLabel={ui.online} /><span className="home-story-card__state">{state}</span></span>
                <span className="home-story-card__body"><small>{dialogue.character.name}, {dialogue.character.age}</small><strong>{dialogue.title}</strong><span>{dialogue.character.summary}</span></span>
                <span className="home-story-card__footer"><span>{hasProgress ? ui.continue : ui.begin}</span><ArrowRight size={17} /></span>
              </button>
            );
          })}
          {upcomingDialogues.map((dialogue) => (
            <article key={dialogue.id} className="home-story-card home-story-card--coming-soon" aria-label={`${dialogue.characterName}: ${dialogue.status}`}>
              <span className="home-story-card__top"><Avatar name={dialogue.characterName} size="lg" /><span className="home-story-card__state"><Clock3 size={13} />{dialogue.status}</span></span>
              <span className="home-story-card__body"><small>{dialogue.characterName}</small><strong>{dialogue.status}</strong><span>{dialogue.preview}</span></span>
              <span className="home-story-card__footer"><span>{dialogue.status}</span></span>
            </article>
          ))}
        </div>
      </section>

      <section className="home-stats" aria-label={ui.storyProgress}>
        <div><MessageCircleMore /><span><strong>{dialogues.length}</strong>{ui.storiesAvailable}</span></div>
        <div><ShieldCheck /><span><strong>{unlockedEndingCount}/{endingCount}</strong>{ui.unlockedEndingsStat}</span></div>
        <div><Sparkles /><span><strong>{decisionsMade.toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US')}</strong>{ui.decisionsMade}</span></div>
      </section>
    </div>
  );
}

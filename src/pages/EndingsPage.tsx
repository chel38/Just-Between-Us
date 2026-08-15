import { Ban, Check, KeyRound, LockKeyhole, Sparkles, Sunrise } from 'lucide-react';
import type { UiStrings } from '../content/locales';
import type { Ending } from '../types/dialogue';

interface EndingsPageProps {
  ui: UiStrings;
  endings: Ending[];
  unlocked: string[];
}

export function EndingsPage({ ui, endings, unlocked }: EndingsPageProps) {
  return (
    <div className="page endings-page">
      <header className="page-header"><div><span className="eyebrow">{ui.storyTitle}</span><h1>{ui.allEndings}</h1></div><span className="ending-progress">{unlocked.length}<small>/ {endings.length}</small></span></header>
      <div className="progress-track"><i style={{ width: `${(unlocked.length / endings.length) * 100}%` }} /></div>
      <p className="page-intro">{ui.endingsFound}: {unlocked.length} {ui.of} {endings.length}. {ui.language === 'Language' ? 'Unknown endings stay hidden.' : 'Неоткрытые финалы остаются тайной.'}</p>
      <div className="ending-grid">
        {endings.map((ending) => {
          const found = unlocked.includes(ending.id);
          const Icon = ending.type === 'secret' ? KeyRound : ending.type === 'bad' ? Ban : ending.type === 'good' ? Sunrise : Sparkles;
          return <article key={ending.id} className={`ending-card ${found ? `is-found ending-card--${ending.type}` : 'is-locked'}`}>
            <span className="ending-card__number">{String(ending.number).padStart(2, '0')}</span>
            <span className="ending-card__icon">{found ? <Icon /> : <LockKeyhole />}</span>
            <div><h2>{found ? ending.title : ui.hiddenEnding}</h2><p>{found ? ending.description : '••••••••••••••••••••'}</p></div>
            {found && <Check className="ending-card__check" />}
          </article>;
        })}
      </div>
    </div>
  );
}

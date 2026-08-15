import { ArrowLeft, Ban, Check, ChevronRight, KeyRound, LockKeyhole, Sparkles, Sunrise } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import type { UiStrings } from '../content/locales';
import type { DialogueDefinition, Ending } from '../types/dialogue';

interface EndingsPageProps {
  ui: UiStrings;
  dialogues: DialogueDefinition[];
  unlockedEndingsByDialogue: Record<string, string[]>;
  selectedDialogueId: string | null;
  onSelectDialogue: (dialogueId: string | null) => void;
}

export interface EndingArchiveEntry {
  dialogue: DialogueDefinition;
  unlocked: string[];
}

export function getEndingArchiveEntries(
  dialogues: DialogueDefinition[],
  unlockedEndingsByDialogue: Record<string, string[]>,
): EndingArchiveEntry[] {
  return dialogues.map((dialogue) => {
    const validIds = new Set(dialogue.endings.map((ending) => ending.id));
    return { dialogue, unlocked: (unlockedEndingsByDialogue[dialogue.id] ?? []).filter((id) => validIds.has(id)) };
  });
}

export function EndingsPage(props: EndingsPageProps) {
  const entries = getEndingArchiveEntries(props.dialogues, props.unlockedEndingsByDialogue);
  const selected = entries.find((entry) => entry.dialogue.id === props.selectedDialogueId);
  if (!selected) return <StoryPicker ui={props.ui} entries={entries} onSelect={props.onSelectDialogue} />;
  return <EndingDetail ui={props.ui} entry={selected} onBack={() => props.onSelectDialogue(null)} />;
}

function StoryPicker({ ui, entries, onSelect }: { ui: UiStrings; entries: EndingArchiveEntry[]; onSelect: (id: string) => void }) {
  return (
    <div className="page endings-page">
      <header className="page-header"><div><span className="eyebrow">{ui.chooseStory}</span><h1>{ui.allEndings}</h1></div></header>
      <div className="ending-story-list">
        {entries.map(({ dialogue, unlocked }, index) => {
          const percent = dialogue.endings.length ? (unlocked.length / dialogue.endings.length) * 100 : 0;
          return (
            <button key={dialogue.id} className="ending-story-card" onClick={() => onSelect(dialogue.id)} autoFocus={index === 0} data-tv-focus>
              <Avatar src={dialogue.character.avatar} name={dialogue.character.name} size="lg" />
              <span className="ending-story-card__body"><strong>{dialogue.character.name}</strong><small>{dialogue.title}</small><span>{ui.opened} {unlocked.length} {ui.of} {dialogue.endings.length}</span><i><b style={{ width: `${percent}%` }} /></i></span>
              <ChevronRight />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EndingDetail({ ui, entry, onBack }: { ui: UiStrings; entry: EndingArchiveEntry; onBack: () => void }) {
  const { dialogue, unlocked } = entry;
  return (
    <div className="page endings-page">
      <button className="back-link" onClick={onBack} data-tv-focus><ArrowLeft />{ui.back}</button>
      <header className="page-header endings-detail-header"><div><span className="eyebrow">{dialogue.title}</span><h1>{dialogue.character.name}</h1></div><span className="ending-progress">{unlocked.length}<small>/ {dialogue.endings.length}</small></span></header>
      <div className="progress-track"><i style={{ width: `${dialogue.endings.length ? (unlocked.length / dialogue.endings.length) * 100 : 0}%` }} /></div>
      <p className="page-intro">{ui.endingsFound}: {unlocked.length} {ui.of} {dialogue.endings.length}. {ui.unknownEndingsDescription}</p>
      <div className="ending-grid">{dialogue.endings.map((ending) => <EndingArchiveCard key={ending.id} ending={ending} found={unlocked.includes(ending.id)} ui={ui} />)}</div>
    </div>
  );
}

function EndingArchiveCard({ ending, found, ui }: { ending: Ending; found: boolean; ui: UiStrings }) {
  const Icon = ending.type === 'secret' ? KeyRound : ending.type === 'bad' ? Ban : ending.type === 'good' ? Sunrise : Sparkles;
  return (
    <article className={`ending-card ${found ? `is-found ending-card--${ending.type}` : 'is-locked'}`}>
      <span className="ending-card__number">{String(ending.number).padStart(2, '0')}</span>
      <span className="ending-card__icon">{found ? <Icon /> : <LockKeyhole />}</span>
      <div><h2>{found ? ending.title : ui.hiddenEnding}</h2><p>{found ? ending.description : '••••••••••••••••••••'}</p></div>
      {found && <Check className="ending-card__check" />}
    </article>
  );
}

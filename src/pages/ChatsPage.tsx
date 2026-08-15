import { CheckCheck, ChevronRight, LockKeyhole } from 'lucide-react';
import type { UiStrings } from '../content/locales';
import type { DialogueDefinition, DialogueProgress } from '../types/dialogue';
import { Avatar } from '../components/Avatar';

interface ChatsPageProps {
  ui: UiStrings;
  dialogue: DialogueDefinition;
  progress?: DialogueProgress;
  onOpen: () => void;
}

export function ChatsPage({ ui, dialogue, progress, onOpen }: ChatsPageProps) {
  const last = progress?.history.at(-1)?.text;
  const isComplete = progress?.status.startsWith('completed') || progress?.status === 'blocked';
  return (
    <div className="page list-page">
      <header className="page-header"><div><span className="eyebrow">{ui.gameSubtitle}</span><h1>{ui.dialogues}</h1></div><span className="header-count">3</span></header>
      <div className="chat-list">
        <button className="chat-row chat-row--active" onClick={onOpen}>
          <Avatar src={dialogue.character.avatar} name={dialogue.character.name} size="md" online={!isComplete} />
          <span className="chat-row__body">
            <span className="chat-row__top"><strong>{dialogue.character.name}</strong><time>{progress ? new Date(progress.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ui.newStory}</time></span>
            <span className="chat-row__bottom"><span>{last ?? ui.noMessages}</span>{progress?.unread ? <b>{progress.unread}</b> : progress ? <CheckCheck size={16} /> : <ChevronRight size={16} />}</span>
            <small>{isComplete ? ui.completed : progress?.history.length ? ui.continueStory : ui.statusNew}</small>
          </span>
        </button>
        <LockedChat name={ui.language === 'Language' ? 'Alice' : 'Алиса'} teaser={ui.language === 'Language' ? 'The message that arrives tomorrow' : 'Сообщение, которое придёт завтра'} accent="peach" ui={ui} />
        <LockedChat name={ui.language === 'Language' ? 'Vera' : 'Вера'} teaser={ui.language === 'Language' ? 'No one remembers this number' : 'Этот номер никто не помнит'} accent="blue" ui={ui} />
      </div>
    </div>
  );
}

function LockedChat({ name, teaser, accent, ui }: { name: string; teaser: string; accent: string; ui: UiStrings }) {
  return (
    <div className="chat-row chat-row--locked">
      <div className={`avatar-placeholder avatar-placeholder--${accent}`}>{name[0]}</div>
      <span className="chat-row__body"><span className="chat-row__top"><strong>{name}</strong><LockKeyhole size={14} /></span><span className="chat-row__bottom"><span>{teaser}</span></span><small>{ui.locked}</small></span>
    </div>
  );
}

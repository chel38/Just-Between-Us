import { CheckCheck, ChevronRight } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import type { UiLanguage, UiStrings } from '../content/locales';
import { resolveLastMessage } from '../engine/dialogue/transcriptResolver';
import type { DialogueDefinition, DialogueProgress } from '../types/dialogue';

interface ChatsPageProps {
  ui: UiStrings;
  language: UiLanguage;
  dialogues: DialogueDefinition[];
  progresses: Record<string, DialogueProgress>;
  onOpen: (dialogueId: string) => void;
}

export function ChatsPage({ ui, language, dialogues, progresses, onOpen }: ChatsPageProps) {
  return (
    <div className="page list-page">
      <header className="page-header"><div><span className="eyebrow">{ui.gameSubtitle}</span><h1>{ui.dialogues}</h1></div><span className="header-count">{dialogues.length}</span></header>
      <div className="chat-list">
        {dialogues.map((dialogue, index) => {
          const progress = progresses[dialogue.id];
          const last = resolveLastMessage(progress?.history, dialogue);
          const isComplete = progress?.status.startsWith('completed') || progress?.status === 'blocked';
          return (
            <button key={dialogue.id} className="chat-row chat-row--active" onClick={() => onOpen(dialogue.id)} autoFocus={index === 0} data-tv-focus>
              <Avatar src={dialogue.character.avatar} name={dialogue.character.name} size="md" online={!isComplete} onlineLabel={ui.online} />
              <span className="chat-row__body">
                <span className="chat-row__top"><strong>{dialogue.character.name}</strong><time>{progress ? new Date(progress.updatedAt).toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : ui.newStory}</time></span>
                <span className="chat-row__bottom"><span>{last ?? ui.noMessages}</span>{progress?.unread ? <b>{progress.unread}</b> : progress ? <CheckCheck size={16} /> : <ChevronRight size={16} />}</span>
                <small>{isComplete ? ui.completed : progress?.history.length ? ui.continueStory : ui.statusNew}</small>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

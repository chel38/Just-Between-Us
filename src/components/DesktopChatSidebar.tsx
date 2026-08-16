import { CheckCheck, Clock3 } from 'lucide-react';
import type { UpcomingDialogue } from '../content/dialogues/upcoming';
import type { UiLanguage, UiStrings } from '../content/locales';
import { resolveLastMessage } from '../engine/dialogue/transcriptResolver';
import type { DialogueDefinition, DialogueProgress } from '../types/dialogue';
import { Avatar } from './Avatar';

interface Props {
  ui: UiStrings;
  language: UiLanguage;
  dialogues: DialogueDefinition[];
  upcomingDialogues: UpcomingDialogue[];
  progresses: Record<string, DialogueProgress>;
  activeDialogueId: string;
  onOpen: (dialogueId: string) => void;
}

export function DesktopChatSidebar({ ui, language, dialogues, upcomingDialogues, progresses, activeDialogueId, onOpen }: Props) {
  return (
    <aside className="desktop-chat-sidebar" aria-label={ui.dialogues}>
      <header><small>{ui.gameTitle}</small><strong>{ui.dialogues}</strong></header>
      <div>{dialogues.map((dialogue) => {
        const progress = progresses[dialogue.id];
        return (
          <button key={dialogue.id} className={activeDialogueId === dialogue.id ? 'is-active' : ''} onClick={() => onOpen(dialogue.id)} data-tv-focus>
            <Avatar src={dialogue.character.avatar} name={dialogue.character.name} size="sm" online={!progress?.endingId} onlineLabel={ui.online} />
            <span><strong>{dialogue.character.name}</strong><small>{resolveLastMessage(progress?.history, dialogue) ?? ui.noMessages}</small></span>
            {progress && <CheckCheck aria-label={new Date(progress.updatedAt).toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US')} />}
          </button>
        );
      })}
        {upcomingDialogues.map((dialogue) => (
          <button key={dialogue.id} className="is-coming-soon" disabled aria-label={`${dialogue.characterName}: ${dialogue.status}`}>
            <Avatar name={dialogue.characterName} size="sm" />
            <span><strong>{dialogue.characterName}</strong><small>{dialogue.status}</small></span>
            <Clock3 aria-hidden="true" />
          </button>
        ))}
      </div>
    </aside>
  );
}

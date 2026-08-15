import type { DialogueProgress, TranscriptMessage } from '../../types/dialogue';
import { CURRENT_SAVE_VERSION, createDefaultSave, type GameSave } from '../../types/save';

type UnknownSave = Partial<GameSave> & { saveVersion?: number };

export function migrateSave(raw: UnknownSave | null): GameSave {
  if (!raw || typeof raw !== 'object') return createDefaultSave();
  let migrated: UnknownSave = { ...raw };

  // Migrations are applied in order. Never mutate the object read from storage.
  if (!migrated.saveVersion) migrated.saveVersion = 1;

  if (migrated.saveVersion < 2) {
    migrated = {
      ...migrated,
      saveVersion: 2,
      dialogs: Object.fromEntries(
        Object.entries(migrated.dialogs ?? {}).map(([dialogueId, progress]) => [
          dialogueId,
          migrateProgressV2(progress),
        ]),
      ),
    };
  }

  const defaults = createDefaultSave();
  const dialogs = Object.fromEntries(
    Object.entries(migrated.dialogs ?? {}).map(([dialogueId, progress]) => [
      dialogueId,
      { ...progress, revealedHints: progress.revealedHints ?? {} },
    ]),
  );
  return {
    ...defaults,
    ...migrated,
    saveVersion: CURRENT_SAVE_VERSION,
    dialogs,
    endings: migrated.endings ?? {},
    globalFlags: migrated.globalFlags ?? [],
    settings: { ...defaults.settings, ...(migrated.settings ?? {}) },
  } as GameSave;
}

function migrateProgressV2(progress: DialogueProgress): DialogueProgress {
  let playerIndex = 0;
  const history = (progress.history ?? []).map((message): TranscriptMessage => {
    const choiceId = message.sender === 'player' ? progress.choiceHistory?.[playerIndex++] : undefined;
    const sourceId = message.sourceId ?? message.scriptMessageId ?? choiceId;
    const sourceType = message.sourceType
      ?? (message.sender === 'player' ? 'player-choice' : message.sender === 'system' ? 'system' : 'script-message');
    return {
      ...message,
      sourceType,
      sourceId,
      fallbackText: message.fallbackText ?? message.text ?? '',
      quoteFallbackText: message.quoteFallbackText ?? message.quote,
    };
  });
  return { ...progress, history, revealedHints: progress.revealedHints ?? {} };
}

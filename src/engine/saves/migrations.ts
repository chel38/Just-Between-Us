import { CURRENT_SAVE_VERSION, createDefaultSave, type GameSave } from '../../types/save';

type UnknownSave = Partial<GameSave> & { saveVersion?: number };

export function migrateSave(raw: UnknownSave | null): GameSave {
  if (!raw || typeof raw !== 'object') return createDefaultSave();
  let migrated: UnknownSave = { ...raw };

  // Future migrations are applied in order. Never mutate the object read from storage.
  if (!migrated.saveVersion) migrated.saveVersion = 1;

  const defaults = createDefaultSave();
  return {
    ...defaults,
    ...migrated,
    saveVersion: CURRENT_SAVE_VERSION,
    dialogs: migrated.dialogs ?? {},
    endings: migrated.endings ?? {},
    globalFlags: migrated.globalFlags ?? [],
    settings: { ...defaults.settings, ...(migrated.settings ?? {}) },
  } as GameSave;
}

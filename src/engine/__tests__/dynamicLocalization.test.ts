import { describe, expect, it } from 'vitest';
import { getCamilaDialogue } from '../../content/dialogues/camila';
import { createDefaultSave } from '../../types/save';
import { DialogueEngine } from '../dialogue/dialogueEngine';
import { resolveTranscriptMessage } from '../dialogue/transcriptResolver';
import { migrateSave } from '../saves/migrations';

describe('dynamic transcript localization', () => {
  it('keeps one progress graph while translating old script and player messages RU → EN → RU', () => {
    const ruDialogue = getCamilaDialogue('ru');
    const ruEngine = new DialogueEngine(ruDialogue);
    let progress = ruEngine.choose(ruEngine.createProgress(), 'start_warm', 100);
    for (const message of ruEngine.pendingMessages(progress)) {
      progress = ruEngine.appendScriptMessage(progress, message, message.text ?? '', 200 + progress.history.length);
    }
    progress = ruEngine.finishCurrentNode(progress, 300);
    progress = ruEngine.choose(progress, 'warm_return', 400);

    const save = createDefaultSave();
    save.dialogs.camila = progress;
    save.lastOpenedDialog = 'camila';
    const restored = migrateSave(JSON.parse(JSON.stringify(save)));
    const transcriptIds = restored.dialogs.camila.history.map((message) => message.sourceId);
    const progressSnapshot = {
      currentNodeId: restored.dialogs.camila.currentNodeId,
      relationship: restored.dialogs.camila.relationship,
      flags: restored.dialogs.camila.flags,
      choices: restored.dialogs.camila.choiceHistory,
    };

    const enDialogue = getCamilaDialogue('en');
    const english = restored.dialogs.camila.history.map((message) => resolveTranscriptMessage(message, enDialogue).text);
    expect(restored.dialogs.camila.history.map((message) => message.sourceId)).toEqual(transcriptIds);
    expect(english[0]).toContain('Camila');
    expect(english.join(' ')).not.toMatch(/[А-Яа-яЁё]/);

    const russian = restored.dialogs.camila.history.map((message) => resolveTranscriptMessage(message, ruDialogue).text);
    expect(russian[0]).toContain('Камила');
    expect({
      currentNodeId: restored.dialogs.camila.currentNodeId,
      relationship: restored.dialogs.camila.relationship,
      flags: restored.dialogs.camila.flags,
      choices: restored.dialogs.camila.choiceHistory,
    }).toEqual(progressSnapshot);
  });
});

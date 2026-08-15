import { useEffect, useMemo, useRef, useState } from 'react';
import { AppShell, type Route } from './components/AppShell';
import { ConfirmDialog } from './components/ConfirmDialog';
import { getUi, type UiLanguage } from './content/locales';
import { getCamilaDialogue } from './content/dialogues/camila';
import { DialogueEngine } from './engine/dialogue/dialogueEngine';
import { SaveEngine } from './engine/saves/saveEngine';
import { createPlatform, type PlatformService } from './platform/platform';
import { AboutPage } from './pages/AboutPage';
import { ChatsPage } from './pages/ChatsPage';
import { DialoguePage } from './pages/DialoguePage';
import { EndingsPage } from './pages/EndingsPage';
import { HomePage } from './pages/HomePage';
import { SettingsPage } from './pages/SettingsPage';
import { soundService } from './services/soundService';
import type { DialogueProgress } from './types/dialogue';
import { createDefaultSave, type GameSave, type GameSettings } from './types/save';
import { DialogueDebugger } from './components/DialogueDebugger';

export default function App() {
  const [route, setRoute] = useState<Route>('home');
  const [platform, setPlatform] = useState<PlatformService | null>(null);
  const [save, setSave] = useState<GameSave>(createDefaultSave);
  const [loading, setLoading] = useState(true);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const saveEngineRef = useRef<SaveEngine | null>(null);

  const language: UiLanguage = useMemo(() => {
    const preferred = save.settings.language;
    if (preferred === 'ru' || preferred === 'en') return preferred;
    return platform?.language.toLowerCase().startsWith('ru') ? 'ru' : 'en';
  }, [save.settings.language, platform?.language]);
  const ui = getUi(language);
  const dialogue = useMemo(() => getCamilaDialogue(language), [language]);
  const progress = save.dialogs.camila;

  useEffect(() => {
    let active = true;
    void (async () => {
      const connectedPlatform = await createPlatform();
      const engine = new SaveEngine(connectedPlatform);
      const loaded = await engine.load();
      if (!active) return;
      saveEngineRef.current = engine;
      setPlatform(connectedPlatform);
      setSave(loaded);
      if (loaded.lastOpenedDialog === 'camila' && loaded.dialogs.camila) {
        setRoute('dialogue');
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (loading || !platform) return;
    // Game Ready is emitted only after React committed an interactive screen and
    // the app-owned loading cover has disappeared.
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => void platform.ready()));
    return () => cancelAnimationFrame(frame);
  }, [loading, platform]);

  useEffect(() => {
    if (!platform) return;
    const syncGameplayState = () => {
      if (route === 'dialogue' && !document.hidden) {
        platform.gameplayStart();
        soundService.resume();
      } else {
        platform.gameplayStop();
        soundService.pause();
      }
    };
    syncGameplayState();
    document.addEventListener('visibilitychange', syncGameplayState);
    return () => document.removeEventListener('visibilitychange', syncGameplayState);
  }, [platform, route]);

  useEffect(() => {
    const flush = () => { void saveEngineRef.current?.flushCloud(true); };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, []);

  const commit = (next: GameSave) => {
    const stamped = { ...next, updatedAt: Date.now() };
    setSave(stamped);
    saveEngineRef.current?.save(stamped);
  };

  const openDialogue = () => {
    const current = save.dialogs.camila ?? new DialogueEngine(dialogue).createProgress();
    commit({
      ...save,
      lastOpenedDialog: 'camila',
      dialogs: { ...save.dialogs, camila: { ...current, unread: 0 } },
    });
    setRoute('dialogue');
  };

  const updateProgress = (nextProgress: DialogueProgress) => {
    const knownEndings = new Set([...(save.endings.camila ?? []), ...nextProgress.endingsUnlocked]);
    commit({
      ...save,
      dialogs: { ...save.dialogs, camila: nextProgress },
      endings: { ...save.endings, camila: [...knownEndings] },
      lastOpenedDialog: 'camila',
    });
  };

  const updateSettings = (settings: GameSettings) => commit({ ...save, settings });

  const restartDialogue = () => {
    const restarted = new DialogueEngine(dialogue).createProgress();
    commit({ ...save, dialogs: { ...save.dialogs, camila: restarted }, lastOpenedDialog: 'camila' });
    setConfirmRestart(false);
    setRoute('dialogue');
  };

  const unlockTheme = async () => {
    if (!platform) return;
    const rewarded = await platform.showRewardedAd();
    if (!rewarded) return;
    updateSettings({
      ...save.settings,
      unlockedThemes: [...new Set([...save.settings.unlockedThemes, 'violet'])],
      activeTheme: 'violet',
    });
  };

  if (loading || !platform) {
    return <div className="loading-screen"><span className="loading-mark"><i /><i /><i /></span><strong>Between the Lines</strong></div>;
  }

  const page = route === 'home' ? <HomePage ui={ui} progress={progress} avatar={dialogue.character.avatarLarge} onOpen={openDialogue} />
    : route === 'chats' ? <ChatsPage ui={ui} dialogue={dialogue} progress={progress} onOpen={openDialogue} />
      : route === 'settings' ? <SettingsPage ui={ui} settings={save.settings} onChange={updateSettings} onUnlockTheme={unlockTheme} />
        : route === 'endings' ? <EndingsPage ui={ui} endings={dialogue.endings} unlocked={save.endings.camila ?? []} />
          : route === 'about' ? <AboutPage ui={ui} />
            : progress ? <DialoguePage ui={ui} dialogue={dialogue} progress={progress} settings={save.settings} onProgress={updateProgress} onBack={() => setRoute('chats')} onRestart={() => setConfirmRestart(true)} onAdBreak={() => platform.showFullscreenAd()} onRewardedHint={() => platform.showRewardedAd()} />
              : null;

  return (
    <div className={`app-root theme-${save.settings.activeTheme} ${save.settings.reducedMotion ? 'reduce-motion' : ''}`} onContextMenu={(event) => event.preventDefault()}>
      <AppShell route={route} onNavigate={setRoute} ui={ui} immersive={route === 'dialogue'}>{page}</AppShell>
      {confirmRestart && <ConfirmDialog title={ui.restartTitle} body={ui.restartBody} cancel={ui.cancel} confirm={ui.restart} onCancel={() => setConfirmRestart(false)} onConfirm={restartDialogue} />}
      {import.meta.env.DEV && progress && <DialogueDebugger dialogue={dialogue} progress={progress} onProgress={updateProgress} onClear={() => setConfirmRestart(true)} />}
    </div>
  );
}

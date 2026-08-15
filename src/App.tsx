import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppShell, type Route } from './components/AppShell';
import { ConfirmDialog } from './components/ConfirmDialog';
import { DialogueDebugger } from './components/DialogueDebugger';
import { DesktopChatSidebar } from './components/DesktopChatSidebar';
import { getDialogues } from './content/dialogues';
import { getUi, resolveUiLanguage, type UiLanguage } from './content/locales';
import { DialogueEngine } from './engine/dialogue/dialogueEngine';
import { SaveEngine } from './engine/saves/saveEngine';
import { useDeviceLayout } from './hooks/useDeviceLayout';
import { useTvNavigation } from './hooks/useTvNavigation';
import { AboutPage } from './pages/AboutPage';
import { ChatsPage } from './pages/ChatsPage';
import { DialoguePage } from './pages/DialoguePage';
import { EndingsPage } from './pages/EndingsPage';
import { HomePage } from './pages/HomePage';
import { SettingsPage } from './pages/SettingsPage';
import { createPlatform, DevelopmentPlatform, type DeviceType, type Orientation, type PlatformService, type RewardedSimulation } from './platform/platform';
import { soundService } from './services/soundService';
import type { DialogueProgress } from './types/dialogue';
import { createDefaultSave, type GameSave, type GameSettings } from './types/save';

export default function App() {
  const [route, setRoute] = useState<Route>('home');
  const [platform, setPlatform] = useState<PlatformService | null>(null);
  const [save, setSave] = useState<GameSave>(createDefaultSave);
  const [loading, setLoading] = useState(true);
  const [initializationError, setInitializationError] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [platformPaused, setPlatformPaused] = useState(false);
  const [adPaused, setAdPaused] = useState(false);
  const [activeDialogueId, setActiveDialogueId] = useState<string | null>(null);
  const [selectedEndingDialogueId, setSelectedEndingDialogueId] = useState<string | null>(null);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [dialogueSettingsOpen, setDialogueSettingsOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [debugDevice, setDebugDevice] = useState<DeviceType | undefined>();
  const [debugOrientation, setDebugOrientation] = useState<Orientation | undefined>();
  const saveEngineRef = useRef<SaveEngine | null>(null);
  const stickyActivatedRef = useRef(false);
  const readyPlatformRef = useRef<PlatformService | null>(null);
  const adRequestInFlightRef = useRef(false);

  const language: UiLanguage = useMemo(
    () => resolveUiLanguage(save.settings.language, platform?.language),
    [save.settings.language, platform?.language],
  );
  const ui = getUi(language);
  const dialogues = useMemo(() => getDialogues(language), [language]);
  const activeDialogue = dialogues.find((dialogue) => dialogue.id === activeDialogueId) ?? dialogues[0];
  const progress = activeDialogue ? save.dialogs[activeDialogue.id] : undefined;
  const layout = useDeviceLayout(debugDevice ?? platform?.deviceType ?? 'desktop', debugOrientation);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setInitializationError(false);
    void (async () => {
      try {
        const connectedPlatform = await createPlatform();
        const engine = new SaveEngine(connectedPlatform);
        const loaded = await engine.load();
        if (!active) return;
        saveEngineRef.current = engine;
        setPlatform(connectedPlatform);
        setSave(loaded);
        if (loaded.lastOpenedDialog) {
          setActiveDialogueId(loaded.lastOpenedDialog);
          if (loaded.dialogs[loaded.lastOpenedDialog]) setRoute('dialogue');
        }
      } catch (error) {
        console.error('[Platform] Initialization failed.', error);
        if (!active) return;
        saveEngineRef.current = null;
        setPlatform(null);
        setInitializationError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [retryAttempt]);

  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => event.preventDefault();
    document.addEventListener('contextmenu', preventContextMenu);
    return () => document.removeEventListener('contextmenu', preventContextMenu);
  }, []);

  useEffect(() => { document.documentElement.lang = language; }, [language]);

  useEffect(() => {
    if (loading || !platform || readyPlatformRef.current === platform) return;
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => {
      readyPlatformRef.current = platform;
      void platform.ready().catch((error: unknown) => console.error('[YandexSDK] Game Ready failed.', error));
    }));
    return () => cancelAnimationFrame(frame);
  }, [loading, platform]);

  useEffect(() => {
    if (!platform) return;
    setPlatformPaused(platform.lifecyclePaused);
    return platform.subscribeLifecycle(
      () => { setPlatformPaused(true); soundService.pause('platform'); },
      () => { setPlatformPaused(false); soundService.resume('platform'); },
    );
  }, [platform]);

  useEffect(() => {
    if (save.settings.soundEnabled && save.settings.soundVolume > 0) soundService.resume('settings');
    else soundService.pause('settings');
  }, [save.settings.soundEnabled, save.settings.soundVolume]);

  useEffect(() => {
    if (!platform) return;
    const syncGameplayState = () => {
      const visible = !document.hidden;
      if (visible) soundService.resume('visibility');
      else soundService.pause('visibility');
      if (route === 'dialogue' && !dialogueSettingsOpen && !confirmRestart && !confirmExit && !platformPaused && !adPaused && visible) {
        platform.gameplayStart();
        soundService.resume('gameplay');
      } else {
        platform.gameplayStop();
        soundService.pause('gameplay');
      }
    };
    syncGameplayState();
    document.addEventListener('visibilitychange', syncGameplayState);
    return () => {
      document.removeEventListener('visibilitychange', syncGameplayState);
      platform.gameplayStop();
      soundService.pause('gameplay');
    };
  }, [platform, route, dialogueSettingsOpen, confirmRestart, confirmExit, platformPaused, adPaused]);

  useEffect(() => {
    const flush = () => { void saveEngineRef.current?.flushCloud(true); };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, []);

  const commit = useCallback((next: GameSave) => {
    const stamped = { ...next, updatedAt: Date.now() };
    setSave(stamped);
    saveEngineRef.current?.save(stamped);
  }, []);

  const activateSticky = useCallback(async () => {
    if (!platform || stickyActivatedRef.current) return;
    stickyActivatedRef.current = true;
    const result = await platform.showStickyBanner();
    setStickyVisible(result.stickyAdvIsShowing);
  }, [platform]);

  const openDialogue = useCallback((dialogueId: string) => {
    const dialogue = dialogues.find((candidate) => candidate.id === dialogueId);
    if (!dialogue) return;
    const current = save.dialogs[dialogueId] ?? new DialogueEngine(dialogue).createProgress();
    commit({ ...save, lastOpenedDialog: dialogueId, dialogs: { ...save.dialogs, [dialogueId]: { ...current, unread: 0 } } });
    setActiveDialogueId(dialogueId);
    setRoute('dialogue');
    setDialogueSettingsOpen(false);
    void activateSticky();
    if (layout.deviceType !== 'desktop' && platform) void platform.requestFullscreen();
  }, [activateSticky, commit, dialogues, layout.deviceType, platform, save]);

  const updateDialogueProgress = useCallback((dialogueId: string, nextProgress: DialogueProgress) => {
    const knownEndings = new Set([...(save.endings[dialogueId] ?? []), ...nextProgress.endingsUnlocked]);
    commit({
      ...save,
      dialogs: { ...save.dialogs, [dialogueId]: nextProgress },
      endings: { ...save.endings, [dialogueId]: [...knownEndings] },
      lastOpenedDialog: dialogueId,
    });
  }, [commit, save]);

  const updateSettings = (settings: GameSettings) => commit({ ...save, settings });

  const restartDialogue = () => {
    if (!activeDialogue) return;
    const restarted = new DialogueEngine(activeDialogue).createProgress();
    commit({ ...save, dialogs: { ...save.dialogs, [activeDialogue.id]: restarted }, lastOpenedDialog: activeDialogue.id });
    setConfirmRestart(false);
    setRoute('dialogue');
  };

  const runAd = useCallback(async (request: () => Promise<boolean>) => {
    if (adRequestInFlightRef.current) return false;
    adRequestInFlightRef.current = true;
    setAdPaused(true);
    soundService.pause('advertisement');
    try { return await request(); }
    finally {
      adRequestInFlightRef.current = false;
      soundService.resume('advertisement');
      setAdPaused(false);
    }
  }, []);

  const showFullscreen = async () => {
    if (!platform) return false;
    return runAd(() => platform.showFullscreenAd());
  };

  const showRewarded = async () => {
    if (!platform) return false;
    return runAd(() => platform.showRewardedAd());
  };

  const exitGame = async () => {
    await saveEngineRef.current?.flushCloud(true);
    await platform?.exitGame();
  };

  const unlockTheme = async () => {
    if (!await showRewarded()) return;
    updateSettings({ ...save.settings, unlockedThemes: [...new Set([...save.settings.unlockedThemes, 'violet'])], activeTheme: 'violet' });
  };

  const navigate = (target: Route) => {
    setDialogueSettingsOpen(false);
    if (target === 'chats') void activateSticky();
    setRoute(target);
  };

  const handleBack = useCallback(() => {
    if (dialogueSettingsOpen) { setDialogueSettingsOpen(false); return; }
    if (confirmRestart) { setConfirmRestart(false); return; }
    if (confirmExit) { setConfirmExit(false); return; }
    if (route === 'dialogue') setRoute('chats');
    else if (route !== 'home') setRoute('home');
    else setConfirmExit(true);
  }, [confirmExit, confirmRestart, dialogueSettingsOpen, route]);

  useEffect(() => platform?.subscribeHistoryBack(handleBack), [platform, handleBack]);

  useTvNavigation(layout.isTV, handleBack, `${route}:${progress?.currentNodeId}:${progress?.awaitingChoice}:${dialogueSettingsOpen}`);

  const setDevelopmentDevice = (device: DeviceType) => {
    if (platform instanceof DevelopmentPlatform) platform.setDeviceType(device);
    setDebugDevice(device);
  };
  const setRewardedSimulation = (result: RewardedSimulation) => {
    if (platform instanceof DevelopmentPlatform) platform.setRewardedSimulation(result);
  };
  const showDebugSticky = async () => {
    if (!platform) return;
    stickyActivatedRef.current = true;
    setStickyVisible((await platform.showStickyBanner()).stickyAdvIsShowing);
  };
  const hideDebugSticky = async () => {
    if (!platform) return;
    stickyActivatedRef.current = false;
    setStickyVisible((await platform.hideStickyBanner()).stickyAdvIsShowing);
  };

  if (loading || !platform) {
    const loadingLanguage = resolveUiLanguage('auto', navigator.language);
    const loadingUi = getUi(loadingLanguage);
    if (initializationError) return <div className="loading-screen loading-screen--error"><strong>{loadingUi.gameTitle}</strong><p>{loadingUi.loadingError}</p><button className="button button--primary" onClick={() => setRetryAttempt((attempt) => attempt + 1)}>{loadingUi.retry}</button></div>;
    return <div className="loading-screen"><span className="loading-mark"><i /><i /><i /></span><strong>{loadingUi.gameTitle}</strong><small>{loadingUi.loading}</small></div>;
  }

  const dialoguePage = activeDialogue && progress ? (
    <DialoguePage
      ui={ui} language={language} dialogue={activeDialogue} progress={progress} settings={save.settings} isTV={layout.isTV}
      onProgress={(next) => updateDialogueProgress(activeDialogue.id, next)} onBack={() => setRoute('chats')}
      onRestart={() => setConfirmRestart(true)} onSettings={() => setDialogueSettingsOpen(true)}
      onMeaningfulInteraction={() => void activateSticky()}
      paused={dialogueSettingsOpen || confirmRestart || confirmExit || platformPaused || adPaused}
      onAdBreak={showFullscreen} onRewardedHint={showRewarded}
      onFullscreen={() => platform.requestFullscreen()}
    />
  ) : null;

  const page = route === 'home' && activeDialogue ? <HomePage ui={ui} progress={save.dialogs[activeDialogue.id]} dialogue={activeDialogue} onOpen={() => openDialogue(activeDialogue.id)} />
    : route === 'chats' ? <ChatsPage ui={ui} language={language} dialogues={dialogues} progresses={save.dialogs} onOpen={openDialogue} />
      : route === 'settings' ? <SettingsPage ui={ui} settings={save.settings} onChange={updateSettings} onUnlockTheme={unlockTheme} />
        : route === 'endings' ? <EndingsPage ui={ui} dialogues={dialogues} unlockedEndingsByDialogue={save.endings} selectedDialogueId={selectedEndingDialogueId} onSelectDialogue={setSelectedEndingDialogueId} />
          : route === 'about' ? <AboutPage ui={ui} />
            : dialoguePage;

  return (
    <div className={`app-root theme-${save.settings.activeTheme} device-${layout.deviceType} orientation-${layout.orientation} ${stickyVisible ? 'sticky-banner-visible' : ''} ${save.settings.reducedMotion ? 'reduce-motion' : ''}`} onContextMenu={(event) => event.preventDefault()}>
      <AppShell route={route} onNavigate={navigate} ui={ui} immersive={route === 'dialogue'} dialogueSidebar={route === 'dialogue' && activeDialogue ? <DesktopChatSidebar ui={ui} language={language} dialogues={dialogues} progresses={save.dialogs} activeDialogueId={activeDialogue.id} onOpen={openDialogue} /> : undefined}>{page}</AppShell>
      {dialogueSettingsOpen && <div className="settings-overlay" role="dialog" aria-modal="true"><SettingsPage ui={ui} settings={save.settings} onChange={updateSettings} onUnlockTheme={unlockTheme} onBack={() => setDialogueSettingsOpen(false)} /></div>}
      {confirmRestart && <ConfirmDialog title={ui.restartTitle} body={ui.restartBody} cancel={ui.cancel} confirm={ui.restart} onCancel={() => setConfirmRestart(false)} onConfirm={restartDialogue} />}
      {confirmExit && <ConfirmDialog title={ui.exitTitle} body={ui.exitBody} cancel={ui.cancel} confirm={ui.exit} onCancel={() => setConfirmExit(false)} onConfirm={() => void exitGame()} />}
      {import.meta.env.DEV && activeDialogue && progress && <DialogueDebugger
        dialogue={activeDialogue} progress={progress} language={language} deviceType={layout.deviceType} orientation={layout.orientation}
        stickyVisible={stickyVisible} onProgress={(next) => updateDialogueProgress(activeDialogue.id, next)} onClear={() => setConfirmRestart(true)}
        onLanguageChange={(next) => updateSettings({ ...save.settings, language: next })} onDeviceChange={setDevelopmentDevice}
        onOrientationChange={setDebugOrientation} onStickyShow={showDebugSticky} onStickyHide={hideDebugSticky}
        onRewardedSimulation={setRewardedSimulation}
      />}
    </div>
  );
}

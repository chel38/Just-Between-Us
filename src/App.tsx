import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppShell, type Route } from './components/AppShell';
import { AgeGate } from './components/AgeGate';
import { ConfirmDialog } from './components/ConfirmDialog';
import { DialogueDebugger } from './components/DialogueDebugger';
import { DesktopChatSidebar } from './components/DesktopChatSidebar';
import { getDialogues } from './content/dialogues';
import { validateAdultStoryAssets } from './content/assets/adultAssetManifest';
import { getUi, resolveUiLanguage, type UiLanguage } from './content/locales';
import { DialogueEngine } from './engine/dialogue/dialogueEngine';
import { validateDialogueRegistry } from './engine/dialogue/dialogueValidator';
import { SaveEngine } from './engine/saves/saveEngine';
import { useDeviceLayout } from './hooks/useDeviceLayout';
import { useTvNavigation } from './hooks/useTvNavigation';
import { createLegalConsent, isLegalConsentCurrent } from './legal/legalNotice';
import { AboutPage } from './pages/AboutPage';
import { ChatsPage } from './pages/ChatsPage';
import { DialoguePage } from './pages/DialoguePage';
import { EndingsPage } from './pages/EndingsPage';
import { HomePage } from './pages/HomePage';
import { SettingsPage } from './pages/SettingsPage';
import { isPromoCaptureMode } from './promo/promoCapture';
import { createPlatform, DevelopmentPlatform, type DeviceType, type Orientation, type PlatformService, type RewardedSimulation } from './platform/platform';
import { soundService } from './services/soundService';
import { LoadingManager, preloadCriticalAssets, type LoadingSnapshot, type LoadingStageId } from './services/loadingManager';
import type { DialogueProgress } from './types/dialogue';
import { createDefaultSave, type GameSave, type GameSettings } from './types/save';

export default function App() {
  const [route, setRoute] = useState<Route>('home');
  const [platform, setPlatform] = useState<PlatformService | null>(null);
  const [save, setSave] = useState<GameSave>(createDefaultSave);
  const [loadingSnapshot, setLoadingSnapshot] = useState<LoadingSnapshot>({ progress: 0, stage: 'platform', status: 'loading' });
  const [bootVisualReady, setBootVisualReady] = useState(false);
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
  const promoCaptureMode = useMemo(isPromoCaptureMode, []);
  const saveEngineRef = useRef<SaveEngine | null>(null);
  const stickyActivatedRef = useRef(false);
  const readyPlatformRef = useRef<PlatformService | null>(null);
  const adRequestInFlightRef = useRef(false);
  const loadingManagerRef = useRef<LoadingManager | null>(null);

  const language: UiLanguage = useMemo(
    () => resolveUiLanguage(save.settings.language, platform?.language),
    [save.settings.language, platform?.language],
  );
  const ui = getUi(language);
  const dialogues = useMemo(() => getDialogues(language), [language]);
  const activeDialogue = dialogues.find((dialogue) => dialogue.id === activeDialogueId) ?? dialogues[0];
  const progress = activeDialogue ? save.dialogs[activeDialogue.id] : undefined;
  const layout = useDeviceLayout(debugDevice ?? platform?.deviceType ?? 'desktop', debugOrientation, stickyVisible);
  const legalConsentAccepted = isLegalConsentCurrent(save.legalConsent);

  useEffect(() => {
    let active = true;
    const manager = new LoadingManager();
    loadingManagerRef.current = manager;
    const unsubscribe = manager.subscribe((snapshot) => { if (active) setLoadingSnapshot(snapshot); });
    setPlatform(null);
    setBootVisualReady(false);
    saveEngineRef.current = null;
    void (async () => {
      try {
        const nextPlatformStage: Partial<Record<LoadingStageId, LoadingStageId>> = { platform: 'sdk', sdk: 'language', language: 'player' };
        const connectedPlatform = await createPlatform((milestone) => {
          manager.complete(milestone);
          const next = nextPlatformStage[milestone];
          if (next) manager.begin(next);
        });
        const engine = new SaveEngine(connectedPlatform);
        manager.begin('save');
        const loaded = await engine.load((milestone) => {
          manager.complete(milestone);
          if (milestone === 'save') manager.begin('migration');
        });
        const bootLanguage = resolveUiLanguage(loaded.settings.language, connectedPlatform.language);
        manager.begin('localization');
        getUi(bootLanguage);
        manager.complete('localization');
        manager.begin('dialogues');
        const bootDialogues = getDialogues(bootLanguage);
        validateDialogueRegistry(bootDialogues);
        validateAdultStoryAssets(bootDialogues);
        manager.complete('dialogues');
        manager.begin('criticalAssets');
        await preloadCriticalAssets(
          [...new Set(bootDialogues.flatMap((dialogue) => [dialogue.character.avatar, dialogue.character.avatarLarge]))],
          manager,
        );
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
        manager.fail(manager.snapshot.stage, error);
      }
    })();
    return () => { active = false; unsubscribe(); };
  }, [retryAttempt]);

  useEffect(() => {
    if (!platform || bootVisualReady || loadingSnapshot.status === 'error') return;
    let appFrame = 0;
    let readyFrame = 0;
    let revealFrame = 0;
    appFrame = requestAnimationFrame(() => {
      loadingManagerRef.current?.begin('app');
      loadingManagerRef.current?.complete('app');
      readyFrame = requestAnimationFrame(() => {
        loadingManagerRef.current?.begin('ready');
        loadingManagerRef.current?.complete('ready');
        revealFrame = requestAnimationFrame(() => setBootVisualReady(true));
      });
    });
    return () => {
      cancelAnimationFrame(appFrame);
      cancelAnimationFrame(readyFrame);
      cancelAnimationFrame(revealFrame);
    };
  }, [bootVisualReady, loadingSnapshot.status, platform]);

  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => event.preventDefault();
    document.addEventListener('contextmenu', preventContextMenu);
    return () => document.removeEventListener('contextmenu', preventContextMenu);
  }, []);

  useEffect(() => { document.documentElement.lang = language; }, [language]);

  useEffect(() => {
    if (!bootVisualReady || !platform || readyPlatformRef.current === platform) return;
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => {
      readyPlatformRef.current = platform;
      void platform.ready().catch((error: unknown) => console.error('[YandexSDK] Game Ready failed.', error));
    }));
    return () => cancelAnimationFrame(frame);
  }, [bootVisualReady, platform]);

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
      if (legalConsentAccepted && bootVisualReady && route === 'dialogue' && !dialogueSettingsOpen && !confirmRestart && !confirmExit && !platformPaused && !adPaused && visible) {
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
  }, [platform, route, dialogueSettingsOpen, confirmRestart, confirmExit, platformPaused, adPaused, legalConsentAccepted, bootVisualReady]);

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
    if (!platform || stickyActivatedRef.current || promoCaptureMode) return;
    stickyActivatedRef.current = true;
    const result = await platform.showStickyBanner();
    setStickyVisible(result.stickyAdvIsShowing);
  }, [platform, promoCaptureMode]);

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

  useTvNavigation(layout.isTV, handleBack, `${legalConsentAccepted}:${route}:${progress?.currentNodeId}:${progress?.awaitingChoice}:${dialogueSettingsOpen}`);

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

  if (!platform) {
    const loadingLanguage = resolveUiLanguage('auto', navigator.language);
    const loadingUi = getUi(loadingLanguage);
    return <LoadingScreen snapshot={loadingSnapshot} ui={loadingUi} onRetry={() => setRetryAttempt((attempt) => attempt + 1)} />;
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
          : route === 'about' ? <AboutPage ui={ui} language={language} />
            : dialoguePage;

  return (
    <div className={`app-root theme-${save.settings.activeTheme} device-${layout.deviceType} orientation-${layout.orientation} sticky-edge-${layout.stickyEdge} ${stickyVisible ? 'sticky-banner-visible' : ''} ${save.settings.reducedMotion ? 'reduce-motion' : ''}`} style={layout.cssVariables} onContextMenu={(event) => event.preventDefault()}>
      {!legalConsentAccepted ? <AgeGate language={language} onAccept={() => commit({ ...save, legalConsent: createLegalConsent() })} /> : <>
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
      </>}
      {!bootVisualReady && <LoadingScreen snapshot={loadingSnapshot} ui={ui} onRetry={() => setRetryAttempt((attempt) => attempt + 1)} overlay />}
    </div>
  );
}

function LoadingScreen({ snapshot, ui, onRetry, overlay = false }: { snapshot: LoadingSnapshot; ui: ReturnType<typeof getUi>; onRetry: () => void; overlay?: boolean }) {
  if (snapshot.status === 'error') return <div className={`loading-screen loading-screen--error ${overlay ? 'loading-screen--overlay' : ''}`}><strong>{ui.gameTitle}</strong><p>{ui.loadingError}</p><button className="button button--primary" onClick={onRetry}>{ui.retry}</button></div>;
  return <div className={`loading-screen ${overlay ? 'loading-screen--overlay' : ''}`} role="status" aria-live="polite">
    <span className="loading-mark"><i /><i /><i /></span>
    <strong>{ui.gameTitle}</strong>
    <span className="loading-percent">{snapshot.progress}%</span>
    <div className="loading-progress" aria-label={`${ui.loading}: ${snapshot.progress}%`}><i style={{ width: `${snapshot.progress}%` }} /></div>
    <small>{loadingStageLabel(snapshot.stage, ui)}</small>
  </div>;
}

function loadingStageLabel(stage: LoadingStageId, ui: ReturnType<typeof getUi>): string {
  const labels: Record<LoadingStageId, string> = {
    platform: ui.loadingPlatform,
    sdk: ui.loadingSdk,
    language: ui.loadingLanguage,
    player: ui.loadingPlayer,
    save: ui.loadingSave,
    migration: ui.loadingMigration,
    localization: ui.loadingLocalization,
    dialogues: ui.loadingDialogues,
    criticalAssets: ui.loadingCriticalAssets,
    app: ui.loadingApp,
    ready: ui.loadingReady,
  };
  return labels[stage];
}

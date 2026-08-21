import { ArrowLeft, CheckCheck, Clock3, Eye, FileText, Forward, ImageOff, Lightbulb, Maximize2, MessageSquareText, Paperclip, RotateCcw, Settings, ShieldAlert, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar } from '../components/Avatar';
import type { UiLanguage, UiStrings } from '../content/locales';
import { DialogueEngine } from '../engine/dialogue/dialogueEngine';
import { resolveSourceText, resolveTranscriptMessage } from '../engine/dialogue/transcriptResolver';
import { calculateTypingDelay, pausableDelay } from '../engine/typing/typingEngine';
import { soundService } from '../services/soundService';
import { preloadStoryImage } from '../services/storyImageLoader';
import type { DialogueChoice, DialogueDefinition, DialogueProgress, Ending, StoryAttachment, TranscriptMessage } from '../types/dialogue';
import type { GameSettings } from '../types/save';

interface DialoguePageProps {
  ui: UiStrings;
  language: UiLanguage;
  dialogue: DialogueDefinition;
  progress: DialogueProgress;
  settings: GameSettings;
  isTV: boolean;
  paused: boolean;
  onProgress: (progress: DialogueProgress) => void;
  onBack: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onMeaningfulInteraction: () => void;
  onAdBreak: () => Promise<boolean>;
  onRewardedHint: () => Promise<boolean>;
  onFullscreen: () => Promise<boolean>;
}

export function DialoguePage(props: DialoguePageProps) {
  const { dialogue, progress, settings, ui } = props;
  const engine = useMemo(() => new DialogueEngine(dialogue), [dialogue]);
  const engineRef = useRef(engine);
  const progressRef = useRef(progress);
  const onProgressRef = useRef(props.onProgress);
  const runningRef = useRef(false);
  const pausedRef = useRef(document.hidden);
  const [typing, setTyping] = useState(false);
  const [hintError, setHintError] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [activeAttachment, setActiveAttachment] = useState<StoryAttachment | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(true);

  engineRef.current = engine;
  progressRef.current = progress;
  onProgressRef.current = props.onProgress;
  pausedRef.current = props.paused || document.hidden;

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const onScroll = () => { wasAtBottomRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 80; };
    element.addEventListener('scroll', onScroll, { passive: true });
    const observer = new ResizeObserver(() => {
      if (wasAtBottomRef.current) element.scrollTo({ top: element.scrollHeight, behavior: 'auto' });
    });
    observer.observe(element);
    return () => { element.removeEventListener('scroll', onScroll); observer.disconnect(); };
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !wasAtBottomRef.current) return;
    element.scrollTo({ top: element.scrollHeight, behavior: settings.reducedMotion ? 'auto' : 'smooth' });
  }, [progress.history.length, progress.awaitingChoice, typing, settings.reducedMotion, props.language]);

  useEffect(() => {
    if (!props.isTV || !progress.awaitingChoice) return;
    requestAnimationFrame(() => scrollRef.current?.parentElement?.querySelector<HTMLButtonElement>('.choice-button')?.focus());
  }, [progress.awaitingChoice, progress.currentNodeId, props.isTV]);

  useEffect(() => {
    if (progress.awaitingChoice || progress.endingId || runningRef.current) return;
    const controller = new AbortController();
    runningRef.current = true;

    const playNode = async () => {
      let current = progressRef.current;
      const node = engineRef.current.getNode(current.currentNodeId);
      const adFlag = `ad_seen_${node.id}`;
      if (node.adBreak && !current.flags.includes(adFlag)) {
        current = { ...current, flags: [...current.flags, adFlag], updatedAt: Date.now() };
        onProgressRef.current(current);
        await props.onAdBreak();
      }

      while (!controller.signal.aborted) {
        const pending = engineRef.current.pendingMessages(current)[0];
        if (!pending) break;
        const initialText = pending.text ?? '';
        const preloadAsset = pending.kind === 'photo' ? pending.image : pending.attachment?.asset;
        if (preloadAsset) {
          await preloadStoryImage(preloadAsset).catch((error: unknown) => {
            if (import.meta.env.DEV) console.warn('[StoryPhoto] Optional preload failed.', error);
          });
        }
        if (pending.kind === 'delay') {
          await pausableDelay(pending.delayMs ?? 500, controller.signal, () => pausedRef.current || document.hidden);
        } else {
          const canType = pending.sender === 'character' && pending.typing !== false;
          if (canType) setTyping(true);
          const natural = pending.delayMs ?? calculateTypingDelay(initialText.length, settings.messageSpeed);
          if (canType && pending.typingInterrupted) {
            const firstPass = Math.min(850, natural * 0.35);
            await pausableDelay(firstPass, controller.signal, () => pausedRef.current || document.hidden);
            setTyping(false);
            await pausableDelay(settings.messageSpeed === 'fast' ? 180 : 620, controller.signal, () => pausedRef.current || document.hidden);
            setTyping(true);
            await pausableDelay(natural - firstPass, controller.signal, () => pausedRef.current || document.hidden);
          } else {
            await pausableDelay(natural, controller.signal, () => pausedRef.current || document.hidden);
          }
          setTyping(false);
        }
        const localizedMessage = engineRef.current.getScriptMessage(pending.id) ?? pending;
        const localizedText = localizedMessage.text ?? initialText;
        current = engineRef.current.appendScriptMessage(current, localizedMessage, localizedText);
        onProgressRef.current(current);
        if (localizedMessage.sender === 'character' && localizedMessage.kind !== 'status') soundService.notify(settings);
        if (settings.vibration && localizedMessage.sender === 'character' && navigator.vibrate) navigator.vibrate(12);
        await pausableDelay(settings.messageSpeed === 'fast' ? 110 : 320, controller.signal, () => pausedRef.current || document.hidden);
      }
      if (!controller.signal.aborted) {
        current = engineRef.current.finishCurrentNode(current);
        onProgressRef.current(current);
      }
    };

    void playNode().catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === 'AbortError')) console.error('[DialogueEngine]', error);
    }).finally(() => { runningRef.current = false; setTyping(false); });
    return () => { controller.abort(); runningRef.current = false; setTyping(false); };
  }, [progress.currentNodeId, progress.awaitingChoice]); // eslint-disable-line react-hooks/exhaustive-deps

  const node = engine.getNode(progress.currentNodeId);
  const choices = progress.awaitingChoice ? engine.availableChoices(progress) : [];
  const ending = progress.endingId ? dialogue.endings.find((item) => item.id === progress.endingId) : undefined;
  const visibleHistory = progress.history.slice(-160);
  const resolvedHistory = useMemo(() => visibleHistory.map((message) => ({ message, ...resolveTranscriptMessage(message, dialogue) })), [visibleHistory, dialogue]);
  const status = resolveSourceText(progress.characterStatusSourceId, 'system', dialogue) ?? progress.characterStatus ?? dialogue.character.status;
  const hintRevealed = Boolean(progress.revealedHints?.[node.id]);

  useEffect(() => {
    if (!activeAttachment) return;
    const closeOnBack = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Backspace' || event.key === 'BrowserBack' || event.key === 'GoBack') {
        event.preventDefault();
        setActiveAttachment(null);
      }
    };
    window.addEventListener('keydown', closeOnBack, true);
    return () => window.removeEventListener('keydown', closeOnBack, true);
  }, [activeAttachment]);

  const choose = (choice: DialogueChoice) => {
    setHintError(false);
    props.onMeaningfulInteraction();
    props.onProgress(engineRef.current.choose(progressRef.current, choice.id));
    if (settings.vibration && navigator.vibrate) navigator.vibrate(8);
  };

  const requestHint = async () => {
    if (!choices.length || !node.hint || hintLoading || hintRevealed) return;
    setHintLoading(true);
    setHintError(false);
    const rewarded = await props.onRewardedHint();
    if (rewarded) {
      const current = progressRef.current;
      props.onProgress({ ...current, revealedHints: { ...current.revealedHints, [node.id]: true }, updatedAt: Date.now() });
    } else {
      setHintError(true);
    }
    setHintLoading(false);
  };

  return (
    <div className="dialogue-page">
      <header className="dialogue-header">
        <button className="icon-button" onClick={props.onBack} aria-label={ui.back} data-tv-focus><ArrowLeft /></button>
        <Avatar src={progress.characterAvatar ?? dialogue.character.avatar} name={dialogue.character.name} size="sm" online={!ending} onlineLabel={ui.online} />
        <div className="dialogue-header__identity"><strong>{dialogue.character.name}</strong><span aria-live="polite">{typing ? `${dialogue.character.name} ${ui.typing}` : ending ? ui.completed : status}</span></div>
        <span className="chapter-badge">{ui.chapter} {node.chapter}</span>
        <button className="icon-button" onClick={props.onSettings} aria-label={ui.settings} data-tv-focus><Settings /></button>
        {props.isTV && <button className="icon-button" onClick={() => void props.onFullscreen()} aria-label={ui.fullscreen} data-tv-focus><Maximize2 /></button>}
      </header>

      <div className="message-scroll" ref={scrollRef}>
        <div className="conversation-date">{ui.today}</div>
        {progress.history.length === 0 && <div className="empty-chat"><span><Eye /></span><p>{ui.noMessages}</p><small>{dialogue.character.name}<br />{dialogue.character.status}</small></div>}
        {progress.history.length > visibleHistory.length && <div className="history-limit"><Clock3 />{ui.earlier}</div>}
        {resolvedHistory.map(({ message, text, quote, image, alt, attachment }, index) => <MessageBubble key={message.id} message={message} text={text} quote={quote} image={image} alt={alt} attachment={attachment} grouped={resolvedHistory[index - 1]?.message.sender === message.sender} language={props.language} ui={ui} onOpenAttachment={setActiveAttachment} />)}
        {typing && <TypingBubble label={`${dialogue.character.name} ${ui.typing}`} />}
        {ending && <EndingCard ending={ending} total={dialogue.endings.length} ui={ui} onRestart={props.onRestart} />}
      </div>

      {!ending && <footer className={`reply-dock ${choices.length ? 'is-ready' : ''}`}>
        {choices.length > 0 ? <>
          <div className="reply-dock__top"><span>{ui.replyHint}</span>{node.hint && !hintRevealed && <button onClick={() => void requestHint()} disabled={hintLoading} data-tv-focus><Lightbulb size={15} />{ui.hint}</button>}</div>
          {hintRevealed && node.hint && <div className="choice-hint" aria-live="polite"><Sparkles size={14} />{node.hint}</div>}
          {hintError && <div className="choice-hint choice-hint--error" role="status">{ui.hintUnavailable}</div>}
          <div className="choice-list">{choices.map((choice, index) => <button key={choice.id} className="choice-button" onClick={() => choose(choice)} data-tv-focus><span>{index + 1}</span><p>{choice.text}</p></button>)}</div>
        </> : <div className="reply-wait" aria-label={ui.typing}><i /><i /><i /></div>}
      </footer>}
      {activeAttachment && <AttachmentViewer attachment={activeAttachment} ui={ui} onClose={() => setActiveAttachment(null)} />}
    </div>
  );
}

function MessageBubble({ message, text, quote, image, alt, attachment, grouped, language, ui, onOpenAttachment }: { message: TranscriptMessage; text: string; quote?: string; image?: string; alt?: string; attachment?: StoryAttachment; grouped: boolean; language: UiLanguage; ui: UiStrings; onOpenAttachment: (attachment: StoryAttachment) => void }) {
  if (message.sender === 'system') return <div className={`system-message system-message--${message.kind}`}>{message.kind === 'deleted' && <ShieldAlert size={13} />}{text}</div>;
  return (
    <div className={`message-row message-row--${message.sender} ${grouped ? 'is-grouped' : ''}`}>
      <div className="message-bubble">
        {quote && <blockquote>{quote}</blockquote>}
        {image && <StoryPhoto src={image} alt={alt ?? ''} ui={ui} onOpen={() => onOpenAttachment({ id: message.sourceId ?? message.id, type: 'photo', title: ui.evidence, source: '', asset: image, alt, storyPurpose: 'legacy-story-photo', promoAllowed: false, adultCharacters: true })} />}
        {attachment && <AttachmentCard attachment={attachment} ui={ui} onOpen={() => onOpenAttachment(attachment)} />}
        <p>{text}</p>
        <span className="message-meta"><time>{new Date(message.timestamp).toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</time>{message.sender === 'player' && <CheckCheck size={14} />}</span>
        {message.reaction && <b className="message-reaction">{message.reaction}</b>}
      </div>
    </div>
  );
}

function StoryPhoto({ src, alt, ui, onOpen }: { src: string; alt: string; ui: UiStrings; onOpen: () => void }) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="story-photo-fallback" role="img" aria-label={alt}><ImageOff /><span>{ui.photoLoadError}</span><button onClick={() => { setFailed(false); setAttempt((value) => value + 1); }}>{ui.photoRetry}</button></div>;
  return <button className="story-photo-button" onClick={onOpen} aria-label={ui.attachmentOpen} data-tv-focus><img key={attempt} className="story-photo" src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} /></button>;
}

function AttachmentIcon({ type }: { type: StoryAttachment['type'] }) {
  if (type === 'forwarded_message') return <Forward />;
  if (type === 'chat_screenshot') return <MessageSquareText />;
  if (type === 'document') return <FileText />;
  return <Paperclip />;
}

function AttachmentCard({ attachment, ui, onOpen }: { attachment: StoryAttachment; ui: UiStrings; onOpen: () => void }) {
  if (attachment.type === 'forwarded_message') {
    const entry = attachment.entries?.[0];
    return <button className="attachment-forward" onClick={onOpen} aria-label={ui.attachmentOpen} data-tv-focus><span><Forward />{ui.forwarded} · {entry?.author}</span><strong>{entry?.text}</strong><small>{entry?.timestamp ?? attachment.sourceTimestamp}</small></button>;
  }
  return <button className={`attachment-card attachment-card--${attachment.type}`} onClick={onOpen} aria-label={`${ui.attachmentOpen}: ${attachment.title}`} data-tv-focus>
    {attachment.type === 'photo' && attachment.asset
      ? <img src={attachment.asset} alt={attachment.alt ?? ''} loading="lazy" decoding="async" />
      : <span className="attachment-card__icon"><AttachmentIcon type={attachment.type} /></span>}
    <span className="attachment-card__body"><small>{attachment.type === 'document' ? ui.document : attachment.type === 'chat_screenshot' ? ui.chatScreenshot : ui.evidence}</small><strong>{attachment.title}</strong><em>{attachment.subtitle ?? attachment.source}</em></span>
    <Maximize2 />
  </button>;
}

function AttachmentContent({ attachment }: { attachment: StoryAttachment }) {
  if (attachment.type === 'photo' && attachment.asset) {
    return <AttachmentPhoto attachment={attachment} />;
  }
  if (attachment.type === 'chat_screenshot' || attachment.type === 'forwarded_message') {
    return <div className={`embedded-chat embedded-chat--${attachment.type}`}>
      {attachment.entries?.map((entry) => <article key={entry.id}><span>{entry.author}<time>{entry.timestamp}</time></span><p>{entry.text}</p></article>)}
    </div>;
  }
  return <div className="embedded-document"><span className="embedded-document__mark"><FileText /></span><h3>{attachment.title}</h3><p>{attachment.subtitle}</p><dl>{attachment.fields?.map((field) => <div key={`${field.label}-${field.value}`} className={field.emphasis ? 'is-emphasis' : ''}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl></div>;
}

function AttachmentPhoto({ attachment }: { attachment: StoryAttachment }) {
  const [zoomed, setZoomed] = useState(false);
  return <button className={`attachment-viewer__photo-button ${zoomed ? 'is-zoomed' : ''}`} onClick={() => setZoomed((value) => !value)} aria-label={attachment.actionLabel ?? attachment.title} data-tv-focus>
    <img className="attachment-viewer__photo" src={attachment.asset} alt={attachment.alt ?? ''} />
  </button>;
}

function AttachmentViewer({ attachment, ui, onClose }: { attachment: StoryAttachment; ui: UiStrings; onClose: () => void }) {
  return <div className="attachment-viewer" role="dialog" aria-modal="true" aria-label={attachment.title} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={`attachment-viewer__panel attachment-viewer__panel--${attachment.type}`}>
      <header><div><small>{attachment.type === 'forwarded_message' ? ui.forwarded : attachment.type === 'document' ? ui.document : attachment.type === 'chat_screenshot' ? ui.chatScreenshot : ui.evidence}</small><strong>{attachment.title}</strong></div><button className="icon-button" onClick={onClose} aria-label={ui.attachmentClose} autoFocus data-tv-focus><X /></button></header>
      <div className="attachment-viewer__content"><AttachmentContent attachment={attachment} /></div>
      <footer><span>{ui.attachmentSource}: {attachment.source}</span>{attachment.sourceTimestamp && <time>{attachment.sourceTimestamp}</time>}</footer>
    </section>
  </div>;
}

function TypingBubble({ label }: { label: string }) {
  return <div className="typing-row" aria-label={label}><div className="typing-bubble"><i /><i /><i /></div></div>;
}

function EndingCard({ ending, total, ui, onRestart }: { ending: Ending; total: number; ui: UiStrings; onRestart: () => void }) {
  return (
    <section className={`ending-result ending-result--${ending.type}`}>
      <span className="ending-result__icon">{ending.blocked ? <ShieldAlert /> : <Sparkles />}</span>
      <small>{ending.blocked ? ui.blockedTitle : ui.storyComplete}</small><h2>{ending.title}</h2><p>{ending.description}</p>
      <span>{ui.endingOf} {ending.number} {ui.of} {total}</span>
      <button className="button button--ghost" onClick={onRestart} data-tv-focus><RotateCcw size={17} />{ui.replay}</button>
    </section>
  );
}

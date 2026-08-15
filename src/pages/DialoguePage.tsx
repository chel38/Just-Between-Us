import { ArrowLeft, CheckCheck, Clock3, Eye, Lightbulb, MoreHorizontal, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar } from '../components/Avatar';
import type { UiStrings } from '../content/locales';
import { DialogueEngine } from '../engine/dialogue/dialogueEngine';
import { calculateTypingDelay, pausableDelay } from '../engine/typing/typingEngine';
import { soundService } from '../services/soundService';
import type { DialogueChoice, DialogueDefinition, DialogueProgress, Ending, TranscriptMessage } from '../types/dialogue';
import type { GameSettings } from '../types/save';

interface DialoguePageProps {
  ui: UiStrings;
  dialogue: DialogueDefinition;
  progress: DialogueProgress;
  settings: GameSettings;
  onProgress: (progress: DialogueProgress) => void;
  onBack: () => void;
  onRestart: () => void;
  onAdBreak: () => Promise<boolean>;
  onRewardedHint: () => Promise<boolean>;
}

export function DialoguePage(props: DialoguePageProps) {
  const { dialogue, progress, settings, ui } = props;
  const engine = useMemo(() => new DialogueEngine(dialogue), [dialogue]);
  const progressRef = useRef(progress);
  const onProgressRef = useRef(props.onProgress);
  const runningRef = useRef(false);
  const [typing, setTyping] = useState(false);
  const [paused, setPaused] = useState(document.hidden);
  const [hint, setHint] = useState<{ id: string; text: string } | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  progressRef.current = progress;
  onProgressRef.current = props.onProgress;

  useEffect(() => {
    const onVisibility = () => {
      setPaused(document.hidden);
      if (document.hidden) soundService.pause(); else soundService.resume();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const reduce = settings.reducedMotion;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [progress.history.length, progress.awaitingChoice, typing, settings.reducedMotion]);

  useEffect(() => {
    if (progress.awaitingChoice || progress.endingId || runningRef.current) return;
    const controller = new AbortController();
    runningRef.current = true;

    const playNode = async () => {
      let current = progressRef.current;
      const node = engine.getNode(current.currentNodeId);
      const adFlag = `ad_seen_${node.id}`;
      if (node.adBreak && !current.flags.includes(adFlag)) {
        current = { ...current, flags: [...current.flags, adFlag], updatedAt: Date.now() };
        onProgressRef.current(current);
        await props.onAdBreak();
      }

      while (!controller.signal.aborted) {
        const message = engine.pendingMessages(current)[0];
        if (!message) break;
        const text = message.text ?? '';
        if (message.kind === 'delay') {
          await pausableDelay(message.delayMs ?? 500, controller.signal, () => paused || document.hidden);
        } else {
          const canType = message.sender === 'character' && message.typing !== false;
          if (canType) setTyping(true);
          const natural = message.delayMs ?? calculateTypingDelay(text.length, settings.messageSpeed);
          if (canType && message.typingInterrupted) {
            const firstPass = Math.min(850, natural * 0.35);
            await pausableDelay(firstPass, controller.signal, () => paused || document.hidden);
            setTyping(false);
            await pausableDelay(settings.messageSpeed === 'fast' ? 180 : 620, controller.signal, () => paused || document.hidden);
            setTyping(true);
            await pausableDelay(natural - firstPass, controller.signal, () => paused || document.hidden);
          } else {
            await pausableDelay(natural, controller.signal, () => paused || document.hidden);
          }
          setTyping(false);
        }
        current = engine.appendScriptMessage(current, message, text);
        onProgressRef.current(current);
        if (message.sender === 'character' && message.kind !== 'status') soundService.notify(settings);
        if (settings.vibration && message.sender === 'character' && navigator.vibrate) navigator.vibrate(12);
        await pausableDelay(settings.messageSpeed === 'fast' ? 110 : 320, controller.signal, () => paused || document.hidden);
      }
      if (!controller.signal.aborted) {
        current = engine.finishCurrentNode(current);
        onProgressRef.current(current);
      }
    };

    void playNode().catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === 'AbortError')) console.error('[DialogueEngine]', error);
    }).finally(() => { runningRef.current = false; setTyping(false); });
    return () => { controller.abort(); runningRef.current = false; setTyping(false); };
    // Current node and waiting state are the only events that start a playback pass.
  }, [progress.currentNodeId, progress.awaitingChoice]); // eslint-disable-line react-hooks/exhaustive-deps

  const choices = progress.awaitingChoice ? engine.availableChoices(progress) : [];
  const ending = progress.endingId ? dialogue.endings.find((item) => item.id === progress.endingId) : undefined;
  const visibleHistory = progress.history.slice(-160);
  const chapter = engine.getNode(progress.currentNodeId).chapter;

  const choose = (choice: DialogueChoice) => {
    setHint(null);
    const next = engine.choose(progressRef.current, choice.id);
    props.onProgress(next);
    if (settings.vibration && navigator.vibrate) navigator.vibrate(8);
  };

  const requestHint = async () => {
    if (!choices.length || hintLoading) return;
    setHintLoading(true);
    const rewarded = await props.onRewardedHint();
    if (rewarded) {
      const choice = choices[Math.floor(Math.random() * choices.length)];
      const text = choice.tone === 'warm' ? ui.hintWarm : choice.tone === 'bold' ? ui.hintBold : choice.tone === 'careful' ? ui.hintCareful : choice.tone === 'witty' ? ui.hintWitty : ui.hintRisky;
      setHint({ id: choice.id, text });
    } else {
      setHint({ id: '', text: ui.hintUnavailable });
    }
    setHintLoading(false);
  };

  return (
    <div className="dialogue-page">
      <header className="dialogue-header">
        <button className="icon-button" onClick={props.onBack} aria-label={ui.back}><ArrowLeft /></button>
        <Avatar src={progress.characterAvatar ?? dialogue.character.avatar} name={dialogue.character.name} size="sm" online={!ending && !progress.characterStatus?.toLowerCase().includes('offline') && !progress.characterStatus?.toLowerCase().includes('не в сети')} />
        <div className="dialogue-header__identity"><strong>{dialogue.character.name}</strong><span>{typing ? ui.typing : ending ? ui.completed : progress.characterStatus ?? dialogue.character.status}</span></div>
        <span className="chapter-badge">{ui.chapter} {chapter}</span>
        <button className="icon-button" aria-label="menu"><MoreHorizontal /></button>
      </header>

      <div className="message-scroll" ref={scrollRef}>
        <div className="conversation-date">{ui.language === 'Language' ? 'Today' : 'Сегодня'}</div>
        {progress.history.length === 0 && <div className="empty-chat"><span><Eye /></span><p>{ui.noMessages}</p><small>{dialogue.character.name}<br />{dialogue.character.status}</small></div>}
        {progress.history.length > visibleHistory.length && <div className="history-limit"><Clock3 />{ui.earlier}</div>}
        {visibleHistory.map((message, index) => <MessageBubble key={message.id} message={message} grouped={visibleHistory[index - 1]?.sender === message.sender} />)}
        {typing && <TypingBubble name={dialogue.character.name} />}
        {ending && <EndingCard ending={ending} ui={ui} onRestart={props.onRestart} />}
      </div>

      {!ending && (
        <footer className={`reply-dock ${choices.length ? 'is-ready' : ''}`}>
          {choices.length > 0 ? (
            <>
              <div className="reply-dock__top"><span>{ui.replyHint}</span><button onClick={() => void requestHint()} disabled={hintLoading}><Lightbulb size={15} />{ui.hint}</button></div>
              {hint && <div className="choice-hint"><Sparkles size={14} />{hint.text}</div>}
              <div className="choice-list">
                {choices.map((choice, index) => (
                  <button key={choice.id} className={`choice-button ${hint?.id === choice.id ? 'is-hinted' : ''}`} onClick={() => choose(choice)}>
                    <span>{index + 1}</span><p>{choice.text}</p>
                  </button>
                ))}
              </div>
            </>
          ) : <div className="reply-wait"><i /><i /><i /></div>}
        </footer>
      )}
    </div>
  );
}

function MessageBubble({ message, grouped }: { message: TranscriptMessage; grouped: boolean }) {
  if (message.sender === 'system') {
    return <div className={`system-message system-message--${message.kind}`}>{message.kind === 'deleted' && <ShieldAlert size={13} />}{message.text}</div>;
  }
  return (
    <div className={`message-row message-row--${message.sender} ${grouped ? 'is-grouped' : ''}`}>
      <div className="message-bubble">
        {message.quote && <blockquote>{message.quote}</blockquote>}
        {message.image && <img src={message.image} alt={message.alt ?? ''} loading="lazy" />}
        <p>{message.text}</p>
        <span className="message-meta"><time>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>{message.sender === 'player' && <CheckCheck size={14} />}</span>
        {message.reaction && <b className="message-reaction">{message.reaction}</b>}
      </div>
    </div>
  );
}

function TypingBubble({ name }: { name: string }) {
  return <div className="typing-row" aria-label={`${name} typing`}><div className="typing-bubble"><i /><i /><i /></div></div>;
}

function EndingCard({ ending, ui, onRestart }: { ending: Ending; ui: UiStrings; onRestart: () => void }) {
  return (
    <section className={`ending-result ending-result--${ending.type}`}>
      <span className="ending-result__icon">{ending.blocked ? <ShieldAlert /> : <Sparkles />}</span>
      <small>{ending.blocked ? ui.blockedTitle : ui.storyComplete}</small>
      <h2>{ending.title}</h2>
      <p>{ending.description}</p>
      <span>{ui.endingOf} {ending.number} {ui.of} 7</span>
      <button className="button button--ghost" onClick={onRestart}><RotateCcw size={17} />{ui.replay}</button>
    </section>
  );
}

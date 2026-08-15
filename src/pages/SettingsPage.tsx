import { ArrowLeft, BellRing, Languages, MessageSquareText, MoonStar, Palette, Volume2, Waves } from 'lucide-react';
import type { UiStrings } from '../content/locales';
import type { GameSettings } from '../types/save';

interface SettingsPageProps {
  ui: UiStrings;
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
  onUnlockTheme: () => Promise<void>;
  onBack?: () => void;
}

export function SettingsPage({ ui, settings, onChange, onUnlockTheme, onBack }: SettingsPageProps) {
  const patch = (value: Partial<GameSettings>) => onChange({ ...settings, ...value });
  const violetUnlocked = settings.unlockedThemes.includes('violet');
  return (
    <div className="page settings-page">
      {onBack && <button className="back-link" onClick={onBack} data-tv-focus><ArrowLeft />{ui.back}</button>}
      <header className="page-header"><div><span className="eyebrow">{ui.gameTitle}</span><h1>{ui.settings}</h1></div></header>
      <SettingsGroup icon={<MessageSquareText />} title={ui.messages}>
        <div className="setting-row setting-row--stack"><label>{ui.messageSpeed}</label><div className="segmented">
          <button className={settings.messageSpeed === 'normal' ? 'is-active' : ''} onClick={() => patch({ messageSpeed: 'normal' })}>{ui.messageNormal}</button>
          <button className={settings.messageSpeed === 'fast' ? 'is-active' : ''} onClick={() => patch({ messageSpeed: 'fast' })}>{ui.messageFast}</button>
        </div></div>
        <Toggle label={ui.vibration} icon={<BellRing />} checked={settings.vibration} onChange={(vibration) => patch({ vibration })} />
        <Toggle label={ui.animations} icon={<Waves />} checked={settings.reducedMotion} onChange={(reducedMotion) => patch({ reducedMotion })} />
      </SettingsGroup>
      <SettingsGroup icon={<Volume2 />} title={ui.audio}>
        <Toggle label={ui.sound} checked={settings.soundEnabled} onChange={(soundEnabled) => patch({ soundEnabled })} />
        <Range label={ui.soundVolume} value={settings.soundVolume} disabled={!settings.soundEnabled} onChange={(soundVolume) => patch({ soundVolume })} />
      </SettingsGroup>
      <SettingsGroup icon={<Languages />} title={ui.language}>
        <div className="setting-row setting-row--stack"><label>{ui.language}</label><div className="segmented segmented--three">
          <button className={settings.language === 'auto' ? 'is-active' : ''} onClick={() => patch({ language: 'auto' })}>{ui.automatic}</button>
          <button className={settings.language === 'ru' ? 'is-active' : ''} onClick={() => patch({ language: 'ru' })}>{ui.russian}</button>
          <button className={settings.language === 'en' ? 'is-active' : ''} onClick={() => patch({ language: 'en' })}>{ui.english}</button>
        </div></div>
      </SettingsGroup>
      <SettingsGroup icon={<Palette />} title={ui.appearance}>
        <div className="theme-picker">
          <button className={`theme-swatch theme-swatch--midnight ${settings.activeTheme === 'midnight' ? 'is-active' : ''}`} onClick={() => patch({ activeTheme: 'midnight' })}><MoonStar /><span>{ui.midnight}</span></button>
          {violetUnlocked ? (
            <button className={`theme-swatch theme-swatch--violet ${settings.activeTheme === 'violet' ? 'is-active' : ''}`} onClick={() => patch({ activeTheme: 'violet' })}><Palette /><span>{ui.violet}</span></button>
          ) : (
            <button className="theme-swatch theme-swatch--locked" onClick={() => void onUnlockTheme()}><Palette /><span>{ui.themeReward}</span></button>
          )}
        </div>
        <p className="setting-note">{ui.adNote}</p>
      </SettingsGroup>
    </div>
  );
}

function SettingsGroup({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <section className="settings-group"><header><span>{icon}</span><h2>{title}</h2></header>{children}</section>;
}

function Toggle({ label, icon, checked, onChange }: { label: string; icon?: React.ReactNode; checked: boolean; onChange: (value: boolean) => void }) {
  return <div className="setting-row"><span className="setting-label">{icon}{label}</span><button className={`toggle ${checked ? 'is-on' : ''}`} role="switch" aria-checked={checked} onClick={() => onChange(!checked)}><span /></button></div>;
}

function Range({ label, value, disabled, onChange }: { label: string; value: number; disabled: boolean; onChange: (value: number) => void }) {
  return <label className={`setting-row range-row ${disabled ? 'is-disabled' : ''}`}><span>{label}</span><input type="range" min="0" max="1" step="0.05" value={value} disabled={disabled} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

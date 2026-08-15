import { CircleEllipsis, Info, MessageCircle, Settings, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import type { UiStrings } from '../content/locales';

export type Route = 'home' | 'chats' | 'dialogue' | 'endings' | 'settings' | 'about';

interface AppShellProps {
  route: Route;
  onNavigate: (route: Route) => void;
  ui: UiStrings;
  children: ReactNode;
  immersive?: boolean;
  dialogueSidebar?: ReactNode;
}

const nav = [
  ['chats', MessageCircle, 'dialogues'],
  ['endings', Sparkles, 'endings'],
  ['settings', Settings, 'settings'],
  ['about', Info, 'about'],
] as const;

export function AppShell({ route, onNavigate, ui, children, immersive = false, dialogueSidebar }: AppShellProps) {
  return (
    <main className={`game-shell ${immersive ? 'game-shell--immersive' : ''} ${dialogueSidebar ? 'game-shell--with-dialogues' : ''}`}>
      <aside className="side-rail" aria-label={ui.gameTitle}>
        <button className="brand" onClick={() => onNavigate('home')} aria-label={ui.gameTitle} data-tv-focus>
          <span className="brand__mark"><CircleEllipsis /></span>
          <span><strong>{ui.gameTitle}</strong><small>{ui.gameSubtitle}</small></span>
        </button>
        <nav className="side-nav">
          {nav.map(([target, Icon, label]) => (
            <button key={target} className={route === target || (target === 'chats' && route === 'dialogue') ? 'is-active' : ''} onClick={() => onNavigate(target)} data-tv-focus>
              <Icon size={19} /><span>{ui[label]}</span>
            </button>
          ))}
        </nav>
        <div className="side-rail__footer"><span className="privacy-dot" />18+</div>
      </aside>
      {dialogueSidebar}
      <section className="app-surface">{children}</section>
      {!immersive && (
        <nav className="bottom-nav" aria-label={ui.gameTitle}>
          {nav.slice(0, 3).map(([target, Icon, label]) => (
            <button key={target} className={route === target ? 'is-active' : ''} onClick={() => onNavigate(target)} data-tv-focus>
              <Icon size={20} /><span>{ui[label]}</span>
            </button>
          ))}
        </nav>
      )}
    </main>
  );
}

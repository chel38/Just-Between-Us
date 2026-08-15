import { UserRound } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
  onlineLabel?: string;
}

export function Avatar({ src, name, size = 'md', online = false, onlineLabel = 'online' }: AvatarProps) {
  return (
    <div className={`avatar avatar--${size}`} aria-label={name}>
      {src ? <img src={src} alt="" draggable={false} /> : <UserRound aria-hidden="true" />}
      {online && <span className="avatar__online" aria-label={onlineLabel} />}
    </div>
  );
}

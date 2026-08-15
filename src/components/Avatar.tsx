import { UserRound } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
}

export function Avatar({ src, name, size = 'md', online = false }: AvatarProps) {
  return (
    <div className={`avatar avatar--${size}`} aria-label={name}>
      {src ? <img src={src} alt="" draggable={false} /> : <UserRound aria-hidden="true" />}
      {online && <span className="avatar__online" aria-label="online" />}
    </div>
  );
}

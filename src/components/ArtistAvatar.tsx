import React, { useState } from 'react';
import { User } from 'lucide-react';

interface ArtistAvatarProps {
  src: string;
  name: string;
  gradient?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ArtistAvatar: React.FC<ArtistAvatarProps> = ({
  src,
  name,
  gradient = 'from-violet-600 to-indigo-900',
  className = '',
  size = 'sm'
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-4 h-4 text-[9px]',
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-24 h-24 text-xl'
  }[size];

  if (hasError || !src) {
    const initials = name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <div
        className={`rounded-full shrink-0 flex items-center justify-center font-bold tracking-tight text-white bg-gradient-to-br ${gradient} border border-white/20 select-none shadow-sm ${sizeClasses} ${className}`}
        title={name}
        aria-label={name}
      >
        {initials || <User className="w-3/5 h-3/5 text-white/80" />}
      </div>
    );
  }

  return (
    <div
      className={`rounded-full shrink-0 overflow-hidden border border-white/20 select-none shadow-sm ${sizeClasses} ${className}`}
      title={name}
    >
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

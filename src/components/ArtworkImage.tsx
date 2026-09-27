import React, { useState } from 'react';
import { Music2, Disc3 } from 'lucide-react';

interface ArtworkImageProps {
  src: string;
  alt: string;
  fallbackGradient?: string;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
  showVinylEffect?: boolean;
}

export const ArtworkImage: React.FC<ArtworkImageProps> = ({
  src,
  alt,
  fallbackGradient = 'from-purple-900 via-indigo-950 to-slate-950',
  className = 'w-full h-full',
  iconSize = 'md',
  showVinylEffect = false
}) => {
  const [hasError, setHasError] = useState(false);

  const iconClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  }[iconSize];

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${fallbackGradient} ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.25),transparent_70%)]" />
        {showVinylEffect ? (
          <Disc3 className={`${iconClasses} text-white/40 animate-spin-slow relative z-10`} />
        ) : (
          <Music2 className={`${iconClasses} text-white/50 relative z-10`} />
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-500 will-change-transform"
      />
    </div>
  );
};

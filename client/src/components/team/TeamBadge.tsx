import { useState, useCallback } from 'react';

const PLACEHOLDER_BADGE = '/assets/teams/placeholder-badge.svg';

function getBadgeCandidates(teamId: string | null, badgeSrc?: string | null): string[] {
  if (badgeSrc) return [badgeSrc];
  if (!teamId) return [PLACEHOLDER_BADGE];
  return [
    `/assets/teams/${teamId}/badge.svg`,
    `/assets/teams/${teamId}/badge.png`,
    PLACEHOLDER_BADGE,
  ];
}

export interface TeamBadgeProps {
  teamId: string | null;
  teamName: string;
  badgeSrc?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  /** When true, wraps the image in a glass ring style container */
  glassRing?: boolean;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

export function TeamBadge({
  teamId,
  teamName,
  badgeSrc,
  className = '',
  size = 'lg',
  glassRing = true,
}: TeamBadgeProps) {
  const candidates = getBadgeCandidates(teamId, badgeSrc);
  const [currentIndex, setCurrentIndex] = useState(0);
  const src = candidates[currentIndex] ?? PLACEHOLDER_BADGE;

  const handleError = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= candidates.length) return prev;
      return next;
    });
  }, [candidates.length]);

  const sizeClass = sizeClasses[size];

  return (
    <div
      className={
        glassRing
          ? `flex-shrink-0 rounded-full border-4 border-card-border bg-card flex items-center justify-center overflow-hidden shadow-lg ${sizeClass} ${className}`
          : `flex-shrink-0 rounded-full overflow-hidden ${sizeClass} ${className}`
      }
    >
      <img
        src={src}
        alt={`Escudo ${teamName}`}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain p-1"
        onError={handleError}
      />
    </div>
  );
}

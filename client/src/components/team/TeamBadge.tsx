import { useState, useCallback } from 'react';
import { getTeamCrestFromTeam } from '@/lib/teamCrests';

const DEFAULT_CREST = '/assets/crests/default.png';

export interface TeamBadgeProps {
  teamId: string | null;
  teamName: string;
  /** @deprecated Ignored - crest resolved only via getTeamCrest(slug) */
  badgeSrc?: string | null;
  /** @deprecated Ignored - Corinthians always uses corinthians.png */
  logoUrl?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
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
  className = '',
  size = 'lg',
  glassRing = true,
}: TeamBadgeProps) {
  const crestUrl = getTeamCrestFromTeam(teamId, teamName);
  const [ errored, setErrored ] = useState(false);
  const src = errored ? DEFAULT_CREST : crestUrl;

  const handleError = useCallback(() => setErrored(true), []);

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

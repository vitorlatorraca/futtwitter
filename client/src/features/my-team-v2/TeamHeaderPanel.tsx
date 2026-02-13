'use client';

import { getTeamCrest } from '@/lib/teamCrests';
import { User, Building2 } from 'lucide-react';
import type { ClubConfig } from '@/features/meu-time/types';

interface TeamHeaderPanelProps {
  clubConfig: ClubConfig;
  currentPosition?: number | null;
}

const panelClass =
  'rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#10161D] p-4 shadow-sm transition-colors hover:border-[rgba(255,255,255,0.12)]';

export function TeamHeaderPanel({ clubConfig, currentPosition }: TeamHeaderPanelProps) {
  const crestUrl = getTeamCrest(clubConfig.teamId);

  return (
    <div className={panelClass}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={crestUrl}
            alt={`Escudo ${clubConfig.displayName}`}
            className="h-16 w-16 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/crests/default.png';
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-bold text-foreground truncate">
            {clubConfig.displayName}
          </h1>
          <p className="text-xs text-muted-foreground truncate">{clubConfig.country}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
            {currentPosition != null && (
              <span className="font-semibold text-foreground tabular-nums">{currentPosition}º</span>
            )}
            {clubConfig.coach && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {clubConfig.coach}
              </span>
            )}
            {clubConfig.stadiumName && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {clubConfig.stadiumName}
              </span>
            )}
            {clubConfig.league && (
              <span className="px-2 py-0.5 rounded bg-[#141C24] text-foreground-secondary">
                {clubConfig.league}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

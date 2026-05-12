'use client';

import { getTeamCrest } from '@/lib/teamCrests';
import { User, Building2 } from 'lucide-react';
import type { ClubConfig } from '@/features/meu-time/types';

interface TeamHeaderPanelProps {
  clubConfig: ClubConfig;
  currentPosition?: number | null;
}

export function TeamHeaderPanel({ clubConfig, currentPosition }: TeamHeaderPanelProps) {
  const crestUrl = getTeamCrest(clubConfig.teamId);

  return (
    <div className="rounded-xl border border-border bg-surface-card p-4 transition-colors hover:border-border-strong">
      <div className="flex items-center gap-4">
        <div className="shrink-0">
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
          <h1 className="text-xl font-bold text-foreground truncate leading-tight">
            {clubConfig.displayName}
          </h1>
          <p className="text-xs text-foreground-secondary truncate mt-0.5">{clubConfig.country}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-foreground-secondary">
            {currentPosition != null && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold tabular-nums text-xs">
                {currentPosition}º lugar
              </span>
            )}
            {clubConfig.coach && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-foreground-muted" />
                {clubConfig.coach}
              </span>
            )}
            {clubConfig.stadiumName && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-foreground-muted" />
                {clubConfig.stadiumName}
              </span>
            )}
            {clubConfig.league && (
              <span className="px-2 py-0.5 rounded bg-surface-elevated text-foreground-secondary text-[11px] font-medium">
                {clubConfig.league}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

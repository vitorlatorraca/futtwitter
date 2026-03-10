'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, TrendingDown, Minus } from 'lucide-react';

interface StandingsTeam {
  id: string;
  name: string;
  points: number;
  currentPosition?: number | null;
}

interface StandingsMiniProps {
  teams: StandingsTeam[];
  currentTeamId: string;
  isLoading?: boolean;
}

const Z4_START = 17;

export function StandingsMini({ teams, currentTeamId, isLoading }: StandingsMiniProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface-card p-4">
        <Skeleton className="h-4 w-40 mb-3" />
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Situação no campeonato</h3>
        <p className="text-xs text-foreground-secondary">Classificação indisponível</p>
      </div>
    );
  }

  const sorted = [...teams].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
  const withPosition = sorted.map((t, i) => ({ ...t, position: i + 1 }));
  const current = withPosition.find((t) => t.id === currentTeamId);
  const leader = withPosition[0];
  const z4First = withPosition[Z4_START - 1];

  if (!current) {
    return (
      <div className="rounded-xl border border-border bg-surface-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Situação no campeonato</h3>
        <p className="text-xs text-foreground-secondary">Classificação indisponível</p>
      </div>
    );
  }

  const pointsLeader = leader?.points ?? 0;
  const pointsUs = current.points ?? 0;
  const position = current.position ?? 0;
  const diffLeader = leader && pointsLeader > pointsUs ? pointsLeader - pointsUs : null;
  const diffZ4 = z4First ? pointsUs - (z4First.points ?? 0) : null;
  const inZ4 = position >= Z4_START;

  return (
    <div className="rounded-xl border border-border bg-surface-card p-4 transition-colors hover:border-border-strong">
      <h3 className="text-xs font-semibold text-foreground-secondary tracking-wider mb-3">
        Situação no campeonato
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-sm tabular-nums ${
          inZ4
            ? 'bg-danger/10 text-danger border border-danger/20'
            : 'bg-primary/10 text-primary border border-primary/20'
        }`}>
          {position}º
        </div>

        <span className="text-sm font-semibold text-foreground tabular-nums">
          {pointsUs} <span className="text-foreground-secondary font-normal text-xs">pts</span>
        </span>

        {diffLeader != null && diffLeader > 0 && (
          <span className="flex items-center gap-1 text-foreground-secondary text-xs">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            {diffLeader} pts do líder
          </span>
        )}

        {inZ4 && (
          <span className="flex items-center gap-1 text-danger text-xs font-semibold">
            <TrendingDown className="h-3.5 w-3.5" />
            Zona de rebaixamento
          </span>
        )}

        {!inZ4 && diffZ4 != null && diffZ4 > 0 && (
          <span className="text-foreground-secondary text-xs">
            <Minus className="h-3 w-3 inline mr-0.5" />
            {diffZ4} pts do Z4
          </span>
        )}
      </div>
    </div>
  );
}

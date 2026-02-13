'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, TrendingDown } from 'lucide-react';

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

const panelClass =
  'rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#10161D] p-4 shadow-sm';

export function StandingsMini({
  teams,
  currentTeamId,
  isLoading,
}: StandingsMiniProps) {
  if (isLoading) {
    return (
      <div className={panelClass}>
        <Skeleton className="h-5 w-40 mb-3" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className={panelClass}>
        <h3 className="text-sm font-semibold text-foreground mb-2">Situação no campeonato</h3>
        <p className="text-xs text-muted-foreground">Classificação indisponível</p>
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
      <div className={panelClass}>
        <h3 className="text-sm font-semibold text-foreground mb-2">Situação no campeonato</h3>
        <p className="text-xs text-muted-foreground">Classificação indisponível</p>
      </div>
    );
  }

  const pointsLeader = leader?.points ?? 0;
  const pointsUs = current.points ?? 0;
  const position = current.position ?? 0;
  const diffLeader = leader && pointsLeader > pointsUs ? pointsLeader - pointsUs : null;
  const diffZ4 = z4First ? pointsUs - (z4First.points ?? 0) : null;

  return (
    <div className={panelClass}>
      <h3 className="text-sm font-semibold text-foreground mb-3">Situação no campeonato</h3>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="font-bold text-foreground tabular-nums">{position}º</span>
        <span className="text-muted-foreground">
          <span className="font-medium text-foreground">{pointsUs} pts</span>
        </span>
        {diffLeader != null && diffLeader > 0 && (
          <span className="flex items-center gap-1 text-meu-time-warning text-xs">
            <Trophy className="h-3.5 w-3.5" />
            {diffLeader} pts do líder
          </span>
        )}
        {diffZ4 != null && diffZ4 >= 0 && position >= Z4_START && (
          <span className="flex items-center gap-1 text-meu-time-danger text-xs">
            <TrendingDown className="h-3.5 w-3.5" />
            Z4
          </span>
        )}
        {diffZ4 != null && diffZ4 > 0 && position < Z4_START && (
          <span className="text-muted-foreground text-xs">+{diffZ4} pts acima do Z4</span>
        )}
      </div>
    </div>
  );
}

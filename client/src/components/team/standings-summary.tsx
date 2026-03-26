'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, TrendingDown } from 'lucide-react';

export interface StandingsTeam {
  id: string;
  name: string;
  points: number;
  currentPosition?: number | null;
}

interface StandingsSummaryProps {
  teams: StandingsTeam[];
  currentTeamId: string;
  isLoading?: boolean;
}

/** Brasileirão: 20 teams, Z4 = positions 17–20 */
const Z4_START = 17;

export function StandingsSummary({
  teams,
  currentTeamId,
  isLoading,
}: StandingsSummaryProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="space-y-2">
        <span className="text-sm font-semibold text-foreground">Situação no campeonato</span>
        <p className="text-sm text-muted-foreground">Classificação indisponível (demo)</p>
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
      <div className="space-y-2">
        <span className="text-sm font-semibold text-foreground">Situação no campeonato</span>
        <p className="text-sm text-muted-foreground">Classificação indisponível (demo)</p>
      </div>
    );
  }

  const pointsLeader = leader != null ? (leader.points ?? 0) : 0;
  const pointsUs = current.points ?? 0;
  const position = current.position ?? 0;
  const diffLeader = leader != null && pointsLeader > pointsUs ? pointsLeader - pointsUs : null;
  const diffZ4 = z4First != null ? pointsUs - (z4First.points ?? 0) : null;

  return (
    <div className="space-y-2">
      <span className="text-sm font-semibold text-foreground">Situação no campeonato</span>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="font-bold text-foreground">{position}º</span>
        <span className="text-muted-foreground">
          <span className="font-medium text-foreground">{pointsUs} pts</span>
        </span>
        {diffLeader != null && diffLeader > 0 && (
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <Trophy className="h-4 w-4" />
            {diffLeader} pts do líder
          </span>
        )}
        {diffZ4 != null && diffZ4 >= 0 && position >= Z4_START && (
          <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
            <TrendingDown className="h-4 w-4" />
            Zona de rebaixamento
          </span>
        )}
        {diffZ4 != null && diffZ4 > 0 && position < Z4_START && (
          <span className="text-muted-foreground">+{diffZ4} pts acima do Z4</span>
        )}
      </div>
    </div>
  );
}

'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, Trophy } from 'lucide-react';
import { TeamBadge } from './TeamBadge';
import { getTeamCrestFromTeam } from '@/lib/teamCrests';
import { Skeleton } from '@/components/ui/skeleton';

export type MatchStatus = 'Finished' | 'Live' | 'Upcoming';

export interface FeaturedMatchData {
  id: string;
  competition: string | null;
  championshipRound: number | null;
  matchDate: string;
  teamScore: number | null;
  opponentScore: number | null;
  status: string;
  isHomeMatch: boolean;
  opponent: string;
  opponentLogoUrl: string | null;
  teamId: string;
  teamName: string;
  teamLogoUrl: string | null;
}

interface FeaturedMatchProps {
  data: FeaturedMatchData | null;
  isLoading: boolean;
  teamId: string;
  teamName: string;
}

export function FeaturedMatch({
  data,
  isLoading,
  teamId,
  teamName,
}: FeaturedMatchProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-card to-card/60 border border-card-border/80 p-5 sm:p-6 shadow-sm">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-14 w-14 rounded-full" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-card to-card/60 border border-card-border/80 p-6 shadow-sm">
        <p className="text-muted-foreground text-center py-6">Sem partidas recentes para exibir.</p>
      </div>
    );
  }

  const hasScore = data.teamScore !== null && data.opponentScore !== null;
  const won = hasScore && data.teamScore! > data.opponentScore!;
  const lost = hasScore && data.teamScore! < data.opponentScore!;

  const homeTeam = data.isHomeMatch ? { name: teamName, teamId } : { name: data.opponent, teamId: null as string | null };
  const awayTeam = data.isHomeMatch ? { name: data.opponent, teamId: null as string | null } : { name: teamName, teamId };

  const scoreColor = won
    ? 'text-green-600 dark:text-green-400'
    : lost
      ? 'text-red-600 dark:text-red-400'
      : 'text-foreground';

  return (
    <div className="rounded-2xl bg-gradient-to-br from-card to-card/60 border border-card-border/80 p-5 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2 mb-4">
        {data.competition && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Trophy className="h-3.5 w-3.5" />
            {data.competition}
          </span>
        )}
        <span className="text-xs text-muted-foreground">
          {format(new Date(data.matchDate), "d 'de' MMM", { locale: ptBR })}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
          <TeamBadge teamId={homeTeam.teamId} teamName={homeTeam.name} size="md" glassRing={false} />
          <span className="text-sm font-medium text-foreground truncate w-full text-center">{homeTeam.name}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          <span className={`text-3xl sm:text-4xl font-mono font-bold tabular-nums ${scoreColor}`}>
            {hasScore ? `${data.teamScore} – ${data.opponentScore}` : '–'}
          </span>
          <span className="text-xs text-muted-foreground">Placar</span>
        </div>
        <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
          <TeamBadge teamId={awayTeam.teamId} teamName={awayTeam.name} size="md" glassRing={false} />
          <span className="text-sm font-medium text-foreground truncate w-full text-center">{awayTeam.name}</span>
        </div>
      </div>
    </div>
  );
}

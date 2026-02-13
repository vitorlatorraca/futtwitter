'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trophy } from 'lucide-react';
import { getTeamCrestFromTeam } from '@/lib/teamCrests';

interface LastMatchCardData {
  id: string;
  opponent: string;
  opponentLogoUrl?: string | null;
  matchDate: string;
  scoreFor: number;
  scoreAgainst: number;
  homeAway: string;
  competition: string | null;
}

interface LastMatchCardProps {
  data: LastMatchCardData | null;
  isLoading: boolean;
  teamId: string;
  teamName: string;
}

const panelClass =
  'rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#10161D] p-4 shadow-sm';

export function LastMatchCard({
  data,
  isLoading,
  teamId,
  teamName,
}: LastMatchCardProps) {
  if (isLoading) {
    return (
      <div className={panelClass}>
        <div className="h-20 flex items-center justify-center">
          <div className="animate-pulse bg-muted/30 h-8 w-24 rounded" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={panelClass}>
        <h3 className="text-sm font-semibold text-foreground mb-2">Última partida</h3>
        <p className="text-xs text-muted-foreground py-4 text-center">Sem partidas recentes.</p>
      </div>
    );
  }

  const hasScore = data.scoreFor != null && data.scoreAgainst != null;
  const won = hasScore && data.scoreFor > data.scoreAgainst;
  const lost = hasScore && data.scoreFor < data.scoreAgainst;

  const homeTeam = data.homeAway === 'HOME'
    ? { name: teamName, teamId }
    : { name: data.opponent, teamId: null as string | null };
  const awayTeam = data.homeAway === 'HOME'
    ? { name: data.opponent, teamId: null as string | null }
    : { name: teamName, teamId };

  const scoreColor = won
    ? 'text-meu-time-success'
    : lost
      ? 'text-meu-time-danger'
      : 'text-foreground';

  const homeCrest = getTeamCrestFromTeam(homeTeam.teamId, homeTeam.name);
  const awayCrest = getTeamCrestFromTeam(awayTeam.teamId, awayTeam.name);

  return (
    <div className={panelClass}>
      <h3 className="text-sm font-semibold text-foreground mb-3">Última partida</h3>
      <div className="flex items-center gap-2 mb-2">
        {data.competition && (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <Trophy className="h-2.5 w-2.5" />
            {data.competition}
          </span>
        )}
        <span className="text-[10px] text-muted-foreground">
          {format(new Date(data.matchDate), "d 'de' MMM", { locale: ptBR })}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <img
            src={homeCrest}
            alt={homeTeam.name}
            className="h-10 w-10 shrink-0 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/crests/default.png';
            }}
          />
          <span className="text-xs font-medium text-foreground truncate">{homeTeam.name}</span>
        </div>
        <div className={`shrink-0 text-2xl font-mono font-bold tabular-nums ${scoreColor}`}>
          {hasScore ? `${data.scoreFor} – ${data.scoreAgainst}` : '–'}
        </div>
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
          <span className="text-xs font-medium text-foreground truncate">{awayTeam.name}</span>
          <img
            src={awayCrest}
            alt={awayTeam.name}
            className="h-10 w-10 shrink-0 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/crests/default.png';
            }}
          />
        </div>
      </div>
    </div>
  );
}

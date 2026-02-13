'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, MapPin, Tv, Home } from 'lucide-react';
import { getTeamCrestFromTeam } from '@/lib/teamCrests';
import { Skeleton } from '@/components/ui/skeleton';

export interface NextMatchHeroData {
  id: string;
  opponent: string;
  opponentLogoUrl: string | null;
  matchDate: string;
  stadium: string | null;
  competition: string | null;
  isHomeMatch: boolean;
  broadcastChannel: string | null;
}

interface NextMatchHeroProps {
  data: NextMatchHeroData | null;
  isLoading: boolean;
  teamId: string;
  teamName: string;
}

const panelClass =
  'rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#10161D] p-4 shadow-sm';

export function NextMatchHero({
  data,
  isLoading,
  teamId,
  teamName,
}: NextMatchHeroProps) {
  if (isLoading) {
    return (
      <div className={panelClass}>
        <Skeleton className="h-5 w-36 mb-4" />
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-14 w-14 rounded-full" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={panelClass}>
        <h2 className="text-base font-semibold text-foreground mb-2">Próximo jogo</h2>
        <p className="text-sm text-muted-foreground py-6 text-center">Nenhum jogo agendado.</p>
      </div>
    );
  }

  const homeTeam = data.isHomeMatch
    ? { name: teamName, teamId }
    : { name: data.opponent, teamId: null as string | null };
  const awayTeam = data.isHomeMatch
    ? { name: data.opponent, teamId: null as string | null }
    : { name: teamName, teamId };

  const dateFormatted = format(new Date(data.matchDate), "EEEE • HH:mm", { locale: ptBR });
  const dayCapitalized = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
  const fullDate = format(new Date(data.matchDate), "d 'de' MMMM", { locale: ptBR });

  const homeCrest = getTeamCrestFromTeam(homeTeam.teamId, homeTeam.name);
  const awayCrest = getTeamCrestFromTeam(awayTeam.teamId, awayTeam.name);

  return (
    <div className={`${panelClass} border-meu-time-accent/30 bg-gradient-to-br from-meu-time-accent/5 to-transparent`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Próximo jogo</h2>
        {data.isHomeMatch && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-meu-time-accent/20 text-meu-time-accent">
            <Home className="h-3 w-3" />
            Casa
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
          <img
            src={homeCrest}
            alt={homeTeam.name}
            className="h-12 w-12 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/crests/default.png';
            }}
          />
          <span className="text-xs font-medium text-foreground truncate w-full text-center">
            {homeTeam.name}
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          <span className="text-2xl font-mono font-bold text-foreground/80">×</span>
          <span className="text-[10px] text-muted-foreground">vs</span>
        </div>
        <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
          <img
            src={awayCrest}
            alt={awayTeam.name}
            className="h-12 w-12 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/crests/default.png';
            }}
          />
          <span className="text-xs font-medium text-foreground truncate w-full text-center">
            {awayTeam.name}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 pt-3 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CalendarDays className="h-4 w-4 text-meu-time-accent" />
          {dayCapitalized}
        </div>
        <p className="text-xs text-muted-foreground pl-6">{fullDate}</p>
        {data.stadium && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pl-6">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {data.stadium}
          </div>
        )}
        {data.broadcastChannel && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pl-6">
            <Tv className="h-3.5 w-3.5 shrink-0" />
            {data.broadcastChannel}
          </div>
        )}
        {data.competition && (
          <span className="inline-block mt-2 text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-[#141C24]">
            {data.competition}
          </span>
        )}
      </div>
    </div>
  );
}

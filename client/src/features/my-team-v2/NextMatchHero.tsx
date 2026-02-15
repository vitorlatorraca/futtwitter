'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, MapPin, ChevronRight, Home } from 'lucide-react';
import { Link } from 'wouter';
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
  'rounded-2xl border border-white/10 backdrop-blur-sm bg-[#10161D] shadow-sm transition-all duration-200 hover:border-emerald-500/40';

export function NextMatchHero({
  data,
  isLoading,
  teamId,
  teamName,
}: NextMatchHeroProps) {
  if (isLoading) {
    return (
      <div className={panelClass}>
        <div className="flex items-center gap-4 p-4 min-h-[120px]">
          <Skeleton className="h-16 w-20 shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-20 shrink-0" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={panelClass}>
        <div className="flex items-center justify-between gap-4 p-4 min-h-[120px]">
          <h2 className="text-sm font-semibold text-foreground">Próximo jogo</h2>
          <p className="text-xs text-muted-foreground">Nenhum jogo agendado.</p>
        </div>
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
    <div className={`${panelClass} border-meu-time-accent/25 bg-gradient-to-br from-meu-time-accent/8 via-transparent to-transparent`}>
      <div className="p-4">
        {/* Top: meta (competition, date) — subtle */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {data.competition && (
              <span className="text-[10px] text-muted-foreground truncate max-w-[120px]" title={data.competition}>
                {data.competition}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground/80">{fullDate}</span>
          </div>
          {data.isHomeMatch && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-meu-time-accent/15 text-meu-time-accent border border-meu-time-accent/20">
              <Home className="h-2.5 w-2.5" />
              Casa
            </span>
          )}
        </div>

        {/* Center: confrontation — teams prominent, vs central */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 min-w-0">
          <div className="flex flex-col items-center gap-1.5 min-w-0 flex-1">
            <img
              src={homeCrest}
              alt={homeTeam.name}
              className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/crests/default.png';
              }}
            />
            <span className="text-xs sm:text-sm font-semibold text-foreground truncate w-full text-center">
              {homeTeam.name}
            </span>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-500">VS</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 min-w-0 flex-1">
            <img
              src={awayCrest}
              alt={awayTeam.name}
              className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/crests/default.png';
              }}
            />
            <span className="text-xs sm:text-sm font-semibold text-foreground truncate w-full text-center">
              {awayTeam.name}
            </span>
          </div>
        </div>

        {/* Bottom: time left, stadium + link right */}
        <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            <CalendarDays className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span>{dayCapitalized}</span>
          </div>
          <div className="flex items-center gap-3 min-w-0 flex-1 justify-end">
            {data.stadium && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground/80 truncate max-w-[120px] sm:max-w-[180px]" title={data.stadium}>
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{data.stadium}</span>
              </div>
            )}
            <Link
              href="/meu-time/jogos"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500 hover:text-emerald-400 transition-all duration-200 hover:scale-105 shrink-0"
            >
              Detalhes
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

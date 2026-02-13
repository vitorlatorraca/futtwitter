'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, Tv, ChevronRight, MapPin, Home } from 'lucide-react';
import { TeamBadge } from './TeamBadge';
import { getTeamCrestFromTeam } from '@/lib/teamCrests';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export interface NextMatchData {
  id: string;
  opponent: string;
  opponentLogoUrl: string | null;
  matchDate: string;
  stadium: string | null;
  competition: string | null;
  isHomeMatch: boolean;
  broadcastChannel: string | null;
}

interface NextMatchCardProps {
  data: NextMatchData | null;
  isLoading: boolean;
  teamId: string;
  teamName: string;
  onVerDetalhes?: () => void;
}

export function NextMatchCard({
  data,
  isLoading,
  teamId,
  teamName,
  onVerDetalhes,
}: NextMatchCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card/80 border border-card-border/80 p-8 sm:p-10 shadow-md">
        <Skeleton className="h-6 w-48 mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <div className="mt-8 space-y-3">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-card to-card/60 border border-card-border/80 p-8 sm:p-10 shadow-md">
        <h2 className="font-display font-bold text-xl text-foreground mb-4">Próximo desafio</h2>
        <p className="text-muted-foreground text-center py-12">Nenhum jogo agendado.</p>
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

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card/80 border border-card-border/80 p-8 sm:p-10 shadow-md transition-all hover:shadow-lg hover:border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-xl text-foreground tracking-tight">
          Próximo desafio
        </h2>
        {data.isHomeMatch && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/30">
            <Home className="h-3.5 w-3.5" />
            Em casa
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14 mb-8">
        <div className="flex flex-col items-center gap-4 min-w-0 flex-1">
          <TeamBadge
            teamId={homeTeam.teamId}
            teamName={homeTeam.name}
            size="lg"
            glassRing={false}
            className="w-28 h-28 sm:w-32 sm:h-32"
          />
          <span className="text-lg sm:text-xl font-semibold text-foreground truncate w-full text-center">
            {homeTeam.name}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-4xl sm:text-5xl font-mono font-bold text-foreground/90">x</span>
          <span className="text-xs text-muted-foreground">vs</span>
        </div>

        <div className="flex flex-col items-center gap-4 min-w-0 flex-1">
          <TeamBadge
            teamId={awayTeam.teamId}
            teamName={awayTeam.name}
            size="lg"
            glassRing={false}
            className="w-28 h-28 sm:w-32 sm:h-32"
          />
          <span className="text-lg sm:text-xl font-semibold text-foreground truncate w-full text-center">
            {awayTeam.name}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-6 border-t border-card-border/60">
        <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <CalendarDays className="h-5 w-5 text-primary" />
          {dayCapitalized}
        </div>
        <p className="text-sm text-muted-foreground pl-7">{fullDate}</p>
        {data.stadium && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pl-7">
            <MapPin className="h-4 w-4 shrink-0" />
            {data.stadium}
          </div>
        )}
        {data.broadcastChannel && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pl-7">
            <Tv className="h-4 w-4 shrink-0" />
            Transmissão: {data.broadcastChannel}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto gap-2 transition-colors"
          onClick={onVerDetalhes}
        >
          Ver detalhes
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

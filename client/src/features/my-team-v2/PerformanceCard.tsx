'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trophy, TrendingDown } from 'lucide-react';
import type { RecentFormMatch } from './RecentFormMini';

export type FormResult = 'W' | 'D' | 'L';

interface StandingsTeam {
  id: string;
  name: string;
  points: number;
  currentPosition?: number | null;
}

interface PerformanceCardProps {
  teams: StandingsTeam[];
  currentTeamId: string;
  formMatches: RecentFormMatch[];
  isLoading?: boolean;
  formLimit?: number;
}

const Z4_START = 17;

function getResult(m: RecentFormMatch): FormResult {
  if (m.teamScore == null || m.opponentScore == null) return 'D';
  if (m.teamScore > m.opponentScore) return 'W';
  if (m.teamScore < m.opponentScore) return 'L';
  return 'D';
}

function resultStyle(result: FormResult): string {
  if (result === 'W') return 'bg-meu-time-success/25 text-meu-time-success';
  if (result === 'D') return 'bg-muted/50 text-muted-foreground';
  return 'bg-meu-time-danger/25 text-meu-time-danger';
}

function resultLabel(result: FormResult): string {
  if (result === 'W') return 'Vitória';
  if (result === 'D') return 'Empate';
  return 'Derrota';
}

const panelClass =
  'rounded-2xl border border-white/10 backdrop-blur-sm bg-[#10161D] p-4 shadow-sm transition-all duration-200 hover:border-emerald-500/40';

export function PerformanceCard({
  teams,
  currentTeamId,
  formMatches,
  isLoading,
  formLimit = 5,
}: PerformanceCardProps) {
  const recent = formMatches.slice(0, formLimit);
  const placeholderCount = Math.max(0, formLimit - recent.length);

  if (isLoading) {
    return (
      <div className={panelClass}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Performance atual</h3>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <div className="h-px bg-white/5" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-7 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sorted = [...(teams ?? [])].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
  const withPosition = sorted.map((t, i) => ({ ...t, position: i + 1 }));
  const current = withPosition.find((t) => t.id === currentTeamId);
  const leader = withPosition[0];
  const z4First = withPosition[Z4_START - 1];

  const pointsLeader = leader?.points ?? 0;
  const pointsUs = current?.points ?? 0;
  const position = current?.position ?? 0;
  const diffLeader = leader && pointsLeader > pointsUs ? pointsLeader - pointsUs : null;
  const diffZ4 = z4First ? (current?.points ?? 0) - (z4First.points ?? 0) : null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className={panelClass}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Performance atual</h3>

        {/* Situação no campeonato */}
        <div className="flex flex-wrap items-center gap-2.5 text-sm">
          {current ? (
            <>
              <span className="font-bold text-foreground tabular-nums">{position}º</span>
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{pointsUs} pts</span>
              </span>
              {diffLeader != null && diffLeader > 0 && (
                <span className="flex items-center gap-1 text-meu-time-warning text-xs">
                  <Trophy className="h-3 w-3" />
                  {diffLeader} pts do líder
                </span>
              )}
              {diffZ4 != null && diffZ4 >= 0 && position >= Z4_START && (
                <span className="flex items-center gap-1 text-meu-time-danger text-xs">
                  <TrendingDown className="h-3 w-3" />
                  Z4
                </span>
              )}
              {diffZ4 != null && diffZ4 > 0 && position < Z4_START && (
                <span className="text-muted-foreground text-xs">+{diffZ4} pts acima do Z4</span>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground">Classificação indisponível</span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 my-3" />

        {/* Forma recente */}
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Forma recente
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {recent.map((m) => {
              const result = getResult(m);
              const score =
                m.teamScore != null && m.opponentScore != null
                  ? `${m.teamScore}–${m.opponentScore}`
                  : '–';
              const date = format(new Date(m.matchDate), 'dd/MM', { locale: ptBR });
              const venue = m.isHomeMatch ? 'Casa' : 'Fora';
              return (
                <Tooltip key={m.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 transition-all duration-200 hover:scale-105 ${resultStyle(result)}`}
                      aria-label={`${resultLabel(result)} • ${m.opponent} ${score} • ${date}`}
                    >
                      {result}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[240px]">
                    <p className="font-medium">{m.opponent}</p>
                    <p className="text-sm text-muted-foreground">
                      Placar: {score} • {date} • {venue}
                    </p>
                    {m.competition && (
                      <p className="text-xs text-muted-foreground mt-0.5">{m.competition}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
            {Array.from({ length: placeholderCount }).map((_, i) => (
              <div
                key={`ph-${i}`}
                className="w-7 h-7 rounded-md border border-dashed border-[rgba(255,255,255,0.06)] flex items-center justify-center text-muted-foreground text-[10px] shrink-0"
                aria-hidden
              >
                —
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

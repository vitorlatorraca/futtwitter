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
import { getRecentForm } from './utils/recentForm';
import type { RecentFormMatch } from './RecentFormMini';
import type { MyTeamOverview } from '@/hooks/useMyTeamOverview';

export type FormResult = 'W' | 'D' | 'L';

interface StandingsTeam {
  id: string;
  name: string;
  points: number;
  currentPosition?: number | null;
}

interface PerformanceCardProps {
  /** Legado: tabela para posição/pontos e diffLeader/diffZ4 */
  teams?: StandingsTeam[];
  currentTeamId: string;
  /** Legado: jogos para forma e tooltips */
  formMatches?: RecentFormMatch[];
  /** Nova fonte única: overview (Jogos + Performance) */
  overview?: MyTeamOverview | null;
  isLoading?: boolean;
  formLimit?: number;
}

const Z4_START = 17;

function resultStyle(result: FormResult): string {
  if (result === 'W') return 'bg-success/20 text-success';
  if (result === 'D') return 'bg-muted/50 text-foreground-secondary';
  return 'bg-danger/20 text-danger';
}

function resultLabel(result: FormResult): string {
  if (result === 'W') return 'Vitória';
  if (result === 'D') return 'Empate';
  return 'Derrota';
}

const panelClass =
  'rounded-xl border border-border bg-surface-card p-4 shadow-card transition-colors hover:border-border-strong';

function overviewToFormMatches(
  lastMatches: MyTeamOverview['lastMatches'],
  teamId: string
): RecentFormMatch[] {
  return lastMatches.map((m) => {
    const isHome = m.home.id === teamId;
    return {
      id: m.id,
      opponent: isHome ? m.away.name : m.home.name,
      teamScore: isHome ? m.score.home : m.score.away,
      opponentScore: isHome ? m.score.away : m.score.home,
      matchDate: m.date,
      isHomeMatch: isHome,
      competition: m.competition ?? null,
    };
  });
}

export function PerformanceCard({
  teams = [],
  currentTeamId,
  formMatches = [],
  overview,
  isLoading,
  formLimit = 5,
}: PerformanceCardProps) {
  const useOverview = overview && overview.team?.id === currentTeamId;
  const recent = useOverview
    ? overviewToFormMatches(overview.lastMatches, currentTeamId).slice(0, formLimit)
    : formMatches.slice(0, formLimit);
  const form = useOverview
    ? overview.form.slice(0, formLimit)
    : getRecentForm(formMatches, currentTeamId, formLimit);
  const placeholderCount = Math.max(0, formLimit - recent.length);

  if (isLoading) {
    return (
      <div className={panelClass}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Performance atual</h3>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <div className="h-px bg-border" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-7 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  let position: number;
  let pointsUs: number;
  let diffLeader: number | null;
  let diffZ4: number | null;

  if (useOverview && overview.standings) {
    position = overview.standings.position;
    pointsUs = overview.standings.points;
    diffLeader =
      overview.standings.leaderPoints != null && overview.standings.leaderPoints > pointsUs
        ? overview.standings.leaderPoints - pointsUs
        : null;
    diffZ4 =
      overview.standings.z4Points != null
        ? pointsUs - overview.standings.z4Points
        : null;
  } else {
    const sorted = [...teams].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
    const withPosition = sorted.map((t, i) => ({ ...t, position: i + 1 }));
    const current = withPosition.find((t) => t.id === currentTeamId);
    const leader = withPosition[0];
    const z4First = withPosition[Z4_START - 1];
    pointsUs = current?.points ?? 0;
    position = current?.position ?? 0;
    diffLeader = leader && (leader.points ?? 0) > pointsUs ? (leader.points ?? 0) - pointsUs : null;
    diffZ4 = z4First ? pointsUs - (z4First.points ?? 0) : null;
  }

  const hasStandings = useOverview ? !!overview.standings : teams.length > 0;

  return (
    <TooltipProvider delayDuration={200}>
      <div className={panelClass}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Performance atual</h3>

        {/* Situação no campeonato */}
        <div className="flex flex-wrap items-center gap-2.5 text-sm">
          {hasStandings ? (
            <>
              <span className="font-bold text-foreground tabular-nums">{position}º</span>
              <span className="text-foreground-secondary">
                <span className="font-medium text-foreground">{pointsUs} pts</span>
              </span>
              {diffLeader != null && diffLeader > 0 && (
                <span className="flex items-center gap-1 text-foreground-secondary text-xs">
                  <Trophy className="h-3 w-3 text-primary" />
                  {diffLeader} pts do líder
                </span>
              )}
              {diffZ4 != null && diffZ4 >= 0 && position >= Z4_START && (
                <span className="flex items-center gap-1 text-danger text-xs font-semibold">
                  <TrendingDown className="h-3 w-3" />
                  Z4
                </span>
              )}
              {diffZ4 != null && diffZ4 > 0 && position < Z4_START && (
                <span className="text-foreground-secondary text-xs">+{diffZ4} pts acima do Z4</span>
              )}
            </>
          ) : (
            <span className="text-xs text-foreground-secondary">Classificação indisponível</span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-3" />

        {/* Forma recente */}
        <div>
          <p className="text-[10px] font-medium text-foreground-secondary tracking-wider mb-2">
            Forma recente
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {recent.map((m, idx) => {
              const result = form[idx] ?? 'D';
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
                    <p className="text-sm text-foreground-secondary">
                      Placar: {score} • {date} • {venue}
                    </p>
                    {m.competition && (
                      <p className="text-xs text-foreground-secondary mt-0.5">{m.competition}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
            {Array.from({ length: placeholderCount }).map((_, i) => (
              <div
                key={`ph-${i}`}
                className="w-7 h-7 rounded-md border border-dashed border-border flex items-center justify-center text-foreground-secondary text-[10px] shrink-0"
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

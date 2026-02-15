'use client';

import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLastMatchRatings, type LastMatchRating, type PositionGroup } from './useLastMatchRatings';
import { cn } from '@/lib/utils';
import { LayoutGrid, BarChart3 } from 'lucide-react';

const panelClass =
  'rounded-2xl border border-white/10 backdrop-blur-sm bg-[#10161D] p-4 shadow-sm transition-all duration-200 hover:border-emerald-500/40';

const GROUP_LABELS: Record<PositionGroup, string> = {
  GK: 'Goleiro',
  DEF: 'Defesa',
  MID: 'Meio-campo',
  ATT: 'Ataque',
  UNK: 'Outros',
};

function getRatingPillClass(rating: number): string {
  if (rating >= 8.0) return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
  if (rating >= 7.0) return 'bg-muted/80 text-muted-foreground';
  return 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
}

const POSITION_ORDER: PositionGroup[] = ['GK', 'DEF', 'MID', 'ATT', 'UNK'];

function groupPlayersByPosition(ratings: LastMatchRating[]): Map<PositionGroup, LastMatchRating[]> {
  const map = new Map<PositionGroup, LastMatchRating[]>();
  for (const g of POSITION_ORDER) map.set(g, []);
  for (const p of ratings) {
    const list = map.get(p.group) ?? [];
    list.push(p);
    map.set(p.group, list);
  }
  return map;
}

function sortGroupByRating(players: LastMatchRating[]): LastMatchRating[] {
  return [...players].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}

type SortMode = 'position' | 'rating';

export function LastMatchRatingsCard({ teamId }: { teamId: string | null }) {
  const [sortMode, setSortMode] = useState<SortMode>('position');
  const { data, isLoading, isError } = useLastMatchRatings(teamId);

  // Hooks e derivados SEMPRE no topo, antes de qualquer return condicional
  const safeRatings = data?.playerRatings ?? [];
  const grouped = groupPlayersByPosition(safeRatings);
  const sections = (['GK', 'DEF', 'MID', 'ATT', 'UNK'] as PositionGroup[]).filter(
    (g) => (grouped.get(g)?.length ?? 0) > 0
  ) as PositionGroup[];

  const displayData = useMemo(() => {
    if (sortMode === 'rating') {
      const flat = sortGroupByRating(safeRatings);
      return [{ group: 'UNK' as PositionGroup, players: flat }];
    }
    return sections.map((group) => ({
      group,
      players: sortGroupByRating(grouped.get(group) ?? []),
    }));
  }, [sortMode, sections, grouped, safeRatings]);

  const match = data?.match;
  const subtitle =
    match && match.homeScore != null && match.awayScore != null
      ? `${match.homeTeamName} ${match.homeScore}–${match.awayScore} ${match.awayTeamName} · ${match.competitionName}`
      : match
        ? `${match.homeTeamName} x ${match.awayTeamName} · ${match.competitionName}`
        : '';

  // Early returns só DEPOIS de todos os hooks
  if (isLoading) {
    return (
      <div className={panelClass}>
        <h3 className="text-sm font-semibold text-foreground mb-2">Última partida — notas</h3>
        <div className="space-y-2 mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <Skeleton className="h-4 flex-1 max-w-[120px]" />
              <Skeleton className="h-5 w-10 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={panelClass}>
        <h3 className="text-sm font-semibold text-foreground mb-2">Última partida — notas</h3>
        <p className="text-xs text-muted-foreground">Sem notas disponíveis para a última partida.</p>
      </div>
    );
  }

  if (safeRatings.length === 0) {
    return (
      <div className={panelClass}>
        <h3 className="text-sm font-semibold text-foreground mb-1">Última partida — notas</h3>
        <p className="text-[10px] text-muted-foreground mb-3">{subtitle}</p>
        <p className="text-xs text-muted-foreground">Sem notas disponíveis para a última partida.</p>
      </div>
    );
  }

  const scoreDisplay =
    match.homeScore != null && match.awayScore != null
      ? `${match.homeScore}–${match.awayScore}`
      : null;

  return (
    <div className={panelClass}>
      {/* Header: placar destacado + competição badge */}
      <div className="mb-3">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h3 className="text-sm font-semibold text-foreground">Última partida</h3>
          {scoreDisplay && (
            <span className="text-lg font-bold font-mono text-foreground tabular-nums">
              {scoreDisplay}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">
            {match.homeTeamName} × {match.awayTeamName}
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/5 text-muted-foreground border border-white/5">
            {match.competitionName}
          </span>
        </div>
      </div>

      {/* Sort toggle */}
      <div className="flex gap-1 mb-2 p-0.5 rounded-lg bg-white/[0.02] w-fit">
        <button
          type="button"
          onClick={() => setSortMode('position')}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all duration-200',
            sortMode === 'position'
              ? 'bg-white/10 text-foreground'
              : 'text-muted-foreground hover:text-foreground/80'
          )}
        >
          <LayoutGrid className="h-3 w-3" />
          Por posição
        </button>
        <button
          type="button"
          onClick={() => setSortMode('rating')}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all duration-200',
            sortMode === 'rating'
              ? 'bg-white/10 text-foreground'
              : 'text-muted-foreground hover:text-foreground/80'
          )}
        >
          <BarChart3 className="h-3 w-3" />
          Por nota
        </button>
      </div>

      <div className="space-y-2.5 max-h-[280px] overflow-y-auto overflow-x-hidden pr-1 [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/8">
        {displayData.map(({ group, players }) => (
          <div key={group}>
            {sortMode === 'position' && (
              <p className="text-[9px] font-medium text-muted-foreground/90 uppercase tracking-widest mb-1">
                {GROUP_LABELS[group]}
              </p>
            )}
            <div className="space-y-0.5">
              {players.map((p) => (
                <div
                  key={p.playerId}
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-[#141C24]/60 transition-all duration-200"
                >
                    <span className="w-5 h-5 rounded bg-muted/80 flex items-center justify-center text-[10px] font-bold text-muted-foreground tabular-nums shrink-0">
                      {p.shirtNumber ?? '—'}
                    </span>
                    <div className="shrink-0">
                      {p.photoUrl ? (
                        <img
                          src={p.photoUrl}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover border border-white/5"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                          {p.playerName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium text-foreground truncate flex-1 min-w-0">
                      {p.playerName}
                    </span>
                    <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                      {p.minutes}'
                    </span>
                    <span
                      className={cn(
                        'text-xs font-semibold px-1.5 py-0.5 rounded tabular-nums shrink-0',
                        getRatingPillClass(p.rating)
                      )}
                    >
                      {p.rating.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

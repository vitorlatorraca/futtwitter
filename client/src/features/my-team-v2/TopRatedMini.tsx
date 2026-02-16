'use client';

import { useMemo } from 'react';
import { toPtBrAbbrev } from '@/lib/positionAbbrev';

interface TopRatedPlayer {
  playerId: string;
  name: string;
  position?: string | null;
  photoUrl?: string | null;
  averageRating: number;
  matchesPlayed?: number;
}

interface TopRatedMiniProps {
  players: TopRatedPlayer[];
  maxItems?: number;
  /** Últimos N jogos usados para a média (ex: 5) */
  lastNMatches?: number;
  getPhotoUrl?: (playerId: string) => string;
  /** Quando true, renderiza só o conteúdo sem panel — para uso dentro de MyTeamCard */
  embed?: boolean;
}

const panelClass =
  'rounded-2xl border border-white/10 backdrop-blur-sm bg-[#10161D] p-4 shadow-sm transition-all duration-200 hover:border-emerald-500/40';

export function TopRatedMini({ players, maxItems = 5, lastNMatches = 5, getPhotoUrl, embed }: TopRatedMiniProps) {
  const top = useMemo(() => {
    return [...players]
      .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
      .slice(0, maxItems);
  }, [players, maxItems]);

  const title = `Top avaliados (últimos ${lastNMatches} jogos)`;

  const listContent = (
    <div className="space-y-1">
      {top.map((p, i) => (
        <div
          key={p.playerId}
          className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-[#141C24]/70 transition-all duration-200 group"
        >
          <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-[10px] font-bold tabular-nums shrink-0">
            {i + 1}
          </span>
          <div className="shrink-0">
            {p.photoUrl || getPhotoUrl?.(p.playerId) ? (
              <img
                src={p.photoUrl ?? getPhotoUrl?.(p.playerId) ?? '/assets/players/placeholder.png'}
                alt=""
                className="h-8 w-8 rounded-full object-cover border border-white/5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/players/placeholder.png';
                }}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted/80 flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                {p.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
            {p.position && (
              <p className="text-[10px] text-muted-foreground">
                {toPtBrAbbrev(p.position)}
              </p>
            )}
          </div>
          <span className="text-xs font-medium text-sky-400 tabular-nums shrink-0">
            {p.averageRating.toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );

  if (embed) {
    return (
      <div className="px-4 sm:px-5 py-3 flex-1 min-h-0 overflow-auto flex flex-col">
        {top.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4 m-auto">
            Média das notas nos últimos jogos. Dados disponíveis quando houver partidas com estatísticas.
          </p>
        ) : (
          listContent
        )}
      </div>
    );
  }

  if (top.length === 0) return null;

  return (
    <div className={panelClass}>
      <h3 className="text-sm font-semibold text-white tracking-tight mb-3">{title}</h3>
      {listContent}
    </div>
  );
}

'use client';

interface TopRatedPlayer {
  playerId: string;
  name: string;
  position?: string | null;
  averageRating: number;
  voteCount: number;
}

interface TopRatedMiniProps {
  players: TopRatedPlayer[];
  /** Only render if we have data */
  maxItems?: number;
}

const panelClass =
  'rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#10161D] p-4 shadow-sm';

export function TopRatedMini({ players, maxItems = 3 }: TopRatedMiniProps) {
  const top = players.slice(0, maxItems);
  if (top.length === 0) return null;

  return (
    <div className={panelClass}>
      <h3 className="text-sm font-semibold text-foreground mb-3">Top avaliados</h3>
      <div className="space-y-2">
        {top.map((p, i) => (
          <div
            key={p.playerId}
            className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-[#141C24]/60 transition-colors"
          >
            <span className="text-xs font-bold text-muted-foreground w-5 tabular-nums">
              {i + 1}º
            </span>
            <span className="text-xs font-medium text-foreground truncate flex-1 min-w-0">
              {p.name}
            </span>
            <span className="text-xs font-semibold text-meu-time-accent tabular-nums">
              {p.averageRating.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

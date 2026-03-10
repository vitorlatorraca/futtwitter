'use client';

import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLastMatchRatings, type LastMatchRating, type PositionGroup } from './useLastMatchRatings';
import { cn } from '@/lib/utils';
import { formatRating } from '@/lib/ratingUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ─── Position helpers ────────────────────────────────────────────────────────

const GROUP_LABELS: Record<PositionGroup, string> = {
  GK: 'Goleiro',
  DEF: 'Defesa',
  MID: 'Meio-campo',
  ATT: 'Ataque',
  UNK: 'Outros',
};

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

// ─── Rating color ─────────────────────────────────────────────────────────────

function ratingColor(r: number): string {
  if (r >= 7.5) return 'text-primary font-bold';
  if (r >= 6.5) return 'text-foreground font-semibold';
  return 'text-foreground-secondary';
}

// ─── Formation pitch positions ────────────────────────────────────────────────

const FORMATION_POSITIONS: Record<string, { x: number; y: number }[]> = {
  '4-3-3': [
    { x: 50, y: 92 },
    { x: 18, y: 72 }, { x: 38, y: 75 }, { x: 62, y: 75 }, { x: 82, y: 72 },
    { x: 28, y: 50 }, { x: 50, y: 52 }, { x: 72, y: 50 },
    { x: 22, y: 24 }, { x: 50, y: 18 }, { x: 78, y: 24 },
  ],
  '4-4-2': [
    { x: 50, y: 92 },
    { x: 18, y: 72 }, { x: 38, y: 75 }, { x: 62, y: 75 }, { x: 82, y: 72 },
    { x: 18, y: 50 }, { x: 38, y: 52 }, { x: 62, y: 52 }, { x: 82, y: 50 },
    { x: 35, y: 24 }, { x: 65, y: 24 },
  ],
  '3-5-2': [
    { x: 50, y: 92 },
    { x: 25, y: 75 }, { x: 50, y: 76 }, { x: 75, y: 75 },
    { x: 12, y: 52 }, { x: 33, y: 53 }, { x: 50, y: 54 }, { x: 67, y: 53 }, { x: 88, y: 52 },
    { x: 38, y: 24 }, { x: 62, y: 24 },
  ],
  '4-2-3-1': [
    { x: 50, y: 92 },
    { x: 18, y: 72 }, { x: 38, y: 75 }, { x: 62, y: 75 }, { x: 82, y: 72 },
    { x: 34, y: 58 }, { x: 66, y: 58 },
    { x: 22, y: 38 }, { x: 50, y: 36 }, { x: 78, y: 38 },
    { x: 50, y: 18 },
  ],
};

const FALLBACK_POSITIONS = [
  { x: 50, y: 92 },
  { x: 18, y: 72 }, { x: 38, y: 75 }, { x: 62, y: 75 }, { x: 82, y: 72 },
  { x: 28, y: 50 }, { x: 50, y: 52 }, { x: 72, y: 50 },
  { x: 22, y: 24 }, { x: 50, y: 18 }, { x: 78, y: 24 },
];

// ─── Inline Pitch ─────────────────────────────────────────────────────────────

interface PitchProps {
  formation: string;
  players: LastMatchRating[];
}

function Pitch({ formation, players }: PitchProps) {
  const positions = FORMATION_POSITIONS[formation] ?? FALLBACK_POSITIONS;

  const sorted = useMemo(() => {
    const order: Record<PositionGroup, number> = { GK: 0, DEF: 1, MID: 2, ATT: 3, UNK: 4 };
    return [...players].sort((a, b) => {
      const diff = order[a.group] - order[b.group];
      return diff !== 0 ? diff : b.rating - a.rating;
    });
  }, [players]);

  return (
    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-border-subtle/50">
      {/* Pitch background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, hsl(140 35% 16% / 0.40) 0%, hsl(140 35% 10% / 0.55) 100%)',
        }}
      />

      {/* Pitch markings */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 133"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="66.5" x2="100" y2="66.5" stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" />
        <circle cx="50" cy="66.5" r="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
        <circle cx="50" cy="66.5" r="1" fill="rgba(255,255,255,0.22)" />
        <rect x="28" y="0" width="44" height="14" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />
        <rect x="16" y="0" width="68" height="26" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />
        <rect x="28" y="119" width="44" height="14" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />
        <rect x="16" y="107" width="68" height="26" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />
      </svg>

      {/* Formation badge */}
      <div className="absolute top-1.5 left-2 z-10">
        <span className="text-[8px] font-bold font-display tracking-widest uppercase text-primary bg-background/50 backdrop-blur-sm px-1.5 py-0.5 rounded border border-primary/20">
          {formation}
        </span>
      </div>

      {/* Players */}
      {positions.slice(0, Math.min(sorted.length, 11)).map((pos, i) => {
        const player = sorted[i];
        if (!player) return null;
        const lastName = player.playerName.split(' ').pop() ?? player.playerName;
        return (
          <div
            key={player.playerId}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className="flex flex-col items-center gap-[2px]">
              <div
                className="flex items-center justify-center rounded-full border-2 shadow-lg"
                style={{
                  width: '26px',
                  height: '26px',
                  background: 'hsl(38 92% 50%)',
                  borderColor: 'hsl(38 92% 72%)',
                  boxShadow: '0 2px 8px hsl(38 92% 50% / 0.35)',
                }}
              >
                <span className="text-[9px] font-bold text-background leading-none tabular-nums">
                  {player.shirtNumber ?? '?'}
                </span>
              </div>
              <span
                style={{
                  fontSize: '7px',
                  color: 'rgba(255,255,255,0.90)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                  maxWidth: '34px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1,
                  fontWeight: 600,
                }}
              >
                {lastName}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────────

export function LastMatchRatingsCard({ teamId }: { teamId: string | null }) {
  const { data, isLoading, isError } = useLastMatchRatings(teamId);

  const safeRatings = data?.playerRatings ?? [];
  const grouped = groupPlayersByPosition(safeRatings);
  const sections = POSITION_ORDER.filter((g) => (grouped.get(g)?.length ?? 0) > 0);
  const match = data?.match;
  const formation = data?.formation ?? '4-3-3';

  const dateLabel = match?.kickoffAt
    ? format(new Date(match.kickoffAt), "d 'de' MMM", { locale: ptBR })
    : '';

  const hasScore = match?.homeScore != null && match?.awayScore != null;

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-card p-5">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-7 w-16" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-5">
          <Skeleton className="aspect-[3/4] w-full rounded-xl" />
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── No data ──
  if (isError || !data || !match) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-card p-5">
        <h3 className="font-display font-bold uppercase tracking-tight text-base text-foreground mb-2">
          Última Partida
        </h3>
        <p className="text-sm text-foreground-secondary">
          Sem dados disponíveis para a última partida.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-card p-5 hover:border-primary/20 transition-colors">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-widest mb-1">
            Última Partida · Notas dos jogadores
          </p>
          <h3 className="font-display font-bold uppercase tracking-tight text-lg md:text-xl text-foreground leading-tight">
            {match.homeTeamName}{' '}
            <span className="text-foreground-secondary font-normal">×</span>{' '}
            {match.awayTeamName}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20">
              {match.competitionName}
            </span>
            <span className="text-[10px] text-foreground-muted">{dateLabel}</span>
          </div>
        </div>

        {/* Score */}
        {hasScore && (
          <div
            className="text-3xl sm:text-4xl font-bold font-display tabular-nums tracking-tight shrink-0"
            style={{
              background: 'linear-gradient(90deg, hsl(38,92%,50%) 0%, hsl(0,80%,55%) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {match.homeScore}–{match.awayScore}
          </div>
        )}
      </div>

      {/* ── Body: Pitch + Ratings list ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] xl:grid-cols-[210px_1fr] gap-5 items-start">
        {/* Pitch formation */}
        <Pitch formation={formation} players={safeRatings} />

        {/* Ratings list grouped by position */}
        <div className="space-y-3">
          {sections.length === 0 ? (
            <p className="text-sm text-foreground-secondary py-4">Sem notas disponíveis.</p>
          ) : (
            sections.map((group) => {
              const groupPlayers = [...(grouped.get(group) ?? [])].sort(
                (a, b) => b.rating - a.rating
              );
              return (
                <div key={group}>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-foreground-muted mb-1 pl-1">
                    {GROUP_LABELS[group]}
                  </p>
                  <div className="space-y-0.5">
                    {groupPlayers.map((p) => (
                      <div
                        key={p.playerId}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-elevated/50 transition-colors"
                      >
                        {/* Shirt number */}
                        <span className="w-5 h-5 rounded bg-border-subtle/60 flex items-center justify-center text-[9px] font-bold text-foreground-secondary tabular-nums shrink-0">
                          {p.shirtNumber ?? '—'}
                        </span>

                        {/* Photo or initials */}
                        <div className="shrink-0">
                          {p.photoUrl ? (
                            <img
                              src={p.photoUrl}
                              alt=""
                              className="h-7 w-7 rounded-full object-cover border border-border-subtle"
                            />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center text-[9px] font-bold text-foreground-secondary">
                              {p.playerName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Name */}
                        <span className="text-xs font-medium text-foreground truncate flex-1 min-w-0">
                          {p.playerName}
                        </span>

                        {/* Minutes */}
                        <span className="text-[10px] text-foreground-muted tabular-nums shrink-0">
                          {p.minutes}'
                        </span>

                        {/* Rating */}
                        <span
                          className={cn(
                            'text-sm tabular-nums shrink-0 w-8 text-right',
                            ratingColor(p.rating)
                          )}
                        >
                          {formatRating(p.rating)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

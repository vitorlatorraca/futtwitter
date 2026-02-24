'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { sortLineupPlayers, type LineupPlayer } from '@/lib/lineupOrder';
import { positionToPtBr } from '@shared/positions';
import { formatRating, isValidRating } from '@/lib/ratingUtils';
import { PositionBadge } from '@/components/ui/position-badge';

const formationPositions: Record<string, { x: number; y: number }[]> = {
  '4-3-3': [
    { x: 50, y: 95 },
    { x: 20, y: 75 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 75 },
    { x: 30, y: 50 }, { x: 50, y: 50 }, { x: 70, y: 50 },
    { x: 25, y: 25 }, { x: 50, y: 20 }, { x: 75, y: 25 },
  ],
  '4-4-2': [
    { x: 50, y: 95 },
    { x: 20, y: 75 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 75 },
    { x: 20, y: 50 }, { x: 40, y: 50 }, { x: 60, y: 50 }, { x: 80, y: 50 },
    { x: 35, y: 25 }, { x: 65, y: 25 },
  ],
  '3-5-2': [
    { x: 50, y: 95 },
    { x: 25, y: 75 }, { x: 50, y: 75 }, { x: 75, y: 75 },
    { x: 15, y: 55 }, { x: 35, y: 55 }, { x: 50, y: 55 }, { x: 65, y: 55 }, { x: 85, y: 55 },
    { x: 40, y: 25 }, { x: 60, y: 25 },
  ],
  '4-2-3-1': [
    { x: 50, y: 95 },
    { x: 20, y: 75 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 75 },
    { x: 35, y: 60 }, { x: 65, y: 60 },
    { x: 25, y: 40 }, { x: 50, y: 40 }, { x: 75, y: 40 },
    { x: 50, y: 20 },
  ],
};

/** Fallback: 4 DEF, 4 MEI, 2 ATA + GK when formation is unknown */
const FALLBACK_POSITIONS = [
  { x: 50, y: 95 },
  ...([20, 40, 60, 80].map((x) => ({ x, y: 75 }))),
  ...([20, 40, 60, 80].map((x) => ({ x, y: 50 }))),
  ...([35, 65].map((x) => ({ x, y: 25 }))),
];

export interface TacticalBoardPlayer {
  playerId: string;
  name: string;
  shirtNumber: number | null;
  position?: string | null;
}

export type TacticalBoardRating = { playerId: string; avgRating: number; voteCount: number };

interface TacticalBoardProps {
  formation: string;
  starters: TacticalBoardPlayer[];
  ratings?: TacticalBoardRating[];
  isLoading?: boolean;
}

export function TacticalBoard({
  formation,
  starters,
  ratings = [],
  isLoading,
}: TacticalBoardProps) {
  const ratingByPlayerId = useMemo(() => {
    const map: Record<string, { avgRating: number; voteCount: number }> = {};
    for (const r of ratings) {
      map[r.playerId] = { avgRating: r.avgRating, voteCount: r.voteCount };
    }
    return map;
  }, [ratings]);

  const sortedStarters = useMemo(
    () => sortLineupPlayers(starters as LineupPlayer[]),
    [starters],
  );

  const displayLines = useMemo(() => {
    return sortedStarters.map((p) => {
      const info = ratingByPlayerId[p.playerId];
      const displayRating = info && info.voteCount > 0 && isValidRating(info.avgRating) ? formatRating(info.avgRating) : '—';
      const positionAbbrev = positionToPtBr(p.position);
      return { playerId: p.playerId, name: p.name, shirtNumber: p.shirtNumber, displayRating, positionAbbrev };
    });
  }, [sortedStarters, ratingByPlayerId]);

  const positions =
    formationPositions[formation] ?? (starters.length <= 11 ? FALLBACK_POSITIONS : formationPositions['4-2-3-1']);

  if (isLoading) {
    return (
      <Card className="bg-card/80 border-card-border">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (starters.length === 0) {
    return (
      <Card className="bg-card/80 border-card-border">
        <CardHeader>
          <Badge variant="outline" className="text-base font-bold w-fit">
            {formation || '—'}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="aspect-[3/4] rounded-lg bg-muted/30 flex items-center justify-center text-muted-foreground text-sm px-4 text-center">
            Escalação indisponível para a última rodada.
          </div>
        </CardContent>
      </Card>
    );
  }

  const isIncomplete = sortedStarters.length > 0 && sortedStarters.length < 11;

  return (
    <Card className="bg-card/80 border-card-border">
      <CardHeader>
        <Badge variant="outline" className="text-lg font-bold px-4 py-2 w-fit">
          {formation}
        </Badge>
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Em campo</p>
          {displayLines.length > 0 ? (
            <ul className="text-sm text-foreground leading-relaxed list-none p-0 m-0 space-y-0.5">
              {displayLines.map((line) => (
                <li key={line.playerId} className="flex justify-between items-baseline gap-2">
                  <span>
                    <span className="text-muted-foreground font-semibold text-xs mr-1.5">{line.positionAbbrev}</span>
                    {line.name}
                  </span>
                  <span className="tabular-nums font-medium shrink-0">— {line.displayRating}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {isIncomplete && (
            <p className="text-xs text-muted-foreground mt-1">Escalação incompleta —</p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-[195px] sm:max-w-[225px] md:max-w-[240px] mx-auto aspect-[3/4] bg-gradient-to-b from-green-600/20 via-green-700/20 to-green-800/20 rounded-lg border-2 border-green-500/30 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <circle cx="50%" cy="50%" r="15%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <rect x="0%" y="60%" width="25%" height="40%" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <rect x="75%" y="60%" width="25%" height="40%" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          </svg>
          {positions.slice(0, sortedStarters.length).map((pos, index) => {
            const player = sortedStarters[index];
            return (
              <div
                key={player?.playerId ?? index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div className="flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/80 border-2 border-white/40 shadow-md">
                  <span className="text-lg font-bold text-white leading-none">
                    {player?.shirtNumber ?? '–'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

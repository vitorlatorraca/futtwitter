'use client';

import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PositionBadge } from '@/components/ui/position-badge';
import { normalizeToCanonical, POSITION_SORT_ORDER } from '@shared/positions';
import type { Player } from '@shared/schema';

interface ElencoTabProps {
  players: Player[];
  isLoading?: boolean;
  getPhotoUrl: (p: Player) => string;
}

const POSITION_GROUPS: { label: string; positions: string[] }[] = [
  { label: 'Goleiros', positions: ['GK'] },
  { label: 'Defensores', positions: ['CB', 'LB', 'RB', 'LWB', 'RWB', 'SW'] },
  { label: 'Meio-campistas', positions: ['CDM', 'CM', 'CAM', 'LM', 'RM', 'DM'] },
  { label: 'Atacantes', positions: ['LW', 'RW', 'CF', 'SS', 'ST', 'FW'] },
];

function getAgeFromBirthDate(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function PlayerCard({ player, getPhotoUrl }: { player: Player; getPhotoUrl: (p: Player) => string }) {
  const age = getAgeFromBirthDate(player.birthDate);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-card hover:bg-surface-elevated/60 transition-colors group">
      {/* Photo */}
      <div className="relative shrink-0">
        <img
          src={getPhotoUrl(player)}
          alt={player.name}
          className="h-14 w-14 rounded-full object-cover border-2 border-border bg-surface-elevated"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/players/placeholder.png';
          }}
        />
        {player.shirtNumber != null && (
          <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-background tabular-nums">
            {player.shirtNumber}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-foreground truncate leading-snug">
          {player.knownName ?? player.name}
        </p>
        {player.knownName && player.knownName !== player.name && (
          <p className="text-[11px] text-foreground-secondary truncate leading-snug">
            {player.name}
          </p>
        )}
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <PositionBadge position={player.position} size="xs" />
          {age != null && (
            <span className="text-[11px] text-foreground-secondary">{age} anos</span>
          )}
          {player.nationalityPrimary && (
            <span className="text-[11px] text-foreground-secondary truncate">
              · {player.nationalityPrimary}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-card">
      <Skeleton className="h-14 w-14 rounded-full shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-3.5 w-28 mb-2" />
        <Skeleton className="h-2.5 w-16" />
      </div>
    </div>
  );
}

export function ElencoTab({ players, isLoading, getPhotoUrl }: ElencoTabProps) {
  const grouped = useMemo(() => {
    const sorted = [...players].sort(
      (a, b) =>
        (POSITION_SORT_ORDER[normalizeToCanonical(a.position)] ?? 99) -
        (POSITION_SORT_ORDER[normalizeToCanonical(b.position)] ?? 99),
    );

    return POSITION_GROUPS.map((group) => ({
      label: group.label,
      players: sorted.filter((p) => group.positions.includes(normalizeToCanonical(p.position))),
    })).filter((g) => g.players.length > 0);
  }, [players]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[4, 6, 8, 5].map((count, i) => (
          <div key={i}>
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {Array.from({ length: count }).map((_, j) => (
                <SkeletonCard key={j} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-border bg-surface-card">
        <img
          src="/assets/players/placeholder.png"
          alt=""
          className="h-16 w-16 rounded-full opacity-30 mb-4"
        />
        <p className="text-foreground font-semibold text-lg mb-1">Elenco não encontrado</p>
        <p className="text-sm text-foreground-secondary">Os jogadores aparecerão aqui assim que forem cadastrados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {grouped.map((group) => (
        <section key={group.label}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-bold text-base text-foreground">{group.label}</h2>
            <span className="text-xs font-semibold text-foreground-secondary bg-surface-elevated px-2 py-0.5 rounded-full">
              {group.players.length}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {group.players.map((player) => (
              <PlayerCard key={player.id} player={player} getPhotoUrl={getPhotoUrl} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

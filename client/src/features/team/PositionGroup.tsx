import type { Player } from '@shared/schema';
import { SECTOR_LABELS, sortByPositionOrder } from '@shared/positions';
import type { PositionSector as PlayerSector } from '@shared/positions';
import { PlayerRow } from './PlayerRow';

interface PositionGroupProps {
  sector: PlayerSector;
  players: Player[];
  getPhotoUrl: (p: Player) => string;
}

export function PositionGroup({ sector, players, getPhotoUrl }: PositionGroupProps) {
  const label = SECTOR_LABELS[sector];
  const sorted = sortByPositionOrder(players);

  if (sorted.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-display font-semibold text-base uppercase tracking-wide text-foreground/90">
        {label}
      </h3>
      <div className="space-y-2">
        {sorted.map((player) => (
          <PlayerRow key={player.id} player={player} getPhotoUrl={getPhotoUrl} />
        ))}
      </div>
    </div>
  );
}

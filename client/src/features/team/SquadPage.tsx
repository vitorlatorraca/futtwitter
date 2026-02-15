import { useMemo } from 'react';
import { positionToSector } from '@shared/player-sector';
import type { PlayerSector } from '@shared/player-sector';
import type { Player } from '@shared/schema';
import { PositionGroup } from './PositionGroup';

const SECTOR_ORDER: PlayerSector[] = ['GK', 'DEF', 'MID', 'FWD'];

interface SquadPageProps {
  players: Player[];
  getPhotoUrl?: (p: Player) => string;
}

const defaultGetPhotoUrl = (p: Player) => p.photoUrl ?? '/assets/players/placeholder.png';

export function SquadPage({ players, getPhotoUrl = defaultGetPhotoUrl }: SquadPageProps) {
  const grouped = useMemo(() => {
    const map: Record<PlayerSector, Player[]> = { GK: [], DEF: [], MID: [], FWD: [] };
    players.forEach((p) => {
      const sector = positionToSector(p.position);
      map[sector].push(p);
    });
    return map;
  }, [players]);

  return (
    <div className="space-y-8">
      {/* Table header - desktop only */}
      <div className="hidden md:grid grid-cols-[minmax(0,1fr)_minmax(100px,1fr)_56px_96px_32px] gap-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-white/5">
        <span>Jogador</span>
        <span>Nacionalidade</span>
        <span className="text-right">Altura</span>
        <span>Nascimento</span>
        <span className="text-right">Idade</span>
      </div>
      {SECTOR_ORDER.map((sector) => (
        <PositionGroup
          key={sector}
          sector={sector}
          players={grouped[sector]}
          getPhotoUrl={getPhotoUrl}
        />
      ))}
    </div>
  );
}

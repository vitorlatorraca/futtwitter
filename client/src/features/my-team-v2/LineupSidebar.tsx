import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LineupPlayerChip } from './LineupPlayerChip';
import { positionToSector, type PlayerSector } from '@shared/player-sector';
import type { Player } from '@shared/schema';

const SECTOR_FILTERS: { value: PlayerSector | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'GK', label: 'GOL' },
  { value: 'DEF', label: 'DEF' },
  { value: 'MID', label: 'MEI' },
  { value: 'FWD', label: 'ATA' },
];

const SECTOR_ORDER: PlayerSector[] = ['GK', 'DEF', 'MID', 'FWD'];

function sortRoster(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    const sectorA = positionToSector(a.position ?? '');
    const sectorB = positionToSector(b.position ?? '');
    const idxA = SECTOR_ORDER.indexOf(sectorA);
    const idxB = SECTOR_ORDER.indexOf(sectorB);
    if (idxA !== idxB) return idxA - idxB;
    const numA = a.shirtNumber ?? 999;
    const numB = b.shirtNumber ?? 999;
    if (numA !== numB) return numA - numB;
    return (a.name ?? '').localeCompare(b.name ?? '');
  });
}

interface LineupSidebarProps {
  players: Player[];
  lineupPlayerIds: Set<string>;
  selectedSlotId: string | null;
  onSelectPlayer: (playerId: string) => void;
  teamId?: string | null;
  getPhotoUrl?: (p: Player) => string;
  className?: string;
}

export function LineupSidebar({
  players,
  lineupPlayerIds,
  selectedSlotId,
  onSelectPlayer,
  teamId,
  getPhotoUrl,
  className,
}: LineupSidebarProps) {
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState<PlayerSector | 'ALL'>('ALL');

  const filteredAndSorted = useMemo(() => {
    let list = players;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.position?.toLowerCase().includes(q) ?? false) ||
          (p.shirtNumber != null && String(p.shirtNumber).includes(q))
      );
    }
    if (sectorFilter !== 'ALL') {
      list = list.filter((p) => positionToSector(p.position ?? '') === sectorFilter);
    }
    return sortRoster(list);
  }, [players, search, sectorFilter]);

  const availableCount = useMemo(
    () => players.filter((p) => !lineupPlayerIds.has(p.id)).length,
    [players, lineupPlayerIds]
  );

  return (
    <div className={cn('flex flex-col h-full min-h-0', className)}>
      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground-secondary mb-3">
        Elenco
      </h3>

      {selectedSlotId && (
        <p className="text-sm text-primary font-medium mb-2">
          Selecione um jogador para substituir
        </p>
      )}

      <div className="relative flex-shrink-0 mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar jogador…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {SECTOR_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setSectorFilter(f.value)}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-semibold transition-all',
              sectorFilter === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/5 text-foreground-secondary hover:bg-white/10'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 -mr-1">
        {filteredAndSorted.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Nenhum jogador encontrado.
          </p>
        ) : (
          filteredAndSorted.map((player) => (
            <LineupPlayerChip
              key={player.id}
              player={player}
              teamId={teamId}
              isLineup={lineupPlayerIds.has(player.id)}
              isSelected={false}
              onClick={() => onSelectPlayer(player.id)}
              getPhotoUrl={getPhotoUrl}
            />
          ))
        )}
      </div>

      <div className="flex-shrink-0 pt-3 mt-3 border-t border-card-border text-xs text-muted-foreground">
        {players.length} jogadores — {lineupPlayerIds.size}/11 escalados — {availableCount} disponíveis
      </div>
    </div>
  );
}

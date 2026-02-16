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
  selectedSlotPlayerId?: string | null;
  onSelectPlayer: (playerId: string) => void;
  teamId?: string | null;
  getPhotoUrl?: (p: Player) => string;
  className?: string;
}

export function LineupSidebar({
  players,
  lineupPlayerIds,
  selectedSlotId,
  selectedSlotPlayerId = null,
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

  const chipBase = 'rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200';
  const chipActive = 'border-primary bg-primary/15 text-primary border-[1.5px]';
  const chipInactive = 'border border-white/10 bg-white/[0.04] text-foreground-secondary hover:bg-white/10 hover:text-foreground';

  return (
    <div className={cn('flex flex-col h-full min-h-0', className)}>
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-secondary">
          Elenco
        </h3>
        <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
          {players.length} jogadores
        </span>
      </div>

      {selectedSlotId && (
        <p className="text-xs text-primary font-medium mb-2.5">
          Selecione um jogador para substituir
        </p>
      )}

      <div className="relative flex-shrink-0 mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Buscar por nome, posição ou número…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm bg-white/[0.03] border-white/10 focus:border-primary/50 transition-colors duration-200"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {SECTOR_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setSectorFilter(f.value)}
            className={cn(
              chipBase,
              sectorFilter === f.value ? chipActive : chipInactive
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 -mr-1 min-h-0">
        {filteredAndSorted.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Nenhum jogador encontrado.
          </p>
        ) : (
          filteredAndSorted.map((player) => (
            <LineupPlayerChip
              key={player.id}
              player={player}
              teamId={teamId}
              isLineup={lineupPlayerIds.has(player.id)}
              isSelected={selectedSlotPlayerId === player.id}
              onClick={() => onSelectPlayer(player.id)}
              getPhotoUrl={getPhotoUrl}
            />
          ))
        )}
      </div>

      <div className="flex-shrink-0 pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="tabular-nums">{lineupPlayerIds.size}/11 escalados</span>
        <span className="tabular-nums">{availableCount} disponíveis</span>
      </div>
    </div>
  );
}

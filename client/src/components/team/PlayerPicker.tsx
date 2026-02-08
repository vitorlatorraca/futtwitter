'use client';

import { useMemo, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import type { Player } from '@shared/schema';
import { positionToSector } from '@shared/player-sector';
import { SECTOR_LABELS } from '@shared/player-sector';
import type { PlayerSector } from '@shared/player-sector';

interface PlayerPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotId: string;
  slotLabel: string;
  sector: PlayerSector;
  players: Player[];
  /** Player IDs already placed in other slots (to show "já escalado" and disable) */
  alreadyPickedIds: Set<string>;
  onSelect: (playerId: string) => void;
  getPhotoUrl?: (p: Player) => string;
}

function getPhotoUrlFallback(p: Player): string {
  return p.photoUrl ?? '/assets/players/placeholder.png';
}

export function PlayerPicker({
  open,
  onOpenChange,
  slotId,
  slotLabel,
  sector,
  players,
  alreadyPickedIds,
  onSelect,
  getPhotoUrl = getPhotoUrlFallback,
}: PlayerPickerProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = players.filter((p) => positionToSector(p.position) === sector);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.position?.toLowerCase().includes(q) ?? false) ||
          (p.shirtNumber != null && String(p.shirtNumber).includes(q))
      );
    }
    return list.sort((a, b) => (a.shirtNumber ?? 99) - (b.shirtNumber ?? 99));
  }, [players, sector, search]);

  const handleSelect = (playerId: string) => {
    if (alreadyPickedIds.has(playerId)) return;
    onSelect(playerId);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Selecionar jogador</SheetTitle>
          <SheetDescription>
            Posição: {slotLabel} ({SECTOR_LABELS[sector]})
          </SheetDescription>
        </SheetHeader>

        <div className="relative mt-4 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, posição ou número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Nenhum jogador compatível com esta posição.
            </p>
          ) : (
            filtered.map((player) => {
              const isPicked = alreadyPickedIds.has(player.id);
              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => handleSelect(player.id)}
                  disabled={isPicked}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                    isPicked
                      ? 'opacity-60 cursor-not-allowed border-card-border bg-muted/50'
                      : 'hover:bg-accent border-card-border hover:border-primary/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-card-border flex-shrink-0 bg-muted">
                    <img
                      src={getPhotoUrl(player)}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/players/placeholder.png';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground truncate">{player.name}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">{player.position}</span>
                      {player.shirtNumber != null && (
                        <Badge variant="outline" className="text-xs">
                          {player.shirtNumber}
                        </Badge>
                      )}
                      {player.marketValueEur != null && (
                        <span className="text-xs text-muted-foreground">
                          €{(player.marketValueEur / 1_000_000).toFixed(1)}M
                        </span>
                      )}
                    </div>
                    {isPicked && (
                      <span className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 block">
                        Já escalado em outra posição
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

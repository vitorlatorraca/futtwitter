'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { resolvePlayerPhoto, PLAYER_PHOTO_PLACEHOLDER } from './resolvePlayerPhoto';
import type { Player } from '@shared/schema';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '');
  return name.slice(0, 2).toUpperCase();
}

function normalizeForSearch(s: string): string {
  return (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function matchesSearch(player: Player, search: string): boolean {
  if (!search.trim()) return true;
  const n = normalizeForSearch(search);
  const nameMatch = normalizeForSearch(player.name).includes(n);
  const knownMatch = player.knownName ? normalizeForSearch(player.knownName).includes(n) : false;
  return nameMatch || knownMatch;
}

export interface SlotPlayerPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eligiblePlayers: Player[];
  onSelect: (player: Player) => void;
  onClear: () => void;
  teamId: string;
  getPhotoUrl?: (p: Player) => string;
  hasCurrentPlayer: boolean;
  children: React.ReactNode;
}

export function SlotPlayerPicker({
  open,
  onOpenChange,
  eligiblePlayers,
  onSelect,
  onClear,
  teamId,
  getPhotoUrl,
  hasCurrentPlayer,
  children,
}: SlotPlayerPickerProps) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredPlayers = useMemo(() => {
    return eligiblePlayers.filter((p) => matchesSearch(p, search));
  }, [eligiblePlayers, search]);

  useEffect(() => {
    if (open) {
      setSearch('');
      // Focus input after popover opens
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  const handleSelect = (player: Player) => {
    onSelect(player);
    onOpenChange(false);
  };

  const handleClear = () => {
    onClear();
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>
        {children}
      </PopoverAnchor>
      <PopoverContent
        className="w-[340px] p-0 border-white/10 bg-zinc-900/95 backdrop-blur-md shadow-xl"
        align="center"
        side="bottom"
        sideOffset={8}
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
      >
        <Command
          className="rounded-lg border-0 bg-transparent"
          shouldFilter={false}
          loop
        >
          <CommandInput
            ref={inputRef}
            placeholder="Buscar jogador..."
            value={search}
            onValueChange={setSearch}
            className="border-b border-white/10 bg-transparent placeholder:text-white/50 focus:ring-0"
          />
          <CommandList className="max-h-[280px] overflow-y-auto p-1">
            <CommandEmpty className="py-6 text-center text-sm text-white/60">
              Nenhum jogador encontrado
            </CommandEmpty>
            {hasCurrentPlayer && (
              <CommandGroup heading={null} className="p-0">
                <CommandItem
                  onSelect={handleClear}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-amber-400/90 hover:bg-white/10 hover:text-amber-400"
                >
                  <span className="text-sm font-medium">Remover jogador</span>
                </CommandItem>
              </CommandGroup>
            )}
            <CommandGroup heading={null} className="p-0 mt-1">
              {filteredPlayers.map((player) => {
                const photoUrl =
                  getPhotoUrl?.(player) ?? resolvePlayerPhoto(player.name, player.photoUrl, teamId);
                return (
                  <CommandItem
                    key={player.id}
                    value={player.id}
                    onSelect={() => handleSelect(player)}
                    className="flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer hover:bg-white/10 data-[selected=true]:bg-white/10"
                  >
                    <div className="h-8 w-8 shrink-0 rounded-full overflow-hidden bg-black/40 border border-white/10">
                      {photoUrl && photoUrl !== PLAYER_PHOTO_PLACEHOLDER ? (
                        <img
                          src={photoUrl}
                          alt=""
                          className="h-full w-full object-cover object-top"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted text-foreground text-xs font-bold">
                          {getInitials(player.name)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white truncate">{player.name}</p>
                      <p className="text-xs text-white/50 truncate">
                        {player.position ?? player.primaryPosition ?? '—'}
                        {player.shirtNumber != null ? ` • ${player.shirtNumber}` : ''}
                      </p>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

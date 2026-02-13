import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trophy, Save, Loader2, Plus, MoreVertical } from 'lucide-react';
import type { Player } from '@shared/schema';
import { PlayerPicker } from '@/components/team/PlayerPicker';
import { FORMATION_SLOT_CONFIG, getSlotConfig } from '@/components/team/formation-slots';
import { getTeamCrest } from '@/lib/teamCrests';

const FORMATIONS = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'] as const;

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

export interface LineupSlot {
  slotIndex: number;
  playerId: string;
}

interface FormationViewProps {
  players: Player[];
  teamId: string;
  initialFormation?: string;
  initialSlots?: LineupSlot[];
  onSave?: (formation: string, slots: LineupSlot[]) => Promise<void>;
  captainId?: string;
  /** Player map for lookup by id */
  playersById?: Map<string, Player>;
  /** Photo URL resolver: (player) => url or placeholder */
  getPhotoUrl?: (p: Player) => string;
  /** When true, filled slots show black button with number + badge only (no photo/name) */
  compactSlots?: boolean;
  /** Badge/escudo URL for compact slots (e.g. /assets/teams/corinthians/badge.png) */
  badgeUrl?: string;
}

const DEFAULT_FORMATION = '4-3-3';

function getPhotoUrlFallback(p: Player): string {
  if (p.photoUrl) return p.photoUrl;
  return '/assets/players/placeholder.png';
}

const PLACEHOLDER_BADGE_SRC = '/assets/crests/placeholder.svg';

export function FormationView({
  players,
  teamId,
  initialFormation = DEFAULT_FORMATION,
  initialSlots = [],
  onSave,
  captainId,
  playersById,
  getPhotoUrl = getPhotoUrlFallback,
  compactSlots = false,
  badgeUrl,
}: FormationViewProps) {
  const isCompact = compactSlots || teamId === 'corinthians';
  const escudo = badgeUrl ?? getTeamCrest(teamId);
  const [formation, setFormation] = useState(initialFormation);
  const [slots, setSlots] = useState<LineupSlot[]>(initialSlots);
  const [saving, setSaving] = useState(false);
  /** When set, the PlayerPicker is open for this slot. */
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null);

  useEffect(() => {
    setFormation(initialFormation);
    setSlots(initialSlots);
  }, [initialFormation, initialSlots]);

  const pmap = useMemo(() => {
    const m = playersById ?? new Map(players.map((p) => [p.id, p]));
    players.forEach((p) => m.set(p.id, p));
    return m;
  }, [players, playersById]);

  const slotToPlayer = useMemo(() => {
    const m = new Map<number, Player>();
    slots.forEach((s) => {
      const p = pmap.get(s.playerId);
      if (p) m.set(s.slotIndex, p);
    });
    return m;
  }, [slots, pmap]);

  /** For the picker: players already in OTHER slots (so we don't allow same player in two slots; current slot is excluded so user can re-pick same player) */
  const alreadyPickedIdsForPicker = useMemo(() => {
    if (pickerSlotIndex == null) return new Set<string>();
    const ids = new Set<string>();
    slots.forEach((s) => {
      if (s.slotIndex !== pickerSlotIndex) ids.add(s.playerId);
    });
    return ids;
  }, [slots, pickerSlotIndex]);

  const positions = formationPositions[formation] ?? formationPositions[DEFAULT_FORMATION];
  const slotConfigs = FORMATION_SLOT_CONFIG[formation] ?? FORMATION_SLOT_CONFIG[DEFAULT_FORMATION];

  const handleSlotClick = useCallback((slotIndex: number) => {
    setPickerSlotIndex(slotIndex);
  }, []);

  const handleSelectPlayer = useCallback((playerId: string) => {
    if (pickerSlotIndex === null) return;
    setSlots((prev) => {
      const withoutThisSlot = prev.filter((s) => s.slotIndex !== pickerSlotIndex);
      const withoutThisPlayer = withoutThisSlot.filter((s) => s.playerId !== playerId);
      return [...withoutThisPlayer, { slotIndex: pickerSlotIndex, playerId }];
    });
    setPickerSlotIndex(null);
  }, [pickerSlotIndex]);

  const handleRemoveFromSlot = useCallback((slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSlots((prev) => prev.filter((s) => s.slotIndex !== slotIndex));
  }, []);

  const handleSave = useCallback(async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(formation, slots);
    } finally {
      setSaving(false);
    }
  }, [formation, slots, onSave]);

  const currentPickerConfig = pickerSlotIndex != null ? getSlotConfig(formation, pickerSlotIndex) : null;

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-card-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-display flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Tática Ideal
          </CardTitle>
          <div className="flex items-center gap-3">
            <Select value={formation} onValueChange={(v) => setFormation(v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMATIONS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {onSave && (
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span className="ml-2">Salvar minha tática</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-lg font-bold px-4 py-2">
              {formation}
            </Badge>
          </div>

          <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-green-600/20 via-green-700/20 to-green-800/20 rounded-lg border-2 border-green-500/30 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <circle cx="50%" cy="50%" r="15%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <rect x="0%" y="60%" width="25%" height="40%" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <rect x="75%" y="60%" width="25%" height="40%" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            </svg>

            {positions.map((pos, index) => {
              const player = slotToPlayer.get(index);
              const config = slotConfigs[index];
              const slotId = config?.slotId ?? `S${index}`;
              const sector = config?.sector ?? 'MID';
              const label = config?.label ?? `${index + 1}`;

              return (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <button
                    type="button"
                    onClick={() => handleSlotClick(index)}
                    className={`flex flex-col items-center justify-center w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent hover:shadow-[0_0_12px_rgba(34,197,94,0.2)] ${
                      player && isCompact
                        ? 'bg-black border-black/80 shadow-md'
                        : player
                          ? 'bg-primary/90 border-primary'
                          : 'bg-black/30 border-green-500/40 border-dashed hover:border-green-400/60'
                    }`}
                  >
                    {player ? (
                      isCompact ? (
                        <div className="relative w-full h-full flex items-center justify-center gap-0.5 rounded-full">
                          <span className="text-lg sm:text-xl font-bold text-white leading-none">
                            {player.shirtNumber ?? '—'}
                          </span>
                          {escudo && (
                            <img
                              src={escudo}
                              alt="Corinthians"
                              className="w-5 h-5 sm:w-6 sm:h-6 object-contain opacity-90"
                              onError={(e) => {
                                const el = e.target as HTMLImageElement;
                                if (el.src !== PLACEHOLDER_BADGE_SRC) {
                                  el.src = PLACEHOLDER_BADGE_SRC;
                                } else {
                                  el.style.display = 'none';
                                }
                              }}
                            />
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <span
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-destructive/20 text-muted-foreground hover:text-destructive text-xs font-bold"
                                title="Remover"
                              >
                                ×
                              </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuItem onClick={() => handleSlotClick(index)}>
                                Trocar jogador
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => handleRemoveFromSlot(index, e as unknown as React.MouseEvent)}
                              >
                                Remover do slot
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ) : (
                        <>
                          <div className="relative w-full h-full flex flex-col items-center justify-center p-0.5 rounded-full">
                            <img
                              src={getPhotoUrl(player)}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover border border-white/30"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/assets/players/placeholder.png';
                              }}
                            />
                            <span className="text-[10px] font-bold truncate w-full text-center leading-tight text-white">
                              {player.shirtNumber ?? '—'}
                            </span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border border-card-border flex items-center justify-center hover:bg-accent">
                                <MoreVertical className="h-3 w-3 text-muted-foreground" />
                              </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuItem onClick={() => handleSlotClick(index)}>
                                Trocar jogador
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => handleRemoveFromSlot(index, e as unknown as React.MouseEvent)}
                              >
                                Remover do slot
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )
                    ) : (
                      <span className="text-xs text-white/80 flex items-center gap-0.5">
                        <Plus className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Adicionar</span>
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Clique em uma posição no campo para selecionar o jogador. Use &quot;Trocar jogador&quot; ou &quot;Remover do slot&quot; no menu. Salve para persistir.
          </p>
        </div>
      </CardContent>

      {currentPickerConfig && (
        <PlayerPicker
          open={pickerSlotIndex !== null}
          onOpenChange={(open) => !open && setPickerSlotIndex(null)}
          slotId={currentPickerConfig.slotId}
          slotLabel={currentPickerConfig.label}
          sector={currentPickerConfig.sector}
          players={players}
          alreadyPickedIds={alreadyPickedIdsForPicker}
          onSelect={handleSelectPlayer}
          getPhotoUrl={getPhotoUrl}
        />
      )}
    </Card>
  );
}

export { FORMATIONS };

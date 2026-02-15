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
  /** Compact premium card: smaller pitch, elegant styling, widget-like */
  compact?: boolean;
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
  compact: compactMode = false,
}: FormationViewProps) {
  const isCompact = compactSlots || teamId === 'corinthians' || compactMode;
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

  const pitchGradient = compactMode
    ? 'bg-gradient-to-b from-emerald-900/40 via-emerald-800/30 to-emerald-950/50'
    : 'bg-gradient-to-b from-green-600/20 via-green-700/20 to-green-800/20';
  const pitchBorder = compactMode ? 'border border-emerald-400/30' : 'border-2 border-green-500/30';
  const pitchAspect = compactMode ? 'aspect-[3/2.8] max-h-[260px]' : 'aspect-[3/4]';
  const slotSize = compactMode ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-11 h-11 sm:w-[52px] sm:h-[52px]';
  const emptySlotClass = compactMode
    ? 'bg-emerald-500/10 border-emerald-400/40 border-dashed hover:border-emerald-400 hover:scale-105'
    : 'bg-black/30 border-green-500/40 border-dashed hover:border-green-400/60';
  const strokeOpacity = compactMode ? '0.15' : '0.3';

  return (
    <Card className={compactMode ? 'rounded-xl border border-card-border bg-card/90 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.06)] transition-all duration-200 hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)]' : 'bg-card/60 backdrop-blur-sm border-card-border'}>
      <CardHeader className={compactMode ? 'pb-2 pt-3 px-4' : undefined}>
        <div className={compactMode ? 'flex flex-wrap items-center justify-between gap-2' : 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'}>
          <div className="flex items-center gap-2">
            <CardTitle className={compactMode ? 'text-base font-display flex items-center gap-1.5' : 'text-xl font-display flex items-center gap-2'}>
              <Trophy className={compactMode ? 'h-3.5 w-3.5 text-primary/90' : 'h-5 w-5 text-primary'} />
              <span className={compactMode ? 'text-sm font-medium text-foreground/90' : ''}>Tática ideal</span>
            </CardTitle>
            <Badge variant="outline" className={compactMode ? 'text-xs font-bold px-2 py-0.5 border-primary/30 text-primary' : 'hidden'}>
              {formation}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={formation} onValueChange={(v) => setFormation(v)}>
              <SelectTrigger className={compactMode ? 'w-[100px] h-8 text-sm' : 'w-[120px]'}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMATIONS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {onSave && (
              <Button size="sm" variant={compactMode ? 'outline' : 'default'} className={compactMode ? 'h-8 w-8 p-0 border-white/10' : ''} onClick={handleSave} disabled={saving} title="Salvar formação">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className={compactMode ? 'h-3.5 w-3.5' : 'h-4 w-4'} />}
                {!compactMode && <span className="ml-2">Salvar</span>}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={compactMode ? 'px-4 pb-4 pt-0' : undefined}>
        <div className={compactMode ? 'space-y-3' : 'space-y-4'}>
          {!compactMode && (
            <div className="flex items-center justify-center">
              <Badge variant="outline" className="text-lg font-bold px-4 py-2">
                {formation}
              </Badge>
            </div>
          )}

          <div className={`relative w-full ${pitchAspect} ${pitchGradient} rounded-lg ${pitchBorder} overflow-hidden`}>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <circle cx="50%" cy="50%" r="15%" fill="none" stroke={`rgba(255,255,255,${strokeOpacity})`} strokeWidth={compactMode ? 1 : 2} />
              <line x1="0%" y1="50%" x2="100%" y2="50%" stroke={`rgba(255,255,255,${strokeOpacity})`} strokeWidth={compactMode ? 1 : 2} />
              <rect x="0%" y="60%" width="25%" height="40%" fill="none" stroke={`rgba(255,255,255,${compactMode ? 0.1 : 0.2})`} strokeWidth={compactMode ? 1 : 2} />
              <rect x="75%" y="60%" width="25%" height="40%" fill="none" stroke={`rgba(255,255,255,${compactMode ? 0.1 : 0.2})`} strokeWidth={compactMode ? 1 : 2} />
            </svg>

            {positions.map((pos, index) => {
              const player = slotToPlayer.get(index);
              const config = slotConfigs[index];

              return (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <button
                    type="button"
                    onClick={() => handleSlotClick(index)}
                    className={`flex flex-col items-center justify-center ${slotSize} rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent ${
                      player && isCompact
                        ? 'bg-emerald-500/10 border-emerald-400 border-2 shadow-[0_0_10px_rgba(16,185,129,0.15)] hover:scale-105'
                        : player
                          ? 'bg-primary/90 border-primary border-2'
                          : `border ${emptySlotClass}`
                    }`}
                  >
                    {player ? (
                      isCompact ? (
                        <div className="relative w-full h-full flex items-center justify-center gap-0.5 rounded-full overflow-hidden">
                          <span className={`font-bold text-white leading-none ${compactMode ? 'text-xs' : 'text-lg sm:text-xl'}`}>
                            {player.shirtNumber ?? '—'}
                          </span>
                          {escudo && !compactMode && (
                            <img
                              src={escudo}
                              alt=""
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
                          {escudo && compactMode && (
                            <img
                              src={escudo}
                              alt=""
                              className="w-3.5 h-3.5 object-contain opacity-80"
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
                                className={`absolute -top-0.5 -right-0.5 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-destructive/20 text-muted-foreground hover:text-destructive font-bold ${compactMode ? 'w-4 h-4 text-[10px]' : 'w-5 h-5 text-xs'}`}
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
                      <span className={`text-muted-foreground flex items-center gap-0.5 ${compactMode ? 'text-[10px]' : 'text-xs text-white/80'}`}>
                        <Plus className={compactMode ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'} />
                        {!compactMode && <span className="hidden sm:inline">Adicionar</span>}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {!compactMode && (
            <p className="text-center text-sm text-muted-foreground">
              Clique em uma posição no campo para selecionar o jogador. Use &quot;Trocar jogador&quot; ou &quot;Remover do slot&quot; no menu. Salve para persistir.
            </p>
          )}
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

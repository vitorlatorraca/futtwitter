import { useMemo, useState } from 'react';
import { Save, Loader2, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { FormationSelector } from './FormationSelector';
import { LineupLayout, type FormationKey } from './LineupLayout';
import { LineupPitch } from './LineupPitch';
import { LineupSidebar } from './LineupSidebar';
import { useLineupState } from './useLineupState';
import type { Player } from '@shared/schema';

interface LineupSectionProps {
  players: Player[];
  teamId: string;
  initialFormation?: string;
  initialSlots?: Array<{ slotIndex: number; playerId: string }>;
  onSave?: (formation: string, slots: Array<{ slotIndex: number; playerId: string }>) => Promise<void>;
  getPhotoUrl?: (p: Player) => string;
}

export function LineupSection({
  players,
  teamId,
  initialFormation = '4-3-3',
  initialSlots = [],
  onSave,
  getPhotoUrl,
}: LineupSectionProps) {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    formation,
    lineupSlots,
    selectedSlotIndex,
    selectedSlotId,
    saving,
    handleFormationChange,
    handleSlotClick,
    handleReplacePlayer,
    handleSave,
  } = useLineupState({
    teamId,
    initialFormation,
    initialSlots,
    onSave,
    onSavedToLocalStorage: () =>
      toast({ title: 'Salvo!', description: 'Formação salva localmente.' }),
  });

  const playersById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);
  const lineupPlayerIds = useMemo(
    () => new Set(lineupSlots.filter((s) => s.playerId).map((s) => s.playerId as string)),
    [lineupSlots]
  );

  const handleSelectPlayer = (playerId: string) => {
    if (selectedSlotIndex === null) return;
    const prevPlayerId = lineupSlots.find((s) => s.slotIndex === selectedSlotIndex)?.playerId;
    if (prevPlayerId === playerId) return;

    const prevPlayer = prevPlayerId ? playersById.get(prevPlayerId) : null;
    const newPlayer = playersById.get(playerId);
    handleReplacePlayer(playerId);
    setSidebarOpen(false);

    if (prevPlayer && newPlayer) {
      toast({
        title: 'Substituído',
        description: `${newPlayer.name} entrou no lugar de ${prevPlayer.name}`,
      });
    }
  };

  return (
    <TooltipProvider>
      <Card className="rounded-xl border border-card-border bg-card/90 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.06)]">
        <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-display font-semibold text-foreground">Tática / Escalação</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <FormationSelector
                value={formation}
                onChange={(f) => handleFormationChange(f as FormationKey)}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" disabled className="opacity-50">
                    <span className="hidden sm:inline">Masculino</span>
                    <span className="sm:hidden">M</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Em breve</TooltipContent>
              </Tooltip>
              <Button
                size="sm"
                onClick={() => handleSave()}
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Sidebar — desktop col-span-4 */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="rounded-xl border border-card-border bg-surface-card p-4 h-[420px] min-h-0">
                <LineupSidebar
                  players={players}
                  lineupPlayerIds={lineupPlayerIds}
                  selectedSlotId={selectedSlotId}
                  onSelectPlayer={handleSelectPlayer}
                  teamId={teamId}
                  getPhotoUrl={getPhotoUrl}
                />
              </div>
            </div>

            {/* Campo — col-span-8 (mobile full width) */}
            <div className="lg:col-span-8 order-first lg:order-none">
              <LineupPitch
                slots={lineupSlots}
                playersById={playersById}
                teamId={teamId}
                selectedSlotIndex={selectedSlotIndex}
                onSlotClick={(idx) => {
                  handleSlotClick(idx);
                  setSidebarOpen(true);
                }}
                getPhotoUrl={getPhotoUrl}
              />
              {/* Mobile: botão para abrir drawer do elenco */}
              <div className="lg:hidden mt-3">
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Users className="h-4 w-4" />
                      Ver elenco
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full max-w-sm flex flex-col">
                    <SheetHeader>
                      <SheetTitle>Elenco</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 min-h-0 overflow-y-auto mt-4">
                      <LineupSidebar
                        players={players}
                        lineupPlayerIds={lineupPlayerIds}
                        selectedSlotId={selectedSlotId}
                        onSelectPlayer={handleSelectPlayer}
                        teamId={teamId}
                        getPhotoUrl={getPhotoUrl}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

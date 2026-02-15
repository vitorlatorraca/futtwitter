'use client';

import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChevronRight } from 'lucide-react';
import type { Player } from '@shared/schema';
import { toPtBrAbbrev } from '@/lib/positionAbbrev';

const panelClass =
  'rounded-2xl border border-white/10 backdrop-blur-sm bg-[#10161D] p-4 shadow-sm transition-all duration-200 hover:border-emerald-500/40';

interface ElencoPreviewMiniProps {
  players: Player[];
  getPhotoUrl: (p: Player) => string;
  isLoading?: boolean;
}

/** Ordem de prioridade para mostrar "titulares" (posições mais comuns no 11) */
const POSITION_PRIORITY: Record<string, number> = {
  Goalkeeper: 0,
  'Centre-Back': 1,
  'Left-Back': 2,
  'Right-Back': 3,
  'Defensive Midfield': 4,
  'Central Midfield': 5,
  'Attacking Midfield': 6,
  'Left Winger': 7,
  'Right Winger': 8,
  'Centre-Forward': 9,
  'Second Striker': 10,
};

function getPositionOrder(p: Player): number {
  return POSITION_PRIORITY[p.position ?? ''] ?? 99;
}

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

export function ElencoPreviewMini({
  players,
  getPhotoUrl,
  isLoading,
}: ElencoPreviewMiniProps) {
  const preview = [...players]
    .sort((a, b) => getPositionOrder(a) - getPositionOrder(b))
    .slice(0, 8);

  if (isLoading) {
    return (
      <div className={panelClass}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Elenco</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-2 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className={panelClass}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Elenco</h3>
          <Link
            href="/meu-time/elenco"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Ver elenco completo
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {preview.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {preview.map((p) => {
              const age = getAgeFromBirthDate(p.birthDate);
              const tooltipContent = age != null ? `${p.name} · ${age} anos` : p.name;
              const stableKey = p.id ?? `${p.name}-${p.shirtNumber ?? ''}`;
              return (
                <Tooltip key={stableKey}>
                  <TooltipTrigger asChild>
                    <Link
                      href="/meu-time/elenco"
                      className="flex items-center gap-2 py-2 px-2.5 rounded-lg hover:bg-[#141C24]/70 transition-all duration-200 group"
                    >
                      <div className="shrink-0">
                        <img
                          src={getPhotoUrl(p)}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover border border-white/5"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/players/placeholder.png';
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {toPtBrAbbrev(p.position)}
                          {p.shirtNumber != null ? ` · ${p.shirtNumber}` : ''}
                        </p>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {tooltipContent}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground py-2">
            Nenhum jogador no elenco.
          </p>
        )}
      </div>
    </TooltipProvider>
  );
}

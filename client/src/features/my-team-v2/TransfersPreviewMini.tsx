'use client';

import { useTransfers } from '@/features/transfers/api';
import { Crest } from '@/components/ui-premium';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TransferItem, TransferStatus } from '@/features/transfers/transferTypes';

const panelClass =
  'rounded-2xl border border-white/10 backdrop-blur-sm bg-[#10161D] p-4 shadow-sm transition-all duration-200 hover:border-emerald-500/40';

const STATUS_CONFIG: Record<TransferStatus, { label: string; className: string }> = {
  RUMOR: { label: 'Rumor', className: 'bg-meu-time-warning/20 text-meu-time-warning border-meu-time-warning/30' },
  NEGOCIACAO: { label: 'Negociação', className: 'bg-meu-time-accent/15 text-meu-time-accent border-meu-time-accent/25' },
  FECHADO: { label: 'Fechado', className: 'bg-meu-time-success/20 text-meu-time-success border-meu-time-success/30' },
};

interface TransfersPreviewMiniProps {
  teamId: string | null;
  teamName: string;
  /** Callback para trocar para aba Vai e Vem (quando embutido na Visão Geral) */
  onViewAll?: () => void;
}

export function TransfersPreviewMini({ teamId, teamName, onViewAll }: TransfersPreviewMiniProps) {
  const { data: items = [], isLoading } = useTransfers({
    teamId: teamId ?? undefined,
    status: undefined, // all statuses
  });

  const preview = (items as TransferItem[]).slice(0, 3);

  if (isLoading) {
    return (
      <div className={panelClass}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Vai e Vem do {teamName}</h3>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-7 w-7 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-2.5 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={panelClass}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Vai e Vem do {teamName}</h3>
        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Ver todos
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <a
            href="/meu-time?tab=vai-e-vem"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Ver todos
            <ChevronRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
      {preview.length > 0 ? (
        <div className="space-y-2">
          {preview.map((item) => {
            const statusConfig = STATUS_CONFIG[item.status];
            return (
              <div
                key={item.id}
                className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-[#141C24]/60 transition-all duration-200"
              >
                <div className="shrink-0">
                  {item.playerPhotoUrl ? (
                    <img
                      src={item.playerPhotoUrl}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover border border-white/5"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium text-muted-foreground">
                      {item.playerName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-medium text-foreground truncate">{item.playerName}</p>
                    <span className={cn(
                      'text-[8px] font-medium px-1 py-0.5 rounded border shrink-0',
                      statusConfig.className
                    )}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <Crest slug={item.fromTeam?.slug} alt={item.fromTeam?.name ?? '?'} size="xs" />
                    <span className="text-[9px] text-muted-foreground">→</span>
                    <Crest slug={item.toTeam?.slug} alt={item.toTeam?.name ?? '?'} size="xs" />
                    {item.author && (
                      <span className="text-[9px] text-muted-foreground/80 truncate max-w-[80px]" title={item.author.name}>
                        · {item.author.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground py-2">
          Nenhum rumor ou transferência recente.
        </p>
      )}
    </div>
  );
}

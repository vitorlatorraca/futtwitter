'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type FormResult = 'W' | 'D' | 'L';

export interface RecentFormMatch {
  id: string;
  opponent: string;
  teamScore: number | null;
  opponentScore: number | null;
  matchDate: string;
  isHomeMatch: boolean;
  competition?: string | null;
}

interface RecentFormMiniProps {
  matches: RecentFormMatch[];
  isLoading?: boolean;
  limit?: number;
}

function getResult(m: RecentFormMatch): FormResult {
  if (m.teamScore == null || m.opponentScore == null) return 'D';
  if (m.teamScore > m.opponentScore) return 'W';
  if (m.teamScore < m.opponentScore) return 'L';
  return 'D';
}

function resultStyle(result: FormResult): string {
  if (result === 'W') return 'bg-meu-time-success/25 text-meu-time-success';
  if (result === 'D') return 'bg-muted/50 text-muted-foreground';
  return 'bg-meu-time-danger/25 text-meu-time-danger';
}

function resultLabel(result: FormResult): string {
  if (result === 'W') return 'Vitória';
  if (result === 'D') return 'Empate';
  return 'Derrota';
}

const panelClass =
  'rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#10161D] p-4 shadow-sm';

export function RecentFormMini({
  matches,
  isLoading,
  limit = 5,
}: RecentFormMiniProps) {
  const recent = matches.slice(0, limit);
  const placeholderCount = Math.max(0, limit - recent.length);

  if (isLoading) {
    return (
      <div className={panelClass}>
        <Skeleton className="h-5 w-32 mb-3" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (recent.length === 0) {
    return (
      <div className={panelClass}>
        <h3 className="text-sm font-semibold text-foreground mb-2">Forma recente</h3>
        <p className="text-xs text-muted-foreground">Nenhum jogo recente</p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className={panelClass}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Forma recente</h3>
        <div className="flex gap-2 flex-wrap">
          {recent.map((m) => {
            const result = getResult(m);
            const score =
              m.teamScore != null && m.opponentScore != null
                ? `${m.teamScore}–${m.opponentScore}`
                : '–';
            const date = format(new Date(m.matchDate), 'dd/MM', { locale: ptBR });
            const venue = m.isHomeMatch ? 'Casa' : 'Fora';
            return (
              <Tooltip key={m.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-transform hover:scale-110 ${resultStyle(result)}`}
                    aria-label={`${resultLabel(result)} • ${m.opponent} ${score} • ${date}`}
                  >
                    {result}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[240px]">
                  <p className="font-medium">{m.opponent}</p>
                  <p className="text-sm text-muted-foreground">
                    Placar: {score} • {date} • {venue}
                  </p>
                  {m.competition && (
                    <p className="text-xs text-muted-foreground mt-0.5">{m.competition}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div
              key={`ph-${i}`}
              className="w-8 h-8 rounded-lg border border-dashed border-[rgba(255,255,255,0.06)] flex items-center justify-center text-muted-foreground text-xs shrink-0"
              aria-hidden
            >
              —
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

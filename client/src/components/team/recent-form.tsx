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

interface RecentFormProps {
  matches: RecentFormMatch[];
  isLoading: boolean;
  teamId: string;
  /** Last N games to show (default 5) */
  limit?: number;
}

function getResult(m: RecentFormMatch): FormResult {
  if (m.teamScore == null || m.opponentScore == null) return 'D';
  if (m.teamScore > m.opponentScore) return 'W';
  if (m.teamScore < m.opponentScore) return 'L';
  return 'D';
}

function resultStyle(result: FormResult): string {
  if (result === 'W') return 'bg-green-500/90 text-white';
  if (result === 'D') return 'bg-muted text-muted-foreground';
  return 'bg-red-500/90 text-white';
}

function resultLabel(result: FormResult): string {
  if (result === 'W') return 'Vitória';
  if (result === 'D') return 'Empate';
  return 'Derrota';
}

export function RecentForm({
  matches,
  isLoading,
  limit = 5,
}: RecentFormProps) {
  const recent = matches.slice(0, limit);
  const placeholderCount = Math.max(0, limit - recent.length);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-5 w-36" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (recent.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhum jogo recente
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-2">
        <span className="text-sm font-semibold text-foreground">Forma recente</span>
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
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-transform hover:scale-110 ${resultStyle(result)}`}
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
              key={`placeholder-${i}`}
              className="w-9 h-9 rounded-full border-2 border-dashed border-muted flex items-center justify-center text-muted-foreground text-xs shrink-0"
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

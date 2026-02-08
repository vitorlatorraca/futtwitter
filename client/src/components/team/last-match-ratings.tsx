import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface LastMatchPlayer {
  playerId: string;
  name: string;
  shirtNumber: number | null;
  rating: number;
  minutes: number | null;
}

export interface LastMatchData {
  match: {
    id: string;
    opponent: string;
    matchDate: string;
    scoreFor: number;
    scoreAgainst: number;
    homeAway: 'HOME' | 'AWAY';
    competition: string | null;
    isMock?: boolean;
  };
  players: LastMatchPlayer[];
}

interface LastMatchRatingsProps {
  data: LastMatchData | null;
  isLoading: boolean;
}

function getRatingColor(rating: number): string {
  if (rating >= 7) return 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/40';
  if (rating >= 6.5) return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/40';
  return 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40';
}

export function LastMatchRatings({ data, isLoading }: LastMatchRatingsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || !data.match) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        Nenhuma partida recente com notas disponível.
      </div>
    );
  }

  const { match, players } = data;
  const homeAwayLabel = match.homeAway === 'HOME' ? 'Casa' : 'Fora';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-1">
          Última Partida — Notas
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-foreground">
            {match.opponent} • {match.scoreFor}–{match.scoreAgainst}
          </span>
          <span className="text-muted-foreground">
            {format(new Date(match.matchDate), "dd/MM/yyyy", { locale: ptBR })} • {homeAwayLabel}
          </span>
          {match.competition && (
            <Badge variant="outline" className="text-xs">{match.competition}</Badge>
          )}
        </div>
        {match.isMock && (
          <p className="text-xs text-muted-foreground mt-1">(dados de demonstração)</p>
        )}
      </div>

      {players.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem notas registradas para esta partida.</p>
      ) : (
        <ul className="space-y-2">
          {players.map((p) => (
            <li
              key={p.playerId}
              className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg bg-muted/50 border border-border/50"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-mono text-muted-foreground w-6 shrink-0">
                  {p.shirtNumber ?? '—'}
                </span>
                <span className="text-sm font-medium text-foreground truncate">{p.name}</span>
                {p.minutes != null && (
                  <span className="text-xs text-muted-foreground shrink-0">{p.minutes}'</span>
                )}
              </div>
              <Badge variant="outline" className={`shrink-0 font-mono text-xs ${getRatingColor(p.rating)}`}>
                {p.rating.toFixed(1)}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trophy } from 'lucide-react';
import { Panel, SectionHeader, StatBadge, LoadingSkeleton } from '@/components/ui-premium';
import type { Match } from '@shared/schema';

interface MatchesSidebarProps {
  matches: Match[];
  teamId: string;
  teamName: string;
  isLoading?: boolean;
}

type FormResult = 'W' | 'D' | 'L';

function getResult(m: Match): FormResult | null {
  if (m.teamScore == null || m.opponentScore == null) return null;
  if (m.teamScore > m.opponentScore) return 'W';
  if (m.teamScore < m.opponentScore) return 'L';
  return 'D';
}

export function MatchesSidebar({
  matches,
  teamId,
  teamName,
  isLoading,
}: MatchesSidebarProps) {
  if (isLoading) {
    return (
      <Panel padding="sm">
        <SectionHeader title="Próximos & recentes" />
        <LoadingSkeleton variant="list" className="mt-3" />
      </Panel>
    );
  }

  const now = Date.now();
  const upcoming = matches
    .filter((m) => new Date(m.matchDate).getTime() >= now)
    .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
    .slice(0, 5);
  const recent = matches
    .filter((m) => new Date(m.matchDate).getTime() < now)
    .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
    .slice(0, 5);

  const combined: Array<{ m: Match; isUpcoming: boolean }> = [
    ...upcoming.map((m) => ({ m, isUpcoming: true })),
    ...recent.map((m) => ({ m, isUpcoming: false })),
  ].slice(0, 10);

  return (
    <Panel padding="sm">
      <SectionHeader title="Próximos & recentes" />
      <div className="space-y-1.5 mt-3">
        {combined.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            Nenhum jogo encontrado
          </p>
        ) : (
          combined.map(({ m, isUpcoming }) => {
            const result = getResult(m);
            const homeLabel = m.isHomeMatch ? teamName : m.opponent;
            const awayLabel = m.isHomeMatch ? m.opponent : teamName;

            return (
              <a
                key={m.id}
                href={`#match-${m.id}`}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-white/5 hover:bg-muted/60 transition-colors group"
              >
                <div className="flex-shrink-0 w-12 text-right">
                  <div className="text-[10px] text-muted-foreground uppercase">
                    {format(new Date(m.matchDate), 'dd/MM', { locale: ptBR })}
                  </div>
                  <div className="text-xs font-medium text-foreground tabular-nums">
                    {isUpcoming
                      ? format(new Date(m.matchDate), 'HH:mm', { locale: ptBR })
                      : result
                        ? `${m.teamScore ?? 0}–${m.opponentScore ?? 0}`
                        : '—'}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  {m.competition && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                      <Trophy className="h-2.5 w-2.5" />
                      {m.competition}
                    </span>
                  )}
                  <div className="text-xs font-medium text-foreground truncate">
                    {homeLabel} vs {awayLabel}
                  </div>
                </div>
                {!isUpcoming && result && (
                  <StatBadge variant={result} size="sm" />
                )}
              </a>
            );
          })
        )}
      </div>
    </Panel>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { getTeamCrest } from '@/lib/teamCrests';
import { Trophy } from 'lucide-react';

const BRASILEIRAO_ID = 'comp-brasileirao-serie-a';
const SEASON = '2026';

export interface StandingRow {
  id: string;
  competitionId: string;
  teamId: string;
  season: string;
  position: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: string[];
  team: {
    id: string;
    name: string;
    shortName: string;
    logoUrl: string;
  };
}

interface ClassificacaoTabProps {
  userTeamId: string | null;
}

function FormPill({ result }: { result: string }) {
  const isW = result === 'W';
  const isD = result === 'D';
  const isL = result === 'L';
  const bg = isW ? 'bg-emerald-500/90' : isD ? 'bg-zinc-500/70' : isL ? 'bg-rose-500/90' : 'bg-muted/50';
  return (
    <span
      className={`inline-flex w-[18px] h-[18px] rounded-[4px] items-center justify-center text-[10px] font-bold text-white ${bg}`}
      aria-label={isW ? 'Vitória' : isD ? 'Empate' : 'Derrota'}
    >
      {result}
    </span>
  );
}

function getZoneColor(position: number): string {
  if (position <= 4) return 'border-l-[3px] border-l-emerald-500';
  if (position >= 5 && position <= 6) return 'border-l-[3px] border-l-blue-500';
  if (position >= 17) return 'border-l-[3px] border-l-rose-500';
  return '';
}

export function ClassificacaoTab({ userTeamId }: ClassificacaoTabProps) {
  const { data, isLoading, isError } = useQuery<{
    competition: { id: string; name: string; country: string; logoUrl: string | null };
    season: string;
    standings: StandingRow[];
    updatedAt: number;
  }>({
    queryKey: ['/api/competitions', BRASILEIRAO_ID, 'standings', SEASON],
    queryFn: async () => {
      const res = await fetch(`/api/competitions/${BRASILEIRAO_ID}/standings?season=${SEASON}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Falha ao carregar classificação');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#0d1117] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/5">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">P</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">V</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">E</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">D</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">DIFF</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Gols</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last 5</th>
                <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">PTS</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="p-4"><Skeleton className="h-5 w-6" /></td>
                  <td className="p-4"><div className="flex items-center gap-3"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-4 w-24" /></div></td>
                  <td className="p-4 text-center"><Skeleton className="h-4 w-6 mx-auto" /></td>
                  <td className="p-4 text-center"><Skeleton className="h-4 w-6 mx-auto" /></td>
                  <td className="p-4 text-center"><Skeleton className="h-4 w-6 mx-auto" /></td>
                  <td className="p-4 text-center hidden md:table-cell"><Skeleton className="h-4 w-8 mx-auto" /></td>
                  <td className="p-4 text-center hidden lg:table-cell"><Skeleton className="h-4 w-12 mx-auto" /></td>
                  <td className="p-4"><div className="flex gap-1 justify-center"><Skeleton className="h-[18px] w-[18px] rounded" /><Skeleton className="h-[18px] w-[18px] rounded" /><Skeleton className="h-[18px] w-[18px] rounded" /><Skeleton className="h-[18px] w-[18px] rounded" /><Skeleton className="h-[18px] w-[18px] rounded" /></div></td>
                  <td className="p-4 text-center"><Skeleton className="h-5 w-8 mx-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#0d1117] p-12 text-center">
        <p className="text-muted-foreground">Não foi possível carregar a classificação.</p>
      </div>
    );
  }

  const { competition, standings: rows } = data;

  return (
    <div className="rounded-2xl border border-white/5 bg-[#0d1117] overflow-hidden shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-[#161b22]/50">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-amber-500/90" />
          <div>
            <h2 className="font-display font-bold text-lg text-foreground">{competition.name}</h2>
            <p className="text-sm text-muted-foreground">{competition.country} • Temporada {SEASON}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[calc(100vh-280px)] overflow-y-auto">
        <table className="w-full min-w-[640px]">
          <thead className="sticky top-0 z-10 bg-[#0d1117] border-b border-white/5">
            <tr>
              <th className="text-left py-3.5 px-3 sm:px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-10">#</th>
              <th className="text-left py-3.5 px-3 sm:px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider min-w-[140px] sm:min-w-[180px]">Time</th>
              <th className="text-center py-3.5 px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-10 hidden sm:table-cell">P</th>
              <th className="text-center py-3.5 px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-10 hidden sm:table-cell">V</th>
              <th className="text-center py-3.5 px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-10 hidden sm:table-cell">E</th>
              <th className="text-center py-3.5 px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-10 hidden sm:table-cell">D</th>
              <th className="text-center py-3.5 px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-12 hidden md:table-cell">DIFF</th>
              <th className="text-center py-3.5 px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-14 hidden lg:table-cell">Gols</th>
              <th className="text-center py-3.5 px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-[100px] sm:w-[110px]">Last 5</th>
              <th className="text-center py-3.5 px-3 sm:px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-12">PTS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isUserTeam = userTeamId === row.teamId;
              const zoneClass = getZoneColor(row.position);
              return (
                <tr
                  key={row.id}
                  className={`border-b border-white/5 transition-colors duration-150 hover:bg-white/[0.03] ${zoneClass} ${
                    isUserTeam ? 'bg-primary/5 hover:bg-primary/8' : ''
                  }`}
                >
                  <td className="py-3.5 px-3 sm:px-4">
                    <span className={`font-bold tabular-nums ${isUserTeam ? 'text-primary' : 'text-foreground'}`}>
                      {row.position}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={getTeamCrest(row.team.id)}
                        alt=""
                        className="h-8 w-8 object-contain shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/crests/default.png';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <span className={`font-medium truncate block ${isUserTeam ? 'text-foreground font-semibold' : 'text-foreground'}`}>
                          {row.team.name}
                        </span>
                        {isUserTeam && (
                          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                            Seu time
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-center text-foreground tabular-nums text-sm hidden sm:table-cell">{row.played}</td>
                  <td className="py-3.5 px-2 text-center text-emerald-400 font-semibold tabular-nums text-sm hidden sm:table-cell">{row.wins}</td>
                  <td className="py-3.5 px-2 text-center text-amber-400/90 font-semibold tabular-nums text-sm hidden sm:table-cell">{row.draws}</td>
                  <td className="py-3.5 px-2 text-center text-rose-400/90 font-semibold tabular-nums text-sm hidden sm:table-cell">{row.losses}</td>
                  <td className={`py-3.5 px-2 text-center font-semibold tabular-nums text-sm hidden md:table-cell ${
                    row.goalDiff > 0 ? 'text-emerald-400' : row.goalDiff < 0 ? 'text-rose-400/90' : 'text-muted-foreground'
                  }`}>
                    {row.goalDiff > 0 ? '+' : ''}{row.goalDiff}
                  </td>
                  <td className="py-3.5 px-2 text-center text-muted-foreground tabular-nums text-sm hidden lg:table-cell">
                    {row.goalsFor}:{row.goalsAgainst}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex gap-1 justify-center">
                      {(row.form ?? []).slice(0, 5).map((r, i) => (
                        <FormPill key={i} result={r} />
                      ))}
                      {(!row.form || row.form.length < 5) &&
                        Array.from({ length: 5 - (row.form?.length ?? 0) }).map((_, i) => (
                          <span
                            key={`empty-${i}`}
                            className="inline-flex w-[18px] h-[18px] rounded-[4px] border border-dashed border-white/10 items-center justify-center text-[10px] text-muted-foreground"
                          >
                            —
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-center">
                    <span className={`font-bold tabular-nums text-sm ${isUserTeam ? 'text-primary' : 'text-foreground'}`}>
                      {row.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-white/5 bg-[#161b22]/30 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Libertadores
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Pré-Libertadores
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Zona de rebaixamento
        </span>
      </div>
    </div>
  );
}

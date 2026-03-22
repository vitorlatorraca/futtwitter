'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getTeamCrest } from '@/lib/teamCrests';
import { RotateCcw, FlaskConical, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { StandingRow } from './ClassificacaoTab';

const BRASILEIRAO_ID = 'comp-brasileirao-serie-a';
const SEASON = '2026';

interface Fixture {
  id: string;
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  round: number | null;
  matchDate: string;
}

interface SimScore {
  home: number | null;
  away: number | null;
}

interface ProjectedRow {
  teamId: string;
  teamName: string;
  teamShortName: string;
  position: number;
  originalPosition: number;
  positionChange: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

function PositionBadge({ change }: { change: number }) {
  if (change > 0)
    return (
      <span className="text-success font-bold text-[10px] flex items-center gap-0.5 leading-none">
        <TrendingUp className="h-3 w-3" />+{change}
      </span>
    );
  if (change < 0)
    return (
      <span className="text-rose-500 font-bold text-[10px] flex items-center gap-0.5 leading-none">
        <TrendingDown className="h-3 w-3" />{change}
      </span>
    );
  return (
    <span className="text-muted-foreground text-[10px] leading-none">
      <Minus className="h-3 w-3 inline" />
    </span>
  );
}

function ScoreInput({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      max={99}
      value={value ?? ''}
      placeholder="–"
      onChange={(e) => {
        const v = e.target.value;
        if (v === '') {
          onChange(null);
          return;
        }
        const n = parseInt(v, 10);
        if (!isNaN(n) && n >= 0 && n <= 99) onChange(n);
      }}
      className="w-10 h-9 text-center text-base font-bold bg-surface-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
}

function getZoneClass(position: number): string {
  if (position <= 4) return 'border-l-[3px] border-l-success';
  if (position <= 6) return 'border-l-[3px] border-l-blue-500';
  if (position >= 17) return 'border-l-[3px] border-l-rose-500';
  return '';
}

interface SimulacaoTabProps {
  userTeamId: string | null;
}

export function SimulacaoTab({ userTeamId }: SimulacaoTabProps) {
  const [simScores, setSimScores] = useState<Record<string, SimScore>>({});

  // ── Current standings ──────────────────────────────────────────────────────
  const { data: standingsData, isLoading: loadingStandings } = useQuery<{
    standings: StandingRow[];
  }>({
    queryKey: ['/api/competitions', BRASILEIRAO_ID, 'standings', SEASON],
    queryFn: async () => {
      const res = await fetch(
        getApiUrl(`/api/competitions/${BRASILEIRAO_ID}/standings?season=${SEASON}`),
        { credentials: 'include' },
      );
      if (!res.ok) throw new Error('Falha ao carregar classificação');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // ── Upcoming fixtures ──────────────────────────────────────────────────────
  const { data: fixturesData, isLoading: loadingFixtures } = useQuery<{
    fixtures: Fixture[];
  }>({
    queryKey: ['/api/competitions', BRASILEIRAO_ID, 'upcoming-fixtures'],
    queryFn: async () => {
      const res = await fetch(
        getApiUrl(`/api/competitions/${BRASILEIRAO_ID}/upcoming-fixtures`),
        { credentials: 'include' },
      );
      if (!res.ok) throw new Error('Falha ao carregar jogos');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const currentStandings = standingsData?.standings ?? [];
  const fixtures = fixturesData?.fixtures ?? [];

  // ── Projected standings computation ───────────────────────────────────────
  const projectedStandings = useMemo((): ProjectedRow[] => {
    if (!currentStandings.length) return [];

    // Clone current standings as mutable map keyed by teamId
    const map: Record<
      string,
      {
        teamId: string;
        teamName: string;
        teamShortName: string;
        points: number;
        played: number;
        wins: number;
        draws: number;
        losses: number;
        goalsFor: number;
        goalsAgainst: number;
        originalPosition: number;
      }
    > = {};

    for (const row of currentStandings) {
      map[row.teamId] = {
        teamId: row.teamId,
        teamName: row.team.name,
        teamShortName: row.team.shortName,
        points: row.points,
        played: row.played,
        wins: row.wins,
        draws: row.draws,
        losses: row.losses,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        originalPosition: row.position,
      };
    }

    // Apply simulated results
    for (const fixture of fixtures) {
      const score = simScores[fixture.id];
      if (score?.home == null || score?.away == null) continue;

      const home = map[fixture.homeTeamId];
      const away = map[fixture.awayTeamId];
      if (!home || !away) continue;

      home.played += 1;
      away.played += 1;
      home.goalsFor += score.home;
      home.goalsAgainst += score.away;
      away.goalsFor += score.away;
      away.goalsAgainst += score.home;

      if (score.home > score.away) {
        home.wins += 1;
        home.points += 3;
        away.losses += 1;
      } else if (score.home === score.away) {
        home.draws += 1;
        home.points += 1;
        away.draws += 1;
        away.points += 1;
      } else {
        away.wins += 1;
        away.points += 3;
        home.losses += 1;
      }
    }

    // Re-sort by points → goal diff → goals for
    const sorted = Object.values(map).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.goalsFor - a.goalsAgainst;
      const gdB = b.goalsFor - b.goalsAgainst;
      if (gdB !== gdA) return gdB - gdA;
      return b.goalsFor - a.goalsFor;
    });

    return sorted.map((t, i) => ({
      ...t,
      position: i + 1,
      positionChange: t.originalPosition - (i + 1), // positive = moved up
    }));
  }, [currentStandings, fixtures, simScores]);

  const simulatedCount = Object.values(simScores).filter(
    (s) => s.home !== null && s.away !== null,
  ).length;

  const setScore = (fixtureId: string, field: 'home' | 'away', value: number | null) => {
    setSimScores((prev) => ({
      ...prev,
      [fixtureId]: { ...prev[fixtureId], [field]: value },
    }));
  };

  const handleReset = () => setSimScores({});

  const isLoading = loadingStandings || loadingFixtures;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Skeleton className="h-[600px] rounded-2xl" />
          <Skeleton className="h-[600px] rounded-2xl" />
        </div>
      </div>
    );
  }

  const roundLabel =
    fixtures.length > 0 && fixtures[0].round != null
      ? `Rodada ${fixtures[0].round}`
      : 'Próximos Jogos';

  return (
    <div className="space-y-4">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <FlaskConical className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">Modo Simulação</h2>
            <p className="text-sm text-muted-foreground">
              Simule resultados e veja a tabela projetada em tempo real
            </p>
          </div>
        </div>
        {simulatedCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 shrink-0">
            <RotateCcw className="h-4 w-4" />
            Resetar simulação
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-5 items-start">
        {/* ── Fixtures panel ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-surface-card overflow-hidden shadow-xl">
          <div className="p-4 border-b border-border bg-surface-elevated/50">
            <h3 className="font-bold text-base text-foreground">{roundLabel}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {simulatedCount === 0
                ? 'Digite os placares para simular'
                : `${simulatedCount} de ${fixtures.length} jogo${simulatedCount !== 1 ? 's' : ''} simulado${simulatedCount !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="divide-y divide-border">
            {fixtures.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground text-sm">
                Nenhum jogo agendado encontrado.
              </div>
            ) : (
              fixtures.map((fixture) => {
                const score = simScores[fixture.id] ?? { home: null, away: null };
                const isSimulated = score.home !== null && score.away !== null;
                const isUserMatch =
                  userTeamId === fixture.homeTeamId || userTeamId === fixture.awayTeamId;

                return (
                  <div
                    key={fixture.id}
                    className={`px-3 py-3.5 sm:px-4 transition-colors ${
                      isSimulated
                        ? 'bg-primary/5'
                        : isUserMatch
                        ? 'bg-amber-500/5'
                        : 'hover:bg-surface-elevated/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Home team */}
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 justify-end">
                        <span
                          className={`font-semibold text-sm truncate text-right ${
                            userTeamId === fixture.homeTeamId
                              ? 'text-primary'
                              : 'text-foreground'
                          }`}
                        >
                          {fixture.homeTeamName}
                        </span>
                        <img
                          src={getTeamCrest(fixture.homeTeamId)}
                          alt=""
                          className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/crests/default.png';
                          }}
                        />
                      </div>

                      {/* Score inputs */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <ScoreInput
                          value={score.home}
                          onChange={(v) => setScore(fixture.id, 'home', v)}
                        />
                        <span className="text-muted-foreground font-bold text-sm select-none">
                          ×
                        </span>
                        <ScoreInput
                          value={score.away}
                          onChange={(v) => setScore(fixture.id, 'away', v)}
                        />
                      </div>

                      {/* Away team */}
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                        <img
                          src={getTeamCrest(fixture.awayTeamId)}
                          alt=""
                          className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/crests/default.png';
                          }}
                        />
                        <span
                          className={`font-semibold text-sm truncate ${
                            userTeamId === fixture.awayTeamId
                              ? 'text-primary'
                              : 'text-foreground'
                          }`}
                        >
                          {fixture.awayTeamName}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Projected standings panel ────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-surface-card overflow-hidden shadow-xl">
          <div className="p-4 border-b border-border bg-surface-elevated/50">
            <h3 className="font-bold text-base text-foreground">
              {simulatedCount > 0 ? 'Classificação Projetada' : 'Classificação Atual'}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {simulatedCount > 0
                ? `Projeção com ${simulatedCount} resultado${simulatedCount !== 1 ? 's' : ''} simulado${simulatedCount !== 1 ? 's' : ''}`
                : 'Simule resultados para ver a projeção'}
            </p>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full min-w-[380px]">
              <thead className="sticky top-0 z-10 bg-surface-card border-b border-border">
                <tr>
                  <th className="text-left py-3 px-3 text-[11px] font-semibold text-muted-foreground tracking-wider w-14">
                    #
                  </th>
                  <th className="text-left py-3 px-2 text-[11px] font-semibold text-muted-foreground tracking-wider">
                    Time
                  </th>
                  <th className="text-center py-3 px-2 text-[11px] font-semibold text-muted-foreground tracking-wider w-8 hidden sm:table-cell">
                    P
                  </th>
                  <th className="text-center py-3 px-2 text-[11px] font-semibold text-muted-foreground tracking-wider w-8 hidden sm:table-cell">
                    V
                  </th>
                  <th className="text-center py-3 px-2 text-[11px] font-semibold text-muted-foreground tracking-wider w-8 hidden sm:table-cell">
                    E
                  </th>
                  <th className="text-center py-3 px-2 text-[11px] font-semibold text-muted-foreground tracking-wider w-8 hidden sm:table-cell">
                    D
                  </th>
                  <th className="text-center py-3 px-2 text-[11px] font-semibold text-muted-foreground tracking-wider w-12 hidden md:table-cell">
                    DG
                  </th>
                  <th className="text-center py-3 px-3 text-[11px] font-semibold text-muted-foreground tracking-wider w-12">
                    PTS
                  </th>
                </tr>
              </thead>
              <tbody>
                {projectedStandings.map((row) => {
                  const isUser = userTeamId === row.teamId;
                  const zoneClass = getZoneClass(row.position);
                  const gd = row.goalsFor - row.goalsAgainst;

                  return (
                    <tr
                      key={row.teamId}
                      className={`border-b border-border transition-colors duration-150 hover:bg-surface-elevated/50 ${zoneClass} ${
                        isUser ? 'bg-primary/5 hover:bg-primary/8' : ''
                      }`}
                    >
                      {/* Position + change indicator */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col items-center gap-0.5">
                          <span
                            className={`font-bold tabular-nums text-sm ${
                              isUser ? 'text-primary' : 'text-foreground'
                            }`}
                          >
                            {row.position}
                          </span>
                          {simulatedCount > 0 && (
                            <PositionBadge change={row.positionChange} />
                          )}
                        </div>
                      </td>

                      {/* Team */}
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={getTeamCrest(row.teamId)}
                            alt=""
                            className="h-6 w-6 sm:h-7 sm:w-7 object-contain shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/crests/default.png';
                            }}
                          />
                          <div className="min-w-0">
                            <span
                              className={`text-sm font-medium truncate block ${
                                isUser ? 'font-semibold' : ''
                              } text-foreground`}
                            >
                              {row.teamShortName}
                            </span>
                            {isUser && (
                              <span className="text-[10px] font-semibold text-primary tracking-wider">
                                Seu time
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-2 text-center text-sm tabular-nums text-foreground hidden sm:table-cell">
                        {row.played}
                      </td>
                      <td className="py-3 px-2 text-center text-sm tabular-nums font-semibold text-success hidden sm:table-cell">
                        {row.wins}
                      </td>
                      <td className="py-3 px-2 text-center text-sm tabular-nums font-semibold text-amber-400/90 hidden sm:table-cell">
                        {row.draws}
                      </td>
                      <td className="py-3 px-2 text-center text-sm tabular-nums font-semibold text-rose-400/90 hidden sm:table-cell">
                        {row.losses}
                      </td>
                      <td
                        className={`py-3 px-2 text-center text-sm tabular-nums font-semibold hidden md:table-cell ${
                          gd > 0
                            ? 'text-success'
                            : gd < 0
                            ? 'text-rose-400/90'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {gd > 0 ? '+' : ''}
                        {gd}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-bold tabular-nums text-sm ${
                            isUser ? 'text-primary' : 'text-foreground'
                          }`}
                        >
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
          <div className="p-3 border-t border-border bg-surface-elevated/30 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success" />
              Libertadores
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Pré-Libertadores
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Rebaixamento
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

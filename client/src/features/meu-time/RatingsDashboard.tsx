'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, TrendingUp, Calendar, Layers, Users, Star } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ByMonth {
  month: string;
  avgRating: number;
  votes: number;
}

interface ByCompetition {
  competition: string;
  avgRating: number;
  votes: number;
}

interface TopPlayer {
  playerId: string;
  name: string;
  photoUrl: string | null;
  position: string | null;
  sector: string | null;
  avgRating: number;
  votes: number;
}

interface RecentMatch {
  matchId: string;
  opponent: string;
  matchDate: string | null;
  competition: string | null;
  teamScore: number | null;
  opponentScore: number | null;
  avgRating: number;
  votes: number;
}

interface AnalyticsData {
  byMonth: ByMonth[];
  byCompetition: ByCompetition[];
  topPlayers: TopPlayer[];
  recentMatches: RecentMatch[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ratingColor(r: number): string {
  if (r >= 7.5) return '#22c55e';
  if (r >= 6.5) return '#f59e0b';
  return '#f43f5e';
}

function formatMonth(m: string): string {
  const [year, month] = m.split('-');
  const names = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${names[parseInt(month, 10) - 1]}/${year.slice(2)}`;
}

// ─── Section card ─────────────────────────────────────────────────────────────

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-surface-elevated/50 flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h3 className="font-bold text-sm text-foreground">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface RatingsDashboardProps {
  teamId: string;
}

export function RatingsDashboard({ teamId }: RatingsDashboardProps) {
  const [months, setMonths] = useState(6);

  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/teams', teamId, 'ratings/analytics', months],
    queryFn: async () => {
      const res = await fetch(
        getApiUrl(`/api/teams/${teamId}/ratings/analytics?months=${months}`),
        { credentials: 'include' },
      );
      if (!res.ok) throw new Error('Falha ao carregar analytics');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!teamId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const hasData =
    (data?.byMonth.length ?? 0) > 0 ||
    (data?.topPlayers.length ?? 0) > 0 ||
    (data?.recentMatches.length ?? 0) > 0;

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }) : '—';

  return (
    <div className="space-y-5">
      {/* Period filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-foreground-secondary font-medium">Período:</span>
        {[3, 6, 12].map((m) => (
          <button
            key={m}
            onClick={() => setMonths(m)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              months === m
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface-elevated text-foreground hover:bg-surface-elevated/70'
            }`}
          >
            {m} meses
          </button>
        ))}
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-border bg-surface-card text-center px-6">
          <Star className="h-10 w-10 text-foreground/20 mb-3" />
          <p className="font-semibold text-foreground">Sem dados de notas ainda</p>
          <p className="text-sm text-foreground-secondary mt-1">
            Avalie os jogadores na aba "Última Partida" para ver as estatísticas aqui.
          </p>
        </div>
      ) : (
        <>
          {/* Monthly chart */}
          {(data?.byMonth.length ?? 0) > 0 && (
            <Section icon={<TrendingUp className="h-4 w-4" />} title="Média por mês">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data!.byMonth} barSize={28}>
                  <XAxis
                    dataKey="month"
                    tickFormatter={formatMonth}
                    tick={{ fontSize: 11, fill: 'var(--foreground-secondary, #888)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                    tick={{ fontSize: 10, fill: 'var(--foreground-secondary, #888)' }}
                    axisLine={false}
                    tickLine={false}
                    width={24}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v.toFixed(1)}/10`, 'Média']}
                    labelFormatter={formatMonth}
                    contentStyle={{ background: 'var(--surface-card, #111)', border: '1px solid var(--border, #333)', borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="avgRating" radius={[4, 4, 0, 0]}>
                    {data!.byMonth.map((entry, i) => (
                      <Cell key={i} fill={ratingColor(entry.avgRating)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Section>
          )}

          {/* By competition */}
          {(data?.byCompetition.length ?? 0) > 0 && (
            <Section icon={<Layers className="h-4 w-4" />} title="Por competição">
              <div className="space-y-3">
                {data!.byCompetition.map((c) => (
                  <div key={c.competition} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground truncate">{c.competition}</span>
                        <span className="text-sm font-bold tabular-nums ml-2" style={{ color: ratingColor(c.avgRating) }}>
                          {c.avgRating.toFixed(1)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${(c.avgRating / 10) * 100}%`, background: ratingColor(c.avgRating) }}
                        />
                      </div>
                      <p className="text-[11px] text-foreground-secondary mt-0.5 flex items-center gap-1">
                        <Users className="h-2.5 w-2.5" />
                        {c.votes} voto{c.votes !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Top players */}
          {(data?.topPlayers.length ?? 0) > 0 && (
            <Section icon={<Trophy className="h-4 w-4" />} title="Jogadores mais bem avaliados">
              <div className="space-y-2">
                {data!.topPlayers.map((p, i) => (
                  <div key={p.playerId} className="flex items-center gap-3">
                    <span className="text-sm font-bold tabular-nums text-foreground-secondary w-5 text-center">
                      {i + 1}
                    </span>
                    <img
                      src={p.photoUrl ?? '/assets/players/placeholder.png'}
                      alt={p.name}
                      className="h-9 w-9 rounded-full object-cover border border-border shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/assets/players/placeholder.png'; }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate leading-tight">{p.name}</p>
                      <p className="text-[11px] text-foreground-secondary">
                        {p.position ?? '—'} · {p.votes} voto{p.votes !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div
                      className="shrink-0 font-extrabold text-base tabular-nums"
                      style={{ color: ratingColor(p.avgRating) }}
                    >
                      {p.avgRating.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Recent matches */}
          {(data?.recentMatches.length ?? 0) > 0 && (
            <Section icon={<Calendar className="h-4 w-4" />} title="Notas por partida">
              <div className="space-y-2">
                {data!.recentMatches.map((m) => (
                  <div key={m.matchId} className="flex items-center gap-3 py-1">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground truncate">
                          vs {m.opponent}
                        </span>
                        {m.teamScore != null && m.opponentScore != null && (
                          <span className="text-xs text-foreground-secondary tabular-nums shrink-0">
                            {m.teamScore}–{m.opponentScore}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-foreground-secondary">
                        {formatDate(m.matchDate)}
                        {m.competition ? ` · ${m.competition}` : ''}
                        {' · '}{m.votes} voto{m.votes !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div
                      className="shrink-0 font-extrabold text-base tabular-nums"
                      style={{ color: ratingColor(m.avgRating) }}
                    >
                      {m.avgRating.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </>
      )}
    </div>
  );
}

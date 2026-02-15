"use client";

import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Panel, SectionHeader, LoadingSkeleton } from "@/components/ui-premium";
import { ChevronRight } from "lucide-react";
import { getResultForTeam } from "./matchUtils";
import type { TeamMatch } from "./types";

interface MatchesCardProps {
  teamId: string;
  teamName: string;
}

export function MatchesCard({ teamId, teamName }: MatchesCardProps) {
  const { data, isLoading } = useQuery<{ matches: TeamMatch[] }>({
    queryKey: ["/api/teams", teamId, "matches", "all", 30],
    queryFn: async () => {
      const res = await fetch(`/api/teams/${teamId}/matches?type=all&limit=30`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!teamId,
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Panel padding="sm">
        <SectionHeader title="Jogos" />
        <LoadingSkeleton variant="list" className="mt-3" />
      </Panel>
    );
  }

  const matches = data?.matches ?? [];
  const recent = matches
    .filter((m) => m.status === "FT")
    .sort((a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime())
    .slice(0, 5);

  return (
    <Panel padding="sm" className="rounded-2xl border-white/10 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/40">
      <div className="flex items-center justify-between">
        <SectionHeader title="Jogos" />
        <Link href="/meu-time/jogos" className="text-xs font-medium text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors">
          Ver todos
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="space-y-2 mt-3">
        {recent.length > 0 ? (
          <div className="space-y-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Últimos resultados</div>
            {recent.map((m) => {
              const result = getResultForTeam(m, teamId);
              const rating = m.teamRating;
              const scoreStr = m.homeScore != null && m.awayScore != null
                ? `${m.homeScore}–${m.awayScore}`
                : '–';
              return (
                <Link key={m.id} href="/meu-time/jogos" className="flex items-center gap-3 py-2.5 px-2.5 rounded-lg hover:bg-muted/40 transition-all duration-200 group">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">
                      {m.homeTeamName} <span className="font-bold font-mono text-foreground/90 mx-0.5">{scoreStr}</span> {m.awayTeamName}
                    </div>
                    <div className="text-[10px] text-muted-foreground/80 mt-0.5">
                      {m.competition.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {rating != null ? (
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded min-w-[2rem] text-center",
                          rating >= 7.5 && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                          rating >= 6.8 && rating < 7.5 && "bg-muted text-muted-foreground",
                          rating < 6.8 && "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        )}
                      >
                        {rating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground px-1.5">—</span>
                    )}
                    {result && (
                      <span className={cn(
                        "text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                        result === 'W' && "bg-emerald-500/25 text-emerald-500",
                        result === 'D' && "bg-muted/60 text-muted-foreground",
                        result === 'L' && "bg-red-500/25 text-red-500"
                      )}>
                        {result}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-white/10 bg-muted/20">
            <div className="text-4xl mb-2 opacity-40">⚽</div>
            <p className="text-xs text-muted-foreground text-center font-medium">
              Nenhum jogo encontrado
            </p>
            <p className="text-[10px] text-muted-foreground/80 text-center mt-0.5">
              Os resultados aparecerão aqui
            </p>
            <Link href="/meu-time/jogos" className="mt-3 text-xs font-medium text-emerald-500 hover:text-emerald-400">
              Ver calendário
            </Link>
          </div>
        )}
      </div>
    </Panel>
  );
}

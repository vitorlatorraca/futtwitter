"use client";

import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { getApiUrl } from "@/lib/queryClient";
import { Panel, SectionHeader, LoadingSkeleton } from "@/components/ui-premium";
import { ChevronRight } from "lucide-react";
import { getResultForTeam } from "./matchUtils";
import type { TeamMatch } from "./types";
import { formatRating, getRatingPillClass } from "@/lib/ratingUtils";

interface MatchesCardProps {
  teamId: string;
  teamName: string;
  /** Quando true, renderiza só o conteúdo (lista) sem Panel/header — para uso dentro de MyTeamCard */
  embed?: boolean;
  /** Quando true, usa matches+isLoading do overview (fonte única com Performance). Query desabilitada. */
  overviewMode?: boolean;
  /** Com overviewMode: jogos do overview (mesma fonte que Performance) */
  matches?: TeamMatch[] | null;
  /** Com overviewMode: loading do overview */
  isLoading?: boolean;
}

export function MatchesCard({ teamId, teamName, embed, overviewMode, matches: matchesProp, isLoading: isLoadingProp }: MatchesCardProps) {
  const { data, isLoading } = useQuery<{ matches: TeamMatch[] }>({
    queryKey: ["/api/teams", teamId, "matches", "all", 30],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/teams/${teamId}/matches?type=all&limit=30`), {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!teamId && !overviewMode,
    staleTime: 2 * 60 * 1000,
  });

  const matches = overviewMode ? (matchesProp ?? []) : (data?.matches ?? []);
  const showLoading = overviewMode ? (isLoadingProp ?? false) : isLoading;
  const recent = matches
    .filter((m) => m.status === "FT")
    .sort((a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime())
    .slice(0, 5);

  const listContent = (
    <div className="space-y-2">
      {recent.length > 0 ? (
        <>
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
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded min-w-[2rem] text-center tabular-nums",
                        getRatingPillClass(rating)
                      )}
                    >
                      {formatRating(rating)}
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
        </>
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
  );

  if (embed) {
    return (
      <div className="px-4 sm:px-5 py-3 flex-1 min-h-0 overflow-auto">
        {showLoading ? (
          <LoadingSkeleton variant="list" className="mt-1" />
        ) : (
          listContent
        )}
      </div>
    );
  }

  if (showLoading) {
    return (
      <Panel padding="sm" className="rounded-2xl border-white/10 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/40">
        <div className="flex items-center justify-between">
          <SectionHeader title="Jogos" />
          <Link href="/meu-time/jogos" className="text-xs font-medium text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors">
            Ver todos
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <LoadingSkeleton variant="list" className="mt-3" />
      </Panel>
    );
  }

  return (
    <Panel padding="sm" className="rounded-2xl border-white/10 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/40">
      <div className="flex items-center justify-between">
        <SectionHeader title="Jogos" />
        <Link href="/meu-time/jogos" className="text-xs font-medium text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors">
          Ver todos
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="mt-3">{listContent}</div>
    </Panel>
  );
}

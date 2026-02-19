"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { getApiUrl } from "@/lib/queryClient";
import { AppShell } from "@/components/ui/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeamMatches } from "./useTeamMatches";
import { MatchRow } from "./MatchRow";
import { CompetitionDivider } from "./CompetitionDivider";
import { MatchesFilters } from "./MatchesFilters";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import type { TeamMatch, MatchFilter } from "./types";

function groupByCompetition(matches: TeamMatch[]): Array<{ competition: string; matches: TeamMatch[] }> {
  const map = new Map<string, TeamMatch[]>();
  for (const m of matches) {
    const name = m.competition.name;
    if (!map.has(name)) map.set(name, []);
    map.get(name)!.push(m);
  }
  return Array.from(map.entries()).map(([competition, matches]) => ({ competition, matches }));
}

export function MatchesPage() {
  const { user } = useAuth();
  const teamId = user?.teamId ?? null;
  const [filter, setFilter] = useState<MatchFilter>("all");

  const { data, isLoading, isError } = useTeamMatches({
    teamId,
    filter,
    limit: 50,
  });

  const teamsQuery = useQuery({
    queryKey: ["/api/teams"],
    queryFn: async () => {
      const res = await fetch(getApiUrl("/api/teams"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!teamId,
  });

  const teamName = teamsQuery.data?.find((t: { id: string }) => t.id === teamId)?.name ?? "";
  const matches = data?.matches ?? [];
  const grouped = useMemo(() => groupByCompetition(matches), [matches]);

  if (!user) {
    return (
      <AppShell>
        <EmptyState
          title="Você precisa estar logado"
          description="Faça login para ver os jogos do seu time."
          actionLabel="Ir para login"
          onAction={() => (window.location.href = "/login")}
        />
      </AppShell>
    );
  }

  if (!teamId) {
    return (
      <AppShell>
        <EmptyState
          title="Escolha um time"
          description="Selecione um time no seu perfil para ver os jogos."
        />
      </AppShell>
    );
  }

  return (
    <AppShell mainClassName="py-4 sm:py-6 px-4 sm:px-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/meu-time" className="p-2 rounded-lg hover:bg-muted/60 transition-colors inline-flex">
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Jogos</h1>
            <p className="text-sm text-foreground-secondary">Fixtures e resultados do seu time</p>
          </div>
        </div>

        <div className="mb-6">
          <MatchesFilters value={filter} onChange={setFilter} />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            title="Erro ao carregar"
            description="Não foi possível carregar os jogos. Tente novamente."
          />
        ) : matches.length === 0 ? (
          <EmptyState
            title="Nenhum jogo encontrado"
            description="Não há jogos para exibir com o filtro selecionado."
          />
        ) : (
          <div className="space-y-1">
            {grouped.map(({ competition, matches: compMatches }) => (
              <div key={competition}>
                <CompetitionDivider name={competition} />
                <div className="space-y-1">
                  {compMatches.map((match) => (
                    <MatchRow
                      key={match.id}
                      match={match}
                      teamId={teamId}
                      teamName={teamName}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

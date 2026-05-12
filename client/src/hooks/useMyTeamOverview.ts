import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { getApiUrl } from "@/lib/queryClient";
import type { TeamMatch } from "@/features/team/matches/types";

export interface MyTeamOverviewMatch {
  id: string;
  date: string;
  home: { id: string; name: string };
  away: { id: string; name: string };
  score: { home: number; away: number };
  resultForTeam: "W" | "D" | "L";
  competition: string | null;
  teamRating: number | null;
}

export interface MyTeamOverviewStandings {
  position: number;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalDiff: number;
  leaderPoints?: number | null;
  z4Points?: number | null;
}

export interface MyTeamOverview {
  team: { id: string; name: string; slug: string } | null;
  standings: MyTeamOverviewStandings | null;
  lastMatches: MyTeamOverviewMatch[];
  form: ("W" | "D" | "L")[];
  updatedAt: number;
}

/** Converte lastMatches do overview para TeamMatch[] (para MatchesCard) */
export function overviewMatchesToTeamMatch(
  lastMatches: MyTeamOverviewMatch[]
): TeamMatch[] {
  return lastMatches.map((m) => ({
    id: m.id,
    status: "FT" as const,
    kickoffAt: m.date,
    homeTeamName: m.home.name,
    awayTeamName: m.away.name,
    homeTeamId: m.home.id || null,
    awayTeamId: m.away.id || null,
    homeScore: m.score.home,
    awayScore: m.score.away,
    round: null,
    venue: null,
    competition: { name: m.competition ?? "TBD", logoUrl: null },
    teamRating: m.teamRating ?? null,
  }));
}

export function useMyTeamOverview() {
  const { user } = useAuth();
  const teamId = user?.teamId ?? null;

  return useQuery<MyTeamOverview>({
    queryKey: ["/api/my-team/overview"],
    queryFn: async () => {
      const res = await fetch(getApiUrl("/api/my-team/overview"), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch overview");
      return res.json();
    },
    enabled: !!teamId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

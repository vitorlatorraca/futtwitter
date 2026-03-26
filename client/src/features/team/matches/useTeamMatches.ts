import { useQuery } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/queryClient";
import type { TeamMatch, MatchFilter } from "./types";

interface UseTeamMatchesOptions {
  teamId: string | null;
  filter?: MatchFilter;
  limit?: number;
}

export function useTeamMatches({ teamId, filter = "all", limit = 20 }: UseTeamMatchesOptions) {
  const type = filter === "all" ? "all" : filter === "upcoming" ? "upcoming" : "recent";

  return useQuery<{ matches: TeamMatch[] }>({
    queryKey: ["/api/teams", teamId, "matches", type, limit],
    queryFn: async () => {
      if (!teamId) throw new Error("No team selected");
      const params = new URLSearchParams({ type, limit: String(limit) });
      const res = await fetch(getApiUrl(`/api/teams/${teamId}/matches?${params}`), {
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch matches: ${text}`);
      }
      return res.json();
    },
    enabled: !!teamId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

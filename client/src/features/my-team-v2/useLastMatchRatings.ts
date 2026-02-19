import { useQuery } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/queryClient";

export type PositionGroup = "GK" | "DEF" | "MID" | "ATT" | "UNK";

export interface LastMatchRating {
  playerId: string;
  playerName: string;
  shirtNumber: number | null;
  minutes: number;
  rating: number;
  positionCode: string | null;
  primaryPosition: string | null;
  group: PositionGroup;
  photoUrl: string | null;
}

export interface LastMatchRatingsData {
  match: {
    matchId: string;
    kickoffAt: string;
    competitionName: string;
    homeTeamName: string;
    awayTeamName: string;
    homeScore: number | null;
    awayScore: number | null;
  };
  playerRatings: LastMatchRating[];
}

export function useLastMatchRatings(teamId: string | null) {
  return useQuery<LastMatchRatingsData | null>({
    queryKey: ["/api/teams", teamId, "last-match", "ratings"],
    queryFn: async () => {
      if (!teamId) return null;
      const res = await fetch(getApiUrl(`/api/teams/${teamId}/last-match/ratings`), {
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.match) return null;
      return data as LastMatchRatingsData;
    },
    enabled: !!teamId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

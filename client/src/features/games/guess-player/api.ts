import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/queryClient";

export interface PlayerOfTheDayData {
  dateKey: string;
  player: {
    id: string;
    photoUrl: string | null;
    position: string;
    shirtNumber: number | null;
    name?: string;
  };
  progress: {
    attempts: number;
    wrongAttempts: number;
    guessed: boolean;
    lost: boolean;
    guesses: Array<{ text: string; correct: boolean }>;
    blurPercent: number;
    attemptsLeft: number;
  };
  status: "playing" | "won" | "lost";
}

export interface GuessResult {
  correct: boolean;
  feedback: "correct" | "close" | "wrong";
  status: "playing" | "won" | "lost";
  wrongAttempts: number;
  blurPercent: number;
  attemptsLeft: number;
  revealName?: string;
}

export interface PlayerSearchResult {
  id: string;
  name: string;
  photoUrl: string | null;
  position: string;
}

export const playerOfTheDayKey = ["games", "player-of-the-day"] as const;
export const playerSearchKey = (q: string) => ["games", "players", "search", q] as const;

export function usePlayerOfTheDay() {
  return useQuery<PlayerOfTheDayData>({
    queryKey: playerOfTheDayKey,
    queryFn: async () => {
      const res = await fetch(getApiUrl("/api/games/player-of-the-day"), {
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? "Erro ao buscar jogador do dia");
      }
      return res.json();
    },
  });
}

export function usePlayerSearch(query: string) {
  return useQuery<PlayerSearchResult[]>({
    queryKey: playerSearchKey(query),
    queryFn: async () => {
      const res = await fetch(
        getApiUrl(`/api/games/players/search?q=${encodeURIComponent(query)}`),
        { credentials: "include" }
      );
      if (!res.ok) return [];
      return res.json();
    },
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
}

export function useGuessPlayerOfTheDay() {
  const queryClient = useQueryClient();
  return useMutation<GuessResult, Error, string>({
    mutationFn: async (guess: string) => {
      const res = await fetch(getApiUrl("/api/games/player-of-the-day/guess"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ guess }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? "Erro ao processar palpite");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: playerOfTheDayKey });
    },
  });
}

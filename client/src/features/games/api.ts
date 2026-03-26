import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/queryClient";

export interface GameSetSummary {
  id: string;
  slug: string;
  title: string;
  season: number | null;
  competition: string | null;
  clubName: string;
  playerCount: number;
}

export interface GameSetPlayer {
  id: string;
  jerseyNumber: number | null;
  displayName: string;
  sortOrder: number;
}

export interface GameSetDetail {
  id: string;
  slug: string;
  title: string;
  season: number | null;
  competition: string | null;
  clubName: string;
  players: GameSetPlayer[];
}

export interface StartAttemptResult {
  attemptId: string;
  guessedIds: string[];
}

export interface AttemptDetail {
  id: string;
  status: string;
  guessedIds: string[];
  set: {
    slug: string;
    title: string;
    players: GameSetPlayer[];
  };
}

export interface GuessMatchResult {
  matched: true;
  setPlayerId: string;
  displayName: string;
  jerseyNumber: number | null;
  score: number;
}

export interface GuessNoMatchResult {
  matched: false;
  reason?: "already_guessed" | "no_match";
}

export type GuessResult = GuessMatchResult | GuessNoMatchResult;

export const gamesSetsQueryKey = ["games", "sets"] as const;
export const gamesSetQueryKey = (slug: string) => ["games", "sets", slug] as const;
export const gamesAttemptQueryKey = (attemptId: string) => ["games", "attempts", attemptId] as const;

export function useGamesSets() {
  return useQuery<GameSetSummary[]>({
    queryKey: gamesSetsQueryKey,
    queryFn: async () => {
      const res = await fetch(getApiUrl("/api/games/sets"), { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao buscar sets");
      return res.json();
    },
  });
}

export function useGameSet(slug: string) {
  return useQuery<GameSetDetail>({
    queryKey: gamesSetQueryKey(slug),
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/games/sets/${slug}`), { credentials: "include" });
      if (!res.ok) throw new Error("Set não encontrado");
      return res.json();
    },
    enabled: !!slug,
  });
}

export function useStartAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (setSlug: string) => {
      const res = await fetch(getApiUrl("/api/games/attempts/start"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ setSlug }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? "Erro ao iniciar");
      }
      return res.json() as Promise<StartAttemptResult>;
    },
    onSuccess: (_, setSlug) => {
      queryClient.invalidateQueries({ queryKey: gamesSetQueryKey(setSlug) });
    },
  });
}

export function useAttempt(attemptId: string | null) {
  return useQuery<AttemptDetail>({
    queryKey: gamesAttemptQueryKey(attemptId ?? ""),
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/games/attempts/${attemptId}`), {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Tentativa não encontrada");
      return res.json();
    },
    enabled: !!attemptId,
  });
}

export function useGuess(attemptId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(getApiUrl(`/api/games/attempts/${attemptId}/guess`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? "Erro ao processar palpite");
      }
      return res.json() as Promise<GuessResult>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gamesAttemptQueryKey(attemptId) });
    },
  });
}

export function useResetAttempt(attemptId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(getApiUrl(`/api/games/attempts/${attemptId}/reset`), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao reiniciar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gamesAttemptQueryKey(attemptId) });
    },
  });
}

export function useAbandonAttempt(attemptId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(getApiUrl(`/api/games/attempts/${attemptId}/abandon`), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao desistir");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gamesAttemptQueryKey(attemptId) });
    },
  });
}

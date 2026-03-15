import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/queryClient";

const PAGE_SIZE = 20;
const STALE_TIME_MS = 2 * 60 * 1000; // 2 minutes

export interface FeedJournalist {
  id: string;
  name: string;
  avatarUrl: string | null;
  handle: string;
  verified: boolean;
}

export interface FeedTeam {
  id: string;
  name: string;
  badgeUrl: string | null;
}

export interface FeedEngagement {
  likes: number;
  reposts: number;
  bookmarks: number;
  views: number;
  dislikes?: number;
}

export interface InfluencerFeedItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  publishedAt: string;
  sourceUrl: string | null;
  journalist: FeedJournalist;
  team: FeedTeam | null;
  engagement: FeedEngagement;
  userInteraction?: "LIKE" | "DISLIKE" | null;
}

export interface TorcidaFeedUser {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
}

export interface TorcidaFeedItem {
  id: string;
  content: string;
  createdAt: string;
  user: TorcidaFeedUser;
  likes: number;
  replies: number;
  imageUrl: string | null;
  relatedNews: { id: string; title: string } | null;
  viewerHasLiked: boolean;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(getApiUrl(url), { credentials: "include" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText || "Request failed");
  }
  return res.json();
}

export function useInfluencersFeed() {
  return useInfiniteQuery<InfluencerFeedItem[]>({
    queryKey: ["feed", "influencers"],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam as number;
      return fetchJson<InfluencerFeedItem[]>(
        `/api/feed/influencers?limit=${PAGE_SIZE}&offset=${offset}`
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.reduce((acc, p) => acc + p.length, 0);
    },
    staleTime: STALE_TIME_MS,
  });
}

export function useTorcidaFeed() {
  return useInfiniteQuery<TorcidaFeedItem[]>({
    queryKey: ["feed", "torcida"],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam as number;
      return fetchJson<TorcidaFeedItem[]>(
        `/api/feed/fan-posts?limit=${PAGE_SIZE}&offset=${offset}`
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.reduce((acc, p) => acc + p.length, 0);
    },
    staleTime: STALE_TIME_MS,
  });
}

export interface NewsDetailData {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  publishedAt: string;
  journalist: { id: string; name: string; avatarUrl: string | null; handle: string };
  team: { id: string; name: string; badgeUrl: string | null } | null;
}

export function useNewsDetail(id: string | undefined) {
  return useQuery<NewsDetailData>({
    queryKey: ["feed", "news", id],
    queryFn: async () => {
      if (!id) throw new Error("No news ID");
      return fetchJson<NewsDetailData>(`/api/feed/news/${id}`);
    },
    enabled: !!id,
  });
}

export function useLikeNewsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newsId }: { newsId: string }) => {
      const res = await fetch(getApiUrl(`/api/feed/news/${newsId}/like`), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Falha ao curtir");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed", "influencers"] });
    },
  });
}

export function useToggleCommentLikeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      commentId,
      currentlyLiked,
    }: {
      commentId: string;
      currentlyLiked: boolean;
    }) => {
      const method = currentlyLiked ? "DELETE" : "POST";
      const res = await fetch(getApiUrl(`/api/comments/${commentId}/likes`), {
        method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao curtir");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed", "torcida"] });
    },
  });
}

export interface TrendingItem {
  topic: string;
  category: string;
  posts: number;
}

export interface UpcomingMatchItem {
  id: string;
  kickoffAt: string;
  homeTeamName: string;
  awayTeamName: string;
  competitionName: string;
}

export function useTrending() {
  return useQuery<TrendingItem[]>({
    queryKey: ["feed", "trending"],
    queryFn: () => fetchJson<TrendingItem[]>("/api/feed/trending"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpcomingMatches(teamId?: string) {
  const params = teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";
  return useQuery<UpcomingMatchItem[]>({
    queryKey: ["feed", "upcoming-matches", teamId],
    queryFn: () =>
      fetchJson<UpcomingMatchItem[]>(`/api/feed/upcoming-matches${params}`),
    staleTime: 2 * 60 * 1000,
  });
}

export function useBookmarkNewsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newsId }: { newsId: string }) => {
      const res = await fetch(getApiUrl(`/api/feed/news/${newsId}/bookmark`), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Falha ao salvar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed", "influencers"] });
    },
  });
}

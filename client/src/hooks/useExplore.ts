import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/queryClient";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(getApiUrl(url), { credentials: "include", ...options });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText || "Request failed");
  }
  return res.json();
}

export interface TrendingItem {
  id: string;
  title: string;
  subtitle: string | null;
  category: string;
  post_count: number;
  team_slug: string | null;
}

export interface HashtagItem {
  id: string;
  name: string;
  post_count: number;
  category: string;
}

export interface ExploreSearchPost {
  id: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  repostCount: number;
  replyCount: number;
  viewCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
    verified: boolean;
    team_name: string | null;
  };
}

export interface ExploreSearchUser {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
  bio: string | null;
  userType: string;
  followersCount: number;
  is_following: boolean;
}

export interface ExploreSearchHashtag {
  id: string;
  name: string;
  post_count: number;
  category: string;
}

export interface ExploreSearchTeam {
  id: string;
  name: string;
  shortName: string | null;
  logoUrl: string | null;
}

export interface ExploreSearchResult {
  posts: ExploreSearchPost[];
  users: ExploreSearchUser[];
  hashtags: ExploreSearchHashtag[];
  teams: ExploreSearchTeam[];
}

export interface ExplorePostByHashtag {
  id: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  repostCount: number;
  replyCount: number;
  viewCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
    verified: boolean;
    team_name: string | null;
  };
  viewerHasLiked: boolean;
  viewerHasBookmarked: boolean;
}

export interface ExploreSuggestedUser {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
  bio: string | null;
  userType: string;
  followersCount: number;
  is_following: boolean;
}

export function formatPostCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function useExploreTrending(period: "1h" | "6h" | "24h" = "24h", category?: string) {
  const params = new URLSearchParams({ period });
  if (category) params.set("category", category);
  return useQuery<TrendingItem[]>({
    queryKey: ["explore", "trending", period, category],
    queryFn: () => fetchJson<TrendingItem[]>(`/api/explore/trending?${params}`),
    staleTime: 60_000,
  });
}

export function useExploreHashtags(limit = 10) {
  return useQuery<HashtagItem[]>({
    queryKey: ["explore", "hashtags", limit],
    queryFn: () => fetchJson<HashtagItem[]>(`/api/explore/hashtags?limit=${limit}`),
    staleTime: 60_000,
  });
}

export function useExploreSearch(q: string) {
  return useQuery<ExploreSearchResult>({
    queryKey: ["explore", "search", q],
    queryFn: () => fetchJson<ExploreSearchResult>(`/api/explore/search?q=${encodeURIComponent(q)}`),
    enabled: q.trim().length >= 1,
    staleTime: 30_000,
  });
}

export function useExplorePostsByHashtag(name: string | null) {
  return useQuery<ExplorePostByHashtag[]>({
    queryKey: ["explore", "posts-by-hashtag", name],
    queryFn: () =>
      fetchJson<ExplorePostByHashtag[]>(
        `/api/explore/posts-by-hashtag/${encodeURIComponent(name!.startsWith("#") ? name : `#${name}`)}`
      ),
    enabled: !!name && name.trim().length >= 1,
  });
}

export function useExploreSuggestedUsers() {
  return useQuery<ExploreSuggestedUser[]>({
    queryKey: ["explore", "suggested-users"],
    queryFn: () => fetchJson<ExploreSuggestedUser[]>(`/api/explore/suggested-users`),
    staleTime: 60_000,
    retry: false,
  });
}

export function useExploreFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ handle }: { handle: string }) => {
      return fetchJson<{ following: boolean; followersCount: number }>(
        `/api/users/${encodeURIComponent(handle)}/follow`,
        { method: "POST" }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["explore", "suggested-users"] });
      queryClient.invalidateQueries({ queryKey: ["explore", "search"] });
      queryClient.invalidateQueries({ queryKey: ["users", "suggested"] });
    },
  });
}

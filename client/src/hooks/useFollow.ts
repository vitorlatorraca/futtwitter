import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/queryClient";

export interface UserProfileItem {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  coverPhotoUrl: string | null;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  userType: string;
  isFollowing?: boolean;
  /** Role for display: "fan" | "journalist" */
  userRole?: "fan" | "journalist";
  /** True only for approved journalists */
  isVerifiedJournalist?: boolean;
}

export interface FollowListItem {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
  bio: string | null;
  isFollowing: boolean;
}

const PAGE_SIZE = 20;

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(getApiUrl(url), { credentials: "include", ...options });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText || "Request failed");
  }
  return res.json();
}

export function useUserProfile(handle: string | undefined) {
  return useQuery<UserProfileItem>({
    queryKey: ["user", "profile", handle],
    queryFn: async () => {
      if (!handle) throw new Error("No handle");
      return fetchJson<UserProfileItem>(`/api/users/${encodeURIComponent(handle)}`);
    },
    enabled: !!handle,
  });
}

export function useUserFollowers(handle: string | undefined) {
  return useInfiniteQuery<FollowListItem[]>({
    queryKey: ["user", "followers", handle],
    queryFn: async ({ pageParam = 0 }) => {
      if (!handle) throw new Error("No handle");
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(pageParam) });
      return fetchJson<FollowListItem[]>(
        `/api/users/${encodeURIComponent(handle)}/followers?${params.toString()}`
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.reduce((acc, p) => acc + p.length, 0);
    },
    enabled: !!handle,
  });
}

export function useUserFollowing(handle: string | undefined) {
  return useInfiniteQuery<FollowListItem[]>({
    queryKey: ["user", "following", handle],
    queryFn: async ({ pageParam = 0 }) => {
      if (!handle) throw new Error("No handle");
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(pageParam) });
      return fetchJson<FollowListItem[]>(
        `/api/users/${encodeURIComponent(handle)}/following?${params.toString()}`
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.reduce((acc, p) => acc + p.length, 0);
    },
    enabled: !!handle,
  });
}

type InfiniteFollowData = { pages: FollowListItem[][]; pageParams: unknown[] };

/** Flips isFollowing for a specific handle in an infinite-query cache entry. */
function patchFollowInCache(
  data: InfiniteFollowData | undefined,
  targetHandle: string,
  follow: boolean,
): InfiniteFollowData | undefined {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) =>
      page.map((item) =>
        item.handle === targetHandle ? { ...item, isFollowing: follow } : item,
      ),
    ),
  };
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ handle, follow }: { handle: string; follow: boolean }) => {
      const url = `/api/users/${encodeURIComponent(handle)}/follow`;
      return fetchJson<{ following: boolean; followersCount: number }>(url, {
        method: follow ? "POST" : "DELETE",
      });
    },

    // ─── Optimistic update ──────────────────────────────────────────────────
    onMutate: async ({ handle, follow }) => {
      // Cancel in-flight refetches so they don't overwrite our optimistic data
      await queryClient.cancelQueries({ queryKey: ["user", "followers"] });
      await queryClient.cancelQueries({ queryKey: ["user", "following"] });

      // Snapshot every cached followers / following list
      const prevFollowers = queryClient.getQueriesData<InfiniteFollowData>({
        queryKey: ["user", "followers"],
      });
      const prevFollowing = queryClient.getQueriesData<InfiniteFollowData>({
        queryKey: ["user", "following"],
      });

      // Optimistically flip the button in every list that contains this user
      queryClient.setQueriesData<InfiniteFollowData>(
        { queryKey: ["user", "followers"] },
        (old) => patchFollowInCache(old, handle, follow),
      );
      queryClient.setQueriesData<InfiniteFollowData>(
        { queryKey: ["user", "following"] },
        (old) => patchFollowInCache(old, handle, follow),
      );

      // Also flip in suggested users (flat array, not infinite)
      queryClient.setQueryData<SuggestedUser[]>(["users", "suggested"], (old) =>
        old?.map((u) => (u.handle === handle ? { ...u, isFollowing: follow } : u)),
      );

      return { prevFollowers, prevFollowing };
    },

    // ─── Roll back on network error ─────────────────────────────────────────
    onError: (_err, _vars, context) => {
      context?.prevFollowers?.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
      context?.prevFollowing?.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
    },

    // ─── Sync server truth after success ────────────────────────────────────
    onSuccess: (_data, variables) => {
      // Refresh the profile whose count changed
      queryClient.invalidateQueries({ queryKey: ["user", "profile", variables.handle] });
      // Refresh ALL followers/following lists (not just for variables.handle)
      queryClient.invalidateQueries({ queryKey: ["user", "followers"] });
      queryClient.invalidateQueries({ queryKey: ["user", "following"] });
      queryClient.invalidateQueries({ queryKey: ["users", "suggested"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });
}

export interface SuggestedUser {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
  bio: string | null;
  isFollowing: boolean;
  userType: string;
  followersCount: number;
}

export function useSuggestedUsers(limit = 5) {
  return useQuery<SuggestedUser[]>({
    queryKey: ["users", "suggested"],
    queryFn: () => fetchJson<SuggestedUser[]>(`/api/users/suggested?limit=${limit}`),
    staleTime: 60_000,
  });
}

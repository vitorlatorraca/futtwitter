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

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ handle, follow }: { handle: string; follow: boolean }) => {
      const url = `/api/users/${encodeURIComponent(handle)}/follow`;
      if (follow) {
        return fetchJson<{ following: boolean; followersCount: number }>(url, { method: "POST" });
      } else {
        return fetchJson<{ following: boolean; followersCount: number }>(url, { method: "DELETE" });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile", variables.handle] });
      queryClient.invalidateQueries({ queryKey: ["user", "followers", variables.handle] });
      queryClient.invalidateQueries({ queryKey: ["user", "following", variables.handle] });
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

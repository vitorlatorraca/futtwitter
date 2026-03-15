import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/queryClient";
import type { Post } from "@/store/useAppStore";

export interface PostFeedItem {
  id: string;
  content: string;
  imageUrl: string | null;
  parentPostId: string | null;
  likeCount: number;
  replyCount: number;
  repostCount: number;
  bookmarkCount: number;
  viewCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string | null;
    /** Role from database: "fan" | "journalist" */
    userRole?: "fan" | "journalist";
    /** True only for approved journalists */
    isVerifiedJournalist?: boolean;
  };
  viewerHasLiked: boolean;
  viewerHasBookmarked: boolean;
  relatedNews?: { id: string; title: string } | null;
}

const PAGE_SIZE = 20;

export function postFeedItemToPost(item: PostFeedItem): Post {
  const isVerified = !!item.author.isVerifiedJournalist;
  return {
    id: item.id,
    author: {
      id: item.author.id,
      displayName: item.author.name,
      handle: item.author.handle,
      avatar: item.author.avatarUrl || "",
      bio: "",
      coverPhoto: "",
      location: "",
      website: "",
      joinDate: "",
      following: 0,
      followers: 0,
      verified: isVerified,
      userRole: item.author.userRole ?? "fan",
      isVerifiedJournalist: isVerified,
    },
    text: item.content,
    timestamp: new Date(item.createdAt),
    images: item.imageUrl ? [item.imageUrl] : [],
    liked: item.viewerHasLiked,
    reposted: false,
    bookmarked: item.viewerHasBookmarked,
    likes: item.likeCount,
    reposts: item.repostCount,
    replies: item.replyCount,
    views: item.viewCount,
    parentId: item.parentPostId ?? undefined,
  };
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(getApiUrl(url), { credentials: "include", ...options });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText || "Request failed");
  }
  return res.json();
}

export function usePostsFeed(params?: { userId?: string; handle?: string }) {
  const queryParams = new URLSearchParams();
  queryParams.set("limit", String(PAGE_SIZE));
  if (params?.userId) queryParams.set("userId", params.userId);
  if (params?.handle) queryParams.set("handle", params.handle);

  return useInfiniteQuery<PostFeedItem[]>({
    queryKey: ["posts", "feed", params?.userId ?? params?.handle ?? "all"],
    queryFn: async ({ pageParam = 0 }) => {
      queryParams.set("offset", String(pageParam));
      return fetchJson<PostFeedItem[]>(`/api/posts?${queryParams.toString()}`);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.reduce((acc, p) => acc + p.length, 0);
    },
  });
}

export function usePost(postId: string | undefined) {
  return useQuery<PostFeedItem & { replies: PostFeedItem[] }>({
    queryKey: ["posts", postId],
    queryFn: async () => {
      if (!postId) throw new Error("No post ID");
      return fetchJson(`/api/posts/${postId}`);
    },
    enabled: !!postId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: {
      content: string;
      imageUrl?: string;
      parentPostId?: string;
      relatedNewsId?: string;
    }) => {
      return fetchJson<PostFeedItem & { author: unknown }>("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed", "torcida"] });
      if (variables.parentPostId) {
        queryClient.invalidateQueries({ queryKey: ["posts", variables.parentPostId] });
      }
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      return fetchJson(`/api/posts/${postId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      return fetchJson<{ liked: boolean; likeCount: number }>(`/api/posts/${postId}/like`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed", "torcida"] });
    },
  });
}

export function useBookmarkPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      return fetchJson<{ bookmarked: boolean; bookmarkCount: number }>(`/api/posts/${postId}/bookmark`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

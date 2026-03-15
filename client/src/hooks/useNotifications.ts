import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "../lib/queryClient";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(getApiUrl(url), { credentials: "include", ...options });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? "Erro");
  }
  return res.json();
}

export interface NotificationActor {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
  userType: string;
}

export interface ApiNotification {
  id: string;
  type: "LIKE" | "FOLLOW" | "REPLY" | "REPOST" | "NEW_NEWS" | "BADGE_EARNED" | "MATCH_RESULT" | "UPCOMING_MATCH";
  title: string;
  message: string;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
  actor: NotificationActor | null;
}

export function useNotifications() {
  return useQuery<ApiNotification[]>({
    queryKey: ["notifications"],
    queryFn: () => fetchJson<ApiNotification[]>("/api/notifications"),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useUnreadCount(enabled = true) {
  return useQuery<{ count: number }>({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => fetchJson<{ count: number }>("/api/notifications/unread-count"),
    staleTime: 10_000,
    refetchInterval: 20_000,
    enabled,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) =>
      fetchJson(`/api/notifications/${notificationId}/read`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fetchJson("/api/notifications/mark-all-read", { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
}

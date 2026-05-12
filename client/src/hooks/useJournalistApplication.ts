import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "../lib/queryClient";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(getApiUrl(url), { credentials: "include", ...options });
  if (!res.ok) {
    const text = await res.text();
    let msg = text || res.statusText || "Request failed";
    try {
      const json = JSON.parse(text);
      if (json?.message) msg = json.message;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return res.json();
}

export interface JournalistApplicationStatus {
  status: "PENDING" | "APPROVED" | "REJECTED" | null;
  organization?: string;
  professionalId?: string;
  portfolioUrl?: string | null;
  createdAt?: string;
}

export interface PendingApplication {
  journalistId: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatarUrl: string | null;
  organization: string;
  professionalId: string;
  portfolioUrl: string | null;
  createdAt: string;
}

export function useJournalistApplicationStatus() {
  return useQuery<JournalistApplicationStatus>({
    queryKey: ["journalist-application", "status"],
    queryFn: () => fetchJson("/api/journalist-application/status"),
    staleTime: 30_000,
  });
}

export function useApplyForJournalist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { organization: string; professionalId: string; portfolioUrl?: string }) =>
      fetchJson("/api/journalist-application/apply", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalist-application", "status"] });
    },
  });
}

export function usePendingApplications() {
  return useQuery<PendingApplication[]>({
    queryKey: ["admin", "journalist-applications"],
    queryFn: () => fetchJson("/api/admin/journalist-applications"),
    staleTime: 10_000,
  });
}

export function useReviewApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, action }: { userId: string; action: "approve" | "reject" }) =>
      fetchJson(`/api/admin/journalists/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "journalist-applications"] });
    },
  });
}

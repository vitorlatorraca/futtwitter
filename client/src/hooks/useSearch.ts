import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./useDebounce";
import { getApiUrl } from "../lib/queryClient";

export interface SearchUser {
  id: string;
  name: string;
  handle: string | null;
  avatarUrl: string | null;
  bio?: string | null;
  userType: string;
  followersCount: number;
  followingCount?: number;
}

export interface SearchPost {
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
    handle: string | null;
    avatarUrl: string | null;
    userType: string;
  };
}

export function useSearchSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    fetch(getApiUrl(`/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`), { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setSuggestions(data.users ?? []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return { suggestions, loading };
}

export function useSearch(query: string, type: "all" | "users" | "posts" = "all") {
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  const search = useCallback(async (q: string, t: string) => {
    if (!q.trim()) {
      setUsers([]);
      setPosts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(getApiUrl(`/api/search?q=${encodeURIComponent(q)}&type=${t}`), { credentials: "include" });
      if (!res.ok) throw new Error(`Busca falhou: ${res.status} ${res.statusText}`);
      const data = await res.json() as { users?: SearchUser[]; posts?: SearchPost[] };
      setUsers(data.users ?? []);
      setPosts(data.posts ?? []);
    } catch (err) {
      console.error("[useSearch] erro na busca:", err);
      setUsers([]);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    search(debouncedQuery, type);
  }, [debouncedQuery, type, search]);

  return { users, posts, loading };
}

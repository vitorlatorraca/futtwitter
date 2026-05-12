import React from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/queryClient";
import PostCard from "../components/feed/PostCard";
import { postFeedItemToPost, type PostFeedItem } from "../hooks/usePosts";

export default function Bookmarks() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const { data, isLoading } = useQuery<PostFeedItem[]>({
    queryKey: ["posts", "bookmarks"],
    queryFn: async () => {
      const res = await fetch(getApiUrl("/api/posts/bookmarks"), { credentials: "include" });
      if (!res.ok) throw new Error("Erro ao carregar salvos");
      return res.json();
    },
  });

  const bookmarked = (data ?? []).map(postFeedItemToPost);

  return (
    <div>
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px]">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -m-2 rounded-full hover:bg-foreground/[0.08] transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Salvos</h1>
          <p className="text-[13px] text-foreground-secondary">@{authUser?.handle ?? "user"}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-foreground-secondary" />
        </div>
      ) : bookmarked.length > 0 ? (
        bookmarked.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="py-16 px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-2">Salve posts para depois</h2>
          <p className="text-foreground-secondary text-[15px] max-w-[360px] mx-auto">
            Salve posts para encontrar facilmente no futuro.
          </p>
        </div>
      )}
    </div>
  );
}

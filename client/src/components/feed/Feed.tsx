import React, { useState, useCallback, useRef, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import PostCard from "./PostCard";
import ComposeBox from "./ComposeBox";
import PostSkeleton from "./PostSkeleton";
import EmptyFeed from "./EmptyFeed";
import {
  useInfluencersFeed,
  useTorcidaFeed,
  useLikeNewsMutation,
  type InfluencerFeedItem,
  type TorcidaFeedItem,
} from "../../hooks/useFeed";
import { usePostsFeed, useLikePost, useBookmarkPost, postFeedItemToPost, type PostFeedItem } from "../../hooks/usePosts";
import { influencerToPost, torcidaToPost } from "../../utils/postTransforms";
import type { Post } from "../../store/useAppStore";
import { Loader2 } from "lucide-react";

export default function Feed() {
  const { activeTab, setActiveTab } = useAppStore();
  const [influencerFilter, setInfluencerFilter] = useState<"mine" | "all">("all");
  const influencersQuery = useInfluencersFeed(influencerFilter);
  const torcidaQuery = useTorcidaFeed();
  const postsQuery = usePostsFeed();
  const likeMutation = useLikeNewsMutation();
  const likePostMutation = useLikePost();
  const bookmarkPostMutation = useBookmarkPost();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const prevTabRef = useRef(activeTab);
  const torcidaScrollRef = useRef(0);
  const influencerScrollRef = useRef(0);
  const postsScrollRef = useRef(0);

  const isInfluencers = activeTab === "influencers";
  const isPosts = activeTab === "posts";
  const query = isInfluencers ? influencersQuery : isPosts ? postsQuery : torcidaQuery;
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = query;

  const allPosts: Post[] = (data?.pages ?? []).flatMap((page) =>
    isInfluencers
      ? (page as InfluencerFeedItem[]).map(influencerToPost)
      : isPosts
        ? (page as PostFeedItem[]).map(postFeedItemToPost)
        : (page as TorcidaFeedItem[]).map(torcidaToPost)
  );

  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      if (prevTabRef.current === "torcida") {
        torcidaScrollRef.current = window.scrollY;
      } else if (prevTabRef.current === "posts") {
        postsScrollRef.current = window.scrollY;
      } else {
        influencerScrollRef.current = window.scrollY;
      }
      prevTabRef.current = activeTab;
      requestAnimationFrame(() => {
        const scrollY =
          activeTab === "torcida"
            ? torcidaScrollRef.current
            : activeTab === "posts"
              ? postsScrollRef.current
              : influencerScrollRef.current;
        window.scrollTo(0, scrollY);
      });
    }
  }, [activeTab]);

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isFetchingNextPage) return;
    const el = sentinelRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { threshold: 0.2, rootMargin: "100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleLikeNews = useCallback(
    (newsId: string, _currentlyLiked: boolean) => {
      likeMutation.mutate({ newsId });
    },
    [likeMutation]
  );

  const composePlaceholder =
    activeTab === "posts"
      ? "O que está acontecendo no futebol?"
      : activeTab === "torcida"
        ? "Poste para a sua torcida... 🏟️"
        : "Compartilhe sua opinião...";

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          {[1, 2, 3].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </>
      );
    }
    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <p className="text-[15px] text-red-400">Erro ao carregar notícias. Tente novamente.</p>
          <button
            onClick={() => query.refetch()}
            className="mt-4 px-4 py-2 bg-x-accent text-white rounded-full font-medium hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      );
    }
    if (allPosts.length === 0) {
      return (
        <EmptyFeed
          message={
            isPosts
              ? "Nenhum post ainda. Seja o primeiro a publicar!"
              : isInfluencers
                ? "Nenhuma notícia publicada ainda."
                : "Nenhum post da torcida ainda."
          }
          subMessage={
            isPosts
              ? "Posts da comunidade aparecerão aqui."
              : isInfluencers
                ? "As notícias aparecerão aqui assim que forem publicadas."
                : "Posts de fãs do seu time aparecerão aqui."
          }
        />
      );
    }
    return allPosts.map((post) => {
      const navigateTo = isInfluencers ? `/news/${post.id}` : `/post/${post.id}`;
      return (
        <PostCard
          key={post.id}
          post={post}
          navigateTo={navigateTo}
          onLike={
            isInfluencers
              ? handleLikeNews
              : (id, _) => likePostMutation.mutate(id)
          }
          onBookmark={isPosts ? (id) => bookmarkPostMutation.mutate(id) : undefined}
        />
      );
    });
  };

  return (
    <div>
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-x-border">
        <div className="flex">
          {(["posts", "torcida", "influencers"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-4 text-center hover:bg-[rgba(231,233,234,0.03)] transition-colors relative text-[15px] font-medium"
            >
              <span className={activeTab === tab ? "font-bold" : "text-x-text-secondary"}>
                {tab === "posts" ? "Posts" : tab === "torcida" ? "Torcida" : "Influencers"}
              </span>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[56px] h-1 bg-[#1a56db] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "influencers" && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-x-border bg-black/60">
          <span className="text-xs text-x-text-secondary font-medium mr-1">Mostrar:</span>
          <button
            onClick={() => setInfluencerFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
              influencerFilter === "all"
                ? "bg-[#1a56db] text-white border-[#1a56db]"
                : "bg-transparent text-x-text-secondary border-x-border hover:border-x-text-secondary"
            }`}
          >
            Todos os Times
          </button>
          <button
            onClick={() => setInfluencerFilter("mine")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
              influencerFilter === "mine"
                ? "bg-[#1a56db] text-white border-[#1a56db]"
                : "bg-transparent text-x-text-secondary border-x-border hover:border-x-text-secondary"
            }`}
          >
            Meu Time
          </button>
        </div>
      )}

      {activeTab !== "influencers" && (
        <div className="border-b border-x-border">
          <ComposeBox placeholder={composePlaceholder} />
        </div>
      )}

      <div>{renderContent()}</div>

      <div ref={sentinelRef} className="py-8 flex items-center justify-center min-h-[48px]">
        {isFetchingNextPage && <Loader2 className="w-8 h-8 text-x-accent animate-spin" />}
      </div>
    </div>
  );
}

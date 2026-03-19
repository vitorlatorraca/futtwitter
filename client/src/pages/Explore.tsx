import React, { useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Settings, Flame, Hash, Users } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import {
  useExploreTrending,
  useExploreHashtags,
  useExploreSearch,
  useExplorePostsByHashtag,
  useExploreSuggestedUsers,
  useExploreFollow,
  formatPostCount,
  type TrendingItem,
  type HashtagItem,
  type ExploreSearchPost,
  type ExploreSearchUser,
  type ExploreSearchHashtag,
  type ExploreSearchTeam,
  type ExplorePostByHashtag,
  type ExploreSuggestedUser,
} from "../hooks/useExplore";
import { SearchBar } from "../components/SearchBar";
import PostCard from "../components/feed/PostCard";
import { getApiUrl } from "../lib/queryClient";
import type { Post } from "../store/useAppStore";

const CATEGORY_PILLS = [
  { key: "all", label: "Todos" },
  { key: "time", label: "Times" },
  { key: "campeonato", label: "Campeonatos" },
  { key: "transferencia", label: "VaiVem" },
] as const;

function explorePostToPost(p: ExplorePostByHashtag | ExploreSearchPost): Post {
  const author = "author" in p ? p.author : p.author;
  const avatar = author.avatar
    ? author.avatar.startsWith("http")
      ? author.avatar
      : getApiUrl(author.avatar)
    : "";
  return {
    id: p.id,
    text: p.content,
    timestamp: new Date(p.createdAt),
    images: p.imageUrl ? [p.imageUrl.startsWith("http") ? p.imageUrl : getApiUrl(p.imageUrl)] : [],
    author: {
      id: author.id,
      displayName: author.name,
      handle: author.username ?? "user",
      avatar,
      bio: "",
      coverPhoto: "",
      location: "",
      website: "",
      joinDate: "",
      following: 0,
      followers: 0,
      verified: author.verified ?? false,
      isVerifiedJournalist: author.verified ?? false,
    },
    liked: "viewerHasLiked" in p ? p.viewerHasLiked : false,
    reposted: false,
    bookmarked: "viewerHasBookmarked" in p ? p.viewerHasBookmarked : false,
    likes: p.likeCount,
    reposts: p.repostCount,
    replies: p.replyCount,
    views: p.viewCount,
  };
}

function TrendingCard({ item, onClick }: { item: TrendingItem; onClick: () => void }) {
  const catLabel = item.category === "time" ? "Time" : item.category === "campeonato" ? "Campeonato" : item.category === "transferencia" ? "Vai e Vem" : "Futebol";
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-colors border-b border-x-border"
    >
      <p className="text-[13px] text-x-text-secondary">{catLabel} · Trending</p>
      <p className="text-[15px] font-bold mt-0.5 text-x-text-primary">{item.title}</p>
      <p className="text-[13px] text-x-text-secondary mt-0.5">{formatPostCount(item.post_count)} posts</p>
    </button>
  );
}

function HashtagChip({ item, onClick }: { item: HashtagItem; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-full bg-x-search-bg hover:bg-gray-800 text-x-text-primary text-[14px] font-medium transition-colors"
    >
      #{item.name} <span className="text-x-text-secondary font-normal">{formatPostCount(item.post_count)}</span>
    </button>
  );
}

function UserSuggestionCard({
  user,
  onFollow,
  isFollowing,
}: {
  user: ExploreSuggestedUser | ExploreSearchUser;
  onFollow: () => void;
  isFollowing: boolean;
}) {
  const handle = "handle" in user ? user.handle : user.handle;
  const avatarUrl = "avatarUrl" in user ? user.avatarUrl : user.avatarUrl;
  const initial = user.name.charAt(0).toUpperCase();
  const avatarColors = ["bg-blue-600", "bg-purple-600", "bg-green-600", "bg-orange-500", "bg-pink-600", "bg-teal-600"];
  const avatarColor = avatarColors[user.name.charCodeAt(0) % avatarColors.length];

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
      <Link to={`/profile/${handle}`} className="flex-shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl.startsWith("http") ? avatarUrl : getApiUrl(avatarUrl)} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${avatarColor}`}>
            <span className="text-white text-lg font-bold">{initial}</span>
          </div>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/profile/${handle}`} className="block">
          <span className="font-bold text-[15px] text-x-text-primary truncate block">{user.name}</span>
          <span className="text-x-text-secondary text-[13px]">@{handle}</span>
        </Link>
      </div>
      <button
        type="button"
        onClick={onFollow}
        disabled={isFollowing}
        className="px-4 py-1.5 rounded-full border border-x-text-primary text-x-text-primary text-[14px] font-bold hover:bg-white/[0.08] transition-colors disabled:opacity-50"
      >
        {isFollowing ? "Seguindo" : "Seguir"}
      </button>
    </div>
  );
}

function SkeletonTrending() {
  return (
    <div className="animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="px-4 py-3 border-b border-x-border">
          <div className="h-3.5 bg-gray-800 rounded w-24 mb-2" />
          <div className="h-4 bg-gray-800 rounded w-32 mb-1" />
          <div className="h-3 bg-gray-800 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

function SkeletonHashtags() {
  return (
    <div className="flex gap-2 flex-wrap px-4 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-8 w-24 bg-gray-800 rounded-full" />
      ))}
    </div>
  );
}

function SkeletonUsers() {
  return (
    <div className="animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="w-12 h-12 rounded-full bg-gray-800" />
          <div className="flex-1">
            <div className="h-4 bg-gray-800 rounded w-24 mb-1" />
            <div className="h-3 bg-gray-800 rounded w-16" />
          </div>
          <div className="w-20 h-8 rounded-full bg-gray-800" />
        </div>
      ))}
    </div>
  );
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const hashtagParam = searchParams.get("hashtag") ?? "";
  const [activeTab, setActiveTab] = useState<"all" | "users" | "posts" | "hashtags" | "teams">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const debouncedQuery = useDebounce(query, 300);
  const { data: searchResults, isLoading: searchLoading } = useExploreSearch(debouncedQuery);
  const { data: trending = [], isLoading: trendingLoading } = useExploreTrending(
    "24h",
    categoryFilter === "all" ? undefined : categoryFilter
  );
  const { data: hashtagsList = [], isLoading: hashtagsLoading } = useExploreHashtags(10);
  const { data: suggestedUsers = [], isLoading: suggestedLoading, isError: suggestedError } = useExploreSuggestedUsers();
  const { data: postsByHashtag = [], isLoading: postsLoading } = useExplorePostsByHashtag(hashtagParam || null);
  const followMutation = useExploreFollow();

  const isSearching = query.trim().length > 0;
  const hasHashtagFilter = hashtagParam.trim().length > 0;

  const handleSearch = useCallback(
    (q: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("q", q.trim());
        next.delete("hashtag");
        return next;
      });
      setActiveTab("all");
    },
    [setSearchParams]
  );

  const handleTrendingClick = useCallback(
    (item: TrendingItem) => {
      // Trending topics fazem busca por texto (q=), não por hashtag
      // Hashtag chips usam ?hashtag= para busca exata por tag
      const term = item.title.replace(/^#/, "");
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("q", term);
        next.delete("hashtag");
        return next;
      });
      setActiveTab("all");
    },
    [setSearchParams]
  );

  const handleHashtagClick = useCallback(
    (item: HashtagItem) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("hashtag", item.name);
        next.delete("q");
        return next;
      });
    },
    [setSearchParams]
  );

  const handleFollow = useCallback(
    (handle: string) => {
      followMutation.mutate(
        { handle },
        {
          onSuccess: () => {
            // Optimistic update handled by invalidation
          },
        }
      );
    },
    [followMutation]
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Search - sticky */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md px-4 py-2 border-b border-x-border">
        <div className="flex items-center gap-3">
          <SearchBar
            initialValue={query}
            onSearch={handleSearch}
            autoFocus={!isSearching}
            className="flex-1"
          />
          <button className="p-2 rounded-full border border-x-border hover:bg-[rgba(231,233,234,0.1)] transition-colors" aria-label="Settings">
            <Settings className="w-5 h-5 text-x-text-primary" />
          </button>
        </div>
      </div>

      {isSearching ? (
        <>
          {/* Category tabs for search */}
          <div className="flex border-b border-x-border sticky top-[52px] bg-black z-10 overflow-x-auto hide-scrollbar">
            {(["all", "users", "posts", "hashtags", "teams"] as const).map((key) => {
              const labels: Record<typeof key, string> = {
                all: "Tudo",
                users: "Pessoas",
                posts: "Posts",
                hashtags: "Hashtags",
                teams: "Times",
              };
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 min-w-[80px] py-[18px] text-[15px] font-bold transition-colors hover:bg-white/[0.03] relative whitespace-nowrap ${
                    active ? "text-x-text-primary" : "text-x-text-secondary"
                  }`}
                >
                  {labels[key]}
                  {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-x-accent rounded-full" />}
                </button>
              );
            })}
          </div>

          {searchLoading && searchResults === undefined ? (
            <div className="animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-4 border-b border-x-border">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-800 rounded-full w-1/3" />
                    <div className="h-3 bg-gray-800 rounded-full w-1/5 opacity-60" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {(activeTab === "all" || activeTab === "users") && (searchResults?.users?.length ?? 0) > 0 && (
                <div>
                  {activeTab === "all" && (
                    <div className="px-4 py-3 border-b border-x-border">
                      <p className="text-[20px] font-extrabold text-x-text-primary">Pessoas</p>
                    </div>
                  )}
                  {searchResults!.users.map((u) => (
                    <UserSuggestionCard
                      key={u.id}
                      user={u}
                      onFollow={() => handleFollow(u.handle)}
                      isFollowing={u.is_following}
                    />
                  ))}
                </div>
              )}

              {(activeTab === "all" || activeTab === "posts") && (searchResults?.posts?.length ?? 0) > 0 && (
                <div>
                  {activeTab === "all" && (
                    <div className="px-4 py-3 border-b border-x-border">
                      <p className="text-[20px] font-extrabold text-x-text-primary">Posts</p>
                    </div>
                  )}
                  {searchResults!.posts.map((p) => (
                    <PostCard key={p.id} post={explorePostToPost(p)} />
                  ))}
                </div>
              )}

              {(activeTab === "all" || activeTab === "hashtags") && (searchResults?.hashtags?.length ?? 0) > 0 && (
                <div>
                  {activeTab === "all" && (
                    <div className="px-4 py-3 border-b border-x-border">
                      <p className="text-[20px] font-extrabold text-x-text-primary">Hashtags</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 px-4 py-3">
                    {searchResults!.hashtags.map((h) => (
                      <HashtagChip key={h.id} item={h} onClick={() => handleHashtagClick(h)} />
                    ))}
                  </div>
                </div>
              )}

              {(activeTab === "all" || activeTab === "teams") && (searchResults?.teams?.length ?? 0) > 0 && (
                <div>
                  {activeTab === "all" && (
                    <div className="px-4 py-3 border-b border-x-border">
                      <p className="text-[20px] font-extrabold text-x-text-primary">Times</p>
                    </div>
                  )}
                  {searchResults!.teams.map((t: ExploreSearchTeam) => (
                    <Link
                      key={t.id}
                      to={`/meu-time/${t.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors border-b border-x-border"
                    >
                      {t.logoUrl && (
                        <img src={t.logoUrl.startsWith("http") ? t.logoUrl : getApiUrl(t.logoUrl)} alt="" className="w-10 h-10 rounded-full object-cover" />
                      )}
                      <div>
                        <p className="font-bold text-x-text-primary">{t.name}</p>
                        {t.shortName && <p className="text-[13px] text-x-text-secondary">{t.shortName}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!searchLoading &&
                (searchResults?.users?.length ?? 0) === 0 &&
                (searchResults?.posts?.length ?? 0) === 0 &&
                (searchResults?.hashtags?.length ?? 0) === 0 &&
                (searchResults?.teams?.length ?? 0) === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-x-search-bg flex items-center justify-center mb-5">
                      <Search className="w-8 h-8 text-x-text-secondary" />
                    </div>
                    <h3 className="text-[23px] font-extrabold text-x-text-primary mb-2 leading-tight">
                      Nenhum resultado para
                      <br />
                      <span className="text-x-accent">&ldquo;{query}&rdquo;</span>
                    </h3>
                    <p className="text-x-text-secondary text-[15px] max-w-[260px] mx-auto">
                      Tente palavras diferentes ou verifique a ortografia.
                    </p>
                  </div>
                )}
            </div>
          )}
        </>
      ) : hasHashtagFilter ? (
        <>
          <div className="px-4 py-3 border-b border-x-border flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="text-x-text-secondary hover:text-x-text-primary text-[14px]"
            >
              ← Voltar
            </button>
            <span className="text-x-text-primary font-bold">#{hashtagParam}</span>
          </div>
          {postsLoading ? (
            <div className="animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="px-4 py-4 border-b border-x-border">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-800 rounded w-1/3" />
                      <div className="h-4 bg-gray-800 rounded w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : postsByHashtag.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
              <Hash className="w-12 h-12 text-x-text-secondary mb-4" />
              <p className="text-x-text-primary font-bold text-lg">Nenhum post com #{hashtagParam}</p>
              <p className="text-x-text-secondary text-[14px] mt-2">Seja o primeiro a postar!</p>
            </div>
          ) : (
            postsByHashtag.map((p) => <PostCard key={p.id} post={explorePostToPost(p)} />)
          )}
        </>
      ) : (
        <>
          {/* Category pills */}
          <div className="flex border-b border-x-border overflow-x-auto hide-scrollbar">
            {CATEGORY_PILLS.map((pill) => (
              <button
                key={pill.key}
                onClick={() => setCategoryFilter(pill.key)}
                className={`min-w-[80px] py-4 px-4 text-[15px] font-medium transition-colors whitespace-nowrap ${
                  categoryFilter === pill.key ? "text-x-text-primary border-b-2 border-x-accent" : "text-x-text-secondary hover:text-x-text-primary"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Trending */}
          <div className="py-3">
            <h2 className="flex items-center gap-2 px-4 py-2 text-[20px] font-extrabold text-x-text-primary">
              <Flame className="w-5 h-5 text-orange-500" />
              Trending Futebol
            </h2>
            {trendingLoading ? (
              <SkeletonTrending />
            ) : trending.length === 0 ? (
              <div className="px-4 py-8 text-x-text-secondary text-center">Nenhum trending no momento</div>
            ) : (
              trending.map((item) => (
                <TrendingCard key={item.id} item={item} onClick={() => handleTrendingClick(item)} />
              ))
            )}
          </div>

          {/* Hashtags */}
          <div className="py-3 border-t border-x-border">
            <h2 className="flex items-center gap-2 px-4 py-2 text-[20px] font-extrabold text-x-text-primary">
              <Hash className="w-5 h-5" />
              Hashtags em alta
            </h2>
            {hashtagsLoading ? (
              <SkeletonHashtags />
            ) : hashtagsList.length === 0 ? (
              <div className="px-4 py-4 text-x-text-secondary text-center">Nenhuma hashtag</div>
            ) : (
              <div className="flex flex-wrap gap-2 px-4 py-3">
                {hashtagsList.map((h) => (
                  <HashtagChip key={h.id} item={h} onClick={() => handleHashtagClick(h)} />
                ))}
              </div>
            )}
          </div>

          {/* Suggested users - only when logged in */}
          {!suggestedError && (
          <div className="py-3 border-t border-x-border">
            <h2 className="flex items-center gap-2 px-4 py-2 text-[20px] font-extrabold text-x-text-primary">
              <Users className="w-5 h-5" />
              Quem Seguir
            </h2>
            {suggestedLoading ? (
              <SkeletonUsers />
            ) : suggestedUsers.length === 0 ? (
              <div className="px-4 py-4 text-x-text-secondary text-center">Nenhuma sugestão</div>
            ) : (
              suggestedUsers.map((u) => (
                <UserSuggestionCard
                  key={u.id}
                  user={u}
                  onFollow={() => handleFollow(u.handle)}
                  isFollowing={u.is_following}
                />
              ))
            )}
          </div>
          )}
        </>
      )}
    </div>
  );
}

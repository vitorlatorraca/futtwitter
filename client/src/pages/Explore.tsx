import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, MoreHorizontal, Settings } from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { useSearch, SearchUser, SearchPost } from "../hooks/useSearch";
import PostCard from "../components/feed/PostCard";
import { getApiUrl } from "../lib/queryClient";
import type { Post } from "../store/useAppStore";

function searchPostToPost(sp: SearchPost): Post {
  const avatar = sp.author.avatarUrl
    ? (sp.author.avatarUrl.startsWith("http") ? sp.author.avatarUrl : getApiUrl(sp.author.avatarUrl))
    : "";
  return {
    id: sp.id,
    text: sp.content,
    timestamp: new Date(sp.createdAt),
    images: sp.imageUrl ? [sp.imageUrl.startsWith("http") ? sp.imageUrl : getApiUrl(sp.imageUrl)] : [],
    author: {
      id: sp.author.id,
      displayName: sp.author.name,
      handle: sp.author.handle ?? "user",
      avatar,
      bio: "",
      coverPhoto: "",
      location: "",
      website: "",
      joinDate: "",
      following: 0,
      followers: 0,
      verified: false,
      isVerifiedJournalist: sp.author.userType === "JOURNALIST",
    },
    liked: false,
    reposted: false,
    bookmarked: false,
    likes: sp.likeCount,
    reposts: sp.repostCount,
    replies: sp.replyCount,
    views: sp.viewCount,
  };
}

const tabs = ["Para você", "Trending", "Notícias", "Esportes", "Entretenimento"];

const trendingTopics = [
  {
    category: "Esportes · Trending",
    topic: "Brasileirão",
    posts: "342K",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400",
  },
  {
    category: "Trending no Brasil",
    topic: "#Libertadores",
    posts: "189K",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
  },
  {
    category: "Esportes · Trending",
    topic: "Champions League",
    posts: "892K",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400",
  },
  {
    category: "Futebol · Trending",
    topic: "Janela de Transferências",
    posts: "156K",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400",
  },
];

const newsItems = [
  {
    source: "ESPN Brasil",
    time: "2h atrás",
    headline: "Corinthians anuncia novo técnico para a temporada 2026",
    image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=200",
  },
  {
    source: "ge",
    time: "4h atrás",
    headline: "VAR: novas regras são aprovadas para o Brasileirão",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=200",
  },
  {
    source: "UOL Esporte",
    time: "6h ago",
    headline: "Seleção Brasileira convoca 23 jogadores para as eliminatórias",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200",
  },
];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [activeTab, setActiveTab] = useState<"all" | "users" | "posts">("all");
  const [defaultTab, setDefaultTab] = useState("Para você");

  const { users: searchUsers, posts: searchPosts, loading } = useSearch(query, activeTab);

  const isSearching = query.trim().length > 0;

  function handleSearch(q: string) {
    setSearchParams({ q: q.trim() });
    setActiveTab("all");
  }

  return (
    <div className="min-h-screen">
      {/* Search */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md px-4 py-2">
        <div className="flex items-center gap-3">
          <SearchBar
            initialValue={query}
            onSearch={handleSearch}
            autoFocus={!isSearching}
            className="flex-1"
          />
          <button className="p-2 rounded-full border border-x-border hover:bg-[rgba(231,233,234,0.1)] transition-colors" aria-label="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isSearching ? (
        <>
          {/* Tabs de filtro */}
          <div className="flex border-b border-x-border sticky top-[52px] bg-black z-10">
            {(["all", "users", "posts"] as const).map((key) => {
              const label = key === "all" ? "Tudo" : key === "users" ? "Usuários" : "Posts";
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 py-[18px] text-[15px] font-bold transition-colors hover:bg-white/[0.03] relative ${
                    active ? "text-x-text-primary" : "text-x-text-secondary"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-x-accent rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Skeleton de loading */}
          {loading && (
            <div className="animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-4 border-b border-x-border">
                  <div className="w-12 h-12 rounded-full bg-x-border flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-x-border rounded-full w-1/3" />
                    <div className="h-3 bg-x-border rounded-full w-1/5 opacity-60" />
                    <div className="h-3 bg-x-border rounded-full w-2/3 opacity-40" />
                  </div>
                  <div className="w-20 h-8 rounded-full bg-x-border" />
                </div>
              ))}
            </div>
          )}

          {!loading && (
            <div>
              {/* Seção: Pessoas */}
              {(activeTab === "all" || activeTab === "users") && searchUsers.length > 0 && (
                <div>
                  {activeTab === "all" && (
                    <div className="px-4 py-3 border-b border-x-border">
                      <p className="text-[20px] font-extrabold text-x-text-primary">Pessoas</p>
                    </div>
                  )}
                  {searchUsers.map((user: SearchUser) => {
                    const initial = user.name.charAt(0).toUpperCase();
                    const avatarColors = ["bg-blue-600","bg-purple-600","bg-green-600","bg-orange-500","bg-pink-600","bg-teal-600"];
                    const avatarColor = avatarColors[user.name.charCodeAt(0) % avatarColors.length];
                    return (
                      <Link
                        key={user.id}
                        to={`/profile/${user.handle ?? user.id}`}
                        className="flex items-start gap-3 px-4 py-4 hover:bg-white/[0.02] transition-colors border-b border-x-border"
                      >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-x-border">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${avatarColor}`}>
                              <span className="text-white text-lg font-bold">{initial}</span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="text-x-text-primary font-bold text-[15px] truncate leading-tight">
                              {user.name}
                            </span>
                            {user.userType === "JOURNALIST" && (
                              <svg className="w-4 h-4 text-x-accent flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                              </svg>
                            )}
                          </div>
                          {user.handle && (
                            <p className="text-x-text-secondary text-[13px] mb-1">@{user.handle}</p>
                          )}
                          {user.bio && (
                            <p className="text-x-text-primary text-[14px] leading-snug line-clamp-2">{user.bio}</p>
                          )}
                          {user.followersCount > 0 && (
                            <p className="text-x-text-secondary text-[13px] mt-1">
                              <span className="font-bold text-x-text-primary">
                                {user.followersCount > 999
                                  ? `${(user.followersCount / 1000).toFixed(1)}K`
                                  : user.followersCount}
                              </span>{" "}
                              seguidores
                            </p>
                          )}
                        </div>

                        {/* Botão decorativo Seguir */}
                        <button
                          type="button"
                          className="flex-shrink-0 px-4 py-1.5 rounded-full border border-x-text-primary text-x-text-primary text-[14px] font-bold hover:bg-white/[0.08] transition-colors"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        >
                          Seguir
                        </button>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Seção: Posts */}
              {(activeTab === "all" || activeTab === "posts") && searchPosts.length > 0 && (
                <div>
                  {activeTab === "all" && (
                    <div className="px-4 py-3 border-b border-x-border">
                      <p className="text-[20px] font-extrabold text-x-text-primary">Posts</p>
                    </div>
                  )}
                  {searchPosts.map((post) => (
                    <PostCard key={post.id} post={searchPostToPost(post)} />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {searchUsers.length === 0 && searchPosts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-x-search-bg flex items-center justify-center mb-5">
                    <Search className="w-8 h-8 text-x-text-secondary" />
                  </div>
                  <h3 className="text-[23px] font-extrabold text-x-text-primary mb-2 leading-tight">
                    Nenhum resultado para<br />
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
      ) : (
        <>
          {/* Tabs do conteúdo padrão */}
          <div className="flex border-b border-x-border overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setDefaultTab(tab)}
                className="flex-1 min-w-[80px] py-4 text-center hover:bg-[rgba(231,233,234,0.03)] transition-colors relative text-[15px] whitespace-nowrap px-4"
              >
                <span className={defaultTab === tab ? "font-bold" : "text-x-text-secondary"}>
                  {tab}
                </span>
                {defaultTab === tab && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[56px] h-1 bg-x-accent rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Trending Cards */}
          <div className="grid grid-cols-2 gap-0.5">
        {trendingTopics.map((topic, i) => (
          <div
            key={i}
            className={`relative overflow-hidden cursor-pointer group ${i === 0 ? "col-span-2 h-[200px]" : "h-[150px]"}`}
          >
            <img
              src={topic.image}
              alt={topic.topic}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-[13px] text-white/70">{topic.category}</p>
              <p className="text-[17px] font-bold">{topic.topic}</p>
              <p className="text-[13px] text-white/70">{topic.posts} posts</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trending List */}
      <div className="py-3">
        <h2 className="text-xl font-extrabold px-4 py-2">Trending para você</h2>
        {[
          { cat: "Trending no Brasil", topic: "#DiaDeJogo", posts: "45.2K" },
          { cat: "Esportes · Trending", topic: "Corinthians", posts: "67.8K" },
          { cat: "Entretenimento · Trending", topic: "Copa do Mundo", posts: "1.2M" },
          { cat: "Trending", topic: "FIFA", posts: "234K" },
          { cat: "Esportes · Trending", topic: "Neymar", posts: "89.4K" },
        ].map((item, i) => (
          <div
            key={i}
            className="px-4 py-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors cursor-pointer flex justify-between"
          >
            <div>
              <p className="text-[13px] text-x-text-secondary">{item.cat}</p>
              <p className="text-[15px] font-bold mt-0.5">{item.topic}</p>
              <p className="text-[13px] text-x-text-secondary mt-0.5">{item.posts} posts</p>
            </div>
            <button className="p-1.5 -m-1.5 rounded-full hover:bg-[rgba(29,155,240,0.1)] h-fit" aria-label="More">
              <MoreHorizontal className="w-[18px] h-[18px] text-x-text-secondary" />
            </button>
          </div>
        ))}
      </div>

      {/* News */}
      <div className="border-t border-x-border py-3">
        <h2 className="text-xl font-extrabold px-4 py-2">Notícias</h2>
        {newsItems.map((item, i) => (
          <div
            key={i}
            className="px-4 py-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors cursor-pointer flex gap-3"
          >
            <div className="flex-1">
              <p className="text-[13px] text-x-text-secondary">{item.source} · {item.time}</p>
              <p className="text-[15px] font-bold mt-1 leading-5">{item.headline}</p>
            </div>
            <img src={item.image} alt="" className="w-[100px] h-[68px] rounded-xl object-cover flex-shrink-0" />
          </div>
        ))}
      </div>
    </>
      )}
    </div>
  );
}

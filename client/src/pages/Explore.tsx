import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, MoreHorizontal, Settings, User } from "lucide-react";
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
          {/* Tabs de filtro de busca */}
          <div className="flex border-b border-x-border sticky top-14 bg-black z-10">
            {[
              { key: "all" as const, label: "Tudo" },
              { key: "users" as const, label: "Usuários" },
              { key: "posts" as const, label: "Posts" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors hover:bg-[rgba(231,233,234,0.03)] ${
                  activeTab === tab.key
                    ? "text-x-text-primary border-b-2 border-x-accent"
                    : "text-x-text-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-x-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && (
            <div>
              {(activeTab === "all" || activeTab === "users") && searchUsers.length > 0 && (
                <div>
                  {activeTab === "all" && (
                    <h2 className="px-4 py-3 text-xl font-bold text-x-text-primary border-b border-x-border">
                      Pessoas
                    </h2>
                  )}
                  {searchUsers.map((user: SearchUser) => (
                    <Link
                      key={user.id}
                      to={`/profile/${user.handle ?? user.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors border-b border-x-border"
                    >
                      <div className="w-12 h-12 rounded-full bg-x-border overflow-hidden flex-shrink-0">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-6 h-6 text-x-text-secondary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-x-text-primary font-bold text-sm">{user.name}</p>
                        {user.handle && <p className="text-x-text-secondary text-sm">@{user.handle}</p>}
                        {user.bio && <p className="text-x-text-secondary text-sm mt-0.5 truncate">{user.bio}</p>}
                        <p className="text-x-text-secondary text-xs mt-0.5">{user.followersCount} seguidores</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {(activeTab === "all" || activeTab === "posts") && searchPosts.length > 0 && (
                <div>
                  {activeTab === "all" && (
                    <h2 className="px-4 py-3 text-xl font-bold text-x-text-primary border-b border-x-border">
                      Posts
                    </h2>
                  )}
                  {searchPosts.map((post) => (
                    <PostCard key={post.id} post={searchPostToPost(post)} />
                  ))}
                </div>
              )}

              {!loading && searchUsers.length === 0 && searchPosts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                  <Search className="w-12 h-12 text-x-text-secondary mb-4" />
                  <h3 className="text-xl font-bold text-x-text-primary mb-2">
                    Nenhum resultado para &quot;{query}&quot;
                  </h3>
                  <p className="text-x-text-secondary text-sm">
                    Tente outras palavras-chave ou verifique a ortografia.
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

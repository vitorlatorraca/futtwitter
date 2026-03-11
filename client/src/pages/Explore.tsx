import React, { useState } from "react";
import { Search, MoreHorizontal, Settings } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("Para você");
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div>
      {/* Search */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md px-4 py-1.5">
        <div className="flex items-center gap-3">
          <div
            className={`flex-1 flex items-center rounded-full px-4 py-2.5 transition-colors ${
              searchFocused ? "bg-black border border-x-accent" : "bg-x-search-bg border border-transparent"
            }`}
          >
            <Search className={`w-[18px] h-[18px] flex-shrink-0 ${searchFocused ? "text-x-accent" : "text-x-text-secondary"}`} />
            <input
              type="text"
              placeholder="Buscar no FuteApp"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="ml-3 bg-transparent text-[15px] text-x-text-primary placeholder-x-text-secondary outline-none flex-1"
            />
          </div>
          <button className="p-2 rounded-full border border-x-border hover:bg-[rgba(231,233,234,0.1)] transition-colors" aria-label="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-x-border overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 min-w-[80px] py-4 text-center hover:bg-[rgba(231,233,234,0.03)] transition-colors relative text-[15px] whitespace-nowrap px-4"
          >
            <span className={activeTab === tab ? "font-bold" : "text-x-text-secondary"}>
              {tab}
            </span>
            {activeTab === tab && (
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
    </div>
  );
}

import React, { useState } from "react";
import { Search, MoreHorizontal, X } from "lucide-react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { suggestedUsers } from "../../data/mockUsers";
import { useLocation } from "react-router-dom";

const trendingItems = [
  { category: "Futebol · Trending", topic: "#Brasileirão", posts: "125K" },
  { category: "Esportes · Trending", topic: "Champions League", posts: "892K" },
  { category: "Futebol · Trending", topic: "#DiaDeJogo", posts: "45.2K" },
  { category: "Trending no Brasil", topic: "Corinthians", posts: "67.8K" },
  { category: "Esportes · Trending", topic: "Libertadores", posts: "234K" },
];

const upcomingMatches = [
  { teamA: "Corinthians", teamB: "Palmeiras", date: "Sáb, 15 Mar · 16h", comp: "Brasileirão" },
  { teamA: "Flamengo", teamB: "São Paulo", date: "Dom, 16 Mar · 18h30", comp: "Brasileirão" },
  { teamA: "Real Madrid", teamB: "Barcelona", date: "Sáb, 15 Mar · 17h", comp: "La Liga" },
];

export default function RightSidebar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const isHidden = useMediaQuery("(max-width: 1023px)");
  const location = useLocation();

  if (isHidden) return null;

  const isFootballPage = ["/meu-time", "/vai-e-vem", "/jogos"].includes(location.pathname);

  const toggleFollow = (userId: string) => {
    setFollowedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  return (
    <aside className="w-[350px] min-h-screen pl-7 py-1">
      {/* Search */}
      <div className="sticky top-0 pt-1 pb-3 bg-black z-10">
        <div
          className={`flex items-center rounded-full px-4 py-2.5 transition-colors ${
            searchFocused
              ? "bg-black border border-x-accent"
              : "bg-x-search-bg border border-transparent"
          }`}
        >
          <Search className={`w-[18px] h-[18px] ${searchFocused ? "text-x-accent" : "text-x-text-secondary"}`} />
          <input
            type="text"
            placeholder="Buscar no FuteApp"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="ml-3 bg-transparent text-[15px] text-x-text-primary placeholder-x-text-secondary outline-none flex-1"
          />
          {searchValue && (
            <button onClick={() => setSearchValue("")} className="text-x-accent" aria-label="Limpar busca">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* FuteApp Pro Card */}
      <div className="border border-x-border rounded-2xl p-4 mb-4">
        <h2 className="text-xl font-extrabold mb-1">FuteApp Pro</h2>
        <p className="text-[15px] text-x-text-primary mb-3">
          Sem anúncios, estatísticas avançadas, alertas de gols em tempo real.
        </p>
        <button className="brand-gradient hover:opacity-90 text-white font-bold text-[15px] rounded-full px-4 py-2 transition-opacity">
          Assinar
        </button>
      </div>

      {/* Trending Futebol */}
      <div className="border border-x-border rounded-2xl mb-4 overflow-hidden">
        <h2 className="text-xl font-extrabold px-4 py-3">🔥 Trending Futebol</h2>
        {trendingItems.map((item, i) => (
          <button
            key={i}
            className="w-full px-4 py-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors text-left flex justify-between items-start"
          >
            <div>
              <p className="text-[13px] text-x-text-secondary leading-4">{item.category}</p>
              <p className="text-[15px] font-bold leading-5 mt-0.5">{item.topic}</p>
              <p className="text-[13px] text-x-text-secondary leading-4 mt-0.5">{item.posts} posts</p>
            </div>
            <MoreHorizontal className="w-[18px] h-[18px] text-x-text-secondary mt-0.5 flex-shrink-0" />
          </button>
        ))}
        <button className="w-full px-4 py-3 text-x-accent text-[15px] hover:bg-[rgba(231,233,234,0.03)] transition-colors text-left">
          Ver mais
        </button>
      </div>

      {/* Próximos Jogos (on football pages) or Quem Seguir */}
      {isFootballPage ? (
        <div className="border border-x-border rounded-2xl mb-4 overflow-hidden">
          <h2 className="text-xl font-extrabold px-4 py-3">📅 Próximos Jogos</h2>
          {upcomingMatches.map((match, i) => (
            <div
              key={i}
              className="px-4 py-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors"
            >
              <p className="text-[15px] font-bold leading-5">
                {match.teamA} vs {match.teamB}
              </p>
              <p className="text-[13px] text-x-text-secondary leading-4 mt-0.5">
                {match.date} · {match.comp}
              </p>
            </div>
          ))}
          <a
            href="/jogos"
            className="block w-full px-4 py-3 text-x-accent text-[15px] hover:bg-[rgba(231,233,234,0.03)] transition-colors text-left"
          >
            Ver detalhes
          </a>
        </div>
      ) : null}

      {/* Quem Seguir */}
      <div className="border border-x-border rounded-2xl mb-4 overflow-hidden">
        <h2 className="text-xl font-extrabold px-4 py-3">Quem Seguir</h2>
        {suggestedUsers.map((user) => {
          const isFollowing = followedUsers.has(user.id);
          return (
            <div
              key={user.id}
              className="px-4 py-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors flex items-center gap-3"
            >
              <img src={user.avatar} alt={user.displayName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold leading-5 truncate flex items-center gap-1">
                  {user.displayName}
                  {user.verified && (
                    <svg viewBox="0 0 22 22" className="w-[18px] h-[18px] fill-x-accent inline-block flex-shrink-0">
                      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.272 1.895.143.634-.131 1.218-.437 1.687-.883.445-.47.751-1.054.882-1.69.132-.632.083-1.289-.139-1.896.586-.274 1.084-.705 1.438-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                    </svg>
                  )}
                </p>
                <p className="text-[13px] text-x-text-secondary leading-4 truncate">@{user.handle}</p>
              </div>
              <button
                onClick={() => toggleFollow(user.id)}
                className={`rounded-full font-bold text-[14px] px-4 py-1.5 transition-colors flex-shrink-0 ${
                  isFollowing
                    ? "bg-transparent border border-x-border text-white hover:border-red-500 hover:text-red-500"
                    : "brand-gradient text-white hover:opacity-90"
                }`}
              >
                {isFollowing ? "Seguindo" : "Seguir"}
              </button>
            </div>
          );
        })}
        <button className="w-full px-4 py-3 text-x-accent text-[15px] hover:bg-[rgba(231,233,234,0.03)] transition-colors text-left">
          Ver mais
        </button>
      </div>

      {/* Footer */}
      <nav className="px-4 pb-4">
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[13px] text-x-text-secondary">
          {["Termos de Uso", "Política de Privacidade", "Cookies", "Acessibilidade", "Sobre"].map((link) => (
            <a key={link} href="#" className="hover:underline">{link}</a>
          ))}
        </div>
        <p className="text-[13px] text-x-text-secondary mt-1">&copy; 2026 FuteApp.</p>
      </nav>
    </aside>
  );
}

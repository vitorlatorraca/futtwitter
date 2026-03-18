import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { SearchBar } from "../SearchBar";
import { useTrending, useUpcomingMatches } from "../../hooks/useFeed";
import { useSuggestedUsers, useToggleFollow } from "../../hooks/useFollow";
import { influencerSuggestedUsers } from "../../data/mockPosts";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "../../store/useAppStore";
import { useAuth } from "../../lib/auth-context";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function formatMatchDate(iso: string): string {
  try {
    const d = new Date(iso);
    return format(d, "EEE, d MMM · HH:mm", { locale: ptBR });
  } catch {
    return iso;
  }
}

export default function RightSidebar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const isHidden = useMediaQuery("(max-width: 1023px)");
  const location = useLocation();
  const { activeTab } = useAppStore();
  const { user } = useAuth();
  const { data: trendingItems = [] } = useTrending();
  const isFootballPage = ["/meu-time", "/vai-e-vem", "/jogos"].includes(location.pathname);
  const { data: upcomingMatches = [] } = useUpcomingMatches(isFootballPage ? user?.teamId ?? undefined : undefined);
  const { data: suggestedUsers = [], isLoading: loadingSuggested } = useSuggestedUsers(5);
  const toggleFollowMutation = useToggleFollow();

  const handleFollowToggle = (targetUser: { handle: string; isFollowing: boolean }) => {
    toggleFollowMutation.mutate(
      { handle: targetUser.handle, follow: !targetUser.isFollowing },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users", "suggested"] });
        },
      }
    );
  };

  const toggleFollowLocal = (userId: string) => {
    setFollowedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const showInfluencers = !isFootballPage && activeTab === "influencers";

  if (isHidden) return null;

  return (
    <aside className="w-[350px] min-h-screen pl-7 py-1">
      {/* Search */}
      <div className="sticky top-0 pt-1 pb-3 bg-black z-10">
        <SearchBar className="w-full" />
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
        {trendingItems.length > 0 ? (
          trendingItems.map((item, i) => (
            <button
              key={i}
              className="w-full px-4 py-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors text-left flex justify-between items-start"
            >
              <div>
                <p className="text-[13px] text-x-text-secondary leading-4">{item.category}</p>
                <p className="text-[15px] font-bold leading-5 mt-0.5">{item.topic}</p>
                <p className="text-[13px] text-x-text-secondary leading-4 mt-0.5">{item.posts} notícias</p>
              </div>
              <MoreHorizontal className="w-[18px] h-[18px] text-x-text-secondary mt-0.5 flex-shrink-0" />
            </button>
          ))
        ) : (
          <p className="px-4 py-6 text-[14px] text-x-text-secondary text-center">Em breve</p>
        )}
      </div>

      {/* Próximos Jogos (on football pages) - hide if no fixtures */}
      {isFootballPage && upcomingMatches.length > 0 ? (
        <div className="border border-x-border rounded-2xl mb-4 overflow-hidden">
          <h2 className="text-xl font-extrabold px-4 py-3">📅 Próximos Jogos</h2>
          {upcomingMatches.map((match) => (
            <div
              key={match.id}
              className="px-4 py-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors"
            >
              <p className="text-[15px] font-bold leading-5">
                {match.homeTeamName} vs {match.awayTeamName}
              </p>
              <p className="text-[13px] text-x-text-secondary leading-4 mt-0.5">
                {formatMatchDate(match.kickoffAt)} · {match.competitionName}
              </p>
            </div>
          ))}
          <Link
            to="/jogos"
            className="block w-full px-4 py-3 text-x-accent text-[15px] hover:bg-[rgba(231,233,234,0.03)] transition-colors text-left"
          >
            Ver detalhes
          </Link>
        </div>
      ) : null}

      {/* Torcida: O que a torcida diz - "Em breve" until we have hashtag aggregation */}
      {!isFootballPage && activeTab === "torcida" && (
        <div className="border border-x-border rounded-2xl mb-4 overflow-hidden">
          <h2 className="text-xl font-extrabold px-4 py-3">💬 O que a torcida diz</h2>
          <p className="px-4 py-6 text-[14px] text-x-text-secondary text-center">Em breve</p>
        </div>
      )}

      {/* Quem Seguir / Top Influencers */}
      {!isFootballPage && activeTab === "influencers" ? (
        <div className="border border-x-border rounded-2xl mb-4 overflow-hidden">
          <h2 className="text-xl font-extrabold px-4 py-3">🌟 Top Influencers FuteApp</h2>
          {influencerSuggestedUsers.map((u) => {
            const isFollowing = followedUsers.has(u.id);
            return (
              <div
                key={u.id}
                className="px-4 py-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors flex items-center gap-3"
              >
                <img src={u.avatar} alt={u.displayName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold leading-5 truncate flex items-center gap-1">
                    {u.displayName}
                    {u.verified && (
                      <svg viewBox="0 0 22 22" className="w-[18px] h-[18px] fill-x-accent inline-block flex-shrink-0">
                        <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.272 1.895.143.634-.131 1.218-.437 1.687-.883.445-.47.751-1.054.882-1.69.132-.632.083-1.289-.139-1.896.586-.274 1.084-.705 1.438-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                      </svg>
                    )}
                  </p>
                  <p className="text-[13px] text-x-text-secondary leading-4 truncate">@{u.handle}</p>
                </div>
                <button
                  onClick={() => toggleFollowLocal(u.id)}
                  className="rounded-full font-bold text-[14px] px-4 py-1.5 transition-colors flex-shrink-0 bg-[#1a56db] text-white hover:bg-[#1544b8]"
                >
                  {isFollowing ? "Seguindo" : "Seguir"}
                </button>
              </div>
            );
          })}
          <button
            onClick={() => navigate("/explore")}
            className="w-full px-4 py-3 text-x-accent text-[15px] hover:bg-[rgba(231,233,234,0.03)] transition-colors text-left"
          >
            Ver mais
          </button>
        </div>
      ) : suggestedUsers.length > 0 || loadingSuggested ? (
        <div className="border border-x-border rounded-2xl mb-4 overflow-hidden">
          <h2 className="text-xl font-extrabold px-4 py-3">Quem Seguir</h2>
          {loadingSuggested ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-x-border animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-x-border rounded animate-pulse w-32" />
                  <div className="h-3 bg-x-border rounded animate-pulse w-20" />
                </div>
              </div>
            ))
          ) : (
            <>
              {suggestedUsers.map((targetUser) => (
                <div
                  key={targetUser.id}
                  className="px-4 py-3 flex items-center gap-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-full bg-x-border flex-shrink-0 overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/profile/${targetUser.handle}`)}
                  >
                    {targetUser.avatarUrl ? (
                      <img src={targetUser.avatarUrl} alt={targetUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-x-text-secondary">
                        {targetUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/profile/${targetUser.handle}`)}
                  >
                    <div className="flex items-center gap-1">
                      <p className="text-[15px] font-bold truncate">{targetUser.name}</p>
                      {targetUser.userType === "JOURNALIST" && (
                        <span className="text-[#1d9bf0] text-xs">✓</span>
                      )}
                    </div>
                    <p className="text-[13px] text-x-text-secondary truncate">@{targetUser.handle}</p>
                  </div>
                  <button
                    onClick={() => handleFollowToggle(targetUser)}
                    disabled={toggleFollowMutation.isPending && toggleFollowMutation.variables?.handle === targetUser.handle}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors ${
                      targetUser.isFollowing
                        ? "border border-x-border text-white hover:border-red-500 hover:text-red-500"
                        : "bg-white text-black hover:bg-[rgba(231,233,234,0.9)]"
                    }`}
                  >
                    {targetUser.isFollowing ? "Seguindo" : "Seguir"}
                  </button>
                </div>
              ))}
              <button
                onClick={() => navigate("/explore")}
                className="w-full px-4 py-3 text-[15px] text-[#1d9bf0] hover:bg-[rgba(29,155,240,0.1)] transition-colors text-left"
              >
                Ver mais
              </button>
            </>
          )}
        </div>
      ) : null}

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

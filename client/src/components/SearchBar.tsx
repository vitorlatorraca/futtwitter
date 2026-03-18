import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearchSuggestions, SearchUser } from "../hooks/useSearch";

interface SearchBarProps {
  autoFocus?: boolean;
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const AVATAR_COLORS = [
  "bg-blue-600", "bg-purple-600", "bg-green-600",
  "bg-orange-500", "bg-pink-600", "bg-teal-600",
];

function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function UserAvatar({ user }: { user: SearchUser }) {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="w-full h-full object-cover"
      />
    );
  }
  return (
    <div className={`w-full h-full flex items-center justify-center ${getAvatarColor(user.name)}`}>
      <span className="text-white text-sm font-bold">
        {user.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-x-border flex-shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="h-3.5 bg-x-border rounded-full w-2/5" />
        <div className="h-3 bg-x-border rounded-full w-1/4 opacity-60" />
      </div>
    </div>
  );
}

export function SearchBar({
  autoFocus,
  initialValue = "",
  onSearch,
  className = "",
}: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const { suggestions, loading } = useSearchSuggestions(query);

  const showDropdown = focused && query.length >= 1;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(q?: string) {
    const searchTerm = q ?? query;
    if (!searchTerm.trim()) return;
    setFocused(false);
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/explore?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        const user = suggestions[selectedIndex];
        navigate(`/profile/${user.handle ?? user.id}`);
        setFocused(false);
        setQuery("");
      } else {
        handleSubmit();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setFocused(false);
      setSelectedIndex(-1);
    }
  }

  function handleUserClick(user: SearchUser) {
    navigate(`/profile/${user.handle ?? user.id}`);
    setFocused(false);
    setQuery("");
  }

  function clearSearch() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div
        className={`flex items-center gap-3 rounded-full px-4 py-2.5 transition-all duration-150 ${
          focused
            ? "bg-black border border-x-accent"
            : "bg-x-search-bg border border-transparent hover:border-[#555]"
        }`}
      >
        <Search
          className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
            focused ? "text-x-accent" : "text-x-text-secondary"
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar no FuteApp"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-[15px] text-x-text-primary placeholder-x-text-secondary outline-none flex-1"
        />
        {query.length > 0 && (
          <button
            onClick={clearSearch}
            aria-label="Limpar busca"
            className="w-5 h-5 rounded-full bg-x-accent hover:bg-x-accent-hover transition-colors flex items-center justify-center flex-shrink-0"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#16181c] border border-x-border rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50">

          {/* Skeleton loading */}
          {loading && (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}

          {/* Resultados de usuários */}
          {!loading && suggestions.map((user, idx) => (
            <button
              key={user.id}
              onClick={() => handleUserClick(user)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                idx === selectedIndex
                  ? "bg-white/[0.06]"
                  : "hover:bg-white/[0.04]"
              }`}
            >
              <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden ring-1 ring-x-border">
                <UserAvatar user={user} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
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
                  <span className="text-x-text-secondary text-[13px] leading-tight">@{user.handle}</span>
                )}
              </div>
              {/* Followers count hint */}
              {user.followersCount > 0 && (
                <span className="text-x-text-secondary text-xs flex-shrink-0">
                  {user.followersCount > 999
                    ? `${(user.followersCount / 1000).toFixed(1)}K`
                    : user.followersCount}{" "}
                  seg.
                </span>
              )}
            </button>
          ))}

          {/* Buscar por palavra-chave */}
          {!loading && query.trim().length > 0 && (
            <button
              onClick={() => handleSubmit(query)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors ${
                suggestions.length > 0 ? "border-t border-x-border" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-x-accent/10 border border-x-accent/20 flex items-center justify-center flex-shrink-0">
                <Search className="w-[18px] h-[18px] text-x-accent" />
              </div>
              <span className="text-x-text-primary text-[15px]">
                Buscar por{" "}
                <span className="text-x-accent font-semibold">"{query}"</span>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

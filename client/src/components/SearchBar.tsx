import { useState, useRef, useEffect } from "react";
import { Search, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearchSuggestions, SearchUser } from "../hooks/useSearch";

interface SearchBarProps {
  autoFocus?: boolean;
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
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

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      <div
        className={`flex items-center gap-3 rounded-full px-4 py-2.5 transition-all duration-150 ${
          focused
            ? "bg-black border border-x-accent"
            : "bg-x-search-bg border border-transparent hover:border-gray-600"
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
            className="p-0.5 rounded-full bg-x-accent hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-x-border rounded-2xl shadow-xl overflow-hidden z-50">
          {loading && (
            <div className="px-4 py-3 text-sm text-x-text-secondary animate-pulse">
              Buscando...
            </div>
          )}
          {!loading &&
            suggestions.map((user, idx) => (
              <button
                key={user.id}
                onClick={() => handleUserClick(user)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  idx === selectedIndex ? "bg-[rgba(231,233,234,0.05)]" : "hover:bg-[rgba(231,233,234,0.03)]"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-x-border flex-shrink-0 overflow-hidden">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-x-text-secondary">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-x-text-primary font-semibold text-sm truncate">
                    {user.name}
                  </span>
                  {user.handle && (
                    <span className="text-x-text-secondary text-xs">@{user.handle}</span>
                  )}
                </div>
              </button>
            ))}
          {!loading && query.trim().length > 0 && (
            <button
              onClick={() => handleSubmit(query)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors border-t border-x-border"
            >
              <div className="w-10 h-10 rounded-full bg-x-search-bg flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-x-text-secondary" />
              </div>
              <span className="text-x-text-primary text-sm">
                Buscar por <span className="text-x-accent font-medium">&quot;{query}&quot;</span>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

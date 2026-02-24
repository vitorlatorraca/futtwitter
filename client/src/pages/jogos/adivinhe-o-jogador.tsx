"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { AppShell } from "@/components/ui/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search, Trophy, XCircle, HelpCircle, Calendar } from "lucide-react";
import {
  usePlayerOfTheDay,
  usePlayerSearch,
  useGuessPlayerOfTheDay,
  type PlayerSearchResult,
} from "@/features/games/guess-player/api";
import { positionToPtBr } from "@shared/positions";

const MAX_BLUR_PX = 20;
const MAX_WRONG_ATTEMPTS = 10;

function blurPercentToPx(blurPercent: number): number {
  return (blurPercent / 100) * MAX_BLUR_PX;
}

function formatDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-");
  return `${d}/${m}/${y}`;
}

export default function AdivinheOJogadorPage() {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const { data, isLoading, error } = usePlayerOfTheDay();
  const { data: searchResults = [], isFetching: isSearching } = usePlayerSearch(debouncedSearch);
  const guessMutation = useGuessPlayerOfTheDay();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText), 250);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Show dropdown when results appear
  useEffect(() => {
    if (searchResults.length > 0 && searchText.length >= 2) {
      setShowDropdown(true);
      setSelectedIdx(-1);
    }
  }, [searchResults, searchText]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const submitGuess = useCallback(
    (text: string) => {
      if (!text.trim() || guessMutation.isPending) return;
      setShowDropdown(false);
      setSearchText("");
      guessMutation.mutate(text.trim(), {
        onSuccess: (result) => {
          if (result.correct) {
            toast({ title: "Correto! 🎉", description: `O jogador era ${result.revealName}` });
          } else if (result.feedback === "close") {
            toast({
              variant: "destructive",
              title: "Quase!",
              description: `Errado, mas chegou perto. ${result.attemptsLeft} tentativa(s) restante(s).`,
            });
          } else if (result.status === "lost") {
            toast({
              variant: "destructive",
              title: "Você perdeu!",
              description: `O jogador era ${result.revealName}`,
            });
          } else {
            toast({
              variant: "destructive",
              title: "Errado",
              description: `Tente novamente. ${result.attemptsLeft} tentativa(s) restante(s).`,
            });
          }
        },
        onError: (err) => {
          toast({ variant: "destructive", title: "Erro", description: err.message });
        },
      });
    },
    [guessMutation, toast]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || searchResults.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        submitGuess(searchText);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIdx >= 0 && selectedIdx < searchResults.length) {
        submitGuess(searchResults[selectedIdx].name);
      } else {
        submitGuess(searchText);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleSelectPlayer = (player: PlayerSearchResult) => {
    submitGuess(player.name);
  };

  const isFinished = data?.status === "won" || data?.status === "lost";
  const blurPx = data ? blurPercentToPx(data.progress.blurPercent) : MAX_BLUR_PX;

  if (error) {
    return (
      <AppShell mainClassName="py-4 sm:py-6 px-3 sm:px-4 max-w-2xl mx-auto">
        <div className="py-12 text-center space-y-4">
          <XCircle className="h-12 w-12 text-destructive mx-auto" />
          <p className="text-muted-foreground">Não foi possível carregar o jogo.</p>
          <Button variant="outline" asChild>
            <Link href="/jogos">Voltar aos Jogos</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell mainClassName="py-4 sm:py-6 px-3 sm:px-4 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/jogos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-xl text-foreground">
              Adivinhe o Jogador
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {data ? `Jogador do dia — ${formatDate(data.dateKey)}` : "Carregando..."}
            </p>
          </div>
        </div>

        {isLoading ? (
          <Card className="rounded-2xl border border-white/5 bg-card">
            <CardContent className="py-8 space-y-6">
              <Skeleton className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-2xl" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-32 mx-auto" />
            </CardContent>
          </Card>
        ) : data ? (
          <Card className="rounded-2xl border border-white/5 bg-card overflow-hidden">
            <CardContent className="py-6 space-y-6">
              {/* Blurred player image */}
              <div className="flex justify-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden bg-muted border border-white/5">
                  {data.player.photoUrl ? (
                    <img
                      src={data.player.photoUrl}
                      alt={isFinished ? data.player.name ?? "Jogador" : "???"}
                      className="w-full h-full object-cover transition-all duration-500 ease-out"
                      style={{
                        filter: isFinished ? "blur(0px)" : `blur(${blurPx}px)`,
                        transform: "scale(1.1)",
                      }}
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HelpCircle className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  )}
                  {!isFinished && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                      {data.progress.blurPercent}% borrado
                    </div>
                  )}
                </div>
              </div>

              {/* Hint: position */}
              {!isFinished && data.player.position && (
                <p className="text-center text-sm text-muted-foreground">
                  Posição: <span className="font-medium text-foreground">{positionToPtBr(data.player.position)}</span>
                  {data.player.shirtNumber != null && (
                    <> · Camisa <span className="font-medium text-foreground">#{data.player.shirtNumber}</span></>
                  )}
                </p>
              )}

              {/* Win/Lose state */}
              {data.status === "won" && (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-emerald-500">
                    <Trophy className="h-6 w-6" />
                    <span className="text-xl font-bold">Você acertou!</span>
                  </div>
                  <p className="text-lg font-display font-bold text-foreground">{data.player.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Em {data.progress.attempts} tentativa(s)
                  </p>
                </div>
              )}

              {data.status === "lost" && (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-destructive">
                    <XCircle className="h-6 w-6" />
                    <span className="text-xl font-bold">Não foi dessa vez!</span>
                  </div>
                  <p className="text-lg font-display font-bold text-foreground">{data.player.name}</p>
                  <p className="text-sm text-muted-foreground">
                    O jogador foi revelado após {MAX_WRONG_ATTEMPTS} tentativas erradas.
                  </p>
                </div>
              )}

              {/* Input + autocomplete (only while playing) */}
              {data.status === "playing" && (
                <div className="relative">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      ref={inputRef}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => {
                        if (searchResults.length > 0 && searchText.length >= 2) {
                          setShowDropdown(true);
                        }
                      }}
                      placeholder="Digite o nome do jogador..."
                      className="pl-9 pr-20"
                      autoComplete="off"
                      disabled={guessMutation.isPending}
                    />
                    <Button
                      size="sm"
                      className="absolute right-1.5"
                      onClick={() => submitGuess(searchText)}
                      disabled={!searchText.trim() || guessMutation.isPending}
                    >
                      Enviar
                    </Button>
                  </div>

                  {/* Autocomplete dropdown */}
                  {showDropdown && searchResults.length > 0 && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-50 w-full mt-1 bg-popover border border-white/10 rounded-xl shadow-xl overflow-hidden"
                    >
                      {searchResults.map((player, i) => (
                        <button
                          key={player.id}
                          type="button"
                          onClick={() => handleSelectPlayer(player)}
                          className={`w-full px-3 py-2.5 flex items-center gap-3 text-left text-sm transition-colors
                            ${i === selectedIdx ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}
                          `}
                        >
                          {player.photoUrl ? (
                            <img
                              src={player.photoUrl}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover bg-muted shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-muted-foreground">
                                {player.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{player.name}</p>
                            <p className="text-xs text-muted-foreground">{positionToPtBr(player.position)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {isSearching && searchText.length >= 2 && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border border-white/10 rounded-xl shadow-xl p-3 text-center text-sm text-muted-foreground">
                      Buscando...
                    </div>
                  )}
                </div>
              )}

              {/* Attempts progress */}
              {data.status === "playing" && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{data.progress.attempts} tentativa(s)</span>
                  <span>{data.progress.attemptsLeft} restante(s)</span>
                </div>
              )}

              {/* Progress bar */}
              {data.status === "playing" && (
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary/80 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${100 - data.progress.blurPercent}%` }}
                  />
                </div>
              )}

              {/* Guess history chips */}
              {data.progress.guesses.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Tentativas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.progress.guesses.map((g, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                          g.correct
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        }`}
                      >
                        {g.correct ? "✓" : "✕"} {g.text}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Back button when finished */}
              {isFinished && (
                <div className="flex justify-center pt-2">
                  <Button variant="secondary" asChild>
                    <Link href="/jogos">Voltar aos Jogos</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AppShell>
  );
}

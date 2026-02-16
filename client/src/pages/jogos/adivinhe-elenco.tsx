"use client";

import { useRef, useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { AppShell } from "@/components/ui/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RotateCcw, Flag, CheckCircle2 } from "lucide-react";
import {
  useGameSet,
  useStartAttempt,
  useAttempt,
  useGuess,
  useResetAttempt,
  useAbandonAttempt,
} from "@/features/games/api";

function AdivinheElencoPage() {
  const [, params] = useRoute("/jogos/adivinhe-elenco/:slug");
  const slug = params?.slug ?? "";
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: setData, isLoading: setLoading, error: setError } = useGameSet(slug);
  const startAttempt = useStartAttempt();
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const { data: attemptData, isLoading: attemptLoading } = useAttempt(attemptId);
  const guessMutation = useGuess(attemptId ?? "");
  const resetMutation = useResetAttempt(attemptId ?? "");
  const abandonMutation = useAbandonAttempt(attemptId ?? "");

  // Start or resume attempt when set loads
  useEffect(() => {
    if (!slug || !setData || attemptId) return;
    startAttempt.mutate(slug, {
      onSuccess: (res) => setAttemptId(res.attemptId),
      onError: (err) => toast({ variant: "destructive", title: "Erro", description: err.message }),
    });
  }, [slug, setData?.id, attemptId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (!input || !input.value.trim() || guessMutation.isPending) return;
    const text = input.value.trim();
    input.value = "";
    guessMutation.mutate(text, {
      onSuccess: (result) => {
        if (result.matched) {
          toast({ title: `Acertou: ${result.displayName} ✅` });
          if (attemptData && result.setPlayerId && attemptData.guessedIds.length + 1 >= attemptData.set.players.length) {
            toast({ title: "Parabéns! 🎉", description: "Você completou o elenco!" });
          }
        } else {
          if (result.reason === "already_guessed") {
            toast({ variant: "destructive", title: "Já acertou", description: "Esse jogador já foi revelado." });
          } else {
            toast({ variant: "destructive", title: "Não foi dessa vez", description: "Tente outro nome." });
          }
        }
      },
      onError: (err) => toast({ variant: "destructive", title: "Erro", description: err.message }),
    });
    inputRef.current?.focus();
  };

  const handleReset = () => {
    resetMutation.mutate(undefined, {
      onSuccess: () => toast({ title: "Reiniciado", description: "Boa sorte!" }),
      onError: (err) => toast({ variant: "destructive", title: "Erro", description: err.message }),
    });
    inputRef.current?.focus();
  };

  const handleAbandon = () => {
    abandonMutation.mutate(undefined, {
      onSuccess: () => {
        toast({ title: "Desistência", description: "Todos os jogadores foram revelados." });
        if (attemptData) {
          // Refetch to get full state (abandoned shows all)
          // Actually abandon just marks status - we need to "reveal all" - the spec says
          // "Desistir (revelar todos)". So when abandoned, we should show all players.
          // The attempt status becomes "abandoned" - we can treat that as "show all" in the UI.
        }
      },
      onError: (err) => toast({ variant: "destructive", title: "Erro", description: err.message }),
    });
  };

  const isLoading = setLoading || (!!setData && !attemptId && startAttempt.isPending) || attemptLoading;
  const guessedSet = new Set(attemptData?.guessedIds ?? []);
  const total = attemptData?.set.players.length ?? 0;
  const correct = guessedSet.size;
  const progress = total > 0 ? (correct / total) * 100 : 0;
  const isCompleted = attemptData?.status === "completed";
  const isAbandoned = attemptData?.status === "abandoned";
  const showAll = isCompleted || isAbandoned;

  if (setError || (!slug && !setLoading)) {
    return (
      <AppShell>
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Set não encontrado.</p>
          <Link href="/jogos">
            <Button variant="outline" className="mt-4">
              Voltar aos Jogos
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell mainClassName="py-4 sm:py-6 px-3 sm:px-4 max-w-3xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/jogos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-xl text-foreground truncate">
              {setData?.title ?? "Carregando..."}
            </h1>
            <p className="text-sm text-muted-foreground">
              {setData?.competition}
              {setData?.season ? ` • ${setData.season}` : ""}
            </p>
          </div>
        </div>

        {isLoading ? (
          <Card className="rounded-2xl">
            <CardContent className="py-12">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-14 bg-muted rounded-lg" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-2xl border border-white/5 bg-card overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {correct} / {total} acertados
                  </span>
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-emerald-500 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      Completo!
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={resetMutation.isPending}
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Reiniciar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAbandon}
                    disabled={abandonMutation.isPending || showAll}
                  >
                    <Flag className="h-3.5 w-3.5 mr-1" />
                    Desistir
                  </Button>
                </div>
              </div>
              <Progress value={progress} className="h-2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {attemptData?.set.players.map((p) => {
                  const revealed = showAll || guessedSet.has(p.id);
                  return (
                    <div
                      key={p.id}
                      className={`
                        flex items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-200
                        ${revealed ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/5 bg-surface-elevated"}
                      `}
                    >
                      {p.jerseyNumber != null && (
                        <span className="shrink-0 w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-bold">
                          {p.jerseyNumber}
                        </span>
                      )}
                      <span className={revealed ? "text-foreground font-medium" : "text-muted-foreground"}>
                        {revealed ? p.displayName : "______"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {!showAll && (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Digite um nome e pressione Enter..."
                    className="flex-1"
                    autoFocus
                    disabled={guessMutation.isPending}
                  />
                  <Button type="submit" disabled={guessMutation.isPending}>
                    Enviar
                  </Button>
                </form>
              )}

              {isCompleted && (
                <div className="text-center py-4">
                  <p className="text-emerald-500 font-medium mb-2">Parabéns! Você completou o elenco! 🎉</p>
                  <Button onClick={handleReset} variant="secondary">
                    Jogar de novo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

export default AdivinheElencoPage;

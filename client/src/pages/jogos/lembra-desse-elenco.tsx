"use client";

import { useLocation, Link } from "wouter";
import { AppShell } from "@/components/ui/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { useGamesSets } from "@/features/games/api";

export default function LembraDesseElencoPage() {
  const [, setLocation] = useLocation();
  const { data: sets, isLoading, error } = useGamesSets();

  return (
    <AppShell mainClassName="py-4 sm:py-6 md:py-8 px-3 sm:px-4 max-w-5xl mx-auto">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/jogos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground flex items-center gap-2">
              <Gamepad2 className="h-7 w-7 text-primary shrink-0" />
              Lembra desse elenco?
            </h1>
            <p className="text-muted-foreground mt-1">
              Escolha um elenco histórico para tentar adivinhar.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Não foi possível carregar os elencos.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/jogos">Voltar aos Jogos</Link>
            </Button>
          </div>
        ) : !sets || sets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum elenco disponível ainda.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/jogos">Voltar aos Jogos</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sets.map((set) => (
              <Card
                key={set.id}
                className="rounded-2xl border border-white/5 bg-card overflow-hidden transition-all duration-fast hover:border-primary/20 cursor-pointer"
                onClick={() => setLocation(`/jogos/adivinhe-elenco/${set.slug}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display font-bold text-lg text-foreground">
                      {set.clubName}
                    </h3>
                    <span className="text-xs font-medium text-emerald-500/80 shrink-0">
                      Disponível
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {set.competition ?? "Competição"}
                    {set.season != null ? ` • ${set.season}` : ""}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/jogos/adivinhe-elenco/${set.slug}`);
                    }}
                  >
                    Jogar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

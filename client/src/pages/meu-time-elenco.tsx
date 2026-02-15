import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { AppShell } from '@/components/ui/app-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SquadPage } from '@/features/team';
import { getClubConfig } from '@/features/meu-time';
import type { Player } from '@shared/schema';
import { ArrowLeft } from 'lucide-react';

export default function MeuTimeElencoPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const teamId = user?.teamId ?? null;

  const playersQuery = useQuery<Player[]>({
    queryKey: ['/api/teams', teamId, 'players'],
    queryFn: async () => {
      if (!teamId) return [];
      const response = await fetch(`/api/teams/${teamId}/players`, {
        credentials: 'include',
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch players: ${text}`);
      }
      return response.json();
    },
    enabled: !!teamId,
    retry: false,
  });

  const clubConfig = getClubConfig(teamId);
  const season = new Date().getFullYear();

  if (isAuthLoading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-24 rounded-soft" />
          <Skeleton className="h-96 rounded-soft" />
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <EmptyState
          title="Você precisa estar logado"
          description="Faça login para ver o elenco do seu time."
          actionLabel="Ir para login"
          onAction={() => {
            window.location.href = '/login';
          }}
        />
      </AppShell>
    );
  }

  if (!teamId) {
    return (
      <AppShell>
        <EmptyState
          title="Você ainda não escolheu um time"
          description="Escolha um time para ver o elenco."
          actionLabel="Selecionar time"
          onAction={() => {
            window.location.href = '/selecionar-time';
          }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell mainClassName="py-4 sm:py-6 px-4 sm:px-6 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6 space-y-4">
          <Link href="/meu-time">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Meu Time
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Elenco do {clubConfig.displayName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Temporada {season}
            </p>
          </div>
        </div>

        {/* Content */}
        {playersQuery.isError ? (
          <div className="rounded-2xl border border-white/5 bg-card p-8 text-center">
            <p className="text-foreground-secondary mb-4">
              Não foi possível carregar o elenco. Tente novamente.
            </p>
            <Button variant="outline" size="sm" onClick={() => playersQuery.refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : playersQuery.isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-16 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : playersQuery.data && playersQuery.data.length > 0 ? (
          <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur-sm p-4 sm:p-6">
            <SquadPage
              players={playersQuery.data}
              getPhotoUrl={(p) => p.photoUrl ?? '/assets/players/placeholder.png'}
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-card p-8 text-center">
            <p className="text-foreground-secondary">Nenhum jogador no elenco no momento.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}

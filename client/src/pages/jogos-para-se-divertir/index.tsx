'use client';

import { AppShell } from '@/components/ui/app-shell';
import { useAuth } from '@/lib/auth-context';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { GAMES } from './games.data';
import { GameCard } from './components/GameCard';
import { Gamepad2 } from 'lucide-react';

export default function JogosParaSeDivertirPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <EmptyState
          title="Você precisa estar logado"
          description="Faça login para acessar os jogos."
          actionLabel="Ir para login"
          onAction={() => {
            window.location.href = '/login';
          }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell mainClassName="py-4 sm:py-6 md:py-8 px-3 sm:px-4 max-w-5xl mx-auto">
      <div className="space-y-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-primary" />
            Jogos (para se divertir)
          </h1>
          <p className="text-muted-foreground">
            Mini-games do seu clube — só pra brincar.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

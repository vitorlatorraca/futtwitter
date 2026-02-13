import { Card, CardContent } from '@/components/ui/card';
import { Trophy, TrendingUp, Shield, TrendingDown } from 'lucide-react';
import type { ClubStats } from '../types';

interface TeamStatsCardsProps {
  stats: ClubStats;
}

export function TeamStatsCards({ stats }: TeamStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <Card className="rounded-2xl border border-white/5 bg-card">
        <CardContent className="p-4 text-center">
          <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.points}</p>
          <p className="text-sm text-muted-foreground font-medium">Pontos</p>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border border-white/5 bg-card">
        <CardContent className="p-4 text-center">
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-success" />
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.wins}</p>
          <p className="text-sm text-muted-foreground font-medium">Vitórias</p>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border border-white/5 bg-card">
        <CardContent className="p-4 text-center">
          <Shield className="h-6 w-6 mx-auto mb-2 text-warning" />
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.draws}</p>
          <p className="text-sm text-muted-foreground font-medium">Empates</p>
        </CardContent>
      </Card>
      <Card className="rounded-2xl border border-white/5 bg-card">
        <CardContent className="p-4 text-center">
          <TrendingDown className="h-6 w-6 mx-auto mb-2 text-danger" />
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{stats.losses}</p>
          <p className="text-sm text-muted-foreground font-medium">Derrotas</p>
        </CardContent>
      </Card>
    </div>
  );
}

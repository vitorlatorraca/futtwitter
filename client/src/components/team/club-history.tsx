import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Match } from '@shared/schema';

interface ClubHistoryProps {
  matches: Match[];
  // TODO: Adicionar histórico de temporadas passadas quando schema for expandido
}

export function ClubHistory({ matches }: ClubHistoryProps) {
  // Process matches to create season history
  // For now, we'll use the current season's matches
  // TODO: Agrupar por temporada quando dados históricos estiverem disponíveis

  const seasonData = matches
    .filter((m) => m.status === 'COMPLETED')
    .map((match) => {
      const date = new Date(match.matchDate);
      return {
        season: `${date.getFullYear()}`,
        // Mock: Simular posição final baseada em performance
        // TODO: Buscar posições finais reais quando schema for expandido
        position: 5, // Placeholder
      };
    });

  // Group by season and calculate average position
  const seasonHistory: { season: string; position: number }[] = [];
  const seasonMap = new Map<string, number[]>();

  seasonData.forEach((data) => {
    if (!seasonMap.has(data.season)) {
      seasonMap.set(data.season, []);
    }
    seasonMap.get(data.season)!.push(data.position);
  });

  seasonMap.forEach((positions, season) => {
    const avgPosition = positions.reduce((sum, pos) => sum + pos, 0) / positions.length;
    seasonHistory.push({
      season,
      position: Math.round(avgPosition),
    });
  });

  // Sort by season
  seasonHistory.sort((a, b) => a.season.localeCompare(b.season));

  if (seasonHistory.length === 0) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-card-border">
        <CardHeader>
          <CardTitle className="text-xl font-display flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Histórico do Clube
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum histórico disponível</p>
            <p className="text-xs mt-2">TODO: Adicionar dados históricos quando schema for expandido</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-card-border">
      <CardHeader>
        <CardTitle className="text-xl font-display flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Histórico do Clube
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* History Chart */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Evolução de Posições</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={seasonHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
              <XAxis
                dataKey="season"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                reversed
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                domain={[1, 20]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--card-border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [`${value}º lugar`, 'Posição']}
              />
              <Line
                type="monotone"
                dataKey="position"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Season List */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Temporadas</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {seasonHistory.map((season) => (
              <div
                key={season.season}
                className="flex items-center justify-between p-3 rounded-lg bg-card/40 border border-card-border"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Temporada {season.season}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-bold text-foreground">{season.position}º lugar</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-card-border">
          <p>TODO: Adicionar dados históricos completos quando schema for expandido</p>
        </div>
      </CardContent>
    </Card>
  );
}

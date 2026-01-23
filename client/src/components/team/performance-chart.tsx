import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { Match } from '@shared/schema';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PerformanceChartProps {
  matches: Match[];
  teamId: string;
}

export function PerformanceChart({ matches, teamId }: PerformanceChartProps) {
  // Process matches for chart data
  const chartData = matches
    .filter((m) => m.status === 'COMPLETED' && m.teamScore !== null && m.opponentScore !== null)
    .slice()
    .reverse()
    .map((match, index) => {
      const isWin = match.teamScore! > match.opponentScore!;
      const isDraw = match.teamScore === match.opponentScore;
      const isLoss = match.teamScore! < match.opponentScore!;

      return {
        match: index + 1,
        date: format(new Date(match.matchDate), 'dd/MM', { locale: ptBR }),
        goalsFor: match.teamScore || 0,
        goalsAgainst: match.opponentScore || 0,
        result: isWin ? 'W' : isDraw ? 'D' : 'L',
        points: isWin ? 3 : isDraw ? 1 : 0,
      };
    });

  // Calculate cumulative points
  let cumulativePoints = 0;
  const pointsData = chartData.map((data) => {
    cumulativePoints += data.points;
    return {
      ...data,
      cumulativePoints,
    };
  });

  // Calculate stats
  const stats = {
    goalsFor: chartData.reduce((sum, m) => sum + m.goalsFor, 0),
    goalsAgainst: chartData.reduce((sum, m) => sum + m.goalsAgainst, 0),
    cleanSheets: chartData.filter((m) => m.goalsAgainst === 0).length,
    avgGoalsFor: chartData.length > 0 ? (chartData.reduce((sum, m) => sum + m.goalsFor, 0) / chartData.length).toFixed(1) : '0',
    avgGoalsAgainst: chartData.length > 0 ? (chartData.reduce((sum, m) => sum + m.goalsAgainst, 0) / chartData.length).toFixed(1) : '0',
  };

  if (chartData.length === 0) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-card-border">
        <CardHeader>
          <CardTitle className="text-xl font-display flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Desempenho do Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum dado de partidas disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-card-border">
      <CardHeader>
        <CardTitle className="text-xl font-display flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Desempenho do Time
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-card/40 border border-card-border">
            <Target className="h-5 w-5 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-foreground">{stats.goalsFor}</p>
            <p className="text-xs text-muted-foreground">Gols Marcados</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-card/40 border border-card-border">
            <Shield className="h-5 w-5 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold text-foreground">{stats.goalsAgainst}</p>
            <p className="text-xs text-muted-foreground">Gols Sofridos</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-card/40 border border-card-border">
            <Shield className="h-5 w-5 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold text-foreground">{stats.cleanSheets}</p>
            <p className="text-xs text-muted-foreground">Clean Sheets</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-card/40 border border-card-border">
            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{stats.avgGoalsFor}</p>
            <p className="text-xs text-muted-foreground">Média Gols/Partida</p>
          </div>
        </div>

        {/* Points Chart */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Evolução de Pontos</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={pointsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
              <XAxis
                dataKey="match"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--card-border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line
                type="monotone"
                dataKey="cumulativePoints"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Goals Chart */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-foreground">Gols por Partida</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.slice(-10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--card-border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="goalsFor" fill="hsl(var(--primary))" name="Gols Marcados" />
              <Bar dataKey="goalsAgainst" fill="hsl(var(--destructive))" name="Gols Sofridos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

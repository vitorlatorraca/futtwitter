import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getTeamCrest } from '@/lib/teamCrests';
import type { Team } from '@shared/schema';

interface LeagueTableProps {
  teams: Team[];
  currentTeamId: string;
}

export function LeagueTable({ teams, currentTeamId }: LeagueTableProps) {
  // Sort teams by position
  const sortedTeams = [...teams].sort((a, b) => {
    if (a.currentPosition === null) return 1;
    if (b.currentPosition === null) return -1;
    return a.currentPosition - b.currentPosition;
  });

  const getPositionChange = (team: Team): 'up' | 'down' | 'same' | null => {
    // TODO: Comparar com posição anterior quando histórico estiver disponível
    return null;
  };

  const getPositionIcon = (change: 'up' | 'down' | 'same' | null) => {
    switch (change) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      case 'same':
        return <Minus className="h-3 w-3 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-card-border">
      <CardHeader>
        <CardTitle className="text-xl font-display flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Tabela da Liga
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">POS</th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground">TIME</th>
                <th className="text-center p-3 text-sm font-semibold text-muted-foreground">P</th>
                <th className="text-center p-3 text-sm font-semibold text-muted-foreground">V</th>
                <th className="text-center p-3 text-sm font-semibold text-muted-foreground">E</th>
                <th className="text-center p-3 text-sm font-semibold text-muted-foreground">D</th>
                <th className="text-center p-3 text-sm font-semibold text-muted-foreground">SG</th>
                <th className="text-center p-3 text-sm font-semibold text-muted-foreground">PTS</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map((team) => {
                const isCurrentTeam = team.id === currentTeamId;
                const goalDifference = team.goalsFor - team.goalsAgainst;
                const positionChange = getPositionChange(team);

                return (
                  <tr
                    key={team.id}
                    className={`border-b border-card-border transition-colors ${
                      isCurrentTeam
                        ? 'bg-primary/10 hover:bg-primary/15'
                        : 'hover:bg-card/40'
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isCurrentTeam ? 'text-primary' : 'text-foreground'}`}>
                          {team.currentPosition || '-'}
                        </span>
                        {positionChange && getPositionIcon(positionChange)}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={getTeamCrest(team.id)}
                          alt={team.name}
                          className="w-8 h-8 object-contain"
                        />
                        <span className={`font-medium ${isCurrentTeam ? 'text-primary font-semibold' : 'text-foreground'}`}>
                          {team.shortName}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-center text-foreground">
                      {team.wins + team.draws + team.losses}
                    </td>
                    <td className="p-3 text-center text-green-500 font-semibold">{team.wins}</td>
                    <td className="p-3 text-center text-yellow-500 font-semibold">{team.draws}</td>
                    <td className="p-3 text-center text-red-500 font-semibold">{team.losses}</td>
                    <td className={`p-3 text-center font-semibold ${
                      goalDifference > 0
                        ? 'text-green-500'
                        : goalDifference < 0
                        ? 'text-red-500'
                        : 'text-muted-foreground'
                    }`}>
                      {goalDifference > 0 ? '+' : ''}
                      {goalDifference}
                    </td>
                    <td className={`p-3 text-center font-bold ${
                      isCurrentTeam ? 'text-primary' : 'text-foreground'
                    }`}>
                      {team.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

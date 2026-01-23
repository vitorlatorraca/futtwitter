import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Medal } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  competition: string;
  year: number;
  icon: 'trophy' | 'award' | 'medal';
}

interface AchievementsProps {
  achievements?: Achievement[];
}

export function Achievements({ achievements }: AchievementsProps) {
  // Mock achievements - TODO: Buscar da API quando schema for expandido
  const defaultAchievements: Achievement[] = achievements || [
    {
      id: '1',
      name: 'Campeonato Brasileiro',
      competition: 'Brasileirão Série A',
      year: 2020,
      icon: 'trophy',
    },
    {
      id: '2',
      name: 'Copa do Brasil',
      competition: 'Copa do Brasil',
      year: 2019,
      icon: 'trophy',
    },
    {
      id: '3',
      name: 'Copa Libertadores',
      competition: 'Copa Libertadores',
      year: 2021,
      icon: 'award',
    },
  ];

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'trophy':
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 'award':
        return <Award className="h-6 w-6 text-blue-500" />;
      case 'medal':
        return <Medal className="h-6 w-6 text-gray-400" />;
      default:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
    }
  };

  if (defaultAchievements.length === 0) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-card-border">
        <CardHeader>
          <CardTitle className="text-xl font-display flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma conquista registrada</p>
            <p className="text-xs mt-2">TODO: Adicionar sistema de conquistas quando schema for expandido</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-card-border">
      <CardHeader>
        <CardTitle className="text-xl font-display flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Conquistas ({defaultAchievements.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {defaultAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-card/40 border border-card-border hover:border-primary/50 transition-colors"
            >
              <div className="flex-shrink-0">{getIcon(achievement.icon)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground mb-1">{achievement.name}</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {achievement.competition}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {achievement.year}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground text-center mt-4 pt-4 border-t border-card-border">
          <p>TODO: Integrar com sistema de conquistas quando schema for expandido</p>
        </div>
      </CardContent>
    </Card>
  );
}

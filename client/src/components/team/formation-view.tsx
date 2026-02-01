import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import type { Player } from '@shared/schema';

interface FormationViewProps {
  players: Player[];
  formation?: string; // e.g., "4-3-3", "4-4-2"
  captainId?: string;
  // TODO: Adicionar suporte para drag & drop de jogadores
}

// Mock formation - TODO: Buscar da API ou permitir configuração
const DEFAULT_FORMATION = '4-3-3';

const formationPositions: Record<string, { x: number; y: number }[]> = {
  '4-3-3': [
    // Goalkeeper
    { x: 50, y: 95 },
    // Defenders
    { x: 20, y: 75 },
    { x: 40, y: 75 },
    { x: 60, y: 75 },
    { x: 80, y: 75 },
    // Midfielders
    { x: 30, y: 50 },
    { x: 50, y: 50 },
    { x: 70, y: 50 },
    // Forwards
    { x: 25, y: 25 },
    { x: 50, y: 20 },
    { x: 75, y: 25 },
  ],
  '4-4-2': [
    // Goalkeeper
    { x: 50, y: 95 },
    // Defenders
    { x: 20, y: 75 },
    { x: 40, y: 75 },
    { x: 60, y: 75 },
    { x: 80, y: 75 },
    // Midfielders
    { x: 20, y: 50 },
    { x: 40, y: 50 },
    { x: 60, y: 50 },
    { x: 80, y: 50 },
    // Forwards
    { x: 35, y: 25 },
    { x: 65, y: 25 },
  ],
};

function getPositionGroup(position: string): 'GK' | 'DF' | 'MF' | 'FW' {
  switch (position) {
    case 'Goalkeeper':
      return 'GK';
    case 'Centre-Back':
    case 'Left-Back':
    case 'Right-Back':
      return 'DF';
    case 'Defensive Midfield':
    case 'Central Midfield':
    case 'Attacking Midfield':
      return 'MF';
    case 'Left Winger':
    case 'Right Winger':
    case 'Centre-Forward':
      return 'FW';
    default:
      if (position.toLowerCase().includes('midfield')) return 'MF';
      if (position.toLowerCase().includes('keeper')) return 'GK';
      if (position.toLowerCase().includes('back')) return 'DF';
      return 'FW';
  }
}

export function FormationView({ players, formation = DEFAULT_FORMATION, captainId }: FormationViewProps) {
  // Group players by position
  const goalkeepers = players.filter((p) => getPositionGroup(p.position) === 'GK');
  const defenders = players.filter((p) => getPositionGroup(p.position) === 'DF');
  const midfielders = players.filter((p) => getPositionGroup(p.position) === 'MF');
  const forwards = players.filter((p) => getPositionGroup(p.position) === 'FW');

  // Select players for formation (simplified - just takes first N of each position)
  const selectedPlayers: (Player | null)[] = [];
  const positions = formationPositions[formation] || formationPositions[DEFAULT_FORMATION];

  // Goalkeeper
  selectedPlayers.push(goalkeepers[0] || null);
  // Defenders (take first N based on formation)
  const defenderCount = parseInt(formation.split('-')[0]) || 4;
  for (let i = 0; i < defenderCount; i++) {
    selectedPlayers.push(defenders[i] || null);
  }
  // Midfielders
  const midCount = parseInt(formation.split('-')[1]) || 3;
  for (let i = 0; i < midCount; i++) {
    selectedPlayers.push(midfielders[i] || null);
  }
  // Forwards
  const forwardCount = parseInt(formation.split('-')[2]) || 3;
  for (let i = 0; i < forwardCount; i++) {
    selectedPlayers.push(forwards[i] || null);
  }

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-card-border">
      <CardHeader>
        <CardTitle className="text-xl font-display flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Formação Tática
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Formation Badge */}
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-lg font-bold px-4 py-2">
              {formation}
            </Badge>
          </div>

          {/* Field Visualization */}
          <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-green-600/20 via-green-700/20 to-green-800/20 rounded-lg border-2 border-green-500/30 overflow-hidden">
            {/* Field Lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              {/* Center Circle */}
              <circle
                cx="50%"
                cy="50%"
                r="15%"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
              {/* Center Line */}
              <line
                x1="0%"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
              {/* Penalty Areas */}
              <rect
                x="0%"
                y="60%"
                width="25%"
                height="40%"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              <rect
                x="75%"
                y="60%"
                width="25%"
                height="40%"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
            </svg>

            {/* Players on Field */}
            {positions.map((pos, index) => {
              const player = selectedPlayers[index];
              if (!player) return null;

              const isCaptain = player.id === captainId;

              return (
                <div
                  key={`${player.id}-${index}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                  }}
                >
                  <div className="relative group">
                    <div
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        isCaptain
                          ? 'bg-yellow-500/80 border-yellow-400 shadow-lg shadow-yellow-500/50'
                          : 'bg-primary/80 border-primary/50'
                      }`}
                    >
                      {player.shirtNumber ?? '—'}
                    </div>
                    {isCaptain && (
                      <div className="absolute -top-1 -right-1">
                        <Trophy className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      </div>
                    )}
                    {/* Player Name Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-background/95 backdrop-blur-sm text-xs px-2 py-1 rounded border border-card-border whitespace-nowrap">
                        {player.name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Formation Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Formação padrão do time</p>
            <p className="text-xs mt-1">TODO: Adicionar suporte para edição de formação e drag & drop</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, TrendingUp } from 'lucide-react';

interface StadiumCardProps {
  stadiumName: string;
  capacity: number;
  pitchCondition?: 'Excelente' | 'Boa' | 'Regular' | 'Ruim';
  stadiumCondition?: 'Excelente' | 'Boa' | 'Regular' | 'Ruim';
  homeFactor?: number; // 0-100
  yearBuilt?: number;
  // TODO: Adicionar imagem do estádio quando disponível
}

export function StadiumCard({
  stadiumName,
  capacity,
  pitchCondition = 'Excelente',
  stadiumCondition = 'Boa',
  homeFactor = 75,
  yearBuilt,
}: StadiumCardProps) {
  const getConditionColor = (condition?: string) => {
    switch (condition) {
      case 'Excelente':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Boa':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Regular':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Ruim':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-card-border overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-display flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Visão do Estádio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stadium Illustration */}
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gradient-to-b from-green-600/20 to-green-800/20 border border-green-500/20">
          {/* Pitch Pattern */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-full h-full relative">
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/30" />
              {/* Center Line */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-white/20" />
              {/* Penalty Areas */}
              <div className="absolute top-1/4 left-0 w-1/4 h-1/2 border-r-2 border-white/20" />
              <div className="absolute top-1/4 right-0 w-1/4 h-1/2 border-l-2 border-white/20" />
            </div>
          </div>
          
          {/* Stadium Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
            <h3 className="font-bold text-lg text-foreground">{stadiumName}</h3>
          </div>
        </div>

        {/* Stadium Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Capacidade</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {capacity.toLocaleString('pt-BR')}
            </p>
          </div>

          {yearBuilt && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Ano de Construção</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{yearBuilt}</p>
            </div>
          )}
        </div>

        {/* Conditions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Condição do Gramado</span>
            <Badge className={getConditionColor(pitchCondition)} variant="outline">
              {pitchCondition}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Condição do Estádio</span>
            <Badge className={getConditionColor(stadiumCondition)} variant="outline">
              {stadiumCondition}
            </Badge>
          </div>
        </div>

        {/* Home Factor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Fator Casa</span>
            </div>
            <span className="text-sm font-bold text-foreground">{homeFactor}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
              style={{ width: `${homeFactor}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

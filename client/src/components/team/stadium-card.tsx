import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users } from 'lucide-react';

interface StadiumCardProps {
  stadiumName: string;
  capacity: number;
  pitchCondition?: 'Excelente' | 'Boa' | 'Regular' | 'Ruim';
  stadiumCondition?: 'Excelente' | 'Boa' | 'Regular' | 'Ruim';
  homeFactor?: number;
  yearBuilt?: number;
  /** Prefer this over teamId for image: use clubConfig.stadiumImageSrc */
  stadiumImageSrc?: string | null;
  /** When set, shows premium card with hero image + optional last match section */
  teamId?: string;
  /** Last match section (e.g. for Corinthians) */
  lastMatchSection?: React.ReactNode;
}

const STADIUM_PLACEHOLDER = '/assets/stadiums/placeholder.jpg';

export function StadiumCard({
  stadiumName,
  capacity,
  pitchCondition = 'Excelente',
  stadiumCondition = 'Boa',
  homeFactor = 75,
  yearBuilt,
  stadiumImageSrc,
  teamId,
  lastMatchSection,
}: StadiumCardProps) {
  const hasHeroImage = Boolean(stadiumImageSrc || (teamId && lastMatchSection));
  const stadiumImage = hasHeroImage ? (stadiumImageSrc ?? STADIUM_PLACEHOLDER) : null;

  if (hasHeroImage) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-card-border overflow-hidden">
        <div className="relative w-full h-40 sm:h-48 overflow-hidden">
          <img
            src={stadiumImage ?? STADIUM_PLACEHOLDER}
            alt={stadiumName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = STADIUM_PLACEHOLDER;
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h2 className="text-xl sm:text-2xl font-display font-bold">{stadiumName}</h2>
          </div>
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Capacidade: {capacity.toLocaleString('pt-BR')}</span>
          </div>
          {lastMatchSection}
        </CardContent>
      </Card>
    );
  }

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
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gradient-to-b from-green-600/20 to-green-800/20 border border-green-500/20">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
            <h3 className="font-bold text-lg text-foreground">{stadiumName}</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Capacidade</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{capacity.toLocaleString('pt-BR')}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Condição do Gramado</span>
            <Badge className={getConditionColor(pitchCondition)} variant="outline">{pitchCondition}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Condição do Estádio</span>
            <Badge className={getConditionColor(stadiumCondition)} variant="outline">{stadiumCondition}</Badge>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Fator Casa</span>
            <span className="text-sm font-bold text-foreground">{homeFactor}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${homeFactor}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

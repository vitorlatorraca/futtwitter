import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, TrendingDown, Shield, Star } from 'lucide-react';
import type { Team } from '@shared/schema';

interface TeamHeaderProps {
  team: Team;
  // TODO: Adicionar campos quando schema for expandido
  league?: string;
  season?: string;
  country?: string;
  stadiumName?: string;
  stadiumCapacity?: number;
  clubStatus?: 'Profissional' | 'Semi-Profissional' | 'Amador';
  reputation?: number; // 0-5 stars
}

export function TeamHeader({
  team,
  league = 'Brasileirão Série A', // TODO: Buscar da API
  season = '2024', // TODO: Buscar da API
  country = 'Brasil', // TODO: Buscar da API
  stadiumName, // TODO: Buscar da API
  stadiumCapacity, // TODO: Buscar da API
  clubStatus = 'Profissional', // TODO: Buscar da API
  reputation = 4, // TODO: Buscar da API
}: TeamHeaderProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? 'fill-warning text-warning'
                : i < rating
                ? 'fill-warning/50 text-warning/50'
                : 'text-foreground-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="glass-card p-8 mb-8 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${team.primaryColor}15 0%, ${team.secondaryColor}15 100%)`,
      }}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
          {/* Club Crest */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-card border-4 border-card-border flex items-center justify-center overflow-hidden shadow-lg">
              <img
                src={team.logoUrl}
                alt={`Escudo ${team.name}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain p-2"
              />
            </div>
          </div>

          {/* Club Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-2 text-foreground">
              {team.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <Badge variant="secondary" className="text-sm font-semibold px-3 py-1">
                {league}
              </Badge>
              {team.currentPosition && (
                <Badge variant="outline" className="text-sm font-semibold px-3 py-1">
                  {team.currentPosition}º Posição
                </Badge>
              )}
              <Badge variant="outline" className="text-sm font-semibold px-3 py-1">
                {country}
              </Badge>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
              {season && (
                <div>
                  <span className="font-semibold">Temporada:</span> {season}
                </div>
              )}
              {stadiumName && (
                <div>
                  <span className="font-semibold">Estádio:</span> {stadiumName}
                </div>
              )}
              <div>
                <span className="font-semibold">Status:</span> {clubStatus}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Reputação:</span>
                {renderStars(reputation)}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold text-foreground">{team.points}</p>
              <p className="text-sm text-muted-foreground font-medium">Pontos</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-success" />
              <p className="text-3xl font-bold text-foreground">{team.wins}</p>
              <p className="text-sm text-muted-foreground font-medium">Vitórias</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-warning" />
              <p className="text-3xl font-bold text-foreground">{team.draws}</p>
              <p className="text-sm text-muted-foreground font-medium">Empates</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-6 w-6 mx-auto mb-2 text-danger" />
              <p className="text-3xl font-bold text-foreground">{team.losses}</p>
              <p className="text-sm text-muted-foreground font-medium">Derrotas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

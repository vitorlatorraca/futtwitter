import { Badge } from '@/components/ui/badge';
import { TeamBadge } from '@/components/team/TeamBadge';
import { Star } from 'lucide-react';
import { TeamHero } from './TeamHero';
import { TeamStatsCards } from './TeamStatsCards';
import { normalizeReputation } from '../helpers';
import type { ClubConfig } from '../types';
import type { ClubStats } from '../types';

interface TeamHeaderCardProps {
  clubConfig: ClubConfig;
  stats: ClubStats;
  /** Current position in league (optional) */
  currentPosition?: number | null;
  /** Override reputation; otherwise uses clubConfig.reputation */
  reputation?: number | null;
}

function ReputationStars({ value }: { value: number }) {
  const normalized = normalizeReputation(value);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Reputação: ${normalized} de 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(normalized)
              ? 'fill-warning text-warning'
              : i < normalized
                ? 'fill-warning/50 text-warning/50'
                : 'text-foreground-muted'
          }`}
        />
      ))}
    </div>
  );
}

export function TeamHeaderCard({
  clubConfig,
  stats,
  currentPosition,
  reputation,
}: TeamHeaderCardProps) {
  const rep = reputation ?? clubConfig.reputation;

  return (
    <TeamHero theme={clubConfig.theme} className="glass-card p-6 sm:p-8 mb-6 sm:mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
        <TeamBadge
          teamId={clubConfig.teamId}
          teamName={clubConfig.displayName}
          badgeSrc={clubConfig.badgeSrc}
          size="lg"
          glassRing
        />
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-2 text-foreground">
            {clubConfig.displayName}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mb-4">
            <Badge variant="secondary" className="text-sm font-semibold px-3 py-1">
              {clubConfig.league}
            </Badge>
            {currentPosition != null && (
              <Badge variant="outline" className="text-sm font-semibold px-3 py-1">
                {currentPosition}º Posição
              </Badge>
            )}
            <Badge variant="outline" className="text-sm font-semibold px-3 py-1">
              {clubConfig.country}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold">Temporada:</span> {clubConfig.seasonLabel}
            </div>
            <div>
              <span className="font-semibold">Estádio:</span> {clubConfig.stadiumName}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Reputação:</span>
              <ReputationStars value={rep} />
            </div>
          </div>
        </div>
      </div>
      <TeamStatsCards stats={stats} />
    </TeamHero>
  );
}

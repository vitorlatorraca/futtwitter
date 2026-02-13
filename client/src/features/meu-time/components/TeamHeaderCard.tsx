import { Badge } from '@/components/ui/badge';
import { TeamBadge } from '@/components/team/TeamBadge';
import { Star, MapPin, User, Calendar } from 'lucide-react';
import { TeamHero } from './TeamHero';
import { normalizeReputation } from '../helpers';
import type { ClubConfig } from '../types';

interface TeamHeaderCardProps {
  clubConfig: ClubConfig;
  currentPosition?: number | null;
  reputation?: number | null;
  team?: { id?: string } | null;
}

function ReputationStars({ value }: { value: number }) {
  const normalized = normalizeReputation(value);
  return (
    <div className="flex items-center gap-0.5" aria-label={`Reputação: ${normalized} de 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 transition-colors ${
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
  currentPosition,
  reputation,
}: TeamHeaderCardProps) {
  const rep = reputation ?? clubConfig.reputation;

  return (
    <TeamHero
      theme={clubConfig.theme}
      className="rounded-2xl bg-gradient-to-br from-card via-card/95 to-card/60 border border-card-border/80 p-8 sm:p-10 shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
        <TeamBadge
          teamId={clubConfig.teamId}
          teamName={clubConfig.displayName}
          size="lg"
          glassRing
          className="w-28 h-28 sm:w-32 sm:h-32"
        />
        <div className="flex-1 text-center sm:text-left space-y-4">
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight">
              {clubConfig.displayName}
            </h1>
            <Badge variant="secondary" className="mt-2 text-sm font-medium">
              {clubConfig.league || '—'}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-1 text-sm text-muted-foreground">
            {currentPosition != null && (
              <span className="font-medium text-foreground">{currentPosition}º</span>
            )}
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {clubConfig.coach ?? '—'}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {clubConfig.stadiumName ?? '—'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {clubConfig.seasonLabel ?? '—'}
            </span>
            <span className="flex items-center gap-1.5">
              <ReputationStars value={rep} />
            </span>
          </div>
        </div>
      </div>
    </TeamHero>
  );
}

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { getTrophyIconPath } from '../helpers';
import type { ClubConfig, ClubTrophy } from '../types';

const PLACEHOLDER_TROPHY = '/assets/trophies/placeholder-trophy.svg';

function TrophyCard({ item }: { item: ClubTrophy }) {
  const iconPath = getTrophyIconPath(item.icon);
  const [iconError, setIconError] = useState(false);
  const displaySrc = iconError ? PLACEHOLDER_TROPHY : iconPath;

  const onIconError = useCallback(() => {
    setIconError(true);
  }, []);

  const yearsText =
    item.yearsDisplay ?? (item.years?.length ? item.years.slice(-5).join(', ') : null);

  return (
    <Card className="rounded-2xl border border-white/5 bg-card overflow-hidden transition-all duration-fast hover:border-primary/30">
      <CardContent className="p-4 flex flex-row sm:flex-col gap-4 sm:gap-3">
        <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-card flex items-center justify-center overflow-hidden border border-card-border">
          <img
            src={displaySrc}
            alt=""
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            onError={onIconError}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground truncate">{item.name}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {item.count}x
            </Badge>
            {yearsText && (
              <span className="text-xs text-muted-foreground font-mono">{yearsText}</span>
            )}
          </div>
          {item.note && (
            <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface TeamTrophiesProps {
  clubConfig: ClubConfig;
  /** Optional title override */
  title?: string;
}

export function TeamTrophies({ clubConfig, title = 'Taças' }: TeamTrophiesProps) {
  const trophies = clubConfig.trophies ?? [];
  if (trophies.length === 0) return null;

  return (
    <Card className="overflow-hidden border-card-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-display flex items-center gap-2">
          <Trophy className="h-5 w-5" style={{ color: clubConfig.theme.primary }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trophies.map((t, i) => (
            <TrophyCard key={`${t.name}-${i}`} item={t} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

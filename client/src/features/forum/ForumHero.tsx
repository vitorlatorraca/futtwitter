'use client';

import { MessageSquare, MessageCircle, TrendingUp } from 'lucide-react';
import type { ForumStats } from './types';
import type { ClubConfig } from '@/features/meu-time/types';

interface ForumHeroProps {
  teamName: string;
  stats: ForumStats;
  clubConfig?: ClubConfig | null;
}

export function ForumHero({ teamName, stats, clubConfig }: ForumHeroProps) {
  const theme = clubConfig?.theme;
  const gradientStyle = theme?.gradient
    ? { background: theme.gradient }
    : {
        background: `linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(255,255,255,0.05) 100%)`,
      };

  const displayName = clubConfig?.displayName ?? teamName;
  const teamSlug = (clubConfig?.teamId ?? teamName).toLowerCase();
  const suffix =
    teamSlug.includes('corinthians')
      ? 'Corinthiana'
      : teamSlug.includes('palmeiras')
        ? 'Palmeirense'
        : `do ${displayName}`;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/5 p-6 sm:p-8"
      style={gradientStyle}
    >
      <div className="relative z-10">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">
          Comunidade {suffix}
        </h2>
        <p className="text-sm sm:text-base text-foreground-secondary mb-6">
          Discuta, debata e conecte-se com outros torcedores.
        </p>

        <div className="flex flex-wrap gap-4 sm:gap-6">
          <div className="flex items-center gap-2 text-foreground-secondary">
            <div className="rounded-lg bg-white/5 p-2">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Tópicos</span>
              <span className="font-semibold text-foreground tabular-nums">{stats.totalTopics}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-foreground-secondary">
            <div className="rounded-lg bg-white/5 p-2">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Respostas</span>
              <span className="font-semibold text-foreground tabular-nums">{stats.totalReplies}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-foreground-secondary">
            <div className="rounded-lg bg-white/5 p-2">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Em alta</span>
              <span className="font-semibold text-foreground tabular-nums">{stats.trendingCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

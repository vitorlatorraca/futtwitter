"use client";

import { cn } from "@/lib/utils";
import { StatBadge } from "@/components/ui-premium";
import { getResultForTeam, formatMatchDateShort } from "./matchUtils";
import type { TeamMatch } from "./types";
import { formatRating, getRatingPillClass } from "@/lib/ratingUtils";

interface MatchRowProps {
  match: TeamMatch;
  teamId: string;
  teamName: string;
}

export function MatchRow({ match, teamId, teamName }: MatchRowProps) {
  const result = getResultForTeam(match, teamId);
  const dateLabel = formatMatchDateShort(match);
  const rating = match.teamRating;

  const isPostponed = match.status === "POSTPONED" || match.status === "CANCELED";
  const isFinished = match.status === "FT";

  return (
    <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-xl border border-white/5 bg-card/50 hover:bg-card/80 transition-colors">
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground mb-0.5">{match.competition.name}</div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-foreground truncate">{match.homeTeamName}</span>
          <span className="text-muted-foreground text-sm">vs</span>
          <span className="font-medium text-foreground truncate">{match.awayTeamName}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right w-14">
          <div className="text-xs text-muted-foreground tabular-nums">
            {isPostponed ? (
              <span className="text-destructive">Adiado</span>
            ) : (
              dateLabel
            )}
          </div>
        </div>
        {isFinished && match.homeScore != null && match.awayScore != null && (
          <div className="font-mono text-sm font-semibold text-foreground tabular-nums w-12 text-center">
            {match.homeScore}–{match.awayScore}
          </div>
        )}
        {rating != null && (
          <span
            className={cn(
              "text-[10px] font-semibold px-1.5 py-0.5 rounded min-w-[2rem] text-center tabular-nums",
              getRatingPillClass(rating)
            )}
          >
            {formatRating(rating)}
          </span>
        )}
        {rating == null && isFinished && (
          <span className="text-[10px] text-muted-foreground px-1.5">—</span>
        )}
        {result && (
          <StatBadge variant={result} size="sm" />
        )}
      </div>
    </div>
  );
}

export type FixtureStatus = "SCHEDULED" | "LIVE" | "FT" | "POSTPONED" | "CANCELED";

export interface TeamMatch {
  id: string;
  teamId?: string;
  competitionId?: string;
  season?: string;
  round: string | null;
  status: FixtureStatus;
  kickoffAt: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeScore: number | null;
  awayScore: number | null;
  venue: string | null;
  competition: {
    name: string;
    logoUrl: string | null;
  };
  /** Nota do time na partida (ex: 7.4). null quando não disponível. */
  teamRating?: number | null;
}

export type MatchFilter = "all" | "upcoming" | "recent";

export type ResultVariant = "W" | "L" | "D";

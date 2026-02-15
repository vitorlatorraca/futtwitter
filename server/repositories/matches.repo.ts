/**
 * Repository: jogos (match_games)
 * Lista jogos por time, detalhes, eventos, lineup, stats.
 */
import { db } from "../db";
import {
  matchGames,
  matchEvents,
  matchLineups,
  matchLineupPlayers,
  playerMatchStats,
  teamMatchStats,
  competitions,
  seasons,
  teams,
  players,
  venues,
} from "@shared/schema";

/** Position group for ordering: GK | DEF | MID | ATT | UNK */
export type PositionGroup = "GK" | "DEF" | "MID" | "ATT" | "UNK";

const POSITION_ORDER: PositionGroup[] = ["GK", "DEF", "MID", "ATT", "UNK"];

function positionToGroup(code: string | null): PositionGroup {
  if (!code) return "UNK";
  const u = code.toUpperCase();
  if (u === "GK") return "GK";
  if (["CB", "LB", "RB", "LWB", "RWB"].includes(u)) return "DEF";
  if (["DM", "CM", "AM", "LM", "RM"].includes(u)) return "MID";
  if (["LW", "RW", "ST", "CF"].includes(u)) return "ATT";
  return "UNK";
}

function groupOrder(g: PositionGroup): number {
  return POSITION_ORDER.indexOf(g);
}
import { eq, and, or, desc, gt, lt, inArray } from "drizzle-orm";

export interface MatchListItem {
  id: string;
  kickoffAt: Date;
  status: string;
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number | null;
  awayScore: number | null;
  round: string | null;
  competition: { id: string; name: string; logoUrl: string | null };
  seasonYear: number | null;
  venue: { id: string; name: string; city: string | null } | null;
}

/**
 * Lista jogos por time (upcoming, recent ou all).
 */
export async function getMatchesByTeam(
  teamId: string,
  options: {
    type?: "upcoming" | "recent" | "all";
    limit?: number;
    competitionId?: string;
    seasonYear?: number;
  } = {}
): Promise<MatchListItem[]> {
  const limit = options.limit ?? 20;
  const now = new Date();

  const conditions = [
    or(
      eq(matchGames.homeTeamId, teamId),
      eq(matchGames.awayTeamId, teamId)
    )!,
  ];
  if (options.competitionId) {
    conditions.push(eq(matchGames.competitionId, options.competitionId));
  }
  if (options.seasonYear) {
    conditions.push(eq(seasons.year, options.seasonYear));
  }

  const selectFields = {
    id: matchGames.id,
    kickoffAt: matchGames.kickoffAt,
    status: matchGames.status,
    homeTeamId: matchGames.homeTeamId,
    awayTeamId: matchGames.awayTeamId,
    homeScore: matchGames.homeScore,
    awayScore: matchGames.awayScore,
    round: matchGames.round,
    competitionId: matchGames.competitionId,
    competitionName: competitions.name,
    competitionLogoUrl: competitions.logoUrl,
    seasonYear: seasons.year,
    venueId: matchGames.venueId,
    venueName: venues.name,
    venueCity: venues.city,
  };

  let rows: any[];

  if (options.type === "upcoming") {
    const withTime = and(...conditions, gt(matchGames.kickoffAt, now));
    rows = await db
      .select({
        id: matchGames.id,
        kickoffAt: matchGames.kickoffAt,
        status: matchGames.status,
        homeTeamId: matchGames.homeTeamId,
        awayTeamId: matchGames.awayTeamId,
        homeScore: matchGames.homeScore,
        awayScore: matchGames.awayScore,
        round: matchGames.round,
        competitionId: matchGames.competitionId,
        competitionName: competitions.name,
        competitionLogoUrl: competitions.logoUrl,
        seasonYear: seasons.year,
        venueId: matchGames.venueId,
        venueName: venues.name,
        venueCity: venues.city,
      })
      .from(matchGames)
      .leftJoin(competitions, eq(matchGames.competitionId, competitions.id))
      .leftJoin(seasons, eq(matchGames.seasonId, seasons.id))
      .leftJoin(venues, eq(matchGames.venueId, venues.id))
      .where(withTime)
      .orderBy(matchGames.kickoffAt)
      .limit(limit);
  } else if (options.type === "recent") {
    const withTime = and(...conditions, lt(matchGames.kickoffAt, now));
    rows = await db
      .select({
        id: matchGames.id,
        kickoffAt: matchGames.kickoffAt,
        status: matchGames.status,
        homeTeamId: matchGames.homeTeamId,
        awayTeamId: matchGames.awayTeamId,
        homeScore: matchGames.homeScore,
        awayScore: matchGames.awayScore,
        round: matchGames.round,
        competitionId: matchGames.competitionId,
        competitionName: competitions.name,
        competitionLogoUrl: competitions.logoUrl,
        seasonYear: seasons.year,
        venueId: matchGames.venueId,
        venueName: venues.name,
        venueCity: venues.city,
      })
      .from(matchGames)
      .leftJoin(competitions, eq(matchGames.competitionId, competitions.id))
      .leftJoin(seasons, eq(matchGames.seasonId, seasons.id))
      .leftJoin(venues, eq(matchGames.venueId, venues.id))
      .where(withTime)
      .orderBy(desc(matchGames.kickoffAt))
      .limit(limit);
  } else {
    rows = await db
      .select({
        id: matchGames.id,
        kickoffAt: matchGames.kickoffAt,
        status: matchGames.status,
        homeTeamId: matchGames.homeTeamId,
        awayTeamId: matchGames.awayTeamId,
        homeScore: matchGames.homeScore,
        awayScore: matchGames.awayScore,
        round: matchGames.round,
        competitionId: matchGames.competitionId,
        competitionName: competitions.name,
        competitionLogoUrl: competitions.logoUrl,
        seasonYear: seasons.year,
        venueId: matchGames.venueId,
        venueName: venues.name,
        venueCity: venues.city,
      })
      .from(matchGames)
      .leftJoin(competitions, eq(matchGames.competitionId, competitions.id))
      .leftJoin(seasons, eq(matchGames.seasonId, seasons.id))
      .leftJoin(venues, eq(matchGames.venueId, venues.id))
      .where(and(...conditions))
      .orderBy(desc(matchGames.kickoffAt))
      .limit(limit);
  }

  const teamIds = new Set<string>();
  for (const r of rows) {
    if (r.homeTeamId) teamIds.add(r.homeTeamId);
    if (r.awayTeamId) teamIds.add(r.awayTeamId);
  }
  const teamList =
    teamIds.size > 0
      ? await db.select({ id: teams.id, name: teams.name }).from(teams).where(inArray(teams.id, [...teamIds]))
      : [];
  const teamMap = new Map(teamList.map((t) => [t.id, t.name]));

  return rows.map((r) => ({
    id: r.id,
    kickoffAt: r.kickoffAt,
    status: r.status,
    homeTeamId: r.homeTeamId,
    awayTeamId: r.awayTeamId,
    homeTeamName: teamMap.get(r.homeTeamId ?? "") ?? "TBD",
    awayTeamName: teamMap.get(r.awayTeamId ?? "") ?? "TBD",
    homeScore: r.homeScore,
    awayScore: r.awayScore,
    round: r.round,
    competition: {
      id: r.competitionId ?? "",
      name: r.competitionName ?? "TBD",
      logoUrl: r.competitionLogoUrl ?? null,
    },
    seasonYear: r.seasonYear ?? null,
    venue: r.venueId
      ? { id: r.venueId, name: r.venueName ?? "", city: r.venueCity ?? null }
      : null,
  }));
}

/**
 * Detalhes completos do jogo: events, lineup, stats.
 */
export async function getMatchDetails(matchId: string): Promise<{
  match: MatchListItem & { venue: { id: string; name: string; city: string | null; capacity: number | null } | null };
  events: Array<{
    id: string;
    minute: number | null;
    type: string;
    teamId: string | null;
    playerId: string | null;
    playerName: string | null;
    relatedPlayerId: string | null;
    relatedPlayerName: string | null;
    detail: string | null;
  }>;
  lineups: Array<{
    teamId: string;
    teamName: string;
    formation: string;
    starters: Array<{
      playerId: string;
      name: string;
      shirtNumber: number | null;
      positionCode: string | null;
      minutesPlayed: number | null;
    }>;
    substitutes: Array<{
      playerId: string;
      name: string;
      shirtNumber: number | null;
      positionCode: string | null;
      minutesPlayed: number | null;
    }>;
  }>;
  playerStats: Array<{
    playerId: string;
    name: string;
    minutes: number;
    rating: number | null;
    goals: number;
    assists: number;
  }>;
  teamStats: Array<{
    teamId: string;
    teamName: string;
    possession: number | null;
    shots: number | null;
    shotsOnTarget: number | null;
    corners: number | null;
    fouls: number | null;
  }>;
} | null> {
  const [matchRow] = await db
    .select({
      id: matchGames.id,
      kickoffAt: matchGames.kickoffAt,
      status: matchGames.status,
      homeTeamId: matchGames.homeTeamId,
      awayTeamId: matchGames.awayTeamId,
      homeScore: matchGames.homeScore,
      awayScore: matchGames.awayScore,
      round: matchGames.round,
      competitionId: matchGames.competitionId,
      competitionName: competitions.name,
      competitionLogoUrl: competitions.logoUrl,
      seasonYear: seasons.year,
      venueId: matchGames.venueId,
      venueName: venues.name,
      venueCity: venues.city,
      venueCapacity: venues.capacity,
    })
    .from(matchGames)
    .leftJoin(competitions, eq(matchGames.competitionId, competitions.id))
    .leftJoin(seasons, eq(matchGames.seasonId, seasons.id))
    .leftJoin(venues, eq(matchGames.venueId, venues.id))
    .where(eq(matchGames.id, matchId))
    .limit(1);

  if (!matchRow) return null;

  const teamIds = [matchRow.homeTeamId, matchRow.awayTeamId].filter(Boolean) as string[];
  const teamList = teamIds.length > 0
    ? await db.select({ id: teams.id, name: teams.name }).from(teams).where(inArray(teams.id, teamIds))
    : [];
  const teamMap = new Map(teamList.map((t) => [t.id, t.name]));

  const match: MatchListItem & { venue: { capacity: number | null } | null } = {
    id: matchRow.id,
    kickoffAt: matchRow.kickoffAt,
    status: matchRow.status,
    homeTeamId: matchRow.homeTeamId,
    awayTeamId: matchRow.awayTeamId,
    homeTeamName: teamMap.get(matchRow.homeTeamId ?? "") ?? "TBD",
    awayTeamName: teamMap.get(matchRow.awayTeamId ?? "") ?? "TBD",
    homeScore: matchRow.homeScore,
    awayScore: matchRow.awayScore,
    round: matchRow.round,
    competition: {
      id: matchRow.competitionId ?? "",
      name: matchRow.competitionName ?? "TBD",
      logoUrl: matchRow.competitionLogoUrl ?? null,
    },
    seasonYear: matchRow.seasonYear ?? null,
    venue: matchRow.venueId
      ? {
          id: matchRow.venueId,
          name: matchRow.venueName ?? "",
          city: matchRow.venueCity ?? null,
          capacity: matchRow.venueCapacity ?? null,
        }
      : null,
  };

  const eventsRows = await db
    .select({
      id: matchEvents.id,
      minute: matchEvents.minute,
      type: matchEvents.type,
      teamId: matchEvents.teamId,
      playerId: matchEvents.playerId,
      playerName: players.name,
      relatedPlayerId: matchEvents.relatedPlayerId,
      detail: matchEvents.detail,
    })
    .from(matchEvents)
    .leftJoin(players, eq(matchEvents.playerId, players.id))
    .where(eq(matchEvents.matchId, matchId))
    .orderBy(matchEvents.minute);

  const relatedIds = eventsRows.map((e) => e.relatedPlayerId).filter(Boolean) as string[];
  const relatedNames =
    relatedIds.length > 0
      ? await db.select({ id: players.id, name: players.name }).from(players).where(inArray(players.id, relatedIds))
      : [];
  const relatedMap = new Map(relatedNames.map((p) => [p.id, p.name]));

  const events = eventsRows.map((e) => ({
    id: e.id,
    minute: e.minute,
    type: e.type,
    teamId: e.teamId,
    playerId: e.playerId,
    playerName: e.playerName ?? null,
    relatedPlayerId: e.relatedPlayerId,
    relatedPlayerName: e.relatedPlayerId ? relatedMap.get(e.relatedPlayerId) ?? null : null,
    detail: e.detail,
  }));

  const lineupsRows = await db
    .select({
      lineupId: matchLineups.id,
      teamId: matchLineups.teamId,
      formation: matchLineups.formation,
      playerId: matchLineupPlayers.playerId,
      isStarter: matchLineupPlayers.isStarter,
      shirtNumber: matchLineupPlayers.shirtNumber,
      positionCode: matchLineupPlayers.positionCode,
      minutesPlayed: matchLineupPlayers.minutesPlayed,
      playerName: players.name,
    })
    .from(matchLineups)
    .innerJoin(matchLineupPlayers, eq(matchLineups.id, matchLineupPlayers.matchLineupId))
    .innerJoin(players, eq(matchLineupPlayers.playerId, players.id))
    .where(eq(matchLineups.matchId, matchId));

  const lineupByTeam = new Map<
    string,
    {
      starters: Array<{ playerId: string; name: string; shirtNumber: number | null; positionCode: string | null; minutesPlayed: number | null }>;
      substitutes: Array<{ playerId: string; name: string; shirtNumber: number | null; positionCode: string | null; minutesPlayed: number | null }>;
      formation: string;
    }
  >();

  for (const r of lineupsRows) {
    if (!lineupByTeam.has(r.teamId)) {
      lineupByTeam.set(r.teamId, {
        formation: r.formation,
        starters: [],
        substitutes: [],
      });
    }
    const entry = lineupByTeam.get(r.teamId)!;
    const item = {
      playerId: r.playerId,
      name: r.playerName,
      shirtNumber: r.shirtNumber,
      positionCode: r.positionCode,
      minutesPlayed: r.minutesPlayed,
    };
    if (r.isStarter) entry.starters.push(item);
    else entry.substitutes.push(item);
  }

  const lineups = Array.from(lineupByTeam.entries()).map(([teamId, data]) => ({
    teamId,
    teamName: teamMap.get(teamId) ?? "TBD",
    formation: data.formation,
    starters: data.starters,
    substitutes: data.substitutes,
  }));

  const statsRows = await db
    .select({
      playerId: playerMatchStats.playerId,
      name: players.name,
      minutes: playerMatchStats.minutes,
      rating: playerMatchStats.rating,
      goals: playerMatchStats.goals,
      assists: playerMatchStats.assists,
    })
    .from(playerMatchStats)
    .innerJoin(players, eq(playerMatchStats.playerId, players.id))
    .where(eq(playerMatchStats.matchId, matchId));

  const playerStats = statsRows.map((r) => ({
    playerId: r.playerId,
    name: r.name,
    minutes: r.minutes,
    rating: r.rating != null ? Number(r.rating) : null,
    goals: r.goals,
    assists: r.assists,
  }));

  const teamStatsRows = await db
    .select({
      teamId: teamMatchStats.teamId,
      possession: teamMatchStats.possession,
      shots: teamMatchStats.shots,
      shotsOnTarget: teamMatchStats.shotsOnTarget,
      corners: teamMatchStats.corners,
      fouls: teamMatchStats.fouls,
    })
    .from(teamMatchStats)
    .where(eq(teamMatchStats.matchId, matchId));

  const teamStats = teamStatsRows.map((r) => ({
    teamId: r.teamId,
    teamName: teamMap.get(r.teamId) ?? "TBD",
    possession: r.possession,
    shots: r.shots,
    shotsOnTarget: r.shotsOnTarget,
    corners: r.corners,
    fouls: r.fouls,
  }));

  return {
    match,
    events,
    lineups,
    playerStats,
    teamStats,
  };
}

/**
 * Último jogo FT do time com notas dos jogadores (player_match_stats).
 * Usado no card "Última partida — notas" no /meu-time.
 * Posição: match_lineup_players.positionCode > players.primaryPosition > players.position > UNK.
 * Ordenação: por grupo (GK > DEF > MID > ATT > UNK), dentro do grupo por rating DESC.
 */
export async function getLastMatchRatings(teamId: string): Promise<{
  match: {
    matchId: string;
    kickoffAt: Date;
    competitionName: string;
    homeTeamName: string;
    awayTeamName: string;
    homeScore: number | null;
    awayScore: number | null;
  };
  playerRatings: Array<{
    playerId: string;
    playerName: string;
    shirtNumber: number | null;
    minutes: number;
    rating: number;
    positionCode: string | null;
    primaryPosition: string | null;
    group: PositionGroup;
    photoUrl: string | null;
  }>;
} | null> {
  const [lastMatch] = await db
    .select({
      id: matchGames.id,
      kickoffAt: matchGames.kickoffAt,
      homeTeamId: matchGames.homeTeamId,
      awayTeamId: matchGames.awayTeamId,
      homeScore: matchGames.homeScore,
      awayScore: matchGames.awayScore,
      competitionName: competitions.name,
    })
    .from(matchGames)
    .leftJoin(competitions, eq(matchGames.competitionId, competitions.id))
    .where(
      and(
        or(eq(matchGames.homeTeamId, teamId), eq(matchGames.awayTeamId, teamId))!,
        eq(matchGames.status, "FT")
      )
    )
    .orderBy(desc(matchGames.kickoffAt))
    .limit(1);

  if (!lastMatch) return null;

  const teamIds = [lastMatch.homeTeamId, lastMatch.awayTeamId].filter(Boolean) as string[];
  const teamList =
    teamIds.length > 0
      ? await db.select({ id: teams.id, name: teams.name }).from(teams).where(inArray(teams.id, teamIds))
      : [];
  const teamMap = new Map(teamList.map((t) => [t.id, t.name]));

  // Lineup positionCode por jogador (fonte de verdade para aquele jogo)
  const [ourLineup] = await db
    .select({ id: matchLineups.id })
    .from(matchLineups)
    .where(
      and(eq(matchLineups.matchId, lastMatch.id), eq(matchLineups.teamId, teamId))
    )
    .limit(1);

  const lineupPositionByPlayer = new Map<string, string | null>();
  if (ourLineup) {
    const lineupPlayers = await db
      .select({
        playerId: matchLineupPlayers.playerId,
        positionCode: matchLineupPlayers.positionCode,
      })
      .from(matchLineupPlayers)
      .where(eq(matchLineupPlayers.matchLineupId, ourLineup.id));
    for (const lp of lineupPlayers) {
      lineupPositionByPlayer.set(lp.playerId, lp.positionCode);
    }
  }

  const statsRows = await db
    .select({
      playerId: playerMatchStats.playerId,
      playerName: players.name,
      shirtNumber: players.shirtNumber,
      minutes: playerMatchStats.minutes,
      rating: playerMatchStats.rating,
      primaryPosition: players.primaryPosition,
      position: players.position,
      photoUrl: players.photoUrl,
    })
    .from(playerMatchStats)
    .innerJoin(players, eq(playerMatchStats.playerId, players.id))
    .where(
      and(eq(playerMatchStats.matchId, lastMatch.id), eq(playerMatchStats.teamId, teamId))
    );

  const rawRatings = statsRows
    .filter((r) => r.rating != null)
    .map((r) => {
      const positionCode =
        lineupPositionByPlayer.get(r.playerId) ??
        r.primaryPosition ??
        r.position ??
        "UNK";
      const group = positionToGroup(positionCode === "UNK" ? null : positionCode);
      return {
        playerId: r.playerId,
        playerName: r.playerName ?? "—",
        shirtNumber: r.shirtNumber,
        minutes: r.minutes,
        rating: Number(r.rating),
        positionCode: lineupPositionByPlayer.get(r.playerId) ?? null,
        primaryPosition: r.primaryPosition ?? null,
        group,
        photoUrl: r.photoUrl ?? null,
      };
    });

  const playerRatings = rawRatings.sort((a, b) => {
    const ga = groupOrder(a.group);
    const gb = groupOrder(b.group);
    if (ga !== gb) return ga - gb;
    return b.rating - a.rating;
  });

  return {
    match: {
      matchId: lastMatch.id,
      kickoffAt: lastMatch.kickoffAt,
      competitionName: lastMatch.competitionName ?? "—",
      homeTeamName: teamMap.get(lastMatch.homeTeamId ?? "") ?? "—",
      awayTeamName: teamMap.get(lastMatch.awayTeamId ?? "") ?? "—",
      homeScore: lastMatch.homeScore,
      awayScore: lastMatch.awayScore,
    },
    playerRatings,
  };
}

/**
 * Repository: jogadores
 * Top rated, estatísticas agregadas.
 */
import { db } from "../db";
import {
  playerMatchStats,
  matchGames,
  players,
} from "@shared/schema";
import { eq, or, and, desc, sql, inArray } from "drizzle-orm";

export interface TopRatedPlayer {
  playerId: string;
  name: string;
  photoUrl: string | null;
  position: string;
  shirtNumber: number | null;
  avgRating: number;
  matchesPlayed: number;
  totalGoals: number;
  totalAssists: number;
}

/**
 * Top jogadores mais bem avaliados do time nos últimos N jogos.
 * Usa player_match_stats de match_games onde o time participou.
 */
export async function getTopRatedByTeam(
  teamId: string,
  options: { limit?: number; lastNMatches?: number } = {}
): Promise<TopRatedPlayer[]> {
  const limit = options.limit ?? 3;
  const lastN = options.lastNMatches ?? 10;

  const recentMatchIds = await db
    .select({ id: matchGames.id })
    .from(matchGames)
    .where(
      or(
        eq(matchGames.homeTeamId, teamId),
        eq(matchGames.awayTeamId, teamId)
      )!
    )
    .orderBy(desc(matchGames.kickoffAt))
    .limit(lastN);

  const matchIds = recentMatchIds.map((r) => r.id);
  if (matchIds.length === 0) return [];

  const rows = await db
    .select({
      playerId: playerMatchStats.playerId,
      name: players.name,
      photoUrl: players.photoUrl,
      position: players.position,
      shirtNumber: players.shirtNumber,
      avgRating: sql<number>`avg(${playerMatchStats.rating})::real`.as("avg_rating"),
      matchesPlayed: sql<number>`count(*)::int`.as("matches_played"),
      totalGoals: sql<number>`coalesce(sum(${playerMatchStats.goals}), 0)::int`.as("total_goals"),
      totalAssists: sql<number>`coalesce(sum(${playerMatchStats.assists}), 0)::int`.as("total_assists"),
    })
    .from(playerMatchStats)
    .innerJoin(players, eq(playerMatchStats.playerId, players.id))
    .where(and(
      eq(playerMatchStats.teamId, teamId),
      inArray(playerMatchStats.matchId, matchIds)
    ))
    .groupBy(
      playerMatchStats.playerId,
      players.name,
      players.photoUrl,
      players.position,
      players.shirtNumber
    )
    .orderBy(desc(sql`avg(${playerMatchStats.rating})`))
    .limit(limit);

  return rows.map((r) => ({
    playerId: r.playerId,
    name: r.name,
    photoUrl: r.photoUrl,
    position: r.position,
    shirtNumber: r.shirtNumber,
    avgRating: Number(r.avgRating ?? 0),
    matchesPlayed: Number(r.matchesPlayed ?? 0),
    totalGoals: Number(r.totalGoals ?? 0),
    totalAssists: Number(r.totalAssists ?? 0),
  }));
}

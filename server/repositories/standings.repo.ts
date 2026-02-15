/**
 * Repository: standings (classificação por competição)
 * Retorna tabela ordenada por posição com dados do time e form.
 */
import { db } from "../db";
import { standings, teams, competitions } from "@shared/schema";
import { eq, and, asc } from "drizzle-orm";

export interface StandingRow {
  id: string;
  competitionId: string;
  teamId: string;
  season: string;
  position: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: string[];
  team: {
    id: string;
    name: string;
    shortName: string;
    logoUrl: string;
  };
}

/**
 * Lista classificação de uma competição por temporada.
 * Ordenado por position.
 */
export async function getStandingsByCompetition(
  competitionId: string,
  season: string = "2026"
): Promise<StandingRow[]> {
  const rows = await db
    .select({
      standing: standings,
      team: {
        id: teams.id,
        name: teams.name,
        shortName: teams.shortName,
        logoUrl: teams.logoUrl,
      },
    })
    .from(standings)
    .innerJoin(teams, eq(standings.teamId, teams.id))
    .where(and(eq(standings.competitionId, competitionId), eq(standings.season, season)))
    .orderBy(asc(standings.position));

  return rows.map((r) => ({
    id: r.standing.id,
    competitionId: r.standing.competitionId,
    teamId: r.standing.teamId,
    season: r.standing.season,
    position: r.standing.position,
    played: r.standing.played,
    wins: r.standing.wins,
    draws: r.standing.draws,
    losses: r.standing.losses,
    goalsFor: r.standing.goalsFor,
    goalsAgainst: r.standing.goalsAgainst,
    goalDiff: r.standing.goalDiff,
    points: r.standing.points,
    form: Array.isArray(r.standing.form) ? r.standing.form : [],
    team: {
      id: r.team.id,
      name: r.team.name,
      shortName: r.team.shortName,
      logoUrl: r.team.logoUrl,
    },
  }));
}

/**
 * Retorna competition por id.
 */
export async function getCompetitionById(id: string) {
  const [c] = await db.select().from(competitions).where(eq(competitions.id, id));
  return c ?? null;
}

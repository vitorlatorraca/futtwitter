/**
 * Repository: elenco (team rosters)
 * Lista jogadores por time/temporada com filtros.
 */
import { db } from "../db";
import { teamRosters, players, seasons, teams } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export interface RosterFilters {
  position?: string;
  sector?: "GK" | "DEF" | "MID" | "FWD";
  role?: "STARTER" | "ROTATION" | "YOUTH" | "RESERVE";
  status?: "ACTIVE" | "LOANED_OUT" | "INJURED" | "SUSPENDED" | "TRANSFERRED";
}

export interface RosterPlayer {
  id: string;
  playerId: string;
  squadNumber: number | null;
  role: string | null;
  status: string | null;
  name: string;
  position: string;
  birthDate: string;
  nationalityPrimary: string;
  photoUrl: string | null;
  sector: string | null;
}

/**
 * Lista elenco por time e temporada (via seasonId ou year).
 * Se season for número (ex: 2026), busca season da competição principal.
 */
export async function getRosterByTeamAndSeason(
  teamId: string,
  season: number | string,
  filters?: RosterFilters
): Promise<RosterPlayer[]> {
  let seasonId: string;

  if (typeof season === "string") {
    seasonId = season;
  } else {
    const [s] = await db
      .select({ id: seasons.id })
      .from(seasons)
      .where(eq(seasons.year, season))
      .limit(1);
    if (!s) return [];
    seasonId = s.id;
  }

  const conditions = [
    eq(teamRosters.teamId, teamId),
    eq(teamRosters.seasonId, seasonId),
  ];

  if (filters?.role) conditions.push(eq(teamRosters.role, filters.role));
  if (filters?.status) conditions.push(eq(teamRosters.status, filters.status));

  const sectorOrder = sql<number>`case
    when coalesce(${players.sector}, '') = 'GK' then 1
    when coalesce(${players.sector}, '') = 'DEF' then 2
    when coalesce(${players.sector}, '') = 'MID' then 3
    when coalesce(${players.sector}, '') = 'FWD' then 4
    else 9
  end`;

  let query = db
    .select({
      id: teamRosters.id,
      playerId: teamRosters.playerId,
      squadNumber: teamRosters.squadNumber,
      role: teamRosters.role,
      status: teamRosters.status,
      name: players.name,
      position: players.position,
      birthDate: players.birthDate,
      nationalityPrimary: players.nationalityPrimary,
      photoUrl: players.photoUrl,
      sector: players.sector,
    })
    .from(teamRosters)
    .innerJoin(players, eq(teamRosters.playerId, players.id))
    .where(and(...conditions))
    .orderBy(sectorOrder, players.position, teamRosters.squadNumber);

  const rows = await query;

  let result: RosterPlayer[] = rows.map((r) => ({
    id: r.id as string,
    playerId: r.playerId as string,
    squadNumber: r.squadNumber as number | null,
    role: r.role as string | null,
    status: r.status as string | null,
    name: r.name as string,
    position: r.position as string,
    birthDate: r.birthDate as string,
    nationalityPrimary: r.nationalityPrimary as string,
    photoUrl: r.photoUrl as string | null,
    sector: r.sector as string | null,
  }));

  if (filters?.position) {
    result = result.filter(
      (p) =>
        p.position.toLowerCase().includes(filters!.position!.toLowerCase()) ||
        p.sector === filters!.position
    );
  }
  if (filters?.sector) {
    result = result.filter((p) => p.sector === filters!.sector);
  }

  return result;
}

/**
 * Fallback: se não houver team_rosters, usa players direto (modelo legado).
 */
export async function getRosterByTeamLegacy(
  teamId: string,
  filters?: RosterFilters
): Promise<RosterPlayer[]> {
  const sectorOrder = sql<number>`case
    when coalesce(${players.sector}, '') = 'GK' then 1
    when coalesce(${players.sector}, '') = 'DEF' then 2
    when coalesce(${players.sector}, '') = 'MID' then 3
    when coalesce(${players.sector}, '') = 'FWD' then 4
    else 9
  end`;

  const rows = await db
    .select({
      id: players.id,
      playerId: players.id,
      squadNumber: players.shirtNumber,
      role: sql<string | null>`null`,
      status: sql<string | null>`null`,
      name: players.name,
      position: players.position,
      birthDate: players.birthDate,
      nationalityPrimary: players.nationalityPrimary,
      photoUrl: players.photoUrl,
      sector: players.sector,
    })
    .from(players)
    .where(eq(players.teamId, teamId))
    .orderBy(sectorOrder, players.position, players.shirtNumber);

  let result: RosterPlayer[] = rows.map((r) => ({
    id: r.id as string,
    playerId: r.playerId as string,
    squadNumber: r.squadNumber as number | null,
    role: r.role as string | null,
    status: r.status as string | null,
    name: r.name as string,
    position: r.position as string,
    birthDate: r.birthDate as string,
    nationalityPrimary: r.nationalityPrimary as string,
    photoUrl: r.photoUrl as string | null,
    sector: r.sector as string | null,
  }));

  if (filters?.position) {
    result = result.filter(
      (p) =>
        p.position.toLowerCase().includes(filters!.position!.toLowerCase()) ||
        p.sector === filters!.position
    );
  }
  if (filters?.sector) {
    result = result.filter((p) => p.sector === filters!.sector);
  }

  return result;
}

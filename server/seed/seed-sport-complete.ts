/**
 * Seed completo do schema esportivo: países, competições, temporadas,
 * jogos (match_games), eventos, escalações, stats, ratings, lesões.
 * Corinthians como time principal.
 *
 * Run: npm run db:seed
 *
 * Pré-requisito: rodar seed:corinthians antes (ou ter players/teams no banco).
 */
import "dotenv/config";
import { db } from "../db";
import {
  countries,
  venues,
  competitions,
  seasons,
  teamRosters,
  matchGames,
  matchEvents,
  matchLineups,
  matchLineupPlayers,
  playerMatchStats,
  teamMatchStats,
  injuries,
  teams,
  players,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

const CORINTHIANS_ID = "corinthians";
const SEASON_YEAR = 2026;

async function ensureCountry(name: string, code: string, flagEmoji?: string): Promise<string> {
  const [existing] = await db.select().from(countries).where(eq(countries.code, code)).limit(1);
  if (existing) return existing.id;
  const [inserted] = await db
    .insert(countries)
    .values({ name, code, flagEmoji: flagEmoji ?? null })
    .returning({ id: countries.id });
  console.log(`  ✓ Country: ${name}`);
  return inserted!.id;
}

async function ensureVenue(name: string, city: string, countryId: string, capacity?: number): Promise<string> {
  const [existing] = await db.select().from(venues).where(eq(venues.name, name)).limit(1);
  if (existing) return existing.id;
  const [inserted] = await db
    .insert(venues)
    .values({ name, city, countryId, capacity: capacity ?? null })
    .returning({ id: venues.id });
  console.log(`  ✓ Venue: ${name}`);
  return inserted!.id;
}

async function ensureCompetition(name: string, countryId: string, level?: number): Promise<string> {
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const id = `comp-${slug}`;
  const [existing] = await db.select().from(competitions).where(eq(competitions.id, id)).limit(1);
  if (existing) return existing.id;
  await db.insert(competitions).values({
    id,
    name,
    countryId,
    country: "Brazil",
    level: level ?? null,
    logoUrl: null,
  });
  console.log(`  ✓ Competition: ${name}`);
  return id;
}

async function ensureSeason(competitionId: string, year: number): Promise<string> {
  const [existing] = await db
    .select()
    .from(seasons)
    .where(and(eq(seasons.competitionId, competitionId), eq(seasons.year, year)))
    .limit(1);
  if (existing) return existing.id;
  const [inserted] = await db
    .insert(seasons)
    .values({
      competitionId,
      year,
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
    })
    .returning({ id: seasons.id });
  console.log(`  ✓ Season: ${competitionId} ${year}`);
  return inserted!.id;
}

function parseKickoff(dateStr: string, timeStr?: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  let h = 19,
    min = 0;
  if (timeStr) {
    const [hh, mm] = timeStr.split(":").map(Number);
    h = hh ?? 19;
    min = mm ?? 0;
  }
  return new Date(y, m - 1, d, h, min, 0);
}

async function seed() {
  console.log("🌱 Seeding sport schema (Corinthians)...\n");

  const brId = await ensureCountry("Brazil", "BR", "🇧🇷");
  await ensureCountry("Netherlands", "NL", "🇳🇱");
  await ensureCountry("Argentina", "AR", "🇦🇷");
  await ensureCountry("Uruguay", "UY", "🇺🇾");
  await ensureCountry("Peru", "PE", "🇵🇪");
  await ensureCountry("Venezuela", "VE", "🇻🇪");

  const arenaId = await ensureVenue("Neo Química Arena", "São Paulo", brId, 49205);

  const compBrasileirao = await ensureCompetition("Brasileirão Betano", brId, 1);
  const compPaulista = await ensureCompetition("Paulista Série A1", brId, 1);
  const compSupercopa = await ensureCompetition("Supercopa do Brasil", brId, 1);

  const seasonBrasileirao = await ensureSeason(compBrasileirao, SEASON_YEAR);
  const seasonPaulista = await ensureSeason(compPaulista, SEASON_YEAR);
  const seasonSupercopa = await ensureSeason(compSupercopa, SEASON_YEAR);

  const [corinthians] = await db.select().from(teams).where(eq(teams.id, CORINTHIANS_ID)).limit(1);
  if (!corinthians) {
    console.log("  ⚠️  Corinthians não encontrado. Rode npm run seed:corinthians primeiro.");
    return;
  }

  const allPlayers = await db.select().from(players).where(eq(players.teamId, CORINTHIANS_ID));
  if (allPlayers.length === 0) {
    console.log("  ⚠️  Nenhum jogador do Corinthians. Rode npm run seed:corinthians primeiro.");
    return;
  }

  // Team rosters: vincular jogadores à temporada 2026
  for (const p of allPlayers) {
    const [existing] = await db
      .select()
      .from(teamRosters)
      .where(
        and(
          eq(teamRosters.teamId, CORINTHIANS_ID),
          eq(teamRosters.seasonId, seasonBrasileirao),
          eq(teamRosters.playerId, p.id)
        )
      )
      .limit(1);
    if (!existing) {
      await db.insert(teamRosters).values({
        teamId: CORINTHIANS_ID,
        seasonId: seasonBrasileirao,
        playerId: p.id,
        squadNumber: p.shirtNumber,
        role: "STARTER",
        status: "ACTIVE",
      });
    }
  }
  console.log(`  ✓ Team rosters: ${allPlayers.length} jogadores`);

  // Times adversários (criar se não existirem)
  const opponentNames = [
    "Palmeiras", "Flamengo", "RB Bragantino", "São Bernardo", "Capivariano",
    "Bahia", "Athletico Paranaense", "Santos", "Cruzeiro", "Internacional", "Grêmio", "Botafogo",
  ];
  const opponentIds: Record<string, string> = {};
  for (const name of opponentNames) {
    const [t] = await db.select().from(teams).where(eq(teams.name, name)).limit(1);
    if (t) opponentIds[name] = t.id;
    else {
      const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const [inserted] = await db
        .insert(teams)
        .values({
          id: slug,
          name,
          shortName: name.slice(0, 3).toUpperCase(),
          logoUrl: `https://logodetimes.com/${slug}.png`,
          primaryColor: "#333333",
          secondaryColor: "#FFFFFF",
        })
        .returning({ id: teams.id });
      opponentIds[name] = inserted!.id;
    }
  }

  // Match games (12-20 jogos: mistura FT/SCHEDULED/POSTPONED)
  const matchesData: Array<{
    compId: string;
    seasonId: string;
    home: string;
    away: string;
    date: string;
    time?: string;
    status: "SCHEDULED" | "FT" | "POSTPONED";
    homeScore?: number;
    awayScore?: number;
    venueId?: string;
  }> = [
    { compId: compBrasileirao, seasonId: seasonBrasileirao, home: "São Bernardo", away: "Corinthians", date: "2026-02-15", time: "18:30", status: "SCHEDULED", venueId: undefined },
    { compId: compBrasileirao, seasonId: seasonBrasileirao, home: "Corinthians", away: "Santos", date: "2026-02-22", time: "18:00", status: "SCHEDULED", venueId: arenaId },
    { compId: compPaulista, seasonId: seasonPaulista, home: "Corinthians", away: "RB Bragantino", date: "2026-02-10", time: "18:00", status: "FT", homeScore: 2, awayScore: 0, venueId: arenaId },
    { compId: compPaulista, seasonId: seasonPaulista, home: "Corinthians", away: "Palmeiras", date: "2026-02-08", time: "18:00", status: "FT", homeScore: 0, awayScore: 1, venueId: arenaId },
    { compId: compPaulista, seasonId: seasonPaulista, home: "Corinthians", away: "Capivariano", date: "2026-02-05", time: "18:00", status: "FT", homeScore: 3, awayScore: 0, venueId: arenaId },
    { compId: compSupercopa, seasonId: seasonSupercopa, home: "Athletico Paranaense", away: "Corinthians", date: "2026-02-04", time: "21:00", status: "POSTPONED", venueId: undefined },
    { compId: compPaulista, seasonId: seasonPaulista, home: "Flamengo", away: "Corinthians", date: "2026-02-01", time: "18:00", status: "FT", homeScore: 0, awayScore: 2, venueId: undefined },
    { compId: compPaulista, seasonId: seasonPaulista, home: "Corinthians", away: "Bahia", date: "2026-01-28", time: "18:00", status: "FT", homeScore: 1, awayScore: 2, venueId: arenaId },
    { compId: compPaulista, seasonId: seasonPaulista, home: "Corinthians", away: "Santos", date: "2026-01-25", time: "18:00", status: "FT", homeScore: 2, awayScore: 1, venueId: arenaId },
    { compId: compPaulista, seasonId: seasonPaulista, home: "Cruzeiro", away: "Corinthians", date: "2026-01-22", time: "19:20", status: "FT", homeScore: 1, awayScore: 3, venueId: undefined },
    { compId: compPaulista, seasonId: seasonPaulista, home: "Corinthians", away: "Internacional", date: "2026-01-18", time: "18:00", status: "FT", homeScore: 1, awayScore: 0, venueId: arenaId },
    { compId: compPaulista, seasonId: seasonPaulista, home: "Grêmio", away: "Corinthians", date: "2026-01-15", time: "18:00", status: "FT", homeScore: 2, awayScore: 2, venueId: undefined },
    { compId: compPaulista, seasonId: seasonPaulista, home: "Corinthians", away: "Botafogo", date: "2026-01-12", time: "18:00", status: "FT", homeScore: 0, awayScore: 0, venueId: arenaId },
    { compId: compPaulista, seasonId: seasonPaulista, home: "Corinthians", away: "São Bernardo", date: "2026-01-08", time: "18:00", status: "FT", homeScore: 4, awayScore: 0, venueId: arenaId },
    { compId: compBrasileirao, seasonId: seasonBrasileirao, home: "Corinthians", away: "Palmeiras", date: "2026-03-01", time: "18:00", status: "SCHEDULED", venueId: arenaId },
    { compId: compBrasileirao, seasonId: seasonBrasileirao, home: "Flamengo", away: "Corinthians", date: "2026-03-08", time: "18:00", status: "SCHEDULED", venueId: undefined },
  ];

  const matchIds: string[] = [];
  for (const m of matchesData) {
    const homeId = opponentIds[m.home] ?? (m.home === "Corinthians" ? CORINTHIANS_ID : null);
    const awayId = opponentIds[m.away] ?? (m.away === "Corinthians" ? CORINTHIANS_ID : null);
    if (!homeId || !awayId) continue;

    const kickoffAt = parseKickoff(m.date, m.time);
    const [existing] = await db
      .select()
      .from(matchGames)
      .where(
        and(
          eq(matchGames.competitionId, m.compId),
          eq(matchGames.kickoffAt, kickoffAt),
          eq(matchGames.homeTeamId, homeId),
          eq(matchGames.awayTeamId, awayId)
        )
      )
      .limit(1);

    if (existing) {
      matchIds.push(existing.id);
      await db
        .update(matchGames)
        .set({
          status: m.status === "FT" ? "FT" : m.status === "POSTPONED" ? "POSTPONED" : "SCHEDULED",
          homeScore: m.homeScore ?? null,
          awayScore: m.awayScore ?? null,
          venueId: m.venueId ?? null,
          updatedAt: new Date(),
        })
        .where(eq(matchGames.id, existing.id));
    } else {
      const [inserted] = await db
        .insert(matchGames)
        .values({
          seasonId: m.seasonId,
          competitionId: m.compId,
          venueId: m.venueId ?? null,
          kickoffAt,
          status: m.status === "FT" ? "FT" : m.status === "POSTPONED" ? "POSTPONED" : "SCHEDULED",
          homeTeamId: homeId,
          awayTeamId: awayId,
          homeScore: m.homeScore ?? null,
          awayScore: m.awayScore ?? null,
          round: null,
        })
        .returning({ id: matchGames.id });
      matchIds.push(inserted!.id);
    }
  }
  console.log(`  ✓ Match games: ${matchIds.length} jogos`);

  // Eventos, stats e lineups nos jogos finalizados (FT) - até 5 jogos
  const ftMatches = matchesData
    .map((m, i) => (m.status === "FT" ? { matchId: matchIds[i], m } : null))
    .filter(Boolean) as Array<{ matchId: string; m: (typeof matchesData)[0] }>;

  for (let i = 0; i < Math.min(5, ftMatches.length); i++) {
    const { matchId, m } = ftMatches[i];
    const homeId = opponentIds[m.home] ?? (m.home === "Corinthians" ? CORINTHIANS_ID : null);
    const awayId = opponentIds[m.away] ?? (m.away === "Corinthians" ? CORINTHIANS_ID : null);
    const corinthiansIsHome = m.home === "Corinthians";
    const teamId = corinthiansIsHome ? homeId! : awayId!;

    const existingEvents = await db.select().from(matchEvents).where(eq(matchEvents.matchId, matchId));
    if (existingEvents.length === 0 && m.homeScore != null && m.awayScore != null) {
      const yuri = allPlayers.find((p) => p.name.includes("Yuri"));
      const memphis = allPlayers.find((p) => p.name.includes("Memphis"));
      const garro = allPlayers.find((p) => p.name.includes("Garro"));
      const vitinho = allPlayers.find((p) => p.name.includes("Vitinho"));
      const kayke = allPlayers.find((p) => p.name.includes("Kayke"));
      const raniele = allPlayers.find((p) => p.name.includes("Raniele"));

      if (yuri && garro) {
        await db.insert(matchEvents).values({ matchId, minute: 20 + i * 5, type: "GOAL", teamId, playerId: yuri.id, relatedPlayerId: garro.id });
      }
      if (memphis && m.homeScore! + m.awayScore! >= 2) {
        await db.insert(matchEvents).values({ matchId, minute: 65 + i, type: "GOAL", teamId, playerId: memphis.id });
      }
      if (raniele) {
        await db.insert(matchEvents).values({ matchId, minute: 45 + i, type: "YELLOW", teamId, playerId: raniele.id });
      }
      if (i >= 2 && vitinho && kayke) {
        await db.insert(matchEvents).values({ matchId, minute: 70, type: "SUBSTITUTION", teamId, playerId: vitinho.id, relatedPlayerId: kayke.id });
      }
    }

    const existingStats = await db.select().from(playerMatchStats).where(eq(playerMatchStats.matchId, matchId));
    if (existingStats.length === 0) {
      const starters = allPlayers.slice(0, 11);
      const ratingsBase = [8.2, 7.5, 7.8, 8.0, 7.2, 7.9, 8.1, 7.4, 8.5, 7.6, 8.3];
      for (let j = 0; j < starters.length; j++) {
        const r = ratingsBase[j % ratingsBase.length];
        const rating = i === 0 ? r : Math.min(9.5, Math.max(6.0, r + (i % 3 - 1) * 0.3));
        await db.insert(playerMatchStats).values({
          matchId,
          playerId: starters[j].id,
          teamId: corinthiansIsHome ? homeId! : awayId!,
          minutes: 90,
          rating,
          goals: starters[j].name.includes("Yuri") || starters[j].name.includes("Memphis") ? 1 : 0,
          assists: starters[j].name.includes("Garro") ? 1 : 0,
          shots: 2 + (i % 2),
          passes: 40 + j,
          tackles: 1,
        });
      }
      if (homeId && awayId) {
        await db.insert(teamMatchStats).values([
          { matchId, teamId: homeId, possession: 55 + (i % 5), shots: 12, shotsOnTarget: 5, corners: 6, fouls: 14 },
          { matchId, teamId: awayId, possession: 45 - (i % 5), shots: 8, shotsOnTarget: 3, corners: 4, fouls: 16 },
        ]);
      }
    }
  }
  console.log(`  ✓ Match events, player_match_stats e team_match_stats em ${Math.min(5, ftMatches.length)} jogos`);

  // Lineups para todos os jogos FT
  for (const { matchId } of ftMatches) {
    const [existingLineup] = await db
      .select()
      .from(matchLineups)
      .where(and(eq(matchLineups.matchId, matchId), eq(matchLineups.teamId, CORINTHIANS_ID)))
      .limit(1);

    if (!existingLineup) {
      const [lineup] = await db
        .insert(matchLineups)
        .values({ matchId, teamId: CORINTHIANS_ID, formation: "4-2-3-1" })
        .returning({ id: matchLineups.id });

      const starters = allPlayers.slice(0, 11);
      for (let k = 0; k < starters.length; k++) {
        await db.insert(matchLineupPlayers).values({
          matchLineupId: lineup!.id,
          playerId: starters[k].id,
          isStarter: true,
          positionCode: ["GK", "RB", "CB", "CB", "LB", "DM", "DM", "AM", "LW", "RW", "ST"][k],
          shirtNumber: starters[k].shirtNumber,
          minutesPlayed: 90,
        });
      }
    }
  }
  console.log(`  ✓ Match lineups: ${ftMatches.length} jogos`);

  // Lesão para 1 jogador
  const injuredPlayer = allPlayers.find((p) => p.name.includes("Gabriel Paulista") || p.name.includes("Renato"));
  if (injuredPlayer) {
    const [existingInjury] = await db
      .select()
      .from(injuries)
      .where(eq(injuries.playerId, injuredPlayer.id))
      .limit(1);
    if (!existingInjury) {
      await db.insert(injuries).values({
        playerId: injuredPlayer.id,
        teamId: CORINTHIANS_ID,
        type: "Lesão muscular",
        status: "OUT",
        startedAt: "2026-01-15",
        expectedReturnAt: "2026-03-01",
        note: "Recuperação em andamento",
      });
      console.log(`  ✓ Injury: ${injuredPlayer.name}`);
    }
  }

  console.log("\n✅ Seed sport schema complete.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

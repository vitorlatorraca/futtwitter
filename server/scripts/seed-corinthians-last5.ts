/**
 * Seed the last 5 real Corinthians games (ESPN base) for Recent Form and Featured Match.
 * Idempotent: removes existing demo matches for these dates and re-inserts.
 *
 * Run after teams + players seed:
 *   npx tsx server/seed.ts
 *   npx tsx server/seed-corinthians-players.ts
 *   npx tsx server/scripts/seed-corinthians-last5.ts
 *
 * Validates: Forma recente shows 5 items; Featured Match shows last game; TacticalBoard has 11 starters.
 */
import "dotenv/config";
import { db } from "../db";
import { matches, matchPlayers, players } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const TEAM_ID = "corinthians";

const LAST_5_MATCHES: Array<{
  date: string; // YYYY-MM-DD
  opponent: string;
  teamScore: number;
  opponentScore: number;
  isHomeMatch: boolean;
  competition: string;
}> = [
  { date: "2026-02-08", opponent: "Palmeiras", teamScore: 0, opponentScore: 1, isHomeMatch: true, competition: "Paulista" },
  { date: "2026-02-05", opponent: "Capivariano", teamScore: 3, opponentScore: 0, isHomeMatch: true, competition: "Paulista" },
  { date: "2026-02-01", opponent: "Flamengo", teamScore: 2, opponentScore: 0, isHomeMatch: false, competition: "Supercopa Rei" },
  { date: "2026-01-28", opponent: "Bahia", teamScore: 1, opponentScore: 2, isHomeMatch: true, competition: "Brasileirão" },
  { date: "2026-01-25", opponent: "Velo Clube", teamScore: 1, opponentScore: 0, isHomeMatch: false, competition: "Paulista" },
];

async function seed() {
  console.log("Seeding Corinthians last 5 matches (idempotent)...");

  const roster = await db.select().from(players).where(eq(players.teamId, TEAM_ID));
  if (roster.length < 11) {
    console.warn("Corinthians roster has fewer than 11 players. Run seed-corinthians-players first. Proceeding with available players.");
  }

  const dates = LAST_5_MATCHES.map((m) => m.date);
  const fromDate = new Date(dates[dates.length - 1] + "T00:00:00Z");
  const toDate = new Date(dates[0] + "T23:59:59Z");

  const existing = await db
    .select({ id: matches.id })
    .from(matches)
    .where(
      and(
        eq(matches.teamId, TEAM_ID),
        eq(matches.isMock, true)
      )
    );

  for (const row of existing) {
    await db.delete(matchPlayers).where(eq(matchPlayers.matchId, row.id));
    await db.delete(matches).where(eq(matches.id, row.id));
  }

  const insertedMatchIds: string[] = [];

  for (const m of LAST_5_MATCHES) {
    const [match] = await db
      .insert(matches)
      .values({
        teamId: TEAM_ID,
        opponent: m.opponent,
        opponentLogoUrl: null,
        isHomeMatch: m.isHomeMatch,
        teamScore: m.teamScore,
        opponentScore: m.opponentScore,
        matchDate: new Date(m.date + "T16:00:00Z"),
        stadium: m.isHomeMatch ? "Neo Química Arena" : null,
        status: "COMPLETED",
        competition: m.competition,
        isMock: true,
      })
      .returning({ id: matches.id });

    if (match) insertedMatchIds.push(match.id);
  }

  const lastMatchId = insertedMatchIds[0];
  if (!lastMatchId) {
    console.error("No match created.");
    process.exit(1);
  }

  const starters = roster
    .sort((a, b) => {
      const order = (p: string) => {
        if (/goalkeeper|gk/i.test(p)) return 0;
        if (/back|defender|centre-back|left-back|right-back/i.test(p)) return 1;
        if (/midfield|midfielder/i.test(p)) return 2;
        return 3;
      };
      return order(a.position) - order(b.position);
    })
    .slice(0, 11);

  for (const p of starters) {
    await db.insert(matchPlayers).values({
      matchId: lastMatchId,
      playerId: p.id,
      participated: true,
      wasStarter: true,
      minutesPlayed: 90,
      sofascoreRating: null,
    });
  }

  console.log(`Done. Inserted ${insertedMatchIds.length} matches. Last match (Corinthians 0–1 Palmeiras) has ${starters.length} starters.`);
  console.log("Validate: GET /api/teams/corinthians/extended -> matches.length >= 5; GET /api/matches/:id/lineup for last match -> starters.length === 11.");
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

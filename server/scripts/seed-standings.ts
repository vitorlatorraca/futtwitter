/**
 * Seed standings (classificação) do Brasileirão Série A 2026.
 * 20 times com dados mockados, Corinthians posicionado corretamente.
 *
 * Run: npx tsx server/scripts/seed-standings.ts
 */
import "dotenv/config";
import { db } from "../db";
import { competitions, standings } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const BRASILEIRAO_ID = "comp-brasileirao-serie-a";
const SEASON = "2026";

// Mock: posição, P, V, E, D, GF, GA, form (W/D/L)
const MOCK_STANDINGS: Array<{
  teamId: string;
  position: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  form: string[];
}> = [
  { teamId: "flamengo", position: 1, played: 15, wins: 11, draws: 2, losses: 2, goalsFor: 32, goalsAgainst: 12, form: ["W", "W", "D", "W", "W"] },
  { teamId: "palmeiras", position: 2, played: 15, wins: 10, draws: 3, losses: 2, goalsFor: 28, goalsAgainst: 11, form: ["W", "D", "W", "W", "L"] },
  { teamId: "atletico-mineiro", position: 3, played: 15, wins: 9, draws: 4, losses: 2, goalsFor: 26, goalsAgainst: 14, form: ["W", "W", "D", "D", "W"] },
  { teamId: "sao-paulo", position: 4, played: 15, wins: 9, draws: 3, losses: 3, goalsFor: 25, goalsAgainst: 14, form: ["L", "W", "W", "D", "W"] },
  { teamId: "corinthians", position: 5, played: 15, wins: 8, draws: 4, losses: 3, goalsFor: 22, goalsAgainst: 15, form: ["W", "D", "L", "W", "W"] },
  { teamId: "gremio", position: 6, played: 15, wins: 8, draws: 3, losses: 4, goalsFor: 24, goalsAgainst: 18, form: ["W", "L", "W", "D", "W"] },
  { teamId: "internacional", position: 7, played: 15, wins: 7, draws: 5, losses: 3, goalsFor: 21, goalsAgainst: 16, form: ["D", "W", "D", "W", "L"] },
  { teamId: "fluminense", position: 8, played: 15, wins: 7, draws: 4, losses: 4, goalsFor: 20, goalsAgainst: 17, form: ["W", "L", "D", "W", "D"] },
  { teamId: "botafogo", position: 9, played: 15, wins: 6, draws: 5, losses: 4, goalsFor: 19, goalsAgainst: 16, form: ["D", "W", "L", "D", "W"] },
  { teamId: "athletico-paranaense", position: 10, played: 15, wins: 6, draws: 4, losses: 5, goalsFor: 18, goalsAgainst: 17, form: ["L", "W", "D", "L", "W"] },
  { teamId: "bragantino", position: 11, played: 15, wins: 5, draws: 6, losses: 4, goalsFor: 17, goalsAgainst: 16, form: ["D", "D", "W", "L", "D"] },
  { teamId: "cruzeiro", position: 12, played: 15, wins: 5, draws: 5, losses: 5, goalsFor: 16, goalsAgainst: 17, form: ["W", "L", "D", "D", "L"] },
  { teamId: "bahia", position: 13, played: 15, wins: 5, draws: 4, losses: 6, goalsFor: 15, goalsAgainst: 18, form: ["L", "D", "W", "L", "D"] },
  { teamId: "fortaleza", position: 14, played: 15, wins: 4, draws: 5, losses: 6, goalsFor: 14, goalsAgainst: 19, form: ["D", "L", "D", "W", "L"] },
  { teamId: "santos", position: 15, played: 15, wins: 4, draws: 4, losses: 7, goalsFor: 13, goalsAgainst: 20, form: ["L", "W", "L", "D", "L"] },
  { teamId: "vasco-da-gama", position: 16, played: 15, wins: 3, draws: 5, losses: 7, goalsFor: 12, goalsAgainst: 21, form: ["L", "D", "L", "L", "D"] },
  { teamId: "cuiaba", position: 17, played: 15, wins: 3, draws: 4, losses: 8, goalsFor: 11, goalsAgainst: 22, form: ["L", "L", "D", "L", "W"] },
  { teamId: "goias", position: 18, played: 15, wins: 2, draws: 5, losses: 8, goalsFor: 10, goalsAgainst: 23, form: ["L", "D", "L", "L", "D"] },
  { teamId: "coritiba", position: 19, played: 15, wins: 2, draws: 4, losses: 9, goalsFor: 9, goalsAgainst: 24, form: ["L", "L", "D", "L", "L"] },
  { teamId: "america-mineiro", position: 20, played: 15, wins: 1, draws: 5, losses: 9, goalsFor: 8, goalsAgainst: 25, form: ["L", "D", "L", "L", "D"] },
];

async function ensureCompetition(): Promise<void> {
  const [existing] = await db.select().from(competitions).where(eq(competitions.id, BRASILEIRAO_ID));
  if (!existing) {
    await db.insert(competitions).values({
      id: BRASILEIRAO_ID,
      name: "Brasileirão Série A",
      country: "Brasil",
      logoUrl: null,
    });
    console.log("  ✓ Competition: Brasileirão Série A");
  }
}

async function seedStandings() {
  console.log("🌱 Seeding standings (Brasileirão Série A 2026)...");

  await ensureCompetition();

  for (const row of MOCK_STANDINGS) {
    const goalDiff = row.goalsFor - row.goalsAgainst;
    const points = row.wins * 3 + row.draws;

    const [existing] = await db
      .select()
      .from(standings)
      .where(
        and(
          eq(standings.competitionId, BRASILEIRAO_ID),
          eq(standings.teamId, row.teamId),
          eq(standings.season, SEASON)
        )
      )
      .limit(1);

    const payload = {
      competitionId: BRASILEIRAO_ID,
      teamId: row.teamId,
      season: SEASON,
      position: row.position,
      played: row.played,
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDiff,
      points,
      form: row.form,
      updatedAt: new Date(),
    };

    if (existing) {
      await db.update(standings).set(payload).where(eq(standings.id, existing.id));
      console.log(`  ↻ ${row.position}º ${row.teamId}`);
    } else {
      await db.insert(standings).values(payload);
      console.log(`  + ${row.position}º ${row.teamId}`);
    }
  }

  console.log("✅ Standings seed complete. 20 times inseridos.");
}

seedStandings().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

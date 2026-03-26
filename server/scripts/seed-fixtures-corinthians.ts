/**
 * Seed fixtures (jogos) from JSON file.
 * Cria competições automaticamente se não existirem.
 * Evita duplicatas: mesmo kickoffAt + homeTeamName + awayTeamName + competitionId = update.
 *
 * Run: npm run seed:fixtures
 *
 * Para adicionar jogos: edite server/seed/matches.corinthians.json
 */
import "dotenv/config";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { db } from "../db";
import { competitions, fixtures, teamMatchRatings } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEED_PATH = join(__dirname, "../seed/matches.corinthians.json");

type MatchInput = {
  competition: string;
  date: string;
  time?: string;
  home: string;
  away: string;
  status: "SCHEDULED" | "FT" | "POSTPONED" | "LIVE" | "CANCELED";
  homeScore?: number | null;
  awayScore?: number | null;
  venue?: string | null;
  teamRating?: number | null;
};

type SeedData = {
  teamId: string;
  season: string;
  matches: MatchInput[];
};

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

async function ensureCompetition(name: string, country = "Brazil"): Promise<string> {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const id = `comp-${slug}`;

  const [existing] = await db.select().from(competitions).where(eq(competitions.id, id));
  if (!existing) {
    await db.insert(competitions).values({
      id,
      name,
      country,
      logoUrl: null,
    });
    console.log(`  ✓ Competition: ${name}`);
  }
  return id;
}

async function upsertFixture(
  teamId: string,
  competitionId: string,
  season: string,
  m: MatchInput
): Promise<string> {
  const kickoffAt = parseKickoff(m.date, m.time);

  const [existing] = await db
    .select()
    .from(fixtures)
    .where(
      and(
        eq(fixtures.teamId, teamId),
        eq(fixtures.competitionId, competitionId),
        eq(fixtures.kickoffAt, kickoffAt),
        eq(fixtures.homeTeamName, m.home),
        eq(fixtures.awayTeamName, m.away)
      )
    )
    .limit(1);

  const payload = {
    teamId,
    competitionId,
    season,
    status: m.status,
    kickoffAt,
    homeTeamName: m.home,
    awayTeamName: m.away,
    homeScore: m.homeScore ?? null,
    awayScore: m.awayScore ?? null,
    venue: m.venue ?? null,
  };

  let fixtureId: string;
  if (existing) {
    await db
      .update(fixtures)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(fixtures.id, existing.id));
    fixtureId = existing.id;
    console.log(`  ↻ Updated: ${m.home} x ${m.away} (${m.date})`);
  } else {
    const [inserted] = await db.insert(fixtures).values(payload).returning({ id: fixtures.id });
    fixtureId = inserted!.id;
    console.log(`  + Inserted: ${m.home} x ${m.away} (${m.date})`);
  }

  if (m.status === "FT" && m.teamRating != null && m.teamRating > 0) {
    const [existingRating] = await db
      .select()
      .from(teamMatchRatings)
      .where(and(eq(teamMatchRatings.fixtureId, fixtureId), eq(teamMatchRatings.teamId, teamId)))
      .limit(1);
    const ratingVal = Math.min(10, Math.max(0, m.teamRating));
    if (existingRating) {
      await db
        .update(teamMatchRatings)
        .set({ rating: ratingVal, source: "internal", updatedAt: new Date() })
        .where(eq(teamMatchRatings.id, existingRating.id));
    } else {
      await db.insert(teamMatchRatings).values({
        fixtureId,
        teamId,
        rating: ratingVal,
        source: "internal",
      });
    }
    console.log(`    → Rating: ${ratingVal.toFixed(1)}`);
  }

  return fixtureId;
}

async function seedFixtures() {
  console.log("🌱 Seeding fixtures from", SEED_PATH);

  const raw = readFileSync(SEED_PATH, "utf-8");
  const data: SeedData = JSON.parse(raw);

  if (!data.teamId || !data.matches?.length) {
    console.log("  Nenhum jogo em matches. Adicione jogos em server/seed/matches.corinthians.json");
    return;
  }

  const { teamId, season, matches } = data;

  for (const m of matches) {
    const competitionId = await ensureCompetition(m.competition);
    await upsertFixture(teamId, competitionId, season, m);
  }

  console.log(`✅ Fixtures seed complete. ${matches.length} jogos processados.`);
}

seedFixtures().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

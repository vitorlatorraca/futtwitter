/**
 * Seed upcoming match: Corinthians x RB Bragantino.
 * Idempotent: removes existing demo upcoming match and re-inserts.
 *
 * Run: npx tsx server/scripts/seed-corinthians-upcoming.ts
 */
import "dotenv/config";
import { db } from "../db";
import { matches } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const TEAM_ID = "corinthians";

// Thursday 20:00 BRT - use a future date (next week)
const MATCH_DATE = new Date();
MATCH_DATE.setDate(MATCH_DATE.getDate() + 7);
MATCH_DATE.setHours(23, 0, 0, 0); // 20:00 BRT ≈ 23:00 UTC (approx)

async function seed() {
  console.log("Seeding Corinthians upcoming match (Corinthians x RB Bragantino)...");

  const existing = await db
    .select({ id: matches.id })
    .from(matches)
    .where(
      and(
        eq(matches.teamId, TEAM_ID),
        eq(matches.opponent, "RB Bragantino"),
        eq(matches.isMock, true)
      )
    );

  for (const row of existing) {
    await db.delete(matches).where(eq(matches.id, row.id));
  }

  const [match] = await db
    .insert(matches)
    .values({
      teamId: TEAM_ID,
      opponent: "RB Bragantino",
      opponentLogoUrl: null,
      isHomeMatch: true,
      teamScore: null,
      opponentScore: null,
      matchDate: MATCH_DATE,
      stadium: "Neo Química Arena",
      status: "SCHEDULED",
      competition: "Brasileirão",
      isMock: true,
      broadcastChannel: "ESPN / Premiere",
    })
    .returning({ id: matches.id });

  if (match) {
    console.log(`Done. Upcoming match created: Corinthians x RB Bragantino - ${MATCH_DATE.toISOString()}`);
  } else {
    console.error("Failed to create match.");
  }
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

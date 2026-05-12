/**
 * Seed Corinthians last match with Sofascore-like ratings (DB-only, isMock=true).
 * Run: npx tsx server/seed-corinthians-last-match.ts
 */
import "dotenv/config";
import { db } from "./db";
import { matches, matchPlayers, players } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const TEAM_ID = "corinthians";

// Placeholder realistic ratings for demo (Sofascore-style 1-10)
const STARTER_RATINGS: { name: string; shirtNumber: number; rating: number; minutes: number }[] = [
  { name: "Hugo Souza", shirtNumber: 1, rating: 6.8, minutes: 90 },
  { name: "Matheuzinho", shirtNumber: 2, rating: 7.1, minutes: 90 },
  { name: "André Ramalho", shirtNumber: 5, rating: 7.0, minutes: 90 },
  { name: "Gustavo Henrique", shirtNumber: 13, rating: 6.9, minutes: 90 },
  { name: "Matheus Bidu", shirtNumber: 21, rating: 6.7, minutes: 85 },
  { name: "Raniele", shirtNumber: 14, rating: 7.2, minutes: 90 },
  { name: "José Martínez", shirtNumber: 70, rating: 6.6, minutes: 78 },
  { name: "Rodrigo Garro", shirtNumber: 8, rating: 7.5, minutes: 90 },
  { name: "Kaio César", shirtNumber: 37, rating: 6.8, minutes: 70 },
  { name: "Memphis Depay", shirtNumber: 10, rating: 7.8, minutes: 90 },
  { name: "Yuri Alberto", shirtNumber: 9, rating: 7.3, minutes: 90 },
];

async function seed() {
  console.log("Seeding Corinthians last match (idempotent)...");

  const roster = await db.select().from(players).where(eq(players.teamId, TEAM_ID));
  if (roster.length === 0) {
    console.log("No Corinthians players. Run seed:corinthians first.");
    process.exit(1);
  }

  const mockMatches = await db.select().from(matches).where(and(eq(matches.teamId, TEAM_ID), eq(matches.isMock, true)));
  for (const m of mockMatches) {
    await db.delete(matchPlayers).where(eq(matchPlayers.matchId, m.id));
    await db.delete(matches).where(eq(matches.id, m.id));
  }

  const [match] = await db
    .insert(matches)
    .values({
      teamId: TEAM_ID,
      opponent: "São Paulo",
      isHomeMatch: true,
      teamScore: 2,
      opponentScore: 1,
      matchDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      stadium: "Neo Química Arena",
      status: "COMPLETED",
      competition: "Campeonato Paulista",
      isMock: true,
    })
    .returning();

  if (!match) {
    console.error("Failed to create match");
    process.exit(1);
  }

  const nameToPlayer = new Map(roster.map((p) => [p.name, p]));

  for (const sr of STARTER_RATINGS) {
    const player = nameToPlayer.get(sr.name);
    if (!player) {
      console.warn(`Player not found: ${sr.name}`);
      continue;
    }
    await db.insert(matchPlayers).values({
      matchId: match.id,
      playerId: player.id,
      participated: true,
      wasStarter: true,
      minutesPlayed: sr.minutes,
      sofascoreRating: sr.rating,
    });
  }

  // Add a few substitutes
  const subs = [
    { name: "Pedro Raul", shirtNumber: 18, rating: 6.5, minutes: 20 },
    { name: "Breno Bidon", shirtNumber: 7, rating: 6.4, minutes: 12 },
  ];
  for (const s of subs) {
    const player = nameToPlayer.get(s.name);
    if (player) {
      await db.insert(matchPlayers).values({
        matchId: match.id,
        playerId: player.id,
        participated: true,
        wasStarter: false,
        minutesPlayed: s.minutes,
        sofascoreRating: s.rating,
      });
    }
  }

  console.log(`Done. Match ${match.opponent} ${match.teamScore}-${match.opponentScore} (isMock=true)`);
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

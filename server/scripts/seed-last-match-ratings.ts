/**
 * Seed: notas dos jogadores na última partida (player_match_stats).
 * Garante que o último jogo FT do Corinthians tenha ratings para exibir no card.
 *
 * Pré-requisito: npm run db:seed (seed-sport-complete) - cria match_games e estrutura.
 *
 * Run: npx tsx server/scripts/seed-last-match-ratings.ts
 */
import "dotenv/config";
import { db } from "../db";
import {
  matchGames,
  playerMatchStats,
  players,
  teams,
  competitions,
} from "@shared/schema";
import { eq, and, or, desc } from "drizzle-orm";

const CORINTHIANS_ID = "corinthians";

// Ratings realistas para Corinthians 2-0 RB Bragantino (estilo Sofascore)
const RATINGS = [8.2, 7.8, 8.0, 7.5, 7.9, 8.1, 7.4, 8.3, 7.6, 8.0, 7.2];
const MINUTES = [90, 90, 90, 90, 85, 90, 78, 90, 90, 65, 90];

async function seed() {
  console.log("🌱 Seeding last match ratings (Corinthians)...\n");

  const [corinthians] = await db.select().from(teams).where(eq(teams.id, CORINTHIANS_ID)).limit(1);
  if (!corinthians) {
    console.log("  ⚠️  Corinthians não encontrado. Rode npm run seed:corinthians primeiro.");
    return;
  }

  const [lastMatch] = await db
    .select()
    .from(matchGames)
    .where(
      and(
        or(eq(matchGames.homeTeamId, CORINTHIANS_ID), eq(matchGames.awayTeamId, CORINTHIANS_ID))!,
        eq(matchGames.status, "FT")
      )
    )
    .orderBy(desc(matchGames.kickoffAt))
    .limit(1);

  if (!lastMatch) {
    console.log("  ⚠️  Nenhum jogo FT encontrado para o Corinthians.");
    console.log("  Rode npm run db:seed para criar match_games.");
    return;
  }

  const roster = await db
    .select()
    .from(players)
    .where(eq(players.teamId, CORINTHIANS_ID))
    .limit(11);

  if (roster.length === 0) {
    console.log("  ⚠️  Nenhum jogador no elenco. Rode npm run seed:corinthians primeiro.");
    return;
  }

  const existing = await db
    .select()
    .from(playerMatchStats)
    .where(
      and(
        eq(playerMatchStats.matchId, lastMatch.id),
        eq(playerMatchStats.teamId, CORINTHIANS_ID)
      )
    );

  if (existing.length >= 8) {
    console.log(`  ✓ Último jogo já tem ${existing.length} jogadores com rating.`);
    return;
  }

  for (let i = 0; i < Math.min(roster.length, 11); i++) {
    const p = roster[i];
    const [has] = await db
      .select()
      .from(playerMatchStats)
      .where(
        and(
          eq(playerMatchStats.matchId, lastMatch.id),
          eq(playerMatchStats.playerId, p.id)
        )
      )
      .limit(1);

    const rating = RATINGS[i % RATINGS.length];
    const minutes = MINUTES[i % MINUTES.length];

    if (has) {
      await db
        .update(playerMatchStats)
        .set({ rating, minutes, goals: 0, assists: 0 })
        .where(eq(playerMatchStats.id, has.id));
      console.log(`  ↻ ${p.name}: ${rating.toFixed(1)} (${minutes}')`);
    } else {
      await db.insert(playerMatchStats).values({
        matchId: lastMatch.id,
        playerId: p.id,
        teamId: CORINTHIANS_ID,
        minutes,
        rating,
        goals: 0,
        assists: 0,
        shots: 0,
        passes: 0,
        tackles: 0,
        saves: 0,
      });
      console.log(`  + ${p.name}: ${rating.toFixed(1)} (${minutes}')`);
    }
  }

  const comp = lastMatch.competitionId
    ? await db.select().from(competitions).where(eq(competitions.id, lastMatch.competitionId)).limit(1)
    : [];
  const compName = comp[0]?.name ?? "—";

  console.log(`\n✅ Seed last match ratings complete.`);
  console.log(`   Jogo: ${lastMatch.homeScore ?? "?"}x${lastMatch.awayScore ?? "?"} · ${compName}`);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

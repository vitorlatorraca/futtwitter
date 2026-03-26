/**
 * Seed: notas dos jogadores na última partida (player_match_stats + matchLineups).
 * Garante que o último jogo FT do Corinthians tenha:
 *  - matchLineups com formação "4-3-3"
 *  - matchLineupPlayers com positionCode correto para cada jogador
 *  - playerMatchStats com rating e minutos
 *
 * Pré-requisito: npm run db:seed (cria match_games)
 * Run: npx tsx server/scripts/seed-last-match-ratings.ts
 */
import "dotenv/config";
import { db } from "../db";
import {
  matchGames,
  matchLineups,
  matchLineupPlayers,
  playerMatchStats,
  players,
  teams,
  competitions,
} from "@shared/schema";
import { eq, and, or, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

const CORINTHIANS_ID = "corinthians";

/** Escalação titular Corinthians — 4-3-3 */
const STARTING_XI: Array<{
  name: string;
  shirtNumber: number;
  positionCode: string;
  rating: number;
  minutes: number;
}> = [
  { name: "Hugo Souza",       shirtNumber: 1,  positionCode: "GK", rating: 6.8, minutes: 90 },
  { name: "Matheuzinho",      shirtNumber: 2,  positionCode: "RB", rating: 7.1, minutes: 90 },
  { name: "André Ramalho",    shirtNumber: 5,  positionCode: "CB", rating: 7.0, minutes: 90 },
  { name: "Gustavo Henrique", shirtNumber: 13, positionCode: "CB", rating: 6.9, minutes: 90 },
  { name: "Matheus Bidu",     shirtNumber: 21, positionCode: "LB", rating: 6.7, minutes: 85 },
  { name: "Raniele",          shirtNumber: 14, positionCode: "DM", rating: 7.2, minutes: 90 },
  { name: "José Martínez",    shirtNumber: 70, positionCode: "CM", rating: 6.6, minutes: 78 },
  { name: "Rodrigo Garro",    shirtNumber: 8,  positionCode: "AM", rating: 7.5, minutes: 90 },
  { name: "Kaio César",       shirtNumber: 37, positionCode: "RW", rating: 6.8, minutes: 70 },
  { name: "Memphis Depay",    shirtNumber: 10, positionCode: "LW", rating: 7.8, minutes: 90 },
  { name: "Yuri Alberto",     shirtNumber: 9,  positionCode: "ST", rating: 7.3, minutes: 90 },
];

async function seed() {
  console.log("🌱 Seeding last match ratings + lineup (Corinthians 4-3-3)...\n");

  const [corinthians] = await db.select().from(teams).where(eq(teams.id, CORINTHIANS_ID)).limit(1);
  if (!corinthians) {
    console.log("  ⚠️  Corinthians não encontrado. Rode npm run seed:corinthians primeiro.");
    return;
  }

  // --- Buscar último jogo FT ---
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

  console.log(`  📅 Último jogo FT: ${lastMatch.id} (${lastMatch.kickoffAt})`);

  // --- Buscar roster ---
  const roster = await db.select().from(players).where(eq(players.teamId, CORINTHIANS_ID));
  if (roster.length === 0) {
    console.log("  ⚠️  Nenhum jogador no elenco. Rode npm run seed:corinthians primeiro.");
    return;
  }

  const nameToPlayer = new Map(roster.map((p) => [p.name, p]));

  // --- Limpar playerMatchStats antigos (remove entradas de seeds anteriores) ---
  const deleted = await db
    .delete(playerMatchStats)
    .where(
      and(eq(playerMatchStats.matchId, lastMatch.id), eq(playerMatchStats.teamId, CORINTHIANS_ID))
    );
  console.log(`  🗑  playerMatchStats antigos removidos para este jogo`);

  // --- Criar matchLineup (idempotente) ---
  const [existingLineup] = await db
    .select()
    .from(matchLineups)
    .where(and(eq(matchLineups.matchId, lastMatch.id), eq(matchLineups.teamId, CORINTHIANS_ID)))
    .limit(1);

  let lineupId: string;

  if (existingLineup) {
    lineupId = existingLineup.id;
    console.log(`  ✓ Lineup existente: ${lineupId}`);
    // Limpar lineup players existentes para re-inserir
    await db.delete(matchLineupPlayers).where(eq(matchLineupPlayers.matchLineupId, lineupId));
  } else {
    lineupId = randomUUID();
    await db.insert(matchLineups).values({
      id: lineupId,
      matchId: lastMatch.id,
      teamId: CORINTHIANS_ID,
      formation: "4-3-3",
    });
    console.log(`  + Lineup criada: ${lineupId} (4-3-3)`);
  }

  // --- Inserir matchLineupPlayers ---
  let lineupCount = 0;
  for (const starter of STARTING_XI) {
    const player = nameToPlayer.get(starter.name);
    if (!player) {
      console.warn(`  ⚠️  Jogador não encontrado no elenco: ${starter.name}`);
      continue;
    }
    await db.insert(matchLineupPlayers).values({
      id: randomUUID(),
      matchLineupId: lineupId,
      playerId: player.id,
      isStarter: true,
      positionCode: starter.positionCode,
      shirtNumber: starter.shirtNumber,
      minutesPlayed: starter.minutes,
    });
    lineupCount++;
    console.log(`  + ${starter.name} [${starter.positionCode}] #${starter.shirtNumber}`);
  }

  // --- Upsert playerMatchStats ---
  let statsCount = 0;
  for (const starter of STARTING_XI) {
    const player = nameToPlayer.get(starter.name);
    if (!player) continue;

    const [existing] = await db
      .select()
      .from(playerMatchStats)
      .where(
        and(
          eq(playerMatchStats.matchId, lastMatch.id),
          eq(playerMatchStats.playerId, player.id)
        )
      )
      .limit(1);

    if (existing) {
      await db
        .update(playerMatchStats)
        .set({ rating: starter.rating, minutes: starter.minutes, goals: 0, assists: 0 })
        .where(eq(playerMatchStats.id, existing.id));
      console.log(`  ↻ ${starter.name}: ${starter.rating.toFixed(1)} (${starter.minutes}')`);
    } else {
      await db.insert(playerMatchStats).values({
        id: randomUUID(),
        matchId: lastMatch.id,
        playerId: player.id,
        teamId: CORINTHIANS_ID,
        minutes: starter.minutes,
        rating: starter.rating,
        goals: 0,
        assists: 0,
        shots: 0,
        passes: 0,
        tackles: 0,
        saves: 0,
      });
      console.log(`  + ${starter.name}: ${starter.rating.toFixed(1)} (${starter.minutes}')`);
    }
    statsCount++;
  }

  const comp = lastMatch.competitionId
    ? await db.select().from(competitions).where(eq(competitions.id, lastMatch.competitionId)).limit(1)
    : [];
  const compName = comp[0]?.name ?? "—";

  console.log(`\n✅ Seed last match ratings complete.`);
  console.log(`   Jogo: ${lastMatch.homeScore ?? "?"}x${lastMatch.awayScore ?? "?"} · ${compName}`);
  console.log(`   ${lineupCount} jogadores na escalação | ${statsCount} com rating`);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

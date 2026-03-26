/**
 * Repository for "Adivinhe o Jogador" (Player of the Day) game.
 * Timezone: UTC. dateKey = YYYY-MM-DD in UTC.
 * Each team gets its own deterministic daily player via seeded hash.
 */
import crypto from "crypto";
import { db } from "../db";
import {
  gameDailyPlayer,
  gameDailyGuessProgress,
  players,
} from "@shared/schema";
import { eq, and, or, ilike, isNotNull } from "drizzle-orm";
import levenshtein from "fast-levenshtein";

const MAX_WRONG_ATTEMPTS = 10;

// --------------- Helpers ---------------

export function getTodayDateKey(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD in UTC
}

function normalizeForMatch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[.,\-']/g, "")
    .replace(/\s+/g, " ");
}

function dateKeyToSeed(dateKey: string): number {
  const hash = crypto.createHash("sha256").update(dateKey).digest();
  return hash.readUInt32BE(0);
}

function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const dist = levenshtein.get(a, b);
  const maxLen = Math.max(a.length, b.length);
  return 1 - dist / maxLen;
}

function isFuzzyMatch(input: string, target: string): boolean {
  const normInput = normalizeForMatch(input);
  const normTarget = normalizeForMatch(target);
  if (normInput === normTarget) return true;

  const sim = similarity(normInput, normTarget);
  const minLen = Math.min(normInput.length, normTarget.length);
  const threshold = minLen <= 5 ? 0.85 : minLen <= 10 ? 0.8 : 0.75;
  return sim >= threshold;
}

function computeBlurPercent(wrongAttempts: number): number {
  return Math.max(0, 100 - wrongAttempts * 10);
}

// --------------- Daily Player ---------------

export async function getOrCreateDailyPlayer(dateKey: string, teamId: string) {
  const [existing] = await db
    .select()
    .from(gameDailyPlayer)
    .where(and(eq(gameDailyPlayer.dateKey, dateKey), eq(gameDailyPlayer.teamId, teamId)))
    .limit(1);

  if (existing) {
    const [player] = await db
      .select({
        id: players.id,
        name: players.name,
        knownName: players.knownName,
        photoUrl: players.photoUrl,
        position: players.position,
        shirtNumber: players.shirtNumber,
      })
      .from(players)
      .where(eq(players.id, existing.playerId))
      .limit(1);
    return { daily: existing, player: player ?? null };
  }

  // Get all players with photos for this team (stable order by id)
  const teamPlayers = await db
    .select({ id: players.id })
    .from(players)
    .where(and(eq(players.teamId, teamId), isNotNull(players.photoUrl)))
    .orderBy(players.id);

  if (teamPlayers.length === 0) {
    // Fallback: try all players for the team even without photos
    const allTeamPlayers = await db
      .select({ id: players.id })
      .from(players)
      .where(eq(players.teamId, teamId))
      .orderBy(players.id);
    if (allTeamPlayers.length === 0) return null;
    teamPlayers.push(...allTeamPlayers);
  }

  const seed = dateKeyToSeed(`${dateKey}:${teamId}`);
  const idx = seed % teamPlayers.length;
  const chosenPlayerId = teamPlayers[idx].id;

  const [inserted] = await db
    .insert(gameDailyPlayer)
    .values({
      dateKey,
      teamId,
      playerId: chosenPlayerId,
      seedUsed: seed,
    })
    .onConflictDoNothing()
    .returning();

  // Handle race condition: if another request already inserted, fetch it
  if (!inserted) {
    return getOrCreateDailyPlayer(dateKey, teamId);
  }

  const [player] = await db
    .select({
      id: players.id,
      name: players.name,
      knownName: players.knownName,
      photoUrl: players.photoUrl,
      position: players.position,
      shirtNumber: players.shirtNumber,
    })
    .from(players)
    .where(eq(players.id, chosenPlayerId))
    .limit(1);

  return { daily: inserted, player: player ?? null };
}

// --------------- Progress ---------------

export async function getOrCreateProgress(userId: string, dateKey: string, dailyPlayerId: string) {
  const [existing] = await db
    .select()
    .from(gameDailyGuessProgress)
    .where(and(eq(gameDailyGuessProgress.userId, userId), eq(gameDailyGuessProgress.dateKey, dateKey)))
    .limit(1);

  if (existing) return existing;

  const [inserted] = await db
    .insert(gameDailyGuessProgress)
    .values({
      userId,
      dateKey,
      dailyPlayerId,
      attempts: 0,
      wrongAttempts: 0,
      guessed: false,
      lost: false,
      guesses: [],
    })
    .onConflictDoNothing()
    .returning();

  if (!inserted) {
    return getOrCreateProgress(userId, dateKey, dailyPlayerId);
  }
  return inserted;
}

// --------------- Full State ---------------

export interface PlayerOfTheDayResponse {
  dateKey: string;
  player: {
    id: string;
    photoUrl: string | null;
    position: string;
    shirtNumber: number | null;
    name?: string;
  };
  progress: {
    attempts: number;
    wrongAttempts: number;
    guessed: boolean;
    lost: boolean;
    guesses: Array<{ text: string; correct: boolean }>;
    blurPercent: number;
    attemptsLeft: number;
  };
  status: "playing" | "won" | "lost";
}

export async function getPlayerOfTheDay(userId: string, teamId: string): Promise<PlayerOfTheDayResponse | null> {
  const dateKey = getTodayDateKey();
  const result = await getOrCreateDailyPlayer(dateKey, teamId);
  if (!result || !result.player) return null;

  const { daily, player } = result;
  const progress = await getOrCreateProgress(userId, dateKey, daily.id);

  const guesses = (progress.guesses as Array<{ text: string; normalized: string; correct: boolean }>) ?? [];
  const status: "playing" | "won" | "lost" = progress.guessed ? "won" : progress.lost ? "lost" : "playing";
  const revealName = status !== "playing";

  return {
    dateKey,
    player: {
      id: player.id,
      photoUrl: player.photoUrl,
      position: player.position,
      shirtNumber: player.shirtNumber,
      ...(revealName ? { name: player.knownName || player.name } : {}),
    },
    progress: {
      attempts: progress.attempts,
      wrongAttempts: progress.wrongAttempts,
      guessed: progress.guessed,
      lost: progress.lost,
      guesses: guesses.map((g) => ({ text: g.text, correct: g.correct })),
      blurPercent: computeBlurPercent(progress.wrongAttempts),
      attemptsLeft: Math.max(0, MAX_WRONG_ATTEMPTS - progress.wrongAttempts),
    },
    status,
  };
}

// --------------- Guess ---------------

export interface GuessResponse {
  correct: boolean;
  feedback: "correct" | "close" | "wrong";
  status: "playing" | "won" | "lost";
  wrongAttempts: number;
  blurPercent: number;
  attemptsLeft: number;
  revealName?: string;
}

export async function processGuess(userId: string, teamId: string, guessText: string): Promise<GuessResponse> {
  const dateKey = getTodayDateKey();
  const result = await getOrCreateDailyPlayer(dateKey, teamId);
  if (!result || !result.player) throw new Error("Nenhum jogador do dia disponível");

  const { daily, player } = result;
  const progress = await getOrCreateProgress(userId, dateKey, daily.id);

  if (progress.guessed) {
    return {
      correct: true,
      feedback: "correct",
      status: "won",
      wrongAttempts: progress.wrongAttempts,
      blurPercent: 0,
      attemptsLeft: 0,
      revealName: player.knownName || player.name,
    };
  }

  if (progress.lost) {
    return {
      correct: false,
      feedback: "wrong",
      status: "lost",
      wrongAttempts: progress.wrongAttempts,
      blurPercent: 0,
      attemptsLeft: 0,
      revealName: player.knownName || player.name,
    };
  }

  const normalizedGuess = normalizeForMatch(guessText);
  const realName = player.knownName || player.name;
  const realNameNormalized = normalizeForMatch(realName);

  // Also check fullName and name variants
  const namesToCheck = [realName, player.name, player.knownName].filter(Boolean) as string[];

  let isCorrect = false;
  let isClose = false;

  for (const nameVariant of namesToCheck) {
    const normVariant = normalizeForMatch(nameVariant);
    if (normalizedGuess === normVariant) {
      isCorrect = true;
      break;
    }
  }

  if (!isCorrect) {
    for (const nameVariant of namesToCheck) {
      if (isFuzzyMatch(guessText, nameVariant)) {
        isCorrect = true;
        isClose = true;
        break;
      }
    }
  }

  const existingGuesses = (progress.guesses as Array<{ text: string; normalized: string; correct: boolean }>) ?? [];
  const newGuess = { text: guessText, normalized: normalizedGuess, correct: isCorrect };
  const updatedGuesses = [...existingGuesses, newGuess];

  if (isCorrect) {
    await db
      .update(gameDailyGuessProgress)
      .set({
        attempts: progress.attempts + 1,
        guessed: true,
        guesses: updatedGuesses,
        updatedAt: new Date(),
      })
      .where(eq(gameDailyGuessProgress.id, progress.id));

    return {
      correct: true,
      feedback: "correct",
      status: "won",
      wrongAttempts: progress.wrongAttempts,
      blurPercent: 0,
      attemptsLeft: 0,
      revealName: realName,
    };
  }

  // Wrong guess
  const newWrongAttempts = progress.wrongAttempts + 1;
  const hasLost = newWrongAttempts >= MAX_WRONG_ATTEMPTS;

  await db
    .update(gameDailyGuessProgress)
    .set({
      attempts: progress.attempts + 1,
      wrongAttempts: newWrongAttempts,
      lost: hasLost,
      guesses: updatedGuesses,
      updatedAt: new Date(),
    })
    .where(eq(gameDailyGuessProgress.id, progress.id));

  // Check if input is somewhat similar (close miss)
  const sim = similarity(normalizedGuess, realNameNormalized);
  const feedback = sim >= 0.5 ? "close" : "wrong";

  return {
    correct: false,
    feedback,
    status: hasLost ? "lost" : "playing",
    wrongAttempts: newWrongAttempts,
    blurPercent: hasLost ? 0 : computeBlurPercent(newWrongAttempts),
    attemptsLeft: Math.max(0, MAX_WRONG_ATTEMPTS - newWrongAttempts),
    ...(hasLost ? { revealName: realName } : {}),
  };
}

// --------------- Search ---------------

export async function searchPlayersForGame(
  teamId: string,
  query: string,
  limit = 10
): Promise<Array<{ id: string; name: string; photoUrl: string | null; position: string }>> {
  const term = query.trim();
  if (!term || term.length < 2) return [];

  const rows = await db
    .select({
      id: players.id,
      name: players.name,
      knownName: players.knownName,
      photoUrl: players.photoUrl,
      position: players.position,
    })
    .from(players)
    .where(
      and(
        eq(players.teamId, teamId),
        or(
          ilike(players.name, `%${term}%`),
          ilike(players.knownName, `%${term}%`),
        ),
      )
    )
    .orderBy(players.name)
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    name: r.knownName || r.name,
    photoUrl: r.photoUrl,
    position: r.position,
  }));
}

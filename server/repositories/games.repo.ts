/**
 * Repositório e lógica de matching para o jogo "Adivinhe o Elenco".
 * Módulo isolado (game_*) — não usa players/teams do elenco atual.
 */
import { db } from "../db";
import {
  gameSets,
  gameSetPlayers,
  gameAttempts,
  gameAttemptGuesses,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import levenshtein from "fast-levenshtein";

// --- Normalização ---
export function normalizeForMatch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[.,\-']/g, "")
    .replace(/\s+/g, " ");
}

// --- Similaridade (1 = idêntico, 0 = totalmente diferente) ---
function similarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const dist = levenshtein.get(a, b);
  const maxLen = Math.max(a.length, b.length);
  return 1 - dist / maxLen;
}

function thresholdForLength(len: number): number {
  if (len <= 6) return 0.85;
  if (len <= 12) return 0.8;
  return 0.75;
}

export interface MatchResult {
  matched: true;
  setPlayerId: string;
  displayName: string;
  jerseyNumber: number | null;
  score: number;
}

export interface NoMatchResult {
  matched: false;
  reason?: "already_guessed" | "no_match";
}

export type GuessResult = MatchResult | NoMatchResult;

export async function listGameSets(): Promise<
  Array<{
    id: string;
    slug: string;
    title: string;
    season: number | null;
    competition: string | null;
    clubName: string;
    playerCount: number;
    teamName: string;
    seasonYear: number | null;
    description: string | null;
    gameType: string;
  }>
> {
  const sets = await db.select().from(gameSets).orderBy(gameSets.createdAt);
  const result: Array<{
    id: string;
    slug: string;
    title: string;
    season: number | null;
    competition: string | null;
    clubName: string;
    playerCount: number;
    teamName: string;
    seasonYear: number | null;
    description: string | null;
    gameType: string;
  }> = [];

  for (const s of sets) {
    const [countRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(gameSetPlayers)
      .where(eq(gameSetPlayers.setId, s.id));
    const playerCount = Number(countRow?.count ?? 0);
    result.push({
      id: s.id,
      slug: s.slug,
      title: s.title,
      season: s.season ?? null,
      competition: s.competition ?? null,
      clubName: s.clubName,
      playerCount,
      teamName: s.clubName,
      seasonYear: s.season ?? null,
      description: null,
      gameType: "adivinhe_elenco",
    });
  }

  return result;
}

export async function getGameSetBySlug(slug: string): Promise<{
  id: string;
  slug: string;
  title: string;
  season: number | null;
  competition: string | null;
  clubName: string;
  players: Array<{
    id: string;
    jerseyNumber: number | null;
    displayName: string;
    sortOrder: number;
  }>;
} | null> {
  const [set] = await db.select().from(gameSets).where(eq(gameSets.slug, slug)).limit(1);
  if (!set) return null;

  const players = await db
    .select({
      id: gameSetPlayers.id,
      jerseyNumber: gameSetPlayers.jerseyNumber,
      displayName: gameSetPlayers.displayName,
      sortOrder: gameSetPlayers.sortOrder,
    })
    .from(gameSetPlayers)
    .where(eq(gameSetPlayers.setId, set.id))
    .orderBy(gameSetPlayers.sortOrder);

  return {
    id: set.id,
    slug: set.slug,
    title: set.title,
    season: set.season ?? null,
    competition: set.competition ?? null,
    clubName: set.clubName,
    players,
  };
}

export async function startOrGetAttempt(
  userId: string,
  setSlug: string
): Promise<{ attemptId: string; guessedIds: string[] }> {
  const [set] = await db.select().from(gameSets).where(eq(gameSets.slug, setSlug)).limit(1);
  if (!set) throw new Error("Set não encontrado");

  const [existing] = await db
    .select()
    .from(gameAttempts)
    .where(and(eq(gameAttempts.userId, userId), eq(gameAttempts.setId, set.id)))
    .limit(1);

  let attemptId: string;
  if (existing) {
    if (existing.status === "in_progress") {
      const guesses = await db
        .select({ setPlayerId: gameAttemptGuesses.setPlayerId })
        .from(gameAttemptGuesses)
        .where(eq(gameAttemptGuesses.attemptId, existing.id));
      return {
        attemptId: existing.id,
        guessedIds: guesses.map((g) => g.setPlayerId),
      };
    }
    // completed or abandoned: reset (clear guesses, set in_progress)
    await db.delete(gameAttemptGuesses).where(eq(gameAttemptGuesses.attemptId, existing.id));
    await db
      .update(gameAttempts)
      .set({
        status: "in_progress",
        completedAt: null,
        guessesCount: 0,
        updatedAt: new Date(),
      })
      .where(eq(gameAttempts.id, existing.id));
    attemptId = existing.id;
  } else {
    const [inserted] = await db
      .insert(gameAttempts)
      .values({
        userId,
        setId: set.id,
        status: "in_progress",
      })
      .returning();
    if (!inserted) throw new Error("Failed to create attempt");
    attemptId = inserted.id;
  }

  return { attemptId, guessedIds: [] };
}

export async function getAttempt(
  attemptId: string,
  userId: string
): Promise<{
  id: string;
  status: string;
  guessedIds: string[];
  set: { slug: string; title: string; players: Array<{ id: string; jerseyNumber: number | null; displayName: string; sortOrder: number }> };
} | null> {
  const [attempt] = await db
    .select()
    .from(gameAttempts)
    .where(and(eq(gameAttempts.id, attemptId), eq(gameAttempts.userId, userId)))
    .limit(1);
  if (!attempt) return null;

  const guesses = await db
    .select({ setPlayerId: gameAttemptGuesses.setPlayerId })
    .from(gameAttemptGuesses)
    .where(eq(gameAttemptGuesses.attemptId, attemptId));

  const [set] = await db.select().from(gameSets).where(eq(gameSets.id, attempt.setId)).limit(1);
  if (!set) return null;

  const players = await db
    .select({
      id: gameSetPlayers.id,
      jerseyNumber: gameSetPlayers.jerseyNumber,
      displayName: gameSetPlayers.displayName,
      sortOrder: gameSetPlayers.sortOrder,
    })
    .from(gameSetPlayers)
    .where(eq(gameSetPlayers.setId, set.id))
    .orderBy(gameSetPlayers.sortOrder);

  return {
    id: attempt.id,
    status: attempt.status,
    guessedIds: guesses.map((g) => g.setPlayerId),
    set: {
      slug: set.slug,
      title: set.title,
      players,
    },
  };
}

export async function processGuess(
  attemptId: string,
  userId: string,
  text: string
): Promise<GuessResult> {
  const [attempt] = await db
    .select()
    .from(gameAttempts)
    .where(and(eq(gameAttempts.id, attemptId), eq(gameAttempts.userId, userId)))
    .limit(1);
  if (!attempt) throw new Error("Attempt não encontrado");
  if (attempt.status !== "in_progress") throw new Error("Attempt não está em progresso");

  const normalizedInput = normalizeForMatch(text);
  if (!normalizedInput) return { matched: false, reason: "no_match" };

  const guessedIds = await db
    .select({ setPlayerId: gameAttemptGuesses.setPlayerId })
    .from(gameAttemptGuesses)
    .where(eq(gameAttemptGuesses.attemptId, attemptId));
  const guessedSet = new Set(guessedIds.map((g) => g.setPlayerId));

  const players = await db
    .select()
    .from(gameSetPlayers)
    .where(eq(gameSetPlayers.setId, attempt.setId));

  const notYetGuessed = players.filter((p) => !guessedSet.has(p.id));

  // Check if input matches an already-guessed player
  for (const p of players) {
    if (guessedSet.has(p.id)) {
      const sim = similarity(normalizedInput, p.normalizedName);
      const thresh = thresholdForLength(Math.min(normalizedInput.length, p.normalizedName.length));
      if (sim >= thresh || p.normalizedName === normalizedInput) {
        return { matched: false, reason: "already_guessed" };
      }
      const aliases = (p.aliases as string[] | null) ?? [];
      for (const alias of aliases) {
        if (normalizeForMatch(alias) === normalizedInput) {
          return { matched: false, reason: "already_guessed" };
        }
      }
    }
  }

  // 1. Exact match (normalized_name)
  for (const p of notYetGuessed) {
    if (p.normalizedName === normalizedInput) {
      await recordGuess(attemptId, p.id, text, 1);
      const all = guessedSet.size + 1;
      if (all >= players.length) {
        await db
          .update(gameAttempts)
          .set({ status: "completed", completedAt: new Date(), updatedAt: new Date() })
          .where(eq(gameAttempts.id, attemptId));
      }
      return {
        matched: true,
        setPlayerId: p.id,
        displayName: p.displayName,
        jerseyNumber: p.jerseyNumber,
        score: 1,
      };
    }
  }

  // 2. Alias match
  for (const p of notYetGuessed) {
    const aliases = (p.aliases as string[] | null) ?? [];
    for (const alias of aliases) {
      if (normalizeForMatch(alias) === normalizedInput) {
        await recordGuess(attemptId, p.id, text, 1);
        const all = guessedSet.size + 1;
        if (all >= players.length) {
          await db
            .update(gameAttempts)
            .set({ status: "completed", completedAt: new Date(), updatedAt: new Date() })
            .where(eq(gameAttempts.id, attemptId));
        }
        return {
          matched: true,
          setPlayerId: p.id,
          displayName: p.displayName,
          jerseyNumber: p.jerseyNumber,
          score: 1,
        };
      }
    }
  }

  // 3. Contains (sobrenome) - ex: "Tevez" -> Tévez
  for (const p of notYetGuessed) {
    const norm = p.normalizedName;
    if (norm.includes(normalizedInput) || normalizedInput.includes(norm)) {
      const sim = similarity(normalizedInput, norm);
      const thresh = thresholdForLength(Math.min(normalizedInput.length, norm.length));
      if (sim >= thresh) {
        await recordGuess(attemptId, p.id, text, sim);
        const all = guessedSet.size + 1;
        if (all >= players.length) {
          await db
            .update(gameAttempts)
            .set({ status: "completed", completedAt: new Date(), updatedAt: new Date() })
            .where(eq(gameAttempts.id, attemptId));
        }
        return {
          matched: true,
          setPlayerId: p.id,
          displayName: p.displayName,
          jerseyNumber: p.jerseyNumber,
          score: sim,
        };
      }
    }
  }

  // 4. Fuzzy
  let best: { player: typeof players[0]; score: number } | null = null;
  for (const p of notYetGuessed) {
    const sim = similarity(normalizedInput, p.normalizedName);
    const thresh = thresholdForLength(Math.min(normalizedInput.length, p.normalizedName.length));
    if (sim >= thresh && (!best || sim > best.score)) {
      best = { player: p, score: sim };
    }
  }

  if (best) {
    await recordGuess(attemptId, best.player.id, text, best.score);
    const all = guessedSet.size + 1;
    if (all >= players.length) {
      await db
        .update(gameAttempts)
        .set({ status: "completed", completedAt: new Date(), updatedAt: new Date() })
        .where(eq(gameAttempts.id, attemptId));
    }
    return {
      matched: true,
      setPlayerId: best.player.id,
      displayName: best.player.displayName,
      jerseyNumber: best.player.jerseyNumber,
      score: best.score,
    };
  }

  // Wrong guess: increment guesses_count
  await db
    .update(gameAttempts)
    .set({
      guessesCount: attempt.guessesCount + 1,
      updatedAt: new Date(),
    })
    .where(eq(gameAttempts.id, attemptId));

  return { matched: false, reason: "no_match" };
}

async function recordGuess(
  attemptId: string,
  setPlayerId: string,
  guessedText: string,
  score: number
): Promise<void> {
  await db.insert(gameAttemptGuesses).values({
    attemptId,
    setPlayerId,
    guessedText,
    matchedScore: score,
  });
}

export async function resetAttempt(attemptId: string, userId: string): Promise<boolean> {
  const [attempt] = await db
    .select()
    .from(gameAttempts)
    .where(and(eq(gameAttempts.id, attemptId), eq(gameAttempts.userId, userId)))
    .limit(1);
  if (!attempt) return false;

  await db.delete(gameAttemptGuesses).where(eq(gameAttemptGuesses.attemptId, attemptId));
  await db
    .update(gameAttempts)
    .set({
      status: "in_progress",
      completedAt: null,
      guessesCount: 0,
      updatedAt: new Date(),
    })
    .where(eq(gameAttempts.id, attemptId));

  return true;
}

export async function abandonAttempt(attemptId: string, userId: string): Promise<boolean> {
  const [attempt] = await db
    .select()
    .from(gameAttempts)
    .where(and(eq(gameAttempts.id, attemptId), eq(gameAttempts.userId, userId)))
    .limit(1);
  if (!attempt) return false;

  await db
    .update(gameAttempts)
    .set({
      status: "abandoned",
      updatedAt: new Date(),
    })
    .where(eq(gameAttempts.id, attemptId));

  return true;
}

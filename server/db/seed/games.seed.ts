/**
 * Seed idempotente para o módulo de jogos históricos.
 * Corinthians 2005 — Brasileirão (4º título)
 * Treinador: Antônio Lopes (guardado em metadata do set)
 */
import "dotenv/config";
import { db } from "../../db";
import { gameSets, gameSetPlayers } from "@shared/schema";
import { eq } from "drizzle-orm";

const SLUG = "corinthians-2005-brasileirao";

function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[.,\-']/g, "")
    .replace(/\s+/g, " ");
}

const CORINTHIANS_2005_PLAYERS: Array<{ jerseyNumber: number | null; displayName: string }> = [
  { jerseyNumber: 1, displayName: "Fábio Costa" },
  { jerseyNumber: 2, displayName: "Edson Sitta" },
  { jerseyNumber: 3, displayName: "Anderson" },
  { jerseyNumber: 4, displayName: "Gustavo Nery" },
  { jerseyNumber: 5, displayName: "Marcelo Mattos" },
  { jerseyNumber: 6, displayName: "Sebá" },
  { jerseyNumber: 7, displayName: "Roger" },
  { jerseyNumber: 8, displayName: "Rosinei" },
  { jerseyNumber: 9, displayName: "Nilmar" },
  { jerseyNumber: 10, displayName: "Tévez" },
  { jerseyNumber: 11, displayName: "Gil" },
  { jerseyNumber: 12, displayName: "Tiago" },
  { jerseyNumber: 13, displayName: "Marinho" },
  { jerseyNumber: 14, displayName: "Coelho" },
  { jerseyNumber: 15, displayName: "Wendel" },
  { jerseyNumber: 16, displayName: "Betão" },
  { jerseyNumber: 17, displayName: "Dinélson" },
  { jerseyNumber: 18, displayName: "Bobô" },
  { jerseyNumber: 19, displayName: "Carlos Alberto" },
  { jerseyNumber: 20, displayName: "Élton" },
  { jerseyNumber: 21, displayName: "Hugo" },
  { jerseyNumber: 22, displayName: "Júlio César" },
  { jerseyNumber: 23, displayName: "Marquinhos Silva" },
  { jerseyNumber: 24, displayName: "Marcus Vinicius" },
  { jerseyNumber: 26, displayName: "Fininho" },
  { jerseyNumber: 27, displayName: "Bruno Octávio" },
  { jerseyNumber: 29, displayName: "Fabrício" },
  { jerseyNumber: 30, displayName: "Jô" },
  { jerseyNumber: 32, displayName: "Wilson" },
  { jerseyNumber: 33, displayName: "Ronny" },
  { jerseyNumber: 34, displayName: "Ji-Paraná" },
  { jerseyNumber: 35, displayName: "Abuda" },
  { jerseyNumber: 37, displayName: "Nilton" },
  { jerseyNumber: 40, displayName: "Marcelo" },
  { jerseyNumber: 41, displayName: "Wescley" },
  { jerseyNumber: 42, displayName: "Eduardo Ratinho" },
  { jerseyNumber: 43, displayName: "Mascherano" },
];

export async function seedGames(): Promise<{ seeded: boolean; setId: string }> {
  const [existing] = await db.select().from(gameSets).where(eq(gameSets.slug, SLUG)).limit(1);

  let setId: string;
  let wasNew = false;

  if (existing) {
    setId = existing.id;
    // Apagar apenas os players deste set (não mexer em outros sets)
    await db.delete(gameSetPlayers).where(eq(gameSetPlayers.setId, setId));
    console.log(`[games.seed] Set "${SLUG}" já existia. Recriando ${CORINTHIANS_2005_PLAYERS.length} jogadores.`);
  } else {
    const [set] = await db
      .insert(gameSets)
      .values({
        slug: SLUG,
        title: "Corinthians — Brasileirão 2005 (Campeão)",
        season: 2005,
        competition: "Campeonato Brasileiro",
        clubName: "Corinthians",
        metadata: { coach: "Antônio Lopes", source: "seed" },
      })
      .returning();

    if (!set) throw new Error("Failed to create game set");
    setId = set.id;
    wasNew = true;
    console.log(`[games.seed] Set "${SLUG}" criado.`);
  }

  const playersToInsert = CORINTHIANS_2005_PLAYERS.map((p, i) => ({
    setId,
    jerseyNumber: p.jerseyNumber,
    displayName: p.displayName,
    normalizedName: normalizeName(p.displayName),
    aliases: p.displayName === "Tévez" ? ["tevez", "tevez carlos"] : undefined,
    sortOrder: i + 1,
  }));

  await db.insert(gameSetPlayers).values(playersToInsert);
  console.log(`[games.seed] ${playersToInsert.length} jogadores inseridos.`);
  return { seeded: wasNew, setId };
}

export async function runGamesSeed(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }
  await seedGames();
}

// Executar quando o script é rodado diretamente (npx tsx server/db/seed/games.seed.ts)
const isMain = process.argv[1]?.includes("games.seed");
if (isMain) {
  runGamesSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

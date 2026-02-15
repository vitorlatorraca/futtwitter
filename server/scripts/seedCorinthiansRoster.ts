#!/usr/bin/env npx tsx
/**
 * Seed idempotente do elenco completo do Corinthians.
 * Upsert por (teamId, name, birthDate) — sem duplicar jogadores.
 *
 * Run: npx tsx server/scripts/seedCorinthiansRoster.ts
 * Ou: npm run seed:corinthians
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { players, teams, transferRumors } from "@shared/schema";
import { eq, or, ilike, and } from "drizzle-orm";
import { TEAMS_DATA } from "../teams-data";
import { slugify } from "@shared/player-sector";

// ============================================
// HELPERS
// ============================================

/** Normaliza nome: lowerCase, remove acentos, remove espaços duplos e pontuação */
function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Mapeamento posição abreviada -> código primário */
const POSITION_MAP: Record<string, string> = {
  GK: "GK",
  DC: "CB",
  CB: "CB",
  DR: "RB",
  RB: "RB",
  DL: "LB",
  LB: "LB",
  MC: "CM",
  CM: "CM",
  DM: "DM",
  AM: "AM",
  RW: "W",
  LW: "W",
  W: "W",
  ST: "ST",
  CF: "ST",
  MR: "RM",
  ML: "LM",
};

/** Prioridade para escolher positionPrimary */
const POSITION_PRIORITY = ["GK", "ST", "CF", "AM", "DM", "CM", "MC", "W", "RW", "LW", "CB", "DC", "RB", "DR", "LB", "DL"];

/** positionPrimary -> sector (GK/DEF/MID/FWD) */
function positionToSector(positionPrimary: string): "GK" | "DEF" | "MID" | "FWD" {
  const p = positionPrimary.toUpperCase();
  if (p === "GK") return "GK";
  if (["CB", "DC", "RB", "DR", "LB", "DL", "WB"].includes(p)) return "DEF";
  if (["DM", "CM", "MC", "AM", "W", "RW", "LW", "RM", "LM"].includes(p)) return "MID";
  if (["ST", "CF"].includes(p)) return "FWD";
  return "MID";
}

/** positionPrimary -> position (texto legível para schema) */
function positionPrimaryToDisplay(primary: string): string {
  const map: Record<string, string> = {
    GK: "Goalkeeper",
    CB: "Centre-Back",
    DC: "Centre-Back",
    RB: "Right-Back",
    DR: "Right-Back",
    LB: "Left-Back",
    DL: "Left-Back",
    DM: "Defensive Midfield",
    CM: "Central Midfield",
    MC: "Central Midfield",
    AM: "Attacking Midfield",
    W: "Right Winger",
    RW: "Right Winger",
    LW: "Left Winger",
    ST: "Centre-Forward",
    CF: "Centre-Forward",
  };
  return map[primary] ?? "Central Midfield";
}

interface ParsedPositions {
  position: string;
  primaryPosition: string;
  secondaryPositions: string | null;
  sector: "GK" | "DEF" | "MID" | "FWD";
}

function parsePositions(positionsRaw: string): ParsedPositions {
  const parts = positionsRaw
    .split(/[,/]/)
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
  const normalized = parts.map((p) => POSITION_MAP[p] ?? p);
  const primary =
    POSITION_PRIORITY.find((pr) => normalized.includes(pr)) ?? normalized[0] ?? "CM";
  const sector = positionToSector(primary);
  const secondary = normalized.filter((p) => p !== primary);
  return {
    position: positionPrimaryToDisplay(primary),
    primaryPosition: primary,
    secondaryPositions: secondary.length > 0 ? secondary.join(", ") : null,
    sector,
  };
}

/** Código país 3 letras -> nome completo */
const NATIONALITY_MAP: Record<string, string> = {
  BRA: "Brazil",
  NED: "Netherlands",
  ARG: "Argentina",
  PER: "Peru",
  VEN: "Venezuela",
  URU: "Uruguay",
};

function expandNationality(code: string): string {
  return NATIONALITY_MAP[code.toUpperCase()] ?? code;
}

// ============================================
// ROSTER DATA (34 jogadores)
// ============================================

type RosterInput = {
  shirtNumber: number | null;
  name: string;
  positionsRaw: string;
  nationality: string;
  heightCm: number;
  dateOfBirth: string;
  age: number;
};

const ROSTER: RosterInput[] = [
  // Forward (FWD)
  { shirtNumber: 10, name: "Memphis Depay", positionsRaw: "ST", nationality: "NED", heightCm: 176, dateOfBirth: "1994-02-13", age: 32 },
  { shirtNumber: 9, name: "Yuri Alberto", positionsRaw: "ST", nationality: "BRA", heightCm: 183, dateOfBirth: "2001-03-18", age: 24 },
  { shirtNumber: 18, name: "Pedro Raul", positionsRaw: "ST", nationality: "BRA", heightCm: 191, dateOfBirth: "1996-11-05", age: 29 },
  { shirtNumber: 56, name: "Gui Negão", positionsRaw: "ST", nationality: "BRA", heightCm: 179, dateOfBirth: "2007-02-06", age: 19 },
  { shirtNumber: 11, name: "Vitinho", positionsRaw: "LW, AM, ST", nationality: "BRA", heightCm: 178, dateOfBirth: "1993-10-09", age: 32 },
  { shirtNumber: 31, name: "Kayke Ferrari", positionsRaw: "LW", nationality: "BRA", heightCm: 179, dateOfBirth: "2004-04-28", age: 21 },
  // Midfielder (MID)
  { shirtNumber: 8, name: "Rodrigo Garro", positionsRaw: "AM", nationality: "ARG", heightCm: 174, dateOfBirth: "1998-01-04", age: 28 },
  { shirtNumber: 19, name: "André Carrillo", positionsRaw: "MC", nationality: "PER", heightCm: 180, dateOfBirth: "1991-06-14", age: 34 },
  { shirtNumber: 7, name: "Breno Bidon", positionsRaw: "MC, DM", nationality: "BRA", heightCm: 174, dateOfBirth: "2005-02-20", age: 20 },
  { shirtNumber: 70, name: "José Martínez", positionsRaw: "MC, DM", nationality: "VEN", heightCm: 177, dateOfBirth: "1994-08-07", age: 31 },
  { shirtNumber: 14, name: "Raniele", positionsRaw: "MC, DM", nationality: "BRA", heightCm: 184, dateOfBirth: "1996-12-31", age: 29 },
  { shirtNumber: 29, name: "Allan", positionsRaw: "MC, DM", nationality: "BRA", heightCm: 172, dateOfBirth: "1997-03-03", age: 28 },
  { shirtNumber: 37, name: "Kaio César", positionsRaw: "RW", nationality: "BRA", heightCm: 168, dateOfBirth: "2004-02-15", age: 22 },
  { shirtNumber: 35, name: "Charles", positionsRaw: "MC, DM", nationality: "BRA", heightCm: 187, dateOfBirth: "1996-06-19", age: 29 },
  { shirtNumber: 23, name: "Matheus Pereira", positionsRaw: "MC, DM", nationality: "BRA", heightCm: 181, dateOfBirth: "1998-02-25", age: 27 },
  { shirtNumber: 80, name: "Alex Santana", positionsRaw: "MC, DM", nationality: "BRA", heightCm: 182, dateOfBirth: "1995-05-13", age: 30 },
  { shirtNumber: 61, name: "Dieguinho", positionsRaw: "RW", nationality: "BRA", heightCm: 170, dateOfBirth: "2007-09-16", age: 18 },
  { shirtNumber: 49, name: "André Luiz", positionsRaw: "MC", nationality: "BRA", heightCm: 181, dateOfBirth: "2006-06-20", age: 19 },
  { shirtNumber: 54, name: "Bahia", positionsRaw: "MC", nationality: "BRA", heightCm: 178, dateOfBirth: "2006-01-02", age: 20 },
  // Defender (DEF)
  { shirtNumber: 2, name: "Matheuzinho", positionsRaw: "DR, MR", nationality: "BRA", heightCm: 171, dateOfBirth: "2000-09-08", age: 25 },
  { shirtNumber: 21, name: "Matheus Bidu", positionsRaw: "DL, ML", nationality: "BRA", heightCm: 172, dateOfBirth: "1999-05-04", age: 26 },
  { shirtNumber: 13, name: "Gustavo Henrique", positionsRaw: "DC", nationality: "BRA", heightCm: 195, dateOfBirth: "1993-03-24", age: 32 },
  { shirtNumber: 5, name: "André Ramalho", positionsRaw: "DC", nationality: "BRA", heightCm: 182, dateOfBirth: "1992-02-16", age: 33 },
  { shirtNumber: 3, name: "Gabriel Paulista", positionsRaw: "DC", nationality: "BRA", heightCm: 187, dateOfBirth: "1990-11-26", age: 35 },
  { shirtNumber: null, name: "Fabrizio Angileri", positionsRaw: "DL", nationality: "ARG", heightCm: 185, dateOfBirth: "1994-03-15", age: 31 },
  { shirtNumber: 25, name: "Cacá", positionsRaw: "DC, DR", nationality: "BRA", heightCm: 185, dateOfBirth: "1999-04-25", age: 26 },
  { shirtNumber: 4, name: "João Pedro Tchoca", positionsRaw: "DC", nationality: "BRA", heightCm: 192, dateOfBirth: "2003-12-31", age: 22 },
  { shirtNumber: 46, name: "Hugo", positionsRaw: "DL", nationality: "BRA", heightCm: 179, dateOfBirth: "1997-08-29", age: 28 },
  { shirtNumber: 20, name: "Pedro Milans", positionsRaw: "DR", nationality: "URU", heightCm: 171, dateOfBirth: "2002-03-24", age: 23 },
  { shirtNumber: null, name: "Renato Santos", positionsRaw: "DC", nationality: "BRA", heightCm: 188, dateOfBirth: "2004-10-11", age: 21 },
  // Goalkeeper (GK)
  { shirtNumber: 1, name: "Hugo Souza", positionsRaw: "GK", nationality: "BRA", heightCm: 199, dateOfBirth: "1999-01-31", age: 27 },
  { shirtNumber: 32, name: "Matheus Donelli", positionsRaw: "GK", nationality: "BRA", heightCm: 187, dateOfBirth: "2002-05-17", age: 23 },
  { shirtNumber: 40, name: "Felipe Longo", positionsRaw: "GK", nationality: "BRA", heightCm: 189, dateOfBirth: "2005-03-05", age: 20 },
  { shirtNumber: 51, name: "Kauê", positionsRaw: "GK", nationality: "BRA", heightCm: 190, dateOfBirth: "2004-02-08", age: 22 },
];

// Renato Santos: shirtNumber null para evitar conflito com Gustavo Henrique (ambos 13)

/** Mapeamento nome antigo -> nome novo (para migrar dados de seeds anteriores) */
const NAME_MIGRATIONS: Array<{ oldName: string; newName: string; birthDate: string }> = [
  { oldName: "Tchoca", newName: "João Pedro Tchoca", birthDate: "2003-12-31" },
  { oldName: "André", newName: "André Luiz", birthDate: "2006-06-20" },
  { oldName: "Kayke", newName: "Kayke Ferrari", birthDate: "2004-04-28" },
];

// ============================================
// SEED
// ============================================

async function getOrCreateCorinthiansTeamId(): Promise<string> {
  const [existing] = await db
    .select()
    .from(teams)
    .where(or(eq(teams.id, "corinthians"), ilike(teams.name, "%Corinthians%")))
    .limit(1);

  if (existing) return existing.id;

  const base = TEAMS_DATA.find((t) => t.id === "corinthians");
  await db.insert(teams).values({
    id: "corinthians",
    name: base?.name ?? "Corinthians",
    shortName: base?.shortName ?? "COR",
    logoUrl: base?.logoUrl ?? "https://logodetimes.com/corinthians.png",
    primaryColor: base?.primaryColor ?? "#000000",
    secondaryColor: base?.secondaryColor ?? "#FFFFFF",
  });

  return "corinthians";
}

async function seed() {
  console.log("🌱 Seed Corinthians Roster (idempotente)...\n");

  const teamId = await getOrCreateCorinthiansTeamId();
  console.log(`  Time: Corinthians (id=${teamId})\n`);

  const now = new Date();

  await db.transaction(async (tx) => {
    // Migrar nomes antigos para evitar duplicatas (Tchoca -> João Pedro Tchoca, etc.)
    for (const m of NAME_MIGRATIONS) {
      await tx
        .update(players)
        .set({ name: m.newName, updatedAt: now })
        .where(
          and(
            eq(players.teamId, teamId),
            eq(players.name, m.oldName),
            eq(players.birthDate, m.birthDate)
          )
        );
    }

    for (const p of ROSTER) {
      const parsed = parsePositions(p.positionsRaw);
      const nationalityFull = expandNationality(p.nationality);
      const slug = slugify(p.name);

      await tx
        .insert(players)
        .values({
          teamId,
          shirtNumber: p.shirtNumber,
          name: p.name,
          fullName: p.name,
          position: parsed.position,
          birthDate: p.dateOfBirth,
          nationalityPrimary: nationalityFull,
          primaryPosition: parsed.primaryPosition,
          secondaryPositions: parsed.secondaryPositions,
          sector: parsed.sector,
          heightCm: p.heightCm,
          slug,
        })
        .onConflictDoUpdate({
          target: [players.teamId, players.name, players.birthDate],
          set: {
            shirtNumber: p.shirtNumber,
            position: parsed.position,
            primaryPosition: parsed.primaryPosition,
            secondaryPositions: parsed.secondaryPositions,
            sector: parsed.sector,
            nationalityPrimary: nationalityFull,
            heightCm: p.heightCm,
            slug,
            updatedAt: now,
          },
        });
    }

    // Remover jogadores fora do roster (ex: Léo Mana de seeds antigos) — exceto os referenciados por transfer_rumors
    const rosterKeys = new Set(ROSTER.map((p) => `${p.name}|${p.dateOfBirth}`));
    const existingPlayers = await tx
      .select({ id: players.id, name: players.name, birthDate: players.birthDate })
      .from(players)
      .where(eq(players.teamId, teamId));

    const referencedIds = await tx
      .selectDistinct({ playerId: transferRumors.playerId })
      .from(transferRumors);
    const referencedSet = new Set(referencedIds.map((r) => r.playerId).filter(Boolean));

    for (const ep of existingPlayers) {
      const key = `${ep.name}|${ep.birthDate}`;
      if (!rosterKeys.has(key) && !referencedSet.has(ep.id)) {
        await tx.delete(players).where(eq(players.id, ep.id));
      }
    }
  });

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(players)
    .where(eq(players.teamId, teamId));

  console.log(`  ✓ Upsert concluído: ${ROSTER.length} jogadores processados`);
  console.log(`  ✓ Total no banco (teamId=corinthians): ${total}`);
  if (total !== ROSTER.length) {
    console.warn(`  ⚠️  Esperado ${ROSTER.length} jogadores. Verifique duplicatas ou jogadores de outros seeds.`);
  }
  console.log("\n✅ Seed Corinthians Roster concluído.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });

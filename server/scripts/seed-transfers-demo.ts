/**
 * Seed demo transfers for "Vai e Vem" page.
 * Idempotent: clears existing transfers and re-inserts demo data.
 *
 * Run: npx tsx server/scripts/seed-transfers-demo.ts
 *
 * Ensure teams exist first (npm run dev seeds them automatically).
 */
import "dotenv/config";
import { db } from "../db";
import { transfers, transferVotes, teams } from "@shared/schema";
import { eq } from "drizzle-orm";
import { TEAMS_DATA } from "../teams-data";

const DEMO_TRANSFERS = [
  { playerName: "Rodrigo Garro", positionAbbrev: "MEI", from: "corinthians", to: "sao-paulo", status: "RUMOR" as const, feeText: "€3M", notes: "Rumor de saída após temporada" },
  { playerName: "Yuri Alberto", positionAbbrev: "ATA", from: "corinthians", to: "flamengo", status: "NEGOCIACAO" as const, feeText: "€15M", notes: "Acordo avançado entre clubes" },
  { playerName: "Matheus Bidu", positionAbbrev: "LE", from: "corinthians", to: "palmeiras", status: "FECHADO" as const, feeText: "Empréstimo", notes: "Confirmado até fim da temporada" },
  { playerName: "Hugo Souza", positionAbbrev: "GOL", from: "flamengo", to: "corinthians", status: "FECHADO" as const, feeText: "Empréstimo", notes: "Goleiro confirmado" },
  { playerName: "Gabriel Veron", positionAbbrev: "ATA", from: "palmeiras", to: "bragantino", status: "RUMOR" as const, feeText: "€8M", notes: "Interesse do RB" },
  { playerName: "Danilo", positionAbbrev: "VOL", from: "palmeiras", to: "internacional", status: "NEGOCIACAO" as const, feeText: "€12M", notes: "Em negociação avançada" },
  { playerName: "De La Cruz", positionAbbrev: "MEI", from: "flamengo", to: "bragantino", status: "RUMOR" as const, feeText: "€20M", notes: "Interesse do RB" },
  { playerName: "Luiz Araújo", positionAbbrev: "ATA", from: "sao-paulo", to: "corinthians", status: "RUMOR" as const, feeText: "Grátis", notes: "Contrato acabando" },
  { playerName: "Gustavo Henrique", positionAbbrev: "ZAG", from: "corinthians", to: "santos", status: "NEGOCIACAO" as const, feeText: "Empréstimo", notes: "Retorno ao Peixe" },
  { playerName: "Bruno Henrique", positionAbbrev: "ATA", from: "flamengo", to: "bahia", status: "RUMOR" as const, feeText: "€2M", notes: "Proposta do Bahia" },
  { playerName: "André Ramalho", positionAbbrev: "ZAG", from: "corinthians", to: "palmeiras", status: "FECHADO" as const, feeText: "€1.5M", notes: "Transferência confirmada" },
  { playerName: "Marcos Leonardo", positionAbbrev: "ATA", from: "santos", to: "corinthians", status: "RUMOR" as const, feeText: "€10M", notes: "Interesse do Timão" },
  { playerName: "Rafael Veiga", positionAbbrev: "MEI", from: "palmeiras", to: "atletico-mineiro", status: "RUMOR" as const, feeText: "€25M", notes: "Galo quer reforço" },
  { playerName: "Edenilson", positionAbbrev: "MEI", from: "internacional", to: "gremio", status: "RUMOR" as const, feeText: "Free", notes: "Polêmica gre-nal" },
  { playerName: "Matheuzinho", positionAbbrev: "LD", from: "corinthians", to: "flamengo", status: "NEGOCIACAO" as const, feeText: "€5M", notes: "Retorno ao Mengão" },
  { playerName: "Guilherme Arana", positionAbbrev: "LE", from: "atletico-mineiro", to: "corinthians", status: "RUMOR" as const, feeText: "€6M", notes: "Timão busca lateral" },
  { playerName: "Gabriel Barbosa", positionAbbrev: "ATA", from: "flamengo", to: "santos", status: "RUMOR" as const, feeText: "Empréstimo", notes: "Retorno ao Peixe?" },
];

const PLACEHOLDER_PHOTO = "/assets/players/placeholder.png";

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

async function seed() {
  console.log("Seeding transfers demo...");

  // Ensure teams exist
  const existingTeams = await db.select({ id: teams.id }).from(teams);
  const teamIds = new Set(existingTeams.map((t) => t.id));
  if (teamIds.size === 0) {
    console.log("No teams found. Run dev server first to auto-seed teams.");
    const { storage } = await import("../storage");
    await storage.seedTeamsIfEmpty();
    const after = await db.select({ id: teams.id }).from(teams);
    after.forEach((t) => teamIds.add(t.id));
  }

  // Idempotent: delete all transfers (and votes via cascade)
  await db.delete(transferVotes);
  await db.delete(transfers);

  const teamIdSet = new Set(TEAMS_DATA.map((t) => t.id));
  let inserted = 0;

  for (let i = 0; i < DEMO_TRANSFERS.length; i++) {
    const t = DEMO_TRANSFERS[i];
    const fromId = teamIdSet.has(t.from) ? t.from : null;
    const toIdFinal = teamIdSet.has(t.to) ? t.to : null;

    if (!fromId && !toIdFinal) continue;

    const updatedAt = addDays(new Date(), -i);
    await db.insert(transfers).values({
      playerName: t.playerName,
      playerPhotoUrl: PLACEHOLDER_PHOTO,
      positionAbbrev: t.positionAbbrev,
      fromTeamId: fromId,
      toTeamId: toIdFinal,
      status: t.status,
      updatedAt,
      feeText: t.feeText,
      notes: t.notes,
      sourceLabel: "Demo",
    });
    inserted++;
  }

  console.log(`Done. Seeded ${inserted} demo transfers.`);
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

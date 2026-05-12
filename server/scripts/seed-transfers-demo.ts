/**
 * Seed demo transfers for "Vai e Vem" page.
 * Idempotent: clears existing transfers and re-inserts demo data.
 *
 * Run: npx tsx server/scripts/seed-transfers-demo.ts
 * Or: npm run seed:transfers
 *
 * Ensure teams and at least one journalist exist first (npm run dev seeds them).
 */
import "dotenv/config";
import { db } from "../db";
import { transfers, transferVotes, teams, users, journalists } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
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

  // Get or create journalist for createdByJournalistId
  let journalistId: string | null = null;
  const journalistUser = await db
    .select()
    .from(users)
    .where(eq(users.email, "jornalista@brasileirao.com"))
    .limit(1);
  if (journalistUser.length > 0) {
    const j = await db
      .select({ id: journalists.id })
      .from(journalists)
      .where(eq(journalists.userId, journalistUser[0].id))
      .limit(1);
    if (j.length > 0) journalistId = j[0].id;
    else {
      // User exists but journalist record missing - create it
      const [jj] = await db
        .insert(journalists)
        .values({
          userId: journalistUser[0].id,
          organization: "Brasileirão News",
          professionalId: "BR-JOR-001",
          status: "APPROVED",
          verificationDate: new Date(),
        })
        .returning();
      journalistId = jj.id;
      console.log("  ✓ Created journalist record for Maria Silva");
    }
  }
  if (!journalistId) {
    console.log("Creating demo journalist for transfers...");
    const hashedPassword = await bcrypt.hash("senha123", 10);
    const [ju] = await db
      .insert(users)
      .values({
        name: "Maria Silva",
        email: "jornalista@brasileirao.com",
        password: hashedPassword,
        teamId: "flamengo",
        userType: "JOURNALIST",
      })
      .returning();
    const [jj] = await db
      .insert(journalists)
      .values({
        userId: ju.id,
        organization: "Brasileirão News",
        professionalId: "BR-JOR-001",
        status: "APPROVED",
        verificationDate: new Date(),
      })
      .returning();
    journalistId = jj.id;
    console.log("  ✓ Created journalist Maria Silva");
  }

  // Idempotent: delete all transfers (votes cascade)
  await db.delete(transferVotes);
  await db.delete(transfers);

  const teamIdSet = new Set(TEAMS_DATA.map((t) => t.id));
  const insertedTransfers: { id: string; fromTeamId: string | null; toTeamId: string | null }[] = [];

  for (let i = 0; i < DEMO_TRANSFERS.length; i++) {
    const t = DEMO_TRANSFERS[i];
    const fromId = teamIdSet.has(t.from) ? t.from : null;
    const toIdFinal = teamIdSet.has(t.to) ? t.to : null;

    if (!fromId && !toIdFinal) continue;

    const updatedAt = addDays(new Date(), -i);
    const [row] = await db
      .insert(transfers)
      .values({
        playerName: t.playerName,
        playerPhotoUrl: PLACEHOLDER_PHOTO,
        positionAbbrev: t.positionAbbrev,
        fromTeamId: fromId,
        toTeamId: toIdFinal,
        status: t.status,
        createdByJournalistId: journalistId,
        updatedAt,
        feeText: t.feeText,
        notes: t.notes,
        sourceLabel: "Demo",
      })
      .returning();
    if (row) insertedTransfers.push({ id: row.id, fromTeamId: fromId, toTeamId: toIdFinal });
  }

  // Seed some votes (SELLING and BUYING) - need users with teamId
  const fansWithTeam = await db
    .select({ id: users.id, teamId: users.teamId })
    .from(users)
    .where(eq(users.userType, "FAN"));
  const fanByTeam = new Map<string, string>();
  for (const f of fansWithTeam) {
    if (f.teamId && !fanByTeam.has(f.teamId)) fanByTeam.set(f.teamId, f.id);
  }

  // Ensure we have at least corinthians and flamengo fans for demo votes
  const corinthiansFan = fanByTeam.get("corinthians");
  const flamengoFan = fanByTeam.get("flamengo");
  const palmeirasFan = fanByTeam.get("palmeiras");
  const saoPauloFan = fanByTeam.get("sao-paulo");

  let votesInserted = 0;
  for (const tr of insertedTransfers.slice(0, 8)) {
    // SELLING votes: fromTeam fans
    if (tr.fromTeamId) {
      const voterId = fanByTeam.get(tr.fromTeamId);
      if (voterId) {
        await db.insert(transferVotes).values({
          transferId: tr.id,
          userId: voterId,
          side: "SELLING",
          vote: Math.random() > 0.5 ? "LIKE" : "DISLIKE",
        });
        votesInserted++;
      }
    }
    // BUYING votes: toTeam fans
    if (tr.toTeamId) {
      const voterId = fanByTeam.get(tr.toTeamId);
      if (voterId) {
        await db.insert(transferVotes).values({
          transferId: tr.id,
          userId: voterId,
          side: "BUYING",
          vote: Math.random() > 0.5 ? "LIKE" : "DISLIKE",
        });
        votesInserted++;
      }
    }
  }

  console.log(`Done. Seeded ${insertedTransfers.length} transfers, ${votesInserted} votes.`);
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

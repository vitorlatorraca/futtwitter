/**
 * Seed demo transfer_rumors (Vai e Vem) para a página de rumores/negociações.
 * Idempotent: limpa transfer_rumors e re-insere dados demo.
 *
 * Run: npx tsx server/scripts/seed-transfer-rumors-demo.ts
 * Ou: npm run seed:transfer-rumors
 *
 * Pré-requisitos: times e jogadores (npm run seed:corinthians, npm run dev).
 */
import "dotenv/config";
import { db } from "../db";
import {
  transferRumors,
  transferRumorVotes,
  transferRumorComments,
  users,
  journalists,
  teams,
  players,
} from "@shared/schema";
import { eq, and, ilike } from "drizzle-orm";
import bcrypt from "bcrypt";
import { TEAMS_DATA } from "../teams-data";

const CORINTHIANS_ID = "corinthians";

type RumorInput = {
  playerName: string;
  fromTeamSlug: string;
  toTeamSlug: string;
  status: "RUMOR" | "NEGOTIATING" | "DONE" | "CANCELLED";
  feeAmount?: string;
  feeCurrency?: string;
  sourceName?: string;
  sourceUrl?: string;
};

const DEMO_RUMORS: RumorInput[] = [
  { playerName: "Rodrigo Garro", fromTeamSlug: "corinthians", toTeamSlug: "sao-paulo", status: "RUMOR", feeAmount: "3", feeCurrency: "EUR", sourceName: "GE" },
  { playerName: "Yuri Alberto", fromTeamSlug: "corinthians", toTeamSlug: "flamengo", status: "NEGOTIATING", feeAmount: "15", feeCurrency: "EUR", sourceName: "Fabrizio Romano" },
  { playerName: "Matheus Bidu", fromTeamSlug: "corinthians", toTeamSlug: "palmeiras", status: "DONE", feeAmount: "0", feeCurrency: "BRL", sourceName: "UOL" },
  { playerName: "Hugo Souza", fromTeamSlug: "flamengo", toTeamSlug: "corinthians", status: "DONE", feeAmount: "0", feeCurrency: "BRL", sourceName: "GE" },
  { playerName: "Gabriel Veron", fromTeamSlug: "palmeiras", toTeamSlug: "bragantino", status: "RUMOR", feeAmount: "8", feeCurrency: "EUR", sourceName: "UOL" },
  { playerName: "Luiz Araújo", fromTeamSlug: "sao-paulo", toTeamSlug: "corinthians", status: "RUMOR", feeAmount: "0", feeCurrency: "BRL", sourceName: "GE" },
  { playerName: "Gustavo Henrique", fromTeamSlug: "corinthians", toTeamSlug: "santos", status: "NEGOTIATING", feeAmount: "0", feeCurrency: "BRL", sourceName: "UOL" },
  { playerName: "Marcos Leonardo", fromTeamSlug: "santos", toTeamSlug: "corinthians", status: "RUMOR", feeAmount: "10", feeCurrency: "EUR", sourceName: "Fabrizio Romano" },
  { playerName: "Matheuzinho", fromTeamSlug: "corinthians", toTeamSlug: "flamengo", status: "NEGOTIATING", feeAmount: "5", feeCurrency: "EUR", sourceName: "GE" },
  { playerName: "Guilherme Arana", fromTeamSlug: "atletico-mineiro", toTeamSlug: "corinthians", status: "RUMOR", feeAmount: "6", feeCurrency: "EUR", sourceName: "UOL" },
];

const DEMO_COMMENTS = [
  "Boa contratação!",
  "Não acredito nesse rumor.",
  "Se fechar, vai ser ótimo pro time.",
  "Valor muito alto.",
  "Jogador em baixa, melhor vender.",
  "Torcida vai gostar dessa.",
  "Rumor antigo, já passou.",
  "Fonte confiável?",
  "Espero que feche logo.",
  "Melhor opção do mercado.",
  "Não faz sentido.",
  "Vamos ver no que dá.",
  "Bom negócio para os dois times.",
  "Jogador quer sair.",
  "Contrato até 2027.",
  "Empréstimo com opção de compra.",
  "Acordo entre as partes.",
  "Fechado!",
  "Desistiu da negociação.",
  "Outro time entrou na disputa.",
];

async function ensureTeams(): Promise<Map<string, string>> {
  const existing = await db.select({ id: teams.id }).from(teams);
  const map = new Map<string, string>();
  for (const t of existing) map.set(t.id, t.id);
  if (map.size === 0) {
    const { storage } = await import("../storage");
    await storage.seedTeamsIfEmpty();
    const after = await db.select({ id: teams.id }).from(teams);
    after.forEach((t) => map.set(t.id, t.id));
  }
  return map;
}

async function getOrCreatePlayer(
  teamId: string,
  name: string,
  position: string
): Promise<string> {
  const [existing] = await db
    .select({ id: players.id })
    .from(players)
    .where(and(eq(players.teamId, teamId), ilike(players.name, `%${name.split(" ")[0]}%`)))
    .limit(1);
  if (existing) return existing.id;

  const [fallback] = await db
    .select({ id: players.id })
    .from(players)
    .where(eq(players.teamId, teamId))
    .limit(1);
  if (fallback) return fallback.id;

  const [inserted] = await db
    .insert(players)
    .values({
      teamId,
      name,
      fullName: name,
      position,
      birthDate: "1995-01-01",
      nationalityPrimary: "Brazil",
    })
    .returning({ id: players.id });
  return inserted!.id;
}

async function ensureJournalists(): Promise<string[]> {
  const journalistEmails = [
    "jornalista1@vaievem.com",
    "jornalista2@vaievem.com",
    "jornalista3@vaievem.com",
  ];
  const names = ["Maria Silva", "João Santos", "Ana Costa"];
  const ids: string[] = [];

  for (let i = 0; i < journalistEmails.length; i++) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, journalistEmails[i]))
      .limit(1);
    if (existing) {
      ids.push(existing.id);
      continue;
    }
    const hashedPassword = await bcrypt.hash("senha123", 10);
    const [u] = await db
      .insert(users)
      .values({
        name: names[i],
        email: journalistEmails[i],
        password: hashedPassword,
        userType: "JOURNALIST",
        teamId: CORINTHIANS_ID,
      })
      .returning({ id: users.id });
    if (u) {
      ids.push(u.id);
      const [j] = await db
        .select({ id: journalists.id })
        .from(journalists)
        .where(eq(journalists.userId, u.id))
        .limit(1);
      if (!j) {
        await db.insert(journalists).values({
          userId: u.id,
          organization: "Vai e Vem News",
          professionalId: `BR-JOR-${100 + i}`,
          status: "APPROVED",
          verificationDate: new Date(),
        });
      }
    }
  }
  return ids;
}

async function ensureFansByTeam(): Promise<Map<string, string[]>> {
  const fans = await db
    .select({ id: users.id, teamId: users.teamId })
    .from(users)
    .where(eq(users.userType, "FAN"));
  const byTeam = new Map<string, string[]>();
  for (const f of fans) {
    if (f.teamId) {
      const arr = byTeam.get(f.teamId) ?? [];
      arr.push(f.id);
      byTeam.set(f.teamId, arr);
    }
  }
  // Criar fans se não houver para times principais
  const teamIds = ["corinthians", "flamengo", "palmeiras", "sao-paulo", "santos", "atletico-mineiro", "bragantino"];
  for (const tid of teamIds) {
    if (!byTeam.has(tid) || byTeam.get(tid)!.length === 0) {
      const [u] = await db
        .insert(users)
        .values({
          name: `Torcedor ${tid}`,
          email: `fan-${tid}@vaievem.com`,
          password: await bcrypt.hash("senha123", 10),
          userType: "FAN",
          teamId: tid,
        })
        .returning({ id: users.id });
      if (u) {
        byTeam.set(tid, [u.id]);
      }
    }
  }
  return byTeam;
}

async function seed() {
  console.log("🌱 Seeding transfer_rumors (Vai e Vem)...\n");

  const teamMap = await ensureTeams();
  const journalistIds = await ensureJournalists();
  const fansByTeam = await ensureFansByTeam();

  if (journalistIds.length === 0) {
    console.error("Nenhum jornalista criado. Abortando.");
    process.exit(1);
  }

  // Limpar dados existentes (cascade remove votes e comments)
  await db.delete(transferRumorComments);
  await db.delete(transferRumorVotes);
  await db.delete(transferRumors);

  const insertedRumors: { id: string; fromTeamId: string; toTeamId: string }[] = [];

  for (let i = 0; i < DEMO_RUMORS.length; i++) {
    const r = DEMO_RUMORS[i];
    const fromId = teamMap.get(r.fromTeamSlug);
    const toId = teamMap.get(r.toTeamSlug);
    if (!fromId || !toId || fromId === toId) continue;

    const playerId = await getOrCreatePlayer(fromId, r.playerName, "MEI");
    const authorId = journalistIds[i % journalistIds.length];

    const [row] = await db
      .insert(transferRumors)
      .values({
        playerId,
        fromTeamId: fromId,
        toTeamId: toId,
        status: r.status,
        feeAmount: r.feeAmount ?? null,
        feeCurrency: r.feeCurrency ?? "BRL",
        sourceName: r.sourceName ?? null,
        sourceUrl: r.sourceUrl ?? null,
        createdByUserId: authorId,
      })
      .returning({ id: transferRumors.id, fromTeamId: transferRumors.fromTeamId, toTeamId: transferRumors.toTeamId });

    if (row) insertedRumors.push(row);
  }

  // Votos (20-40): SELLING = fromTeam fans, BUYING = toTeam fans
  let votesCount = 0;
  for (const rumor of insertedRumors) {
    const sellingFans = fansByTeam.get(rumor.fromTeamId) ?? [];
    const buyingFans = fansByTeam.get(rumor.toTeamId) ?? [];
    for (const uid of sellingFans.slice(0, 2)) {
      try {
        await db.insert(transferRumorVotes).values({
          rumorId: rumor.id,
          userId: uid,
          side: "SELLING",
          vote: Math.random() > 0.5 ? "LIKE" : "DISLIKE",
        });
        votesCount++;
      } catch {
        // unique violation - skip
      }
    }
    for (const uid of buyingFans.slice(0, 2)) {
      try {
        await db.insert(transferRumorVotes).values({
          rumorId: rumor.id,
          userId: uid,
          side: "BUYING",
          vote: Math.random() > 0.5 ? "LIKE" : "DISLIKE",
        });
        votesCount++;
      } catch {
        // unique violation - skip
      }
    }
  }

  // Comentários (10-30)
  const allUserIds = [...journalistIds];
  fansByTeam.forEach((arr) => allUserIds.push(...arr));
  const uniqueUserIds = [...new Set(allUserIds)];
  let commentsCount = 0;
  const numComments = Math.min(25, insertedRumors.length * 3);
  for (let i = 0; i < numComments; i++) {
    const rumor = insertedRumors[i % insertedRumors.length];
    const userId = uniqueUserIds[i % uniqueUserIds.length];
    const content = DEMO_COMMENTS[i % DEMO_COMMENTS.length];
    try {
      await db.insert(transferRumorComments).values({
        rumorId: rumor.id,
        userId,
        content,
      });
      commentsCount++;
    } catch (e) {
      console.warn("Comment insert skip:", e);
    }
  }

  console.log(`  ✓ ${insertedRumors.length} rumores`);
  console.log(`  ✓ ${votesCount} votos (SELLING/BUYING)`);
  console.log(`  ✓ ${commentsCount} comentários`);
  console.log("\n✅ Seed transfer_rumors concluído.");
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

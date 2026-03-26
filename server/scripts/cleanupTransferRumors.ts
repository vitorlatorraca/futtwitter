#!/usr/bin/env npx tsx
/**
 * Limpa transfer_rumors mantendo APENAS a negociação do Gabriel Paulista.
 * Segurança: backup antes de deletar, dry-run por padrão.
 *
 * Run:
 *   npx tsx server/scripts/cleanupTransferRumors.ts           # dry-run (default)
 *   npx tsx server/scripts/cleanupTransferRumors.ts --apply  # executa delete
 */
import "dotenv/config";
import { db } from "../db";
import {
  transferRumors,
  transferRumorVotes,
  transferRumorComments,
  players,
  teams,
  users,
} from "@shared/schema";
import { eq, and, ilike, inArray } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRESERVE_PLAYER_NAME = "Gabriel Paulista";
const BACKUPS_DIR = path.resolve(__dirname, "backups");
const BACKUP_PREFIX = "transfer-rumors-backup";

function parseArgs(): { apply: boolean } {
  const apply = process.argv.includes("--apply");
  return { apply };
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function timestamp(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}${m}${day}-${h}${min}`;
}

async function listAllRumors() {
  const rows = await db
    .select({
      id: transferRumors.id,
      playerId: transferRumors.playerId,
      fromTeamId: transferRumors.fromTeamId,
      toTeamId: transferRumors.toTeamId,
      status: transferRumors.status,
      createdAt: transferRumors.createdAt,
      createdByUserId: transferRumors.createdByUserId,
      playerName: players.name,
    })
    .from(transferRumors)
    .innerJoin(players, eq(transferRumors.playerId, players.id))
    .orderBy(transferRumors.createdAt);

  const teamIds = [...new Set(rows.flatMap((r) => [r.fromTeamId, r.toTeamId]))];
  const teamList =
    teamIds.length > 0
      ? await db.select({ id: teams.id, name: teams.name }).from(teams).where(inArray(teams.id, teamIds))
      : [];
  const teamMap = new Map(teamList.map((t) => [t.id, t.name]));

  const userIds = [...new Set(rows.map((r) => r.createdByUserId))];
  const userList =
    userIds.length > 0
      ? await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, userIds))
      : [];
  const userMap = new Map(userList.map((u) => [u.id, u.name]));

  return rows.map((r) => ({
    id: r.id,
    playerId: r.playerId,
    playerName: r.playerName,
    fromTeam: teamMap.get(r.fromTeamId) ?? r.fromTeamId,
    toTeam: teamMap.get(r.toTeamId) ?? r.toTeamId,
    status: r.status,
    createdAt: r.createdAt,
    createdByUserId: r.createdByUserId,
    createdByName: userMap.get(r.createdByUserId) ?? null,
  }));
}

function findPreserveId(rows: Awaited<ReturnType<typeof listAllRumors>>): string | null {
  const matches = rows.filter((r) =>
    r.playerName?.toLowerCase().includes(PRESERVE_PLAYER_NAME.toLowerCase())
  );
  if (matches.length === 0) return null;
  if (matches.length > 1) {
    console.warn(
      `⚠️  Múltiplas negociações com "${PRESERVE_PLAYER_NAME}". Preservando a mais recente (id: ${matches[matches.length - 1].id}).`
    );
  }
  return matches[matches.length - 1].id;
}

async function main() {
  const { apply } = parseArgs();
  console.log("\n🔍 cleanupTransferRumors — Listando negociações...\n");

  const rows = await listAllRumors();

  if (rows.length === 0) {
    console.log("Nenhuma negociação encontrada. Nada a fazer.");
    process.exit(0);
  }

  console.log("--- Todas as negociações ---");
  console.log(
    "id | playerName | fromTeam | toTeam | status | createdAt | createdByUserId"
  );
  console.log("-".repeat(90));
  for (const r of rows) {
    console.log(
      `${r.id} | ${r.playerName} | ${r.fromTeam} | ${r.toTeam} | ${r.status} | ${r.createdAt?.toISOString?.() ?? r.createdAt} | ${r.createdByUserId}`
    );
  }
  console.log("");

  const preserveId = findPreserveId(rows);
  if (!preserveId) {
    console.error(
      `❌ ERRO: Nenhuma negociação encontrada para "${PRESERVE_PLAYER_NAME}".`
    );
    console.error(
      "   Não é seguro prosseguir. Crie a negociação do Gabriel Paulista primeiro ou ajuste PRESERVE_PLAYER_NAME."
    );
    process.exit(1);
  }

  const toDelete = rows.filter((r) => r.id !== preserveId);
  const toPreserve = rows.find((r) => r.id === preserveId)!;

  console.log(`✅ Registro a PRESERVAR: id=${preserveId} | ${toPreserve.playerName} | ${toPreserve.fromTeam} → ${toPreserve.toTeam}`);
  console.log(`📋 Seriam deletados: ${toDelete.length} registro(s)\n`);

  ensureDir(BACKUPS_DIR);
  const backupPath = path.join(BACKUPS_DIR, `${BACKUP_PREFIX}-${timestamp()}.json`);
  const backupData = {
    exportedAt: new Date().toISOString(),
    preserveId,
    preserveRecord: toPreserve,
    toDelete: toDelete.map((r) => ({ id: r.id, playerName: r.playerName, fromTeam: r.fromTeam, toTeam: r.toTeam })),
    allRecords: rows,
  };
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), "utf-8");
  console.log(`📦 Backup salvo em: ${backupPath}\n`);

  if (!apply) {
    console.log("🔒 Modo DRY-RUN. Nenhuma alteração no banco.");
    console.log("   Para executar: npx tsx server/scripts/cleanupTransferRumors.ts --apply");
    process.exit(0);
  }

  console.log("⚠️  Modo --apply: executando delete em transação...\n");

  const idsToDelete = toDelete.map((r) => r.id);

  await db.transaction(async (tx) => {
    if (idsToDelete.length > 0) {
      await tx.delete(transferRumorComments).where(inArray(transferRumorComments.rumorId, idsToDelete));
      await tx.delete(transferRumorVotes).where(inArray(transferRumorVotes.rumorId, idsToDelete));
      await tx.delete(transferRumors).where(inArray(transferRumors.id, idsToDelete));
    }
  });

  const remaining = await listAllRumors();
  console.log(`✅ Delete concluído. Negociações restantes: ${remaining.length}`);
  if (remaining.length === 1 && remaining[0].id === preserveId) {
    console.log(`   ✓ Apenas: ${remaining[0].playerName} (${remaining[0].fromTeam} → ${remaining[0].toTeam})`);
  } else {
    console.warn("   ⚠️  Verifique: esperado 1 registro.");
  }
  console.log("");
}

main().catch((err) => {
  console.error("Erro:", err);
  process.exit(1);
});

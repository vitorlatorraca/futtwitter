#!/usr/bin/env npx tsx
/**
 * Sincroniza photoUrl dos jogadores do Corinthians com base em arquivos locais.
 * Match por nome normalizado (PT-BR). Conservador: só atualiza match exato.
 *
 * Run:
 *   npx tsx server/scripts/syncCorinthiansPlayerPhotos.ts [--apply] [--force] [--assetsDir=...] [--teamSlug=...]
 */
import "dotenv/config";
import { db } from "../db";
import { players, teams } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEAM_SLUG_DEFAULT = "corinthians";
/** Default: assets/players/corinthians (compatível com fetch-corinthians-photos e fotos existentes) */
const ASSETS_DIR_DEFAULT = path.resolve(__dirname, "../../client/public/assets/players/corinthians");
const REPORTS_DIR = path.resolve(__dirname, "reports");
const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp"];

function parseArgs(): {
  apply: boolean;
  force: boolean;
  teamSlug: string;
  assetsDir: string;
} {
  const args = process.argv.slice(2);
  let teamSlug = TEAM_SLUG_DEFAULT;
  let assetsDir = ASSETS_DIR_DEFAULT;

  for (const a of args) {
    if (a === "--apply") continue;
    if (a === "--force") continue;
    if (a.startsWith("--teamSlug=")) teamSlug = a.split("=")[1]?.trim() || teamSlug;
    if (a.startsWith("--assetsDir=")) assetsDir = a.split("=")[1]?.trim() || assetsDir;
  }

  return {
    apply: args.includes("--apply"),
    force: args.includes("--force"),
    teamSlug,
    assetsDir: path.isAbsolute(assetsDir) ? assetsDir : path.resolve(process.cwd(), assetsDir),
  };
}

/** Normaliza nome PT-BR: remove acentos, lowercase, remove pontuação e espaços extras */
function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extrai nome do filename: "rodrigo-garro.jpg" -> "rodrigo garro", "memphis-depay.jpg" -> "memphis depay" */
function nameFromFilename(filename: string): string {
  const base = path.basename(filename, path.extname(filename));
  return base.replace(/-/g, " ");
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function timestamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}${String(d.getSeconds()).padStart(2, "0")}`;
}

interface Report {
  matched: Array<{ playerId: string; name: string; file: string; url: string }>;
  unmatched: Array<{ file: string; normalizedFromFile: string }>;
  missing: Array<{ playerId: string; name: string }>;
  ambiguous: Array<{ file: string; normalizedFromFile: string; players: Array<{ playerId: string; name: string }> }>;
  summary: { matched: number; unmatched: number; missing: number; ambiguous: number; updated: number };
}

async function main() {
  const { apply, force, teamSlug, assetsDir } = parseArgs();

  console.log("\n📷 syncCorinthiansPlayerPhotos\n");
  console.log(`  teamSlug: ${teamSlug}`);
  console.log(`  assetsDir: ${assetsDir}`);
  console.log(`  apply: ${apply}`);
  console.log(`  force: ${force}\n`);

  const teamId = teamSlug;
  const roster = await db.select().from(players).where(eq(players.teamId, teamId));
  if (roster.length === 0) {
    console.log("Nenhum jogador do Corinthians no banco. Execute seed primeiro.");
    process.exit(0);
  }

  const playerByNormalized = new Map<string, Array<{ id: string; name: string }>>();
  for (const p of roster) {
    const n = normalizeName(p.name);
    const arr = playerByNormalized.get(n) ?? [];
    arr.push({ id: p.id, name: p.name });
    playerByNormalized.set(n, arr);
  }

  let files: string[] = [];
  if (fs.existsSync(assetsDir)) {
    files = fs.readdirSync(assetsDir).filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return IMG_EXT.includes(ext);
    });
  } else {
    console.warn(`⚠️  Diretório não existe: ${assetsDir}`);
    console.warn("   Crie o diretório e adicione fotos (ex: rodrigo-garro.jpg, memphis-depay.jpg)");
  }

  const report: Report = {
    matched: [],
    unmatched: [],
    missing: [],
    ambiguous: [],
    summary: { matched: 0, unmatched: 0, missing: 0, ambiguous: 0, updated: 0 },
  };

  const usedPlayerIds = new Set<string>();

  for (const file of files) {
    const nameFromFile = nameFromFilename(file);
    const normalizedFromFile = normalizeName(nameFromFile);
    const candidates = playerByNormalized.get(normalizedFromFile);

    if (!candidates) {
      report.unmatched.push({ file, normalizedFromFile });
      continue;
    }
    if (candidates.length > 1) {
      report.ambiguous.push({
        file,
        normalizedFromFile,
        players: candidates.map((c) => ({ playerId: c.id, name: c.name })),
      });
      continue;
    }

    const player = candidates[0];
    /** URL: /players/corinthians/ for public/players/corinthians; /assets/players/corinthians/ for assets path */
    const url = assetsDir.replace(/\\/g, "/").includes("public/players") ? `/players/corinthians/${file}` : `/assets/players/corinthians/${file}`;
    report.matched.push({ playerId: player.id, name: player.name, file, url });
    usedPlayerIds.add(player.id);
  }

  for (const p of roster) {
    if (!usedPlayerIds.has(p.id)) {
      report.missing.push({ playerId: p.id, name: p.name });
    }
  }

  report.summary = {
    matched: report.matched.length,
    unmatched: report.unmatched.length,
    missing: report.missing.length,
    ambiguous: report.ambiguous.length,
    updated: 0,
  };

  ensureDir(REPORTS_DIR);
  const reportPath = path.join(REPORTS_DIR, `player-photo-sync-${timestamp()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
  console.log(`📄 Relatório: ${reportPath}\n`);

  console.log("--- Resumo ---");
  console.log(`  matched:   ${report.summary.matched}`);
  console.log(`  unmatched: ${report.summary.unmatched} (arquivo sem jogador)`);
  console.log(`  missing:  ${report.summary.missing} (jogador sem arquivo)`);
  console.log(`  ambiguous: ${report.summary.ambiguous} (1 arquivo = múltiplos jogadores)\n`);

  if (report.matched.length > 0) {
    console.log("--- Matched ---");
    for (const m of report.matched) {
      console.log(`  ${m.name} <- ${m.file} -> ${m.url}`);
    }
    console.log("");
  }

  if (report.unmatched.length > 0) {
    console.log("--- Unmatched (arquivo sem jogador) ---");
    for (const u of report.unmatched) {
      console.log(`  ${u.file} (normalized: ${u.normalizedFromFile})`);
    }
    console.log("");
  }

  if (report.ambiguous.length > 0) {
    console.log("--- Ambiguous (não atualizado) ---");
    for (const a of report.ambiguous) {
      console.log(`  ${a.file} -> ${a.players.map((p) => p.name).join(", ")}`);
    }
    console.log("");
  }

  if (!apply) {
    console.log("🔒 Modo DRY-RUN. Nenhuma alteração no banco.");
    console.log("   Para executar: npx tsx server/scripts/syncCorinthiansPlayerPhotos.ts --apply");
    process.exit(0);
  }

  let updated = 0;
  for (const m of report.matched) {
    const [player] = roster.filter((p) => p.id === m.playerId);
    if (!player) continue;
    if (player.photoUrl && !force) {
      console.log(`  ⏭️  ${m.name} já tem photoUrl, use --force para sobrescrever`);
      continue;
    }
    await db.update(players).set({ photoUrl: m.url, updatedAt: new Date() }).where(eq(players.id, m.playerId));
    updated++;
    console.log(`  ✓ ${m.name} -> ${m.url}`);
  }

  report.summary.updated = updated;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");

  console.log(`\n✅ Atualizados: ${updated}`);
}

main().catch((err) => {
  console.error("Erro:", err);
  process.exit(1);
});

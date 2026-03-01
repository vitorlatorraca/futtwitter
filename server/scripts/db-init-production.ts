/**
 * Production-safe DB initialisation.
 *
 * 1. Runs `drizzle-kit push` (idempotent — creates missing tables/columns, never drops).
 * 2. Runs incremental SQL migrations for anything drizzle-kit push doesn't cover.
 *
 * Safe to call on every deploy: if everything already exists, it's a no-op.
 *
 * Usage: npx tsx server/scripts/db-init-production.ts
 */
import { spawnSync } from "child_process";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not set — cannot initialise the database.");
  process.exit(1);
}

const masked = databaseUrl.replace(
  /\/\/([^:]+):([^@]+)@/,
  (_, user) => `//${user}:****@`,
);
console.log("🔗 DATABASE_URL (masked):", masked);

// ── Step 1: drizzle-kit push ────────────────────────────────────────────────
console.log("🔄 Step 1/2 — drizzle-kit push (sync schema)…");
const push = spawnSync("npx", ["drizzle-kit", "push"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NODE_ENV: "development" },
});

if (push.status !== 0) {
  console.error("❌ drizzle-kit push failed (exit code %d)", push.status);
  process.exit(push.status ?? 1);
}
console.log("✅ drizzle-kit push complete.\n");

// ── Step 2: SQL migrations ─────────────────────────────────────────────────
const MIGRATIONS_DIR = join(__dirname, "../../migrations");
const MIGRATION_FILES = [
  "0004_sport_schema_complete.sql",
  "0005_players_extended_columns.sql",
  "0006_team_match_ratings.sql",
  "0007_player_match_stats_team_idx.sql",
  "0008_transfer_author_and_dual_votes.sql",
  "0009_teams_forum.sql",
  "0010_standings.sql",
  "0011_vaievem_transfer_rumors.sql",
  "0012_transfer_rumors_note.sql",
  "0013_game_daily_player.sql",
];

console.log("🔄 Step 2/2 — SQL migrations…");

const pool = new pg.Pool({ connectionString: databaseUrl });
const client = await pool.connect();

try {
  for (const file of MIGRATION_FILES) {
    const filePath = join(MIGRATIONS_DIR, file);
    try {
      const sql = readFileSync(filePath, "utf-8");
      await client.query(sql);
      console.log(`  ✓ ${file}`);
    } catch (err: any) {
      if (err.code === "ENOENT") {
        console.log(`  ⏭️  ${file} not found, skipping`);
      } else if (
        err.code === "42P07" || // relation already exists
        err.code === "42710" || // type already exists
        err.code === "42701"    // column already exists
      ) {
        console.log(`  ⏭️  ${file} already applied, skipping`);
      } else {
        throw err;
      }
    }
  }
  console.log("✅ SQL migrations complete.\n");
} finally {
  client.release();
  await pool.end();
}

console.log("🎉 Database initialisation finished — all tables ready.");

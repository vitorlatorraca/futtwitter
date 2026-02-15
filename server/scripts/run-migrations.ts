/**
 * Executa migrations SQL manualmente.
 * Útil quando drizzle-kit push não cobre migrations customizadas.
 *
 * Run: npx tsx server/scripts/run-migrations.ts
 */
import "dotenv/config";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { pool } from "../db";

const __dirname = dirname(fileURLToPath(import.meta.url));
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
];

async function runMigrations() {
  console.log("🔄 Running migrations...");

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
        } else {
          throw err;
        }
      }
    }
    console.log("✅ Migrations complete.");
  } finally {
    client.release();
  }
}

runMigrations().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});

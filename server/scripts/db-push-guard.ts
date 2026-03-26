/**
 * Guard: blocks drizzle-kit push when NODE_ENV=production.
 * Use db:migrate for production schema changes instead.
 *
 * Run: npm run db:push (calls this via package.json)
 */
import { spawnSync } from "child_process";

// Block only when explicitly in production (deploy scripts set this)
if (process.env.NODE_ENV === "production") {
  console.error("");
  console.error("❌ BLOCKED: db:push is not allowed in production.");
  console.error("   Use migrations instead: npm run db:migrate");
  console.error("   Or run manually with NODE_ENV=development if you really need push.");
  console.error("");
  process.exit(1);
}

const result = spawnSync("npx", ["drizzle-kit", "push"], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);

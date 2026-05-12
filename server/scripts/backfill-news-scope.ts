/**
 * Data fix: set scope for existing news.
 * - If news has teamId → scope = TEAM
 * - If news has no teamId → scope = ALL
 *
 * Run after adding the scope column (e.g. after `npm run db:push`):
 *   npx tsx server/scripts/backfill-news-scope.ts
 */
import "dotenv/config";
import { db } from "../db";
import { news } from "@shared/schema";
import { isNotNull, isNull } from "drizzle-orm";

async function main() {
  // Set TEAM where team_id is present
  const teamResult = await db
    .update(news)
    .set({ scope: "TEAM", updatedAt: new Date() })
    .where(isNotNull(news.teamId))
    .returning({ id: news.id });

  // Ensure rows without team_id have scope ALL (default should already be ALL; safe to run again)
  const allResult = await db
    .update(news)
    .set({ scope: "ALL", updatedAt: new Date() })
    .where(isNull(news.teamId))
    .returning({ id: news.id });

  console.log(`Updated scope=TEAM for ${teamResult.length} news with teamId.`);
  console.log(`Updated scope=ALL for ${allResult.length} news without teamId.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

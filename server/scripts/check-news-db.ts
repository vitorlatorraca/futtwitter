import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";

const db = drizzle(neon(process.env.DATABASE_URL!));

async function main() {
  // Testa o exato JOIN que a rota /api/feed/influencers faz
  const joinResult = await db.execute(sql`
    SELECT
      n.id,
      n.title,
      n.is_published,
      n.journalist_id,
      j.id as journalist_row_id,
      j.status as journalist_status,
      u.id as user_id,
      u.name as journalist_name,
      n.team_id
    FROM news n
    INNER JOIN journalists j ON n.journalist_id = j.id
    INNER JOIN users u ON j.user_id = u.id
    WHERE n.is_published = true
    ORDER BY n.published_at DESC
    LIMIT 10
  `);

  console.log("=== JOIN news + journalists + users ===");
  console.log("Total com JOIN:", joinResult.rows.length);
  console.log(joinResult.rows);

  // Verifica se alguma notícia perdeu o jornalista
  const orphanNews = await db.execute(sql`
    SELECT n.id, n.title, n.journalist_id
    FROM news n
    LEFT JOIN journalists j ON n.journalist_id = j.id
    WHERE j.id IS NULL
  `);
  console.log("\n=== NOTÍCIAS SEM JORNALISTA VÁLIDO (orphans) ===");
  console.log(orphanNews.rows);
}

main().catch(console.error);

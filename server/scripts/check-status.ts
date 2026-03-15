import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";

const db = drizzle(neon(process.env.DATABASE_URL!));

async function main() {
  const users = await db.execute(sql`SELECT COUNT(*) as total FROM users`);
  const news = await db.execute(sql`SELECT COUNT(*) as total FROM news`);
  const journalists = await db.execute(sql`SELECT COUNT(*) as total FROM journalists`);
  const posts = await db.execute(sql`SELECT COUNT(*) as total FROM posts`);

  console.log("users:", (users.rows[0] as any).total);
  console.log("news:", (news.rows[0] as any).total);
  console.log("journalists:", (journalists.rows[0] as any).total);
  console.log("posts:", (posts.rows[0] as any).total);
}

main().catch(console.error);

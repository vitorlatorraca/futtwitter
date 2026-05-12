import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";

const db = drizzle(neon(process.env.DATABASE_URL!));
const j = await db.execute(sql`SELECT id, user_id, status FROM journalists ORDER BY created_at`);
console.log(JSON.stringify(j.rows, null, 2));

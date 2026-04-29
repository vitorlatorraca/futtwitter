import "dotenv/config"; // keep first: required for scripts relying on env vars
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Available env keys: " +
      Object.keys(process.env).join(", ")
  );
}

// External providers (Neon, Supabase) require SSL in production
const sslConfig =
  process.env.NODE_ENV !== "production"
    ? false
    : { rejectUnauthorized: true };

// Vercel serverless: each function instance opens its own pool.
// Keep `max: 1` in production so concurrent invocations don't exhaust Postgres.
// Locally (Railway-style long-lived process), allow more connections.
const isServerless = process.env.NODE_ENV === "production";

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: sslConfig,
  max: isServerless ? 1 : 10,
  idleTimeoutMillis: isServerless ? 10_000 : 30_000,
  connectionTimeoutMillis: 5_000,
  keepAlive: !isServerless,
});
export const db = drizzle(pool, { schema });

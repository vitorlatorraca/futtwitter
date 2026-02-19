import "dotenv/config"; // keep first: required for scripts relying on env vars
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Support both possible env variable names
const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL or DATABASE_URL must be set. Available env keys: " +
      Object.keys(process.env).join(", ")
  );
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });

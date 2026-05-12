import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL ?? process.env.DATABASE_URL;
if (!databaseUrl) {
  const envKeys = Object.keys(process.env).slice(0, 50).join(", ");
  throw new Error(
    `DATABASE_URL must be set (Railway usually injects it). Found env keys: ${envKeys}`,
  );
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});

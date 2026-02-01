-- FUTTWITTER: add avatarUrl to users
-- This migration is compatible with drizzle-kit output folder (drizzle.config.ts -> out: "./migrations").

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "avatar_url" text;


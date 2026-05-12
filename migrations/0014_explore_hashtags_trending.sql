-- Explore page: hashtags, post_hashtags, trending_topics, posts.hashtags

DO $$ BEGIN
  CREATE TYPE "public"."hashtag_category" AS ENUM('time', 'campeonato', 'geral', 'transferencia');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."trending_period" AS ENUM('1h', '6h', '24h');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "hashtags" text[];

CREATE TABLE IF NOT EXISTS "hashtags" (
  "id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(100) NOT NULL UNIQUE,
  "post_count" integer NOT NULL DEFAULT 0,
  "category" "hashtag_category" NOT NULL DEFAULT 'geral',
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "hashtags_name_idx" ON "hashtags" ("name");
CREATE INDEX IF NOT EXISTS "hashtags_post_count_idx" ON "hashtags" ("post_count");

CREATE TABLE IF NOT EXISTS "post_hashtags" (
  "post_id" varchar(36) NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
  "hashtag_id" varchar(36) NOT NULL REFERENCES "hashtags"("id") ON DELETE CASCADE,
  PRIMARY KEY ("post_id", "hashtag_id")
);

CREATE INDEX IF NOT EXISTS "post_hashtags_post_idx" ON "post_hashtags" ("post_id");
CREATE INDEX IF NOT EXISTS "post_hashtags_hashtag_idx" ON "post_hashtags" ("hashtag_id");

CREATE TABLE IF NOT EXISTS "trending_topics" (
  "id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" varchar(200) NOT NULL,
  "subtitle" text,
  "category" "hashtag_category" NOT NULL DEFAULT 'geral',
  "post_count" integer NOT NULL DEFAULT 0,
  "team_id" varchar(36) REFERENCES "teams"("id") ON DELETE SET NULL,
  "period" "trending_period" NOT NULL DEFAULT '24h',
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "trending_topics_period_idx" ON "trending_topics" ("period");
CREATE INDEX IF NOT EXISTS "trending_topics_category_idx" ON "trending_topics" ("category");

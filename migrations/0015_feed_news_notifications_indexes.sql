-- Performance: news listing by team + publish state + date
CREATE INDEX IF NOT EXISTS "news_query_idx" ON "news" ("team_id", "is_published", "published_at");

-- Performance: chronological feed scans (DESC matches typical ORDER BY created_at DESC)
CREATE INDEX IF NOT EXISTS "posts_feed_idx" ON "posts" ("created_at" DESC);

-- Performance: unread / per-user notification queries
CREATE INDEX IF NOT EXISTS "notifications_user_unread_idx" ON "notifications" ("user_id", "is_read");

-- Idempotency: one interaction type per user per news item
CREATE UNIQUE INDEX IF NOT EXISTS "news_interactions_user_news_type_unique" ON "news_interactions" ("user_id", "news_id", "interaction_type");

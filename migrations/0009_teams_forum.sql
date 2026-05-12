-- Migration 0009: Teams Forum (Comunidade)
-- Fórum por time: tópicos, respostas e curtidas

-- Forum category enum
DO $$ BEGIN
  CREATE TYPE forum_topic_category AS ENUM (
    'news',
    'pre_match',
    'post_match',
    'transfer',
    'off_topic',
    'base'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Moderation status enum (for future use)
DO $$ BEGIN
  CREATE TYPE forum_moderation_status AS ENUM ('PENDING', 'APPROVED', 'REMOVED');

EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Topics table
CREATE TABLE IF NOT EXISTS teams_forum_topics (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  team_id varchar(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  author_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title varchar(300) NOT NULL,
  content text NOT NULL,
  category forum_topic_category NOT NULL DEFAULT 'base',
  cover_image_url text,
  views_count integer NOT NULL DEFAULT 0,
  likes_count integer NOT NULL DEFAULT 0,
  replies_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_pinned boolean NOT NULL DEFAULT false,
  is_locked boolean NOT NULL DEFAULT false,
  report_count integer NOT NULL DEFAULT 0,
  is_removed boolean NOT NULL DEFAULT false,
  moderation_status forum_moderation_status NOT NULL DEFAULT 'APPROVED'
);

CREATE INDEX IF NOT EXISTS teams_forum_topics_team_id_idx ON teams_forum_topics(team_id);
CREATE INDEX IF NOT EXISTS teams_forum_topics_created_at_idx ON teams_forum_topics(created_at DESC);
CREATE INDEX IF NOT EXISTS teams_forum_topics_category_idx ON teams_forum_topics(category);
CREATE INDEX IF NOT EXISTS teams_forum_topics_team_category_idx ON teams_forum_topics(team_id, category);

-- Replies table
CREATE TABLE IF NOT EXISTS teams_forum_replies (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  topic_id varchar(36) NOT NULL REFERENCES teams_forum_topics(id) ON DELETE CASCADE,
  author_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS teams_forum_replies_topic_id_idx ON teams_forum_replies(topic_id);

-- Likes table (topic or reply)
CREATE TABLE IF NOT EXISTS teams_forum_likes (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id varchar(36) REFERENCES teams_forum_topics(id) ON DELETE CASCADE,
  reply_id varchar(36) REFERENCES teams_forum_replies(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT teams_forum_likes_target_check CHECK (
    (topic_id IS NOT NULL AND reply_id IS NULL) OR
    (topic_id IS NULL AND reply_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS teams_forum_likes_topic_user_unique ON teams_forum_likes(user_id, topic_id) WHERE topic_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS teams_forum_likes_reply_user_unique ON teams_forum_likes(user_id, reply_id) WHERE reply_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS teams_forum_likes_topic_idx ON teams_forum_likes(topic_id) WHERE topic_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS teams_forum_likes_reply_idx ON teams_forum_likes(reply_id) WHERE reply_id IS NOT NULL;

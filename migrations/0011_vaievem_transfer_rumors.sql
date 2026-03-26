-- Migration 0011: Vai e Vem - transfer_rumors, transfer_rumor_votes, transfer_rumor_comments
-- Schema completo para rumores/negociações com avaliação dupla (SELLING/BUYING)

-- 1. Enum para status da negociação (4 estados)
DO $$ BEGIN
  CREATE TYPE transfer_rumor_status AS ENUM ('RUMOR', 'NEGOTIATING', 'DONE', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Reutilizar enums existentes: transfer_vote_side (SELLING, BUYING), transfer_vote_value (LIKE, DISLIKE)
-- Já criados na migration 0008

-- 3. Tabela principal: transfer_rumors
CREATE TABLE IF NOT EXISTS transfer_rumors (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  player_id varchar(36) NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  from_team_id varchar(36) NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  to_team_id varchar(36) NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  status transfer_rumor_status NOT NULL DEFAULT 'RUMOR',
  fee_amount numeric,
  fee_currency text DEFAULT 'BRL',
  contract_until date,
  source_url text,
  source_name text,
  created_by_user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT transfer_rumors_from_ne_to CHECK (from_team_id != to_team_id)
);

CREATE INDEX IF NOT EXISTS transfer_rumors_status_created_idx ON transfer_rumors(status, created_at DESC);
CREATE INDEX IF NOT EXISTS transfer_rumors_from_team_idx ON transfer_rumors(from_team_id);
CREATE INDEX IF NOT EXISTS transfer_rumors_to_team_idx ON transfer_rumors(to_team_id);
CREATE INDEX IF NOT EXISTS transfer_rumors_player_idx ON transfer_rumors(player_id);
CREATE INDEX IF NOT EXISTS transfer_rumors_created_by_idx ON transfer_rumors(created_by_user_id);

-- 4. Tabela de votos: transfer_rumor_votes
CREATE TABLE IF NOT EXISTS transfer_rumor_votes (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  rumor_id varchar(36) NOT NULL REFERENCES transfer_rumors(id) ON DELETE CASCADE,
  user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  side transfer_vote_side NOT NULL,
  vote transfer_vote_value NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(rumor_id, user_id, side)
);

CREATE INDEX IF NOT EXISTS transfer_rumor_votes_rumor_side_idx ON transfer_rumor_votes(rumor_id, side);
CREATE INDEX IF NOT EXISTS transfer_rumor_votes_user_idx ON transfer_rumor_votes(user_id);

-- 5. Tabela de comentários: transfer_rumor_comments
CREATE TABLE IF NOT EXISTS transfer_rumor_comments (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  rumor_id varchar(36) NOT NULL REFERENCES transfer_rumors(id) ON DELETE CASCADE,
  user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS transfer_rumor_comments_rumor_created_idx ON transfer_rumor_comments(rumor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS transfer_rumor_comments_user_idx ON transfer_rumor_comments(user_id);

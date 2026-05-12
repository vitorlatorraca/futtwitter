-- Migration 0008: Autor do rumor + avaliação dupla (SELLING/BUYING)
-- 1. Adiciona created_by_journalist_id em transfers
-- 2. Substitui transfer_votes por schema com side (SELLING/BUYING) e vote (LIKE/DISLIKE)

-- 1. Coluna autor do rumor
ALTER TABLE transfers
  ADD COLUMN IF NOT EXISTS created_by_journalist_id varchar(36) REFERENCES journalists(id) ON DELETE SET NULL;

-- 2. Novos enums para votos por lado
DO $$ BEGIN
  CREATE TYPE transfer_vote_side AS ENUM ('SELLING', 'BUYING');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE transfer_vote_value AS ENUM ('LIKE', 'DISLIKE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. Dropar tabela antiga de votos (schema incompatível)
DROP TABLE IF EXISTS transfer_votes;

-- 4. Criar nova tabela transfer_votes com side
CREATE TABLE transfer_votes (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  transfer_id varchar(36) NOT NULL REFERENCES transfers(id) ON DELETE CASCADE,
  user_id varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  side transfer_vote_side NOT NULL,
  vote transfer_vote_value NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(transfer_id, user_id, side)
);

CREATE INDEX IF NOT EXISTS transfer_votes_transfer_side_idx ON transfer_votes(transfer_id, side);
CREATE INDEX IF NOT EXISTS transfer_votes_user_idx ON transfer_votes(user_id);

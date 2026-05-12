-- Migration 0006: team_match_ratings
-- Nota (rating) do time por partida para exibir no card Jogos
-- Fonte: Sofascore, interno ou média dos jogadores

CREATE TABLE IF NOT EXISTS team_match_ratings (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id varchar(36) NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
  team_id varchar(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  rating decimal(3,1) NOT NULL,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS team_match_ratings_fixture_team_unique
  ON team_match_ratings(fixture_id, team_id);

CREATE INDEX IF NOT EXISTS team_match_ratings_team_fixture_idx
  ON team_match_ratings(team_id, fixture_id);

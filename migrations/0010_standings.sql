-- Migration 0010: Standings table for competition classification (Sofascore-style)
-- Stores position, stats, and form (last 5) per team per competition/season

CREATE TABLE IF NOT EXISTS standings (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id varchar(36) NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  team_id varchar(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  season varchar(10) NOT NULL DEFAULT '2026',
  position integer NOT NULL,
  played integer NOT NULL DEFAULT 0,
  wins integer NOT NULL DEFAULT 0,
  draws integer NOT NULL DEFAULT 0,
  losses integer NOT NULL DEFAULT 0,
  goals_for integer NOT NULL DEFAULT 0,
  goals_against integer NOT NULL DEFAULT 0,
  goal_diff integer NOT NULL DEFAULT 0,
  points integer NOT NULL DEFAULT 0,
  form jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS standings_competition_team_season_unique
  ON standings(competition_id, team_id, season);

CREATE INDEX IF NOT EXISTS standings_competition_idx ON standings(competition_id);
CREATE INDEX IF NOT EXISTS standings_team_idx ON standings(team_id);
CREATE INDEX IF NOT EXISTS standings_position_idx ON standings(competition_id, season, position);

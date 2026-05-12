-- Jogos do Meu Time: competitions + fixtures
CREATE TYPE fixture_status AS ENUM ('SCHEDULED', 'LIVE', 'FT', 'POSTPONED', 'CANCELED');

CREATE TABLE IF NOT EXISTS competitions (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  country varchar(100),
  logo_url text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fixtures (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id varchar(36) NOT NULL REFERENCES teams(id),
  competition_id varchar(36) NOT NULL REFERENCES competitions(id),
  season varchar(10) NOT NULL,
  round varchar(100),
  status fixture_status NOT NULL DEFAULT 'SCHEDULED',
  kickoff_at timestamptz NOT NULL,
  home_team_name varchar(255) NOT NULL,
  away_team_name varchar(255) NOT NULL,
  home_team_id varchar(36) REFERENCES teams(id),
  away_team_id varchar(36) REFERENCES teams(id),
  home_score integer,
  away_score integer,
  venue varchar(255),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fixtures_team_kickoff_idx ON fixtures(team_id, kickoff_at);
CREATE INDEX IF NOT EXISTS fixtures_competition_idx ON fixtures(competition_id);
CREATE INDEX IF NOT EXISTS fixtures_status_idx ON fixtures(status);

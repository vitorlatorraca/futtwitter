-- Migration 0004: Schema esportivo completo
-- Países, venues, seasons, team_rosters, match_games, eventos, escalações, stats, lesões, transferências
-- Execute: npm run db:migrate (ou npx drizzle-kit migrate)

-- 1. Novos ENUMs
DO $$ BEGIN
  CREATE TYPE preferred_foot AS ENUM ('LEFT', 'RIGHT', 'BOTH');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE primary_position AS ENUM ('GK', 'CB', 'FB', 'LB', 'RB', 'WB', 'DM', 'CM', 'AM', 'W', 'LW', 'RW', 'ST', 'SS');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE roster_role AS ENUM ('STARTER', 'ROTATION', 'YOUTH', 'RESERVE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE roster_status AS ENUM ('ACTIVE', 'LOANED_OUT', 'INJURED', 'SUSPENDED', 'TRANSFERRED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE match_status AS ENUM ('SCHEDULED', 'LIVE', 'HT', 'FT', 'POSTPONED', 'CANCELED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE match_event_type AS ENUM ('GOAL', 'OWN_GOAL', 'ASSIST', 'YELLOW', 'RED', 'SUBSTITUTION', 'PENALTY_SCORED', 'PENALTY_MISSED', 'VAR', 'INJURY');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE injury_status AS ENUM ('DAY_TO_DAY', 'OUT', 'DOUBTFUL', 'RECOVERED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE transfer_status_sport AS ENUM ('RUMOR', 'CONFIRMED', 'CANCELED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Tabela countries
CREATE TABLE IF NOT EXISTS countries (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  code varchar(2) NOT NULL UNIQUE,
  flag_emoji varchar(10),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Novas colunas em teams
ALTER TABLE teams ADD COLUMN IF NOT EXISTS country_id varchar(36) REFERENCES countries(id) ON DELETE SET NULL;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS founded_year integer;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS stadium_name varchar(255);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS stadium_capacity integer;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS crest_url text;

-- 4. Novas colunas em competitions
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS country_id varchar(36) REFERENCES countries(id) ON DELETE SET NULL;
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS level integer;

-- 5. Tabela venues
CREATE TABLE IF NOT EXISTS venues (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  city varchar(255),
  country_id varchar(36) REFERENCES countries(id) ON DELETE SET NULL,
  capacity integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Tabela seasons
CREATE TABLE IF NOT EXISTS seasons (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id varchar(36) NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  year integer NOT NULL,
  start_date date,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS seasons_competition_year_unique ON seasons(competition_id, year);
CREATE INDEX IF NOT EXISTS seasons_competition_idx ON seasons(competition_id);

-- 7. Tabela team_rosters
CREATE TABLE IF NOT EXISTS team_rosters (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id varchar(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  season_id varchar(36) NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  player_id varchar(36) NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  squad_number integer,
  role roster_role,
  status roster_status DEFAULT 'ACTIVE',
  joined_at date,
  left_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS team_rosters_team_season_player_unique ON team_rosters(team_id, season_id, player_id);
CREATE INDEX IF NOT EXISTS team_rosters_team_season_idx ON team_rosters(team_id, season_id);
CREATE INDEX IF NOT EXISTS team_rosters_player_idx ON team_rosters(player_id);

-- 8. Tabela contracts
CREATE TABLE IF NOT EXISTS contracts (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  team_roster_id varchar(36) REFERENCES team_rosters(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date,
  salary_weekly integer,
  market_value integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 9. Tabela match_games
CREATE TABLE IF NOT EXISTS match_games (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id varchar(36) REFERENCES seasons(id) ON DELETE RESTRICT,
  competition_id varchar(36) REFERENCES competitions(id) ON DELETE RESTRICT,
  venue_id varchar(36) REFERENCES venues(id) ON DELETE SET NULL,
  kickoff_at timestamptz NOT NULL,
  status match_status NOT NULL DEFAULT 'SCHEDULED',
  home_team_id varchar(36) REFERENCES teams(id) ON DELETE RESTRICT,
  away_team_id varchar(36) REFERENCES teams(id) ON DELETE RESTRICT,
  home_score integer,
  away_score integer,
  round varchar(100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS match_games_home_team_kickoff_idx ON match_games(home_team_id, kickoff_at);
CREATE INDEX IF NOT EXISTS match_games_away_team_kickoff_idx ON match_games(away_team_id, kickoff_at);
CREATE INDEX IF NOT EXISTS match_games_competition_kickoff_idx ON match_games(competition_id, kickoff_at);
CREATE INDEX IF NOT EXISTS match_games_status_idx ON match_games(status);
CREATE INDEX IF NOT EXISTS match_games_kickoff_idx ON match_games(kickoff_at);

-- 10. Tabela match_events
CREATE TABLE IF NOT EXISTS match_events (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id varchar(36) NOT NULL REFERENCES match_games(id) ON DELETE CASCADE,
  minute integer,
  type match_event_type NOT NULL,
  team_id varchar(36) REFERENCES teams(id) ON DELETE SET NULL,
  player_id varchar(36) REFERENCES players(id) ON DELETE SET NULL,
  related_player_id varchar(36) REFERENCES players(id) ON DELETE SET NULL,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS match_events_match_idx ON match_events(match_id);
CREATE INDEX IF NOT EXISTS match_events_match_minute_idx ON match_events(match_id, minute);

-- 11. Tabela match_lineups
CREATE TABLE IF NOT EXISTS match_lineups (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id varchar(36) NOT NULL REFERENCES match_games(id) ON DELETE CASCADE,
  team_id varchar(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  formation varchar(20) NOT NULL DEFAULT '4-3-3',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS match_lineups_match_team_unique ON match_lineups(match_id, team_id);
CREATE INDEX IF NOT EXISTS match_lineups_match_idx ON match_lineups(match_id);

-- 12. Tabela match_lineup_players
CREATE TABLE IF NOT EXISTS match_lineup_players (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  match_lineup_id varchar(36) NOT NULL REFERENCES match_lineups(id) ON DELETE CASCADE,
  player_id varchar(36) NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  is_starter boolean NOT NULL DEFAULT true,
  position_code varchar(10),
  shirt_number integer,
  minutes_played integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS match_lineup_players_lineup_player_unique ON match_lineup_players(match_lineup_id, player_id);
CREATE INDEX IF NOT EXISTS match_lineup_players_lineup_idx ON match_lineup_players(match_lineup_id);

-- 13. Tabela player_match_stats
CREATE TABLE IF NOT EXISTS player_match_stats (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id varchar(36) NOT NULL REFERENCES match_games(id) ON DELETE CASCADE,
  player_id varchar(36) NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_id varchar(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  minutes integer NOT NULL DEFAULT 0,
  rating real,
  goals integer NOT NULL DEFAULT 0,
  assists integer NOT NULL DEFAULT 0,
  shots integer NOT NULL DEFAULT 0,
  passes integer NOT NULL DEFAULT 0,
  tackles integer NOT NULL DEFAULT 0,
  saves integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS player_match_stats_match_player_unique ON player_match_stats(match_id, player_id);
CREATE INDEX IF NOT EXISTS player_match_stats_match_idx ON player_match_stats(match_id);
CREATE INDEX IF NOT EXISTS player_match_stats_player_idx ON player_match_stats(player_id);

-- 14. Tabela team_match_stats
CREATE TABLE IF NOT EXISTS team_match_stats (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id varchar(36) NOT NULL REFERENCES match_games(id) ON DELETE CASCADE,
  team_id varchar(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  possession integer,
  shots integer,
  shots_on_target integer,
  corners integer,
  fouls integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS team_match_stats_match_team_unique ON team_match_stats(match_id, team_id);
CREATE INDEX IF NOT EXISTS team_match_stats_match_idx ON team_match_stats(match_id);

-- 15. Tabela injuries
CREATE TABLE IF NOT EXISTS injuries (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id varchar(36) NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_id varchar(36) REFERENCES teams(id) ON DELETE SET NULL,
  type text NOT NULL,
  status injury_status NOT NULL DEFAULT 'OUT',
  started_at date NOT NULL,
  expected_return_at date,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 16. Tabela transfers_sport
CREATE TABLE IF NOT EXISTS transfers_sport (
  id varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id varchar(36) NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  from_team_id varchar(36) REFERENCES teams(id) ON DELETE SET NULL,
  to_team_id varchar(36) REFERENCES teams(id) ON DELETE SET NULL,
  fee integer,
  status transfer_status_sport NOT NULL DEFAULT 'RUMOR',
  announced_at timestamptz,
  source_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

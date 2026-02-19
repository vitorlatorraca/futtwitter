-- Game: "Adivinhe o Jogador" (Player of the Day)
-- Timezone: UTC. dateKey = YYYY-MM-DD.
-- Each team has its own daily player, deterministic per day.

CREATE TABLE IF NOT EXISTS "game_daily_player" (
  "id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "date_key" varchar(10) NOT NULL,
  "team_id" varchar(36) NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "player_id" varchar(36) NOT NULL REFERENCES "players"("id") ON DELETE CASCADE,
  "seed_used" integer,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "game_daily_player_date_team_unique"
  ON "game_daily_player" ("date_key", "team_id");

CREATE TABLE IF NOT EXISTS "game_daily_guess_progress" (
  "id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" varchar(36) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "date_key" varchar(10) NOT NULL,
  "daily_player_id" varchar(36) NOT NULL REFERENCES "game_daily_player"("id") ON DELETE CASCADE,
  "attempts" integer NOT NULL DEFAULT 0,
  "wrong_attempts" integer NOT NULL DEFAULT 0,
  "guessed" boolean NOT NULL DEFAULT false,
  "lost" boolean NOT NULL DEFAULT false,
  "guesses" json DEFAULT '[]',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "game_daily_guess_progress_user_date_unique"
  ON "game_daily_guess_progress" ("user_id", "date_key");

CREATE INDEX IF NOT EXISTS "game_daily_guess_progress_user_idx"
  ON "game_daily_guess_progress" ("user_id");

CREATE INDEX IF NOT EXISTS "game_daily_guess_progress_date_idx"
  ON "game_daily_guess_progress" ("date_key");

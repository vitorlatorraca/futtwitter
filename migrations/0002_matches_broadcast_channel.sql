-- Add optional broadcast channel for matches (e.g. ESPN, Globo, Premiere)
ALTER TABLE matches ADD COLUMN IF NOT EXISTS broadcast_channel varchar(255);

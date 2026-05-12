-- Migration 0005: Colunas opcionais em players para schema completo
-- fullName, knownName, nationalityCountryId, primaryPosition, secondaryPositions, heightCm, preferredFoot
-- Não quebra dados existentes - todas as colunas são opcionais

-- Colunas opcionais em players
ALTER TABLE players ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE players ADD COLUMN IF NOT EXISTS known_name varchar(100);
ALTER TABLE players ADD COLUMN IF NOT EXISTS nationality_country_id varchar(36) REFERENCES countries(id) ON DELETE SET NULL;
ALTER TABLE players ADD COLUMN IF NOT EXISTS primary_position varchar(10);
ALTER TABLE players ADD COLUMN IF NOT EXISTS secondary_positions text;
ALTER TABLE players ADD COLUMN IF NOT EXISTS height_cm integer;
ALTER TABLE players ADD COLUMN IF NOT EXISTS preferred_foot varchar(10);

-- Índice para buscas por nacionalidade
CREATE INDEX IF NOT EXISTS players_nationality_country_idx ON players(nationality_country_id);

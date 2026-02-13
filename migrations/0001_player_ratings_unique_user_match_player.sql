-- Garantir voto único por (userId, matchId, playerId).
-- Execute: npx drizzle-kit push  (aplica schema) ou rode este SQL manualmente se a tabela já existir.

-- Se o índice já existir, este comando falhará; nesse caso ignore ou use DROP INDEX IF EXISTS antes.
CREATE UNIQUE INDEX IF NOT EXISTS player_ratings_user_match_player_unique
ON player_ratings (user_id, match_id, player_id);

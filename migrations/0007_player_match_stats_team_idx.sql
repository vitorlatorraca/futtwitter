-- Migration 0007: Index para player_match_stats (matchId, teamId)
-- Otimiza query de ratings por time na última partida

CREATE INDEX IF NOT EXISTS player_match_stats_match_team_idx
  ON player_match_stats(match_id, team_id);

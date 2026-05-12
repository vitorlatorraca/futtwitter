import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config();

const sql = neon(process.env.DATABASE_URL);

const result = await sql`
  SELECT id, opponent, is_home_match, team_score, opponent_score, match_date, competition, status
  FROM matches
  WHERE team_id = 'flamengo' AND status = 'COMPLETED'
  ORDER BY match_date DESC
  LIMIT 3
`;
console.log('COMPLETED matches:', JSON.stringify(result, null, 2));

const mp = await sql`
  SELECT mp.player_id, mp.was_starter, mp.participated, p.name, p.known_name, p.position
  FROM match_players mp
  JOIN players p ON p.id = mp.player_id
  WHERE mp.match_id = '34731fda-c95f-48cc-a4ab-95bc7395b874'
`;
console.log('\nMatch players for Corinthians match:', mp.length);
mp.forEach(p => console.log(' -', p.known_name || p.name, p.position, 'starter:', p.was_starter));

import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config();

const sql = neon(process.env.DATABASE_URL);

// Check all columns in players table
const playerCols = await sql`
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'players' ORDER BY ordinal_position
`;
console.log('players cols:', playerCols.map(c => c.column_name).join(', '));

// Test the EXACT query the endpoint runs
const matchId = '34731fda-c95f-48cc-a4ab-95bc7395b874';
try {
  const rows = await sql`
    SELECT
      mp.player_id,
      mp.was_starter,
      mp.minutes_played,
      NULL::text as position_code,
      p.name,
      p.known_name,
      p.shirt_number,
      p.position,
      p.primary_position,
      p.sector,
      p.photo_url
    FROM match_players mp
    INNER JOIN players p ON p.id = mp.player_id
    WHERE mp.match_id = ${matchId}
  `;
  console.log('\n✅ Query OK, rows:', rows.length);
  rows.slice(0,3).forEach(r => console.log(' -', r.known_name || r.name, r.position, r.sector));
} catch (e) {
  console.log('\n❌ Query FAILED:', e.message);
}

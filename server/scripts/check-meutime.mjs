import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

const [scheduled, ft, totalMatches, teams] = await Promise.all([
  sql`SELECT COUNT(*) as cnt FROM matches WHERE status = 'SCHEDULED'`,
  sql`SELECT COUNT(*) as cnt FROM matches WHERE status = 'FT'`,
  sql`SELECT COUNT(*) as cnt FROM matches`,
  sql`SELECT id, name, wins, losses, draws, points, stadium_name, stadium_capacity FROM teams LIMIT 8`
]);

console.log('Matches - Scheduled:', scheduled[0].cnt, '| FT:', ft[0].cnt, '| Total:', totalMatches[0].cnt);
console.log('\nTeams sample:');
teams.forEach(t => console.log(` ${t.name}: W${t.wins} D${t.draws} L${t.losses} Pts:${t.points} | ${t.stadium_name || 'NO STADIUM'} (${t.stadium_capacity || 'N/A'})`));

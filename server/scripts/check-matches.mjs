import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

const [statuses, sample] = await Promise.all([
  sql`SELECT status, COUNT(*) as cnt FROM matches GROUP BY status ORDER BY cnt DESC`,
  sql`SELECT opponent, status, team_score, opponent_score, match_date FROM matches LIMIT 5`
]);

console.log('Match statuses:');
statuses.forEach(s => console.log(` ${s.status}: ${s.cnt}`));
console.log('\nSample:');
sample.forEach(m => console.log(` ${m.opponent} | ${m.status} | ${m.team_score}-${m.opponent_score} | ${m.match_date}`));

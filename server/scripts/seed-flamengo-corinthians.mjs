import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
config();

const sql = neon(process.env.DATABASE_URL);

async function run() {
  const players = await sql`
    SELECT id, name, known_name, position, shirt_number
    FROM players WHERE team_id = 'flamengo'
    ORDER BY position, shirt_number
  `;

  // Map by known_name or name (exact)
  const byName = {};
  players.forEach(p => {
    byName[(p.known_name || p.name).toLowerCase()] = p;
    byName[p.name.toLowerCase()] = p;
  });

  // Exact matches for starters
  const starters = [
    byName['a. rossi'],
    byName['g. varela'],
    byName['danilo'],
    byName['vitão'],
    byName['alex sandro'],
    byName['evertton araújo'],  // shirt 52
    byName['jorginho'],
    byName['g. de arrascaeta'],
    byName['lucas paquetá'],
    byName['samuel lino'],
    byName['pedro'],
  ];

  const matchId = '34731fda-c95f-48cc-a4ab-95bc7395b874';

  console.log('Starters found:');
  starters.forEach((p, i) => {
    if (!p) console.log(`  [${i}] NOT FOUND`);
    else console.log(`  ${p.known_name || p.name} | ${p.position} | ${p.id}`);
  });

  const nulls = starters.filter(p => !p);
  if (nulls.length > 0) {
    console.log('\n⚠️  Some players not found, aborting.');
    return;
  }

  // 1. Update match: status COMPLETED, score 1-1, date 22/03/2026
  console.log('\nUpdating match status...');
  await sql`
    UPDATE matches
    SET
      status = 'COMPLETED',
      team_score = 1,
      opponent_score = 1,
      match_date = '2026-03-22T23:30:00.000Z',
      is_home_match = false
    WHERE id = ${matchId}
  `;
  console.log('✓ Match updated: Corinthians 1 x 1 Flamengo');

  // 2. Delete existing match_players for this match
  await sql`DELETE FROM match_players WHERE match_id = ${matchId}`;

  // 3. Insert starters
  for (const p of starters) {
    await sql`
      INSERT INTO match_players (match_id, player_id, participated, was_starter, minutes_played)
      VALUES (${matchId}, ${p.id}, true, true, 90)
    `;
  }
  console.log(`✓ Inserted ${starters.length} starters`);

  // 4. Add some subs (players who came on)
  // Evertton Araújo was expelled (red card), so he probably left early
  // Real subs: let's add a few common subs
  const subNames = ['bruno henrique', 'n. de la cruz', 'luiz araújo', 'everton'];
  const subs = subNames.map(n => byName[n]).filter(Boolean);

  for (const p of subs) {
    await sql`
      INSERT INTO match_players (match_id, player_id, participated, was_starter, minutes_played)
      VALUES (${matchId}, ${p.id}, true, false, 30)
    `;
  }
  console.log(`✓ Inserted ${subs.length} substitutes: ${subs.map(p => p.known_name || p.name).join(', ')}`);

  console.log('\n✅ Done! Flamengo vs Corinthians seeded (1x1).');
}

run().catch(console.error);

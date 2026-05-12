/**
 * seed-standings-stadiums.mjs
 * 1. Calcula standings reais de cada time a partir da tabela `matches`
 * 2. Atualiza stadium_name e stadium_capacity para todos os 20 times
 */
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

// ── Real stadium data for Série A teams ──────────────────────────────────────
const STADIUMS = {
  'flamengo':               { name: 'Maracanã',              capacity: 78838 },
  'palmeiras':              { name: 'Allianz Parque',         capacity: 43713 },
  'corinthians':            { name: 'Neo Química Arena',      capacity: 49205 },
  'sao-paulo':              { name: 'MorumBIS',               capacity: 67052 },
  'gremio':                 { name: 'Arena do Grêmio',        capacity: 60540 },
  'internacional':          { name: 'Beira-Rio',              capacity: 51300 },
  'atletico-mineiro':       { name: 'Arena MRV',              capacity: 46000 },
  'fluminense':             { name: 'Maracanã',               capacity: 78838 },
  'botafogo':               { name: 'Estádio Nilton Santos',  capacity: 45891 },
  'santos':                 { name: 'Vila Belmiro',           capacity: 16068 },
  'vasco-da-gama':          { name: 'São Januário',           capacity: 29617 },
  'cruzeiro':               { name: 'Mineirão',               capacity: 61847 },
  'athletico-paranaense':   { name: 'Arena da Baixada',       capacity: 42372 },
  'bahia':                  { name: 'Arena Fonte Nova',        capacity: 47907 },
  'fortaleza':              { name: 'Arena Castelão',          capacity: 63903 },
  'bragantino':             { name: 'Nabi Abi Chedid',         capacity: 19536 },
  'rb-bragantino':          { name: 'Nabi Abi Chedid',         capacity: 19536 },
  'cuiaba':                 { name: 'Arena Pantanal',          capacity: 44059 },
  'america-mineiro':        { name: 'Independência',           capacity: 23025 },
  'coritiba':               { name: 'Estádio Couto Pereira',   capacity: 40502 },
  'goias':                  { name: 'Serra Dourada',            capacity: 52196 },
  // from seed-massive extras
  'sao-bernardo':           { name: 'Primeiro de Maio',        capacity: 15600 },
  'capivariano':            { name: 'Estádio Nicolau Alayon',  capacity: 6000  },
};

// ── Step 1: Calculate standings per team from matches ───────────────────────
console.log('Fetching all teams...');
const teams = await sql`SELECT id FROM teams`;
console.log(`Found ${teams.length} teams`);

for (const team of teams) {
  const teamId = team.id;

  // Get completed matches for this team
  const completedMatches = await sql`
    SELECT team_score, opponent_score
    FROM matches
    WHERE team_id = ${teamId}
      AND status = 'COMPLETED'
      AND team_score IS NOT NULL
      AND opponent_score IS NOT NULL
  `;

  let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0;

  for (const m of completedMatches) {
    const gs = m.team_score ?? 0;
    const ga = m.opponent_score ?? 0;
    goalsFor += gs;
    goalsAgainst += ga;
    if (gs > ga) wins++;
    else if (gs === ga) draws++;
    else losses++;
  }

  const points = wins * 3 + draws;
  const played = wins + draws + losses;

  if (played > 0) {
    await sql`
      UPDATE teams
      SET wins = ${wins},
          draws = ${draws},
          losses = ${losses},
          goals_for = ${goalsFor},
          goals_against = ${goalsAgainst},
          points = ${points},
          updated_at = NOW()
      WHERE id = ${teamId}
    `;
    console.log(`  ${teamId}: ${played} jogos | W${wins} D${draws} L${losses} GF${goalsFor} GA${goalsAgainst} Pts${points}`);
  }
}

// ── Step 2: Update stadium data ──────────────────────────────────────────────
console.log('\nUpdating stadiums...');
for (const [teamId, stadium] of Object.entries(STADIUMS)) {
  const result = await sql`
    UPDATE teams
    SET stadium_name = ${stadium.name},
        stadium_capacity = ${stadium.capacity},
        updated_at = NOW()
    WHERE id = ${teamId}
    RETURNING name
  `;
  if (result.length > 0) {
    console.log(`  ${result[0].name} → ${stadium.name} (${stadium.capacity.toLocaleString()})`);
  }
}

console.log('\n✅ Done — standings calculated + stadiums updated!');

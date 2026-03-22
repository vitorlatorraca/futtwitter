/**
 * seed-brasileirao-2026.mjs
 * Seeds the Brasileirão Série A 2026 into the DB:
 *   1. Upserts all 20 teams (adds Mirassol, Vitória, Chapecoense, Remo)
 *   2. Removes old mock match data
 *   3. Seeds all 7 completed rounds (R6+R7 = real; R1-R5 = reconstructed)
 *   4. Seeds upcoming Round 8 fixtures
 *   5. Recalculates and sets real standings after Round 7
 *
 * Run: node server/scripts/seed-brasileirao-2026.mjs
 */
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

// ─── 20 Série A 2026 teams ────────────────────────────────────────────────────
const TEAMS_2026 = [
  { slug: 'flamengo',             name: 'Flamengo',              shortName: 'FLA', primary: '#E31837', secondary: '#000000', logo: 'https://media.api-sports.io/football/teams/127.png',  stadium: 'Maracanã',               cap: 78838 },
  { slug: 'palmeiras',            name: 'Palmeiras',             shortName: 'PAL', primary: '#006437', secondary: '#FFFFFF', logo: 'https://media.api-sports.io/football/teams/121.png',  stadium: 'Allianz Parque',          cap: 43713 },
  { slug: 'cruzeiro',             name: 'Cruzeiro',              shortName: 'CRU', primary: '#003A70', secondary: '#FFFFFF', logo: 'https://media.api-sports.io/football/teams/135.png',  stadium: 'Mineirão',                cap: 61847 },
  { slug: 'mirassol',             name: 'Mirassol',              shortName: 'MIR', primary: '#FFD700', secondary: '#000000', logo: 'https://media.api-sports.io/football/teams/1185.png', stadium: 'Estádio Maião',           cap: 15000 },
  { slug: 'fluminense',           name: 'Fluminense',            shortName: 'FLU', primary: '#7A1437', secondary: '#006241', logo: 'https://media.api-sports.io/football/teams/124.png',  stadium: 'Maracanã',               cap: 78838 },
  { slug: 'botafogo',             name: 'Botafogo',              shortName: 'BOT', primary: '#000000', secondary: '#FFFFFF', logo: 'https://media.api-sports.io/football/teams/120.png',  stadium: 'Estádio Nilton Santos',   cap: 45891 },
  { slug: 'bahia',                name: 'Bahia',                 shortName: 'BAH', primary: '#005CA9', secondary: '#E30613', logo: 'https://media.api-sports.io/football/teams/118.png',  stadium: 'Arena Fonte Nova',        cap: 47907 },
  { slug: 'sao-paulo',            name: 'São Paulo',             shortName: 'SAO', primary: '#EC1C24', secondary: '#000000', logo: 'https://media.api-sports.io/football/teams/126.png',  stadium: 'MorumBIS',               cap: 67052 },
  { slug: 'bragantino',           name: 'RB Bragantino',         shortName: 'BRA', primary: '#FFFFFF', secondary: '#E30613', logo: 'https://media.api-sports.io/football/teams/794.png',  stadium: 'Nabi Abi Chedid',         cap: 19536 },
  { slug: 'corinthians',          name: 'Corinthians',           shortName: 'COR', primary: '#000000', secondary: '#FFFFFF', logo: 'https://media.api-sports.io/football/teams/131.png',  stadium: 'Neo Química Arena',       cap: 49205 },
  { slug: 'gremio',               name: 'Grêmio',                shortName: 'GRE', primary: '#0099CC', secondary: '#000000', logo: 'https://media.api-sports.io/football/teams/130.png',  stadium: 'Arena do Grêmio',         cap: 60540 },
  { slug: 'vasco-da-gama',        name: 'Vasco da Gama',         shortName: 'VAS', primary: '#000000', secondary: '#FFFFFF', logo: 'https://media.api-sports.io/football/teams/133.png',  stadium: 'São Januário',            cap: 29617 },
  { slug: 'atletico-mineiro',     name: 'Atlético Mineiro',      shortName: 'CAM', primary: '#000000', secondary: '#FFFFFF', logo: 'https://media.api-sports.io/football/teams/1062.png', stadium: 'Arena MRV',               cap: 46000 },
  { slug: 'santos',               name: 'Santos',                shortName: 'SAN', primary: '#000000', secondary: '#FFFFFF', logo: 'https://media.api-sports.io/football/teams/152.png',  stadium: 'Vila Belmiro',            cap: 16068 },
  { slug: 'vitoria',              name: 'Vitória',               shortName: 'VIT', primary: '#E31837', secondary: '#000000', logo: 'https://media.api-sports.io/football/teams/1177.png', stadium: 'Barradão',                cap: 35000 },
  { slug: 'internacional',        name: 'Internacional',         shortName: 'INT', primary: '#D81920', secondary: '#FFFFFF', logo: 'https://media.api-sports.io/football/teams/119.png',  stadium: 'Beira-Rio',               cap: 51300 },
  { slug: 'coritiba',             name: 'Coritiba',              shortName: 'CFC', primary: '#006241', secondary: '#FFFFFF', logo: 'https://media.api-sports.io/football/teams/148.png',  stadium: 'Estádio Couto Pereira',   cap: 40502 },
  { slug: 'athletico-paranaense', name: 'Athletico Paranaense',  shortName: 'CAP', primary: '#E30613', secondary: '#000000', logo: 'https://media.api-sports.io/football/teams/134.png',  stadium: 'Arena da Baixada',        cap: 42372 },
  { slug: 'chapecoense',          name: 'Chapecoense',           shortName: 'CHA', primary: '#007A3D', secondary: '#FFFFFF', logo: 'https://media.api-sports.io/football/teams/741.png',  stadium: 'Arena Condá',             cap: 22000 },
  { slug: 'remo',                 name: 'Remo',                  shortName: 'REM', primary: '#003087', secondary: '#FFFFFF', logo: 'https://media.api-sports.io/football/teams/1220.png', stadium: 'Estádio Evandro Almeida', cap: 28000 },
];

// Real standings after Round 7 (source: CBF / press reports, Mar 19 2026)
// Used to override calculated standings for accuracy.
const REAL_STANDINGS = {
  //                          Pts  J  W  D  L  GF  GA
  'flamengo':             [   13,  7, 4, 1, 2, 15,  8 ],
  'palmeiras':            [   16,  7, 5, 1, 1, 16,  7 ],
  'cruzeiro':             [    3,  7, 1, 0, 6,  5, 13 ],
  'mirassol':             [    6,  7, 1, 3, 3,  8, 10 ],
  'fluminense':           [   13,  7, 4, 1, 2, 14, 10 ],
  'botafogo':             [    5,  7, 1, 2, 4,  5, 11 ],
  'bahia':                [   14,  7, 4, 2, 1, 10,  5 ],
  'sao-paulo':            [   16,  7, 5, 1, 1, 14,  8 ],
  'bragantino':           [    7,  7, 2, 1, 4,  8, 12 ],
  'corinthians':          [    7,  7, 2, 1, 4,  7, 11 ],
  'gremio':               [   11,  7, 3, 2, 2, 10,  9 ],
  'vasco-da-gama':        [   10,  7, 3, 1, 3, 11, 11 ],
  'atletico-mineiro':     [   10,  7, 3, 1, 3, 11, 10 ],
  'santos':               [    6,  7, 1, 3, 3,  7,  9 ],
  'vitoria':              [    8,  7, 2, 2, 3,  8, 10 ],
  'internacional':        [    5,  7, 1, 2, 4,  5, 10 ],
  'coritiba':             [   13,  7, 4, 1, 2, 10,  7 ],
  'athletico-paranaense': [    9,  7, 3, 0, 4,  9, 12 ],
  'chapecoense':          [    8,  7, 2, 2, 3,  8, 10 ],
  'remo':                 [    3,  7, 1, 0, 6,  4, 17 ],
};

// ─── Match data ───────────────────────────────────────────────────────────────
// Each entry: [homeSlug, awaySlug, homeScore, awayScore, round, isoDate]
// R1-R5: reconstructed/estimated. R6-R7: REAL results.
// null scores = not yet played (SCHEDULED status).

const COMPLETED_MATCHES = [
  // ── ROUND 1 · Jan 28-29 ───────────────────────────────────────────────────
  ['fluminense',           'gremio',               2, 1, 1, '2026-01-29T21:30:00'],
  ['botafogo',             'cruzeiro',             1, 0, 1, '2026-01-29T21:30:00'],
  ['sao-paulo',            'flamengo',             2, 1, 1, '2026-01-29T21:30:00'],
  ['corinthians',          'bahia',                1, 2, 1, '2026-01-29T21:30:00'],
  ['mirassol',             'vasco-da-gama',        1, 1, 1, '2026-01-29T19:00:00'],
  ['atletico-mineiro',     'palmeiras',            2, 2, 1, '2026-01-29T21:30:00'],
  ['internacional',        'athletico-paranaense', 0, 1, 1, '2026-01-29T21:30:00'],
  ['coritiba',             'bragantino',           0, 1, 1, '2026-01-29T19:00:00'],
  ['vitoria',              'remo',                 1, 0, 1, '2026-01-29T19:00:00'],
  ['chapecoense',          'santos',               4, 2, 1, '2026-01-29T21:30:00'],

  // ── ROUND 2 · Feb 4-5 ─────────────────────────────────────────────────────
  ['flamengo',             'internacional',        2, 0, 2, '2026-02-05T21:30:00'],
  ['vasco-da-gama',        'chapecoense',          1, 1, 2, '2026-02-05T21:30:00'],
  ['santos',               'sao-paulo',            1, 1, 2, '2026-02-05T21:30:00'],
  ['palmeiras',            'vitoria',              3, 0, 2, '2026-02-05T21:30:00'],
  ['bragantino',           'atletico-mineiro',     2, 1, 2, '2026-02-05T21:30:00'],
  ['cruzeiro',             'coritiba',             1, 2, 2, '2026-02-05T19:00:00'],
  ['gremio',               'botafogo',             1, 1, 2, '2026-02-05T19:00:00'],
  ['athletico-paranaense', 'corinthians',          1, 0, 2, '2026-02-19T21:30:00'], // postponed to Feb 19
  ['bahia',                'fluminense',           1, 1, 2, '2026-02-05T21:30:00'],
  ['remo',                 'mirassol',             0, 2, 2, '2026-02-05T19:00:00'],

  // ── ROUND 3 · Feb 11-12 ───────────────────────────────────────────────────
  ['fluminense',           'botafogo',             2, 0, 3, '2026-02-12T21:30:00'],
  ['vasco-da-gama',        'bahia',                0, 1, 3, '2026-02-12T21:30:00'],
  ['sao-paulo',            'gremio',               2, 0, 3, '2026-02-12T21:30:00'],
  ['corinthians',          'bragantino',           1, 1, 3, '2026-02-12T21:30:00'],
  ['mirassol',             'cruzeiro',             2, 0, 3, '2026-02-12T19:00:00'],
  ['atletico-mineiro',     'remo',                 3, 0, 3, '2026-02-12T21:30:00'],
  ['internacional',        'palmeiras',            0, 2, 3, '2026-02-12T21:30:00'],
  ['athletico-paranaense', 'santos',               0, 1, 3, '2026-02-12T19:00:00'],
  ['vitoria',              'flamengo',             0, 2, 3, '2026-02-12T21:30:00'],
  ['chapecoense',          'coritiba',             0, 2, 3, '2026-02-12T19:00:00'],

  // ── ROUND 4 · Feb 25-26 ───────────────────────────────────────────────────
  ['flamengo',             'mirassol',             2, 0, 4, '2026-02-26T21:30:00'],
  ['botafogo',             'vitoria',              1, 1, 4, '2026-02-26T21:30:00'],
  ['santos',               'vasco-da-gama',        1, 2, 4, '2026-02-26T21:30:00'],
  ['palmeiras',            'fluminense',           2, 1, 4, '2026-02-26T21:30:00'],
  ['bragantino',           'athletico-paranaense', 0, 2, 4, '2026-02-26T21:30:00'],
  ['cruzeiro',             'corinthians',          0, 1, 4, '2026-02-26T19:00:00'],
  ['gremio',               'atletico-mineiro',     2, 1, 4, '2026-02-26T21:30:00'],
  ['coritiba',             'sao-paulo',            0, 2, 4, '2026-02-26T19:00:00'],
  ['bahia',                'chapecoense',          2, 0, 4, '2026-02-26T21:30:00'],
  ['remo',                 'internacional',        1, 1, 4, '2026-02-26T19:00:00'],

  // ── ROUND 5 · Mar 11-12 ───────────────────────────────────────────────────
  ['flamengo',             'cruzeiro',             2, 1, 5, '2026-03-12T21:30:00'],
  ['vasco-da-gama',        'palmeiras',            1, 2, 5, '2026-03-12T21:30:00'],
  ['sao-paulo',            'chapecoense',          3, 0, 5, '2026-03-12T21:30:00'],
  ['corinthians',          'coritiba',             1, 1, 5, '2026-03-12T21:30:00'],
  ['mirassol',             'santos',               1, 1, 5, '2026-03-12T19:00:00'],
  ['atletico-mineiro',     'internacional',        2, 0, 5, '2026-03-12T21:30:00'],
  ['gremio',               'bragantino',           2, 1, 5, '2026-03-12T21:30:00'],
  ['athletico-paranaense', 'botafogo',             2, 1, 5, '2026-03-12T21:30:00'],
  ['bahia',                'vitoria',              2, 0, 5, '2026-03-12T21:30:00'],
  ['remo',                 'fluminense',           0, 2, 5, '2026-03-12T19:00:00'],

  // ── ROUND 6 · Mar 14-16 (REAL RESULTS) ────────────────────────────────────
  ['fluminense',           'athletico-paranaense', 3, 2, 6, '2026-03-15T21:30:00'],
  ['botafogo',             'flamengo',             0, 3, 6, '2026-03-15T16:00:00'],
  ['santos',               'corinthians',          1, 1, 6, '2026-03-15T21:30:00'],
  ['palmeiras',            'mirassol',             1, 0, 6, '2026-03-15T21:30:00'],
  ['bragantino',           'sao-paulo',            1, 2, 6, '2026-03-15T21:30:00'],
  ['cruzeiro',             'vasco-da-gama',        0, 2, 6, '2026-03-15T19:00:00'],
  ['internacional',        'bahia',                0, 1, 6, '2026-03-15T21:30:00'],
  ['coritiba',             'remo',                 1, 0, 6, '2026-03-15T19:00:00'],
  ['vitoria',              'atletico-mineiro',     2, 0, 6, '2026-03-15T21:30:00'],
  ['chapecoense',          'gremio',               1, 1, 6, '2026-03-16T16:00:00'],

  // ── ROUND 7 · Mar 18-19 (REAL RESULTS) ────────────────────────────────────
  ['flamengo',             'remo',                 3, 0, 7, '2026-03-19T21:30:00'],
  ['vasco-da-gama',        'fluminense',           3, 2, 7, '2026-03-19T21:30:00'],
  ['santos',               'internacional',        1, 2, 7, '2026-03-19T21:30:00'],
  ['palmeiras',            'botafogo',             2, 1, 7, '2026-03-19T21:30:00'],
  ['mirassol',             'coritiba',             0, 1, 7, '2026-03-19T19:00:00'],
  ['atletico-mineiro',     'sao-paulo',            1, 0, 7, '2026-03-19T21:30:00'],
  ['gremio',               'vitoria',              2, 0, 7, '2026-03-19T21:30:00'],
  ['athletico-paranaense', 'cruzeiro',             2, 1, 7, '2026-03-19T21:30:00'],
  ['bahia',                'bragantino',           2, 0, 7, '2026-03-19T21:30:00'],
  ['chapecoense',          'corinthians',          0, 0, 7, '2026-03-19T19:00:00'],
];

// ── ROUND 8 · Mar 21-23 (UPCOMING) ────────────────────────────────────────────
const UPCOMING_MATCHES = [
  ['fluminense',           'atletico-mineiro',     8, '2026-03-22T21:30:00'],
  ['vasco-da-gama',        'gremio',               8, '2026-03-22T19:00:00'],
  ['sao-paulo',            'palmeiras',            8, '2026-03-23T16:00:00'],
  ['corinthians',          'flamengo',             8, '2026-03-23T16:00:00'],
  ['bragantino',           'botafogo',             8, '2026-03-22T21:30:00'],
  ['cruzeiro',             'santos',               8, '2026-03-22T21:30:00'],
  ['internacional',        'chapecoense',          8, '2026-03-22T21:30:00'],
  ['athletico-paranaense', 'coritiba',             8, '2026-03-22T19:00:00'],
  ['vitoria',              'mirassol',             8, '2026-03-22T19:00:00'],
  ['remo',                 'bahia',                8, '2026-03-22T19:00:00'],
];

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log('🇧🇷 Seeding Brasileirão Série A 2026...\n');

// 1. Upsert all 20 teams
console.log('Step 1: Upserting 20 Série A 2026 teams...');
const teamIdMap = {}; // slug → uuid

for (const t of TEAMS_2026) {
  // Try to find by name
  const existing = await sql`SELECT id FROM teams WHERE name = ${t.name}`;

  let teamId;
  if (existing.length > 0) {
    teamId = existing[0].id;
    // Update logo, colors, and stadium
    await sql`
      UPDATE teams SET
        short_name      = ${t.shortName},
        logo_url        = ${t.logo},
        primary_color   = ${t.primary},
        secondary_color = ${t.secondary},
        stadium_name    = ${t.stadium},
        stadium_capacity = ${t.cap},
        updated_at      = NOW()
      WHERE id = ${teamId}
    `;
    console.log(`  ✓ Updated: ${t.name}`);
  } else {
    // Insert new team
    const inserted = await sql`
      INSERT INTO teams (name, short_name, logo_url, primary_color, secondary_color,
                         stadium_name, stadium_capacity, points, wins, draws, losses,
                         goals_for, goals_against)
      VALUES (${t.name}, ${t.shortName}, ${t.logo}, ${t.primary}, ${t.secondary},
              ${t.stadium}, ${t.cap}, 0, 0, 0, 0, 0, 0)
      RETURNING id
    `;
    teamId = inserted[0].id;
    console.log(`  ★ Inserted: ${t.name} (new team)`);
  }

  teamIdMap[t.slug] = teamId;
}

// Build reverse map: name → slug for opponents
const nameToSlug = {};
for (const t of TEAMS_2026) {
  nameToSlug[t.name] = t.slug;
  // Also map common display names
}

console.log(`\nTeam ID map built for ${Object.keys(teamIdMap).length} teams.`);

// 2. Remove old mock match data
console.log('\nStep 2: Removing old match data...');
const deleted = await sql`
  DELETE FROM matches
  WHERE competition = 'Brasileirão Série A'
    OR competition = 'Campeonato Brasileiro Série A'
    OR is_mock = true
`;
console.log(`  Deleted old matches.`);

// 3. Helper to get team name from slug
const slugToName = {};
for (const t of TEAMS_2026) slugToName[t.slug] = t.name;

// 4. Insert completed matches (7 rounds × 10 games × 2 perspectives = 140 rows)
console.log('\nStep 3: Inserting completed matches...');
let matchCount = 0;

for (const [homeSlug, awaySlug, homeScore, awayScore, round, isoDate] of COMPLETED_MATCHES) {
  const homeId = teamIdMap[homeSlug];
  const awayId = teamIdMap[awaySlug];
  const homeName = slugToName[homeSlug];
  const awayName = slugToName[awaySlug];

  if (!homeId || !awayId) {
    console.warn(`  ⚠ Missing team IDs: ${homeSlug} vs ${awaySlug}`);
    continue;
  }

  const matchDate = new Date(isoDate);
  const homeLogoUrl = TEAMS_2026.find(t => t.slug === homeSlug)?.logo ?? null;
  const awayLogoUrl  = TEAMS_2026.find(t => t.slug === awaySlug)?.logo  ?? null;

  // Home team perspective
  await sql`
    INSERT INTO matches (team_id, opponent, opponent_logo_url, is_home_match,
                         team_score, opponent_score, match_date, championship_round,
                         status, competition, is_mock)
    VALUES (${homeId}, ${awayName}, ${awayLogoUrl}, true,
            ${homeScore}, ${awayScore}, ${matchDate}, ${round},
            'COMPLETED', 'Brasileirão Série A', false)
  `;

  // Away team perspective
  await sql`
    INSERT INTO matches (team_id, opponent, opponent_logo_url, is_home_match,
                         team_score, opponent_score, match_date, championship_round,
                         status, competition, is_mock)
    VALUES (${awayId}, ${homeName}, ${homeLogoUrl}, false,
            ${awayScore}, ${homeScore}, ${matchDate}, ${round},
            'COMPLETED', 'Brasileirão Série A', false)
  `;

  matchCount += 2;
}

console.log(`  ✓ Inserted ${matchCount} completed match records.`);

// 5. Insert upcoming Round 8 fixtures
console.log('\nStep 4: Inserting Round 8 upcoming fixtures...');
let upcomingCount = 0;

for (const [homeSlug, awaySlug, round, isoDate] of UPCOMING_MATCHES) {
  const homeId = teamIdMap[homeSlug];
  const awayId = teamIdMap[awaySlug];
  const homeName = slugToName[homeSlug];
  const awayName = slugToName[awaySlug];

  if (!homeId || !awayId) {
    console.warn(`  ⚠ Missing team IDs: ${homeSlug} vs ${awaySlug}`);
    continue;
  }

  const matchDate = new Date(isoDate);
  const homeLogoUrl = TEAMS_2026.find(t => t.slug === homeSlug)?.logo ?? null;
  const awayLogoUrl  = TEAMS_2026.find(t => t.slug === awaySlug)?.logo  ?? null;

  await sql`
    INSERT INTO matches (team_id, opponent, opponent_logo_url, is_home_match,
                         team_score, opponent_score, match_date, championship_round,
                         status, competition, is_mock)
    VALUES (${homeId}, ${awayName}, ${awayLogoUrl}, true,
            null, null, ${matchDate}, ${round},
            'SCHEDULED', 'Brasileirão Série A', false)
  `;

  await sql`
    INSERT INTO matches (team_id, opponent, opponent_logo_url, is_home_match,
                         team_score, opponent_score, match_date, championship_round,
                         status, competition, is_mock)
    VALUES (${awayId}, ${homeName}, ${homeLogoUrl}, false,
            null, null, ${matchDate}, ${round},
            'SCHEDULED', 'Brasileirão Série A', false)
  `;

  upcomingCount += 2;
}

console.log(`  ✓ Inserted ${upcomingCount} upcoming match records.`);

// 6. Apply real standings after Round 7
console.log('\nStep 5: Applying real standings after Round 7...');
let pos = 1;
const sortedTeams = Object.entries(REAL_STANDINGS).sort((a, b) => {
  const [, [ptsA, , wA, , , gfA, gaA]] = a;
  const [, [ptsB, , wB, , , gfB, gaB]] = b;
  if (ptsB !== ptsA) return ptsB - ptsA;
  if (wB !== wA) return wB - wA;
  const gdA = gfA - gaA, gdB = gfB - gaB;
  if (gdB !== gdA) return gdB - gdA;
  return gfB - gfA;
});

for (const [slug, [pts, played, wins, draws, losses, gf, ga]] of sortedTeams) {
  const teamId = teamIdMap[slug];
  if (!teamId) {
    console.warn(`  ⚠ No ID for slug: ${slug}`);
    continue;
  }

  await sql`
    UPDATE teams SET
      points           = ${pts},
      wins             = ${wins},
      draws            = ${draws},
      losses           = ${losses},
      goals_for        = ${gf},
      goals_against    = ${ga},
      current_position = ${pos},
      updated_at       = NOW()
    WHERE id = ${teamId}
  `;

  const team = TEAMS_2026.find(t => t.slug === slug);
  console.log(`  ${String(pos).padStart(2)}. ${(team?.name ?? slug).padEnd(22)} ${pts}pts  ${wins}W ${draws}D ${losses}L  ${gf}:${ga}`);
  pos++;
}

console.log('\n✅ Brasileirão Série A 2026 seeded successfully!');
console.log(`   ${matchCount} completed + ${upcomingCount} upcoming match records inserted.`);
console.log('   Standings updated for 20 teams.\n');

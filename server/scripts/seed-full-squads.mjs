/**
 * Seed full squads for all teams from API-Football (/players/squads).
 * Handles shirt-number uniqueness by nulling duplicates.
 * Run: node server/scripts/seed-full-squads.mjs
 */

import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  "postgresql://neondb_owner:npg_mn83QyKUtjBg@ep-crimson-wildflower-ah6kfndd.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const API_KEY = "d7cbe0c37195f65848b64d7b49cb0ee8";
const BASE_URL = "https://v3.football.api-sports.io";

const sql = neon(DATABASE_URL);
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// DB team name → API-Football team ID (+ fallback league for paginated endpoint)
const TEAM_API_MAP = [
  { dbName: "Atlético Mineiro",     apiId: 1062, league: 71,  season: 2024 },
  { dbName: "Flamengo",             apiId: 127,  league: 71,  season: 2024 },
  { dbName: "Palmeiras",            apiId: 121,  league: 71,  season: 2024 },
  { dbName: "Corinthians",          apiId: 131,  league: 71,  season: 2024 },
  { dbName: "Botafogo",             apiId: 120,  league: 71,  season: 2024 },
  { dbName: "Fluminense",           apiId: 124,  league: 71,  season: 2024 },
  { dbName: "São Paulo",            apiId: 126,  league: 71,  season: 2024 },
  { dbName: "Internacional",        apiId: 119,  league: 71,  season: 2024 },
  { dbName: "Grêmio",              apiId: 130,  league: 71,  season: 2024 },
  { dbName: "Cruzeiro",             apiId: 135,  league: 71,  season: 2024 },
  { dbName: "Bahia",                apiId: 118,  league: 71,  season: 2024 },
  { dbName: "Fortaleza",            apiId: 154,  league: 71,  season: 2024 },
  { dbName: "Vasco da Gama",        apiId: 133,  league: 71,  season: 2024 },
  { dbName: "Athletico Paranaense", apiId: 134,  league: 71,  season: 2024 },
  { dbName: "RB Bragantino",        apiId: 794,  league: 71,  season: 2024 },
  { dbName: "Cuiabá",              apiId: 1193, league: 71,  season: 2024 },
  { dbName: "Santos",               apiId: 152,  league: 75,  season: 2024 },
  { dbName: "América Mineiro",      apiId: 143,  league: 75,  season: 2024 },
  { dbName: "Coritiba",             apiId: 148,  league: 75,  season: 2024 },
  { dbName: "Goiás",               apiId: 142,  league: 75,  season: 2024 },
  { dbName: "Bragantino",           apiId: null, league: null, season: null },
  { dbName: "São Bernardo",         apiId: 12570,league: 75,  season: 2024 },
  { dbName: "Capivariano",          apiId: null, league: null, season: null },
];

function mapPosition(apiPos) {
  if (!apiPos) return "MID";
  const p = apiPos.toLowerCase();
  if (p.includes("goalkeeper") || p === "g") return "GK";
  if (p.includes("defender") || p === "d") return "DEF";
  if (p.includes("midfielder") || p === "m") return "MID";
  if (p.includes("attacker") || p === "f" || p.includes("forward")) return "FWD";
  return "MID";
}

async function apiFetch(path) {
  await delay(6500);
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-apisports-key": API_KEY },
  });
  const data = await res.json();
  if (data.errors?.rateLimit) {
    console.warn("  ⏳ Rate limit — waiting 65s...");
    await delay(65000);
    return apiFetch(path);
  }
  return data;
}

async function fetchSquad(apiTeamId) {
  const data = await apiFetch(`/players/squads?team=${apiTeamId}`);
  return data.response?.[0]?.players || [];
}

async function seedTeam(teamMapping) {
  const { dbName, apiId, league, season } = teamMapping;

  const [dbTeam] = await sql`SELECT id FROM teams WHERE name = ${dbName} LIMIT 1`;
  if (!dbTeam) {
    console.log(`  ⚠️  Not in DB: ${dbName}`);
    return 0;
  }
  const teamId = dbTeam.id;

  // Load shirt numbers already in use for this team
  const existing = await sql`
    SELECT name, shirt_number FROM players WHERE team_id = ${teamId}
  `;
  const existingNames = new Set(existing.map((p) => p.name?.toLowerCase()));
  const usedShirtNumbers = new Set(
    existing.map((p) => p.shirt_number).filter(Boolean)
  );

  let rawPlayers = [];

  if (apiId) {
    // /players/squads — single call, full squad
    rawPlayers = await fetchSquad(apiId);
    console.log(`  📋 /squads → ${rawPlayers.length} players`);

    // Squad endpoint format: { id, name, age, number, position, photo }
    rawPlayers = rawPlayers.map((p) => ({
      name: p.name,
      photo_url: p.photo || `https://media.api-sports.io/football/players/${p.id}.png`,
      position: mapPosition(p.position),
      shirt_number: p.number ?? null,
      birth_date: null,
      nationality: null,
      height_cm: null,
    }));
  }

  // Fallback: TheSportsDB
  if (rawPlayers.length === 0) {
    console.log(`  🌐 TheSportsDB fallback for ${dbName}...`);
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(dbName)}`
    );
    const td = await res.json();
    const team = (td.teams || []).find((t) => t.strCountry === "Brazil") || td.teams?.[0];
    if (team?.idTeam) {
      await delay(400);
      const pr = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php?id=${team.idTeam}`
      );
      const pd = await pr.json();
      rawPlayers = (pd.player || []).map((p) => ({
        name: p.strPlayer,
        photo_url: p.strThumb || p.strCutout || null,
        position: mapPosition(p.strPosition),
        shirt_number: p.strNumber ? parseInt(p.strNumber) : null,
        birth_date: p.dateBorn || null,
        nationality: p.strNationality || null,
        height_cm: null,
      }));
      console.log(`  📋 TheSportsDB → ${rawPlayers.length} players`);
    }
  }

  if (rawPlayers.length === 0) {
    console.log(`  ⚠️  No players found for ${dbName}`);
    return 0;
  }

  // Deduplicate shirt numbers WITHIN this batch + against existing DB players
  let added = 0;
  for (const p of rawPlayers) {
    if (!p.name) continue;

    // Skip if name already in DB (case-insensitive)
    if (existingNames.has(p.name.toLowerCase())) continue;

    // Resolve shirt number conflict
    let shirtNum = p.shirt_number;
    if (shirtNum !== null && usedShirtNumbers.has(shirtNum)) {
      shirtNum = null; // null it out — duplicate within squad
    }
    if (shirtNum !== null) usedShirtNumbers.add(shirtNum);

    // Sanitize birth date
    let birthDate = p.birth_date || "2000-01-01";
    try {
      const d = new Date(birthDate);
      if (isNaN(d.getTime())) birthDate = "2000-01-01";
    } catch {
      birthDate = "2000-01-01";
    }

    try {
      await sql`
        INSERT INTO players (
          team_id, name, position, primary_position, shirt_number,
          birth_date, nationality_primary, height_cm,
          photo_url, created_at, updated_at
        ) VALUES (
          ${teamId},
          ${p.name},
          ${p.position || "MID"},
          ${p.position || "MID"},
          ${shirtNum},
          ${birthDate},
          ${p.nationality || "Brasileiro"},
          ${p.height_cm || null},
          ${p.photo_url || null},
          NOW(), NOW()
        )
      `;
      existingNames.add(p.name.toLowerCase());
      added++;
    } catch (err) {
      if (err.message?.includes("unique constraint")) {
        // Last resort: insert with NULL shirt number
        try {
          await sql`
            INSERT INTO players (
              team_id, name, position, primary_position, shirt_number,
              birth_date, nationality_primary, photo_url, created_at, updated_at
            ) VALUES (
              ${teamId}, ${p.name}, ${p.position || "MID"}, ${p.position || "MID"},
              NULL, ${birthDate}, ${p.nationality || "Brasileiro"},
              ${p.photo_url || null}, NOW(), NOW()
            )
          `;
          existingNames.add(p.name.toLowerCase());
          added++;
        } catch (e2) {
          console.warn(`    ⚠️  Could not insert ${p.name}: ${e2.message}`);
        }
      } else {
        console.warn(`    ⚠️  Error inserting ${p.name}: ${err.message}`);
      }
    }
  }

  return added;
}

async function main() {
  // Check quota
  const status = await apiFetch("/status");
  const used = status.response?.requests?.current ?? 0;
  const limit = status.response?.requests?.limit_day ?? 100;
  console.log(`🚀 Seeding squads — API quota: ${used}/${limit}\n`);

  if (used > 85) {
    console.error("❌ API limit almost reached. Try tomorrow.");
    process.exit(1);
  }

  let totalAdded = 0;

  for (const mapping of TEAM_API_MAP) {
    console.log(`\n🏟️  ${mapping.dbName}`);
    try {
      const added = await seedTeam(mapping);
      totalAdded += added;
      console.log(`  ✅ +${added} novos jogadores`);
    } catch (err) {
      console.error(`  ❌ ${mapping.dbName}: ${err.message}`);
    }
  }

  // Summary
  console.log("\n\n📊 Jogadores por time:");
  const byTeam = await sql`
    SELECT t.name, COUNT(p.id) as total, COUNT(p.photo_url) as with_photo
    FROM teams t
    LEFT JOIN players p ON p.team_id = t.id
    GROUP BY t.id, t.name
    ORDER BY total DESC
  `;
  byTeam.forEach((r) =>
    console.log(`  ${r.name}: ${r.total} jogadores (${r.with_photo} com foto)`)
  );

  const grand = await sql`SELECT COUNT(*) as c FROM players`;
  console.log(`\n✅ Total no banco: ${grand[0].c} jogadores (+${totalAdded} novos nessa execução)`);

  const finalStatus = await apiFetch("/status");
  console.log(`📊 API requests usados: ${finalStatus.response?.requests?.current}/${limit}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

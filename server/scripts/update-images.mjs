/**
 * Script to update team logos and player photos from API-Football
 * Run: node server/scripts/update-images.mjs
 */

import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_mn83QyKUtjBg@ep-crimson-wildflower-ah6kfndd.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const API_KEY = "d7cbe0c37195f65848b64d7b49cb0ee8";
const BASE_URL = "https://v3.football.api-sports.io";
const LEAGUE = 71;  // Brazil Serie A
const SEASON = 2024;

const sql = neon(DATABASE_URL);

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-apisports-key": API_KEY }
  });
  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    console.warn("API errors:", data.errors);
  }
  return data;
}

// Normalize names for fuzzy matching
function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Manual overrides for team name mapping (API name → DB name)
const TEAM_NAME_MAP = {
  "atletico-mg": "Atlético Mineiro",
  "atletico mg": "Atlético Mineiro",
  "atletico mineiro": "Atlético Mineiro",
  "sao paulo": "São Paulo",
  "gremio": "Grêmio",
  "vasco da gama": "Vasco da Gama",
  "atletico paranaense": "Athletico Paranaense",
  "fortaleza ec": "Fortaleza",
  "rb bragantino": "RB Bragantino",
  "cuiaba": "Cuiabá",
  "botafogo": "Botafogo",
  "flamengo": "Flamengo",
  "palmeiras": "Palmeiras",
  "fluminense": "Fluminense",
  "internacional": "Internacional",
  "corinthians": "Corinthians",
  "cruzeiro": "Cruzeiro",
  "bahia": "Bahia",
  "vitoria": "Vitória",
  "criciuma": "Criciúma",
  "juventude": "Juventude",
  "atletico goianiense": "Atlético Goianiense",
};

async function updateTeamLogos() {
  console.log("\n🏟️  Updating team logos...");

  const apiData = await apiFetch(`/teams?league=${LEAGUE}&season=${SEASON}`);
  const apiTeams = apiData.response || [];
  console.log(`  Got ${apiTeams.length} teams from API-Football`);

  const dbTeams = await sql`SELECT id, name, logo_url FROM teams`;
  console.log(`  Got ${dbTeams.length} teams from DB`);

  let updated = 0;
  let skipped = 0;

  for (const apiTeam of apiTeams) {
    const apiName = normalize(apiTeam.team.name);
    const logoUrl = apiTeam.team.logo;

    // Try to find DB team by name mapping or normalized name
    let dbTeam = null;

    // Check manual map first
    const mappedName = TEAM_NAME_MAP[apiName];
    if (mappedName) {
      dbTeam = dbTeams.find(t => t.name === mappedName);
    }

    // Fallback: fuzzy normalize match
    if (!dbTeam) {
      dbTeam = dbTeams.find(t => normalize(t.name) === apiName);
    }

    // Fallback: partial match
    if (!dbTeam) {
      dbTeam = dbTeams.find(t => apiName.includes(normalize(t.name)) || normalize(t.name).includes(apiName));
    }

    if (!dbTeam) {
      console.log(`  ⚠️  No match for API team: "${apiTeam.team.name}" (normalized: "${apiName}")`);
      skipped++;
      continue;
    }

    // Update logo_url and crest_url
    await sql`
      UPDATE teams
      SET logo_url = ${logoUrl}, crest_url = ${logoUrl}, updated_at = NOW()
      WHERE id = ${dbTeam.id}
    `;
    console.log(`  ✅ ${dbTeam.name} → ${logoUrl}`);
    updated++;
  }

  console.log(`  Done: ${updated} updated, ${skipped} skipped\n`);
  return apiTeams.map(r => ({ apiId: r.team.id, apiName: r.team.name, logo: r.team.logo }));
}

async function updatePlayerPhotos(apiTeams) {
  console.log("\n👤 Updating player photos...");

  const dbPlayers = await sql`SELECT id, name, team_id FROM players`;
  const dbTeams = await sql`SELECT id, name FROM teams`;

  // Build map of dbTeamId → apiTeamId
  const teamIdMap = new Map();
  for (const apiTeam of apiTeams) {
    const apiName = normalize(apiTeam.apiName);
    const mappedName = TEAM_NAME_MAP[apiName];

    let dbTeam = null;
    if (mappedName) dbTeam = dbTeams.find(t => t.name === mappedName);
    if (!dbTeam) dbTeam = dbTeams.find(t => normalize(t.name) === apiName);
    if (!dbTeam) dbTeam = dbTeams.find(t => apiName.includes(normalize(t.name)) || normalize(t.name).includes(apiName));

    if (dbTeam) {
      teamIdMap.set(dbTeam.id, apiTeam.apiId);
    }
  }

  let totalUpdated = 0;
  let callCount = 0;

  for (const [dbTeamId, apiTeamId] of teamIdMap) {
    const dbTeam = dbTeams.find(t => t.id === dbTeamId);
    console.log(`\n  🔍 Fetching players for ${dbTeam?.name} (API ID: ${apiTeamId})...`);

    const playersInTeam = dbPlayers.filter(p => p.team_id === dbTeamId);
    if (playersInTeam.length === 0) {
      console.log(`    No players in DB for this team, skipping.`);
      continue;
    }

    // Fetch players from API (page 1, typically 20 players)
    const data = await apiFetch(`/players?team=${apiTeamId}&season=${SEASON}`);
    callCount++;

    const apiPlayers = data.response || [];
    const totalPages = data.paging?.total || 1;
    let allApiPlayers = [...apiPlayers];

    // Fetch additional pages if needed
    for (let page = 2; page <= totalPages && page <= 3; page++) {
      await delay(300);
      const pageData = await apiFetch(`/players?team=${apiTeamId}&season=${SEASON}&page=${page}`);
      callCount++;
      allApiPlayers = [...allApiPlayers, ...(pageData.response || [])];
    }

    console.log(`    Got ${allApiPlayers.length} players from API`);

    // Match and update
    let teamUpdated = 0;
    for (const dbPlayer of playersInTeam) {
      const dbNorm = normalize(dbPlayer.name);

      const match = allApiPlayers.find(ap => {
        const apiNorm = normalize(ap.player.name);
        const apiFirstnameNorm = normalize(ap.player.firstname || "");
        const apiLastnameNorm = normalize(ap.player.lastname || "");
        return (
          apiNorm === dbNorm ||
          apiNorm.includes(dbNorm) ||
          dbNorm.includes(apiNorm) ||
          (apiLastnameNorm && dbNorm.includes(apiLastnameNorm)) ||
          (apiFirstnameNorm && dbNorm.includes(apiFirstnameNorm) && apiLastnameNorm && dbNorm.includes(apiLastnameNorm))
        );
      });

      if (match && match.player.photo) {
        await sql`
          UPDATE players
          SET photo_url = ${match.player.photo}, updated_at = NOW()
          WHERE id = ${dbPlayer.id}
        `;
        console.log(`    ✅ ${dbPlayer.name} → ${match.player.photo}`);
        teamUpdated++;
        totalUpdated++;
      } else {
        console.log(`    ⚠️  No API match for player: ${dbPlayer.name}`);
      }
    }

    console.log(`    ${teamUpdated}/${playersInTeam.length} players updated for ${dbTeam?.name}`);
    await delay(300); // be nice to the API
  }

  console.log(`\n  Done: ${totalUpdated} player photos updated (${callCount} API calls used)`);
}

async function main() {
  console.log("🚀 Starting image update from API-Football...");

  // Check quota
  const status = await apiFetch("/status");
  const used = status.response?.requests?.current || 0;
  const limit = status.response?.requests?.limit_day || 100;
  console.log(`📊 API quota: ${used}/${limit} requests used today`);

  if (used > 80) {
    console.error("❌ Too close to API limit, aborting. Try again tomorrow.");
    process.exit(1);
  }

  // Step 1: Update team logos
  const apiTeams = await updateTeamLogos();

  // Step 2: Update player photos
  await updatePlayerPhotos(apiTeams);

  // Final status
  const finalStatus = await apiFetch("/status");
  console.log(`\n✅ Done! API requests used: ${finalStatus.response?.requests?.current}/${limit}`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

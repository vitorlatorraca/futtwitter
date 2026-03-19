/**
 * Final patch: fetch remaining missing players team by team
 */

import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_mn83QyKUtjBg@ep-crimson-wildflower-ah6kfndd.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const API_KEY = "d7cbe0c37195f65848b64d7b49cb0ee8";
const BASE_URL = "https://v3.football.api-sports.io";
const SEASON = 2024;

const sql = neon(DATABASE_URL);

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function apiFetch(path) {
  await delay(7000);
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-apisports-key": API_KEY }
  });
  const data = await res.json();
  if (data.errors?.rateLimit) {
    console.warn("  ⏳ Rate limit, waiting 65s...");
    await delay(65000);
    return apiFetch(path);
  }
  return data;
}

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/-/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function matchPlayer(dbName, apiPlayers) {
  const dbNorm = normalize(dbName);
  // Try exact, contains, partial last name
  return apiPlayers.find(ap => {
    if (!ap.player) return false;
    const apiNorm = normalize(ap.player.name || "");
    const first = normalize(ap.player.firstname || "");
    const last = normalize(ap.player.lastname || "");
    const fullApi = (first + " " + last).trim();

    if (apiNorm === dbNorm) return true;
    if (fullApi === dbNorm) return true;
    if (apiNorm.includes(dbNorm) || dbNorm.includes(apiNorm)) return true;
    if (last.length > 4 && dbNorm.endsWith(last)) return true;
    if (last.length > 4 && dbNorm.includes(last) && dbNorm.length - last.length < 8) return true;
    return false;
  });
}

async function fetchAllPlayersForTeam(apiTeamId) {
  const all = [];
  const page1 = await apiFetch(`/players?team=${apiTeamId}&season=${SEASON}`);
  all.push(...(page1.response || []));
  const totalPages = page1.paging?.total || 1;
  for (let p = 2; p <= Math.min(totalPages, 5); p++) {
    const pd = await apiFetch(`/players?team=${apiTeamId}&season=${SEASON}&page=${p}`);
    all.push(...(pd.response || []));
  }
  return all;
}

async function updateTeamPlayers(dbTeamName, apiTeamId) {
  console.log(`\n🔍 ${dbTeamName} (API: ${apiTeamId})...`);
  const dbTeam = await sql`SELECT id FROM teams WHERE name = ${dbTeamName} LIMIT 1`;
  if (!dbTeam.length) { console.log("  Not found in DB"); return 0; }

  const missingPlayers = await sql`
    SELECT id, name FROM players
    WHERE team_id = ${dbTeam[0].id}
    AND (photo_url IS NULL OR photo_url = '')
  `;
  if (!missingPlayers.length) { console.log("  All players have photos ✅"); return 0; }
  console.log(`  Missing: ${missingPlayers.map(p => p.name).join(", ")}`);

  const apiPlayers = await fetchAllPlayersForTeam(apiTeamId);
  console.log(`  API returned ${apiPlayers.length} players`);

  let updated = 0;
  for (const dbPlayer of missingPlayers) {
    const match = matchPlayer(dbPlayer.name, apiPlayers);
    if (match?.player?.photo) {
      await sql`UPDATE players SET photo_url = ${match.player.photo}, updated_at = NOW() WHERE id = ${dbPlayer.id}`;
      console.log(`  ✅ ${dbPlayer.name} → ${match.player.photo}`);
      updated++;
    } else {
      // Show closest API names for debugging
      const norm = normalize(dbPlayer.name);
      const close = apiPlayers
        .filter(ap => ap.player)
        .map(ap => normalize(ap.player.name || ""))
        .filter(n => n.split(" ").some(w => w.length > 3 && norm.includes(w)));
      console.log(`  ❌ ${dbPlayer.name} | API closest: ${close.slice(0, 3).join(", ") || "none"}`);
    }
  }
  return updated;
}

async function main() {
  console.log("🚀 Final player photo patch\n");

  let total = 0;

  // Teams with missing players + their API-Football IDs
  const teams = [
    { name: "Palmeiras",         apiId: 121 },
    { name: "Atlético Mineiro",  apiId: 1062 },
    { name: "Santos",            apiId: 152 },  // Santos was in Serie B 2024, try 2023
    { name: "São Paulo",         apiId: 126 },
    { name: "Corinthians",       apiId: 131 },
  ];

  for (const team of teams) {
    total += await updateTeamPlayers(team.name, team.apiId);
  }

  // Try Santos with 2023 season separately
  const santosMissing = await sql`
    SELECT p.id, p.name FROM players p
    JOIN teams t ON p.team_id = t.id
    WHERE t.name = 'Santos' AND (p.photo_url IS NULL OR p.photo_url = '')
  `;
  if (santosMissing.length > 0) {
    console.log(`\n🔍 Santos (trying 2023 season)...`);
    await delay(7000);
    const data = await fetch(`https://v3.football.api-sports.io/players?team=152&season=2023`, {
      headers: { "x-apisports-key": API_KEY }
    });
    const santos2023 = await data.json();
    const apiPlayers = santos2023.response || [];
    console.log(`  Got ${apiPlayers.length} players from 2023`);
    for (const dbPlayer of santosMissing) {
      const match = matchPlayer(dbPlayer.name, apiPlayers);
      if (match?.player?.photo) {
        await sql`UPDATE players SET photo_url = ${match.player.photo}, updated_at = NOW() WHERE id = ${dbPlayer.id}`;
        console.log(`  ✅ ${dbPlayer.name} → ${match.player.photo}`);
        total++;
      }
    }
  }

  // Final summary
  const stats = await sql`SELECT COUNT(*) as total, COUNT(photo_url) as with_photo FROM players`;
  const still = await sql`
    SELECT p.name, t.name as team FROM players p
    JOIN teams t ON p.team_id = t.id
    WHERE p.photo_url IS NULL OR p.photo_url = ''
    ORDER BY t.name, p.name
  `;

  console.log(`\n✅ Added ${total} more photos`);
  console.log(`📊 Total: ${stats[0].with_photo}/${stats[0].total} players have photos`);
  if (still.length) {
    console.log(`\n⚠️  Still missing (${still.length}):`);
    still.forEach(p => console.log(`  - ${p.name} (${p.team})`));
  } else {
    console.log("🎉 All players have photos!");
  }
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });

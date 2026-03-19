/**
 * Fix script: update Atletico-MG logo + all Corinthians player photos
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
  await delay(6500); // 6.5s = well under 10/min rate limit
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-apisports-key": API_KEY }
  });
  const data = await res.json();
  if (data.errors && Object.keys(data.errors).length > 0 && data.errors.rateLimit) {
    console.warn("  ⏳ Rate limit hit, waiting 60s...");
    await delay(60000);
    return apiFetch(path);
  }
  return data;
}

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/-/g, " ") // replace hyphen with space FIRST
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  console.log("🔧 Fix script: Atletico-MG logo + Corinthians players\n");

  // 1. Fix Atletico-MG logo
  console.log("🏟️  Fixing Atletico-MG logo...");
  const atleticoMG = await sql`SELECT id, name FROM teams WHERE name ILIKE '%Atl%tico Mineiro%' LIMIT 1`;
  if (atleticoMG.length > 0) {
    await sql`
      UPDATE teams
      SET logo_url = 'https://media.api-sports.io/football/teams/1062.png',
          crest_url = 'https://media.api-sports.io/football/teams/1062.png',
          updated_at = NOW()
      WHERE id = ${atleticoMG[0].id}
    `;
    console.log(`  ✅ ${atleticoMG[0].name} → https://media.api-sports.io/football/teams/1062.png`);
  }

  // Also fix unmatched teams (Vitória, Criciúma, etc.) using known API IDs
  const missingTeams = [
    { name: "Vitória", apiId: 136 },
    { name: "Criciúma", apiId: 140 },
    // Goiás not in 2024 Serie A, try anyway
  ];
  for (const mt of missingTeams) {
    const dbTeam = await sql`SELECT id FROM teams WHERE name = ${mt.name} LIMIT 1`;
    if (dbTeam.length > 0) {
      const logoUrl = `https://media.api-sports.io/football/teams/${mt.apiId}.png`;
      await sql`UPDATE teams SET logo_url = ${logoUrl}, crest_url = ${logoUrl}, updated_at = NOW() WHERE id = ${dbTeam[0].id}`;
      console.log(`  ✅ ${mt.name} → ${logoUrl}`);
    }
  }

  // 2. Get Corinthians players from API
  console.log("\n👤 Fetching Corinthians players (API team 131)...");
  const page1 = await apiFetch(`/players?team=131&season=${SEASON}`);
  let allApiPlayers = [...(page1.response || [])];
  const totalPages = page1.paging?.total || 1;
  console.log(`  Page 1: ${page1.response?.length || 0} players, total pages: ${totalPages}`);

  for (let page = 2; page <= Math.min(totalPages, 4); page++) {
    const pageData = await apiFetch(`/players?team=131&season=${SEASON}&page=${page}`);
    allApiPlayers = [...allApiPlayers, ...(pageData.response || [])];
    console.log(`  Page ${page}: ${pageData.response?.length || 0} players`);
  }

  console.log(`  Total API players for Corinthians: ${allApiPlayers.length}`);
  if (allApiPlayers.length > 0) {
    console.log("  Sample names:", allApiPlayers.slice(0, 5).map(p => p.player.name).join(", "));
  }

  // 3. Get DB Corinthians players
  const corinthiansTeam = await sql`SELECT id FROM teams WHERE name = 'Corinthians' LIMIT 1`;
  if (corinthiansTeam.length === 0) {
    console.error("Corinthians not found in DB!");
    return;
  }

  const dbPlayers = await sql`SELECT id, name FROM players WHERE team_id = ${corinthiansTeam[0].id}`;
  console.log(`\n  DB players for Corinthians: ${dbPlayers.length}`);

  let updated = 0;
  for (const dbPlayer of dbPlayers) {
    const dbNorm = normalize(dbPlayer.name);

    const match = allApiPlayers.find(ap => {
      const apiNorm = normalize(ap.player.name);
      const apiLastname = normalize(ap.player.lastname || "");
      const apiFirstname = normalize(ap.player.firstname || "");

      if (apiNorm === dbNorm) return true;
      if (apiNorm.includes(dbNorm) || dbNorm.includes(apiNorm)) return true;
      // Match by last name if it's distinctive (>4 chars)
      if (apiLastname.length > 4 && dbNorm.includes(apiLastname)) return true;
      return false;
    });

    if (match && match.player.photo) {
      await sql`UPDATE players SET photo_url = ${match.player.photo}, updated_at = NOW() WHERE id = ${dbPlayer.id}`;
      console.log(`  ✅ ${dbPlayer.name} → ${match.player.photo}`);
      updated++;
    } else {
      // Try to find via API player search by name
      console.log(`  ⚠️  No match: ${dbPlayer.name} (normalized: ${dbNorm})`);
    }
  }
  console.log(`\n  ${updated}/${dbPlayers.length} Corinthians players updated`);

  // 4. Quick lookup for specific players that didn't match
  console.log("\n🔍 Searching for unmatched Corinthians players individually...");
  const unmatched = dbPlayers.filter(p => !allApiPlayers.some(ap => {
    const apiNorm = normalize(ap.player.name);
    const dbNorm = normalize(p.name);
    return apiNorm === dbNorm || apiNorm.includes(dbNorm) || dbNorm.includes(apiNorm);
  }));

  // For key players we know, use direct API search
  const targetPlayers = [
    { dbName: "Memphis Depay", searchName: "Memphis" },
    { dbName: "Yuri Alberto", searchName: "Yuri Alberto" },
    { dbName: "Rodrigo Garro", searchName: "Rodrigo Garro" },
  ];

  for (const tp of targetPlayers) {
    const dbPlayer = dbPlayers.find(p => p.name === tp.dbName);
    if (!dbPlayer) continue;

    const searchData = await apiFetch(`/players?search=${encodeURIComponent(tp.searchName)}&league=71&season=${SEASON}`);
    const apiPlayers = searchData.response || [];
    if (apiPlayers.length > 0 && apiPlayers[0].player.photo) {
      const photo = apiPlayers[0].player.photo;
      await sql`UPDATE players SET photo_url = ${photo}, updated_at = NOW() WHERE id = ${dbPlayer.id}`;
      console.log(`  ✅ ${tp.dbName} (search) → ${photo}`);
      updated++;
    } else {
      console.log(`  ❌ ${tp.dbName}: not found via search`);
    }
  }

  // Show final stats
  const stats = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(photo_url) as with_photo,
      COUNT(*) - COUNT(photo_url) as without_photo
    FROM players
  `;
  console.log(`\n📊 Final player photo stats:`);
  console.log(`  Total players: ${stats[0].total}`);
  console.log(`  With photo: ${stats[0].with_photo}`);
  console.log(`  Without photo: ${stats[0].without_photo}`);

  const teamStats = await sql`
    SELECT t.name, COUNT(p.id) as total, COUNT(p.photo_url) as with_photo
    FROM teams t
    LEFT JOIN players p ON p.team_id = t.id
    GROUP BY t.id, t.name
    HAVING COUNT(p.id) > 0
    ORDER BY t.name
  `;
  console.log("\n📊 Players per team with photos:");
  teamStats.forEach(ts => console.log(`  ${ts.name}: ${ts.with_photo}/${ts.total}`));
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});

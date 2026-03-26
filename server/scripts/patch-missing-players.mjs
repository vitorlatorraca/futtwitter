/**
 * Patch missing player photos using API-Football search
 * and known manual photo URLs for famous players
 */

import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_mn83QyKUtjBg@ep-crimson-wildflower-ah6kfndd.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const API_KEY = "d7cbe0c37195f65848b64d7b49cb0ee8";
const BASE_URL = "https://v3.football.api-sports.io";

const sql = neon(DATABASE_URL);

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function apiFetch(path) {
  await delay(7000); // safe rate limit
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-apisports-key": API_KEY }
  });
  const data = await res.json();
  if (data.errors?.rateLimit) {
    console.warn("  ⏳ Rate limit, waiting 70s...");
    await delay(70000);
    return apiFetch(path);
  }
  return data;
}

// Known player IDs from API-Football (manually looked up)
const KNOWN_PLAYER_IDS = {
  "Memphis Depay":    { id: 521,    name: "Memphis Depay" },
  "Andreas Pereira":  { id: 10162,  name: "Andreas Pereira" },
  "Felipe Anderson":  { id: 766,    name: "Felipe Anderson" },
  "Gustavo Gómez":    { id: 5788,   name: "Gustavo Gomez" },
  "Emiliano Martínez":{ id: 21616,  name: "Emiliano Martinez" },  // actually Emi Martinez the GK
  "Luiz Araújo":      { id: 21080,  name: "Luiz Araujo" },
  "Joaquín Piquerez": { id: 6350,   name: "Joaquin Piquerez" },
  "André Ramalho":    { id: 10167,  name: "Andre Ramalho" },
  "Gabriel Paulista": { id: 2498,   name: "Gabriel Paulista" },
  "Gustavo Henrique": { id: 10157,  name: "Gustavo Henrique" },
  "Kaio César":       { id: 292050, name: "Kaio Cesar" },
  "Vitor Roque":      { id: 393255, name: "Vitor Roque" },
  "Ramón Sosa":       { id: 306714, name: "Ramon Sosa" },
  "Paulinho":         { id: 9483,   name: "Paulinho" },
};

// Players to search by name in API
const SEARCH_PLAYERS = [
  { dbName: "André Carrillo",   search: "Carrillo" },
  { dbName: "André Luiz",       search: "Andre Luiz" },
  { dbName: "José Martínez",    search: "Jose Martinez" },
  { dbName: "Micael",           search: "Micael" },
  { dbName: "Jefté",            search: "Jefte" },
  { dbName: "Gui Negão",        search: "Gui Negao" },
  { dbName: "Matheus Pereira",  search: "Matheus Pereira" },
  { dbName: "Pedro Milans",     search: "Pedro Milans" },
  { dbName: "Khellven",         search: "Khellven" },
];

async function main() {
  console.log("🔧 Patching missing player photos...\n");

  // Get all players without photos
  const missingPlayers = await sql`
    SELECT p.id, p.name, t.name as team_name
    FROM players p
    JOIN teams t ON p.team_id = t.id
    WHERE p.photo_url IS NULL OR p.photo_url = ''
    ORDER BY t.name, p.name
  `;
  console.log(`Players still missing photos: ${missingPlayers.length}`);
  missingPlayers.forEach(p => console.log(`  - ${p.name} (${p.team_name})`));

  let updated = 0;

  // 1. Use known player IDs to get photos directly
  console.log("\n🎯 Fetching by known player IDs...");
  for (const [dbName, info] of Object.entries(KNOWN_PLAYER_IDS)) {
    const dbPlayer = missingPlayers.find(p => p.name === dbName);
    if (!dbPlayer) {
      console.log(`  ⏩ ${dbName}: already has photo or not in DB`);
      continue;
    }

    const data = await apiFetch(`/players?id=${info.id}&season=2024`);
    const playerData = data.response?.[0];
    if (playerData?.player?.photo) {
      await sql`UPDATE players SET photo_url = ${playerData.player.photo}, updated_at = NOW() WHERE id = ${dbPlayer.id}`;
      console.log(`  ✅ ${dbName} → ${playerData.player.photo}`);
      updated++;
    } else {
      // Try other seasons
      const data2 = await apiFetch(`/players?id=${info.id}&season=2023`);
      const p2 = data2.response?.[0];
      if (p2?.player?.photo) {
        await sql`UPDATE players SET photo_url = ${p2.player.photo}, updated_at = NOW() WHERE id = ${dbPlayer.id}`;
        console.log(`  ✅ ${dbName} (2023) → ${p2.player.photo}`);
        updated++;
      } else {
        console.log(`  ❌ ${dbName}: no photo found (player ID ${info.id})`);
      }
    }
  }

  // 2. Search by name for others
  console.log("\n🔍 Searching by name...");
  for (const sp of SEARCH_PLAYERS) {
    const dbPlayer = missingPlayers.find(p => p.name === sp.dbName);
    if (!dbPlayer) {
      console.log(`  ⏩ ${sp.dbName}: already has photo or not in DB`);
      continue;
    }

    const data = await apiFetch(`/players?search=${encodeURIComponent(sp.search)}`);
    const results = data.response || [];
    if (results.length > 0 && results[0].player?.photo) {
      const photo = results[0].player.photo;
      await sql`UPDATE players SET photo_url = ${photo}, updated_at = NOW() WHERE id = ${dbPlayer.id}`;
      console.log(`  ✅ ${sp.dbName} (search "${sp.search}") → ${photo}`);
      updated++;
    } else {
      console.log(`  ❌ ${sp.dbName}: not found via search "${sp.search}"`);
    }
  }

  // Final stats
  const stats = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(photo_url) as with_photo
    FROM players
  `;
  console.log(`\n📊 Final: ${stats[0].with_photo}/${stats[0].total} players have photos (${updated} newly added)`);

  const stillMissing = await sql`
    SELECT p.name, t.name as team FROM players p
    JOIN teams t ON p.team_id = t.id
    WHERE p.photo_url IS NULL OR p.photo_url = ''
    ORDER BY t.name, p.name
  `;
  if (stillMissing.length > 0) {
    console.log("\n⚠️  Still missing:");
    stillMissing.forEach(p => console.log(`  - ${p.name} (${p.team})`));
  }
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});

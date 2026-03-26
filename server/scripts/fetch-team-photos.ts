#!/usr/bin/env npx tsx
/**
 * Fetch team player photos from Wikimedia Commons (free license only).
 * Saves to client/public/assets/players/<teamSlug>/<slug>.(jpg|png|webp)
 * Updates players.photoUrl in DB and writes photos-manifest.<teamSlug>.json
 *
 * Run: npx tsx server/scripts/fetch-team-photos.ts --teamId=palmeiras --teamSlug=palmeiras
 * Or: npm run fetch:palmeiras-photos
 */
import "dotenv/config";
import { db } from "../db";
import { players } from "@shared/schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://commons.wikimedia.org/w/api.php";

const FREE_LICENSE_PREFIXES = [
  "cc-by", "cc-by-sa", "cc0", "cc-zero", "public domain", "pd-",
  "gfdl", "cc-by-2.0", "cc-by-3.0", "cc-by-sa-2.0", "cc-by-sa-3.0",
  "cc-by-4.0", "cc-by-sa-4.0",
];

interface ManifestEntry {
  playerId: string;
  name: string;
  slug: string;
  status: "downloaded" | "exists" | "missing" | "failed";
  sourceUrl?: string;
  license?: string;
  author?: string;
  downloadedAt?: string;
  error?: string;
}

function parseArgs(): { teamId: string; teamSlug: string } {
  const args = process.argv.slice(2);
  let teamId = "palmeiras";
  let teamSlug = "palmeiras";
  for (const arg of args) {
    if (arg.startsWith("--teamId=")) teamId = arg.split("=")[1];
    if (arg.startsWith("--teamSlug=")) teamSlug = arg.split("=")[1];
  }
  return { teamId, teamSlug };
}

async function searchCommons(query: string, limit = 5): Promise<string[]> {
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    srnamespace: "6",
    srlimit: String(limit),
    format: "json",
    origin: "*",
  });
  const res = await fetch(`${BASE_URL}?${params}`);
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 5000));
    return searchCommons(query, limit);
  }
  const data = await res.json();
  const results = data?.query?.search ?? [];
  return results.map((r: { title: string }) => r.title).filter(Boolean);
}

async function getFileInfo(fileTitle: string): Promise<{
  url: string;
  license?: string;
  author?: string;
  ext: string;
} | null> {
  const params = new URLSearchParams({
    action: "query",
    titles: fileTitle,
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    format: "json",
    origin: "*",
  });
  const res = await fetch(`${BASE_URL}?${params}`);
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 5000));
    return getFileInfo(fileTitle);
  }
  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0] as any;
  if (!page?.imageinfo?.[0]) return null;
  const ii = page.imageinfo[0];
  const licenseShort = ii.extmetadata?.LicenseShortName?.value ?? "";
  const licenseLower = licenseShort.toLowerCase();
  const isFree = FREE_LICENSE_PREFIXES.some((p) => licenseLower.includes(p));
  if (!isFree) return null;
  const ext = path.extname(new URL(ii.url).pathname).slice(1) || "jpg";
  if (!["jpg", "jpeg", "png", "webp"].includes(ext.toLowerCase())) return null;
  return {
    url: ii.url,
    license: licenseShort,
    author: ii.extmetadata?.Artist?.value?.replace(/<[^>]+>/g, ""),
    ext: ext === "jpeg" ? "jpg" : ext.toLowerCase(),
  };
}

async function downloadImage(url: string, destPath: string): Promise<void> {
  const res = await fetch(url);
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 5000));
    return downloadImage(url, destPath);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
}

async function main() {
  const { teamId, teamSlug } = parseArgs();
  const ASSETS_DIR = path.resolve(__dirname, `../../client/public/assets/players/${teamSlug}`);
  const MANIFEST_PATH = path.resolve(__dirname, `photos-manifest.${teamSlug}.json`);

  console.log(`Fetching ${teamId} players from DB...`);
  const roster = await db.select().from(players).where(eq(players.teamId, teamId));
  if (roster.length === 0) {
    console.log(`No players found for teamId=${teamId}. Run seed first.`);
    process.exit(1);
  }

  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  const manifest: ManifestEntry[] = [];
  let downloaded = 0;
  let existsCount = 0;
  let missing = 0;
  let failed = 0;

  for (const p of roster) {
    const slug = p.slug || p.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const entry: ManifestEntry = {
      playerId: p.id,
      name: p.name,
      slug,
      status: "missing",
    };

    // Check existing manifest entry with downloaded/exists + file exists → skip
    const destJpg = path.join(ASSETS_DIR, `${slug}.jpg`);
    const destPng = path.join(ASSETS_DIR, `${slug}.png`);
    const destWebp = path.join(ASSETS_DIR, `${slug}.webp`);
    const existingPath = [destJpg, destPng, destWebp].find((fp) => fs.existsSync(fp));
    const existingExt = existingPath ? path.extname(existingPath).slice(1) : null;
    const destPathForExists = existingExt ? path.join(ASSETS_DIR, `${slug}.${existingExt}`) : null;

    if (destPathForExists && fs.existsSync(destPathForExists)) {
      entry.status = "exists";
      entry.downloadedAt = new Date(fs.statSync(destPathForExists).mtime).toISOString();
      manifest.push(entry);
      existsCount++;
      continue;
    }

    const searchQueries = [
      `${p.name} ${teamId === "palmeiras" ? "Palmeiras" : teamId} footballer`,
      `${p.name} footballer`,
      `${p.name} ${teamId === "palmeiras" ? "Palmeiras" : teamId}`,
    ];

    let found = false;
    try {
      for (const q of searchQueries) {
        const files = await searchCommons(q, 3);
        await new Promise((r) => setTimeout(r, 800));
        for (const fileTitle of files) {
          const info = await getFileInfo(fileTitle);
          if (!info) continue;
          try {
            const finalDestPath = path.join(ASSETS_DIR, `${slug}.${info.ext}`);
            await downloadImage(info.url, finalDestPath);
            const photoUrlFinal = `/assets/players/${teamSlug}/${slug}.${info.ext}`;
            await db.update(players).set({ photoUrl: photoUrlFinal, updatedAt: new Date() }).where(eq(players.id, p.id));
            entry.status = "downloaded";
            entry.sourceUrl = info.url;
            entry.license = info.license;
            entry.author = info.author;
            entry.downloadedAt = new Date().toISOString();
            manifest.push(entry);
            downloaded++;
            found = true;
            console.log(`  ✓ ${p.name} -> ${slug}.${info.ext}`);
            break;
          } catch (err) {
            console.warn(`  ✗ ${p.name} download failed:`, (err as Error).message);
          }
        }
        if (found) break;
        await new Promise((r) => setTimeout(r, 1500));
      }

      if (!found) {
        manifest.push(entry);
        missing++;
        console.log(`  - ${p.name} (no free image found)`);
      }
    } catch (err) {
      entry.status = "failed";
      entry.error = (err as Error).message;
      manifest.push(entry);
      failed++;
      console.log(`  ✗ ${p.name} error:`, (err as Error).message);
    }
  }

  const summary = {
    total: roster.length,
    downloaded,
    exists: existsCount,
    missing,
    failed,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify({ summary, entries: manifest }, null, 2));
  console.log("\n--- Summary ---");
  console.log(`Total: ${summary.total} | Downloaded: ${summary.downloaded} | Exists: ${summary.exists} | Missing: ${summary.missing} | Failed: ${summary.failed}`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

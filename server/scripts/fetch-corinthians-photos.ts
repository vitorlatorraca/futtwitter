#!/usr/bin/env npx tsx
/**
 * Fetch Corinthians player photos from Wikimedia Commons (free license only).
 * Saves to client/public/assets/players/corinthians/<slug>.(jpg|png|webp)
 * Updates players.photoUrl in DB and writes photos-manifest.json.
 *
 * Run: npx tsx server/scripts/fetch-corinthians-photos.ts
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

const TEAM_ID = "corinthians";
const BASE_URL = "https://commons.wikimedia.org/w/api.php";
const ASSETS_DIR = path.resolve(__dirname, "../../client/public/assets/players/corinthians");
const PLACEHOLDER_PATH = path.resolve(__dirname, "../../client/public/assets/players/placeholder.png");
const MANIFEST_PATH = path.resolve(__dirname, "photos-manifest.json");

const FREE_LICENSE_PREFIXES = [
  "cc-by",
  "cc-by-sa",
  "cc0",
  "cc-zero",
  "public domain",
  "pd-",
  "gfdl",
  "cc-by-2.0",
  "cc-by-3.0",
  "cc-by-sa-2.0",
  "cc-by-sa-3.0",
  "cc-by-4.0",
  "cc-by-sa-4.0",
];

interface ManifestEntry {
  playerId: string;
  name: string;
  slug: string;
  status: "downloaded" | "missing" | "skipped";
  sourceUrl?: string;
  license?: string;
  author?: string;
  downloadedAt?: string;
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

function isFreeLicense(license: string): boolean {
  const l = license.toLowerCase();
  return FREE_LICENSE_PREFIXES.some((p) => l.includes(p));
}

async function downloadImage(url: string, destPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
}

async function main() {
  console.log("Fetching Corinthians players from DB...");
  const roster = await db.select().from(players).where(eq(players.teamId, TEAM_ID));
  if (roster.length === 0) {
    console.log("No Corinthians players found. Run seed first: npx tsx server/seed-corinthians-players.ts");
    process.exit(1);
  }

  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  const manifest: ManifestEntry[] = [];
  let downloaded = 0;
  let missing = 0;

  for (const p of roster) {
    const slug = p.slug || p.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    try {
    const ext = "jpg";
    const destPath = path.join(ASSETS_DIR, `${slug}.${ext}`);
    const photoUrl = `/assets/players/corinthians/${slug}.${ext}`;

    const entry: ManifestEntry = {
      playerId: p.id,
      name: p.name,
      slug,
      status: "missing",
    };

    if (fs.existsSync(destPath)) {
      entry.status = "skipped";
      entry.downloadedAt = new Date(fs.statSync(destPath).mtime).toISOString();
      manifest.push(entry);
      continue;
    }

    const searchQueries = [
      `${p.name} Corinthians footballer`,
      `${p.name} footballer`,
      `${p.name} Corinthians`,
    ];

    let found = false;
    for (const q of searchQueries) {
      const files = await searchCommons(q, 3);
      await new Promise((r) => setTimeout(r, 800));
      for (const fileTitle of files) {
        const info = await getFileInfo(fileTitle);
        if (!info) continue;
        try {
          await downloadImage(info.url, destPath);
          await db.update(players).set({ photoUrl, updatedAt: new Date() }).where(eq(players.id, p.id));
          entry.status = "downloaded";
          entry.sourceUrl = info.url;
          entry.license = info.license;
          entry.author = info.author;
          entry.downloadedAt = new Date().toISOString();
          manifest.push(entry);
          downloaded++;
          found = true;
          console.log(`  ✓ ${p.name} -> ${slug}.${ext}`);
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
      manifest.push({ playerId: p.id, name: p.name, slug: p.slug || p.name, status: "missing" });
      missing++;
      console.log(`  ✗ ${p.name} error:`, (err as Error).message);
    }
  }

  const summary = {
    total: roster.length,
    downloaded,
    missing,
    skipped: roster.length - downloaded - missing,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify({ summary, entries: manifest }, null, 2));
  console.log("\n--- Summary ---");
  console.log(`Total: ${summary.total} | Downloaded: ${summary.downloaded} | Missing: ${summary.missing} | Skipped: ${summary.skipped}`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

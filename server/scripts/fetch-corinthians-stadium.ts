#!/usr/bin/env npx tsx
/**
 * Fetch Neo Química Arena image from Wikimedia Commons (CC0).
 * Saves to client/public/assets/stadiums/corinthians/neo-quimica-arena.jpg
 * Run: npx tsx server/scripts/fetch-corinthians-stadium.ts
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEST = path.resolve(__dirname, "../../client/public/assets/stadiums/corinthians/neo-quimica-arena.jpg");
const URL = "https://upload.wikimedia.org/wikipedia/commons/5/5c/Arena_Corinthians_2.jpg";

async function main() {
  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(DEST, buf);
  console.log(`Saved: ${DEST}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

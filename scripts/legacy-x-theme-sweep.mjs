/**
 * One-shot: retire legacy x-* Tailwind utilities → Tribuna semantic tokens.
 * Run from repo root: node scripts/legacy-x-theme-sweep.mjs
 */
import fs from "node:fs";
import path from "node:path";

function* walkTsx(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) yield* walkTsx(p);
    else if (ent.name.endsWith(".tsx") || ent.name.endsWith(".ts")) yield p;
  }
}

const reps = [
  [/hover:text-x-text-primary/g, "hover:text-foreground"],
  [/text-x-text-primary/g, "text-foreground"],
  [/text-x-text-secondary/g, "text-foreground-secondary"],
  [/placeholder-x-text-secondary/g, "placeholder:text-foreground-secondary"],
  [/border-x-text-primary/g, "border-foreground"],
  [/ring-x-border/g, "ring-card-border"],
  [/bg-x-border/g, "bg-muted"],
  [/bg-x-surface/g, "bg-surface-card"],
  [/bg-x-hover/g, "bg-foreground/[0.04]"],
  [/hover:bg-x-hover/g, "hover:bg-foreground/[0.04]"],
  [/bg-x-search-bg/g, "bg-paper-2"],
  [/hover:bg-x-search-bg/g, "hover:bg-paper-2"],
  [/border-x-border/g, "border-card-border"],
  [/var\(--x-accent\)/g, "var(--ink)"],
  [/hover:bg-white\/\[0\.03\]/g, "hover:bg-foreground/[0.04]"],
  [/hover:bg-white\/\[0\.08\]/g, "hover:bg-foreground/[0.08]"],
  [/hover:bg-\[rgba\(231,\s*233,\s*234,\s*0\.1\)\]/g, "hover:bg-foreground/[0.08]"],
  [/hover:border-red-500 hover:text-red-500/g, "hover:border-destructive hover:text-destructive"],
  [/bg-black\/90 backdrop-blur/g, "bg-background/90 backdrop-blur"],
  [/bg-black\/80 backdrop-blur-md/g, "bg-background/80 backdrop-blur-md"],
  [/bg-black\/80 backdrop-blur/g, "bg-background/80 backdrop-blur"],
];

const root = path.join(process.cwd(), "client", "src");
let changed = 0;
for (const file of walkTsx(root)) {
  let s = fs.readFileSync(file, "utf8");
  const before = s;
  for (const [re, to] of reps) s = s.replace(re, to);
  if (s !== before) {
    fs.writeFileSync(file, s, "utf8");
    changed++;
    console.log(path.relative(process.cwd(), file));
  }
}
console.log(`\nUpdated ${changed} file(s).`);

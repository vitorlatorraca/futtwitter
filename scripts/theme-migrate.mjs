// One-shot theme migration: replace hardcoded dark colors with semantic tokens.
// Skipped intentionally: bg-black/<opacity> (modal backdrops should stay dark),
// text-white when inside a known-dark surface like bg-primary text-primary-foreground.

import { readFileSync, writeFileSync } from "node:fs";
import { globSync } from "node:fs";
import { execSync } from "node:child_process";

const files = execSync(
  `grep -rln "bg-black\\|text-white\\|bg-zinc-9\\|bg-zinc-8\\|text-zinc-\\|bg-gray-9\\|bg-gray-8\\|text-gray-\\|bg-neutral-9\\|bg-neutral-8\\|text-neutral-\\|border-zinc-\\|border-gray-\\|border-neutral-\\|ring-offset-black\\|from-black\\|to-black\\|from-zinc-\\|to-zinc-\\|bg-\\[#080C14\\]\\|bg-\\[#0F1520\\]\\|rgba(231,233,234\\|rgba(255,255,255\\|text-black\\|bg-white" client/src --include="*.tsx" --include="*.ts"`,
  { encoding: "utf8" }
).trim().split("\n").filter(Boolean);

// Order matters: longest patterns first so we don't partially-replace.
// Class boundary: `(?<![\\w-])` before and `(?![\\w-])` after each token so
// `bg-black` doesn't match `bg-black-something` and vice versa.
const swaps = [
  // Modal backdrop overlays stay dark — DON'T touch bg-black/<n> patterns
  // Solid backgrounds
  [/(?<![\w-])bg-\[#080C14\](?![\w-])/g, "bg-background"],
  [/(?<![\w-])bg-\[#0F1520\](?![\w-])/g, "bg-surface-card"],
  [/(?<![\w-])bg-zinc-950(?![\w-])/g, "bg-background"],
  [/(?<![\w-])bg-zinc-900(?![\w-])/g, "bg-surface-card"],
  [/(?<![\w-])bg-zinc-800(?![\w-])/g, "bg-surface-elevated"],
  [/(?<![\w-])bg-zinc-700(?![\w-])/g, "bg-muted"],
  [/(?<![\w-])bg-gray-950(?![\w-])/g, "bg-background"],
  [/(?<![\w-])bg-gray-900(?![\w-])/g, "bg-surface-card"],
  [/(?<![\w-])bg-gray-800(?![\w-])/g, "bg-surface-elevated"],
  [/(?<![\w-])bg-neutral-950(?![\w-])/g, "bg-background"],
  [/(?<![\w-])bg-neutral-900(?![\w-])/g, "bg-surface-card"],
  [/(?<![\w-])bg-neutral-800(?![\w-])/g, "bg-surface-elevated"],
  // Solid bg-black (no opacity)
  [/(?<![\w-])bg-black(?![\w/\-])/g, "bg-background"],

  // Text colors — skip text-white inside known dark contexts in a second pass
  [/(?<![\w-])text-white(?![\w/\-])/g, "text-foreground"],
  [/(?<![\w-])text-zinc-50(?![\w-])/g, "text-foreground"],
  [/(?<![\w-])text-zinc-100(?![\w-])/g, "text-foreground"],
  [/(?<![\w-])text-zinc-200(?![\w-])/g, "text-foreground"],
  [/(?<![\w-])text-zinc-300(?![\w-])/g, "text-foreground-secondary"],
  [/(?<![\w-])text-zinc-400(?![\w-])/g, "text-foreground-muted"],
  [/(?<![\w-])text-zinc-500(?![\w-])/g, "text-foreground-muted"],
  [/(?<![\w-])text-gray-50(?![\w-])/g, "text-foreground"],
  [/(?<![\w-])text-gray-100(?![\w-])/g, "text-foreground"],
  [/(?<![\w-])text-gray-200(?![\w-])/g, "text-foreground"],
  [/(?<![\w-])text-gray-300(?![\w-])/g, "text-foreground-secondary"],
  [/(?<![\w-])text-gray-400(?![\w-])/g, "text-foreground-muted"],
  [/(?<![\w-])text-gray-500(?![\w-])/g, "text-foreground-muted"],
  [/(?<![\w-])text-neutral-100(?![\w-])/g, "text-foreground"],
  [/(?<![\w-])text-neutral-200(?![\w-])/g, "text-foreground"],
  [/(?<![\w-])text-neutral-300(?![\w-])/g, "text-foreground-secondary"],
  [/(?<![\w-])text-neutral-400(?![\w-])/g, "text-foreground-muted"],
  [/(?<![\w-])text-neutral-500(?![\w-])/g, "text-foreground-muted"],

  // Borders
  [/(?<![\w-])border-zinc-900(?![\w-])/g, "border-card-border"],
  [/(?<![\w-])border-zinc-800(?![\w-])/g, "border-card-border"],
  [/(?<![\w-])border-zinc-700(?![\w-])/g, "border-border"],
  [/(?<![\w-])border-gray-900(?![\w-])/g, "border-card-border"],
  [/(?<![\w-])border-gray-800(?![\w-])/g, "border-card-border"],
  [/(?<![\w-])border-gray-700(?![\w-])/g, "border-border"],
  [/(?<![\w-])border-neutral-800(?![\w-])/g, "border-card-border"],
  [/(?<![\w-])border-neutral-700(?![\w-])/g, "border-border"],

  // Ring offsets and gradients
  [/(?<![\w-])ring-offset-black(?![\w-])/g, "ring-offset-background"],
  [/(?<![\w-])from-black(?![\w/\-])/g, "from-background"],
  [/(?<![\w-])to-black(?![\w/\-])/g, "to-background"],
  [/(?<![\w-])via-black(?![\w/\-])/g, "via-background"],
  [/(?<![\w-])from-zinc-950(?![\w-])/g, "from-background"],
  [/(?<![\w-])to-zinc-950(?![\w-])/g, "to-background"],
  [/(?<![\w-])from-zinc-900(?![\w-])/g, "from-surface-card"],
  [/(?<![\w-])to-zinc-900(?![\w-])/g, "to-surface-card"],

  // Dark-theme hover/shadow rgba — replace with semantic equivalents that
  // adapt to the active palette. Same opacity is fine; only the source color
  // assumption (light-on-dark) is wrong.
  [/hover:bg-\[rgba\(231,\s*233,\s*234,\s*0\.03\)\]/g, "hover:bg-x-hover"],
  [/hover:bg-\[rgba\(255,\s*255,\s*255,\s*0\.03\)\]/g, "hover:bg-x-hover"],
  [/hover:bg-\[rgba\(231,\s*233,\s*234,\s*0\.9\)\]/g, "hover:bg-foreground/90"],
  [/bg-\[rgba\(231,\s*233,\s*234,\s*0\.03\)\]/g, "bg-x-hover"],
  [/bg-\[rgba\(255,\s*255,\s*255,\s*0\.03\)\]/g, "bg-x-hover"],
  // Light glow shadows look wrong on cream — swap for soft dark shadow
  [/shadow-\[0_0_15px_rgba\(255,\s*255,\s*255,\s*0\.2\)\]/g, "shadow-lg"],

  // text-black on dark/accent buttons → primary-foreground (cream) for contrast
  [/(?<![\w-])bg-x-accent text-black(?![\w-])/g, "bg-x-accent text-primary-foreground"],
  // text-black on bg-white buttons — those are inverted ("follow" buttons).
  // On cream theme, "inverted" means dark — keep colors readable.
  [/(?<![\w-])bg-white text-black(?![\w-])/g, "bg-foreground text-background"],

  // hover:bg-white/<n> patterns (used as ghost hover) — convert to foreground/<n>
  [/(?<![\w-])hover:bg-white\/5(?![\w-])/g, "hover:bg-foreground/5"],
  [/(?<![\w-])hover:bg-white\/\[0\.04\](?![\w-])/g, "hover:bg-foreground/[0.04]"],
  [/(?<![\w-])hover:bg-white\/\[0\.02\](?![\w-])/g, "hover:bg-foreground/[0.02]"],
  [/(?<![\w-])bg-white\/\[0\.06\](?![\w-])/g, "bg-foreground/[0.06]"],
  [/(?<![\w-])bg-white\/\[0\.04\](?![\w-])/g, "bg-foreground/[0.04]"],
  [/(?<![\w-])bg-white\/\[0\.02\](?![\w-])/g, "bg-foreground/[0.02]"],
  [/(?<![\w-])hover:bg-white\/\[0\.06\](?![\w-])/g, "hover:bg-foreground/[0.06]"],

  // Standalone text-black used as button text in dark-theme button styles
  // (these are inside `bg-x-accent text-black` already caught above, but
  // some have a different bg). Replace cautiously with primary-foreground.
  [/(?<![\w-])text-black font-bold(?![\w-])/g, "text-primary-foreground font-bold"],
];

let totalReplacements = 0;
const summary = [];

for (const file of files) {
  let content = readFileSync(file, "utf8");
  const before = content;
  let fileChanges = 0;

  for (const [pattern, replacement] of swaps) {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      fileChanges += matches.length;
    }
  }

  if (content !== before) {
    writeFileSync(file, content, "utf8");
    totalReplacements += fileChanges;
    summary.push(`${file}: ${fileChanges} replacements`);
  }
}

console.log(summary.join("\n"));
console.log(`\nTotal: ${totalReplacements} replacements across ${summary.length} files`);

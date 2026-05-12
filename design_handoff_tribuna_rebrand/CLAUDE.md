# CLAUDE.md — Tribuna Rebrand

You are implementing the Tribuna rebrand in this codebase (formerly FuttWitter).

**Read `README.md` in this folder first** — it is the source of truth for tokens, components, and rules. Open `Tribuna Rebrand.html` in a browser to see the visual reference.

## Working agreement

- One PR per step (see "Implementation Order" in README, steps 1–8).
- Before each step: list files you intend to change and wait for confirmation.
- Lift exact values from the README tables (hex, px, font weights). Do not approximate.
- Do not copy the HTML markup verbatim into the codebase — recreate using existing framework patterns (React components, etc.).
- Do not rename packages, DB identifiers, env vars. Naming change is copy/UI only.

## Hard rules

- Page background is **always** `--paper` (#F2ECDE). Pure white only inside dark scoreboards/crests.
- `--floodlight` (#FF4B1F) is reserved for action — CTAs, likes, hashtags, live indicators. Never decorative.
- `--chalk` (#F5C518) only appears on `--ink` background.
- Text is `--ink` (#0F1115), never `#000`.
- Team badges: contour + crest only. **Never** fill with club color.
- No emoji in UI chrome (labels, buttons, tabs). User content is exempt.
- No grass green, no glassmorphism, no neon gradients, no "card with colored left border" patterns.

## Fonts

Add Google Fonts imports:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

## Icon library

Use **Lucide** or equivalent outline set, 1.75px stroke. Replace any existing icon set.

## When in doubt

Open `Tribuna Rebrand.html`. The visual document is the authority. If the README and the HTML disagree, the HTML wins.

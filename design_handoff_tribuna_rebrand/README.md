# Handoff: Tribuna (FuttWitter Rebrand)

## Overview

Complete visual rebrand of **FuttWitter** (Brazilian football social network) into **Tribuna**. The package contains a full brand system: identity/name, color palette, typography, design tokens, key component visuals (top nav, post composer, post card, team badge), and style rules.

The goal: replace the current bege/sand + grass-green generic look with a premium, editorial sports identity — "the digital grandstand" — that differentiates from generic social networks and from score-tracking apps like Sofascore.

## About the Design Files

The files in this bundle are **design references created in HTML** — a brand-system document showing intended look, tokens, and component anatomy. **Not production code to copy directly.**

Your task is to **recreate these designs in the FuttWitter codebase's existing environment** (React/Next.js/whatever stack it currently runs on), using its established patterns, component libraries, and state management. Lift values (hex, px, font sizes), structure, and visual rules from the HTML — but implement using the codebase's idioms.

## Fidelity

**High-fidelity (hifi).** All colors, typography, spacing, radii, and component anatomy are final. Recreate pixel-accurately:
- Exact hex values from the palette
- Bricolage Grotesque + Geist + JetBrains Mono with the specified weights and letter-spacing
- 4pt spacing scale
- Component proportions as shown

---

## Brand: Tribuna

- **Name**: TRIBUNA (means "grandstand" / "tribune" in Portuguese — footballing root, not Twitter-derived)
- **Tagline**: "O jornal que conversa" (the newspaper that talks back)
- **Positioning**: A arquibancada digital do futebol brasileiro. Premium editorial credibility of a sports newspaper, with the liveliness of a modern social feed.
- **Three pillars**:
  1. Bancada de torcedor — boteco conversation with tactical depth
  2. Estética de imprensa — newspaper visual credibility (manchete, scoreboard, lead)
  3. Cor de clube vence — Tribuna is the stage; each club's colors shine through

Rename in: app copy, logo, meta tags, manifest, marketing pages. **Do not rename** package names, DB IDs, or internal identifiers.

---

## Design Tokens

### Color palette

| Token              | Hex        | Usage |
|--------------------|------------|-------|
| `--ink`            | `#0F1115`  | Primary brand. Text, CTAs, scoreboards, top-nav dark surface |
| `--ink-2`          | `#1C1F25`  | Dark surfaces (hover state on Ink) |
| `--ink-3`          | `#353941`  | Muted text on light |
| `--slate`          | `#6A6F7A`  | Secondary text |
| `--slate-2`        | `#9CA0AB`  | Tertiary text |
| `--paper`          | `#F2ECDE`  | Page background (warm cream) |
| `--paper-2`        | `#ECE5D3`  | Alt cream (hover on Paper) |
| `--card`           | `#FBF7EC`  | Elevated surfaces (cards, posts, modals) |
| `--line`           | `#E2D9C3`  | Hairline borders on cream |
| `--line-2`         | `#D4C8AB`  | Heavier hairlines |
| `--floodlight`     | `#FF4B1F`  | **Primary action.** CTAs, likes, hashtags, "ao vivo" |
| `--floodlight-d`   | `#E03A10`  | Floodlight hover |
| `--chalk`          | `#F5C518`  | Scoreboard yellow. Numbers on Ink only |
| `--success`        | `#1F8E5C`  | Sucesso / Gol |
| `--error`          | `#C4321A`  | Erro |
| `--warning`        | `#D89412`  | Alerta |
| `--info`           | `#2E5BD4`  | Info / lateral |

**Critical rules**:
- Page background is **always** `--paper`. White (#FFF) only exists inside dark scoreboards and crests.
- `--floodlight` is reserved for action — never decorative background.
- `--chalk` only appears on `--ink` background (scoreboard context).
- Text is `--ink` (#0F1115), never `#000`. Sombras são quentes, nunca pretas puras.

### Club colors (badge contour only — never fill)

| Clube       | Hex |
|-------------|-----|
| Corinthians | `#0F0F0F` |
| Palmeiras   | `#006437` |
| Flamengo    | `#C4321A` + `#0F0F0F` (split) |
| São Paulo   | `#C4321A` / `#FFFFFF` / `#0F0F0F` (tri-band) |
| Santos      | `#FFFFFF` (outline `#0F0F0F`) |
| Cruzeiro    | `#2E5BD4` |
| Grêmio      | `#0B377C` + `#0F0F0F` |

### Typography

- **Headings**: `Bricolage Grotesque` (variable, opsz 12→96, weights 400–800). Google Fonts.
- **Body / UI**: `Geist` (300–700). Google Fonts.
- **Mono / stats / handles / timestamps**: `JetBrains Mono` (400–600). Google Fonts.

| Role     | Family               | Size  | Weight | Line height | Letter-spacing | Notes |
|----------|----------------------|-------|--------|-------------|----------------|-------|
| Display  | Bricolage Grotesque  | 132px | 800    | 0.9         | -0.045em       | opsz 96 — cover only |
| H1       | Bricolage Grotesque  | 56px  | 700    | 1.02        | -0.03em        | opsz 48 |
| H2       | Bricolage Grotesque  | 36px  | 700    | 1.05        | -0.022em       | opsz 32 |
| H3       | Bricolage Grotesque  | 22px  | 600    | 1.15        | -0.012em       | opsz 24 |
| Body lg  | Geist                | 17px  | 400    | 1.55        | 0              | |
| Body     | Geist                | 15px  | 400    | 1.5         | 0              | post content |
| Caption  | Geist                | 13px  | 400    | 1.45        | 0              | |
| Label    | JetBrains Mono       | 11px  | 500    | 1           | 0.14em uppercase | section labels, kbd, timestamps |

### Radii

| Token       | Value   | Usage |
|-------------|---------|-------|
| `--r-1`     | 4px     | chips, badges, tags |
| `--r-2`     | 8px     | botões, inputs |
| `--r-3`     | 12px    | cards, posts |
| `--r-4`     | 20px    | hero, modais |
| `--r-full`  | 999px   | avatars, pill CTAs |

### Spacing (4pt scale)

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56 · 72` (px). Use `gap` in flex/grid, not margins between siblings.

### Elevation

- `shadow-1` — `0 1px 2px rgba(15,17,21,0.05), 0 0 0 1px rgba(15,17,21,0.04)` · cards, inputs
- `shadow-2` — `0 8px 24px -12px rgba(15,17,21,0.18), 0 0 0 1px rgba(15,17,21,0.05)` · popovers
- `shadow-3` — `0 24px 60px -28px rgba(15,17,21,0.35), 0 0 0 1px rgba(15,17,21,0.06)` · modais, hero

Shadows have warm ink tint — **never** blueish or pure black.

### Icons

Outline family, **1.75px stroke**, slightly rounded line caps. Uniform stroke. Filled only for active states (e.g., liked heart). Replace any current icon set with Lucide or hand-drawn matching this spec.

---

## Components

### a) Top Navigation (`<TopNav>`)

Anatomy (left → right):
- **Logo group**: 36×36 `--ink` rounded square (radius 8px) with white "T" in Bricolage 22/800. A 10px `--floodlight` dot overlaps bottom-right with a 2px paper border ring. To the right: wordmark "tribuna" (Bricolage 22/700, tracking -0.025em) above mono micro-label "O JORNAL QUE CONVERSA" (JBM 9px/500, tracking 0.22em uppercase, color `--slate`).
- **Tabs** (centered): Feed · Vai e Vem · Meu Time · Jogos · Perfil. Active tab has a 3px `--floodlight` underline (left/right 14px from edges, 2px from bottom). Inactive: `--ink-3`, weight 500. Active: `--ink`, weight 600. Hover: `--paper-2` background, radius 8px.
- **Numeric badges** on tabs: 10px JBM in `--floodlight` (or `--success` for live) pill, white text.
- **Right side**: search pill (`--paper-2` background, full radius, magnifier icon + "Buscar na Tribuna" + ⌘K kbd). 36×36 user avatar with optional `--floodlight` live dot at bottom-right.

Container: `--paper` bg, `--line` 1px border, radius 12, shadow-1, padding 14px 20px.

### b) Compose Post (`<ComposePost>`)

- 48×48 user avatar at top-left
- Placeholder: "Poste para sua **torcida**… o que rolou no jogo de hoje?" — "torcida" word is `--floodlight` italic-replaced (font-style: normal, weight 500). 18px Geist.
- Bottom toolbar (separator above is `--line` 1px):
  - Tools left: image · poll · scoreboard · hashtag (36×36 ghost buttons, hover `--paper-2` + floodlight color). Plus a "Marcar Corinthians" pill: dashed `--line-2` border, 12px club crest, 13/500 text. Goes solid on hover.
  - Meta right: "208 / 280" counter (JBM 11) · 28px conic-gradient char ring (`--ink` progress on `--line` track, paper hole) · primary CTA "Postar →" with arrow in `--floodlight`.

Primary button: `--ink` background, `--paper` text, full radius, 10px×22px, 14/600 Geist, subtle 1px inset highlight.

### c) Post Card (`<PostCard>`)

Grid: `48px 1fr`, column-gap 16, row-gap 10. Padding 20/22/16.

- **Header row** (col 2): name (Geist 15/600) · optional verified badge (`--floodlight` 8-point star with white check, 14px) · handle (JBM 12, `--slate`) · " · " sep · time · optional team badge · ⋯ more (28px circle, hover `--paper-2`).
- **Body** (col 2): Geist 15/400 line-height 1.5, color `--ink`.
  - `#hashtags` and links: `--floodlight`, weight 500
  - `@mentions`: `--ink`, weight 500
- **Optional quote block**: `--card` bg, `--line` border, radius 12, 12/14px padding. Large `"` mark in `--line-2` Bricolage 32px. Source name bold `--ink`, body 13 `--ink-3`.
- **Optional scoreboard block**: `--ink` bg, `--paper`/`--chalk` text, radius 12, 16/18 padding. 3-column grid: team-row left · score center · team-row right (mirror). Score uses Bricolage 36/700/-0.025em in `--chalk`, with a 40% alpha `×` between. "Live pill" floats at top-center: `--floodlight` background, white pulsing dot (1.4s infinite), JBM 9 uppercase "AO VIVO · 78'". Subtle chalk-color vertical grid lines as decoration.
- **Action row** (col 2, max-width 460px): reply · repost · like · stats · share · bookmark — JBM 12/500, `--slate` default. Hover colors:
  - reply → `--info` + light bg
  - repost → `--success` + light bg
  - like → `--floodlight` + light bg (filled when `.liked`)
  - others → `--ink`
  Icons 18px outline 1.75.

### d) Team Badge (`<TeamBadge club="cor" size="sm" />`)

- Small: 3px×9px padding (5px left), `--r-full`, 12/600 Geist, 1px border in the club's color (at ~25% alpha), bg `--paper`. 16×16 crest circle with team initials in JBM 8/700 white. Text color is a darker club-derived tone.
- Large: 6×14 padding (8 left), 14/600, 22×22 crest with 10px initials. Optional separator dot + meta info ("1.2M torcedores") in JBM 10/500 `--slate`.
- On dark surfaces (scoreboard): `rgba(255,255,255,0.08)` bg, border in club color at 60% alpha, text lightened to a brighter club tone.

**Never** fill the badge with the club's color — only contour + crest.

---

## Style Rules

### Tom visual (5 adjectives)

Editorial · Apaixonado · Honesto · Tátil · Brasileiro

### Sempre

1. Trate o post como manchete — strong typographic hierarchy
2. Use cream warm (`--paper`) como tela — never pure white background
3. Reserve Holofote para ação — CTA / like / hashtag / live only
4. Mostre cor do clube no contorno — fill stays `--paper`
5. Estilize placares como scoreboard — Ink + Chalk, Bricolage 700

### Nunca

1. Verde grama de fundo (cliché)
2. Pretos puros e cinzas estéreis (everything has warm tint)
3. Gradientes neon, glassmorphism (we are newspaper, not crypto dashboard)
4. Preencher badge com cor de clube (illegible, ugly)
5. Emoji decorativo em UI (only in user content)
6. Cards com "left-border accent" colorida (dated; hierarchy comes from type)

### Differentiation

- **vs generic socials** (Twitter/X, Threads): cream warm canvas instead of cold white; editorial typography (Bricolage) instead of neutral system sans; orange Holofote as action instead of brand blue.
- **vs score apps** (Sofascore, Onefootball): conversational, editorial voice; club color recedes to contour; warm palette instead of clinical green/red.

---

## Implementation Order (suggested)

Create one PR per step:

1. **Tokens layer** — replace current CSS variables / theme file with the table above. Set up font imports (Google Fonts). Confirm the page renders in cream.
2. **Typography pass** — apply Bricolage to all headings, Geist to body, JBM to handles/timestamps/labels. Adjust line-heights and letter-spacing per scale.
3. **Top Nav** — refactor with new logo mark, tabs, search pill.
4. **Compose** — apply new compose card with toolbar, char ring, accent CTA.
5. **Post Card** — rewrite anatomy. Migrate action icons to 1.75px outline set. Implement scoreboard variant.
6. **Team Badge** — new component, replace any existing club chip with this. Map club codes → color set.
7. **Naming pass** — copy, logo, meta tags, manifest. Do not touch package/DB identifiers.
8. **Light/dark sweep** — verify scoreboard, modals, focus states on the new palette.
9. **Legacy utility retirement** — replace remaining `x-*` Tailwind classes (`border-x-border`, `text-x-text-*`, `bg-x-hover`, etc.) with semantic tokens (`border-card-border`, `text-foreground-secondary`, `hover:bg-foreground/[0.04]`, …) so the UI tracks one token layer. Remove Twitter-era hex/rgba (e.g. dark search dropdowns, green link hovers). Optional: keep `index.css` legacy CSS vars until all imports are gone.

For safety, do this behind a feature flag or on a `rebrand/tribuna` branch. Don't big-bang the production CSS.

---

## Files in this bundle

- `Tribuna Rebrand.html` — the complete brand-system document (cover, palette, typography, tokens, components, rules). Open it as the visual ground truth.

## Assets

No image assets in this bundle. The cover, scoreboards, and badges are all CSS/SVG. Acquire or commission:
- A proper SVG wordmark "tribuna" + monogram "T" (currently rendered live with Bricolage). Keep the floodlight dot lockup.
- An SVG outline icon set matching 1.75-stroke spec (Lucide is a close match).

If using Anthropic brand assets anywhere in the codebase, leave them as-is — Tribuna is a separate product brand.

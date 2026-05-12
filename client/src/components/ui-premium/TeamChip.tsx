import React from "react";
import { cn } from "@/lib/utils";
import { TEAMS_DATA } from "@/lib/team-data";

/**
 * TeamChip (Tribuna "TeamBadge" per spec) — Tribuna club chip per design_handoff_tribuna_rebrand/README.md
 * ("Components → d"). Critical rule: NEVER fill with club color, only contour
 * + crest. The badge advertises which club the user supports without painting
 * the whole UI in club colors.
 *
 * Anatomy:
 *
 *   ┌────────────────────────────────────────┐
 *   │  ⊙crest  Corinthians                   │   ← sm size
 *   └────────────────────────────────────────┘
 *      ↑ 16×16   ↑ Geist 12/600 club-tone
 *      border 1px club-color @ 25%, bg --paper, radius full
 *
 *   ┌─────────────────────────────────────────────┐
 *   │  ⊙crest  Corinthians  ·  1.2M torcedores    │   ← lg size
 *   └─────────────────────────────────────────────┘
 *      ↑ 22×22   ↑ 14/600 club-tone   ↑ JBM 10/500 slate
 *
 * On dark surfaces (scoreboard, ink panels):
 *   bg rgba(255,255,255,0.08), border at 60% alpha, brighter club tone text.
 */

/**
 * Spec colors per the README's "Club colors" table (contour-only values).
 * The `text` value is a slightly darker / darker-toned variant for legibility
 * on --paper. `textDark` is used on dark surfaces.
 *
 * Slugs match TEAMS_DATA ids; add aliases for short keys (cor/pal/fla/etc).
 */
type ClubColors = {
  /** Outline / crest tone */
  primary: string;
  /** Text color on paper (darker derived tone, AA against #F2ECDE) */
  text: string;
  /** Text color on dark surfaces (lightened derived tone) */
  textDark: string;
};

const CLUB_COLORS: Record<string, ClubColors> = {
  // Brasileirão clubs explicitly called out in the spec
  corinthians:  { primary: "#0F0F0F", text: "#0F0F0F", textDark: "#E4E4E4" },
  palmeiras:    { primary: "#006437", text: "#004A28", textDark: "#5BC79A" },
  flamengo:     { primary: "#C4321A", text: "#9A2614", textDark: "#F08573" },
  "sao-paulo":  { primary: "#C4321A", text: "#0F0F0F", textDark: "#E4E4E4" },
  santos:       { primary: "#0F0F0F", text: "#0F0F0F", textDark: "#E4E4E4" },
  cruzeiro:     { primary: "#2E5BD4", text: "#1F3FA0", textDark: "#8FA9EE" },
  gremio:       { primary: "#0B377C", text: "#0B377C", textDark: "#7DA1D9" },

  // Other Brasileirão Série A clubs — derive from TEAMS_DATA but enforce
  // ink-only fallbacks for too-light primaries that wouldn't read on paper.
  fluminense:           { primary: "#7A1437", text: "#5A0E28", textDark: "#D77AA0" },
  botafogo:             { primary: "#0F0F0F", text: "#0F0F0F", textDark: "#E4E4E4" },
  bahia:                { primary: "#005CA9", text: "#003D70", textDark: "#7DB4E5" },
  bragantino:           { primary: "#C4321A", text: "#9A2614", textDark: "#F08573" },
  "vasco-da-gama":      { primary: "#0F0F0F", text: "#0F0F0F", textDark: "#E4E4E4" },
  "atletico-mineiro":   { primary: "#0F0F0F", text: "#0F0F0F", textDark: "#E4E4E4" },
  vitoria:              { primary: "#C4321A", text: "#9A2614", textDark: "#F08573" },
  internacional:        { primary: "#C4321A", text: "#9A2614", textDark: "#F08573" },
  coritiba:             { primary: "#006437", text: "#004A28", textDark: "#5BC79A" },
  "athletico-paranaense": { primary: "#C4321A", text: "#9A2614", textDark: "#F08573" },
  mirassol:             { primary: "#B59000", text: "#7A6100", textDark: "#E5C45D" },
  "america-mineiro":    { primary: "#0F0F0F", text: "#0F0F0F", textDark: "#E4E4E4" },
};

/** Short slug aliases (sm/md formats used in scoreboards & captions). */
const SLUG_ALIASES: Record<string, string> = {
  cor: "corinthians",
  pal: "palmeiras",
  fla: "flamengo",
  sao: "sao-paulo",
  san: "santos",
  cru: "cruzeiro",
  gre: "gremio",
  flu: "fluminense",
  bot: "botafogo",
  bah: "bahia",
  bra: "bragantino",
  vas: "vasco-da-gama",
  cam: "atletico-mineiro",
  vit: "vitoria",
  int: "internacional",
  cfc: "coritiba",
  cap: "athletico-paranaense",
  mir: "mirassol",
  ame: "america-mineiro",
};

/**
 * Default fallback color set when a club is not in our spec table. Always
 * ink-on-paper so the rule "no club fill" still holds for unknown clubs.
 */
const DEFAULT_COLORS: ClubColors = {
  primary: "#0F0F0F",
  text: "#353941",
  textDark: "#9CA0AB",
};

function resolveClub(club: string) {
  const slug = SLUG_ALIASES[club.toLowerCase()] ?? club.toLowerCase();
  const team = TEAMS_DATA.find((t) => t.id === slug);
  const colors = CLUB_COLORS[slug] ?? DEFAULT_COLORS;
  return { slug, team, colors };
}

function getInitials(name: string, max = 3): string {
  return (name || "?")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, max);
}

/** Append alpha to a hex color (#RRGGBB → rgba(r,g,b,a)). Safe at runtime. */
function withAlpha(hex: string, alpha: number): string {
  const m = /^#?([a-f\d]{6})$/i.exec(hex);
  if (!m) return hex;
  const int = parseInt(m[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface TeamChipProps {
  /** Team id or short slug (corinthians / cor / palmeiras / pal / …). */
  club: string;
  /** Visual size variant. */
  size?: "sm" | "lg";
  /** Optional meta text shown to the right of the team name on lg badges. */
  meta?: string;
  /**
   * Set true when rendering on a dark surface (scoreboard, ink panel). Switches
   * to translucent-white bg and brighter club-tone text.
   */
  onDark?: boolean;
  /** Optional click handler — when present, the badge renders as a button. */
  onClick?: () => void;
  className?: string;
  /** Override the team name shown (defaults to TEAMS_DATA.name). */
  name?: string;
}

export function TeamChip({
  club,
  size = "sm",
  meta,
  onDark = false,
  onClick,
  className,
  name,
}: TeamChipProps) {
  const { slug, team, colors } = resolveClub(club);
  const teamName = name ?? team?.name ?? club;
  const initials = team?.shortName ?? getInitials(teamName);
  const logoUrl = team?.logoUrl;

  // Style derivation per surface
  const borderColor = onDark ? withAlpha(colors.primary, 0.6) : withAlpha(colors.primary, 0.25);
  const bg = onDark ? "rgba(255, 255, 255, 0.08)" : "var(--paper)";
  const textColor = onDark ? colors.textDark : colors.text;

  // Size-specific tokens
  const isLg = size === "lg";
  const padding = isLg ? "6px 14px 6px 8px" : "3px 9px 3px 5px";
  const crestSize = isLg ? 22 : 16;
  const fontSize = isLg ? 14 : 12;
  const gap = isLg ? 8 : 6;

  const Tag: "button" | "span" = onClick ? "button" : "span";

  return (
    <Tag
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-r-full transition-colors select-none",
        onClick && "cursor-pointer hover:bg-paper-2",
        className,
      )}
      style={{
        padding,
        gap,
        background: bg,
        border: `1px solid ${borderColor}`,
        color: textColor,
        fontFamily: "var(--font-body)",
        fontSize,
        fontWeight: 600,
        lineHeight: 1,
      }}
      aria-label={teamName}
    >
      {/* Crest circle — contour + crest only, never fill with club color */}
      <span
        className="inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0"
        style={{
          width: crestSize,
          height: crestSize,
          background: onDark ? "rgba(255,255,255,0.06)" : "var(--card)",
          border: `1px solid ${withAlpha(colors.primary, 0.35)}`,
        }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt=""
            className="w-full h-full object-contain p-[1px]"
            loading="lazy"
            onError={(e) => {
              // Drop the broken image so the initials fallback shows.
              (e.currentTarget as HTMLImageElement).style.display = "none";
              const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (sibling) sibling.style.display = "flex";
            }}
          />
        ) : null}
        <span
          aria-hidden="true"
          className={cn(
            "w-full h-full items-center justify-center font-mono",
            logoUrl ? "hidden" : "flex",
          )}
          style={{
            background: colors.primary,
            color: "#FFFFFF",
            fontSize: isLg ? 10 : 8,
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          {initials}
        </span>
      </span>

      <span className="truncate">{teamName}</span>

      {meta && isLg && (
        <>
          <span
            aria-hidden="true"
            className="mx-1"
            style={{ color: "var(--slate-2)", fontWeight: 400 }}
          >
            ·
          </span>
          <span
            className="font-mono whitespace-nowrap"
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: onDark ? "var(--slate-2)" : "var(--slate)",
              letterSpacing: "0.02em",
            }}
          >
            {meta}
          </span>
        </>
      )}
    </Tag>
  );
}

/** Used internally and exported for the rare consumer who needs the raw tone. */
export function getClubColors(club: string): ClubColors {
  return resolveClub(club).colors;
}

export default TeamChip;

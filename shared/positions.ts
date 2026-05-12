/**
 * Canonical position system for the entire app.
 *
 * Abbreviation (stored in DB, used everywhere):
 *   GK, RB, LB, CB, CDM, CM, CAM, RW, LW, ST
 *
 * Sorting: GK → Defense → Midfield → Attack
 */

export const CANONICAL_POSITIONS = [
  "GK", "RB", "LB", "CB", "CDM", "CM", "CAM", "RW", "LW", "ST",
] as const;

export type CanonicalPosition = (typeof CANONICAL_POSITIONS)[number];

export type PositionSector = "GK" | "DEF" | "MID" | "FWD";

export const POSITION_TO_SECTOR: Record<CanonicalPosition, PositionSector> = {
  GK: "GK",
  RB: "DEF",
  LB: "DEF",
  CB: "DEF",
  CDM: "MID",
  CM: "MID",
  CAM: "MID",
  RW: "FWD",
  LW: "FWD",
  ST: "FWD",
};

export const SECTOR_LABELS: Record<PositionSector, string> = {
  GK: "Goleiros",
  DEF: "Defensores",
  MID: "Meio-campistas",
  FWD: "Atacantes",
};

export const POSITION_SORT_ORDER: Record<CanonicalPosition, number> = {
  GK: 0,
  RB: 1,
  CB: 2,
  LB: 3,
  CDM: 4,
  CM: 5,
  CAM: 6,
  RW: 7,
  LW: 8,
  ST: 9,
};

export const POSITION_LABELS_PT: Record<CanonicalPosition, string> = {
  GK: "GOL",
  RB: "LD",
  LB: "LE",
  CB: "ZAG",
  CDM: "VOL",
  CM: "MEI",
  CAM: "MEI",
  RW: "ATA",
  LW: "ATA",
  ST: "ATA",
};

const ALIAS_MAP: Record<string, CanonicalPosition> = {
  // Full English names (SofaScore / API format)
  goalkeeper: "GK",
  "right-back": "RB",
  "left-back": "LB",
  "centre-back": "CB",
  "center-back": "CB",
  "defensive midfield": "CDM",
  "central midfield": "CM",
  "attacking midfield": "CAM",
  "right winger": "RW",
  "left winger": "LW",
  "centre-forward": "ST",
  "center-forward": "ST",
  "second striker": "ST",

  // Wing-Back variants → fullback
  "right wing-back": "RB",
  "left wing-back": "LB",
  "wing-back": "RB",

  // English abbreviations (current DB enum + common variants)
  gk: "GK",
  rb: "RB",
  lb: "LB",
  cb: "CB",
  fb: "RB",
  wb: "RB",
  rwb: "RB",
  lwb: "LB",
  dm: "CDM",
  cdm: "CDM",
  cm: "CM",
  am: "CAM",
  cam: "CAM",
  rw: "RW",
  lw: "LW",
  w: "RW",
  st: "ST",
  ss: "ST",
  cf: "ST",
  lm: "CM",
  rm: "CM",
  lcm: "CM",
  rcm: "CM",
  lcb: "CB",
  rcb: "CB",

  // Positional codes from lineups (DC, DR, DL, etc.)
  dc: "CB",
  dr: "RB",
  dl: "LB",
  mc: "CM",
  mr: "CM",
  ml: "CM",

  // Portuguese abbreviations (legacy)
  gol: "GK",
  ld: "RB",
  le: "LB",
  zag: "CB",
  vol: "CDM",
  mei: "CM",
  ata: "ST",

  // Keywords
  keeper: "GK",
  goleiro: "GK",
  defender: "CB",
  defensor: "CB",
  midfielder: "CM",
  "meio-campista": "CM",
  forward: "ST",
  atacante: "ST",
  winger: "RW",
  striker: "ST",
  back: "CB",
};

/**
 * Normalizes any position string (full name, abbreviation, code) to
 * one of the 10 canonical positions. Returns "CM" for unknown input.
 */
export function normalizeToCanonical(position: string | null | undefined): CanonicalPosition {
  const raw = (position ?? "").trim();
  if (!raw) return "CM";

  const lower = raw.toLowerCase();

  const direct = ALIAS_MAP[lower];
  if (direct) return direct;

  for (const [alias, canonical] of Object.entries(ALIAS_MAP)) {
    if (lower.includes(alias)) return canonical;
  }

  return "CM";
}

/**
 * Gets the PT-BR abbreviation for display: GOL, LD, LE, ZAG, VOL, MEI, ATA.
 */
export function positionToPtBr(position: string | null | undefined): string {
  const canonical = normalizeToCanonical(position);
  return POSITION_LABELS_PT[canonical] ?? "MEI";
}

/**
 * Gets the sector for a position.
 */
export function positionToSectorFromCanonical(position: string | null | undefined): PositionSector {
  const canonical = normalizeToCanonical(position);
  return POSITION_TO_SECTOR[canonical] ?? "MID";
}

/**
 * Sorts players by position: GK → DEF → MID → FWD.
 */
export function sortByPositionOrder<T extends { position?: string | null }>(players: T[]): T[] {
  return [...players].sort((a, b) => {
    const posA = normalizeToCanonical(a.position);
    const posB = normalizeToCanonical(b.position);
    return (POSITION_SORT_ORDER[posA] ?? 99) - (POSITION_SORT_ORDER[posB] ?? 99);
  });
}

/**
 * Gets the sector label in PT-BR for a position.
 */
export function getSectorLabelForPosition(position: string | null | undefined): string {
  const sector = positionToSectorFromCanonical(position);
  return SECTOR_LABELS[sector];
}

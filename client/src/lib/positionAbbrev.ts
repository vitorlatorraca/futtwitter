/**
 * Converts position (and optional sector) to Brazilian Portuguese abbreviation for lineup display.
 * Used in TacticalBoard "Em campo" list: GOL, LD, ZAG, LE, VOL, MEI, ATA.
 */
export type PositionAbbrev =
  | 'GOL'
  | 'LD'
  | 'ZAG'
  | 'LE'
  | 'VOL'
  | 'MEI'
  | 'ATA'
  | '—';

/**
 * Maps position string (and optional sector) to PT-BR abbreviation.
 * Fallback: MEI for unknown midfield-like, "—" only when truly unknown.
 */
export function toPtBrAbbrev(
  position: string | null | undefined,
  _sector?: string
): PositionAbbrev {
  const p = (position ?? '').trim();
  const lower = p.toLowerCase();
  const upper = p.toUpperCase();

  // Goalkeeper
  if (
    p.includes('Goalkeeper') ||
    lower.includes('goalkeeper') ||
    lower.includes('keeper') ||
    upper === 'GK'
  ) {
    return 'GOL';
  }

  // Right-Back / RWB
  if (
    p.includes('Right-Back') ||
    p.includes('Right Wing-Back') ||
    upper === 'RB' ||
    upper === 'RWB'
  ) {
    return 'LD';
  }

  // Left-Back / LWB
  if (
    p.includes('Left-Back') ||
    p.includes('Left Wing-Back') ||
    upper === 'LB' ||
    upper === 'LWB'
  ) {
    return 'LE';
  }

  // Centre-Back
  if (
    p.includes('Centre-Back') ||
    upper === 'CB' ||
    upper === 'LCB' ||
    upper === 'RCB'
  ) {
    return 'ZAG';
  }

  // Defensive Midfielder
  if (
    p.includes('Defensive Midfield') ||
    upper === 'DM' ||
    upper === 'CDM'
  ) {
    return 'VOL';
  }

  // Midfielder / CM / AM / CAM / LM / RM
  if (
    p.includes('Central Midfield') ||
    p.includes('Attacking Midfield') ||
    ['CM', 'AM', 'CAM', 'LM', 'RM', 'LCM', 'RCM'].some((x) => upper.includes(x))
  ) {
    return 'MEI';
  }

  // Forward / ST / CF / LW / RW
  if (
    p.includes('Centre-Forward') ||
    p.includes('Second Striker') ||
    p.includes('Left Winger') ||
    p.includes('Right Winger') ||
    ['ST', 'CF', 'LW', 'RW'].some((x) => upper.includes(x))
  ) {
    return 'ATA';
  }

  // Heuristic by keyword
  if (lower.includes('back') || lower.includes('defender')) return 'ZAG';
  if (lower.includes('midfield') || lower.includes('midfielder')) return 'MEI';
  if (lower.includes('forward') || lower.includes('winger') || lower.includes('striker')) return 'ATA';

  return 'MEI';
}

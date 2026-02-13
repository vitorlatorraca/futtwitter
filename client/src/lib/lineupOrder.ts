/**
 * Ordenação de jogadores para escalação em linha.
 * GK → DEF → MID → ATT, com sub-ordem dentro de cada grupo.
 */

export type LineupPlayer = {
  playerId: string;
  name: string;
  shirtNumber?: number | null;
  position?: string | null;
  lineupOrder?: number;
  slot?: number;
  index?: number;
};

/** Normaliza posição para setor: GK | DEF | MID | ATT */
export function getSector(position: string | null | undefined): 'GK' | 'DEF' | 'MID' | 'ATT' {
  const p = (position || '').trim();
  const lower = p.toLowerCase();
  const upper = p.toUpperCase();

  if (p.includes('Goalkeeper') || p.includes('keeper') || upper === 'GK') return 'GK';
  if (
    p.includes('Centre-Back') ||
    p.includes('Left-Back') ||
    p.includes('Right-Back') ||
    p.includes('Wing-Back') ||
    ['CB', 'LB', 'RB', 'LCB', 'RCB', 'RWB', 'LWB'].some((x) => upper.includes(x))
  )
    return 'DEF';
  if (
    p.includes('Defensive Midfield') ||
    p.includes('Central Midfield') ||
    p.includes('Attacking Midfield') ||
    ['DM', 'CDM', 'CM', 'AM', 'CAM', 'LM', 'RM'].some((x) => upper.includes(x))
  )
    return 'MID';
  if (
    p.includes('Centre-Forward') ||
    p.includes('Second Striker') ||
    p.includes('Left Winger') ||
    p.includes('Right Winger') ||
    ['RW', 'LW', 'ST', 'CF'].some((x) => upper.includes(x))
  )
    return 'ATT';

  if (lower.includes('back') || lower.includes('defender')) return 'DEF';
  if (lower.includes('midfield') || lower.includes('midfielder')) return 'MID';
  return 'ATT';
}

/** Ordem numérica do setor (GK=0, DEF=1, MID=2, ATT=3) */
const SECTOR_ORDER: Record<string, number> = { GK: 0, DEF: 1, MID: 2, ATT: 3 };

/** Sub-ordem dentro do grupo DEF: RB, RWB, CB, LCB, RCB, LB, LWB */
const DEF_POSITION_ORDER: Record<string, number> = {
  'Right-Back': 0,
  RB: 0,
  RWB: 1,
  'Right Wing-Back': 1,
  'Centre-Back': 2,
  CB: 2,
  LCB: 3,
  RCB: 4,
  'Left-Back': 5,
  LB: 5,
  LWB: 6,
  'Left Wing-Back': 6,
};

/** Sub-ordem dentro do grupo MID */
const MID_POSITION_ORDER: Record<string, number> = {
  'Defensive Midfield': 0,
  DM: 0,
  CDM: 0,
  'Central Midfield': 1,
  CM: 1,
  'Attacking Midfield': 2,
  AM: 2,
  CAM: 2,
  'Left Winger': 3,
  LM: 3,
  'Right Winger': 4,
  RM: 4,
};

/** Sub-ordem dentro do grupo ATT */
const ATT_POSITION_ORDER: Record<string, number> = {
  'Right Winger': 0,
  RW: 0,
  'Left Winger': 1,
  LW: 1,
  'Centre-Forward': 2,
  ST: 2,
  'Second Striker': 3,
  CF: 3,
};

function getPositionOrder(sector: string, position: string): number {
  const p = (position || '').trim();
  if (sector === 'DEF') return DEF_POSITION_ORDER[p] ?? 99;
  if (sector === 'MID') return MID_POSITION_ORDER[p] ?? 99;
  if (sector === 'ATT') return ATT_POSITION_ORDER[p] ?? 99;
  return 0;
}

/**
 * Ordena jogadores por posição: GK → DEF → MID → ATT.
 * Dentro de cada grupo: lineupOrder/slot/index se existir, senão sub-ordem por posição, senão shirtNumber, senão ordem original.
 */
export function sortLineupPlayers<T extends LineupPlayer>(players: T[]): T[] {
  return [...players].sort((a, b) => {
    const sectorA = getSector(a.position);
    const sectorB = getSector(b.position);
    const orderA = SECTOR_ORDER[sectorA] ?? 99;
    const orderB = SECTOR_ORDER[sectorB] ?? 99;
    if (orderA !== orderB) return orderA - orderB;

    // Mesmo setor: usar lineupOrder/slot/index se existir
    const idxA = (a as any).lineupOrder ?? (a as any).slot ?? (a as any).index ?? -1;
    const idxB = (b as any).lineupOrder ?? (b as any).slot ?? (b as any).index ?? -1;
    if (idxA >= 0 && idxB >= 0 && idxA !== idxB) return idxA - idxB;

    // Sub-ordem por posição dentro do grupo
    const posOrderA = getPositionOrder(sectorA, a.position ?? '');
    const posOrderB = getPositionOrder(sectorB, b.position ?? '');
    if (posOrderA !== posOrderB) return posOrderA - posOrderB;

    // Fallback: shirtNumber
    const numA = a.shirtNumber ?? 99;
    const numB = b.shirtNumber ?? 99;
    return numA - numB;
  });
}

/**
 * Formata a escalação em linha com separadores.
 * GK sozinho + ";"
 * Defensores separados por ","
 * Meio separados por ","
 * Atacantes separados por ","
 */
export function formatLineupText(players: LineupPlayer[]): string {
  if (players.length === 0) return '';
  const sorted = sortLineupPlayers(players);
  const gk = sorted.filter((p) => getSector(p.position) === 'GK');
  const def = sorted.filter((p) => getSector(p.position) === 'DEF');
  const mid = sorted.filter((p) => getSector(p.position) === 'MID');
  const att = sorted.filter((p) => getSector(p.position) === 'ATT');

  const parts: string[] = [];
  if (gk.length > 0) parts.push(gk.map((p) => p.name).join(', '));
  if (def.length > 0) parts.push(def.map((p) => p.name).join(', '));
  if (mid.length > 0) parts.push(mid.map((p) => p.name).join(', '));
  if (att.length > 0) parts.push(att.map((p) => p.name).join(', '));

  let text = parts.join('; ');
  if (sorted.length < 11) text += ' —';
  return text;
}

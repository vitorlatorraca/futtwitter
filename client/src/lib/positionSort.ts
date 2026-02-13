/**
 * Normaliza posição para ordenação na seção "Notas da torcida".
 * Ordem: GOL → laterais (LD, LE) → zagueiros → volantes → meias → atacantes.
 */

export type NormalizedPosition = 'GOL' | 'LD' | 'LE' | 'ZAG' | 'VOL' | 'MEI' | 'ATA';

export const POSITION_ORDER: Record<NormalizedPosition, number> = {
  GOL: 1,
  LD: 2,
  LE: 3,
  ZAG: 4,
  VOL: 5,
  MEI: 6,
  ATA: 7,
};

export function normalizePosition(position: string | null | undefined): NormalizedPosition {
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

  // Heuristic
  if (lower.includes('back') || lower.includes('defender')) return 'ZAG';
  if (lower.includes('midfield') || lower.includes('midfielder')) return 'MEI';
  if (lower.includes('forward') || lower.includes('winger') || lower.includes('striker')) return 'ATA';

  return 'MEI';
}

/** Ordena jogadores por posição: GOL → LD → LE → ZAG → VOL → MEI → ATA */
export function sortByPosition<T extends { position?: string | null }>(players: T[]): T[] {
  return [...players].sort((a, b) => {
    const posA = normalizePosition(a.position);
    const posB = normalizePosition(b.position);
    return (POSITION_ORDER[posA] ?? 99) - (POSITION_ORDER[posB] ?? 99);
  });
}

/** Mapeia posição normalizada para label de setor (DEFESA, MEIO, ATAQUE) */
export function getSectorLabel(pos: NormalizedPosition): string {
  if (pos === 'GOL') return 'GOL';
  if (pos === 'LD' || pos === 'LE' || pos === 'ZAG') return 'DEFESA';
  if (pos === 'VOL' || pos === 'MEI') return 'MEIO';
  return 'ATAQUE';
}

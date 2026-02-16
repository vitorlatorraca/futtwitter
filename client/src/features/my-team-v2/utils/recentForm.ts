/**
 * Utilitário puro para calcular forma recente (W/D/L) a partir de jogos.
 * Usa os mesmos dados que "Top avaliados (últimos 5 jogos)" — matches vindos do extended.
 */

export type FormResult = 'W' | 'D' | 'L';

/** Match com placar no formato do projeto (matches table / RecentFormMatch) */
export interface MatchLike {
  teamScore?: number | null;
  opponentScore?: number | null;
  /** Para formato matchGames: homeTeamId/awayTeamId + homeGoals/awayGoals */
  homeTeamId?: string | number | null;
  awayTeamId?: string | number | null;
  teamId?: string | number | null;
  homeGoals?: number | null;
  awayGoals?: number | null;
}

/**
 * Calcula forma recente (W/D/L) dos últimos N jogos.
 * Ordem: mais recente → mais antigo (assume que matches já vêm ordenados).
 *
 * @param matches - Array de jogos (já ordenado do mais recente ao mais antigo)
 * @param teamId - ID do time do usuário (para formato home/away)
 * @param limit - Máximo de resultados (default 5)
 * @returns Array de "W" | "D" | "L"
 */
export function getRecentForm(
  matches: MatchLike[],
  teamId: string | number,
  limit = 5
): FormResult[] {
  const teamIdStr = String(teamId);
  const limited = matches.slice(0, limit);

  return limited.map((m) => {
    let goalsFor: number | null = null;
    let goalsAgainst: number | null = null;

    // Formato matches table / RecentFormMatch: teamScore = gols do time, opponentScore = gols do adversário
    if (m.teamScore != null && m.opponentScore != null) {
      goalsFor = m.teamScore;
      goalsAgainst = m.opponentScore;
    }
    // Formato matchGames: homeGoals/awayGoals + homeTeamId/awayTeamId
    else if (
      m.homeTeamId != null &&
      m.awayTeamId != null &&
      m.homeGoals != null &&
      m.awayGoals != null
    ) {
      const isHome = String(m.homeTeamId) === teamIdStr;
      goalsFor = isHome ? m.homeGoals : m.awayGoals;
      goalsAgainst = isHome ? m.awayGoals : m.homeGoals;
    }

    if (goalsFor == null || goalsAgainst == null) return 'D' as FormResult;
    if (goalsFor > goalsAgainst) return 'W' as FormResult;
    if (goalsFor < goalsAgainst) return 'L' as FormResult;
    return 'D' as FormResult;
  });
}

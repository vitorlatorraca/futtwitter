/**
 * Única função que calcula resultForTeam (W/D/L) a partir de um jogo.
 * Usada pelo endpoint /api/my-team/overview e por qualquer outro lugar que precise derivar forma.
 */

export type ResultForTeam = "W" | "D" | "L";

export interface MatchWithScore {
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status?: string;
}

/**
 * Calcula o resultado do jogo para o time especificado.
 * Retorna null se o jogo não estiver finalizado (FT) ou não tiver placar.
 */
export function getResultForTeam(match: MatchWithScore, teamId: string): ResultForTeam | null {
  if (match.status !== "FT" && match.status !== "finished") return null;
  if (match.homeScore == null || match.awayScore == null) return null;

  const isHome = String(match.homeTeamId ?? "") === String(teamId);
  const goalsFor = isHome ? match.homeScore : match.awayScore;
  const goalsAgainst = isHome ? match.awayScore : match.homeScore;

  if (goalsFor > goalsAgainst) return "W";
  if (goalsFor < goalsAgainst) return "L";
  return "D";
}

/**
 * Deriva array de forma (W/D/L) a partir de jogos finalizados.
 * Ordem: mais recente → mais antigo (mesma ordem dos jogos passados).
 * Inclui apenas jogos com placar final.
 */
export function deriveFormFromMatches(
  matches: MatchWithScore[],
  teamId: string,
  limit = 5
): ResultForTeam[] {
  const results: ResultForTeam[] = [];
  for (const m of matches.slice(0, limit)) {
    const r = getResultForTeam(m, teamId);
    if (r != null) results.push(r);
  }
  return results;
}

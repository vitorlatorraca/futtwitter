import type { TeamMatch } from "./types";
import type { ResultVariant } from "./types";

function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/-/g, " ");
}

export function getResultForTeam(match: TeamMatch, teamId: string): ResultVariant | null {
  if (match.status !== "FT" || match.homeScore == null || match.awayScore == null) return null;
  const isHome =
    match.homeTeamId === teamId ||
    normalizeTeamName(match.homeTeamName).includes(normalizeTeamName(teamId)) ||
    normalizeTeamName(teamId).includes(normalizeTeamName(match.homeTeamName));
  if (isHome) {
    if (match.homeScore > match.awayScore) return "W";
    if (match.homeScore < match.awayScore) return "L";
    return "D";
  }
  if (match.awayScore > match.homeScore) return "W";
  if (match.awayScore < match.homeScore) return "L";
  return "D";
}

export function formatMatchDate(match: TeamMatch): string {
  if (match.status === "POSTPONED" || match.status === "CANCELED") return "Adiado";
  if (match.status === "FT") return "FT";
  const d = new Date(match.kickoffAt);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMatchDateShort(match: TeamMatch): string {
  if (match.status === "POSTPONED" || match.status === "CANCELED") return "Adiado";
  if (match.status === "FT") return "FT";
  const d = new Date(match.kickoffAt);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

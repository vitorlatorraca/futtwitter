/**
 * Regras de classificação de posição -> setor (GK|DEF|MID|FWD)
 * Usado de forma consistente no backend e frontend.
 */
export type PlayerSector = "GK" | "DEF" | "MID" | "FWD";

export const SECTOR_LABELS: Record<PlayerSector, string> = {
  GK: "Goleiros",
  DEF: "Defensores",
  MID: "Meio-campistas",
  FWD: "Atacantes",
};

export function positionToSector(position: string): PlayerSector {
  const p = (position || "").trim();
  switch (p) {
    case "Goalkeeper":
      return "GK";
    case "Centre-Back":
    case "Left-Back":
    case "Right-Back":
    case "Wing-Back":
      return "DEF";
    case "Defensive Midfield":
    case "Central Midfield":
    case "Attacking Midfield":
      return "MID";
    case "Left Winger":
    case "Right Winger":
    case "Centre-Forward":
    case "Second Striker":
      return "FWD";
    default:
      if (p.toLowerCase().includes("keeper") || p.toLowerCase().includes("goalkeeper")) return "GK";
      if (p.toLowerCase().includes("back") || p.toLowerCase().includes("defender")) return "DEF";
      if (p.toLowerCase().includes("midfield") || p.toLowerCase().includes("midfielder")) return "MID";
      return "FWD";
  }
}

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

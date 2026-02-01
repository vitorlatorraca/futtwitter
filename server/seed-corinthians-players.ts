import "dotenv/config"; // keep first: required for scripts relying on `DATABASE_URL`
import { db } from "./db";
import { players as playersTable, teams } from "@shared/schema";
import { eq, ilike, or } from "drizzle-orm";
import { TEAMS_DATA } from "./teams-data";

type RawPlayer = {
  shirtNumber: number | null;
  name: string;
  position: string;
  birthDate: string; // YYYY-MM-DD
  nationalityPrimary: string;
  nationalitySecondary: string | null;
  marketValueRaw: string; // e.g. "€10.00m", "€500k", "-"
  fromClub: string | null;
};

function parseMarketValueEur(marketValueRaw: string): number | null {
  const raw = String(marketValueRaw ?? "").trim();
  if (!raw || raw === "-") return null;

  // Examples:
  // "€10.00m" -> 10_000_000
  // "€500k" -> 500_000
  const cleaned = raw.replace(/\s+/g, "").replace("€", "");
  const last = cleaned.slice(-1).toLowerCase();
  const numberPart = last === "m" || last === "k" ? cleaned.slice(0, -1) : cleaned;

  const value = Number(numberPart);
  if (!Number.isFinite(value) || value < 0) return null;

  if (last === "m") return Math.round(value * 1_000_000);
  if (last === "k") return Math.round(value * 1_000);
  return Math.round(value);
}

async function getOrCreateCorinthiansTeamId(): Promise<string> {
  const [existing] = await db
    .select()
    .from(teams)
    .where(or(eq(teams.id, "corinthians"), ilike(teams.name, "%Corinthians%")))
    .limit(1);

  if (existing) return existing.id;

  const base = TEAMS_DATA.find((t) => t.id === "corinthians");
  await db.insert(teams).values({
    id: "corinthians",
    name: base?.name ?? "Corinthians",
    shortName: base?.shortName ?? "COR",
    logoUrl: base?.logoUrl ?? "https://logodetimes.com/corinthians.png",
    primaryColor: base?.primaryColor ?? "#000000",
    secondaryColor: base?.secondaryColor ?? "#FFFFFF",
  });

  return "corinthians";
}

const players: RawPlayer[] = [
  // Goalkeepers
  { shirtNumber: 1,  name: "Hugo Souza",       position: "Goalkeeper",        birthDate: "1999-01-31", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€10.00m", fromClub: null },
  { shirtNumber: 32, name: "Matheus Donelli",  position: "Goalkeeper",        birthDate: "2002-05-17", nationalityPrimary: "Brazil",     nationalitySecondary: "Italy",  marketValueRaw: "€1.50m",  fromClub: null },
  { shirtNumber: 40, name: "Felipe Longo",     position: "Goalkeeper",        birthDate: "2005-03-05", nationalityPrimary: "Brazil",     nationalitySecondary: "Italy",  marketValueRaw: "€500k",   fromClub: null },
  { shirtNumber: 51, name: "Kauê",             position: "Goalkeeper",        birthDate: "2004-02-08", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "-",       fromClub: null },

  // Centre-Back
  { shirtNumber: 47, name: "Tchoca",           position: "Centre-Back",       birthDate: "2003-12-31", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€2.00m",  fromClub: null },
  { shirtNumber: 25, name: "Cacá",             position: "Centre-Back",       birthDate: "1999-04-25", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€1.70m",  fromClub: null },
  { shirtNumber: 5,  name: "André Ramalho",    position: "Centre-Back",       birthDate: "1992-02-16", nationalityPrimary: "Brazil",     nationalitySecondary: "Italy",  marketValueRaw: "€1.20m",  fromClub: null },
  { shirtNumber: 13, name: "Gustavo Henrique", position: "Centre-Back",       birthDate: "1993-03-24", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€800k",   fromClub: null },
  { shirtNumber: null, name: "Gabriel Paulista", position: "Centre-Back",     birthDate: "1990-11-26", nationalityPrimary: "Brazil",     nationalitySecondary: "Spain",  marketValueRaw: "€700k",   fromClub: "Besiktas JK" },
  { shirtNumber: null, name: "Renato Santos",    position: "Centre-Back",     birthDate: "2004-10-11", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "-",       fromClub: "Atlético Clube Goianiense" },

  // Left-Back
  { shirtNumber: 21, name: "Matheus Bidu",     position: "Left-Back",         birthDate: "1999-05-04", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€3.00m",  fromClub: null },
  { shirtNumber: 46, name: "Hugo",             position: "Left-Back",         birthDate: "1997-08-29", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€1.20m",  fromClub: null },

  // Right-Back
  { shirtNumber: 2,  name: "Matheuzinho",      position: "Right-Back",        birthDate: "2000-09-08", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€6.00m",  fromClub: null },
  { shirtNumber: 20, name: "Pedro Milans",     position: "Right-Back",        birthDate: "2002-03-24", nationalityPrimary: "Uruguay",    nationalitySecondary: "Italy",  marketValueRaw: "€1.50m",  fromClub: "CA Peñarol" },
  { shirtNumber: null, name: "Léo Mana",       position: "Right-Back",        birthDate: "2004-04-06", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€700k",   fromClub: "Criciúma EC" },

  // Defensive Midfield
  { shirtNumber: 14, name: "Raniele",          position: "Defensive Midfield",birthDate: "1996-12-31", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€3.00m",  fromClub: null },
  { shirtNumber: 70, name: "José Martínez",    position: "Defensive Midfield",birthDate: "1994-08-07", nationalityPrimary: "Venezuela",  nationalitySecondary: null,     marketValueRaw: "€2.00m",  fromClub: null },

  // Central Midfield
  { shirtNumber: 7,  name: "Breno Bidon",      position: "Central Midfield",  birthDate: "2005-02-20", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€14.00m", fromClub: null },
  { shirtNumber: null, name: "Alex Santana",   position: "Central Midfield",  birthDate: "1995-05-13", nationalityPrimary: "Brazil",     nationalitySecondary: "Bulgaria", marketValueRaw: "€1.20m", fromClub: "Grêmio Foot-Ball Porto Alegrense" },
  { shirtNumber: 23, name: "Matheus Pereira",  position: "Central Midfield",  birthDate: "1998-02-25", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€1.20m",  fromClub: "Fortaleza Esporte Clube" },
  { shirtNumber: 35, name: "Charles",          position: "Central Midfield",  birthDate: "1996-06-19", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€1.00m",  fromClub: null },
  { shirtNumber: 19, name: "André Carrillo",   position: "Central Midfield",  birthDate: "1991-06-14", nationalityPrimary: "Peru",       nationalitySecondary: "Portugal", marketValueRaw: "€900k",  fromClub: null },
  { shirtNumber: 49, name: "André",            position: "Central Midfield",  birthDate: "2006-06-20", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "-",       fromClub: "SC Corinthians U20" },
  { shirtNumber: 54, name: "Bahia",            position: "Central Midfield",  birthDate: "2006-01-02", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "-",       fromClub: null },

  // Attacking Midfield
  { shirtNumber: 8,  name: "Rodrigo Garro",    position: "Attacking Midfield",birthDate: "1998-01-04", nationalityPrimary: "Argentina",  nationalitySecondary: "Italy",  marketValueRaw: "€12.00m", fromClub: null },

  // Wingers
  { shirtNumber: 11, name: "Vitinho",          position: "Left Winger",       birthDate: "1993-10-09", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€1.00m",  fromClub: "Al-Ettifaq FC" },
  { shirtNumber: 31, name: "Kayke",            position: "Left Winger",       birthDate: "2004-04-28", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€800k",   fromClub: null },
  { shirtNumber: 37, name: "Kaio César",       position: "Right Winger",      birthDate: "2004-02-15", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€4.50m",  fromClub: "Al-Hilal SFC" },
  { shirtNumber: 61, name: "Dieguinho",        position: "Right Winger",      birthDate: "2007-09-16", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€1.50m",  fromClub: "SC Corinthians U17" },

  // Centre-Forward
  { shirtNumber: 9,  name: "Yuri Alberto",     position: "Centre-Forward",    birthDate: "2001-03-18", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€22.00m", fromClub: null },
  { shirtNumber: 10, name: "Memphis Depay",    position: "Centre-Forward",    birthDate: "1994-02-13", nationalityPrimary: "Netherlands",nationalitySecondary: "Ghana", marketValueRaw: "€8.00m",  fromClub: null },
  { shirtNumber: 56, name: "Gui Negão",        position: "Centre-Forward",    birthDate: "2007-02-06", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€8.00m",  fromClub: "SC Corinthians U20" },
  { shirtNumber: 18, name: "Pedro Raul",       position: "Centre-Forward",    birthDate: "1996-11-05", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€4.00m",  fromClub: "Ceará Sporting Club" },
];

async function seedCorinthiansPlayers() {
  console.log("Starting Corinthians players seed (idempotent)...");

  const teamId = await getOrCreateCorinthiansTeamId();
  const now = new Date();

  let upserts = 0;
  for (const p of players) {
    const marketValueEur = parseMarketValueEur(p.marketValueRaw);

    await db
      .insert(playersTable)
      .values({
        teamId,
        shirtNumber: p.shirtNumber,
        name: p.name,
        position: p.position,
        birthDate: p.birthDate,
        nationalityPrimary: p.nationalityPrimary,
        nationalitySecondary: p.nationalitySecondary,
        marketValueEur,
        fromClub: p.fromClub,
      })
      .onConflictDoUpdate({
        target: [playersTable.teamId, playersTable.name, playersTable.birthDate],
        set: {
          shirtNumber: p.shirtNumber,
          position: p.position,
          nationalityPrimary: p.nationalityPrimary,
          nationalitySecondary: p.nationalitySecondary,
          marketValueEur,
          fromClub: p.fromClub,
          updatedAt: now,
        },
      });

    upserts += 1;
  }

  console.log(`✅ Done. Upserted ${upserts} players for teamId=${teamId}`);
}

seedCorinthiansPlayers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });


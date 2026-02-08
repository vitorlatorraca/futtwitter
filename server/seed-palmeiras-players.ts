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

async function getOrCreatePalmeirasTeamId(): Promise<string> {
  const [existing] = await db
    .select()
    .from(teams)
    .where(or(eq(teams.id, "palmeiras"), ilike(teams.name, "%Palmeiras%")))
    .limit(1);

  if (existing) return existing.id;

  const base = TEAMS_DATA.find((t) => t.id === "palmeiras");
  await db.insert(teams).values({
    id: "palmeiras",
    name: base?.name ?? "Palmeiras",
    shortName: base?.shortName ?? "PAL",
    logoUrl: base?.logoUrl ?? "https://logodetimes.com/palmeiras.png",
    primaryColor: base?.primaryColor ?? "#006437",
    secondaryColor: base?.secondaryColor ?? "#FFFFFF",
  });

  return "palmeiras";
}

// Elenco Palmeiras - Transfermarkt (Sociedade Esportiva Palmeiras, temporada 2024)
const players: RawPlayer[] = [
  // Goalkeepers
  { shirtNumber: 1,  name: "Carlos Miguel",    position: "Goalkeeper",        birthDate: "1998-10-09", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€4.00m",  fromClub: null },
  { shirtNumber: 21, name: "Weverton",         position: "Goalkeeper",        birthDate: "1987-12-13", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€1.00m",  fromClub: null },
  { shirtNumber: 14, name: "Marcelo Lomba",    position: "Goalkeeper",        birthDate: "1986-12-18", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€150k",   fromClub: null },
  { shirtNumber: 24, name: "Aranha",           position: "Goalkeeper",        birthDate: "2005-02-07", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "-",       fromClub: null },

  // Centre-Back
  { shirtNumber: 26, name: "Murilo",           position: "Centre-Back",       birthDate: "1997-03-27", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€6.00m",  fromClub: null },
  { shirtNumber: 13, name: "Micael",           position: "Centre-Back",       birthDate: "2000-08-12", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€5.00m",  fromClub: null },
  { shirtNumber: 15, name: "Gustavo Gómez",    position: "Centre-Back",       birthDate: "1993-05-06", nationalityPrimary: "Paraguay",   nationalitySecondary: null,     marketValueRaw: "€5.00m",  fromClub: null },
  { shirtNumber: 3,  name: "Bruno Fuchs",      position: "Centre-Back",       birthDate: "1999-04-01", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€3.00m",  fromClub: null },
  { shirtNumber: 43, name: "Luis Benedetti",   position: "Centre-Back",       birthDate: "2006-06-07", nationalityPrimary: "Colombia",   nationalitySecondary: null,     marketValueRaw: "€1.00m",  fromClub: null },

  // Left-Back
  { shirtNumber: 22, name: "Joaquín Piquerez", position: "Left-Back",         birthDate: "1998-08-24", nationalityPrimary: "Uruguay",    nationalitySecondary: null,     marketValueRaw: "€15.00m", fromClub: null },
  { shirtNumber: 6,  name: "Jefté",            position: "Left-Back",         birthDate: "2003-12-21", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€4.00m",  fromClub: null },

  // Right-Back
  { shirtNumber: 4,  name: "Agustín Giay",     position: "Right-Back",        birthDate: "2004-01-16", nationalityPrimary: "Argentina",  nationalitySecondary: null,     marketValueRaw: "€11.00m", fromClub: null },
  { shirtNumber: 12, name: "Khellven",         position: "Right-Back",        birthDate: "2001-02-25", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€5.00m",  fromClub: null },

  // Defensive Midfield
  { shirtNumber: 5,  name: "Aníbal Moreno",    position: "Defensive Midfield",birthDate: "1999-05-13", nationalityPrimary: "Argentina",  nationalitySecondary: null,     marketValueRaw: "€11.00m", fromClub: null },
  { shirtNumber: 32, name: "Emiliano Martínez",position: "Defensive Midfield",birthDate: "1999-08-17", nationalityPrimary: "Argentina",  nationalitySecondary: null,     marketValueRaw: "€9.00m",  fromClub: null },

  // Central Midfield
  { shirtNumber: 30, name: "Lucas Evangelista",position: "Central Midfield",  birthDate: "1995-05-06", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€3.50m",  fromClub: null },
  { shirtNumber: 38, name: "Figueiredo",       position: "Central Midfield",  birthDate: "2006-03-03", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "-",       fromClub: null },

  // Attacking Midfield
  { shirtNumber: 8,  name: "Andreas Pereira",  position: "Attacking Midfield",birthDate: "1996-01-01", nationalityPrimary: "Brazil",     nationalitySecondary: "Belgium", marketValueRaw: "€18.00m", fromClub: null },
  { shirtNumber: 18, name: "Mauricio",         position: "Attacking Midfield",birthDate: "2001-06-22", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€12.00m", fromClub: null },
  { shirtNumber: 23, name: "Raphael Veiga",    position: "Attacking Midfield",birthDate: "1995-06-19", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€12.00m", fromClub: null },
  { shirtNumber: 40, name: "Allan",            position: "Attacking Midfield",birthDate: "2004-04-19", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€4.00m",  fromClub: null },
  { shirtNumber: null, name: "Rômulo",         position: "Attacking Midfield",birthDate: "2001-10-07", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€1.80m",  fromClub: null },

  // Left Winger
  { shirtNumber: 10, name: "Paulinho",         position: "Left Winger",       birthDate: "2000-07-15", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€14.00m", fromClub: null },
  { shirtNumber: 19, name: "Ramón Sosa",       position: "Left Winger",       birthDate: "1999-08-31", nationalityPrimary: "Paraguay",   nationalitySecondary: null,     marketValueRaw: "€12.00m", fromClub: null },
  { shirtNumber: 11, name: "Bruno Rodrigues",  position: "Left Winger",       birthDate: "1997-03-07", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€1.50m",  fromClub: null },

  // Right Winger
  { shirtNumber: 17, name: "Facundo Torres",   position: "Right Winger",      birthDate: "2000-04-13", nationalityPrimary: "Uruguay",    nationalitySecondary: null,     marketValueRaw: "€15.00m", fromClub: null },
  { shirtNumber: 7,  name: "Felipe Anderson",  position: "Right Winger",      birthDate: "1993-04-15", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€3.00m",  fromClub: null },

  // Centre-Forward
  { shirtNumber: 9,  name: "Vitor Roque",      position: "Centre-Forward",    birthDate: "2005-02-28", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€20.00m", fromClub: null },
  { shirtNumber: 42, name: "José Manuel López",position: "Centre-Forward",    birthDate: "2000-12-06", nationalityPrimary: "Argentina",  nationalitySecondary: null,     marketValueRaw: "€12.00m", fromClub: null },
  { shirtNumber: 31, name: "Luighi",           position: "Centre-Forward",    birthDate: "2006-04-30", nationalityPrimary: "Brazil",     nationalitySecondary: null,     marketValueRaw: "€5.00m",  fromClub: null },
];

async function seedPalmeirasPlayers() {
  console.log("Starting Palmeiras players seed (idempotent)...");

  const teamId = await getOrCreatePalmeirasTeamId();
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

seedPalmeirasPlayers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });

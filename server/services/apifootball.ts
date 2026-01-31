type SquadTeam = { id: number; name: string; logo?: string };
type SquadPlayer = {
  id: number;
  name: string;
  age?: number;
  nationality?: string;
  photo?: string;
  position?: string;
};

export type SquadResult = {
  team: SquadTeam;
  players: SquadPlayer[];
};

type CacheEntry<T> = { expiresAtMs: number; value: T };
const cache = new Map<string, CacheEntry<SquadResult>>();

function getApiKey(): string {
  const apiKey = (process.env.APIFOOTBALL_API_KEY ?? "").trim();
  if (!apiKey) {
    throw new Error("APIFOOTBALL_API_KEY not set");
  }
  return apiKey;
}

function getBaseUrl(): string {
  const baseUrl = (process.env.APIFOOTBALL_BASE_URL ?? "").trim();
  return baseUrl.length > 0 ? baseUrl : "https://v3.football.api-sports.io";
}

function getCacheTtlMs(): number {
  const ttlSecondsRaw = (process.env.APIFOOTBALL_CACHE_TTL_SECONDS ?? "21600").trim();
  const ttlSeconds = Number.parseInt(ttlSecondsRaw, 10);
  if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) return 0;
  return ttlSeconds * 1000;
}

function cacheKey(teamNumericId: number, season: number): string {
  return `api-football:squad:team=${teamNumericId}:season=${season}`;
}

function readCache(teamNumericId: number, season: number): SquadResult | null {
  const ttlMs = getCacheTtlMs();
  if (ttlMs <= 0) return null;

  const key = cacheKey(teamNumericId, season);
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() >= entry.expiresAtMs) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

function writeCache(teamNumericId: number, season: number, value: SquadResult): void {
  const ttlMs = getCacheTtlMs();
  if (ttlMs <= 0) return;

  const key = cacheKey(teamNumericId, season);
  cache.set(key, { value, expiresAtMs: Date.now() + ttlMs });
}

function normalizeTeamFromPlayerStatistics(teamNumericId: number, firstItem: any): SquadTeam {
  const team = firstItem?.statistics?.[0]?.team;
  const id = Number(team?.id ?? teamNumericId);
  const name = typeof team?.name === "string" && team.name.trim().length > 0 ? team.name : "Team";
  const logo = typeof team?.logo === "string" ? team.logo : undefined;
  return { id, name, logo };
}

function normalizePlayerFromApi(item: any): SquadPlayer | null {
  const rawPlayer = item?.player ?? item;
  const id = Number(rawPlayer?.id);
  const name = typeof rawPlayer?.name === "string" ? rawPlayer.name : "";
  if (!Number.isFinite(id) || id <= 0 || !name) return null;

  const age = typeof rawPlayer?.age === "number" ? rawPlayer.age : undefined;
  const nationality = typeof rawPlayer?.nationality === "string" ? rawPlayer.nationality : undefined;
  const photo = typeof rawPlayer?.photo === "string" ? rawPlayer.photo : undefined;

  const positionFromPlayer =
    typeof rawPlayer?.position === "string" && rawPlayer.position.trim().length > 0
      ? rawPlayer.position
      : undefined;
  const positionFromStatistics =
    typeof item?.statistics?.[0]?.games?.position === "string" && item.statistics[0].games.position.trim().length > 0
      ? item.statistics[0].games.position
      : undefined;

  return {
    id,
    name,
    age,
    nationality,
    photo,
    position: positionFromPlayer ?? positionFromStatistics,
  };
}

async function fetchSquadByTeamId(teamNumericId: number, season: number): Promise<SquadResult> {
  const apiKey = getApiKey();
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const url = `${baseUrl}/players?team=${encodeURIComponent(teamNumericId)}&season=${encodeURIComponent(season)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-apisports-key": apiKey,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API-Football error ${res.status}: ${text || res.statusText}`);
  }

  const payload: any = await res.json();
  const response = payload?.response;

  // Shape A (rare): response[0] = { team, players: [...] }
  const first = Array.isArray(response) ? response[0] : null;
  if (first?.team && Array.isArray(first?.players)) {
    const team: SquadTeam = {
      id: Number(first.team.id),
      name: String(first.team.name ?? ""),
      logo: typeof first.team.logo === "string" ? first.team.logo : undefined,
    };
    const players = (first.players as any[])
      .map((p) => normalizePlayerFromApi(p))
      .filter((p): p is SquadPlayer => !!p);
    return { team, players };
  }

  // Shape B (expected): response = [{ player: {...}, statistics: [...] }, ...]
  if (!Array.isArray(response) || response.length === 0) {
    throw new Error("Unexpected API-Football response shape");
  }

  const team = normalizeTeamFromPlayerStatistics(teamNumericId, response[0]);
  const byId = new Map<number, SquadPlayer>();
  for (const item of response) {
    const normalized = normalizePlayerFromApi(item);
    if (!normalized) continue;
    if (!byId.has(normalized.id)) {
      byId.set(normalized.id, normalized);
    }
  }

  return { team, players: Array.from(byId.values()) };
}

export async function getSquadByTeamIdCached(
  teamNumericId: number,
  season: number
): Promise<{ data: SquadResult; cached: boolean }> {
  const cached = readCache(teamNumericId, season);
  if (cached) {
    return { data: cached, cached: true };
  }

  const data = await fetchSquadByTeamId(teamNumericId, season);
  writeCache(teamNumericId, season, data);
  return { data, cached: false };
}

export async function getSquadByTeamId(teamNumericId: number, season: number): Promise<SquadResult> {
  const { data } = await getSquadByTeamIdCached(teamNumericId, season);
  return data;
}


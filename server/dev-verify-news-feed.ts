import "dotenv/config";
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { db } from "./db";
import { storage } from "./storage";

function requireDevOnly() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Este script só pode ser executado com NODE_ENV=development");
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function getBaseUrl() {
  const port = process.env.PORT || "5000";
  const base =
    (process.env.SERVER_URL && process.env.SERVER_URL.trim()) ||
    `http://127.0.0.1:${port}`;
  return base.replace(/\/$/, "");
}

type Json = any;

class SessionClient {
  private cookieHeader: string | undefined;
  constructor(private baseUrl: string) {}

  private captureSetCookie(res: Response) {
    const anyHeaders = res.headers as any;
    const setCookies: string[] =
      typeof anyHeaders.getSetCookie === "function"
        ? anyHeaders.getSetCookie()
        : res.headers.get("set-cookie")
          ? [res.headers.get("set-cookie") as string]
          : [];

    for (const raw of setCookies) {
      if (!raw) continue;
      // Keep only "name=value" part for Cookie header.
      const pair = raw.split(";")[0]?.trim();
      if (!pair) continue;
      // We only need the session cookie for this script, so overwrite is fine.
      this.cookieHeader = pair;
    }
  }

  async request(path: string, init?: RequestInit): Promise<Response> {
    const url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const headers = new Headers(init?.headers);
    if (this.cookieHeader) headers.set("cookie", this.cookieHeader);
    const res = await fetch(url, { ...init, headers });
    this.captureSetCookie(res);
    return res;
  }

  async requestJson(path: string, init?: RequestInit): Promise<Json> {
    const res = await this.request(path, init);
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${path} :: ${text}`);
    }
    return text ? JSON.parse(text) : null;
  }
}

async function main() {
  requireDevOnly();

  const baseUrl = getBaseUrl();
  console.log(`🔎 Base URL: ${baseUrl}`);

  // 0) Sanity check: team exists
  await storage.seedTeamsIfEmpty();
  const team = await storage.getTeam("corinthians");
  assert(team, 'Time "corinthians" não existe na tabela teams (teams.id). Rode seed/db:push.');

  // 1) Create journalist user (signup creates FAN, then we approve via DB in DEV)
  const journalistEmail = `journalist.${randomUUID()}@dev.local`;
  const journalistPassword = "Senha@123456";
  const journalistName = "Jornalista DEV";

  const journalistSession = new SessionClient(baseUrl);
  await journalistSession.requestJson("/api/auth/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: journalistName,
      email: journalistEmail,
      password: journalistPassword,
      teamId: null,
    }),
  });
  await journalistSession.requestJson("/api/auth/logout", { method: "POST" });

  // 1.1) Approve journalist in DB (DEV-only)
  await storage.approveJournalistByEmail(journalistEmail);

  // 1.2) Login as approved journalist
  await journalistSession.requestJson("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: journalistEmail, password: journalistPassword }),
  });

  // 2) Publish news
  const title = `DEV: Corinthians - ${new Date().toISOString()}`.slice(0, 60);
  const content =
    "Conteúdo de teste DEV: esta notícia deve aparecer no feed público e no Meu Time. " +
    "Ela foi criada por um jornalista APPROVED e está com teamId=corinthians.";

  const created = await journalistSession.requestJson("/api/news", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      teamId: "corinthians",
      category: "NEWS",
      title,
      content,
      imageUrl: null,
    }),
  });

  const createdId = created?.id as string | undefined;
  assert(createdId, "POST /api/news não retornou id");
  console.log(`✅ Notícia criada: ${createdId}`);

  // 3) DB check (Neon/SQL equivalent)
  const validation = await db.execute(sql`
    select
      n.id,
      n.team_id as "teamId",
      n.is_published as "isPublished",
      n.published_at as "publishedAt",
      n.created_at as "createdAt",
      n.journalist_id as "journalistId"
    from news n
    where n.id = ${createdId}
    limit 1;
  `);
  const row = (validation as any)?.rows?.[0];
  assert(row, "DB CHECK: notícia não encontrada no banco pelo id retornado");
  console.log("🔎 DB CHECK (news):", row);

  // 4) Public feed (no login)
  const publicClient = new SessionClient(baseUrl);
  const publicFeed = (await publicClient.requestJson("/api/news")) as any[];
  assert(Array.isArray(publicFeed), "GET /api/news não retornou array");
  assert(
    publicFeed.some((n) => n?.id === createdId),
    "GET /api/news (público) não retornou a notícia recém-criada"
  );
  console.log("✅ GET /api/news (público): OK");

  // 5) Public team feed (no login)
  const teamFeed = (await publicClient.requestJson("/api/news?teamId=corinthians")) as any[];
  assert(Array.isArray(teamFeed), "GET /api/news?teamId=corinthians não retornou array");
  assert(
    teamFeed.some((n) => n?.id === createdId),
    "GET /api/news?teamId=corinthians (público) não retornou a notícia recém-criada"
  );
  console.log("✅ GET /api/news?teamId=corinthians (público): OK");

  // 6) Fan login with teamId=corinthians
  const fanEmail = `fan.${randomUUID()}@dev.local`;
  const fanPassword = "Senha@123456";
  const fanName = "Fã DEV";

  const fanSession = new SessionClient(baseUrl);
  await fanSession.requestJson("/api/auth/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: fanName,
      email: fanEmail,
      password: fanPassword,
      teamId: "corinthians",
    }),
  });

  const me = await fanSession.requestJson("/api/auth/me");
  assert(me?.teamId === "corinthians", "Fã não ficou com teamId=corinthians após signup");

  // 6.1) Fan sees Corinthians news (API)
  const fanTeamFeed = (await fanSession.requestJson("/api/news?teamId=corinthians")) as any[];
  assert(
    fanTeamFeed.some((n) => n?.id === createdId),
    "Fã logado não recebeu a notícia no feed filtrado por teamId=corinthians"
  );
  console.log("✅ Fã logado: GET /api/news?teamId=corinthians: OK");

  // 6.2) Fan sees it in general feed too
  const fanGeneralFeed = (await fanSession.requestJson("/api/news")) as any[];
  assert(
    fanGeneralFeed.some((n) => n?.id === createdId),
    "Fã logado não recebeu a notícia no feed geral (/api/news)"
  );
  console.log("✅ Fã logado: GET /api/news: OK");

  console.log("\n🎯 RESULTADO: OK — notícia publicada aparece no feed público e no feed por time.");
  console.log("Sugestão de verificação UI:");
  console.log(`- Abra ${baseUrl}/dashboard e confirme que a notícia aparece em "Todos" e em "Meu Time" (corinthians).`);
  console.log(`- Abra ${baseUrl}/meu-time e confirme que a notícia aparece na aba Social > Discussões.`);
}

main().catch((err) => {
  console.error("❌ dev-verify-news-feed falhou:");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});


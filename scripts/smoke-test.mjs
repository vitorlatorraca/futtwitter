#!/usr/bin/env node
/**
 * Smoke test de produção (ou staging): landing, health com ping ao DB, lista de times.
 *
 * Uso:
 *   node scripts/smoke-test.mjs https://SEU_DOMINIO.vercel.app
 *   BASE_URL=https://... node scripts/smoke-test.mjs
 *
 * Opcional — simular origem cruzada (alguns proxies / WAF reagem ao header Origin):
 *   SMOKE_ORIGIN=https://outro-dominio.com node scripts/smoke-test.mjs https://SEU_APP.vercel.app
 *
 * Notas QA/DevOps:
 * - CORS só afeta *navegadores* em requisições cross-origin; este script usa Node `fetch`
 *   e normalmente não dispara o mesmo bloqueio que o front em outro host.
 * - Trust proxy influencia `req.ip` e cookies `secure` atrás de LB; não costuma bloquear GET anônimo.
 * - `/api/health` já executa `SELECT 1` no pool; campo `db` === "error" indica falha de conexão/consulta ao Postgres.
 */

const baseArg = process.argv[2]?.trim();
const baseRaw = baseArg || process.env.BASE_URL || process.env.SMOKE_URL || "";
const base = baseRaw.replace(/\/$/, "");

if (!base || !/^https?:\/\//i.test(base)) {
  console.error(`
Uso: node scripts/smoke-test.mjs <URL_BASE>
Ex.: node scripts/smoke-test.mjs https://futtwitter.vercel.app

Ou: BASE_URL=https://... node scripts/smoke-test.mjs
`);
  process.exit(1);
}

const headers = {
  "User-Agent": "futtwitter-smoke-test/1.0 (+scripts/smoke-test.mjs)",
  Accept: "application/json",
};
const origin = process.env.SMOKE_ORIGIN?.trim();
if (origin) {
  headers.Origin = origin;
}

function fmtMs(ms) {
  return `${Math.round(ms)} ms`;
}

async function request(name, path, { acceptHtml = false } = {}) {
  const url = `${base}${path}`;
  const h = { ...headers, Accept: acceptHtml ? "text/html,application/json;q=0.9,*/*;q=0.8" : headers.Accept };
  const t0 = performance.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: h,
      redirect: "follow",
    });
    const elapsed = performance.now() - t0;
    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = undefined;
    }
    return {
      name,
      path,
      url,
      ok: res.ok,
      status: res.status,
      elapsedMs: elapsed,
      bodySnippet: text.slice(0, 200),
      json,
      error: null,
    };
  } catch (err) {
    const elapsed = performance.now() - t0;
    return {
      name,
      path,
      url,
      ok: false,
      status: 0,
      elapsedMs: elapsed,
      bodySnippet: "",
      json: undefined,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function line(ok, msg) {
  const tag = ok ? "OK " : "FAIL";
  console.log(`[${tag}] ${msg}`);
}

let exitCode = 0;

console.log(`\n=== Smoke test ===`);
console.log(`Base: ${base}`);
if (origin) console.log(`Origin (opcional): ${origin}`);
console.log("");

// 1) Landing
const landing = await request("Landing", "/", { acceptHtml: true });
line(landing.ok && landing.status === 200, `GET /  → ${landing.status}  ${fmtMs(landing.elapsedMs)}`);
if (landing.error) {
  line(false, `     erro de rede/TLS: ${landing.error}`);
  exitCode = 1;
} else if (!landing.ok) {
  line(false, `     corpo (início): ${landing.bodySnippet.replace(/\s+/g, " ").slice(0, 120)}…`);
  exitCode = 1;
}

// 2) Health + DB
const health = await request("Health", "/api/health");
line(health.ok && health.status === 200, `GET /api/health → ${health.status}  ${fmtMs(health.elapsedMs)}`);
if (health.error) {
  line(false, `     erro de rede: ${health.error}`);
  exitCode = 1;
} else if (health.json && typeof health.json === "object") {
  const db = health.json.db;
  const okFlag = health.json.ok === true;
  line(okFlag && db === "ok", `     JSON ok=${health.json.ok} status=${health.json.status} db=${db} env=${health.json.env}`);
  if (db === "error") {
    line(false, "     ⚠️  Banco: /api/health não conseguiu executar SELECT 1 (pool/conexão).");
    exitCode = 1;
  }
  if (!okFlag) {
    line(false, "     ⚠️  Serviço em estado degradado conforme payload.");
    exitCode = 1;
  }
} else {
  line(false, "     Resposta não é JSON esperado (ver deployment protection / rota errada).");
  exitCode = 1;
}

// 3) DB-backed list (público)
const teams = await request("Teams (DB)", "/api/teams");
line(teams.ok && teams.status === 200, `GET /api/teams → ${teams.status}  ${fmtMs(teams.elapsedMs)}`);
if (teams.error) {
  line(false, `     erro de rede: ${teams.error}`);
  exitCode = 1;
} else if (!teams.ok) {
  line(false, "     Falha HTTP — possível erro de aplicação, timeout upstream ou WAF.");
  try {
    const j = teams.json;
    if (j && typeof j === "object" && j.message) line(false, `     message: ${j.message}`);
  } catch {
    /* ignore */
  }
  exitCode = 1;
} else if (Array.isArray(teams.json)) {
  line(true, `     times retornados: ${teams.json.length}`);
} else {
  line(false, "     Corpo não é array JSON (contrato inesperado).");
  exitCode = 1;
}

console.log("\n=== Latência (resumo) ===");
console.table([
  { rota: "/", ms: Math.round(landing.elapsedMs), status: landing.status || "ERR" },
  { rota: "/api/health", ms: Math.round(health.elapsedMs), status: health.status || "ERR" },
  { rota: "/api/teams", ms: Math.round(teams.elapsedMs), status: teams.status || "ERR" },
]);

console.log(`
=== Como ler (DB / gargalo) ===
- /api/health lento + db=ok: rede ou cold start serverless; o SELECT 1 ainda passou.
- /api/health com db=error: Postgres inacessível, credencial, pool esgotado ou rede ao DB.
- /api/teams lento mas 200: consulta Drizzle/storage pesou ou cold start; monitore P95 após k6.
- Falha de conexão (status 0 + mensagem fetch): DNS, TLS, timeout ou bloqueio antes do app.

CORS / Trust proxy: bloqueios típicos de CORS aparecem no *browser*; trust proxy não bloqueia este smoke.
`);

process.exit(exitCode);

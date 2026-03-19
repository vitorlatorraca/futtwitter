/**
 * Seed hashtags and trending_topics for Explore page.
 * Run: npx tsx server/scripts/seed-explore.mjs
 * Or: node server/scripts/seed-explore.mjs (with dotenv)
 */
import "dotenv/config";
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const HASHTAGS = [
  { name: "Corinthians", category: "time", postCount: 142 },
  { name: "Flamengo", category: "time", postCount: 89 },
  { name: "Palmeiras", category: "time", postCount: 76 },
  { name: "SaoPaulo", category: "time", postCount: 64 },
  { name: "Gremio", category: "time", postCount: 58 },
  { name: "Internacional", category: "time", postCount: 47 },
  { name: "Fluminense", category: "time", postCount: 39 },
  { name: "Atletico", category: "time", postCount: 31 },
  { name: "Cruzeiro", category: "time", postCount: 28 },
  { name: "Botafogo", category: "time", postCount: 25 },
  { name: "Brasileirao", category: "campeonato", postCount: 89 },
  { name: "LibertadoresIII", category: "campeonato", postCount: 58 },
  { name: "PaulistaoIII", category: "campeonato", postCount: 42 },
  { name: "CopaDoBrasil", category: "campeonato", postCount: 39 },
  { name: "ChampionsLeague", category: "campeonato", postCount: 35 },
  { name: "Futebol", category: "geral", postCount: 120 },
  { name: "Gol", category: "geral", postCount: 85 },
  { name: "Classico", category: "geral", postCount: 72 },
  { name: "Contratacao", category: "geral", postCount: 55 },
  { name: "Tecnico", category: "geral", postCount: 48 },
  { name: "VaiEVem", category: "transferencia", postCount: 64 },
  { name: "Rumores", category: "transferencia", postCount: 52 },
  { name: "Confirmado", category: "transferencia", postCount: 38 },
];

const TRENDING_TOPICS = [
  { title: "Corinthians", subtitle: "Timão vence clássico e assume liderança", postCount: 142, category: "time", teamSlug: "corinthians" },
  { title: "Brasileirao", subtitle: "Rodada 5 define líderes das conferências", postCount: 89, category: "campeonato" },
  { title: "Flamengo", subtitle: "Renovação de Gabigol até 2027 confirmada", postCount: 76, category: "time", teamSlug: "flamengo" },
  { title: "VaiEVem", subtitle: "Mercado aquecido: 3 grandes anunciam reforços", postCount: 64, category: "transferencia" },
  { title: "LibertadoresIII", subtitle: "Grupos definidos, brasileiros conhecem rivais", postCount: 58, category: "campeonato" },
  { title: "Palmeiras", subtitle: "Abel fala sobre sequência de jogos", postCount: 47, category: "time", teamSlug: "palmeiras" },
  { title: "CopaDoBrasil", subtitle: "Sorteio das oitavas acontece nesta semana", postCount: 39, category: "campeonato" },
  { title: "Gremio", subtitle: "Torcida faz festa na chegada do novo reforço", postCount: 31, category: "time", teamSlug: "gremio" },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("🔄 Seeding hashtags...");
    for (const h of HASHTAGS) {
      await client.query(
        `INSERT INTO hashtags (name, post_count, category)
         VALUES ($1, $2, $3::hashtag_category)
         ON CONFLICT (name) DO UPDATE SET post_count = EXCLUDED.post_count, category = EXCLUDED.category`,
        [h.name, h.postCount, h.category]
      );
    }
    console.log(`  ✓ ${HASHTAGS.length} hashtags`);

    console.log("🔄 Seeding trending_topics...");
    await client.query("DELETE FROM trending_topics WHERE period = '24h'");
    for (const t of TRENDING_TOPICS) {
      let teamId = null;
      if (t.teamSlug) {
        const r = await client.query("SELECT id FROM teams WHERE id = $1 OR short_name ILIKE $2 LIMIT 1", [t.teamSlug, t.teamSlug]);
        teamId = r.rows[0]?.id ?? null;
      }
      await client.query(
        `INSERT INTO trending_topics (title, subtitle, post_count, category, team_id, period)
         VALUES ($1, $2, $3, $4::hashtag_category, $5, '24h')`,
        [t.title, t.subtitle, t.postCount, t.category, teamId]
      );
    }
    console.log(`  ✓ ${TRENDING_TOPICS.length} trending topics`);

    console.log("✅ Explore seed complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

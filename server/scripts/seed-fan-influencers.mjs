import pg from 'pg';
import bcrypt from 'bcrypt';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  const hash = await bcrypt.hash('senha123', 10);

  // ─── Flamengo fan influencer ────────────────────────────────────────────────
  const { rows: [flaUser] } = await pool.query(`
    INSERT INTO users (id, email, name, password, avatar_url, user_type, team_id, handle, bio, followers_count, following_count)
    VALUES (
      gen_random_uuid(),
      'nacao_rubro_negra@futeapp.com',
      'Nação Rubro-Negra',
      $1,
      'https://ui-avatars.com/api/?name=Nacao+RN&background=CC0000&color=fff&size=128',
      'JOURNALIST',
      'flamengo',
      'nacao_rubro_negra',
      'O maior canal de notícias do Flamengo. Mengão no coração! 🔴⚫',
      8420,
      130
    )
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
    RETURNING id, name, handle
  `, [hash]);
  console.log('Flamengo user:', flaUser);

  const { rows: [flaJournalist] } = await pool.query(`
    INSERT INTO journalists (id, user_id, organization, professional_id, portfolio_url, status, verification_date)
    VALUES (gen_random_uuid(), $1, 'FlaNews Digital', 'FLA-INF-2024', 'https://flanews.com.br', 'APPROVED', NOW())
    ON CONFLICT (user_id) DO UPDATE SET organization = EXCLUDED.organization
    RETURNING id
  `, [flaUser.id]);
  console.log('Flamengo journalist:', flaJournalist);

  const flaNews = [
    {
      title: '🔥 Gabigol renova com o Flamengo até 2027!',
      content: 'Em uma tarde histórica no Ninho do Urubu, Gabriel Barbosa assinou a renovação do seu contrato com o Flamengo até dezembro de 2027. O atacante celebrou ao lado da diretoria. "O Flamengo é minha casa. Aqui é onde quero escrever minha história", declarou Gabigol emocionado. A renovação veio após semanas de negociação intensa, e a torcida pode comemorar: o camisa 9 fica!',
      likes: 487, dislikes: 12, hours: 5
    },
    {
      title: '📊 Flamengo lidera tabela com 87% de aproveitamento em casa',
      content: 'Os números do Flamengo em 2025 impressionam qualquer análise. Com 87% de aproveitamento como mandante no Maracanã, o Rubro-Negro é disparado o melhor time do Brasil jogando em casa. Foram 13 vitórias, 1 empate e apenas 1 derrota em 15 jogos na temporada. O técnico Tite aprova: "O Maracanã nos dá uma energia especial. Nossa torcida é o nosso 12º jogador."',
      likes: 352, dislikes: 8, hours: 18
    },
    {
      title: '🌟 De la Cruz: "Escolhi o Flamengo pelo projeto vencedor"',
      content: 'Em entrevista exclusiva ao canal Nação Rubro-Negra, o meia uruguaio Nicolás De la Cruz abriu o coração sobre sua escolha pelo Flamengo. "Poderia ter ido para a Europa, mas o projeto do Flamengo me convenceu. Aqui tem estrutura, tem torcida apaixonada e tem a vontade de ganhar tudo", revelou o uruguaio. De la Cruz já acumula 8 gols e 12 assistências em 2025.',
      likes: 619, dislikes: 7, hours: 30
    },
  ];

  for (const n of flaNews) {
    await pool.query(`
      INSERT INTO news (id, journalist_id, team_id, scope, title, content, category, likes_count, dislikes_count, is_published, published_at)
      VALUES (gen_random_uuid(), $1, 'flamengo', 'TEAM', $2, $3, 'NEWS', $4, $5, true, NOW() - ($6 * INTERVAL '1 hour'))
    `, [flaJournalist.id, n.title, n.content, n.likes, n.dislikes, n.hours]);
  }
  console.log('Created 3 Flamengo news posts');

  // ─── Corinthians fan influencer (Galinho do Timão) ──────────────────────────
  const { rows: [corUser] } = await pool.query(`
    INSERT INTO users (id, email, name, password, avatar_url, user_type, team_id, handle, bio, followers_count, following_count)
    VALUES (
      gen_random_uuid(),
      'galinho_timao@futeapp.com',
      'Galinho do Timão',
      $1,
      'https://ui-avatars.com/api/?name=Galinho+Timao&background=000000&color=fff&size=128',
      'JOURNALIST',
      'corinthians',
      'galinho_timao',
      'Fiel desde o berço! Notícias quentes do Corinthians todo dia. ⚫⚪',
      12300,
      89
    )
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
    RETURNING id, name, handle
  `, [hash]);
  console.log('Corinthians user:', corUser);

  const { rows: [corJournalist] } = await pool.query(`
    INSERT INTO journalists (id, user_id, organization, professional_id, portfolio_url, status, verification_date)
    VALUES (gen_random_uuid(), $1, 'TimãoNews', 'COR-INF-2024', 'https://timaonews.com.br', 'APPROVED', NOW())
    ON CONFLICT (user_id) DO UPDATE SET organization = EXCLUDED.organization
    RETURNING id
  `, [corUser.id]);
  console.log('Corinthians journalist:', corJournalist);

  const corNews = [
    {
      title: '⚫⚪ Corinthians confirma contratação de volante paraguaio',
      content: 'O Sport Club Corinthians Paulista fechou nesta tarde a contratação do volante paraguaio Gustavo Gómez Lima, 24 anos, vindo do Olimpia de Assunção. O jogador assinou contrato de três anos. O diretor executivo comentou: "É um jogador forte, com boa saída de bola e muita garra. Perfil que o torcedor corinthiano vai amar."',
      likes: 314, dislikes: 9, hours: 8
    },
    {
      title: '🏟️ Neo Química Arena bate recorde de público na temporada',
      content: 'Com 47.500 torcedores presentes no último clássico paulista, a Neo Química Arena registrou o maior público da temporada 2025. A Fiel Torcida mostrou mais uma vez que é uma das mais apaixonadas do Brasil. O clima foi de festa do início ao fim, com mosaico na Geral Norte. "Jogar aqui com essa torcida é indescritível", disse o capitão Fagner após a vitória.',
      likes: 428, dislikes: 5, hours: 22
    },
  ];

  for (const n of corNews) {
    await pool.query(`
      INSERT INTO news (id, journalist_id, team_id, scope, title, content, category, likes_count, dislikes_count, is_published, published_at)
      VALUES (gen_random_uuid(), $1, 'corinthians', 'TEAM', $2, $3, 'NEWS', $4, $5, true, NOW() - ($6 * INTERVAL '1 hour'))
    `, [corJournalist.id, n.title, n.content, n.likes, n.dislikes, n.hours]);
  }
  console.log('Created 2 Corinthians news posts (Galinho)');

  await pool.end();
  console.log('✅ Done!');
}

run().catch(err => { console.error(err); process.exit(1); });

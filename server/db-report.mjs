import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const q = (sql, params) => pool.query(sql, params).then(r => r.rows);

async function run() {
  console.log('');
  console.log('====================================================');
  console.log('   RELATÓRIO GERAL DO BANCO DE DADOS - FUTTWITTER  ');
  console.log('====================================================');
  console.log('Data:', new Date().toLocaleString('pt-BR'));
  console.log('');

  // USUÁRIOS
  const [usersTotal] = await q('SELECT COUNT(*) as total FROM users');
  const usersByType = await q('SELECT user_type, COUNT(*) as total FROM users GROUP BY user_type ORDER BY total DESC');
  console.log('──── USUÁRIOS ─────────────────────────────────────');
  console.log('Total de usuários:', usersTotal.total);
  usersByType.forEach(r => console.log(' ', r.user_type + ':', r.total));
  const recentUsers = await q('SELECT handle, email, user_type, created_at FROM users ORDER BY created_at DESC LIMIT 5');
  console.log('\nÚltimos 5 cadastrados:');
  recentUsers.forEach(u => console.log('  @' + u.handle, '|', u.email, '|', u.user_type, '|', new Date(u.created_at).toLocaleDateString('pt-BR')));

  // JORNALISTAS
  console.log('\n──── JORNALISTAS ──────────────────────────────────');
  const [journTotal] = await q('SELECT COUNT(*) as total FROM journalists');
  const journByStatus = await q('SELECT status, COUNT(*) as total FROM journalists GROUP BY status ORDER BY total DESC');
  console.log('Total de solicitações:', journTotal.total);
  journByStatus.forEach(r => console.log(' ', r.status + ':', r.total));
  const approvedJ = await q("SELECT u.handle, u.email, j.organization FROM journalists j JOIN users u ON j.user_id = u.id WHERE j.status = 'APPROVED'");
  if (approvedJ.length) {
    console.log('\nJornalistas aprovados:');
    approvedJ.forEach(j => console.log('  @' + j.handle, '|', j.organization || '(sem veículo)'));
  }

  // FOLLOWS
  console.log('\n──── CONEXÕES ─────────────────────────────────────');
  const [followsTotal] = await q('SELECT COUNT(*) as total FROM user_follows');
  console.log('Total de follows:', followsTotal.total);

  // POSTS
  console.log('\n──── POSTS ────────────────────────────────────────');
  const [postsTotal] = await q('SELECT COUNT(*) as total FROM posts');
  const [postsParent] = await q('SELECT COUNT(*) as total FROM posts WHERE parent_post_id IS NULL');
  const [postsReply] = await q('SELECT COUNT(*) as total FROM posts WHERE parent_post_id IS NOT NULL');
  const [postsImages] = await q('SELECT COUNT(*) as total FROM posts WHERE image_url IS NOT NULL');
  console.log('Total:', postsTotal.total);
  console.log(' Posts originais:', postsParent.total);
  console.log(' Respostas:', postsReply.total);
  console.log(' Com imagem:', postsImages.total);
  const topPosts = await q(`
    SELECT u.handle, p.content, p.like_count, p.reply_count, p.view_count
    FROM posts p JOIN users u ON p.user_id = u.id
    ORDER BY p.like_count DESC LIMIT 3
  `);
  if (topPosts.length) {
    console.log('\nTop 3 posts mais curtidos:');
    topPosts.forEach(p => console.log('  @' + p.handle, '| ❤️', p.like_count, '| 💬', p.reply_count, '|', (p.content || '').slice(0, 60)));
  }

  // INTERAÇÕES
  console.log('\n──── INTERAÇÕES ───────────────────────────────────');
  const [likesTotal] = await q('SELECT COUNT(*) as total FROM post_likes');
  const [bookmarksTotal] = await q('SELECT COUNT(*) as total FROM post_bookmarks');
  console.log('Likes em posts:', likesTotal.total);
  console.log('Bookmarks:', bookmarksTotal.total);

  // TRANSFER RUMORS
  console.log('\n──── RUMORES DE TRANSFERÊNCIA ─────────────────────');
  const [trTotal] = await q('SELECT COUNT(*) as total FROM transfer_rumors');
  const trByStatus = await q('SELECT status, COUNT(*) as total FROM transfer_rumors GROUP BY status ORDER BY total DESC');
  console.log('Total:', trTotal.total);
  trByStatus.forEach(r => console.log(' ', r.status + ':', r.total));
  const trByCurrency = await q('SELECT fee_currency, COUNT(*) as total FROM transfer_rumors WHERE fee_amount IS NOT NULL GROUP BY fee_currency ORDER BY total DESC');
  if (trByCurrency.length) {
    console.log('\nRumores com valor por moeda:');
    trByCurrency.forEach(r => console.log('  ' + r.fee_currency + ':', r.total));
  }
  const recentRumors = await q(`
    SELECT p.name as player, t1.name as de, t2.name as para, tr.status, tr.source_name, tr.created_at
    FROM transfer_rumors tr
    JOIN players p ON tr.player_id = p.id
    LEFT JOIN teams t1 ON tr.from_team_id = t1.id
    LEFT JOIN teams t2 ON tr.to_team_id = t2.id
    ORDER BY tr.created_at DESC LIMIT 6
  `);
  console.log('\nÚltimos 6 rumores:');
  recentRumors.forEach(r => console.log('  ' + r.player + ' | ' + (r.de || '?') + ' → ' + (r.para || '?') + ' | ' + r.status + ' | ' + (r.source_name || '—')));

  // VOTOS EM RUMORES
  const [voteTotal] = await q('SELECT COUNT(*) as total FROM transfer_rumor_votes');
  const voteBreak = await q('SELECT side, vote, COUNT(*) as total FROM transfer_rumor_votes GROUP BY side, vote ORDER BY total DESC');
  console.log('\nVotos em rumores:', voteTotal.total);
  voteBreak.forEach(v => console.log('  ' + v.side + '/' + v.vote + ':', v.total));

  // TIMES
  console.log('\n──── TIMES ────────────────────────────────────────');
  const [teamsTotal] = await q('SELECT COUNT(*) as total FROM teams');
  console.log('Total de times:', teamsTotal.total);

  // JOGADORES
  console.log('\n──── JOGADORES ────────────────────────────────────');
  const [playersTotal] = await q('SELECT COUNT(*) as total FROM players');
  const playersPos = await q('SELECT position, COUNT(*) as total FROM players WHERE position IS NOT NULL GROUP BY position ORDER BY total DESC LIMIT 8');
  console.log('Total de jogadores:', playersTotal.total);
  console.log('\nPor posição (top 8):');
  playersPos.forEach(r => console.log('  ' + (r.position || '—').padEnd(25) + r.total));

  // NOTÍCIAS
  console.log('\n──── NOTÍCIAS ─────────────────────────────────────');
  const [newsTotal] = await q('SELECT COUNT(*) as total FROM news');
  const [newsPublished] = await q('SELECT COUNT(*) as total FROM news WHERE is_published = true');
  console.log('Total de notícias:', newsTotal.total);
  console.log('Publicadas:', newsPublished.total);
  const newsByCat = await q('SELECT category, COUNT(*) as total FROM news GROUP BY category ORDER BY total DESC LIMIT 5');
  if (newsByCat.length) {
    console.log('Por categoria:');
    newsByCat.forEach(r => console.log('  ' + (r.category || '—') + ':', r.total));
  }
  const newsByScope = await q('SELECT scope, COUNT(*) as total FROM news GROUP BY scope ORDER BY total DESC');
  if (newsByScope.length) {
    console.log('Por escopo:');
    newsByScope.forEach(r => console.log('  ' + (r.scope || '—') + ':', r.total));
  }
  const recentNews = await q('SELECT title, published_at FROM news ORDER BY published_at DESC NULLS LAST LIMIT 3');
  if (recentNews.length) {
    console.log('\nÚltimas 3 notícias:');
    recentNews.forEach(n => console.log('  ' + (n.title || '').slice(0, 70)));
  }

  // NOTIFICAÇÕES
  console.log('\n──── NOTIFICAÇÕES ─────────────────────────────────');
  const [notiTotal] = await q('SELECT COUNT(*) as total FROM notifications');
  const notiCols = await q("SELECT column_name FROM information_schema.columns WHERE table_name = 'notifications'");
  console.log('Total:', notiTotal.total);
  if (notiCols.some(c => c.column_name === 'type')) {
    const notiByType = await q('SELECT type, COUNT(*) as total FROM notifications GROUP BY type ORDER BY total DESC');
    notiByType.forEach(r => console.log('  ' + r.type + ':', r.total));
  }

  // PARTIDAS
  console.log('\n──── PARTIDAS ─────────────────────────────────────');
  const [matchesTotal] = await q('SELECT COUNT(*) as total FROM matches');
  const matchCols = await q("SELECT column_name FROM information_schema.columns WHERE table_name = 'matches'");
  console.log('Total de partidas:', matchesTotal.total);
  if (matchCols.some(c => c.column_name === 'status')) {
    const matchesByStatus = await q('SELECT status, COUNT(*) as total FROM matches GROUP BY status ORDER BY total DESC LIMIT 5');
    matchesByStatus.forEach(r => console.log('  ' + (r.status || '—') + ':', r.total));
  }

  // COMPETIÇÕES
  console.log('\n──── COMPETIÇÕES ──────────────────────────────────');
  const [compTotal] = await q('SELECT COUNT(*) as total FROM competitions');
  console.log('Total:', compTotal.total);
  const compCols = await q("SELECT column_name FROM information_schema.columns WHERE table_name = 'competitions'");
  const hasType = compCols.some(c => c.column_name === 'type');
  const comps = await q('SELECT name' + (hasType ? ', type' : '') + ' FROM competitions ORDER BY name LIMIT 10');
  comps.forEach(c => console.log('  ' + c.name + (hasType && c.type ? ' | ' + c.type : '')));

  // FORUM
  console.log('\n──── FÓRUM DOS TIMES ──────────────────────────────');
  const [topicsTotal] = await q('SELECT COUNT(*) as total FROM teams_forum_topics');
  const [repliesTotal] = await q('SELECT COUNT(*) as total FROM teams_forum_replies');
  const [forumLikesTotal] = await q('SELECT COUNT(*) as total FROM teams_forum_likes');
  console.log('Tópicos:', topicsTotal.total);
  console.log('Respostas:', repliesTotal.total);
  console.log('Likes no fórum:', forumLikesTotal.total);

  // TABELA DE CLASSIFICAÇÃO
  console.log('\n──── STANDINGS & FIXTURES ─────────────────────────');
  const [standingsTotal] = await q('SELECT COUNT(*) as total FROM standings');
  const [fixturesTotal] = await q('SELECT COUNT(*) as total FROM fixtures');
  console.log('Standings (classificação):', standingsTotal.total);
  console.log('Fixtures (próximos jogos):', fixturesTotal.total);

  // JOGOS (minigames)
  console.log('\n──── MINIGAMES ────────────────────────────────────');
  const [gameSetsTotal] = await q('SELECT COUNT(*) as total FROM game_sets');
  const [gameAttemptsTotal] = await q('SELECT COUNT(*) as total FROM game_attempts');
  console.log('Game sets:', gameSetsTotal.total);
  console.log('Tentativas de jogo:', gameAttemptsTotal.total);

  // RESUMO GERAL
  console.log('\n====================================================');
  console.log('   RESUMO GERAL');
  console.log('====================================================');
  console.log(' Usuários:           ', usersTotal.total);
  console.log(' Jornalistas aprv.:  ', approvedJ.length);
  console.log(' Posts:              ', postsTotal.total);
  console.log(' Likes em posts:     ', likesTotal.total);
  console.log(' Follows:            ', followsTotal.total);
  console.log(' Rumores transfer.:  ', trTotal.total);
  console.log(' Notícias:           ', newsTotal.total);
  console.log(' Times:              ', teamsTotal.total);
  console.log(' Jogadores:          ', playersTotal.total);
  console.log(' Partidas:           ', matchesTotal.total);
  console.log(' Competições:        ', compTotal.total);
  console.log('====================================================');
  console.log('');

  await pool.end();
}

run().catch(async e => {
  console.error('ERRO:', e.message);
  await pool.end();
  process.exit(1);
});

/**
 * Seed massivo: usuários, posts, replies, likes, follows, partidas
 * Run: node server/scripts/seed-massive.mjs
 */

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

const DATABASE_URL =
  "postgresql://neondb_owner:npg_mn83QyKUtjBg@ep-crimson-wildflower-ah6kfndd.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(DATABASE_URL);

// ─── HELPERS ────────────────────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function hoursAgo(n) {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

// ─── DADOS BASE ──────────────────────────────────────────────────────────────

const PASSWORD_HASH = await bcrypt.hash("futtwitter2026", 10);

const TIMES = await sql`SELECT id, name, logo_url FROM teams ORDER BY name`;
const teamMap = Object.fromEntries(TIMES.map((t) => [t.name, t]));

// Usuários novos para seed
const FAN_USERS = [
  // Corinthians
  { name: "Lucas Fiel",        handle: "lucasfiel",       team: "Corinthians",      bio: "Timão até morrer 🖤🤍" },
  { name: "Rafael Alvinegro",  handle: "rafaalvinegro",   team: "Corinthians",      bio: "Corinthians é minha religião" },
  { name: "Thiago do Parque",  handle: "thiagodoparque",  team: "Corinthians",      bio: "Fiel desde berço 🎶" },
  { name: "Carla Timão",       handle: "carlatimao",      team: "Corinthians",      bio: "Só o Corinthians me faz sofrer assim ❤️" },
  { name: "Pedro Mosquito",    handle: "pedromosquito",   team: "Corinthians",      bio: "Fui lá e voltei. Sou Corinthians." },
  // Flamengo
  { name: "João Mengão",       handle: "joaomengao",      team: "Flamengo",         bio: "Mais que um clube ❤️🖤" },
  { name: "Bruna Nação",       handle: "brunanacao",      team: "Flamengo",         bio: "Urubu na veia 🦅" },
  { name: "Felipe Rubro",      handle: "feliperubro",     team: "Flamengo",         bio: "Flamengo, meu amor eterno" },
  { name: "Mariana CRF",       handle: "marianacrf",      team: "Flamengo",         bio: "Nação Rubro-Negra 🔴⚫" },
  { name: "Diego Gabigol",     handle: "diegogabi",       team: "Flamengo",         bio: "Framengo é o maior do mundo" },
  // Palmeiras
  { name: "Gustavo Porco",     handle: "gustavoporto",    team: "Palmeiras",        bio: "Verdão do meu coração 💚" },
  { name: "Amanda Alviverde",  handle: "amandaalvi",      team: "Palmeiras",        bio: "Palmeiras não tem mundial mas tem meu coração" },
  { name: "Ricardo Champ",     handle: "ricardochamp",    team: "Palmeiras",        bio: "Campeão da América 🏆" },
  // Atlético Mineiro
  { name: "Belo Atleticano",   handle: "beloatleticano",  team: "Atlético Mineiro", bio: "Galo guerreiro ⚫⚪" },
  { name: "Fernanda Galo",     handle: "fernandagalo",    team: "Atlético Mineiro", bio: "Massa! Massa! 🐓" },
  // Botafogo
  { name: "Carlos Estrela",    handle: "carlosestrela",   team: "Botafogo",         bio: "Botafogo, glorioso! ⭐" },
  { name: "Simone Solitária",  handle: "simonesolitaria", team: "Botafogo",         bio: "Manquei, mas amo" },
  // São Paulo
  { name: "Tiago Tricolor",    handle: "tricolorsp",      team: "São Paulo",        bio: "SPFC é o maior do Brasil 🔴⚪🔵" },
  { name: "Beatriz Soberana",  handle: "beatrizsp",       team: "São Paulo",        bio: "São Paulo FC desde 1990" },
  // Internacional
  { name: "Marcos Colorado",   handle: "marcoscolorado",  team: "Internacional",    bio: "Inter é paixão gaúcha ❤️" },
  { name: "Julia Beira-Rio",   handle: "juliabeirario",   team: "Internacional",    bio: "Do Beira-Rio pro mundo 🏟️" },
  // Grêmio
  { name: "Paulo Imortal",     handle: "pauloimortal",    team: "Grêmio",           bio: "Imortal Tricolor 🔵⚫⚪" },
  { name: "Ana Grêmio",        handle: "anagremio",       team: "Grêmio",           bio: "Grêmio no coração" },
  // Cruzeiro
  { name: "Roberto Celeste",   handle: "robertoceleste",  team: "Cruzeiro",         bio: "Cruzeiro, maior de Minas 💙" },
  // Vasco
  { name: "Eduardo Vascaíno",  handle: "eduardovasco",    team: "Vasco da Gama",    bio: "Vasco da Gama 🖤⚪" },
  // Santos
  { name: "Praiano Santos",    handle: "praianosantos",   team: "Santos",           bio: "Peixe à beira-mar ⚽" },
  // Bahia
  { name: "Heitor Esquadrão",  handle: "heitorbahia",     team: "Bahia",            bio: "Esquadrão de Aço! 🔵🔴" },
  // Fortaleza
  { name: "Igor Leão",         handle: "igorleao",        team: "Fortaleza",        bio: "Leão do Pici 🦁" },
  // Fluminense
  { name: "Patricia Flu",      handle: "patriciaflu",     team: "Fluminense",       bio: "Flu, que saudade ❤️💚" },
  // Athletico
  { name: "Renato Furacão",    handle: "renatofuracão",   team: "Athletico Paranaense", bio: "Athletico, furacão! 🌪️" },
  // Mais Corinthians
  { name: "Diego Fiel Até",    handle: "diegofielatee",   team: "Corinthians",      bio: "Nunca vou parar de amar" },
  { name: "Natalia Corinthiana",handle: "natcori",        team: "Corinthians",      bio: "Timão na veia 🖤" },
  { name: "Bruno Gaviões",     handle: "brunogavioes",    team: "Corinthians",      bio: "Gaviões da Fiel 🦅" },
  // Mais Flamengo
  { name: "Alex Urubu",        handle: "alexurubu",       team: "Flamengo",         bio: "Sempre Flamengo ❤️🖤" },
  { name: "Vitória CRF",       handle: "vitoriacrf",      team: "Flamengo",         bio: "Minha vida é rubro-negra" },
  // Mais Palmeiras
  { name: "Sandro Verdão",     handle: "sandroverdao",    team: "Palmeiras",        bio: "Palmeiras tricampeão 💚" },
  // Mais times
  { name: "Caio Atleticano",   handle: "caiogalo",        team: "Atlético Mineiro", bio: "Galo campeão 🏆" },
  { name: "Mel Rubro-Negra",   handle: "melrubronegra",   team: "Flamengo",         bio: "Flamengo is love" },
  { name: "Lucas Tricolor",    handle: "lucastri",        team: "São Paulo",        bio: "Tricolor paulista 🔴⚪🔵" },
];

const JOURNALIST_USERS = [
  { name: "Lucas Oliveira",  handle: "lucasoliveira",  team: "Corinthians", bio: "Jornalista esportivo | ESPN Brasil" },
  { name: "Ana Paula Rocha", handle: "anapaularocha",  team: "Flamengo",    bio: "Repórter GloboEsporte.com | Rio" },
  { name: "Marcos Aurélio",  handle: "marcosaureliofc",team: "Palmeiras",   bio: "Diário Lance! | Especialista em mercado" },
  { name: "Fernanda Lima",   handle: "fernandalima_fc",team: "São Paulo",   bio: "Editora CBF News | Seleção Brasileira" },
  { name: "Diego Menezes",   handle: "diegomenezes",   team: "Atlético Mineiro", bio: "FutCast Podcast | Transferências" },
];

// Posts realistas em português
const POST_TEMPLATES = [
  // Corinthians
  { team: "Corinthians", content: "Memphis Depay chegou pro Corinthians e parece que tá jogando nas coxas ainda. Precisa de tempo. #Corinthians #Memphis" },
  { team: "Corinthians", content: "Que jogo horrível do Timão hoje. Não criou nada no segundo tempo. Mano Menezes precisa mudar alguma coisa urgente 😤 #Corinthians" },
  { team: "Corinthians", content: "Yuri Alberto é a esperança do Corinthians em 2026. Se tiver bem, o time vai longe no Brasileirão #YuriAlberto #Corinthians" },
  { team: "Corinthians", content: "Neo Química Arena lotada hoje! 47 mil torcedores presentes. A fiel nunca abandona 🖤🤍🙏 #Corinthians #NeoquímicaArena" },
  { team: "Corinthians", content: "Rodrigo Garro cada vez mais crucial no meio. Essa parceria com Breno Bidon tá funcionando muito bem 🎯 #Corinthians" },
  { team: "Corinthians", content: "Timão vence de novo! 3 jogos seguidos sem perder no Brasileirão. Será que a virada de chave finalmente aconteceu? #Corinthians #Brasileirao" },
  { team: "Corinthians", content: "Não dá pra continuar assim. Corinthians perde pra time que tá na zona de rebaixamento. Uma vergonha 😡 #Corinthians" },
  { team: "Corinthians", content: "Matheus Donelli fez TRÊS defesas impossíveis hoje. O cara tá num nível absurdo esse ano 🧤 #Corinthians #MatheusD" },
  // Flamengo
  { team: "Flamengo", content: "Flamengo arrasando no Brasileirão, mais uma vitória com Gabigol decisivo. Nação, que time! ❤️🖤 #Flamengo #Brasileirao" },
  { team: "Flamengo", content: "Pedro tá em momento de graça. Dois gols hoje, já é o artilheiro da temporada. Fenômeno! #Flamengo #Pedro" },
  { team: "Flamengo", content: "Maracanã explodindo com 74 mil torcedores. Isso é Flamengo, maior torcida do Brasil 🔥 #Flamengo #Maracana" },
  { team: "Flamengo", content: "Hugo Souza voando hoje! O goleiro voltou ao nível que todos esperavam. Substituto à altura #Flamengo" },
  { team: "Flamengo", content: "Flamengo 3x0 e o jogo ainda não acabou. Goleada histórica no Maracanã. Que time, meu Deus! ❤️🖤 #Flamengo" },
  // Palmeiras
  { team: "Palmeiras", content: "Weverton pegou pênalti no último minuto. SALVOU o Verdão de perder. Maior goleiro do Brasil 🧤💚 #Palmeiras #Weverton" },
  { team: "Palmeiras", content: "Palmeiras na liderança com 5 pontos de vantagem. Abel tá construindo algo grandioso esse ano 💚 #Palmeiras #Brasileirao" },
  { team: "Palmeiras", content: "Estádio Allianz Parque em festa! Vitória importante do Verdão em casa 💚🏆 #Palmeiras" },
  { team: "Palmeiras", content: "Raphael Veiga fazendo o que sabe. Golaço de falta hoje. Um dos melhores do Brasil sem dúvida 🎯 #Palmeiras #Veiga" },
  { team: "Palmeiras", content: "O Palmeiras de Abel Ferreira é uma máquina. Organizado, intenso, eficiente. Difícil de bater 💪 #Palmeiras" },
  // Atlético Mineiro
  { team: "Atlético Mineiro", content: "Hulk decidiu mais uma vez. Com 38 anos, ainda é o melhor do Galo. Lenda viva do futebol mineiro ⚫⚪ #Atletico" },
  { team: "Atlético Mineiro", content: "Arena MRV lotada! Atmosfera incrível hoje. O Galo tem uma das melhores arenas do Brasil agora 🏟️ #Atletico" },
  { team: "Atlético Mineiro", content: "Guilherme Arana cruzando para o gol. Lateral mais técnico do Brasil na minha opinião #AtleticoMG #Arana" },
  // Botafogo
  { team: "Botafogo", content: "Botafogo campeão brasileiro! Essa estrela não apaga nunca ⭐ #Botafogo #Campeao" },
  { team: "Botafogo", content: "Luís Castro montou um time de respeito esse ano. O Botafogo tá jogando bonito demais ⭐ #Botafogo" },
  { team: "Botafogo", content: "John Textor investindo pesado no Glorioso. Com esse aporte, dá pra sonhar alto ⭐ #Botafogo" },
  // São Paulo
  { team: "São Paulo", content: "MorumBIS lotado pela primeira vez! Que obra, que estádio. São Paulo de alto nível 🔴⚪🔵 #SaoPaulo" },
  { team: "São Paulo", content: "Calleri tá ótimo esse ano. Artilheiro do São Paulo com confiança total do torcedor #SaoPaulo #Calleri" },
  // Internacional
  { team: "Internacional", content: "Beira-Rio em crise? Não! Internacional vence e fica no G4 ❤️ #Internacional #BeirRio" },
  { team: "Internacional", content: "Eduardo Coudet construindo uma equipe compacta e eficiente no Inter. Gosto do que tô vendo ❤️ #Inter" },
  // Grêmio
  { team: "Grêmio", content: "Renato Gaúcho de volta ao Grêmio! Arena do Grêmio em festa 🔵⚫⚪ #Gremio #Renato" },
  { team: "Grêmio", content: "Grêmio venceu o clássico gaúcho! Bah, que vitória histórica 🔵⚫⚪ #Gremio #GreNal" },
  // Gerais / Neutros
  { team: null, content: "Que rodada incrível do Brasileirão esse final de semana. Várias viradas, muitos gols! ⚽🔥 #Brasileirao" },
  { team: null, content: "O Brasileirão de 2026 tá sendo um dos mais disputados dos últimos anos. Cinco times dentro de 4 pontos no topo! #Brasileirao" },
  { team: null, content: "Artilheiros do Brasileirão até agora:\n1. Pedro (FLA) - 12 gols\n2. Calleri (SP) - 9 gols\n3. Yuri Alberto (COR) - 8 gols\n\n#Brasileirao #Artilharia" },
  { team: null, content: "Mercado da bola esquentando! Vários times europeus monitorando jogadores do Brasileirão 👀 #Mercado #Transferencias" },
  { team: null, content: "Seleção Brasileira convocada! Dorival Jr mantém o time base. Brasil bom demais 🇧🇷 #Selecao #Brasil" },
  { team: null, content: "Copa Libertadores: 4 times brasileiros ainda vivos! Representando muito o futebol nacional 🏆🇧🇷 #Libertadores" },
  { team: null, content: "O VAR errou de novo hoje. Precisa de uma calibração urgente nos árbitros do Brasil 😤 #VAR #Arbitragem" },
  { team: null, content: "Ranking de técnicos do Brasileirão 2026:\n1. Abel Ferreira\n2. Mano Menezes\n3. Artur Jorge\n\nDifícil discutir #Brasileirao" },
  // Vai e Vem
  { team: null, content: "BOMBA: Memphis Depay pode sair do Corinthians já no meio do ano. Sondagens da Arabia Saudita 👀 #VaiEVem #Memphis" },
  { team: null, content: "Pedro Raul interessa ao Bayer Leverkusen! Valores em torno de €15 milhões. Vai sair? 🤔 #VaiEVem #PedroRaul" },
  { team: null, content: "Gabigol renova com o Flamengo até 2028! Acordo fechado, anúncio oficial amanhã ❤️🖤 #Flamengo #Gabigol" },
  { team: null, content: "Rodrigo Garro no radar do Boca Juniors! Timão pede 8 milhões de dólares. Saudade já 😢 #VaiEVem #Garro" },
  // Comparações e debates
  { team: null, content: "Debate do dia: quem é melhor técnico do Brasileirão atualmente? Abel ou Artur Jorge? Respondam! 👇" },
  { team: null, content: "Hot take: O Flamengo de 2026 é melhor que o de 2019. Quem concorda? ❤️🖤 #Flamengo" },
  { team: null, content: "Jogador mais subestimado do Brasileirão? Voto no Raphael Veiga. O cara é absurdo e pouca gente fala 💚 #Brasileirao" },
  { team: null, content: "A final ideal do Brasileirão 2026 seria: Palmeiras vs Flamengo. Dois times que andam voando no momento 🔥" },
  // Humor
  { team: "Corinthians", content: "Eu: 'não vou mais sofrer por time de futebol'\nCorinthians no próximo jogo: 🤡\n\n#Corinthians #sofrimento" },
  { team: "Flamengo", content: "Minha mãe perguntou por que eu tô chorando. Fala que é o Flamengo que ela entende 😭❤️🖤 #Flamengo" },
  { team: "Palmeiras", content: "Palmeiras ganhou mais um título. Normalidade 🏆💚 #Palmeiras #Campeao" },
  { team: null, content: "Final de semana sem futebol é depressão em forma de calendário 😭⚽ #Futebol" },
  { team: null, content: "Brasileirão de novo hoje? Sim senhor, vamos sofrer juntos! ⚽🔥 #Brasileirao" },
];

// Respostas realistas
const REPLY_TEMPLATES = [
  "Concordo demais! 🔥",
  "Isso aí! Muito bem colocado 👏",
  "Discordo completamente, cara...",
  "Kkkk verdade demais",
  "Não tinha pensado dessa forma 🤔",
  "100% isso! O torcedor precisa ouvir mais isso",
  "Para com isso hahaha",
  "Você falou tudo! 💯",
  "Exatamente o que eu pensei quando vi o jogo",
  "Difícil discordar disso",
  "Hmmm, faz sentido...",
  "Não consigo concordar com essa análise não",
  "Isso mesmo! Tô te seguindo agora",
  "Verdade. O time tá numa fase boa mesmo",
  "Tomara que você esteja certo!",
  "Esse time me estressa demais 😤",
  "Vai ser campeão sim! Bora!",
  "Não acredito nisso ainda não",
  "Mano, é isso mesmo. Exatamente isso.",
  "Saudade de quando o futebol era mais simples 😅",
  "Se Deus quiser vai dar certo!",
  "Esse jogador é subestimado demais",
  "O cara joga muito, concordo",
  "Técnico precisa mudar essa escalação",
  "Torço também pra isso acontecer!",
];

// ─── SEED FUNÇÕES ────────────────────────────────────────────────────────────

async function seedUsers() {
  console.log("\n👥 Criando usuários...");
  const allUsersToCreate = [
    ...FAN_USERS.map((u) => ({ ...u, type: "FAN" })),
    ...JOURNALIST_USERS.map((u) => ({ ...u, type: "JOURNALIST" })),
  ];

  let created = 0;
  const newUsers = [];

  for (const u of allUsersToCreate) {
    const team = teamMap[u.team];
    if (!team) { console.log(`  ⚠️ Time não encontrado: ${u.team}`); continue; }

    // Check if handle already exists
    const existing = await sql`SELECT id FROM users WHERE handle = ${u.handle} LIMIT 1`;
    if (existing.length > 0) { continue; }

    // Pravatar (70 diferentes) + DiceBear fallback
    const avatarNum = rand(1, 70);
    const avatarUrl = `https://i.pravatar.cc/150?img=${avatarNum}`;

    const [inserted] = await sql`
      INSERT INTO users (email, name, password, user_type, team_id, handle, bio, avatar_url, created_at, updated_at)
      VALUES (
        ${u.handle + "@futtwitter.dev"},
        ${u.name},
        ${PASSWORD_HASH},
        ${u.type},
        ${team.id},
        ${u.handle},
        ${u.bio},
        ${avatarUrl},
        ${daysAgo(rand(1, 60))},
        NOW()
      )
      RETURNING id, name, handle, team_id
    `;
    newUsers.push(inserted);
    created++;
  }

  console.log(`  ✅ ${created} usuários criados`);
  return newUsers;
}

async function seedPosts(allUsers) {
  console.log("\n📝 Criando posts...");

  let created = 0;
  const postIds = [];

  for (const template of POST_TEMPLATES) {
    // Pick a user from the correct team (or any user if team is null)
    let candidates = allUsers;
    if (template.team) {
      const team = teamMap[template.team];
      if (team) {
        const teamUsers = allUsers.filter((u) => u.team_id === team.id);
        if (teamUsers.length > 0) candidates = teamUsers;
      }
    }

    const user = pick(candidates);
    if (!user) continue;

    const createdAt = daysAgo(rand(0, 30));
    const likeCount = rand(0, 120);
    const repostCount = rand(0, 40);
    const replyCount = rand(0, 20);
    const viewCount = rand(50, 5000);

    const [post] = await sql`
      INSERT INTO posts (user_id, content, like_count, repost_count, reply_count, view_count, created_at, updated_at)
      VALUES (${user.id}, ${template.content}, ${likeCount}, ${repostCount}, ${replyCount}, ${viewCount}, ${createdAt}, ${createdAt})
      RETURNING id
    `;
    postIds.push(post.id);
    created++;
  }

  console.log(`  ✅ ${created} posts criados`);
  return postIds;
}

async function seedReplies(allUsers, postIds) {
  console.log("\n💬 Criando replies (comentários)...");

  let created = 0;

  for (const postId of pickN(postIds, Math.min(postIds.length, 40))) {
    const numReplies = rand(1, 5);
    const replyUsers = pickN(allUsers, numReplies);

    for (const user of replyUsers) {
      const content = pick(REPLY_TEMPLATES);
      const createdAt = hoursAgo(rand(0, 72));

      await sql`
        INSERT INTO posts (user_id, content, parent_post_id, like_count, view_count, created_at, updated_at)
        VALUES (${user.id}, ${content}, ${postId}, ${rand(0, 15)}, ${rand(10, 200)}, ${createdAt}, ${createdAt})
      `;
      created++;
    }
  }

  console.log(`  ✅ ${created} replies criados`);
}

async function seedLikes(allUsers, postIds) {
  console.log("\n❤️  Criando likes...");

  let created = 0;
  const existingLikes = new Set(
    (await sql`SELECT post_id || '-' || user_id as key FROM post_likes`).map((r) => r.key)
  );

  for (const postId of postIds) {
    const numLikes = rand(0, Math.min(allUsers.length, 12));
    const likers = pickN(allUsers, numLikes);

    for (const user of likers) {
      const key = `${postId}-${user.id}`;
      if (existingLikes.has(key)) continue;
      existingLikes.add(key);

      await sql`
        INSERT INTO post_likes (post_id, user_id, created_at)
        VALUES (${postId}, ${user.id}, ${hoursAgo(rand(0, 168))})
        ON CONFLICT DO NOTHING
      `;
      created++;
    }
  }

  console.log(`  ✅ ${created} likes criados`);
}

async function seedFollows(allUsers) {
  console.log("\n➕ Criando follows...");

  let created = 0;
  const existingFollows = new Set(
    (await sql`SELECT follower_id || '-' || following_id as key FROM user_follows`).map((r) => r.key)
  );

  for (const user of allUsers) {
    // Each user follows 3-15 random others
    const toFollow = pickN(
      allUsers.filter((u) => u.id !== user.id),
      rand(3, 15)
    );

    for (const target of toFollow) {
      const key = `${user.id}-${target.id}`;
      if (existingFollows.has(key)) continue;
      existingFollows.add(key);

      await sql`
        INSERT INTO user_follows (follower_id, following_id, created_at)
        VALUES (${user.id}, ${target.id}, ${daysAgo(rand(0, 30))})
        ON CONFLICT DO NOTHING
      `;
      created++;
    }
  }

  // Update follower/following counts
  await sql`
    UPDATE users u
    SET followers_count = (SELECT COUNT(*) FROM user_follows WHERE following_id = u.id),
        following_count = (SELECT COUNT(*) FROM user_follows WHERE follower_id = u.id)
  `;

  console.log(`  ✅ ${created} follows criados`);
}

async function seedMatches() {
  console.log("\n⚽ Criando partidas do Brasileirão 2026...");

  // Times do Brasileirao 2026 (Serie A)
  const serieATeams = [
    "Atlético Mineiro", "Flamengo", "Palmeiras", "Corinthians",
    "Botafogo", "Fluminense", "São Paulo", "Internacional",
    "Grêmio", "Cruzeiro", "Bahia", "Fortaleza",
    "Vasco da Gama", "Athletico Paranaense", "RB Bragantino",
    "Cuiabá", "Santos", "América Mineiro", "Coritiba", "Goiás"
  ];

  const teams = await sql`SELECT id, name, logo_url FROM teams WHERE name = ANY(${serieATeams})`;
  const stadiums = {
    "Atlético Mineiro": "Arena MRV",
    "Flamengo": "Maracanã",
    "Palmeiras": "Allianz Parque",
    "Corinthians": "Neo Química Arena",
    "Botafogo": "Nilton Santos",
    "Fluminense": "Maracanã",
    "São Paulo": "MorumBIS",
    "Internacional": "Beira-Rio",
    "Grêmio": "Arena do Grêmio",
    "Cruzeiro": "Mineirão",
    "Bahia": "Arena Fonte Nova",
    "Fortaleza": "Arena Castelão",
    "Vasco da Gama": "São Januário",
    "Athletico Paranaense": "Arena da Baixada",
    "RB Bragantino": "Nabi Abi Chedid",
    "Cuiabá": "Arena Pantanal",
    "Santos": "Vila Belmiro",
    "América Mineiro": "Arena Independência",
    "Coritiba": "Couto Pereira",
    "Goiás": "Serra Dourada",
  };

  // Fixtures: 10 rodadas já jogadas + 5 futuras
  const fixtures = [];
  const rounds = [
    // Rodadas já concluídas (1-10)
    { round: 1,  dateOffset: -65, status: "COMPLETED" },
    { round: 2,  dateOffset: -58, status: "COMPLETED" },
    { round: 3,  dateOffset: -51, status: "COMPLETED" },
    { round: 4,  dateOffset: -44, status: "COMPLETED" },
    { round: 5,  dateOffset: -37, status: "COMPLETED" },
    { round: 6,  dateOffset: -30, status: "COMPLETED" },
    { round: 7,  dateOffset: -23, status: "COMPLETED" },
    { round: 8,  dateOffset: -16, status: "COMPLETED" },
    { round: 9,  dateOffset: -9,  status: "COMPLETED" },
    { round: 10, dateOffset: -2,  status: "COMPLETED" },
    // Próximas rodadas
    { round: 11, dateOffset: 5,   status: "SCHEDULED" },
    { round: 12, dateOffset: 12,  status: "SCHEDULED" },
    { round: 13, dateOffset: 19,  status: "SCHEDULED" },
    { round: 14, dateOffset: 26,  status: "SCHEDULED" },
    { round: 15, dateOffset: 33,  status: "SCHEDULED" },
  ];

  let created = 0;

  for (const roundInfo of rounds) {
    // Create ~10 matches per round (one per pair)
    const shuffled = [...teams].sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffled.length - 1; i += 2) {
      const home = shuffled[i];
      const away = shuffled[i + 1];
      if (!home || !away) continue;

      const isCompleted = roundInfo.status === "COMPLETED";
      const homeScore = isCompleted ? rand(0, 4) : null;
      const awayScore = isCompleted ? rand(0, 3) : null;
      const matchDate = new Date();
      matchDate.setDate(matchDate.getDate() + roundInfo.dateOffset);
      // Random hour for match
      matchDate.setHours(pick([11, 16, 18, 20, 21]), pick([0, 30]), 0, 0);

      await sql`
        INSERT INTO matches (
          team_id, opponent, opponent_logo_url, is_home_match,
          team_score, opponent_score, match_date, stadium,
          championship_round, status, competition, created_at, updated_at
        ) VALUES (
          ${home.id},
          ${away.name},
          ${away.logo_url},
          true,
          ${homeScore},
          ${awayScore},
          ${matchDate.toISOString()},
          ${stadiums[home.name] || "Estádio"},
          ${roundInfo.round},
          ${roundInfo.status},
          'Brasileirão Série A',
          NOW(), NOW()
        )
        ON CONFLICT DO NOTHING
      `;
      created++;
    }
  }

  console.log(`  ✅ ${created} partidas criadas`);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Seed massivo iniciado...\n");

  // Get all existing users too (to use in likes/follows/posts)
  const existingUsers = await sql`SELECT id, name, handle, team_id FROM users`;
  console.log(`  Usuários existentes: ${existingUsers.length}`);

  // 1. Criar novos usuários
  const newUsers = await seedUsers();
  const allUsers = [...existingUsers, ...newUsers];
  console.log(`  Total de usuários para usar: ${allUsers.length}`);

  // 2. Criar posts
  const postIds = await seedPosts(allUsers);

  // 3. Criar replies
  const allPostIds = [
    ...(await sql`SELECT id FROM posts WHERE parent_post_id IS NULL`).map((p) => p.id),
    ...postIds,
  ];
  await seedReplies(allUsers, allPostIds);

  // 4. Criar likes
  await seedLikes(allUsers, allPostIds);

  // 5. Criar follows
  await seedFollows(allUsers);

  // 6. Criar partidas
  await seedMatches();

  // ─── RESUMO FINAL ───────────────────────────────────────────────────────

  console.log("\n\n📊 RESUMO FINAL DO BANCO:");
  const [final] = await sql`SELECT
    (SELECT COUNT(*) FROM users)             as users,
    (SELECT COUNT(*) FROM posts)             as posts,
    (SELECT COUNT(*) FROM post_likes)        as likes,
    (SELECT COUNT(*) FROM user_follows)      as follows,
    (SELECT COUNT(*) FROM matches)           as matches,
    (SELECT COUNT(*) FROM players)           as players,
    (SELECT COUNT(*) FROM teams)             as teams,
    (SELECT COUNT(*) FROM transfer_rumors)   as rumors
  `;
  Object.entries(final).forEach(([k,v]) => console.log(`  ${k.padEnd(15)}: ${v}`));

  const matchStats = await sql`SELECT status, COUNT(*) as c FROM matches GROUP BY status`;
  console.log("\n  Partidas por status:");
  matchStats.forEach(r => console.log(`    ${r.status}: ${r.c}`));

  console.log("\n✅ Seed massivo concluído!");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

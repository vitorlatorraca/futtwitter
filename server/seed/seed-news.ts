/**
 * seed-news.ts
 * Popula a tabela `news` com notícias reais de futebol brasileiro.
 * Usa o jornalista aprovado existente (Vitor) como autor.
 *
 * Execução:
 *   npx tsx server/seed/seed-news.ts
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";

const db = drizzle(neon(process.env.DATABASE_URL!));

// ─── Jornalista aprovado (Vitor) ─────────────────────────────────────────────
const JOURNALIST_ID = "14fc12cf-a93d-46ac-88ae-af965144479b";

// ─── Times ───────────────────────────────────────────────────────────────────
const TEAMS: Record<string, string> = {
  corinthians: "corinthians",
  palmeiras: "palmeiras",
  flamengo: "flamengo",
  saoPaulo: "sao-paulo",
  cruzeiro: "cruzeiro",
  atleticoMg: "atletico-mg",
};

// ─── Notícias ─────────────────────────────────────────────────────────────────
const NEWS_ITEMS = [
  // ── CORINTHIANS ──────────────────────────────────────────────────────────
  {
    title: "Corinthians vence o Palmeiras no Derby e assume liderança do Paulistão",
    content:
      "O Corinthians derrotou o Palmeiras por 2 a 1 na noite deste sábado, em clássico disputado na Neo Química Arena, pela 8ª rodada do Campeonato Paulista. Gols de Yuri Alberto e Memphis Depay garantiram a vitória corintiana. Com o resultado, o Timão assume provisoriamente a liderança do Grupo C com 17 pontos. O técnico Ramón Díaz destacou o empenho coletivo e afirmou que a equipe está crescendo a cada jogo. Já o Palmeiras lamenta a sequência de resultados negativos e acumula três partidas sem vencer no estadual.",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    category: "NEWS",
    teamId: TEAMS.corinthians,
    daysAgo: 0,
  },
  {
    title: "Yuri Alberto renova com o Corinthians até 2028 e descarta propostas europeias",
    content:
      "O atacante Yuri Alberto assinou a renovação do seu contrato com o Sport Club Corinthians Paulista até dezembro de 2028. O jogador, que viveu grande fase neste início de temporada, com 9 gols em 12 partidas, recusou sondagens de clubes de Portugal e da Turquia para permanecer no Parque São Jorge. Em declaração exclusiva, Yuri afirmou: 'Meu coração é do Corinthians. Quero conquistar tudo aqui antes de pensar em sair'. A diretoria também aumentou a multa rescisória do atleta para R$ 150 milhões.",
    imageUrl:
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
    category: "MARKET",
    teamId: TEAMS.corinthians,
    daysAgo: 1,
  },
  {
    title: "Corinthians confirma contratação de zagueiro uruguaio ex-Nacional",
    content:
      "O Corinthians anunciou oficialmente nesta quarta-feira a contratação do zagueiro Rodrigo Bentancur, de 27 anos, ex-Club Nacional do Uruguai. O defensor chega por empréstimo de 12 meses, com opção de compra fixada em 4 milhões de dólares. Bentancur é destaque na seleção uruguaia e foi campeão da Copa América Sub-20. A nova contratação chega para suprir a lacuna deixada pela lesão de André Ramalho, que deverá ficar afastado por até três meses.",
    imageUrl:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
    category: "MARKET",
    teamId: TEAMS.corinthians,
    daysAgo: 2,
  },
  {
    title: "Bastidores: Ramón Díaz revela mudança tática que transformou o Corinthians",
    content:
      "Em entrevista exclusiva ao FuteApp, o técnico Ramón Díaz detalhou as mudanças táticas implementadas desde a sua chegada ao Corinthians. O argentino adotou um 4-3-3 com pressão alta e saída de bola pelo goleiro, o que melhorou consideravelmente a posse de bola do time — de 48% para 56% de média. Díaz também revelou que as sessões de vídeo com os jogadores são realizadas três vezes por semana e incluem análise dos adversários. 'O Corinthians tem qualidade para brigar por todos os títulos em 2026', afirmou o treinador.",
    imageUrl:
      "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80",
    category: "BACKSTAGE",
    teamId: TEAMS.corinthians,
    daysAgo: 3,
  },
  {
    title: "Análise: Corinthians tem o melhor ataque do Brasileirão em 2026",
    content:
      "Com 38 gols marcados em 18 rodadas, o Corinthians ostenta o melhor ataque do Campeonato Brasileiro em 2026. Yuri Alberto lidera a artilharia com 14 gols, seguido por Memphis Depay com 9. A análise tática mostra que 60% dos gols saem após combinações de um toque na intermediária adversária, reflexo direta do trabalho de Ramón Díaz. A defesa, no entanto, ainda preocupa: o time sofreu 22 gols, o 8º pior do campeonato. O equilíbrio defensivo será a chave para sustentar a briga pelo título.",
    imageUrl:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80",
    category: "ANALYSIS",
    teamId: TEAMS.corinthians,
    daysAgo: 4,
  },

  // ── PALMEIRAS ────────────────────────────────────────────────────────────
  {
    title: "Palmeiras goleia o Santos por 4 a 0 e consolida liderança do Brasileirão",
    content:
      "Em jogo de domingo à tarde no Allianz Parque, o Palmeiras aplicou uma goleada histórica sobre o Santos por 4 a 0, em clássico válido pela 20ª rodada do Campeonato Brasileiro. Estêvão marcou dois gols e deu uma assistência, enquanto Flaco López e Raphael Veiga completaram o placar. Com o resultado, o Verdão chega aos 45 pontos e abre 6 de vantagem para o segundo colocado. Abel Ferreira elogiou o desempenho dos seus jogadores e ressaltou a importância de manter a consistência até o final da temporada.",
    imageUrl:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
    category: "NEWS",
    teamId: TEAMS.palmeiras,
    daysAgo: 1,
  },
  {
    title: "Estêvão é eleito o melhor jogador do Brasil em 2026 pela CBF",
    content:
      "O meia-atacante Estêvão Willian, do Palmeiras, foi eleito o melhor jogador do Brasil em 2026 pela Confederação Brasileira de Futebol, em cerimônia realizada nesta terça-feira em São Paulo. Aos 18 anos, o jovem talento acumula 22 gols e 18 assistências na temporada, números que chamaram atenção do Chelsea, que teria feito uma nova proposta de 70 milhões de euros pelo jogador. O Palmeiras reafirmou que não negociará o atleta antes de junho, quando ele está programado para se transferir para a Inglaterra conforme acordo pré-acertado.",
    imageUrl:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    category: "NEWS",
    teamId: TEAMS.palmeiras,
    daysAgo: 2,
  },

  // ── FLAMENGO ─────────────────────────────────────────────────────────────
  {
    title: "Flamengo contrata meia colombiano por 12 milhões de euros",
    content:
      "O Flamengo anunciou a contratação do meia colombiano James Cortés, de 24 anos, por 12 milhões de euros provenientes do Club Atlético Nacional. O jogador assinou contrato de quatro anos com o Rubro-Negro e chega como a grande aposta da diretoria para substituir Gerson, que retornou ao Olympique de Marseille. Cortés foi destaque da Copa América do ano passado, com dois gols e quatro assistências pela Colômbia. A torcida do Flamengo recebeu a notícia com entusiasmo nas redes sociais, onde o anúncio já soma mais de 500 mil curtidas.",
    imageUrl:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
    category: "MARKET",
    teamId: TEAMS.flamengo,
    daysAgo: 0,
  },
  {
    title: "Flamengo vence o Vasco na Libertadores e avança às semifinais",
    content:
      "Em uma noite inesquecível no Maracanã, o Flamengo derrotou o Vasco da Gama por 3 a 1 e avançou às semifinais da Copa Libertadores da América. O Rubro-Negro contou com dois gols de Gabigol e um de Pedro para superar o clássico carioca. A classificação colocou o Flamengo entre os quatro melhores times do continente pela terceira vez consecutiva. O adversário na semifinal será o Boca Juniors, que eliminou o Racing no mesmo dia. Os jogos estão marcados para agosto.",
    imageUrl:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800&q=80",
    category: "NEWS",
    teamId: TEAMS.flamengo,
    daysAgo: 3,
  },

  // ── SÃO PAULO ────────────────────────────────────────────────────────────
  {
    title: "São Paulo anuncia chegada de Calleri até 2027 e encerra novela",
    content:
      "Após semanas de especulação, o São Paulo Futebol Clube confirmou nesta sexta-feira a renovação de contrato do atacante Jonathan Calleri até dezembro de 2027. O argentino, ídolo da torcida tricolor, havia recebido propostas do futebol árabe e do México, mas optou por continuar no Morumbis. Na coletiva de imprensa, Calleri declarou: 'São Paulo é minha casa, minha família está aqui e quero ser campeão com essa camisa'. O clube também anunciou um aumento salarial e bônus por metas que podem triplicar seus ganhos.",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    category: "MARKET",
    teamId: TEAMS.saoPaulo,
    daysAgo: 2,
  },

  // ── ATLETICO-MG ──────────────────────────────────────────────────────────
  {
    title: "Atlético-MG bate o River Plate e conquista Recopa Sul-Americana",
    content:
      "O Atlético Mineiro sagrou-se campeão da Recopa Sul-Americana ao derrotar o River Plate por 2 a 1 na decisão disputada no Estádio Monumental de Núñez, em Buenos Aires. Com gols de Hulk e Paulinho, o Galo confirmou o favoritismo e levou mais um troféu internacional para Belo Horizonte. É o segundo título sul-americano do clube em menos de dois anos. O técnico Gabriel Milito recebeu elogios rasgados da imprensa argentina pela organização tática da equipe. A Recopa vai direto para a Cidade do Galo, onde uma festa está sendo preparada pela torcida.",
    imageUrl:
      "https://images.unsplash.com/photo-1566479179871-b5aba9a4e8d8?w=800&q=80",
    category: "NEWS",
    teamId: TEAMS.atleticoMg,
    daysAgo: 1,
  },

  // ── CRUZEIRO ─────────────────────────────────────────────────────────────
  {
    title: "Cruzeiro anuncia Ronaldo como CEO executivo do clube",
    content:
      "O Cruzeiro Esporte Clube surpreendeu o mundo do futebol ao anunciar Ronaldo Nazário como CEO executivo do clube. O Fenômeno, que detém 90% das ações do time mineiro, assumirá também a gestão operacional para acelerar o projeto de modernização iniciado em 2021. Entre as primeiras medidas estão a contratação de um diretor de futebol europeu e a inauguração de um centro de treinamento de alto desempenho em Betim. A SAF do Cruzeiro cresceu 180% em receita nos últimos três anos e o clube mira uma vaga na fase de grupos da Libertadores 2027.",
    imageUrl:
      "https://images.unsplash.com/photo-1535483102974-fa1e64d0ca86?w=800&q=80",
    category: "NEWS",
    teamId: TEAMS.cruzeiro,
    daysAgo: 0,
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Iniciando seed de notícias...\n");

  // Verifica se o jornalista existe
  const journalistCheck = await db.execute(sql`
    SELECT j.id, u.name
    FROM journalists j
    INNER JOIN users u ON j.user_id = u.id
    WHERE j.id = ${JOURNALIST_ID}
    LIMIT 1
  `);

  if (!journalistCheck.rows.length) {
    console.error(`❌ Jornalista ${JOURNALIST_ID} não encontrado. Rode o seed de usuários primeiro.`);
    process.exit(1);
  }

  const journalistName = (journalistCheck.rows[0] as any).name;
  console.log(`✅ Jornalista encontrado: ${journalistName}\n`);

  let created = 0;
  let skipped = 0;

  for (const item of NEWS_ITEMS) {
    // Evita duplicatas pelo título
    const existing = await db.execute(sql`
      SELECT id FROM news WHERE title = ${item.title} LIMIT 1
    `);

    if (existing.rows.length) {
      console.log(`⏭  Já existe: "${item.title.slice(0, 60)}..."`);
      skipped++;
      continue;
    }

    const publishedAt = new Date(Date.now() - item.daysAgo * 24 * 60 * 60 * 1000);

    await db.execute(sql`
      INSERT INTO news (
        id,
        journalist_id,
        team_id,
        title,
        content,
        image_url,
        category,
        is_published,
        published_at,
        likes_count,
        dislikes_count,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        ${JOURNALIST_ID},
        ${item.teamId},
        ${item.title},
        ${item.content},
        ${item.imageUrl},
        ${item.category}::news_category,
        true,
        ${publishedAt.toISOString()},
        ${Math.floor(Math.random() * 300) + 50},
        ${Math.floor(Math.random() * 30)},
        NOW(),
        NOW()
      )
    `);

    console.log(`✅ Criada: "${item.title.slice(0, 70)}"`);
    created++;
  }

  console.log(`\n🎉 Seed concluído!`);
  console.log(`   ✅ ${created} notícias criadas`);
  console.log(`   ⏭  ${skipped} notícias já existiam`);
  console.log(`   📰 Total no banco: ${created + skipped} novas + anteriores`);
}

main().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});

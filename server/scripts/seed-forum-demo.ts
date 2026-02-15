/**
 * Seed demo topics for the forum (Comunidade).
 * Run: npx tsx server/scripts/seed-forum-demo.ts
 *
 * Requires: at least one user and one team in the database.
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { teamsForumTopics, users, teams } from "@shared/schema";

async function seed() {
  const [user] = await db.select().from(users).limit(1);
  const [team] = await db.select().from(teams).limit(1);

  if (!user || !team) {
    console.log("❌ Precisa de pelo menos 1 usuário e 1 time no banco. Rode o seed principal primeiro.");
    process.exit(1);
  }

  const existing = await db.select().from(teamsForumTopics).where(eq(teamsForumTopics.teamId, team.id)).limit(1);
  if (existing.length > 0) {
    console.log("✅ Fórum já possui tópicos. Nada a fazer.");
    process.exit(0);
  }

  const demos = [
    { title: "Bem-vindos à Comunidade!", content: "Este é o espaço oficial para discutirmos nosso time. Compartilhe opiniões, notícias e debates com outros torcedores.", category: "base" as const },
    { title: "Análise do último jogo", content: "O que acharam da atuação do time no último jogo? A defesa precisa melhorar ou foi apenas um dia ruim?", category: "post_match" as const },
    { title: "Expectativas para o próximo jogo", content: "Próximo adversário é complicado. Qual a escalação ideal? Quem deve ser titular?", category: "pre_match" as const },
    { title: "Rumor: reforço para o meio-campo", content: "Vi em um portal que o clube está de olho em um volante. Alguém tem mais informações?", category: "transfer" as const },
    { title: "Notícia: renovação de contrato", content: "Acabei de ver que o clube renovou com um dos destaques. Ótima notícia para a temporada!", category: "news" as const },
  ];

  for (const d of demos) {
    await db.insert(teamsForumTopics).values({
      teamId: team.id,
      authorId: user.id,
      title: d.title,
      content: d.content,
      category: d.category,
    });
  }

  console.log(`✅ ${demos.length} tópicos de demonstração criados para o time ${team.name}.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro:", err);
  process.exit(1);
});

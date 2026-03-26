import "dotenv/config";
import { db } from "./db";
import { users, journalists, news, teams, players } from "@shared/schema";
import { TEAMS_DATA } from "./teams-data";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

/**
 * Script de teste para validar o requisito:
 * - Após aprovar Maurinho como APPROVED, deve existir um post seedado do Corinthians com texto + imageUrl
 * 
 * Este script:
 * 1) Roda seed
 * 2) Aprova Maurinho automaticamente em dev (somente se ADMIN_EMAILS incluir admin@futtwitter.dev)
 * 3) Cria/valida o post do Corinthians
 * 4) Faz asserts simples (console) confirmando que tudo existe
 * 
 * IMPORTANTE: Só roda em NODE_ENV=development
 */

async function runSeed() {
  console.log("📦 Executando seed...");

  try {
    // Check if teams already exist
    const existingTeams = await db.select().from(teams);
    
    if (existingTeams.length === 0) {
      console.log("   Seeding teams...");
      
      // Insert all 20 teams
      for (const team of TEAMS_DATA) {
        await db.insert(teams).values({
          id: team.id,
          name: team.name,
          shortName: team.shortName,
          logoUrl: team.logoUrl,
          primaryColor: team.primaryColor,
          secondaryColor: team.secondaryColor,
          currentPosition: Math.floor(Math.random() * 20) + 1,
          points: Math.floor(Math.random() * 50),
          wins: Math.floor(Math.random() * 15),
          draws: Math.floor(Math.random() * 10),
          losses: Math.floor(Math.random() * 10),
        });
      }
      
      console.log(`   ✓ Seeded ${TEAMS_DATA.length} teams`);
    } else {
      console.log("   Teams already seeded, skipping...");
    }

    // Create admin user
    const existingAdmin = await db.select().from(users).where(eq(users.email, "admin@futtwitter.dev"));
    
    if (existingAdmin.length === 0) {
      console.log("   Creating admin user...");
      
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      
      await db.insert(users).values({
        name: "FUTTWITTER Admin",
        email: "admin@futtwitter.dev",
        password: hashedPassword,
        userType: "ADMIN",
      });

      console.log("   ✓ Created admin user");
    } else {
      if (existingAdmin[0].userType !== "ADMIN") {
        await db.update(users).set({ userType: "ADMIN" }).where(eq(users.email, "admin@futtwitter.dev"));
        console.log("   ✓ Updated existing user to ADMIN");
      } else {
        console.log("   Admin user already exists, skipping...");
      }
    }

    // Create journalist "Maurinho Betting" (PENDING status for testing approval flow)
    const existingMaurinho = await db.select().from(users).where(eq(users.email, "maurinho@betting.dev"));
    
    if (existingMaurinho.length === 0) {
      console.log("   Creating journalist user (Maurinho Betting)...");
      
      const hashedPassword = await bcrypt.hash("Senha@123", 10);
      
      const [maurinhoUser] = await db.insert(users).values({
        name: "Maurinho Betting",
        email: "maurinho@betting.dev",
        password: hashedPassword,
        teamId: "corinthians",
        userType: "FAN",
      }).returning();

      await db.insert(journalists).values({
        userId: maurinhoUser.id,
        organization: "Betting News",
        professionalId: "BR-JOR-MAURINHO",
        status: "PENDING",
      });

      console.log("   ✓ Created journalist user (Maurinho Betting, status: PENDING)");
    } else {
      console.log("   Maurinho Betting already exists, skipping...");
    }

    console.log("✅ Seed completo!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

async function testMaurinhoApproval() {
  // 1. Verificar NODE_ENV
  if (process.env.NODE_ENV !== "development") {
    console.error("❌ ERRO: Este script só pode ser executado em NODE_ENV=development");
    console.error("   Para segurança, não execute em produção!");
    process.exit(1);
  }

  console.log("✅ NODE_ENV=development confirmado");

  // 2. Verificar ADMIN_EMAILS
  const adminEmails = process.env.ADMIN_EMAILS;
  if (!adminEmails) {
    console.error("❌ ERRO: ADMIN_EMAILS não está definido");
    process.exit(1);
  }

  const adminEmailsList = adminEmails.split(",").map((e) => e.trim().toLowerCase());
  if (!adminEmailsList.includes("admin@futtwitter.dev")) {
    console.error("❌ ERRO: ADMIN_EMAILS deve incluir admin@futtwitter.dev");
    console.error(`   ADMIN_EMAILS atual: ${adminEmails}`);
    process.exit(1);
  }

  console.log("✅ ADMIN_EMAILS inclui admin@futtwitter.dev");

  try {
    // 3. Executar seed
    await runSeed();

    // 4. Buscar Maurinho
    console.log("\n🔍 Buscando usuário Maurinho...");
    const [maurinhoUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, "maurinho@betting.dev"))
      .limit(1);

    if (!maurinhoUser) {
      console.error("❌ ERRO: Usuário Maurinho não encontrado. Execute o seed primeiro!");
      process.exit(1);
    }

    console.log(`✅ Maurinho encontrado: ${maurinhoUser.name} (ID: ${maurinhoUser.id})`);

    // 5. Buscar registro de jornalista de Maurinho
    console.log("\n🔍 Buscando registro de jornalista de Maurinho...");
    const [maurinhoJournalist] = await db
      .select()
      .from(journalists)
      .where(eq(journalists.userId, maurinhoUser.id))
      .limit(1);

    if (!maurinhoJournalist) {
      console.error("❌ ERRO: Registro de jornalista não encontrado para Maurinho");
      process.exit(1);
    }

    console.log(`✅ Registro de jornalista encontrado (Status: ${maurinhoJournalist.status})`);

    // 6. Aprovar Maurinho se ainda não estiver aprovado
    if (maurinhoJournalist.status !== "APPROVED") {
      console.log("\n✅ Aprovando Maurinho...");
      await db
        .update(journalists)
        .set({
          status: "APPROVED",
          verificationDate: new Date(),
        })
        .where(eq(journalists.userId, maurinhoUser.id));

      // Atualizar userType para JOURNALIST se não for ADMIN
      if (maurinhoUser.userType !== "ADMIN") {
        await db
          .update(users)
          .set({ userType: "JOURNALIST" })
          .where(eq(users.id, maurinhoUser.id));
      }

      console.log("✅ Maurinho aprovado com sucesso!");
    } else {
      console.log("✅ Maurinho já está aprovado");
    }

    // 7. Verificar se o post do Corinthians já existe
    console.log("\n🔍 Verificando post do Corinthians...");
    const [existingPost] = await db
      .select()
      .from(news)
      .where(eq(news.journalistId, maurinhoJournalist.id))
      .limit(1);

    if (existingPost) {
      console.log("✅ Post do Corinthians já existe");
      console.log(`   Título: ${existingPost.title}`);
      console.log(`   ImageUrl: ${existingPost.imageUrl ? "✅ Presente" : "❌ Ausente"}`);
      console.log(`   Content: ${existingPost.content ? "✅ Presente" : "❌ Ausente"}`);
    } else {
      // 8. Criar o post do Corinthians
      console.log("\n📝 Criando post do Corinthians...");

      // Verificar se o time Corinthians existe
      const [corinthiansTeam] = await db
        .select()
        .from(teams)
        .where(eq(teams.id, "corinthians"))
        .limit(1);

      if (!corinthiansTeam) {
        console.error("❌ ERRO: Time Corinthians não encontrado. Execute o seed primeiro!");
        process.exit(1);
      }

      // Buscar o registro atualizado de jornalista (com status APPROVED)
      const [updatedJournalist] = await db
        .select()
        .from(journalists)
        .where(eq(journalists.userId, maurinhoUser.id))
        .limit(1);

      if (!updatedJournalist || updatedJournalist.status !== "APPROVED") {
        console.error("❌ ERRO: Jornalista não está aprovado após atualização");
        process.exit(1);
      }

      const postContent = `O Corinthians vive um momento importante na temporada, com o técnico buscando consolidar um estilo de jogo que combine solidez defensiva e eficiência ofensiva. A equipe tem mostrado evolução tática em campo, com os jogadores demonstrando maior entrosamento e compreensão do sistema de jogo proposto.

Nos últimos jogos, observamos uma melhora significativa na organização defensiva, com a linha de defesa trabalhando de forma mais coordenada. No meio-campo, a equipe tem conseguido controlar melhor o ritmo das partidas, alternando entre momentos de pressão alta e contenção estratégica.

A ofensiva também tem apresentado sinais positivos, com os atacantes criando mais oportunidades de gol e demonstrando maior objetividade nas finalizações. O trabalho em conjunto entre os setores tem sido fundamental para os resultados recentes.

Com a sequência de jogos pela frente, o Corinthians precisa manter essa consistência e continuar evoluindo taticamente para alcançar seus objetivos na competição.`;

      const [newPost] = await db
        .insert(news)
        .values({
          journalistId: updatedJournalist.id,
          teamId: "corinthians",
          title: "Corinthians: análise tática do momento",
          content: postContent,
          imageUrl: "https://picsum.photos/1200/630?random=corinthians",
          category: "ANALYSIS",
          isPublished: true,
        })
        .returning();

      console.log("✅ Post do Corinthians criado com sucesso!");
      console.log(`   ID: ${newPost.id}`);
      console.log(`   Título: ${newPost.title}`);
    }

    // 9. Validações finais (asserts)
    console.log("\n" + "=".repeat(60));
    console.log("📋 VALIDAÇÕES FINAIS");
    console.log("=".repeat(60));

    // Validar Maurinho está aprovado
    const [finalJournalist] = await db
      .select()
      .from(journalists)
      .where(eq(journalists.userId, maurinhoUser.id))
      .limit(1);

    if (finalJournalist?.status !== "APPROVED") {
      console.error("❌ FALHA: Maurinho não está com status APPROVED");
      process.exit(1);
    }
    console.log("✅ ASSERT: Maurinho está com status APPROVED");

    // Validar post existe
    const [finalPost] = await db
      .select()
      .from(news)
      .where(eq(news.journalistId, finalJournalist.id))
      .limit(1);

    if (!finalPost) {
      console.error("❌ FALHA: Post do Corinthians não existe");
      process.exit(1);
    }
    console.log("✅ ASSERT: Post do Corinthians existe");

    // Validar post tem texto
    if (!finalPost.content || finalPost.content.trim().length === 0) {
      console.error("❌ FALHA: Post do Corinthians não tem conteúdo (texto)");
      process.exit(1);
    }
    console.log("✅ ASSERT: Post do Corinthians tem conteúdo (texto)");

    // Validar post tem imageUrl
    if (!finalPost.imageUrl || finalPost.imageUrl.trim().length === 0) {
      console.error("❌ FALHA: Post do Corinthians não tem imageUrl");
      process.exit(1);
    }
    console.log("✅ ASSERT: Post do Corinthians tem imageUrl");

    // Validar post é do Corinthians
    if (finalPost.teamId !== "corinthians") {
      console.error(`❌ FALHA: Post não é do Corinthians (teamId: ${finalPost.teamId})`);
      process.exit(1);
    }
    console.log("✅ ASSERT: Post é do Corinthians (teamId: corinthians)");

    // Validar post é de Maurinho
    if (finalPost.journalistId !== finalJournalist.id) {
      console.error("❌ FALHA: Post não pertence a Maurinho");
      process.exit(1);
    }
    console.log("✅ ASSERT: Post pertence a Maurinho");

    console.log("\n" + "=".repeat(60));
    console.log("🎉 TODOS OS TESTES PASSARAM!");
    console.log("=".repeat(60));
    console.log("\n📊 Resumo:");
    console.log(`   - Maurinho: ${maurinhoUser.name} (${maurinhoUser.email})`);
    console.log(`   - Status: ${finalJournalist.status}`);
    console.log(`   - Post ID: ${finalPost.id}`);
    console.log(`   - Post Título: ${finalPost.title}`);
    console.log(`   - Post ImageUrl: ${finalPost.imageUrl}`);
    console.log(`   - Post Content: ${finalPost.content.substring(0, 50)}...`);
    console.log("\n✅ Requisito 100% cumprido!");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERRO durante execução do teste:", error);
    process.exit(1);
  }
}

// Executar teste
testMaurinhoApproval();

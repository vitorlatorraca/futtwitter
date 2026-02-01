import { db } from "./db";
import { teams, users, journalists, players, news } from "@shared/schema";
import { TEAMS_DATA } from "./teams-data";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Starting database seed...");

  try {
    // Check if teams already exist
    const existingTeams = await db.select().from(teams);
    
    if (existingTeams.length === 0) {
      console.log("Seeding teams...");
      
      // Insert all 20 teams
      for (const team of TEAMS_DATA) {
        await db.insert(teams).values({
          id: team.id,
          name: team.name,
          shortName: team.shortName,
          logoUrl: team.logoUrl,
          primaryColor: team.primaryColor,
          secondaryColor: team.secondaryColor,
          currentPosition: Math.floor(Math.random() * 20) + 1, // Random position
          points: Math.floor(Math.random() * 50), // Random points
          wins: Math.floor(Math.random() * 15),
          draws: Math.floor(Math.random() * 10),
          losses: Math.floor(Math.random() * 10),
        });
      }
      
      console.log(`✓ Seeded ${TEAMS_DATA.length} teams`);
    } else {
      console.log("Teams already seeded, skipping...");
    }

    // Create a sample journalist user
    const existingJournalist = await db.select().from(users).where(eq(users.email, "jornalista@brasileirao.com"));
    
    if (existingJournalist.length === 0) {
      console.log("Creating sample journalist...");
      
      const hashedPassword = await bcrypt.hash("senha123", 10);
      
      const [journalistUser] = await db.insert(users).values({
        name: "Maria Silva",
        email: "jornalista@brasileirao.com",
        password: hashedPassword,
        teamId: "flamengo",
        userType: "JOURNALIST",
      }).returning();

      await db.insert(journalists).values({
        userId: journalistUser.id,
        organization: "Brasileirão News",
        professionalId: "BR-JOR-001",
        status: "APPROVED",
        verificationDate: new Date(),
      });

      console.log("✓ Created journalist user (email: jornalista@brasileirao.com, password: senha123)");
    } else {
      console.log("Journalist already exists, skipping...");
    }

    // Create admin user
    const existingAdmin = await db.select().from(users).where(eq(users.email, "admin@futtwitter.dev"));
    
    if (existingAdmin.length === 0) {
      console.log("Creating admin user...");
      
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      
      await db.insert(users).values({
        name: "FUTTWITTER Admin",
        email: "admin@futtwitter.dev",
        password: hashedPassword,
        userType: "ADMIN",
      });

      console.log("✓ Created admin user (email: admin@futtwitter.dev, password: Admin@123)");
    } else {
      // Ensure existing admin has ADMIN userType
      if (existingAdmin[0].userType !== "ADMIN") {
        await db.update(users).set({ userType: "ADMIN" }).where(eq(users.email, "admin@futtwitter.dev"));
        console.log("✓ Updated existing user to ADMIN");
      } else {
        console.log("Admin user already exists, skipping...");
      }
    }

    // Create journalist "Maurinho Betting" (PENDING status for testing approval flow)
    const existingMaurinho = await db.select().from(users).where(eq(users.email, "maurinho@betting.dev"));
    
    if (existingMaurinho.length === 0) {
      console.log("Creating journalist user (Maurinho Betting)...");
      
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

      console.log("✓ Created journalist user (email: maurinho@betting.dev, password: Senha@123, status: PENDING)");
    } else {
      console.log("Maurinho Betting already exists, skipping...");
    }

    // Create sample fan user
    const existingFan = await db.select().from(users).where(eq(users.email, "torcedor@brasileirao.com"));
    
    if (existingFan.length === 0) {
      console.log("Creating sample fan user...");
      
      const hashedPassword = await bcrypt.hash("senha123", 10);
      
      await db.insert(users).values({
        name: "João Santos",
        email: "torcedor@brasileirao.com",
        password: hashedPassword,
        teamId: "palmeiras",
        userType: "FAN",
      });

      console.log("✓ Created fan user (email: torcedor@brasileirao.com, password: senha123)");
    } else {
      console.log("Fan user already exists, skipping...");
    }

    // Create Corinthians post by Maurinho Betting (only if approved)
    // Note: This post will only be created if Maurinho is APPROVED
    // In the initial seed, Maurinho is PENDING, so this won't run
    // After approving Maurinho via /api/admin/journalists/:userId, you can run this function
    const maurinhoUser = await db.select().from(users).where(eq(users.email, "maurinho@betting.dev")).limit(1);
    if (maurinhoUser.length > 0) {
      const maurinhoJournalist = await db.select().from(journalists).where(eq(journalists.userId, maurinhoUser[0].id)).limit(1);
      
      if (maurinhoJournalist.length > 0 && maurinhoJournalist[0].status === "APPROVED") {
        // Check if post already exists
        const existingPost = await db.select().from(news).where(eq(news.journalistId, maurinhoJournalist[0].id)).limit(1);
        
        if (existingPost.length === 0) {
          // Verify Corinthians team exists
          const corinthiansTeam = await db.select().from(teams).where(eq(teams.id, "corinthians")).limit(1);
          
          if (corinthiansTeam.length > 0) {
            await db.insert(news).values({
              journalistId: maurinhoJournalist[0].id,
              teamId: "corinthians",
              title: "Corinthians: análise tática do momento",
              content: `O Corinthians vive um momento importante na temporada, com o técnico buscando consolidar um estilo de jogo que combine solidez defensiva e eficiência ofensiva. A equipe tem mostrado evolução tática em campo, com os jogadores demonstrando maior entrosamento e compreensão do sistema de jogo proposto.

Nos últimos jogos, observamos uma melhora significativa na organização defensiva, com a linha de defesa trabalhando de forma mais coordenada. No meio-campo, a equipe tem conseguido controlar melhor o ritmo das partidas, alternando entre momentos de pressão alta e contenção estratégica.

A ofensiva também tem apresentado sinais positivos, com os atacantes criando mais oportunidades de gol e demonstrando maior objetividade nas finalizações. O trabalho em conjunto entre os setores tem sido fundamental para os resultados recentes.

Com a sequência de jogos pela frente, o Corinthians precisa manter essa consistência e continuar evoluindo taticamente para alcançar seus objetivos na competição.`,
              imageUrl: "https://picsum.photos/1200/630?random=corinthians",
              category: "ANALYSIS",
              isPublished: true,
            });
            
            console.log("✓ Created Corinthians post by Maurinho Betting");
          } else {
            console.log("⚠ Corinthians team not found, skipping post creation");
          }
        } else {
          console.log("Corinthians post already exists, skipping...");
        }
      } else {
        console.log("⚠ Maurinho Betting is not APPROVED yet. Post will be created after approval via admin endpoint.");
      }
    }

    // Seed sample players for each team
    const existingPlayers = await db.select().from(players);

    if (existingPlayers.length === 0) {
      console.log("Seeding sample players...");

      const positions = [
        "Goalkeeper",
        "Centre-Back",
        "Left-Back",
        "Right-Back",
        "Defensive Midfield",
        "Central Midfield",
        "Attacking Midfield",
        "Left Winger",
        "Right Winger",
        "Centre-Forward",
      ] as const;

      for (const team of TEAMS_DATA.slice(0, 5)) {
        // Add 11 players per team
        for (let i = 1; i <= 11; i++) {
          const position = positions[Math.floor(Math.random() * positions.length)];
          const day = String(Math.min(i, 28)).padStart(2, "0");

          await db.insert(players).values({
            teamId: team.id,
            name: `Jogador ${i} - ${team.shortName}`,
            position,
            shirtNumber: i,
            birthDate: `2000-01-${day}`,
            nationalityPrimary: "Brazil",
            nationalitySecondary: null,
            marketValueEur: null,
            fromClub: null,
          });
        }
      }

      console.log("✓ Seeded sample players for 5 teams");
    } else {
      console.log("Players already seeded, skipping...");
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed().then(() => {
  console.log("Seed complete!");
  process.exit(0);
}).catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});

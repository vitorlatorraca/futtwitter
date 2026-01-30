import { sql } from "drizzle-orm";
import { db } from "./db";
import { storage } from "./storage";
import { users } from "@shared/schema";

function requireDevOnly() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("ERRO: Este script só pode ser executado com NODE_ENV=development");
  }
}

const targetEmail = "vitorlatorraca5@gmail.com";

async function main() {
  requireDevOnly();

  const targetUser = await storage.getUserByEmail(targetEmail);
  if (!targetUser) {
    throw new Error(`ERRO: usuário alvo não existe no banco: ${targetEmail}`);
  }

  if (targetUser.userType === "ADMIN") {
    throw new Error(`ERRO: o usuário alvo é ADMIN (${targetUser.email}). Este script não altera ADMIN.`);
  }

  const before = await storage.getJournalist(targetUser.id);
  console.log("✅ Usuário alvo encontrado");
  console.log(`   - Nome: ${targetUser.name}`);
  console.log(`   - Email: ${targetUser.email}`);
  console.log(`   - userType atual: ${targetUser.userType}`);
  console.log(`   - journalistStatus anterior: ${before?.status ?? "null"}`);

  const result = await storage.approveJournalistByEmail(targetEmail);

  const afterUser = await storage.getUser(targetUser.id);
  const after = await storage.getJournalist(targetUser.id);

  console.log("\n✅ Promoção concluída");
  console.log(`   - status anterior: ${result.previousJournalistStatus ?? "null"}`);
  console.log(`   - status final: ${after?.status ?? "null"}`);
  console.log(`   - verificationDate: ${after?.verificationDate ? after.verificationDate.toISOString() : "null"}`);
  console.log(`   - userType final: ${afterUser?.userType ?? "null"}`);

  // Validação no banco via SQL (users.user_type, journalists.status, journalists.verification_date)
  const validation = await db.execute(sql`
    select
      u.email,
      u.name,
      u.user_type as "userType",
      j.status as "journalistStatus",
      j.verification_date as "verificationDate"
    from users u
    left join journalists j on j.user_id = u.id
    where lower(u.email) = lower(${targetEmail})
    limit 1;
  `);

  const row = (validation as any)?.rows?.[0];
  console.log("\n🔎 DB CHECK (SQL)");
  if (!row) {
    console.log("   - Nenhuma linha retornada para o email alvo (inesperado).");
  } else {
    console.log(`   - email: ${row.email}`);
    console.log(`   - name: ${row.name}`);
    console.log(`   - users.user_type: ${row.userType}`);
    console.log(`   - journalists.status: ${row.journalistStatus ?? "null"}`);
    console.log(`   - journalists.verification_date: ${row.verificationDate ?? "null"}`);
  }
}

main().catch((err) => {
  console.error("❌ Falha ao promover Vitor para jornalista:");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});


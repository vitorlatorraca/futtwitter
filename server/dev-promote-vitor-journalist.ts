import dotenv from "dotenv";
import { eq, ilike } from "drizzle-orm";
import { db } from "./db";
import { storage } from "./storage";
import { users } from "@shared/schema";

dotenv.config();

function requireDevOnly() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("ERRO: Este script só pode ser executado com NODE_ENV=development");
  }
}

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) {
    throw new Error("ERRO: ADMIN_EMAILS não está definido");
  }
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function getExecutorEmail(): string {
  return (process.env.EXECUTOR_EMAIL?.trim().toLowerCase() || "admin@futtwitter.dev").trim().toLowerCase();
}

async function getTargetEmail(): Promise<string> {
  const preferred = "vitor@futtwitter.dev";
  const [userByPreferred] = await db
    .select({ email: users.email })
    .from(users)
    .where(ilike(users.email, preferred))
    .limit(1);
  if (userByPreferred) return userByPreferred.email;

  const targetName = "Vitor Espindula da Rocha Latorraca";
  const matches = await db.select().from(users).where(eq(users.name, targetName));
  if (matches.length === 1) return matches[0].email;

  if (matches.length > 1) {
    throw new Error(
      `ERRO: múltiplos usuários com nome "${targetName}". Emails encontrados: ${matches
        .map((u) => u.email)
        .join(", ")}`
    );
  }

  throw new Error(
    `ERRO: usuário alvo não encontrado. Tente criar/usar o usuário com email "${preferred}" ou nome "${targetName}".`
  );
}

async function main() {
  requireDevOnly();

  const adminEmails = getAdminEmails();
  const executorEmail = getExecutorEmail();

  if (!adminEmails.includes(executorEmail)) {
    throw new Error(
      `ERRO: ADMIN_EMAILS não contém o executor (${executorEmail}). ADMIN_EMAILS atual: ${process.env.ADMIN_EMAILS}`
    );
  }

  const executor = await storage.getUserByEmail(executorEmail);
  if (!executor) {
    throw new Error(`ERRO: executor não existe no banco: ${executorEmail}`);
  }

  const executorIsAdmin = executor.userType === "ADMIN" || adminEmails.includes(executor.email.toLowerCase());
  if (!executorIsAdmin) {
    throw new Error(`ERRO: executor não é ADMIN: ${executor.email} (userType=${executor.userType})`);
  }

  console.log("✅ Executor validado (ADMIN)");
  console.log(`   - Email: ${executor.email}`);
  console.log(`   - userType: ${executor.userType}`);

  const targetEmail = await getTargetEmail();
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

  const result = await storage.approveJournalistByEmail(targetUser.email);

  const afterUser = await storage.getUser(targetUser.id);
  const after = await storage.getJournalist(targetUser.id);

  console.log("\n✅ Promoção concluída");
  console.log(`   - status anterior: ${result.previousJournalistStatus ?? "null"}`);
  console.log(`   - status final: ${after?.status ?? "null"}`);
  console.log(`   - verificationDate: ${after?.verificationDate ? after.verificationDate.toISOString() : "null"}`);
  console.log(`   - userType final: ${afterUser?.userType ?? "null"}`);
}

main().catch((err) => {
  console.error("❌ Falha ao promover Vitor para jornalista:");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});


import { storage } from "./storage";

const targetEmail = "chicomoedas@gmail.com";

async function main() {
  if (!targetEmail || targetEmail === "EMAIL_DO_CHICO_AQUI") {
    throw new Error("Configure targetEmail antes de rodar o script.");
  }

  const targetUser = await storage.getUserByEmail(targetEmail);
  if (!targetUser) {
    throw new Error(`Usuário não encontrado: ${targetEmail}`);
  }

  if (targetUser.userType === "ADMIN") {
    throw new Error(`Usuário é ADMIN — este script não altera ADMINs.`);
  }

  console.log(`✅ Usuário encontrado: ${targetUser.name} (${targetUser.email})`);
  console.log(`   userType atual: ${targetUser.userType}`);

  await storage.approveJournalistByEmail(targetEmail);

  const afterUser = await storage.getUser(targetUser.id);
  const afterJournalist = await storage.getJournalist(targetUser.id);

  console.log(`\n✅ Aprovação concluída!`);
  console.log(`   userType final: ${afterUser?.userType}`);
  console.log(`   journalistStatus: ${afterJournalist?.status}`);
  console.log(`   verificationDate: ${afterJournalist?.verificationDate}`);
}

main().catch((err) => {
  console.error("❌ Erro:", err instanceof Error ? err.message : err);
  process.exit(1);
});

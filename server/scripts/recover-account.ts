/**
 * recover-account.ts
 *
 * Restaura a conta do Vitor (jornalista principal) com o mesmo user_id
 * que os registros de journalists e news referenciam.
 *
 * Execução:
 *   npx tsx server/scripts/recover-account.ts
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import bcrypt from "bcrypt";

const db = drizzle(neon(process.env.DATABASE_URL!));

// ─── IDs originais (mantidos no banco) ───────────────────────────────────────
// Vitor (jornalista principal — autor das notícias)
const VITOR_USER_ID    = "f776ac8c-ed71-41a6-973e-b177903878cf";
const VITOR_JOURNALIST = "14fc12cf-a93d-46ac-88ae-af965144479b";

// Senha temporária — troque após o primeiro login
const TEMP_PASSWORD = "Futeapp@2026";

async function main() {
  console.log("🔧 Iniciando recuperação de conta...\n");

  // 1. Verifica se o usuário já existe (recuperação já foi feita)
  const existing = await db.execute(sql`
    SELECT id FROM users WHERE id = ${VITOR_USER_ID} LIMIT 1
  `);

  if (existing.rows.length > 0) {
    console.log("✅ Usuário já existe no banco. Nada a fazer.");
    return;
  }

  // 2. Cria hash da senha temporária
  const hash = await bcrypt.hash(TEMP_PASSWORD, 10);

  // 3. Insere o usuário com o MESMO ID que journalists referencia
  await db.execute(sql`
    INSERT INTO users (
      id,
      email,
      name,
      password,
      avatar_url,
      user_type,
      team_id,
      handle,
      bio,
      followers_count,
      following_count,
      created_at,
      updated_at
    ) VALUES (
      ${VITOR_USER_ID},
      'vitorlatorraca5@gmail.com',
      'Vitor Latorraca',
      ${hash},
      NULL,
      'JOURNALIST',
      'corinthians',
      'vitorlatorraca',
      'Jornalista e fundador do FuteApp 🦅',
      0,
      0,
      NOW(),
      NOW()
    )
  `);

  console.log("✅ Conta de Vitor restaurada!");
  console.log("   Email: vitorlatorraca5@gmail.com");
  console.log(`   Senha temporária: ${TEMP_PASSWORD}`);
  console.log("   Handle: @vitorlatorraca");
  console.log("   Tipo: JOURNALIST (já aprovado)");

  // 4. Confirma que o vínculo com journalist está OK
  const journalistCheck = await db.execute(sql`
    SELECT j.id, j.status, u.name
    FROM journalists j
    INNER JOIN users u ON j.user_id = u.id
    WHERE j.id = ${VITOR_JOURNALIST}
  `);

  if (journalistCheck.rows.length > 0) {
    const row = journalistCheck.rows[0] as any;
    console.log(`\n✅ Jornalista vinculado: ${row.name} (status: ${row.status})`);
  } else {
    console.log("\n⚠️  Jornalista não encontrado após restauração — verifique manualmente.");
  }

  // 5. Conta as notícias que voltam a funcionar
  const newsCount = await db.execute(sql`
    SELECT COUNT(*) as total
    FROM news n
    INNER JOIN journalists j ON n.journalist_id = j.id
    INNER JOIN users u ON j.user_id = u.id
    WHERE n.is_published = true
  `);
  const total = (newsCount.rows[0] as any).total;
  console.log(`\n✅ Notícias que voltam a aparecer no feed: ${total}`);

  console.log("\n🎉 Recuperação concluída!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Faça login com:");
  console.log("  Email: vitorlatorraca5@gmail.com");
  console.log(`  Senha: ${TEMP_PASSWORD}`);
  console.log("  (troque a senha após o primeiro login)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch((err) => {
  console.error("❌ Erro na recuperação:", err);
  process.exit(1);
});

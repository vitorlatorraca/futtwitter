import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * Gera um handle único baseado no nome do usuário.
 * Remove acentos, espaços → underscores, mantém só a-z0-9_.
 * Se já existe, adiciona sufixo _2, _3...
 */
export async function generateUniqueHandle(name: string): Promise<string> {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 25);

  const candidate = base || "user";

  // Testa candidato base
  const exists = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.handle, candidate))
    .limit(1);
  if (!exists.length) return candidate;

  // Tenta sufixos numéricos
  for (let i = 2; i <= 9999; i++) {
    const withSuffix = `${candidate}_${i}`;
    const existsSuffix = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.handle, withSuffix))
      .limit(1);
    if (!existsSuffix.length) return withSuffix;
  }

  // Fallback: uuid curto
  return `user_${Date.now().toString(36)}`;
}

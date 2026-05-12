import "dotenv/config";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq, isNull } from "drizzle-orm";
import { generateUniqueHandle } from "../utils/handleUtils";

async function main() {
  const usersWithoutHandle = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(isNull(users.handle));

  console.log(`Found ${usersWithoutHandle.length} users without handle.`);

  for (const u of usersWithoutHandle) {
    const handle = await generateUniqueHandle(u.name);
    await db.update(users).set({ handle, updatedAt: new Date() }).where(eq(users.id, u.id));
    console.log(`  ${u.name} → @${handle}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

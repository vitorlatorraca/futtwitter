import type { Express } from "express";
import { randomBytes } from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AVATARS_DIR = path.resolve(__dirname, "..", "uploads", "avatars");

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_AVATAR_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

function getSafeUniqueFilename(ext: string): string {
  const safeExt = ext.startsWith(".") ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
  const ts = Date.now();
  const rnd = randomBytes(8).toString("hex");
  return `avatar_${ts}_${rnd}${safeExt}`;
}

function stripQueryAndHash(url: string): string {
  return url.split("?")[0].split("#")[0];
}

export async function saveAvatar(
  file: Express.Multer.File,
): Promise<{ avatarUrl: string; filePath: string }> {
  const mime = String(file?.mimetype || "").toLowerCase();
  if (!ALLOWED_AVATAR_MIME_TYPES.has(mime)) {
    throw new Error("Tipo inválido. Envie uma imagem (jpeg, png ou webp).");
  }

  const size = typeof file?.size === "number" ? file.size : file?.buffer?.length ?? 0;
  if (!Number.isFinite(size) || size <= 0) {
    throw new Error("Arquivo inválido (vazio).");
  }
  if (size > MAX_AVATAR_BYTES) {
    throw new Error("Arquivo muito grande. Tamanho máximo: 2MB.");
  }

  const ext = MIME_TO_EXT[mime];
  if (!ext) {
    // Guardrail (should never happen with the allowed set)
    throw new Error("Tipo inválido. Envie uma imagem (jpeg, png ou webp).");
  }

  if (!file?.buffer || !(file.buffer instanceof Buffer)) {
    throw new Error("Arquivo inválido (sem buffer).");
  }

  await fs.mkdir(AVATARS_DIR, { recursive: true });

  const filename = getSafeUniqueFilename(ext);
  const filePath = path.join(AVATARS_DIR, filename);
  await fs.writeFile(filePath, file.buffer);

  return {
    avatarUrl: `/uploads/avatars/${filename}`,
    filePath,
  };
}

export async function deleteAvatarByUrl(avatarUrl: string | null): Promise<void> {
  if (!avatarUrl) return;

  const cleaned = stripQueryAndHash(String(avatarUrl));
  const normalized = path.posix.normalize(cleaned);
  const prefix = "/uploads/avatars/";

  // Only allow deleting files under /uploads/avatars/
  if (!normalized.startsWith(prefix)) return;

  const rel = normalized.slice(prefix.length);
  // Disallow nested paths: filename must be a single segment
  if (!rel || rel.includes("/")) return;

  await fs.mkdir(AVATARS_DIR, { recursive: true });

  const candidate = path.resolve(AVATARS_DIR, rel);
  const relative = path.relative(AVATARS_DIR, candidate);
  // Path traversal protection: must remain inside AVATARS_DIR
  if (relative.startsWith("..") || path.isAbsolute(relative)) return;

  try {
    await fs.unlink(candidate);
  } catch (err: any) {
    if (err?.code === "ENOENT") return;
    throw err;
  }
}

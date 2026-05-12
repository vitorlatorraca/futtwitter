import React, { useState, useRef, useEffect, useMemo } from "react";
import { Image as ImageIcon, X, BarChart3, Trophy, Hash } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useAuth } from "../../lib/auth-context";
import { useCreatePost } from "../../hooks/usePosts";
import { getApiUrl } from "../../lib/queryClient";
import { avatarFallback } from "../../utils/postTransforms";
import { TEAMS_DATA } from "../../lib/team-data";
import type { Post } from "../../store/useAppStore";

interface ComposeBoxProps {
  onPost?: (post: Post) => void;
  placeholder?: string;
  replyTo?: string;
  autoFocus?: boolean;
}

const DRAFT_KEY = "futtwitter:compose_draft";
const CHAR_LIMIT = 280;

/**
 * Tribuna Compose Post card per design_handoff_tribuna_rebrand/README.md
 * ("Components → b").
 *
 *   ┌───────────────────────────────────────────────────────────────┐
 *   │  ⊙48                                                          │
 *   │      Poste para sua [torcida]… o que rolou no jogo de hoje?    │
 *   │      ┌─ optional image preview ───┐                            │
 *   │      └────────────────────────────┘                            │
 *   │ ─────────────────────────── line ───────────────────────────── │
 *   │  📷 📊 🏆 #   [Marcar Corinthians]    208 / 280  ◔  [Postar →] │
 *   └───────────────────────────────────────────────────────────────┘
 *
 * - 48×48 user avatar
 * - Placeholder Geist 18 with "torcida" highlighted in --floodlight, weight 500
 *   (achieved by splitting the rendered placeholder into <span>s; the actual
 *   <textarea> placeholder is the plain fallback that only shows when empty
 *   AND focused-without-text scenarios, since we layer a custom span layer)
 * - Toolbar tools (36×36 ghost): image (works), poll/scoreboard/hashtag (stub
 *   — show "Em breve" toast; spec UI is here, behavior follows in later steps)
 * - "Marcar <team>" pill: dashed line-2 border + crest 12px + 13/500 ink text;
 *   solid line-2 border on hover
 * - Counter "208 / 280" JBM 11 — appears as user types
 * - 28px conic char ring: --line track, --ink progress, paper hole
 * - Primary CTA: --ink bg, --paper text, full radius, 10×22 padding, Geist 14/600,
 *   "Postar →" with arrow in --floodlight
 */
export default function ComposeBox({
  onPost,
  placeholder = "Poste para sua torcida… o que rolou no jogo de hoje?",
  replyTo,
  autoFocus,
}: ComposeBoxProps) {
  const { currentUser, addPost, showToast } = useAppStore();
  const { user: authUser } = useAuth();
  const createPost = useCreatePost();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Persist drafts for root posts only — replies stay ephemeral.
  const draftKey = replyTo ? null : DRAFT_KEY;

  const [text, setText] = useState<string>(() => {
    if (!draftKey) return "";
    try {
      return localStorage.getItem(draftKey) ?? "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    if (!draftKey) return;
    try {
      if (text) localStorage.setItem(draftKey, text);
      else localStorage.removeItem(draftKey);
    } catch {
      /* storage unavailable */
    }
  }, [text, draftKey]);

  // Restore textarea height when there's an existing draft on mount
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta && text) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayUser = authUser
    ? {
        id: authUser.id,
        displayName: authUser.name,
        handle: authUser.handle ?? "user",
        avatar: authUser.avatarUrl ?? "",
        teamId: authUser.teamId,
      }
    : (currentUser
        ? { ...currentUser, teamId: null as string | null }
        : { id: "anon", displayName: "Usuário", handle: "user", avatar: "", teamId: null });

  const userTeam = useMemo(
    () => (displayUser.teamId ? TEAMS_DATA.find((t) => t.id === displayUser.teamId) ?? null : null),
    [displayUser.teamId],
  );

  const remaining = CHAR_LIMIT - text.length;
  const progress = Math.min(text.length / CHAR_LIMIT, 1);
  const overLimit = remaining < 0;
  const isSubmitting = createPost.isPending;

  const clearForm = () => {
    setText("");
    setImageUrl(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    if (draftKey) {
      try { localStorage.removeItem(draftKey); } catch { /* noop */ }
    }
  };

  const canPost = (!!text.trim() || !!imageUrl) && !overLimit && !isSubmitting;

  const handleSubmit = async () => {
    if (!canPost) return;

    if (authUser) {
      try {
        await createPost.mutateAsync({
          content: text.trim(),
          imageUrl: imageUrl || undefined,
          parentPostId: replyTo,
        });
        clearForm();
        showToast("Post publicado!");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Erro ao publicar. Tente novamente.");
      }
      return;
    }

    // Local-only fallback (no auth)
    if (!currentUser) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: currentUser,
      text: text.trim(),
      timestamp: new Date(),
      images: [],
      liked: false,
      reposted: false,
      bookmarked: false,
      likes: 0,
      reposts: 0,
      replies: 0,
      views: 0,
      parentId: replyTo,
    };
    addPost(newPost);
    onPost?.(newPost);
    clearForm();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authUser) return;
    const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
    const mime = (file.type || "").toLowerCase();
    if (!allowed.has(mime)) {
      showToast(
        mime === "image/heic" || mime === "image/heif"
          ? "HEIC não é suportado. Converta para JPG ou PNG."
          : "Use JPG, PNG, WebP ou GIF (máx. 5MB).",
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Imagem muito grande. Máximo 5MB.");
      return;
    }
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(getApiUrl("/api/uploads/post-image"), {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(errData.message || "Erro ao enviar imagem");
      }
      const data = await res.json() as { imageUrl: string };
      setImageUrl(data.imageUrl);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Erro ao enviar imagem");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleInsertHashtag = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const cursor = ta.selectionStart ?? text.length;
    const before = text.slice(0, cursor);
    const after = text.slice(cursor);
    const needsSpace = before.length > 0 && !/\s$/.test(before);
    const insertion = (needsSpace ? " " : "") + "#";
    const next = before + insertion + after;
    setText(next);
    requestAnimationFrame(() => {
      ta.focus();
      const newPos = cursor + insertion.length;
      ta.setSelectionRange(newPos, newPos);
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    });
  };

  const circumference = 2 * Math.PI * 10; // r=10 in a 24×24 viewBox
  const strokeDashoffset = circumference * (1 - progress);
  const avatarSrc = displayUser.avatar || avatarFallback(displayUser.displayName);

  // Split the placeholder so "torcida" highlights in --floodlight, weight 500.
  // Layered behind the textarea — visible only while the field is empty.
  const renderPlaceholderOverlay = () => {
    if (text.length > 0) return null;
    const parts = placeholder.split(/(\btorcida\b)/i);
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 px-0 py-3 text-[18px] leading-[1.5] text-slate"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {parts.map((part, i) =>
          /^torcida$/i.test(part) ? (
            <span key={i} className="text-floodlight font-medium not-italic">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </div>
    );
  };

  const stubAction = (label: string) => () => showToast(`${label} — em breve`);

  return (
    <div className="flex gap-4 px-5 pt-4 pb-3">
      {/* Avatar 48×48 */}
      <img
        src={avatarSrc}
        alt={displayUser.displayName}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = avatarFallback(displayUser.displayName);
        }}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        {/* Textarea + placeholder overlay */}
        <div className="relative">
          {renderPlaceholderOverlay()}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={text.length > 0 ? "" : " "}
            autoFocus={autoFocus}
            className="w-full bg-transparent text-[18px] leading-[1.5] text-ink outline-none resize-none min-h-[52px] py-3 relative"
            rows={1}
            aria-label="Escrever post"
          />
        </div>

        {/* Image preview */}
        {imageUrl && (
          <div className="relative mt-2 rounded-r-3 overflow-hidden border border-line">
            <img
              src={imageUrl.startsWith("/") ? getApiUrl(imageUrl) : imageUrl}
              alt="Preview da imagem"
              className="max-h-[280px] w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-ink/70 hover:bg-ink/85 transition-colors"
              aria-label="Remover imagem"
            >
              <X className="w-4 h-4 text-paper stroke-[1.75]" />
            </button>
          </div>
        )}

        {/* ── Bottom toolbar (separator above is --line 1px) ─────────────── */}
        <div className="flex items-center justify-between gap-3 border-t border-line mt-3 pt-2.5">
          {/* Tools left + Marcar team pill */}
          <div className="flex items-center gap-1.5 -ml-2 flex-1 min-w-0">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              aria-label="Escolher imagem para o post"
              onChange={handleImageSelect}
              disabled={uploadingImage}
            />

            {/* Image */}
            <button
              type="button"
              onClick={() => {
                if (!authUser) {
                  showToast("Faça login para anexar imagens ao post.");
                  return;
                }
                imageInputRef.current?.click();
              }}
              disabled={uploadingImage}
              className="h-9 w-9 rounded-full flex items-center justify-center text-ink-3 hover:bg-paper-2 hover:text-floodlight transition-colors disabled:opacity-40"
              aria-label={uploadingImage ? "Enviando imagem..." : "Adicionar imagem"}
              title="Adicionar imagem"
            >
              <ImageIcon className="w-[18px] h-[18px] stroke-[1.75]" />
            </button>

            {/* Poll (stub) */}
            <button
              type="button"
              onClick={stubAction("Enquete")}
              className="h-9 w-9 rounded-full flex items-center justify-center text-ink-3 hover:bg-paper-2 hover:text-floodlight transition-colors"
              aria-label="Adicionar enquete"
              title="Enquete (em breve)"
            >
              <BarChart3 className="w-[18px] h-[18px] stroke-[1.75]" />
            </button>

            {/* Scoreboard (stub) */}
            <button
              type="button"
              onClick={stubAction("Placar")}
              className="h-9 w-9 rounded-full flex items-center justify-center text-ink-3 hover:bg-paper-2 hover:text-floodlight transition-colors"
              aria-label="Inserir placar"
              title="Placar (em breve)"
            >
              <Trophy className="w-[18px] h-[18px] stroke-[1.75]" />
            </button>

            {/* Hashtag — inserts # at cursor */}
            <button
              type="button"
              onClick={handleInsertHashtag}
              className="h-9 w-9 rounded-full flex items-center justify-center text-ink-3 hover:bg-paper-2 hover:text-floodlight transition-colors"
              aria-label="Inserir hashtag"
              title="Inserir hashtag"
            >
              <Hash className="w-[18px] h-[18px] stroke-[1.75]" />
            </button>

            {/* "Marcar <team>" pill — dashed line-2 → solid line-2 on hover */}
            {userTeam && (
              <button
                type="button"
                className="group ml-1 inline-flex items-center gap-1.5 h-7 pl-1.5 pr-3 rounded-full border border-dashed border-line-2 hover:border-solid hover:bg-paper-2 transition-colors text-[13px] text-ink"
                style={{ fontWeight: 500 }}
                aria-label={`Marcar ${userTeam.name}`}
                title={`Marcar ${userTeam.name}`}
              >
                <img
                  src={userTeam.logoUrl}
                  alt=""
                  className="w-3 h-3 object-contain flex-shrink-0"
                  loading="lazy"
                />
                <span className="truncate">Marcar {userTeam.name}</span>
              </button>
            )}
          </div>

          {/* Meta right: counter · ring · CTA */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {text.length > 0 && (
              <>
                <span
                  className={`hidden sm:inline-block font-mono text-[11px] tabular-nums ${
                    overLimit ? "text-error" : remaining <= 20 ? "text-warning" : "text-slate"
                  }`}
                >
                  {text.length} / {CHAR_LIMIT}
                </span>
                {/* 28px char ring (24-viewBox, scaled up) */}
                <div
                  className="relative w-7 h-7"
                  aria-label={`${remaining} caracteres restantes`}
                >
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="var(--line)" strokeWidth="2" />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke={
                        overLimit
                          ? "var(--error)"
                          : remaining <= 20
                            ? "var(--warning)"
                            : "var(--ink)"
                      }
                      strokeWidth="2"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  {remaining <= 20 && (
                    <span
                      className={`absolute inset-0 flex items-center justify-center font-mono text-[10px] ${
                        overLimit ? "text-error" : "text-slate"
                      }`}
                      style={{ fontWeight: 500 }}
                    >
                      {remaining}
                    </span>
                  )}
                </div>
              </>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canPost}
              title="Postar (Ctrl+Enter)"
              className="inline-flex items-center gap-1.5 bg-ink hover:bg-ink-2 disabled:opacity-40 disabled:cursor-not-allowed text-paper rounded-full px-5 py-2.5 transition-colors shadow-elev-1"
              style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600 }}
            >
              {isSubmitting ? (
                <>Postando…</>
              ) : (
                <>
                  Postar
                  <span aria-hidden="true" className="text-floodlight">
                    →
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

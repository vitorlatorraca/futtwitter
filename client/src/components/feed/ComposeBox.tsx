import React, { useState, useRef, useEffect } from "react";
import { Image, X } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useAuth } from "../../lib/auth-context";
import { useCreatePost } from "../../hooks/usePosts";
import { getApiUrl } from "../../lib/queryClient";
import { avatarFallback } from "../../utils/postTransforms";
import type { Post } from "../../store/useAppStore";

interface ComposeBoxProps {
  onPost?: (post: Post) => void;
  placeholder?: string;
  replyTo?: string;
  autoFocus?: boolean;
}

const DRAFT_KEY = "futtwitter:compose_draft";

export default function ComposeBox({
  onPost,
  placeholder = "O que está acontecendo no futebol?",
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

  // Rascunho — só persiste posts raiz (não replies)
  const draftKey = replyTo ? null : DRAFT_KEY;

  const [text, setText] = useState<string>(() => {
    if (!draftKey) return "";
    try {
      return localStorage.getItem(draftKey) ?? "";
    } catch {
      return "";
    }
  });

  // Salva rascunho em tempo real
  useEffect(() => {
    if (!draftKey) return;
    try {
      if (text) {
        localStorage.setItem(draftKey, text);
      } else {
        localStorage.removeItem(draftKey);
      }
    } catch {
      /* storage indisponível */
    }
  }, [text, draftKey]);

  // Ajusta altura do textarea ao montar (se havia rascunho)
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
      }
    : (currentUser ?? {
        id: "anon",
        displayName: "Usuário",
        handle: "user",
        avatar: "",
      });

  const charLimit = 280;
  const remaining = charLimit - text.length;
  const progress = Math.min(text.length / charLimit, 1);
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

  const handleSubmit = async () => {
    if (!text.trim() || overLimit || isSubmitting) return;

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

    // Modo offline / sem login
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
    // Ctrl+Enter / Cmd+Enter para postar
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authUser) return;
    if (!file.type.startsWith("image/")) {
      showToast("Selecione uma imagem (JPG, PNG ou GIF)");
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

  const circumference = 2 * Math.PI * 10;
  const strokeDashoffset = circumference * (1 - progress);
  const avatarSrc = displayUser.avatar || avatarFallback(displayUser.displayName);

  return (
    <div className="flex px-4 pt-3 pb-2">
      <img
        src={avatarSrc}
        alt={displayUser.displayName}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = avatarFallback(displayUser.displayName); }}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1"
      />
      <div className="flex-1 ml-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent text-xl text-x-text-primary placeholder-x-text-secondary outline-none resize-none min-h-[52px] py-3"
          rows={1}
          aria-label="Escrever post"
        />

        {imageUrl && (
          <div className="relative mt-2 rounded-2xl overflow-hidden border border-x-border">
            <img
              src={imageUrl.startsWith("/") ? getApiUrl(imageUrl) : imageUrl}
              alt="Preview da imagem"
              className="max-h-[280px] w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
              aria-label="Remover imagem"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-x-border pt-3 pb-1">
          {/* Toolbar — só o botão de imagem está implementado */}
          <div className="flex items-center gap-1 -ml-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
              disabled={uploadingImage}
            />
            <button
              type="button"
              onClick={() => authUser && imageInputRef.current?.click()}
              disabled={uploadingImage || !authUser}
              className="p-2 rounded-full hover:bg-[rgba(29,155,240,0.1)] transition-colors disabled:opacity-40"
              aria-label={uploadingImage ? "Enviando imagem..." : "Adicionar imagem"}
              title="Adicionar imagem"
            >
              <Image className="w-5 h-5 text-x-accent" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Contador circular — aparece quando está digitando */}
            {text.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="relative w-[30px] h-[30px]" aria-label={`${remaining} caracteres restantes`}>
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="#2f3336" strokeWidth="2" />
                    <circle
                      cx="12" cy="12" r="10" fill="none"
                      stroke={overLimit ? "#f4212e" : remaining <= 20 ? "#ffd400" : "#1a56db"}
                      strokeWidth="2"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  {remaining <= 20 && (
                    <span className={`absolute inset-0 flex items-center justify-center text-[11px] font-medium ${overLimit ? "text-[#f4212e]" : "text-x-text-secondary"}`}>
                      {remaining}
                    </span>
                  )}
                </div>
                <div className="w-px h-[30px] bg-x-border" />
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!text.trim() || overLimit || isSubmitting}
              title="Postar (Ctrl+Enter)"
              className="brand-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[15px] rounded-full px-4 py-1.5 transition-opacity"
            >
              {isSubmitting ? "Postando…" : "Postar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

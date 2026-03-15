import React, { useState, useRef } from "react";
import { Image, FileVideo, BarChart3, Smile, CalendarClock, MapPin, X } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useAuth } from "../../lib/auth-context";
import { useCreatePost } from "../../hooks/usePosts";
import { getApiUrl } from "../../lib/queryClient";
import type { Post } from "../../store/useAppStore";

interface ComposeBoxProps {
  onPost?: (post: Post) => void;
  placeholder?: string;
  replyTo?: string;
  autoFocus?: boolean;
}

export default function ComposeBox({ onPost, placeholder = "O que está acontecendo no futebol?", replyTo, autoFocus }: ComposeBoxProps) {
  const { currentUser, addPost, showToast } = useAppStore();
  const { user: authUser } = useAuth();
  const createPost = useCreatePost();
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSubmit = async () => {
    if (!text.trim() || overLimit || isSubmitting) return;

    if (authUser) {
      try {
        await createPost.mutateAsync({
          content: text.trim(),
          imageUrl: imageUrl || undefined,
          parentPostId: replyTo,
        });
        setText("");
        setImageUrl(null);
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        showToast("Post publicado!");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Erro ao publicar");
      }
      return;
    }

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
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
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
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao enviar imagem");
      }
      const data = await res.json();
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

  const toolbarIcons = [
    {
      icon: Image,
      label: "Media",
      onClick: authUser
        ? () => imageInputRef.current?.click()
        : undefined,
    },
    { icon: FileVideo, label: "GIF" },
    { icon: BarChart3, label: "Poll" },
    { icon: Smile, label: "Emoji" },
    { icon: CalendarClock, label: "Schedule" },
    { icon: MapPin, label: "Location" },
  ];

  return (
    <div className="flex px-4 pt-3 pb-2">
      <img
        src={displayUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
        alt={displayUser.displayName}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1"
      />
      <div className="flex-1 ml-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent text-xl text-x-text-primary placeholder-x-text-secondary outline-none resize-none min-h-[52px] py-3"
          rows={1}
        />
        {imageUrl && (
          <div className="relative mt-2 rounded-2xl overflow-hidden border border-x-border">
            <img
              src={imageUrl.startsWith("/") ? getApiUrl(imageUrl) : imageUrl}
              alt="Preview"
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
          <div className="flex items-center gap-1 -ml-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
              disabled={uploadingImage}
            />
            {toolbarIcons.map(({ icon: Icon, label, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                disabled={label === "Media" && uploadingImage}
                className="p-2 rounded-full hover:bg-[rgba(29,155,240,0.1)] transition-colors disabled:opacity-50"
                aria-label={label}
              >
                <Icon className="w-5 h-5 text-x-accent" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {text.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="relative w-[30px] h-[30px]">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12" cy="12" r="10"
                      fill="none"
                      stroke="#2f3336"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12" cy="12" r="10"
                      fill="none"
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
              onClick={() => handleSubmit()}
              disabled={!text.trim() || overLimit || isSubmitting}
              className="brand-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[15px] rounded-full px-4 py-1.5 transition-opacity"
            >
              {isSubmitting ? "Postando..." : "Postar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

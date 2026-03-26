import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNewsDetail } from "@/hooks/useFeed";
import { getApiUrl, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string; avatarUrl: string | null };
  likeCount: number;
  viewerHasLiked: boolean;
}

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: news, isLoading, isError, error } = useNewsDetail(id);
  const [newCommentText, setNewCommentText] = useState("");

  const commentsQuery = useQuery<CommentItem[]>({
    queryKey: ["news", id, "comments"],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/news/${id}/comments`), {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao carregar comentários");
      return res.json();
    },
    enabled: !!id,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", `/api/news/${id}/comments`, {
        content,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news", id, "comments"] });
      setNewCommentText("");
      toast({ title: "Comentário publicado!" });
    },
    onError: (err: Error) => {
      const msg =
        err?.message?.includes("403") || err?.message?.includes("mesmo time")
          ? "Apenas torcedores do mesmo time podem comentar."
          : err?.message ?? "Erro ao publicar comentário";
      toast({ variant: "destructive", title: "Erro ao comentar", description: msg });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCommentText.trim();
    if (!trimmed || createCommentMutation.isPending) return;
    createCommentMutation.mutate(trimmed);
  };

  if (isLoading || !id) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-x-accent animate-spin" />
      </div>
    );
  }

  if (isError || !news) {
    return (
      <div className="py-16 px-4 text-center">
        <p className="text-red-400 mb-4">{error?.message ?? "Notícia não encontrada."}</p>
        <button
          onClick={() => navigate("/")}
          className="text-x-accent hover:underline"
        >
          Voltar ao feed
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto border-x border-x-border min-h-screen">
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur border-b border-x-border px-4 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-[rgba(231,233,234,0.1)] transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-[17px] font-bold">Notícia</span>
      </header>

      <article className="px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          {news.journalist.avatarUrl ? (
            <img
              src={news.journalist.avatarUrl}
              alt={news.journalist.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: "var(--x-accent)" }}
            >
              {(news.journalist.name || "A")
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
          )}
          <div>
            <p className="font-bold text-[15px]">{news.journalist.name}</p>
            <p className="text-[14px] text-x-text-secondary">
              @{news.journalist.handle} ·{" "}
              {format(new Date(news.publishedAt), "d MMM yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>

        <h1 className="text-[22px] font-extrabold leading-tight mb-4">
          {news.title}
        </h1>

        {news.imageUrl && (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full rounded-2xl object-cover max-h-[400px] mb-6"
          />
        )}

        <div className="text-[15px] leading-6 whitespace-pre-wrap">
          {news.content}
        </div>

        {news.team && (
          <div className="mt-6 flex items-center gap-2">
            {news.team.badgeUrl && (
              <img
                src={news.team.badgeUrl}
                alt={news.team.name}
                className="w-8 h-8 object-contain"
              />
            )}
            <span className="text-[14px] text-x-text-secondary">
              {news.team.name}
            </span>
          </div>
        )}
      </article>

      {/* Comments */}
      <section className="border-t border-x-border px-4 py-6">
        <h2 className="text-[17px] font-bold mb-4">Comentários</h2>

        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Escreva um comentário..."
            className="w-full px-4 py-3 bg-transparent border border-x-border rounded-2xl text-[15px] placeholder-x-text-secondary resize-none focus:outline-none focus:border-x-accent"
            rows={3}
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={!newCommentText.trim() || createCommentMutation.isPending}
            className="mt-3 px-4 py-2 bg-x-accent text-white font-bold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createCommentMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin inline" />
            ) : (
              "Publicar"
            )}
          </button>
        </form>

        <div className="space-y-4">
          {commentsQuery.isLoading ? (
            <p className="text-x-text-secondary text-[14px]">Carregando comentários...</p>
          ) : (commentsQuery.data ?? []).length === 0 ? (
            <p className="text-x-text-secondary text-[14px]">
              Nenhum comentário ainda. Seja o primeiro!
            </p>
          ) : (
            (commentsQuery.data ?? []).map((c) => (
              <div
                key={c.id}
                className="flex gap-3 py-3 border-b border-x-border last:border-0"
              >
                {c.author.avatarUrl ? (
                  <img
                    src={c.author.avatarUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-x-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {(c.author.name || "?").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[15px]">{c.author.name}</p>
                  <p className="text-[15px] whitespace-pre-wrap">{c.content}</p>
                  <p className="text-[13px] text-x-text-secondary mt-1">
                    {c.likeCount > 0 && `${c.likeCount} curtida${c.likeCount !== 1 ? "s" : ""} · `}
                    {format(new Date(c.createdAt), "d MMM", { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

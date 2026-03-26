import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { usePost, postFeedItemToPost } from "../hooks/usePosts";
import PostCard from "../components/feed/PostCard";
import PostSkeleton from "../components/feed/PostSkeleton";
import ComposeBox from "../components/feed/ComposeBox";
import TweetActions from "../components/feed/TweetActions";
import MediaGrid from "../components/feed/MediaGrid";
import LinkPreview from "../components/feed/LinkPreview";
import { formatFullDate } from "../utils/formatDate";
import { formatNumber, parsePostText } from "../utils/parseText";
import { avatarFallback } from "../utils/postTransforms";

const VerifiedBadge = () => (
  <svg viewBox="0 0 22 22" className="w-5 h-5 fill-x-accent inline-block flex-shrink-0">
    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.272 1.895.143.634-.131 1.218-.437 1.687-.883.445-.47.751-1.054.882-1.69.132-.632.083-1.289-.139-1.896.586-.274 1.084-.705 1.438-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
  </svg>
);

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = usePost(id);

  const post = data ? postFeedItemToPost(data) : null;
  const replies = (data?.replies ?? []).map(postFeedItemToPost);

  /* ── Loading ─────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div>
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px]">
          <button onClick={() => navigate(-1)} className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Post</h1>
        </div>
        <div className="px-4 pt-6 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-x-accent" />
        </div>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  /* ── Error / Not found ───────────────────────────────────────── */
  if (isError || !post) {
    const msg = error instanceof Error ? error.message : "Post não encontrado";
    return (
      <div>
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px]">
          <button onClick={() => navigate(-1)} className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Post</h1>
        </div>
        <div className="py-16 text-center px-4">
          <h2 className="text-xl font-bold">Post não encontrado</h2>
          <p className="text-x-text-secondary mt-2 text-sm">{msg}</p>
          <button onClick={() => navigate("/")} className="mt-4 text-x-accent hover:underline text-sm">
            Voltar para o início
          </button>
        </div>
      </div>
    );
  }

  /* ── Content ─────────────────────────────────────────────────── */
  const textParts = parsePostText(post.text);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px]">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)] transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Post</h1>
      </div>

      {/* Post principal */}
      <article className="px-4 pt-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar || avatarFallback(post.author.displayName)}
            alt={post.author.displayName}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = avatarFallback(post.author.displayName); }}
            className="w-10 h-10 rounded-full object-cover cursor-pointer flex-shrink-0"
            onClick={() => navigate(`/profile/${post.author.handle}`)}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <span
                className="font-bold text-[15px] hover:underline cursor-pointer"
                onClick={() => navigate(`/profile/${post.author.handle}`)}
              >
                {post.author.displayName}
              </span>
              {post.author.verified && <VerifiedBadge />}
            </div>
            <p className="text-[15px] text-x-text-secondary">@{post.author.handle}</p>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-[17px] leading-6 whitespace-pre-wrap break-words">
            {textParts.map((part, i) => {
              if (part.type === "hashtag" || part.type === "mention") {
                return (
                  <span key={i} className="text-x-accent hover:underline cursor-pointer">
                    {part.content}
                  </span>
                );
              }
              if (part.type === "url") {
                return (
                  <a key={i} href={part.content} target="_blank" rel="noopener noreferrer" className="text-x-accent hover:underline">
                    {part.content}
                  </a>
                );
              }
              return <span key={i}>{part.content}</span>;
            })}
          </p>
        </div>

        <MediaGrid images={post.images} />

        {post.linkPreview && (
          <LinkPreview
            url={post.linkPreview.url}
            title={post.linkPreview.title}
            description={post.linkPreview.description}
            image={post.linkPreview.image}
            domain={post.linkPreview.domain}
          />
        )}

        {post.quotedPost && <PostCard post={post.quotedPost} isQuoted />}

        <div className="py-4 border-b border-x-border">
          <time className="text-[15px] text-x-text-secondary">{formatFullDate(post.timestamp)}</time>
        </div>

        {/* Counters */}
        {(post.reposts > 0 || post.likes > 0 || post.views > 0) && (
          <div className="py-3 flex gap-5 border-b border-x-border text-[14px]">
            {post.reposts > 0 && (
              <span>
                <strong>{formatNumber(post.reposts)}</strong>{" "}
                <span className="text-x-text-secondary">Reposts</span>
              </span>
            )}
            {post.likes > 0 && (
              <span>
                <strong>{formatNumber(post.likes)}</strong>{" "}
                <span className="text-x-text-secondary">Curtidas</span>
              </span>
            )}
            {post.views > 0 && (
              <span>
                <strong>{formatNumber(post.views)}</strong>{" "}
                <span className="text-x-text-secondary">Visualizações</span>
              </span>
            )}
          </div>
        )}

        <div className="border-b border-x-border py-1">
          <TweetActions post={post} />
        </div>
      </article>

      {/* Compose reply */}
      <div className="border-b border-x-border">
        <ComposeBox
          placeholder={`Responder para @${post.author.handle}`}
          replyTo={post.id}
        />
      </div>

      {/* Replies */}
      {replies.length > 0 ? (
        replies.map((reply) => <PostCard key={reply.id} post={reply} />)
      ) : (
        <div className="py-10 text-center text-x-text-secondary text-sm">
          Nenhuma resposta ainda. Seja o primeiro!
        </div>
      )}
    </div>
  );
}

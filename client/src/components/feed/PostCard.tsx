import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, UserMinus, VolumeX, Ban, Flag, Code, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Post } from "../../store/useAppStore";
import { formatTimestamp } from "../../utils/formatDate";
import { parsePostText } from "../../utils/parseText";
import MediaGrid from "./MediaGrid";
import LinkPreview from "./LinkPreview";
import TweetActions from "./TweetActions";

function getInitials(name: string): string {
  return (name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface PostCardProps {
  post: Post;
  isQuoted?: boolean;
  /** Override navigation destination (e.g. /news/:id for news posts) */
  navigateTo?: string;
  /** Custom like handler for API-backed posts. Receives id and current liked state for toggle. */
  onLike?: (id: string, currentlyLiked: boolean) => void;
  /** Custom bookmark handler for API-backed posts. */
  onBookmark?: (id: string) => void;
}

/**
 * Verified badge per Tribuna spec: 8-point star in --floodlight with a white
 * check, 14px. Sports/editorial credibility marker — not the Twitter blue tick.
 *
 * The path is one polygon with 16 points (8 outer at r=11, 8 inner at r=5.5),
 * centered at (12,12). White check sits on top.
 */
const VerifiedBadge = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-[14px] h-[14px] inline-block flex-shrink-0 ml-0.5"
    aria-label="Conta verificada"
  >
    <polygon
      fill="var(--floodlight)"
      points="12,1 13.95,7.55 19.78,4.22 16.45,10.05 23,12 16.45,13.95 19.78,19.78 13.95,16.45 12,23 10.05,16.45 4.22,19.78 7.55,13.95 1,12 7.55,10.05 4.22,4.22 10.05,7.55"
    />
    <path
      d="M8.5 12 L10.8 14.3 L15.8 8.8"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Journalist verification — short uppercase JBM tag in floodlight per Tribuna
 * editorial credibility positioning. Not a star; reserved for actual press IDs.
 */
const JournalistBadge = () => (
  <span
    className="inline-flex items-center font-mono text-[10px] text-floodlight tracking-wider uppercase font-medium ml-1 px-1.5 py-0.5 rounded-r-1 border border-floodlight/30 bg-floodlight/10"
    title="Jornalista verificado"
  >
    Jornalista
  </span>
);

const PostCard = React.memo(function PostCard({
  post,
  isQuoted = false,
  navigateTo,
  onLike,
  onBookmark,
}: PostCardProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const isLongText = post.text.length > 280;
  const avatarUrl = post.author.avatar && post.author.avatar.trim() ? post.author.avatar : null;
  const displayName = post.author.displayName || "Usuário";
  const handle = post.author.handle || "user";

  const handleCardClick = () => {
    if (!isQuoted) {
      navigate(navigateTo || `/post/${post.id}`);
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${handle}`);
  };

  const AvatarEl = ({ size = 48 }: { size?: number }) => {
    const sizeClass = size === 48 ? "w-12 h-12" : size === 24 ? "w-6 h-6" : "w-10 h-10";
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={displayName}
          onClick={handleProfileClick}
          className={`${sizeClass} rounded-full object-cover flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity`}
        />
      );
    }
    return (
      <div
        onClick={handleProfileClick}
        className={`${sizeClass} rounded-full bg-ink-3 flex-shrink-0 cursor-pointer flex items-center justify-center text-paper font-semibold`}
        style={{ fontSize: size <= 24 ? "10px" : "14px" }}
      >
        {getInitials(displayName)}
      </div>
    );
  };

  const renderText = (text: string) => {
    const parts = parsePostText(text);
    return (
      <p
        className={`${isQuoted ? "text-[13px] text-ink-3" : "text-[15px] text-ink"} leading-[1.5] whitespace-pre-wrap break-words`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {parts.map((part, i) => {
          if (part.type === "hashtag") {
            return (
              <span
                key={i}
                className="text-floodlight hover:underline cursor-pointer font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {part.content}
              </span>
            );
          }
          if (part.type === "mention") {
            return (
              <span
                key={i}
                className="text-ink hover:underline cursor-pointer font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {part.content}
              </span>
            );
          }
          if (part.type === "url") {
            return (
              <a
                key={i}
                href={part.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-floodlight hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {part.content}
              </a>
            );
          }
          return <span key={i}>{part.content}</span>;
        })}
        {isLongText && !showMore && "..."}
      </p>
    );
  };

  // ── Quoted variant (when this card is rendered inside another post) ─────
  // Renders as the spec's "Optional quote block": --card bg, --line border,
  // radius 12, 12/14 padding, big paper-2 quotation mark, source bold ink,
  // body 13 ink-3.
  if (isQuoted) {
    return (
      <div
        className="relative mt-3 border border-line rounded-r-3 bg-card px-3.5 py-3 hover:bg-paper-2 transition-colors cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/post/${post.id}`);
        }}
      >
        {/* Decorative large quote mark in --line-2 */}
        <span
          aria-hidden="true"
          className="absolute top-1 right-3 select-none pointer-events-none text-line-2"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          ”
        </span>

        <div className="flex items-center gap-1.5 mb-1.5">
          <AvatarEl size={24} />
          <span className="text-[13px] font-semibold text-ink truncate">{displayName}</span>
          {post.author.verified && !post.author.isVerifiedJournalist && <VerifiedBadge />}
          <span className="text-[11px] font-mono text-slate truncate">@{handle}</span>
          <span className="text-[11px] text-slate-2">·</span>
          <span className="text-[11px] font-mono text-slate">{formatTimestamp(post.timestamp)}</span>
        </div>

        {renderText(post.text)}

        {post.images.length > 0 && <MediaGrid images={post.images} />}
      </div>
    );
  }

  // ── Standard post card ──────────────────────────────────────────────────
  const displayText = isLongText && !showMore ? post.text.slice(0, 280) : post.text;

  return (
    <article
      onClick={handleCardClick}
      className="border-b border-line hover:bg-paper-2/50 transition-colors cursor-pointer"
      style={{ padding: "20px 22px 16px" }}
    >
      {post.isAd && (
        <div className="flex items-center gap-1 ml-[64px] mb-1.5">
          <span className="t-label text-slate">Ad</span>
          {post.adDomain && (
            <span className="text-[11px] font-mono text-slate">· {post.adDomain}</span>
          )}
        </div>
      )}

      {/* Grid: 48px column for avatar, 1fr column for content; 16px col-gap, 10px row-gap */}
      <div
        className="grid"
        style={{ gridTemplateColumns: "48px 1fr", columnGap: "16px", rowGap: "10px" }}
      >
        {/* Avatar — row 1, col 1 */}
        <div className="row-start-1 col-start-1">
          <AvatarEl size={48} />
        </div>

        {/* Header — row 1, col 2 */}
        <div className="row-start-1 col-start-2 flex items-start justify-between min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span
              className="text-[15px] font-semibold text-ink truncate hover:underline cursor-pointer"
              onClick={handleProfileClick}
            >
              {displayName}
            </span>
            {post.author.isVerifiedJournalist ? (
              <JournalistBadge />
            ) : post.author.verified ? (
              <VerifiedBadge />
            ) : null}
            <span className="text-[12px] font-mono text-slate truncate">@{handle}</span>
            <span className="text-[12px] text-slate-2">·</span>
            <time className="text-[12px] font-mono text-slate hover:underline flex-shrink-0">
              {formatTimestamp(post.timestamp)}
            </time>
          </div>

          <div className="relative flex-shrink-0 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="w-7 h-7 -m-0.5 rounded-full flex items-center justify-center text-slate hover:bg-paper-2 hover:text-ink transition-colors"
              aria-label="Mais opções"
            >
              <MoreHorizontal className="w-[18px] h-[18px] stroke-[1.75]" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-8 bg-card border border-line rounded-r-3 shadow-elev-2 z-50 overflow-hidden w-[260px]"
                  >
                    {[
                      { icon: EyeOff, text: "Não tenho interesse neste post" },
                      { icon: UserMinus, text: `Deixar de seguir @${post.author.handle}` },
                      { icon: VolumeX, text: `Silenciar @${post.author.handle}` },
                      { icon: Ban, text: `Bloquear @${post.author.handle}` },
                      { icon: Flag, text: "Denunciar post" },
                      { icon: Code, text: "Incorporar post" },
                    ].map(({ icon: Icon, text }) => (
                      <button
                        key={text}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-[14px] text-ink hover:bg-paper-2 transition-colors"
                      >
                        <Icon className="w-[18px] h-[18px] stroke-[1.75] text-ink-3" />
                        {text}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Body — row 2, col 2 */}
        <div className="row-start-2 col-start-2 min-w-0">
          {renderText(displayText)}
          {isLongText && (
            <button
              className="text-floodlight text-[13px] font-medium hover:underline mt-1"
              onClick={(e) => {
                e.stopPropagation();
                setShowMore(!showMore);
              }}
            >
              {showMore ? "Ver menos" : "Ver mais"}
            </button>
          )}

          {/* Media */}
          {post.images.length > 0 && <MediaGrid images={post.images} />}

          {/* Link Preview */}
          {post.linkPreview && (
            <LinkPreview
              url={post.linkPreview.url}
              title={post.linkPreview.title}
              description={post.linkPreview.description}
              image={post.linkPreview.image}
              domain={post.linkPreview.domain}
            />
          )}

          {/* Quoted Tweet */}
          {post.quotedPost && <PostCard post={post.quotedPost} isQuoted />}

          {/* Actions — capped at 460px per spec */}
          <div className="max-w-[460px]">
            <TweetActions post={post} onLike={onLike} onBookmark={onBookmark} />
          </div>
        </div>
      </div>
    </article>
  );
});

export default PostCard;

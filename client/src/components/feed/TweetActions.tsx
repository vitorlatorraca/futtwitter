import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Repeat2,
  Heart,
  BarChart2,
  Bookmark,
  Share,
  Link2,
  Quote,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import { formatNumber } from "../../utils/parseText";
import type { Post } from "../../store/useAppStore";

interface TweetActionsProps {
  post: Post;
  /** Custom like handler for API-backed posts. Receives id and current liked state for toggle. */
  onLike?: (id: string, currentlyLiked: boolean) => void;
  /** Custom bookmark handler for API-backed posts. */
  onBookmark?: (id: string) => void;
}

/**
 * Tribuna action row per README "Components → c" → Action row.
 *
 *   reply · repost · like · stats · bookmark · share
 *
 * - JBM 12/500 counters, --slate default
 * - Hover colors (icon + counter):
 *     reply  → --info     + bg-info/10
 *     repost → --success  + bg-success/10
 *     like   → --floodlight + bg-floodlight/10 (filled when .liked)
 *     others → --ink      + bg-paper-2
 * - Icons 18px outline 1.75
 */
const TweetActions = React.memo(function TweetActions({
  post,
  onLike,
  onBookmark,
}: TweetActionsProps) {
  const { toggleLike, toggleRepost, toggleBookmark, showToast } = useAppStore();
  const navigate = useNavigate();
  const [repostMenuOpen, setRepostMenuOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [animatingLike, setAnimatingLike] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.liked) {
      setAnimatingLike(true);
      setTimeout(() => setAnimatingLike(false), 350);
    }
    if (onLike) {
      onLike(post.id, post.liked);
    } else {
      toggleLike(post.id);
    }
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRepostMenuOpen(!repostMenuOpen);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookmark) {
      onBookmark(post.id);
    } else {
      toggleBookmark(post.id);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareMenuOpen(!shareMenuOpen);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    showToast("Link copiado");
    setShareMenuOpen(false);
  };

  // Each action shares the same structure: icon button (rounded full ghost),
  // optional counter beside. The hover bg sits behind the icon only, not the
  // counter, so the lay-out matches the spec's "icon in bubble + count outside".
  return (
    <div
      className="flex items-center justify-between mt-3 -ml-2"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Reply → --info */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/post/${post.id}`);
        }}
        className="group flex items-center gap-1 text-slate hover:text-info transition-colors"
        aria-label={`Responder, ${post.replies} respostas`}
      >
        <div className="p-2 rounded-full group-hover:bg-info/10 transition-colors">
          <MessageCircle className="w-[18px] h-[18px] stroke-[1.75]" />
        </div>
        {post.replies > 0 && (
          <span
            className="font-mono text-[12px] tabular-nums"
            style={{ fontWeight: 500 }}
          >
            {formatNumber(post.replies)}
          </span>
        )}
      </button>

      {/* Repost → --success */}
      <div className="relative">
        <button
          onClick={handleRepost}
          className={`group flex items-center gap-1 transition-colors ${
            post.reposted ? "text-success" : "text-slate hover:text-success"
          }`}
          aria-label={`Repostar, ${post.reposts} reposts`}
        >
          <div className="p-2 rounded-full group-hover:bg-success/10 transition-colors">
            <Repeat2 className="w-[18px] h-[18px] stroke-[1.75]" />
          </div>
          {post.reposts > 0 && (
            <span
              className="font-mono text-[12px] tabular-nums"
              style={{ fontWeight: 500 }}
            >
              {formatNumber(post.reposts)}
            </span>
          )}
        </button>
        <AnimatePresence>
          {repostMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setRepostMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute bottom-full left-0 mb-1 bg-card border border-line rounded-r-3 shadow-elev-2 z-50 overflow-hidden w-[160px]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRepost(post.id);
                    setRepostMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-[14px] text-ink font-medium hover:bg-paper-2"
                >
                  <Repeat2 className="w-[18px] h-[18px] stroke-[1.75]" />
                  {post.reposted ? "Desfazer repost" : "Repostar"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRepostMenuOpen(false);
                    showToast("Citar — em breve");
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-[14px] text-ink font-medium hover:bg-paper-2"
                >
                  <Quote className="w-[18px] h-[18px] stroke-[1.75]" />
                  Citar
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Like → --floodlight (filled when liked) */}
      <button
        onClick={handleLike}
        className={`group flex items-center gap-1 transition-colors ${
          post.liked ? "text-floodlight" : "text-slate hover:text-floodlight"
        }`}
        aria-label={`Curtir, ${post.likes} curtidas`}
      >
        <div className="p-2 rounded-full group-hover:bg-floodlight/10 transition-colors">
          <Heart
            className={`w-[18px] h-[18px] stroke-[1.75] ${animatingLike ? "heart-animation" : ""} ${
              post.liked ? "fill-floodlight" : ""
            }`}
          />
        </div>
        {post.likes > 0 && (
          <span
            className="font-mono text-[12px] tabular-nums"
            style={{ fontWeight: 500 }}
          >
            {formatNumber(post.likes)}
          </span>
        )}
      </button>

      {/* Views → --ink */}
      <button
        className="group flex items-center gap-1 text-slate hover:text-ink transition-colors"
        aria-label={`${formatNumber(post.views)} visualizações`}
      >
        <div className="p-2 rounded-full group-hover:bg-paper-2 transition-colors">
          <BarChart2 className="w-[18px] h-[18px] stroke-[1.75]" />
        </div>
        {post.views > 0 && (
          <span
            className="font-mono text-[12px] tabular-nums"
            style={{ fontWeight: 500 }}
          >
            {formatNumber(post.views)}
          </span>
        )}
      </button>

      {/* Bookmark + Share → --ink */}
      <div className="flex items-center">
        <button
          onClick={handleBookmark}
          className={`group p-2 rounded-full transition-colors ${
            post.bookmarked
              ? "text-ink"
              : "text-slate hover:bg-paper-2 hover:text-ink"
          }`}
          aria-label="Salvar"
        >
          <Bookmark
            className={`w-[18px] h-[18px] stroke-[1.75] ${
              post.bookmarked ? "fill-ink" : ""
            }`}
          />
        </button>
        <div className="relative">
          <button
            onClick={handleShare}
            className="group p-2 rounded-full text-slate hover:bg-paper-2 hover:text-ink transition-colors"
            aria-label="Compartilhar"
          >
            <Share className="w-[18px] h-[18px] stroke-[1.75]" />
          </button>
          <AnimatePresence>
            {shareMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShareMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute bottom-full right-0 mb-1 bg-card border border-line rounded-r-3 shadow-elev-2 z-50 overflow-hidden w-[220px]"
                >
                  <button
                    onClick={handleCopyLink}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-[14px] text-ink font-medium hover:bg-paper-2"
                  >
                    <Link2 className="w-[18px] h-[18px] stroke-[1.75]" />
                    Copiar link
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

export default TweetActions;

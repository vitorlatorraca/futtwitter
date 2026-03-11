import React, { useState } from "react";
import { MessageCircle, Repeat2, Heart, BarChart2, Bookmark, Share, Link2, Mail, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import { formatNumber } from "../../utils/parseText";
import type { Post } from "../../store/useAppStore";

interface TweetActionsProps {
  post: Post;
}

const TweetActions = React.memo(function TweetActions({ post }: TweetActionsProps) {
  const { toggleLike, toggleRepost, toggleBookmark, showToast } = useAppStore();
  const [repostMenuOpen, setRepostMenuOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [animatingLike, setAnimatingLike] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.liked) {
      setAnimatingLike(true);
      setTimeout(() => setAnimatingLike(false), 350);
    }
    toggleLike(post.id);
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRepostMenuOpen(!repostMenuOpen);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(post.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareMenuOpen(!shareMenuOpen);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://futeapp.com/post/${post.id}`);
    showToast("Link copiado");
    setShareMenuOpen(false);
  };

  return (
    <div className="flex items-center justify-between mt-3 -ml-2 max-w-[425px]" onClick={(e) => e.stopPropagation()}>
      {/* Reply */}
      <button
        className="group flex items-center gap-1"
        aria-label={`Reply, ${post.replies} replies`}
      >
        <div className="p-2 rounded-full group-hover:bg-[rgba(29,155,240,0.1)] transition-colors">
          <MessageCircle className="w-[18px] h-[18px] text-x-text-secondary group-hover:text-x-accent transition-colors" />
        </div>
        {post.replies > 0 && (
          <span className="text-[13px] text-x-text-secondary group-hover:text-x-accent transition-colors">
            {formatNumber(post.replies)}
          </span>
        )}
      </button>

      {/* Repost */}
      <div className="relative">
        <button
          onClick={handleRepost}
          className="group flex items-center gap-1"
          aria-label={`Repost, ${post.reposts} reposts`}
        >
          <div className="p-2 rounded-full group-hover:bg-[rgba(0,186,124,0.1)] transition-colors">
            <Repeat2
              className={`w-[18px] h-[18px] transition-colors ${
                post.reposted ? "text-x-repost" : "text-x-text-secondary group-hover:text-x-repost"
              }`}
            />
          </div>
          {post.reposts > 0 && (
            <span className={`text-[13px] transition-colors ${
              post.reposted ? "text-x-repost" : "text-x-text-secondary group-hover:text-x-repost"
            }`}>
              {formatNumber(post.reposts)}
            </span>
          )}
        </button>
        <AnimatePresence>
          {repostMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setRepostMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute bottom-full left-0 mb-1 bg-black border border-x-border rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] z-50 overflow-hidden w-[150px]"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleRepost(post.id); setRepostMenuOpen(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-[15px] font-bold hover:bg-[rgba(231,233,234,0.03)]"
                >
                  <Repeat2 className="w-5 h-5" />
                  {post.reposted ? "Desfazer repost" : "Repostar"}
                </button>
                <button className="w-full px-4 py-3 flex items-center gap-3 text-[15px] font-bold hover:bg-[rgba(231,233,234,0.03)]">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M14.23 2.854c.98-.977 2.56-.977 3.54 0l3.38 3.378c.97.977.97 2.559 0 3.536L9.91 20.998c-.36.359-.81.612-1.3.726l-6.06 1.42c-.41.097-.84-.013-1.14-.315-.3-.3-.41-.726-.31-1.14l1.42-6.063c.11-.49.37-.942.73-1.3zm2.12 1.414c-.2-.195-.51-.195-.71 0L4.41 15.497l-.96 4.082 4.08-.96L18.77 7.39c.19-.196.19-.512 0-.708z" />
                  </svg>
                  Citar
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Like */}
      <button
        onClick={handleLike}
        className="group flex items-center gap-1"
        aria-label={`Like, ${post.likes} likes`}
      >
        <div className="p-2 rounded-full group-hover:bg-[rgba(249,24,128,0.1)] transition-colors">
          <Heart
            className={`w-[18px] h-[18px] transition-colors ${animatingLike ? "heart-animation" : ""} ${
              post.liked ? "fill-x-like text-x-like" : "text-x-text-secondary group-hover:text-x-like"
            }`}
          />
        </div>
        {post.likes > 0 && (
          <span className={`text-[13px] transition-colors ${
            post.liked ? "text-x-like" : "text-x-text-secondary group-hover:text-x-like"
          }`}>
            {formatNumber(post.likes)}
          </span>
        )}
      </button>

      {/* Views */}
      <button className="group flex items-center gap-1" aria-label={`${formatNumber(post.views)} views`}>
        <div className="p-2 rounded-full group-hover:bg-[rgba(29,155,240,0.1)] transition-colors">
          <BarChart2 className="w-[18px] h-[18px] text-x-text-secondary group-hover:text-x-accent transition-colors" />
        </div>
        {post.views > 0 && (
          <span className="text-[13px] text-x-text-secondary group-hover:text-x-accent transition-colors">
            {formatNumber(post.views)}
          </span>
        )}
      </button>

      {/* Bookmark + Share */}
      <div className="flex items-center">
        <button
          onClick={handleBookmark}
          className="group p-2 rounded-full hover:bg-[rgba(29,155,240,0.1)] transition-colors"
          aria-label="Bookmark"
        >
          <Bookmark
            className={`w-[18px] h-[18px] transition-colors ${
              post.bookmarked ? "fill-x-accent text-x-accent" : "text-x-text-secondary group-hover:text-x-accent"
            }`}
          />
        </button>
        <div className="relative">
          <button
            onClick={handleShare}
            className="group p-2 rounded-full hover:bg-[rgba(29,155,240,0.1)] transition-colors"
            aria-label="Share"
          >
            <Share className="w-[18px] h-[18px] text-x-text-secondary group-hover:text-x-accent transition-colors" />
          </button>
          <AnimatePresence>
            {shareMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShareMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute bottom-full right-0 mb-1 bg-black border border-x-border rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] z-50 overflow-hidden w-[220px]"
                >
                  <button onClick={handleCopyLink} className="w-full px-4 py-3 flex items-center gap-3 text-[15px] hover:bg-[rgba(231,233,234,0.03)]">
                    <Link2 className="w-5 h-5" /> Copiar link
                  </button>
                  <button className="w-full px-4 py-3 flex items-center gap-3 text-[15px] hover:bg-[rgba(231,233,234,0.03)]">
                    <Mail className="w-5 h-5" /> Enviar por DM
                  </button>
                  <button className="w-full px-4 py-3 flex items-center gap-3 text-[15px] hover:bg-[rgba(231,233,234,0.03)]">
                    <Code className="w-5 h-5" /> Incorporar post
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

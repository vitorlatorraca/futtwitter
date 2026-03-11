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

interface PostCardProps {
  post: Post;
  isQuoted?: boolean;
}

const VerifiedBadge = () => (
  <svg viewBox="0 0 22 22" className="w-[18px] h-[18px] fill-x-accent inline-block flex-shrink-0 ml-0.5">
    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.272 1.895.143.634-.131 1.218-.437 1.687-.883.445-.47.751-1.054.882-1.69.132-.632.083-1.289-.139-1.896.586-.274 1.084-.705 1.438-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
  </svg>
);

const PostCard = React.memo(function PostCard({ post, isQuoted = false }: PostCardProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const textParts = parsePostText(post.text);
  const isLongText = post.text.length > 280;

  const handleCardClick = () => {
    if (!isQuoted) {
      navigate(`/post/${post.id}`);
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${post.author.handle}`);
  };

  const renderText = () => {
    const displayText = isLongText && !showMore ? post.text.slice(0, 280) : post.text;
    const parts = parsePostText(displayText);

    return (
      <p className={`${isQuoted ? "text-[14px]" : "text-[15px]"} leading-5 whitespace-pre-wrap break-words`}>
        {parts.map((part, i) => {
          if (part.type === "hashtag" || part.type === "mention") {
            return (
              <span key={i} className="text-x-accent hover:underline cursor-pointer" onClick={(e) => e.stopPropagation()}>
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
                className="text-x-accent hover:underline"
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

  if (isQuoted) {
    return (
      <div
        className="mt-3 border border-x-border rounded-2xl p-3 hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer"
        onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.id}`); }}
      >
        <div className="flex items-center gap-1.5">
          <img src={post.author.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
          <span className="text-[13px] font-bold truncate">{post.author.displayName}</span>
          {post.author.verified && <VerifiedBadge />}
          <span className="text-[13px] text-x-text-secondary truncate">@{post.author.handle}</span>
          <span className="text-[13px] text-x-text-secondary">·</span>
          <span className="text-[13px] text-x-text-secondary">{formatTimestamp(post.timestamp)}</span>
        </div>
        {renderText()}
        {post.images.length > 0 && <MediaGrid images={post.images} />}
      </div>
    );
  }

  return (
    <article
      className="px-4 py-3 border-b border-x-border hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer"
      onClick={handleCardClick}
    >
      {post.isAd && (
        <div className="flex items-center gap-1 ml-[52px] mb-1">
          <span className="text-[13px] text-x-text-secondary">Ad</span>
          {post.adDomain && <span className="text-[13px] text-x-text-secondary">· From {post.adDomain}</span>}
        </div>
      )}

      <div className="flex">
        <img
          src={post.author.avatar}
          alt={post.author.displayName}
          onClick={handleProfileClick}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0 cursor-pointer hover:opacity-90"
        />
        <div className="flex-1 ml-3 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <span
                className="text-[15px] font-bold truncate hover:underline cursor-pointer"
                onClick={handleProfileClick}
              >
                {post.author.displayName}
              </span>
              {post.author.verified && <VerifiedBadge />}
              <span className="text-[15px] text-x-text-secondary truncate">@{post.author.handle}</span>
              <span className="text-x-text-secondary">·</span>
              <time className="text-[15px] text-x-text-secondary hover:underline flex-shrink-0">
                {formatTimestamp(post.timestamp)}
              </time>
            </div>

            <div className="relative flex-shrink-0 ml-2">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                className="p-1.5 -m-1.5 rounded-full hover:bg-[rgba(29,155,240,0.1)] transition-colors"
                aria-label="More options"
              >
                <MoreHorizontal className="w-[18px] h-[18px] text-x-text-secondary" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-0 bg-black border border-x-border rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] z-50 overflow-hidden w-[260px]"
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
                          onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}
                          className="w-full px-4 py-3 flex items-center gap-3 text-[15px] hover:bg-[rgba(231,233,234,0.03)] transition-colors"
                        >
                          <Icon className="w-5 h-5 text-x-text-secondary" />
                          {text}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Body */}
          {renderText()}
          {isLongText && (
            <button
              className="text-x-accent text-[15px] hover:underline mt-1"
              onClick={(e) => { e.stopPropagation(); setShowMore(!showMore); }}
            >
              {showMore ? "Ver menos" : "Ver mais"}
            </button>
          )}

          {/* Media */}
          <MediaGrid images={post.images} />

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

          {/* Actions */}
          <TweetActions post={post} />
        </div>
      </div>
    </article>
  );
});

export default PostCard;

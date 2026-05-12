import { useState } from 'react';
import { MessageCircle, Repeat2, Heart, Share, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { News } from '@shared/schema';

interface TweetCardProps {
  news: News & {
    scope?: 'ALL' | 'TEAM' | 'EUROPE';
    team: { name: string; logoUrl: string } | null;
    journalist: { user: { name: string } };
    userInteraction?: 'LIKE' | 'DISLIKE' | null;
  };
  canInteract: boolean;
  onInteract: (newsId: string, type: 'LIKE' | 'DISLIKE') => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function TweetCard({ news, canInteract, onInteract }: TweetCardProps) {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canInteract || isLiking) return;
    setIsLiking(true);
    try {
      onInteract(news.id, 'LIKE');
    } finally {
      setIsLiking(false);
    }
  };

  const isLiked = news.userInteraction === 'LIKE';
  const formattedDate = format(new Date(news.createdAt), 'd MMM', { locale: ptBR });
  const handle = `@${news.journalist.user.name.toLowerCase().replace(/\s+/g, '_')}`;

  return (
    <article className="tweet-row">
      {/* Avatar */}
      <div className="tweet-avatar">
        <div className="tweet-avatar-inner">
          {getInitials(news.journalist.user.name)}
        </div>
      </div>

      {/* Content */}
      <div className="tweet-content">
        {/* Header */}
        <div className="tweet-header">
          <span className="tweet-author">{news.journalist.user.name}</span>
          <span className="tweet-handle">{handle}</span>
          <span className="tweet-dot">·</span>
          <span className="tweet-timestamp">{formattedDate}</span>
        </div>

        {/* Text */}
        <p className="tweet-text">{news.title}</p>

        {/* Image */}
        {news.imageUrl && (
          <img
            src={news.imageUrl}
            alt={news.title}
            loading="lazy"
            decoding="async"
            className="tweet-media"
          />
        )}

        {/* Interaction buttons */}
        <div className="tweet-interactions">
          {/* Reply */}
          <button
            className="tweet-btn tweet-btn--reply"
            aria-label="Reply"
          >
            <MessageCircle size={18} />
            <span>0</span>
          </button>

          {/* Retweet */}
          <button
            className="tweet-btn tweet-btn--retweet"
            aria-label="Retweet"
          >
            <Repeat2 size={18} />
            <span>0</span>
          </button>

          {/* Like */}
          <button
            onClick={handleLike}
            disabled={!canInteract || isLiking}
            className={cn(
              'tweet-btn tweet-btn--like',
              isLiked && 'is-liked'
            )}
            aria-label="Like"
          >
            {isLiking ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Heart
                size={18}
                fill={isLiked ? 'currentColor' : 'none'}
              />
            )}
            <span>{news.likesCount ?? 0}</span>
          </button>

          {/* Share */}
          <button
            className="tweet-btn tweet-btn--share"
            aria-label="Share"
          >
            <Share size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

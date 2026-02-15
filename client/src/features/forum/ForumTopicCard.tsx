'use client';

import { Link } from 'wouter';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageCircle, Heart, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { ForumTopicWithAuthor } from './types';
import { FORUM_CATEGORIES } from './types';

interface ForumTopicCardProps {
  topic: ForumTopicWithAuthor;
  teamId: string;
}

function getCategoryLabel(category: string) {
  return FORUM_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

function getCategoryIcon(category: string) {
  return FORUM_CATEGORIES.find((c) => c.value === category)?.icon ?? '📋';
}

export function ForumTopicCard({ topic, teamId }: ForumTopicCardProps) {
  const timeAgo = formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true, locale: ptBR });
  const excerpt = topic.content.slice(0, 120) + (topic.content.length > 120 ? '...' : '');

  return (
    <Link href={`/meu-time/comunidade/${topic.id}`}>
      <a className="block group">
        <article
          className="rounded-2xl border border-white/5 bg-[#10161D] overflow-hidden transition-all duration-200 hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20"
        >
          {topic.coverImageUrl ? (
            <div className="aspect-video bg-muted overflow-hidden">
              <img
                src={topic.coverImageUrl}
                alt=""
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ) : null}

          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs font-medium">
                {getCategoryIcon(topic.category)} {getCategoryLabel(topic.category)}
              </Badge>
              {topic.isPinned && (
                <Badge variant="default" className="text-xs">
                  Fixado
                </Badge>
              )}
            </div>

            <h3 className="font-display font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {topic.title}
            </h3>
            <p className="text-sm text-foreground-secondary line-clamp-2">{excerpt}</p>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 min-w-0">
                <Avatar className="h-6 w-6 shrink-0">
                  <AvatarImage src={topic.author.avatarUrl ?? undefined} alt={topic.author.name} />
                  <AvatarFallback className="text-xs bg-primary/20 text-primary">
                    {topic.author.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-foreground-secondary truncate">{topic.author.name}</span>
                {topic.author.isJournalist && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                    Jornalista
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{timeAgo}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                {topic.repliesCount}
              </span>
              <span className="flex items-center gap-1">
                <Heart
                  className={`h-3.5 w-3.5 ${topic.viewerHasLiked ? 'fill-primary text-primary' : ''}`}
                />
                {topic.likesCount}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {topic.viewsCount}
              </span>
            </div>
          </div>
        </article>
      </a>
    </Link>
  );
}

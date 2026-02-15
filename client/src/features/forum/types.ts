export type ForumTopicCategory =
  | "news"
  | "pre_match"
  | "post_match"
  | "transfer"
  | "off_topic"
  | "base";

export interface ForumTopicWithAuthor {
  id: string;
  teamId: string;
  authorId: string;
  title: string;
  content: string;
  category: ForumTopicCategory;
  coverImageUrl: string | null;
  viewsCount: number;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isLocked: boolean;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
    isJournalist: boolean;
    isAdmin: boolean;
  };
  viewerHasLiked?: boolean;
}

export interface ForumReplyWithAuthor {
  id: string;
  topicId: string;
  authorId: string;
  content: string;
  likesCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
    isJournalist: boolean;
    isAdmin: boolean;
  };
  viewerHasLiked?: boolean;
}

export interface ForumStats {
  totalTopics: number;
  totalReplies: number;
  trendingCount: number;
}

export const FORUM_CATEGORIES: { value: ForumTopicCategory; label: string; icon: string }[] = [
  { value: "base", label: "Todos", icon: "📋" },
  { value: "news", label: "Notícias", icon: "📰" },
  { value: "pre_match", label: "Pré-jogo", icon: "📈" },
  { value: "post_match", label: "Pós-jogo", icon: "⚽" },
  { value: "transfer", label: "Mercado da Bola", icon: "💰" },
  { value: "off_topic", label: "Off-topic", icon: "💬" },
];

export const TRENDING_CATEGORY: { value: "trending"; label: string; icon: string } = {
  value: "trending",
  label: "Em alta",
  icon: "🔥",
};

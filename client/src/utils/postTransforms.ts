/**
 * Shared transform functions — convert API shapes → app Post type.
 * Single source of truth used by Feed, Profile, Explore, PostDetail.
 */
import type { Post } from "@/store/useAppStore";
import type { PostFeedItem } from "@/hooks/usePosts";
import type { InfluencerFeedItem, TorcidaFeedItem } from "@/hooks/useFeed";

/** PostFeedItem (user post from /api/posts) → Post */
export function postFeedItemToPost(item: PostFeedItem): Post {
  const isVerified = !!item.author.isVerifiedJournalist;
  return {
    id: item.id,
    author: {
      id: item.author.id,
      displayName: item.author.name,
      handle: item.author.handle,
      avatar: item.author.avatarUrl || "",
      bio: "",
      coverPhoto: "",
      location: "",
      website: "",
      joinDate: "",
      following: 0,
      followers: 0,
      verified: isVerified,
      userRole: item.author.userRole ?? "fan",
      isVerifiedJournalist: isVerified,
    },
    text: item.content,
    timestamp: new Date(item.createdAt),
    images: item.imageUrl ? [item.imageUrl] : [],
    liked: item.viewerHasLiked,
    reposted: false,
    bookmarked: item.viewerHasBookmarked,
    likes: item.likeCount,
    reposts: item.repostCount,
    replies: item.replyCount,
    views: item.viewCount,
    parentId: item.parentPostId ?? undefined,
  };
}

/** InfluencerFeedItem (journalist news) → Post */
export function influencerToPost(item: InfluencerFeedItem): Post {
  const body = item.content || item.summary || item.title || "";
  let linkPreview: Post["linkPreview"];
  if (item.sourceUrl) {
    try {
      linkPreview = {
        url: item.sourceUrl,
        title: item.title,
        description: item.summary || "",
        image: item.imageUrl || "",
        domain: new URL(item.sourceUrl).hostname,
      };
    } catch {
      // invalid URL — skip link preview
    }
  }
  return {
    id: item.id,
    author: {
      id: item.journalist.id,
      displayName: item.journalist.name || "Autor",
      handle: item.journalist.handle || "autor",
      avatar: item.journalist.avatarUrl || "",
      bio: "",
      coverPhoto: "",
      location: "",
      website: "",
      joinDate: "",
      following: 0,
      followers: 0,
      verified: item.journalist.verified ?? true,
    },
    text: body,
    timestamp: new Date(item.publishedAt),
    images: item.imageUrl ? [item.imageUrl] : [],
    liked: item.userInteraction === "LIKE",
    reposted: false,
    bookmarked: false,
    likes: item.engagement?.likes ?? 0,
    reposts: item.engagement?.reposts ?? 0,
    replies: 0,
    views: item.engagement?.views ?? 0,
    linkPreview,
  };
}

/** TorcidaFeedItem (fan community post) → Post */
export function torcidaToPost(item: TorcidaFeedItem): Post {
  return {
    id: item.id,
    author: {
      id: item.user.id,
      displayName: item.user.name || "Usuário",
      handle: item.user.handle || "user",
      avatar: item.user.avatarUrl || "",
      bio: "",
      coverPhoto: "",
      location: "",
      website: "",
      joinDate: "",
      following: 0,
      followers: 0,
      verified: false,
    },
    text: item.content,
    timestamp: new Date(item.createdAt),
    images: item.imageUrl ? [item.imageUrl] : [],
    liked: item.viewerHasLiked,
    reposted: false,
    bookmarked: false,
    likes: item.likes,
    reposts: 0,
    replies: item.replies,
    views: 0,
    parentId: item.relatedNews?.id,
  };
}

/** Fallback avatar URL — consistent across the whole app */
export function avatarFallback(seed?: string | null): string {
  const s = seed ? encodeURIComponent(seed) : "default";
  return `https://api.dicebear.com/9.x/initials/svg?seed=${s}&backgroundColor=1a56db&fontFamily=Arial&fontSize=40`;
}

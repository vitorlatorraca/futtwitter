import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Link2, CalendarDays, Loader2 } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import { useUserProfile, useToggleFollow } from "../hooks/useFollow";
import { usePostsFeed, useLikePost, useBookmarkPost } from "../hooks/usePosts";
import PostCard from "../components/feed/PostCard";
import PostSkeleton from "../components/feed/PostSkeleton";
import type { Post } from "../store/useAppStore";

const profileTabs = ["Posts", "Respostas", "Destaques", "Mídia", "Curtidas"];

const VerifiedBadge = () => (
  <svg viewBox="0 0 22 22" className="w-5 h-5 fill-x-accent inline-block flex-shrink-0">
    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.245-1.44c-.608.223-1.267.272-1.902.14-.635-.13-1.22-.436-1.69-.882-.445-.47-.751-1.054-.882-1.69-.13-.633-.08-1.29.144-1.896-.586-.274-1.084-.705-1.438-1.246-.354-.54-.551-1.17-.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
  </svg>
);

function postFeedItemToPost(item: {
  id: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  replyCount: number;
  repostCount: number;
  viewCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string | null;
    userRole?: "fan" | "journalist";
    isVerifiedJournalist?: boolean;
  };
  viewerHasLiked: boolean;
  viewerHasBookmarked: boolean;
}): Post {
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
  };
}

export default function Profile() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const profileQuery = useUserProfile(handle ?? undefined);
  const toggleFollowMutation = useToggleFollow();
  const postsQuery = usePostsFeed(handle ? { handle } : undefined);
  const likePostMutation = useLikePost();
  const bookmarkPostMutation = useBookmarkPost();
  const [activeTab, setActiveTab] = useState("Posts");

  const user = profileQuery.data;
  const isOwnProfile = !!authUser && !!handle && authUser.handle === handle;
  const isFollowing = user?.isFollowing ?? false;

  const allPosts = (postsQuery.data?.pages ?? []).flat();
  const userPosts = allPosts.map(postFeedItemToPost);
  const filteredPosts =
    activeTab === "Mídia" ? userPosts.filter((p) => p.images.length > 0) : userPosts;

  if (profileQuery.isLoading || !handle) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-10 h-10 text-x-accent animate-spin" />
      </div>
    );
  }

  if (profileQuery.isError || !user) {
    return (
      <div className="py-16 px-4 text-center">
        <p className="text-[15px] text-red-400">Perfil não encontrado.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-x-accent hover:underline"
        >
          Voltar
        </button>
      </div>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    : "";

  const handleToggleFollow = () => {
    if (!handle) return;
    toggleFollowMutation.mutate({ handle, follow: !isFollowing });
  };

  return (
    <div>
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 py-1 h-[53px]">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)] transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold leading-6 flex items-center gap-1">
            {user.name}
          </h1>
          <p className="text-[13px] text-x-text-secondary">
            {userPosts.length} posts
          </p>
        </div>
      </div>

      <div className="h-[200px] bg-x-surface overflow-hidden">
        {user.coverPhotoUrl ? (
          <img
            src={user.coverPhotoUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#2f3336]" />
        )}
      </div>

      <div className="px-4 pb-3">
        <div className="flex justify-between items-start -mt-[10%]">
          <img
            src={user.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
            alt={user.name}
            className="w-[133px] h-[133px] rounded-full border-4 border-black object-cover"
          />
          <div className="mt-[75px]">
            {isOwnProfile ? (
              <button
                onClick={() => navigate("/settings")}
                className="rounded-full border border-x-border font-bold text-[15px] px-4 py-1.5 hover:bg-[rgba(231,233,234,0.1)] transition-colors"
              >
                Editar perfil
              </button>
            ) : (
              <button
                onClick={handleToggleFollow}
                disabled={toggleFollowMutation.isPending}
                className={`rounded-full font-bold text-[15px] px-5 py-2 transition-colors ${
                  isFollowing
                    ? "bg-transparent border border-x-border text-white hover:border-red-500 hover:text-red-500"
                    : "brand-gradient text-white hover:opacity-90"
                }`}
              >
                {toggleFollowMutation.isPending ? "..." : isFollowing ? "Seguindo" : "Seguir"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-extrabold">{user.name}</h2>
            {user.isVerifiedJournalist ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-x-accent/15 text-x-accent text-[13px] font-medium border border-x-accent/30">
                📰 Journalist
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-x-surface text-x-text-secondary text-[13px]">
                ⚽ Fan
              </span>
            )}
          </div>
          <p className="text-[15px] text-x-text-secondary">@{user.handle}</p>
        </div>

        {user.bio && <p className="text-[15px] mt-3 leading-5">{user.bio}</p>}

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[15px] text-x-text-secondary">
          {user.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-[18px] h-[18px]" />
              {user.location}
            </span>
          )}
          {user.website && (
            <a
              href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
              className="flex items-center gap-1 text-x-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Link2 className="w-[18px] h-[18px]" />
              {user.website.replace(/^https?:\/\//, "")}
            </a>
          )}
          {joinDate && (
            <span className="flex items-center gap-1">
              <CalendarDays className="w-[18px] h-[18px]" />
              Entrou em {joinDate}
            </span>
          )}
        </div>

        <div className="flex gap-4 mt-3 text-[14px]">
          <button
            onClick={() => navigate(`/profile/${handle}/following`)}
            className="hover:underline"
          >
            <span className="font-bold text-x-text-primary">
              {user.followingCount.toLocaleString()}
            </span>{" "}
            <span className="text-x-text-secondary ml-1">Seguindo</span>
          </button>
          <button
            onClick={() => navigate(`/profile/${handle}/followers`)}
            className="hover:underline"
          >
            <span className="font-bold text-x-text-primary">
              {user.followersCount.toLocaleString()}
            </span>{" "}
            <span className="text-x-text-secondary ml-1">Seguidores</span>
          </button>
        </div>
      </div>

      <div className="flex border-b border-x-border">
        {profileTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-4 text-center hover:bg-[rgba(231,233,234,0.03)] transition-colors relative text-[15px]"
          >
            <span className={activeTab === tab ? "font-bold" : "text-x-text-secondary"}>
              {tab}
            </span>
            {activeTab === tab && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[56px] h-1 bg-x-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div>
        {postsQuery.isLoading ? (
          [1, 2, 3].map((i) => <PostSkeleton key={i} />)
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={(id, liked) => likePostMutation.mutate(id)}
              onBookmark={(id) => bookmarkPostMutation.mutate(id)}
            />
          ))
        ) : (
          <div className="py-16 text-center">
            <p className="text-x-text-secondary text-[15px]">Nenhum post para exibir.</p>
          </div>
        )}
      </div>
    </div>
  );
}

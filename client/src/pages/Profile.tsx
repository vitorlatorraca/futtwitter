import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Link2, CalendarDays } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { mockUsers } from "../data/mockUsers";
import { mockPosts } from "../data/mockPosts";
import PostCard from "../components/feed/PostCard";

const profileTabs = ["Posts", "Respostas", "Destaques", "Mídia", "Curtidas"];

const VerifiedBadge = () => (
  <svg viewBox="0 0 22 22" className="w-5 h-5 fill-x-accent inline-block flex-shrink-0">
    <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.272 1.895.143.634-.131 1.218-.437 1.687-.883.445-.47.751-1.054.882-1.69.132-.632.083-1.289-.139-1.896.586-.274 1.084-.705 1.438-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
  </svg>
);

export default function Profile() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { currentUser, posts: storePosts } = useAppStore();
  const [activeTab, setActiveTab] = useState("Posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const user = handle === currentUser.handle
    ? currentUser
    : mockUsers.find((u) => u.handle === handle) || currentUser;

  const isOwnProfile = user.id === currentUser.id;

  const userPosts = [...storePosts, ...mockPosts].filter(
    (p) => p.author.handle === user.handle
  );

  const filteredPosts = activeTab === "Media"
    ? userPosts.filter((p) => p.images.length > 0)
    : userPosts;

  return (
    <div>
      {/* Header */}
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
            {user.displayName}
            {user.verified && <VerifiedBadge />}
          </h1>
          <p className="text-[13px] text-x-text-secondary">{userPosts.length} posts</p>
        </div>
      </div>

      {/* Cover */}
      <div className="h-[200px] bg-x-surface overflow-hidden">
        <img
          src={user.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-3">
        <div className="flex justify-between items-start -mt-[10%]">
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-[133px] h-[133px] rounded-full border-4 border-black object-cover"
          />
          <div className="mt-[75px]">
            {isOwnProfile ? (
              <button className="rounded-full border border-x-border font-bold text-[15px] px-4 py-1.5 hover:bg-[rgba(231,233,234,0.1)] transition-colors">
                Editar perfil
              </button>
            ) : (
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`rounded-full font-bold text-[15px] px-5 py-2 transition-colors ${
                  isFollowing
                    ? "bg-transparent border border-x-border text-white hover:border-red-500 hover:text-red-500"
                    : "brand-gradient text-white hover:opacity-90"
                }`}
              >
                {isFollowing ? "Seguindo" : "Seguir"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-extrabold">{user.displayName}</h2>
            {user.verified && <VerifiedBadge />}
          </div>
          <p className="text-[15px] text-x-text-secondary">@{user.handle}</p>
        </div>

        <p className="text-[15px] mt-3 leading-5">{user.bio}</p>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[15px] text-x-text-secondary">
          {user.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-[18px] h-[18px]" />
              {user.location}
            </span>
          )}
          {user.website && (
            <a href={`https://${user.website}`} className="flex items-center gap-1 text-x-accent hover:underline">
              <Link2 className="w-[18px] h-[18px]" />
              {user.website}
            </a>
          )}
          <span className="flex items-center gap-1">
            <CalendarDays className="w-[18px] h-[18px]" />
            Entrou em {user.joinDate}
          </span>
        </div>

        <div className="flex gap-4 mt-3 text-[14px]">
          <button className="hover:underline">
            <span className="font-bold text-x-text-primary">{user.following.toLocaleString()}</span>{" "}
            <span className="text-x-text-secondary">Seguindo</span>
          </button>
          <button className="hover:underline">
            <span className="font-bold text-x-text-primary">{user.followers.toLocaleString()}</span>{" "}
            <span className="text-x-text-secondary">Seguidores</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-x-border">
        {profileTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-4 text-center hover:bg-[rgba(231,233,234,0.03)] transition-colors relative text-[15px]"
          >
            <span className={activeTab === tab ? "font-bold" : "text-x-text-secondary"}>{tab}</span>
            {activeTab === tab && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[56px] h-1 bg-x-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="py-16 text-center">
            <p className="text-x-text-secondary text-[15px]">Nenhum post para exibir.</p>
          </div>
        )}
      </div>
    </div>
  );
}

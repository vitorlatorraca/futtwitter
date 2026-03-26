import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Repeat2,
  UserPlus,
  MessageCircle,
  Settings,
  Newspaper,
  Award,
  Trophy,
  Calendar,
} from "lucide-react";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useUnreadCount,
  type ApiNotification,
} from "../hooks/useNotifications";
import { useToggleFollow, useUserProfile } from "../hooks/useFollow";

const tabs = ["Todas", "Verificadas", "Menções"] as const;

const typeConfig: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  LIKE: { icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10" },
  FOLLOW: { icon: UserPlus, color: "text-x-accent", bg: "bg-x-accent/10" },
  REPLY: { icon: MessageCircle, color: "text-x-accent", bg: "bg-x-accent/10" },
  REPOST: { icon: Repeat2, color: "text-green-400", bg: "bg-green-400/10" },
  NEW_NEWS: { icon: Newspaper, color: "text-amber-400", bg: "bg-amber-400/10" },
  BADGE_EARNED: { icon: Award, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  MATCH_RESULT: { icon: Trophy, color: "text-orange-400", bg: "bg-orange-400/10" },
  UPCOMING_MATCH: { icon: Calendar, color: "text-purple-400", bg: "bg-purple-400/10" },
};

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });
}

function FollowBackButton({ handle }: { handle: string }) {
  const toggleFollow = useToggleFollow();
  const profileQuery = useUserProfile(handle);
  const isFollowing = profileQuery.data?.isFollowing ?? false;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFollow.mutate({ handle, follow: !isFollowing });
      }}
      disabled={toggleFollow.isPending}
      className={`mt-2 px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors ${
        isFollowing
          ? "border border-x-border text-white hover:border-red-500 hover:text-red-500"
          : "bg-white text-black hover:bg-[rgba(231,233,234,0.9)]"
      }`}
    >
      {isFollowing ? "Seguindo" : "Seguir de volta"}
    </button>
  );
}

function NotificationCard({
  n,
  onNavigate,
  onMarkRead,
}: {
  n: ApiNotification;
  onNavigate: (path: string) => void;
  onMarkRead: (id: string) => void;
}) {
  const config = typeConfig[n.type] ?? typeConfig.NEW_NEWS;
  const ConfigIcon = config.icon;

  const handleNotificationClick = () => {
    onMarkRead(n.id);
    if (n.type === "LIKE" || n.type === "REPLY" || n.type === "REPOST") {
      if (n.referenceId) onNavigate(`/post/${n.referenceId}`);
    } else if (n.type === "FOLLOW") {
      if (n.actor) onNavigate(`/profile/${n.actor.handle}`);
    } else if (n.type === "NEW_NEWS") {
      if (n.referenceId) onNavigate(`/news/${n.referenceId}`);
    }
  };

  // Title without actor name for display (e.g. "curtiu seu post")
  const titleSuffix = n.actor ? n.title.replace(n.actor.name, "").trim() : n.title;

  return (
    <div
      onClick={handleNotificationClick}
      className={`flex items-start gap-3 px-4 py-4 border-b border-x-border cursor-pointer transition-colors
        hover:bg-[rgba(231,233,234,0.03)]
        ${!n.isRead ? "bg-[rgba(0,230,118,0.03)]" : ""}`}
    >
      <div className="relative flex-shrink-0 mt-1">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}
        >
          <ConfigIcon className={`w-5 h-5 ${config.color}`} />
        </div>
        {!n.isRead && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-x-accent rounded-full border-2 border-black" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        {n.actor && (
          <div
            className="w-8 h-8 rounded-full bg-x-border overflow-hidden mb-2 float-right ml-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(`/profile/${n.actor!.handle}`);
            }}
          >
            {n.actor.avatarUrl ? (
              <img
                src={n.actor.avatarUrl}
                alt={n.actor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-x-text-secondary">
                {n.actor.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}

        <p className="text-[15px] leading-5">
          {n.actor && (
            <span
              className="font-bold cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(`/profile/${n.actor!.handle}`);
              }}
            >
              {n.actor.name}
            </span>
          )}{" "}
          <span className="text-x-text-primary">{titleSuffix}</span>
        </p>

        {n.message && (
          <p className="text-[14px] text-x-text-secondary mt-0.5 line-clamp-2">
            {n.message}
          </p>
        )}

        {n.type === "FOLLOW" && n.actor && (
          <FollowBackButton handle={n.actor.handle} />
        )}

        <p className="text-[13px] text-x-text-secondary mt-1">
          {formatRelativeTime(n.createdAt)}
        </p>
      </div>
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-4 border-b border-x-border animate-pulse">
      <div className="w-10 h-10 rounded-full bg-x-border flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-x-border rounded w-3/4" />
        <div className="h-3 bg-x-border rounded w-1/2" />
        <div className="h-3 bg-x-border rounded w-1/4" />
      </div>
    </div>
  );
}

export default function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Todas");

  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  useEffect(() => {
    markAllAsRead.mutate();
  }, [activeTab]);

  const handleMarkRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const filtered =
    activeTab === "Verificadas"
      ? notifications.filter((n) => n.actor?.userType === "JOURNALIST")
      : activeTab === "Menções"
      ? notifications.filter((n) => n.type === "REPLY")
      : notifications;

  return (
    <div>
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Notificações</h1>
          <button
            className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)] transition-colors"
            aria-label="Configurações"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <div className="flex border-b border-x-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-4 text-center hover:bg-[rgba(231,233,234,0.03)] transition-colors relative text-[15px]"
            >
              <span
                className={
                  activeTab === tab ? "font-bold" : "text-x-text-secondary"
                }
              >
                {tab}
              </span>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[56px] h-1 bg-x-accent rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        {isLoading && (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <NotificationSkeleton key={i} />
            ))}
          </>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="px-8 py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-x-border flex items-center justify-center">
              <svg
                className="w-8 h-8 text-x-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold mb-2">Nenhuma notificação ainda</h2>
            <p className="text-x-text-secondary text-[15px]">
              {activeTab === "Menções"
                ? "Quando alguém mencionar você, aparecerá aqui."
                : "Quando alguém interagir com seus posts, aparecerá aqui."}
            </p>
          </div>
        )}

        {!isLoading &&
          filtered.map((n) => (
            <NotificationCard
              key={n.id}
              n={n}
              onNavigate={(path) => navigate(path)}
              onMarkRead={handleMarkRead}
            />
          ))}
      </div>
    </div>
  );
}

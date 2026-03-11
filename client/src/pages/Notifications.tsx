import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Repeat2, UserPlus, AtSign, MessageCircle, Settings } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { mockNotifications } from "../data/mockNotifications";
import { formatTimestamp } from "../utils/formatDate";
import type { Notification } from "../store/useAppStore";

const tabs = ["Todas", "Verificadas", "Menções"];

function NotificationItem({ notification }: { notification: Notification }) {
  const navigate = useNavigate();

  const iconMap = {
    like: { icon: Heart, color: "text-x-like", fill: "fill-x-like" },
    repost: { icon: Repeat2, color: "text-x-repost", fill: "" },
    follow: { icon: UserPlus, color: "text-x-accent", fill: "" },
    mention: { icon: AtSign, color: "text-x-accent", fill: "" },
    reply: { icon: MessageCircle, color: "text-x-accent", fill: "" },
  };

  const { icon: Icon, color, fill } = iconMap[notification.type];

  const getText = () => {
    switch (notification.type) {
      case "like":
        return <><strong>{notification.user.displayName}</strong> curtiu seu post</>;
      case "repost":
        return <><strong>{notification.user.displayName}</strong> repostou seu post</>;
      case "follow":
        return <><strong>{notification.user.displayName}</strong> começou a te seguir</>;
      case "mention":
        return <><strong>{notification.user.displayName}</strong> mencionou você</>;
      case "reply":
        return <><strong>{notification.user.displayName}</strong> respondeu seu post</>;
    }
  };

  return (
    <div
      className={`px-4 py-3 flex gap-3 hover:bg-[rgba(231,233,234,0.03)] transition-colors cursor-pointer border-b border-x-border ${
        !notification.read ? "bg-[rgba(29,155,240,0.04)]" : ""
      }`}
      onClick={() => notification.postId && navigate(`/post/${notification.postId}`)}
    >
      <div className="w-10 flex justify-end flex-shrink-0">
        <Icon className={`w-7 h-7 ${color} ${fill}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <img
            src={notification.user.avatar}
            alt={notification.user.displayName}
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${notification.user.handle}`);
            }}
          />
        </div>
        <p className="text-[15px] leading-5">{getText()}</p>
        {notification.postExcerpt && (
          <p className="text-[15px] text-x-text-secondary mt-1 leading-5">
            {notification.postExcerpt}
          </p>
        )}
        {notification.type === "follow" && (
          <button className="mt-2 brand-gradient text-white font-bold text-[14px] rounded-full px-4 py-1.5 hover:opacity-90 transition-opacity">
            Seguir de volta
          </button>
        )}
        <p className="text-[13px] text-x-text-secondary mt-1">{formatTimestamp(notification.timestamp)}</p>
      </div>
    </div>
  );
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("Todas");
  const { markNotificationsRead } = useAppStore();

  useEffect(() => {
    markNotificationsRead();
  }, [markNotificationsRead]);

  const filtered = activeTab === "Verificadas"
    ? mockNotifications.filter((n) => n.user.verified)
    : activeTab === "Menções"
    ? mockNotifications.filter((n) => n.type === "mention")
    : mockNotifications;

  return (
    <div>
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Notificações</h1>
          <button className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)] transition-colors" aria-label="Settings">
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
              <span className={activeTab === tab ? "font-bold" : "text-x-text-secondary"}>{tab}</span>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[56px] h-1 bg-x-accent rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        {filtered.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
        {filtered.length === 0 && (
          <div className="px-8 py-16 text-center">
            <h2 className="text-3xl font-extrabold mb-2">Nada por aqui — ainda</h2>
            <p className="text-x-text-secondary text-[15px]">
              {activeTab === "Menções"
                ? "Quando alguém mencionar você, aparecerá aqui."
                : "Quando alguém interagir com seus posts, aparecerá aqui."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

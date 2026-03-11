import { create } from "zustand";

export interface User {
  id: string;
  displayName: string;
  handle: string;
  avatar: string;
  bio: string;
  coverPhoto: string;
  location: string;
  website: string;
  joinDate: string;
  following: number;
  followers: number;
  verified: boolean;
}

export interface Post {
  id: string;
  author: User;
  text: string;
  timestamp: Date;
  images: string[];
  gif?: string;
  video?: string;
  linkPreview?: {
    url: string;
    title: string;
    description: string;
    image: string;
    domain: string;
  };
  quotedPost?: Post;
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
  likes: number;
  reposts: number;
  replies: number;
  views: number;
  isAd?: boolean;
  adDomain?: string;
  parentId?: string;
}

export interface Notification {
  id: string;
  type: "like" | "repost" | "follow" | "mention" | "reply";
  user: User;
  timestamp: Date;
  postExcerpt?: string;
  postId?: string;
  read: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  messages: Message[];
  lastMessage: string;
  lastTimestamp: Date;
  unreadCount: number;
}

interface AppState {
  currentUser: User;
  posts: Post[];
  notifications: Notification[];
  conversations: Conversation[];
  unreadNotifications: number;
  unreadMessages: number;
  activeTab: "for-you" | "following";
  composeModalOpen: boolean;
  imageModalOpen: boolean;
  imageModalImages: string[];
  imageModalIndex: number;
  toastMessage: string | null;

  addPost: (post: Post) => void;
  toggleLike: (postId: string) => void;
  toggleRepost: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  setActiveTab: (tab: "for-you" | "following") => void;
  setComposeModalOpen: (open: boolean) => void;
  openImageModal: (images: string[], index: number) => void;
  closeImageModal: () => void;
  showToast: (message: string) => void;
  hideToast: () => void;
  markNotificationsRead: () => void;
  markConversationRead: (conversationId: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  loadMorePosts: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: {
    id: "current",
    displayName: "Vitor Souza",
    handle: "vitorsouza",
    avatar: "https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_400x400.jpg",
    bio: "Software developer. Building cool stuff. 🇧🇷",
    coverPhoto: "https://pbs.twimg.com/profile_banners/44196397/1690621312/1500x500",
    location: "São Paulo, Brasil",
    website: "github.com/vitorsouza",
    joinDate: "March 2020",
    following: 342,
    followers: 1283,
    verified: true,
  },
  posts: [],
  notifications: [],
  conversations: [],
  unreadNotifications: 0,
  unreadMessages: 0,
  activeTab: "for-you",
  composeModalOpen: false,
  imageModalOpen: false,
  imageModalImages: [],
  imageModalIndex: 0,
  toastMessage: null,

  addPost: (post) =>
    set((state) => ({ posts: [post, ...state.posts] })),

  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            liked: !p.liked,
            likes: p.liked ? p.likes - 1 : p.likes + 1,
          };
        }
        if (p.quotedPost && p.quotedPost.id === postId) {
          return {
            ...p,
            quotedPost: {
              ...p.quotedPost,
              liked: !p.quotedPost.liked,
              likes: p.quotedPost.liked ? p.quotedPost.likes - 1 : p.quotedPost.likes + 1,
            },
          };
        }
        return p;
      }),
    })),

  toggleRepost: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            reposted: !p.reposted,
            reposts: p.reposted ? p.reposts - 1 : p.reposts + 1,
          };
        }
        return p;
      }),
    })),

  toggleBookmark: (postId) =>
    set((state) => {
      const post = state.posts.find((p) => p.id === postId);
      const wasBookmarked = post?.bookmarked;
      return {
        posts: state.posts.map((p) =>
          p.id === postId ? { ...p, bookmarked: !p.bookmarked } : p
        ),
        toastMessage: wasBookmarked ? "Removido dos Salvos" : "Adicionado aos Salvos",
      };
    }),

  setActiveTab: (tab) => set({ activeTab: tab }),
  setComposeModalOpen: (open) => set({ composeModalOpen: open }),

  openImageModal: (images, index) =>
    set({ imageModalOpen: true, imageModalImages: images, imageModalIndex: index }),

  closeImageModal: () =>
    set({ imageModalOpen: false, imageModalImages: [], imageModalIndex: 0 }),

  showToast: (message) => set({ toastMessage: message }),
  hideToast: () => set({ toastMessage: null }),

  markNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadNotifications: 0,
    })),

  markConversationRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, unreadCount: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      ),
      unreadMessages: state.conversations.reduce(
        (acc, c) => acc + (c.id === conversationId ? 0 : c.unreadCount),
        0
      ),
    })),

  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, message],
              lastMessage: message.text,
              lastTimestamp: message.timestamp,
            }
          : c
      ),
    })),

  loadMorePosts: () => {
    // Will be called by infinite scroll
  },
}));

import type { Notification } from "../store/useAppStore";
import { mockUsers } from "./mockUsers";
import { subHours, subMinutes, subDays } from "date-fns";

const now = new Date();

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "like",
    user: mockUsers[0],
    timestamp: subMinutes(now, 5),
    postExcerpt: "O futebol brasileiro precisa valorizar mais...",
    postId: "p4",
    read: false,
  },
  {
    id: "n2",
    type: "repost",
    user: mockUsers[1],
    timestamp: subMinutes(now, 30),
    postExcerpt: "Análise tática completa da rodada...",
    postId: "p7",
    read: false,
  },
  {
    id: "n3",
    type: "follow",
    user: mockUsers[4],
    timestamp: subHours(now, 1),
    read: false,
  },
  {
    id: "n4",
    type: "mention",
    user: mockUsers[2],
    timestamp: subHours(now, 3),
    postExcerpt: "@vitorsouza o que você acha do novo reforço?",
    postId: "p3",
    read: false,
  },
  {
    id: "n5",
    type: "like",
    user: mockUsers[5],
    timestamp: subHours(now, 6),
    postExcerpt: "Estatísticas impressionantes da rodada...",
    postId: "p6",
    read: true,
  },
  {
    id: "n6",
    type: "reply",
    user: mockUsers[6],
    timestamp: subHours(now, 8),
    postExcerpt: "Concordo totalmente com a sua análise...",
    postId: "p7",
    read: true,
  },
  {
    id: "n7",
    type: "follow",
    user: mockUsers[3],
    timestamp: subHours(now, 12),
    read: true,
  },
  {
    id: "n8",
    type: "like",
    user: mockUsers[7],
    timestamp: subDays(now, 1),
    postExcerpt: "O novo uniforme ficou incrível...",
    postId: "p8",
    read: true,
  },
  {
    id: "n9",
    type: "repost",
    user: mockUsers[0],
    timestamp: subDays(now, 1),
    postExcerpt: "Thread sobre táticas no Brasileirão...",
    postId: "p7",
    read: true,
  },
  {
    id: "n10",
    type: "mention",
    user: mockUsers[4],
    timestamp: subDays(now, 2),
    postExcerpt: "@vitorsouza vem pro jogo amanhã?",
    postId: "p12",
    read: true,
  },
];

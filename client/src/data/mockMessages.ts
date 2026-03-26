import type { Conversation } from "../store/useAppStore";
import { mockUsers } from "./mockUsers";
import { subHours, subMinutes, subDays } from "date-fns";

const now = new Date();

export const mockConversations: Conversation[] = [
  {
    id: "c1",
    participant: mockUsers[0],
    lastMessage: "Bora jogar uma pelada esse fim de semana? ⚽",
    lastTimestamp: subMinutes(now, 15),
    unreadCount: 2,
    messages: [
      {
        id: "m1-1",
        senderId: mockUsers[0].id,
        text: "E aí, tudo bem?",
        timestamp: subHours(now, 2),
        read: true,
      },
      {
        id: "m1-2",
        senderId: "current",
        text: "Tudo ótimo! E você?",
        timestamp: subHours(now, 1),
        read: true,
      },
      {
        id: "m1-3",
        senderId: mockUsers[0].id,
        text: "Tudo bem! Saudades de jogar",
        timestamp: subMinutes(now, 45),
        read: true,
      },
      {
        id: "m1-4",
        senderId: mockUsers[0].id,
        text: "Bora jogar uma pelada esse fim de semana? ⚽",
        timestamp: subMinutes(now, 15),
        read: false,
      },
    ],
  },
  {
    id: "c2",
    participant: mockUsers[2],
    lastMessage: "Enviamos o convite para a entrevista!",
    lastTimestamp: subHours(now, 3),
    unreadCount: 1,
    messages: [
      {
        id: "m2-1",
        senderId: mockUsers[2].id,
        text: "Olá Vitor! Gostaríamos de fazer uma entrevista com você",
        timestamp: subDays(now, 1),
        read: true,
      },
      {
        id: "m2-2",
        senderId: "current",
        text: "Claro! Seria uma honra",
        timestamp: subHours(now, 20),
        read: true,
      },
      {
        id: "m2-3",
        senderId: mockUsers[2].id,
        text: "Enviamos o convite para a entrevista!",
        timestamp: subHours(now, 3),
        read: false,
      },
    ],
  },
  {
    id: "c3",
    participant: mockUsers[4],
    lastMessage: "🔥🔥🔥",
    lastTimestamp: subDays(now, 1),
    unreadCount: 0,
    messages: [
      {
        id: "m3-1",
        senderId: "current",
        text: "Parabéns pelo gol ontem! Que golaço!",
        timestamp: subDays(now, 2),
        read: true,
      },
      {
        id: "m3-2",
        senderId: mockUsers[4].id,
        text: "Valeu demais mano! 🙏",
        timestamp: subDays(now, 2),
        read: true,
      },
      {
        id: "m3-3",
        senderId: mockUsers[4].id,
        text: "🔥🔥🔥",
        timestamp: subDays(now, 1),
        read: true,
      },
    ],
  },
  {
    id: "c4",
    participant: mockUsers[6],
    lastMessage: "Boa análise! Vou compartilhar",
    lastTimestamp: subDays(now, 3),
    unreadCount: 0,
    messages: [
      {
        id: "m4-1",
        senderId: mockUsers[6].id,
        text: "Vi sua análise do jogo de ontem, muito boa!",
        timestamp: subDays(now, 4),
        read: true,
      },
      {
        id: "m4-2",
        senderId: "current",
        text: "Obrigado! Passei horas analisando os dados",
        timestamp: subDays(now, 3),
        read: true,
      },
      {
        id: "m4-3",
        senderId: mockUsers[6].id,
        text: "Boa análise! Vou compartilhar",
        timestamp: subDays(now, 3),
        read: true,
      },
    ],
  },
];

/**
 * Repository: Teams Forum (Comunidade)
 * Tópicos, respostas e curtidas por time.
 */
import { db } from "../db";
import {
  teamsForumTopics,
  teamsForumReplies,
  teamsForumLikes,
  users,
  teams,
  journalists,
} from "@shared/schema";
import { eq, and, desc, sql, ilike, or, gt, inArray } from "drizzle-orm";
import type { InsertForumTopic, InsertForumReply } from "@shared/schema";

export type ForumTopicCategory = "news" | "pre_match" | "post_match" | "transfer" | "off_topic" | "base";

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
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
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

/** List topics for a team with optional filters */
export async function listForumTopics(
  teamId: string,
  options: {
    category?: ForumTopicCategory;
    search?: string;
    trending?: boolean;
    limit?: number;
    offset?: number;
    viewerUserId?: string | null;
  } = {}
): Promise<ForumTopicWithAuthor[]> {
  const limit = Math.min(options.limit ?? 24, 50);
  const offset = options.offset ?? 0;

  const conditions = [
    eq(teamsForumTopics.teamId, teamId),
    eq(teamsForumTopics.isRemoved, false),
    eq(teamsForumTopics.moderationStatus, "APPROVED"),
  ];

  if (options.category && options.category !== "base") {
    conditions.push(eq(teamsForumTopics.category, options.category));
  }

  if (options.search?.trim()) {
    conditions.push(
      or(
        ilike(teamsForumTopics.title, `%${options.search.trim()}%`),
        ilike(teamsForumTopics.content, `%${options.search.trim()}%`)
      )!
    );
  }

  const orderByClause = options.trending
    ? [desc(teamsForumTopics.isPinned), desc(teamsForumTopics.likesCount), desc(teamsForumTopics.repliesCount), desc(teamsForumTopics.updatedAt)]
    : [desc(teamsForumTopics.isPinned), desc(teamsForumTopics.updatedAt)];

  const rows = await db
    .select({
      topic: teamsForumTopics,
      authorName: users.name,
      authorAvatar: users.avatarUrl,
      authorType: users.userType,
    })
    .from(teamsForumTopics)
    .innerJoin(users, eq(teamsForumTopics.authorId, users.id))
    .where(and(...conditions))
    .orderBy(...orderByClause)
    .limit(limit)
    .offset(offset);

  const topicIds = rows.map((r) => r.topic.id);
  let viewerLikes: Set<string> = new Set();
  if (options.viewerUserId && topicIds.length > 0) {
    const likes = await db
      .select({ topicId: teamsForumLikes.topicId })
      .from(teamsForumLikes)
      .where(
        and(
          eq(teamsForumLikes.userId, options.viewerUserId),
          inArray(teamsForumLikes.topicId, topicIds)
        )
      );
    viewerLikes = new Set(likes.map((l) => l.topicId!).filter(Boolean));
  }

  return rows.map((r) => ({
    id: r.topic.id,
    teamId: r.topic.teamId,
    authorId: r.topic.authorId,
    title: r.topic.title,
    content: r.topic.content,
    category: r.topic.category as ForumTopicCategory,
    coverImageUrl: r.topic.coverImageUrl,
    viewsCount: r.topic.viewsCount,
    likesCount: r.topic.likesCount,
    repliesCount: r.topic.repliesCount,
    createdAt: r.topic.createdAt,
    updatedAt: r.topic.updatedAt,
    isPinned: r.topic.isPinned,
    isLocked: r.topic.isLocked,
    author: {
      id: r.topic.authorId,
      name: r.authorName,
      avatarUrl: r.authorAvatar,
      isJournalist: r.authorType === "JOURNALIST",
      isAdmin: r.authorType === "ADMIN",
    },
    viewerHasLiked: viewerLikes.has(r.topic.id),
  }));
}

/** Get single topic by id (must belong to teamId) */
export async function getForumTopicById(
  topicId: string,
  teamId: string,
  options: { viewerUserId?: string | null; incrementView?: boolean } = {}
): Promise<ForumTopicWithAuthor | null> {
  const [row] = await db
    .select({
      topic: teamsForumTopics,
      authorName: users.name,
      authorAvatar: users.avatarUrl,
      authorType: users.userType,
    })
    .from(teamsForumTopics)
    .innerJoin(users, eq(teamsForumTopics.authorId, users.id))
    .where(
      and(
        eq(teamsForumTopics.id, topicId),
        eq(teamsForumTopics.teamId, teamId),
        eq(teamsForumTopics.isRemoved, false)
      )
    );

  if (!row) return null;

  if (options.incrementView) {
    await db
      .update(teamsForumTopics)
      .set({ viewsCount: sql`${teamsForumTopics.viewsCount} + 1` })
      .where(eq(teamsForumTopics.id, topicId));
  }

  let viewerHasLiked = false;
  if (options.viewerUserId) {
    const [like] = await db
      .select()
      .from(teamsForumLikes)
      .where(
        and(
          eq(teamsForumLikes.userId, options.viewerUserId),
          eq(teamsForumLikes.topicId, topicId)
        )
      );
    viewerHasLiked = !!like;
  }

  return {
    id: row.topic.id,
    teamId: row.topic.teamId,
    authorId: row.topic.authorId,
    title: row.topic.title,
    content: row.topic.content,
    category: row.topic.category as ForumTopicCategory,
    coverImageUrl: row.topic.coverImageUrl,
    viewsCount: row.topic.viewsCount + (options.incrementView ? 1 : 0),
    likesCount: row.topic.likesCount,
    repliesCount: row.topic.repliesCount,
    createdAt: row.topic.createdAt,
    updatedAt: row.topic.updatedAt,
    isPinned: row.topic.isPinned,
    isLocked: row.topic.isLocked,
    author: {
      id: row.topic.authorId,
      name: row.authorName,
      avatarUrl: row.authorAvatar,
      isJournalist: row.authorType === "JOURNALIST",
      isAdmin: row.authorType === "ADMIN",
    },
    viewerHasLiked,
  };
}

/** Create topic */
export async function createForumTopic(
  teamId: string,
  authorId: string,
  data: { title: string; content: string; category?: ForumTopicCategory; coverImageUrl?: string | null }
): Promise<ForumTopicWithAuthor> {
  const [topic] = await db
    .insert(teamsForumTopics)
    .values({
      teamId,
      authorId,
      title: data.title,
      content: data.content,
      category: (data.category ?? "base") as any,
      coverImageUrl: data.coverImageUrl ?? null,
    })
    .returning();

  const [user] = await db.select().from(users).where(eq(users.id, authorId));
  return {
    id: topic.id,
    teamId: topic.teamId,
    authorId: topic.authorId,
    title: topic.title,
    content: topic.content,
    category: topic.category as ForumTopicCategory,
    coverImageUrl: topic.coverImageUrl,
    viewsCount: topic.viewsCount,
    likesCount: topic.likesCount,
    repliesCount: topic.repliesCount,
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
    isPinned: topic.isPinned,
    isLocked: topic.isLocked,
    author: {
      id: topic.authorId,
      name: user?.name ?? "Anônimo",
      avatarUrl: user?.avatarUrl ?? null,
      isJournalist: user?.userType === "JOURNALIST",
      isAdmin: user?.userType === "ADMIN",
    },
  };
}

/** List replies for a topic */
export async function listForumReplies(
  topicId: string,
  options: { viewerUserId?: string | null; limit?: number; offset?: number } = {}
): Promise<ForumReplyWithAuthor[]> {
  const limit = Math.min(options.limit ?? 50, 100);
  const offset = options.offset ?? 0;

  const rows = await db
    .select({
      reply: teamsForumReplies,
      authorName: users.name,
      authorAvatar: users.avatarUrl,
      authorType: users.userType,
    })
    .from(teamsForumReplies)
    .innerJoin(users, eq(teamsForumReplies.authorId, users.id))
    .where(eq(teamsForumReplies.topicId, topicId))
    .orderBy(teamsForumReplies.createdAt)
    .limit(limit)
    .offset(offset);

  let viewerLikes: Set<string> = new Set();
  if (options.viewerUserId && rows.length > 0) {
    const replyIds = rows.map((r) => r.reply.id);
    const likes = await db
      .select({ replyId: teamsForumLikes.replyId })
      .from(teamsForumLikes)
      .where(
        and(
          eq(teamsForumLikes.userId, options.viewerUserId),
          inArray(teamsForumLikes.replyId, replyIds)
        )
      );
    viewerLikes = new Set(likes.map((l) => l.replyId!).filter(Boolean));
  }

  return rows.map((r) => ({
    id: r.reply.id,
    topicId: r.reply.topicId,
    authorId: r.reply.authorId,
    content: r.reply.content,
    likesCount: r.reply.likesCount,
    createdAt: r.reply.createdAt,
    author: {
      id: r.reply.authorId,
      name: r.authorName,
      avatarUrl: r.authorAvatar,
      isJournalist: r.authorType === "JOURNALIST",
      isAdmin: r.authorType === "ADMIN",
    },
    viewerHasLiked: viewerLikes.has(r.reply.id),
  }));
}

/** Create reply */
export async function createForumReply(
  topicId: string,
  authorId: string,
  content: string
): Promise<ForumReplyWithAuthor> {
  const [reply] = await db
    .insert(teamsForumReplies)
    .values({ topicId, authorId, content })
    .returning();

  await db
    .update(teamsForumTopics)
    .set({
      repliesCount: sql`${teamsForumTopics.repliesCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(teamsForumTopics.id, topicId));

  const [user] = await db.select().from(users).where(eq(users.id, authorId));
  return {
    id: reply.id,
    topicId: reply.topicId,
    authorId: reply.authorId,
    content: reply.content,
    likesCount: reply.likesCount,
    createdAt: reply.createdAt,
    author: {
      id: reply.authorId,
      name: user?.name ?? "Anônimo",
      avatarUrl: user?.avatarUrl ?? null,
      isJournalist: user?.userType === "JOURNALIST",
      isAdmin: user?.userType === "ADMIN",
    },
  };
}

/** Toggle like on topic */
export async function toggleForumTopicLike(
  topicId: string,
  userId: string
): Promise<{ liked: boolean; likesCount: number }> {
  const [existing] = await db
    .select()
    .from(teamsForumLikes)
    .where(
      and(
        eq(teamsForumLikes.userId, userId),
        eq(teamsForumLikes.topicId, topicId)
      )
    );

  if (existing) {
    await db
      .delete(teamsForumLikes)
      .where(
        and(
          eq(teamsForumLikes.userId, userId),
          eq(teamsForumLikes.topicId, topicId)
        )
      );
    await db
      .update(teamsForumTopics)
      .set({ likesCount: sql`GREATEST(0, ${teamsForumTopics.likesCount} - 1)` })
      .where(eq(teamsForumTopics.id, topicId));
    const [topic] = await db.select({ likesCount: teamsForumTopics.likesCount }).from(teamsForumTopics).where(eq(teamsForumTopics.id, topicId));
    return { liked: false, likesCount: Math.max(0, (topic?.likesCount ?? 1) - 1) };
  } else {
    await db.insert(teamsForumLikes).values({ userId, topicId });
    await db
      .update(teamsForumTopics)
      .set({ likesCount: sql`${teamsForumTopics.likesCount} + 1` })
      .where(eq(teamsForumTopics.id, topicId));
    const [topic] = await db.select({ likesCount: teamsForumTopics.likesCount }).from(teamsForumTopics).where(eq(teamsForumTopics.id, topicId));
    return { liked: true, likesCount: (topic?.likesCount ?? 0) + 1 };
  }
}

/** Get reply's topic teamId for authorization */
export async function getForumReplyTeamId(replyId: string): Promise<string | null> {
  const [row] = await db
    .select({ teamId: teamsForumTopics.teamId })
    .from(teamsForumReplies)
    .innerJoin(teamsForumTopics, eq(teamsForumReplies.topicId, teamsForumTopics.id))
    .where(eq(teamsForumReplies.id, replyId));
  return row?.teamId ?? null;
}

/** Toggle like on reply */
export async function toggleForumReplyLike(
  replyId: string,
  userId: string
): Promise<{ liked: boolean; likesCount: number }> {
  const [existing] = await db
    .select()
    .from(teamsForumLikes)
    .where(
      and(
        eq(teamsForumLikes.userId, userId),
        eq(teamsForumLikes.replyId, replyId)
      )
    );

  if (existing) {
    await db
      .delete(teamsForumLikes)
      .where(
        and(
          eq(teamsForumLikes.userId, userId),
          eq(teamsForumLikes.replyId, replyId)
        )
      );
    await db
      .update(teamsForumReplies)
      .set({ likesCount: sql`GREATEST(0, ${teamsForumReplies.likesCount} - 1)` })
      .where(eq(teamsForumReplies.id, replyId));
    const [reply] = await db.select({ likesCount: teamsForumReplies.likesCount }).from(teamsForumReplies).where(eq(teamsForumReplies.id, replyId));
    return { liked: false, likesCount: Math.max(0, (reply?.likesCount ?? 1) - 1) };
  } else {
    await db.insert(teamsForumLikes).values({ userId, replyId });
    await db
      .update(teamsForumReplies)
      .set({ likesCount: sql`${teamsForumReplies.likesCount} + 1` })
      .where(eq(teamsForumReplies.id, replyId));
    const [reply] = await db.select({ likesCount: teamsForumReplies.likesCount }).from(teamsForumReplies).where(eq(teamsForumReplies.id, replyId));
    return { liked: true, likesCount: (reply?.likesCount ?? 0) + 1 };
  }
}

/** Get forum stats for a team */
export async function getForumStats(teamId: string): Promise<ForumStats> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [totalTopics] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(teamsForumTopics)
    .where(
      and(
        eq(teamsForumTopics.teamId, teamId),
        eq(teamsForumTopics.isRemoved, false)
      )
    );

  const [totalReplies] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(teamsForumReplies)
    .innerJoin(teamsForumTopics, eq(teamsForumReplies.topicId, teamsForumTopics.id))
    .where(
      and(
        eq(teamsForumTopics.teamId, teamId),
        eq(teamsForumTopics.isRemoved, false)
      )
    );

  const trendingRows = await db
    .selectDistinct({ topicId: teamsForumTopics.id })
    .from(teamsForumTopics)
    .innerJoin(teamsForumReplies, eq(teamsForumReplies.topicId, teamsForumTopics.id))
    .where(
      and(
        eq(teamsForumTopics.teamId, teamId),
        eq(teamsForumTopics.isRemoved, false),
        gt(teamsForumReplies.createdAt, oneDayAgo)
      )
    );
  const trendingCount = trendingRows.length;

  return {
    totalTopics: totalTopics?.count ?? 0,
    totalReplies: totalReplies?.count ?? 0,
    trendingCount,
  };
}

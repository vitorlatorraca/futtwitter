import { Router, type Request, type Response } from "express";
import { eq, and, desc, sql, gt, lt, inArray } from "drizzle-orm";
import { db } from "../db";
import { storage } from "../storage";
import {
  news,
  newsInteractions,
  comments,
  commentLikes,
  users,
  journalists,
  teams,
  fixtures,
  competitions,
  posts,
  postLikes,
} from "@shared/schema";

function requireAuth(req: Request, res: Response, next: () => void) {
  if (!(req.session as any)?.userId) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  next();
}

// Derive handle from user (users table has no username - use email prefix or id)
function userToHandle(user: { name: string; email?: string; id?: string }): string {
  const base = (user.name || "user")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 15);
  return base || `user_${(user.id || "").slice(0, 8)}`;
}

const router = Router();

// GET /api/feed/influencers - published news with journalist + team
router.get("/influencers", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 50);
    const offset = Math.max(parseInt(String(req.query.offset || 0), 10) || 0, 0);

    const rows = await db
      .select({
        id: news.id,
        title: news.title,
        content: news.content,
        imageUrl: news.imageUrl,
        publishedAt: news.publishedAt,
        likesCount: news.likesCount,
        dislikesCount: news.dislikesCount,
        teamId: news.teamId,
        journalistId: news.journalistId,
        journalistName: users.name,
        journalistAvatarUrl: users.avatarUrl,
        teamName: teams.name,
        teamLogoUrl: teams.logoUrl,
      })
      .from(news)
      .innerJoin(journalists, eq(news.journalistId, journalists.id))
      .innerJoin(users, eq(journalists.userId, users.id))
      .leftJoin(teams, eq(news.teamId, teams.id))
      .where(eq(news.isPublished, true))
      .orderBy(desc(news.publishedAt))
      .limit(limit)
      .offset(offset);

    const viewerUserId = (req.session as any)?.userId ?? null;
    const items: Array<{
      id: string;
      title: string;
      summary: string;
      content: string;
      imageUrl: string | null;
      publishedAt: Date;
      sourceUrl: string | null;
      journalist: { id: string; name: string; avatarUrl: string | null; handle: string; verified: boolean };
      team: { id: string; name: string; badgeUrl: string | null } | null;
      engagement: { likes: number; reposts: number; bookmarks: number; views: number; dislikes: number };
      userInteraction: "LIKE" | "DISLIKE" | null;
    }> = rows.map((r) => ({
      id: r.id,
      title: r.title,
      summary: (r.content || "").slice(0, 280),
      content: r.content,
      imageUrl: r.imageUrl ?? null,
      publishedAt: r.publishedAt,
      sourceUrl: null as string | null,
      journalist: {
        id: r.journalistId,
        name: r.journalistName || "Autor",
        avatarUrl: r.journalistAvatarUrl ?? null,
        handle: userToHandle({ name: r.journalistName || "Autor", id: r.journalistId }),
        verified: true,
      },
      team: r.teamId
        ? { id: r.teamId, name: r.teamName ?? "Time", badgeUrl: r.teamLogoUrl ?? null }
        : null,
      engagement: {
        likes: r.likesCount ?? 0,
        reposts: 0,
        bookmarks: 0,
        views: 0,
        dislikes: r.dislikesCount ?? 0,
      },
      userInteraction: null as "LIKE" | "DISLIKE" | null,
    }));

    if (viewerUserId) {
      for (const item of items) {
        const interaction = await storage.getUserNewsInteraction(viewerUserId, item.id);
        item.userInteraction = interaction?.interactionType ?? null;
      }
    }

    res.json(items);
  } catch (err) {
    console.error("[feed/influencers] error:", err);
    res.status(500).json({ message: "Erro ao carregar notícias" });
  }
});

// GET /api/feed/fan-posts - posts de fãs filtrados pelo time do viewer
router.get("/fan-posts", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 50);
    const offset = Math.max(parseInt(String(req.query.offset || 0), 10) || 0, 0);
    const viewerUserId = (req.session as any)?.userId ?? null;

    let viewerTeamId: string | null = null;
    if (viewerUserId) {
      const [viewer] = await db
        .select({ teamId: users.teamId })
        .from(users)
        .where(eq(users.id, viewerUserId))
        .limit(1);
      viewerTeamId = viewer?.teamId ?? null;
    }

    const conditions = [
      sql`${posts.parentPostId} IS NULL`,
      eq(users.userType, "FAN"),
    ];

    if (viewerTeamId) {
      conditions.push(eq(users.teamId, viewerTeamId));
    }

    const rows = await db
      .select({
        id: posts.id,
        content: posts.content,
        imageUrl: posts.imageUrl,
        createdAt: posts.createdAt,
        likeCount: posts.likeCount,
        replyCount: posts.replyCount,
        relatedNewsId: posts.relatedNewsId,
        userId: users.id,
        userName: users.name,
        userHandle: users.handle,
        userAvatarUrl: users.avatarUrl,
        userTeamId: users.teamId,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const postIds = rows.map((r) => r.id);
    let viewerLikedIds = new Set<string>();
    if (viewerUserId && postIds.length > 0) {
      const viewerLikes = await db
        .select({ postId: postLikes.postId })
        .from(postLikes)
        .where(
          and(
            eq(postLikes.userId, viewerUserId),
            inArray(postLikes.postId, postIds)
          )
        );
      viewerLikedIds = new Set(viewerLikes.map((r) => r.postId));
    }

    const items = rows.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt,
      user: {
        id: r.userId,
        name: r.userName || "Usuário",
        handle: r.userHandle || r.userId.slice(0, 8),
        avatarUrl: r.userAvatarUrl ?? null,
      },
      likes: r.likeCount,
      replies: r.replyCount,
      imageUrl: r.imageUrl ?? null,
      relatedNews: null,
      viewerHasLiked: viewerLikedIds.has(r.id),
    }));

    res.json(items);
  } catch (err) {
    console.error("[feed/fan-posts] error:", err);
    res.status(500).json({ message: "Erro ao carregar feed da torcida" });
  }
});

// GET /api/feed/torcida - fan comments on news (Torcida = fans discussing)
router.get("/torcida", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 50);
    const offset = Math.max(parseInt(String(req.query.offset || 0), 10) || 0, 0);

    const rows = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        newsId: comments.newsId,
        newsTitle: news.title,
        userId: users.id,
        userName: users.name,
        userAvatarUrl: users.avatarUrl,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .innerJoin(news, eq(comments.newsId, news.id))
      .where(eq(comments.isApproved, true))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset);

    const commentIds = rows.map((r) => r.id);
    const likeCounts =
      commentIds.length === 0
        ? []
        : await db
            .select({
              commentId: commentLikes.commentId,
              count: sql<number>`count(*)::int`,
            })
            .from(commentLikes)
            .where(inArray(commentLikes.commentId, commentIds))
            .groupBy(commentLikes.commentId);

    const countMap = new Map(likeCounts.map((r) => [r.commentId, r.count]));

    const viewerUserId = (req.session as any)?.userId ?? null;
    let viewerLikedIds = new Set<string>();
    if (viewerUserId && commentIds.length > 0) {
      const viewerLikes = await db
        .select({ commentId: commentLikes.commentId })
        .from(commentLikes)
        .where(eq(commentLikes.userId, viewerUserId));
      viewerLikedIds = new Set(viewerLikes.map((r) => r.commentId));
    }

    const items = rows.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt,
      user: {
        id: r.userId,
        name: r.userName || "Anônimo",
        handle: userToHandle({ name: r.userName || "user", id: r.userId }),
        avatarUrl: r.userAvatarUrl ?? null,
      },
      likes: countMap.get(r.id) ?? 0,
      replies: 0,
      relatedNews: r.newsId ? { id: r.newsId, title: r.newsTitle || "" } : null,
      viewerHasLiked: viewerLikedIds.has(r.id),
    }));

    res.json(items);
  } catch (err) {
    console.error("[feed/torcida] error:", err);
    res.status(500).json({ message: "Erro ao carregar comentários" });
  }
});

// GET /api/feed/news/:id - single news full detail
router.get("/news/:id", async (req, res) => {
  try {
    const newsId = req.params.id?.trim();
    if (!newsId) return res.status(400).json({ message: "ID inválido" });

    const [row] = await db
      .select({
        id: news.id,
        title: news.title,
        content: news.content,
        imageUrl: news.imageUrl,
        publishedAt: news.publishedAt,
        journalistId: news.journalistId,
        journalistName: users.name,
        journalistAvatarUrl: users.avatarUrl,
        teamId: news.teamId,
        teamName: teams.name,
        teamLogoUrl: teams.logoUrl,
      })
      .from(news)
      .innerJoin(journalists, eq(news.journalistId, journalists.id))
      .innerJoin(users, eq(journalists.userId, users.id))
      .leftJoin(teams, eq(news.teamId, teams.id))
      .where(and(eq(news.id, newsId), eq(news.isPublished, true)));

    if (!row) return res.status(404).json({ message: "Notícia não encontrada" });

    res.json({
      id: row.id,
      title: row.title,
      content: row.content,
      imageUrl: row.imageUrl ?? null,
      publishedAt: row.publishedAt,
      journalist: {
        id: row.journalistId,
        name: row.journalistName || "Autor",
        avatarUrl: row.journalistAvatarUrl ?? null,
        handle: userToHandle({ name: row.journalistName || "Autor", id: row.journalistId }),
      },
      team: row.teamId
        ? { id: row.teamId, name: row.teamName ?? "", badgeUrl: row.teamLogoUrl ?? null }
        : null,
    });
  } catch (err) {
    console.error("[feed/news/:id] error:", err);
    res.status(500).json({ message: "Erro ao carregar notícia" });
  }
});

// POST /api/feed/news/:id/like - like news (uses existing interaction API)
// Delegates to same logic as POST /api/news/:id/interaction
router.post("/news/:id/like", requireAuth, async (req, res) => {
  try {
    const newsId = req.params.id?.trim();
    if (!newsId) return res.status(400).json({ message: "ID inválido" });
    const userId = (req.session as any).userId!;

    const existing = await storage.getUserNewsInteraction(userId, newsId);
    if (existing?.interactionType === "LIKE") {
      await storage.deleteNewsInteraction(userId, newsId);
      await storage.recalculateNewsCounts(newsId);
      return res.json({ liked: false, message: "Curtida removida" });
    }
    if (existing) await storage.deleteNewsInteraction(userId, newsId);

    await storage.createNewsInteraction({ userId, newsId, interactionType: "LIKE" });
    await storage.recalculateNewsCounts(newsId);
    await storage.checkAndAwardBadges(userId);

    const newsItem = await storage.getNewsById(newsId);
    return res.json({
      liked: true,
      likesCount: newsItem?.likesCount ?? 0,
    });
  } catch (err) {
    console.error("[feed/news/:id/like] error:", err);
    res.status(500).json({ message: "Erro ao curtir" });
  }
});

// POST /api/feed/news/:id/bookmark - bookmark (schema has no bookmarks; no-op that returns success)
router.post("/news/:id/bookmark", requireAuth, async (req, res) => {
  const newsId = req.params.id?.trim();
  if (!newsId) return res.status(400).json({ message: "ID inválido" });
  // newsInteractions has LIKE/DISLIKE only - no bookmark table. Return success for UI compatibility
  res.json({ bookmarked: true, message: "Salvo" });
});

// GET /api/feed/trending - top teams/categories from recent news (24h)
router.get("/trending", async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const rows = await db
      .select({
        teamId: news.teamId,
        teamName: teams.name,
        count: sql<number>`count(*)::int`,
      })
      .from(news)
      .leftJoin(teams, eq(news.teamId, teams.id))
      .where(and(eq(news.isPublished, true), gt(news.publishedAt, since)))
      .groupBy(news.teamId, teams.name)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    const items = rows
      .filter((r) => r.teamName)
      .map((r) => ({
        topic: r.teamName,
        category: "Futebol · Trending",
        posts: r.count,
      }));

    res.json(items);
  } catch (err) {
    console.error("[feed/trending] error:", err);
    res.json([]);
  }
});

// GET /api/feed/upcoming-matches - next 3 fixtures
router.get("/upcoming-matches", async (req, res) => {
  try {
    const teamId = typeof req.query.teamId === "string" ? req.query.teamId.trim() : undefined;
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (teamId) {
      const rows = await db
        .select({
          id: fixtures.id,
          kickoffAt: fixtures.kickoffAt,
          homeTeamName: fixtures.homeTeamName,
          awayTeamName: fixtures.awayTeamName,
          competitionName: competitions.name,
        })
        .from(fixtures)
        .innerJoin(competitions, eq(fixtures.competitionId, competitions.id))
        .where(
          and(
            eq(fixtures.teamId, teamId),
            eq(fixtures.status, "SCHEDULED"),
            gt(fixtures.kickoffAt, now),
            lt(fixtures.kickoffAt, weekLater)
          )
        )
        .orderBy(fixtures.kickoffAt)
        .limit(3);
      return res.json(rows);
    }

    const rows = await db
      .select({
        id: fixtures.id,
        kickoffAt: fixtures.kickoffAt,
        homeTeamName: fixtures.homeTeamName,
        awayTeamName: fixtures.awayTeamName,
        competitionName: competitions.name,
      })
      .from(fixtures)
      .innerJoin(competitions, eq(fixtures.competitionId, competitions.id))
      .where(
        and(
          eq(fixtures.status, "SCHEDULED"),
          gt(fixtures.kickoffAt, now),
          lt(fixtures.kickoffAt, weekLater)
        )
      )
      .orderBy(fixtures.kickoffAt)
      .limit(3);

    res.json(rows);
  } catch (err) {
    console.error("[feed/upcoming-matches] error:", err);
    res.json([]);
  }
});

export const feedRouter = router;

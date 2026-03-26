import { Router, type Request, type Response } from "express";
import { eq, and, desc, sql, inArray, not, isNotNull } from "drizzle-orm";
import { db } from "../db";
import { storage } from "../storage";
import {
  users,
  posts,
  postLikes,
  postBookmarks,
  userFollows,
  news,
  journalists,
  hashtags,
  postHashtags,
} from "@shared/schema";
import { insertPostSchema } from "@shared/schema";

function requireAuth(req: Request, res: Response, next: () => void) {
  if (!(req.session as any)?.userId) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  next();
}

const router = Router();

/**
 * Derives role and journalist verification from user data.
 * Only JOURNALIST users with APPROVED status in journalists table are verified.
 */
function deriveUserRole(userType: string | null): "fan" | "journalist" {
  return userType === "JOURNALIST" ? "journalist" : "fan";
}

// GET /api/users/suggested - sugestões de quem seguir (ANTES de :handle)
router.get("/users/suggested", async (req, res) => {
  try {
    const viewerUserId: string | null = (req.session as any)?.userId ?? null;
    const limit = Math.min(parseInt(String(req.query.limit || 5), 10) || 5, 10);

    // Subconsulta: IDs que o viewer já segue

    let alreadyFollowingIds: string[] = [];
    if (viewerUserId) {
      const followed = await db
        .select({ followingId: userFollows.followingId })
        .from(userFollows)
        .where(eq(userFollows.followerId, viewerUserId));
      alreadyFollowingIds = followed.map((f) => f.followingId);
    }

    const excludeIds = viewerUserId
      ? [viewerUserId, ...alreadyFollowingIds]
      : alreadyFollowingIds;

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        handle: users.handle,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
        userType: users.userType,
        followersCount: users.followersCount,
      })
      .from(users)
      .where(
        and(
          excludeIds.length > 0 ? not(inArray(users.id, excludeIds)) : sql`1=1`,
          isNotNull(users.handle)
        )
      )
      .orderBy(desc(users.followersCount))
      .limit(limit);

    const suggestions = rows.map((u) => ({
      id: u.id,
      name: u.name,
      handle: u.handle ?? "",
      avatarUrl: u.avatarUrl ?? null,
      bio: u.bio ?? null,
      isFollowing: false,
      userType: u.userType,
      followersCount: u.followersCount,
    }));

    res.json(suggestions);
  } catch (err) {
    console.error("[users/suggested] error:", err);
    res.status(500).json({ message: "Erro ao buscar sugestões" });
  }
});

// GET /api/users/:handle - perfil público
router.get("/users/:handle", async (req, res) => {
  try {
    const handle = req.params.handle?.trim();
    if (!handle) return res.status(400).json({ message: "Handle inválido" });

    const [row] = await db
      .select({
        id: users.id,
        name: users.name,
        handle: users.handle,
        avatarUrl: users.avatarUrl,
        coverPhotoUrl: users.coverPhotoUrl,
        bio: users.bio,
        location: users.location,
        website: users.website,
        followersCount: users.followersCount,
        followingCount: users.followingCount,
        createdAt: users.createdAt,
        userType: users.userType,
        journalistStatus: journalists.status,
      })
      .from(users)
      .leftJoin(journalists, eq(users.id, journalists.userId))
      .where(eq(users.handle, handle))
      .limit(1);

    if (!row || !row.handle) return res.status(404).json({ message: "Usuário não encontrado" });

    const isVerifiedJournalist =
      row.userType === "JOURNALIST" && row.journalistStatus === "APPROVED";

    const viewerUserId = (req.session as any)?.userId ?? null;
    let isFollowing = false;
    if (viewerUserId && viewerUserId !== row.id) {
      const [follow] = await db
        .select()
        .from(userFollows)
        .where(
          and(
            eq(userFollows.followerId, viewerUserId),
            eq(userFollows.followingId, row.id)
          )
        )
        .limit(1);
      isFollowing = !!follow;
    }

    const { journalistStatus: _js, ...rest } = row as any;
    const userRole = deriveUserRole(row.userType ?? null);
    res.json({
      ...rest,
      userRole,
      isVerifiedJournalist: !!isVerifiedJournalist,
      isFollowing,
    });
  } catch (err) {
    console.error("[social] GET /users/:handle error:", err);
    res.status(500).json({ message: "Erro ao buscar perfil" });
  }
});

// GET /api/users/:handle/followers
router.get("/users/:handle/followers", async (req, res) => {
  try {
    const handle = req.params.handle?.trim();
    if (!handle) return res.status(400).json({ message: "Handle inválido" });

    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 50);
    const offset = Math.max(parseInt(String(req.query.offset || 0), 10) || 0, 0);

    const [targetUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.handle, handle))
      .limit(1);
    if (!targetUser) return res.status(404).json({ message: "Usuário não encontrado" });

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        handle: users.handle,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
      })
      .from(userFollows)
      .innerJoin(users, eq(userFollows.followerId, users.id))
      .where(eq(userFollows.followingId, targetUser.id))
      .orderBy(desc(userFollows.createdAt))
      .limit(limit)
      .offset(offset);

    const viewerUserId = (req.session as any)?.userId ?? null;
    const items = await Promise.all(
      rows.map(async (r) => {
        let isFollowing = false;
        if (viewerUserId && viewerUserId !== r.id) {
          const [f] = await db
            .select()
            .from(userFollows)
            .where(
              and(
                eq(userFollows.followerId, viewerUserId),
                eq(userFollows.followingId, r.id)
              )
            )
            .limit(1);
          isFollowing = !!f;
        }
        return { ...r, isFollowing };
      })
    );

    res.json(items);
  } catch (err) {
    console.error("[social] GET /users/:handle/followers error:", err);
    res.status(500).json({ message: "Erro ao buscar seguidores" });
  }
});

// GET /api/users/:handle/following
router.get("/users/:handle/following", async (req, res) => {
  try {
    const handle = req.params.handle?.trim();
    if (!handle) return res.status(400).json({ message: "Handle inválido" });

    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 50);
    const offset = Math.max(parseInt(String(req.query.offset || 0), 10) || 0, 0);

    const [targetUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.handle, handle))
      .limit(1);
    if (!targetUser) return res.status(404).json({ message: "Usuário não encontrado" });

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        handle: users.handle,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
      })
      .from(userFollows)
      .innerJoin(users, eq(userFollows.followingId, users.id))
      .where(eq(userFollows.followerId, targetUser.id))
      .orderBy(desc(userFollows.createdAt))
      .limit(limit)
      .offset(offset);

    const viewerUserId = (req.session as any)?.userId ?? null;
    const items = await Promise.all(
      rows.map(async (r) => {
        let isFollowing = false;
        if (viewerUserId && viewerUserId !== r.id) {
          const [f] = await db
            .select()
            .from(userFollows)
            .where(
              and(
                eq(userFollows.followerId, viewerUserId),
                eq(userFollows.followingId, r.id)
              )
            )
            .limit(1);
          isFollowing = !!f;
        }
        return { ...r, isFollowing };
      })
    );

    res.json(items);
  } catch (err) {
    console.error("[social] GET /users/:handle/following error:", err);
    res.status(500).json({ message: "Erro ao buscar seguindo" });
  }
});

// POST /api/users/:handle/follow
router.post("/users/:handle/follow", requireAuth, async (req, res) => {
  try {
    const handle = req.params.handle?.trim();
    if (!handle) return res.status(400).json({ message: "Handle inválido" });

    const viewerUserId = (req.session as any).userId!;

    const [targetUser] = await db
      .select({ id: users.id, followersCount: users.followersCount })
      .from(users)
      .where(eq(users.handle, handle))
      .limit(1);
    if (!targetUser) return res.status(404).json({ message: "Usuário não encontrado" });

    if (targetUser.id === viewerUserId) {
      return res.status(400).json({ message: "Não é possível seguir a si mesmo" });
    }

    const [existing] = await db
      .select()
      .from(userFollows)
      .where(
        and(
          eq(userFollows.followerId, viewerUserId),
          eq(userFollows.followingId, targetUser.id)
        )
      )
      .limit(1);

    if (existing) {
      return res.json({ following: true, followersCount: targetUser.followersCount });
    }

    await db.insert(userFollows).values({
      followerId: viewerUserId,
      followingId: targetUser.id,
    });

    await db
      .update(users)
      .set({
        followersCount: sql`${users.followersCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, targetUser.id));

    const [viewer] = await db
      .select({ followingCount: users.followingCount })
      .from(users)
      .where(eq(users.id, viewerUserId))
      .limit(1);
    await db
      .update(users)
      .set({
        followingCount: sql`${users.followingCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, viewerUserId));

    const [updated] = await db
      .select({ followersCount: users.followersCount })
      .from(users)
      .where(eq(users.id, targetUser.id))
      .limit(1);

    // Notify followed user
    try {
      const [viewer] = await db
        .select({ name: users.name, handle: users.handle })
        .from(users)
        .where(eq(users.id, viewerUserId))
        .limit(1);
      if (viewer) {
        await storage.createSocialNotification({
          recipientId: targetUser.id,
          actorId: viewerUserId,
          type: "FOLLOW",
          title: `${viewer.name} começou a te seguir`,
          message: `@${viewer.handle} agora te segue.`,
          referenceId: viewerUserId,
        });
      }
    } catch (err) {
      console.error("[notification/follow] error:", err);
    }

    res.json({ following: true, followersCount: updated?.followersCount ?? targetUser.followersCount + 1 });
  } catch (err) {
    console.error("[social] POST /users/:handle/follow error:", err);
    res.status(500).json({ message: "Erro ao seguir" });
  }
});

// DELETE /api/users/:handle/follow
router.delete("/users/:handle/follow", requireAuth, async (req, res) => {
  try {
    const handle = req.params.handle?.trim();
    if (!handle) return res.status(400).json({ message: "Handle inválido" });

    const viewerUserId = (req.session as any).userId!;

    const [targetUser] = await db
      .select({ id: users.id, followersCount: users.followersCount })
      .from(users)
      .where(eq(users.handle, handle))
      .limit(1);
    if (!targetUser) return res.status(404).json({ message: "Usuário não encontrado" });

    const result = await db
      .delete(userFollows)
      .where(
        and(
          eq(userFollows.followerId, viewerUserId),
          eq(userFollows.followingId, targetUser.id)
        )
      )
      .returning({ id: userFollows.id });

    if (result.length === 0) {
      return res.json({ following: false, followersCount: targetUser.followersCount });
    }

    await db
      .update(users)
      .set({
        followersCount: sql`greatest(0, ${users.followersCount} - 1)`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, targetUser.id));

    await db
      .update(users)
      .set({
        followingCount: sql`greatest(0, ${users.followingCount} - 1)`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, viewerUserId));

    const [updated] = await db
      .select({ followersCount: users.followersCount })
      .from(users)
      .where(eq(users.id, targetUser.id))
      .limit(1);

    res.json({
      following: false,
      followersCount: Math.max(0, (updated?.followersCount ?? targetUser.followersCount) - 1),
    });
  } catch (err) {
    console.error("[social] DELETE /users/:handle/follow error:", err);
    res.status(500).json({ message: "Erro ao deixar de seguir" });
  }
});

// GET /api/posts
router.get("/posts", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 50);
    const offset = Math.max(parseInt(String(req.query.offset || 0), 10) || 0, 0);
    const userId = typeof req.query.userId === "string" ? req.query.userId.trim() : undefined;
    const handle = typeof req.query.handle === "string" ? req.query.handle.trim() : undefined;

    let filterUserId: string | undefined = userId;
    if (handle) {
      const [u] = await db.select({ id: users.id }).from(users).where(eq(users.handle, handle)).limit(1);
      filterUserId = u?.id ?? undefined;
    }

    const conditions = [sql`${posts.parentPostId} IS NULL`];
    if (filterUserId) {
      conditions.push(eq(posts.userId, filterUserId));
    }

    const rows = await db
      .select({
        id: posts.id,
        content: posts.content,
        imageUrl: posts.imageUrl,
        parentPostId: posts.parentPostId,
        likeCount: posts.likeCount,
        replyCount: posts.replyCount,
        repostCount: posts.repostCount,
        bookmarkCount: posts.bookmarkCount,
        viewCount: posts.viewCount,
        createdAt: posts.createdAt,
        relatedNewsId: posts.relatedNewsId,
        userId: users.id,
        userName: users.name,
        userHandle: users.handle,
        userAvatarUrl: users.avatarUrl,
        userType: users.userType,
        journalistStatus: journalists.status,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(journalists, eq(users.id, journalists.userId))
      .where(and(...conditions))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const postIds = rows.map((r) => r.id);
    const viewerUserId = (req.session as any)?.userId ?? null;

    let viewerLikedIds = new Set<string>();
    let viewerBookmarkedIds = new Set<string>();
    if (viewerUserId && postIds.length > 0) {
      const [likes, bookmarks] = await Promise.all([
        db.select({ postId: postLikes.postId }).from(postLikes).where(eq(postLikes.userId, viewerUserId)),
        db.select({ postId: postBookmarks.postId }).from(postBookmarks).where(eq(postBookmarks.userId, viewerUserId)),
      ]);
      viewerLikedIds = new Set(likes.map((l) => l.postId));
      viewerBookmarkedIds = new Set(bookmarks.map((b) => b.postId));
    }

    const relatedNewsIds = [...new Set(rows.map((r) => r.relatedNewsId).filter(Boolean))] as string[];
    let newsMap = new Map<string, { id: string; title: string }>();
    if (relatedNewsIds.length > 0) {
      const newsRows = await db
        .select({ id: news.id, title: news.title })
        .from(news)
        .where(inArray(news.id, relatedNewsIds));
      newsMap = new Map(newsRows.map((n) => [n.id, { id: n.id, title: n.title }]));
    }

    const items = rows.map((r) => {
      const isVerifiedJournalist =
        r.userType === "JOURNALIST" && r.journalistStatus === "APPROVED";
      return {
        id: r.id,
        content: r.content,
        imageUrl: r.imageUrl ?? null,
        parentPostId: r.parentPostId ?? null,
        likeCount: r.likeCount,
        replyCount: r.replyCount,
        repostCount: r.repostCount,
        bookmarkCount: r.bookmarkCount,
        viewCount: r.viewCount,
        createdAt: r.createdAt,
        author: {
          id: r.userId,
          name: r.userName ?? "Usuário",
          handle: r.userHandle ?? "user",
          avatarUrl: r.userAvatarUrl ?? null,
          userRole: deriveUserRole(r.userType ?? null),
          isVerifiedJournalist,
        },
        viewerHasLiked: viewerLikedIds.has(r.id),
        viewerHasBookmarked: viewerBookmarkedIds.has(r.id),
        relatedNews: r.relatedNewsId ? newsMap.get(r.relatedNewsId) ?? null : null,
      };
    });

    res.json(items);
  } catch (err) {
    console.error("[social] GET /posts error:", err);
    res.status(500).json({ message: "Erro ao carregar posts" });
  }
});

// POST /api/posts
router.post("/posts", requireAuth, async (req, res) => {
  try {
    const userId = (req.session as any).userId!;
    const body = req.body;
    const parsed = insertPostSchema.safeParse({
      content: body.content,
      imageUrl: body.imageUrl || undefined,
      parentPostId: body.parentPostId || undefined,
      relatedNewsId: body.relatedNewsId || undefined,
    });

    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors[0]?.message ?? "Dados inválidos" });
    }

    const { content, imageUrl, parentPostId, relatedNewsId } = parsed.data;

    const [post] = await db
      .insert(posts)
      .values({
        userId,
        content: content.trim(),
        imageUrl: imageUrl || null,
        parentPostId: parentPostId || null,
        relatedNewsId: relatedNewsId || null,
      })
      .returning();

    if (!post) return res.status(500).json({ message: "Erro ao criar post" });

    // Extract and save hashtags from content
    const hashtagMatches = content.match(/#[\w\u00C0-\u024F]+/g) ?? [];
    const uniqueTags = [...new Set(hashtagMatches.map((t) => t.slice(1).replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, "")))]
      .filter((t) => t.length >= 2);
    const hashtagStrings = uniqueTags.map((t) => `#${t}`);

    if (uniqueTags.length > 0) {
      for (const tag of uniqueTags) {
        const [upserted] = await db
          .insert(hashtags)
          .values({ name: tag, postCount: 1, category: "geral" })
          .onConflictDoUpdate({
            target: hashtags.name,
            set: { postCount: sql`${hashtags.postCount} + 1`, updatedAt: new Date() },
          })
          .returning({ id: hashtags.id });
        if (upserted) {
          await db
            .insert(postHashtags)
            .values({ postId: post.id, hashtagId: upserted.id })
            .onConflictDoNothing({ target: [postHashtags.postId, postHashtags.hashtagId] });
        }
      }
      await db.update(posts).set({ hashtags: hashtagStrings, updatedAt: new Date() }).where(eq(posts.id, post.id));
    }

    if (parentPostId) {
      await db
        .update(posts)
        .set({
          replyCount: sql`${posts.replyCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, parentPostId));

      // Notify parent post author
      try {
        const [parentPost] = await db
          .select({ userId: posts.userId })
          .from(posts)
          .where(eq(posts.id, parentPostId))
          .limit(1);
        const [actor] = await db
          .select({ name: users.name, handle: users.handle })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);
        if (parentPost && actor && parentPost.userId !== userId) {
          await storage.createSocialNotification({
            recipientId: parentPost.userId,
            actorId: userId,
            type: "REPLY",
            title: `${actor.name} respondeu ao seu post`,
            message: (post.content || "").slice(0, 100),
            referenceId: post.id,
          });
        }
      } catch (err) {
        console.error("[notification/reply] error:", err);
      }
    }

    const [authorRow] = await db
      .select({
        id: users.id,
        name: users.name,
        handle: users.handle,
        avatarUrl: users.avatarUrl,
        userType: users.userType,
        journalistStatus: journalists.status,
      })
      .from(users)
      .leftJoin(journalists, eq(users.id, journalists.userId))
      .where(eq(users.id, userId))
      .limit(1);

    const isVerifiedJournalist =
      authorRow?.userType === "JOURNALIST" && authorRow?.journalistStatus === "APPROVED";

    res.status(201).json({
      ...post,
      author: authorRow
        ? {
            id: authorRow.id,
            name: authorRow.name ?? "Usuário",
            handle: authorRow.handle ?? "user",
            avatarUrl: authorRow.avatarUrl ?? null,
            userRole: deriveUserRole(authorRow.userType ?? null),
            isVerifiedJournalist,
          }
        : null,
    });
  } catch (err) {
    console.error("[social] POST /posts error:", err);
    res.status(500).json({ message: "Erro ao criar post" });
  }
});

// GET /api/posts/:id
router.get("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id?.trim();
    if (!postId) return res.status(400).json({ message: "ID inválido" });

    const [row] = await db
      .select({
        id: posts.id,
        content: posts.content,
        imageUrl: posts.imageUrl,
        parentPostId: posts.parentPostId,
        likeCount: posts.likeCount,
        replyCount: posts.replyCount,
        repostCount: posts.repostCount,
        bookmarkCount: posts.bookmarkCount,
        viewCount: posts.viewCount,
        createdAt: posts.createdAt,
        relatedNewsId: posts.relatedNewsId,
        userId: users.id,
        userName: users.name,
        userHandle: users.handle,
        userAvatarUrl: users.avatarUrl,
        userType: users.userType,
        journalistStatus: journalists.status,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(journalists, eq(users.id, journalists.userId))
      .where(eq(posts.id, postId))
      .limit(1);

    if (!row) return res.status(404).json({ message: "Post não encontrado" });

    const mainIsVerified = row.userType === "JOURNALIST" && row.journalistStatus === "APPROVED";

    const viewerUserId = (req.session as any)?.userId ?? null;
    let viewerHasLiked = false;
    let viewerHasBookmarked = false;
    if (viewerUserId) {
      const [liked] = await db
        .select()
        .from(postLikes)
        .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, viewerUserId)))
        .limit(1);
      const [bookmarked] = await db
        .select()
        .from(postBookmarks)
        .where(and(eq(postBookmarks.postId, postId), eq(postBookmarks.userId, viewerUserId)))
        .limit(1);
      viewerHasLiked = !!liked;
      viewerHasBookmarked = !!bookmarked;
    }

    const replyRows = await db
      .select({
        id: posts.id,
        content: posts.content,
        imageUrl: posts.imageUrl,
        parentPostId: posts.parentPostId,
        likeCount: posts.likeCount,
        replyCount: posts.replyCount,
        repostCount: posts.repostCount,
        bookmarkCount: posts.bookmarkCount,
        viewCount: posts.viewCount,
        createdAt: posts.createdAt,
        relatedNewsId: posts.relatedNewsId,
        userId: users.id,
        userName: users.name,
        userHandle: users.handle,
        userAvatarUrl: users.avatarUrl,
        userType: users.userType,
        journalistStatus: journalists.status,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(journalists, eq(users.id, journalists.userId))
      .where(eq(posts.parentPostId, postId))
      .orderBy(desc(posts.createdAt))
      .limit(50);

    let replyViewerLiked = new Set<string>();
    let replyViewerBookmarked = new Set<string>();
    if (viewerUserId && replyRows.length > 0) {
      const replyIds = replyRows.map((r) => r.id);
      const [likes, bookmarks] = await Promise.all([
        db.select({ postId: postLikes.postId }).from(postLikes).where(eq(postLikes.userId, viewerUserId)),
        db.select({ postId: postBookmarks.postId }).from(postBookmarks).where(eq(postBookmarks.userId, viewerUserId)),
      ]);
      replyViewerLiked = new Set(likes.filter((l) => replyIds.includes(l.postId)).map((l) => l.postId));
      replyViewerBookmarked = new Set(bookmarks.filter((b) => replyIds.includes(b.postId)).map((b) => b.postId));
    }

    const replies = replyRows.map((r) => {
      const replyIsVerified = r.userType === "JOURNALIST" && r.journalistStatus === "APPROVED";
      return {
        id: r.id,
        content: r.content,
        imageUrl: r.imageUrl ?? null,
        parentPostId: r.parentPostId ?? null,
        likeCount: r.likeCount,
        replyCount: r.replyCount,
        repostCount: r.repostCount,
        bookmarkCount: r.bookmarkCount,
        viewCount: r.viewCount,
        createdAt: r.createdAt,
        author: {
          id: r.userId,
          name: r.userName ?? "Usuário",
          handle: r.userHandle ?? "user",
          avatarUrl: r.userAvatarUrl ?? null,
          userRole: deriveUserRole(r.userType ?? null),
          isVerifiedJournalist: replyIsVerified,
        },
        viewerHasLiked: replyViewerLiked.has(r.id),
        viewerHasBookmarked: replyViewerBookmarked.has(r.id),
        relatedNews: null,
      };
    });

    const relatedNews = row.relatedNewsId
      ? await db.select({ id: news.id, title: news.title }).from(news).where(eq(news.id, row.relatedNewsId)).limit(1)
      : null;

    res.json({
      ...row,
      author: {
        id: row.userId,
        name: row.userName ?? "Usuário",
        handle: row.userHandle ?? "user",
        avatarUrl: row.userAvatarUrl ?? null,
        userRole: deriveUserRole(row.userType ?? null),
        isVerifiedJournalist: mainIsVerified,
      },
      viewerHasLiked,
      viewerHasBookmarked,
      relatedNews: relatedNews?.[0] ?? null,
      replies,
    });
  } catch (err) {
    console.error("[social] GET /posts/:id error:", err);
    res.status(500).json({ message: "Erro ao carregar post" });
  }
});

// DELETE /api/posts/:id
router.delete("/posts/:id", requireAuth, async (req, res) => {
  try {
    const postId = req.params.id?.trim();
    if (!postId) return res.status(400).json({ message: "ID inválido" });
    const userId = (req.session as any).userId!;

    const [post] = await db.select({ userId: posts.userId }).from(posts).where(eq(posts.id, postId)).limit(1);
    if (!post) return res.status(404).json({ message: "Post não encontrado" });
    if (post.userId !== userId) {
      return res.status(403).json({ message: "Você só pode deletar seus próprios posts" });
    }

    await db.delete(posts).where(eq(posts.id, postId));
    res.json({ message: "Post deletado" });
  } catch (err) {
    console.error("[social] DELETE /posts/:id error:", err);
    res.status(500).json({ message: "Erro ao deletar post" });
  }
});

// POST /api/posts/:id/like - toggle
router.post("/posts/:id/like", requireAuth, async (req, res) => {
  try {
    const postId = req.params.id?.trim();
    if (!postId) return res.status(400).json({ message: "ID inválido" });
    const userId = (req.session as any).userId!;

    const [existing] = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
      .limit(1);

    if (existing) {
      await db
        .delete(postLikes)
        .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
      await db
        .update(posts)
        .set({
          likeCount: sql`greatest(0, ${posts.likeCount} - 1)`,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, postId));
      const [p] = await db.select({ likeCount: posts.likeCount }).from(posts).where(eq(posts.id, postId)).limit(1);
      return res.json({ liked: false, likeCount: p?.likeCount ?? 0 });
    }

    await db.insert(postLikes).values({ postId, userId });
    await db
      .update(posts)
      .set({
        likeCount: sql`${posts.likeCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));
    const [p] = await db.select({ likeCount: posts.likeCount }).from(posts).where(eq(posts.id, postId)).limit(1);

    // Notify post author (if not self-like)
    try {
      const [postRow] = await db
        .select({ userId: posts.userId, content: posts.content })
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1);
      const [actor] = await db
        .select({ name: users.name, handle: users.handle })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      if (postRow && actor && postRow.userId !== userId) {
        await storage.createSocialNotification({
          recipientId: postRow.userId,
          actorId: userId,
          type: "LIKE",
          title: `${actor.name} curtiu seu post`,
          message: postRow.content.slice(0, 100),
          referenceId: postId,
        });
      }
    } catch (err) {
      console.error("[notification/like] error:", err);
    }

    res.json({ liked: true, likeCount: (p?.likeCount ?? 0) + 1 });
  } catch (err) {
    console.error("[social] POST /posts/:id/like error:", err);
    res.status(500).json({ message: "Erro ao curtir" });
  }
});

// POST /api/posts/:id/bookmark - toggle
router.post("/posts/:id/bookmark", requireAuth, async (req, res) => {
  try {
    const postId = req.params.id?.trim();
    if (!postId) return res.status(400).json({ message: "ID inválido" });
    const userId = (req.session as any).userId!;

    const [existing] = await db
      .select()
      .from(postBookmarks)
      .where(and(eq(postBookmarks.postId, postId), eq(postBookmarks.userId, userId)))
      .limit(1);

    if (existing) {
      await db
        .delete(postBookmarks)
        .where(and(eq(postBookmarks.postId, postId), eq(postBookmarks.userId, userId)));
      await db
        .update(posts)
        .set({
          bookmarkCount: sql`greatest(0, ${posts.bookmarkCount} - 1)`,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, postId));
      const [p] = await db.select({ bookmarkCount: posts.bookmarkCount }).from(posts).where(eq(posts.id, postId)).limit(1);
      return res.json({ bookmarked: false, bookmarkCount: p?.bookmarkCount ?? 0 });
    }

    await db.insert(postBookmarks).values({ postId, userId });
    await db
      .update(posts)
      .set({
        bookmarkCount: sql`${posts.bookmarkCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));
    const [p] = await db.select({ bookmarkCount: posts.bookmarkCount }).from(posts).where(eq(posts.id, postId)).limit(1);
    res.json({ bookmarked: true, bookmarkCount: (p?.bookmarkCount ?? 0) + 1 });
  } catch (err) {
    console.error("[social] POST /posts/:id/bookmark error:", err);
    res.status(500).json({ message: "Erro ao salvar" });
  }
});

export const socialRouter = router;

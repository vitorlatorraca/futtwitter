import { Router, type Request } from "express";
import { eq, and, desc, sql, ilike, or, not, inArray } from "drizzle-orm";
import { db } from "../db";
import {
  users,
  posts,
  postLikes,
  postBookmarks,
  userFollows,
  journalists,
  teams,
  hashtags,
  postHashtags,
  trendingTopics,
} from "@shared/schema";

function requireAuth(req: Request, res: any, next: () => void) {
  if (!(req.session as any)?.userId) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  next();
}

const router = Router();

type HashtagCategory = "time" | "campeonato" | "geral" | "transferencia";

// GET /api/explore/trending
router.get("/trending", async (req, res) => {
  try {
    const period = (req.query.period as string) || "24h";
    const category = req.query.category as HashtagCategory | undefined;

    let q = db
      .select({
        id: trendingTopics.id,
        title: trendingTopics.title,
        subtitle: trendingTopics.subtitle,
        category: trendingTopics.category,
        postCount: trendingTopics.postCount,
        teamId: trendingTopics.teamId,
      })
      .from(trendingTopics)
      .where(eq(trendingTopics.period, period as "1h" | "6h" | "24h"))
      .orderBy(desc(trendingTopics.postCount));

    const rows = await q;

    const teamIds = [...new Set(rows.map((r) => r.teamId).filter(Boolean))] as string[];
    const teamMap = new Map<string, { slug: string }>();
    if (teamIds.length > 0) {
      const teamRows = await db
        .select({ id: teams.id, shortName: teams.shortName })
        .from(teams)
        .where(inArray(teams.id, teamIds));
      for (const t of teamRows) {
        teamMap.set(t.id, { slug: (t.shortName || t.id).toLowerCase().replace(/\s+/g, "-") });
      }
    }

    let items = rows.map((r) => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle,
      category: r.category,
      post_count: r.postCount,
      team_slug: r.teamId ? teamMap.get(r.teamId)?.slug ?? null : null,
    }));

    if (category) {
      items = items.filter((i) => i.category === category);
    }

    res.json(items);
  } catch (err) {
    console.error("[explore] GET /trending error:", err);
    res.status(500).json({ message: "Erro ao carregar trending" });
  }
});

// GET /api/explore/hashtags
router.get("/hashtags", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || 10), 10) || 10, 20);

    const rows = await db
      .select({
        id: hashtags.id,
        name: hashtags.name,
        postCount: hashtags.postCount,
        category: hashtags.category,
      })
      .from(hashtags)
      .orderBy(desc(hashtags.postCount))
      .limit(limit);

    res.json(rows.map((r) => ({ id: r.id, name: r.name, post_count: r.postCount, category: r.category })));
  } catch (err) {
    console.error("[explore] GET /hashtags error:", err);
    res.status(500).json({ message: "Erro ao carregar hashtags" });
  }
});

// GET /api/explore/search?q=termo
router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q as string)?.trim() ?? "";
    if (!q) return res.json({ posts: [], users: [], hashtags: [], teams: [] });

    const term = `%${q}%`;
    const viewerUserId: string | null = (req.session as any)?.userId ?? null;
    const limit = 5;

    const [matchedPosts, matchedUsers, matchedHashtags, matchedTeams] = await Promise.all([
      db
        .select({
          id: posts.id,
          content: posts.content,
          imageUrl: posts.imageUrl,
          likeCount: posts.likeCount,
          repostCount: posts.repostCount,
          replyCount: posts.replyCount,
          viewCount: posts.viewCount,
          createdAt: posts.createdAt,
          authorId: users.id,
          authorName: users.name,
          authorHandle: users.handle,
          authorAvatarUrl: users.avatarUrl,
          authorUserType: users.userType,
          journalistStatus: journalists.status,
          teamName: teams.name,
        })
        .from(posts)
        .innerJoin(users, eq(posts.userId, users.id))
        .leftJoin(journalists, eq(users.id, journalists.userId))
        .leftJoin(teams, eq(users.teamId, teams.id))
        .where(and(ilike(posts.content, term), sql`${posts.parentPostId} IS NULL`))
        .orderBy(desc(posts.createdAt))
        .limit(limit),
      db
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
        .where(or(ilike(users.name, term), ilike(users.handle, term)))
        .orderBy(desc(users.followersCount))
        .limit(limit),
      db
        .select({ id: hashtags.id, name: hashtags.name, postCount: hashtags.postCount, category: hashtags.category })
        .from(hashtags)
        .where(ilike(hashtags.name, term))
        .orderBy(desc(hashtags.postCount))
        .limit(limit),
      db
        .select({ id: teams.id, name: teams.name, shortName: teams.shortName, logoUrl: teams.logoUrl })
        .from(teams)
        .where(or(ilike(teams.name, term), ilike(teams.shortName, term)))
        .limit(limit),
    ]);

    let followingIds: string[] = [];
    if (viewerUserId) {
      const f = await db
        .select({ followingId: userFollows.followingId })
        .from(userFollows)
        .where(eq(userFollows.followerId, viewerUserId));
      followingIds = f.map((x) => x.followingId);
    }

    const postsOut = matchedPosts.map((p) => ({
      id: p.id,
      content: p.content,
      imageUrl: p.imageUrl,
      likeCount: p.likeCount,
      repostCount: p.repostCount,
      replyCount: p.replyCount,
      viewCount: p.viewCount,
      createdAt: p.createdAt,
      author: {
        id: p.authorId,
        name: p.authorName,
        username: p.authorHandle ?? "user",
        avatar: p.authorAvatarUrl,
        verified: p.authorUserType === "JOURNALIST" && p.journalistStatus === "APPROVED",
        team_name: p.teamName,
      },
    }));

    const usersOut = matchedUsers.map((u) => ({
      id: u.id,
      name: u.name,
      handle: u.handle,
      avatarUrl: u.avatarUrl,
      bio: u.bio,
      userType: u.userType,
      followersCount: u.followersCount,
      is_following: followingIds.includes(u.id),
    }));

    const hashtagsOut = matchedHashtags.map((h) => ({
      id: h.id,
      name: h.name,
      post_count: h.postCount,
      category: h.category,
    }));

    const teamsOut = matchedTeams.map((t) => ({
      id: t.id,
      name: t.name,
      shortName: t.shortName,
      logoUrl: t.logoUrl,
    }));

    res.json({ posts: postsOut, users: usersOut, hashtags: hashtagsOut, teams: teamsOut });
  } catch (err) {
    console.error("[explore] GET /search error:", err);
    res.status(500).json({ message: "Erro ao buscar", posts: [], users: [], hashtags: [], teams: [] });
  }
});

// GET /api/explore/posts-by-hashtag/:name
router.get("/posts-by-hashtag/:name", async (req, res) => {
  try {
    const name = decodeURIComponent((req.params.name || "").trim());
    if (!name) return res.status(400).json({ message: "Hashtag inválida" });

    const hashtagName = name.startsWith("#") ? name.slice(1) : name;

    const [hashtagRow] = await db
      .select()
      .from(hashtags)
      .where(ilike(hashtags.name, hashtagName))
      .limit(1);

    if (!hashtagRow) return res.json([]);

    const postRows = await db
      .select({
        id: posts.id,
        content: posts.content,
        imageUrl: posts.imageUrl,
        likeCount: posts.likeCount,
        repostCount: posts.repostCount,
        replyCount: posts.replyCount,
        viewCount: posts.viewCount,
        createdAt: posts.createdAt,
        authorId: users.id,
        authorName: users.name,
        authorHandle: users.handle,
        authorAvatarUrl: users.avatarUrl,
        authorUserType: users.userType,
        journalistStatus: journalists.status,
        teamName: teams.name,
      })
      .from(posts)
      .innerJoin(postHashtags, eq(posts.id, postHashtags.postId))
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(journalists, eq(users.id, journalists.userId))
      .leftJoin(teams, eq(users.teamId, teams.id))
      .where(and(eq(postHashtags.hashtagId, hashtagRow.id), sql`${posts.parentPostId} IS NULL`))
      .orderBy(desc(posts.createdAt))
      .limit(20);

    const viewerUserId: string | null = (req.session as any)?.userId ?? null;
    let likedIds = new Set<string>();
    let bookmarkedIds = new Set<string>();
    if (viewerUserId) {
      const postIds = postRows.map((p) => p.id);
      const [likes, bookmarks] = await Promise.all([
        db.select({ postId: postLikes.postId }).from(postLikes).where(and(eq(postLikes.userId, viewerUserId), inArray(postLikes.postId, postIds))),
        db.select({ postId: postBookmarks.postId }).from(postBookmarks).where(and(eq(postBookmarks.userId, viewerUserId), inArray(postBookmarks.postId, postIds))),
      ]);
      likes.forEach((l) => likedIds.add(l.postId));
      bookmarks.forEach((b) => bookmarkedIds.add(b.postId));
    }

    const items = postRows.map((p) => ({
      id: p.id,
      content: p.content,
      imageUrl: p.imageUrl,
      likeCount: p.likeCount,
      repostCount: p.repostCount,
      replyCount: p.replyCount,
      viewCount: p.viewCount,
      createdAt: p.createdAt,
      author: {
        id: p.authorId,
        name: p.authorName,
        username: p.authorHandle ?? "user",
        avatar: p.authorAvatarUrl,
        verified: p.authorUserType === "JOURNALIST" && p.journalistStatus === "APPROVED",
        team_name: p.teamName,
      },
      viewerHasLiked: likedIds.has(p.id),
      viewerHasBookmarked: bookmarkedIds.has(p.id),
    }));

    res.json(items);
  } catch (err) {
    console.error("[explore] GET /posts-by-hashtag error:", err);
    res.status(500).json({ message: "Erro ao carregar posts" });
  }
});

// GET /api/explore/suggested-users
router.get("/suggested-users", requireAuth, async (req, res) => {
  try {
    const viewerUserId = (req.session as any)!.userId;
    const limit = 5;

    const followed = await db
      .select({ followingId: userFollows.followingId })
      .from(userFollows)
      .where(eq(userFollows.followerId, viewerUserId));
    const excludeIds = [viewerUserId, ...followed.map((f) => f.followingId)];

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
      .where(and(not(inArray(users.id, excludeIds)), sql`${users.handle} IS NOT NULL`))
      .orderBy(desc(users.followersCount))
      .limit(limit);

    const items = rows.map((u) => ({
      id: u.id,
      name: u.name,
      handle: u.handle ?? "user",
      avatarUrl: u.avatarUrl,
      bio: u.bio,
      userType: u.userType,
      followersCount: u.followersCount,
      is_following: false,
    }));

    res.json(items);
  } catch (err) {
    console.error("[explore] GET /suggested-users error:", err);
    res.status(500).json({ message: "Erro ao carregar sugestões" });
  }
});

export const exploreRouter = router;

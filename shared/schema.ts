import { sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  real,
  pgEnum,
  date,
  uniqueIndex,
  json,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// ENUMS
// ============================================

export const userTypeEnum = pgEnum("user_type", ["FAN", "JOURNALIST", "ADMIN"]);
export const newsCategoryEnum = pgEnum("news_category", ["NEWS", "ANALYSIS", "BACKSTAGE", "MARKET"]);
export const interactionTypeEnum = pgEnum("interaction_type", ["LIKE", "DISLIKE"]);
export const journalistStatusEnum = pgEnum("journalist_status", ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"]);
export const notificationTypeEnum = pgEnum("notification_type", ["NEW_NEWS", "UPCOMING_MATCH", "BADGE_EARNED", "MATCH_RESULT"]);
/** Feed scope: ALL = Todos, TEAM = Meu time (teamId required), EUROPE = Aba Europa */
export const postScopeEnum = pgEnum("post_scope", ["ALL", "TEAM", "EUROPE"]);

// ============================================
// TABLES
// ============================================

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url"),
  userType: userTypeEnum("user_type").notNull().default("FAN"),
  teamId: varchar("team_id", { length: 36 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const journalists = pgTable("journalists", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().unique(),
  organization: varchar("organization", { length: 255 }).notNull(),
  professionalId: varchar("professional_id", { length: 100 }).notNull(),
  portfolioUrl: text("portfolio_url"),
  status: journalistStatusEnum("status").notNull().default("PENDING"),
  verificationDate: timestamp("verification_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const teams = pgTable("teams", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull().unique(),
  shortName: varchar("short_name", { length: 10 }).notNull(),
  logoUrl: text("logo_url").notNull(),
  primaryColor: varchar("primary_color", { length: 7 }).notNull(),
  secondaryColor: varchar("secondary_color", { length: 7 }).notNull(),
  currentPosition: integer("current_position"),
  points: integer("points").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  draws: integer("draws").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  goalsFor: integer("goals_for").notNull().default(0),
  goalsAgainst: integer("goals_against").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const players = pgTable(
  "players",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    teamId: varchar("team_id", { length: 36 })
      .notNull()
      .references(() => teams.id),
    shirtNumber: integer("shirt_number"),
    name: text("name").notNull(),
    position: text("position").notNull(),
    birthDate: date("birth_date", { mode: "string" }).notNull(),
    nationalityPrimary: text("nationality_primary").notNull(),
    nationalitySecondary: text("nationality_secondary"),
    marketValueEur: integer("market_value_eur"),
    fromClub: text("from_club"),
    photoUrl: text("photo_url"),
    sector: varchar("sector", { length: 10 }),
    slug: text("slug"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    // Unique composto recomendado: (teamId, name, birthDate)
    teamNameBirthDateUnique: uniqueIndex("players_team_name_birth_date_unique").on(
      t.teamId,
      t.name,
      t.birthDate,
    ),
    // Unique (teamId, shirtNumber) apenas quando shirtNumber não for null
    teamShirtNumberUnique: uniqueIndex("players_team_shirt_number_unique")
      .on(t.teamId, t.shirtNumber)
      .where(sql`shirt_number is not null`),
  }),
);

export const matches = pgTable("matches", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id", { length: 36 }).notNull(),
  opponent: varchar("opponent", { length: 255 }).notNull(),
  opponentLogoUrl: text("opponent_logo_url"),
  isHomeMatch: boolean("is_home_match").notNull(),
  teamScore: integer("team_score"),
  opponentScore: integer("opponent_score"),
  matchDate: timestamp("match_date").notNull(),
  stadium: varchar("stadium", { length: 255 }),
  championshipRound: integer("championship_round"),
  status: varchar("status", { length: 50 }).notNull().default("SCHEDULED"),
  competition: text("competition"),
  isMock: boolean("is_mock").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const matchPlayers = pgTable("match_players", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id", { length: 36 }).notNull(),
  playerId: varchar("player_id", { length: 36 }).notNull(),
  participated: boolean("participated").notNull().default(true),
  wasStarter: boolean("was_starter").notNull().default(false),
  minutesPlayed: integer("minutes_played"),
  sofascoreRating: real("sofascore_rating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const news = pgTable("news", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  journalistId: varchar("journalist_id", { length: 36 }).notNull(),
  teamId: varchar("team_id", { length: 36 }),
  scope: postScopeEnum("scope").notNull().default("ALL"),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  category: newsCategoryEnum("category").notNull().default("NEWS"),
  likesCount: integer("likes_count").notNull().default(0),
  dislikesCount: integer("dislikes_count").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const newsInteractions = pgTable("news_interactions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  newsId: varchar("news_id", { length: 36 }).notNull(),
  interactionType: interactionTypeEnum("interaction_type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const playerRatings = pgTable("player_ratings", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  playerId: varchar("player_id", { length: 36 }).notNull(),
  matchId: varchar("match_id", { length: 36 }).notNull(),
  rating: real("rating").notNull(),
  comment: varchar("comment", { length: 200 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  newsId: varchar("news_id", { length: 36 })
    .notNull()
    .references(() => news.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const commentLikes = pgTable(
  "comment_likes",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    commentId: varchar("comment_id", { length: 36 })
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    commentUserUnique: uniqueIndex("comment_likes_comment_user_unique").on(t.commentId, t.userId),
    commentIdIdx: index("comment_likes_comment_id_idx").on(t.commentId),
    userIdIdx: index("comment_likes_user_id_idx").on(t.userId),
  })
);

export const badges = pgTable("badges", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 10 }).notNull(),
  condition: varchar("condition", { length: 100 }).notNull(),
  threshold: integer("threshold").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userBadges = pgTable("user_badges", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  badgeId: varchar("badge_id", { length: 36 }).notNull(),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  referenceId: varchar("reference_id", { length: 36 }),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userLineups = pgTable(
  "user_lineups",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id),
    teamId: varchar("team_id", { length: 36 })
      .notNull()
      .references(() => teams.id),
    formation: varchar("formation", { length: 20 }).notNull(),
    slots: json("slots").$type<Array<{ slotIndex: number; playerId: string }>>().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    userTeamUnique: uniqueIndex("user_lineups_user_team_unique").on(t.userId, t.teamId),
  }),
);

// Session store table (connect-pg-simple)
// Kept in schema to prevent drizzle-kit push from dropping it.
export const userSessions = pgTable(
  "user_sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (t) => ({
    expireIdx: index("IDX_user_sessions_expire").on(t.expire),
  }),
);

// ============================================
// RELATIONS
// ============================================

export const usersRelations = relations(users, ({ one, many }) => ({
  team: one(teams, {
    fields: [users.teamId],
    references: [teams.id],
  }),
  journalist: one(journalists, {
    fields: [users.id],
    references: [journalists.userId],
  }),
  newsInteractions: many(newsInteractions),
  playerRatings: many(playerRatings),
  comments: many(comments),
  userBadges: many(userBadges),
  notifications: many(notifications),
  userLineups: many(userLineups),
}));

export const journalistsRelations = relations(journalists, ({ one, many }) => ({
  user: one(users, {
    fields: [journalists.userId],
    references: [users.id],
  }),
  news: many(news),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  users: many(users),
  players: many(players),
  news: many(news),
  matches: many(matches),
  userLineups: many(userLineups),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
  ratings: many(playerRatings),
  matchParticipations: many(matchPlayers),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  team: one(teams, {
    fields: [matches.teamId],
    references: [teams.id],
  }),
  playerParticipations: many(matchPlayers),
  playerRatings: many(playerRatings),
}));

export const matchPlayersRelations = relations(matchPlayers, ({ one }) => ({
  match: one(matches, {
    fields: [matchPlayers.matchId],
    references: [matches.id],
  }),
  player: one(players, {
    fields: [matchPlayers.playerId],
    references: [players.id],
  }),
}));

export const newsRelations = relations(news, ({ one, many }) => ({
  journalist: one(journalists, {
    fields: [news.journalistId],
    references: [journalists.id],
  }),
  team: one(teams, {
    fields: [news.teamId],
    references: [teams.id],
  }),
  interactions: many(newsInteractions),
  comments: many(comments),
}));

export const newsInteractionsRelations = relations(newsInteractions, ({ one }) => ({
  user: one(users, {
    fields: [newsInteractions.userId],
    references: [users.id],
  }),
  news: one(news, {
    fields: [newsInteractions.newsId],
    references: [news.id],
  }),
}));

export const playerRatingsRelations = relations(playerRatings, ({ one }) => ({
  user: one(users, {
    fields: [playerRatings.userId],
    references: [users.id],
  }),
  player: one(players, {
    fields: [playerRatings.playerId],
    references: [players.id],
  }),
  match: one(matches, {
    fields: [playerRatings.matchId],
    references: [matches.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  news: one(news, {
    fields: [comments.newsId],
    references: [news.id],
  }),
  likes: many(commentLikes),
}));

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
  user: one(users, {
    fields: [commentLikes.userId],
    references: [users.id],
  }),
}));

export const userLineupsRelations = relations(userLineups, ({ one }) => ({
  user: one(users, {
    fields: [userLineups.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [userLineups.teamId],
    references: [teams.id],
  }),
}));

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));

// ============================================
// SCHEMAS FOR VALIDATION
// ============================================

// User schemas
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectUserSchema = createSelectSchema(users);

// Journalist schemas
export const insertJournalistSchema = createInsertSchema(journalists, {
  organization: z.string().min(2, "Organização deve ter pelo menos 2 caracteres"),
  professionalId: z.string().min(2, "ID profissional é obrigatório"),
}).omit({ id: true, createdAt: true, updatedAt: true, status: true, verificationDate: true });

export const selectJournalistSchema = createSelectSchema(journalists);

// Team schemas
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true, updatedAt: true });
export const selectTeamSchema = createSelectSchema(teams);

// Player schemas
export const insertPlayerSchema = createInsertSchema(players).omit({ id: true, createdAt: true, updatedAt: true });
export const selectPlayerSchema = createSelectSchema(players);

// Match schemas
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true, createdAt: true, updatedAt: true });
export const selectMatchSchema = createSelectSchema(matches);

// News schemas
export const insertNewsSchema = createInsertSchema(news, {
  title: z.string().min(10, "Título deve ter pelo menos 10 caracteres").max(200, "Título não pode ter mais de 200 caracteres"),
  content: z.string().min(50, "Conteúdo deve ter pelo menos 50 caracteres").max(1000, "Conteúdo não pode ter mais de 1000 caracteres"),
  scope: z.enum(["ALL", "TEAM", "EUROPE"]).optional().default("ALL"),
}).omit({
  id: true,
  journalistId: true,
  createdAt: true,
  updatedAt: true,
  likesCount: true,
  dislikesCount: true,
  publishedAt: true,
  // Nunca confiar no client para publicar/despublicar: o backend decide.
  isPublished: true,
});

export const selectNewsSchema = createSelectSchema(news);

// News interaction schemas
export const insertNewsInteractionSchema = createInsertSchema(newsInteractions).omit({ id: true, createdAt: true, updatedAt: true });
export const selectNewsInteractionSchema = createSelectSchema(newsInteractions);

// Player rating schemas
export const insertPlayerRatingSchema = createInsertSchema(playerRatings, {
  rating: z.number().min(0, "Nota mínima é 0").max(10, "Nota máxima é 10"),
  comment: z.string().max(200, "Comentário não pode ter mais de 200 caracteres").optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectPlayerRatingSchema = createSelectSchema(playerRatings);

// Comment schemas (newsId and userId set server-side)
export const insertCommentSchema = createInsertSchema(comments, {
  content: z.string().min(1, "Comentário não pode ser vazio").max(2000, "Comentário muito longo"),
}).omit({ id: true, newsId: true, userId: true, isApproved: true, createdAt: true, updatedAt: true });
export const selectCommentSchema = createSelectSchema(comments);

// Comment like schemas
export const insertCommentLikeSchema = createInsertSchema(commentLikes).omit({ id: true, createdAt: true });
export const selectCommentLikeSchema = createSelectSchema(commentLikes);

// Badge schemas
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true, createdAt: true });
export const selectBadgeSchema = createSelectSchema(badges);

// User badge schemas
export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ id: true, earnedAt: true });
export const selectUserBadgeSchema = createSelectSchema(userBadges);

// Notification schemas
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const selectNotificationSchema = createSelectSchema(notifications);

// User lineup schemas
export const insertUserLineupSchema = createInsertSchema(userLineups, {
  formation: z.string().min(1, "Formação é obrigatória"),
  slots: z.array(z.object({ slotIndex: z.number(), playerId: z.string() })),
}).omit({ id: true, createdAt: true, updatedAt: true });
export const selectUserLineupSchema = createSelectSchema(userLineups);

// ============================================
// TYPES
// ============================================

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Journalist = typeof journalists.$inferSelect;
export type InsertJournalist = z.infer<typeof insertJournalistSchema>;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
// Server-side insert type (journalistId is injected by backend, not trusted from client)
export type InsertNewsServer = InsertNews & { journalistId: string };

export type NewsInteraction = typeof newsInteractions.$inferSelect;
export type InsertNewsInteraction = z.infer<typeof insertNewsInteractionSchema>;

export type PlayerRating = typeof playerRatings.$inferSelect;
export type InsertPlayerRating = z.infer<typeof insertPlayerRatingSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type CommentLike = typeof commentLikes.$inferSelect;
export type InsertCommentLike = z.infer<typeof insertCommentLikeSchema>;

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type UserLineup = typeof userLineups.$inferSelect;
export type InsertUserLineup = z.infer<typeof insertUserLineupSchema>;

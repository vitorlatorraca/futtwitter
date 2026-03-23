var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  badges: () => badges,
  badgesRelations: () => badgesRelations,
  commentLikes: () => commentLikes,
  commentLikesRelations: () => commentLikesRelations,
  comments: () => comments,
  commentsRelations: () => commentsRelations,
  competitions: () => competitions,
  competitionsRelations: () => competitionsRelations,
  contracts: () => contracts,
  contractsRelations: () => contractsRelations,
  countries: () => countries,
  countriesRelations: () => countriesRelations,
  fixtureStatusEnum: () => fixtureStatusEnum,
  fixtures: () => fixtures,
  fixturesRelations: () => fixturesRelations,
  forumModerationStatusEnum: () => forumModerationStatusEnum,
  forumTopicCategoryEnum: () => forumTopicCategoryEnum,
  gameAttemptGuesses: () => gameAttemptGuesses,
  gameAttemptStatusEnum: () => gameAttemptStatusEnum,
  gameAttempts: () => gameAttempts,
  gameDailyGuessProgress: () => gameDailyGuessProgress,
  gameDailyPlayer: () => gameDailyPlayer,
  gameSetPlayers: () => gameSetPlayers,
  gameSets: () => gameSets,
  hashtagCategoryEnum: () => hashtagCategoryEnum,
  hashtags: () => hashtags,
  injuries: () => injuries,
  injuriesRelations: () => injuriesRelations,
  injuryStatusEnum: () => injuryStatusEnum,
  insertBadgeSchema: () => insertBadgeSchema,
  insertCommentLikeSchema: () => insertCommentLikeSchema,
  insertCommentSchema: () => insertCommentSchema,
  insertCompetitionSchema: () => insertCompetitionSchema,
  insertFixtureSchema: () => insertFixtureSchema,
  insertForumReplySchema: () => insertForumReplySchema,
  insertForumTopicSchema: () => insertForumTopicSchema,
  insertGameAttemptGuessSchema: () => insertGameAttemptGuessSchema,
  insertGameAttemptSchema: () => insertGameAttemptSchema,
  insertGameSetPlayerSchema: () => insertGameSetPlayerSchema,
  insertGameSetSchema: () => insertGameSetSchema,
  insertJournalistSchema: () => insertJournalistSchema,
  insertMatchSchema: () => insertMatchSchema,
  insertNewsInteractionSchema: () => insertNewsInteractionSchema,
  insertNewsSchema: () => insertNewsSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertPlayerRatingSchema: () => insertPlayerRatingSchema,
  insertPlayerSchema: () => insertPlayerSchema,
  insertPostSchema: () => insertPostSchema,
  insertStandingSchema: () => insertStandingSchema,
  insertTeamSchema: () => insertTeamSchema,
  insertTransferRumorCommentSchema: () => insertTransferRumorCommentSchema,
  insertTransferRumorSchema: () => insertTransferRumorSchema,
  insertTransferRumorVoteSchema: () => insertTransferRumorVoteSchema,
  insertTransferSchema: () => insertTransferSchema,
  insertTransferVoteSchema: () => insertTransferVoteSchema,
  insertUserBadgeSchema: () => insertUserBadgeSchema,
  insertUserLineupSchema: () => insertUserLineupSchema,
  insertUserSchema: () => insertUserSchema,
  interactionTypeEnum: () => interactionTypeEnum,
  journalistStatusEnum: () => journalistStatusEnum,
  journalists: () => journalists,
  journalistsRelations: () => journalistsRelations,
  matchEventTypeEnum: () => matchEventTypeEnum,
  matchEvents: () => matchEvents,
  matchEventsRelations: () => matchEventsRelations,
  matchGames: () => matchGames,
  matchGamesRelations: () => matchGamesRelations,
  matchLineupPlayers: () => matchLineupPlayers,
  matchLineupPlayersRelations: () => matchLineupPlayersRelations,
  matchLineups: () => matchLineups,
  matchLineupsRelations: () => matchLineupsRelations,
  matchPlayers: () => matchPlayers,
  matchPlayersRelations: () => matchPlayersRelations,
  matchStatusEnum: () => matchStatusEnum,
  matches: () => matches,
  matchesRelations: () => matchesRelations,
  news: () => news,
  newsCategoryEnum: () => newsCategoryEnum,
  newsInteractions: () => newsInteractions,
  newsInteractionsRelations: () => newsInteractionsRelations,
  newsRelations: () => newsRelations,
  notificationTypeEnum: () => notificationTypeEnum,
  notifications: () => notifications,
  playerMatchStats: () => playerMatchStats,
  playerMatchStatsRelations: () => playerMatchStatsRelations,
  playerRatings: () => playerRatings,
  playerRatingsRelations: () => playerRatingsRelations,
  players: () => players,
  playersRelations: () => playersRelations,
  postBookmarks: () => postBookmarks,
  postBookmarksRelations: () => postBookmarksRelations,
  postHashtags: () => postHashtags,
  postLikes: () => postLikes,
  postLikesRelations: () => postLikesRelations,
  postScopeEnum: () => postScopeEnum,
  posts: () => posts,
  postsRelations: () => postsRelations,
  preferredFootEnum: () => preferredFootEnum,
  primaryPositionEnum: () => primaryPositionEnum,
  rosterRoleEnum: () => rosterRoleEnum,
  rosterStatusEnum: () => rosterStatusEnum,
  seasons: () => seasons,
  seasonsRelations: () => seasonsRelations,
  selectBadgeSchema: () => selectBadgeSchema,
  selectCommentLikeSchema: () => selectCommentLikeSchema,
  selectCommentSchema: () => selectCommentSchema,
  selectCompetitionSchema: () => selectCompetitionSchema,
  selectFixtureSchema: () => selectFixtureSchema,
  selectForumReplySchema: () => selectForumReplySchema,
  selectForumTopicSchema: () => selectForumTopicSchema,
  selectJournalistSchema: () => selectJournalistSchema,
  selectMatchSchema: () => selectMatchSchema,
  selectNewsInteractionSchema: () => selectNewsInteractionSchema,
  selectNewsSchema: () => selectNewsSchema,
  selectNotificationSchema: () => selectNotificationSchema,
  selectPlayerRatingSchema: () => selectPlayerRatingSchema,
  selectPlayerSchema: () => selectPlayerSchema,
  selectStandingSchema: () => selectStandingSchema,
  selectTeamSchema: () => selectTeamSchema,
  selectTransferRumorCommentSchema: () => selectTransferRumorCommentSchema,
  selectTransferRumorSchema: () => selectTransferRumorSchema,
  selectTransferRumorVoteSchema: () => selectTransferRumorVoteSchema,
  selectTransferSchema: () => selectTransferSchema,
  selectTransferVoteSchema: () => selectTransferVoteSchema,
  selectUserBadgeSchema: () => selectUserBadgeSchema,
  selectUserLineupSchema: () => selectUserLineupSchema,
  selectUserSchema: () => selectUserSchema,
  standings: () => standings,
  standingsRelations: () => standingsRelations,
  teamMatchRatings: () => teamMatchRatings,
  teamMatchStats: () => teamMatchStats,
  teamMatchStatsRelations: () => teamMatchStatsRelations,
  teamRosters: () => teamRosters,
  teamRostersRelations: () => teamRostersRelations,
  teams: () => teams,
  teamsForumLikes: () => teamsForumLikes,
  teamsForumLikesRelations: () => teamsForumLikesRelations,
  teamsForumReplies: () => teamsForumReplies,
  teamsForumRepliesRelations: () => teamsForumRepliesRelations,
  teamsForumTopics: () => teamsForumTopics,
  teamsForumTopicsRelations: () => teamsForumTopicsRelations,
  teamsRelations: () => teamsRelations,
  transferRumorComments: () => transferRumorComments,
  transferRumorCommentsRelations: () => transferRumorCommentsRelations,
  transferRumorStatusEnum: () => transferRumorStatusEnum,
  transferRumorVotes: () => transferRumorVotes,
  transferRumorVotesRelations: () => transferRumorVotesRelations,
  transferRumors: () => transferRumors,
  transferRumorsRelations: () => transferRumorsRelations,
  transferStatusEnum: () => transferStatusEnum,
  transferStatusSportEnum: () => transferStatusSportEnum,
  transferVoteEnum: () => transferVoteEnum,
  transferVoteSideEnum: () => transferVoteSideEnum,
  transferVoteValueEnum: () => transferVoteValueEnum,
  transferVotes: () => transferVotes,
  transferVotesRelations: () => transferVotesRelations,
  transfers: () => transfers,
  transfersRelations: () => transfersRelations,
  transfersSport: () => transfersSport,
  transfersSportRelations: () => transfersSportRelations,
  trendingPeriodEnum: () => trendingPeriodEnum,
  trendingTopics: () => trendingTopics,
  userBadges: () => userBadges,
  userBadgesRelations: () => userBadgesRelations,
  userFollows: () => userFollows,
  userFollowsRelations: () => userFollowsRelations,
  userLineups: () => userLineups,
  userLineupsRelations: () => userLineupsRelations,
  userSessions: () => userSessions,
  userTypeEnum: () => userTypeEnum,
  users: () => users,
  usersRelations: () => usersRelations,
  venues: () => venues,
  venuesRelations: () => venuesRelations
});
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
  numeric
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
var userTypeEnum, newsCategoryEnum, interactionTypeEnum, journalistStatusEnum, notificationTypeEnum, postScopeEnum, transferStatusEnum, transferVoteEnum, transferVoteSideEnum, transferVoteValueEnum, transferRumorStatusEnum, fixtureStatusEnum, preferredFootEnum, primaryPositionEnum, rosterRoleEnum, rosterStatusEnum, matchStatusEnum, matchEventTypeEnum, injuryStatusEnum, transferStatusSportEnum, forumTopicCategoryEnum, forumModerationStatusEnum, gameAttemptStatusEnum, hashtagCategoryEnum, trendingPeriodEnum, countries, users, journalists, teams, players, matches, competitions, venues, seasons, teamRosters, contracts, matchGames, matchEvents, matchLineups, matchLineupPlayers, playerMatchStats, teamMatchStats, injuries, transfersSport, fixtures, standings, teamMatchRatings, matchPlayers, news, newsInteractions, playerRatings, comments, commentLikes, badges, userBadges, notifications, userLineups, userSessions, transfers, transferVotes, transferRumors, transferRumorVotes, transferRumorComments, teamsForumTopics, teamsForumReplies, posts, hashtags, postHashtags, trendingTopics, postLikes, postBookmarks, userFollows, teamsForumLikes, gameSets, gameSetPlayers, gameAttempts, gameAttemptGuesses, gameDailyPlayer, gameDailyGuessProgress, usersRelations, journalistsRelations, teamsRelations, countriesRelations, competitionsRelations, standingsRelations, seasonsRelations, venuesRelations, teamRostersRelations, contractsRelations, matchGamesRelations, matchEventsRelations, matchLineupsRelations, matchLineupPlayersRelations, playerMatchStatsRelations, teamMatchStatsRelations, injuriesRelations, transfersSportRelations, fixturesRelations, playersRelations, matchesRelations, matchPlayersRelations, newsRelations, newsInteractionsRelations, playerRatingsRelations, commentsRelations, commentLikesRelations, userLineupsRelations, transfersRelations, transferVotesRelations, transferRumorsRelations, transferRumorVotesRelations, transferRumorCommentsRelations, teamsForumTopicsRelations, teamsForumRepliesRelations, teamsForumLikesRelations, postsRelations, postLikesRelations, postBookmarksRelations, userFollowsRelations, badgesRelations, userBadgesRelations, insertUserSchema, selectUserSchema, insertJournalistSchema, selectJournalistSchema, insertTeamSchema, selectTeamSchema, insertPlayerSchema, selectPlayerSchema, insertMatchSchema, selectMatchSchema, insertCompetitionSchema, selectCompetitionSchema, insertFixtureSchema, selectFixtureSchema, insertStandingSchema, selectStandingSchema, insertNewsSchema, selectNewsSchema, insertNewsInteractionSchema, selectNewsInteractionSchema, insertPlayerRatingSchema, selectPlayerRatingSchema, insertCommentSchema, selectCommentSchema, insertCommentLikeSchema, selectCommentLikeSchema, insertBadgeSchema, selectBadgeSchema, insertUserBadgeSchema, selectUserBadgeSchema, insertNotificationSchema, selectNotificationSchema, insertUserLineupSchema, selectUserLineupSchema, insertTransferSchema, selectTransferSchema, insertTransferVoteSchema, selectTransferVoteSchema, insertTransferRumorSchema, selectTransferRumorSchema, insertTransferRumorVoteSchema, selectTransferRumorVoteSchema, insertTransferRumorCommentSchema, selectTransferRumorCommentSchema, insertForumTopicSchema, selectForumTopicSchema, insertForumReplySchema, selectForumReplySchema, insertPostSchema, insertGameSetSchema, insertGameSetPlayerSchema, insertGameAttemptSchema, insertGameAttemptGuessSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    userTypeEnum = pgEnum("user_type", ["FAN", "JOURNALIST", "ADMIN"]);
    newsCategoryEnum = pgEnum("news_category", ["NEWS", "ANALYSIS", "BACKSTAGE", "MARKET"]);
    interactionTypeEnum = pgEnum("interaction_type", ["LIKE", "DISLIKE"]);
    journalistStatusEnum = pgEnum("journalist_status", ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"]);
    notificationTypeEnum = pgEnum("notification_type", [
      "NEW_NEWS",
      "UPCOMING_MATCH",
      "BADGE_EARNED",
      "MATCH_RESULT",
      "LIKE",
      "FOLLOW",
      "REPLY",
      "REPOST"
    ]);
    postScopeEnum = pgEnum("post_scope", ["ALL", "TEAM", "EUROPE"]);
    transferStatusEnum = pgEnum("transfer_status", ["RUMOR", "NEGOCIACAO", "FECHADO"]);
    transferVoteEnum = pgEnum("transfer_vote", ["UP", "DOWN"]);
    transferVoteSideEnum = pgEnum("transfer_vote_side", ["SELLING", "BUYING"]);
    transferVoteValueEnum = pgEnum("transfer_vote_value", ["LIKE", "DISLIKE"]);
    transferRumorStatusEnum = pgEnum("transfer_rumor_status", ["RUMOR", "NEGOTIATING", "DONE", "CANCELLED"]);
    fixtureStatusEnum = pgEnum("fixture_status", ["SCHEDULED", "LIVE", "FT", "POSTPONED", "CANCELED"]);
    preferredFootEnum = pgEnum("preferred_foot", ["LEFT", "RIGHT", "BOTH"]);
    primaryPositionEnum = pgEnum("primary_position", [
      "GK",
      "CB",
      "FB",
      "LB",
      "RB",
      "WB",
      "DM",
      "CM",
      "AM",
      "W",
      "LW",
      "RW",
      "ST",
      "SS",
      "CDM",
      "CAM"
    ]);
    rosterRoleEnum = pgEnum("roster_role", ["STARTER", "ROTATION", "YOUTH", "RESERVE"]);
    rosterStatusEnum = pgEnum("roster_status", [
      "ACTIVE",
      "LOANED_OUT",
      "INJURED",
      "SUSPENDED",
      "TRANSFERRED"
    ]);
    matchStatusEnum = pgEnum("match_status", [
      "SCHEDULED",
      "LIVE",
      "HT",
      "FT",
      "POSTPONED",
      "CANCELED"
    ]);
    matchEventTypeEnum = pgEnum("match_event_type", [
      "GOAL",
      "OWN_GOAL",
      "ASSIST",
      "YELLOW",
      "RED",
      "SUBSTITUTION",
      "PENALTY_SCORED",
      "PENALTY_MISSED",
      "VAR",
      "INJURY"
    ]);
    injuryStatusEnum = pgEnum("injury_status", ["DAY_TO_DAY", "OUT", "DOUBTFUL", "RECOVERED"]);
    transferStatusSportEnum = pgEnum("transfer_status_sport", ["RUMOR", "CONFIRMED", "CANCELED"]);
    forumTopicCategoryEnum = pgEnum("forum_topic_category", [
      "news",
      "pre_match",
      "post_match",
      "transfer",
      "off_topic",
      "base"
    ]);
    forumModerationStatusEnum = pgEnum("forum_moderation_status", ["PENDING", "APPROVED", "REMOVED"]);
    gameAttemptStatusEnum = pgEnum("game_attempt_status", ["in_progress", "completed", "abandoned"]);
    hashtagCategoryEnum = pgEnum("hashtag_category", ["time", "campeonato", "geral", "transferencia"]);
    trendingPeriodEnum = pgEnum("trending_period", ["1h", "6h", "24h"]);
    countries = pgTable("countries", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      name: varchar("name", { length: 255 }).notNull(),
      code: varchar("code", { length: 2 }).notNull().unique(),
      flagEmoji: varchar("flag_emoji", { length: 10 }),
      createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
    });
    users = pgTable("users", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      email: varchar("email", { length: 255 }).notNull().unique(),
      name: varchar("name", { length: 255 }).notNull(),
      password: text("password").notNull(),
      avatarUrl: text("avatar_url"),
      userType: userTypeEnum("user_type").notNull().default("FAN"),
      teamId: varchar("team_id", { length: 36 }),
      handle: varchar("handle", { length: 50 }).unique(),
      bio: text("bio"),
      location: varchar("location", { length: 100 }),
      website: text("website"),
      coverPhotoUrl: text("cover_photo_url"),
      followersCount: integer("followers_count").notNull().default(0),
      followingCount: integer("following_count").notNull().default(0),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    journalists = pgTable("journalists", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id", { length: 36 }).notNull().unique(),
      organization: varchar("organization", { length: 255 }).notNull(),
      professionalId: varchar("professional_id", { length: 100 }).notNull(),
      portfolioUrl: text("portfolio_url"),
      status: journalistStatusEnum("status").notNull().default("PENDING"),
      verificationDate: timestamp("verification_date"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    teams = pgTable("teams", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      name: varchar("name", { length: 255 }).notNull().unique(),
      shortName: varchar("short_name", { length: 10 }).notNull(),
      countryId: varchar("country_id", { length: 36 }).references(() => countries.id, { onDelete: "set null" }),
      foundedYear: integer("founded_year"),
      stadiumName: varchar("stadium_name", { length: 255 }),
      stadiumCapacity: integer("stadium_capacity"),
      primaryColor: varchar("primary_color", { length: 7 }).notNull(),
      secondaryColor: varchar("secondary_color", { length: 7 }).notNull(),
      logoUrl: text("logo_url").notNull(),
      crestUrl: text("crest_url"),
      currentPosition: integer("current_position"),
      points: integer("points").notNull().default(0),
      wins: integer("wins").notNull().default(0),
      draws: integer("draws").notNull().default(0),
      losses: integer("losses").notNull().default(0),
      goalsFor: integer("goals_for").notNull().default(0),
      goalsAgainst: integer("goals_against").notNull().default(0),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    players = pgTable(
      "players",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        teamId: varchar("team_id", { length: 36 }).notNull().references(() => teams.id),
        shirtNumber: integer("shirt_number"),
        name: text("name").notNull(),
        fullName: text("full_name"),
        knownName: varchar("known_name", { length: 100 }),
        position: text("position").notNull(),
        birthDate: date("birth_date", { mode: "string" }).notNull(),
        nationalityPrimary: text("nationality_primary").notNull(),
        nationalitySecondary: text("nationality_secondary"),
        nationalityCountryId: varchar("nationality_country_id", { length: 36 }).references(() => countries.id, {
          onDelete: "set null"
        }),
        primaryPosition: varchar("primary_position", { length: 10 }),
        secondaryPositions: text("secondary_positions"),
        heightCm: integer("height_cm"),
        preferredFoot: varchar("preferred_foot", { length: 10 }),
        marketValueEur: integer("market_value_eur"),
        fromClub: text("from_club"),
        photoUrl: text("photo_url"),
        sector: varchar("sector", { length: 10 }),
        slug: text("slug"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow()
      },
      (t) => ({
        // Unique composto recomendado: (teamId, name, birthDate)
        teamNameBirthDateUnique: uniqueIndex("players_team_name_birth_date_unique").on(
          t.teamId,
          t.name,
          t.birthDate
        ),
        // Unique (teamId, shirtNumber) apenas quando shirtNumber não for null
        teamShirtNumberUnique: uniqueIndex("players_team_shirt_number_unique").on(t.teamId, t.shirtNumber).where(sql`shirt_number is not null`),
        nationalityCountryIdx: index("players_nationality_country_idx").on(t.nationalityCountryId)
      })
    );
    matches = pgTable("matches", {
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
      /** Optional broadcast channel(s), e.g. "ESPN", "Globo", "Premiere" */
      broadcastChannel: varchar("broadcast_channel", { length: 255 }),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    competitions = pgTable("competitions", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      name: varchar("name", { length: 255 }).notNull(),
      countryId: varchar("country_id", { length: 36 }).references(() => countries.id, { onDelete: "set null" }),
      country: varchar("country", { length: 100 }),
      level: integer("level"),
      logoUrl: text("logo_url"),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    venues = pgTable("venues", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      name: varchar("name", { length: 255 }).notNull(),
      city: varchar("city", { length: 255 }),
      countryId: varchar("country_id", { length: 36 }).references(() => countries.id, { onDelete: "set null" }),
      capacity: integer("capacity"),
      createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
    });
    seasons = pgTable(
      "seasons",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        competitionId: varchar("competition_id", { length: 36 }).notNull().references(() => competitions.id, { onDelete: "cascade" }),
        year: integer("year").notNull(),
        startDate: date("start_date", { mode: "string" }),
        endDate: date("end_date", { mode: "string" }),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        competitionYearUnique: uniqueIndex("seasons_competition_year_unique").on(t.competitionId, t.year),
        competitionIdx: index("seasons_competition_idx").on(t.competitionId)
      })
    );
    teamRosters = pgTable(
      "team_rosters",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        teamId: varchar("team_id", { length: 36 }).notNull().references(() => teams.id, { onDelete: "cascade" }),
        seasonId: varchar("season_id", { length: 36 }).notNull().references(() => seasons.id, { onDelete: "cascade" }),
        playerId: varchar("player_id", { length: 36 }).notNull().references(() => players.id, { onDelete: "cascade" }),
        squadNumber: integer("squad_number"),
        role: rosterRoleEnum("role"),
        status: rosterStatusEnum("status").default("ACTIVE"),
        joinedAt: date("joined_at", { mode: "string" }),
        leftAt: date("left_at", { mode: "string" }),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        teamSeasonPlayerUnique: uniqueIndex("team_rosters_team_season_player_unique").on(
          t.teamId,
          t.seasonId,
          t.playerId
        ),
        teamSeasonIdx: index("team_rosters_team_season_idx").on(t.teamId, t.seasonId),
        playerIdx: index("team_rosters_player_idx").on(t.playerId)
      })
    );
    contracts = pgTable("contracts", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      teamRosterId: varchar("team_roster_id", { length: 36 }).references(() => teamRosters.id, {
        onDelete: "cascade"
      }),
      startDate: date("start_date", { mode: "string" }).notNull(),
      endDate: date("end_date", { mode: "string" }),
      salaryWeekly: integer("salary_weekly"),
      marketValue: integer("market_value"),
      createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
    });
    matchGames = pgTable(
      "match_games",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        seasonId: varchar("season_id", { length: 36 }).references(() => seasons.id, { onDelete: "restrict" }),
        competitionId: varchar("competition_id", { length: 36 }).references(() => competitions.id, {
          onDelete: "restrict"
        }),
        venueId: varchar("venue_id", { length: 36 }).references(() => venues.id, { onDelete: "set null" }),
        kickoffAt: timestamp("kickoff_at", { withTimezone: true }).notNull(),
        status: matchStatusEnum("status").notNull().default("SCHEDULED"),
        homeTeamId: varchar("home_team_id", { length: 36 }).references(() => teams.id, { onDelete: "restrict" }),
        awayTeamId: varchar("away_team_id", { length: 36 }).references(() => teams.id, { onDelete: "restrict" }),
        homeScore: integer("home_score"),
        awayScore: integer("away_score"),
        round: varchar("round", { length: 100 }),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        homeTeamKickoffIdx: index("match_games_home_team_kickoff_idx").on(t.homeTeamId, t.kickoffAt),
        awayTeamKickoffIdx: index("match_games_away_team_kickoff_idx").on(t.awayTeamId, t.kickoffAt),
        competitionKickoffIdx: index("match_games_competition_kickoff_idx").on(t.competitionId, t.kickoffAt),
        statusIdx: index("match_games_status_idx").on(t.status),
        kickoffIdx: index("match_games_kickoff_idx").on(t.kickoffAt)
      })
    );
    matchEvents = pgTable(
      "match_events",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        matchId: varchar("match_id", { length: 36 }).notNull().references(() => matchGames.id, { onDelete: "cascade" }),
        minute: integer("minute"),
        type: matchEventTypeEnum("type").notNull(),
        teamId: varchar("team_id", { length: 36 }).references(() => teams.id, { onDelete: "set null" }),
        playerId: varchar("player_id", { length: 36 }).references(() => players.id, { onDelete: "set null" }),
        relatedPlayerId: varchar("related_player_id", { length: 36 }).references(() => players.id, {
          onDelete: "set null"
        }),
        detail: text("detail"),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        matchIdx: index("match_events_match_idx").on(t.matchId),
        matchMinuteIdx: index("match_events_match_minute_idx").on(t.matchId, t.minute)
      })
    );
    matchLineups = pgTable(
      "match_lineups",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        matchId: varchar("match_id", { length: 36 }).notNull().references(() => matchGames.id, { onDelete: "cascade" }),
        teamId: varchar("team_id", { length: 36 }).notNull().references(() => teams.id, { onDelete: "cascade" }),
        formation: varchar("formation", { length: 20 }).notNull().default("4-3-3"),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        matchTeamUnique: uniqueIndex("match_lineups_match_team_unique").on(t.matchId, t.teamId),
        matchIdx: index("match_lineups_match_idx").on(t.matchId)
      })
    );
    matchLineupPlayers = pgTable(
      "match_lineup_players",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        matchLineupId: varchar("match_lineup_id", { length: 36 }).notNull().references(() => matchLineups.id, { onDelete: "cascade" }),
        playerId: varchar("player_id", { length: 36 }).notNull().references(() => players.id, { onDelete: "cascade" }),
        isStarter: boolean("is_starter").notNull().default(true),
        positionCode: varchar("position_code", { length: 10 }),
        shirtNumber: integer("shirt_number"),
        minutesPlayed: integer("minutes_played"),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        lineupPlayerUnique: uniqueIndex("match_lineup_players_lineup_player_unique").on(
          t.matchLineupId,
          t.playerId
        ),
        lineupIdx: index("match_lineup_players_lineup_idx").on(t.matchLineupId)
      })
    );
    playerMatchStats = pgTable(
      "player_match_stats",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        matchId: varchar("match_id", { length: 36 }).notNull().references(() => matchGames.id, { onDelete: "cascade" }),
        playerId: varchar("player_id", { length: 36 }).notNull().references(() => players.id, { onDelete: "cascade" }),
        teamId: varchar("team_id", { length: 36 }).notNull().references(() => teams.id, { onDelete: "cascade" }),
        minutes: integer("minutes").notNull().default(0),
        rating: real("rating"),
        goals: integer("goals").notNull().default(0),
        assists: integer("assists").notNull().default(0),
        shots: integer("shots").notNull().default(0),
        passes: integer("passes").notNull().default(0),
        tackles: integer("tackles").notNull().default(0),
        saves: integer("saves").notNull().default(0),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        matchPlayerUnique: uniqueIndex("player_match_stats_match_player_unique").on(t.matchId, t.playerId),
        matchIdx: index("player_match_stats_match_idx").on(t.matchId),
        playerIdx: index("player_match_stats_player_idx").on(t.playerId)
      })
    );
    teamMatchStats = pgTable(
      "team_match_stats",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        matchId: varchar("match_id", { length: 36 }).notNull().references(() => matchGames.id, { onDelete: "cascade" }),
        teamId: varchar("team_id", { length: 36 }).notNull().references(() => teams.id, { onDelete: "cascade" }),
        possession: integer("possession"),
        shots: integer("shots"),
        shotsOnTarget: integer("shots_on_target"),
        corners: integer("corners"),
        fouls: integer("fouls"),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        matchTeamUnique: uniqueIndex("team_match_stats_match_team_unique").on(t.matchId, t.teamId),
        matchIdx: index("team_match_stats_match_idx").on(t.matchId)
      })
    );
    injuries = pgTable("injuries", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      playerId: varchar("player_id", { length: 36 }).notNull().references(() => players.id, { onDelete: "cascade" }),
      teamId: varchar("team_id", { length: 36 }).references(() => teams.id, { onDelete: "set null" }),
      type: text("type").notNull(),
      status: injuryStatusEnum("status").notNull().default("OUT"),
      startedAt: date("started_at", { mode: "string" }).notNull(),
      expectedReturnAt: date("expected_return_at", { mode: "string" }),
      note: text("note"),
      createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
    });
    transfersSport = pgTable("transfers_sport", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      playerId: varchar("player_id", { length: 36 }).notNull().references(() => players.id, { onDelete: "cascade" }),
      fromTeamId: varchar("from_team_id", { length: 36 }).references(() => teams.id, { onDelete: "set null" }),
      toTeamId: varchar("to_team_id", { length: 36 }).references(() => teams.id, { onDelete: "set null" }),
      fee: integer("fee"),
      status: transferStatusSportEnum("status").notNull().default("RUMOR"),
      announcedAt: timestamp("announced_at", { withTimezone: true }),
      sourceUrl: text("source_url"),
      createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
    });
    fixtures = pgTable(
      "fixtures",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        teamId: varchar("team_id", { length: 36 }).notNull().references(() => teams.id),
        competitionId: varchar("competition_id", { length: 36 }).notNull().references(() => competitions.id),
        season: varchar("season", { length: 10 }).notNull(),
        round: varchar("round", { length: 100 }),
        status: fixtureStatusEnum("status").notNull().default("SCHEDULED"),
        kickoffAt: timestamp("kickoff_at", { withTimezone: true }).notNull(),
        homeTeamName: varchar("home_team_name", { length: 255 }).notNull(),
        awayTeamName: varchar("away_team_name", { length: 255 }).notNull(),
        homeTeamId: varchar("home_team_id", { length: 36 }).references(() => teams.id),
        awayTeamId: varchar("away_team_id", { length: 36 }).references(() => teams.id),
        homeScore: integer("home_score"),
        awayScore: integer("away_score"),
        venue: varchar("venue", { length: 255 }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow()
      },
      (t) => ({
        teamKickoffIdx: index("fixtures_team_kickoff_idx").on(t.teamId, t.kickoffAt),
        competitionIdx: index("fixtures_competition_idx").on(t.competitionId),
        statusIdx: index("fixtures_status_idx").on(t.status)
      })
    );
    standings = pgTable(
      "standings",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        competitionId: varchar("competition_id", { length: 36 }).notNull().references(() => competitions.id, { onDelete: "cascade" }),
        teamId: varchar("team_id", { length: 36 }).notNull().references(() => teams.id, { onDelete: "cascade" }),
        season: varchar("season", { length: 10 }).notNull().default("2026"),
        position: integer("position").notNull(),
        played: integer("played").notNull().default(0),
        wins: integer("wins").notNull().default(0),
        draws: integer("draws").notNull().default(0),
        losses: integer("losses").notNull().default(0),
        goalsFor: integer("goals_for").notNull().default(0),
        goalsAgainst: integer("goals_against").notNull().default(0),
        goalDiff: integer("goal_diff").notNull().default(0),
        points: integer("points").notNull().default(0),
        form: json("form").$type().default([]),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        competitionTeamSeasonUnique: uniqueIndex("standings_competition_team_season_unique").on(
          t.competitionId,
          t.teamId,
          t.season
        ),
        competitionIdx: index("standings_competition_idx").on(t.competitionId),
        teamIdx: index("standings_team_idx").on(t.teamId),
        positionIdx: index("standings_position_idx").on(t.competitionId, t.season, t.position)
      })
    );
    teamMatchRatings = pgTable(
      "team_match_ratings",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        fixtureId: varchar("fixture_id", { length: 36 }).notNull().references(() => fixtures.id, { onDelete: "cascade" }),
        teamId: varchar("team_id", { length: 36 }).notNull().references(() => teams.id, { onDelete: "cascade" }),
        rating: real("rating").notNull(),
        source: text("source"),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        fixtureTeamUnique: uniqueIndex("team_match_ratings_fixture_team_unique").on(t.fixtureId, t.teamId),
        teamFixtureIdx: index("team_match_ratings_team_fixture_idx").on(t.teamId, t.fixtureId)
      })
    );
    matchPlayers = pgTable("match_players", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      matchId: varchar("match_id", { length: 36 }).notNull(),
      playerId: varchar("player_id", { length: 36 }).notNull(),
      participated: boolean("participated").notNull().default(true),
      wasStarter: boolean("was_starter").notNull().default(false),
      minutesPlayed: integer("minutes_played"),
      sofascoreRating: real("sofascore_rating"),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    news = pgTable("news", {
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
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    newsInteractions = pgTable("news_interactions", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id", { length: 36 }).notNull(),
      newsId: varchar("news_id", { length: 36 }).notNull(),
      interactionType: interactionTypeEnum("interaction_type").notNull(),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    playerRatings = pgTable(
      "player_ratings",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        userId: varchar("user_id", { length: 36 }).notNull(),
        playerId: varchar("player_id", { length: 36 }).notNull(),
        matchId: varchar("match_id", { length: 36 }).notNull(),
        rating: real("rating").notNull(),
        comment: varchar("comment", { length: 200 }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow()
      },
      (t) => ({
        userMatchPlayerUnique: uniqueIndex("player_ratings_user_match_player_unique").on(t.userId, t.matchId, t.playerId)
      })
    );
    comments = pgTable("comments", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      newsId: varchar("news_id", { length: 36 }).notNull().references(() => news.id, { onDelete: "cascade" }),
      userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
      content: text("content").notNull(),
      isApproved: boolean("is_approved").notNull().default(true),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    commentLikes = pgTable(
      "comment_likes",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        commentId: varchar("comment_id", { length: 36 }).notNull().references(() => comments.id, { onDelete: "cascade" }),
        userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow()
      },
      (t) => ({
        commentUserUnique: uniqueIndex("comment_likes_comment_user_unique").on(t.commentId, t.userId),
        commentIdIdx: index("comment_likes_comment_id_idx").on(t.commentId),
        userIdIdx: index("comment_likes_user_id_idx").on(t.userId)
      })
    );
    badges = pgTable("badges", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      name: varchar("name", { length: 100 }).notNull(),
      description: text("description").notNull(),
      icon: varchar("icon", { length: 10 }).notNull(),
      condition: varchar("condition", { length: 100 }).notNull(),
      threshold: integer("threshold").notNull(),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    userBadges = pgTable("user_badges", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id", { length: 36 }).notNull(),
      badgeId: varchar("badge_id", { length: 36 }).notNull(),
      earnedAt: timestamp("earned_at").notNull().defaultNow()
    });
    notifications = pgTable("notifications", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id", { length: 36 }).notNull(),
      actorId: varchar("actor_id", { length: 36 }),
      type: notificationTypeEnum("type").notNull(),
      title: varchar("title", { length: 200 }).notNull(),
      message: text("message").notNull(),
      referenceId: varchar("reference_id", { length: 36 }),
      isRead: boolean("is_read").notNull().default(false),
      createdAt: timestamp("created_at").notNull().defaultNow()
    });
    userLineups = pgTable(
      "user_lineups",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
        teamId: varchar("team_id", { length: 36 }).notNull().references(() => teams.id),
        formation: varchar("formation", { length: 20 }).notNull(),
        slots: json("slots").$type().notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow()
      },
      (t) => ({
        userTeamUnique: uniqueIndex("user_lineups_user_team_unique").on(t.userId, t.teamId)
      })
    );
    userSessions = pgTable(
      "user_sessions",
      {
        sid: varchar("sid", { length: 255 }).primaryKey(),
        sess: json("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (t) => ({
        expireIdx: index("IDX_user_sessions_expire").on(t.expire)
      })
    );
    transfers = pgTable("transfers", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      playerName: text("player_name").notNull(),
      playerPhotoUrl: text("player_photo_url"),
      positionAbbrev: varchar("position_abbrev", { length: 10 }).notNull(),
      fromTeamId: varchar("from_team_id", { length: 36 }).references(() => teams.id),
      toTeamId: varchar("to_team_id", { length: 36 }).references(() => teams.id),
      status: transferStatusEnum("status").notNull(),
      createdByJournalistId: varchar("created_by_journalist_id", { length: 36 }).references(() => journalists.id, {
        onDelete: "set null"
      }),
      updatedAt: timestamp("updated_at").notNull().defaultNow(),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      sourceLabel: text("source_label"),
      sourceUrl: text("source_url"),
      feeText: text("fee_text"),
      notes: text("notes")
    });
    transferVotes = pgTable(
      "transfer_votes",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        transferId: varchar("transfer_id", { length: 36 }).notNull().references(() => transfers.id, { onDelete: "cascade" }),
        userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
        side: transferVoteSideEnum("side").notNull(),
        vote: transferVoteValueEnum("vote").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        transferUserSideUnique: uniqueIndex("transfer_votes_transfer_user_side_unique").on(
          t.transferId,
          t.userId,
          t.side
        ),
        transferSideIdx: index("transfer_votes_transfer_side_idx").on(t.transferId, t.side),
        userIdIdx: index("transfer_votes_user_idx").on(t.userId)
      })
    );
    transferRumors = pgTable(
      "transfer_rumors",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        playerId: varchar("player_id", { length: 36 }).notNull().references(() => players.id, { onDelete: "restrict" }),
        fromTeamId: varchar("from_team_id", { length: 36 }).notNull().references(() => teams.id, { onDelete: "restrict" }),
        toTeamId: varchar("to_team_id", { length: 36 }).notNull().references(() => teams.id, { onDelete: "restrict" }),
        status: transferRumorStatusEnum("status").notNull().default("RUMOR"),
        feeAmount: numeric("fee_amount", { precision: 18, scale: 2 }),
        feeCurrency: text("fee_currency").default("BRL"),
        contractUntil: date("contract_until", { mode: "string" }),
        sourceUrl: text("source_url"),
        sourceName: text("source_name"),
        note: text("note"),
        createdByUserId: varchar("created_by_user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "restrict" }),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        statusCreatedIdx: index("transfer_rumors_status_created_idx").on(t.status, t.createdAt),
        fromTeamIdx: index("transfer_rumors_from_team_idx").on(t.fromTeamId),
        toTeamIdx: index("transfer_rumors_to_team_idx").on(t.toTeamId),
        playerIdx: index("transfer_rumors_player_idx").on(t.playerId),
        createdByIdx: index("transfer_rumors_created_by_idx").on(t.createdByUserId)
      })
    );
    transferRumorVotes = pgTable(
      "transfer_rumor_votes",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        rumorId: varchar("rumor_id", { length: 36 }).notNull().references(() => transferRumors.id, { onDelete: "cascade" }),
        userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
        side: transferVoteSideEnum("side").notNull(),
        vote: transferVoteValueEnum("vote").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        rumorUserSideUnique: uniqueIndex("transfer_rumor_votes_rumor_user_side_unique").on(
          t.rumorId,
          t.userId,
          t.side
        ),
        rumorSideIdx: index("transfer_rumor_votes_rumor_side_idx").on(t.rumorId, t.side),
        userIdIdx: index("transfer_rumor_votes_user_idx").on(t.userId)
      })
    );
    transferRumorComments = pgTable(
      "transfer_rumor_comments",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        rumorId: varchar("rumor_id", { length: 36 }).notNull().references(() => transferRumors.id, { onDelete: "cascade" }),
        userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
        content: text("content").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
        isDeleted: boolean("is_deleted").notNull().default(false)
      },
      (t) => ({
        rumorCreatedIdx: index("transfer_rumor_comments_rumor_created_idx").on(t.rumorId, t.createdAt),
        userIdIdx: index("transfer_rumor_comments_user_idx").on(t.userId)
      })
    );
    teamsForumTopics = pgTable(
      "teams_forum_topics",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        teamId: varchar("team_id", { length: 36 }).notNull().references(() => teams.id, { onDelete: "cascade" }),
        authorId: varchar("author_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
        title: varchar("title", { length: 300 }).notNull(),
        content: text("content").notNull(),
        category: forumTopicCategoryEnum("category").notNull().default("base"),
        coverImageUrl: text("cover_image_url"),
        viewsCount: integer("views_count").notNull().default(0),
        likesCount: integer("likes_count").notNull().default(0),
        repliesCount: integer("replies_count").notNull().default(0),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
        isPinned: boolean("is_pinned").notNull().default(false),
        isLocked: boolean("is_locked").notNull().default(false),
        reportCount: integer("report_count").notNull().default(0),
        isRemoved: boolean("is_removed").notNull().default(false),
        moderationStatus: forumModerationStatusEnum("moderation_status").notNull().default("APPROVED")
      },
      (t) => ({
        teamIdIdx: index("teams_forum_topics_team_id_idx").on(t.teamId),
        createdAtIdx: index("teams_forum_topics_created_at_idx").on(t.createdAt),
        categoryIdx: index("teams_forum_topics_category_idx").on(t.category),
        teamCategoryIdx: index("teams_forum_topics_team_category_idx").on(t.teamId, t.category)
      })
    );
    teamsForumReplies = pgTable(
      "teams_forum_replies",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        topicId: varchar("topic_id", { length: 36 }).notNull().references(() => teamsForumTopics.id, { onDelete: "cascade" }),
        authorId: varchar("author_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
        content: text("content").notNull(),
        likesCount: integer("likes_count").notNull().default(0),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        topicIdIdx: index("teams_forum_replies_topic_id_idx").on(t.topicId)
      })
    );
    posts = pgTable("posts", {
      id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
      content: text("content").notNull(),
      imageUrl: text("image_url"),
      parentPostId: varchar("parent_post_id", { length: 36 }),
      replyCount: integer("reply_count").notNull().default(0),
      likeCount: integer("like_count").notNull().default(0),
      repostCount: integer("repost_count").notNull().default(0),
      bookmarkCount: integer("bookmark_count").notNull().default(0),
      viewCount: integer("view_count").notNull().default(0),
      relatedNewsId: varchar("related_news_id", { length: 36 }),
      hashtags: text("hashtags").array(),
      createdAt: timestamp("created_at").notNull().defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow()
    });
    hashtags = pgTable(
      "hashtags",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        name: varchar("name", { length: 100 }).notNull().unique(),
        postCount: integer("post_count").notNull().default(0),
        category: hashtagCategoryEnum("category").notNull().default("geral"),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        nameIdx: index("hashtags_name_idx").on(t.name),
        postCountIdx: index("hashtags_post_count_idx").on(t.postCount)
      })
    );
    postHashtags = pgTable(
      "post_hashtags",
      {
        postId: varchar("post_id", { length: 36 }).notNull().references(() => posts.id, { onDelete: "cascade" }),
        hashtagId: varchar("hashtag_id", { length: 36 }).notNull().references(() => hashtags.id, { onDelete: "cascade" })
      },
      (t) => ({
        postHashtagUnique: uniqueIndex("post_hashtags_post_hashtag_unique").on(t.postId, t.hashtagId),
        postIdx: index("post_hashtags_post_idx").on(t.postId),
        hashtagIdx: index("post_hashtags_hashtag_idx").on(t.hashtagId)
      })
    );
    trendingTopics = pgTable(
      "trending_topics",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        title: varchar("title", { length: 200 }).notNull(),
        subtitle: text("subtitle"),
        category: hashtagCategoryEnum("category").notNull().default("geral"),
        postCount: integer("post_count").notNull().default(0),
        teamId: varchar("team_id", { length: 36 }).references(() => teams.id, { onDelete: "set null" }),
        period: trendingPeriodEnum("period").notNull().default("24h"),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        periodIdx: index("trending_topics_period_idx").on(t.period),
        categoryIdx: index("trending_topics_category_idx").on(t.category)
      })
    );
    postLikes = pgTable(
      "post_likes",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        postId: varchar("post_id", { length: 36 }).notNull().references(() => posts.id, { onDelete: "cascade" }),
        userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow()
      },
      (t) => ({
        uniqueUserPost: uniqueIndex("post_likes_user_post_unique").on(t.userId, t.postId)
      })
    );
    postBookmarks = pgTable(
      "post_bookmarks",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        postId: varchar("post_id", { length: 36 }).notNull().references(() => posts.id, { onDelete: "cascade" }),
        userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow()
      },
      (t) => ({
        uniqueUserPost: uniqueIndex("post_bookmarks_user_post_unique").on(t.userId, t.postId)
      })
    );
    userFollows = pgTable(
      "user_follows",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        followerId: varchar("follower_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
        followingId: varchar("following_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").notNull().defaultNow()
      },
      (t) => ({
        uniqueFollow: uniqueIndex("user_follows_unique").on(t.followerId, t.followingId)
      })
    );
    teamsForumLikes = pgTable(
      "teams_forum_likes",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
        topicId: varchar("topic_id", { length: 36 }).references(() => teamsForumTopics.id, { onDelete: "cascade" }),
        replyId: varchar("reply_id", { length: 36 }).references(() => teamsForumReplies.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        topicIdx: index("teams_forum_likes_topic_idx").on(t.topicId),
        replyIdx: index("teams_forum_likes_reply_idx").on(t.replyId)
      })
    );
    gameSets = pgTable(
      "game_sets",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        slug: text("slug").notNull().unique(),
        title: text("title").notNull(),
        season: integer("season"),
        competition: text("competition"),
        clubName: text("club_name").notNull(),
        metadata: json("metadata").$type(),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        slugIdx: index("game_sets_slug_idx").on(t.slug)
      })
    );
    gameSetPlayers = pgTable(
      "game_set_players",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        setId: varchar("set_id", { length: 36 }).notNull().references(() => gameSets.id, { onDelete: "cascade" }),
        jerseyNumber: integer("jersey_number"),
        displayName: text("display_name").notNull(),
        normalizedName: text("normalized_name").notNull(),
        aliases: json("aliases").$type(),
        role: varchar("role", { length: 20 }).default("player"),
        sortOrder: integer("sort_order").notNull().default(0),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        setIdIdx: index("game_set_players_set_id_idx").on(t.setId),
        normalizedNameIdx: index("game_set_players_normalized_name_idx").on(t.normalizedName)
      })
    );
    gameAttempts = pgTable(
      "game_attempts",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
        setId: varchar("set_id", { length: 36 }).notNull().references(() => gameSets.id, { onDelete: "cascade" }),
        status: gameAttemptStatusEnum("status").notNull().default("in_progress"),
        startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
        completedAt: timestamp("completed_at", { withTimezone: true }),
        guessesCount: integer("guesses_count").notNull().default(0),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        userSetIdx: uniqueIndex("game_attempts_user_set_unique").on(t.userId, t.setId),
        userIdIdx: index("game_attempts_user_id_idx").on(t.userId),
        setIdIdx: index("game_attempts_set_id_idx").on(t.setId)
      })
    );
    gameAttemptGuesses = pgTable(
      "game_attempt_guesses",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        attemptId: varchar("attempt_id", { length: 36 }).notNull().references(() => gameAttempts.id, { onDelete: "cascade" }),
        setPlayerId: varchar("set_player_id", { length: 36 }).notNull().references(() => gameSetPlayers.id, { onDelete: "cascade" }),
        guessedText: text("guessed_text").notNull(),
        matchedScore: real("matched_score"),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        attemptPlayerUnique: uniqueIndex("game_attempt_guesses_attempt_player_unique").on(
          t.attemptId,
          t.setPlayerId
        ),
        attemptIdx: index("game_attempt_guesses_attempt_idx").on(t.attemptId)
      })
    );
    gameDailyPlayer = pgTable(
      "game_daily_player",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        dateKey: varchar("date_key", { length: 10 }).notNull(),
        teamId: varchar("team_id", { length: 36 }).notNull().references(() => teams.id, { onDelete: "cascade" }),
        playerId: varchar("player_id", { length: 36 }).notNull().references(() => players.id, { onDelete: "cascade" }),
        seedUsed: integer("seed_used"),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        dateTeamUnique: uniqueIndex("game_daily_player_date_team_unique").on(t.dateKey, t.teamId)
      })
    );
    gameDailyGuessProgress = pgTable(
      "game_daily_guess_progress",
      {
        id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
        userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
        dateKey: varchar("date_key", { length: 10 }).notNull(),
        dailyPlayerId: varchar("daily_player_id", { length: 36 }).notNull().references(() => gameDailyPlayer.id, { onDelete: "cascade" }),
        attempts: integer("attempts").notNull().default(0),
        wrongAttempts: integer("wrong_attempts").notNull().default(0),
        guessed: boolean("guessed").notNull().default(false),
        lost: boolean("lost").notNull().default(false),
        guesses: json("guesses").$type().default([]),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
      },
      (t) => ({
        userDateKeyUnique: uniqueIndex("game_daily_guess_progress_user_date_unique").on(t.userId, t.dateKey),
        userIdIdx: index("game_daily_guess_progress_user_idx").on(t.userId),
        dateKeyIdx: index("game_daily_guess_progress_date_idx").on(t.dateKey)
      })
    );
    usersRelations = relations(users, ({ one, many }) => ({
      team: one(teams, {
        fields: [users.teamId],
        references: [teams.id]
      }),
      journalist: one(journalists, {
        fields: [users.id],
        references: [journalists.userId]
      }),
      newsInteractions: many(newsInteractions),
      playerRatings: many(playerRatings),
      comments: many(comments),
      userBadges: many(userBadges),
      notifications: many(notifications),
      userLineups: many(userLineups),
      transferRumorsCreated: many(transferRumors),
      transferRumorVotes: many(transferRumorVotes),
      transferRumorComments: many(transferRumorComments),
      posts: many(posts),
      postLikes: many(postLikes),
      postBookmarks: many(postBookmarks),
      followers: many(userFollows, { relationName: "asFollowing" }),
      following: many(userFollows, { relationName: "asFollower" })
    }));
    journalistsRelations = relations(journalists, ({ one, many }) => ({
      user: one(users, {
        fields: [journalists.userId],
        references: [users.id]
      }),
      news: many(news),
      transfers: many(transfers)
    }));
    teamsRelations = relations(teams, ({ one, many }) => ({
      country: one(countries, {
        fields: [teams.countryId],
        references: [countries.id]
      }),
      users: many(users),
      players: many(players),
      news: many(news),
      matches: many(matches),
      fixtures: many(fixtures),
      userLineups: many(userLineups),
      teamRosters: many(teamRosters),
      forumTopics: many(teamsForumTopics),
      standings: many(standings),
      transferRumorsFrom: many(transferRumors, { relationName: "transferRumorsFrom" }),
      transferRumorsTo: many(transferRumors, { relationName: "transferRumorsTo" })
    }));
    countriesRelations = relations(countries, ({ many }) => ({
      teams: many(teams),
      competitions: many(competitions),
      venues: many(venues)
    }));
    competitionsRelations = relations(competitions, ({ one, many }) => ({
      country: one(countries, {
        fields: [competitions.countryId],
        references: [countries.id]
      }),
      fixtures: many(fixtures),
      seasons: many(seasons),
      standings: many(standings)
    }));
    standingsRelations = relations(standings, ({ one }) => ({
      competition: one(competitions, {
        fields: [standings.competitionId],
        references: [competitions.id]
      }),
      team: one(teams, {
        fields: [standings.teamId],
        references: [teams.id]
      })
    }));
    seasonsRelations = relations(seasons, ({ one, many }) => ({
      competition: one(competitions, {
        fields: [seasons.competitionId],
        references: [competitions.id]
      }),
      teamRosters: many(teamRosters),
      matchGames: many(matchGames)
    }));
    venuesRelations = relations(venues, ({ one }) => ({
      country: one(countries, {
        fields: [venues.countryId],
        references: [countries.id]
      })
    }));
    teamRostersRelations = relations(teamRosters, ({ one, many }) => ({
      team: one(teams, {
        fields: [teamRosters.teamId],
        references: [teams.id]
      }),
      season: one(seasons, {
        fields: [teamRosters.seasonId],
        references: [seasons.id]
      }),
      player: one(players, {
        fields: [teamRosters.playerId],
        references: [players.id]
      }),
      contracts: many(contracts)
    }));
    contractsRelations = relations(contracts, ({ one }) => ({
      teamRoster: one(teamRosters, {
        fields: [contracts.teamRosterId],
        references: [teamRosters.id]
      })
    }));
    matchGamesRelations = relations(matchGames, ({ one, many }) => ({
      season: one(seasons, {
        fields: [matchGames.seasonId],
        references: [seasons.id]
      }),
      competition: one(competitions, {
        fields: [matchGames.competitionId],
        references: [competitions.id]
      }),
      venue: one(venues, {
        fields: [matchGames.venueId],
        references: [venues.id]
      }),
      homeTeam: one(teams, {
        fields: [matchGames.homeTeamId],
        references: [teams.id]
      }),
      awayTeam: one(teams, {
        fields: [matchGames.awayTeamId],
        references: [teams.id]
      }),
      events: many(matchEvents),
      lineups: many(matchLineups),
      playerStats: many(playerMatchStats),
      teamStats: many(teamMatchStats)
    }));
    matchEventsRelations = relations(matchEvents, ({ one }) => ({
      match: one(matchGames, {
        fields: [matchEvents.matchId],
        references: [matchGames.id]
      }),
      team: one(teams, {
        fields: [matchEvents.teamId],
        references: [teams.id]
      }),
      player: one(players, {
        fields: [matchEvents.playerId],
        references: [players.id]
      })
    }));
    matchLineupsRelations = relations(matchLineups, ({ one, many }) => ({
      match: one(matchGames, {
        fields: [matchLineups.matchId],
        references: [matchGames.id]
      }),
      team: one(teams, {
        fields: [matchLineups.teamId],
        references: [teams.id]
      }),
      players: many(matchLineupPlayers)
    }));
    matchLineupPlayersRelations = relations(matchLineupPlayers, ({ one }) => ({
      matchLineup: one(matchLineups, {
        fields: [matchLineupPlayers.matchLineupId],
        references: [matchLineups.id]
      }),
      player: one(players, {
        fields: [matchLineupPlayers.playerId],
        references: [players.id]
      })
    }));
    playerMatchStatsRelations = relations(playerMatchStats, ({ one }) => ({
      match: one(matchGames, {
        fields: [playerMatchStats.matchId],
        references: [matchGames.id]
      }),
      player: one(players, {
        fields: [playerMatchStats.playerId],
        references: [players.id]
      }),
      team: one(teams, {
        fields: [playerMatchStats.teamId],
        references: [teams.id]
      })
    }));
    teamMatchStatsRelations = relations(teamMatchStats, ({ one }) => ({
      match: one(matchGames, {
        fields: [teamMatchStats.matchId],
        references: [matchGames.id]
      }),
      team: one(teams, {
        fields: [teamMatchStats.teamId],
        references: [teams.id]
      })
    }));
    injuriesRelations = relations(injuries, ({ one }) => ({
      player: one(players, {
        fields: [injuries.playerId],
        references: [players.id]
      }),
      team: one(teams, {
        fields: [injuries.teamId],
        references: [teams.id]
      })
    }));
    transfersSportRelations = relations(transfersSport, ({ one }) => ({
      player: one(players, {
        fields: [transfersSport.playerId],
        references: [players.id]
      }),
      fromTeam: one(teams, {
        fields: [transfersSport.fromTeamId],
        references: [teams.id]
      }),
      toTeam: one(teams, {
        fields: [transfersSport.toTeamId],
        references: [teams.id]
      })
    }));
    fixturesRelations = relations(fixtures, ({ one }) => ({
      team: one(teams, {
        fields: [fixtures.teamId],
        references: [teams.id]
      }),
      competition: one(competitions, {
        fields: [fixtures.competitionId],
        references: [competitions.id]
      })
    }));
    playersRelations = relations(players, ({ one, many }) => ({
      team: one(teams, {
        fields: [players.teamId],
        references: [teams.id]
      }),
      ratings: many(playerRatings),
      matchParticipations: many(matchPlayers),
      teamRosters: many(teamRosters),
      transferRumors: many(transferRumors)
    }));
    matchesRelations = relations(matches, ({ one, many }) => ({
      team: one(teams, {
        fields: [matches.teamId],
        references: [teams.id]
      }),
      playerParticipations: many(matchPlayers),
      playerRatings: many(playerRatings)
    }));
    matchPlayersRelations = relations(matchPlayers, ({ one }) => ({
      match: one(matches, {
        fields: [matchPlayers.matchId],
        references: [matches.id]
      }),
      player: one(players, {
        fields: [matchPlayers.playerId],
        references: [players.id]
      })
    }));
    newsRelations = relations(news, ({ one, many }) => ({
      journalist: one(journalists, {
        fields: [news.journalistId],
        references: [journalists.id]
      }),
      team: one(teams, {
        fields: [news.teamId],
        references: [teams.id]
      }),
      interactions: many(newsInteractions),
      comments: many(comments)
    }));
    newsInteractionsRelations = relations(newsInteractions, ({ one }) => ({
      user: one(users, {
        fields: [newsInteractions.userId],
        references: [users.id]
      }),
      news: one(news, {
        fields: [newsInteractions.newsId],
        references: [news.id]
      })
    }));
    playerRatingsRelations = relations(playerRatings, ({ one }) => ({
      user: one(users, {
        fields: [playerRatings.userId],
        references: [users.id]
      }),
      player: one(players, {
        fields: [playerRatings.playerId],
        references: [players.id]
      }),
      match: one(matches, {
        fields: [playerRatings.matchId],
        references: [matches.id]
      })
    }));
    commentsRelations = relations(comments, ({ one, many }) => ({
      user: one(users, {
        fields: [comments.userId],
        references: [users.id]
      }),
      news: one(news, {
        fields: [comments.newsId],
        references: [news.id]
      }),
      likes: many(commentLikes)
    }));
    commentLikesRelations = relations(commentLikes, ({ one }) => ({
      comment: one(comments, {
        fields: [commentLikes.commentId],
        references: [comments.id]
      }),
      user: one(users, {
        fields: [commentLikes.userId],
        references: [users.id]
      })
    }));
    userLineupsRelations = relations(userLineups, ({ one }) => ({
      user: one(users, {
        fields: [userLineups.userId],
        references: [users.id]
      }),
      team: one(teams, {
        fields: [userLineups.teamId],
        references: [teams.id]
      })
    }));
    transfersRelations = relations(transfers, ({ one, many }) => ({
      fromTeam: one(teams, {
        fields: [transfers.fromTeamId],
        references: [teams.id]
      }),
      toTeam: one(teams, {
        fields: [transfers.toTeamId],
        references: [teams.id]
      }),
      createdByJournalist: one(journalists, {
        fields: [transfers.createdByJournalistId],
        references: [journalists.id]
      }),
      votes: many(transferVotes)
    }));
    transferVotesRelations = relations(transferVotes, ({ one }) => ({
      transfer: one(transfers, {
        fields: [transferVotes.transferId],
        references: [transfers.id]
      }),
      user: one(users, {
        fields: [transferVotes.userId],
        references: [users.id]
      })
    }));
    transferRumorsRelations = relations(transferRumors, ({ one, many }) => ({
      player: one(players, { fields: [transferRumors.playerId], references: [players.id] }),
      fromTeam: one(teams, {
        fields: [transferRumors.fromTeamId],
        references: [teams.id],
        relationName: "transferRumorsFrom"
      }),
      toTeam: one(teams, {
        fields: [transferRumors.toTeamId],
        references: [teams.id],
        relationName: "transferRumorsTo"
      }),
      createdByUser: one(users, { fields: [transferRumors.createdByUserId], references: [users.id] }),
      votes: many(transferRumorVotes),
      comments: many(transferRumorComments)
    }));
    transferRumorVotesRelations = relations(transferRumorVotes, ({ one }) => ({
      rumor: one(transferRumors, { fields: [transferRumorVotes.rumorId], references: [transferRumors.id] }),
      user: one(users, { fields: [transferRumorVotes.userId], references: [users.id] })
    }));
    transferRumorCommentsRelations = relations(transferRumorComments, ({ one }) => ({
      rumor: one(transferRumors, { fields: [transferRumorComments.rumorId], references: [transferRumors.id] }),
      user: one(users, { fields: [transferRumorComments.userId], references: [users.id] })
    }));
    teamsForumTopicsRelations = relations(teamsForumTopics, ({ one, many }) => ({
      team: one(teams, { fields: [teamsForumTopics.teamId], references: [teams.id] }),
      author: one(users, { fields: [teamsForumTopics.authorId], references: [users.id] }),
      replies: many(teamsForumReplies),
      likes: many(teamsForumLikes)
    }));
    teamsForumRepliesRelations = relations(teamsForumReplies, ({ one, many }) => ({
      topic: one(teamsForumTopics, { fields: [teamsForumReplies.topicId], references: [teamsForumTopics.id] }),
      author: one(users, { fields: [teamsForumReplies.authorId], references: [users.id] }),
      likes: many(teamsForumLikes)
    }));
    teamsForumLikesRelations = relations(teamsForumLikes, ({ one }) => ({
      user: one(users, { fields: [teamsForumLikes.userId], references: [users.id] }),
      topic: one(teamsForumTopics, { fields: [teamsForumLikes.topicId], references: [teamsForumTopics.id] }),
      reply: one(teamsForumReplies, { fields: [teamsForumLikes.replyId], references: [teamsForumReplies.id] })
    }));
    postsRelations = relations(posts, ({ one, many }) => ({
      user: one(users, { fields: [posts.userId], references: [users.id] }),
      parentPost: one(posts, { fields: [posts.parentPostId], references: [posts.id], relationName: "postReplies" }),
      replies: many(posts, { relationName: "postReplies" }),
      likes: many(postLikes),
      bookmarks: many(postBookmarks),
      relatedNews: one(news, { fields: [posts.relatedNewsId], references: [news.id] })
    }));
    postLikesRelations = relations(postLikes, ({ one }) => ({
      post: one(posts, { fields: [postLikes.postId], references: [posts.id] }),
      user: one(users, { fields: [postLikes.userId], references: [users.id] })
    }));
    postBookmarksRelations = relations(postBookmarks, ({ one }) => ({
      post: one(posts, { fields: [postBookmarks.postId], references: [posts.id] }),
      user: one(users, { fields: [postBookmarks.userId], references: [users.id] })
    }));
    userFollowsRelations = relations(userFollows, ({ one }) => ({
      follower: one(users, { fields: [userFollows.followerId], references: [users.id], relationName: "asFollower" }),
      following: one(users, { fields: [userFollows.followingId], references: [users.id], relationName: "asFollowing" })
    }));
    badgesRelations = relations(badges, ({ many }) => ({
      userBadges: many(userBadges)
    }));
    userBadgesRelations = relations(userBadges, ({ one }) => ({
      user: one(users, {
        fields: [userBadges.userId],
        references: [users.id]
      }),
      badge: one(badges, {
        fields: [userBadges.badgeId],
        references: [badges.id]
      })
    }));
    insertUserSchema = createInsertSchema(users, {
      email: z.string().email("Email inv\xE1lido"),
      name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
      password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
    }).omit({ id: true, createdAt: true, updatedAt: true });
    selectUserSchema = createSelectSchema(users);
    insertJournalistSchema = createInsertSchema(journalists, {
      organization: z.string().min(2, "Organiza\xE7\xE3o deve ter pelo menos 2 caracteres"),
      professionalId: z.string().min(2, "ID profissional \xE9 obrigat\xF3rio")
    }).omit({ id: true, createdAt: true, updatedAt: true, status: true, verificationDate: true });
    selectJournalistSchema = createSelectSchema(journalists);
    insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true, updatedAt: true });
    selectTeamSchema = createSelectSchema(teams);
    insertPlayerSchema = createInsertSchema(players).omit({ id: true, createdAt: true, updatedAt: true });
    selectPlayerSchema = createSelectSchema(players);
    insertMatchSchema = createInsertSchema(matches).omit({ id: true, createdAt: true, updatedAt: true });
    selectMatchSchema = createSelectSchema(matches);
    insertCompetitionSchema = createInsertSchema(competitions).omit({ id: true, createdAt: true, updatedAt: true });
    selectCompetitionSchema = createSelectSchema(competitions);
    insertFixtureSchema = createInsertSchema(fixtures).omit({ id: true, createdAt: true, updatedAt: true });
    selectFixtureSchema = createSelectSchema(fixtures);
    insertStandingSchema = createInsertSchema(standings).omit({ id: true, createdAt: true, updatedAt: true });
    selectStandingSchema = createSelectSchema(standings);
    insertNewsSchema = createInsertSchema(news, {
      title: z.string().min(10, "T\xEDtulo deve ter pelo menos 10 caracteres").max(200, "T\xEDtulo n\xE3o pode ter mais de 200 caracteres"),
      content: z.string().min(50, "Conte\xFAdo deve ter pelo menos 50 caracteres").max(1e3, "Conte\xFAdo n\xE3o pode ter mais de 1000 caracteres"),
      scope: z.enum(["ALL", "TEAM", "EUROPE"]).optional().default("ALL")
    }).omit({
      id: true,
      journalistId: true,
      createdAt: true,
      updatedAt: true,
      likesCount: true,
      dislikesCount: true,
      publishedAt: true,
      // Nunca confiar no client para publicar/despublicar: o backend decide.
      isPublished: true
    });
    selectNewsSchema = createSelectSchema(news);
    insertNewsInteractionSchema = createInsertSchema(newsInteractions).omit({ id: true, createdAt: true, updatedAt: true });
    selectNewsInteractionSchema = createSelectSchema(newsInteractions);
    insertPlayerRatingSchema = createInsertSchema(playerRatings, {
      rating: z.number().min(0, "Nota m\xEDnima \xE9 0").max(10, "Nota m\xE1xima \xE9 10"),
      comment: z.string().max(200, "Coment\xE1rio n\xE3o pode ter mais de 200 caracteres").optional()
    }).omit({ id: true, createdAt: true, updatedAt: true });
    selectPlayerRatingSchema = createSelectSchema(playerRatings);
    insertCommentSchema = createInsertSchema(comments, {
      content: z.string().min(1, "Coment\xE1rio n\xE3o pode ser vazio").max(2e3, "Coment\xE1rio muito longo")
    }).omit({ id: true, newsId: true, userId: true, isApproved: true, createdAt: true, updatedAt: true });
    selectCommentSchema = createSelectSchema(comments);
    insertCommentLikeSchema = createInsertSchema(commentLikes).omit({ id: true, createdAt: true });
    selectCommentLikeSchema = createSelectSchema(commentLikes);
    insertBadgeSchema = createInsertSchema(badges).omit({ id: true, createdAt: true });
    selectBadgeSchema = createSelectSchema(badges);
    insertUserBadgeSchema = createInsertSchema(userBadges).omit({ id: true, earnedAt: true });
    selectUserBadgeSchema = createSelectSchema(userBadges);
    insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
    selectNotificationSchema = createSelectSchema(notifications);
    insertUserLineupSchema = createInsertSchema(userLineups, {
      formation: z.string().min(1, "Forma\xE7\xE3o \xE9 obrigat\xF3ria"),
      slots: z.array(z.object({ slotIndex: z.number(), playerId: z.string() }))
    }).omit({ id: true, createdAt: true, updatedAt: true });
    selectUserLineupSchema = createSelectSchema(userLineups);
    insertTransferSchema = createInsertSchema(transfers).omit({ id: true, createdAt: true, updatedAt: true });
    selectTransferSchema = createSelectSchema(transfers);
    insertTransferVoteSchema = createInsertSchema(transferVotes).omit({ id: true, createdAt: true });
    selectTransferVoteSchema = createSelectSchema(transferVotes);
    insertTransferRumorSchema = createInsertSchema(transferRumors).omit({ id: true, createdAt: true, updatedAt: true });
    selectTransferRumorSchema = createSelectSchema(transferRumors);
    insertTransferRumorVoteSchema = createInsertSchema(transferRumorVotes).omit({ id: true, createdAt: true });
    selectTransferRumorVoteSchema = createSelectSchema(transferRumorVotes);
    insertTransferRumorCommentSchema = createInsertSchema(transferRumorComments).omit({ id: true, createdAt: true, updatedAt: true });
    selectTransferRumorCommentSchema = createSelectSchema(transferRumorComments);
    insertForumTopicSchema = createInsertSchema(teamsForumTopics, {
      title: z.string().min(3, "T\xEDtulo deve ter pelo menos 3 caracteres").max(300),
      content: z.string().min(10, "Conte\xFAdo deve ter pelo menos 10 caracteres"),
      category: z.enum(["news", "pre_match", "post_match", "transfer", "off_topic", "base"]).optional()
    }).omit({ id: true, teamId: true, authorId: true, viewsCount: true, likesCount: true, repliesCount: true, createdAt: true, updatedAt: true, isPinned: true, isLocked: true, reportCount: true, isRemoved: true, moderationStatus: true });
    selectForumTopicSchema = createSelectSchema(teamsForumTopics);
    insertForumReplySchema = createInsertSchema(teamsForumReplies, {
      content: z.string().min(1, "Resposta n\xE3o pode ser vazia").max(5e3)
    }).omit({ id: true, topicId: true, authorId: true, likesCount: true, createdAt: true });
    selectForumReplySchema = createSelectSchema(teamsForumReplies);
    insertPostSchema = createInsertSchema(posts, {
      content: z.string().min(1).max(280),
      imageUrl: z.string().url().optional().or(z.literal(""))
    }).omit({
      id: true,
      userId: true,
      likeCount: true,
      replyCount: true,
      repostCount: true,
      bookmarkCount: true,
      viewCount: true,
      createdAt: true,
      updatedAt: true
    });
    insertGameSetSchema = createInsertSchema(gameSets);
    insertGameSetPlayerSchema = createInsertSchema(gameSetPlayers);
    insertGameAttemptSchema = createInsertSchema(gameAttempts);
    insertGameAttemptGuessSchema = createInsertSchema(gameAttemptGuesses);
  }
});

// server/db.ts
import "dotenv/config";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
var Pool, databaseUrl, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    ({ Pool } = pg);
    databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        "DATABASE_URL or DATABASE_URL must be set. Available env keys: " + Object.keys(process.env).join(", ")
      );
    }
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 3e4,
      connectionTimeoutMillis: 2e3
    });
    db = drizzle(pool, { schema: schema_exports });
  }
});

// server/websocket.ts
var websocket_exports = {};
__export(websocket_exports, {
  broadcastToTeam: () => broadcastToTeam,
  createAndPublishNotification: () => createAndPublishNotification,
  initNotificationGateway: () => initNotificationGateway,
  publishNotification: () => publishNotification
});
import { WebSocketServer, WebSocket } from "ws";
import { parse } from "url";
import cookie from "cookie";
import signature from "cookie-signature";
function initNotificationGateway(httpServer, sessionStore2) {
  const wss = new WebSocketServer({ noServer: true });
  httpServer.on("upgrade", (request, socket, head) => {
    const { pathname } = parse(request.url || "");
    if (pathname !== "/ws/notifications") {
      if (process.env.NODE_ENV === "development") {
        return;
      }
      socket.destroy();
      return;
    }
    const cookies = cookie.parse(request.headers.cookie || "");
    const sessionCookie = cookies["connect.sid"];
    if (!sessionCookie) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      console.error("SESSION_SECRET is not set (WebSocket auth cannot verify sessions)");
      socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
      socket.destroy();
      return;
    }
    const unsignedValue = signature.unsign(sessionCookie.slice(2), secret);
    if (unsignedValue === false) {
      console.error("Invalid session signature");
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    const sessionId = unsignedValue;
    sessionStore2.get(sessionId, (err, session2) => {
      if (err || !session2 || !session2.userId) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }
      const userId = session2.userId;
      wss.handleUpgrade(request, socket, head, (ws) => {
        ws.userId = userId;
        wss.emit("connection", ws, request, userId);
      });
    });
  });
  wss.on("connection", (ws, _request, userId) => {
    console.log(`WebSocket connected for user ${userId}`);
    ws.isAlive = true;
    if (!userConnections.has(userId)) {
      userConnections.set(userId, /* @__PURE__ */ new Set());
    }
    userConnections.get(userId).add(ws);
    ws.on("pong", () => {
      ws.isAlive = true;
    });
    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log(`Message from ${userId}:`, message);
      } catch (error) {
        console.error("Invalid message format:", error);
      }
    });
    ws.on("close", () => {
      console.log(`WebSocket disconnected for user ${userId}`);
      const connections = userConnections.get(userId);
      if (connections) {
        connections.delete(ws);
        if (connections.size === 0) {
          userConnections.delete(userId);
        }
      }
    });
    ws.on("error", (error) => {
      console.error(`WebSocket error for user ${userId}:`, error);
      const connections = userConnections.get(userId);
      if (connections) {
        connections.delete(ws);
        if (connections.size === 0) {
          userConnections.delete(userId);
        }
      }
    });
    ws.send(JSON.stringify({ type: "connected", userId }));
  });
  const heartbeat = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 3e4);
  wss.on("close", () => {
    clearInterval(heartbeat);
  });
  return wss;
}
function publishNotification(notification) {
  try {
    const connections = userConnections.get(notification.userId);
    if (connections && connections.size > 0) {
      const message = JSON.stringify({
        type: "notification",
        notification
      });
      const deadSockets = [];
      connections.forEach((ws) => {
        try {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
          } else {
            deadSockets.push(ws);
          }
        } catch (error) {
          console.error(`Failed to send notification to WebSocket:`, error);
          deadSockets.push(ws);
        }
      });
      deadSockets.forEach((ws) => connections.delete(ws));
      if (connections.size === 0) {
        userConnections.delete(notification.userId);
      }
      console.log(`Notification published to ${connections.size - deadSockets.length}/${connections.size} connection(s) for user ${notification.userId}`);
    } else {
      console.log(`No active connections for user ${notification.userId}, notification persisted only`);
    }
  } catch (error) {
    console.error(`Failed to publish notification:`, error, notification);
  }
}
function broadcastToTeam(teamId, notification) {
  console.log(`Team broadcast to ${teamId}:`, notification);
}
async function createAndPublishNotification(createFn) {
  const notification = await createFn();
  publishNotification(notification);
  return notification;
}
var userConnections;
var init_websocket = __esm({
  "server/websocket.ts"() {
    "use strict";
    userConnections = /* @__PURE__ */ new Map();
  }
});

// server/db/seed/games.seed.ts
var games_seed_exports = {};
__export(games_seed_exports, {
  runGamesSeed: () => runGamesSeed,
  seedGames: () => seedGames
});
import "dotenv/config";
import { eq as eq5 } from "drizzle-orm";
function normalizeName(name) {
  return name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim().replace(/[.,\-']/g, "").replace(/\s+/g, " ");
}
async function seedGames() {
  const [existing] = await db.select().from(gameSets).where(eq5(gameSets.slug, SLUG)).limit(1);
  let setId;
  let wasNew = false;
  if (existing) {
    setId = existing.id;
    await db.delete(gameSetPlayers).where(eq5(gameSetPlayers.setId, setId));
    console.log(`[games.seed] Set "${SLUG}" j\xE1 existia. Recriando ${CORINTHIANS_2005_PLAYERS.length} jogadores.`);
  } else {
    const [set] = await db.insert(gameSets).values({
      slug: SLUG,
      title: "Corinthians \u2014 Brasileir\xE3o 2005 (Campe\xE3o)",
      season: 2005,
      competition: "Campeonato Brasileiro",
      clubName: "Corinthians",
      metadata: { coach: "Ant\xF4nio Lopes", source: "seed" }
    }).returning();
    if (!set) throw new Error("Failed to create game set");
    setId = set.id;
    wasNew = true;
    console.log(`[games.seed] Set "${SLUG}" criado.`);
  }
  const playersToInsert = CORINTHIANS_2005_PLAYERS.map((p, i) => ({
    setId,
    jerseyNumber: p.jerseyNumber,
    displayName: p.displayName,
    normalizedName: normalizeName(p.displayName),
    aliases: p.displayName === "T\xE9vez" ? ["tevez", "tevez carlos"] : void 0,
    sortOrder: i + 1
  }));
  await db.insert(gameSetPlayers).values(playersToInsert);
  console.log(`[games.seed] ${playersToInsert.length} jogadores inseridos.`);
  return { seeded: wasNew, setId };
}
async function runGamesSeed() {
  if (!process.env.DATABASE_URL) {
    const envKeys = Object.keys(process.env).slice(0, 50).join(", ");
    throw new Error(
      `DATABASE_URL must be set (Railway usually injects it). Found env keys: ${envKeys}`
    );
  }
  await seedGames();
}
var SLUG, CORINTHIANS_2005_PLAYERS, isMain;
var init_games_seed = __esm({
  "server/db/seed/games.seed.ts"() {
    "use strict";
    init_db();
    init_schema();
    SLUG = "corinthians-2005-brasileirao";
    CORINTHIANS_2005_PLAYERS = [
      { jerseyNumber: 1, displayName: "F\xE1bio Costa" },
      { jerseyNumber: 2, displayName: "Edson Sitta" },
      { jerseyNumber: 3, displayName: "Anderson" },
      { jerseyNumber: 4, displayName: "Gustavo Nery" },
      { jerseyNumber: 5, displayName: "Marcelo Mattos" },
      { jerseyNumber: 6, displayName: "Seb\xE1" },
      { jerseyNumber: 7, displayName: "Roger" },
      { jerseyNumber: 8, displayName: "Rosinei" },
      { jerseyNumber: 9, displayName: "Nilmar" },
      { jerseyNumber: 10, displayName: "T\xE9vez" },
      { jerseyNumber: 11, displayName: "Gil" },
      { jerseyNumber: 12, displayName: "Tiago" },
      { jerseyNumber: 13, displayName: "Marinho" },
      { jerseyNumber: 14, displayName: "Coelho" },
      { jerseyNumber: 15, displayName: "Wendel" },
      { jerseyNumber: 16, displayName: "Bet\xE3o" },
      { jerseyNumber: 17, displayName: "Din\xE9lson" },
      { jerseyNumber: 18, displayName: "Bob\xF4" },
      { jerseyNumber: 19, displayName: "Carlos Alberto" },
      { jerseyNumber: 20, displayName: "\xC9lton" },
      { jerseyNumber: 21, displayName: "Hugo" },
      { jerseyNumber: 22, displayName: "J\xFAlio C\xE9sar" },
      { jerseyNumber: 23, displayName: "Marquinhos Silva" },
      { jerseyNumber: 24, displayName: "Marcus Vinicius" },
      { jerseyNumber: 26, displayName: "Fininho" },
      { jerseyNumber: 27, displayName: "Bruno Oct\xE1vio" },
      { jerseyNumber: 29, displayName: "Fabr\xEDcio" },
      { jerseyNumber: 30, displayName: "J\xF4" },
      { jerseyNumber: 32, displayName: "Wilson" },
      { jerseyNumber: 33, displayName: "Ronny" },
      { jerseyNumber: 34, displayName: "Ji-Paran\xE1" },
      { jerseyNumber: 35, displayName: "Abuda" },
      { jerseyNumber: 37, displayName: "Nilton" },
      { jerseyNumber: 40, displayName: "Marcelo" },
      { jerseyNumber: 41, displayName: "Wescley" },
      { jerseyNumber: 42, displayName: "Eduardo Ratinho" },
      { jerseyNumber: 43, displayName: "Mascherano" }
    ];
    isMain = process.argv[1]?.includes("games.seed");
    if (isMain) {
      runGamesSeed().then(() => process.exit(0)).catch((err) => {
        console.error(err);
        process.exit(1);
      });
    }
  }
});

// server/repositories/matches.repo.ts
var matches_repo_exports = {};
__export(matches_repo_exports, {
  getLastMatchRatings: () => getLastMatchRatings,
  getMatchDetails: () => getMatchDetails,
  getMatchesByTeam: () => getMatchesByTeam
});
import { eq as eq6, and as and5, or as or3, desc as desc5, gt as gt3, lt as lt3, inArray as inArray5 } from "drizzle-orm";
function positionToGroup(code) {
  if (!code) return "UNK";
  const u = code.toUpperCase().trim();
  if (u === "GK") return "GK";
  if (["CB", "DC", "LB", "DL", "RB", "DR", "LWB", "RWB", "WB"].includes(u)) return "DEF";
  if (["DM", "CDM", "CM", "MC", "AM", "CAM", "LM", "ML", "RM", "MR"].includes(u)) return "MID";
  if (["LW", "RW", "ST", "CF", "SS"].includes(u)) return "ATT";
  const lower = code.toLowerCase();
  if (lower.includes("goalkeeper") || lower.includes("keeper")) return "GK";
  if (lower.includes("-back") || lower.includes("defender")) return "DEF";
  if (lower.includes("midfield")) return "MID";
  if (lower.includes("forward") || lower.includes("winger") || lower.includes("striker")) return "ATT";
  return "UNK";
}
function groupOrder(g) {
  return POSITION_ORDER.indexOf(g);
}
async function getMatchesByTeam(teamId, options = {}) {
  const limit = options.limit ?? 20;
  const now = /* @__PURE__ */ new Date();
  const conditions = [
    or3(
      eq6(matchGames.homeTeamId, teamId),
      eq6(matchGames.awayTeamId, teamId)
    )
  ];
  if (options.competitionId) {
    conditions.push(eq6(matchGames.competitionId, options.competitionId));
  }
  if (options.seasonYear) {
    conditions.push(eq6(seasons.year, options.seasonYear));
  }
  const selectFields = {
    id: matchGames.id,
    kickoffAt: matchGames.kickoffAt,
    status: matchGames.status,
    homeTeamId: matchGames.homeTeamId,
    awayTeamId: matchGames.awayTeamId,
    homeScore: matchGames.homeScore,
    awayScore: matchGames.awayScore,
    round: matchGames.round,
    competitionId: matchGames.competitionId,
    competitionName: competitions.name,
    competitionLogoUrl: competitions.logoUrl,
    seasonYear: seasons.year,
    venueId: matchGames.venueId,
    venueName: venues.name,
    venueCity: venues.city
  };
  let rows;
  if (options.type === "upcoming") {
    const withTime = and5(...conditions, gt3(matchGames.kickoffAt, now));
    rows = await db.select({
      id: matchGames.id,
      kickoffAt: matchGames.kickoffAt,
      status: matchGames.status,
      homeTeamId: matchGames.homeTeamId,
      awayTeamId: matchGames.awayTeamId,
      homeScore: matchGames.homeScore,
      awayScore: matchGames.awayScore,
      round: matchGames.round,
      competitionId: matchGames.competitionId,
      competitionName: competitions.name,
      competitionLogoUrl: competitions.logoUrl,
      seasonYear: seasons.year,
      venueId: matchGames.venueId,
      venueName: venues.name,
      venueCity: venues.city
    }).from(matchGames).leftJoin(competitions, eq6(matchGames.competitionId, competitions.id)).leftJoin(seasons, eq6(matchGames.seasonId, seasons.id)).leftJoin(venues, eq6(matchGames.venueId, venues.id)).where(withTime).orderBy(matchGames.kickoffAt).limit(limit);
  } else if (options.type === "recent") {
    const withTime = and5(...conditions, lt3(matchGames.kickoffAt, now));
    rows = await db.select({
      id: matchGames.id,
      kickoffAt: matchGames.kickoffAt,
      status: matchGames.status,
      homeTeamId: matchGames.homeTeamId,
      awayTeamId: matchGames.awayTeamId,
      homeScore: matchGames.homeScore,
      awayScore: matchGames.awayScore,
      round: matchGames.round,
      competitionId: matchGames.competitionId,
      competitionName: competitions.name,
      competitionLogoUrl: competitions.logoUrl,
      seasonYear: seasons.year,
      venueId: matchGames.venueId,
      venueName: venues.name,
      venueCity: venues.city
    }).from(matchGames).leftJoin(competitions, eq6(matchGames.competitionId, competitions.id)).leftJoin(seasons, eq6(matchGames.seasonId, seasons.id)).leftJoin(venues, eq6(matchGames.venueId, venues.id)).where(withTime).orderBy(desc5(matchGames.kickoffAt)).limit(limit);
  } else {
    rows = await db.select({
      id: matchGames.id,
      kickoffAt: matchGames.kickoffAt,
      status: matchGames.status,
      homeTeamId: matchGames.homeTeamId,
      awayTeamId: matchGames.awayTeamId,
      homeScore: matchGames.homeScore,
      awayScore: matchGames.awayScore,
      round: matchGames.round,
      competitionId: matchGames.competitionId,
      competitionName: competitions.name,
      competitionLogoUrl: competitions.logoUrl,
      seasonYear: seasons.year,
      venueId: matchGames.venueId,
      venueName: venues.name,
      venueCity: venues.city
    }).from(matchGames).leftJoin(competitions, eq6(matchGames.competitionId, competitions.id)).leftJoin(seasons, eq6(matchGames.seasonId, seasons.id)).leftJoin(venues, eq6(matchGames.venueId, venues.id)).where(and5(...conditions)).orderBy(desc5(matchGames.kickoffAt)).limit(limit);
  }
  const teamIds = /* @__PURE__ */ new Set();
  for (const r of rows) {
    if (r.homeTeamId) teamIds.add(r.homeTeamId);
    if (r.awayTeamId) teamIds.add(r.awayTeamId);
  }
  const teamList = teamIds.size > 0 ? await db.select({ id: teams.id, name: teams.name }).from(teams).where(inArray5(teams.id, [...teamIds])) : [];
  const teamMap = new Map(teamList.map((t) => [t.id, t.name]));
  return rows.map((r) => ({
    id: r.id,
    kickoffAt: r.kickoffAt,
    status: r.status,
    homeTeamId: r.homeTeamId,
    awayTeamId: r.awayTeamId,
    homeTeamName: teamMap.get(r.homeTeamId ?? "") ?? "TBD",
    awayTeamName: teamMap.get(r.awayTeamId ?? "") ?? "TBD",
    homeScore: r.homeScore,
    awayScore: r.awayScore,
    round: r.round,
    competition: {
      id: r.competitionId ?? "",
      name: r.competitionName ?? "TBD",
      logoUrl: r.competitionLogoUrl ?? null
    },
    seasonYear: r.seasonYear ?? null,
    venue: r.venueId ? { id: r.venueId, name: r.venueName ?? "", city: r.venueCity ?? null } : null
  }));
}
async function getMatchDetails(matchId) {
  const [matchRow] = await db.select({
    id: matchGames.id,
    kickoffAt: matchGames.kickoffAt,
    status: matchGames.status,
    homeTeamId: matchGames.homeTeamId,
    awayTeamId: matchGames.awayTeamId,
    homeScore: matchGames.homeScore,
    awayScore: matchGames.awayScore,
    round: matchGames.round,
    competitionId: matchGames.competitionId,
    competitionName: competitions.name,
    competitionLogoUrl: competitions.logoUrl,
    seasonYear: seasons.year,
    venueId: matchGames.venueId,
    venueName: venues.name,
    venueCity: venues.city,
    venueCapacity: venues.capacity
  }).from(matchGames).leftJoin(competitions, eq6(matchGames.competitionId, competitions.id)).leftJoin(seasons, eq6(matchGames.seasonId, seasons.id)).leftJoin(venues, eq6(matchGames.venueId, venues.id)).where(eq6(matchGames.id, matchId)).limit(1);
  if (!matchRow) return null;
  const teamIds = [matchRow.homeTeamId, matchRow.awayTeamId].filter(Boolean);
  const teamList = teamIds.length > 0 ? await db.select({ id: teams.id, name: teams.name }).from(teams).where(inArray5(teams.id, teamIds)) : [];
  const teamMap = new Map(teamList.map((t) => [t.id, t.name]));
  const match = {
    id: matchRow.id,
    kickoffAt: matchRow.kickoffAt,
    status: matchRow.status,
    homeTeamId: matchRow.homeTeamId,
    awayTeamId: matchRow.awayTeamId,
    homeTeamName: teamMap.get(matchRow.homeTeamId ?? "") ?? "TBD",
    awayTeamName: teamMap.get(matchRow.awayTeamId ?? "") ?? "TBD",
    homeScore: matchRow.homeScore,
    awayScore: matchRow.awayScore,
    round: matchRow.round,
    competition: {
      id: matchRow.competitionId ?? "",
      name: matchRow.competitionName ?? "TBD",
      logoUrl: matchRow.competitionLogoUrl ?? null
    },
    seasonYear: matchRow.seasonYear ?? null,
    venue: matchRow.venueId ? {
      id: matchRow.venueId,
      name: matchRow.venueName ?? "",
      city: matchRow.venueCity ?? null,
      capacity: matchRow.venueCapacity ?? null
    } : null
  };
  const eventsRows = await db.select({
    id: matchEvents.id,
    minute: matchEvents.minute,
    type: matchEvents.type,
    teamId: matchEvents.teamId,
    playerId: matchEvents.playerId,
    playerName: players.name,
    relatedPlayerId: matchEvents.relatedPlayerId,
    detail: matchEvents.detail
  }).from(matchEvents).leftJoin(players, eq6(matchEvents.playerId, players.id)).where(eq6(matchEvents.matchId, matchId)).orderBy(matchEvents.minute);
  const relatedIds = eventsRows.map((e) => e.relatedPlayerId).filter(Boolean);
  const relatedNames = relatedIds.length > 0 ? await db.select({ id: players.id, name: players.name }).from(players).where(inArray5(players.id, relatedIds)) : [];
  const relatedMap = new Map(relatedNames.map((p) => [p.id, p.name]));
  const events = eventsRows.map((e) => ({
    id: e.id,
    minute: e.minute,
    type: e.type,
    teamId: e.teamId,
    playerId: e.playerId,
    playerName: e.playerName ?? null,
    relatedPlayerId: e.relatedPlayerId,
    relatedPlayerName: e.relatedPlayerId ? relatedMap.get(e.relatedPlayerId) ?? null : null,
    detail: e.detail
  }));
  const lineupsRows = await db.select({
    lineupId: matchLineups.id,
    teamId: matchLineups.teamId,
    formation: matchLineups.formation,
    playerId: matchLineupPlayers.playerId,
    isStarter: matchLineupPlayers.isStarter,
    shirtNumber: matchLineupPlayers.shirtNumber,
    positionCode: matchLineupPlayers.positionCode,
    minutesPlayed: matchLineupPlayers.minutesPlayed,
    playerName: players.name
  }).from(matchLineups).innerJoin(matchLineupPlayers, eq6(matchLineups.id, matchLineupPlayers.matchLineupId)).innerJoin(players, eq6(matchLineupPlayers.playerId, players.id)).where(eq6(matchLineups.matchId, matchId));
  const lineupByTeam = /* @__PURE__ */ new Map();
  for (const r of lineupsRows) {
    if (!lineupByTeam.has(r.teamId)) {
      lineupByTeam.set(r.teamId, {
        formation: r.formation,
        starters: [],
        substitutes: []
      });
    }
    const entry = lineupByTeam.get(r.teamId);
    const item = {
      playerId: r.playerId,
      name: r.playerName,
      shirtNumber: r.shirtNumber,
      positionCode: r.positionCode,
      minutesPlayed: r.minutesPlayed
    };
    if (r.isStarter) entry.starters.push(item);
    else entry.substitutes.push(item);
  }
  const lineups = Array.from(lineupByTeam.entries()).map(([teamId, data]) => ({
    teamId,
    teamName: teamMap.get(teamId) ?? "TBD",
    formation: data.formation,
    starters: data.starters,
    substitutes: data.substitutes
  }));
  const statsRows = await db.select({
    playerId: playerMatchStats.playerId,
    name: players.name,
    minutes: playerMatchStats.minutes,
    rating: playerMatchStats.rating,
    goals: playerMatchStats.goals,
    assists: playerMatchStats.assists
  }).from(playerMatchStats).innerJoin(players, eq6(playerMatchStats.playerId, players.id)).where(eq6(playerMatchStats.matchId, matchId));
  const playerStats = statsRows.map((r) => ({
    playerId: r.playerId,
    name: r.name,
    minutes: r.minutes,
    rating: r.rating != null ? Number(r.rating) : null,
    goals: r.goals,
    assists: r.assists
  }));
  const teamStatsRows = await db.select({
    teamId: teamMatchStats.teamId,
    possession: teamMatchStats.possession,
    shots: teamMatchStats.shots,
    shotsOnTarget: teamMatchStats.shotsOnTarget,
    corners: teamMatchStats.corners,
    fouls: teamMatchStats.fouls
  }).from(teamMatchStats).where(eq6(teamMatchStats.matchId, matchId));
  const teamStats = teamStatsRows.map((r) => ({
    teamId: r.teamId,
    teamName: teamMap.get(r.teamId) ?? "TBD",
    possession: r.possession,
    shots: r.shots,
    shotsOnTarget: r.shotsOnTarget,
    corners: r.corners,
    fouls: r.fouls
  }));
  return {
    match,
    events,
    lineups,
    playerStats,
    teamStats
  };
}
async function getLastMatchRatings(teamId) {
  const [lastMatch] = await db.select({
    id: matchGames.id,
    kickoffAt: matchGames.kickoffAt,
    homeTeamId: matchGames.homeTeamId,
    awayTeamId: matchGames.awayTeamId,
    homeScore: matchGames.homeScore,
    awayScore: matchGames.awayScore,
    competitionName: competitions.name
  }).from(matchGames).leftJoin(competitions, eq6(matchGames.competitionId, competitions.id)).where(
    and5(
      or3(eq6(matchGames.homeTeamId, teamId), eq6(matchGames.awayTeamId, teamId)),
      eq6(matchGames.status, "FT")
    )
  ).orderBy(desc5(matchGames.kickoffAt)).limit(1);
  if (!lastMatch) return null;
  const teamIds = [lastMatch.homeTeamId, lastMatch.awayTeamId].filter(Boolean);
  const teamList = teamIds.length > 0 ? await db.select({ id: teams.id, name: teams.name }).from(teams).where(inArray5(teams.id, teamIds)) : [];
  const teamMap = new Map(teamList.map((t) => [t.id, t.name]));
  const [ourLineup] = await db.select({ id: matchLineups.id, formation: matchLineups.formation }).from(matchLineups).where(
    and5(eq6(matchLineups.matchId, lastMatch.id), eq6(matchLineups.teamId, teamId))
  ).limit(1);
  const lineupPositionByPlayer = /* @__PURE__ */ new Map();
  if (ourLineup) {
    const lineupPlayers = await db.select({
      playerId: matchLineupPlayers.playerId,
      positionCode: matchLineupPlayers.positionCode
    }).from(matchLineupPlayers).where(eq6(matchLineupPlayers.matchLineupId, ourLineup.id));
    for (const lp of lineupPlayers) {
      lineupPositionByPlayer.set(lp.playerId, lp.positionCode);
    }
  }
  const starterPlayerIds = ourLineup ? new Set(lineupPositionByPlayer.keys()) : null;
  const statsRows = await db.select({
    playerId: playerMatchStats.playerId,
    playerName: players.name,
    shirtNumber: players.shirtNumber,
    minutes: playerMatchStats.minutes,
    rating: playerMatchStats.rating,
    primaryPosition: players.primaryPosition,
    position: players.position,
    photoUrl: players.photoUrl
  }).from(playerMatchStats).innerJoin(players, eq6(playerMatchStats.playerId, players.id)).where(
    and5(eq6(playerMatchStats.matchId, lastMatch.id), eq6(playerMatchStats.teamId, teamId))
  );
  const rawRatings = statsRows.filter((r) => r.rating != null && (starterPlayerIds === null || starterPlayerIds.has(r.playerId))).map((r) => {
    const positionCode = lineupPositionByPlayer.get(r.playerId) ?? r.primaryPosition ?? r.position ?? "UNK";
    const group = positionToGroup(positionCode === "UNK" ? null : positionCode);
    return {
      playerId: r.playerId,
      playerName: r.playerName ?? "\u2014",
      shirtNumber: r.shirtNumber,
      minutes: r.minutes,
      rating: Number(r.rating),
      positionCode: lineupPositionByPlayer.get(r.playerId) ?? null,
      primaryPosition: r.primaryPosition ?? null,
      group,
      photoUrl: r.photoUrl ?? null
    };
  });
  const playerRatings2 = rawRatings.sort((a, b) => {
    const ga = groupOrder(a.group);
    const gb = groupOrder(b.group);
    if (ga !== gb) return ga - gb;
    return b.rating - a.rating;
  });
  return {
    match: {
      matchId: lastMatch.id,
      kickoffAt: lastMatch.kickoffAt,
      competitionName: lastMatch.competitionName ?? "\u2014",
      homeTeamName: teamMap.get(lastMatch.homeTeamId ?? "") ?? "\u2014",
      awayTeamName: teamMap.get(lastMatch.awayTeamId ?? "") ?? "\u2014",
      homeScore: lastMatch.homeScore,
      awayScore: lastMatch.awayScore
    },
    formation: ourLineup?.formation ?? "4-3-3",
    playerRatings: playerRatings2
  };
}
var POSITION_ORDER;
var init_matches_repo = __esm({
  "server/repositories/matches.repo.ts"() {
    "use strict";
    init_db();
    init_schema();
    POSITION_ORDER = ["GK", "DEF", "MID", "ATT", "UNK"];
  }
});

// server/utils/resultForTeam.ts
var resultForTeam_exports = {};
__export(resultForTeam_exports, {
  deriveFormFromMatches: () => deriveFormFromMatches,
  getResultForTeam: () => getResultForTeam
});
function getResultForTeam(match, teamId) {
  if (match.status !== "FT" && match.status !== "finished") return null;
  if (match.homeScore == null || match.awayScore == null) return null;
  const isHome = String(match.homeTeamId ?? "") === String(teamId);
  const goalsFor = isHome ? match.homeScore : match.awayScore;
  const goalsAgainst = isHome ? match.awayScore : match.homeScore;
  if (goalsFor > goalsAgainst) return "W";
  if (goalsFor < goalsAgainst) return "L";
  return "D";
}
function deriveFormFromMatches(matches2, teamId, limit = 5) {
  const results = [];
  for (const m of matches2.slice(0, limit)) {
    const r = getResultForTeam(m, teamId);
    if (r != null) results.push(r);
  }
  return results;
}
var init_resultForTeam = __esm({
  "server/utils/resultForTeam.ts"() {
    "use strict";
  }
});

// server/repositories/standings.repo.ts
var standings_repo_exports = {};
__export(standings_repo_exports, {
  getCompetitionById: () => getCompetitionById,
  getStandingsByCompetition: () => getStandingsByCompetition
});
import { eq as eq7, and as and6, asc } from "drizzle-orm";
async function getStandingsByCompetition(competitionId, season = "2026") {
  const rows = await db.select({
    standing: standings,
    team: {
      id: teams.id,
      name: teams.name,
      shortName: teams.shortName,
      logoUrl: teams.logoUrl
    }
  }).from(standings).innerJoin(teams, eq7(standings.teamId, teams.id)).where(and6(eq7(standings.competitionId, competitionId), eq7(standings.season, season))).orderBy(asc(standings.position));
  return rows.map((r) => ({
    id: r.standing.id,
    competitionId: r.standing.competitionId,
    teamId: r.standing.teamId,
    season: r.standing.season,
    position: r.standing.position,
    played: r.standing.played,
    wins: r.standing.wins,
    draws: r.standing.draws,
    losses: r.standing.losses,
    goalsFor: r.standing.goalsFor,
    goalsAgainst: r.standing.goalsAgainst,
    goalDiff: r.standing.goalDiff,
    points: r.standing.points,
    form: Array.isArray(r.standing.form) ? r.standing.form : [],
    team: {
      id: r.team.id,
      name: r.team.name,
      shortName: r.team.shortName,
      logoUrl: r.team.logoUrl
    }
  }));
}
async function getCompetitionById(id) {
  const [c] = await db.select().from(competitions).where(eq7(competitions.id, id));
  return c ?? null;
}
var init_standings_repo = __esm({
  "server/repositories/standings.repo.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/repositories/roster.repo.ts
var roster_repo_exports = {};
__export(roster_repo_exports, {
  getRosterByTeamAndSeason: () => getRosterByTeamAndSeason,
  getRosterByTeamLegacy: () => getRosterByTeamLegacy
});
import { eq as eq8, and as and7, sql as sql6 } from "drizzle-orm";
async function getRosterByTeamAndSeason(teamId, season, filters) {
  let seasonId;
  if (typeof season === "string") {
    seasonId = season;
  } else {
    const [s] = await db.select({ id: seasons.id }).from(seasons).where(eq8(seasons.year, season)).limit(1);
    if (!s) return [];
    seasonId = s.id;
  }
  const conditions = [
    eq8(teamRosters.teamId, teamId),
    eq8(teamRosters.seasonId, seasonId)
  ];
  if (filters?.role) conditions.push(eq8(teamRosters.role, filters.role));
  if (filters?.status) conditions.push(eq8(teamRosters.status, filters.status));
  const sectorOrder = sql6`case
    when coalesce(${players.sector}, '') = 'GK' then 1
    when coalesce(${players.sector}, '') = 'DEF' then 2
    when coalesce(${players.sector}, '') = 'MID' then 3
    when coalesce(${players.sector}, '') = 'FWD' then 4
    else 9
  end`;
  let query = db.select({
    id: teamRosters.id,
    playerId: teamRosters.playerId,
    squadNumber: teamRosters.squadNumber,
    role: teamRosters.role,
    status: teamRosters.status,
    name: players.name,
    position: players.position,
    birthDate: players.birthDate,
    nationalityPrimary: players.nationalityPrimary,
    photoUrl: players.photoUrl,
    sector: players.sector
  }).from(teamRosters).innerJoin(players, eq8(teamRosters.playerId, players.id)).where(and7(...conditions)).orderBy(sectorOrder, players.position, teamRosters.squadNumber);
  const rows = await query;
  let result = rows.map((r) => ({
    id: r.id,
    playerId: r.playerId,
    squadNumber: r.squadNumber,
    role: r.role,
    status: r.status,
    name: r.name,
    position: r.position,
    birthDate: r.birthDate,
    nationalityPrimary: r.nationalityPrimary,
    photoUrl: r.photoUrl,
    sector: r.sector
  }));
  if (filters?.position) {
    result = result.filter(
      (p) => p.position.toLowerCase().includes(filters.position.toLowerCase()) || p.sector === filters.position
    );
  }
  if (filters?.sector) {
    result = result.filter((p) => p.sector === filters.sector);
  }
  return result;
}
async function getRosterByTeamLegacy(teamId, filters) {
  const sectorOrder = sql6`case
    when coalesce(${players.sector}, '') = 'GK' then 1
    when coalesce(${players.sector}, '') = 'DEF' then 2
    when coalesce(${players.sector}, '') = 'MID' then 3
    when coalesce(${players.sector}, '') = 'FWD' then 4
    else 9
  end`;
  const rows = await db.select({
    id: players.id,
    playerId: players.id,
    squadNumber: players.shirtNumber,
    role: sql6`null`,
    status: sql6`null`,
    name: players.name,
    position: players.position,
    birthDate: players.birthDate,
    nationalityPrimary: players.nationalityPrimary,
    photoUrl: players.photoUrl,
    sector: players.sector
  }).from(players).where(eq8(players.teamId, teamId)).orderBy(sectorOrder, players.position, players.shirtNumber);
  let result = rows.map((r) => ({
    id: r.id,
    playerId: r.playerId,
    squadNumber: r.squadNumber,
    role: r.role,
    status: r.status,
    name: r.name,
    position: r.position,
    birthDate: r.birthDate,
    nationalityPrimary: r.nationalityPrimary,
    photoUrl: r.photoUrl,
    sector: r.sector
  }));
  if (filters?.position) {
    result = result.filter(
      (p) => p.position.toLowerCase().includes(filters.position.toLowerCase()) || p.sector === filters.position
    );
  }
  if (filters?.sector) {
    result = result.filter((p) => p.sector === filters.sector);
  }
  return result;
}
var init_roster_repo = __esm({
  "server/repositories/roster.repo.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/repositories/players.repo.ts
var players_repo_exports = {};
__export(players_repo_exports, {
  getTopRatedByTeam: () => getTopRatedByTeam
});
import { eq as eq9, or as or4, and as and8, desc as desc7, sql as sql7, inArray as inArray6 } from "drizzle-orm";
async function getTopRatedByTeam(teamId, options = {}) {
  const limit = options.limit ?? 3;
  const lastN = options.lastNMatches ?? 10;
  const recentMatchIds = await db.select({ id: matchGames.id }).from(matchGames).where(
    or4(
      eq9(matchGames.homeTeamId, teamId),
      eq9(matchGames.awayTeamId, teamId)
    )
  ).orderBy(desc7(matchGames.kickoffAt)).limit(lastN);
  const matchIds = recentMatchIds.map((r) => r.id);
  if (matchIds.length === 0) return [];
  const rows = await db.select({
    playerId: playerMatchStats.playerId,
    name: players.name,
    photoUrl: players.photoUrl,
    position: players.position,
    shirtNumber: players.shirtNumber,
    avgRating: sql7`avg(${playerMatchStats.rating})::real`.as("avg_rating"),
    matchesPlayed: sql7`count(*)::int`.as("matches_played"),
    totalGoals: sql7`coalesce(sum(${playerMatchStats.goals}), 0)::int`.as("total_goals"),
    totalAssists: sql7`coalesce(sum(${playerMatchStats.assists}), 0)::int`.as("total_assists")
  }).from(playerMatchStats).innerJoin(players, eq9(playerMatchStats.playerId, players.id)).where(and8(
    eq9(playerMatchStats.teamId, teamId),
    inArray6(playerMatchStats.matchId, matchIds)
  )).groupBy(
    playerMatchStats.playerId,
    players.name,
    players.photoUrl,
    players.position,
    players.shirtNumber
  ).orderBy(desc7(sql7`avg(${playerMatchStats.rating})`)).limit(limit);
  return rows.map((r) => ({
    playerId: r.playerId,
    name: r.name,
    photoUrl: r.photoUrl,
    position: r.position,
    shirtNumber: r.shirtNumber,
    avgRating: Number(r.avgRating ?? 0),
    matchesPlayed: Number(r.matchesPlayed ?? 0),
    totalGoals: Number(r.totalGoals ?? 0),
    totalAssists: Number(r.totalAssists ?? 0)
  }));
}
var init_players_repo = __esm({
  "server/repositories/players.repo.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/repositories/forum.repo.ts
var forum_repo_exports = {};
__export(forum_repo_exports, {
  createForumReply: () => createForumReply,
  createForumTopic: () => createForumTopic,
  getForumReplyTeamId: () => getForumReplyTeamId,
  getForumStats: () => getForumStats,
  getForumTopicById: () => getForumTopicById,
  listForumReplies: () => listForumReplies,
  listForumTopics: () => listForumTopics,
  toggleForumReplyLike: () => toggleForumReplyLike,
  toggleForumTopicLike: () => toggleForumTopicLike
});
import { eq as eq10, and as and9, desc as desc8, sql as sql8, ilike as ilike3, or as or5, gt as gt4, inArray as inArray7 } from "drizzle-orm";
async function listForumTopics(teamId, options = {}) {
  const limit = Math.min(options.limit ?? 24, 50);
  const offset = options.offset ?? 0;
  const conditions = [
    eq10(teamsForumTopics.teamId, teamId),
    eq10(teamsForumTopics.isRemoved, false),
    eq10(teamsForumTopics.moderationStatus, "APPROVED")
  ];
  if (options.category && options.category !== "base") {
    conditions.push(eq10(teamsForumTopics.category, options.category));
  }
  if (options.search?.trim()) {
    conditions.push(
      or5(
        ilike3(teamsForumTopics.title, `%${options.search.trim()}%`),
        ilike3(teamsForumTopics.content, `%${options.search.trim()}%`)
      )
    );
  }
  const orderByClause = options.trending ? [desc8(teamsForumTopics.isPinned), desc8(teamsForumTopics.likesCount), desc8(teamsForumTopics.repliesCount), desc8(teamsForumTopics.updatedAt)] : [desc8(teamsForumTopics.isPinned), desc8(teamsForumTopics.updatedAt)];
  const rows = await db.select({
    topic: teamsForumTopics,
    authorName: users.name,
    authorAvatar: users.avatarUrl,
    authorType: users.userType
  }).from(teamsForumTopics).innerJoin(users, eq10(teamsForumTopics.authorId, users.id)).where(and9(...conditions)).orderBy(...orderByClause).limit(limit).offset(offset);
  const topicIds = rows.map((r) => r.topic.id);
  let viewerLikes = /* @__PURE__ */ new Set();
  if (options.viewerUserId && topicIds.length > 0) {
    const likes = await db.select({ topicId: teamsForumLikes.topicId }).from(teamsForumLikes).where(
      and9(
        eq10(teamsForumLikes.userId, options.viewerUserId),
        inArray7(teamsForumLikes.topicId, topicIds)
      )
    );
    viewerLikes = new Set(likes.map((l) => l.topicId).filter(Boolean));
  }
  return rows.map((r) => ({
    id: r.topic.id,
    teamId: r.topic.teamId,
    authorId: r.topic.authorId,
    title: r.topic.title,
    content: r.topic.content,
    category: r.topic.category,
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
      isAdmin: r.authorType === "ADMIN"
    },
    viewerHasLiked: viewerLikes.has(r.topic.id)
  }));
}
async function getForumTopicById(topicId, teamId, options = {}) {
  const [row] = await db.select({
    topic: teamsForumTopics,
    authorName: users.name,
    authorAvatar: users.avatarUrl,
    authorType: users.userType
  }).from(teamsForumTopics).innerJoin(users, eq10(teamsForumTopics.authorId, users.id)).where(
    and9(
      eq10(teamsForumTopics.id, topicId),
      eq10(teamsForumTopics.teamId, teamId),
      eq10(teamsForumTopics.isRemoved, false)
    )
  );
  if (!row) return null;
  if (options.incrementView) {
    await db.update(teamsForumTopics).set({ viewsCount: sql8`${teamsForumTopics.viewsCount} + 1` }).where(eq10(teamsForumTopics.id, topicId));
  }
  let viewerHasLiked = false;
  if (options.viewerUserId) {
    const [like] = await db.select().from(teamsForumLikes).where(
      and9(
        eq10(teamsForumLikes.userId, options.viewerUserId),
        eq10(teamsForumLikes.topicId, topicId)
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
    category: row.topic.category,
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
      isAdmin: row.authorType === "ADMIN"
    },
    viewerHasLiked
  };
}
async function createForumTopic(teamId, authorId, data) {
  const [topic] = await db.insert(teamsForumTopics).values({
    teamId,
    authorId,
    title: data.title,
    content: data.content,
    category: data.category ?? "base",
    coverImageUrl: data.coverImageUrl ?? null
  }).returning();
  const [user] = await db.select().from(users).where(eq10(users.id, authorId));
  return {
    id: topic.id,
    teamId: topic.teamId,
    authorId: topic.authorId,
    title: topic.title,
    content: topic.content,
    category: topic.category,
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
      name: user?.name ?? "An\xF4nimo",
      avatarUrl: user?.avatarUrl ?? null,
      isJournalist: user?.userType === "JOURNALIST",
      isAdmin: user?.userType === "ADMIN"
    }
  };
}
async function listForumReplies(topicId, options = {}) {
  const limit = Math.min(options.limit ?? 50, 100);
  const offset = options.offset ?? 0;
  const rows = await db.select({
    reply: teamsForumReplies,
    authorName: users.name,
    authorAvatar: users.avatarUrl,
    authorType: users.userType
  }).from(teamsForumReplies).innerJoin(users, eq10(teamsForumReplies.authorId, users.id)).where(eq10(teamsForumReplies.topicId, topicId)).orderBy(teamsForumReplies.createdAt).limit(limit).offset(offset);
  let viewerLikes = /* @__PURE__ */ new Set();
  if (options.viewerUserId && rows.length > 0) {
    const replyIds = rows.map((r) => r.reply.id);
    const likes = await db.select({ replyId: teamsForumLikes.replyId }).from(teamsForumLikes).where(
      and9(
        eq10(teamsForumLikes.userId, options.viewerUserId),
        inArray7(teamsForumLikes.replyId, replyIds)
      )
    );
    viewerLikes = new Set(likes.map((l) => l.replyId).filter(Boolean));
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
      isAdmin: r.authorType === "ADMIN"
    },
    viewerHasLiked: viewerLikes.has(r.reply.id)
  }));
}
async function createForumReply(topicId, authorId, content) {
  const [reply] = await db.insert(teamsForumReplies).values({ topicId, authorId, content }).returning();
  await db.update(teamsForumTopics).set({
    repliesCount: sql8`${teamsForumTopics.repliesCount} + 1`,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq10(teamsForumTopics.id, topicId));
  const [user] = await db.select().from(users).where(eq10(users.id, authorId));
  return {
    id: reply.id,
    topicId: reply.topicId,
    authorId: reply.authorId,
    content: reply.content,
    likesCount: reply.likesCount,
    createdAt: reply.createdAt,
    author: {
      id: reply.authorId,
      name: user?.name ?? "An\xF4nimo",
      avatarUrl: user?.avatarUrl ?? null,
      isJournalist: user?.userType === "JOURNALIST",
      isAdmin: user?.userType === "ADMIN"
    }
  };
}
async function toggleForumTopicLike(topicId, userId) {
  const [existing] = await db.select().from(teamsForumLikes).where(
    and9(
      eq10(teamsForumLikes.userId, userId),
      eq10(teamsForumLikes.topicId, topicId)
    )
  );
  if (existing) {
    await db.delete(teamsForumLikes).where(
      and9(
        eq10(teamsForumLikes.userId, userId),
        eq10(teamsForumLikes.topicId, topicId)
      )
    );
    await db.update(teamsForumTopics).set({ likesCount: sql8`GREATEST(0, ${teamsForumTopics.likesCount} - 1)` }).where(eq10(teamsForumTopics.id, topicId));
    const [topic] = await db.select({ likesCount: teamsForumTopics.likesCount }).from(teamsForumTopics).where(eq10(teamsForumTopics.id, topicId));
    return { liked: false, likesCount: Math.max(0, (topic?.likesCount ?? 1) - 1) };
  } else {
    await db.insert(teamsForumLikes).values({ userId, topicId });
    await db.update(teamsForumTopics).set({ likesCount: sql8`${teamsForumTopics.likesCount} + 1` }).where(eq10(teamsForumTopics.id, topicId));
    const [topic] = await db.select({ likesCount: teamsForumTopics.likesCount }).from(teamsForumTopics).where(eq10(teamsForumTopics.id, topicId));
    return { liked: true, likesCount: (topic?.likesCount ?? 0) + 1 };
  }
}
async function getForumReplyTeamId(replyId) {
  const [row] = await db.select({ teamId: teamsForumTopics.teamId }).from(teamsForumReplies).innerJoin(teamsForumTopics, eq10(teamsForumReplies.topicId, teamsForumTopics.id)).where(eq10(teamsForumReplies.id, replyId));
  return row?.teamId ?? null;
}
async function toggleForumReplyLike(replyId, userId) {
  const [existing] = await db.select().from(teamsForumLikes).where(
    and9(
      eq10(teamsForumLikes.userId, userId),
      eq10(teamsForumLikes.replyId, replyId)
    )
  );
  if (existing) {
    await db.delete(teamsForumLikes).where(
      and9(
        eq10(teamsForumLikes.userId, userId),
        eq10(teamsForumLikes.replyId, replyId)
      )
    );
    await db.update(teamsForumReplies).set({ likesCount: sql8`GREATEST(0, ${teamsForumReplies.likesCount} - 1)` }).where(eq10(teamsForumReplies.id, replyId));
    const [reply] = await db.select({ likesCount: teamsForumReplies.likesCount }).from(teamsForumReplies).where(eq10(teamsForumReplies.id, replyId));
    return { liked: false, likesCount: Math.max(0, (reply?.likesCount ?? 1) - 1) };
  } else {
    await db.insert(teamsForumLikes).values({ userId, replyId });
    await db.update(teamsForumReplies).set({ likesCount: sql8`${teamsForumReplies.likesCount} + 1` }).where(eq10(teamsForumReplies.id, replyId));
    const [reply] = await db.select({ likesCount: teamsForumReplies.likesCount }).from(teamsForumReplies).where(eq10(teamsForumReplies.id, replyId));
    return { liked: true, likesCount: (reply?.likesCount ?? 0) + 1 };
  }
}
async function getForumStats(teamId) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1e3);
  const [totalTopics] = await db.select({ count: sql8`count(*)::int` }).from(teamsForumTopics).where(
    and9(
      eq10(teamsForumTopics.teamId, teamId),
      eq10(teamsForumTopics.isRemoved, false)
    )
  );
  const [totalReplies] = await db.select({ count: sql8`count(*)::int` }).from(teamsForumReplies).innerJoin(teamsForumTopics, eq10(teamsForumReplies.topicId, teamsForumTopics.id)).where(
    and9(
      eq10(teamsForumTopics.teamId, teamId),
      eq10(teamsForumTopics.isRemoved, false)
    )
  );
  const trendingRows = await db.selectDistinct({ topicId: teamsForumTopics.id }).from(teamsForumTopics).innerJoin(teamsForumReplies, eq10(teamsForumReplies.topicId, teamsForumTopics.id)).where(
    and9(
      eq10(teamsForumTopics.teamId, teamId),
      eq10(teamsForumTopics.isRemoved, false),
      gt4(teamsForumReplies.createdAt, oneDayAgo)
    )
  );
  const trendingCount = trendingRows.length;
  return {
    totalTopics: totalTopics?.count ?? 0,
    totalReplies: totalReplies?.count ?? 0,
    trendingCount
  };
}
var init_forum_repo = __esm({
  "server/repositories/forum.repo.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/repositories/games.repo.ts
var games_repo_exports = {};
__export(games_repo_exports, {
  abandonAttempt: () => abandonAttempt,
  getAttempt: () => getAttempt,
  getGameSetBySlug: () => getGameSetBySlug,
  listGameSets: () => listGameSets,
  normalizeForMatch: () => normalizeForMatch,
  processGuess: () => processGuess,
  resetAttempt: () => resetAttempt,
  startOrGetAttempt: () => startOrGetAttempt
});
import { eq as eq11, and as and10 } from "drizzle-orm";
import { sql as sql9 } from "drizzle-orm";
import levenshtein from "fast-levenshtein";
function normalizeForMatch(text2) {
  return text2.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim().replace(/[.,\-']/g, "").replace(/\s+/g, " ");
}
function similarity(a, b) {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const dist = levenshtein.get(a, b);
  const maxLen = Math.max(a.length, b.length);
  return 1 - dist / maxLen;
}
function thresholdForLength(len) {
  if (len <= 6) return 0.85;
  if (len <= 12) return 0.8;
  return 0.75;
}
async function listGameSets() {
  const sets = await db.select().from(gameSets).orderBy(gameSets.createdAt);
  const result = [];
  for (const s of sets) {
    const [countRow] = await db.select({ count: sql9`count(*)::int` }).from(gameSetPlayers).where(eq11(gameSetPlayers.setId, s.id));
    const playerCount = Number(countRow?.count ?? 0);
    result.push({
      id: s.id,
      slug: s.slug,
      title: s.title,
      season: s.season ?? null,
      competition: s.competition ?? null,
      clubName: s.clubName,
      playerCount,
      teamName: s.clubName,
      seasonYear: s.season ?? null,
      description: null,
      gameType: "adivinhe_elenco"
    });
  }
  return result;
}
async function getGameSetBySlug(slug) {
  const [set] = await db.select().from(gameSets).where(eq11(gameSets.slug, slug)).limit(1);
  if (!set) return null;
  const players2 = await db.select({
    id: gameSetPlayers.id,
    jerseyNumber: gameSetPlayers.jerseyNumber,
    displayName: gameSetPlayers.displayName,
    sortOrder: gameSetPlayers.sortOrder
  }).from(gameSetPlayers).where(eq11(gameSetPlayers.setId, set.id)).orderBy(gameSetPlayers.sortOrder);
  return {
    id: set.id,
    slug: set.slug,
    title: set.title,
    season: set.season ?? null,
    competition: set.competition ?? null,
    clubName: set.clubName,
    players: players2
  };
}
async function startOrGetAttempt(userId, setSlug) {
  const [set] = await db.select().from(gameSets).where(eq11(gameSets.slug, setSlug)).limit(1);
  if (!set) throw new Error("Set n\xE3o encontrado");
  const [existing] = await db.select().from(gameAttempts).where(and10(eq11(gameAttempts.userId, userId), eq11(gameAttempts.setId, set.id))).limit(1);
  let attemptId;
  if (existing) {
    if (existing.status === "in_progress") {
      const guesses = await db.select({ setPlayerId: gameAttemptGuesses.setPlayerId }).from(gameAttemptGuesses).where(eq11(gameAttemptGuesses.attemptId, existing.id));
      return {
        attemptId: existing.id,
        guessedIds: guesses.map((g) => g.setPlayerId)
      };
    }
    await db.delete(gameAttemptGuesses).where(eq11(gameAttemptGuesses.attemptId, existing.id));
    await db.update(gameAttempts).set({
      status: "in_progress",
      completedAt: null,
      guessesCount: 0,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq11(gameAttempts.id, existing.id));
    attemptId = existing.id;
  } else {
    const [inserted] = await db.insert(gameAttempts).values({
      userId,
      setId: set.id,
      status: "in_progress"
    }).returning();
    if (!inserted) throw new Error("Failed to create attempt");
    attemptId = inserted.id;
  }
  return { attemptId, guessedIds: [] };
}
async function getAttempt(attemptId, userId) {
  const [attempt] = await db.select().from(gameAttempts).where(and10(eq11(gameAttempts.id, attemptId), eq11(gameAttempts.userId, userId))).limit(1);
  if (!attempt) return null;
  const guesses = await db.select({ setPlayerId: gameAttemptGuesses.setPlayerId }).from(gameAttemptGuesses).where(eq11(gameAttemptGuesses.attemptId, attemptId));
  const [set] = await db.select().from(gameSets).where(eq11(gameSets.id, attempt.setId)).limit(1);
  if (!set) return null;
  const players2 = await db.select({
    id: gameSetPlayers.id,
    jerseyNumber: gameSetPlayers.jerseyNumber,
    displayName: gameSetPlayers.displayName,
    sortOrder: gameSetPlayers.sortOrder
  }).from(gameSetPlayers).where(eq11(gameSetPlayers.setId, set.id)).orderBy(gameSetPlayers.sortOrder);
  return {
    id: attempt.id,
    status: attempt.status,
    guessedIds: guesses.map((g) => g.setPlayerId),
    set: {
      slug: set.slug,
      title: set.title,
      players: players2
    }
  };
}
async function processGuess(attemptId, userId, text2) {
  const [attempt] = await db.select().from(gameAttempts).where(and10(eq11(gameAttempts.id, attemptId), eq11(gameAttempts.userId, userId))).limit(1);
  if (!attempt) throw new Error("Attempt n\xE3o encontrado");
  if (attempt.status !== "in_progress") throw new Error("Attempt n\xE3o est\xE1 em progresso");
  const normalizedInput = normalizeForMatch(text2);
  if (!normalizedInput) return { matched: false, reason: "no_match" };
  const guessedIds = await db.select({ setPlayerId: gameAttemptGuesses.setPlayerId }).from(gameAttemptGuesses).where(eq11(gameAttemptGuesses.attemptId, attemptId));
  const guessedSet = new Set(guessedIds.map((g) => g.setPlayerId));
  const players2 = await db.select().from(gameSetPlayers).where(eq11(gameSetPlayers.setId, attempt.setId));
  const notYetGuessed = players2.filter((p) => !guessedSet.has(p.id));
  for (const p of players2) {
    if (guessedSet.has(p.id)) {
      const sim = similarity(normalizedInput, p.normalizedName);
      const thresh = thresholdForLength(Math.min(normalizedInput.length, p.normalizedName.length));
      if (sim >= thresh || p.normalizedName === normalizedInput) {
        return { matched: false, reason: "already_guessed" };
      }
      const aliases = p.aliases ?? [];
      for (const alias of aliases) {
        if (normalizeForMatch(alias) === normalizedInput) {
          return { matched: false, reason: "already_guessed" };
        }
      }
    }
  }
  for (const p of notYetGuessed) {
    if (p.normalizedName === normalizedInput) {
      await recordGuess(attemptId, p.id, text2, 1);
      const all = guessedSet.size + 1;
      if (all >= players2.length) {
        await db.update(gameAttempts).set({ status: "completed", completedAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(eq11(gameAttempts.id, attemptId));
      }
      return {
        matched: true,
        setPlayerId: p.id,
        displayName: p.displayName,
        jerseyNumber: p.jerseyNumber,
        score: 1
      };
    }
  }
  for (const p of notYetGuessed) {
    const aliases = p.aliases ?? [];
    for (const alias of aliases) {
      if (normalizeForMatch(alias) === normalizedInput) {
        await recordGuess(attemptId, p.id, text2, 1);
        const all = guessedSet.size + 1;
        if (all >= players2.length) {
          await db.update(gameAttempts).set({ status: "completed", completedAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(eq11(gameAttempts.id, attemptId));
        }
        return {
          matched: true,
          setPlayerId: p.id,
          displayName: p.displayName,
          jerseyNumber: p.jerseyNumber,
          score: 1
        };
      }
    }
  }
  for (const p of notYetGuessed) {
    const norm = p.normalizedName;
    if (norm.includes(normalizedInput) || normalizedInput.includes(norm)) {
      const sim = similarity(normalizedInput, norm);
      const thresh = thresholdForLength(Math.min(normalizedInput.length, norm.length));
      if (sim >= thresh) {
        await recordGuess(attemptId, p.id, text2, sim);
        const all = guessedSet.size + 1;
        if (all >= players2.length) {
          await db.update(gameAttempts).set({ status: "completed", completedAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(eq11(gameAttempts.id, attemptId));
        }
        return {
          matched: true,
          setPlayerId: p.id,
          displayName: p.displayName,
          jerseyNumber: p.jerseyNumber,
          score: sim
        };
      }
    }
  }
  let best = null;
  for (const p of notYetGuessed) {
    const sim = similarity(normalizedInput, p.normalizedName);
    const thresh = thresholdForLength(Math.min(normalizedInput.length, p.normalizedName.length));
    if (sim >= thresh && (!best || sim > best.score)) {
      best = { player: p, score: sim };
    }
  }
  if (best) {
    await recordGuess(attemptId, best.player.id, text2, best.score);
    const all = guessedSet.size + 1;
    if (all >= players2.length) {
      await db.update(gameAttempts).set({ status: "completed", completedAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(eq11(gameAttempts.id, attemptId));
    }
    return {
      matched: true,
      setPlayerId: best.player.id,
      displayName: best.player.displayName,
      jerseyNumber: best.player.jerseyNumber,
      score: best.score
    };
  }
  await db.update(gameAttempts).set({
    guessesCount: attempt.guessesCount + 1,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq11(gameAttempts.id, attemptId));
  return { matched: false, reason: "no_match" };
}
async function recordGuess(attemptId, setPlayerId, guessedText, score) {
  await db.insert(gameAttemptGuesses).values({
    attemptId,
    setPlayerId,
    guessedText,
    matchedScore: score
  });
}
async function resetAttempt(attemptId, userId) {
  const [attempt] = await db.select().from(gameAttempts).where(and10(eq11(gameAttempts.id, attemptId), eq11(gameAttempts.userId, userId))).limit(1);
  if (!attempt) return false;
  await db.delete(gameAttemptGuesses).where(eq11(gameAttemptGuesses.attemptId, attemptId));
  await db.update(gameAttempts).set({
    status: "in_progress",
    completedAt: null,
    guessesCount: 0,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq11(gameAttempts.id, attemptId));
  return true;
}
async function abandonAttempt(attemptId, userId) {
  const [attempt] = await db.select().from(gameAttempts).where(and10(eq11(gameAttempts.id, attemptId), eq11(gameAttempts.userId, userId))).limit(1);
  if (!attempt) return false;
  await db.update(gameAttempts).set({
    status: "abandoned",
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq11(gameAttempts.id, attemptId));
  return true;
}
var init_games_repo = __esm({
  "server/repositories/games.repo.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/repositories/guess-player.repo.ts
var guess_player_repo_exports = {};
__export(guess_player_repo_exports, {
  getOrCreateDailyPlayer: () => getOrCreateDailyPlayer,
  getOrCreateProgress: () => getOrCreateProgress,
  getPlayerOfTheDay: () => getPlayerOfTheDay,
  getTodayDateKey: () => getTodayDateKey,
  processGuess: () => processGuess2,
  searchPlayersForGame: () => searchPlayersForGame
});
import crypto from "crypto";
import { eq as eq12, and as and11, or as or6, ilike as ilike4, isNotNull as isNotNull2 } from "drizzle-orm";
import levenshtein2 from "fast-levenshtein";
function getTodayDateKey() {
  const now = /* @__PURE__ */ new Date();
  return now.toISOString().slice(0, 10);
}
function normalizeForMatch2(text2) {
  return text2.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim().replace(/[.,\-']/g, "").replace(/\s+/g, " ");
}
function dateKeyToSeed(dateKey) {
  const hash = crypto.createHash("sha256").update(dateKey).digest();
  return hash.readUInt32BE(0);
}
function similarity2(a, b) {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const dist = levenshtein2.get(a, b);
  const maxLen = Math.max(a.length, b.length);
  return 1 - dist / maxLen;
}
function isFuzzyMatch(input, target) {
  const normInput = normalizeForMatch2(input);
  const normTarget = normalizeForMatch2(target);
  if (normInput === normTarget) return true;
  const sim = similarity2(normInput, normTarget);
  const minLen = Math.min(normInput.length, normTarget.length);
  const threshold = minLen <= 5 ? 0.85 : minLen <= 10 ? 0.8 : 0.75;
  return sim >= threshold;
}
function computeBlurPercent(wrongAttempts) {
  return Math.max(0, 100 - wrongAttempts * 10);
}
async function getOrCreateDailyPlayer(dateKey, teamId) {
  const [existing] = await db.select().from(gameDailyPlayer).where(and11(eq12(gameDailyPlayer.dateKey, dateKey), eq12(gameDailyPlayer.teamId, teamId))).limit(1);
  if (existing) {
    const [player2] = await db.select({
      id: players.id,
      name: players.name,
      knownName: players.knownName,
      photoUrl: players.photoUrl,
      position: players.position,
      shirtNumber: players.shirtNumber
    }).from(players).where(eq12(players.id, existing.playerId)).limit(1);
    return { daily: existing, player: player2 ?? null };
  }
  const teamPlayers = await db.select({ id: players.id }).from(players).where(and11(eq12(players.teamId, teamId), isNotNull2(players.photoUrl))).orderBy(players.id);
  if (teamPlayers.length === 0) {
    const allTeamPlayers = await db.select({ id: players.id }).from(players).where(eq12(players.teamId, teamId)).orderBy(players.id);
    if (allTeamPlayers.length === 0) return null;
    teamPlayers.push(...allTeamPlayers);
  }
  const seed = dateKeyToSeed(`${dateKey}:${teamId}`);
  const idx = seed % teamPlayers.length;
  const chosenPlayerId = teamPlayers[idx].id;
  const [inserted] = await db.insert(gameDailyPlayer).values({
    dateKey,
    teamId,
    playerId: chosenPlayerId,
    seedUsed: seed
  }).onConflictDoNothing().returning();
  if (!inserted) {
    return getOrCreateDailyPlayer(dateKey, teamId);
  }
  const [player] = await db.select({
    id: players.id,
    name: players.name,
    knownName: players.knownName,
    photoUrl: players.photoUrl,
    position: players.position,
    shirtNumber: players.shirtNumber
  }).from(players).where(eq12(players.id, chosenPlayerId)).limit(1);
  return { daily: inserted, player: player ?? null };
}
async function getOrCreateProgress(userId, dateKey, dailyPlayerId) {
  const [existing] = await db.select().from(gameDailyGuessProgress).where(and11(eq12(gameDailyGuessProgress.userId, userId), eq12(gameDailyGuessProgress.dateKey, dateKey))).limit(1);
  if (existing) return existing;
  const [inserted] = await db.insert(gameDailyGuessProgress).values({
    userId,
    dateKey,
    dailyPlayerId,
    attempts: 0,
    wrongAttempts: 0,
    guessed: false,
    lost: false,
    guesses: []
  }).onConflictDoNothing().returning();
  if (!inserted) {
    return getOrCreateProgress(userId, dateKey, dailyPlayerId);
  }
  return inserted;
}
async function getPlayerOfTheDay(userId, teamId) {
  const dateKey = getTodayDateKey();
  const result = await getOrCreateDailyPlayer(dateKey, teamId);
  if (!result || !result.player) return null;
  const { daily, player } = result;
  const progress = await getOrCreateProgress(userId, dateKey, daily.id);
  const guesses = progress.guesses ?? [];
  const status = progress.guessed ? "won" : progress.lost ? "lost" : "playing";
  const revealName = status !== "playing";
  return {
    dateKey,
    player: {
      id: player.id,
      photoUrl: player.photoUrl,
      position: player.position,
      shirtNumber: player.shirtNumber,
      ...revealName ? { name: player.knownName || player.name } : {}
    },
    progress: {
      attempts: progress.attempts,
      wrongAttempts: progress.wrongAttempts,
      guessed: progress.guessed,
      lost: progress.lost,
      guesses: guesses.map((g) => ({ text: g.text, correct: g.correct })),
      blurPercent: computeBlurPercent(progress.wrongAttempts),
      attemptsLeft: Math.max(0, MAX_WRONG_ATTEMPTS - progress.wrongAttempts)
    },
    status
  };
}
async function processGuess2(userId, teamId, guessText) {
  const dateKey = getTodayDateKey();
  const result = await getOrCreateDailyPlayer(dateKey, teamId);
  if (!result || !result.player) throw new Error("Nenhum jogador do dia dispon\xEDvel");
  const { daily, player } = result;
  const progress = await getOrCreateProgress(userId, dateKey, daily.id);
  if (progress.guessed) {
    return {
      correct: true,
      feedback: "correct",
      status: "won",
      wrongAttempts: progress.wrongAttempts,
      blurPercent: 0,
      attemptsLeft: 0,
      revealName: player.knownName || player.name
    };
  }
  if (progress.lost) {
    return {
      correct: false,
      feedback: "wrong",
      status: "lost",
      wrongAttempts: progress.wrongAttempts,
      blurPercent: 0,
      attemptsLeft: 0,
      revealName: player.knownName || player.name
    };
  }
  const normalizedGuess = normalizeForMatch2(guessText);
  const realName = player.knownName || player.name;
  const realNameNormalized = normalizeForMatch2(realName);
  const namesToCheck = [realName, player.name, player.knownName].filter(Boolean);
  let isCorrect = false;
  let isClose = false;
  for (const nameVariant of namesToCheck) {
    const normVariant = normalizeForMatch2(nameVariant);
    if (normalizedGuess === normVariant) {
      isCorrect = true;
      break;
    }
  }
  if (!isCorrect) {
    for (const nameVariant of namesToCheck) {
      if (isFuzzyMatch(guessText, nameVariant)) {
        isCorrect = true;
        isClose = true;
        break;
      }
    }
  }
  const existingGuesses = progress.guesses ?? [];
  const newGuess = { text: guessText, normalized: normalizedGuess, correct: isCorrect };
  const updatedGuesses = [...existingGuesses, newGuess];
  if (isCorrect) {
    await db.update(gameDailyGuessProgress).set({
      attempts: progress.attempts + 1,
      guessed: true,
      guesses: updatedGuesses,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq12(gameDailyGuessProgress.id, progress.id));
    return {
      correct: true,
      feedback: "correct",
      status: "won",
      wrongAttempts: progress.wrongAttempts,
      blurPercent: 0,
      attemptsLeft: 0,
      revealName: realName
    };
  }
  const newWrongAttempts = progress.wrongAttempts + 1;
  const hasLost = newWrongAttempts >= MAX_WRONG_ATTEMPTS;
  await db.update(gameDailyGuessProgress).set({
    attempts: progress.attempts + 1,
    wrongAttempts: newWrongAttempts,
    lost: hasLost,
    guesses: updatedGuesses,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq12(gameDailyGuessProgress.id, progress.id));
  const sim = similarity2(normalizedGuess, realNameNormalized);
  const feedback = sim >= 0.5 ? "close" : "wrong";
  return {
    correct: false,
    feedback,
    status: hasLost ? "lost" : "playing",
    wrongAttempts: newWrongAttempts,
    blurPercent: hasLost ? 0 : computeBlurPercent(newWrongAttempts),
    attemptsLeft: Math.max(0, MAX_WRONG_ATTEMPTS - newWrongAttempts),
    ...hasLost ? { revealName: realName } : {}
  };
}
async function searchPlayersForGame(teamId, query, limit = 10) {
  const term = query.trim();
  if (!term || term.length < 2) return [];
  const rows = await db.select({
    id: players.id,
    name: players.name,
    knownName: players.knownName,
    photoUrl: players.photoUrl,
    position: players.position
  }).from(players).where(
    and11(
      eq12(players.teamId, teamId),
      or6(
        ilike4(players.name, `%${term}%`),
        ilike4(players.knownName, `%${term}%`)
      )
    )
  ).orderBy(players.name).limit(limit);
  return rows.map((r) => ({
    id: r.id,
    name: r.knownName || r.name,
    photoUrl: r.photoUrl,
    position: r.position
  }));
}
var MAX_WRONG_ATTEMPTS;
var init_guess_player_repo = __esm({
  "server/repositories/guess-player.repo.ts"() {
    "use strict";
    init_db();
    init_schema();
    MAX_WRONG_ATTEMPTS = 10;
  }
});

// api/_entry.ts
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";

// server/routes.ts
init_db();
import { createServer } from "http";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";

// server/storage.ts
init_db();
import { eq, and, desc, or, ilike, sql as sql2, inArray, gt, lt } from "drizzle-orm";

// server/teams-data.ts
var TEAMS_DATA = [
  { id: "flamengo", name: "Flamengo", shortName: "FLA", logoUrl: "https://logodetimes.com/flamengo.png", primaryColor: "#E31837", secondaryColor: "#000000" },
  { id: "palmeiras", name: "Palmeiras", shortName: "PAL", logoUrl: "https://logodetimes.com/palmeiras.png", primaryColor: "#006437", secondaryColor: "#FFFFFF" },
  { id: "corinthians", name: "Corinthians", shortName: "COR", logoUrl: "https://logodetimes.com/corinthians.png", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: "sao-paulo", name: "S\xE3o Paulo", shortName: "SAO", logoUrl: "https://logodetimes.com/saopaulo.png", primaryColor: "#EC1C24", secondaryColor: "#000000" },
  { id: "gremio", name: "Gr\xEAmio", shortName: "GRE", logoUrl: "https://logodetimes.com/gremio.png", primaryColor: "#0099CC", secondaryColor: "#000000" },
  { id: "internacional", name: "Internacional", shortName: "INT", logoUrl: "https://logodetimes.com/internacional.png", primaryColor: "#D81920", secondaryColor: "#FFFFFF" },
  { id: "atletico-mineiro", name: "Atl\xE9tico Mineiro", shortName: "CAM", logoUrl: "https://logodetimes.com/atletico-mg.png", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: "fluminense", name: "Fluminense", shortName: "FLU", logoUrl: "https://logodetimes.com/fluminense.png", primaryColor: "#7A1437", secondaryColor: "#006241" },
  { id: "botafogo", name: "Botafogo", shortName: "BOT", logoUrl: "https://logodetimes.com/botafogo.png", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: "santos", name: "Santos", shortName: "SAN", logoUrl: "https://logodetimes.com/santos.png", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: "vasco-da-gama", name: "Vasco da Gama", shortName: "VAS", logoUrl: "https://logodetimes.com/vasco.png", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: "cruzeiro", name: "Cruzeiro", shortName: "CRU", logoUrl: "https://logodetimes.com/cruzeiro.png", primaryColor: "#003A70", secondaryColor: "#FFFFFF" },
  { id: "athletico-paranaense", name: "Athletico Paranaense", shortName: "CAP", logoUrl: "https://logodetimes.com/atletico-pr.png", primaryColor: "#E30613", secondaryColor: "#000000" },
  { id: "bahia", name: "Bahia", shortName: "BAH", logoUrl: "https://logodetimes.com/bahia.png", primaryColor: "#005CA9", secondaryColor: "#E30613" },
  { id: "fortaleza", name: "Fortaleza", shortName: "FOR", logoUrl: "https://logodetimes.com/fortaleza.png", primaryColor: "#E30613", secondaryColor: "#003A70" },
  { id: "bragantino", name: "Bragantino", shortName: "BRA", logoUrl: "https://logodetimes.com/bragantino.png", primaryColor: "#FFFFFF", secondaryColor: "#E30613" },
  { id: "cuiaba", name: "Cuiab\xE1", shortName: "CUI", logoUrl: "https://logodetimes.com/cuiaba.png", primaryColor: "#FFD700", secondaryColor: "#006241" },
  { id: "goias", name: "Goi\xE1s", shortName: "GOI", logoUrl: "https://logodetimes.com/goias.png", primaryColor: "#006241", secondaryColor: "#FFFFFF" },
  { id: "coritiba", name: "Coritiba", shortName: "CFC", logoUrl: "https://logodetimes.com/coritiba.png", primaryColor: "#006241", secondaryColor: "#FFFFFF" },
  { id: "america-mineiro", name: "Am\xE9rica Mineiro", shortName: "AME", logoUrl: "https://logodetimes.com/america-mg.png", primaryColor: "#006241", secondaryColor: "#000000" }
];

// server/storage.ts
init_schema();
function positionOrderForLineup(pos) {
  const p = (pos || "").toUpperCase();
  if (p.includes("GOAL") || p === "GK") return 0;
  if (p.includes("DEF") || p === "CB" || p === "LB" || p === "RB" || p === "WB") return 1;
  if (p.includes("MID") || p === "DM" || p === "CM" || p === "AM" || p === "LM" || p === "RM") return 2;
  return 3;
}
var DatabaseStorage = class {
  // Users
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async getUserByHandle(handle) {
    const [user] = await db.select().from(users).where(eq(users.handle, handle));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, data) {
    const [user] = await db.update(users).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
    return user || void 0;
  }
  // Journalists
  async getJournalist(userId) {
    const [journalist] = await db.select().from(journalists).where(eq(journalists.userId, userId));
    return journalist || void 0;
  }
  async createJournalist(insertJournalist) {
    const [journalist] = await db.insert(journalists).values(insertJournalist).returning();
    return journalist;
  }
  async updateJournalistByUserId(userId, data) {
    const [journalist] = await db.update(journalists).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(journalists.userId, userId)).returning();
    return journalist || void 0;
  }
  async deleteJournalistByUserId(userId) {
    await db.delete(journalists).where(eq(journalists.userId, userId));
  }
  async approveJournalistByEmail(email) {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("approveJournalistByEmail s\xF3 pode ser executado em NODE_ENV=development");
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error("Email inv\xE1lido (vazio)");
    }
    const [user] = await db.select().from(users).where(ilike(users.email, normalizedEmail)).limit(1);
    if (!user) {
      throw new Error(`Usu\xE1rio n\xE3o encontrado para o email: ${normalizedEmail}`);
    }
    const existingJournalist = await this.getJournalist(user.id);
    const previousJournalistStatus = existingJournalist?.status ?? null;
    if (existingJournalist?.status === "APPROVED") {
      return {
        user,
        previousJournalistStatus,
        finalJournalistStatus: "APPROVED"
      };
    }
    const now = /* @__PURE__ */ new Date();
    if (!existingJournalist) {
      await db.insert(journalists).values({
        userId: user.id,
        organization: "A ser definido",
        professionalId: "N/A",
        status: "APPROVED",
        verificationDate: now
      });
    } else {
      await this.updateJournalistByUserId(user.id, { status: "APPROVED", verificationDate: now });
    }
    if (user.userType !== "ADMIN") {
      await this.updateUser(user.id, { userType: "JOURNALIST" });
    }
    return {
      user,
      previousJournalistStatus,
      finalJournalistStatus: "APPROVED"
    };
  }
  // Teams
  async getAllTeams() {
    return await db.select().from(teams).orderBy(teams.name);
  }
  async getTeam(id) {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || void 0;
  }
  async createTeam(insertTeam) {
    const [team] = await db.insert(teams).values(insertTeam).returning();
    return team;
  }
  async seedTeamsIfEmpty() {
    const existing = await db.select({ id: teams.id }).from(teams).limit(1);
    if (existing.length > 0) {
      return { seeded: false, count: 0 };
    }
    await db.insert(teams).values(
      TEAMS_DATA.map((t) => ({
        id: t.id,
        name: t.name,
        shortName: t.shortName,
        logoUrl: t.logoUrl,
        primaryColor: t.primaryColor,
        secondaryColor: t.secondaryColor
      }))
    );
    return { seeded: true, count: TEAMS_DATA.length };
  }
  // Players
  async getPlayersByTeam(teamId) {
    const sectorOrder = sql2`case
      when coalesce(${players.sector}, '') = 'GK' then 1
      when coalesce(${players.sector}, '') = 'DEF' then 2
      when coalesce(${players.sector}, '') = 'MID' then 3
      when coalesce(${players.sector}, '') = 'FWD' then 4
      when ${players.position} = 'Goalkeeper' then 1
      when ${players.position} in ('Centre-Back', 'Left-Back', 'Right-Back', 'Wing-Back') then 2
      when ${players.position} in ('Defensive Midfield', 'Central Midfield', 'Attacking Midfield') then 3
      when ${players.position} in ('Left Winger', 'Right Winger', 'Centre-Forward', 'Second Striker') then 4
      else 9
    end`;
    return await db.select().from(players).where(eq(players.teamId, teamId)).orderBy(
      sectorOrder,
      players.position,
      sql2`${players.shirtNumber} is null`,
      players.shirtNumber,
      players.name
    );
  }
  async getPlayer(id) {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player || void 0;
  }
  async createPlayer(insertPlayer) {
    const [player] = await db.insert(players).values(insertPlayer).returning();
    return player;
  }
  async searchPlayers(q, limit = 10) {
    const term = q.trim();
    if (!term) return [];
    const rows = await db.select({
      id: players.id,
      teamId: players.teamId,
      shirtNumber: players.shirtNumber,
      name: players.name,
      fullName: players.fullName,
      knownName: players.knownName,
      position: players.position,
      birthDate: players.birthDate,
      nationalityPrimary: players.nationalityPrimary,
      nationalitySecondary: players.nationalitySecondary,
      nationalityCountryId: players.nationalityCountryId,
      primaryPosition: players.primaryPosition,
      secondaryPositions: players.secondaryPositions,
      heightCm: players.heightCm,
      preferredFoot: players.preferredFoot,
      marketValueEur: players.marketValueEur,
      fromClub: players.fromClub,
      photoUrl: players.photoUrl,
      sector: players.sector,
      slug: players.slug,
      createdAt: players.createdAt,
      updatedAt: players.updatedAt,
      teamName: teams.name
    }).from(players).leftJoin(teams, eq(players.teamId, teams.id)).where(ilike(players.name, `%${term}%`)).orderBy(players.name).limit(limit);
    return rows.map((r) => ({
      ...r,
      teamName: r.teamName ?? void 0
    }));
  }
  // Matches
  async getMatch(id) {
    const [match] = await db.select().from(matches).where(eq(matches.id, id)).limit(1);
    return match;
  }
  async getMatchesByTeam(teamId, limit = 10) {
    return await db.select().from(matches).where(eq(matches.teamId, teamId)).orderBy(desc(matches.matchDate)).limit(limit);
  }
  async getNextMatch(teamId) {
    const now = /* @__PURE__ */ new Date();
    const [match] = await db.select().from(matches).where(and(eq(matches.teamId, teamId), gt(matches.matchDate, now))).orderBy(matches.matchDate).limit(1);
    return match ?? void 0;
  }
  async getLastMatchWithRatings(teamId) {
    const [lastMatch] = await db.select().from(matches).where(and(eq(matches.teamId, teamId), eq(matches.status, "COMPLETED"))).orderBy(desc(matches.matchDate)).limit(1);
    if (!lastMatch || lastMatch.teamScore === null || lastMatch.opponentScore === null) return null;
    const mpList = await db.select({
      playerId: matchPlayers.playerId,
      rating: matchPlayers.sofascoreRating,
      minutes: matchPlayers.minutesPlayed,
      wasStarter: matchPlayers.wasStarter,
      name: players.name,
      shirtNumber: players.shirtNumber
    }).from(matchPlayers).innerJoin(players, eq(matchPlayers.playerId, players.id)).where(eq(matchPlayers.matchId, lastMatch.id));
    const sorted = mpList.filter((m) => m.rating != null).sort((a, b) => {
      if (a.wasStarter && !b.wasStarter) return -1;
      if (!a.wasStarter && b.wasStarter) return 1;
      const minA = a.minutes ?? 0;
      const minB = b.minutes ?? 0;
      if (minB !== minA) return minB - minA;
      return (b.rating ?? 0) - (a.rating ?? 0);
    });
    return {
      match: {
        id: lastMatch.id,
        opponent: lastMatch.opponent,
        opponentLogoUrl: lastMatch.opponentLogoUrl ?? null,
        matchDate: lastMatch.matchDate,
        teamScore: lastMatch.teamScore,
        opponentScore: lastMatch.opponentScore,
        isHomeMatch: lastMatch.isHomeMatch,
        competition: lastMatch.competition ?? null,
        championshipRound: lastMatch.championshipRound ?? null,
        status: lastMatch.status,
        isMock: lastMatch.isMock ?? false
      },
      players: sorted.map((p) => ({
        playerId: p.playerId,
        name: p.name,
        shirtNumber: p.shirtNumber,
        rating: p.rating,
        minutes: p.minutes
      }))
    };
  }
  // Fixtures (Jogos do Meu Time) — inclui teamRating quando disponível
  async getFixturesByTeam(teamId, options) {
    const limit = options?.limit ?? 20;
    const now = /* @__PURE__ */ new Date();
    const conditions = [eq(fixtures.teamId, teamId)];
    if (options?.competitionId) conditions.push(eq(fixtures.competitionId, options.competitionId));
    if (options?.season) conditions.push(eq(fixtures.season, options.season));
    const selectWithRating = {
      fixture: fixtures,
      competitionName: competitions.name,
      competitionLogoUrl: competitions.logoUrl,
      teamRating: teamMatchRatings.rating
    };
    if (options?.type === "upcoming") {
      const rows2 = await db.select(selectWithRating).from(fixtures).innerJoin(competitions, eq(fixtures.competitionId, competitions.id)).leftJoin(
        teamMatchRatings,
        and(eq(teamMatchRatings.fixtureId, fixtures.id), eq(teamMatchRatings.teamId, teamId))
      ).where(and(...conditions, gt(fixtures.kickoffAt, now))).orderBy(fixtures.kickoffAt).limit(limit);
      return rows2.map((r) => ({
        ...r.fixture,
        competition: { name: r.competitionName, logoUrl: r.competitionLogoUrl ?? null },
        teamRating: r.teamRating != null ? Number(r.teamRating) : null
      }));
    }
    if (options?.type === "recent") {
      const rows2 = await db.select(selectWithRating).from(fixtures).innerJoin(competitions, eq(fixtures.competitionId, competitions.id)).leftJoin(
        teamMatchRatings,
        and(eq(teamMatchRatings.fixtureId, fixtures.id), eq(teamMatchRatings.teamId, teamId))
      ).where(and(...conditions, lt(fixtures.kickoffAt, now))).orderBy(desc(fixtures.kickoffAt)).limit(limit);
      return rows2.map((r) => ({
        ...r.fixture,
        competition: { name: r.competitionName, logoUrl: r.competitionLogoUrl ?? null },
        teamRating: r.teamRating != null ? Number(r.teamRating) : null
      }));
    }
    const rows = await db.select(selectWithRating).from(fixtures).innerJoin(competitions, eq(fixtures.competitionId, competitions.id)).leftJoin(
      teamMatchRatings,
      and(eq(teamMatchRatings.fixtureId, fixtures.id), eq(teamMatchRatings.teamId, teamId))
    ).where(and(...conditions)).orderBy(
      sql2`(${fixtures.kickoffAt} > now()) desc`,
      sql2`case when ${fixtures.kickoffAt} > now() then ${fixtures.kickoffAt} end asc nulls last`,
      sql2`case when ${fixtures.kickoffAt} <= now() then ${fixtures.kickoffAt} end desc nulls first`
    ).limit(limit);
    return rows.map((r) => ({
      ...r.fixture,
      competition: { name: r.competitionName, logoUrl: r.competitionLogoUrl ?? null },
      teamRating: r.teamRating != null ? Number(r.teamRating) : null
    }));
  }
  async getFixtureById(id) {
    const [row] = await db.select().from(fixtures).innerJoin(competitions, eq(fixtures.competitionId, competitions.id)).where(eq(fixtures.id, id)).limit(1);
    if (!row) return void 0;
    const { competitions: comp, ...fix } = row;
    return { ...fix, competition: comp };
  }
  async createFixture(insertFixture) {
    const [f] = await db.insert(fixtures).values(insertFixture).returning();
    return f;
  }
  async updateFixture(id, data) {
    const [updated] = await db.update(fixtures).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(fixtures.id, id)).returning();
    return updated ?? void 0;
  }
  async getMatchLineup(matchId) {
    const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
    if (!match) return null;
    const mpList = await db.select({
      playerId: matchPlayers.playerId,
      wasStarter: matchPlayers.wasStarter,
      minutesPlayed: matchPlayers.minutesPlayed,
      name: players.name,
      shirtNumber: players.shirtNumber,
      position: players.position
    }).from(matchPlayers).innerJoin(players, eq(matchPlayers.playerId, players.id)).where(eq(matchPlayers.matchId, matchId));
    const starters = mpList.filter((m) => m.wasStarter).sort((a, b) => {
      const orderA = positionOrderForLineup(a.position);
      const orderB = positionOrderForLineup(b.position);
      if (orderA !== orderB) return orderA - orderB;
      return (a.shirtNumber ?? 99) - (b.shirtNumber ?? 99);
    }).map((p) => ({
      playerId: p.playerId,
      name: p.name,
      shirtNumber: p.shirtNumber,
      position: p.position,
      minutesPlayed: p.minutesPlayed
    }));
    const substitutes = mpList.filter((m) => !m.wasStarter).sort((a, b) => (b.minutesPlayed ?? 0) - (a.minutesPlayed ?? 0)).map((p) => ({
      playerId: p.playerId,
      name: p.name,
      shirtNumber: p.shirtNumber,
      position: p.position,
      minutesPlayed: p.minutesPlayed,
      minuteEntered: p.minutesPlayed != null ? 90 - p.minutesPlayed : null
    }));
    let finalStarters = starters;
    if (starters.length === 0) {
      const roster = await db.select({ playerId: players.id, name: players.name, shirtNumber: players.shirtNumber, position: players.position }).from(players).where(eq(players.teamId, match.teamId));
      finalStarters = roster.sort((a, b) => {
        const orderA = positionOrderForLineup(a.position);
        const orderB = positionOrderForLineup(b.position);
        if (orderA !== orderB) return orderA - orderB;
        return (a.shirtNumber ?? 99) - (b.shirtNumber ?? 99);
      }).slice(0, 11).map((p) => ({
        playerId: p.playerId,
        name: p.name,
        shirtNumber: p.shirtNumber,
        position: p.position,
        minutesPlayed: null
      }));
      if (process.env.NODE_ENV !== "production") {
        console.debug("[getMatchLineup] fallback demo lineup", { matchId, startersCount: finalStarters.length });
      }
    } else if (process.env.NODE_ENV !== "production") {
      console.debug("[getMatchLineup]", { matchId, startersCount: starters.length, subsCount: substitutes.length });
    }
    return {
      matchId,
      formation: "4-2-3-1",
      starters: finalStarters,
      substitutes
    };
  }
  async createMatch(insertMatch) {
    const matchData = {
      ...insertMatch,
      status: insertMatch.teamScore !== null && insertMatch.opponentScore !== null ? "COMPLETED" : insertMatch.status || "SCHEDULED"
    };
    const [match] = await db.insert(matches).values(matchData).returning();
    if (match.status === "COMPLETED") {
      await this.updateTeamStandings();
    }
    return match;
  }
  async updateTeamStandings() {
    const allTeams = await this.getAllTeams();
    const completedMatches = await db.select().from(matches).where(eq(matches.status, "COMPLETED"));
    const teamStats = {};
    for (const team of allTeams) {
      teamStats[team.id] = { points: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 };
    }
    for (const match of completedMatches) {
      if (match.teamScore === null || match.opponentScore === null) continue;
      const teamId = match.teamId;
      if (!teamStats[teamId]) continue;
      teamStats[teamId].goalsFor += match.teamScore;
      teamStats[teamId].goalsAgainst += match.opponentScore;
      if (match.teamScore > match.opponentScore) {
        teamStats[teamId].wins += 1;
        teamStats[teamId].points += 3;
      } else if (match.teamScore === match.opponentScore) {
        teamStats[teamId].draws += 1;
        teamStats[teamId].points += 1;
      } else {
        teamStats[teamId].losses += 1;
      }
    }
    const updatePromises = Object.entries(teamStats).map(
      ([teamId, stats]) => db.update(teams).set({
        ...stats,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(teams.id, teamId))
    );
    await Promise.all(updatePromises);
    const rankedTeams = allTeams.map((team) => ({
      id: team.id,
      points: teamStats[team.id]?.points || 0,
      wins: teamStats[team.id]?.wins || 0,
      goalsFor: teamStats[team.id]?.goalsFor || 0,
      goalsAgainst: teamStats[team.id]?.goalsAgainst || 0
    })).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      const goalDiffA = a.goalsFor - a.goalsAgainst;
      const goalDiffB = b.goalsFor - b.goalsAgainst;
      if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
      return b.goalsFor - a.goalsFor;
    });
    const positionPromises = rankedTeams.map(
      (team, i) => db.update(teams).set({
        currentPosition: i + 1,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(teams.id, team.id))
    );
    await Promise.all(positionPromises);
  }
  // News
  async getAllNews(options) {
    const teamId = options?.teamId;
    const limit = options?.limit ?? 50;
    const scope = options?.scope;
    const userTeamId = options?.userTeamId;
    const conditions = [eq(news.isPublished, true)];
    if (scope === "team") {
      conditions.push(eq(news.scope, "TEAM"));
      if (userTeamId) conditions.push(eq(news.teamId, userTeamId));
    } else if (scope === "europe") {
      conditions.push(eq(news.scope, "EUROPE"));
    } else if (scope !== "all") {
      if (teamId) conditions.push(eq(news.teamId, teamId));
    }
    const rows = await db.select({
      id: news.id,
      journalistId: news.journalistId,
      teamId: news.teamId,
      scope: news.scope,
      title: news.title,
      content: news.content,
      imageUrl: news.imageUrl,
      category: news.category,
      likesCount: news.likesCount,
      dislikesCount: news.dislikesCount,
      publishedAt: news.publishedAt,
      createdAt: news.createdAt,
      team: teams,
      journalistUserName: users.name
    }).from(news).leftJoin(teams, eq(news.teamId, teams.id)).innerJoin(journalists, eq(news.journalistId, journalists.id)).innerJoin(users, eq(journalists.userId, users.id)).where(and(...conditions)).orderBy(desc(news.createdAt)).limit(limit);
    return rows.map(({ journalistUserName, ...r }) => ({
      ...r,
      team: r.team ?? null,
      journalist: {
        id: r.journalistId,
        user: { name: journalistUserName }
      }
    }));
  }
  async getNewsById(id) {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem || void 0;
  }
  async getNewsByJournalist(journalistId) {
    return await db.select().from(news).where(eq(news.journalistId, journalistId)).orderBy(desc(news.publishedAt));
  }
  async createNews(insertNews) {
    const [newsItem] = await db.insert(news).values({ ...insertNews, isPublished: true, publishedAt: /* @__PURE__ */ new Date() }).returning();
    return newsItem;
  }
  async updateNews(id, data) {
    const [newsItem] = await db.update(news).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(news.id, id)).returning();
    return newsItem || void 0;
  }
  async deleteNews(id) {
    await db.delete(news).where(eq(news.id, id));
  }
  // News Interactions
  async getUserNewsInteraction(userId, newsId) {
    const [interaction] = await db.select().from(newsInteractions).where(
      and(
        eq(newsInteractions.userId, userId),
        eq(newsInteractions.newsId, newsId)
      )
    );
    return interaction || void 0;
  }
  async createNewsInteraction(insertInteraction) {
    const [interaction] = await db.insert(newsInteractions).values(insertInteraction).returning();
    return interaction;
  }
  async deleteNewsInteraction(userId, newsId) {
    await db.delete(newsInteractions).where(
      and(
        eq(newsInteractions.userId, userId),
        eq(newsInteractions.newsId, newsId)
      )
    );
  }
  async recalculateNewsCounts(newsId) {
    const interactions = await db.select().from(newsInteractions).where(eq(newsInteractions.newsId, newsId));
    const likesCount = interactions.filter((i) => i.interactionType === "LIKE").length;
    const dislikesCount = interactions.filter((i) => i.interactionType === "DISLIKE").length;
    await db.update(news).set({
      likesCount,
      dislikesCount,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(news.id, newsId));
  }
  // Comments (on news)
  async getComment(commentId) {
    const [c] = await db.select().from(comments).where(eq(comments.id, commentId)).limit(1);
    return c ?? void 0;
  }
  async createComment(params) {
    const inserted = await db.insert(comments).values({
      newsId: params.newsId,
      userId: params.userId,
      content: params.content.trim(),
      isApproved: true
    }).returning();
    const comment = inserted[0];
    if (!comment) {
      throw new Error("createComment: insert returned no row");
    }
    return comment;
  }
  async listCommentsByNewsId(newsId, viewerUserId) {
    const commentRows = await db.select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      authorName: users.name,
      authorAvatarUrl: users.avatarUrl
    }).from(comments).innerJoin(users, eq(comments.userId, users.id)).where(eq(comments.newsId, newsId)).orderBy(desc(comments.createdAt));
    const commentIds = commentRows.map((r) => r.id);
    const likeCounts = commentIds.length === 0 ? [] : await db.select({
      commentId: commentLikes.commentId,
      count: sql2`count(*)::int`
    }).from(commentLikes).where(inArray(commentLikes.commentId, commentIds)).groupBy(commentLikes.commentId);
    const countByCommentId = new Map(likeCounts.map((r) => [r.commentId, r.count]));
    let viewerLikedCommentIds = /* @__PURE__ */ new Set();
    if (viewerUserId) {
      const viewerLikes = await db.select({ commentId: commentLikes.commentId }).from(commentLikes).where(eq(commentLikes.userId, viewerUserId));
      viewerLikedCommentIds = new Set(viewerLikes.map((r) => r.commentId));
    }
    return commentRows.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt,
      author: { name: r.authorName, avatarUrl: r.authorAvatarUrl ?? null },
      likeCount: countByCommentId.get(r.id) ?? 0,
      viewerHasLiked: viewerLikedCommentIds.has(r.id)
    }));
  }
  async hasCommentLike(commentId, userId) {
    const [row] = await db.select().from(commentLikes).where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId))).limit(1);
    return !!row;
  }
  async addCommentLike(commentId, userId) {
    await db.insert(commentLikes).values({ commentId, userId }).onConflictDoNothing({ target: [commentLikes.commentId, commentLikes.userId] });
  }
  async removeCommentLike(commentId, userId) {
    await db.delete(commentLikes).where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)));
  }
  // Player Ratings
  async createPlayerRating(insertRating) {
    const [rating] = await db.insert(playerRatings).values(insertRating).returning();
    return rating;
  }
  async upsertPlayerRating(userId, playerId, matchId, rating, comment) {
    const existing = await db.select().from(playerRatings).where(
      and(
        eq(playerRatings.userId, userId),
        eq(playerRatings.playerId, playerId),
        eq(playerRatings.matchId, matchId)
      )
    ).limit(1);
    if (existing.length > 0) {
      const [updated] = await db.update(playerRatings).set({ rating, comment: comment ?? existing[0].comment, updatedAt: /* @__PURE__ */ new Date() }).where(eq(playerRatings.id, existing[0].id)).returning();
      return updated;
    }
    const [created] = await db.insert(playerRatings).values({ userId, playerId, matchId, rating, comment: comment ?? null }).returning();
    return created;
  }
  async getRatingsByMatch(matchId) {
    const rows = await db.select({
      playerId: playerRatings.playerId,
      average: sql2`round(avg(${playerRatings.rating})::numeric, 2)`,
      count: sql2`count(*)::int`
    }).from(playerRatings).where(eq(playerRatings.matchId, matchId)).groupBy(playerRatings.playerId);
    return rows.map((r) => ({ playerId: r.playerId, average: Number(r.average), count: Number(r.count) }));
  }
  async getUserRatingsForMatch(userId, matchId) {
    const rows = await db.select({ playerId: playerRatings.playerId, rating: playerRatings.rating, comment: playerRatings.comment }).from(playerRatings).where(and(eq(playerRatings.userId, userId), eq(playerRatings.matchId, matchId)));
    return rows.map((r) => ({ playerId: r.playerId, rating: r.rating, comment: r.comment }));
  }
  /** Returns existing rating if user already rated this player in this match; null otherwise. */
  async getUserRatingForPlayerInMatch(userId, matchId, playerId) {
    const [row] = await db.select({ rating: playerRatings.rating }).from(playerRatings).where(
      and(
        eq(playerRatings.userId, userId),
        eq(playerRatings.matchId, matchId),
        eq(playerRatings.playerId, playerId)
      )
    ).limit(1);
    return row ?? null;
  }
  async getPlayerRatings(playerId) {
    return await db.select().from(playerRatings).where(eq(playerRatings.playerId, playerId)).orderBy(desc(playerRatings.createdAt));
  }
  async getPlayerAverageRating(playerId) {
    const ratings = await this.getPlayerRatings(playerId);
    if (ratings.length === 0) return null;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / ratings.length;
  }
  // Admin
  async searchUsersForAdmin(q, limit = 10) {
    const term = `%${q.trim()}%`;
    if (!term || term === "%%") return [];
    const rows = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      status: journalists.status
    }).from(users).leftJoin(journalists, eq(journalists.userId, users.id)).where(or(ilike(users.email, term), ilike(users.name, term))).limit(limit);
    return rows.map((r) => ({
      id: r.id,
      email: r.email,
      name: r.name,
      journalistStatus: r.status ?? null,
      isJournalist: r.status === "APPROVED"
    }));
  }
  // Badges
  async getAllBadges() {
    return await db.select().from(badges);
  }
  async getUserBadges(userId) {
    const result = await db.select({
      id: userBadges.id,
      earnedAt: userBadges.earnedAt,
      badge: badges
    }).from(userBadges).innerJoin(badges, eq(userBadges.badgeId, badges.id)).where(eq(userBadges.userId, userId));
    return result;
  }
  async awardBadge(userId, badgeId) {
    const existing = await db.select().from(userBadges).where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badgeId))).limit(1);
    if (existing.length > 0) {
      return existing[0];
    }
    const [userBadge] = await db.insert(userBadges).values({ userId, badgeId }).returning();
    return userBadge;
  }
  async checkAndAwardBadges(userId) {
    const awarded = [];
    const allBadges = await this.getAllBadges();
    const userBadgesList = await this.getUserBadges(userId);
    const earnedBadgeIds = new Set(userBadgesList.map((ub) => ub.badge.id));
    const ratingsCount = await db.select().from(playerRatings).where(eq(playerRatings.userId, userId));
    const interactionsCount = await db.select().from(newsInteractions).where(eq(newsInteractions.userId, userId));
    for (const badge of allBadges) {
      if (earnedBadgeIds.has(badge.id)) continue;
      let shouldAward = false;
      if (badge.condition === "signup") {
        shouldAward = true;
      } else if (badge.condition === "player_ratings") {
        shouldAward = ratingsCount.length >= badge.threshold;
      } else if (badge.condition === "news_interactions") {
        shouldAward = interactionsCount.length >= badge.threshold;
      }
      if (shouldAward) {
        const userBadge = await this.awardBadge(userId, badge.id);
        awarded.push(userBadge);
        await this.createNotification({
          userId,
          type: "BADGE_EARNED",
          title: "Nova conquista desbloqueada!",
          message: `Voc\xEA ganhou o badge "${badge.name}": ${badge.description}`,
          referenceId: badge.id,
          isRead: false
        });
      }
    }
    return awarded;
  }
  // Notifications
  async createNotification(notification) {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    Promise.resolve().then(() => (init_websocket(), websocket_exports)).then(({ publishNotification: publishNotification2 }) => {
      publishNotification2(newNotification);
    }).catch((err) => {
      console.error("Failed to publish notification via WebSocket:", err);
    });
    return newNotification;
  }
  async getUserNotifications(userId, limit = 50) {
    const rows = await db.select({
      id: notifications.id,
      type: notifications.type,
      title: notifications.title,
      message: notifications.message,
      referenceId: notifications.referenceId,
      isRead: notifications.isRead,
      createdAt: notifications.createdAt,
      actorId: notifications.actorId,
      actorName: users.name,
      actorHandle: users.handle,
      actorAvatarUrl: users.avatarUrl,
      actorUserType: users.userType
    }).from(notifications).leftJoin(users, eq(notifications.actorId, users.id)).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
    return rows.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      message: r.message,
      referenceId: r.referenceId ?? null,
      isRead: r.isRead,
      createdAt: r.createdAt,
      actor: r.actorId ? {
        id: r.actorId,
        name: r.actorName ?? "",
        handle: r.actorHandle ?? "",
        avatarUrl: r.actorAvatarUrl ?? null,
        userType: r.actorUserType ?? "FAN"
      } : null
    }));
  }
  async createSocialNotification({
    recipientId,
    actorId,
    type,
    title,
    message,
    referenceId
  }) {
    if (recipientId === actorId) return;
    if (type === "LIKE" || type === "FOLLOW") {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1e3);
      const conditions = [
        eq(notifications.userId, recipientId),
        eq(notifications.actorId, actorId),
        eq(notifications.type, type),
        sql2`${notifications.createdAt} > ${fiveMinutesAgo}`
      ];
      if (referenceId) {
        conditions.push(eq(notifications.referenceId, referenceId));
      }
      const existing = await db.select({ id: notifications.id }).from(notifications).where(and(...conditions)).limit(1);
      if (existing.length > 0) return;
    }
    await this.createNotification({
      userId: recipientId,
      actorId,
      type,
      title,
      message,
      referenceId,
      isRead: false
    });
  }
  async markNotificationAsRead(userId, notificationId) {
    const updated = await db.update(notifications).set({ isRead: true }).where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId))).returning({ id: notifications.id });
    return updated.length > 0;
  }
  async markAllNotificationsAsRead(userId) {
    await db.update(notifications).set({ isRead: true }).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  }
  async getUnreadNotificationCount(userId) {
    const result = await db.select().from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return result.length;
  }
  // User Lineups
  async getUserLineup(userId, teamId) {
    const [row] = await db.select().from(userLineups).where(and(eq(userLineups.userId, userId), eq(userLineups.teamId, teamId))).limit(1);
    return row || void 0;
  }
  async upsertUserLineup(userId, teamId, formation, slots) {
    const now = /* @__PURE__ */ new Date();
    const [existing] = await db.select().from(userLineups).where(and(eq(userLineups.userId, userId), eq(userLineups.teamId, teamId))).limit(1);
    const payload = { formation, slots, updatedAt: now };
    if (existing) {
      const [updated] = await db.update(userLineups).set(payload).where(eq(userLineups.id, existing.id)).returning();
      return updated;
    }
    const [inserted] = await db.insert(userLineups).values({ userId, teamId, formation, slots }).returning();
    return inserted;
  }
  // Transfers (Vai e Vem)
  async getTransfers(filters) {
    const conditions = [];
    if (filters.status && ["RUMOR", "NEGOCIACAO", "FECHADO"].includes(filters.status)) {
      conditions.push(eq(transfers.status, filters.status));
    }
    if (filters.q && filters.q.trim()) {
      conditions.push(ilike(transfers.playerName, `%${filters.q.trim()}%`));
    }
    if (filters.teamId && filters.teamId.trim()) {
      conditions.push(
        or(
          eq(transfers.fromTeamId, filters.teamId.trim()),
          eq(transfers.toTeamId, filters.teamId.trim())
        )
      );
    }
    const result = await db.select({
      id: transfers.id,
      playerName: transfers.playerName,
      playerPhotoUrl: transfers.playerPhotoUrl,
      positionAbbrev: transfers.positionAbbrev,
      fromTeamId: transfers.fromTeamId,
      toTeamId: transfers.toTeamId,
      status: transfers.status,
      createdByJournalistId: transfers.createdByJournalistId,
      updatedAt: transfers.updatedAt,
      feeText: transfers.feeText,
      notes: transfers.notes
    }).from(transfers).where(conditions.length > 0 ? and(...conditions) : void 0).orderBy(desc(transfers.updatedAt)).limit(100);
    const allTeamIds = /* @__PURE__ */ new Set();
    const journalistIds = /* @__PURE__ */ new Set();
    for (const r of result) {
      if (r.fromTeamId) allTeamIds.add(r.fromTeamId);
      if (r.toTeamId) allTeamIds.add(r.toTeamId);
      if (r.createdByJournalistId) journalistIds.add(r.createdByJournalistId);
    }
    const teamList = allTeamIds.size > 0 ? await db.select().from(teams).where(inArray(teams.id, Array.from(allTeamIds))) : [];
    const teamMap = new Map(teamList.map((t) => [t.id, { id: t.id, name: t.name, shortName: t.shortName, slug: t.id }]));
    let authorMap = /* @__PURE__ */ new Map();
    if (journalistIds.size > 0) {
      const authorRows = await db.select({
        journalistId: journalists.id,
        name: users.name,
        avatarUrl: users.avatarUrl
      }).from(journalists).innerJoin(users, eq(journalists.userId, users.id)).where(inArray(journalists.id, Array.from(journalistIds)));
      for (const a of authorRows) {
        authorMap.set(a.journalistId, {
          id: a.journalistId,
          name: a.name,
          avatarUrl: a.avatarUrl ?? null,
          badge: "Jornalista"
        });
      }
    }
    const transferIds = result.map((r) => r.id);
    const voteCounts = transferIds.length > 0 ? await db.select({
      transferId: transferVotes.transferId,
      side: transferVotes.side,
      vote: transferVotes.vote,
      count: sql2`count(*)::int`
    }).from(transferVotes).where(inArray(transferVotes.transferId, transferIds)).groupBy(transferVotes.transferId, transferVotes.side, transferVotes.vote) : [];
    const voteMap = /* @__PURE__ */ new Map();
    for (const id of transferIds) {
      voteMap.set(id, {
        selling: { likes: 0, dislikes: 0 },
        buying: { likes: 0, dislikes: 0 }
      });
    }
    for (const v of voteCounts) {
      const m = voteMap.get(v.transferId);
      const sideKey = v.side === "SELLING" ? "selling" : "buying";
      if (v.vote === "LIKE") m[sideKey].likes = v.count;
      else m[sideKey].dislikes = v.count;
    }
    let viewerVotesMap = /* @__PURE__ */ new Map();
    if (filters.viewerUserId && transferIds.length > 0) {
      const viewerVotes = await db.select({ transferId: transferVotes.transferId, side: transferVotes.side, vote: transferVotes.vote }).from(transferVotes).where(
        and(
          eq(transferVotes.userId, filters.viewerUserId),
          inArray(transferVotes.transferId, transferIds)
        )
      );
      for (const id of transferIds) {
        viewerVotesMap.set(id, { selling: null, buying: null });
      }
      for (const v of viewerVotes) {
        const entry = viewerVotesMap.get(v.transferId);
        if (v.side === "SELLING") entry.selling = v.vote;
        else entry.buying = v.vote;
      }
    }
    return result.map((r) => {
      const votes = voteMap.get(r.id);
      const viewerVotes = viewerVotesMap.get(r.id) ?? { selling: null, buying: null };
      const fromTeam = r.fromTeamId ? teamMap.get(r.fromTeamId) : null;
      const toTeam = r.toTeamId ? teamMap.get(r.toTeamId) : null;
      const author = r.createdByJournalistId ? authorMap.get(r.createdByJournalistId) ?? null : null;
      return {
        id: r.id,
        playerName: r.playerName,
        playerPhotoUrl: r.playerPhotoUrl,
        positionAbbrev: r.positionAbbrev,
        fromTeam: fromTeam ?? null,
        toTeam: toTeam ?? null,
        status: r.status,
        updatedAt: r.updatedAt,
        feeText: r.feeText,
        notes: r.notes,
        author,
        selling: {
          likes: votes.selling.likes,
          dislikes: votes.selling.dislikes,
          userVote: viewerVotes.selling
        },
        buying: {
          likes: votes.buying.likes,
          dislikes: votes.buying.dislikes,
          userVote: viewerVotes.buying
        }
      };
    });
  }
  async getTransferById(id) {
    const [row] = await db.select().from(transfers).where(eq(transfers.id, id)).limit(1);
    return row ?? void 0;
  }
  async createTransfer(insertTransfer) {
    const [t] = await db.insert(transfers).values(insertTransfer).returning();
    return t;
  }
  async upsertTransferVote(transferId, userId, side, vote) {
    if (vote === "CLEAR") {
      await db.delete(transferVotes).where(
        and(
          eq(transferVotes.transferId, transferId),
          eq(transferVotes.userId, userId),
          eq(transferVotes.side, side)
        )
      );
    } else {
      await db.insert(transferVotes).values({ transferId, userId, side, vote }).onConflictDoUpdate({
        target: [transferVotes.transferId, transferVotes.userId, transferVotes.side],
        set: { vote }
      });
    }
    const counts = await db.select({
      side: transferVotes.side,
      vote: transferVotes.vote,
      count: sql2`count(*)::int`
    }).from(transferVotes).where(eq(transferVotes.transferId, transferId)).groupBy(transferVotes.side, transferVotes.vote);
    const selling = { likes: 0, dislikes: 0 };
    const buying = { likes: 0, dislikes: 0 };
    for (const c of counts) {
      const target = c.side === "SELLING" ? selling : buying;
      if (c.vote === "LIKE") target.likes = c.count;
      else target.dislikes = c.count;
    }
    const viewerVotes = await db.select({ side: transferVotes.side, vote: transferVotes.vote }).from(transferVotes).where(and(eq(transferVotes.transferId, transferId), eq(transferVotes.userId, userId)));
    let userVoteSelling = null;
    let userVoteBuying = null;
    for (const v of viewerVotes) {
      if (v.side === "SELLING") userVoteSelling = v.vote;
      else userVoteBuying = v.vote;
    }
    return {
      selling,
      buying,
      userVoteSelling,
      userVoteBuying
    };
  }
  // Transfer Rumors (Vai e Vem - schema transfer_rumors)
  async getTransferRumors(filters) {
    const conditions = [];
    if (filters.status && ["RUMOR", "NEGOTIATING", "DONE", "CANCELLED"].includes(filters.status)) {
      conditions.push(eq(transferRumors.status, filters.status));
    } else if (!filters.createdByUserId) {
      conditions.push(inArray(transferRumors.status, ["RUMOR", "NEGOTIATING", "DONE"]));
    }
    if (filters.q && filters.q.trim()) {
      conditions.push(ilike(players.name, `%${filters.q.trim()}%`));
    }
    if (filters.teamId && filters.teamId.trim()) {
      conditions.push(
        or(
          eq(transferRumors.fromTeamId, filters.teamId.trim()),
          eq(transferRumors.toTeamId, filters.teamId.trim())
        )
      );
    }
    if (filters.createdByUserId && filters.createdByUserId.trim()) {
      conditions.push(eq(transferRumors.createdByUserId, filters.createdByUserId.trim()));
    }
    const result = await db.select({
      id: transferRumors.id,
      playerId: transferRumors.playerId,
      fromTeamId: transferRumors.fromTeamId,
      toTeamId: transferRumors.toTeamId,
      status: transferRumors.status,
      feeAmount: transferRumors.feeAmount,
      feeCurrency: transferRumors.feeCurrency,
      contractUntil: transferRumors.contractUntil,
      sourceUrl: transferRumors.sourceUrl,
      sourceName: transferRumors.sourceName,
      note: transferRumors.note,
      createdByUserId: transferRumors.createdByUserId,
      createdAt: transferRumors.createdAt,
      updatedAt: transferRumors.updatedAt,
      playerName: players.name,
      playerPhotoUrl: players.photoUrl,
      playerPosition: players.position
    }).from(transferRumors).innerJoin(players, eq(transferRumors.playerId, players.id)).where(and(...conditions)).orderBy(desc(transferRumors.createdAt)).limit(filters.limit ?? 100).offset(filters.offset ?? 0);
    const allTeamIds = /* @__PURE__ */ new Set();
    const authorIds = /* @__PURE__ */ new Set();
    for (const r of result) {
      allTeamIds.add(r.fromTeamId);
      allTeamIds.add(r.toTeamId);
      authorIds.add(r.createdByUserId);
    }
    const teamList = allTeamIds.size > 0 ? await db.select().from(teams).where(inArray(teams.id, Array.from(allTeamIds))) : [];
    const teamMap = new Map(teamList.map((t) => [t.id, { id: t.id, name: t.name, shortName: t.shortName, slug: t.id, logoUrl: t.logoUrl ?? null }]));
    const authorRows = authorIds.size > 0 ? await db.select({ id: users.id, name: users.name, avatarUrl: users.avatarUrl }).from(users).where(inArray(users.id, Array.from(authorIds))) : [];
    const authorMap = new Map(authorRows.map((a) => [a.id, { id: a.id, name: a.name, avatarUrl: a.avatarUrl ?? null, badge: "Jornalista" }]));
    const rumorIds = result.map((r) => r.id);
    const voteCounts = rumorIds.length > 0 ? await db.select({
      rumorId: transferRumorVotes.rumorId,
      side: transferRumorVotes.side,
      vote: transferRumorVotes.vote,
      count: sql2`count(*)::int`
    }).from(transferRumorVotes).where(inArray(transferRumorVotes.rumorId, rumorIds)).groupBy(transferRumorVotes.rumorId, transferRumorVotes.side, transferRumorVotes.vote) : [];
    const voteMap = /* @__PURE__ */ new Map();
    for (const id of rumorIds) {
      voteMap.set(id, { selling: { likes: 0, dislikes: 0 }, buying: { likes: 0, dislikes: 0 } });
    }
    for (const v of voteCounts) {
      const m = voteMap.get(v.rumorId);
      const sideKey = v.side === "SELLING" ? "selling" : "buying";
      if (v.vote === "LIKE") m[sideKey].likes = v.count;
      else m[sideKey].dislikes = v.count;
    }
    let viewerVotesMap = /* @__PURE__ */ new Map();
    if (filters.viewerUserId && rumorIds.length > 0) {
      const viewerVotes = await db.select({ rumorId: transferRumorVotes.rumorId, side: transferRumorVotes.side, vote: transferRumorVotes.vote }).from(transferRumorVotes).where(
        and(
          eq(transferRumorVotes.userId, filters.viewerUserId),
          inArray(transferRumorVotes.rumorId, rumorIds)
        )
      );
      for (const id of rumorIds) {
        viewerVotesMap.set(id, { selling: null, buying: null });
      }
      for (const v of viewerVotes) {
        const entry = viewerVotesMap.get(v.rumorId);
        if (v.side === "SELLING") entry.selling = v.vote;
        else entry.buying = v.vote;
      }
    }
    return result.map((r) => {
      const votes = voteMap.get(r.id);
      const viewerVotes = viewerVotesMap.get(r.id) ?? { selling: null, buying: null };
      return {
        id: r.id,
        player: { id: r.playerId, name: r.playerName, photoUrl: r.playerPhotoUrl, position: r.playerPosition },
        fromTeam: teamMap.get(r.fromTeamId) ?? null,
        toTeam: teamMap.get(r.toTeamId) ?? null,
        status: r.status,
        feeAmount: r.feeAmount,
        feeCurrency: r.feeCurrency,
        sourceName: r.sourceName,
        sourceUrl: r.sourceUrl,
        note: r.note,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        author: authorMap.get(r.createdByUserId) ?? null,
        selling: { likes: votes.selling.likes, dislikes: votes.selling.dislikes, userVote: viewerVotes.selling },
        buying: { likes: votes.buying.likes, dislikes: votes.buying.dislikes, userVote: viewerVotes.buying }
      };
    });
  }
  async getTransferRumorById(id) {
    const [r] = await db.select({
      id: transferRumors.id,
      playerId: transferRumors.playerId,
      fromTeamId: transferRumors.fromTeamId,
      toTeamId: transferRumors.toTeamId,
      status: transferRumors.status,
      feeAmount: transferRumors.feeAmount,
      feeCurrency: transferRumors.feeCurrency,
      contractUntil: transferRumors.contractUntil,
      sourceUrl: transferRumors.sourceUrl,
      sourceName: transferRumors.sourceName,
      note: transferRumors.note,
      createdByUserId: transferRumors.createdByUserId,
      createdAt: transferRumors.createdAt,
      updatedAt: transferRumors.updatedAt,
      playerName: players.name,
      playerPhotoUrl: players.photoUrl,
      playerPosition: players.position
    }).from(transferRumors).innerJoin(players, eq(transferRumors.playerId, players.id)).where(eq(transferRumors.id, id)).limit(1);
    if (!r) return void 0;
    const [fromTeam, toTeam] = await Promise.all([
      db.select().from(teams).where(eq(teams.id, r.fromTeamId)).limit(1),
      db.select().from(teams).where(eq(teams.id, r.toTeamId)).limit(1)
    ]);
    const [author] = await db.select({ name: users.name, avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, r.createdByUserId)).limit(1);
    const voteCounts = await db.select({ side: transferRumorVotes.side, vote: transferRumorVotes.vote, count: sql2`count(*)::int` }).from(transferRumorVotes).where(eq(transferRumorVotes.rumorId, id)).groupBy(transferRumorVotes.side, transferRumorVotes.vote);
    const selling = { likes: 0, dislikes: 0 };
    const buying = { likes: 0, dislikes: 0 };
    for (const v of voteCounts) {
      const target = v.side === "SELLING" ? selling : buying;
      if (v.vote === "LIKE") target.likes = v.count;
      else target.dislikes = v.count;
    }
    return {
      id: r.id,
      createdByUserId: r.createdByUserId,
      player: { id: r.playerId, name: r.playerName, photoUrl: r.playerPhotoUrl, position: r.playerPosition },
      fromTeam: fromTeam[0] ? { id: fromTeam[0].id, name: fromTeam[0].name, shortName: fromTeam[0].shortName } : null,
      toTeam: toTeam[0] ? { id: toTeam[0].id, name: toTeam[0].name, shortName: toTeam[0].shortName } : null,
      status: r.status,
      feeAmount: r.feeAmount,
      feeCurrency: r.feeCurrency,
      sourceName: r.sourceName,
      sourceUrl: r.sourceUrl,
      note: r.note,
      createdAt: r.createdAt,
      author: author ? { id: r.createdByUserId, name: author.name, avatarUrl: author.avatarUrl ?? null, badge: "Jornalista" } : null,
      selling,
      buying
    };
  }
  async getTransferRumorsByAuthor(userId) {
    return this.getTransferRumors({
      createdByUserId: userId,
      viewerUserId: null
    });
  }
  async createTransferRumor(insert) {
    const [t] = await db.insert(transferRumors).values(insert).returning();
    return t;
  }
  async updateTransferRumor(id, data) {
    const [updated] = await db.update(transferRumors).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(transferRumors.id, id)).returning();
    return updated ?? void 0;
  }
  async deleteTransferRumor(id) {
    const deleted = await db.delete(transferRumors).where(eq(transferRumors.id, id)).returning({ id: transferRumors.id });
    return deleted.length > 0;
  }
  async upsertTransferRumorVote(rumorId, userId, side, vote) {
    if (vote === "CLEAR") {
      await db.delete(transferRumorVotes).where(and(eq(transferRumorVotes.rumorId, rumorId), eq(transferRumorVotes.userId, userId), eq(transferRumorVotes.side, side)));
    } else {
      await db.insert(transferRumorVotes).values({ rumorId, userId, side, vote }).onConflictDoUpdate({
        target: [transferRumorVotes.rumorId, transferRumorVotes.userId, transferRumorVotes.side],
        set: { vote }
      });
    }
    const counts = await db.select({
      side: transferRumorVotes.side,
      vote: transferRumorVotes.vote,
      count: sql2`count(*)::int`
    }).from(transferRumorVotes).where(eq(transferRumorVotes.rumorId, rumorId)).groupBy(transferRumorVotes.side, transferRumorVotes.vote);
    const selling = { likes: 0, dislikes: 0 };
    const buying = { likes: 0, dislikes: 0 };
    for (const c of counts) {
      const target = c.side === "SELLING" ? selling : buying;
      if (c.vote === "LIKE") target.likes = c.count;
      else target.dislikes = c.count;
    }
    const viewerVotes = await db.select({ side: transferRumorVotes.side, vote: transferRumorVotes.vote }).from(transferRumorVotes).where(and(eq(transferRumorVotes.rumorId, rumorId), eq(transferRumorVotes.userId, userId)));
    let userVoteSelling = null;
    let userVoteBuying = null;
    for (const v of viewerVotes) {
      if (v.side === "SELLING") userVoteSelling = v.vote;
      else userVoteBuying = v.vote;
    }
    return { selling, buying, userVoteSelling, userVoteBuying };
  }
  async listTransferRumorComments(rumorId) {
    const rows = await db.select({
      id: transferRumorComments.id,
      content: transferRumorComments.content,
      createdAt: transferRumorComments.createdAt,
      userName: users.name,
      userAvatarUrl: users.avatarUrl
    }).from(transferRumorComments).innerJoin(users, eq(transferRumorComments.userId, users.id)).where(and(eq(transferRumorComments.rumorId, rumorId), eq(transferRumorComments.isDeleted, false))).orderBy(desc(transferRumorComments.createdAt)).limit(100);
    return rows.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt,
      author: { name: r.userName, avatarUrl: r.userAvatarUrl ?? null }
    }));
  }
  async createTransferRumorComment(rumorId, userId, content) {
    const [c] = await db.insert(transferRumorComments).values({ rumorId, userId, content }).returning();
    return c;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
init_schema();
init_db();
import bcrypt from "bcrypt";
import fs2 from "fs";
import path2 from "path";
import multer from "multer";
import { randomBytes as randomBytes2 } from "crypto";
import { fileURLToPath as fileURLToPath2 } from "url";
import { eq as eq13, asc as asc2, ilike as ilike5, or as or7, and as and12, isNull, desc as desc9 } from "drizzle-orm";
import rateLimit from "express-rate-limit";
import { z as z2 } from "zod";

// server/services/avatarStorage.ts
import { randomBytes } from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var AVATARS_DIR = path.resolve(__dirname, "..", "uploads", "avatars");
var MAX_AVATAR_BYTES = 2 * 1024 * 1024;
var ALLOWED_AVATAR_MIME_TYPES = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/webp"]);
var MIME_TO_EXT = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};
function getSafeUniqueFilename(ext) {
  const safeExt = ext.startsWith(".") ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
  const ts = Date.now();
  const rnd = randomBytes(8).toString("hex");
  return `avatar_${ts}_${rnd}${safeExt}`;
}
function stripQueryAndHash(url) {
  return url.split("?")[0].split("#")[0];
}
async function saveAvatar(file) {
  const mime = String(file?.mimetype || "").toLowerCase();
  if (!ALLOWED_AVATAR_MIME_TYPES.has(mime)) {
    throw new Error("Tipo inv\xE1lido. Envie uma imagem (jpeg, png ou webp).");
  }
  const size = typeof file?.size === "number" ? file.size : file?.buffer?.length ?? 0;
  if (!Number.isFinite(size) || size <= 0) {
    throw new Error("Arquivo inv\xE1lido (vazio).");
  }
  if (size > MAX_AVATAR_BYTES) {
    throw new Error("Arquivo muito grande. Tamanho m\xE1ximo: 2MB.");
  }
  const ext = MIME_TO_EXT[mime];
  if (!ext) {
    throw new Error("Tipo inv\xE1lido. Envie uma imagem (jpeg, png ou webp).");
  }
  if (!file?.buffer || !(file.buffer instanceof Buffer)) {
    throw new Error("Arquivo inv\xE1lido (sem buffer).");
  }
  await fs.mkdir(AVATARS_DIR, { recursive: true });
  const filename = getSafeUniqueFilename(ext);
  const filePath = path.join(AVATARS_DIR, filename);
  await fs.writeFile(filePath, file.buffer);
  return {
    avatarUrl: `/uploads/avatars/${filename}`,
    filePath
  };
}
async function deleteAvatarByUrl(avatarUrl) {
  if (!avatarUrl) return;
  const cleaned = stripQueryAndHash(String(avatarUrl));
  const normalized = path.posix.normalize(cleaned);
  const prefix = "/uploads/avatars/";
  if (!normalized.startsWith(prefix)) return;
  const rel = normalized.slice(prefix.length);
  if (!rel || rel.includes("/")) return;
  await fs.mkdir(AVATARS_DIR, { recursive: true });
  const candidate = path.resolve(AVATARS_DIR, rel);
  const relative = path.relative(AVATARS_DIR, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return;
  try {
    await fs.unlink(candidate);
  } catch (err) {
    if (err?.code === "ENOENT") return;
    throw err;
  }
}

// server/route-handlers/feed.ts
init_db();
import { Router } from "express";
import { eq as eq2, and as and2, desc as desc2, sql as sql3, gt as gt2, lt as lt2, inArray as inArray2 } from "drizzle-orm";
init_schema();
function requireAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "N\xE3o autenticado" });
  }
  next();
}
function userToHandle(user) {
  const base = (user.name || "user").toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "").slice(0, 15);
  return base || `user_${(user.id || "").slice(0, 8)}`;
}
var router = Router();
router.get("/influencers", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 50);
    const offset = Math.max(parseInt(String(req.query.offset || 0), 10) || 0, 0);
    const teamFilter = String(req.query.teamFilter || "all");
    const viewerUserId = req.session?.userId ?? null;
    let viewerTeamId = null;
    if (viewerUserId) {
      const [viewer] = await db.select({ teamId: users.teamId }).from(users).where(eq2(users.id, viewerUserId)).limit(1);
      viewerTeamId = viewer?.teamId ?? null;
    }
    const conditions = [eq2(news.isPublished, true)];
    if (teamFilter === "mine" && viewerTeamId) {
      conditions.push(eq2(news.teamId, viewerTeamId));
    }
    const rows = await db.select({
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
      teamLogoUrl: teams.logoUrl
    }).from(news).innerJoin(journalists, eq2(news.journalistId, journalists.id)).innerJoin(users, eq2(journalists.userId, users.id)).leftJoin(teams, eq2(news.teamId, teams.id)).where(and2(...conditions)).orderBy(desc2(news.publishedAt)).limit(limit).offset(offset);
    const items = rows.map((r) => ({
      id: r.id,
      title: r.title,
      summary: (r.content || "").slice(0, 280),
      content: r.content,
      imageUrl: r.imageUrl ?? null,
      publishedAt: r.publishedAt,
      sourceUrl: null,
      journalist: {
        id: r.journalistId,
        name: r.journalistName || "Autor",
        avatarUrl: r.journalistAvatarUrl ?? null,
        handle: userToHandle({ name: r.journalistName || "Autor", id: r.journalistId }),
        verified: true
      },
      team: r.teamId ? { id: r.teamId, name: r.teamName ?? "Time", badgeUrl: r.teamLogoUrl ?? null } : null,
      engagement: {
        likes: r.likesCount ?? 0,
        reposts: 0,
        bookmarks: 0,
        views: 0,
        dislikes: r.dislikesCount ?? 0
      },
      userInteraction: null
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
    res.status(500).json({ message: "Erro ao carregar not\xEDcias" });
  }
});
router.get("/fan-posts", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 50);
    const offset = Math.max(parseInt(String(req.query.offset || 0), 10) || 0, 0);
    const viewerUserId = req.session?.userId ?? null;
    let viewerTeamId = null;
    if (viewerUserId) {
      const [viewer] = await db.select({ teamId: users.teamId }).from(users).where(eq2(users.id, viewerUserId)).limit(1);
      viewerTeamId = viewer?.teamId ?? null;
    }
    const conditions = [
      sql3`${posts.parentPostId} IS NULL`,
      eq2(users.userType, "FAN")
    ];
    if (viewerTeamId) {
      conditions.push(eq2(users.teamId, viewerTeamId));
    }
    const rows = await db.select({
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
      userTeamId: users.teamId
    }).from(posts).innerJoin(users, eq2(posts.userId, users.id)).where(and2(...conditions)).orderBy(desc2(posts.createdAt)).limit(limit).offset(offset);
    const postIds = rows.map((r) => r.id);
    let viewerLikedIds = /* @__PURE__ */ new Set();
    if (viewerUserId && postIds.length > 0) {
      const viewerLikes = await db.select({ postId: postLikes.postId }).from(postLikes).where(
        and2(
          eq2(postLikes.userId, viewerUserId),
          inArray2(postLikes.postId, postIds)
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
        name: r.userName || "Usu\xE1rio",
        handle: r.userHandle || r.userId.slice(0, 8),
        avatarUrl: r.userAvatarUrl ?? null
      },
      likes: r.likeCount,
      replies: r.replyCount,
      imageUrl: r.imageUrl ?? null,
      relatedNews: null,
      viewerHasLiked: viewerLikedIds.has(r.id)
    }));
    res.json(items);
  } catch (err) {
    console.error("[feed/fan-posts] error:", err);
    res.status(500).json({ message: "Erro ao carregar feed da torcida" });
  }
});
router.get("/torcida", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 50);
    const offset = Math.max(parseInt(String(req.query.offset || 0), 10) || 0, 0);
    const rows = await db.select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      newsId: comments.newsId,
      newsTitle: news.title,
      userId: users.id,
      userName: users.name,
      userAvatarUrl: users.avatarUrl
    }).from(comments).innerJoin(users, eq2(comments.userId, users.id)).innerJoin(news, eq2(comments.newsId, news.id)).where(eq2(comments.isApproved, true)).orderBy(desc2(comments.createdAt)).limit(limit).offset(offset);
    const commentIds = rows.map((r) => r.id);
    const likeCounts = commentIds.length === 0 ? [] : await db.select({
      commentId: commentLikes.commentId,
      count: sql3`count(*)::int`
    }).from(commentLikes).where(inArray2(commentLikes.commentId, commentIds)).groupBy(commentLikes.commentId);
    const countMap = new Map(likeCounts.map((r) => [r.commentId, r.count]));
    const viewerUserId = req.session?.userId ?? null;
    let viewerLikedIds = /* @__PURE__ */ new Set();
    if (viewerUserId && commentIds.length > 0) {
      const viewerLikes = await db.select({ commentId: commentLikes.commentId }).from(commentLikes).where(eq2(commentLikes.userId, viewerUserId));
      viewerLikedIds = new Set(viewerLikes.map((r) => r.commentId));
    }
    const items = rows.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt,
      user: {
        id: r.userId,
        name: r.userName || "An\xF4nimo",
        handle: userToHandle({ name: r.userName || "user", id: r.userId }),
        avatarUrl: r.userAvatarUrl ?? null
      },
      likes: countMap.get(r.id) ?? 0,
      replies: 0,
      relatedNews: r.newsId ? { id: r.newsId, title: r.newsTitle || "" } : null,
      viewerHasLiked: viewerLikedIds.has(r.id)
    }));
    res.json(items);
  } catch (err) {
    console.error("[feed/torcida] error:", err);
    res.status(500).json({ message: "Erro ao carregar coment\xE1rios" });
  }
});
router.get("/news/:id", async (req, res) => {
  try {
    const newsId = req.params.id?.trim();
    if (!newsId) return res.status(400).json({ message: "ID inv\xE1lido" });
    const [row] = await db.select({
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
      teamLogoUrl: teams.logoUrl
    }).from(news).innerJoin(journalists, eq2(news.journalistId, journalists.id)).innerJoin(users, eq2(journalists.userId, users.id)).leftJoin(teams, eq2(news.teamId, teams.id)).where(and2(eq2(news.id, newsId), eq2(news.isPublished, true)));
    if (!row) return res.status(404).json({ message: "Not\xEDcia n\xE3o encontrada" });
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
        handle: userToHandle({ name: row.journalistName || "Autor", id: row.journalistId })
      },
      team: row.teamId ? { id: row.teamId, name: row.teamName ?? "", badgeUrl: row.teamLogoUrl ?? null } : null
    });
  } catch (err) {
    console.error("[feed/news/:id] error:", err);
    res.status(500).json({ message: "Erro ao carregar not\xEDcia" });
  }
});
router.post("/news/:id/like", requireAuth, async (req, res) => {
  try {
    const newsId = req.params.id?.trim();
    if (!newsId) return res.status(400).json({ message: "ID inv\xE1lido" });
    const userId = req.session.userId;
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
      likesCount: newsItem?.likesCount ?? 0
    });
  } catch (err) {
    console.error("[feed/news/:id/like] error:", err);
    res.status(500).json({ message: "Erro ao curtir" });
  }
});
router.post("/news/:id/bookmark", requireAuth, async (req, res) => {
  const newsId = req.params.id?.trim();
  if (!newsId) return res.status(400).json({ message: "ID inv\xE1lido" });
  res.json({ bookmarked: true, message: "Salvo" });
});
router.get("/trending", async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1e3);
    const rows = await db.select({
      teamId: news.teamId,
      teamName: teams.name,
      count: sql3`count(*)::int`
    }).from(news).leftJoin(teams, eq2(news.teamId, teams.id)).where(and2(eq2(news.isPublished, true), gt2(news.publishedAt, since))).groupBy(news.teamId, teams.name).orderBy(desc2(sql3`count(*)`)).limit(5);
    const items = rows.filter((r) => r.teamName).map((r) => ({
      topic: r.teamName,
      category: "Futebol \xB7 Trending",
      posts: r.count
    }));
    res.json(items);
  } catch (err) {
    console.error("[feed/trending] error:", err);
    res.json([]);
  }
});
router.get("/upcoming-matches", async (req, res) => {
  try {
    const teamId = typeof req.query.teamId === "string" ? req.query.teamId.trim() : void 0;
    const now = /* @__PURE__ */ new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1e3);
    if (teamId) {
      const rows2 = await db.select({
        id: fixtures.id,
        kickoffAt: fixtures.kickoffAt,
        homeTeamName: fixtures.homeTeamName,
        awayTeamName: fixtures.awayTeamName,
        competitionName: competitions.name
      }).from(fixtures).innerJoin(competitions, eq2(fixtures.competitionId, competitions.id)).where(
        and2(
          eq2(fixtures.teamId, teamId),
          eq2(fixtures.status, "SCHEDULED"),
          gt2(fixtures.kickoffAt, now),
          lt2(fixtures.kickoffAt, weekLater)
        )
      ).orderBy(fixtures.kickoffAt).limit(3);
      return res.json(rows2);
    }
    const rows = await db.select({
      id: fixtures.id,
      kickoffAt: fixtures.kickoffAt,
      homeTeamName: fixtures.homeTeamName,
      awayTeamName: fixtures.awayTeamName,
      competitionName: competitions.name
    }).from(fixtures).innerJoin(competitions, eq2(fixtures.competitionId, competitions.id)).where(
      and2(
        eq2(fixtures.status, "SCHEDULED"),
        gt2(fixtures.kickoffAt, now),
        lt2(fixtures.kickoffAt, weekLater)
      )
    ).orderBy(fixtures.kickoffAt).limit(3);
    res.json(rows);
  } catch (err) {
    console.error("[feed/upcoming-matches] error:", err);
    res.json([]);
  }
});
var feedRouter = router;

// server/route-handlers/social.ts
init_db();
import { Router as Router2 } from "express";
import { eq as eq3, and as and3, desc as desc3, sql as sql4, inArray as inArray3, not, isNotNull } from "drizzle-orm";
init_schema();
init_schema();
function requireAuth2(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "N\xE3o autenticado" });
  }
  next();
}
var router2 = Router2();
function deriveUserRole(userType) {
  return userType === "JOURNALIST" ? "journalist" : "fan";
}
router2.get("/users/suggested", async (req, res) => {
  try {
    const viewerUserId = req.session?.userId ?? null;
    const limit = Math.min(parseInt(String(req.query.limit || 5), 10) || 5, 10);
    let alreadyFollowingIds = [];
    if (viewerUserId) {
      const followed = await db.select({ followingId: userFollows.followingId }).from(userFollows).where(eq3(userFollows.followerId, viewerUserId));
      alreadyFollowingIds = followed.map((f) => f.followingId);
    }
    const excludeIds = viewerUserId ? [viewerUserId, ...alreadyFollowingIds] : alreadyFollowingIds;
    const rows = await db.select({
      id: users.id,
      name: users.name,
      handle: users.handle,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      userType: users.userType,
      followersCount: users.followersCount
    }).from(users).where(
      and3(
        excludeIds.length > 0 ? not(inArray3(users.id, excludeIds)) : sql4`1=1`,
        isNotNull(users.handle)
      )
    ).orderBy(desc3(users.followersCount)).limit(limit);
    const suggestions = rows.map((u) => ({
      id: u.id,
      name: u.name,
      handle: u.handle ?? "",
      avatarUrl: u.avatarUrl ?? null,
      bio: u.bio ?? null,
      isFollowing: false,
      userType: u.userType,
      followersCount: u.followersCount
    }));
    res.json(suggestions);
  } catch (err) {
    console.error("[users/suggested] error:", err);
    res.status(500).json({ message: "Erro ao buscar sugest\xF5es" });
  }
});
router2.get("/users/:handle", async (req, res) => {
  try {
    const handle = req.params.handle?.trim();
    if (!handle) return res.status(400).json({ message: "Handle inv\xE1lido" });
    const [row] = await db.select({
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
      journalistStatus: journalists.status
    }).from(users).leftJoin(journalists, eq3(users.id, journalists.userId)).where(eq3(users.handle, handle)).limit(1);
    if (!row || !row.handle) return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
    const isVerifiedJournalist = row.userType === "JOURNALIST" && row.journalistStatus === "APPROVED";
    const viewerUserId = req.session?.userId ?? null;
    let isFollowing = false;
    if (viewerUserId && viewerUserId !== row.id) {
      const [follow] = await db.select().from(userFollows).where(
        and3(
          eq3(userFollows.followerId, viewerUserId),
          eq3(userFollows.followingId, row.id)
        )
      ).limit(1);
      isFollowing = !!follow;
    }
    const { journalistStatus: _js, ...rest } = row;
    const userRole = deriveUserRole(row.userType ?? null);
    res.json({
      ...rest,
      userRole,
      isVerifiedJournalist: !!isVerifiedJournalist,
      isFollowing
    });
  } catch (err) {
    console.error("[social] GET /users/:handle error:", err);
    res.status(500).json({ message: "Erro ao buscar perfil" });
  }
});
router2.get("/users/:handle/followers", async (req, res) => {
  try {
    const handle = req.params.handle?.trim();
    if (!handle) return res.status(400).json({ message: "Handle inv\xE1lido" });
    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 50);
    const offset = Math.max(parseInt(String(req.query.offset || 0), 10) || 0, 0);
    const [targetUser] = await db.select({ id: users.id }).from(users).where(eq3(users.handle, handle)).limit(1);
    if (!targetUser) return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
    const rows = await db.select({
      id: users.id,
      name: users.name,
      handle: users.handle,
      avatarUrl: users.avatarUrl,
      bio: users.bio
    }).from(userFollows).innerJoin(users, eq3(userFollows.followerId, users.id)).where(eq3(userFollows.followingId, targetUser.id)).orderBy(desc3(userFollows.createdAt)).limit(limit).offset(offset);
    const viewerUserId = req.session?.userId ?? null;
    const items = await Promise.all(
      rows.map(async (r) => {
        let isFollowing = false;
        if (viewerUserId && viewerUserId !== r.id) {
          const [f] = await db.select().from(userFollows).where(
            and3(
              eq3(userFollows.followerId, viewerUserId),
              eq3(userFollows.followingId, r.id)
            )
          ).limit(1);
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
router2.get("/users/:handle/following", async (req, res) => {
  try {
    const handle = req.params.handle?.trim();
    if (!handle) return res.status(400).json({ message: "Handle inv\xE1lido" });
    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 50);
    const offset = Math.max(parseInt(String(req.query.offset || 0), 10) || 0, 0);
    const [targetUser] = await db.select({ id: users.id }).from(users).where(eq3(users.handle, handle)).limit(1);
    if (!targetUser) return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
    const rows = await db.select({
      id: users.id,
      name: users.name,
      handle: users.handle,
      avatarUrl: users.avatarUrl,
      bio: users.bio
    }).from(userFollows).innerJoin(users, eq3(userFollows.followingId, users.id)).where(eq3(userFollows.followerId, targetUser.id)).orderBy(desc3(userFollows.createdAt)).limit(limit).offset(offset);
    const viewerUserId = req.session?.userId ?? null;
    const items = await Promise.all(
      rows.map(async (r) => {
        let isFollowing = false;
        if (viewerUserId && viewerUserId !== r.id) {
          const [f] = await db.select().from(userFollows).where(
            and3(
              eq3(userFollows.followerId, viewerUserId),
              eq3(userFollows.followingId, r.id)
            )
          ).limit(1);
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
router2.post("/users/:handle/follow", requireAuth2, async (req, res) => {
  try {
    const handle = req.params.handle?.trim();
    if (!handle) return res.status(400).json({ message: "Handle inv\xE1lido" });
    const viewerUserId = req.session.userId;
    const [targetUser] = await db.select({ id: users.id, followersCount: users.followersCount }).from(users).where(eq3(users.handle, handle)).limit(1);
    if (!targetUser) return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
    if (targetUser.id === viewerUserId) {
      return res.status(400).json({ message: "N\xE3o \xE9 poss\xEDvel seguir a si mesmo" });
    }
    const [existing] = await db.select().from(userFollows).where(
      and3(
        eq3(userFollows.followerId, viewerUserId),
        eq3(userFollows.followingId, targetUser.id)
      )
    ).limit(1);
    if (existing) {
      return res.json({ following: true, followersCount: targetUser.followersCount });
    }
    await db.insert(userFollows).values({
      followerId: viewerUserId,
      followingId: targetUser.id
    });
    await db.update(users).set({
      followersCount: sql4`${users.followersCount} + 1`,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq3(users.id, targetUser.id));
    const [viewer] = await db.select({ followingCount: users.followingCount }).from(users).where(eq3(users.id, viewerUserId)).limit(1);
    await db.update(users).set({
      followingCount: sql4`${users.followingCount} + 1`,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq3(users.id, viewerUserId));
    const [updated] = await db.select({ followersCount: users.followersCount }).from(users).where(eq3(users.id, targetUser.id)).limit(1);
    try {
      const [viewer2] = await db.select({ name: users.name, handle: users.handle }).from(users).where(eq3(users.id, viewerUserId)).limit(1);
      if (viewer2) {
        await storage.createSocialNotification({
          recipientId: targetUser.id,
          actorId: viewerUserId,
          type: "FOLLOW",
          title: `${viewer2.name} come\xE7ou a te seguir`,
          message: `@${viewer2.handle} agora te segue.`,
          referenceId: viewerUserId
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
router2.delete("/users/:handle/follow", requireAuth2, async (req, res) => {
  try {
    const handle = req.params.handle?.trim();
    if (!handle) return res.status(400).json({ message: "Handle inv\xE1lido" });
    const viewerUserId = req.session.userId;
    const [targetUser] = await db.select({ id: users.id, followersCount: users.followersCount }).from(users).where(eq3(users.handle, handle)).limit(1);
    if (!targetUser) return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
    const result = await db.delete(userFollows).where(
      and3(
        eq3(userFollows.followerId, viewerUserId),
        eq3(userFollows.followingId, targetUser.id)
      )
    ).returning({ id: userFollows.id });
    if (result.length === 0) {
      return res.json({ following: false, followersCount: targetUser.followersCount });
    }
    await db.update(users).set({
      followersCount: sql4`greatest(0, ${users.followersCount} - 1)`,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq3(users.id, targetUser.id));
    await db.update(users).set({
      followingCount: sql4`greatest(0, ${users.followingCount} - 1)`,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq3(users.id, viewerUserId));
    const [updated] = await db.select({ followersCount: users.followersCount }).from(users).where(eq3(users.id, targetUser.id)).limit(1);
    res.json({
      following: false,
      followersCount: Math.max(0, (updated?.followersCount ?? targetUser.followersCount) - 1)
    });
  } catch (err) {
    console.error("[social] DELETE /users/:handle/follow error:", err);
    res.status(500).json({ message: "Erro ao deixar de seguir" });
  }
});
router2.get("/posts", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 50);
    const offset = Math.max(parseInt(String(req.query.offset || 0), 10) || 0, 0);
    const userId = typeof req.query.userId === "string" ? req.query.userId.trim() : void 0;
    const handle = typeof req.query.handle === "string" ? req.query.handle.trim() : void 0;
    let filterUserId = userId;
    if (handle) {
      const [u] = await db.select({ id: users.id }).from(users).where(eq3(users.handle, handle)).limit(1);
      filterUserId = u?.id ?? void 0;
    }
    const conditions = [sql4`${posts.parentPostId} IS NULL`];
    if (filterUserId) {
      conditions.push(eq3(posts.userId, filterUserId));
    }
    const rows = await db.select({
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
      journalistStatus: journalists.status
    }).from(posts).innerJoin(users, eq3(posts.userId, users.id)).leftJoin(journalists, eq3(users.id, journalists.userId)).where(and3(...conditions)).orderBy(desc3(posts.createdAt)).limit(limit).offset(offset);
    const postIds = rows.map((r) => r.id);
    const viewerUserId = req.session?.userId ?? null;
    let viewerLikedIds = /* @__PURE__ */ new Set();
    let viewerBookmarkedIds = /* @__PURE__ */ new Set();
    if (viewerUserId && postIds.length > 0) {
      const [likes, bookmarks] = await Promise.all([
        db.select({ postId: postLikes.postId }).from(postLikes).where(eq3(postLikes.userId, viewerUserId)),
        db.select({ postId: postBookmarks.postId }).from(postBookmarks).where(eq3(postBookmarks.userId, viewerUserId))
      ]);
      viewerLikedIds = new Set(likes.map((l) => l.postId));
      viewerBookmarkedIds = new Set(bookmarks.map((b) => b.postId));
    }
    const relatedNewsIds = [...new Set(rows.map((r) => r.relatedNewsId).filter(Boolean))];
    let newsMap = /* @__PURE__ */ new Map();
    if (relatedNewsIds.length > 0) {
      const newsRows = await db.select({ id: news.id, title: news.title }).from(news).where(inArray3(news.id, relatedNewsIds));
      newsMap = new Map(newsRows.map((n) => [n.id, { id: n.id, title: n.title }]));
    }
    const items = rows.map((r) => {
      const isVerifiedJournalist = r.userType === "JOURNALIST" && r.journalistStatus === "APPROVED";
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
          name: r.userName ?? "Usu\xE1rio",
          handle: r.userHandle ?? "user",
          avatarUrl: r.userAvatarUrl ?? null,
          userRole: deriveUserRole(r.userType ?? null),
          isVerifiedJournalist
        },
        viewerHasLiked: viewerLikedIds.has(r.id),
        viewerHasBookmarked: viewerBookmarkedIds.has(r.id),
        relatedNews: r.relatedNewsId ? newsMap.get(r.relatedNewsId) ?? null : null
      };
    });
    res.json(items);
  } catch (err) {
    console.error("[social] GET /posts error:", err);
    res.status(500).json({ message: "Erro ao carregar posts" });
  }
});
router2.post("/posts", requireAuth2, async (req, res) => {
  try {
    const userId = req.session.userId;
    const body = req.body;
    const parsed = insertPostSchema.safeParse({
      content: body.content,
      imageUrl: body.imageUrl || void 0,
      parentPostId: body.parentPostId || void 0,
      relatedNewsId: body.relatedNewsId || void 0
    });
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors[0]?.message ?? "Dados inv\xE1lidos" });
    }
    const { content, imageUrl, parentPostId, relatedNewsId } = parsed.data;
    const [post] = await db.insert(posts).values({
      userId,
      content: content.trim(),
      imageUrl: imageUrl || null,
      parentPostId: parentPostId || null,
      relatedNewsId: relatedNewsId || null
    }).returning();
    if (!post) return res.status(500).json({ message: "Erro ao criar post" });
    const hashtagMatches = content.match(/#[\w\u00C0-\u024F]+/g) ?? [];
    const uniqueTags = [...new Set(hashtagMatches.map((t) => t.slice(1).replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, "")))].filter((t) => t.length >= 2);
    const hashtagStrings = uniqueTags.map((t) => `#${t}`);
    if (uniqueTags.length > 0) {
      for (const tag of uniqueTags) {
        const [upserted] = await db.insert(hashtags).values({ name: tag, postCount: 1, category: "geral" }).onConflictDoUpdate({
          target: hashtags.name,
          set: { postCount: sql4`${hashtags.postCount} + 1`, updatedAt: /* @__PURE__ */ new Date() }
        }).returning({ id: hashtags.id });
        if (upserted) {
          await db.insert(postHashtags).values({ postId: post.id, hashtagId: upserted.id }).onConflictDoNothing({ target: [postHashtags.postId, postHashtags.hashtagId] });
        }
      }
      await db.update(posts).set({ hashtags: hashtagStrings, updatedAt: /* @__PURE__ */ new Date() }).where(eq3(posts.id, post.id));
    }
    if (parentPostId) {
      await db.update(posts).set({
        replyCount: sql4`${posts.replyCount} + 1`,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq3(posts.id, parentPostId));
      try {
        const [parentPost] = await db.select({ userId: posts.userId }).from(posts).where(eq3(posts.id, parentPostId)).limit(1);
        const [actor] = await db.select({ name: users.name, handle: users.handle }).from(users).where(eq3(users.id, userId)).limit(1);
        if (parentPost && actor && parentPost.userId !== userId) {
          await storage.createSocialNotification({
            recipientId: parentPost.userId,
            actorId: userId,
            type: "REPLY",
            title: `${actor.name} respondeu ao seu post`,
            message: (post.content || "").slice(0, 100),
            referenceId: post.id
          });
        }
      } catch (err) {
        console.error("[notification/reply] error:", err);
      }
    }
    const [authorRow] = await db.select({
      id: users.id,
      name: users.name,
      handle: users.handle,
      avatarUrl: users.avatarUrl,
      userType: users.userType,
      journalistStatus: journalists.status
    }).from(users).leftJoin(journalists, eq3(users.id, journalists.userId)).where(eq3(users.id, userId)).limit(1);
    const isVerifiedJournalist = authorRow?.userType === "JOURNALIST" && authorRow?.journalistStatus === "APPROVED";
    res.status(201).json({
      ...post,
      author: authorRow ? {
        id: authorRow.id,
        name: authorRow.name ?? "Usu\xE1rio",
        handle: authorRow.handle ?? "user",
        avatarUrl: authorRow.avatarUrl ?? null,
        userRole: deriveUserRole(authorRow.userType ?? null),
        isVerifiedJournalist
      } : null
    });
  } catch (err) {
    console.error("[social] POST /posts error:", err);
    res.status(500).json({ message: "Erro ao criar post" });
  }
});
router2.get("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id?.trim();
    if (!postId) return res.status(400).json({ message: "ID inv\xE1lido" });
    const [row] = await db.select({
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
      journalistStatus: journalists.status
    }).from(posts).innerJoin(users, eq3(posts.userId, users.id)).leftJoin(journalists, eq3(users.id, journalists.userId)).where(eq3(posts.id, postId)).limit(1);
    if (!row) return res.status(404).json({ message: "Post n\xE3o encontrado" });
    const mainIsVerified = row.userType === "JOURNALIST" && row.journalistStatus === "APPROVED";
    const viewerUserId = req.session?.userId ?? null;
    let viewerHasLiked = false;
    let viewerHasBookmarked = false;
    if (viewerUserId) {
      const [liked] = await db.select().from(postLikes).where(and3(eq3(postLikes.postId, postId), eq3(postLikes.userId, viewerUserId))).limit(1);
      const [bookmarked] = await db.select().from(postBookmarks).where(and3(eq3(postBookmarks.postId, postId), eq3(postBookmarks.userId, viewerUserId))).limit(1);
      viewerHasLiked = !!liked;
      viewerHasBookmarked = !!bookmarked;
    }
    const replyRows = await db.select({
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
      journalistStatus: journalists.status
    }).from(posts).innerJoin(users, eq3(posts.userId, users.id)).leftJoin(journalists, eq3(users.id, journalists.userId)).where(eq3(posts.parentPostId, postId)).orderBy(desc3(posts.createdAt)).limit(50);
    let replyViewerLiked = /* @__PURE__ */ new Set();
    let replyViewerBookmarked = /* @__PURE__ */ new Set();
    if (viewerUserId && replyRows.length > 0) {
      const replyIds = replyRows.map((r) => r.id);
      const [likes, bookmarks] = await Promise.all([
        db.select({ postId: postLikes.postId }).from(postLikes).where(eq3(postLikes.userId, viewerUserId)),
        db.select({ postId: postBookmarks.postId }).from(postBookmarks).where(eq3(postBookmarks.userId, viewerUserId))
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
          name: r.userName ?? "Usu\xE1rio",
          handle: r.userHandle ?? "user",
          avatarUrl: r.userAvatarUrl ?? null,
          userRole: deriveUserRole(r.userType ?? null),
          isVerifiedJournalist: replyIsVerified
        },
        viewerHasLiked: replyViewerLiked.has(r.id),
        viewerHasBookmarked: replyViewerBookmarked.has(r.id),
        relatedNews: null
      };
    });
    const relatedNews = row.relatedNewsId ? await db.select({ id: news.id, title: news.title }).from(news).where(eq3(news.id, row.relatedNewsId)).limit(1) : null;
    res.json({
      ...row,
      author: {
        id: row.userId,
        name: row.userName ?? "Usu\xE1rio",
        handle: row.userHandle ?? "user",
        avatarUrl: row.userAvatarUrl ?? null,
        userRole: deriveUserRole(row.userType ?? null),
        isVerifiedJournalist: mainIsVerified
      },
      viewerHasLiked,
      viewerHasBookmarked,
      relatedNews: relatedNews?.[0] ?? null,
      replies
    });
  } catch (err) {
    console.error("[social] GET /posts/:id error:", err);
    res.status(500).json({ message: "Erro ao carregar post" });
  }
});
router2.delete("/posts/:id", requireAuth2, async (req, res) => {
  try {
    const postId = req.params.id?.trim();
    if (!postId) return res.status(400).json({ message: "ID inv\xE1lido" });
    const userId = req.session.userId;
    const [post] = await db.select({ userId: posts.userId }).from(posts).where(eq3(posts.id, postId)).limit(1);
    if (!post) return res.status(404).json({ message: "Post n\xE3o encontrado" });
    if (post.userId !== userId) {
      return res.status(403).json({ message: "Voc\xEA s\xF3 pode deletar seus pr\xF3prios posts" });
    }
    await db.delete(posts).where(eq3(posts.id, postId));
    res.json({ message: "Post deletado" });
  } catch (err) {
    console.error("[social] DELETE /posts/:id error:", err);
    res.status(500).json({ message: "Erro ao deletar post" });
  }
});
router2.post("/posts/:id/like", requireAuth2, async (req, res) => {
  try {
    const postId = req.params.id?.trim();
    if (!postId) return res.status(400).json({ message: "ID inv\xE1lido" });
    const userId = req.session.userId;
    const [existing] = await db.select().from(postLikes).where(and3(eq3(postLikes.postId, postId), eq3(postLikes.userId, userId))).limit(1);
    if (existing) {
      await db.delete(postLikes).where(and3(eq3(postLikes.postId, postId), eq3(postLikes.userId, userId)));
      await db.update(posts).set({
        likeCount: sql4`greatest(0, ${posts.likeCount} - 1)`,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq3(posts.id, postId));
      const [p2] = await db.select({ likeCount: posts.likeCount }).from(posts).where(eq3(posts.id, postId)).limit(1);
      return res.json({ liked: false, likeCount: p2?.likeCount ?? 0 });
    }
    await db.insert(postLikes).values({ postId, userId });
    await db.update(posts).set({
      likeCount: sql4`${posts.likeCount} + 1`,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq3(posts.id, postId));
    const [p] = await db.select({ likeCount: posts.likeCount }).from(posts).where(eq3(posts.id, postId)).limit(1);
    try {
      const [postRow] = await db.select({ userId: posts.userId, content: posts.content }).from(posts).where(eq3(posts.id, postId)).limit(1);
      const [actor] = await db.select({ name: users.name, handle: users.handle }).from(users).where(eq3(users.id, userId)).limit(1);
      if (postRow && actor && postRow.userId !== userId) {
        await storage.createSocialNotification({
          recipientId: postRow.userId,
          actorId: userId,
          type: "LIKE",
          title: `${actor.name} curtiu seu post`,
          message: postRow.content.slice(0, 100),
          referenceId: postId
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
router2.post("/posts/:id/bookmark", requireAuth2, async (req, res) => {
  try {
    const postId = req.params.id?.trim();
    if (!postId) return res.status(400).json({ message: "ID inv\xE1lido" });
    const userId = req.session.userId;
    const [existing] = await db.select().from(postBookmarks).where(and3(eq3(postBookmarks.postId, postId), eq3(postBookmarks.userId, userId))).limit(1);
    if (existing) {
      await db.delete(postBookmarks).where(and3(eq3(postBookmarks.postId, postId), eq3(postBookmarks.userId, userId)));
      await db.update(posts).set({
        bookmarkCount: sql4`greatest(0, ${posts.bookmarkCount} - 1)`,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq3(posts.id, postId));
      const [p2] = await db.select({ bookmarkCount: posts.bookmarkCount }).from(posts).where(eq3(posts.id, postId)).limit(1);
      return res.json({ bookmarked: false, bookmarkCount: p2?.bookmarkCount ?? 0 });
    }
    await db.insert(postBookmarks).values({ postId, userId });
    await db.update(posts).set({
      bookmarkCount: sql4`${posts.bookmarkCount} + 1`,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq3(posts.id, postId));
    const [p] = await db.select({ bookmarkCount: posts.bookmarkCount }).from(posts).where(eq3(posts.id, postId)).limit(1);
    res.json({ bookmarked: true, bookmarkCount: (p?.bookmarkCount ?? 0) + 1 });
  } catch (err) {
    console.error("[social] POST /posts/:id/bookmark error:", err);
    res.status(500).json({ message: "Erro ao salvar" });
  }
});
var socialRouter = router2;

// server/route-handlers/explore.ts
init_db();
init_schema();
import { Router as Router3 } from "express";
import { eq as eq4, and as and4, desc as desc4, sql as sql5, ilike as ilike2, or as or2, not as not2, inArray as inArray4 } from "drizzle-orm";
function requireAuth3(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "N\xE3o autenticado" });
  }
  next();
}
var router3 = Router3();
router3.get("/trending", async (req, res) => {
  try {
    const period = req.query.period || "24h";
    const category = req.query.category;
    let q = db.select({
      id: trendingTopics.id,
      title: trendingTopics.title,
      subtitle: trendingTopics.subtitle,
      category: trendingTopics.category,
      postCount: trendingTopics.postCount,
      teamId: trendingTopics.teamId
    }).from(trendingTopics).where(eq4(trendingTopics.period, period)).orderBy(desc4(trendingTopics.postCount));
    const rows = await q;
    const teamIds = [...new Set(rows.map((r) => r.teamId).filter(Boolean))];
    const teamMap = /* @__PURE__ */ new Map();
    if (teamIds.length > 0) {
      const teamRows = await db.select({ id: teams.id, shortName: teams.shortName }).from(teams).where(inArray4(teams.id, teamIds));
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
      team_slug: r.teamId ? teamMap.get(r.teamId)?.slug ?? null : null
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
router3.get("/hashtags", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || 10), 10) || 10, 20);
    const rows = await db.select({
      id: hashtags.id,
      name: hashtags.name,
      postCount: hashtags.postCount,
      category: hashtags.category
    }).from(hashtags).orderBy(desc4(hashtags.postCount)).limit(limit);
    res.json(rows.map((r) => ({ id: r.id, name: r.name, post_count: r.postCount, category: r.category })));
  } catch (err) {
    console.error("[explore] GET /hashtags error:", err);
    res.status(500).json({ message: "Erro ao carregar hashtags" });
  }
});
router3.get("/search", async (req, res) => {
  try {
    const q = req.query.q?.trim() ?? "";
    if (!q) return res.json({ posts: [], users: [], hashtags: [], teams: [] });
    const term = `%${q}%`;
    const viewerUserId = req.session?.userId ?? null;
    const limit = 5;
    const [matchedPosts, matchedUsers, matchedHashtags, matchedTeams] = await Promise.all([
      db.select({
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
        teamName: teams.name
      }).from(posts).innerJoin(users, eq4(posts.userId, users.id)).leftJoin(journalists, eq4(users.id, journalists.userId)).leftJoin(teams, eq4(users.teamId, teams.id)).where(and4(ilike2(posts.content, term), sql5`${posts.parentPostId} IS NULL`)).orderBy(desc4(posts.createdAt)).limit(limit),
      db.select({
        id: users.id,
        name: users.name,
        handle: users.handle,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
        userType: users.userType,
        followersCount: users.followersCount
      }).from(users).where(or2(ilike2(users.name, term), ilike2(users.handle, term))).orderBy(desc4(users.followersCount)).limit(limit),
      db.select({ id: hashtags.id, name: hashtags.name, postCount: hashtags.postCount, category: hashtags.category }).from(hashtags).where(ilike2(hashtags.name, term)).orderBy(desc4(hashtags.postCount)).limit(limit),
      db.select({ id: teams.id, name: teams.name, shortName: teams.shortName, logoUrl: teams.logoUrl }).from(teams).where(or2(ilike2(teams.name, term), ilike2(teams.shortName, term))).limit(limit)
    ]);
    let followingIds = [];
    if (viewerUserId) {
      const f = await db.select({ followingId: userFollows.followingId }).from(userFollows).where(eq4(userFollows.followerId, viewerUserId));
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
        team_name: p.teamName
      }
    }));
    const usersOut = matchedUsers.map((u) => ({
      id: u.id,
      name: u.name,
      handle: u.handle,
      avatarUrl: u.avatarUrl,
      bio: u.bio,
      userType: u.userType,
      followersCount: u.followersCount,
      is_following: followingIds.includes(u.id)
    }));
    const hashtagsOut = matchedHashtags.map((h) => ({
      id: h.id,
      name: h.name,
      post_count: h.postCount,
      category: h.category
    }));
    const teamsOut = matchedTeams.map((t) => ({
      id: t.id,
      name: t.name,
      shortName: t.shortName,
      logoUrl: t.logoUrl
    }));
    res.json({ posts: postsOut, users: usersOut, hashtags: hashtagsOut, teams: teamsOut });
  } catch (err) {
    console.error("[explore] GET /search error:", err);
    res.status(500).json({ message: "Erro ao buscar", posts: [], users: [], hashtags: [], teams: [] });
  }
});
router3.get("/posts-by-hashtag/:name", async (req, res) => {
  try {
    const name = decodeURIComponent((req.params.name || "").trim());
    if (!name) return res.status(400).json({ message: "Hashtag inv\xE1lida" });
    const hashtagName = name.startsWith("#") ? name.slice(1) : name;
    const [hashtagRow] = await db.select().from(hashtags).where(ilike2(hashtags.name, hashtagName)).limit(1);
    if (!hashtagRow) return res.json([]);
    const postRows = await db.select({
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
      teamName: teams.name
    }).from(posts).innerJoin(postHashtags, eq4(posts.id, postHashtags.postId)).innerJoin(users, eq4(posts.userId, users.id)).leftJoin(journalists, eq4(users.id, journalists.userId)).leftJoin(teams, eq4(users.teamId, teams.id)).where(and4(eq4(postHashtags.hashtagId, hashtagRow.id), sql5`${posts.parentPostId} IS NULL`)).orderBy(desc4(posts.createdAt)).limit(20);
    const viewerUserId = req.session?.userId ?? null;
    let likedIds = /* @__PURE__ */ new Set();
    let bookmarkedIds = /* @__PURE__ */ new Set();
    if (viewerUserId) {
      const postIds = postRows.map((p) => p.id);
      const [likes, bookmarks] = await Promise.all([
        db.select({ postId: postLikes.postId }).from(postLikes).where(and4(eq4(postLikes.userId, viewerUserId), inArray4(postLikes.postId, postIds))),
        db.select({ postId: postBookmarks.postId }).from(postBookmarks).where(and4(eq4(postBookmarks.userId, viewerUserId), inArray4(postBookmarks.postId, postIds)))
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
        team_name: p.teamName
      },
      viewerHasLiked: likedIds.has(p.id),
      viewerHasBookmarked: bookmarkedIds.has(p.id)
    }));
    res.json(items);
  } catch (err) {
    console.error("[explore] GET /posts-by-hashtag error:", err);
    res.status(500).json({ message: "Erro ao carregar posts" });
  }
});
router3.get("/suggested-users", requireAuth3, async (req, res) => {
  try {
    const viewerUserId = req.session.userId;
    const limit = 5;
    const followed = await db.select({ followingId: userFollows.followingId }).from(userFollows).where(eq4(userFollows.followerId, viewerUserId));
    const excludeIds = [viewerUserId, ...followed.map((f) => f.followingId)];
    const rows = await db.select({
      id: users.id,
      name: users.name,
      handle: users.handle,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      userType: users.userType,
      followersCount: users.followersCount
    }).from(users).where(and4(not2(inArray4(users.id, excludeIds)), sql5`${users.handle} IS NOT NULL`)).orderBy(desc4(users.followersCount)).limit(limit);
    const items = rows.map((u) => ({
      id: u.id,
      name: u.name,
      handle: u.handle ?? "user",
      avatarUrl: u.avatarUrl,
      bio: u.bio,
      userType: u.userType,
      followersCount: u.followersCount,
      is_following: false
    }));
    res.json(items);
  } catch (err) {
    console.error("[explore] GET /suggested-users error:", err);
    res.status(500).json({ message: "Erro ao carregar sugest\xF5es" });
  }
});
var exploreRouter = router3;

// server/routes.ts
var PgSession = ConnectPgSimple(session);
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
var UPLOADS_DIR = process.env.VERCEL ? "/tmp/uploads" : path2.resolve(__dirname2, "uploads");
var MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;
var ALLOWED_IMAGE_EXTENSIONS = /* @__PURE__ */ new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
var ALLOWED_IMAGE_MIME_TYPES = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
var MAX_AVATAR_UPLOAD_BYTES = 2 * 1024 * 1024;
try {
  fs2.mkdirSync(UPLOADS_DIR, { recursive: true });
} catch (e) {
  console.warn("[server] Could not create uploads dir:", e.message);
}
var uploadImage = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
      const ext = path2.extname(file.originalname).toLowerCase();
      const unique = `${Date.now()}-${randomBytes2(8).toString("hex")}${ext}`;
      cb(null, unique);
    }
  }),
  limits: { fileSize: MAX_IMAGE_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    const ext = path2.extname(file.originalname).toLowerCase();
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      return cb(new Error("Tipo inv\xE1lido. Envie um arquivo de imagem (image/*)."));
    }
    if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
      return cb(
        new Error("Extens\xE3o n\xE3o permitida. Use .jpg, .jpeg, .png, .webp ou .gif.")
      );
    }
    return cb(null, true);
  }
});
function sanitizeOriginalFilename(originalName) {
  const base = path2.basename(originalName || "image");
  const sanitized = base.normalize("NFKD").replace(/[^\w.\-]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "").slice(0, 120);
  return sanitized.length > 0 ? sanitized : "image";
}
var uploadNewsImage = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
      const safeOriginalName = sanitizeOriginalFilename(file.originalname);
      const filename = `${Date.now()}_${safeOriginalName}`;
      cb(null, filename);
    }
  }),
  limits: { fileSize: MAX_IMAGE_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    const ext = path2.extname(file.originalname).toLowerCase();
    const mime = (file.mimetype || "").toLowerCase();
    if (!ALLOWED_IMAGE_MIME_TYPES.has(mime)) {
      return cb(new Error("Tipo inv\xE1lido. Envie uma imagem (jpeg, png, webp ou gif)."));
    }
    if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
      return cb(new Error("Extens\xE3o n\xE3o permitida. Use .jpg, .jpeg, .png, .webp ou .gif."));
    }
    return cb(null, true);
  }
});
var uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AVATAR_UPLOAD_BYTES }
});
function requireAuth4(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "N\xE3o autenticado" });
  }
  next();
}
function requireJournalist(req, res, next) {
  (async () => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      req.session.userType = user.userType;
      if (user.userType !== "JOURNALIST") {
        return res.status(403).json({ message: "Acesso negado. Apenas jornalistas." });
      }
      const journalist = await storage.getJournalist(req.session.userId);
      if (!journalist) {
        return res.status(403).json({ message: "Acesso negado. Registro de jornalista n\xE3o encontrado." });
      }
      if (journalist.status !== "APPROVED") {
        return res.status(403).json({ message: "Acesso negado. Conta de jornalista n\xE3o aprovada." });
      }
      next();
    } catch (error) {
      console.error("requireJournalist error:", error);
      return res.status(500).json({ message: "Erro ao verificar permiss\xF5es" });
    }
  })();
}
function isAdmin(user) {
  if (user.userType === "ADMIN") return true;
  const emails = process.env.ADMIN_EMAILS;
  if (!emails) return false;
  const list = emails.split(",").map((e) => e.trim().toLowerCase());
  return list.includes(user.email.toLowerCase());
}
function requireAdmin(req, res, next) {
  (async () => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      if (!isAdmin(user)) {
        return res.status(403).json({ message: "Acesso negado. Apenas administradores." });
      }
      req.adminUser = user;
      next();
    } catch (error) {
      console.error("requireAdmin error:", error);
      return res.status(500).json({ message: "Erro ao verificar permiss\xF5es" });
    }
  })();
}
function requireJournalistOrAdmin(req, res, next) {
  (async () => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "N\xE3o autenticado" });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      if (user.userType === "ADMIN") {
        return next();
      }
      if (user.userType !== "JOURNALIST") {
        return res.status(403).json({ message: "Apenas jornalistas e administradores." });
      }
      const journalist = await storage.getJournalist(req.session.userId);
      if (!journalist || journalist.status !== "APPROVED") {
        return res.status(403).json({ message: "Acesso negado. Conta de jornalista n\xE3o aprovada." });
      }
      next();
    } catch (error) {
      console.error("requireJournalistOrAdmin error:", error);
      return res.status(500).json({ message: "Erro ao verificar permiss\xF5es" });
    }
  })();
}
function parseSeasonParam(value) {
  const current = (/* @__PURE__ */ new Date()).getFullYear();
  if (typeof value !== "string") return current;
  const parsed = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return current;
  return parsed;
}
function parseLimitParam(value, fallback, max) {
  if (typeof value !== "string") return fallback;
  const parsed = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}
var sessionStore = new PgSession({
  pool,
  tableName: "user_sessions",
  createTableIfMissing: true,
  pruneSessionInterval: 60 * 15,
  // limpar sessões expiradas a cada 15 min
  errorLog: console.error
});
async function registerRoutes(app2) {
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1e3,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    // só conta tentativas com falha (401/500)
    message: { message: "Muitas tentativas de login. Tente novamente em 15 minutos." }
  });
  const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1e3,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Muitas contas criadas. Tente novamente em 1 hora." }
  });
  const handleCheckLimiter = rateLimit({
    windowMs: 60 * 1e3,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Muitas verifica\xE7\xF5es de handle. Aguarde um momento." }
  });
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set (required for session cookies)");
  }
  const cookieDomain = process.env.COOKIE_DOMAIN && process.env.COOKIE_DOMAIN.trim().length > 0 ? process.env.COOKIE_DOMAIN.trim() : void 0;
  const isProd2 = process.env.NODE_ENV === "production";
  const cookieSameSiteEnv = (process.env.COOKIE_SAMESITE ?? "").trim().toLowerCase();
  const cookieSameSite = cookieSameSiteEnv === "lax" || cookieSameSiteEnv === "strict" || cookieSameSiteEnv === "none" ? cookieSameSiteEnv : isProd2 ? "none" : "lax";
  const cookieSecureEnv = (process.env.COOKIE_SECURE ?? "").trim().toLowerCase();
  let cookieSecure = cookieSecureEnv === "true" ? true : cookieSecureEnv === "false" ? false : isProd2;
  if (cookieSameSite === "none") {
    cookieSecure = true;
  }
  app2.use(
    session({
      store: sessionStore,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      // renova o cookie a cada request
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1e3,
        // 30 days
        httpOnly: true,
        domain: cookieDomain,
        secure: cookieSecure,
        sameSite: cookieSameSite
      }
    })
  );
  app2.use("/api/feed", feedRouter);
  app2.use("/api/explore", exploreRouter);
  app2.use("/api", socialRouter);
  app2.get("/api/search/suggestions", async (req, res) => {
    const q = req.query.q?.trim() ?? "";
    if (!q || q.length < 1) return res.json({ users: [] });
    try {
      const term = `%${q}%`;
      const matchedUsers = await db.select({
        id: users.id,
        name: users.name,
        handle: users.handle,
        avatarUrl: users.avatarUrl,
        userType: users.userType,
        followersCount: users.followersCount
      }).from(users).where(or7(ilike5(users.name, term), ilike5(users.handle, term))).orderBy(desc9(users.followersCount)).limit(5);
      return res.json({ users: matchedUsers });
    } catch (err) {
      console.error("[search] suggestions error:", err);
      return res.status(500).json({ users: [] });
    }
  });
  app2.get("/api/search", async (req, res) => {
    const q = req.query.q?.trim() ?? "";
    const type = req.query.type ?? "all";
    const page = parseInt(req.query.page ?? "1", 10);
    const limit = 20;
    const offset = (page - 1) * limit;
    if (!q) return res.json({ users: [], posts: [], total: 0 });
    try {
      const term = `%${q}%`;
      let matchedUsers = [];
      let matchedPosts = [];
      if (type === "all" || type === "users") {
        matchedUsers = await db.select({
          id: users.id,
          name: users.name,
          handle: users.handle,
          avatarUrl: users.avatarUrl,
          bio: users.bio,
          userType: users.userType,
          followersCount: users.followersCount,
          followingCount: users.followingCount
        }).from(users).where(or7(ilike5(users.name, term), ilike5(users.handle, term))).orderBy(desc9(users.followersCount)).limit(type === "all" ? 5 : limit).offset(type === "all" ? 0 : offset);
      }
      if (type === "all" || type === "posts") {
        const postRows = await db.select({
          id: posts.id,
          content: posts.content,
          imageUrl: posts.imageUrl,
          likeCount: posts.likeCount,
          repostCount: posts.repostCount,
          replyCount: posts.replyCount,
          viewCount: posts.viewCount,
          createdAt: posts.createdAt,
          parentPostId: posts.parentPostId,
          authorId: users.id,
          authorName: users.name,
          authorHandle: users.handle,
          authorAvatarUrl: users.avatarUrl,
          authorUserType: users.userType
        }).from(posts).innerJoin(users, eq13(posts.userId, users.id)).where(
          and12(
            ilike5(posts.content, term),
            isNull(posts.parentPostId)
          )
        ).orderBy(desc9(posts.createdAt)).limit(type === "all" ? 10 : limit).offset(type === "all" ? 0 : offset);
        matchedPosts = postRows.map((row) => ({
          id: row.id,
          content: row.content,
          imageUrl: row.imageUrl,
          likeCount: row.likeCount,
          repostCount: row.repostCount,
          replyCount: row.replyCount,
          viewCount: row.viewCount,
          createdAt: row.createdAt,
          parentPostId: row.parentPostId,
          author: {
            id: row.authorId,
            name: row.authorName,
            handle: row.authorHandle,
            avatarUrl: row.authorAvatarUrl,
            userType: row.authorUserType
          }
        }));
      }
      return res.json({
        users: matchedUsers,
        posts: matchedPosts,
        total: matchedUsers.length + matchedPosts.length
      });
    } catch (err) {
      console.error("[search] search error:", err);
      return res.status(500).json({
        users: [],
        posts: [],
        total: 0,
        error: "Erro ao buscar"
      });
    }
  });
  app2.get("/api/health", async (_req, res) => {
    let dbStatus = "ok";
    try {
      await pool.query("SELECT 1");
    } catch {
      dbStatus = "error";
    }
    res.json({
      ok: dbStatus === "ok",
      status: dbStatus === "ok" ? "healthy" : "degraded",
      db: dbStatus,
      env: process.env.NODE_ENV || "development"
    });
  });
  try {
    const seeded = await storage.seedTeamsIfEmpty();
    if (seeded.seeded) {
      console.log(`\u2705 Seeded ${seeded.count} teams (auto)`);
    }
  } catch (error) {
    console.error("\u274C Falha ao seedar times automaticamente:", error);
  }
  try {
    const { seedGames: seedGames2 } = await Promise.resolve().then(() => (init_games_seed(), games_seed_exports));
    const result = await seedGames2();
    if (result.seeded) {
      console.log("\u2705 Game set corinthians-2005-brasileirao criado (auto)");
    }
  } catch (error) {
    console.error("\u274C Falha ao seedar game sets:", error);
  }
  app2.get("/api/auth/check-handle", handleCheckLimiter, async (req, res) => {
    const handle = String(req.query.handle || "").trim().toLowerCase();
    if (!handle || !/^[a-z0-9_]{3,30}$/.test(handle)) {
      return res.json({ available: false, reason: "invalid" });
    }
    try {
      const existing = await db.select({ id: users.id }).from(users).where(eq13(users.handle, handle)).limit(1);
      return res.json({ available: existing.length === 0 });
    } catch (err) {
      console.error("[check-handle] error:", err);
      return res.status(500).json({ available: false, reason: "error" });
    }
  });
  const signupHandler = async (req, res) => {
    try {
      const { name, email, password, teamId } = insertUserSchema.parse(req.body);
      const rawHandle = String(req.body.handle || "").trim().toLowerCase();
      if (!rawHandle || !/^[a-z0-9_]{3,30}$/.test(rawHandle)) {
        return res.status(400).json({ message: "Handle inv\xE1lido. Use letras min\xFAsculas, n\xFAmeros e _ (m\xEDn. 3 caracteres)." });
      }
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email j\xE1 cadastrado" });
      }
      const existingHandle = await db.select({ id: users.id }).from(users).where(eq13(users.handle, rawHandle)).limit(1);
      if (existingHandle.length > 0) {
        return res.status(409).json({ message: `O handle @${rawHandle} j\xE1 est\xE1 em uso. Escolha outro.` });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        name,
        email,
        password: hashedPassword,
        teamId: teamId || null,
        userType: "FAN",
        handle: rawHandle
      });
      req.session.userId = user.id;
      req.session.userType = user.userType;
      await storage.checkAndAwardBadges(user.id);
      req.session.save((err) => {
        if (err) {
          console.error("Session save error (register):", err);
          return res.status(500).json({ message: "Erro ao criar conta" });
        }
        res.json({ id: user.id, name: user.name, email: user.email, teamId: user.teamId, userType: user.userType });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: error.message || "Erro ao criar conta" });
    }
  };
  app2.post("/api/auth/signup", signupLimiter, signupHandler);
  app2.post("/api/auth/register", signupLimiter, signupHandler);
  app2.post("/api/auth/login", loginLimiter, async (req, res) => {
    try {
      const loginSchema = z2.object({
        email: z2.string().email("Email inv\xE1lido"),
        password: z2.string().min(1, "Senha \xE9 obrigat\xF3ria")
      });
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Email ou senha inv\xE1lidos." });
      }
      const { email, password } = parsed.data;
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }
      req.session.userId = user.id;
      req.session.userType = user.userType;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Erro ao fazer login" });
        }
        res.json({ id: user.id, name: user.name, email: user.email, teamId: user.teamId, userType: user.userType });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Erro ao fazer login" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });
  app2.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(200).json(null);
    }
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(200).json(null);
      }
      req.session.userType = user.userType;
      const journalist = await storage.getJournalist(req.session.userId);
      const journalistStatus = journalist?.status ?? null;
      const isJournalist = journalist?.status === "APPROVED";
      const isAdminUser = isAdmin(user);
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        teamId: user.teamId,
        avatarUrl: user.avatarUrl ?? null,
        userType: user.userType,
        journalistStatus,
        isJournalist,
        isAdmin: isAdminUser,
        handle: user.handle ?? null,
        bio: user.bio ?? null,
        location: user.location ?? null,
        website: user.website ?? null,
        coverPhotoUrl: user.coverPhotoUrl ?? null,
        followersCount: user.followersCount ?? 0,
        followingCount: user.followingCount ?? 0
      });
    } catch (error) {
      console.error("Me error:", error);
      res.status(500).json({ message: "Erro ao buscar usu\xE1rio" });
    }
  });
  app2.get("/api/my-team/overview", requireAuth4, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user?.teamId) {
        return res.status(200).json({
          team: null,
          standings: null,
          lastMatches: [],
          form: []
        });
      }
      const teamId = user.teamId;
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(200).json({
          team: null,
          standings: null,
          lastMatches: [],
          form: []
        });
      }
      const { getMatchesByTeam: getMatchesByTeam2 } = await Promise.resolve().then(() => (init_matches_repo(), matches_repo_exports));
      const { getResultForTeam: getResultForTeam2, deriveFormFromMatches: deriveFormFromMatches2 } = await Promise.resolve().then(() => (init_resultForTeam(), resultForTeam_exports));
      let rawMatches = [];
      const matchGamesList = await getMatchesByTeam2(teamId, { type: "all", limit: 30 });
      if (matchGamesList.length > 0) {
        rawMatches = matchGamesList.map((m) => ({
          id: m.id,
          kickoffAt: m.kickoffAt,
          status: m.status,
          homeTeamId: m.homeTeamId,
          awayTeamId: m.awayTeamId,
          homeTeamName: m.homeTeamName,
          awayTeamName: m.awayTeamName,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          competition: m.competition,
          teamRating: null
        }));
      } else {
        const fixtures2 = await storage.getFixturesByTeam(teamId, { type: "all", limit: 30 });
        rawMatches = fixtures2.map((f) => ({
          id: f.id,
          kickoffAt: f.kickoffAt,
          status: f.status,
          homeTeamId: f.homeTeamId,
          awayTeamId: f.awayTeamId,
          homeTeamName: f.homeTeamName,
          awayTeamName: f.awayTeamName,
          homeScore: f.homeScore,
          awayScore: f.awayScore,
          competition: { id: f.competitionId ?? "", name: f.competition?.name ?? "TBD", logoUrl: f.competition?.logoUrl ?? null },
          teamRating: "teamRating" in f ? f.teamRating : null
        }));
      }
      const COMPLETED_STATUSES = /* @__PURE__ */ new Set(["FT", "COMPLETED", "AET", "PEN"]);
      const finished = rawMatches.filter((m) => COMPLETED_STATUSES.has(m.status) && m.homeScore != null && m.awayScore != null).sort((a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime()).slice(0, 5);
      const form = deriveFormFromMatches2(finished, teamId, 5);
      const lastMatches = finished.map((m) => ({
        id: m.id,
        date: new Date(m.kickoffAt).toISOString(),
        home: { id: m.homeTeamId ?? "", name: m.homeTeamName },
        away: { id: m.awayTeamId ?? "", name: m.awayTeamName },
        score: { home: m.homeScore ?? 0, away: m.awayScore ?? 0 },
        resultForTeam: getResultForTeam2(m, teamId) ?? "D",
        competition: m.competition?.name ?? null,
        teamRating: m.teamRating ?? null
      }));
      const allTeams = await storage.getAllTeams();
      const sorted = [...allTeams].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
      const teamIndex = sorted.findIndex((t) => t.id === teamId);
      const leader = sorted[0];
      const z4First = sorted[16];
      const standings2 = teamIndex >= 0 ? {
        position: teamIndex + 1,
        points: team.points ?? 0,
        played: (team.wins ?? 0) + (team.draws ?? 0) + (team.losses ?? 0),
        wins: team.wins ?? 0,
        draws: team.draws ?? 0,
        losses: team.losses ?? 0,
        goalDiff: (team.goalsFor ?? 0) - (team.goalsAgainst ?? 0),
        leaderPoints: leader?.points ?? null,
        z4Points: z4First?.points ?? null
      } : null;
      return res.json({
        team: { id: team.id, name: team.name, slug: team.id },
        standings: standings2,
        lastMatches,
        form,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error("[my-team] /overview error:", error);
      return res.status(500).json({ message: "Falha ao buscar overview do time" });
    }
  });
  app2.get("/api/teams/:teamId/summary", requireAuth4, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inv\xE1lido" });
    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time n\xE3o encontrado" });
      const season = parseSeasonParam(req.query.season);
      return res.json({
        available: true,
        updatedAt: Date.now(),
        team: {
          name: team.name,
          logo: team.logoUrl ?? null,
          stadium: null,
          country: "Brazil",
          capacity: null
        },
        league: season ? { id: 0, name: "Brasileir\xE3o S\xE9rie A", season } : null
      });
    } catch (error) {
      console.error("[meu-time][db] /summary error:", error);
      return res.status(500).json({ message: "Falha ao buscar resumo do time" });
    }
  });
  app2.get("/api/teams/:teamId/fixtures", requireAuth4, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inv\xE1lido" });
    const rangeRaw = typeof req.query.range === "string" ? req.query.range.trim().toLowerCase() : "next";
    const range = rangeRaw === "last" ? "last" : "next";
    const limit = parseLimitParam(req.query.limit, 5, 20);
    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time n\xE3o encontrado" });
      const all = await storage.getMatchesByTeam(teamId, 50);
      const now = Date.now();
      const filtered = range === "next" ? all.filter((m) => new Date(m.matchDate).getTime() >= now) : all.filter((m) => new Date(m.matchDate).getTime() < now);
      const fixtures2 = filtered.sort(
        (a, b) => range === "next" ? new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime() : new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()
      ).slice(0, limit).map((m, idx) => ({
        id: idx + 1,
        dateTime: new Date(m.matchDate).toISOString(),
        competition: "Brasileir\xE3o S\xE9rie A",
        season: new Date(m.matchDate).getFullYear(),
        venue: m.stadium ?? null,
        status: m.status ?? null,
        isHome: !!m.isHomeMatch,
        opponent: { name: m.opponent, logo: m.opponentLogoUrl ?? null },
        score: range === "last" ? { for: m.teamScore ?? null, against: m.opponentScore ?? null } : null
      }));
      return res.json({ available: true, updatedAt: Date.now(), fixtures: fixtures2 });
    } catch (error) {
      console.error("[meu-time][db] /fixtures error:", error);
      return res.status(500).json({ message: "Falha ao buscar jogos do time" });
    }
  });
  app2.get("/api/teams/:teamId/matches", requireAuth4, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inv\xE1lido" });
    const typeRaw = typeof req.query.type === "string" ? req.query.type.trim().toLowerCase() : "all";
    const type = typeRaw === "upcoming" || typeRaw === "recent" ? typeRaw : "all";
    const limit = parseLimitParam(req.query.limit, 20, 100);
    const competitionId = typeof req.query.competitionId === "string" ? req.query.competitionId.trim() : void 0;
    const seasonYear = typeof req.query.season === "string" ? parseInt(req.query.season, 10) : void 0;
    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time n\xE3o encontrado" });
      const { getMatchesByTeam: getMatchesByTeam2 } = await Promise.resolve().then(() => (init_matches_repo(), matches_repo_exports));
      const matchGamesList = await getMatchesByTeam2(teamId, {
        type,
        limit,
        competitionId,
        seasonYear: Number.isFinite(seasonYear) ? seasonYear : void 0
      });
      if (matchGamesList.length > 0) {
        return res.json({
          matches: matchGamesList.map((m) => ({
            id: m.id,
            kickoffAt: m.kickoffAt,
            status: m.status,
            homeTeamId: m.homeTeamId,
            awayTeamId: m.awayTeamId,
            homeTeamName: m.homeTeamName,
            awayTeamName: m.awayTeamName,
            homeScore: m.homeScore,
            awayScore: m.awayScore,
            round: m.round,
            competition: m.competition,
            seasonYear: m.seasonYear,
            venue: m.venue,
            teamRating: null
          })),
          source: "match_games",
          updatedAt: Date.now()
        });
      }
      const season = typeof req.query.season === "string" ? req.query.season.trim() : void 0;
      const items = await storage.getFixturesByTeam(teamId, {
        type,
        limit,
        competitionId,
        season
      });
      return res.json({
        matches: items.map((f) => ({
          id: f.id,
          kickoffAt: f.kickoffAt,
          status: f.status,
          homeTeamId: f.homeTeamId,
          awayTeamId: f.awayTeamId,
          homeTeamName: f.homeTeamName,
          awayTeamName: f.awayTeamName,
          homeScore: f.homeScore,
          awayScore: f.awayScore,
          round: f.round,
          competition: { id: f.competitionId, name: f.competition?.name ?? "TBD", logoUrl: f.competition?.logoUrl ?? null },
          seasonYear: f.season ? parseInt(f.season, 10) : null,
          venue: f.venue ? { id: null, name: f.venue, city: null } : null,
          teamRating: "teamRating" in f && f.teamRating != null ? Number(f.teamRating) : null
        })),
        source: "fixtures",
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error("[meu-time] /matches error:", error);
      return res.status(500).json({ message: "Falha ao buscar jogos do time" });
    }
  });
  app2.post("/api/teams/:teamId/matches", requireAuth4, requireAdmin, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inv\xE1lido" });
    try {
      const { insertFixtureSchema: insertFixtureSchema2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const parsed = insertFixtureSchema2.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors?.[0]?.message ?? "Dados inv\xE1lidos" });
      }
      const fixture = await storage.createFixture({ ...parsed.data, teamId });
      return res.status(201).json(fixture);
    } catch (error) {
      console.error("[meu-time] POST /matches error:", error);
      return res.status(500).json({ message: "Falha ao criar jogo" });
    }
  });
  app2.put("/api/matches/:matchId", requireAuth4, requireAdmin, async (req, res) => {
    const matchId = String(req.params.matchId || "").trim();
    if (!matchId) return res.status(400).json({ message: "matchId inv\xE1lido" });
    try {
      const body = req.body ?? {};
      const updates = {};
      if (body.status !== void 0) updates.status = body.status;
      if (body.homeScore !== void 0) updates.homeScore = body.homeScore;
      if (body.awayScore !== void 0) updates.awayScore = body.awayScore;
      if (body.kickoffAt !== void 0) updates.kickoffAt = new Date(body.kickoffAt);
      if (body.round !== void 0) updates.round = body.round;
      if (body.venue !== void 0) updates.venue = body.venue;
      const updated = await storage.updateFixture(matchId, updates);
      if (!updated) return res.status(404).json({ message: "Jogo n\xE3o encontrado" });
      return res.json(updated);
    } catch (error) {
      console.error("[meu-time] PUT /matches/:id error:", error);
      return res.status(500).json({ message: "Falha ao atualizar jogo" });
    }
  });
  app2.get("/api/teams/:teamId/stats", requireAuth4, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inv\xE1lido" });
    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time n\xE3o encontrado" });
      const season = parseSeasonParam(req.query.season);
      const played = (team.wins ?? 0) + (team.draws ?? 0) + (team.losses ?? 0);
      return res.json({
        available: true,
        updatedAt: Date.now(),
        league: season ? { id: 0, name: "Brasileir\xE3o S\xE9rie A", season } : null,
        stats: {
          season,
          leagueId: 0,
          played,
          wins: team.wins ?? 0,
          draws: team.draws ?? 0,
          losses: team.losses ?? 0,
          goalsFor: team.goalsFor ?? 0,
          goalsAgainst: team.goalsAgainst ?? 0,
          cleanSheets: null,
          points: team.points ?? 0
        }
      });
    } catch (error) {
      console.error("[meu-time][db] /stats error:", error);
      return res.status(500).json({ message: "Falha ao buscar estat\xEDsticas do time" });
    }
  });
  app2.get("/api/competitions/:competitionId/standings", async (req, res) => {
    const competitionId = String(req.params.competitionId || "").trim();
    const season = typeof req.query.season === "string" ? req.query.season.trim() : "2026";
    if (!competitionId) return res.status(400).json({ message: "competitionId inv\xE1lido" });
    const SERIE_A_2026_IDS = /* @__PURE__ */ new Set([
      "flamengo",
      "palmeiras",
      "corinthians",
      "botafogo",
      "fluminense",
      "sao-paulo",
      "internacional",
      "gremio",
      "cruzeiro",
      "bahia",
      "vasco-da-gama",
      "athletico-paranaense",
      "atletico-mineiro",
      "bragantino",
      "rb-bragantino",
      "santos",
      "coritiba",
      "mirassol",
      "vitoria",
      "chapecoense",
      "remo"
    ]);
    const STALE_TEAM_IDS_2026 = /* @__PURE__ */ new Set(["cuiaba", "goias", "america-mineiro", "fortaleza"]);
    try {
      const { getStandingsByCompetition: getStandingsByCompetition2, getCompetitionById: getCompetitionById2 } = await Promise.resolve().then(() => (init_standings_repo(), standings_repo_exports));
      const competition = await getCompetitionById2(competitionId);
      const rows = await getStandingsByCompetition2(competitionId, season);
      const isStale = season === "2026" && rows.some((r) => STALE_TEAM_IDS_2026.has(r.teamId));
      if (rows.length === 0 || isStale) {
        const allTeams = await storage.getAllTeams();
        const SERIE_A_2026_NAMES = /* @__PURE__ */ new Set([
          "flamengo",
          "palmeiras",
          "corinthians",
          "botafogo",
          "fluminense",
          "s\xE3o paulo",
          "sao paulo",
          "internacional",
          "gr\xEAmio",
          "gremio",
          "cruzeiro",
          "bahia",
          "vasco da gama",
          "athletico paranaense",
          "atl\xE9tico mineiro",
          "atletico mineiro",
          "rb bragantino",
          "santos",
          "coritiba",
          "mirassol",
          "vit\xF3ria",
          "vitoria",
          "chapecoense",
          "remo"
        ]);
        const filtered = season === "2026" && competitionId === "comp-brasileirao-serie-a" ? allTeams.filter((t) => SERIE_A_2026_IDS.has(t.id) || SERIE_A_2026_NAMES.has(t.name.toLowerCase())) : allTeams;
        const BRAGANTINO_IDS = /* @__PURE__ */ new Set(["bragantino", "rb-bragantino"]);
        const seen = /* @__PURE__ */ new Map();
        for (const t of filtered) {
          const nameKey = BRAGANTINO_IDS.has(t.id) ? "__bragantino__" : t.name.toLowerCase();
          const existing = seen.get(nameKey);
          const tPts = t.points ?? 0;
          const ePts = existing ? existing.points ?? 0 : -1;
          if (!existing || tPts > ePts || tPts === ePts && SERIE_A_2026_IDS.has(t.id) && !SERIE_A_2026_IDS.has(existing.id)) {
            seen.set(nameKey, t);
          }
        }
        const deduped = Array.from(seen.values());
        const sorted = deduped.slice().sort((a, b) => {
          if ((b.points ?? 0) !== (a.points ?? 0)) return (b.points ?? 0) - (a.points ?? 0);
          const gdA = (a.goalsFor ?? 0) - (a.goalsAgainst ?? 0);
          const gdB = (b.goalsFor ?? 0) - (b.goalsAgainst ?? 0);
          if (gdB !== gdA) return gdB - gdA;
          return (b.goalsFor ?? 0) - (a.goalsFor ?? 0);
        }).map((t, i) => ({
          id: `legacy-${t.id}`,
          competitionId,
          teamId: t.id,
          season,
          position: i + 1,
          played: (t.wins ?? 0) + (t.draws ?? 0) + (t.losses ?? 0),
          wins: t.wins ?? 0,
          draws: t.draws ?? 0,
          losses: t.losses ?? 0,
          goalsFor: t.goalsFor ?? 0,
          goalsAgainst: t.goalsAgainst ?? 0,
          goalDiff: (t.goalsFor ?? 0) - (t.goalsAgainst ?? 0),
          points: t.points ?? 0,
          form: [],
          team: {
            id: t.id,
            name: t.name,
            shortName: t.shortName,
            logoUrl: t.logoUrl ?? ""
          }
        }));
        return res.json({
          competition: competition ?? { id: competitionId, name: "Brasileir\xE3o S\xE9rie A", country: "Brasil", logoUrl: null },
          season,
          standings: sorted,
          updatedAt: Date.now()
        });
      }
      return res.json({
        competition: competition ?? { id: competitionId, name: "Brasileir\xE3o S\xE9rie A", country: "Brasil", logoUrl: null },
        season,
        standings: rows,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error("[standings] GET error:", error);
      return res.status(500).json({ message: "Falha ao buscar classifica\xE7\xE3o" });
    }
  });
  app2.get("/api/competitions/:competitionId/upcoming-fixtures", async (req, res) => {
    try {
      let slugify2 = function(s) {
        return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      };
      var slugify = slugify2;
      const allTeams = await storage.getAllTeams();
      const teamsById = new Map(allTeams.map((t) => [t.id, t]));
      const teamsBySlug = new Map(allTeams.map((t) => [slugify2(t.name), t]));
      const homeMatches = await db.select().from(matches).where(and12(eq13(matches.status, "SCHEDULED"), eq13(matches.isHomeMatch, true))).orderBy(asc2(matches.matchDate));
      const fixturesList = homeMatches.map((m) => {
        const homeTeam = teamsById.get(m.teamId);
        const awayTeam = teamsBySlug.get(slugify2(m.opponent)) ?? allTeams.find((t) => t.name.toLowerCase() === m.opponent.toLowerCase());
        return {
          id: m.id,
          homeTeamId: m.teamId,
          homeTeamName: homeTeam?.name ?? m.teamId,
          awayTeamId: awayTeam?.id ?? slugify2(m.opponent),
          awayTeamName: m.opponent,
          round: m.championshipRound,
          matchDate: m.matchDate
        };
      });
      return res.json({ fixtures: fixturesList });
    } catch (error) {
      console.error("[upcoming-fixtures] error:", error);
      return res.status(500).json({ message: "Falha ao buscar jogos agendados" });
    }
  });
  app2.get("/api/leagues/:leagueId/standings", requireAuth4, async (req, res) => {
    const leagueId = Number.parseInt(String(req.params.leagueId || "").trim(), 10);
    if (!Number.isFinite(leagueId) || leagueId <= 0) {
      return res.status(400).json({ message: "leagueId inv\xE1lido" });
    }
    try {
      const season = parseSeasonParam(req.query.season);
      const teams4 = await storage.getAllTeams();
      const rows = teams4.slice().sort((a, b) => {
        if ((b.points ?? 0) !== (a.points ?? 0)) return (b.points ?? 0) - (a.points ?? 0);
        if ((b.wins ?? 0) !== (a.wins ?? 0)) return (b.wins ?? 0) - (a.wins ?? 0);
        const gdA = (a.goalsFor ?? 0) - (a.goalsAgainst ?? 0);
        const gdB = (b.goalsFor ?? 0) - (b.goalsAgainst ?? 0);
        if (gdB !== gdA) return gdB - gdA;
        return (b.goalsFor ?? 0) - (a.goalsFor ?? 0);
      }).map((t, i) => ({
        rank: i + 1,
        team: { id: i + 1, name: t.name, logo: t.logoUrl ?? null },
        points: t.points ?? 0,
        played: (t.wins ?? 0) + (t.draws ?? 0) + (t.losses ?? 0),
        win: t.wins ?? 0,
        draw: t.draws ?? 0,
        lose: t.losses ?? 0,
        goalsFor: t.goalsFor ?? 0,
        goalsAgainst: t.goalsAgainst ?? 0,
        goalsDiff: (t.goalsFor ?? 0) - (t.goalsAgainst ?? 0)
      }));
      return res.json({
        updatedAt: Date.now(),
        league: { id: leagueId, name: "Brasileir\xE3o S\xE9rie A", season },
        rows
      });
    } catch (error) {
      console.error("[meu-time][db] /standings error:", error);
      return res.status(500).json({ message: "Falha ao buscar tabela da liga" });
    }
  });
  app2.get("/api/teams", async (req, res) => {
    try {
      const teams4 = await storage.getAllTeams();
      res.json(teams4);
    } catch (error) {
      console.error("Get teams error:", error);
      res.status(500).json({ message: "Erro ao buscar times" });
    }
  });
  app2.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ message: "Time n\xE3o encontrado" });
      }
      const players2 = await storage.getPlayersByTeam(req.params.id);
      res.json({ ...team, players: players2 });
    } catch (error) {
      console.error("Get team error:", error);
      res.status(500).json({ message: "Erro ao buscar time" });
    }
  });
  app2.get("/api/teams/:teamId/players", requireAuth4, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inv\xE1lido" });
    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time n\xE3o encontrado" });
      const players2 = await storage.getPlayersByTeam(teamId);
      return res.json(players2);
    } catch (error) {
      console.error("Get team players error:", error);
      return res.status(500).json({ message: "Erro ao buscar elenco" });
    }
  });
  app2.get("/api/teams/:teamId/roster", requireAuth4, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inv\xE1lido" });
    const seasonParam = typeof req.query.season === "string" ? req.query.season.trim() : String((/* @__PURE__ */ new Date()).getFullYear());
    const season = /^\d{4}$/.test(seasonParam) ? Number.parseInt(seasonParam, 10) : (/* @__PURE__ */ new Date()).getFullYear();
    const position = typeof req.query.position === "string" ? req.query.position.trim() : void 0;
    const sector = typeof req.query.sector === "string" ? req.query.sector.trim() : void 0;
    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time n\xE3o encontrado" });
      const { getRosterByTeamAndSeason: getRosterByTeamAndSeason2, getRosterByTeamLegacy: getRosterByTeamLegacy2 } = await Promise.resolve().then(() => (init_roster_repo(), roster_repo_exports));
      let roster = await getRosterByTeamAndSeason2(teamId, season, { position, sector });
      if (roster.length === 0) {
        roster = await getRosterByTeamLegacy2(teamId, { position, sector });
      }
      return res.json({ roster, season, updatedAt: Date.now() });
    } catch (error) {
      console.error("Get roster error:", error);
      return res.status(500).json({ message: "Erro ao buscar elenco" });
    }
  });
  app2.get("/api/teams/:teamId/top-rated", requireAuth4, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inv\xE1lido" });
    const limit = parseLimitParam(req.query.limit, 3, 10);
    const lastN = Math.min(Math.max(parseInt(String(req.query.lastN ?? 5), 10) || 5, 3), 15);
    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time n\xE3o encontrado" });
      const { getTopRatedByTeam: getTopRatedByTeam2 } = await Promise.resolve().then(() => (init_players_repo(), players_repo_exports));
      const players2 = await getTopRatedByTeam2(teamId, { limit, lastNMatches: lastN });
      return res.json({ players: players2, lastNMatches: lastN, updatedAt: Date.now() });
    } catch (error) {
      console.error("Get top-rated error:", error);
      return res.status(500).json({ message: "Erro ao buscar top avaliados" });
    }
  });
  app2.get("/api/lineups/me", requireAuth4, async (req, res) => {
    const teamId = String(req.query.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId \xE9 obrigat\xF3rio" });
    try {
      const lineup = await storage.getUserLineup(req.session.userId, teamId);
      return res.json(lineup ?? null);
    } catch (error) {
      console.error("Get lineup error:", error);
      return res.status(500).json({ message: "Erro ao buscar t\xE1tica" });
    }
  });
  app2.post("/api/lineups/me", requireAuth4, async (req, res) => {
    const teamId = String(req.body?.teamId || "").trim();
    const formation = String(req.body?.formation || "4-3-3").trim();
    const slots = Array.isArray(req.body?.slots) ? req.body.slots : [];
    if (!teamId) return res.status(400).json({ message: "teamId \xE9 obrigat\xF3rio" });
    const validSlots = slots.filter((s) => typeof s?.slotIndex === "number" && typeof s?.playerId === "string").map((s) => ({ slotIndex: s.slotIndex, playerId: s.playerId }));
    try {
      const lineup = await storage.upsertUserLineup(req.session.userId, teamId, formation, validSlots);
      return res.json(lineup);
    } catch (error) {
      console.error("Save lineup error:", error);
      return res.status(500).json({ message: "Erro ao salvar t\xE1tica" });
    }
  });
  app2.get("/api/teams/:slug/squad", async (req, res) => {
    const slug = String(req.params.slug || "").trim().toLowerCase();
    if (!slug) return res.status(400).json({ message: "Team inv\xE1lido" });
    const season = parseSeasonParam(req.query.season);
    try {
      const dbTeam = await storage.getTeam(slug);
      if (!dbTeam) {
        return res.status(404).json({ message: "Time n\xE3o encontrado" });
      }
      const players2 = await storage.getPlayersByTeam(slug);
      return res.json({
        available: true,
        updatedAt: Date.now(),
        season,
        team: { id: 0, name: dbTeam.name, logo: dbTeam.logoUrl ?? null },
        coach: null,
        players: players2.map((p, idx) => ({
          id: idx + 1,
          name: p.name,
          position: p.position ?? null,
          age: null,
          nationality: p.nationalitySecondary ? `${p.nationalityPrimary} / ${p.nationalitySecondary}` : p.nationalityPrimary,
          photo: null
        }))
      });
    } catch (error) {
      console.error("[db] Failed to fetch squad", error);
      return res.status(500).json({ message: "Failed to fetch squad" });
    }
  });
  app2.get("/api/teams/:id/extended", requireAuth4, async (req, res) => {
    try {
      const teamId = req.params.id;
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Time n\xE3o encontrado" });
      }
      const [matches2, allTeams] = await Promise.all([
        storage.getMatchesByTeam(teamId, 20),
        storage.getAllTeams()
      ]);
      const stadium = {
        name: team.stadiumName ?? "Est\xE1dio Principal",
        capacity: team.stadiumCapacity ?? 5e4,
        pitchCondition: "Excelente",
        stadiumCondition: "Boa",
        homeFactor: 75,
        yearBuilt: team.foundedYear ?? 2e3
      };
      const clubInfo = {
        league: "Brasileir\xE3o S\xE9rie A",
        season: String((/* @__PURE__ */ new Date()).getFullYear()),
        country: "Brasil",
        clubStatus: "Profissional",
        reputation: 4
      };
      let corinthiansClub = null;
      const clubFile = teamId === "corinthians" ? "corinthians.club.json" : teamId === "palmeiras" ? "palmeiras.club.json" : null;
      if (clubFile) {
        try {
          const clubPath = path2.join(__dirname2, "data", clubFile);
          if (fs2.existsSync(clubPath)) {
            corinthiansClub = JSON.parse(fs2.readFileSync(clubPath, "utf-8"));
            if (corinthiansClub.stadium?.name) {
              stadium.name = corinthiansClub.stadium.name;
              stadium.capacity = corinthiansClub.stadium.capacity ?? stadium.capacity;
              stadium.yearBuilt = corinthiansClub.stadium.inaugurated ?? stadium.yearBuilt;
              stadium.homeFactor = 80;
            }
          }
        } catch (_) {
        }
      }
      res.json({
        team,
        players: [],
        matches: matches2,
        leagueTable: allTeams,
        stadium,
        clubInfo,
        corinthiansClub: corinthiansClub ?? void 0
      });
    } catch (error) {
      console.error("Team extended error:", error);
      res.status(500).json({ message: "Erro ao buscar dados do time" });
    }
  });
  app2.get("/api/teams/:teamId/upcoming-match", requireAuth4, async (req, res) => {
    try {
      const { teamId } = req.params;
      const match = await storage.getNextMatch(teamId);
      if (!match) {
        return res.json(null);
      }
      res.json({
        id: match.id,
        opponent: match.opponent,
        opponentLogoUrl: match.opponentLogoUrl ?? null,
        matchDate: match.matchDate,
        stadium: match.stadium ?? null,
        competition: match.competition ?? null,
        isHomeMatch: match.isHomeMatch,
        broadcastChannel: match.broadcastChannel ?? null
      });
    } catch (error) {
      console.error("Upcoming match error:", error);
      res.status(500).json({ message: "Erro ao buscar pr\xF3ximo jogo" });
    }
  });
  app2.get("/api/teams/:teamId/last-match", requireAuth4, async (req, res) => {
    try {
      const { teamId } = req.params;
      const data = await storage.getLastMatchWithRatings(teamId);
      if (!data) {
        return res.json({ match: null, players: [] });
      }
      res.json({
        match: {
          ...data.match,
          scoreFor: data.match.teamScore,
          scoreAgainst: data.match.opponentScore,
          homeAway: data.match.isHomeMatch ? "HOME" : "AWAY"
        },
        players: data.players
      });
    } catch (error) {
      console.error("Last match error:", error);
      res.status(500).json({ message: "Erro ao buscar \xFAltima partida" });
    }
  });
  app2.get("/api/teams/:teamId/last-match/ratings", requireAuth4, async (req, res) => {
    try {
      const { teamId } = req.params;
      const { getLastMatchRatings: getLastMatchRatings2 } = await Promise.resolve().then(() => (init_matches_repo(), matches_repo_exports));
      const data = await getLastMatchRatings2(teamId);
      if (!data) {
        return res.json({ match: null, playerRatings: [] });
      }
      res.json({
        match: {
          matchId: data.match.matchId,
          kickoffAt: data.match.kickoffAt,
          competitionName: data.match.competitionName,
          homeTeamName: data.match.homeTeamName,
          awayTeamName: data.match.awayTeamName,
          homeScore: data.match.homeScore,
          awayScore: data.match.awayScore
        },
        formation: data.formation,
        playerRatings: data.playerRatings
      });
    } catch (error) {
      console.error("Last match ratings error:", error);
      res.status(500).json({ message: "Erro ao buscar notas da \xFAltima partida" });
    }
  });
  app2.get("/api/teams/:teamId/last-match-for-rating", requireAuth4, async (req, res) => {
    try {
      const { teamId } = req.params;
      const userId = req.session?.userId;
      const { matches: matchesSchema, players: playersSchema, matchPlayers: matchPlayersSchema, playerRatings: playerRatingsSchema } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { sql: sqlExpr, avg, count } = await import("drizzle-orm");
      const [lastMatch] = await db.select().from(matchesSchema).where(and12(eq13(matchesSchema.teamId, teamId), eq13(matchesSchema.status, "COMPLETED"))).orderBy(desc9(matchesSchema.matchDate)).limit(1);
      if (!lastMatch) return res.json({ match: null, players: [] });
      const matchId = lastMatch.id;
      const mpRows = await db.select({
        playerId: matchPlayersSchema.playerId,
        wasStarter: matchPlayersSchema.wasStarter,
        minutesPlayed: matchPlayersSchema.minutesPlayed,
        positionCode: matchPlayersSchema.positionCode,
        name: playersSchema.name,
        knownName: playersSchema.knownName,
        shirtNumber: playersSchema.shirtNumber,
        position: playersSchema.position,
        primaryPosition: playersSchema.primaryPosition,
        sector: playersSchema.sector,
        photoUrl: playersSchema.photoUrl
      }).from(matchPlayersSchema).innerJoin(playersSchema, eq13(matchPlayersSchema.playerId, playersSchema.id)).where(eq13(matchPlayersSchema.matchId, matchId));
      let playerList = mpRows;
      if (playerList.length === 0) {
        const allPlayers = await db.select({
          playerId: playersSchema.id,
          wasStarter: sqlExpr`true`,
          minutesPlayed: sqlExpr`null`,
          positionCode: sqlExpr`null`,
          name: playersSchema.name,
          knownName: playersSchema.knownName,
          shirtNumber: playersSchema.shirtNumber,
          position: playersSchema.position,
          primaryPosition: playersSchema.primaryPosition,
          sector: playersSchema.sector,
          photoUrl: playersSchema.photoUrl
        }).from(playersSchema).where(eq13(playersSchema.teamId, teamId));
        playerList = allPlayers;
      }
      const SECTOR_ORDER = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
      const getSectorOrder = (p) => {
        const s = p.sector?.toUpperCase() ?? "";
        if (SECTOR_ORDER[s] !== void 0) return SECTOR_ORDER[s];
        const pos = (p.primaryPosition ?? p.position ?? "").toUpperCase();
        if (pos.includes("GK") || pos === "GOALKEEPER") return 0;
        if (pos.includes("CB") || pos.includes("LB") || pos.includes("RB") || pos.includes("DEF")) return 1;
        if (pos.includes("CM") || pos.includes("DM") || pos.includes("AM") || pos.includes("MID")) return 2;
        return 3;
      };
      const sorted = [...playerList].sort((a, b) => {
        const so = getSectorOrder(a) - getSectorOrder(b);
        if (so !== 0) return so;
        return (a.shirtNumber ?? 99) - (b.shirtNumber ?? 99);
      });
      const aggRows = await db.select({
        playerId: playerRatingsSchema.playerId,
        avgRating: avg(playerRatingsSchema.rating),
        voteCount: count(playerRatingsSchema.id)
      }).from(playerRatingsSchema).where(eq13(playerRatingsSchema.matchId, matchId)).groupBy(playerRatingsSchema.playerId);
      const aggMap = {};
      for (const r of aggRows) {
        aggMap[r.playerId] = { avgRating: Number(r.avgRating ?? 0), voteCount: Number(r.voteCount ?? 0) };
      }
      const myRatings = userId ? await storage.getUserRatingsForMatch(userId, matchId) : [];
      const myMap = {};
      for (const r of myRatings) myMap[r.playerId] = r.rating;
      res.json({
        match: {
          id: matchId,
          opponent: lastMatch.opponent,
          opponentLogoUrl: lastMatch.opponentLogoUrl ?? null,
          matchDate: lastMatch.matchDate,
          teamScore: lastMatch.teamScore,
          opponentScore: lastMatch.opponentScore,
          isHomeMatch: lastMatch.isHomeMatch,
          competition: lastMatch.competition ?? null,
          championshipRound: lastMatch.championshipRound ?? null
        },
        players: sorted.map((p) => ({
          playerId: p.playerId,
          name: p.name,
          knownName: p.knownName ?? null,
          shirtNumber: p.shirtNumber ?? null,
          position: p.primaryPosition ?? p.position ?? null,
          sector: p.sector ?? null,
          photoUrl: p.photoUrl ?? null,
          wasStarter: p.wasStarter ?? true,
          minutesPlayed: p.minutesPlayed ?? null,
          myRating: myMap[p.playerId] ?? null,
          communityAvg: aggMap[p.playerId]?.avgRating ?? null,
          voteCount: aggMap[p.playerId]?.voteCount ?? 0
        }))
      });
    } catch (error) {
      console.error("last-match-for-rating error:", error);
      res.status(500).json({ message: "Erro ao buscar partida para avalia\xE7\xE3o" });
    }
  });
  app2.get("/api/teams/:teamId/ratings/analytics", requireAuth4, async (req, res) => {
    try {
      const { teamId } = req.params;
      const months = Math.min(24, Math.max(1, parseInt(String(req.query.months ?? "6"), 10) || 6));
      const { matches: matchesSchema, players: playersSchema, playerRatings: playerRatingsSchema } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { sql: sqlExpr, avg, count, gte } = await import("drizzle-orm");
      const since = /* @__PURE__ */ new Date();
      since.setMonth(since.getMonth() - months);
      const rows = await db.select({
        matchId: playerRatingsSchema.matchId,
        playerId: playerRatingsSchema.playerId,
        rating: playerRatingsSchema.rating,
        createdAt: playerRatingsSchema.createdAt,
        competition: matchesSchema.competition,
        matchDate: matchesSchema.matchDate,
        opponent: matchesSchema.opponent,
        teamScore: matchesSchema.teamScore,
        opponentScore: matchesSchema.opponentScore
      }).from(playerRatingsSchema).innerJoin(matchesSchema, eq13(playerRatingsSchema.matchId, matchesSchema.id)).where(and12(
        eq13(matchesSchema.teamId, teamId),
        gte(playerRatingsSchema.createdAt, since)
      ));
      if (rows.length === 0) {
        return res.json({ byMonth: [], byCompetition: [], topPlayers: [], recentMatches: [] });
      }
      const monthMap = {};
      for (const r of rows) {
        const key = r.createdAt ? `${r.createdAt.getFullYear()}-${String(r.createdAt.getMonth() + 1).padStart(2, "0")}` : "unknown";
        if (!monthMap[key]) monthMap[key] = { total: 0, count: 0 };
        monthMap[key].total += r.rating;
        monthMap[key].count += 1;
      }
      const byMonth = Object.entries(monthMap).map(([month, d]) => ({ month, avgRating: +(d.total / d.count).toFixed(2), votes: d.count })).sort((a, b) => a.month.localeCompare(b.month));
      const compMap = {};
      for (const r of rows) {
        const key = r.competition ?? "Sem competi\xE7\xE3o";
        if (!compMap[key]) compMap[key] = { total: 0, count: 0 };
        compMap[key].total += r.rating;
        compMap[key].count += 1;
      }
      const byCompetition = Object.entries(compMap).map(([competition, d]) => ({ competition, avgRating: +(d.total / d.count).toFixed(2), votes: d.count })).sort((a, b) => b.avgRating - a.avgRating);
      const playerMap = {};
      for (const r of rows) {
        if (!playerMap[r.playerId]) playerMap[r.playerId] = { total: 0, count: 0 };
        playerMap[r.playerId].total += r.rating;
        playerMap[r.playerId].count += 1;
      }
      const topPlayerIds = Object.entries(playerMap).sort((a, b) => b[1].total / b[1].count - a[1].total / a[1].count).slice(0, 10).map(([id]) => id);
      const playerRows = topPlayerIds.length > 0 ? await db.select({ id: playersSchema.id, name: playersSchema.name, knownName: playersSchema.knownName, photoUrl: playersSchema.photoUrl, position: playersSchema.position, sector: playersSchema.sector }).from(playersSchema).where(sqlExpr`${playersSchema.id} = ANY(${topPlayerIds})`) : [];
      const topPlayers = topPlayerIds.map((id) => {
        const p = playerRows.find((x) => x.id === id);
        const d = playerMap[id];
        return {
          playerId: id,
          name: p?.knownName ?? p?.name ?? id,
          photoUrl: p?.photoUrl ?? null,
          position: p?.position ?? null,
          sector: p?.sector ?? null,
          avgRating: +(d.total / d.count).toFixed(2),
          votes: d.count
        };
      }).filter((p) => p.votes >= 1);
      const matchMap = {};
      for (const r of rows) {
        if (!matchMap[r.matchId]) matchMap[r.matchId] = { total: 0, count: 0, opponent: r.opponent, matchDate: r.matchDate, competition: r.competition ?? null, teamScore: r.teamScore ?? null, opponentScore: r.opponentScore ?? null };
        matchMap[r.matchId].total += r.rating;
        matchMap[r.matchId].count += 1;
      }
      const recentMatches = Object.entries(matchMap).map(([matchId, d]) => ({
        matchId,
        opponent: d.opponent,
        matchDate: d.matchDate,
        competition: d.competition,
        teamScore: d.teamScore,
        opponentScore: d.opponentScore,
        avgRating: +(d.total / d.count).toFixed(2),
        votes: d.count
      })).sort((a, b) => (b.matchDate?.getTime() ?? 0) - (a.matchDate?.getTime() ?? 0)).slice(0, 10);
      res.json({ byMonth, byCompetition, topPlayers, recentMatches });
    } catch (error) {
      console.error("ratings analytics error:", error);
      res.status(500).json({ message: "Erro ao buscar analytics de notas" });
    }
  });
  app2.get("/api/matches/:id", async (req, res) => {
    const matchId = req.params.id;
    try {
      const { getMatchDetails: getMatchDetails2 } = await Promise.resolve().then(() => (init_matches_repo(), matches_repo_exports));
      const details = await getMatchDetails2(matchId);
      if (details) {
        return res.json({
          match: details.match,
          events: details.events,
          lineups: details.lineups,
          playerStats: details.playerStats,
          teamStats: details.teamStats,
          source: "match_games"
        });
      }
      const match = await storage.getMatch(matchId);
      if (!match) {
        return res.status(404).json({ message: "Partida n\xE3o encontrada" });
      }
      res.json({ match, source: "legacy" });
    } catch (error) {
      console.error("Get match error:", error);
      res.status(500).json({ message: "Erro ao buscar partida" });
    }
  });
  app2.get("/api/matches/:id/lineup", async (req, res) => {
    const matchId = req.params.id;
    try {
      const lineup = await storage.getMatchLineup(matchId);
      if (!lineup) {
        return res.status(404).json({ message: "Escala\xE7\xE3o n\xE3o encontrada" });
      }
      if (process.env.NODE_ENV !== "production") {
        console.debug("[GET /api/matches/:id/lineup]", { matchId, startersCount: lineup.starters?.length ?? 0, substitutesCount: lineup.substitutes?.length ?? 0 });
      }
      res.json(lineup);
    } catch (error) {
      console.error("Get match lineup error:", error);
      res.status(500).json({ message: "Erro ao buscar escala\xE7ao" });
    }
  });
  app2.get("/api/matches/:id/ratings", async (req, res) => {
    const matchId = req.params.id;
    try {
      const ratings = await storage.getRatingsByMatch(matchId);
      const payload = ratings.map((r) => ({
        playerId: r.playerId,
        avgRating: r.average,
        voteCount: r.count
      }));
      if (process.env.NODE_ENV !== "production") {
        console.debug("[GET /api/matches/:id/ratings]", { matchId, playersWithAvgRating: payload.length });
      }
      res.json(payload);
    } catch (error) {
      console.error("Get match ratings error:", error);
      res.status(500).json({ message: "Erro ao buscar notas" });
    }
  });
  app2.get("/api/matches/:id/my-ratings", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const ratings = await storage.getUserRatingsForMatch(userId, req.params.id);
      const payload = ratings.map((r) => ({ playerId: r.playerId, rating: r.rating }));
      res.json(payload);
    } catch (error) {
      console.error("Get my ratings error:", error);
      res.status(500).json({ message: "Erro ao buscar suas notas" });
    }
  });
  app2.post("/api/ratings", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { matchId, playerId, rating } = req.body ?? {};
      if (!matchId || !playerId || typeof rating !== "number") {
        return res.status(400).json({ message: "matchId, playerId e rating s\xE3o obrigat\xF3rios" });
      }
      if (rating < 0 || rating > 10) {
        return res.status(400).json({ message: "A nota deve estar entre 0 e 10." });
      }
      const r = Math.min(10, Math.max(0, rating));
      const step = Math.round(r * 2) / 2;
      const match = await storage.getMatch(matchId);
      if (!match) {
        return res.status(404).json({ message: "Partida n\xE3o encontrada" });
      }
      const player = await storage.getPlayer(playerId);
      if (!player) {
        return res.status(404).json({ message: "Jogador n\xE3o encontrado" });
      }
      const existing = await storage.getUserRatingForPlayerInMatch(userId, matchId, playerId);
      if (existing) {
        return res.status(409).json({ message: "Voc\xEA j\xE1 avaliou este jogador nesta partida." });
      }
      const created = await storage.createPlayerRating({ userId, playerId, matchId, rating: step });
      const byMatch = await storage.getRatingsByMatch(matchId);
      const thisPlayer = byMatch.find((x) => x.playerId === playerId);
      res.status(201).json({
        playerId: created.playerId,
        matchId: created.matchId,
        rating: created.rating,
        voteCount: thisPlayer?.count ?? 0
      });
    } catch (error) {
      console.error("Create rating error:", error);
      if (error?.code === "23505") {
        return res.status(409).json({ message: "Voc\xEA j\xE1 avaliou este jogador nesta partida." });
      }
      res.status(400).json({ message: error?.message ?? "Erro ao salvar nota" });
    }
  });
  app2.get("/api/matches/:teamId/recent", async (req, res) => {
    try {
      const { teamId } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      const matches2 = await storage.getMatchesByTeam(teamId, limit);
      res.json(matches2);
    } catch (error) {
      console.error("Get recent matches error:", error);
      res.status(500).json({ message: "Erro ao buscar partidas" });
    }
  });
  app2.post("/api/uploads/image", requireAuth4, requireJournalist, (req, res) => {
    uploadImage.single("file")(req, res, (err) => {
      if (err) {
        const isTooLarge = err?.code === "LIMIT_FILE_SIZE";
        const message = isTooLarge ? "Arquivo muito grande. Tamanho m\xE1ximo: 5MB." : err?.message || "Erro ao enviar imagem.";
        return res.status(400).json({ message });
      }
      const file = req.file;
      if (!file?.filename) {
        return res.status(400).json({ message: 'Campo "file" \xE9 obrigat\xF3rio.' });
      }
      return res.json({ imageUrl: `/uploads/${file.filename}` });
    });
  });
  app2.post("/api/uploads/post-image", requireAuth4, (req, res) => {
    uploadImage.single("file")(req, res, (err) => {
      if (err) {
        const isTooLarge = err?.code === "LIMIT_FILE_SIZE";
        const message = isTooLarge ? "Arquivo muito grande. Tamanho m\xE1ximo: 5MB." : err?.message || "Erro ao enviar imagem.";
        return res.status(400).json({ message });
      }
      const file = req.file;
      if (!file?.filename) {
        return res.status(400).json({ message: 'Campo "file" \xE9 obrigat\xF3rio.' });
      }
      return res.json({ imageUrl: `/uploads/${file.filename}` });
    });
  });
  app2.post("/api/uploads/news-image", requireJournalist, (req, res) => {
    uploadNewsImage.single("image")(req, res, (err) => {
      if (err) {
        const isTooLarge = err?.code === "LIMIT_FILE_SIZE";
        const message = isTooLarge ? "Arquivo muito grande. Tamanho m\xE1ximo: 5MB." : err?.message || "Erro ao enviar imagem.";
        return res.status(400).json({ message });
      }
      const file = req.file;
      if (!file?.filename) {
        return res.status(400).json({ message: 'Campo "image" \xE9 obrigat\xF3rio.' });
      }
      return res.json({ imageUrl: `/uploads/${file.filename}` });
    });
  });
  app2.get("/api/news", async (req, res) => {
    try {
      const scopeParam = typeof req.query.scope === "string" ? req.query.scope.trim().toLowerCase() : void 0;
      const teamIdParam = typeof req.query.teamId === "string" ? req.query.teamId.trim() : void 0;
      const filterParam = typeof req.query.filter === "string" ? req.query.filter.trim() : void 0;
      const limitParam = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : void 0;
      const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 50;
      let scope;
      let userTeamId;
      if (scopeParam === "all" || scopeParam === "team" || scopeParam === "europe") {
        scope = scopeParam;
        if (scope === "team" && req.session.userId) {
          const user = await storage.getUser(req.session.userId);
          userTeamId = user?.teamId ?? void 0;
        }
      } else {
        let effectiveTeamId = teamIdParam || void 0;
        if (!effectiveTeamId && filterParam && filterParam !== "all" && filterParam !== "my-team") {
          effectiveTeamId = filterParam;
        }
        if (!effectiveTeamId && filterParam === "my-team" && req.session.userId) {
          const user = await storage.getUser(req.session.userId);
          effectiveTeamId = user?.teamId || void 0;
        }
        if (effectiveTeamId) {
          scope = "team";
          userTeamId = effectiveTeamId;
        } else {
          scope = "all";
        }
      }
      const newsItems = await storage.getAllNews({ scope, userTeamId, limit });
      if (req.session.userId) {
        for (const newsItem of newsItems) {
          const interaction = await storage.getUserNewsInteraction(req.session.userId, newsItem.id);
          newsItem.userInteraction = interaction?.interactionType || null;
        }
      }
      res.json(newsItems);
    } catch (error) {
      console.error("Get news error:", error);
      res.status(500).json({ message: "Erro ao buscar not\xEDcias" });
    }
  });
  app2.get("/api/news/my-news", requireAuth4, requireJournalist, async (req, res) => {
    try {
      const journalist = await storage.getJournalist(req.session.userId);
      if (!journalist) {
        return res.status(404).json({ message: "Jornalista n\xE3o encontrado" });
      }
      const newsItems = await storage.getNewsByJournalist(journalist.id);
      const enrichedNews = await Promise.all(
        newsItems.map(async (newsItem) => {
          const team = newsItem.teamId ? await storage.getTeam(newsItem.teamId) : null;
          return { ...newsItem, team: team ?? null };
        })
      );
      res.json(enrichedNews);
    } catch (error) {
      console.error("Get my news error:", error);
      res.status(500).json({ message: "Erro ao buscar suas not\xEDcias" });
    }
  });
  app2.post("/api/news", requireAuth4, requireJournalist, async (req, res) => {
    try {
      const journalist = await storage.getJournalist(req.session.userId);
      if (!journalist) {
        return res.status(404).json({ message: "Jornalista n\xE3o encontrado" });
      }
      const me = await storage.getUser(req.session.userId);
      if (!me) {
        return res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const parsed = insertNewsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors?.[0]?.message ?? "Dados inv\xE1lidos" });
      }
      const newsData = parsed.data;
      const scope = (newsData.scope ?? "ALL").toUpperCase();
      if (scope === "TEAM") {
        if (!me.teamId) {
          return res.status(400).json({ message: "Para publicar no feed do time, selecione um time no seu perfil." });
        }
        newsData.teamId = me.teamId;
      } else if (scope === "EUROPE") {
        newsData.teamId = newsData.teamId ?? null;
      } else {
        newsData.teamId = newsData.teamId ?? me.teamId ?? null;
      }
      const newsItem = await storage.createNews({
        ...newsData,
        scope,
        journalistId: journalist.id
      });
      res.status(201).json({
        id: newsItem.id,
        journalistId: newsItem.journalistId,
        teamId: newsItem.teamId ?? null,
        scope: newsItem.scope,
        title: newsItem.title,
        content: newsItem.content,
        category: newsItem.category,
        imageUrl: newsItem.imageUrl,
        createdAt: newsItem.createdAt,
        publishedAt: newsItem.publishedAt,
        likesCount: newsItem.likesCount,
        dislikesCount: newsItem.dislikesCount
      });
    } catch (error) {
      console.error("Create news error:", error);
      res.status(400).json({ message: error.message || "Erro ao criar not\xEDcia" });
    }
  });
  app2.patch("/api/news/:id", requireAuth4, requireJournalist, async (req, res) => {
    try {
      const journalist = await storage.getJournalist(req.session.userId);
      if (!journalist) {
        return res.status(404).json({ message: "Jornalista n\xE3o encontrado" });
      }
      const newsItem = await storage.getNewsById(req.params.id);
      if (!newsItem) {
        return res.status(404).json({ message: "Not\xEDcia n\xE3o encontrada" });
      }
      if (newsItem.journalistId !== journalist.id) {
        return res.status(403).json({ message: "Acesso negado. Voc\xEA s\xF3 pode editar suas pr\xF3prias not\xEDcias." });
      }
      const me = await storage.getUser(req.session.userId);
      if (!me) {
        return res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const raw = insertNewsSchema.partial().parse(req.body);
      const updateData = { ...raw };
      if (raw.scope !== void 0) {
        const scope = String(raw.scope).toUpperCase();
        if (scope === "TEAM") {
          if (!me.teamId) {
            return res.status(400).json({ message: "Para publicar no feed do time, selecione um time no seu perfil." });
          }
          updateData.teamId = me.teamId;
        } else if (scope === "EUROPE") {
          updateData.teamId = raw.teamId ?? null;
        }
        updateData.scope = scope;
      }
      const updatedNews = await storage.updateNews(req.params.id, updateData);
      if (!updatedNews) {
        return res.status(404).json({ message: "Not\xEDcia n\xE3o encontrada" });
      }
      res.json(updatedNews);
    } catch (error) {
      console.error("Update news error:", error);
      res.status(400).json({ message: error.message || "Erro ao atualizar not\xEDcia" });
    }
  });
  app2.delete("/api/news/:id", requireAuth4, requireJournalist, async (req, res) => {
    try {
      const journalist = await storage.getJournalist(req.session.userId);
      if (!journalist) {
        return res.status(404).json({ message: "Jornalista n\xE3o encontrado" });
      }
      const newsItem = await storage.getNewsById(req.params.id);
      if (!newsItem) {
        return res.status(404).json({ message: "Not\xEDcia n\xE3o encontrada" });
      }
      if (newsItem.journalistId !== journalist.id) {
        return res.status(403).json({ message: "Acesso negado. Voc\xEA s\xF3 pode excluir suas pr\xF3prias not\xEDcias." });
      }
      await storage.deleteNews(req.params.id);
      res.json({ message: "Not\xEDcia exclu\xEDda com sucesso" });
    } catch (error) {
      console.error("Delete news error:", error);
      res.status(500).json({ message: "Erro ao excluir not\xEDcia" });
    }
  });
  app2.post("/api/news/:id/interaction", requireAuth4, async (req, res) => {
    try {
      const { type } = req.body;
      if (type !== "LIKE" && type !== "DISLIKE") {
        return res.status(400).json({ message: "type inv\xE1lido. Use LIKE ou DISLIKE." });
      }
      const newsId = req.params.id;
      const userId = req.session.userId;
      const existing = await storage.getUserNewsInteraction(userId, newsId);
      if (existing) {
        if (existing.interactionType === type) {
          await storage.deleteNewsInteraction(userId, newsId);
          await storage.recalculateNewsCounts(newsId);
          return res.json({ message: "Intera\xE7\xE3o removida" });
        } else {
          await storage.deleteNewsInteraction(userId, newsId);
        }
      }
      const interaction = await storage.createNewsInteraction({
        userId,
        newsId,
        interactionType: type
      });
      await storage.recalculateNewsCounts(newsId);
      await storage.checkAndAwardBadges(userId);
      res.status(201).json(interaction);
    } catch (error) {
      console.error("Create interaction error:", error);
      res.status(500).json({ message: "Erro ao registrar intera\xE7\xE3o" });
    }
  });
  app2.get("/api/news/:newsId/comments", async (req, res) => {
    try {
      const newsId = req.params.newsId;
      const viewerUserId = req.session?.userId ?? null;
      const list = await storage.listCommentsByNewsId(newsId, viewerUserId);
      return res.json(list);
    } catch (error) {
      console.error("List comments error:", error?.message ?? error);
      if (error?.stack) console.error(error.stack);
      return res.status(500).json({ message: "Erro ao buscar coment\xE1rios" });
    }
  });
  app2.post("/api/news/:newsId/comments", requireAuth4, async (req, res) => {
    const newsId = req.params.newsId;
    const userId = req.session?.userId;
    if (process.env.NODE_ENV === "development") {
      console.log("COMMENT REQUEST", { userId, newsId, body: req.body });
    }
    try {
      if (!userId) {
        return res.status(401).json({ message: "N\xE3o autenticado" });
      }
      const parsed = insertCommentSchema.parse(req.body);
      const content = (parsed.content ?? "").trim();
      if (!content) {
        return res.status(400).json({ message: "Conte\xFAdo do coment\xE1rio \xE9 obrigat\xF3rio." });
      }
      const newsItem = await storage.getNewsById(newsId);
      if (!newsItem) {
        return res.status(404).json({ message: "Publica\xE7\xE3o n\xE3o encontrada." });
      }
      const me = await storage.getUser(userId);
      if (!me) {
        return res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado." });
      }
      const scope = newsItem.scope ?? "ALL";
      let canComment;
      if (scope === "EUROPE") {
        canComment = true;
      } else if (scope === "TEAM") {
        canComment = me.teamId != null && me.teamId === newsItem.teamId || isAdmin(me);
      } else {
        canComment = true;
      }
      if (!canComment) {
        return res.status(403).json({
          message: "Apenas torcedores do mesmo time do autor podem comentar nesta publica\xE7\xE3o."
        });
      }
      const comment = await storage.createComment({ newsId, userId, content });
      if (!comment) {
        console.error("Create comment: storage returned no comment");
        return res.status(500).json({ message: "Erro ao criar coment\xE1rio" });
      }
      return res.status(201).json({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: { name: me.name, avatarUrl: me.avatarUrl ?? null },
        likeCount: 0,
        viewerHasLiked: false
      });
    } catch (error) {
      if (error?.name === "ZodError") {
        return res.status(400).json({ message: error.errors?.[0]?.message ?? "Dados inv\xE1lidos" });
      }
      console.error("Create comment error:", error?.message ?? error);
      if (error?.stack) console.error(error.stack);
      return res.status(500).json({ message: "Erro ao criar coment\xE1rio" });
    }
  });
  app2.post("/api/comments/:commentId/likes", requireAuth4, async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.session.userId;
      const comment = await storage.getComment(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Coment\xE1rio n\xE3o encontrado." });
      }
      const newsItem = await storage.getNewsById(comment.newsId);
      if (!newsItem) {
        return res.status(404).json({ message: "Publica\xE7\xE3o n\xE3o encontrada." });
      }
      const me = await storage.getUser(userId);
      if (!me) {
        return res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado." });
      }
      const scope = newsItem.scope ?? "ALL";
      const canLike = scope === "EUROPE" || me.teamId != null && me.teamId === newsItem.teamId || isAdmin(me);
      if (!canLike) {
        return res.status(403).json({
          message: "Apenas torcedores do mesmo time da publica\xE7\xE3o podem curtir coment\xE1rios."
        });
      }
      await storage.addCommentLike(commentId, userId);
      return res.status(201).json({ message: "Curtida registrada" });
    } catch (error) {
      console.error("Like comment error:", error);
      return res.status(500).json({ message: "Erro ao curtir coment\xE1rio" });
    }
  });
  app2.delete("/api/comments/:commentId/likes", requireAuth4, async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.session.userId;
      const comment = await storage.getComment(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Coment\xE1rio n\xE3o encontrado." });
      }
      const newsItem = await storage.getNewsById(comment.newsId);
      if (!newsItem) {
        return res.status(404).json({ message: "Publica\xE7\xE3o n\xE3o encontrada." });
      }
      const me = await storage.getUser(userId);
      if (!me) {
        return res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado." });
      }
      const scope = newsItem.scope ?? "ALL";
      const canLike = scope === "EUROPE" || me.teamId != null && me.teamId === newsItem.teamId || isAdmin(me);
      if (!canLike) {
        return res.status(403).json({
          message: "Apenas torcedores do mesmo time da publica\xE7\xE3o podem remover curtida."
        });
      }
      await storage.removeCommentLike(commentId, userId);
      return res.json({ message: "Curtida removida" });
    } catch (error) {
      console.error("Unlike comment error:", error);
      return res.status(500).json({ message: "Erro ao remover curtida" });
    }
  });
  app2.post("/api/players/:id/ratings", requireAuth4, async (req, res) => {
    try {
      const playerId = req.params.id;
      const userId = req.session.userId;
      const ratingData = insertPlayerRatingSchema.parse(req.body);
      const rating = await storage.createPlayerRating({
        ...ratingData,
        playerId,
        userId
      });
      await storage.checkAndAwardBadges(userId);
      res.status(201).json(rating);
    } catch (error) {
      console.error("Create rating error:", error);
      res.status(400).json({ message: error.message || "Erro ao criar avalia\xE7\xE3o" });
    }
  });
  app2.get("/api/players/search", async (req, res) => {
    try {
      const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
      const limit = typeof req.query.limit === "string" ? Math.min(parseInt(req.query.limit, 10) || 10, 20) : 10;
      const players2 = await storage.searchPlayers(q, limit);
      res.json(players2);
    } catch (error) {
      console.error("Search players error:", error);
      res.status(500).json({ message: "Erro ao buscar jogadores" });
    }
  });
  app2.get("/api/players/:id/ratings", async (req, res) => {
    try {
      const ratings = await storage.getPlayerRatings(req.params.id);
      const average = await storage.getPlayerAverageRating(req.params.id);
      res.json({ ratings, average });
    } catch (error) {
      console.error("Get ratings error:", error);
      res.status(500).json({ message: "Erro ao buscar avalia\xE7\xF5es" });
    }
  });
  app2.post("/api/profile/avatar", requireAuth4, (req, res) => {
    uploadAvatar.single("file")(req, res, async (err) => {
      if (err) {
        const isTooLarge = err?.code === "LIMIT_FILE_SIZE";
        const message = isTooLarge ? "Arquivo muito grande. Tamanho m\xE1ximo: 2MB." : err?.message || "Erro ao enviar avatar.";
        return res.status(400).json({ message });
      }
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'Campo "file" \xE9 obrigat\xF3rio.' });
      }
      const userId = req.session.userId;
      try {
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado" });
        }
        const oldUrl = user.avatarUrl ?? null;
        const { avatarUrl } = await saveAvatar(file);
        const updated = await storage.updateUser(userId, { avatarUrl });
        if (!updated) {
          await deleteAvatarByUrl(avatarUrl).catch(() => void 0);
          return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
        }
        if (oldUrl && oldUrl !== avatarUrl) {
          deleteAvatarByUrl(oldUrl).catch(() => void 0);
        }
        return res.json({ avatarUrl });
      } catch (error) {
        console.error("Upload avatar error:", error);
        return res.status(400).json({ message: error?.message || "Erro ao enviar avatar." });
      }
    });
  });
  app2.delete("/api/profile/avatar", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const oldUrl = user.avatarUrl ?? null;
      await storage.updateUser(userId, { avatarUrl: null });
      deleteAvatarByUrl(oldUrl).catch(() => void 0);
      return res.json({ avatarUrl: null });
    } catch (error) {
      console.error("Remove avatar error:", error);
      return res.status(500).json({ message: "Erro ao remover avatar" });
    }
  });
  app2.put("/api/profile", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const { handle, bio, location, website, coverPhotoUrl, name, email } = req.body;
      const updates = {};
      if (name !== void 0) updates.name = name;
      if (email !== void 0) updates.email = email;
      if (bio !== void 0) updates.bio = bio || null;
      if (location !== void 0) updates.location = location || null;
      if (website !== void 0) updates.website = website || null;
      if (coverPhotoUrl !== void 0) updates.coverPhotoUrl = coverPhotoUrl || null;
      if (handle !== void 0 && handle !== null && String(handle).trim()) {
        const h = String(handle).trim().toLowerCase();
        if (!/^[a-z0-9_]{3,30}$/.test(h)) {
          return res.status(400).json({ message: "Handle inv\xE1lido. Use 3-30 caracteres: letras min\xFAsculas, n\xFAmeros e underscores." });
        }
        const existing = await storage.getUserByHandle(h);
        if (existing && existing.id !== userId) {
          return res.status(409).json({ message: "Este handle j\xE1 est\xE1 em uso" });
        }
        updates.handle = h;
      }
      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const { password: _p, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  });
  app2.put("/api/profile/password", requireAuth4, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Senha atual incorreta" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(userId, { password: hashedPassword });
      res.json({ message: "Senha alterada com sucesso" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Erro ao alterar senha" });
    }
  });
  app2.get("/api/badges", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const userBadges2 = await storage.getUserBadges(userId);
      const allBadges = await storage.getAllBadges();
      const badgesWithStatus = allBadges.map((badge) => {
        const userBadge = userBadges2.find((ub) => ub.badge.id === badge.id);
        return {
          ...badge,
          unlocked: !!userBadge,
          earnedAt: userBadge?.earnedAt || null
        };
      });
      res.json(badgesWithStatus);
    } catch (error) {
      console.error("Get badges error:", error);
      res.status(500).json({ message: "Erro ao buscar badges" });
    }
  });
  app2.post("/api/badges/check", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const newBadges = await storage.checkAndAwardBadges(userId);
      res.json(newBadges);
    } catch (error) {
      console.error("Check badges error:", error);
      res.status(500).json({ message: "Erro ao verificar badges" });
    }
  });
  app2.get("/api/notifications", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const notifications2 = await storage.getUserNotifications(userId);
      res.json(notifications2);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Erro ao buscar notifica\xE7\xF5es" });
    }
  });
  app2.get("/api/notifications/unread-count", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Get unread count error:", error);
      res.status(500).json({ message: "Erro ao buscar contador" });
    }
  });
  app2.post("/api/notifications/:id/read", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const updated = await storage.markNotificationAsRead(userId, req.params.id);
      if (!updated) {
        return res.status(404).json({ message: "Notifica\xE7\xE3o n\xE3o encontrada" });
      }
      res.json({ message: "Notifica\xE7\xE3o marcada como lida" });
    } catch (error) {
      console.error("Mark as read error:", error);
      res.status(500).json({ message: "Erro ao marcar como lida" });
    }
  });
  app2.post("/api/notifications/mark-all-read", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ message: "Todas as notifica\xE7\xF5es marcadas como lidas" });
    } catch (error) {
      console.error("Mark all as read error:", error);
      res.status(500).json({ message: "Erro ao marcar todas como lidas" });
    }
  });
  app2.get("/api/journalist-application/status", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const journalist = await storage.getJournalist(userId);
      if (!journalist) {
        return res.json({ status: null });
      }
      res.json({
        status: journalist.status,
        organization: journalist.organization,
        professionalId: journalist.professionalId,
        portfolioUrl: journalist.portfolioUrl,
        createdAt: journalist.createdAt
      });
    } catch (error) {
      console.error("Journalist application status error:", error);
      res.status(500).json({ message: "Erro ao buscar status" });
    }
  });
  const applySchema = z2.object({
    organization: z2.string().min(2).max(255),
    professionalId: z2.string().min(2).max(100),
    portfolioUrl: z2.string().url().optional().or(z2.literal(""))
  });
  app2.post("/api/journalist-application/apply", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const parsed = applySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Dados inv\xE1lidos.", errors: parsed.error.flatten() });
      }
      const { organization, professionalId, portfolioUrl } = parsed.data;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      if (user.userType === "JOURNALIST" || user.userType === "ADMIN") {
        return res.status(400).json({ message: "Voc\xEA j\xE1 \xE9 jornalista." });
      }
      const existingJournalist = await storage.getJournalist(userId);
      if (existingJournalist) {
        if (existingJournalist.status === "PENDING" || existingJournalist.status === "APPROVED") {
          return res.status(409).json({ message: "Voc\xEA j\xE1 possui uma solicita\xE7\xE3o em andamento." });
        }
        if (existingJournalist.status === "REJECTED") {
          await storage.deleteJournalistByUserId(userId);
        }
      }
      await storage.createJournalist({
        userId,
        organization,
        professionalId,
        portfolioUrl: portfolioUrl || null
      });
      res.status(201).json({ message: "Solicita\xE7\xE3o enviada com sucesso.", status: "PENDING" });
    } catch (error) {
      console.error("Journalist application apply error:", error);
      res.status(500).json({ message: "Erro ao enviar solicita\xE7\xE3o" });
    }
  });
  app2.get("/api/admin/journalist-applications", requireAuth4, requireAdmin, async (req, res) => {
    try {
      const rows = await db.select({
        journalistId: journalists.id,
        userId: journalists.userId,
        userName: users.name,
        userHandle: users.handle,
        userAvatarUrl: users.avatarUrl,
        userTeamId: users.teamId,
        organization: journalists.organization,
        professionalId: journalists.professionalId,
        portfolioUrl: journalists.portfolioUrl,
        createdAt: journalists.createdAt
      }).from(journalists).innerJoin(users, eq13(journalists.userId, users.id)).where(eq13(journalists.status, "PENDING")).orderBy(asc2(journalists.createdAt));
      const result = rows.map((r) => ({
        journalistId: r.journalistId,
        userId: r.userId,
        userName: r.userName,
        userHandle: r.userHandle ?? "",
        userAvatarUrl: r.userAvatarUrl ?? null,
        userTeamId: r.userTeamId ?? null,
        organization: r.organization,
        professionalId: r.professionalId,
        portfolioUrl: r.portfolioUrl ?? null,
        createdAt: r.createdAt
      }));
      res.json(result);
    } catch (error) {
      console.error("Admin journalist applications error:", error);
      res.status(500).json({ message: "Erro ao buscar solicita\xE7\xF5es" });
    }
  });
  app2.get("/api/admin/users/search", requireAuth4, requireAdmin, async (req, res) => {
    try {
      const q = req.query.q?.trim() ?? "";
      const results = await storage.searchUsersForAdmin(q, 10);
      res.json(results);
    } catch (error) {
      console.error("Admin users search error:", error);
      res.status(500).json({ message: "Erro ao buscar usu\xE1rios" });
    }
  });
  const adminJournalistActionSchema = { action: ["approve", "reject", "revoke", "promote"] };
  app2.patch("/api/admin/journalists/:userId", requireAuth4, requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const { action } = req.body;
      const adminUserId = req.session.userId;
      if (!action || !adminJournalistActionSchema.action.includes(action)) {
        return res.status(400).json({ message: "action inv\xE1lida. Use approve, reject, revoke ou promote." });
      }
      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const journalist = await storage.getJournalist(userId);
      if (action === "promote") {
        if (journalist) {
          return res.status(400).json({ message: "Usu\xE1rio j\xE1 possui registro de jornalista" });
        }
        await storage.createJournalist({
          userId,
          organization: "A ser definido",
          professionalId: "N/A"
        });
        if (targetUser.userType !== "ADMIN") {
          await storage.updateUser(userId, { userType: "JOURNALIST" });
        }
        return res.json({ message: "Usu\xE1rio promovido a jornalista (pendente)" });
      }
      if (action === "revoke") {
        if (!journalist) {
          return res.status(400).json({ message: "Usu\xE1rio n\xE3o \xE9 jornalista" });
        }
        if (userId === adminUserId && isAdmin(targetUser)) {
          return res.status(403).json({ message: "N\xE3o \xE9 permitido revogar seu pr\xF3prio status de administrador." });
        }
        await storage.deleteJournalistByUserId(userId);
        if (targetUser.userType !== "ADMIN") {
          await storage.updateUser(userId, { userType: "FAN" });
        }
        return res.json({ message: "Status de jornalista revogado" });
      }
      if (action === "approve") {
        if (!journalist) {
          await storage.createJournalist({
            userId,
            organization: "A ser definido",
            professionalId: "N/A"
          });
          await storage.updateJournalistByUserId(userId, { status: "APPROVED", verificationDate: /* @__PURE__ */ new Date() });
          if (targetUser.userType !== "ADMIN") {
            await storage.updateUser(userId, { userType: "JOURNALIST" });
          }
          return res.json({ message: "Jornalista aprovado" });
        }
        await storage.updateJournalistByUserId(userId, { status: "APPROVED", verificationDate: /* @__PURE__ */ new Date() });
        if (targetUser.userType !== "ADMIN") {
          await storage.updateUser(userId, { userType: "JOURNALIST" });
        }
        return res.json({ message: "Jornalista aprovado" });
      }
      if (action === "reject") {
        if (!journalist) {
          return res.status(400).json({ message: "Usu\xE1rio n\xE3o possui registro de jornalista" });
        }
        await storage.updateJournalistByUserId(userId, { status: "REJECTED" });
        return res.json({ message: "Jornalista rejeitado" });
      }
      res.status(400).json({ message: "action inv\xE1lida" });
    } catch (error) {
      console.error("Admin journalist action error:", error);
      res.status(500).json({ message: error.message || "Erro ao executar a\xE7\xE3o" });
    }
  });
  app2.post("/api/admin/standings/recalculate", requireAuth4, requireAdmin, async (req, res) => {
    try {
      await storage.updateTeamStandings();
      res.json({ message: "Classifica\xE7\xE3o recalculada com sucesso" });
    } catch (error) {
      console.error("Recalculate standings error:", error);
      res.status(500).json({ message: "Erro ao recalcular classifica\xE7\xE3o" });
    }
  });
  app2.post("/api/admin/brasileirao-2026/seed", requireAuth4, requireAdmin, async (req, res) => {
    try {
      const STANDINGS = {
        "palmeiras": [16, 7, 5, 1, 1, 16, 7],
        "sao-paulo": [16, 7, 5, 1, 1, 14, 8],
        "bahia": [14, 7, 4, 2, 1, 10, 5],
        "flamengo": [13, 7, 4, 1, 2, 15, 8],
        "fluminense": [13, 7, 4, 1, 2, 14, 10],
        "coritiba": [13, 7, 4, 1, 2, 10, 7],
        "gremio": [11, 7, 3, 2, 2, 10, 9],
        "atletico-mineiro": [10, 7, 3, 1, 3, 11, 10],
        "vasco-da-gama": [10, 7, 3, 1, 3, 11, 11],
        "athletico-paranaense": [9, 7, 3, 0, 4, 9, 12],
        "vitoria": [8, 7, 2, 2, 3, 8, 10],
        "chapecoense": [8, 7, 2, 2, 3, 8, 10],
        "bragantino": [7, 7, 2, 1, 4, 8, 12],
        "corinthians": [7, 7, 2, 1, 4, 7, 11],
        "mirassol": [6, 7, 1, 3, 3, 8, 10],
        "santos": [6, 7, 1, 3, 3, 7, 9],
        "internacional": [5, 7, 1, 2, 4, 5, 10],
        "botafogo": [5, 7, 1, 2, 4, 5, 11],
        "cruzeiro": [3, 7, 1, 0, 6, 5, 13],
        "remo": [3, 7, 1, 0, 6, 4, 17]
      };
      const SERIE_A_2026_TEAMS = [
        { id: "flamengo", name: "Flamengo", shortName: "FLA", logoUrl: "https://media.api-sports.io/football/teams/127.png" },
        { id: "palmeiras", name: "Palmeiras", shortName: "PAL", logoUrl: "https://media.api-sports.io/football/teams/121.png" },
        { id: "corinthians", name: "Corinthians", shortName: "COR", logoUrl: "https://media.api-sports.io/football/teams/131.png" },
        { id: "botafogo", name: "Botafogo", shortName: "BOT", logoUrl: "https://media.api-sports.io/football/teams/120.png" },
        { id: "fluminense", name: "Fluminense", shortName: "FLU", logoUrl: "https://media.api-sports.io/football/teams/124.png" },
        { id: "sao-paulo", name: "S\xE3o Paulo", shortName: "SAO", logoUrl: "https://media.api-sports.io/football/teams/126.png" },
        { id: "internacional", name: "Internacional", shortName: "INT", logoUrl: "https://media.api-sports.io/football/teams/119.png" },
        { id: "gremio", name: "Gr\xEAmio", shortName: "GRE", logoUrl: "https://media.api-sports.io/football/teams/130.png" },
        { id: "cruzeiro", name: "Cruzeiro", shortName: "CRU", logoUrl: "https://media.api-sports.io/football/teams/135.png" },
        { id: "bahia", name: "Bahia", shortName: "BAH", logoUrl: "https://media.api-sports.io/football/teams/118.png" },
        { id: "vasco-da-gama", name: "Vasco da Gama", shortName: "VAS", logoUrl: "https://media.api-sports.io/football/teams/133.png" },
        { id: "athletico-paranaense", name: "Athletico Paranaense", shortName: "CAP", logoUrl: "https://media.api-sports.io/football/teams/134.png" },
        { id: "atletico-mineiro", name: "Atl\xE9tico Mineiro", shortName: "CAM", logoUrl: "https://media.api-sports.io/football/teams/1062.png" },
        { id: "bragantino", name: "RB Bragantino", shortName: "BRA", logoUrl: "https://media.api-sports.io/football/teams/794.png" },
        { id: "santos", name: "Santos", shortName: "SAN", logoUrl: "https://media.api-sports.io/football/teams/152.png" },
        { id: "coritiba", name: "Coritiba", shortName: "CFC", logoUrl: "https://media.api-sports.io/football/teams/148.png" },
        { id: "mirassol", name: "Mirassol", shortName: "MIR", logoUrl: "https://media.api-sports.io/football/teams/1185.png" },
        { id: "vitoria", name: "Vit\xF3ria", shortName: "VIT", logoUrl: "https://media.api-sports.io/football/teams/1177.png" },
        { id: "chapecoense", name: "Chapecoense", shortName: "CHA", logoUrl: "https://media.api-sports.io/football/teams/741.png" },
        { id: "remo", name: "Remo", shortName: "REM", logoUrl: "https://media.api-sports.io/football/teams/1220.png" }
      ];
      const { teams: teamsTable, matches: matchesTableLocal } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { sql: drizzleSql } = await import("drizzle-orm");
      for (const t of SERIE_A_2026_TEAMS) {
        const s = STANDINGS[t.id];
        if (!s) continue;
        const [pts, played, wins, draws, losses, gf, ga] = s;
        const position = Object.entries(STANDINGS).sort((a, b) => b[1][0] - a[1][0]).findIndex(([id]) => id === t.id) + 1;
        await db.execute(drizzleSql`
          INSERT INTO teams (id, name, short_name, logo_url, points, wins, draws, losses, goals_for, goals_against, current_position)
          VALUES (${t.id}, ${t.name}, ${t.shortName}, ${t.logoUrl}, ${pts}, ${wins}, ${draws}, ${losses}, ${gf}, ${ga}, ${position})
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            short_name = EXCLUDED.short_name,
            logo_url = EXCLUDED.logo_url,
            points = EXCLUDED.points,
            wins = EXCLUDED.wins,
            draws = EXCLUDED.draws,
            losses = EXCLUDED.losses,
            goals_for = EXCLUDED.goals_for,
            goals_against = EXCLUDED.goals_against,
            current_position = EXCLUDED.current_position,
            updated_at = NOW()
        `);
      }
      await db.execute(drizzleSql`
        DELETE FROM standings
        WHERE competition_id = 'comp-brasileirao-serie-a' AND season = '2026'
        AND team_id IN ('cuiaba','goias','america-mineiro','fortaleza','fluminense','atletico-paranaense','bragantino','corinthians','bahia','cruzeiro','santos','vasco-da-gama','coritiba','athletico-paranaense','vitoria','chapecoense','mirassol','remo','botafogo','internacional')
      `);
      await db.execute(drizzleSql`
        DELETE FROM standings
        WHERE competition_id = 'comp-brasileirao-serie-a' AND season = '2026'
        AND team_id NOT IN ('palmeiras','sao-paulo','bahia','flamengo','fluminense','coritiba','gremio','atletico-mineiro','vasco-da-gama','athletico-paranaense','vitoria','chapecoense','bragantino','corinthians','mirassol','santos','internacional','botafogo','cruzeiro','remo')
      `);
      await db.execute(drizzleSql`DELETE FROM matches WHERE is_mock = true`);
      const round8Fixtures = [
        { home: "flamengo", away: "palmeiras" },
        { home: "sao-paulo", away: "atletico-mineiro" },
        { home: "gremio", away: "fluminense" },
        { home: "corinthians", away: "bahia" },
        { home: "botafogo", away: "bragantino" },
        { home: "vasco-da-gama", away: "santos" },
        { home: "coritiba", away: "internacional" },
        { home: "athletico-paranaense", away: "mirassol" },
        { home: "cruzeiro", away: "chapecoense" },
        { home: "vitoria", away: "remo" }
      ];
      const allTeamsForSeed = await storage.getAllTeams();
      const teamNameMap = new Map(allTeamsForSeed.map((t) => [t.id, t.name]));
      for (const f of round8Fixtures) {
        const homeName = teamNameMap.get(f.home) ?? f.home;
        const awayName = teamNameMap.get(f.away) ?? f.away;
        const matchDate = /* @__PURE__ */ new Date("2026-03-29T16:00:00Z");
        await db.execute(drizzleSql`
          INSERT INTO matches (team_id, opponent, is_home_match, match_date, championship_round, status, competition, is_mock)
          VALUES
            (${f.home}, ${awayName},  true,  ${matchDate}, 8, 'SCHEDULED', 'Brasileirão Série A', true),
            (${f.away}, ${homeName}, false, ${matchDate}, 8, 'SCHEDULED', 'Brasileirão Série A', true)
          ON CONFLICT DO NOTHING
        `);
      }
      res.json({
        message: "Brasileir\xE3o 2026 seed aplicado com sucesso!",
        teamsUpdated: SERIE_A_2026_TEAMS.length,
        roundLabel: "Rodada 8 fixtures inseridos"
      });
    } catch (error) {
      console.error("[seed-brasileirao-2026] error:", error);
      res.status(500).json({ message: error.message || "Erro ao aplicar seed" });
    }
  });
  app2.get("/api/teams/:teamId/forum/stats", requireAuth4, async (req, res) => {
    try {
      const teamId = String(req.params.teamId || "").trim();
      const userTeamId = (await storage.getUser(req.session.userId))?.teamId;
      if (!userTeamId || userTeamId !== teamId) {
        return res.status(403).json({ message: "Acesso negado. S\xF3 \xE9 poss\xEDvel ver o f\xF3rum do seu time." });
      }
      const { getForumStats: getForumStats2 } = await Promise.resolve().then(() => (init_forum_repo(), forum_repo_exports));
      const stats = await getForumStats2(teamId);
      return res.json(stats);
    } catch (error) {
      console.error("Forum stats error:", error);
      return res.status(500).json({ message: "Erro ao buscar estat\xEDsticas do f\xF3rum" });
    }
  });
  app2.get("/api/teams/:teamId/forum/topics", requireAuth4, async (req, res) => {
    try {
      const teamId = String(req.params.teamId || "").trim();
      const userTeamId = (await storage.getUser(req.session.userId))?.teamId;
      if (!userTeamId || userTeamId !== teamId) {
        return res.status(403).json({ message: "Acesso negado. S\xF3 \xE9 poss\xEDvel ver o f\xF3rum do seu time." });
      }
      const category = typeof req.query.category === "string" ? req.query.category.trim() : void 0;
      const search = typeof req.query.search === "string" ? req.query.search.trim() : void 0;
      const trending = req.query.trending === "true";
      const limit = Math.min(parseInt(String(req.query.limit || 24), 10) || 24, 50);
      const offset = Math.max(0, parseInt(String(req.query.offset || 0), 10));
      const { listForumTopics: listForumTopics2 } = await Promise.resolve().then(() => (init_forum_repo(), forum_repo_exports));
      const topics = await listForumTopics2(teamId, {
        category,
        search: search || void 0,
        trending,
        limit,
        offset,
        viewerUserId: req.session.userId
      });
      return res.json(topics);
    } catch (error) {
      console.error("Forum topics error:", error);
      return res.status(500).json({ message: "Erro ao buscar t\xF3picos" });
    }
  });
  app2.get("/api/teams/:teamId/forum/topics/:topicId", requireAuth4, async (req, res) => {
    try {
      const { teamId, topicId } = req.params;
      const userTeamId = (await storage.getUser(req.session.userId))?.teamId;
      if (!userTeamId || userTeamId !== teamId) {
        return res.status(403).json({ message: "Acesso negado. S\xF3 \xE9 poss\xEDvel ver o f\xF3rum do seu time." });
      }
      const { getForumTopicById: getForumTopicById2 } = await Promise.resolve().then(() => (init_forum_repo(), forum_repo_exports));
      const topic = await getForumTopicById2(topicId, teamId, {
        viewerUserId: req.session.userId,
        incrementView: true
      });
      if (!topic) return res.status(404).json({ message: "T\xF3pico n\xE3o encontrado" });
      return res.json(topic);
    } catch (error) {
      console.error("Forum topic detail error:", error);
      return res.status(500).json({ message: "Erro ao buscar t\xF3pico" });
    }
  });
  app2.post("/api/teams/:teamId/forum/topics", requireAuth4, async (req, res) => {
    try {
      const teamId = String(req.params.teamId || "").trim();
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user?.teamId || user.teamId !== teamId) {
        return res.status(403).json({ message: "Acesso negado. S\xF3 \xE9 poss\xEDvel criar t\xF3picos no f\xF3rum do seu time." });
      }
      const { title, content, category, coverImageUrl } = req.body ?? {};
      if (!title || typeof title !== "string" || title.trim().length < 3) {
        return res.status(400).json({ message: "T\xEDtulo deve ter pelo menos 3 caracteres" });
      }
      if (!content || typeof content !== "string" || content.trim().length < 10) {
        return res.status(400).json({ message: "Conte\xFAdo deve ter pelo menos 10 caracteres" });
      }
      const validCategories = ["news", "pre_match", "post_match", "transfer", "off_topic", "base"];
      const cat = category && validCategories.includes(category) ? category : "base";
      const { createForumTopic: createForumTopic2 } = await Promise.resolve().then(() => (init_forum_repo(), forum_repo_exports));
      const topic = await createForumTopic2(teamId, userId, {
        title: title.trim(),
        content: content.trim(),
        category: cat,
        coverImageUrl: coverImageUrl || null
      });
      return res.status(201).json(topic);
    } catch (error) {
      console.error("Create forum topic error:", error);
      return res.status(500).json({ message: error?.message || "Erro ao criar t\xF3pico" });
    }
  });
  app2.get("/api/teams/:teamId/forum/topics/:topicId/replies", requireAuth4, async (req, res) => {
    try {
      const { teamId, topicId } = req.params;
      const userTeamId = (await storage.getUser(req.session.userId))?.teamId;
      if (!userTeamId || userTeamId !== teamId) {
        return res.status(403).json({ message: "Acesso negado." });
      }
      const { listForumReplies: listForumReplies2, getForumTopicById: getForumTopicById2 } = await Promise.resolve().then(() => (init_forum_repo(), forum_repo_exports));
      const topic = await getForumTopicById2(topicId, teamId);
      if (!topic) return res.status(404).json({ message: "T\xF3pico n\xE3o encontrado" });
      const limit = Math.min(parseInt(String(req.query.limit || 50), 10) || 50, 100);
      const offset = Math.max(0, parseInt(String(req.query.offset || 0), 10));
      const replies = await listForumReplies2(topicId, {
        viewerUserId: req.session.userId,
        limit,
        offset
      });
      return res.json(replies);
    } catch (error) {
      console.error("Forum replies error:", error);
      return res.status(500).json({ message: "Erro ao buscar respostas" });
    }
  });
  app2.post("/api/teams/:teamId/forum/topics/:topicId/replies", requireAuth4, async (req, res) => {
    try {
      const { teamId, topicId } = req.params;
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user?.teamId || user.teamId !== teamId) {
        return res.status(403).json({ message: "Acesso negado." });
      }
      const { getForumTopicById: getForumTopicById2, createForumReply: createForumReply2 } = await Promise.resolve().then(() => (init_forum_repo(), forum_repo_exports));
      const topic = await getForumTopicById2(topicId, teamId);
      if (!topic) return res.status(404).json({ message: "T\xF3pico n\xE3o encontrado" });
      if (topic.isLocked) return res.status(403).json({ message: "Este t\xF3pico est\xE1 trancado." });
      const content = (req.body?.content ?? "").trim();
      if (!content) return res.status(400).json({ message: "Conte\xFAdo da resposta \xE9 obrigat\xF3rio" });
      const reply = await createForumReply2(topicId, userId, content);
      return res.status(201).json(reply);
    } catch (error) {
      console.error("Create forum reply error:", error);
      return res.status(500).json({ message: error?.message || "Erro ao criar resposta" });
    }
  });
  app2.post("/api/teams/:teamId/forum/topics/:topicId/like", requireAuth4, async (req, res) => {
    try {
      const { teamId, topicId } = req.params;
      const userId = req.session.userId;
      const userTeamId = (await storage.getUser(userId))?.teamId;
      if (!userTeamId || userTeamId !== teamId) {
        return res.status(403).json({ message: "Acesso negado." });
      }
      const { getForumTopicById: getForumTopicById2, toggleForumTopicLike: toggleForumTopicLike2 } = await Promise.resolve().then(() => (init_forum_repo(), forum_repo_exports));
      const topic = await getForumTopicById2(topicId, teamId);
      if (!topic) return res.status(404).json({ message: "T\xF3pico n\xE3o encontrado" });
      const result = await toggleForumTopicLike2(topicId, userId);
      return res.json(result);
    } catch (error) {
      console.error("Forum topic like error:", error);
      return res.status(500).json({ message: "Erro ao curtir t\xF3pico" });
    }
  });
  app2.post("/api/teams/:teamId/forum/replies/:replyId/like", requireAuth4, async (req, res) => {
    try {
      const { teamId, replyId } = req.params;
      const userId = req.session.userId;
      const userTeamId = (await storage.getUser(userId))?.teamId;
      if (!userTeamId || userTeamId !== teamId) {
        return res.status(403).json({ message: "Acesso negado." });
      }
      const { getForumReplyTeamId: getForumReplyTeamId2, toggleForumReplyLike: toggleForumReplyLike2 } = await Promise.resolve().then(() => (init_forum_repo(), forum_repo_exports));
      const replyTeamId = await getForumReplyTeamId2(replyId);
      if (!replyTeamId || replyTeamId !== teamId) {
        return res.status(404).json({ message: "Resposta n\xE3o encontrada" });
      }
      const result = await toggleForumReplyLike2(replyId, userId);
      return res.json(result);
    } catch (error) {
      console.error("Forum reply like error:", error);
      return res.status(500).json({ message: "Erro ao curtir resposta" });
    }
  });
  app2.get("/api/transfers", async (req, res) => {
    try {
      const status = typeof req.query.status === "string" ? req.query.status.trim() : void 0;
      const q = typeof req.query.q === "string" ? req.query.q.trim() : void 0;
      const teamId = typeof req.query.teamId === "string" ? req.query.teamId.trim() : void 0;
      const viewerUserId = req.session?.userId ?? null;
      const items = await storage.getTransfers({ status, q, teamId, viewerUserId });
      res.json(items);
    } catch (error) {
      console.error("Get transfers error:", error);
      res.status(500).json({ message: "Erro ao buscar transfer\xEAncias" });
    }
  });
  app2.get("/api/transfer-rumors", async (req, res) => {
    try {
      const status = typeof req.query.status === "string" ? req.query.status.trim() : void 0;
      const q = typeof req.query.q === "string" ? req.query.q.trim() : void 0;
      const teamId = typeof req.query.teamId === "string" ? req.query.teamId.trim() : void 0;
      const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 30;
      const offset = typeof req.query.offset === "string" ? parseInt(req.query.offset, 10) : 0;
      const viewerUserId = req.session?.userId ?? null;
      const items = await storage.getTransferRumors({ status, q, teamId, viewerUserId, limit: Number.isNaN(limit) ? 30 : limit, offset: Number.isNaN(offset) ? 0 : offset });
      res.json(items);
    } catch (error) {
      console.error("Get transfer rumors error:", error);
      res.status(500).json({ message: "Erro ao buscar rumores" });
    }
  });
  app2.get("/api/transfer-rumors/mine", requireJournalistOrAdmin, async (req, res) => {
    try {
      const userId = req.session.userId;
      const items = await storage.getTransferRumorsByAuthor(userId);
      res.json(items);
    } catch (error) {
      console.error("Get my transfer rumors error:", error);
      res.status(500).json({ message: "Erro ao buscar suas negocia\xE7\xF5es" });
    }
  });
  app2.get("/api/transfer-rumors/:id", async (req, res) => {
    try {
      const rumor = await storage.getTransferRumorById(req.params.id);
      if (!rumor) return res.status(404).json({ message: "Rumor n\xE3o encontrado" });
      res.json(rumor);
    } catch (error) {
      console.error("Get transfer rumor error:", error);
      res.status(500).json({ message: "Erro ao buscar rumor" });
    }
  });
  app2.post("/api/transfer-rumors", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user || user.userType !== "JOURNALIST" && user.userType !== "ADMIN") {
        return res.status(403).json({ message: "Apenas jornalistas e administradores podem criar negocia\xE7\xF5es" });
      }
      const { playerId, fromTeamId, toTeamId, status, feeAmount, feeCurrency, contractUntil, sourceUrl, sourceName, note } = req.body ?? {};
      if (!playerId || !fromTeamId || !toTeamId) {
        return res.status(400).json({ message: "playerId, fromTeamId e toTeamId s\xE3o obrigat\xF3rios" });
      }
      if (fromTeamId === toTeamId) {
        return res.status(400).json({ message: "fromTeamId e toTeamId devem ser diferentes" });
      }
      const validStatus = ["RUMOR", "NEGOTIATING", "DONE", "CANCELLED"].includes(status) ? status : "RUMOR";
      const rumor = await storage.createTransferRumor({
        playerId,
        fromTeamId,
        toTeamId,
        status: validStatus,
        feeAmount: feeAmount != null ? String(feeAmount) : null,
        feeCurrency: feeCurrency ?? "BRL",
        contractUntil: contractUntil ?? null,
        sourceUrl: sourceUrl ?? null,
        sourceName: sourceName ?? null,
        note: note ?? null,
        createdByUserId: userId
      });
      const full = await storage.getTransferRumorById(rumor.id);
      res.status(201).json(full ?? rumor);
    } catch (error) {
      console.error("Create transfer rumor error:", error);
      res.status(500).json({ message: "Erro ao criar negocia\xE7\xE3o" });
    }
  });
  app2.patch("/api/transfer-rumors/:id", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user || user.userType !== "JOURNALIST" && user.userType !== "ADMIN") {
        return res.status(403).json({ message: "Apenas jornalistas e administradores podem editar negocia\xE7\xF5es" });
      }
      const rumor = await storage.getTransferRumorById(req.params.id);
      if (!rumor) return res.status(404).json({ message: "Negocia\xE7\xE3o n\xE3o encontrada" });
      const authorId = rumor.createdByUserId ?? rumor.author?.id;
      if (authorId !== userId && user.userType !== "ADMIN") {
        return res.status(403).json({ message: "Voc\xEA s\xF3 pode editar suas pr\xF3prias negocia\xE7\xF5es" });
      }
      const { status, feeAmount, feeCurrency, contractUntil, sourceName, sourceUrl, note } = req.body ?? {};
      const updates = {};
      if (status !== void 0 && ["RUMOR", "NEGOTIATING", "DONE", "CANCELLED"].includes(status)) updates.status = status;
      if (feeAmount !== void 0) updates.feeAmount = feeAmount != null ? Number(feeAmount) : null;
      if (feeCurrency !== void 0) updates.feeCurrency = feeCurrency;
      if (contractUntil !== void 0) updates.contractUntil = contractUntil ?? null;
      if (sourceName !== void 0) updates.sourceName = sourceName ?? null;
      if (sourceUrl !== void 0) updates.sourceUrl = sourceUrl ?? null;
      if (note !== void 0) updates.note = note ?? null;
      if (Object.keys(updates).length === 0) {
        return res.json(rumor);
      }
      const updated = await storage.updateTransferRumor(req.params.id, updates);
      if (!updated) return res.status(404).json({ message: "Negocia\xE7\xE3o n\xE3o encontrada" });
      const full = await storage.getTransferRumorById(updated.id);
      res.json(full ?? updated);
    } catch (error) {
      console.error("Update transfer rumor error:", error);
      res.status(500).json({ message: "Erro ao atualizar negocia\xE7\xE3o" });
    }
  });
  app2.delete("/api/transfer-rumors/:id", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user || user.userType !== "JOURNALIST" && user.userType !== "ADMIN") {
        return res.status(403).json({ message: "Apenas jornalistas e administradores podem excluir negocia\xE7\xF5es" });
      }
      const rumor = await storage.getTransferRumorById(req.params.id);
      if (!rumor) return res.status(404).json({ message: "Negocia\xE7\xE3o n\xE3o encontrada" });
      const authorId = rumor.createdByUserId ?? rumor.author?.id;
      if (authorId !== userId && user.userType !== "ADMIN") {
        return res.status(403).json({ message: "Voc\xEA s\xF3 pode excluir suas pr\xF3prias negocia\xE7\xF5es" });
      }
      const deleted = await storage.deleteTransferRumor(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Negocia\xE7\xE3o n\xE3o encontrada" });
      res.status(204).send();
    } catch (error) {
      console.error("Delete transfer rumor error:", error);
      res.status(500).json({ message: "Erro ao excluir negocia\xE7\xE3o" });
    }
  });
  app2.post("/api/transfer-rumors/:id/vote", requireAuth4, async (req, res) => {
    try {
      const rumorId = req.params.id;
      const { side, vote } = req.body ?? {};
      if (!["SELLING", "BUYING"].includes(side)) {
        return res.status(400).json({ message: "side deve ser SELLING ou BUYING" });
      }
      if (!["LIKE", "DISLIKE", "CLEAR"].includes(vote)) {
        return res.status(400).json({ message: "vote deve ser LIKE, DISLIKE ou CLEAR" });
      }
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) return res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      const rumor = await storage.getTransferRumorById(rumorId);
      if (!rumor) return res.status(404).json({ message: "Rumor n\xE3o encontrado" });
      if (side === "SELLING") {
        if (user.teamId !== rumor.fromTeam?.id) {
          return res.status(403).json({ message: "Apenas torcedores do time que est\xE1 vendendo podem votar aqui." });
        }
      } else {
        if (user.teamId !== rumor.toTeam?.id) {
          return res.status(403).json({ message: "Apenas torcedores do time que est\xE1 comprando podem votar aqui." });
        }
      }
      const result = await storage.upsertTransferRumorVote(rumorId, userId, side, vote);
      res.json(result);
    } catch (error) {
      console.error("Transfer rumor vote error:", error);
      res.status(500).json({ message: "Erro ao registrar voto" });
    }
  });
  app2.get("/api/transfer-rumors/:id/comments", async (req, res) => {
    try {
      const comments2 = await storage.listTransferRumorComments(req.params.id);
      res.json(comments2);
    } catch (error) {
      console.error("List transfer rumor comments error:", error);
      res.status(500).json({ message: "Erro ao listar coment\xE1rios" });
    }
  });
  app2.post("/api/transfer-rumors/:id/comments", requireAuth4, async (req, res) => {
    try {
      const { content } = req.body ?? {};
      if (!content || typeof content !== "string" || !content.trim()) {
        return res.status(400).json({ message: "content \xE9 obrigat\xF3rio" });
      }
      const comment = await storage.createTransferRumorComment(req.params.id, req.session.userId, content.trim());
      res.status(201).json(comment);
    } catch (error) {
      console.error("Create transfer rumor comment error:", error);
      res.status(500).json({ message: "Erro ao criar coment\xE1rio" });
    }
  });
  app2.post("/api/transfers/:id/vote", requireAuth4, async (req, res) => {
    try {
      const transferId = req.params.id;
      const { side, vote } = req.body ?? {};
      if (!["SELLING", "BUYING"].includes(side)) {
        return res.status(400).json({ message: "side deve ser SELLING ou BUYING" });
      }
      if (!["LIKE", "DISLIKE", "CLEAR"].includes(vote)) {
        return res.status(400).json({ message: "vote deve ser LIKE, DISLIKE ou CLEAR" });
      }
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const transfer = await storage.getTransferById(transferId);
      if (!transfer) {
        return res.status(404).json({ message: "Transfer\xEAncia n\xE3o encontrada" });
      }
      if (side === "SELLING") {
        if (!transfer.fromTeamId) {
          return res.status(400).json({ message: "Este rumor n\xE3o tem time de origem definido." });
        }
        if (user.teamId !== transfer.fromTeamId) {
          return res.status(403).json({
            message: "Apenas torcedores do time que est\xE1 vendendo podem votar aqui."
          });
        }
      } else {
        if (!transfer.toTeamId) {
          return res.status(400).json({ message: "Este rumor n\xE3o tem time de destino definido." });
        }
        if (user.teamId !== transfer.toTeamId) {
          return res.status(403).json({
            message: "Apenas torcedores do time que est\xE1 comprando podem votar aqui."
          });
        }
      }
      const result = await storage.upsertTransferVote(transferId, userId, side, vote);
      res.json(result);
    } catch (error) {
      console.error("Transfer vote error:", error);
      res.status(500).json({ message: "Erro ao registrar voto" });
    }
  });
  app2.get("/api/games/sets", async (req, res) => {
    try {
      const { listGameSets: listGameSets2 } = await Promise.resolve().then(() => (init_games_repo(), games_repo_exports));
      const sets = await listGameSets2();
      return res.json(sets);
    } catch (error) {
      console.error("[games] GET /sets error:", error);
      return res.status(500).json({ message: "Erro ao buscar sets" });
    }
  });
  app2.get("/api/games/sets/:slug", async (req, res) => {
    const slug = String(req.params.slug || "").trim();
    if (!slug) return res.status(400).json({ message: "slug inv\xE1lido" });
    try {
      const { getGameSetBySlug: getGameSetBySlug2 } = await Promise.resolve().then(() => (init_games_repo(), games_repo_exports));
      const set = await getGameSetBySlug2(slug);
      if (!set) return res.status(404).json({ message: "Set n\xE3o encontrado" });
      return res.json(set);
    } catch (error) {
      console.error("[games] GET /sets/:slug error:", error);
      return res.status(500).json({ message: "Erro ao buscar set" });
    }
  });
  app2.post("/api/games/attempts/start", requireAuth4, async (req, res) => {
    const { setSlug } = req.body ?? {};
    const slug = String(setSlug || "").trim();
    if (!slug) return res.status(400).json({ message: "setSlug \xE9 obrigat\xF3rio" });
    try {
      const userId = req.session.userId;
      const { startOrGetAttempt: startOrGetAttempt2 } = await Promise.resolve().then(() => (init_games_repo(), games_repo_exports));
      const result = await startOrGetAttempt2(userId, slug);
      return res.json(result);
    } catch (error) {
      console.error("[games] POST /attempts/start error:", error);
      return res.status(500).json({ message: error?.message ?? "Erro ao iniciar tentativa" });
    }
  });
  app2.get("/api/games/attempts/:id", requireAuth4, async (req, res) => {
    const attemptId = String(req.params.id || "").trim();
    if (!attemptId) return res.status(400).json({ message: "id inv\xE1lido" });
    try {
      const userId = req.session.userId;
      const { getAttempt: getAttempt2 } = await Promise.resolve().then(() => (init_games_repo(), games_repo_exports));
      const attempt = await getAttempt2(attemptId, userId);
      if (!attempt) return res.status(404).json({ message: "Tentativa n\xE3o encontrada" });
      return res.json(attempt);
    } catch (error) {
      console.error("[games] GET /attempts/:id error:", error);
      return res.status(500).json({ message: "Erro ao buscar tentativa" });
    }
  });
  app2.post("/api/games/attempts/:id/guess", requireAuth4, async (req, res) => {
    const attemptId = String(req.params.id || "").trim();
    const { text: text2 } = req.body ?? {};
    const guessText = typeof text2 === "string" ? text2.trim() : "";
    if (!attemptId) return res.status(400).json({ message: "id inv\xE1lido" });
    if (!guessText) return res.status(400).json({ message: "text \xE9 obrigat\xF3rio" });
    try {
      const userId = req.session.userId;
      const { processGuess: processGuess3 } = await Promise.resolve().then(() => (init_games_repo(), games_repo_exports));
      const result = await processGuess3(attemptId, userId, guessText);
      return res.json(result);
    } catch (error) {
      console.error("[games] POST /attempts/:id/guess error:", error);
      return res.status(500).json({ message: error?.message ?? "Erro ao processar palpite" });
    }
  });
  app2.post("/api/games/attempts/:id/reset", requireAuth4, async (req, res) => {
    const attemptId = String(req.params.id || "").trim();
    if (!attemptId) return res.status(400).json({ message: "id inv\xE1lido" });
    try {
      const userId = req.session.userId;
      const { resetAttempt: resetAttempt2 } = await Promise.resolve().then(() => (init_games_repo(), games_repo_exports));
      const ok = await resetAttempt2(attemptId, userId);
      if (!ok) return res.status(404).json({ message: "Tentativa n\xE3o encontrada" });
      return res.json({ message: "Reiniciado" });
    } catch (error) {
      console.error("[games] POST /attempts/:id/reset error:", error);
      return res.status(500).json({ message: "Erro ao reiniciar" });
    }
  });
  app2.post("/api/games/attempts/:id/abandon", requireAuth4, async (req, res) => {
    const attemptId = String(req.params.id || "").trim();
    if (!attemptId) return res.status(400).json({ message: "id inv\xE1lido" });
    try {
      const userId = req.session.userId;
      const { abandonAttempt: abandonAttempt2 } = await Promise.resolve().then(() => (init_games_repo(), games_repo_exports));
      const ok = await abandonAttempt2(attemptId, userId);
      if (!ok) return res.status(404).json({ message: "Tentativa n\xE3o encontrada" });
      return res.json({ message: "Desist\xEAncia registrada" });
    } catch (error) {
      console.error("[games] POST /attempts/:id/abandon error:", error);
      return res.status(500).json({ message: "Erro ao desistir" });
    }
  });
  app2.get("/api/games/player-of-the-day", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user?.teamId) return res.status(400).json({ message: "Selecione um time primeiro" });
      const { getPlayerOfTheDay: getPlayerOfTheDay2 } = await Promise.resolve().then(() => (init_guess_player_repo(), guess_player_repo_exports));
      const data = await getPlayerOfTheDay2(userId, user.teamId);
      if (!data) return res.status(404).json({ message: "Nenhum jogador dispon\xEDvel para o jogo" });
      return res.json(data);
    } catch (error) {
      console.error("[guess-player] GET /player-of-the-day error:", error);
      return res.status(500).json({ message: "Erro ao buscar jogador do dia" });
    }
  });
  app2.get("/api/games/players/search", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user?.teamId) return res.status(400).json({ message: "Selecione um time primeiro" });
      const q = String(req.query.q ?? "").trim();
      const { searchPlayersForGame: searchPlayersForGame2 } = await Promise.resolve().then(() => (init_guess_player_repo(), guess_player_repo_exports));
      const results = await searchPlayersForGame2(user.teamId, q, 10);
      return res.json(results);
    } catch (error) {
      console.error("[guess-player] GET /players/search error:", error);
      return res.status(500).json({ message: "Erro ao buscar jogadores" });
    }
  });
  app2.post("/api/games/player-of-the-day/guess", requireAuth4, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user?.teamId) return res.status(400).json({ message: "Selecione um time primeiro" });
      const { guess } = req.body ?? {};
      const guessText = typeof guess === "string" ? guess.trim() : "";
      if (!guessText) return res.status(400).json({ message: "guess \xE9 obrigat\xF3rio" });
      const { processGuess: processGuess3 } = await Promise.resolve().then(() => (init_guess_player_repo(), guess_player_repo_exports));
      const result = await processGuess3(userId, user.teamId, guessText);
      return res.json(result);
    } catch (error) {
      console.error("[guess-player] POST /player-of-the-day/guess error:", error);
      return res.status(500).json({ message: error?.message ?? "Erro ao processar palpite" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// api/_entry.ts
var app = express();
app.set("trust proxy", 1);
var isProd = process.env.NODE_ENV !== "development";
app.use(
  helmet({
    contentSecurityPolicy: false,
    hsts: isProd ? { maxAge: 31536e3, includeSubDomains: true, preload: true } : false,
    noSniff: true,
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  })
);
var extraOrigins = (process.env.CORS_ORIGIN ?? "").split(",").map((o) => o.trim()).filter(Boolean);
var allowedOrigins = ["https://futtwitter.vercel.app", ...extraOrigins];
var corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (origin.endsWith(".vercel.app")) return callback(null, true);
    if (!isProd && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")))
      return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
var initPromise = null;
function ensureInit() {
  if (!initPromise) {
    initPromise = registerRoutes(app).then(() => {
      app.use((err, _req, res, _next) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
      });
    }).catch((err) => {
      console.error("[vercel] Failed to initialise routes:", err);
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}
async function handler(req, res) {
  try {
    await ensureInit();
  } catch (err) {
    console.error("[vercel] Init error:", err);
    res.status(503).json({ message: "Service temporarily unavailable. Check server logs." });
    return;
  }
  app(req, res, (err) => {
    if (err) {
      console.error("[vercel] Unhandled Express error:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
}
export {
  handler as default
};

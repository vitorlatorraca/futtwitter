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
  numeric,
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
export const transferStatusEnum = pgEnum("transfer_status", ["RUMOR", "NEGOCIACAO", "FECHADO"]);
export const transferVoteEnum = pgEnum("transfer_vote", ["UP", "DOWN"]);
export const transferVoteSideEnum = pgEnum("transfer_vote_side", ["SELLING", "BUYING"]);
export const transferVoteValueEnum = pgEnum("transfer_vote_value", ["LIKE", "DISLIKE"]);
/** Vai e Vem: status da negociação (4 estados) */
export const transferRumorStatusEnum = pgEnum("transfer_rumor_status", ["RUMOR", "NEGOTIATING", "DONE", "CANCELLED"]);
export const fixtureStatusEnum = pgEnum("fixture_status", ["SCHEDULED", "LIVE", "FT", "POSTPONED", "CANCELED"]);

// Sport schema enums
export const preferredFootEnum = pgEnum("preferred_foot", ["LEFT", "RIGHT", "BOTH"]);
export const primaryPositionEnum = pgEnum("primary_position", [
  "GK", "CB", "FB", "LB", "RB", "WB", "DM", "CM", "AM", "W", "LW", "RW", "ST", "SS",
]);
export const rosterRoleEnum = pgEnum("roster_role", ["STARTER", "ROTATION", "YOUTH", "RESERVE"]);
export const rosterStatusEnum = pgEnum("roster_status", [
  "ACTIVE", "LOANED_OUT", "INJURED", "SUSPENDED", "TRANSFERRED",
]);
export const matchStatusEnum = pgEnum("match_status", [
  "SCHEDULED", "LIVE", "HT", "FT", "POSTPONED", "CANCELED",
]);
export const matchEventTypeEnum = pgEnum("match_event_type", [
  "GOAL", "OWN_GOAL", "ASSIST", "YELLOW", "RED", "SUBSTITUTION",
  "PENALTY_SCORED", "PENALTY_MISSED", "VAR", "INJURY",
]);
export const injuryStatusEnum = pgEnum("injury_status", ["DAY_TO_DAY", "OUT", "DOUBTFUL", "RECOVERED"]);
export const transferStatusSportEnum = pgEnum("transfer_status_sport", ["RUMOR", "CONFIRMED", "CANCELED"]);
export const forumTopicCategoryEnum = pgEnum("forum_topic_category", [
  "news", "pre_match", "post_match", "transfer", "off_topic", "base",
]);
export const forumModerationStatusEnum = pgEnum("forum_moderation_status", ["PENDING", "APPROVED", "REMOVED"]);
/** Game attempts: in_progress | completed | abandoned */
export const gameAttemptStatusEnum = pgEnum("game_attempt_status", ["in_progress", "completed", "abandoned"]);

// ============================================
// TABLES
// ============================================

export const countries = pgTable("countries", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 2 }).notNull().unique(),
  flagEmoji: varchar("flag_emoji", { length: 10 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

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
    fullName: text("full_name"),
    knownName: varchar("known_name", { length: 100 }),
    position: text("position").notNull(),
    birthDate: date("birth_date", { mode: "string" }).notNull(),
    nationalityPrimary: text("nationality_primary").notNull(),
    nationalitySecondary: text("nationality_secondary"),
    nationalityCountryId: varchar("nationality_country_id", { length: 36 }).references(() => countries.id, {
      onDelete: "set null",
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
    nationalityCountryIdx: index("players_nationality_country_idx").on(t.nationalityCountryId),
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
  /** Optional broadcast channel(s), e.g. "ESPN", "Globo", "Premiere" */
  broadcastChannel: varchar("broadcast_channel", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const competitions = pgTable("competitions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  countryId: varchar("country_id", { length: 36 }).references(() => countries.id, { onDelete: "set null" }),
  country: varchar("country", { length: 100 }),
  level: integer("level"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const venues = pgTable("venues", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }),
  countryId: varchar("country_id", { length: 36 }).references(() => countries.id, { onDelete: "set null" }),
  capacity: integer("capacity"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const seasons = pgTable(
  "seasons",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    competitionId: varchar("competition_id", { length: 36 })
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),
    year: integer("year").notNull(),
    startDate: date("start_date", { mode: "string" }),
    endDate: date("end_date", { mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    competitionYearUnique: uniqueIndex("seasons_competition_year_unique").on(t.competitionId, t.year),
    competitionIdx: index("seasons_competition_idx").on(t.competitionId),
  })
);

export const teamRosters = pgTable(
  "team_rosters",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    teamId: varchar("team_id", { length: 36 })
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    seasonId: varchar("season_id", { length: 36 })
      .notNull()
      .references(() => seasons.id, { onDelete: "cascade" }),
    playerId: varchar("player_id", { length: 36 })
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    squadNumber: integer("squad_number"),
    role: rosterRoleEnum("role"),
    status: rosterStatusEnum("status").default("ACTIVE"),
    joinedAt: date("joined_at", { mode: "string" }),
    leftAt: date("left_at", { mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    teamSeasonPlayerUnique: uniqueIndex("team_rosters_team_season_player_unique").on(
      t.teamId,
      t.seasonId,
      t.playerId
    ),
    teamSeasonIdx: index("team_rosters_team_season_idx").on(t.teamId, t.seasonId),
    playerIdx: index("team_rosters_player_idx").on(t.playerId),
  })
);

export const contracts = pgTable("contracts", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  teamRosterId: varchar("team_roster_id", { length: 36 }).references(() => teamRosters.id, {
    onDelete: "cascade",
  }),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }),
  salaryWeekly: integer("salary_weekly"),
  marketValue: integer("market_value"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const matchGames = pgTable(
  "match_games",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    seasonId: varchar("season_id", { length: 36 }).references(() => seasons.id, { onDelete: "restrict" }),
    competitionId: varchar("competition_id", { length: 36 }).references(() => competitions.id, {
      onDelete: "restrict",
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
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    homeTeamKickoffIdx: index("match_games_home_team_kickoff_idx").on(t.homeTeamId, t.kickoffAt),
    awayTeamKickoffIdx: index("match_games_away_team_kickoff_idx").on(t.awayTeamId, t.kickoffAt),
    competitionKickoffIdx: index("match_games_competition_kickoff_idx").on(t.competitionId, t.kickoffAt),
    statusIdx: index("match_games_status_idx").on(t.status),
    kickoffIdx: index("match_games_kickoff_idx").on(t.kickoffAt),
  })
);

export const matchEvents = pgTable(
  "match_events",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    matchId: varchar("match_id", { length: 36 })
      .notNull()
      .references(() => matchGames.id, { onDelete: "cascade" }),
    minute: integer("minute"),
    type: matchEventTypeEnum("type").notNull(),
    teamId: varchar("team_id", { length: 36 }).references(() => teams.id, { onDelete: "set null" }),
    playerId: varchar("player_id", { length: 36 }).references(() => players.id, { onDelete: "set null" }),
    relatedPlayerId: varchar("related_player_id", { length: 36 }).references(() => players.id, {
      onDelete: "set null",
    }),
    detail: text("detail"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    matchIdx: index("match_events_match_idx").on(t.matchId),
    matchMinuteIdx: index("match_events_match_minute_idx").on(t.matchId, t.minute),
  })
);

export const matchLineups = pgTable(
  "match_lineups",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    matchId: varchar("match_id", { length: 36 })
      .notNull()
      .references(() => matchGames.id, { onDelete: "cascade" }),
    teamId: varchar("team_id", { length: 36 })
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    formation: varchar("formation", { length: 20 }).notNull().default("4-3-3"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    matchTeamUnique: uniqueIndex("match_lineups_match_team_unique").on(t.matchId, t.teamId),
    matchIdx: index("match_lineups_match_idx").on(t.matchId),
  })
);

export const matchLineupPlayers = pgTable(
  "match_lineup_players",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    matchLineupId: varchar("match_lineup_id", { length: 36 })
      .notNull()
      .references(() => matchLineups.id, { onDelete: "cascade" }),
    playerId: varchar("player_id", { length: 36 })
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    isStarter: boolean("is_starter").notNull().default(true),
    positionCode: varchar("position_code", { length: 10 }),
    shirtNumber: integer("shirt_number"),
    minutesPlayed: integer("minutes_played"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    lineupPlayerUnique: uniqueIndex("match_lineup_players_lineup_player_unique").on(
      t.matchLineupId,
      t.playerId
    ),
    lineupIdx: index("match_lineup_players_lineup_idx").on(t.matchLineupId),
  })
);

export const playerMatchStats = pgTable(
  "player_match_stats",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    matchId: varchar("match_id", { length: 36 })
      .notNull()
      .references(() => matchGames.id, { onDelete: "cascade" }),
    playerId: varchar("player_id", { length: 36 })
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    teamId: varchar("team_id", { length: 36 })
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    minutes: integer("minutes").notNull().default(0),
    rating: real("rating"),
    goals: integer("goals").notNull().default(0),
    assists: integer("assists").notNull().default(0),
    shots: integer("shots").notNull().default(0),
    passes: integer("passes").notNull().default(0),
    tackles: integer("tackles").notNull().default(0),
    saves: integer("saves").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    matchPlayerUnique: uniqueIndex("player_match_stats_match_player_unique").on(t.matchId, t.playerId),
    matchIdx: index("player_match_stats_match_idx").on(t.matchId),
    playerIdx: index("player_match_stats_player_idx").on(t.playerId),
  })
);

export const teamMatchStats = pgTable(
  "team_match_stats",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    matchId: varchar("match_id", { length: 36 })
      .notNull()
      .references(() => matchGames.id, { onDelete: "cascade" }),
    teamId: varchar("team_id", { length: 36 })
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    possession: integer("possession"),
    shots: integer("shots"),
    shotsOnTarget: integer("shots_on_target"),
    corners: integer("corners"),
    fouls: integer("fouls"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    matchTeamUnique: uniqueIndex("team_match_stats_match_team_unique").on(t.matchId, t.teamId),
    matchIdx: index("team_match_stats_match_idx").on(t.matchId),
  })
);

export const injuries = pgTable("injuries", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id", { length: 36 })
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  teamId: varchar("team_id", { length: 36 }).references(() => teams.id, { onDelete: "set null" }),
  type: text("type").notNull(),
  status: injuryStatusEnum("status").notNull().default("OUT"),
  startedAt: date("started_at", { mode: "string" }).notNull(),
  expectedReturnAt: date("expected_return_at", { mode: "string" }),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const transfersSport = pgTable("transfers_sport", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  playerId: varchar("player_id", { length: 36 })
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  fromTeamId: varchar("from_team_id", { length: 36 }).references(() => teams.id, { onDelete: "set null" }),
  toTeamId: varchar("to_team_id", { length: 36 }).references(() => teams.id, { onDelete: "set null" }),
  fee: integer("fee"),
  status: transferStatusSportEnum("status").notNull().default("RUMOR"),
  announcedAt: timestamp("announced_at", { withTimezone: true }),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const fixtures = pgTable(
  "fixtures",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    teamId: varchar("team_id", { length: 36 })
      .notNull()
      .references(() => teams.id),
    competitionId: varchar("competition_id", { length: 36 })
      .notNull()
      .references(() => competitions.id),
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
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    teamKickoffIdx: index("fixtures_team_kickoff_idx").on(t.teamId, t.kickoffAt),
    competitionIdx: index("fixtures_competition_idx").on(t.competitionId),
    statusIdx: index("fixtures_status_idx").on(t.status),
  })
);

export const standings = pgTable(
  "standings",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    competitionId: varchar("competition_id", { length: 36 })
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),
    teamId: varchar("team_id", { length: 36 })
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
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
    form: json("form").$type<string[]>().default([]),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    competitionTeamSeasonUnique: uniqueIndex("standings_competition_team_season_unique").on(
      t.competitionId,
      t.teamId,
      t.season
    ),
    competitionIdx: index("standings_competition_idx").on(t.competitionId),
    teamIdx: index("standings_team_idx").on(t.teamId),
    positionIdx: index("standings_position_idx").on(t.competitionId, t.season, t.position),
  })
);

export const teamMatchRatings = pgTable(
  "team_match_ratings",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    fixtureId: varchar("fixture_id", { length: 36 })
      .notNull()
      .references(() => fixtures.id, { onDelete: "cascade" }),
    teamId: varchar("team_id", { length: 36 })
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    rating: real("rating").notNull(),
    source: text("source"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    fixtureTeamUnique: uniqueIndex("team_match_ratings_fixture_team_unique").on(t.fixtureId, t.teamId),
    teamFixtureIdx: index("team_match_ratings_team_fixture_idx").on(t.teamId, t.fixtureId),
  })
);

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

export const playerRatings = pgTable(
  "player_ratings",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 }).notNull(),
    playerId: varchar("player_id", { length: 36 }).notNull(),
    matchId: varchar("match_id", { length: 36 }).notNull(),
    rating: real("rating").notNull(),
    comment: varchar("comment", { length: 200 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    userMatchPlayerUnique: uniqueIndex("player_ratings_user_match_player_unique").on(t.userId, t.matchId, t.playerId),
  })
);

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

export const transfers = pgTable("transfers", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  playerName: text("player_name").notNull(),
  playerPhotoUrl: text("player_photo_url"),
  positionAbbrev: varchar("position_abbrev", { length: 10 }).notNull(),
  fromTeamId: varchar("from_team_id", { length: 36 }).references(() => teams.id),
  toTeamId: varchar("to_team_id", { length: 36 }).references(() => teams.id),
  status: transferStatusEnum("status").notNull(),
  createdByJournalistId: varchar("created_by_journalist_id", { length: 36 }).references(() => journalists.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  sourceLabel: text("source_label"),
  sourceUrl: text("source_url"),
  feeText: text("fee_text"),
  notes: text("notes"),
});

export const transferVotes = pgTable(
  "transfer_votes",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    transferId: varchar("transfer_id", { length: 36 })
      .notNull()
      .references(() => transfers.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    side: transferVoteSideEnum("side").notNull(),
    vote: transferVoteValueEnum("vote").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    transferUserSideUnique: uniqueIndex("transfer_votes_transfer_user_side_unique").on(
      t.transferId,
      t.userId,
      t.side
    ),
    transferSideIdx: index("transfer_votes_transfer_side_idx").on(t.transferId, t.side),
    userIdIdx: index("transfer_votes_user_idx").on(t.userId),
  })
);

// Vai e Vem: rumores/negociações com player_id FK e avaliação dupla
export const transferRumors = pgTable(
  "transfer_rumors",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    playerId: varchar("player_id", { length: 36 })
      .notNull()
      .references(() => players.id, { onDelete: "restrict" }),
    fromTeamId: varchar("from_team_id", { length: 36 })
      .notNull()
      .references(() => teams.id, { onDelete: "restrict" }),
    toTeamId: varchar("to_team_id", { length: 36 })
      .notNull()
      .references(() => teams.id, { onDelete: "restrict" }),
    status: transferRumorStatusEnum("status").notNull().default("RUMOR"),
    feeAmount: numeric("fee_amount", { precision: 18, scale: 2 }),
    feeCurrency: text("fee_currency").default("BRL"),
    contractUntil: date("contract_until", { mode: "string" }),
    sourceUrl: text("source_url"),
    sourceName: text("source_name"),
    note: text("note"),
    createdByUserId: varchar("created_by_user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    statusCreatedIdx: index("transfer_rumors_status_created_idx").on(t.status, t.createdAt),
    fromTeamIdx: index("transfer_rumors_from_team_idx").on(t.fromTeamId),
    toTeamIdx: index("transfer_rumors_to_team_idx").on(t.toTeamId),
    playerIdx: index("transfer_rumors_player_idx").on(t.playerId),
    createdByIdx: index("transfer_rumors_created_by_idx").on(t.createdByUserId),
  })
);

export const transferRumorVotes = pgTable(
  "transfer_rumor_votes",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    rumorId: varchar("rumor_id", { length: 36 })
      .notNull()
      .references(() => transferRumors.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    side: transferVoteSideEnum("side").notNull(),
    vote: transferVoteValueEnum("vote").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    rumorUserSideUnique: uniqueIndex("transfer_rumor_votes_rumor_user_side_unique").on(
      t.rumorId,
      t.userId,
      t.side
    ),
    rumorSideIdx: index("transfer_rumor_votes_rumor_side_idx").on(t.rumorId, t.side),
    userIdIdx: index("transfer_rumor_votes_user_idx").on(t.userId),
  })
);

export const transferRumorComments = pgTable(
  "transfer_rumor_comments",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    rumorId: varchar("rumor_id", { length: 36 })
      .notNull()
      .references(() => transferRumors.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    isDeleted: boolean("is_deleted").notNull().default(false),
  },
  (t) => ({
    rumorCreatedIdx: index("transfer_rumor_comments_rumor_created_idx").on(t.rumorId, t.createdAt),
    userIdIdx: index("transfer_rumor_comments_user_idx").on(t.userId),
  })
);

// Forum (Comunidade)
export const teamsForumTopics = pgTable(
  "teams_forum_topics",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    teamId: varchar("team_id", { length: 36 })
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    authorId: varchar("author_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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
    moderationStatus: forumModerationStatusEnum("moderation_status").notNull().default("APPROVED"),
  },
  (t) => ({
    teamIdIdx: index("teams_forum_topics_team_id_idx").on(t.teamId),
    createdAtIdx: index("teams_forum_topics_created_at_idx").on(t.createdAt),
    categoryIdx: index("teams_forum_topics_category_idx").on(t.category),
    teamCategoryIdx: index("teams_forum_topics_team_category_idx").on(t.teamId, t.category),
  })
);

export const teamsForumReplies = pgTable(
  "teams_forum_replies",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    topicId: varchar("topic_id", { length: 36 })
      .notNull()
      .references(() => teamsForumTopics.id, { onDelete: "cascade" }),
    authorId: varchar("author_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    likesCount: integer("likes_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    topicIdIdx: index("teams_forum_replies_topic_id_idx").on(t.topicId),
  })
);

export const teamsForumLikes = pgTable(
  "teams_forum_likes",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: varchar("topic_id", { length: 36 }).references(() => teamsForumTopics.id, { onDelete: "cascade" }),
    replyId: varchar("reply_id", { length: 36 }).references(() => teamsForumReplies.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    topicIdx: index("teams_forum_likes_topic_idx").on(t.topicId),
    replyIdx: index("teams_forum_likes_reply_idx").on(t.replyId),
  })
);

// ============================================
// GAMES (históricos - Adivinhe o Elenco)
// ============================================

export const gameSets = pgTable(
  "game_sets",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    season: integer("season"),
    competition: text("competition"),
    clubName: text("club_name").notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: index("game_sets_slug_idx").on(t.slug),
  })
);

export const gameSetPlayers = pgTable(
  "game_set_players",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    setId: varchar("set_id", { length: 36 })
      .notNull()
      .references(() => gameSets.id, { onDelete: "cascade" }),
    jerseyNumber: integer("jersey_number"),
    displayName: text("display_name").notNull(),
    normalizedName: text("normalized_name").notNull(),
    aliases: json("aliases").$type<string[]>(),
    role: varchar("role", { length: 20 }).default("player"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    setIdIdx: index("game_set_players_set_id_idx").on(t.setId),
    normalizedNameIdx: index("game_set_players_normalized_name_idx").on(t.normalizedName),
  })
);

export const gameAttempts = pgTable(
  "game_attempts",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    setId: varchar("set_id", { length: 36 })
      .notNull()
      .references(() => gameSets.id, { onDelete: "cascade" }),
    status: gameAttemptStatusEnum("status").notNull().default("in_progress"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    guessesCount: integer("guesses_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userSetIdx: uniqueIndex("game_attempts_user_set_unique").on(t.userId, t.setId),
    userIdIdx: index("game_attempts_user_id_idx").on(t.userId),
    setIdIdx: index("game_attempts_set_id_idx").on(t.setId),
  })
);

export const gameAttemptGuesses = pgTable(
  "game_attempt_guesses",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    attemptId: varchar("attempt_id", { length: 36 })
      .notNull()
      .references(() => gameAttempts.id, { onDelete: "cascade" }),
    setPlayerId: varchar("set_player_id", { length: 36 })
      .notNull()
      .references(() => gameSetPlayers.id, { onDelete: "cascade" }),
    guessedText: text("guessed_text").notNull(),
    matchedScore: real("matched_score"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    attemptPlayerUnique: uniqueIndex("game_attempt_guesses_attempt_player_unique").on(
      t.attemptId,
      t.setPlayerId
    ),
    attemptIdx: index("game_attempt_guesses_attempt_idx").on(t.attemptId),
  })
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
  transferRumorsCreated: many(transferRumors),
  transferRumorVotes: many(transferRumorVotes),
  transferRumorComments: many(transferRumorComments),
}));

export const journalistsRelations = relations(journalists, ({ one, many }) => ({
  user: one(users, {
    fields: [journalists.userId],
    references: [users.id],
  }),
  news: many(news),
  transfers: many(transfers),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  country: one(countries, {
    fields: [teams.countryId],
    references: [countries.id],
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
  transferRumorsTo: many(transferRumors, { relationName: "transferRumorsTo" }),
}));

export const countriesRelations = relations(countries, ({ many }) => ({
  teams: many(teams),
  competitions: many(competitions),
  venues: many(venues),
}));

export const competitionsRelations = relations(competitions, ({ one, many }) => ({
  country: one(countries, {
    fields: [competitions.countryId],
    references: [countries.id],
  }),
  fixtures: many(fixtures),
  seasons: many(seasons),
  standings: many(standings),
}));

export const standingsRelations = relations(standings, ({ one }) => ({
  competition: one(competitions, {
    fields: [standings.competitionId],
    references: [competitions.id],
  }),
  team: one(teams, {
    fields: [standings.teamId],
    references: [teams.id],
  }),
}));

export const seasonsRelations = relations(seasons, ({ one, many }) => ({
  competition: one(competitions, {
    fields: [seasons.competitionId],
    references: [competitions.id],
  }),
  teamRosters: many(teamRosters),
  matchGames: many(matchGames),
}));

export const venuesRelations = relations(venues, ({ one }) => ({
  country: one(countries, {
    fields: [venues.countryId],
    references: [countries.id],
  }),
}));

export const teamRostersRelations = relations(teamRosters, ({ one, many }) => ({
  team: one(teams, {
    fields: [teamRosters.teamId],
    references: [teams.id],
  }),
  season: one(seasons, {
    fields: [teamRosters.seasonId],
    references: [seasons.id],
  }),
  player: one(players, {
    fields: [teamRosters.playerId],
    references: [players.id],
  }),
  contracts: many(contracts),
}));

export const contractsRelations = relations(contracts, ({ one }) => ({
  teamRoster: one(teamRosters, {
    fields: [contracts.teamRosterId],
    references: [teamRosters.id],
  }),
}));

export const matchGamesRelations = relations(matchGames, ({ one, many }) => ({
  season: one(seasons, {
    fields: [matchGames.seasonId],
    references: [seasons.id],
  }),
  competition: one(competitions, {
    fields: [matchGames.competitionId],
    references: [competitions.id],
  }),
  venue: one(venues, {
    fields: [matchGames.venueId],
    references: [venues.id],
  }),
  homeTeam: one(teams, {
    fields: [matchGames.homeTeamId],
    references: [teams.id],
  }),
  awayTeam: one(teams, {
    fields: [matchGames.awayTeamId],
    references: [teams.id],
  }),
  events: many(matchEvents),
  lineups: many(matchLineups),
  playerStats: many(playerMatchStats),
  teamStats: many(teamMatchStats),
}));

export const matchEventsRelations = relations(matchEvents, ({ one }) => ({
  match: one(matchGames, {
    fields: [matchEvents.matchId],
    references: [matchGames.id],
  }),
  team: one(teams, {
    fields: [matchEvents.teamId],
    references: [teams.id],
  }),
  player: one(players, {
    fields: [matchEvents.playerId],
    references: [players.id],
  }),
}));

export const matchLineupsRelations = relations(matchLineups, ({ one, many }) => ({
  match: one(matchGames, {
    fields: [matchLineups.matchId],
    references: [matchGames.id],
  }),
  team: one(teams, {
    fields: [matchLineups.teamId],
    references: [teams.id],
  }),
  players: many(matchLineupPlayers),
}));

export const matchLineupPlayersRelations = relations(matchLineupPlayers, ({ one }) => ({
  matchLineup: one(matchLineups, {
    fields: [matchLineupPlayers.matchLineupId],
    references: [matchLineups.id],
  }),
  player: one(players, {
    fields: [matchLineupPlayers.playerId],
    references: [players.id],
  }),
}));

export const playerMatchStatsRelations = relations(playerMatchStats, ({ one }) => ({
  match: one(matchGames, {
    fields: [playerMatchStats.matchId],
    references: [matchGames.id],
  }),
  player: one(players, {
    fields: [playerMatchStats.playerId],
    references: [players.id],
  }),
  team: one(teams, {
    fields: [playerMatchStats.teamId],
    references: [teams.id],
  }),
}));

export const teamMatchStatsRelations = relations(teamMatchStats, ({ one }) => ({
  match: one(matchGames, {
    fields: [teamMatchStats.matchId],
    references: [matchGames.id],
  }),
  team: one(teams, {
    fields: [teamMatchStats.teamId],
    references: [teams.id],
  }),
}));

export const injuriesRelations = relations(injuries, ({ one }) => ({
  player: one(players, {
    fields: [injuries.playerId],
    references: [players.id],
  }),
  team: one(teams, {
    fields: [injuries.teamId],
    references: [teams.id],
  }),
}));

export const transfersSportRelations = relations(transfersSport, ({ one }) => ({
  player: one(players, {
    fields: [transfersSport.playerId],
    references: [players.id],
  }),
  fromTeam: one(teams, {
    fields: [transfersSport.fromTeamId],
    references: [teams.id],
  }),
  toTeam: one(teams, {
    fields: [transfersSport.toTeamId],
    references: [teams.id],
  }),
}));

export const fixturesRelations = relations(fixtures, ({ one }) => ({
  team: one(teams, {
    fields: [fixtures.teamId],
    references: [teams.id],
  }),
  competition: one(competitions, {
    fields: [fixtures.competitionId],
    references: [competitions.id],
  }),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
  ratings: many(playerRatings),
  matchParticipations: many(matchPlayers),
  teamRosters: many(teamRosters),
  transferRumors: many(transferRumors),
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

export const transfersRelations = relations(transfers, ({ one, many }) => ({
  fromTeam: one(teams, {
    fields: [transfers.fromTeamId],
    references: [teams.id],
  }),
  toTeam: one(teams, {
    fields: [transfers.toTeamId],
    references: [teams.id],
  }),
  createdByJournalist: one(journalists, {
    fields: [transfers.createdByJournalistId],
    references: [journalists.id],
  }),
  votes: many(transferVotes),
}));

export const transferVotesRelations = relations(transferVotes, ({ one }) => ({
  transfer: one(transfers, {
    fields: [transferVotes.transferId],
    references: [transfers.id],
  }),
  user: one(users, {
    fields: [transferVotes.userId],
    references: [users.id],
  }),
}));

export const transferRumorsRelations = relations(transferRumors, ({ one, many }) => ({
  player: one(players, { fields: [transferRumors.playerId], references: [players.id] }),
  fromTeam: one(teams, {
    fields: [transferRumors.fromTeamId],
    references: [teams.id],
    relationName: "transferRumorsFrom",
  }),
  toTeam: one(teams, {
    fields: [transferRumors.toTeamId],
    references: [teams.id],
    relationName: "transferRumorsTo",
  }),
  createdByUser: one(users, { fields: [transferRumors.createdByUserId], references: [users.id] }),
  votes: many(transferRumorVotes),
  comments: many(transferRumorComments),
}));

export const transferRumorVotesRelations = relations(transferRumorVotes, ({ one }) => ({
  rumor: one(transferRumors, { fields: [transferRumorVotes.rumorId], references: [transferRumors.id] }),
  user: one(users, { fields: [transferRumorVotes.userId], references: [users.id] }),
}));

export const transferRumorCommentsRelations = relations(transferRumorComments, ({ one }) => ({
  rumor: one(transferRumors, { fields: [transferRumorComments.rumorId], references: [transferRumors.id] }),
  user: one(users, { fields: [transferRumorComments.userId], references: [users.id] }),
}));

export const teamsForumTopicsRelations = relations(teamsForumTopics, ({ one, many }) => ({
  team: one(teams, { fields: [teamsForumTopics.teamId], references: [teams.id] }),
  author: one(users, { fields: [teamsForumTopics.authorId], references: [users.id] }),
  replies: many(teamsForumReplies),
  likes: many(teamsForumLikes),
}));

export const teamsForumRepliesRelations = relations(teamsForumReplies, ({ one, many }) => ({
  topic: one(teamsForumTopics, { fields: [teamsForumReplies.topicId], references: [teamsForumTopics.id] }),
  author: one(users, { fields: [teamsForumReplies.authorId], references: [users.id] }),
  likes: many(teamsForumLikes),
}));

export const teamsForumLikesRelations = relations(teamsForumLikes, ({ one }) => ({
  user: one(users, { fields: [teamsForumLikes.userId], references: [users.id] }),
  topic: one(teamsForumTopics, { fields: [teamsForumLikes.topicId], references: [teamsForumTopics.id] }),
  reply: one(teamsForumReplies, { fields: [teamsForumLikes.replyId], references: [teamsForumReplies.id] }),
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

// Competition schemas
export const insertCompetitionSchema = createInsertSchema(competitions).omit({ id: true, createdAt: true, updatedAt: true });
export const selectCompetitionSchema = createSelectSchema(competitions);

// Fixture schemas
export const insertFixtureSchema = createInsertSchema(fixtures).omit({ id: true, createdAt: true, updatedAt: true });
export const selectFixtureSchema = createSelectSchema(fixtures);

// Standing schemas
export const insertStandingSchema = createInsertSchema(standings).omit({ id: true, createdAt: true, updatedAt: true });
export const selectStandingSchema = createSelectSchema(standings);

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

// Transfer schemas
export const insertTransferSchema = createInsertSchema(transfers).omit({ id: true, createdAt: true, updatedAt: true });
export const selectTransferSchema = createSelectSchema(transfers);

// Transfer vote schemas
export const insertTransferVoteSchema = createInsertSchema(transferVotes).omit({ id: true, createdAt: true });
export const selectTransferVoteSchema = createSelectSchema(transferVotes);

// Transfer rumor schemas (Vai e Vem)
export const insertTransferRumorSchema = createInsertSchema(transferRumors).omit({ id: true, createdAt: true, updatedAt: true });
export const selectTransferRumorSchema = createSelectSchema(transferRumors);

export const insertTransferRumorVoteSchema = createInsertSchema(transferRumorVotes).omit({ id: true, createdAt: true });
export const selectTransferRumorVoteSchema = createSelectSchema(transferRumorVotes);

export const insertTransferRumorCommentSchema = createInsertSchema(transferRumorComments).omit({ id: true, createdAt: true, updatedAt: true });
export const selectTransferRumorCommentSchema = createSelectSchema(transferRumorComments);

// Forum topic schemas
export const insertForumTopicSchema = createInsertSchema(teamsForumTopics, {
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres").max(300),
  content: z.string().min(10, "Conteúdo deve ter pelo menos 10 caracteres"),
  category: z.enum(["news", "pre_match", "post_match", "transfer", "off_topic", "base"]).optional(),
}).omit({ id: true, teamId: true, authorId: true, viewsCount: true, likesCount: true, repliesCount: true, createdAt: true, updatedAt: true, isPinned: true, isLocked: true, reportCount: true, isRemoved: true, moderationStatus: true });
export const selectForumTopicSchema = createSelectSchema(teamsForumTopics);

// Forum reply schemas
export const insertForumReplySchema = createInsertSchema(teamsForumReplies, {
  content: z.string().min(1, "Resposta não pode ser vazia").max(5000),
}).omit({ id: true, topicId: true, authorId: true, likesCount: true, createdAt: true });
export const selectForumReplySchema = createSelectSchema(teamsForumReplies);

// Game schemas (for seed/admin only; API uses custom validation)
export const insertGameSetSchema = createInsertSchema(gameSets);
export const insertGameSetPlayerSchema = createInsertSchema(gameSetPlayers);
export const insertGameAttemptSchema = createInsertSchema(gameAttempts);
export const insertGameAttemptGuessSchema = createInsertSchema(gameAttemptGuesses);

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

export type Competition = typeof competitions.$inferSelect;
export type InsertCompetition = z.infer<typeof insertCompetitionSchema>;

export type Fixture = typeof fixtures.$inferSelect;
export type InsertFixture = z.infer<typeof insertFixtureSchema>;

export type Standing = typeof standings.$inferSelect;
export type InsertStanding = z.infer<typeof insertStandingSchema>;

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

export type Transfer = typeof transfers.$inferSelect;
export type InsertTransfer = z.infer<typeof insertTransferSchema>;

export type TransferVote = typeof transferVotes.$inferSelect;
export type InsertTransferVote = z.infer<typeof insertTransferVoteSchema>;

export type TransferRumor = typeof transferRumors.$inferSelect;
export type InsertTransferRumor = z.infer<typeof insertTransferRumorSchema>;

export type TransferRumorVote = typeof transferRumorVotes.$inferSelect;
export type InsertTransferRumorVote = z.infer<typeof insertTransferRumorVoteSchema>;

export type TransferRumorComment = typeof transferRumorComments.$inferSelect;
export type InsertTransferRumorComment = z.infer<typeof insertTransferRumorCommentSchema>;

export type ForumTopic = typeof teamsForumTopics.$inferSelect;
export type InsertForumTopic = z.infer<typeof insertForumTopicSchema>;

export type ForumReply = typeof teamsForumReplies.$inferSelect;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;

export type ForumLike = typeof teamsForumLikes.$inferSelect;

export type GameSet = typeof gameSets.$inferSelect;
export type InsertGameSet = z.infer<typeof insertGameSetSchema>;
export type GameSetPlayer = typeof gameSetPlayers.$inferSelect;
export type InsertGameSetPlayer = z.infer<typeof insertGameSetPlayerSchema>;
export type GameAttempt = typeof gameAttempts.$inferSelect;
export type InsertGameAttempt = z.infer<typeof insertGameAttemptSchema>;
export type GameAttemptGuess = typeof gameAttemptGuesses.$inferSelect;
export type InsertGameAttemptGuess = z.infer<typeof insertGameAttemptGuessSchema>;

export type Country = typeof countries.$inferSelect;
export type Venue = typeof venues.$inferSelect;
export type Season = typeof seasons.$inferSelect;
export type TeamRoster = typeof teamRosters.$inferSelect;
export type Contract = typeof contracts.$inferSelect;
export type MatchGame = typeof matchGames.$inferSelect;
export type MatchEvent = typeof matchEvents.$inferSelect;
export type MatchLineup = typeof matchLineups.$inferSelect;
export type MatchLineupPlayer = typeof matchLineupPlayers.$inferSelect;
export type PlayerMatchStat = typeof playerMatchStats.$inferSelect;
export type TeamMatchStat = typeof teamMatchStats.$inferSelect;
export type Injury = typeof injuries.$inferSelect;
export type TransferSport = typeof transfersSport.$inferSelect;

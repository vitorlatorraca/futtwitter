import { db } from "./db";
import { eq, and, desc, or, ilike, sql, inArray, gt } from "drizzle-orm";
import { TEAMS_DATA } from "./teams-data";
import {
  users,
  journalists,
  teams,
  players,
  matches,
  matchPlayers,
  news,
  newsInteractions,
  comments,
  commentLikes,
  playerRatings,
  badges,
  userBadges,
  notifications,
  userLineups,
  transfers,
  transferVotes,
  type User,
  type InsertUser,
  type Journalist,
  type InsertJournalist,
  type Team,
  type InsertTeam,
  type Player,
  type InsertPlayer,
  type Match,
  type InsertMatch,
  type News,
  type InsertNewsServer,
  type NewsInteraction,
  type InsertNewsInteraction,
  type Comment,
  type PlayerRating,
  type InsertPlayerRating,
  type Badge,
  type UserBadge,
  type InsertUserBadge,
  type Notification,
  type InsertNotification,
  type Transfer,
  type InsertTransfer,
  type TransferVote,
  type InsertTransferVote,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;

  // Journalists
  getJournalist(userId: string): Promise<Journalist | undefined>;
  createJournalist(journalist: InsertJournalist): Promise<Journalist>;
  updateJournalistByUserId(userId: string, data: Partial<Pick<Journalist, "status" | "verificationDate">>): Promise<Journalist | undefined>;
  deleteJournalistByUserId(userId: string): Promise<void>;
  approveJournalistByEmail(email: string): Promise<{
    user: User;
    previousJournalistStatus: "APPROVED" | "PENDING" | "REJECTED" | "SUSPENDED" | null;
    finalJournalistStatus: "APPROVED";
  }>;

  // Teams
  getAllTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  seedTeamsIfEmpty(): Promise<{ seeded: boolean; count: number }>;

  // Players
  getPlayersByTeam(teamId: string): Promise<Player[]>;
  getPlayer(id: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;

  // Matches
  getMatch(id: string): Promise<Match | undefined>;
  getMatchesByTeam(teamId: string, limit?: number): Promise<Match[]>;
  getNextMatch(teamId: string): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateTeamStandings(): Promise<void>;
  getLastMatchWithRatings(teamId: string): Promise<{
    match: { id: string; opponent: string; opponentLogoUrl: string | null; matchDate: Date; teamScore: number; opponentScore: number; isHomeMatch: boolean; competition: string | null; championshipRound: number | null; status: string; isMock: boolean };
    players: Array<{ playerId: string; name: string; shirtNumber: number | null; rating: number; minutes: number | null }>;
  } | null>;

  // News
  getAllNews(options?: { teamId?: string; limit?: number; scope?: "all" | "team" | "europe"; userTeamId?: string }): Promise<any[]>;
  getNewsById(id: string): Promise<News | undefined>;
  getNewsByJournalist(journalistId: string): Promise<News[]>;
  createNews(news: InsertNewsServer): Promise<News>;
  updateNews(id: string, data: Partial<News>): Promise<News | undefined>;
  deleteNews(id: string): Promise<void>;

  // News Interactions
  getUserNewsInteraction(userId: string, newsId: string): Promise<NewsInteraction | undefined>;
  createNewsInteraction(interaction: InsertNewsInteraction): Promise<NewsInteraction>;
  deleteNewsInteraction(userId: string, newsId: string): Promise<void>;
  recalculateNewsCounts(newsId: string): Promise<void>;

  // Comments (on news)
  getComment(commentId: string): Promise<Comment | undefined>;
  createComment(params: { newsId: string; userId: string; content: string }): Promise<Comment>;
  listCommentsByNewsId(newsId: string, viewerUserId?: string | null): Promise<Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: { name: string; avatarUrl: string | null };
    likeCount: number;
    viewerHasLiked: boolean;
  }>>;
  hasCommentLike(commentId: string, userId: string): Promise<boolean>;
  addCommentLike(commentId: string, userId: string): Promise<void>;
  removeCommentLike(commentId: string, userId: string): Promise<void>;

  // Player Ratings
  createPlayerRating(rating: InsertPlayerRating): Promise<PlayerRating>;
  upsertPlayerRating(userId: string, playerId: string, matchId: string, rating: number, comment?: string): Promise<PlayerRating>;
  getPlayerRatings(playerId: string): Promise<PlayerRating[]>;
  getPlayerAverageRating(playerId: string): Promise<number | null>;
  getRatingsByMatch(matchId: string): Promise<Array<{ playerId: string; average: number; count: number }>>;
  getUserRatingsForMatch(userId: string, matchId: string): Promise<Array<{ playerId: string; rating: number; comment: string | null }>>;
  getUserRatingForPlayerInMatch(userId: string, matchId: string, playerId: string): Promise<{ rating: number } | null>;
  getMatchLineup(matchId: string): Promise<{
    matchId: string;
    formation: string;
    starters: Array<{ playerId: string; name: string; shirtNumber: number | null; position: string; minutesPlayed: number | null }>;
    substitutes: Array<{ playerId: string; name: string; shirtNumber: number | null; position: string; minutesPlayed: number | null; minuteEntered: number | null }>;
  } | null>;

  // User Lineups
  getUserLineup(userId: string, teamId: string): Promise<any | undefined>;
  upsertUserLineup(userId: string, teamId: string, formation: string, slots: Array<{ slotIndex: number; playerId: string }>): Promise<any>;

  // Admin
  searchUsersForAdmin(
    q: string,
    limit?: number
  ): Promise<Array<{ id: string; email: string; name: string; journalistStatus: "APPROVED" | "PENDING" | "REJECTED" | "SUSPENDED" | null; isJournalist: boolean }>>;

  // Badges
  getAllBadges(): Promise<Badge[]>;
  getUserBadges(userId: string): Promise<any[]>;
  awardBadge(userId: string, badgeId: string): Promise<UserBadge>;
  checkAndAwardBadges(userId: string): Promise<UserBadge[]>;

  // Transfers (Vai e Vem)
  getTransfers(filters: { status?: string; q?: string; teamId?: string; viewerUserId?: string | null }): Promise<any[]>;
  getTransferById(id: string): Promise<Transfer | undefined>;
  createTransfer(transfer: InsertTransfer): Promise<Transfer>;
  getUserTransferVote(transferId: string, userId: string): Promise<TransferVote | undefined>;
  createTransferVote(transferId: string, userId: string, vote: "UP" | "DOWN"): Promise<TransferVote>;
}

/** Formation slot order by position: GK, DEF, MID, FWD (for 4-2-3-1) */
function positionOrderForLineup(pos: string): number {
  const p = (pos || "").toUpperCase();
  if (p.includes("GOAL") || p === "GK") return 0;
  if (p.includes("DEF") || p === "CB" || p === "LB" || p === "RB" || p === "WB") return 1;
  if (p.includes("MID") || p === "DM" || p === "CM" || p === "AM" || p === "LM" || p === "RM") return 2;
  return 3;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Journalists
  async getJournalist(userId: string): Promise<Journalist | undefined> {
    const [journalist] = await db
      .select()
      .from(journalists)
      .where(eq(journalists.userId, userId));
    return journalist || undefined;
  }

  async createJournalist(insertJournalist: InsertJournalist): Promise<Journalist> {
    const [journalist] = await db
      .insert(journalists)
      .values(insertJournalist)
      .returning();
    return journalist;
  }

  async updateJournalistByUserId(
    userId: string,
    data: Partial<Pick<Journalist, "status" | "verificationDate">>
  ): Promise<Journalist | undefined> {
    const [journalist] = await db
      .update(journalists)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(journalists.userId, userId))
      .returning();
    return journalist || undefined;
  }

  async deleteJournalistByUserId(userId: string): Promise<void> {
    await db.delete(journalists).where(eq(journalists.userId, userId));
  }

  async approveJournalistByEmail(email: string): Promise<{
    user: User;
    previousJournalistStatus: "APPROVED" | "PENDING" | "REJECTED" | "SUSPENDED" | null;
    finalJournalistStatus: "APPROVED";
  }> {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("approveJournalistByEmail só pode ser executado em NODE_ENV=development");
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error("Email inválido (vazio)");
    }

    const [user] = await db
      .select()
      .from(users)
      .where(ilike(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      throw new Error(`Usuário não encontrado para o email: ${normalizedEmail}`);
    }

    const existingJournalist = await this.getJournalist(user.id);
    const previousJournalistStatus = existingJournalist?.status ?? null;

    // Idempotente: se já estiver APPROVED, não faz nada.
    if (existingJournalist?.status === "APPROVED") {
      return {
        user,
        previousJournalistStatus,
        finalJournalistStatus: "APPROVED",
      };
    }

    const now = new Date();

    if (!existingJournalist) {
      await db.insert(journalists).values({
        userId: user.id,
        organization: "A ser definido",
        professionalId: "N/A",
        status: "APPROVED",
        verificationDate: now,
      });
    } else {
      await this.updateJournalistByUserId(user.id, { status: "APPROVED", verificationDate: now });
    }

    // Alinhar com o fluxo existente: usuário aprovado vira JOURNALIST (mas nunca rebaixa ADMIN).
    if (user.userType !== "ADMIN") {
      await this.updateUser(user.id, { userType: "JOURNALIST" });
    }

    return {
      user,
      previousJournalistStatus,
      finalJournalistStatus: "APPROVED",
    };
  }

  // Teams
  async getAllTeams(): Promise<Team[]> {
    return await db.select().from(teams).orderBy(teams.name);
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || undefined;
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const [team] = await db.insert(teams).values(insertTeam).returning();
    return team;
  }

  async seedTeamsIfEmpty(): Promise<{ seeded: boolean; count: number }> {
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
        secondaryColor: t.secondaryColor,
      }))
    );

    return { seeded: true, count: TEAMS_DATA.length };
  }

  // Players
  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    const sectorOrder = sql<number>`case
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

    return await db
      .select()
      .from(players)
      .where(eq(players.teamId, teamId))
      .orderBy(
        sectorOrder,
        players.position,
        sql`${players.shirtNumber} is null`,
        players.shirtNumber,
        players.name,
      );
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player || undefined;
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const [player] = await db.insert(players).values(insertPlayer).returning();
    return player;
  }

  // Matches
  async getMatch(id: string): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id)).limit(1);
    return match;
  }

  async getMatchesByTeam(teamId: string, limit = 10): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(eq(matches.teamId, teamId))
      .orderBy(desc(matches.matchDate))
      .limit(limit);
  }

  async getNextMatch(teamId: string): Promise<Match | undefined> {
    const now = new Date();
    const [match] = await db
      .select()
      .from(matches)
      .where(and(eq(matches.teamId, teamId), gt(matches.matchDate, now)))
      .orderBy(matches.matchDate)
      .limit(1);
    return match ?? undefined;
  }

  async getLastMatchWithRatings(teamId: string): Promise<{
    match: { id: string; opponent: string; opponentLogoUrl: string | null; matchDate: Date; teamScore: number; opponentScore: number; isHomeMatch: boolean; competition: string | null; championshipRound: number | null; status: string; isMock: boolean };
    players: Array<{ playerId: string; name: string; shirtNumber: number | null; rating: number; minutes: number | null }>;
  } | null> {
    const [lastMatch] = await db
      .select()
      .from(matches)
      .where(and(eq(matches.teamId, teamId), eq(matches.status, 'COMPLETED')))
      .orderBy(desc(matches.matchDate))
      .limit(1);
    if (!lastMatch || lastMatch.teamScore === null || lastMatch.opponentScore === null) return null;

    const mpList = await db
      .select({
        playerId: matchPlayers.playerId,
        rating: matchPlayers.sofascoreRating,
        minutes: matchPlayers.minutesPlayed,
        wasStarter: matchPlayers.wasStarter,
        name: players.name,
        shirtNumber: players.shirtNumber,
      })
      .from(matchPlayers)
      .innerJoin(players, eq(matchPlayers.playerId, players.id))
      .where(eq(matchPlayers.matchId, lastMatch.id));

    const sorted = mpList
      .filter((m) => m.rating != null)
      .sort((a, b) => {
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
        isMock: lastMatch.isMock ?? false,
      },
      players: sorted.map((p) => ({
        playerId: p.playerId,
        name: p.name,
        shirtNumber: p.shirtNumber,
        rating: p.rating as number,
        minutes: p.minutes,
      })),
    };
  }

  async getMatchLineup(matchId: string): Promise<{
    matchId: string;
    formation: string;
    starters: Array<{ playerId: string; name: string; shirtNumber: number | null; position: string; minutesPlayed: number | null }>;
    substitutes: Array<{ playerId: string; name: string; shirtNumber: number | null; position: string; minutesPlayed: number | null; minuteEntered: number | null }>;
  } | null> {
    const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
    if (!match) return null;

    const mpList = await db
      .select({
        playerId: matchPlayers.playerId,
        wasStarter: matchPlayers.wasStarter,
        minutesPlayed: matchPlayers.minutesPlayed,
        name: players.name,
        shirtNumber: players.shirtNumber,
        position: players.position,
      })
      .from(matchPlayers)
      .innerJoin(players, eq(matchPlayers.playerId, players.id))
      .where(eq(matchPlayers.matchId, matchId));

    const starters = mpList
      .filter((m) => m.wasStarter)
      .sort((a, b) => {
        const orderA = positionOrderForLineup(a.position);
        const orderB = positionOrderForLineup(b.position);
        if (orderA !== orderB) return orderA - orderB;
        return (a.shirtNumber ?? 99) - (b.shirtNumber ?? 99);
      })
      .map((p) => ({
        playerId: p.playerId,
        name: p.name,
        shirtNumber: p.shirtNumber,
        position: p.position,
        minutesPlayed: p.minutesPlayed,
      }));

    const substitutes = mpList
      .filter((m) => !m.wasStarter)
      .sort((a, b) => (b.minutesPlayed ?? 0) - (a.minutesPlayed ?? 0))
      .map((p) => ({
        playerId: p.playerId,
        name: p.name,
        shirtNumber: p.shirtNumber,
        position: p.position,
        minutesPlayed: p.minutesPlayed,
        minuteEntered: p.minutesPlayed != null ? 90 - p.minutesPlayed : null,
      }));

    // Fallback: when match exists but no match_players (e.g. seed not run), build demo lineup from team roster
    let finalStarters = starters;
    if (starters.length === 0) {
      const roster = await db
        .select({ playerId: players.id, name: players.name, shirtNumber: players.shirtNumber, position: players.position })
        .from(players)
        .where(eq(players.teamId, match.teamId));
      finalStarters = roster
        .sort((a, b) => {
          const orderA = positionOrderForLineup(a.position);
          const orderB = positionOrderForLineup(b.position);
          if (orderA !== orderB) return orderA - orderB;
          return (a.shirtNumber ?? 99) - (b.shirtNumber ?? 99);
        })
        .slice(0, 11)
        .map((p) => ({
          playerId: p.playerId,
          name: p.name,
          shirtNumber: p.shirtNumber,
          position: p.position,
          minutesPlayed: null as number | null,
        }));
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[getMatchLineup] fallback demo lineup', { matchId, startersCount: finalStarters.length });
      }
    } else if (process.env.NODE_ENV !== 'production') {
      console.debug('[getMatchLineup]', { matchId, startersCount: starters.length, subsCount: substitutes.length });
    }

    return {
      matchId,
      formation: "4-2-3-1",
      starters: finalStarters,
      substitutes,
    };
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    // Auto-set status to COMPLETED if both scores are provided
    const matchData = {
      ...insertMatch,
      status: (insertMatch.teamScore !== null && insertMatch.opponentScore !== null)
        ? 'COMPLETED'
        : insertMatch.status || 'SCHEDULED',
    };

    const [match] = await db.insert(matches).values(matchData).returning();
    
    // Update team standings if match is completed
    if (match.status === 'COMPLETED') {
      await this.updateTeamStandings();
    }
    
    return match;
  }

  async updateTeamStandings(): Promise<void> {
    // Get all teams
    const allTeams = await this.getAllTeams();
    
    // Calculate stats from completed matches only
    const completedMatches = await db
      .select()
      .from(matches)
      .where(eq(matches.status, 'COMPLETED'));

    // Build stats per team
    const teamStats: Record<string, {
      points: number;
      wins: number;
      draws: number;
      losses: number;
      goalsFor: number;
      goalsAgainst: number;
    }> = {};

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

    // Update all teams with calculated stats in batch
    const updatePromises = Object.entries(teamStats).map(([teamId, stats]) =>
      db
        .update(teams)
        .set({
          ...stats,
          updatedAt: new Date(),
        })
        .where(eq(teams.id, teamId))
    );
    await Promise.all(updatePromises);

    // Calculate and update positions based on points
    const rankedTeams = allTeams
      .map(team => ({
        id: team.id,
        points: teamStats[team.id]?.points || 0,
        wins: teamStats[team.id]?.wins || 0,
        goalsFor: teamStats[team.id]?.goalsFor || 0,
        goalsAgainst: teamStats[team.id]?.goalsAgainst || 0,
      }))
      .sort((a, b) => {
        // Sort by points, then wins, then goal difference
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        const goalDiffA = a.goalsFor - a.goalsAgainst;
        const goalDiffB = b.goalsFor - b.goalsAgainst;
        if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
        return b.goalsFor - a.goalsFor; // Goals scored
      });

    // Update positions in batch
    const positionPromises = rankedTeams.map((team, i) =>
      db
        .update(teams)
        .set({
          currentPosition: i + 1,
          updatedAt: new Date(),
        })
        .where(eq(teams.id, team.id))
    );
    await Promise.all(positionPromises);
  }

  // News
  async getAllNews(options?: { teamId?: string; limit?: number; scope?: "all" | "team" | "europe"; userTeamId?: string }): Promise<any[]> {
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
      // Legacy: filter by teamId when no scope (e.g. old frontend)
      if (teamId) conditions.push(eq(news.teamId, teamId));
    }

    const rows = await db
      .select({
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
        journalistUserName: users.name,
      })
      .from(news)
      .leftJoin(teams, eq(news.teamId, teams.id))
      .innerJoin(journalists, eq(news.journalistId, journalists.id))
      .innerJoin(users, eq(journalists.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(news.createdAt))
      .limit(limit);

    return rows.map(({ journalistUserName, ...r }) => ({
      ...r,
      team: r.team ?? null,
      journalist: {
        id: r.journalistId,
        user: { name: journalistUserName },
      },
    }));
  }

  async getNewsById(id: string): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem || undefined;
  }

  async getNewsByJournalist(journalistId: string): Promise<News[]> {
    return await db
      .select()
      .from(news)
      .where(eq(news.journalistId, journalistId))
      .orderBy(desc(news.publishedAt));
  }

  async createNews(insertNews: InsertNewsServer): Promise<News> {
    // Segurança: nunca permitir que o client publique como "não publicado".
    // (O schema já bloqueia isPublished no payload, mas garantimos aqui também.)
    const [newsItem] = await db
      .insert(news)
      .values({ ...(insertNews as any), isPublished: true, publishedAt: new Date() })
      .returning();
    return newsItem;
  }

  async updateNews(id: string, data: Partial<News>): Promise<News | undefined> {
    const [newsItem] = await db
      .update(news)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(news.id, id))
      .returning();
    return newsItem || undefined;
  }

  async deleteNews(id: string): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  // News Interactions
  async getUserNewsInteraction(userId: string, newsId: string): Promise<NewsInteraction | undefined> {
    const [interaction] = await db
      .select()
      .from(newsInteractions)
      .where(
        and(
          eq(newsInteractions.userId, userId),
          eq(newsInteractions.newsId, newsId)
        )
      );
    return interaction || undefined;
  }

  async createNewsInteraction(insertInteraction: InsertNewsInteraction): Promise<NewsInteraction> {
    const [interaction] = await db
      .insert(newsInteractions)
      .values(insertInteraction)
      .returning();
    return interaction;
  }

  async deleteNewsInteraction(userId: string, newsId: string): Promise<void> {
    await db
      .delete(newsInteractions)
      .where(
        and(
          eq(newsInteractions.userId, userId),
          eq(newsInteractions.newsId, newsId)
        )
      );
  }

  async recalculateNewsCounts(newsId: string): Promise<void> {
    // Count likes and dislikes for this news
    const interactions = await db
      .select()
      .from(newsInteractions)
      .where(eq(newsInteractions.newsId, newsId));

    const likesCount = interactions.filter(i => i.interactionType === 'LIKE').length;
    const dislikesCount = interactions.filter(i => i.interactionType === 'DISLIKE').length;

    // Update the news table with new counts
    await db
      .update(news)
      .set({ 
        likesCount, 
        dislikesCount,
        updatedAt: new Date()
      })
      .where(eq(news.id, newsId));
  }

  // Comments (on news)
  async getComment(commentId: string): Promise<Comment | undefined> {
    const [c] = await db.select().from(comments).where(eq(comments.id, commentId)).limit(1);
    return c ?? undefined;
  }

  async createComment(params: { newsId: string; userId: string; content: string }): Promise<Comment> {
    const inserted = await db
      .insert(comments)
      .values({
        newsId: params.newsId,
        userId: params.userId,
        content: params.content.trim(),
        isApproved: true,
      })
      .returning();
    const comment = inserted[0];
    if (!comment) {
      throw new Error('createComment: insert returned no row');
    }
    return comment;
  }

  async listCommentsByNewsId(
    newsId: string,
    viewerUserId?: string | null
  ): Promise<Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: { name: string; avatarUrl: string | null };
    likeCount: number;
    viewerHasLiked: boolean;
  }>> {
    const commentRows = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        authorName: users.name,
        authorAvatarUrl: users.avatarUrl,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.newsId, newsId))
      .orderBy(desc(comments.createdAt));

    const commentIds = commentRows.map((r) => r.id);
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

    const countByCommentId = new Map(likeCounts.map((r) => [r.commentId, r.count]));

    let viewerLikedCommentIds = new Set<string>();
    if (viewerUserId) {
      const viewerLikes = await db
        .select({ commentId: commentLikes.commentId })
        .from(commentLikes)
        .where(eq(commentLikes.userId, viewerUserId));
      viewerLikedCommentIds = new Set(viewerLikes.map((r) => r.commentId));
    }

    return commentRows.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt,
      author: { name: r.authorName, avatarUrl: r.authorAvatarUrl ?? null },
      likeCount: countByCommentId.get(r.id) ?? 0,
      viewerHasLiked: viewerLikedCommentIds.has(r.id),
    }));
  }

  async hasCommentLike(commentId: string, userId: string): Promise<boolean> {
    const [row] = await db
      .select()
      .from(commentLikes)
      .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)))
      .limit(1);
    return !!row;
  }

  async addCommentLike(commentId: string, userId: string): Promise<void> {
    await db
      .insert(commentLikes)
      .values({ commentId, userId })
      .onConflictDoNothing({ target: [commentLikes.commentId, commentLikes.userId] });
  }

  async removeCommentLike(commentId: string, userId: string): Promise<void> {
    await db
      .delete(commentLikes)
      .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)));
  }

  // Player Ratings
  async createPlayerRating(insertRating: InsertPlayerRating): Promise<PlayerRating> {
    const [rating] = await db
      .insert(playerRatings)
      .values(insertRating)
      .returning();
    return rating;
  }

  async upsertPlayerRating(userId: string, playerId: string, matchId: string, rating: number, comment?: string): Promise<PlayerRating> {
    const existing = await db
      .select()
      .from(playerRatings)
      .where(
        and(
          eq(playerRatings.userId, userId),
          eq(playerRatings.playerId, playerId),
          eq(playerRatings.matchId, matchId)
        )
      )
      .limit(1);
    if (existing.length > 0) {
      const [updated] = await db
        .update(playerRatings)
        .set({ rating, comment: comment ?? existing[0].comment, updatedAt: new Date() })
        .where(eq(playerRatings.id, existing[0].id))
        .returning();
      return updated;
    }
    const [created] = await db
      .insert(playerRatings)
      .values({ userId, playerId, matchId, rating, comment: comment ?? null })
      .returning();
    return created;
  }

  async getRatingsByMatch(matchId: string): Promise<Array<{ playerId: string; average: number; count: number }>> {
    const rows = await db
      .select({
        playerId: playerRatings.playerId,
        average: sql<number>`round(avg(${playerRatings.rating})::numeric, 2)`,
        count: sql<number>`count(*)::int`,
      })
      .from(playerRatings)
      .where(eq(playerRatings.matchId, matchId))
      .groupBy(playerRatings.playerId);
    return rows.map((r) => ({ playerId: r.playerId, average: Number(r.average), count: Number(r.count) }));
  }

  async getUserRatingsForMatch(userId: string, matchId: string): Promise<Array<{ playerId: string; rating: number; comment: string | null }>> {
    const rows = await db
      .select({ playerId: playerRatings.playerId, rating: playerRatings.rating, comment: playerRatings.comment })
      .from(playerRatings)
      .where(and(eq(playerRatings.userId, userId), eq(playerRatings.matchId, matchId)));
    return rows.map((r) => ({ playerId: r.playerId, rating: r.rating, comment: r.comment }));
  }

  /** Returns existing rating if user already rated this player in this match; null otherwise. */
  async getUserRatingForPlayerInMatch(userId: string, matchId: string, playerId: string): Promise<{ rating: number } | null> {
    const [row] = await db
      .select({ rating: playerRatings.rating })
      .from(playerRatings)
      .where(
        and(
          eq(playerRatings.userId, userId),
          eq(playerRatings.matchId, matchId),
          eq(playerRatings.playerId, playerId)
        )
      )
      .limit(1);
    return row ?? null;
  }

  async getPlayerRatings(playerId: string): Promise<PlayerRating[]> {
    return await db
      .select()
      .from(playerRatings)
      .where(eq(playerRatings.playerId, playerId))
      .orderBy(desc(playerRatings.createdAt));
  }

  async getPlayerAverageRating(playerId: string): Promise<number | null> {
    const ratings = await this.getPlayerRatings(playerId);
    if (ratings.length === 0) return null;
    
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / ratings.length;
  }

  // Admin
  async searchUsersForAdmin(
    q: string,
    limit = 10
  ): Promise<Array<{ id: string; email: string; name: string; journalistStatus: "APPROVED" | "PENDING" | "REJECTED" | "SUSPENDED" | null; isJournalist: boolean }>> {
    const term = `%${q.trim()}%`;
    if (!term || term === "%%") return [];

    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        status: journalists.status,
      })
      .from(users)
      .leftJoin(journalists, eq(journalists.userId, users.id))
      .where(or(ilike(users.email, term), ilike(users.name, term)))
      .limit(limit);

    return rows.map((r) => ({
      id: r.id,
      email: r.email,
      name: r.name,
      journalistStatus: r.status ?? null,
      isJournalist: r.status === "APPROVED",
    }));
  }

  // Badges
  async getAllBadges(): Promise<Badge[]> {
    return await db.select().from(badges);
  }

  async getUserBadges(userId: string): Promise<any[]> {
    const result = await db
      .select({
        id: userBadges.id,
        earnedAt: userBadges.earnedAt,
        badge: badges,
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId));
    
    return result;
  }

  async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
    // Check if user already has this badge
    const existing = await db
      .select()
      .from(userBadges)
      .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badgeId)))
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    const [userBadge] = await db
      .insert(userBadges)
      .values({ userId, badgeId })
      .returning();
    
    return userBadge;
  }

  async checkAndAwardBadges(userId: string): Promise<UserBadge[]> {
    const awarded: UserBadge[] = [];
    const allBadges = await this.getAllBadges();
    const userBadgesList = await this.getUserBadges(userId);
    const earnedBadgeIds = new Set(userBadgesList.map(ub => ub.badge.id));

    // Get user stats
    const ratingsCount = await db
      .select()
      .from(playerRatings)
      .where(eq(playerRatings.userId, userId));
    
    const interactionsCount = await db
      .select()
      .from(newsInteractions)
      .where(eq(newsInteractions.userId, userId));

    // Check each badge condition
    for (const badge of allBadges) {
      if (earnedBadgeIds.has(badge.id)) continue;

      let shouldAward = false;

      if (badge.condition === 'signup') {
        shouldAward = true;
      } else if (badge.condition === 'player_ratings') {
        shouldAward = ratingsCount.length >= badge.threshold;
      } else if (badge.condition === 'news_interactions') {
        shouldAward = interactionsCount.length >= badge.threshold;
      }

      if (shouldAward) {
        const userBadge = await this.awardBadge(userId, badge.id);
        awarded.push(userBadge);
        
        // Create notification for badge earned
        await this.createNotification({
          userId,
          type: 'BADGE_EARNED',
          title: 'Nova conquista desbloqueada!',
          message: `Você ganhou o badge "${badge.name}": ${badge.description}`,
          referenceId: badge.id,
          isRead: false,
        });
      }
    }

    return awarded;
  }

  // Notifications
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    
    // Publish to WebSocket if available
    // Import is done dynamically to avoid circular dependency
    import('./websocket').then(({ publishNotification }) => {
      publishNotification(newNotification);
    }).catch((err) => {
      console.error('Failed to publish notification via WebSocket:', err);
    });
    
    return newNotification;
  }

  async getUserNotifications(userId: string, limit = 50): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async markNotificationAsRead(userId: string, notificationId: string): Promise<boolean> {
    const updated = await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
      .returning({ id: notifications.id });
    return updated.length > 0;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const result = await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return result.length;
  }

  // User Lineups
  async getUserLineup(userId: string, teamId: string): Promise<any | undefined> {
    const [row] = await db
      .select()
      .from(userLineups)
      .where(and(eq(userLineups.userId, userId), eq(userLineups.teamId, teamId)))
      .limit(1);
    return row || undefined;
  }

  async upsertUserLineup(
    userId: string,
    teamId: string,
    formation: string,
    slots: Array<{ slotIndex: number; playerId: string }>,
  ): Promise<any> {
    const now = new Date();
    const [existing] = await db
      .select()
      .from(userLineups)
      .where(and(eq(userLineups.userId, userId), eq(userLineups.teamId, teamId)))
      .limit(1);

    const payload = { formation, slots, updatedAt: now };
    if (existing) {
      const [updated] = await db
        .update(userLineups)
        .set(payload)
        .where(eq(userLineups.id, existing.id))
        .returning();
      return updated!;
    }
    const [inserted] = await db
      .insert(userLineups)
      .values({ userId, teamId, formation, slots })
      .returning();
    return inserted!;
  }

  // Transfers (Vai e Vem)
  async getTransfers(filters: { status?: string; q?: string; teamId?: string; viewerUserId?: string | null }): Promise<any[]> {
    const conditions = [];
    if (filters.status && ["RUMOR", "NEGOCIACAO", "FECHADO"].includes(filters.status)) {
      conditions.push(eq(transfers.status, filters.status as "RUMOR" | "NEGOCIACAO" | "FECHADO"));
    }
    if (filters.q && filters.q.trim()) {
      conditions.push(ilike(transfers.playerName, `%${filters.q.trim()}%`));
    }
    if (filters.teamId && filters.teamId.trim()) {
      conditions.push(
        or(
          eq(transfers.fromTeamId, filters.teamId.trim()),
          eq(transfers.toTeamId, filters.teamId.trim())
        )!
      );
    }

    const result = await db
      .select({
        id: transfers.id,
        playerName: transfers.playerName,
        playerPhotoUrl: transfers.playerPhotoUrl,
        positionAbbrev: transfers.positionAbbrev,
        fromTeamId: transfers.fromTeamId,
        toTeamId: transfers.toTeamId,
        status: transfers.status,
        updatedAt: transfers.updatedAt,
        feeText: transfers.feeText,
        notes: transfers.notes,
      })
      .from(transfers)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(transfers.updatedAt))
      .limit(100);

    const allTeamIds = new Set<string>();
    for (const r of result) {
      if (r.fromTeamId) allTeamIds.add(r.fromTeamId);
      if (r.toTeamId) allTeamIds.add(r.toTeamId);
    }
    const teamList =
      allTeamIds.size > 0
        ? await db.select().from(teams).where(inArray(teams.id, Array.from(allTeamIds)))
        : [];
    const teamMap = new Map(teamList.map((t) => [t.id, { id: t.id, name: t.name, slug: t.id }]));

    const transferIds = result.map((r) => r.id);
    const voteCounts =
      transferIds.length > 0
        ? await db
            .select({
              transferId: transferVotes.transferId,
              vote: transferVotes.vote,
              count: sql<number>`count(*)::int`,
            })
            .from(transferVotes)
            .where(inArray(transferVotes.transferId, transferIds))
            .groupBy(transferVotes.transferId, transferVotes.vote)
        : [];

    const voteMap = new Map<string, { up: number; down: number }>();
    for (const id of transferIds) {
      voteMap.set(id, { up: 0, down: 0 });
    }
    for (const v of voteCounts) {
      const m = voteMap.get(v.transferId)!;
      if (v.vote === "UP") m.up = v.count;
      else m.down = v.count;
    }

    let viewerVotesMap = new Map<string, "UP" | "DOWN">();
    if (filters.viewerUserId) {
      const viewerVotes = await db
        .select({ transferId: transferVotes.transferId, vote: transferVotes.vote })
        .from(transferVotes)
        .where(
          and(
            eq(transferVotes.userId, filters.viewerUserId),
            inArray(transferVotes.transferId, transferIds)
          )
        );
      viewerVotesMap = new Map(viewerVotes.map((v) => [v.transferId, v.vote]));
    }

    return result.map((r) => {
      const votes = voteMap.get(r.id)!;
      const total = votes.up + votes.down;
      const upPercent = total > 0 ? Math.round((votes.up / total) * 100) : 0;
      const downPercent = total > 0 ? Math.round((votes.down / total) * 100) : 0;
      const fromTeam = r.fromTeamId ? teamMap.get(r.fromTeamId) : null;
      const toTeam = r.toTeamId ? teamMap.get(r.toTeamId) : null;
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
        upPercent,
        downPercent,
        voteCount: total,
        viewerVote: viewerVotesMap.get(r.id) ?? null,
      };
    });
  }

  async getTransferById(id: string): Promise<Transfer | undefined> {
    const [row] = await db.select().from(transfers).where(eq(transfers.id, id)).limit(1);
    return row ?? undefined;
  }

  async createTransfer(insertTransfer: InsertTransfer): Promise<Transfer> {
    const [t] = await db.insert(transfers).values(insertTransfer).returning();
    return t;
  }

  async getUserTransferVote(transferId: string, userId: string): Promise<TransferVote | undefined> {
    const [row] = await db
      .select()
      .from(transferVotes)
      .where(and(eq(transferVotes.transferId, transferId), eq(transferVotes.userId, userId)))
      .limit(1);
    return row ?? undefined;
  }

  async createTransferVote(
    transferId: string,
    userId: string,
    vote: "UP" | "DOWN"
  ): Promise<TransferVote> {
    const [v] = await db
      .insert(transferVotes)
      .values({ transferId, userId, vote })
      .returning();
    return v;
  }
}

export const storage = new DatabaseStorage();

import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import multer from "multer";
import { randomBytes } from "crypto";
import { fileURLToPath } from "url";
import { insertUserSchema, insertNewsSchema, insertPlayerRatingSchema, insertCommentSchema } from "@shared/schema";
import { deleteAvatarByUrl, saveAvatar } from "./services/avatarStorage";

const PgSession = ConnectPgSimple(session);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, "uploads");
const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_AVATAR_UPLOAD_BYTES = 2 * 1024 * 1024; // 2MB
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const uploadImage = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
      cb(null, unique);
    },
  }),
  limits: { fileSize: MAX_IMAGE_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      return cb(new Error('Tipo inválido. Envie um arquivo de imagem (image/*).'));
    }
    if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
      return cb(
        new Error("Extensão não permitida. Use .jpg, .jpeg, .png, .webp ou .gif."),
      );
    }
    return cb(null, true);
  },
});

function sanitizeOriginalFilename(originalName: string): string {
  const base = path.basename(originalName || "image");
  const sanitized = base
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120);
  return sanitized.length > 0 ? sanitized : "image";
}

const uploadNewsImage = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
      const safeOriginalName = sanitizeOriginalFilename(file.originalname);
      const filename = `${Date.now()}_${safeOriginalName}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: MAX_IMAGE_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = (file.mimetype || "").toLowerCase();

    if (!ALLOWED_IMAGE_MIME_TYPES.has(mime)) {
      return cb(new Error("Tipo inválido. Envie uma imagem (jpeg, png, webp ou gif)."));
    }
    if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
      return cb(new Error("Extensão não permitida. Use .jpg, .jpeg, .png, .webp ou .gif."));
    }
    return cb(null, true);
  },
});

const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AVATAR_UPLOAD_BYTES },
});

// Middleware to check if user is authenticated
function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  next();
}

// Middleware to check if user is a journalist
function requireJournalist(req: any, res: any, next: any) {
  (async () => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Não autenticado' });
      }

      // Keep session userType in sync with DB (important when permissions change).
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }
      req.session.userType = user.userType;

      if (user.userType !== 'JOURNALIST') {
        return res.status(403).json({ message: 'Acesso negado. Apenas jornalistas.' });
      }

      // Verify journalist exists in database and is approved
      const journalist = await storage.getJournalist(req.session.userId);
      if (!journalist) {
        return res.status(403).json({ message: 'Acesso negado. Registro de jornalista não encontrado.' });
      }

      if (journalist.status !== 'APPROVED') {
        return res.status(403).json({ message: 'Acesso negado. Conta de jornalista não aprovada.' });
      }

      next();
    } catch (error) {
      console.error('requireJournalist error:', error);
      return res.status(500).json({ message: 'Erro ao verificar permissões' });
    }
  })();
}

function isAdmin(user: { userType: string; email: string }): boolean {
  if (user.userType === 'ADMIN') return true;
  const emails = process.env.ADMIN_EMAILS;
  if (!emails) return false;
  const list = emails.split(',').map((e) => e.trim().toLowerCase());
  return list.includes(user.email.toLowerCase());
}

function requireAdmin(req: any, res: any, next: any) {
  (async () => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Não autenticado' });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }
      if (!isAdmin(user)) {
        return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
      }
      (req as any).adminUser = user;
      next();
    } catch (error) {
      console.error('requireAdmin error:', error);
      return res.status(500).json({ message: 'Erro ao verificar permissões' });
    }
  })();
}

// Middleware: require journalist (approved) or admin
function requireJournalistOrAdmin(req: any, res: any, next: any) {
  (async () => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Não autenticado' });
      }
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }
      if (user.userType === 'ADMIN') {
        return next();
      }
      if (user.userType !== 'JOURNALIST') {
        return res.status(403).json({ message: 'Apenas jornalistas e administradores.' });
      }
      const journalist = await storage.getJournalist(req.session.userId);
      if (!journalist || journalist.status !== 'APPROVED') {
        return res.status(403).json({ message: 'Acesso negado. Conta de jornalista não aprovada.' });
      }
      next();
    } catch (error) {
      console.error('requireJournalistOrAdmin error:', error);
      return res.status(500).json({ message: 'Erro ao verificar permissões' });
    }
  })();
}

function parseSeasonParam(value: unknown): number {
  const current = new Date().getFullYear();
  if (typeof value !== "string") return current;
  const parsed = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return current;
  return parsed;
}

function parseLimitParam(value: unknown, fallback: number, max: number): number {
  if (typeof value !== "string") return fallback;
  const parsed = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

// Export session store for WebSocket authentication
export const sessionStore = new PgSession({
  pool,
  tableName: 'user_sessions',
  createTableIfMissing: true,
});

export async function registerRoutes(app: Express): Promise<Server> {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set (required for session cookies)");
  }

  const cookieDomain =
    process.env.COOKIE_DOMAIN && process.env.COOKIE_DOMAIN.trim().length > 0
      ? process.env.COOKIE_DOMAIN.trim()
      : undefined;

  const cookieSameSiteEnv = (process.env.COOKIE_SAMESITE ?? "").trim().toLowerCase();
  const cookieSameSite =
    cookieSameSiteEnv === "lax" || cookieSameSiteEnv === "strict" || cookieSameSiteEnv === "none"
      ? (cookieSameSiteEnv as "lax" | "strict" | "none")
      : ("lax" as const);

  const cookieSecureEnv = (process.env.COOKIE_SECURE ?? "").trim().toLowerCase();
  let cookieSecure =
    cookieSecureEnv === "true"
      ? true
      : cookieSecureEnv === "false"
        ? false
        : process.env.NODE_ENV === "production";

  // Browsers require Secure when SameSite=None
  if (cookieSameSite === "none") {
    cookieSecure = true;
  }

  // Configure session
  app.use(
    session({
      store: sessionStore,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        domain: cookieDomain,
        secure: cookieSecure,
        sameSite: cookieSameSite,
      },
    })
  );

  // Ensure base data exists (idempotente).
  // Sem times no banco, o feed (join com teams) e páginas de time quebram.
  try {
    const seeded = await storage.seedTeamsIfEmpty();
    if (seeded.seeded) {
      console.log(`✅ Seeded ${seeded.count} teams (auto)`);
    }
  } catch (error) {
    console.error("❌ Falha ao seedar times automaticamente:", error);
  }

  // ============================================
  // AUTHENTICATION ROUTES
  // ============================================

  // Signup/Register handler
  const signupHandler = async (req: any, res: any) => {
    try {
      const { name, email, password, teamId } = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        name,
        email,
        password: hashedPassword,
        teamId: teamId || null,
        userType: 'FAN',
      });

      // Set session
      req.session.userId = user.id;
      req.session.userType = user.userType;

      // Award signup badge
      await storage.checkAndAwardBadges(user.id);

      res.json({ id: user.id, name: user.name, email: user.email, teamId: user.teamId, userType: user.userType });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ message: error.message || 'Erro ao criar conta' });
    }
  };

  // Support both /signup and /register for compatibility
  app.post('/api/auth/signup', signupHandler);
  app.post('/api/auth/register', signupHandler);

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Email ou senha incorretos' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Email ou senha incorretos' });
      }

      // Set session
      req.session.userId = user.id;
      req.session.userType = user.userType;

      res.json({ id: user.id, name: user.name, email: user.email, teamId: user.teamId, userType: user.userType });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: 'Erro ao fazer login' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao fazer logout' });
      }
      res.json({ message: 'Logout realizado com sucesso' });
    });
  });

  app.get('/api/auth/me', async (req, res) => {
    if (!req.session.userId) {
      return res.status(200).json(null);
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(200).json(null);
      }

      // Sync session userType with DB (e.g., after a promotion).
      req.session.userType = user.userType;

      const journalist = await storage.getJournalist(req.session.userId);
      const journalistStatus = journalist?.status ?? null;
      const isJournalist = journalist?.status === 'APPROVED';
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
      });
    } catch (error) {
      console.error("Me error:", error);
      res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  });

  // ============================================
  // TEAMS ROUTES
  // ============================================

  // --------------------------------------------
  // "Meu Time" endpoints (DB-only)
  // --------------------------------------------

  app.get("/api/teams/:teamId/summary", requireAuth, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inválido" });

    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time não encontrado" });

      const season = parseSeasonParam(req.query.season);
      return res.json({
        available: true,
        updatedAt: Date.now(),
        team: {
          name: team.name,
          logo: team.logoUrl ?? null,
          stadium: null,
          country: "Brazil",
          capacity: null,
        },
        league: season ? { id: 0, name: "Brasileirão Série A", season } : null,
      });
    } catch (error: any) {
      console.error("[meu-time][db] /summary error:", error);
      return res.status(500).json({ message: "Falha ao buscar resumo do time" });
    }
  });

  app.get("/api/teams/:teamId/fixtures", requireAuth, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inválido" });

    const rangeRaw = typeof req.query.range === "string" ? req.query.range.trim().toLowerCase() : "next";
    const range = rangeRaw === "last" ? "last" : "next";
    const limit = parseLimitParam(req.query.limit, 5, 20);

    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time não encontrado" });

      const all = await storage.getMatchesByTeam(teamId, 50);
      const now = Date.now();
      const filtered =
        range === "next"
          ? all.filter((m) => new Date(m.matchDate).getTime() >= now)
          : all.filter((m) => new Date(m.matchDate).getTime() < now);

      const fixtures = filtered
        .sort((a, b) =>
          range === "next"
            ? new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()
            : new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime(),
        )
        .slice(0, limit)
        .map((m, idx) => ({
          id: idx + 1,
          dateTime: new Date(m.matchDate).toISOString(),
          competition: "Brasileirão Série A",
          season: new Date(m.matchDate).getFullYear(),
          venue: m.stadium ?? null,
          status: m.status ?? null,
          isHome: !!m.isHomeMatch,
          opponent: { name: m.opponent, logo: m.opponentLogoUrl ?? null },
          score:
            range === "last"
              ? { for: m.teamScore ?? null, against: m.opponentScore ?? null }
              : null,
        }));

      return res.json({ available: true, updatedAt: Date.now(), fixtures });
    } catch (error: any) {
      console.error("[meu-time][db] /fixtures error:", error);
      return res.status(500).json({ message: "Falha ao buscar jogos do time" });
    }
  });

  // Jogos do Meu Time (match_games preferido, fallback fixtures)
  app.get("/api/teams/:teamId/matches", requireAuth, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inválido" });

    const typeRaw = typeof req.query.type === "string" ? req.query.type.trim().toLowerCase() : "all";
    const type = typeRaw === "upcoming" || typeRaw === "recent" ? typeRaw : "all";
    const limit = parseLimitParam(req.query.limit, 20, 100);
    const competitionId = typeof req.query.competitionId === "string" ? req.query.competitionId.trim() : undefined;
    const seasonYear = typeof req.query.season === "string" ? parseInt(req.query.season, 10) : undefined;

    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time não encontrado" });

      const { getMatchesByTeam } = await import("./repositories/matches.repo");
      const matchGamesList = await getMatchesByTeam(teamId, {
        type,
        limit,
        competitionId,
        seasonYear: Number.isFinite(seasonYear) ? seasonYear : undefined,
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
            teamRating: null,
          })),
          source: "match_games",
          updatedAt: Date.now(),
        });
      }

      const season = typeof req.query.season === "string" ? req.query.season.trim() : undefined;
      const items = await storage.getFixturesByTeam(teamId, {
        type,
        limit,
        competitionId,
        season,
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
          teamRating: "teamRating" in f && f.teamRating != null ? Number(f.teamRating) : null,
        })),
        source: "fixtures",
        updatedAt: Date.now(),
      });
    } catch (error: any) {
      console.error("[meu-time] /matches error:", error);
      return res.status(500).json({ message: "Falha ao buscar jogos do time" });
    }
  });

  app.post("/api/teams/:teamId/matches", requireAuth, requireAdmin, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inválido" });

    try {
      const { insertFixtureSchema } = await import("@shared/schema");
      const parsed = insertFixtureSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors?.[0]?.message ?? "Dados inválidos" });
      }
      const fixture = await storage.createFixture({ ...parsed.data, teamId });
      return res.status(201).json(fixture);
    } catch (error: any) {
      console.error("[meu-time] POST /matches error:", error);
      return res.status(500).json({ message: "Falha ao criar jogo" });
    }
  });

  app.put("/api/matches/:matchId", requireAuth, requireAdmin, async (req, res) => {
    const matchId = String(req.params.matchId || "").trim();
    if (!matchId) return res.status(400).json({ message: "matchId inválido" });

    try {
      const body = req.body ?? {};
      const updates: Record<string, unknown> = {};
      if (body.status !== undefined) updates.status = body.status;
      if (body.homeScore !== undefined) updates.homeScore = body.homeScore;
      if (body.awayScore !== undefined) updates.awayScore = body.awayScore;
      if (body.kickoffAt !== undefined) updates.kickoffAt = new Date(body.kickoffAt);
      if (body.round !== undefined) updates.round = body.round;
      if (body.venue !== undefined) updates.venue = body.venue;

      const updated = await storage.updateFixture(matchId, updates as any);
      if (!updated) return res.status(404).json({ message: "Jogo não encontrado" });
      return res.json(updated);
    } catch (error: any) {
      console.error("[meu-time] PUT /matches/:id error:", error);
      return res.status(500).json({ message: "Falha ao atualizar jogo" });
    }
  });

  app.get("/api/teams/:teamId/stats", requireAuth, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inválido" });

    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time não encontrado" });

      const season = parseSeasonParam(req.query.season);
      const played = (team.wins ?? 0) + (team.draws ?? 0) + (team.losses ?? 0);
      return res.json({
        available: true,
        updatedAt: Date.now(),
        league: season ? { id: 0, name: "Brasileirão Série A", season } : null,
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
          points: team.points ?? 0,
        },
      });
    } catch (error: any) {
      console.error("[meu-time][db] /stats error:", error);
      return res.status(500).json({ message: "Falha ao buscar estatísticas do time" });
    }
  });

  // Standings by competition (Sofascore-style, with form)
  app.get("/api/competitions/:competitionId/standings", async (req, res) => {
    const competitionId = String(req.params.competitionId || "").trim();
    const season = typeof req.query.season === "string" ? req.query.season.trim() : "2026";
    if (!competitionId) return res.status(400).json({ message: "competitionId inválido" });

    try {
      const { getStandingsByCompetition, getCompetitionById } = await import("./repositories/standings.repo");
      const competition = await getCompetitionById(competitionId);
      const rows = await getStandingsByCompetition(competitionId, season);

      // Fallback: se não houver standings no banco, monta a partir dos times (legado)
      if (rows.length === 0) {
        const allTeams = await storage.getAllTeams();
        const sorted = allTeams
          .slice()
          .sort((a, b) => {
            if ((b.points ?? 0) !== (a.points ?? 0)) return (b.points ?? 0) - (a.points ?? 0);
            const gdA = (a.goalsFor ?? 0) - (a.goalsAgainst ?? 0);
            const gdB = (b.goalsFor ?? 0) - (b.goalsAgainst ?? 0);
            if (gdB !== gdA) return gdB - gdA;
            return (b.goalsFor ?? 0) - (a.goalsFor ?? 0);
          })
          .map((t, i) => ({
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
            form: [] as string[],
            team: {
              id: t.id,
              name: t.name,
              shortName: t.shortName,
              logoUrl: t.logoUrl ?? "",
            },
          }));
        return res.json({
          competition: competition ?? { id: competitionId, name: "Brasileirão Série A", country: "Brasil", logoUrl: null },
          season,
          standings: sorted,
          updatedAt: Date.now(),
        });
      }

      return res.json({
        competition: competition ?? { id: competitionId, name: "Brasileirão Série A", country: "Brasil", logoUrl: null },
        season,
        standings: rows,
        updatedAt: Date.now(),
      });
    } catch (error: any) {
      console.error("[standings] GET error:", error);
      return res.status(500).json({ message: "Falha ao buscar classificação" });
    }
  });

  app.get("/api/leagues/:leagueId/standings", requireAuth, async (req, res) => {
    const leagueId = Number.parseInt(String(req.params.leagueId || "").trim(), 10);
    if (!Number.isFinite(leagueId) || leagueId <= 0) {
      return res.status(400).json({ message: "leagueId inválido" });
    }

    try {
      const season = parseSeasonParam(req.query.season);
      const teams = await storage.getAllTeams();
      const rows = teams
        .slice()
        .sort((a, b) => {
          if ((b.points ?? 0) !== (a.points ?? 0)) return (b.points ?? 0) - (a.points ?? 0);
          if ((b.wins ?? 0) !== (a.wins ?? 0)) return (b.wins ?? 0) - (a.wins ?? 0);
          const gdA = (a.goalsFor ?? 0) - (a.goalsAgainst ?? 0);
          const gdB = (b.goalsFor ?? 0) - (b.goalsAgainst ?? 0);
          if (gdB !== gdA) return gdB - gdA;
          return (b.goalsFor ?? 0) - (a.goalsFor ?? 0);
        })
        .map((t, i) => ({
          rank: i + 1,
          team: { id: i + 1, name: t.name, logo: t.logoUrl ?? null },
          points: t.points ?? 0,
          played: (t.wins ?? 0) + (t.draws ?? 0) + (t.losses ?? 0),
          win: t.wins ?? 0,
          draw: t.draws ?? 0,
          lose: t.losses ?? 0,
          goalsFor: t.goalsFor ?? 0,
          goalsAgainst: t.goalsAgainst ?? 0,
          goalsDiff: (t.goalsFor ?? 0) - (t.goalsAgainst ?? 0),
        }));

      return res.json({
        updatedAt: Date.now(),
        league: { id: leagueId, name: "Brasileirão Série A", season },
        rows,
      });
    } catch (error: any) {
      console.error("[meu-time][db] /standings error:", error);
      return res.status(500).json({ message: "Falha ao buscar tabela da liga" });
    }
  });

  app.get('/api/teams', async (req, res) => {
    try {
      const teams = await storage.getAllTeams();
      res.json(teams);
    } catch (error) {
      console.error('Get teams error:', error);
      res.status(500).json({ message: 'Erro ao buscar times' });
    }
  });

  app.get('/api/teams/:id', async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ message: 'Time não encontrado' });
      }

      const players = await storage.getPlayersByTeam(req.params.id);

      res.json({ ...team, players });
    } catch (error) {
      console.error('Get team error:', error);
      res.status(500).json({ message: 'Erro ao buscar time' });
    }
  });

  // DB squad endpoint (no API-Football)
  app.get("/api/teams/:teamId/players", requireAuth, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inválido" });

    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time não encontrado" });

      const players = await storage.getPlayersByTeam(teamId);
      return res.json(players);
    } catch (error) {
      console.error("Get team players error:", error);
      return res.status(500).json({ message: "Erro ao buscar elenco" });
    }
  });

  // Roster por temporada (team_rosters) - fallback para players legado
  app.get("/api/teams/:teamId/roster", requireAuth, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inválido" });

    const seasonParam = typeof req.query.season === "string" ? req.query.season.trim() : String(new Date().getFullYear());
    const season = /^\d{4}$/.test(seasonParam) ? Number.parseInt(seasonParam, 10) : new Date().getFullYear();
    const position = typeof req.query.position === "string" ? req.query.position.trim() : undefined;
    const sector = typeof req.query.sector === "string" ? req.query.sector.trim() : undefined;

    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time não encontrado" });

      const { getRosterByTeamAndSeason, getRosterByTeamLegacy } = await import("./repositories/roster.repo");
      let roster = await getRosterByTeamAndSeason(teamId, season, { position, sector: sector as any });
      if (roster.length === 0) {
        roster = await getRosterByTeamLegacy(teamId, { position, sector: sector as any });
      }
      return res.json({ roster, season, updatedAt: Date.now() });
    } catch (error) {
      console.error("Get roster error:", error);
      return res.status(500).json({ message: "Erro ao buscar elenco" });
    }
  });

  // Top jogadores mais bem avaliados (média dos últimos N jogos)
  app.get("/api/teams/:teamId/top-rated", requireAuth, async (req, res) => {
    const teamId = String(req.params.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId inválido" });

    const limit = parseLimitParam(req.query.limit, 3, 10);
    const lastN = Math.min(Math.max(parseInt(String(req.query.lastN ?? 5), 10) || 5, 3), 15);

    try {
      const team = await storage.getTeam(teamId);
      if (!team) return res.status(404).json({ message: "Time não encontrado" });

      const { getTopRatedByTeam } = await import("./repositories/players.repo");
      const players = await getTopRatedByTeam(teamId, { limit, lastNMatches: lastN });
      return res.json({ players, lastNMatches: lastN, updatedAt: Date.now() });
    } catch (error) {
      console.error("Get top-rated error:", error);
      return res.status(500).json({ message: "Erro ao buscar top avaliados" });
    }
  });

  // User lineups (tática ideal)
  app.get("/api/lineups/me", requireAuth, async (req, res) => {
    const teamId = String(req.query.teamId || "").trim();
    if (!teamId) return res.status(400).json({ message: "teamId é obrigatório" });

    try {
      const lineup = await storage.getUserLineup(req.session.userId!, teamId);
      return res.json(lineup ?? null);
    } catch (error) {
      console.error("Get lineup error:", error);
      return res.status(500).json({ message: "Erro ao buscar tática" });
    }
  });

  app.post("/api/lineups/me", requireAuth, async (req, res) => {
    const teamId = String(req.body?.teamId || "").trim();
    const formation = String(req.body?.formation || "4-3-3").trim();
    const slots = Array.isArray(req.body?.slots) ? req.body.slots : [];
    if (!teamId) return res.status(400).json({ message: "teamId é obrigatório" });

    const validSlots = slots
      .filter((s: any) => typeof s?.slotIndex === "number" && typeof s?.playerId === "string")
      .map((s: any) => ({ slotIndex: s.slotIndex, playerId: s.playerId }));

    try {
      const lineup = await storage.upsertUserLineup(req.session.userId!, teamId, formation, validSlots);
      return res.json(lineup);
    } catch (error) {
      console.error("Save lineup error:", error);
      return res.status(500).json({ message: "Erro ao salvar tática" });
    }
  });

  // Public squad endpoint (DB-only)
  app.get("/api/teams/:slug/squad", async (req, res) => {
    const slug = String(req.params.slug || "").trim().toLowerCase();
    if (!slug) return res.status(400).json({ message: "Team inválido" });

    const season = parseSeasonParam(req.query.season);

    try {
      const dbTeam = await storage.getTeam(slug);
      if (!dbTeam) {
        return res.status(404).json({ message: "Time não encontrado" });
      }

      const players = await storage.getPlayersByTeam(slug);
      return res.json({
        available: true,
        updatedAt: Date.now(),
        season,
        team: { id: 0, name: dbTeam.name, logo: dbTeam.logoUrl ?? null },
        coach: null,
        players: players.map((p, idx) => ({
          id: idx + 1,
          name: p.name,
          position: p.position ?? null,
          age: null,
          nationality: p.nationalitySecondary
            ? `${p.nationalityPrimary} / ${p.nationalitySecondary}`
            : p.nationalityPrimary,
          photo: null,
        })),
      });
    } catch (error: any) {
      console.error("[db] Failed to fetch squad", error);
      return res.status(500).json({ message: "Failed to fetch squad" });
    }
  });

  // Extended team data endpoint for "Meu Time" page
  app.get('/api/teams/:id/extended', requireAuth, async (req, res) => {
    try {
      const teamId = req.params.id;
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: 'Time não encontrado' });
      }

      const matches = await storage.getMatchesByTeam(teamId, 20);
      const allTeams = await storage.getAllTeams();

      let stadium = {
        name: 'Estádio Principal',
        capacity: 50000,
        pitchCondition: 'Excelente' as const,
        stadiumCondition: 'Boa' as const,
        homeFactor: 75,
        yearBuilt: 2000,
      };
      let clubInfo = {
        league: 'Brasileirão Série A',
        season: String(new Date().getFullYear()),
        country: 'Brasil',
        clubStatus: 'Profissional' as const,
        reputation: 4,
      };
      let corinthiansClub: any = null;

      const clubFile = teamId === 'corinthians' ? 'corinthians.club.json' : teamId === 'palmeiras' ? 'palmeiras.club.json' : null;
      if (clubFile) {
        try {
          const clubPath = path.join(__dirname, 'data', clubFile);
          if (fs.existsSync(clubPath)) {
            const raw = fs.readFileSync(clubPath, 'utf-8');
            corinthiansClub = JSON.parse(raw);
            stadium = {
              name: corinthiansClub.stadium?.name ?? stadium.name,
              capacity: corinthiansClub.stadium?.capacity ?? stadium.capacity,
              pitchCondition: 'Excelente',
              stadiumCondition: 'Boa',
              homeFactor: 80,
              yearBuilt: corinthiansClub.stadium?.inaugurated ?? stadium.yearBuilt,
            };
            clubInfo = {
              ...clubInfo,
              country: corinthiansClub.country ?? clubInfo.country,
            };
          }
        } catch (_) {}
      }

      res.json({
        team,
        players: [],
        matches,
        leagueTable: allTeams,
        stadium,
        clubInfo,
        corinthiansClub: corinthiansClub ?? undefined,
      });
    } catch (error) {
      console.error("Team extended error:", error);
      res.status(500).json({ message: 'Erro ao buscar dados do time' });
    }
  });

  app.get('/api/teams/:teamId/upcoming-match', requireAuth, async (req, res) => {
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
        broadcastChannel: match.broadcastChannel ?? null,
      });
    } catch (error) {
      console.error('Upcoming match error:', error);
      res.status(500).json({ message: 'Erro ao buscar próximo jogo' });
    }
  });

  app.get('/api/teams/:teamId/last-match', requireAuth, async (req, res) => {
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
          homeAway: data.match.isHomeMatch ? 'HOME' : 'AWAY',
        },
        players: data.players,
      });
    } catch (error) {
      console.error('Last match error:', error);
      res.status(500).json({ message: 'Erro ao buscar última partida' });
    }
  });

  app.get('/api/teams/:teamId/last-match/ratings', requireAuth, async (req, res) => {
    try {
      const { teamId } = req.params;
      const { getLastMatchRatings } = await import("./repositories/matches.repo");
      const data = await getLastMatchRatings(teamId);
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
          awayScore: data.match.awayScore,
        },
        playerRatings: data.playerRatings,
      });
    } catch (error) {
      console.error('Last match ratings error:', error);
      res.status(500).json({ message: 'Erro ao buscar notas da última partida' });
    }
  });

  // ============================================
  // MATCHES ROUTES
  // ============================================

  app.get('/api/matches/:id', async (req, res) => {
    const matchId = req.params.id;
    try {
      const { getMatchDetails } = await import("./repositories/matches.repo");
      const details = await getMatchDetails(matchId);
      if (details) {
        return res.json({
          match: details.match,
          events: details.events,
          lineups: details.lineups,
          playerStats: details.playerStats,
          teamStats: details.teamStats,
          source: "match_games",
        });
      }
      const match = await storage.getMatch(matchId);
      if (!match) {
        return res.status(404).json({ message: 'Partida não encontrada' });
      }
      res.json({ match, source: "legacy" });
    } catch (error) {
      console.error('Get match error:', error);
      res.status(500).json({ message: 'Erro ao buscar partida' });
    }
  });

  app.get('/api/matches/:id/lineup', async (req, res) => {
    const matchId = req.params.id;
    try {
      const lineup = await storage.getMatchLineup(matchId);
      if (!lineup) {
        return res.status(404).json({ message: 'Escalação não encontrada' });
      }
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[GET /api/matches/:id/lineup]', { matchId, startersCount: lineup.starters?.length ?? 0, substitutesCount: lineup.substitutes?.length ?? 0 });
      }
      res.json(lineup);
    } catch (error) {
      console.error('Get match lineup error:', error);
      res.status(500).json({ message: 'Erro ao buscar escalaçao' });
    }
  });

  app.get('/api/matches/:id/ratings', async (req, res) => {
    const matchId = req.params.id;
    try {
      const ratings = await storage.getRatingsByMatch(matchId);
      const payload = ratings.map((r) => ({
        playerId: r.playerId,
        avgRating: r.average,
        voteCount: r.count,
      }));
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[GET /api/matches/:id/ratings]', { matchId, playersWithAvgRating: payload.length });
      }
      res.json(payload);
    } catch (error) {
      console.error('Get match ratings error:', error);
      res.status(500).json({ message: 'Erro ao buscar notas' });
    }
  });

  app.get('/api/matches/:id/my-ratings', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const ratings = await storage.getUserRatingsForMatch(userId, req.params.id);
      const payload = ratings.map((r) => ({ playerId: r.playerId, rating: r.rating }));
      res.json(payload);
    } catch (error) {
      console.error('Get my ratings error:', error);
      res.status(500).json({ message: 'Erro ao buscar suas notas' });
    }
  });

  app.post('/api/ratings', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { matchId, playerId, rating } = req.body ?? {};
      if (!matchId || !playerId || typeof rating !== 'number') {
        return res.status(400).json({ message: 'matchId, playerId e rating são obrigatórios' });
      }
      if (rating < 0 || rating > 10) {
        return res.status(400).json({ message: 'A nota deve estar entre 0 e 10.' });
      }
      const r = Math.min(10, Math.max(0, rating));
      const step = Math.round(r * 2) / 2;
      const match = await storage.getMatch(matchId);
      if (!match) {
        return res.status(404).json({ message: 'Partida não encontrada' });
      }
      const player = await storage.getPlayer(playerId);
      if (!player) {
        return res.status(404).json({ message: 'Jogador não encontrado' });
      }
      const existing = await storage.getUserRatingForPlayerInMatch(userId, matchId, playerId);
      if (existing) {
        return res.status(409).json({ message: 'Você já avaliou este jogador nesta partida.' });
      }
      const created = await storage.createPlayerRating({ userId, playerId, matchId, rating: step });
      const byMatch = await storage.getRatingsByMatch(matchId);
      const thisPlayer = byMatch.find((x) => x.playerId === playerId);
      res.status(201).json({
        playerId: created.playerId,
        matchId: created.matchId,
        rating: created.rating,
        voteCount: thisPlayer?.count ?? 0,
      });
    } catch (error: any) {
      console.error('Create rating error:', error);
      if (error?.code === '23505') {
        return res.status(409).json({ message: 'Você já avaliou este jogador nesta partida.' });
      }
      res.status(400).json({ message: error?.message ?? 'Erro ao salvar nota' });
    }
  });

  app.get('/api/matches/:teamId/recent', async (req, res) => {
    try {
      const { teamId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const matches = await storage.getMatchesByTeam(teamId, limit);

      res.json(matches);
    } catch (error) {
      console.error('Get recent matches error:', error);
      res.status(500).json({ message: 'Erro ao buscar partidas' });
    }
  });

  // ============================================
  // NEWS ROUTES
  // ============================================

  // ============================================
  // UPLOADS ROUTES
  // ============================================

  app.post("/api/uploads/image", requireAuth, requireJournalist, (req, res) => {
    uploadImage.single("file")(req as any, res as any, (err: any) => {
      if (err) {
        const isTooLarge = err?.code === "LIMIT_FILE_SIZE";
        const message = isTooLarge
          ? "Arquivo muito grande. Tamanho máximo: 5MB."
          : err?.message || "Erro ao enviar imagem.";
        return res.status(400).json({ message });
      }

      const file = (req as any).file as { filename?: string } | undefined;
      if (!file?.filename) {
        return res.status(400).json({ message: 'Campo "file" é obrigatório.' });
      }

      return res.json({ imageUrl: `/uploads/${file.filename}` });
    });
  });

  app.post("/api/uploads/news-image", requireJournalist, (req, res) => {
    uploadNewsImage.single("image")(req as any, res as any, (err: any) => {
      if (err) {
        const isTooLarge = err?.code === "LIMIT_FILE_SIZE";
        const message = isTooLarge
          ? "Arquivo muito grande. Tamanho máximo: 5MB."
          : err?.message || "Erro ao enviar imagem.";
        return res.status(400).json({ message });
      }

      const file = (req as any).file as { filename?: string } | undefined;
      if (!file?.filename) {
        return res.status(400).json({ message: 'Campo "image" é obrigatório.' });
      }

      return res.json({ imageUrl: `/uploads/${file.filename}` });
    });
  });

  // Feed: GET /api/news?scope=all|team|europe (or legacy teamId/filter)
  app.get('/api/news', async (req, res) => {
    try {
      const scopeParam = typeof req.query.scope === "string" ? req.query.scope.trim().toLowerCase() : undefined;
      const teamIdParam = typeof req.query.teamId === "string" ? req.query.teamId.trim() : undefined;
      const filterParam = typeof req.query.filter === "string" ? req.query.filter.trim() : undefined;
      const limitParam = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : undefined;
      const limit =
        Number.isFinite(limitParam) && (limitParam as number) > 0
          ? Math.min(limitParam as number, 100)
          : 50;

      let scope: "all" | "team" | "europe" | undefined;
      let userTeamId: string | undefined;

      if (scopeParam === "all" || scopeParam === "team" || scopeParam === "europe") {
        scope = scopeParam;
        if (scope === "team" && req.session.userId) {
          const user = await storage.getUser(req.session.userId);
          userTeamId = user?.teamId ?? undefined;
        }
      } else {
        // Legacy: frontend uses ?teamId=... or ?filter=my-team|all|<teamId>
        let effectiveTeamId: string | undefined = teamIdParam || undefined;
        if (!effectiveTeamId && filterParam && filterParam !== "all" && filterParam !== "my-team") {
          effectiveTeamId = filterParam;
        }
        if (!effectiveTeamId && filterParam === "my-team" && req.session.userId) {
          const user = await storage.getUser(req.session.userId);
          effectiveTeamId = user?.teamId || undefined;
        }
        if (effectiveTeamId) {
          scope = "team";
          userTeamId = effectiveTeamId;
        } else {
          scope = "all";
        }
      }

      const newsItems = await storage.getAllNews({ scope, userTeamId, limit });

      // Add user interaction info if logged in
      if (req.session.userId) {
        for (const newsItem of newsItems) {
          const interaction = await storage.getUserNewsInteraction(req.session.userId, newsItem.id);
          (newsItem as any).userInteraction = interaction?.interactionType || null;
        }
      }

      res.json(newsItems);
    } catch (error) {
      console.error('Get news error:', error);
      res.status(500).json({ message: 'Erro ao buscar notícias' });
    }
  });

  app.get('/api/news/my-news', requireAuth, requireJournalist, async (req, res) => {
    try {
      const journalist = await storage.getJournalist(req.session.userId!);
      if (!journalist) {
        return res.status(404).json({ message: 'Jornalista não encontrado' });
      }

      const newsItems = await storage.getNewsByJournalist(journalist.id);

      // Enrich with team data (teamId can be null for EUROPE scope)
      const enrichedNews = await Promise.all(
        newsItems.map(async (newsItem) => {
          const team = newsItem.teamId ? await storage.getTeam(newsItem.teamId) : null;
          return { ...newsItem, team: team ?? null };
        })
      );

      res.json(enrichedNews);
    } catch (error) {
      console.error('Get my news error:', error);
      res.status(500).json({ message: 'Erro ao buscar suas notícias' });
    }
  });

  app.post('/api/news', requireAuth, requireJournalist, async (req, res) => {
    try {
      const journalist = await storage.getJournalist(req.session.userId!);
      if (!journalist) {
        return res.status(404).json({ message: 'Jornalista não encontrado' });
      }

      const me = await storage.getUser(req.session.userId!);
      if (!me) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      const parsed = insertNewsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.errors?.[0]?.message ?? 'Dados inválidos' });
      }
      const newsData = parsed.data;

      const scope = (newsData.scope ?? 'ALL').toUpperCase() as 'ALL' | 'TEAM' | 'EUROPE';

      if (scope === 'TEAM') {
        if (!me.teamId) {
          return res.status(400).json({ message: 'Para publicar no feed do time, selecione um time no seu perfil.' });
        }
        newsData.teamId = me.teamId;
      } else if (scope === 'EUROPE') {
        // Jornalista aprovado ou admin (requireJournalist já garante aprovado)
        newsData.teamId = newsData.teamId ?? null;
      } else {
        newsData.teamId = newsData.teamId ?? me.teamId ?? null;
      }

      const newsItem = await storage.createNews({
        ...newsData,
        scope,
        journalistId: journalist.id,
      } as any);

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
        dislikesCount: newsItem.dislikesCount,
      });
    } catch (error: any) {
      console.error('Create news error:', error);
      res.status(400).json({ message: error.message || 'Erro ao criar notícia' });
    }
  });

  app.patch('/api/news/:id', requireAuth, requireJournalist, async (req, res) => {
    try {
      const journalist = await storage.getJournalist(req.session.userId!);
      if (!journalist) {
        return res.status(404).json({ message: 'Jornalista não encontrado' });
      }

      const newsItem = await storage.getNewsById(req.params.id);
      if (!newsItem) {
        return res.status(404).json({ message: 'Notícia não encontrada' });
      }

      if (newsItem.journalistId !== journalist.id) {
        return res.status(403).json({ message: 'Acesso negado. Você só pode editar suas próprias notícias.' });
      }

      const me = await storage.getUser(req.session.userId!);
      if (!me) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      const raw = insertNewsSchema.partial().parse(req.body);
      const updateData: Record<string, unknown> = { ...raw };

      if (raw.scope !== undefined) {
        const scope = (String(raw.scope).toUpperCase()) as 'ALL' | 'TEAM' | 'EUROPE';
        if (scope === 'TEAM') {
          if (!me.teamId) {
            return res.status(400).json({ message: 'Para publicar no feed do time, selecione um time no seu perfil.' });
          }
          updateData.teamId = me.teamId;
        } else if (scope === 'EUROPE') {
          updateData.teamId = raw.teamId ?? null;
        }
        updateData.scope = scope;
      }

      const updatedNews = await storage.updateNews(req.params.id, updateData as any);

      if (!updatedNews) {
        return res.status(404).json({ message: 'Notícia não encontrada' });
      }

      res.json(updatedNews);
    } catch (error: any) {
      console.error('Update news error:', error);
      res.status(400).json({ message: error.message || 'Erro ao atualizar notícia' });
    }
  });

  app.delete('/api/news/:id', requireAuth, requireJournalist, async (req, res) => {
    try {
      const journalist = await storage.getJournalist(req.session.userId!);
      if (!journalist) {
        return res.status(404).json({ message: 'Jornalista não encontrado' });
      }

      // Verify the news belongs to this journalist
      const newsItem = await storage.getNewsById(req.params.id);
      
      if (!newsItem) {
        return res.status(404).json({ message: 'Notícia não encontrada' });
      }

      if (newsItem.journalistId !== journalist.id) {
        return res.status(403).json({ message: 'Acesso negado. Você só pode excluir suas próprias notícias.' });
      }

      await storage.deleteNews(req.params.id);
      res.json({ message: 'Notícia excluída com sucesso' });
    } catch (error) {
      console.error('Delete news error:', error);
      res.status(500).json({ message: 'Erro ao excluir notícia' });
    }
  });

  // ============================================
  // NEWS INTERACTIONS ROUTES
  // ============================================

  app.post('/api/news/:id/interaction', requireAuth, async (req, res) => {
    try {
      const { type } = req.body;
      if (type !== 'LIKE' && type !== 'DISLIKE') {
        return res.status(400).json({ message: "type inválido. Use LIKE ou DISLIKE." });
      }
      const newsId = req.params.id;
      const userId = req.session.userId!;

      // Check if interaction already exists
      const existing = await storage.getUserNewsInteraction(userId, newsId);

      if (existing) {
        if (existing.interactionType === type) {
          // Remove interaction if same type
          await storage.deleteNewsInteraction(userId, newsId);
          // Recalculate counts
          await storage.recalculateNewsCounts(newsId);
          return res.json({ message: 'Interação removida' });
        } else {
          // Delete old interaction before creating new one
          await storage.deleteNewsInteraction(userId, newsId);
        }
      }

      // Create new interaction
      const interaction = await storage.createNewsInteraction({
        userId,
        newsId,
        interactionType: type,
      });

      // Recalculate counts
      await storage.recalculateNewsCounts(newsId);

      // Check for new badges
      await storage.checkAndAwardBadges(userId);

      res.status(201).json(interaction);
    } catch (error) {
      console.error('Create interaction error:', error);
      res.status(500).json({ message: 'Erro ao registrar interação' });
    }
  });

  // ============================================
  // COMMENTS ON NEWS (feed) — only same-team fans can comment
  // ============================================

  app.get('/api/news/:newsId/comments', async (req, res) => {
    try {
      const newsId = req.params.newsId;
      const viewerUserId = req.session?.userId ?? null;
      const list = await storage.listCommentsByNewsId(newsId, viewerUserId);
      return res.json(list);
    } catch (error: any) {
      console.error('List comments error:', error?.message ?? error);
      if (error?.stack) console.error(error.stack);
      return res.status(500).json({ message: 'Erro ao buscar comentários' });
    }
  });

  app.post('/api/news/:newsId/comments', requireAuth, async (req, res) => {
    const newsId = req.params.newsId;
    const userId = req.session?.userId;
    if (process.env.NODE_ENV === 'development') {
      console.log('COMMENT REQUEST', { userId, newsId, body: req.body });
    }
    try {
      if (!userId) {
        return res.status(401).json({ message: 'Não autenticado' });
      }
      const parsed = insertCommentSchema.parse(req.body);
      const content = (parsed.content ?? '').trim();
      if (!content) {
        return res.status(400).json({ message: 'Conteúdo do comentário é obrigatório.' });
      }

      const newsItem = await storage.getNewsById(newsId);
      if (!newsItem) {
        return res.status(404).json({ message: 'Publicação não encontrada.' });
      }

      const me = await storage.getUser(userId);
      if (!me) {
        return res.status(401).json({ message: 'Usuário não encontrado.' });
      }

      const scope = (newsItem as any).scope ?? 'ALL';
      let canComment: boolean;
      if (scope === 'EUROPE') {
        canComment = true;
      } else if (scope === 'TEAM') {
        canComment = (me.teamId != null && me.teamId === newsItem.teamId) || isAdmin(me);
      } else {
        canComment = true;
      }
      if (!canComment) {
        return res.status(403).json({
          message: 'Apenas torcedores do mesmo time do autor podem comentar nesta publicação.',
        });
      }

      const comment = await storage.createComment({ newsId, userId, content });
      if (!comment) {
        console.error('Create comment: storage returned no comment');
        return res.status(500).json({ message: 'Erro ao criar comentário' });
      }
      return res.status(201).json({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: { name: me.name, avatarUrl: me.avatarUrl ?? null },
        likeCount: 0,
        viewerHasLiked: false,
      });
    } catch (error: any) {
      if (error?.name === 'ZodError') {
        return res.status(400).json({ message: error.errors?.[0]?.message ?? 'Dados inválidos' });
      }
      console.error('Create comment error:', error?.message ?? error);
      if (error?.stack) console.error(error.stack);
      return res.status(500).json({ message: 'Erro ao criar comentário' });
    }
  });

  app.post('/api/comments/:commentId/likes', requireAuth, async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.session.userId!;

      const comment = await storage.getComment(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comentário não encontrado.' });
      }

      const newsItem = await storage.getNewsById(comment.newsId);
      if (!newsItem) {
        return res.status(404).json({ message: 'Publicação não encontrada.' });
      }

      const me = await storage.getUser(userId);
      if (!me) {
        return res.status(401).json({ message: 'Usuário não encontrado.' });
      }

      const scope = (newsItem as any).scope ?? 'ALL';
      const canLike = scope === 'EUROPE' || (me.teamId != null && me.teamId === newsItem.teamId) || isAdmin(me);
      if (!canLike) {
        return res.status(403).json({
          message: 'Apenas torcedores do mesmo time da publicação podem curtir comentários.',
        });
      }

      await storage.addCommentLike(commentId, userId);
      return res.status(201).json({ message: 'Curtida registrada' });
    } catch (error) {
      console.error('Like comment error:', error);
      return res.status(500).json({ message: 'Erro ao curtir comentário' });
    }
  });

  app.delete('/api/comments/:commentId/likes', requireAuth, async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.session.userId!;

      const comment = await storage.getComment(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comentário não encontrado.' });
      }

      const newsItem = await storage.getNewsById(comment.newsId);
      if (!newsItem) {
        return res.status(404).json({ message: 'Publicação não encontrada.' });
      }

      const me = await storage.getUser(userId);
      if (!me) {
        return res.status(401).json({ message: 'Usuário não encontrado.' });
      }

      const scope = (newsItem as any).scope ?? 'ALL';
      const canLike = scope === 'EUROPE' || (me.teamId != null && me.teamId === newsItem.teamId) || isAdmin(me);
      if (!canLike) {
        return res.status(403).json({
          message: 'Apenas torcedores do mesmo time da publicação podem remover curtida.',
        });
      }

      await storage.removeCommentLike(commentId, userId);
      return res.json({ message: 'Curtida removida' });
    } catch (error) {
      console.error('Unlike comment error:', error);
      return res.status(500).json({ message: 'Erro ao remover curtida' });
    }
  });

  // ============================================
  // PLAYER RATINGS ROUTES
  // ============================================

  app.post('/api/players/:id/ratings', requireAuth, async (req, res) => {
    try {
      const playerId = req.params.id;
      const userId = req.session.userId!;
      const ratingData = insertPlayerRatingSchema.parse(req.body);

      const rating = await storage.createPlayerRating({
        ...ratingData,
        playerId,
        userId,
      });

      // Check for new badges
      await storage.checkAndAwardBadges(userId);

      res.status(201).json(rating);
    } catch (error: any) {
      console.error('Create rating error:', error);
      res.status(400).json({ message: error.message || 'Erro ao criar avaliação' });
    }
  });

  app.get('/api/players/search', async (req, res) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
      const limit = typeof req.query.limit === 'string' ? Math.min(parseInt(req.query.limit, 10) || 10, 20) : 10;
      const players = await storage.searchPlayers(q, limit);
      res.json(players);
    } catch (error) {
      console.error('Search players error:', error);
      res.status(500).json({ message: 'Erro ao buscar jogadores' });
    }
  });

  app.get('/api/players/:id/ratings', async (req, res) => {
    try {
      const ratings = await storage.getPlayerRatings(req.params.id);
      const average = await storage.getPlayerAverageRating(req.params.id);

      res.json({ ratings, average });
    } catch (error) {
      console.error('Get ratings error:', error);
      res.status(500).json({ message: 'Erro ao buscar avaliações' });
    }
  });

  // ============================================
  // PROFILE ROUTES
  // ============================================

  app.post("/api/profile/avatar", requireAuth, (req, res) => {
    uploadAvatar.single("file")(req as any, res as any, async (err: any) => {
      if (err) {
        const isTooLarge = err?.code === "LIMIT_FILE_SIZE";
        const message = isTooLarge
          ? "Arquivo muito grande. Tamanho máximo: 2MB."
          : err?.message || "Erro ao enviar avatar.";
        return res.status(400).json({ message });
      }

      const file = (req as any).file as Express.Multer.File | undefined;
      if (!file) {
        return res.status(400).json({ message: 'Campo "file" é obrigatório.' });
      }

      const userId = req.session.userId!;

      try {
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(401).json({ message: "Usuário não encontrado" });
        }

        const oldUrl = user.avatarUrl ?? null;
        const { avatarUrl } = await saveAvatar(file);

        const updated = await storage.updateUser(userId, { avatarUrl });
        if (!updated) {
          // Best-effort cleanup for orphaned file
          await deleteAvatarByUrl(avatarUrl).catch(() => undefined);
          return res.status(404).json({ message: "Usuário não encontrado" });
        }

        if (oldUrl && oldUrl !== avatarUrl) {
          deleteAvatarByUrl(oldUrl).catch(() => undefined);
        }

        return res.json({ avatarUrl });
      } catch (error: any) {
        console.error("Upload avatar error:", error);
        return res.status(400).json({ message: error?.message || "Erro ao enviar avatar." });
      }
    });
  });

  app.delete("/api/profile/avatar", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "Usuário não encontrado" });
      }

      const oldUrl = user.avatarUrl ?? null;
      await storage.updateUser(userId, { avatarUrl: null });
      deleteAvatarByUrl(oldUrl).catch(() => undefined);

      return res.json({ avatarUrl: null });
    } catch (error) {
      console.error("Remove avatar error:", error);
      return res.status(500).json({ message: "Erro ao remover avatar" });
    }
  });

  app.put('/api/profile', requireAuth, async (req, res) => {
    try {
      const { name, email } = req.body;
      const userId = req.session.userId!;

      const updatedUser = await storage.updateUser(userId, { name, email });

      res.json(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }
  });

  app.put('/api/profile/password', requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.session.userId!;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Senha atual incorreta' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(userId, { password: hashedPassword });

      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Erro ao alterar senha' });
    }
  });

  // ============================================
  // BADGE ROUTES
  // ============================================

  app.get('/api/badges', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const userBadges = await storage.getUserBadges(userId);
      const allBadges = await storage.getAllBadges();

      const badgesWithStatus = allBadges.map(badge => {
        const userBadge = userBadges.find(ub => ub.badge.id === badge.id);
        return {
          ...badge,
          unlocked: !!userBadge,
          earnedAt: userBadge?.earnedAt || null,
        };
      });

      res.json(badgesWithStatus);
    } catch (error) {
      console.error('Get badges error:', error);
      res.status(500).json({ message: 'Erro ao buscar badges' });
    }
  });

  app.post('/api/badges/check', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const newBadges = await storage.checkAndAwardBadges(userId);
      res.json(newBadges);
    } catch (error) {
      console.error('Check badges error:', error);
      res.status(500).json({ message: 'Erro ao verificar badges' });
    }
  });

  // ============================================
  // NOTIFICATION ROUTES
  // ============================================

  app.get('/api/notifications', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ message: 'Erro ao buscar notificações' });
    }
  });

  app.get('/api/notifications/unread-count', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({ message: 'Erro ao buscar contador' });
    }
  });

  app.post('/api/notifications/:id/read', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const updated = await storage.markNotificationAsRead(userId, req.params.id);
      if (!updated) {
        return res.status(404).json({ message: "Notificação não encontrada" });
      }
      res.json({ message: 'Notificação marcada como lida' });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ message: 'Erro ao marcar como lida' });
    }
  });

  app.post('/api/notifications/mark-all-read', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ message: 'Todas as notificações marcadas como lidas' });
    } catch (error) {
      console.error('Mark all as read error:', error);
      res.status(500).json({ message: 'Erro ao marcar todas como lidas' });
    }
  });

  // ============================================
  // ADMIN ROUTES
  // ============================================

  app.get('/api/admin/users/search', requireAuth, requireAdmin, async (req, res) => {
    try {
      const q = (req.query.q as string)?.trim() ?? '';
      const results = await storage.searchUsersForAdmin(q, 10);
      res.json(results);
    } catch (error) {
      console.error('Admin users search error:', error);
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  });

  const adminJournalistActionSchema = { action: ['approve', 'reject', 'revoke', 'promote'] as const };
  app.patch('/api/admin/journalists/:userId', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const { action } = req.body as { action?: string };
      const adminUserId = req.session.userId!;

      if (!action || !adminJournalistActionSchema.action.includes(action as any)) {
        return res.status(400).json({ message: 'action inválida. Use approve, reject, revoke ou promote.' });
      }

      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const journalist = await storage.getJournalist(userId);

      if (action === 'promote') {
        if (journalist) {
          return res.status(400).json({ message: 'Usuário já possui registro de jornalista' });
        }
        await storage.createJournalist({
          userId,
          organization: 'A ser definido',
          professionalId: 'N/A',
        });
        if (targetUser.userType !== 'ADMIN') {
          await storage.updateUser(userId, { userType: 'JOURNALIST' });
        }
        return res.json({ message: 'Usuário promovido a jornalista (pendente)' });
      }

      if (action === 'revoke') {
        if (!journalist) {
          return res.status(400).json({ message: 'Usuário não é jornalista' });
        }
        if (userId === adminUserId && isAdmin(targetUser)) {
          return res.status(403).json({ message: 'Não é permitido revogar seu próprio status de administrador.' });
        }
        await storage.deleteJournalistByUserId(userId);
        if (targetUser.userType !== 'ADMIN') {
          await storage.updateUser(userId, { userType: 'FAN' });
        }
        return res.json({ message: 'Status de jornalista revogado' });
      }

      if (action === 'approve') {
        if (!journalist) {
          await storage.createJournalist({
            userId,
            organization: 'A ser definido',
            professionalId: 'N/A',
          });
          await storage.updateJournalistByUserId(userId, { status: 'APPROVED', verificationDate: new Date() });
          if (targetUser.userType !== 'ADMIN') {
            await storage.updateUser(userId, { userType: 'JOURNALIST' });
          }
          return res.json({ message: 'Jornalista aprovado' });
        }
        await storage.updateJournalistByUserId(userId, { status: 'APPROVED', verificationDate: new Date() });
        if (targetUser.userType !== 'ADMIN') {
          await storage.updateUser(userId, { userType: 'JOURNALIST' });
        }
        return res.json({ message: 'Jornalista aprovado' });
      }

      if (action === 'reject') {
        if (!journalist) {
          return res.status(400).json({ message: 'Usuário não possui registro de jornalista' });
        }
        await storage.updateJournalistByUserId(userId, { status: 'REJECTED' });
        return res.json({ message: 'Jornalista rejeitado' });
      }

      res.status(400).json({ message: 'action inválida' });
    } catch (error: any) {
      console.error('Admin journalist action error:', error);
      res.status(500).json({ message: error.message || 'Erro ao executar ação' });
    }
  });

  app.post('/api/admin/standings/recalculate', requireAuth, requireAdmin, async (req, res) => {
    try {
      await storage.updateTeamStandings();
      res.json({ message: 'Classificação recalculada com sucesso' });
    } catch (error) {
      console.error('Recalculate standings error:', error);
      res.status(500).json({ message: 'Erro ao recalcular classificação' });
    }
  });

  // ============================================
  // FORUM (Comunidade)
  // ============================================

  app.get('/api/teams/:teamId/forum/stats', requireAuth, async (req, res) => {
    try {
      const teamId = String(req.params.teamId || '').trim();
      const userTeamId = (await storage.getUser(req.session.userId!))?.teamId;
      if (!userTeamId || userTeamId !== teamId) {
        return res.status(403).json({ message: 'Acesso negado. Só é possível ver o fórum do seu time.' });
      }
      const { getForumStats } = await import('./repositories/forum.repo');
      const stats = await getForumStats(teamId);
      return res.json(stats);
    } catch (error: any) {
      console.error('Forum stats error:', error);
      return res.status(500).json({ message: 'Erro ao buscar estatísticas do fórum' });
    }
  });

  app.get('/api/teams/:teamId/forum/topics', requireAuth, async (req, res) => {
    try {
      const teamId = String(req.params.teamId || '').trim();
      const userTeamId = (await storage.getUser(req.session.userId!))?.teamId;
      if (!userTeamId || userTeamId !== teamId) {
        return res.status(403).json({ message: 'Acesso negado. Só é possível ver o fórum do seu time.' });
      }
      const category = typeof req.query.category === 'string' ? req.query.category.trim() : undefined;
      const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
      const trending = req.query.trending === 'true';
      const limit = Math.min(parseInt(String(req.query.limit || 24), 10) || 24, 50);
      const offset = Math.max(0, parseInt(String(req.query.offset || 0), 10));
      const { listForumTopics } = await import('./repositories/forum.repo');
      const topics = await listForumTopics(teamId, {
        category: category as any,
        search: search || undefined,
        trending,
        limit,
        offset,
        viewerUserId: req.session.userId,
      });
      return res.json(topics);
    } catch (error: any) {
      console.error('Forum topics error:', error);
      return res.status(500).json({ message: 'Erro ao buscar tópicos' });
    }
  });

  app.get('/api/teams/:teamId/forum/topics/:topicId', requireAuth, async (req, res) => {
    try {
      const { teamId, topicId } = req.params;
      const userTeamId = (await storage.getUser(req.session.userId!))?.teamId;
      if (!userTeamId || userTeamId !== teamId) {
        return res.status(403).json({ message: 'Acesso negado. Só é possível ver o fórum do seu time.' });
      }
      const { getForumTopicById } = await import('./repositories/forum.repo');
      const topic = await getForumTopicById(topicId, teamId, {
        viewerUserId: req.session.userId,
        incrementView: true,
      });
      if (!topic) return res.status(404).json({ message: 'Tópico não encontrado' });
      return res.json(topic);
    } catch (error: any) {
      console.error('Forum topic detail error:', error);
      return res.status(500).json({ message: 'Erro ao buscar tópico' });
    }
  });

  app.post('/api/teams/:teamId/forum/topics', requireAuth, async (req, res) => {
    try {
      const teamId = String(req.params.teamId || '').trim();
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      if (!user?.teamId || user.teamId !== teamId) {
        return res.status(403).json({ message: 'Acesso negado. Só é possível criar tópicos no fórum do seu time.' });
      }
      const { title, content, category, coverImageUrl } = req.body ?? {};
      if (!title || typeof title !== 'string' || title.trim().length < 3) {
        return res.status(400).json({ message: 'Título deve ter pelo menos 3 caracteres' });
      }
      if (!content || typeof content !== 'string' || content.trim().length < 10) {
        return res.status(400).json({ message: 'Conteúdo deve ter pelo menos 10 caracteres' });
      }
      const validCategories = ['news', 'pre_match', 'post_match', 'transfer', 'off_topic', 'base'];
      const cat = category && validCategories.includes(category) ? category : 'base';
      const { createForumTopic } = await import('./repositories/forum.repo');
      const topic = await createForumTopic(teamId, userId, {
        title: title.trim(),
        content: content.trim(),
        category: cat as any,
        coverImageUrl: coverImageUrl || null,
      });
      return res.status(201).json(topic);
    } catch (error: any) {
      console.error('Create forum topic error:', error);
      return res.status(500).json({ message: error?.message || 'Erro ao criar tópico' });
    }
  });

  app.get('/api/teams/:teamId/forum/topics/:topicId/replies', requireAuth, async (req, res) => {
    try {
      const { teamId, topicId } = req.params;
      const userTeamId = (await storage.getUser(req.session.userId!))?.teamId;
      if (!userTeamId || userTeamId !== teamId) {
        return res.status(403).json({ message: 'Acesso negado.' });
      }
      const { listForumReplies, getForumTopicById } = await import('./repositories/forum.repo');
      const topic = await getForumTopicById(topicId, teamId);
      if (!topic) return res.status(404).json({ message: 'Tópico não encontrado' });
      const limit = Math.min(parseInt(String(req.query.limit || 50), 10) || 50, 100);
      const offset = Math.max(0, parseInt(String(req.query.offset || 0), 10));
      const replies = await listForumReplies(topicId, {
        viewerUserId: req.session.userId,
        limit,
        offset,
      });
      return res.json(replies);
    } catch (error: any) {
      console.error('Forum replies error:', error);
      return res.status(500).json({ message: 'Erro ao buscar respostas' });
    }
  });

  app.post('/api/teams/:teamId/forum/topics/:topicId/replies', requireAuth, async (req, res) => {
    try {
      const { teamId, topicId } = req.params;
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      if (!user?.teamId || user.teamId !== teamId) {
        return res.status(403).json({ message: 'Acesso negado.' });
      }
      const { getForumTopicById, createForumReply } = await import('./repositories/forum.repo');
      const topic = await getForumTopicById(topicId, teamId);
      if (!topic) return res.status(404).json({ message: 'Tópico não encontrado' });
      if (topic.isLocked) return res.status(403).json({ message: 'Este tópico está trancado.' });
      const content = (req.body?.content ?? '').trim();
      if (!content) return res.status(400).json({ message: 'Conteúdo da resposta é obrigatório' });
      const reply = await createForumReply(topicId, userId, content);
      return res.status(201).json(reply);
    } catch (error: any) {
      console.error('Create forum reply error:', error);
      return res.status(500).json({ message: error?.message || 'Erro ao criar resposta' });
    }
  });

  app.post('/api/teams/:teamId/forum/topics/:topicId/like', requireAuth, async (req, res) => {
    try {
      const { teamId, topicId } = req.params;
      const userId = req.session.userId!;
      const userTeamId = (await storage.getUser(userId))?.teamId;
      if (!userTeamId || userTeamId !== teamId) {
        return res.status(403).json({ message: 'Acesso negado.' });
      }
      const { getForumTopicById, toggleForumTopicLike } = await import('./repositories/forum.repo');
      const topic = await getForumTopicById(topicId, teamId);
      if (!topic) return res.status(404).json({ message: 'Tópico não encontrado' });
      const result = await toggleForumTopicLike(topicId, userId);
      return res.json(result);
    } catch (error: any) {
      console.error('Forum topic like error:', error);
      return res.status(500).json({ message: 'Erro ao curtir tópico' });
    }
  });

  app.post('/api/teams/:teamId/forum/replies/:replyId/like', requireAuth, async (req, res) => {
    try {
      const { teamId, replyId } = req.params;
      const userId = req.session.userId!;
      const userTeamId = (await storage.getUser(userId))?.teamId;
      if (!userTeamId || userTeamId !== teamId) {
        return res.status(403).json({ message: 'Acesso negado.' });
      }
      const { getForumReplyTeamId, toggleForumReplyLike } = await import('./repositories/forum.repo');
      const replyTeamId = await getForumReplyTeamId(replyId);
      if (!replyTeamId || replyTeamId !== teamId) {
        return res.status(404).json({ message: 'Resposta não encontrada' });
      }
      const result = await toggleForumReplyLike(replyId, userId);
      return res.json(result);
    } catch (error: any) {
      console.error('Forum reply like error:', error);
      return res.status(500).json({ message: 'Erro ao curtir resposta' });
    }
  });

  // ============================================
  // TRANSFERS (Vai e Vem)
  // ============================================

  app.get('/api/transfers', async (req, res) => {
    try {
      const status = typeof req.query.status === 'string' ? req.query.status.trim() : undefined;
      const q = typeof req.query.q === 'string' ? req.query.q.trim() : undefined;
      const teamId = typeof req.query.teamId === 'string' ? req.query.teamId.trim() : undefined;
      const viewerUserId = req.session?.userId ?? null;

      const items = await storage.getTransfers({ status, q, teamId, viewerUserId });
      res.json(items);
    } catch (error) {
      console.error('Get transfers error:', error);
      res.status(500).json({ message: 'Erro ao buscar transferências' });
    }
  });

  // ============================================
  // TRANSFER RUMORS (Vai e Vem - schema transfer_rumors)
  // ============================================

  app.get('/api/transfer-rumors', async (req, res) => {
    try {
      const status = typeof req.query.status === 'string' ? req.query.status.trim() : undefined;
      const q = typeof req.query.q === 'string' ? req.query.q.trim() : undefined;
      const teamId = typeof req.query.teamId === 'string' ? req.query.teamId.trim() : undefined;
      const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 30;
      const offset = typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) : 0;
      const viewerUserId = req.session?.userId ?? null;

      const items = await storage.getTransferRumors({ status, q, teamId, viewerUserId, limit: Number.isNaN(limit) ? 30 : limit, offset: Number.isNaN(offset) ? 0 : offset });
      res.json(items);
    } catch (error) {
      console.error('Get transfer rumors error:', error);
      res.status(500).json({ message: 'Erro ao buscar rumores' });
    }
  });

  app.get('/api/transfer-rumors/mine', requireJournalistOrAdmin, async (req, res) => {
    try {
      const userId = req.session!.userId!;
      const items = await storage.getTransferRumorsByAuthor(userId);
      res.json(items);
    } catch (error) {
      console.error('Get my transfer rumors error:', error);
      res.status(500).json({ message: 'Erro ao buscar suas negociações' });
    }
  });

  app.get('/api/transfer-rumors/:id', async (req, res) => {
    try {
      const rumor = await storage.getTransferRumorById(req.params.id);
      if (!rumor) return res.status(404).json({ message: 'Rumor não encontrado' });
      res.json(rumor);
    } catch (error) {
      console.error('Get transfer rumor error:', error);
      res.status(500).json({ message: 'Erro ao buscar rumor' });
    }
  });

  app.post('/api/transfer-rumors', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      if (!user || (user.userType !== 'JOURNALIST' && user.userType !== 'ADMIN')) {
        return res.status(403).json({ message: 'Apenas jornalistas e administradores podem criar negociações' });
      }
      const { playerId, fromTeamId, toTeamId, status, feeAmount, feeCurrency, contractUntil, sourceUrl, sourceName, note } = req.body ?? {};
      if (!playerId || !fromTeamId || !toTeamId) {
        return res.status(400).json({ message: 'playerId, fromTeamId e toTeamId são obrigatórios' });
      }
      if (fromTeamId === toTeamId) {
        return res.status(400).json({ message: 'fromTeamId e toTeamId devem ser diferentes' });
      }
      const validStatus = ['RUMOR', 'NEGOTIATING', 'DONE', 'CANCELLED'].includes(status) ? status : 'RUMOR';
      const rumor = await storage.createTransferRumor({
        playerId,
        fromTeamId,
        toTeamId,
        status: validStatus,
        feeAmount: feeAmount != null ? Number(feeAmount) : null,
        feeCurrency: feeCurrency ?? 'BRL',
        contractUntil: contractUntil ?? null,
        sourceUrl: sourceUrl ?? null,
        sourceName: sourceName ?? null,
        note: note ?? null,
        createdByUserId: userId,
      });
      const full = await storage.getTransferRumorById(rumor.id);
      res.status(201).json(full ?? rumor);
    } catch (error) {
      console.error('Create transfer rumor error:', error);
      res.status(500).json({ message: 'Erro ao criar negociação' });
    }
  });

  app.patch('/api/transfer-rumors/:id', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      if (!user || (user.userType !== 'JOURNALIST' && user.userType !== 'ADMIN')) {
        return res.status(403).json({ message: 'Apenas jornalistas e administradores podem editar negociações' });
      }
      const rumor = await storage.getTransferRumorById(req.params.id);
      if (!rumor) return res.status(404).json({ message: 'Negociação não encontrada' });
      const authorId = (rumor as any).createdByUserId ?? rumor.author?.id;
      if (authorId !== userId && user.userType !== 'ADMIN') {
        return res.status(403).json({ message: 'Você só pode editar suas próprias negociações' });
      }
      const { status, feeAmount, feeCurrency, contractUntil, sourceName, sourceUrl, note } = req.body ?? {};
      const updates: Record<string, unknown> = {};
      if (status !== undefined && ['RUMOR', 'NEGOTIATING', 'DONE', 'CANCELLED'].includes(status)) updates.status = status;
      if (feeAmount !== undefined) updates.feeAmount = feeAmount != null ? Number(feeAmount) : null;
      if (feeCurrency !== undefined) updates.feeCurrency = feeCurrency;
      if (contractUntil !== undefined) updates.contractUntil = contractUntil ?? null;
      if (sourceName !== undefined) updates.sourceName = sourceName ?? null;
      if (sourceUrl !== undefined) updates.sourceUrl = sourceUrl ?? null;
      if (note !== undefined) updates.note = note ?? null;
      if (Object.keys(updates).length === 0) {
        return res.json(rumor);
      }
      const updated = await storage.updateTransferRumor(req.params.id, updates as any);
      if (!updated) return res.status(404).json({ message: 'Negociação não encontrada' });
      const full = await storage.getTransferRumorById(updated.id);
      res.json(full ?? updated);
    } catch (error) {
      console.error('Update transfer rumor error:', error);
      res.status(500).json({ message: 'Erro ao atualizar negociação' });
    }
  });

  app.delete('/api/transfer-rumors/:id', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      if (!user || (user.userType !== 'JOURNALIST' && user.userType !== 'ADMIN')) {
        return res.status(403).json({ message: 'Apenas jornalistas e administradores podem excluir negociações' });
      }
      const rumor = await storage.getTransferRumorById(req.params.id);
      if (!rumor) return res.status(404).json({ message: 'Negociação não encontrada' });
      const authorId = (rumor as any).createdByUserId ?? (rumor.author as any)?.id;
      if (authorId !== userId && user.userType !== 'ADMIN') {
        return res.status(403).json({ message: 'Você só pode excluir suas próprias negociações' });
      }
      const deleted = await storage.deleteTransferRumor(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Negociação não encontrada' });
      res.status(204).send();
    } catch (error) {
      console.error('Delete transfer rumor error:', error);
      res.status(500).json({ message: 'Erro ao excluir negociação' });
    }
  });

  app.post('/api/transfer-rumors/:id/vote', requireAuth, async (req, res) => {
    try {
      const rumorId = req.params.id;
      const { side, vote } = req.body ?? {};
      if (!['SELLING', 'BUYING'].includes(side)) {
        return res.status(400).json({ message: 'side deve ser SELLING ou BUYING' });
      }
      if (!['LIKE', 'DISLIKE', 'CLEAR'].includes(vote)) {
        return res.status(400).json({ message: 'vote deve ser LIKE, DISLIKE ou CLEAR' });
      }
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

      const rumor = await storage.getTransferRumorById(rumorId);
      if (!rumor) return res.status(404).json({ message: 'Rumor não encontrado' });

      if (side === 'SELLING') {
        if (user.teamId !== rumor.fromTeam?.id) {
          return res.status(403).json({ message: 'Apenas torcedores do time que está vendendo podem votar aqui.' });
        }
      } else {
        if (user.teamId !== rumor.toTeam?.id) {
          return res.status(403).json({ message: 'Apenas torcedores do time que está comprando podem votar aqui.' });
        }
      }

      const result = await storage.upsertTransferRumorVote(rumorId, userId, side, vote);
      res.json(result);
    } catch (error) {
      console.error('Transfer rumor vote error:', error);
      res.status(500).json({ message: 'Erro ao registrar voto' });
    }
  });

  app.get('/api/transfer-rumors/:id/comments', async (req, res) => {
    try {
      const comments = await storage.listTransferRumorComments(req.params.id);
      res.json(comments);
    } catch (error) {
      console.error('List transfer rumor comments error:', error);
      res.status(500).json({ message: 'Erro ao listar comentários' });
    }
  });

  app.post('/api/transfer-rumors/:id/comments', requireAuth, async (req, res) => {
    try {
      const { content } = req.body ?? {};
      if (!content || typeof content !== 'string' || !content.trim()) {
        return res.status(400).json({ message: 'content é obrigatório' });
      }
      const comment = await storage.createTransferRumorComment(req.params.id, req.session.userId!, content.trim());
      res.status(201).json(comment);
    } catch (error) {
      console.error('Create transfer rumor comment error:', error);
      res.status(500).json({ message: 'Erro ao criar comentário' });
    }
  });

  app.post('/api/transfers/:id/vote', requireAuth, async (req, res) => {
    try {
      const transferId = req.params.id;
      const { side, vote } = req.body ?? {};
      if (!['SELLING', 'BUYING'].includes(side)) {
        return res.status(400).json({ message: 'side deve ser SELLING ou BUYING' });
      }
      if (!['LIKE', 'DISLIKE', 'CLEAR'].includes(vote)) {
        return res.status(400).json({ message: 'vote deve ser LIKE, DISLIKE ou CLEAR' });
      }
      const userId = req.session.userId!;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      const transfer = await storage.getTransferById(transferId);
      if (!transfer) {
        return res.status(404).json({ message: 'Transferência não encontrada' });
      }

      // Regra de permissão: SELLING só para torcida do fromTeam, BUYING só para torcida do toTeam
      if (side === 'SELLING') {
        if (!transfer.fromTeamId) {
          return res.status(400).json({ message: 'Este rumor não tem time de origem definido.' });
        }
        if (user.teamId !== transfer.fromTeamId) {
          return res.status(403).json({
            message: 'Apenas torcedores do time que está vendendo podem votar aqui.',
          });
        }
      } else {
        if (!transfer.toTeamId) {
          return res.status(400).json({ message: 'Este rumor não tem time de destino definido.' });
        }
        if (user.teamId !== transfer.toTeamId) {
          return res.status(403).json({
            message: 'Apenas torcedores do time que está comprando podem votar aqui.',
          });
        }
      }

      const result = await storage.upsertTransferVote(transferId, userId, side, vote);
      res.json(result);
    } catch (error) {
      console.error('Transfer vote error:', error);
      res.status(500).json({ message: 'Erro ao registrar voto' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

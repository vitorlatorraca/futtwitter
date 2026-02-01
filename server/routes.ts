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
import { insertUserSchema, insertNewsSchema, insertPlayerRatingSchema } from "@shared/schema";
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
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ message: 'Time não encontrado' });
      }

      const matches = await storage.getMatchesByTeam(req.params.id, 20);
      const allTeams = await storage.getAllTeams();

      // TODO: Adicionar dados de estádio, histórico, conquistas quando schema for expandido
      res.json({
        team,
        // Importante: o elenco agora vem do endpoint dedicado:
        // GET /api/teams/:teamId/players (DB)
        players: [],
        matches,
        leagueTable: allTeams,
        // Mock data - será substituído quando schema for expandido
        stadium: {
          name: 'Estádio Principal', // TODO: Buscar do schema
          capacity: 50000, // TODO: Buscar do schema
          pitchCondition: 'Excelente', // TODO: Buscar do schema
          stadiumCondition: 'Boa', // TODO: Buscar do schema
          homeFactor: 75, // TODO: Calcular baseado em histórico
          yearBuilt: 2000, // TODO: Buscar do schema
        },
        clubInfo: {
          league: 'Brasileirão Série A', // TODO: Buscar do schema
          season: '2024', // TODO: Calcular dinamicamente
          country: 'Brasil', // TODO: Buscar do schema
          clubStatus: 'Profissional', // TODO: Buscar do schema
          reputation: 4, // TODO: Calcular baseado em performance
        },
      });
    } catch (error) {
      console.error("Team extended error:", error);
      res.status(500).json({ message: 'Erro ao buscar dados do time' });
    }
  });

  // ============================================
  // MATCHES ROUTES
  // ============================================

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

  app.get('/api/news', async (req, res) => {
    try {
      const teamIdParam = typeof req.query.teamId === "string" ? req.query.teamId.trim() : undefined;
      const filterParam = typeof req.query.filter === "string" ? req.query.filter.trim() : undefined;
      const limitParam = typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : undefined;
      const limit =
        Number.isFinite(limitParam) && (limitParam as number) > 0
          ? Math.min(limitParam as number, 100)
          : 50;

      // Compatibilidade: o frontend novo usa ?teamId=...; o antigo usa ?filter=my-team|all|<teamId>
      let effectiveTeamId: string | undefined = teamIdParam || undefined;
      if (!effectiveTeamId && filterParam && filterParam !== "all" && filterParam !== "my-team") {
        effectiveTeamId = filterParam;
      }
      if (!effectiveTeamId && filterParam === "my-team" && req.session.userId) {
        const user = await storage.getUser(req.session.userId);
        effectiveTeamId = user?.teamId || undefined;
      }

      const newsItems = await storage.getAllNews({ teamId: effectiveTeamId, limit });

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

      // Enrich with team data
      const enrichedNews = await Promise.all(
        newsItems.map(async (newsItem) => {
          const team = await storage.getTeam(newsItem.teamId);
          return { ...newsItem, team };
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

      const newsData = insertNewsSchema.parse(req.body);

      const newsItem = await storage.createNews({
        ...newsData,
        journalistId: journalist.id,
      });

      // Resposta sanitizada (sem campos sensíveis / internos)
      res.status(201).json({
        id: newsItem.id,
        journalistId: newsItem.journalistId,
        teamId: newsItem.teamId,
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

      // Verify the news belongs to this journalist
      const newsItem = await storage.getNewsById(req.params.id);
      
      if (!newsItem) {
        return res.status(404).json({ message: 'Notícia não encontrada' });
      }

      if (newsItem.journalistId !== journalist.id) {
        return res.status(403).json({ message: 'Acesso negado. Você só pode editar suas próprias notícias.' });
      }

      const newsData = insertNewsSchema.partial().parse(req.body);
      const updatedNews = await storage.updateNews(req.params.id, newsData);

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

  const httpServer = createServer(app);

  return httpServer;
}

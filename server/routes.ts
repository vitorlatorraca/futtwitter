import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { insertUserSchema, insertNewsSchema, insertPlayerRatingSchema } from "@shared/schema";

const PgSession = ConnectPgSimple(session);

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
      
      if (req.session.userType !== 'JOURNALIST') {
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

// Export session store for WebSocket authentication
export const sessionStore = new PgSession({
  pool,
  tableName: 'user_sessions',
  createTableIfMissing: true,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session
  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || 'brasileirao-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
      },
    })
  );

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
      console.error('Login error:', error);
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

      const journalist = await storage.getJournalist(req.session.userId);
      const journalistStatus = journalist?.status ?? null;
      const isJournalist = journalist?.status === 'APPROVED';
      const isAdminUser = isAdmin(user);

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        teamId: user.teamId,
        userType: user.userType,
        journalistStatus,
        isJournalist,
        isAdmin: isAdminUser,
      });
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
  });

  // ============================================
  // TEAMS ROUTES
  // ============================================

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

  // Extended team data endpoint for "Meu Time" page
  app.get('/api/teams/:id/extended', requireAuth, async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ message: 'Time não encontrado' });
      }

      const players = await storage.getPlayersByTeam(req.params.id);
      const matches = await storage.getMatchesByTeam(req.params.id, 20);
      const allTeams = await storage.getAllTeams();

      // TODO: Adicionar dados de estádio, histórico, conquistas quando schema for expandido
      res.json({
        team,
        players,
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
      console.error('Get extended team error:', error);
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

  app.get('/api/news', async (req, res) => {
    try {
      const { teamId, filter } = req.query;
      
      let filterTeamId: string | undefined;
      
      if (filter === 'my-team' && req.session.userId) {
        const user = await storage.getUser(req.session.userId);
        filterTeamId = user?.teamId || undefined;
      } else if (filter === 'all') {
        filterTeamId = undefined;
      } else if (teamId) {
        filterTeamId = teamId as string;
      }

      const newsItems = await storage.getAllNews(filterTeamId);

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

      res.status(201).json(newsItem);
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
      await storage.markNotificationAsRead(req.params.id);
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

# FUTTWITTER — Auditoria de Rotas (backend Express)

## Fontes auditadas (registro real de rotas)

- `server/routes.ts`: função `registerRoutes(app)` registra **todas as rotas REST** via `app.get/post/put/patch/delete` e configura `express-session`.
- `server/vite.ts`: registra **catch-all** (`app.use("*", ...)`) para servir o client no DEV (Vite middleware) e no PROD (`serveStatic`).
- `server/websocket.ts`: registra endpoint de **WebSocket** via `httpServer.on("upgrade")` (não aparece como `app.get`).
- `server/index.ts`: configura CORS e JSON parsing antes de chamar `registerRoutes(app)`.

## Middlewares globais relevantes (impactam todas as rotas)

- **CORS + credentials**: `server/index.ts` habilita `credentials: true` quando `NODE_ENV=development` ou quando `CORS_ORIGIN` é configurado.
- **Sessão (cookie)**: `server/routes.ts` usa `express-session` com `connect-pg-simple` (tabela `user_sessions`) e cookie:
  - `secure: process.env.NODE_ENV === 'production'`
  - `sameSite: 'lax'` (em dev e prod)
  - nome padrão do cookie de sessão: `connect.sid` (usado explicitamente no WebSocket)

---

## Inventário completo de rotas

Formato exigido: `METHOD | PATH | MIDDLEWARES | O QUE RETORNA | RISCOS`

> Observação: todas as rotas abaixo retornam JSON (via `res.json(...)` / `res.status(...).json(...)`), exceto o `*` do client (HTML).

### Auth

| METHOD | PATH | MIDDLEWARES | O QUE RETORNA | RISCOS |
|---|---|---|---|---|
| POST | `/api/auth/signup` | (sessão) | **200** `{ id, name, email, teamId, userType }` ou **400** `{ message }` | Sem rate-limit/bruteforce; cria sessão automaticamente após cadastro |
| POST | `/api/auth/register` | (sessão) | Alias do signup (mesmo handler) | Mantém 2 endpoints equivalentes (superfície maior p/ abuse) |
| POST | `/api/auth/login` | (sessão) | **200** `{ id, name, email, teamId, userType }` ou **401/500** `{ message }` | Sem rate-limit/bruteforce; sessão baseada em cookie depende de CORS/cookie corretos |
| POST | `/api/auth/logout` | (sessão) | **200** `{ message }` ou **500** `{ message }` | Logout destrói sessão mas não força invalidar cookie no client (depende do browser) |
| GET | `/api/auth/me` | (sessão) | **200** `null` quando não logado; quando logado retorna `{ id, name, email, teamId, userType, journalistStatus, isJournalist, isAdmin }` | `isAdmin` depende de `ADMIN_EMAILS` (fallback); se cookie não trafega, sempre volta `null` |

### Teams / Meu Time

| METHOD | PATH | MIDDLEWARES | O QUE RETORNA | RISCOS |
|---|---|---|---|---|
| GET | `/api/teams` | (sessão) | Lista de times | Público (ok); sem cache |
| GET | `/api/teams/:id` | (sessão) | `{ ...team, players }` ou **404** `{ message }` | Público; retorna elenco completo (pode crescer) |
| GET | `/api/teams/:id/extended` | `requireAuth` | `{ team, players, matches, leagueTable, stadium, clubInfo }` ou **404** `{ message }` | Payload grande; inclui dados “mock” (comentado como TODO) |

### Matches

| METHOD | PATH | MIDDLEWARES | O QUE RETORNA | RISCOS |
|---|---|---|---|---|
| GET | `/api/matches/:teamId/recent` | (sessão) | Lista de partidas (limit default 10 via query `limit`) | Público; `limit` pode aumentar carga se abusado |

### News

| METHOD | PATH | MIDDLEWARES | O QUE RETORNA | RISCOS |
|---|---|---|---|---|
| GET | `/api/news` | (sessão) | Lista de notícias publicadas; se logado pode incluir `userInteraction` por item | Possível N+1 (consulta interação por notícia); exposição pública (ok se intencional) |
| GET | `/api/news/my-news` | `requireAuth`, `requireJournalist` | Lista de notícias do jornalista logado (enriquecidas com `team`) | Possível N+1 ao enriquecer `team`; depende de `requireJournalist` (status APPROVED) |
| POST | `/api/news` | `requireAuth`, `requireJournalist` | **201** news criada ou **400/404** `{ message }` | Jornalista pode publicar conteúdo imediatamente (`isPublished` existe no schema) |
| PATCH | `/api/news/:id` | `requireAuth`, `requireJournalist` | **200** news atualizada; **403** se não for owner; **404/400** `{ message }` | Permite alterar campos do schema aceitos por `insertNewsSchema.partial()` (ex: `teamId`, `isPublished`) |
| DELETE | `/api/news/:id` | `requireAuth`, `requireJournalist` | **200** `{ message }` ou **403/404** `{ message }` | Hard delete; não há soft-delete/audit trail |

### News Interactions

| METHOD | PATH | MIDDLEWARES | O QUE RETORNA | RISCOS |
|---|---|---|---|---|
| POST | `/api/news/:id/interaction` | `requireAuth` | **201** interaction; ou `{ message: 'Interação removida' }` quando toggle; **400/500** `{ message }` | Recalcula contadores varrendo interações (pode ser custoso); sem idempotency token |

### Player Ratings

| METHOD | PATH | MIDDLEWARES | O QUE RETORNA | RISCOS |
|---|---|---|---|---|
| POST | `/api/players/:id/ratings` | `requireAuth` | **201** rating criado; **400** `{ message }` | Não valida relação usuário↔match/participação; pode virar spam sem rate-limit |
| GET | `/api/players/:id/ratings` | (sessão) | `{ ratings, average }` | Público; pode crescer sem paginação |

### Profile

| METHOD | PATH | MIDDLEWARES | O QUE RETORNA | RISCOS |
|---|---|---|---|---|
| PUT | `/api/profile` | `requireAuth` | Retorna objeto `User` atualizado | **Risco crítico**: `storage.updateUser` retorna linha completa de `users` (inclui `password` hash) e a rota devolve isso ao client |
| PUT | `/api/profile/password` | `requireAuth` | `{ message }` ou **401/404/500** `{ message }` | Sem políticas de complexidade além do bcrypt; sem invalidar sessões ativas em outros devices |

### Badges

| METHOD | PATH | MIDDLEWARES | O QUE RETORNA | RISCOS |
|---|---|---|---|---|
| GET | `/api/badges` | `requireAuth` | Lista de badges com `unlocked` e `earnedAt` | Sem paginação (geralmente ok) |
| POST | `/api/badges/check` | `requireAuth` | Lista de `UserBadge` recém concedidos | Pode ser usado para “farmar” checks repetidos (embora idempotente por badge) |

### Notifications

| METHOD | PATH | MIDDLEWARES | O QUE RETORNA | RISCOS |
|---|---|---|---|---|
| GET | `/api/notifications` | `requireAuth` | Lista de notificações do usuário | Sem paginação (limit default no storage = 50, ok) |
| GET | `/api/notifications/unread-count` | `requireAuth` | `{ count }` | Nenhum específico |
| POST | `/api/notifications/:id/read` | `requireAuth` | `{ message }` ou **404** `{ message }` | Nenhum específico |
| POST | `/api/notifications/mark-all-read` | `requireAuth` | `{ message }` | Nenhum específico |

### Admin

| METHOD | PATH | MIDDLEWARES | O QUE RETORNA | RISCOS |
|---|---|---|---|---|
| GET | `/api/admin/users/search?q=` | `requireAuth`, `requireAdmin` | Lista (max 10) `{ id, email, name, journalistStatus, isJournalist }` | Enumeração de usuários (mitigada por admin-only); depende de `ADMIN_EMAILS` |
| PATCH | `/api/admin/journalists/:userId` | `requireAuth`, `requireAdmin` | `{ message }` (ações: `approve/reject/revoke/promote`) | Mudança de `userType` + criação/remoção em `journalists` (alto impacto; admin-only) |
| POST | `/api/admin/standings/recalculate` | `requireAuth`, `requireAdmin` | `{ message }` | Operação potencialmente pesada (recalcula tabela) |

### WebSocket (não-HTTP)

| METHOD | PATH | MIDDLEWARES | O QUE RETORNA | RISCOS |
|---|---|---|---|---|
| WS (upgrade) | `/ws/notifications` | Cookie `connect.sid` + assinatura `SESSION_SECRET` + sessionStore lookup | Mensagens JSON (ex: `{ type: "connected", userId }`) | Se cookie não trafega (SameSite/secure/CORS), WS falha com 401; sem limitação de conexões por usuário |

### Client (catch-all)

| METHOD | PATH | MIDDLEWARES | O QUE RETORNA | RISCOS |
|---|---|---|---|---|
| ANY | `*` (DEV) | `vite.middlewares` | HTML do `client/index.html` transformado pelo Vite | Pode mascarar rotas “não /api” (intencional). Importante que APIs estejam antes do catch-all (estão) |
| ANY | `*` (PROD) | `express.static(dist/public)` + fallback | Serve arquivos estáticos e fallback para `index.html` | Se build do client não existir, app não sobe (`server/vite.ts`) |


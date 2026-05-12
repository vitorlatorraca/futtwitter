# FUTTWITTER — Documentação completa de rotas

> Gerado em 2026-05-10. Cobre o backend Express servido como função serverless no Vercel.

---

## 1. Visão geral da arquitetura

### 1.1 Topologia

```
                       ┌──────────────────────────────────┐
                       │  Browser (cliente React/Vite)    │
                       │  https://futtwitter-...vercel.app│
                       └──────────────┬───────────────────┘
                                      │ fetch
                       ┌──────────────▼───────────────────┐
                       │  Vercel Edge / CDN                │
                       │  - serve dist/public/* (estático) │
                       │  - rewrite /api/* → /api          │
                       │  - rewrite /(.*)  → /index.html   │
                       └──────────────┬───────────────────┘
                                      │
                       ┌──────────────▼───────────────────┐
                       │  Vercel Function (api/index.js)   │
                       │  Express app, lazy-init           │
                       │  maxDuration: 30s                 │
                       └──────────────┬───────────────────┘
                                      │
                       ┌──────────────▼───────────────────┐
                       │  Neon PostgreSQL (us-east-1)      │
                       └──────────────────────────────────┘
                                Cloudinary (uploads)
                                Resend (emails)
```

**Pontos importantes:**

- O frontend (SPA React) e o backend (Express) compartilham a mesma origem Vercel.
- A função serverless é **uma única função** — todo o `/api/*` é roteado pra `api/index.js`.
- Estado é **efêmero**: nada de cache em RAM entre requests (sessões vão pro Postgres).
- **WebSocket não existe em prod** — Vercel Functions não suportam conexões longas. Cliente cai pra polling.

### 1.2 Pipeline de build

```bash
npm run build:vercel
  ├─ vite build              # frontend → dist/public/
  └─ esbuild api/_entry.ts → api/index.js  # bundle ESM, format=esm
```

`api/index.js` empacota tudo: Express, helmet, cors, drizzle, bcrypt, multer, etc. Saída ~400 KB.

### 1.3 Configuração Vercel (`vercel.json`)

```json
{
  "version": 2,
  "framework": null,
  "buildCommand": "npm run build:vercel",
  "installCommand": "npm install --include=dev",
  "outputDirectory": "dist/public",
  "functions": {
    "api/index.js": { "maxDuration": 30 }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)",     "destination": "/index.html" }
  ]
}
```

---

## 2. Ciclo de vida de uma request

### 2.1 Caminho da request

1. **Vercel Edge** recebe a request.
2. Se for `/assets/*`, `/icons/*`, `/index.html` etc. — **serve estático do CDN** sem invocar função.
3. Se for `/api/*` — rewrite manda pra `api/index.js`. URL original preservada.
4. **Função inicia** (cold start) ou reaproveita instância warm (Fluid Compute).
5. `api/_entry.ts → handler(req, res)`:
   - `await ensureInit()` — singleton: roda `registerRoutes(app)` na primeira request, reaproveita depois.
   - `app(req, res, next)` — entrega ao Express.
6. Express middleware chain:
   - `helmet` (headers de segurança)
   - `cors` (delegate dinâmico — same-origin sempre passa)
   - `express.json({ limit: "1mb" })`
   - `express.urlencoded({ limit: "1mb" })`
   - **session** (PgSession — lê/grava em `user_sessions`)
   - rota específica + middlewares específicos (`requireAuth`, `requireJournalist`, `requireAdmin`, rate limiters)
   - handler da rota
7. Se **erro não capturado**: handler global em `_entry.ts:88-99` loga stack + retorna 500.

### 2.2 Sessões

- **Store:** `connect-pg-simple` (tabela `user_sessions` no Postgres).
- **Cookie:** `httpOnly`, `secure` automático em prod, `sameSite: lax`, expira em 30 dias, **rolling** (renova a cada request).
- **Conteúdo da sessão:** `userId`, `userType` (`FAN` | `JOURNALIST` | `ADMIN`).
- O `userType` é **re-sincronizado com o DB** em cada `/api/auth/me` e em middlewares de role — protege contra promoção/demotion stale.

### 2.3 CORS

`api/_entry.ts` usa um `CorsOptionsDelegate` dinâmico:

1. **Sem header `Origin`** → permite (same-origin GET, server-to-server).
2. **`Origin.host === req.host`** → permite (same-origin POST/PUT/DELETE — funciona em qualquer URL de preview).
3. **Origin em `CORS_ORIGIN` env** → permite (allowlist explícito).
4. **Em dev: `http://localhost:*` / `127.0.0.1:*`** → permite.
5. Senão → **bloqueia** (retorna `Error("CORS blocked for origin: …")` que vira 500).

> ❗ Antes do fix de 2026-05-10, era allowlist hardcoded `https://futtwitter.vercel.app` apenas — bloqueava preview deploys.

---

## 3. Modelo de autenticação e RBAC

### 3.1 Roles

| Role | Origem | Pode |
|---|---|---|
| `FAN` | default em signup | ler tudo público, criar posts/comments, dar ratings, votar em rumors, jogar games |
| `JOURNALIST` | aprovado por admin | tudo de FAN + criar/editar/deletar próprias notícias, criar/editar transfer rumors, upload de imagens de notícia |
| `ADMIN` | manual no DB ou via `ADMIN_EMAILS` | tudo + aprovar journalists, recalcular standings, seed |

### 3.2 Middlewares

**`requireAuth(req, res, next)`** — `routes.ts:88-94`
- 401 "Não autenticado" se não tem `req.session.userId`.

**`requireJournalist(req, res, next)`** — `routes.ts:96-130`
- 401 se sem sessão.
- Re-busca o user no DB e re-sincroniza `req.session.userType`.
- 403 se `userType !== 'JOURNALIST'`.
- 403 se não tem registro em `journalists` ou `status !== 'APPROVED'`.

**`requireAdmin(req, res, next)`** — `routes.ts:163-187`
- 401 se sem sessão.
- Re-busca user no DB.
- 403 se `userType !== 'ADMIN'` E email não está em `ADMIN_EMAILS` env (fallback).

**`requireJournalistOrAdmin(req, res, next)`**
- Combina os dois.

### 3.3 Rate limiters (`express-rate-limit`)

| Limiter | Janela | Limite | Uso |
|---|---|---|---|
| `loginLimiter` | 15 min | 10/IP | POST /api/auth/login |
| `signupLimiter` | 60 min | 5/IP | POST /api/auth/signup, /register |
| `forgotPasswordLimiter` | 60 min | 5/IP | POST /api/auth/forgot-password |
| `resetPasswordLimiter` | 60 min | 10/IP | GET/POST /api/auth/reset-password/* |
| `handleCheckLimiter` | 1 min | 30/IP | GET /api/auth/check-handle |

`trust proxy = 1` em `_entry.ts` faz `req.ip` ser o IP real do cliente (não do edge).

---

## 4. Catálogo completo de rotas

> Convenção: `auth` = middleware de autenticação. `validação` = "zod" (schema), "manual" (validação ad-hoc) ou "n/a". `rate-limit` listado quando há.

### 4.1 Auth (`server/routes.ts`)

| Método | Path | Auth | Validação | Rate-limit |
|---|---|---|---|---|
| GET | `/api/auth/check-handle` | público | manual | handleCheckLimiter |
| POST | `/api/auth/signup` | público | zod (`insertUserSchema`) | signupLimiter |
| POST | `/api/auth/register` | público | zod (`insertUserSchema`) | signupLimiter |
| POST | `/api/auth/login` | público | zod | loginLimiter |
| POST | `/api/auth/logout` | requireAuth | n/a | — |
| POST | `/api/auth/forgot-password` | público | zod | forgotPasswordLimiter |
| GET | `/api/auth/reset-password/validate/:token` | público | manual | resetPasswordLimiter |
| POST | `/api/auth/reset-password` | público | zod | resetPasswordLimiter |
| GET | `/api/auth/me` | implícita (lê sessão) | n/a | — |

### 4.2 Saúde

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/health` | público | n/a — checa `SELECT 1` no DB |

### 4.3 Times, partidas, jogadores (públicos)

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/teams` | público | n/a |
| GET | `/api/teams/:id` | público | manual |
| GET | `/api/teams/:slug/squad` | público | manual |
| GET | `/api/competitions/:id/standings` | público | manual |
| GET | `/api/competitions/:id/upcoming-fixtures` | público | manual |
| GET | `/api/matches/:id` | público | manual |
| GET | `/api/matches/:id/lineup` | público | manual |
| GET | `/api/matches/:id/ratings` | público | manual |
| GET | `/api/matches/:teamId/recent` | público | manual |
| GET | `/api/players/search` | público | manual |
| GET | `/api/players/:id/ratings` | público | n/a |

### 4.4 Meu Time (autenticado)

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/my-team/overview` | requireAuth | n/a |
| GET | `/api/teams/:teamId/summary` | requireAuth | manual |
| GET | `/api/teams/:teamId/fixtures` | requireAuth | manual |
| GET | `/api/teams/:teamId/matches` | requireAuth | manual |
| POST | `/api/teams/:teamId/matches` | requireAuth, requireAdmin | zod |
| PUT | `/api/matches/:matchId` | requireAuth, requireAdmin | manual |
| GET | `/api/teams/:teamId/stats` | requireAuth | manual |
| GET | `/api/leagues/:leagueId/standings` | requireAuth | manual |
| GET | `/api/teams/:teamId/players` | requireAuth | manual |
| GET | `/api/teams/:teamId/roster` | requireAuth | manual |
| GET | `/api/teams/:teamId/top-rated` | requireAuth | manual |
| GET | `/api/lineups/me` | requireAuth | manual |
| POST | `/api/lineups/me` | requireAuth | manual |
| GET | `/api/teams/:id/extended` | requireAuth | n/a |
| GET | `/api/teams/:teamId/upcoming-match` | requireAuth | n/a |
| GET | `/api/teams/:teamId/last-match` | requireAuth | n/a |
| GET | `/api/teams/:teamId/last-match/ratings` | requireAuth | n/a |
| GET | `/api/teams/:teamId/last-match-for-rating` | requireAuth | n/a |
| GET | `/api/teams/:teamId/ratings/analytics` | requireAuth | manual |

### 4.5 Avaliação de jogadores

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/matches/:id/my-ratings` | requireAuth | n/a |
| POST | `/api/ratings` | requireAuth | manual |
| PUT | `/api/ratings` | requireAuth | manual |
| POST | `/api/players/:id/ratings` | requireAuth | zod |

### 4.6 Uploads (Cloudinary)

| Método | Path | Auth | Validação | Limite |
|---|---|---|---|---|
| POST | `/api/uploads/image` | requireAuth, requireJournalist | mime+ext | 5 MB |
| POST | `/api/uploads/post-image` | requireAuth | mime+ext | 5 MB |
| POST | `/api/uploads/news-image` | requireJournalist | mime+ext | 5 MB |
| POST | `/api/profile/avatar` | requireAuth | mime+ext | 2 MB |
| DELETE | `/api/profile/avatar` | requireAuth | n/a | — |
| POST | `/api/profile/cover` | requireAuth | mime+ext | 5 MB |
| DELETE | `/api/profile/cover` | requireAuth | n/a | — |

> Multer usa `memoryStorage` (sem disco — compatível com Vercel). Buffer vai direto pro Cloudinary.

### 4.7 Notícias (jornalistas)

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/news` | público | manual |
| GET | `/api/news/my-news` | requireAuth, requireJournalist | n/a |
| POST | `/api/news` | requireAuth, requireJournalist | zod (`insertNewsSchema`) |
| PATCH | `/api/news/:id` | requireAuth, requireJournalist | zod (`partial`) + ownership |
| DELETE | `/api/news/:id` | requireAuth, requireJournalist | ownership |
| POST | `/api/news/:id/interaction` | requireAuth | manual |
| GET | `/api/news/:newsId/comments` | público | n/a |
| POST | `/api/news/:newsId/comments` | requireAuth | zod (`insertCommentSchema`) |

### 4.8 Comentários

| Método | Path | Auth | Validação |
|---|---|---|---|
| POST | `/api/comments/:commentId/likes` | requireAuth | n/a |
| DELETE | `/api/comments/:commentId/likes` | requireAuth | n/a |

### 4.9 Perfil

| Método | Path | Auth | Validação |
|---|---|---|---|
| PUT | `/api/profile` | requireAuth | zod (`profileUpdateSchema`) |
| PUT | `/api/profile/password` | requireAuth | zod (`changePasswordSchema`) |

### 4.10 Badges & notificações

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/badges` | requireAuth | n/a |
| POST | `/api/badges/check` | requireAuth | n/a |
| GET | `/api/notifications` | requireAuth | n/a |
| GET | `/api/notifications/unread-count` | requireAuth | n/a |
| POST | `/api/notifications/:id/read` | requireAuth | n/a |
| POST | `/api/notifications/mark-all-read` | requireAuth | n/a |

### 4.11 Aplicação de jornalista

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/journalist-application/status` | requireAuth | n/a |
| POST | `/api/journalist-application/apply` | requireAuth | zod (`insertJournalistSchema`) |

### 4.12 Admin

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/admin/journalist-applications` | requireAuth, requireAdmin | n/a |
| GET | `/api/admin/users/search` | requireAuth, requireAdmin | manual |
| PATCH | `/api/admin/journalists/:userId` | requireAuth, requireAdmin | manual (action enum) |
| POST | `/api/admin/standings/recalculate` | requireAuth, requireAdmin | n/a |
| POST | `/api/admin/brasileirao-2026/seed` | requireAuth, requireAdmin | n/a |

### 4.13 Fórum (por time)

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/teams/:teamId/forum/stats` | requireAuth | n/a |
| GET | `/api/teams/:teamId/forum/topics` | requireAuth | manual |
| GET | `/api/teams/:teamId/forum/topics/:topicId` | requireAuth | n/a |
| POST | `/api/teams/:teamId/forum/topics` | requireAuth | manual |
| GET | `/api/teams/:teamId/forum/topics/:topicId/replies` | requireAuth | manual |
| POST | `/api/teams/:teamId/forum/topics/:topicId/replies` | requireAuth | manual |
| POST | `/api/teams/:teamId/forum/topics/:topicId/like` | requireAuth | n/a |
| POST | `/api/teams/:teamId/forum/replies/:replyId/like` | requireAuth | n/a |

### 4.14 Vai e Vem (transfers)

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/transfers` | público | manual |
| GET | `/api/transfer-rumors` | público | manual |
| GET | `/api/transfer-rumors/mine` | requireJournalistOrAdmin | n/a |
| GET | `/api/transfer-rumors/:id` | público | manual |
| POST | `/api/transfer-rumors` | requireAuth (role-checked) | manual |
| PATCH | `/api/transfer-rumors/:id` | requireAuth (role + ownership) | manual |
| DELETE | `/api/transfer-rumors/:id` | requireAuth (role + ownership) | n/a |
| POST | `/api/transfer-rumors/:id/vote` | requireAuth | manual |
| GET | `/api/transfer-rumors/:id/comments` | público | n/a |
| POST | `/api/transfer-rumors/:id/comments` | requireAuth | manual |
| POST | `/api/transfers/:id/vote` | requireAuth | manual |

### 4.15 Games (Adivinhe o Elenco)

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/games/sets` | público | n/a |
| GET | `/api/games/sets/:slug` | público | manual |
| POST | `/api/games/attempts/start` | requireAuth | manual |
| GET | `/api/games/attempts/:id` | requireAuth | manual |
| POST | `/api/games/attempts/:id/guess` | requireAuth | manual |
| POST | `/api/games/attempts/:id/reset` | requireAuth | manual |
| POST | `/api/games/attempts/:id/abandon` | requireAuth | manual |
| GET | `/api/games/player-of-the-day` | requireAuth | n/a |
| GET | `/api/games/players/search` | requireAuth | manual |
| POST | `/api/games/player-of-the-day/guess` | requireAuth | manual |

### 4.16 Feed (`server/route-handlers/feed.ts`)

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/feed/influencers` | público (lê sessão se houver) | manual |
| GET | `/api/feed/fan-posts` | público | manual |
| GET | `/api/feed/torcida` | público | manual |
| GET | `/api/feed/news/:id` | público | manual |
| POST | `/api/feed/news/:id/like` | requireAuth | n/a |
| POST | `/api/feed/news/:id/bookmark` | requireAuth | n/a |
| GET | `/api/feed/trending` | público | n/a |
| GET | `/api/feed/upcoming-matches` | público | manual |

### 4.17 Social (`server/route-handlers/social.ts`)

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/users/suggested` | público | manual |
| GET | `/api/users/:handle` | público | manual |
| GET | `/api/users/:handle/followers` | público | manual |
| GET | `/api/users/:handle/following` | público | manual |
| POST | `/api/users/:handle/follow` | requireAuth | n/a |
| DELETE | `/api/users/:handle/follow` | requireAuth | n/a |
| GET | `/api/posts` | público | manual |
| GET | `/api/posts/bookmarks` | requireAuth | n/a |
| POST | `/api/posts` | requireAuth | zod (`insertPostSchema`) |
| GET | `/api/posts/:id` | público | manual |
| DELETE | `/api/posts/:id` | requireAuth (ownership) | n/a |
| POST | `/api/posts/:id/like` | requireAuth | n/a |
| POST | `/api/posts/:id/bookmark` | requireAuth | n/a |

### 4.18 Explore (`server/route-handlers/explore.ts`)

| Método | Path | Auth | Validação |
|---|---|---|---|
| GET | `/api/explore/trending` | público | manual |
| GET | `/api/explore/hashtags` | público | manual |
| GET | `/api/explore/search` | público | manual |
| GET | `/api/explore/posts-by-hashtag/:name` | público | manual |
| GET | `/api/explore/suggested-users` | requireAuth | n/a |

---

## 5. Erros e respostas

### 5.1 Códigos esperados

| Código | Quando |
|---|---|
| 200 | OK |
| 201 | Recurso criado (post, comment) |
| 400 | Validação falhou (Zod, manual) ou regra de negócio (ex: email duplicado) |
| 401 | Sessão ausente/inválida |
| 403 | Sem permissão (RBAC ou ownership) |
| 404 | Recurso não existe |
| 409 | Conflito (handle/email duplicado) |
| 429 | Rate limit excedido |
| 500 | Erro do servidor (com stack no log) |
| 503 | Serviço externo indisponível (Cloudinary não configurado) |

### 5.2 Formato de resposta de erro

Todos os erros retornam JSON:

```json
{ "message": "Mensagem em português" }
```

Em validação Zod, o `message` carrega o **JSON serializado dos erros do Zod**. O frontend deveria parsear e mostrar o primeiro `.message` legível, e não o array bruto.

### 5.3 Logging

`api/_entry.ts:86-99` (handler global) loga em `console.error`:

```
[express] METHOD /url → 500: <message>
<stack trace>
```

Isso vai pra **Vercel Logs** (acessível via `vercel logs <deployment-url>`).

---

## 6. Decisões de design e armadilhas conhecidas

### 6.1 Por que uma única função em vez de múltiplas?

Cada arquivo `api/*.ts` no Vercel vira uma função própria. Como o Express tem ~100 rotas, criar 100 funções:
- multiplica cold starts,
- complica compartilhamento de middleware (auth, session),
- explode o limite de funções do plano Hobby.

**Decisão:** uma função `api/index.js`, com Express roteando internamente. `vercel.json` faz `/api/(.*)` → `/api`.

### 6.2 Por que `req.url` é preservado mesmo após o rewrite?

O rewrite do Vercel só decide qual função invocar. A URL original chega no handler intacta — Express enxerga `/api/auth/register` mesmo quando o rewrite mandou pra `/api`.

### 6.3 Por que Pool de Postgres com `max: 1` em prod?

Vercel cria uma instância de função por request concorrente. Cada instância abre seu próprio pool. Se cada pool tivesse 10 conexões e tivessem 50 instâncias, seriam 500 conexões — Neon explode.

`max: 1` em prod (`server/db.ts:31`) limita cada instância a 1 conexão. Para tráfego maior, considerar pgBouncer ou `@neondatabase/serverless` com HTTP fetch.

### 6.4 Por que o cookie é `sameSite: lax` e não `strict`?

Frontend e backend compartilham origem na Vercel — `lax` é suficiente pra CSRF protection sem quebrar navegação cross-tab.

Se um dia separar frontend (`futtwitter.com`) e backend (`api.futtwitter.com`), precisará mudar pra `none` + `secure: true` + ajustar `COOKIE_DOMAIN`.

### 6.5 WebSocket dev-only

`server/index.ts` inicializa WebSocket pra notificações em tempo real. **Em prod (Vercel)**, `api/_entry.ts` não chama isso — Vercel Functions não suportam conexões longas. O frontend deve ter fallback pra polling.

### 6.6 Seeds idempotentes

`server/storage.ts:seedTeamsIfEmpty()` roda em todo cold start (no primeiro request). É **idempotente** — só insere se a tabela `teams` está vazia.

> ❗ Antes do fix de 2026-05-10, `seedGames()` rodava em todo cold start e **não era idempotente** — apagava + reinseria 37 rows toda vez. Corrigido removendo a chamada do hot path. Rodar manualmente via `npm run seed:games`.

### 6.7 Drift de schema entre Drizzle e SQL raw

A maioria das queries usa Drizzle ORM. Algumas usam SQL raw via `db.execute(sql\`…\`)` — usado quando o ORM não dá conta (ex: `last-match-for-rating` em `routes.ts:1662-1752`).

**Risco:** rename de coluna no `shared/schema.ts` não quebra a query raw em compile time. **Mitigação:** auditoria periódica dos blocos `sql\`…\`` contra o schema (último check: 2026-05-10, sem drift).

---

## 7. Variáveis de ambiente

### 7.1 Obrigatórias

| Var | Uso | Quem provê |
|---|---|---|
| `DATABASE_URL` | Conexão Postgres | Neon (Vercel marketplace) |
| `SESSION_SECRET` | Assinatura de cookie | Você (string ≥ 32 chars) |
| `NODE_ENV` | `production` em prod | Vercel injeta |

### 7.2 Por feature

| Feature | Vars |
|---|---|
| Uploads | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| Email (reset senha) | `RESEND_API_KEY`, `EMAIL_FROM`, `APP_URL` |
| Admin | `ADMIN_EMAILS` (csv) |

### 7.3 Opcionais

| Var | Default | Uso |
|---|---|---|
| `CORS_ORIGIN` | `""` | csv de origens cross-origin permitidas |
| `COOKIE_DOMAIN` | undefined | só se usar domínio próprio |
| `COOKIE_SAMESITE` | `lax` | override |
| `COOKIE_SECURE` | auto | force `true`/`false` |
| `APIFOOTBALL_*` | — | reservadas; código atual não consome |

---

## 8. Resumo de smoke test (2026-05-10)

Rodado contra prod (`https://futtwitter-vitor-latorracas-projects.vercel.app`):

| # | Endpoint | Resultado |
|---|---|---|
| 1 | GET /api/health | ✅ 200 `{ok:true, db:ok}` |
| 2 | GET /api/auth/check-handle | ✅ 200 `{available:true}` |
| 3 | POST /api/auth/register | ✅ 200 + sessão criada |
| 4 | GET /api/auth/me (authed) | ✅ 200 + dados do user (sem password) |
| 5 | POST /api/auth/logout | ✅ 200 + sessão limpa |
| 6 | GET /api/auth/me (logged out) | ✅ 200 `null` |
| 7 | POST /api/auth/login | ✅ 200 + sessão renovada |
| 8 | POST /api/posts (authed) | ✅ 201 + post criado |
| 9 | DELETE /api/posts/:id alheio (IDOR) | ✅ 403 "Você só pode deletar seus próprios posts" |
| 10 | GET /api/news/my-news (FAN→JOURNALIST) | ✅ 403 "Acesso negado. Apenas jornalistas." |
| 11 | GET /api/admin/journalist-applications (FAN→ADMIN) | ✅ 403 "Acesso negado. Apenas administradores." |
| 12 | PUT /api/profile (bio update) | ✅ 200 + sem leak de password |
| 13 | DELETE /api/posts/:id próprio | ✅ 200 "Post deletado" |
| 14 | POST /api/auth/register sem cookie | ✅ 401 "Não autenticado" (em /posts) |
| 15 | POST /api/auth/register senha fraca | ✅ 400 + Zod errors |
| 16 | POST /api/auth/register email inválido | ✅ 400 + "Email inválido" |
| 17 | POST /api/auth/register email duplicado | ✅ 400 "Email já cadastrado" |
| 18 | GET /api/teams, /news, /posts, /feed/* | ✅ 200 |

**0 falhas em 18 cenários.**

---

## 9. Achados e recomendações

### 🔴 Bloqueadores (corrigidos nesta sessão)

| # | Problema | Commit |
|---|---|---|
| 1 | TypeCheck quebrava deploy (QueryResult index, literal type) | `5b6d839` |
| 2 | `seedGames()` rodava em todo cold start (deletava + reinseria 37 rows) | `781c6a8` |
| 3 | Handler global de erro não logava stack trace | `781c6a8` |
| 4 | CORS bloqueava preview URLs (allowlist hardcoded) | `9d8da83` |

### 🟡 Should-fix (não bloqueiam, mas pendentes)

1. **N+1 em loops com queries DB:** `feed.ts:131`, `routes.ts:2222`, `social.ts:188-206`. Usar `inArray(col, ids)` + Set lookup.
2. **Erros silenciosos:** `feed.ts:139, 478` retornam `[]` com 200 em catch.
3. **Rate limits faltando** em escritas: uploads, ratings, posts, comments, news, transfers, forum.
4. **Frontend não exibe Zod errors** legíveis — toast genérico "Erro ao criar conta" enquanto o backend devolve a mensagem certa.
5. **`server/services/avatarStorage.ts`** é código morto que escreve em disco — deletar.

### 🟢 Nice-to-have

1. Bundle JS do client tem chunks > 500 KB (`meu-time` 529 KB). Usar `dynamic import()` em rotas pesadas.
2. Refatorar lógica duplicada de "is following?" em `social.ts:156-213`.

---

## 10. Próximos passos sugeridos

1. **Mensagens de erro Zod no frontend** — parsear o JSON do `message` e exibir o primeiro `.message`. ROI alto, esforço baixo.
2. **Aplicar rate limits** nos POSTs de escrita (~30 min).
3. **Eliminar N+1** com batch queries (~30 min).
4. **Dropar `avatarStorage.ts`** (5 min).
5. **Resend:** verificar domínio em `resend.com` ou usar `onboarding@resend.dev` pra testar reset de senha.

---

*Documento gerado a partir da auditoria automatizada + verificação manual. Para reproduzir o smoke test, ver script em `docs/smoke-test.sh` (a criar).*

# FUTTWITTER — Relatório de Auditoria Completa (Full Audit)

**Data:** 2025-02-17 (atualizado)  
**Escopo:** client + server + db + scripts + docs  
**Objetivo:** Auditoria técnica completa com plano de correções priorizado.

### Estrutura de pastas (principais módulos)

```
FUTTWITTER/
├── client/src/
│   ├── features/           # Features por domínio
│   │   ├── forum/          # Comunidade (tópicos, respostas)
│   │   ├── games/          # Adivinhe o Elenco (api.ts)
│   │   ├── journalist-transfer-rumors/
│   │   ├── meu-time/       # Classificação, tabs
│   │   ├── my-team-v2/     # Overview, lineup, elenco preview
│   │   ├── team/matches/   # MatchesPage, MatchRow
│   │   └── transfers/      # Vai e Vem
│   ├── lib/                # queryClient, auth-context
│   ├── pages/              # Rotas (meu-time, jogos, vai-e-vem, etc.)
│   └── components/         # UI (news-card, navbar, etc.)
├── server/
│   ├── db/                 # db.ts, seed/
│   ├── repositories/        # games.repo, forum.repo, etc.
│   ├── scripts/            # db-push-guard, seeds
│   └── routes.ts           # Todas as rotas API
├── shared/schema.ts        # Drizzle schema + Zod
└── migrations/             # Drizzle migrations
```

---

## 1) Arquitetura e Fluxo

### 1.1 Stack

- **Frontend:** React 18 + Vite 5 + TypeScript + Tailwind + shadcn/ui + wouter (roteamento)
- **Backend:** Express + Node + TypeScript
- **Banco:** Drizzle ORM + PostgreSQL (Neon)
- **Auth:** express-session + connect-pg-simple (sessões em Postgres)

### 1.2 Como o front chama a API

- **apiRequest** (`client/src/lib/queryClient.ts`): função genérica para POST/PUT/PATCH/DELETE com `credentials: "include"`.
- **getApiUrl(path):** usa `VITE_API_URL` se definido; senão path relativo (proxy no dev).
- **TanStack Query:** queries usam `fetch` direto com `credentials: "include"` ou `apiRequest`.
- **Proxy (dev):** Vite proxy `/api` → `http://127.0.0.1:5000` quando `VITE_API_URL` não está setado.

### 1.3 Páginas principais e rotas

| Rota | Componente | Auth |
|------|------------|------|
| `/` | LandingPage | Público |
| `/login`, `/cadastro` | Login, Signup | Público |
| `/selecionar-time` | TeamSelectionPage | - |
| `/dashboard` | DashboardPage | Protegida |
| `/meu-time` | MeuTimePage | Protegida |
| `/meu-time/elenco` | MeuTimeElencoPage | Protegida |
| `/meu-time/jogos` | MatchesPage | Protegida |
| `/meu-time/comunidade/:topicId` | MeuTimeComunidadeTopicPage | Protegida |
| `/jogos` | JogosParaSeDivertirPage | Protegida |
| `/jogos/lembra-desse-elenco` | LembraDesseElencoPage | Protegida |
| `/jogos/adivinhe-elenco/:slug` | AdivinheElencoPage | Protegida |
| `/vai-e-vem` | VaiEVemPage | Protegida |
| `/jornalista` | JornalistaPage | Protegida |
| `/perfil` | PerfilPage | Protegida |

### 1.4 Proteção de rotas

- **ProtectedRoute:** verifica `user` e `user.teamId`; redireciona para `/login` ou `/selecionar-time`.
- **PublicRoute:** se logado e com team, redireciona para `/dashboard`.
- **Auth:** `useAuth()` consome `GET /api/auth/me` via TanStack Query.

### 1.5 Fluxo do banco (Drizzle)

- **Schema:** `shared/schema.ts`
- **Migrations:** `./migrations` (drizzle-kit)
- **db:push:** `npm run db:push` → chama `db-push-guard.ts` que **bloqueia em NODE_ENV=production**.
- **db:migrate:** `npm run db:migrate` → `run-migrations.ts` (para produção).
- **Seed automático no dev:** `registerRoutes` chama `storage.seedTeamsIfEmpty()` e `seedGames()` na subida do server.

---

## 2) Rotas/API — Lista Completa

### Auth

| METHOD | PATH | Auth | Recebe | Retorna |
|--------|------|------|--------|---------|
| GET | `/api/health` | Não | - | `{ ok, status, db, env }` |
| POST | `/api/auth/signup` | Não | `{ name, email, password, teamId? }` | `{ id, name, email, teamId, userType }` |
| POST | `/api/auth/register` | Não | Idem signup | Idem |
| POST | `/api/auth/login` | Não | `{ email, password }` | `{ id, name, email, teamId, userType }` |
| POST | `/api/auth/logout` | Não | - | `{ message }` |
| GET | `/api/auth/me` | Sessão | - | `null` ou `{ id, name, email, teamId, userType, journalistStatus, isJournalist, isAdmin }` |

### Teams / Meu Time

| METHOD | PATH | Auth | Recebe | Retorna |
|--------|------|------|--------|---------|
| GET | `/api/teams` | Não | - | Lista de times |
| GET | `/api/teams/:id` | Não | - | `{ ...team, players }` ou 404 |
| GET | `/api/teams/:teamId/extended` | requireAuth | - | `{ team, players, matches, leagueTable, stadium, clubInfo }` ou 404 |
| GET | `/api/teams/:teamId/summary` | requireAuth | - | Resumo do time |
| GET | `/api/teams/:teamId/fixtures` | requireAuth | query: type, limit, competitionId, season | Fixtures |
| GET | `/api/teams/:teamId/matches` | requireAuth | query: type, limit | Matches |
| POST | `/api/teams/:teamId/matches` | requireAuth, requireAdmin | body | Match criado |
| PUT | `/api/matches/:matchId` | requireAuth, requireAdmin | body | Match atualizado |
| GET | `/api/teams/:teamId/stats` | requireAuth | - | Estatísticas |
| GET | `/api/competitions/:competitionId/standings` | Não | query: season | Tabela |
| GET | `/api/leagues/:leagueId/standings` | requireAuth | query: season | Tabela |
| GET | `/api/teams/:teamId/players` | requireAuth | - | Players |
| GET | `/api/teams/:teamId/roster` | requireAuth | - | Roster |
| GET | `/api/teams/:teamId/top-rated` | requireAuth | query: limit, lastN | Top rated |
| GET | `/api/lineups/me` | requireAuth | query: teamId | Lineup |
| POST | `/api/lineups/me` | requireAuth | `{ teamId, formation, slots }` | Lineup |
| GET | `/api/teams/:slug/squad` | Não | - | Squad (por slug) |
| GET | `/api/teams/:teamId/upcoming-match` | requireAuth | - | Próximo jogo |
| GET | `/api/teams/:teamId/last-match` | requireAuth | - | Último jogo |
| GET | `/api/teams/:teamId/last-match/ratings` | requireAuth | - | Ratings do último jogo |
| GET | `/api/my-team/overview` | requireAuth | - | Overview do meu time |
| GET | `/api/teams/:teamId/forum/stats` | requireAuth | - | Stats do fórum |
| GET | `/api/teams/:teamId/forum/topics` | requireAuth | query | Tópicos |
| GET | `/api/teams/:teamId/forum/topics/:topicId` | requireAuth | - | Tópico |
| POST | `/api/teams/:teamId/forum/topics` | requireAuth | body | Tópico criado |
| GET | `/api/teams/:teamId/forum/topics/:topicId/replies` | requireAuth | - | Respostas |
| POST | `/api/teams/:teamId/forum/topics/:topicId/replies` | requireAuth | body | Resposta |
| POST | `/api/teams/:teamId/forum/topics/:topicId/like` | requireAuth | - | Likes |
| POST | `/api/teams/:teamId/forum/replies/:replyId/like` | requireAuth | - | Likes |

### Matches

| METHOD | PATH | Auth | Recebe | Retorna |
|--------|------|------|--------|---------|
| GET | `/api/matches/:id` | Não | - | Match |
| GET | `/api/matches/:id/lineup` | Não | - | Lineup |
| GET | `/api/matches/:id/ratings` | Não | - | Ratings |
| GET | `/api/matches/:id/my-ratings` | requireAuth | - | Minhas ratings |
| POST | `/api/ratings` | requireAuth | body | Rating |
| GET | `/api/matches/:teamId/recent` | Não | query: limit | Matches recentes |

### News / Feed

| METHOD | PATH | Auth | Recebe | Retorna |
|--------|------|------|--------|---------|
| GET | `/api/news` | Não | query: scope, teamId, limit | Notícias |
| GET | `/api/news/my-news` | requireJournalist | - | Minhas notícias |
| POST | `/api/news` | requireJournalist | body + multipart | News criada |
| PATCH | `/api/news/:id` | requireJournalist | body | News atualizada |
| DELETE | `/api/news/:id` | requireJournalist | - | - |
| POST | `/api/news/:id/interaction` | requireAuth | `{ type }` | - |
| GET | `/api/news/:newsId/comments` | Não | - | Comentários |
| POST | `/api/news/:newsId/comments` | requireAuth | body | Comentário |
| POST | `/api/comments/:commentId/likes` | requireAuth | - | - |
| DELETE | `/api/comments/:commentId/likes` | requireAuth | - | - |

### Transfers (Vai e Vem)

| METHOD | PATH | Auth | Recebe | Retorna |
|--------|------|------|--------|---------|
| GET | `/api/transfers` | Não | query | Transfers (legado) |
| GET | `/api/transfer-rumors` | Não | query: status, teamId, q, limit, offset | Rumores |
| GET | `/api/transfer-rumors/mine` | requireJournalistOrAdmin | - | Meus rumores |
| GET | `/api/transfer-rumors/:id` | Não | - | Rumor |
| POST | `/api/transfer-rumors` | requireAuth | body | Rumor criado |
| PATCH | `/api/transfer-rumors/:id` | requireAuth | body | Rumor atualizado |
| DELETE | `/api/transfer-rumors/:id` | requireAuth | - | - |
| POST | `/api/transfer-rumors/:id/vote` | requireAuth | body | Vote |
| GET | `/api/transfer-rumors/:id/comments` | Não | - | Comentários |
| POST | `/api/transfer-rumors/:id/comments` | requireAuth | body | Comentário |
| POST | `/api/transfers/:id/vote` | requireAuth | body | Vote (legado) |

### Games (Adivinhe o Elenco)

| METHOD | PATH | Auth | Recebe | Retorna |
|--------|------|------|--------|---------|
| GET | `/api/games/sets` | Não | - | Lista de sets |
| GET | `/api/games/sets/:slug` | Não | - | Set com players ou 404 |
| POST | `/api/games/attempts/start` | requireAuth | `{ setSlug }` | `{ attemptId, guessedIds }` |
| GET | `/api/games/attempts/:id` | requireAuth | - | Attempt com set |
| POST | `/api/games/attempts/:id/guess` | requireAuth | `{ text }` | GuessResult |
| POST | `/api/games/attempts/:id/reset` | requireAuth | - | - |
| POST | `/api/games/attempts/:id/abandon` | requireAuth | - | - |

### Profile / Uploads / Admin

| METHOD | PATH | Auth | Recebe | Retorna |
|--------|------|------|--------|---------|
| POST | `/api/uploads/image` | requireJournalist | multipart | URL |
| POST | `/api/uploads/news-image` | requireJournalist | multipart | URL |
| POST | `/api/profile/avatar` | requireAuth | multipart | User |
| DELETE | `/api/profile/avatar` | requireAuth | - | - |
| PUT | `/api/profile` | requireAuth | `{ name, email }` | User (password omitido ✅) |
| PUT | `/api/profile/password` | requireAuth | `{ currentPassword, newPassword }` | `{ message }` |
| GET | `/api/badges` | requireAuth | - | Badges |
| POST | `/api/badges/check` | requireAuth | - | Novos badges |
| GET | `/api/notifications` | requireAuth | - | Notificações |
| GET | `/api/notifications/unread-count` | requireAuth | - | `{ count }` |
| POST | `/api/notifications/:id/read` | requireAuth | - | - |
| POST | `/api/notifications/mark-all-read` | requireAuth | - | - |
| GET | `/api/admin/users/search` | requireAdmin | query: q | Usuários |
| PATCH | `/api/admin/journalists/:userId` | requireAdmin | `{ action }` | - |
| POST | `/api/admin/standings/recalculate` | requireAdmin | - | - |

### Players

| METHOD | PATH | Auth | Recebe | Retorna |
|--------|------|------|--------|---------|
| GET | `/api/players/search` | Não | query: q, limit | Players |
| GET | `/api/players/:id/ratings` | Não | - | Ratings |
| POST | `/api/players/:id/ratings` | requireAuth | body | Rating |

---

## 2.1 Endpoints chamados pelo front vs existentes

| Front chama | Existe? | Observação |
|-------------|---------|------------|
| `/api/teams` | ✅ | |
| `/api/teams/:teamId/extended` | ✅ | |
| `/api/teams/:teamId/players` | ✅ | |
| `/api/teams/:teamId/upcoming-match` | ✅ | |
| `/api/teams/:teamId/top-rated` | ✅ | |
| `/api/lineups/me` | ✅ | |
| `/api/matches/:teamId/recent` | ✅ | |
| `/api/news` | ✅ | |
| `/api/news/:newsId/comments` | ✅ | |
| `/api/competitions/:id/standings` | ✅ | |
| `/api/teams/:teamId/forum/*` | ✅ | |
| `/api/transfer-rumors` | ✅ | |
| `/api/transfer-rumors/mine` | ✅ | |
| `/api/games/sets` | ✅ | |
| `/api/games/sets/:slug` | ✅ | |
| `/api/games/attempts/*` | ✅ | |

**Não há 404 conhecidos** nas chamadas mapeadas. O front usa as rotas corretas.

---

## 2.2 "Set não encontrado" — Causa e correção

**Reprodução:** Acessar `/jogos/adivinhe-elenco/corinthians-2005-brasileirao` sem o seed ter rodado ou com slug incorreto.

**Causa raiz:**
- O seed `games.seed.ts` cria o set com slug `corinthians-2005-brasileirao`.
- O seed roda automaticamente no `registerRoutes` (server startup).
- Se o banco estiver vazio e o seed falhar, ou se o usuário acessar com slug errado, retorna 404.

**Correção mínima:**
- Garantir que o seed rode no dev (já está no startup).
- Garantir idempotência do seed (já está).
- Se o slug vier da lista de sets (`/api/games/sets`), o slug está correto. O problema só ocorre se:
  1. Acesso direto com slug digitado errado.
  2. Seed falhou (ex: DATABASE_URL inválida).

**Como testar:** `npm run dev` → ir em Jogos → Lembra desse elenco? → clicar em Corinthians 2005 → deve abrir o jogo.

---

## 3) Banco de Dados (Drizzle)

### 3.1 Tabelas principais

- **users, journalists, teams, players** — core
- **matches, matchPlayers** — jogos legado (matches)
- **fixtures, standings, teamMatchRatings** — jogos (fixtures)
- **news, newsInteractions, comments, commentLikes** — feed
- **transfers, transferVotes** — Vai e Vem legado
- **transferRumors, transferRumorVotes, transferRumorComments** — Vai e Vem (rumores)
- **teamsForumTopics, teamsForumReplies, teamsForumLikes** — fórum
- **gameSets, gameSetPlayers, gameAttempts, gameAttemptGuesses** — Adivinhe o Elenco
- **userLineups, userSessions, badges, userBadges, notifications** — sessão e gamificação

### 3.2 Enums relevantes

- **transfer_rumor_status:** RUMOR, NEGOTIATING, DONE, CANCELLED
- **transfer_status (legado):** RUMOR, NEGOCIACAO, FECHADO
- **game_attempt_status:** in_progress, completed, abandoned

### 3.3 Inconsistências

- **matches vs fixtures:** Dois modelos de partidas (matches antigo, fixtures novo). O Meu Time usa fixtures para jogos.
- **transfers vs transferRumors:** Dois modelos de transferências. O Vai e Vem usa transferRumors.

### 3.4 Seeds

- **seedTeamsIfEmpty:** roda no startup do server.
- **seedGames:** roda no startup do server (corinthians-2005-brasileirao).
- **seed:transfers, seed:transfer-rumors, seed:corinthians, etc.:** scripts manuais.

**Estratégia segura:**
- Seed automático no dev: apenas `teams` e `gameSets` (idempotente).
- Nunca rodar seed em produção.
- Scripts manuais (`npm run seed:transfers` etc.) só em dev.

---

## 4) Bugs e Erros Atuais

### 4.1 validateDOMNesting — `<a>` com `<button>` ou `<a>` dentro de `<a>`

**Status:** ⚠️ Corrigido em 2025-02-17.

**Análise:** O HTML não permite `<button>` dentro de `<a>` (nem `<a>` dentro de `<a>`). Vários arquivos usavam `<Link href="..."><Button>...</Button></Link>`, gerando `<a><button>` — inválido e causa warning validateDOMNesting.

**Arquivos afetados:** `lembra-desse-elenco.tsx`, `adivinhe-elenco.tsx`, `meu-time-elenco.tsx`, `dashboard.tsx`, `navbar.tsx` (Link + DropdownMenuItem — DropdownMenuItem renderiza div, OK).

**Correção:** Usar `Button asChild` com `Link` como filho: `<Button asChild><Link href="...">...</Link></Button>`. O Slot do Radix passa as props do Button para o Link, resultando em um único `<a>` com estilos de botão — HTML válido.

### 4.2 React keys — ElencoPreviewMini

**Status:** ✅ Código atual usa `key={stableKey}` com `stableKey = p.id ?? \`player-${index}\``. O schema `Player` tem `id` obrigatório. Se o warning aparecer, verificar se a API retorna players sem `id` ou com `id` duplicado.

### 4.3 Erros de hook "rendered more hooks"

**Análise:** Não encontrado no código. O `LastMatchRatingsCard` tem comentário "Early returns só DEPOIS de todos os hooks" — indica que há cuidado com ordem de hooks. Nenhum padrão óbvio de violação.

### 4.4 console.log em produção

- **routes.ts linha 1654:** `console.log('COMMENT REQUEST', ...)` já está condicionado a `NODE_ENV === 'development'`. ✅ OK.

---

## 5) Qualidade e Padrões

### 5.1 TypeScript

- Uso de `any` em alguns catch e req/res.
- Tipos do schema compartilhados via `@shared/schema`.

### 5.2 Validação

- Zod usado em `insertUserSchema`, `insertNewsSchema`, etc.
- Alguns endpoints não validam body com Zod (ex: profile PUT aceita qualquer body e usa só `name`, `email`).

### 5.3 Tratamento de erros

- Status codes coerentes na maioria das rotas.
- Error handler global em `server/index.ts` retorna `{ message }`.

### 5.4 Performance

- Possível N+1 em listagens (news com interactions, etc.). Não crítico para o tamanho atual.
- Sem memoização excessiva; React Query já cacheia.

---

## 6) Segurança

### 6.1 Cookies/Sessões

- `express-session` com `connect-pg-simple`.
- `SESSION_SECRET` obrigatório.
- Em produção: `trust proxy`, `secure`, `sameSite` configuráveis via env.

### 6.2 CORS

- Dev: localhost permitido.
- Prod: apenas origens em `CORS_ORIGIN` ou `CLIENT_URL`.

### 6.3 Validações

- Auth: `requireAuth`, `requireJournalist`, `requireAdmin` aplicados corretamente.
- Upload: multer com limite de tamanho e filtro de extensão.

### 6.4 Riscos

- **PUT /api/profile:** ✅ Já omite `password` na resposta (`const { password: _p, ...safeUser } = updatedUser`).
- **SQL injection:** Drizzle usa prepared statements — risco baixo.
- **XSS:** Conteúdo de posts/comentários renderizado. Verificar se há sanitização (ex: não usar `dangerouslySetInnerHTML` com input do usuário).
- **Rate limit:** Não implementado. Login/signup vulneráveis a brute force.

---

## 7) Deploy

### 7.1 Scripts

- `npm run dev` — kill:5000 + db:push + server (porta 5000)
- `npm run build` — vite build + esbuild do server
- `npm run start` — node dist/index.js
- `npm run db:push` — guard bloqueia em produção
- `npm run db:migrate` — migrations para produção

### 7.2 /api/health

- Retorna `{ ok, status, db, env }`.
- Usado por plataformas para health check.

### 7.3 Checklist final

- [ ] DATABASE_URL, NODE_ENV, SESSION_SECRET
- [ ] CORS_ORIGIN ou CLIENT_URL
- [ ] npm run build
- [ ] npm run start
- [ ] GET /api/health retorna 200

---

## 8) Plano de Ação

### P0 — Quebra app (obrigatório)

| # | Item | Status | Ação |
|---|------|--------|------|
| 1 | Rotas 404 | ✅ Nenhum 404 nas chamadas mapeadas | Nenhuma |
| 2 | Set não encontrado | Seed já roda no dev | Garantir seed idempotente; documentar fluxo |
| 3 | Página de jogo abre | Slug correto vindo da lista | Validar fluxo E2E |

### P1 — Bug grave

| # | Item | Arquivo | Correção |
|---|------|---------|----------|
| 1 | validateDOMNesting | Corrigido: Link+Button → Button asChild + Link | Aplicado |
| 2 | PUT /api/profile password | ✅ Já omitido | Nenhuma |
| 3 | console.log | Já condicionado a dev ✅ | Nenhuma |

### P2 — Warning/qualidade

| # | Item | Arquivo | Correção |
|---|------|---------|----------|
| 1 | Keys em listas | ElencoPreviewMini (se houver warning) | Garantir key estável única |
| 2 | Validação profile PUT | routes.ts | Validar name, email com Zod |

### P3 — Melhorias opcionais

- Rate limit em login/signup
- Paginação em listagens grandes
- Remover TODOs de componentes mock (team-header, club-history, etc.)

---

## 9) Resumo de Correções (FASE 2)

**Aplicadas em 2025-02-17:**
- Link+Button → Button asChild + Link (lembra-desse-elenco, adivinhe-elenco, meu-time-elenco, dashboard, landing)
- ElencoPreviewMini: key `${p.id}-${index}` para garantir unicidade

**Já corretas:**
- ForumTopicCard, MatchesPage: estrutura Link OK
- PUT /api/profile: password já omitido
- console.log: routes.ts e social-integration condicionados a dev

**Validação:** `npm run build` ✅ | Ver `docs/AUDIT_CORRECTIONS_APPLIED.md`

---

## 10) Checagem estática (FASE 0)

### TODOs no código
- `team-header.tsx`, `club-history.tsx`, `achievements.tsx`, `social-integration.tsx`: TODOs para dados mock/futuro (não críticos)
- `league-table.tsx`: TODO para histórico de posição

### console.log
- `news-card.tsx`: condicionado a `import.meta.env.DEV` ✅
- `social-integration.tsx`: `console.log('Comment submitted')` — remover em prod ou condicionar
- `lineupOrder.test.ts`: OK (teste)

### Code smells
- Nenhuma duplicação perigosa identificada
- `games.seed.ts`: idempotente, não duplica dados

---

## 11) O que NÃO foi alterado (confiança)

- Layout/estética global
- Nomes de rotas/API
- Features existentes (Meu Time, Vai e Vem, Jogos, Painel Jornalista, Feed)
- Autenticação/sessão
- Dependências (nenhuma lib nova)
- Fluxo de deploy e guard de db:push

---

## 12) Instruções de teste (validação final)

1. `npm run dev` — deve subir sem erros
2. Abrir no browser:
   - `/meu-time` — overview carrega
   - `/vai-e-vem` — rumores carregam
   - `/jogos` — lista de jogos
   - Clicar em "Lembra desse elenco?" → `/jogos/lembra-desse-elenco` → Corinthians 2005 → jogo abre
   - `/jornalista` — painel (se jornalista)
3. Console sem warnings críticos (keys, validateDOMNesting)
4. `npm run build` — sucesso
5. `npm run start` + `GET http://localhost:5000/api/health` — retorna 200

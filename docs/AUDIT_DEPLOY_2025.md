# Auditoria de Deploy - FUTTWITTER (Fev 2025)

## A) RELATÓRIO INICIAL (sem alterações)

### Stack

| Componente | Tecnologia |
|------------|------------|
| Frontend | React 18 + Vite 5 + TypeScript |
| Backend | Node.js + Express |
| DB | PostgreSQL (Neon) via Drizzle ORM |
| Estilo | Tailwind CSS, shadcn/ui |
| Roteamento | Wouter |
| Estado | TanStack Query |

**Nota:** O README menciona Next.js 14, mas o projeto usa **Vite + Express**. README desatualizado.

### Comandos package.json

| Script | Comportamento |
|--------|---------------|
| `dev` | kill:5000 → db:push → server (PORT=5000, NODE_ENV=development) |
| `dev:server` | db:push → server (PORT=5000) |
| `dev:clean` | kill:5000 → dev:server |
| `kill:5000` | PowerShell: mata processo na porta 5000 (Windows) |
| `build` | vite build → esbuild server → dist/ |
| `start` | NODE_ENV=production node dist/index.js |
| `db:push` | drizzle-kit push |
| `db:prepare` | drizzle-kit push (alias) |
| `db:migrate` | run-migrations.ts (SQL manual) |

### Arquitetura client/server

- **Monolito:** Um único processo Express serve API + client.
- **DEV:** Vite middleware + HMR; client em `client/`; API em `/api/*`.
- **PROD:** `dist/public/` (Vite build) + `dist/index.js` (server); fallback SPA em `*`.
- **API:** Client usa `getApiUrl()` → `VITE_API_URL` ou path relativo (same-origin).

### Rotas /api

- Proxy Vite (dev): `/api` → `http://127.0.0.1:5000` (hardcoded no vite.config).
- Client: `VITE_API_URL` vazio = same-origin (OK para deploy fullstack).
- Rotas registradas em `server/routes.ts` (auth, news, teams, matches, transfers, games, etc.).

### Env

- `.env.example` existe com variáveis documentadas.
- Obrigatórias: `DATABASE_URL`, `SESSION_SECRET`.
- Opcionais: `PORT`, `NODE_ENV`, `CORS_ORIGIN`, `ADMIN_EMAILS`, etc.

---

### O que está OK

1. **Porta:** Server usa `process.env.PORT || '5000'` (server/index.ts).
2. **Host:** PROD usa `0.0.0.0`, DEV usa `127.0.0.1`.
3. **Trust proxy:** Configurado em produção.
4. **CORS:** Configurável via `CORS_ORIGIN`; dev permite localhost.
5. **Cookies:** `secure` = true em prod; `sameSite` configurável.
6. **Build:** Vite → dist/public; esbuild → dist/index.js.
7. **SPA fallback:** `serveStatic` usa `res.sendFile(index.html)` para `*`.
8. **kill:5000:** Script PowerShell existe e funciona no Windows.
9. **Migrations:** Existe `run-migrations.ts` com SQL manual (0004–0012).

---

### Riscos e problemas

| # | Problema | Local | Risco |
|---|----------|-------|-------|
| 1 | **db:push em dev** | `dev` e `dev:server` rodam `db:push` antes do server | Se alguém rodar `dev` com DATABASE_URL de PROD, pode alterar schema em produção |
| 2 | **start sem PORT** | `start` não define PORT | Depende de plataforma injetar; OK no Railway, mas local pode falhar |
| 3 | **DEPLOYMENT_RAILWAY.md** | Recomenda `db:prepare` (push) em PROD | Push em prod é arriscado; migrations são mais seguros |
| 4 | **Sem /api/health** | Nenhum endpoint de health | Plataformas não conseguem verificar se o app está vivo |
| 5 | **Logs de boot** | Apenas "serving on host:port" | Falta info de env, DB, etc. |
| 6 | **Vite proxy 5000** | vite.config proxy target fixo | Se backend rodar em outra porta, proxy quebra (só afeta dev com client separado) |
| 7 | **README desatualizado** | Menciona Next.js | Confusão para novos devs |

---

### Não encontrado (baixo risco)

- PORT hardcoded em 5000: apenas em scripts de dev (intencional).
- NODE_ENV assumido errado: scripts usam cross-env corretamente.
- Warnings React (key, `<a>` dentro de `<a>`): não auditado em profundidade (REGRA #1: não mexer em UI).

---

## Alterações realizadas (pós-auditoria)

Ver `docs/DEPLOY_SUMMARY.md` para o resumo completo.

# FUTTWITTER — Checklist Pré-Deploy (Railway + Neon)

## Variáveis de ambiente (Railway + Neon)

### Obrigatórias (produção)

- **`DATABASE_URL`**: connection string do Postgres (Neon ou Railway Postgres).  
  Ex: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
- **`NODE_ENV`**: deve ser `production`.
- **`SESSION_SECRET`**: secret do `express-session` (também usado para validar a sessão no WebSocket `/ws/notifications`).

### Recomendadas (produção)

- **`CORS_ORIGIN`**: lista separada por vírgula de origens permitidas (quando frontend estiver em origem diferente).  
  Ex: `https://futtwitter-production.up.railway.app,https://www.seudominio.com`
- **`CLIENT_URL`**: fallback para CORS quando `CORS_ORIGIN` não estiver setado (o backend usa `CORS_ORIGIN ?? CLIENT_URL`).  
  Ex: `https://www.seudominio.com`
- **`ADMIN_EMAILS`**: fallback de admin por email (separado por vírgula).  
  Ex: `admin@futtwitter.dev,ops@seudominio.com`
- **Cookies (se frontend e backend forem cross-site / domínios diferentes)**:
  - **`COOKIE_SAMESITE`**: `none`
  - **`COOKIE_SECURE`**: `true` (obrigatório quando `SameSite=None`)
  - **`COOKIE_DOMAIN`**: opcional (só se você precisa compartilhar cookie entre subdomínios)

### Observações importantes (Railway)

- **`PORT`**: o Railway injeta automaticamente. O código já usa `process.env.PORT` com fallback `5000` (`server/index.ts`).

---

## Comandos para testar local

### Setup

```bash
npm install
```

### Banco (Drizzle)

```bash
npm run db:push
```

### Rodar tudo (client + server)

```bash
npm run dev:all
```

### Rodar só backend (API + static em dev via Vite middleware)

```bash
npm run dev:server
```

---

## 5 testes manuais (pré-deploy)

### 1) Login

- Abrir o app
- Fazer login com um usuário existente
- Confirmar que a sessão “cola” (recarregar a página e continuar logado)

### 2) `/api/auth/me`

- Com usuário logado, chamar `GET /api/auth/me`
- Esperado: JSON com `id`, `email`, `userType` e flags (`isAdmin`, `isJournalist`)

### 3) Jornalista postar

- Logar como `JOURNALIST` com status `APPROVED`
- Criar notícia via UI (ou `POST /api/news`)
- Esperado: **201** e notícia aparece no feed (via `GET /api/news`)

### 4) Admin aprovar

- Logar como admin (via `userType=ADMIN` ou email em `ADMIN_EMAILS`)
- Usar `PATCH /api/admin/journalists/:userId` com `{"action":"approve"}`
- Esperado: resposta `{ message: "Jornalista aprovado" }` e `GET /api/auth/me` do usuário retorna `isJournalist: true`

### 5) Meu-time carregar

- Logar com usuário que tem `teamId` salvo
- Abrir a tela “Meu Time”
- Esperado: request autenticado em `GET /api/teams/:id/extended` com dados de `team`, `players`, `matches`


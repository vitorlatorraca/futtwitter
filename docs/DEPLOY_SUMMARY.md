# Resumo de Deploy - FUTTWITTER

## 1. Checklist antes de publicar

- [ ] `.env` de produção configurado (DATABASE_URL, SESSION_SECRET)
- [ ] `NODE_ENV=production` definido na plataforma
- [ ] Backup do banco no Neon antes de migrations
- [ ] Migrations aplicadas (`npm run db:migrate`) se houver mudança de schema
- [ ] Build local testado: `npm run build && npm run start`
- [ ] Health check responde: `GET /api/health` retorna `{ ok: true }`
- [ ] CORS_ORIGIN configurado se frontend em origem diferente

---

## 2. Comandos exatos

### Rodar DEV

```bash
npm install
npm run dev
```

Abre em http://localhost:5000. Se a porta estiver em uso:

```bash
npm run kill:5000
npm run dev
# ou
npm run dev:clean
```

### Rodar PROD local (simular)

```bash
npm run build
npm run start
```

Defina `PORT` e `NODE_ENV=production` no `.env` ou no terminal:
- **PowerShell:** `$env:PORT="5001"; $env:NODE_ENV="production"; npm run start`
- **Bash:** `PORT=5001 NODE_ENV=production npm run start`

Abre em http://localhost:5001 (ou a porta definida).

### Publicar em PROD (passo a passo)

1. **Backup no Neon** (console.neon.tech)
2. **Migrations** (se schema mudou):
   ```bash
   npm run db:migrate
   ```
3. **Deploy** (Railway/Render/etc.):
   - Build: `npm run build`
   - Start: `npm run start`
   - Plataforma injeta `PORT` e `NODE_ENV=production`

---

## 3. Resumo técnico

### Como o app funciona

- **Monolito:** Um processo Express serve API + client.
- **DEV:** Vite middleware + HMR; client em `client/`; API em `/api/*`.
- **PROD:** `dist/public/` (Vite) + `dist/index.js` (server); SPA fallback em `*`.

### Banco de dados

- **ORM:** Drizzle
- **Provedor:** Neon (PostgreSQL)
- **Schema:** `shared/schema.ts`
- **Migrations:** `migrations/*.sql` + `npm run db:migrate`
- **DEV:** `npm run db:push` (bloqueado em NODE_ENV=production)

### Rotas e serviços

- **Rotas:** `server/routes.ts` (auth, teams, news, transfers, games, etc.)
- **Storage:** `server/storage.ts`
- **DB:** `server/db.ts` (Neon Pool + Drizzle)
- **Health:** `GET /api/health` (status + DB)

### Mudanças feitas

| Arquivo | Mudança | Motivo |
|---------|---------|--------|
| `server/index.ts` | PORT obrigatório em prod; logs de boot (env, DB) | Evitar deploy sem PORT; diagnóstico |
| `server/routes.ts` | `GET /api/health` | Healthcheck para plataformas |
| `server/scripts/db-push-guard.ts` | Novo script | Bloquear db:push em produção |
| `package.json` | db:push/db:prepare → guard | Segurança |
| `docs/DB_MIGRATIONS.md` | Novo doc | Fluxo seguro de migrations |
| `docs/DEPLOYMENT_RAILWAY.md` | Migrations em vez de push; PORT opcional | Segurança e clareza |
| `docs/DEPLOY_FLOW.md` | Novo doc | Branches main/develop + preview |
| `docs/AUDIT_DEPLOY_2025.md` | Auditoria inicial | Documentação |

---

## 4. NÃO MEXI / NÃO ALTEREI

- **UI/estética:** Nenhuma alteração em componentes, estilos ou layout
- **Funcionalidades:** Meu Time, Vai e Vem, Jogos, Painel Jornalista — intactas
- **Rotas de API existentes:** Nenhuma alteração
- **Schema do banco:** Nenhuma alteração
- **Autenticação/sessões:** Configuração existente mantida
- **CORS:** Já estava correto; não alterado

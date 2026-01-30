## Objetivo
Validar (em DEV) que qualquer notícia publicada por um jornalista `APPROVED` aparece:

- No **feed público** (`GET /api/news`) mesmo **sem login**
- No feed filtrado por time (`GET /api/news?teamId=<id>`)
- Para um usuário **FÃ** com `teamId` correspondente (API + UI)

## Pré-requisitos
- `.env` configurado com `DATABASE_URL` e `SESSION_SECRET`
- Banco com `teams.id = "corinthians"` (seed já aplicado)
- Servidor rodando em DEV

## Como rodar (automatizado)
Em um terminal (PowerShell):

```bash
npm run dev:server
```

Em outro terminal:

```bash
npm run dev:verify:news-feed
```

### O que o script faz
O script `server/dev-verify-news-feed.ts`:

1. Cria um usuário novo (via `POST /api/auth/signup`)
2. Aprova esse usuário como jornalista (`APPROVED`) **direto no DB** (DEV-only)
3. Faz login como jornalista (via `POST /api/auth/login`)
4. Publica uma notícia com `teamId=corinthians` (via `POST /api/news`)
5. Confirma via SQL que o registro existe e está publicável
6. Confirma que `GET /api/news` (público, sem login) retorna a notícia
7. Confirma que `GET /api/news?teamId=corinthians` retorna a notícia
8. Cria um FÃ com `teamId=corinthians` e confirma que ele vê a notícia no feed (API)

## Como validar no UI (manual, determinístico)
Depois do script passar:

- **Dashboard / Feed**:
  - Abra `/dashboard`
  - Em **Todos**, a notícia deve aparecer
  - Em **Meu Time**, a notícia deve aparecer (se o usuário estiver logado com `teamId=corinthians`)

- **Meu Time**:
  - Abra `/meu-time`
  - Vá em **Social > Discussões** e confirme que a notícia aparece


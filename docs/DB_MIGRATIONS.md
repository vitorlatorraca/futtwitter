# Banco de Dados: Migrations e Segurança

## Regras

- **DEV:** Use `npm run db:push` para sincronizar schema localmente (rápido, iterativo).
- **PROD:** `db:push` é **bloqueado** quando `NODE_ENV=production`. Use migrations.

## Fluxo seguro para PROD

### 1. Backup no Neon (antes de qualquer alteração)

1. Acesse [Neon Console](https://console.neon.tech)
2. Selecione o projeto
3. **Backup:** Use "Restore" ou export via `pg_dump` se disponível
4. Ou: crie um branch do banco no Neon para rollback rápido

### 2. Aplicar migrations em produção

```bash
# Com DATABASE_URL do Neon de produção no .env (ou variável de ambiente)
NODE_ENV=production npm run db:migrate
```

Ou via Railway CLI / terminal do serviço:

```bash
npm run db:migrate
```

O script `run-migrations.ts` executa os arquivos SQL em `migrations/` na ordem.

### 3. Adicionar nova migration

1. Crie `migrations/0013_nome_da_mudanca.sql`
2. Adicione o arquivo à lista em `server/scripts/run-migrations.ts`
3. Teste localmente com banco de dev
4. Faça backup no Neon
5. Rode `npm run db:migrate` em produção

## Comandos

| Comando | Uso | Ambiente |
|---------|-----|----------|
| `npm run db:push` | Sincroniza schema a partir do código (Drizzle) | DEV apenas |
| `npm run db:migrate` | Executa migrations SQL manuais | DEV e PROD |
| `npm run db:seed` | Popula dados iniciais | DEV |

## Troubleshooting

- **"BLOCKED: db:push is not allowed in production"** — Use `db:migrate` em vez de `db:push`.
- **Migration falha com "relation already exists"** — A migration já foi aplicada. Adicione `IF NOT EXISTS` ou marque como aplicada.

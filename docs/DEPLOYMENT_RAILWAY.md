# Deploy do FUTTWITTER no Railway

Este guia fornece instruções passo a passo para fazer deploy do projeto FUTTWITTER no Railway com banco de dados PostgreSQL no Neon.

## Pré-requisitos

- Conta no [Railway](https://railway.app)
- Conta no [Neon](https://neon.tech) (ou outro provedor PostgreSQL)
- Git configurado
- Node.js 18+ instalado localmente (para testes)

## Passo 1: Criar Projeto no Railway

1. Acesse [Railway Dashboard](https://railway.app/dashboard)
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"** (recomendado) ou **"Empty Project"**
4. Se usar GitHub, selecione o repositório `FUTTWITTER`
5. Railway criará automaticamente um novo serviço

## Passo 2: Configurar Banco de Dados (Neon)

### 2.1 Criar Banco no Neon

1. Acesse [Neon Console](https://console.neon.tech)
2. Crie um novo projeto
3. Anote a **Connection String** (DATABASE_URL) que será algo como:
   ```
   postgresql://user:password@host.neon.tech/dbname?sslmode=require
   ```

### 2.2 Alternativa: Usar PostgreSQL do Railway

Se preferir usar o PostgreSQL do Railway:

1. No projeto Railway, clique em **"+ New"**
2. Selecione **"Database"** → **"Add PostgreSQL"**
3. Railway criará automaticamente um banco e injetará `DATABASE_URL` como variável de ambiente

## Passo 3: Configurar Variáveis de Ambiente no Railway

No projeto Railway, vá em **"Variables"** e adicione:

### Variáveis Obrigatórias

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
NODE_ENV=production
PORT=5000
SESSION_SECRET=seu-secret-super-seguro-aqui-mude-em-producao
```

### Variáveis Opcionais (mas recomendadas)

```env
# CORS: URL do frontend (se separado) ou do próprio Railway
# Exemplo: https://futtwitter-production.up.railway.app
# Ou múltiplas origens separadas por vírgula:
# CORS_ORIGIN=https://futtwitter-production.up.railway.app,https://www.futtwitter.com
CORS_ORIGIN=https://futtwitter-production.up.railway.app
```

**Nota:** Se o frontend e backend estiverem no mesmo domínio (deploy fullstack), você pode omitir `CORS_ORIGIN` ou deixá-lo vazio. O CORS permitirá localhost automaticamente em desenvolvimento.

## Passo 4: Preparar o Banco de Dados

### Opção A: Via Railway (Recomendado)

1. No projeto Railway, adicione um novo serviço ou use o terminal do serviço existente
2. Execute o comando de preparação do banco:

```bash
npm run db:prepare
```

Ou diretamente:

```bash
npx drizzle-kit push
```

### Opção B: Via Local (Desenvolvimento)

1. Configure `.env` local com a `DATABASE_URL` do Neon/Railway
2. Execute:

```bash
npm run db:prepare
```

## Passo 5: Configurar Build e Start no Railway

O Railway detecta automaticamente Node.js e executa:

- **Build Command:** `npm run build`
- **Start Command:** `npm start`

Certifique-se de que o `package.json` tenha os scripts corretos (já configurados):

```json
{
  "scripts": {
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "cross-env NODE_ENV=production node dist/index.js"
  }
}
```

## Passo 6: Deploy

1. Railway fará deploy automaticamente ao detectar push no GitHub (se conectado)
2. Ou clique em **"Deploy"** manualmente
3. Aguarde o build completar (pode levar 2-5 minutos na primeira vez)

## Passo 7: Verificar Deploy

1. Após o deploy, Railway fornecerá uma URL como: `https://futtwitter-production.up.railway.app`
2. Acesse a URL no navegador
3. Teste criar uma conta em `/signup`
4. Verifique se o usuário foi salvo no banco de dados

## Passo 8: Configurar Domínio Customizado (Opcional)

1. No projeto Railway, vá em **"Settings"** → **"Domains"**
2. Adicione seu domínio customizado
3. Configure DNS conforme instruções do Railway

## Troubleshooting

### Erro: "Could not find the build directory"

**Causa:** O build do frontend não foi executado ou falhou.

**Solução:**
1. Verifique os logs do build no Railway
2. Certifique-se de que `vite build` está executando corretamente
3. Verifique se o diretório `dist/public` existe após o build

### Erro: "DATABASE_URL must be set"

**Causa:** Variável de ambiente `DATABASE_URL` não está configurada.

**Solução:**
1. Vá em **"Variables"** no Railway
2. Adicione `DATABASE_URL` com a connection string do Neon/Railway
3. Faça redeploy

### Erro de CORS

**Causa:** Frontend tentando acessar backend de origem diferente sem CORS configurado.

**Solução:**
1. Configure `CORS_ORIGIN` no Railway com a URL do frontend
2. Se frontend e backend estão no mesmo domínio, você pode omitir `CORS_ORIGIN`

### Erro: "Port already in use" ou "EADDRINUSE"

**Causa:** Railway injeta `PORT` automaticamente, mas o código pode estar usando porta fixa.

**Solução:**
O código já está configurado para usar `process.env.PORT`. Verifique se não há hardcoded ports.

### Erro de Autenticação/Sessão

**Causa:** Cookies não estão sendo enviados corretamente devido a configuração de `secure` e `SameSite`.

**Solução:**
O código já configura cookies com `secure: process.env.NODE_ENV === 'production'`. Certifique-se de que:
- Está usando HTTPS (Railway fornece automaticamente)
- `SESSION_SECRET` está configurado
- Frontend está fazendo requisições com `credentials: 'include'` (já configurado)

### Logs e Debugging

1. Acesse **"Deployments"** no Railway
2. Clique no deployment mais recente
3. Veja os logs em tempo real
4. Procure por erros de build ou runtime

## Estrutura de Deploy

```
Railway Service
├── Build: npm run build
│   ├── Frontend: vite build → dist/public/
│   └── Backend: esbuild → dist/index.js
├── Start: npm start
│   └── Executa: node dist/index.js
└── Runtime
    ├── Escuta: process.env.PORT (Railway injeta)
    ├── Host: 0.0.0.0 (produção)
    ├── Serve static: dist/public/ (frontend)
    └── API: /api/* (backend)
```

## Variáveis de Ambiente Resumo

| Variável | Obrigatória | Descrição | Exemplo |
|----------|-------------|-----------|---------|
| `DATABASE_URL` | ✅ Sim | Connection string do PostgreSQL | `postgresql://user:pass@host/db` |
| `NODE_ENV` | ✅ Sim | Ambiente de execução | `production` |
| `PORT` | ✅ Sim | Porta do servidor (Railway injeta) | `5000` |
| `SESSION_SECRET` | ✅ Sim | Secret para sessões | `seu-secret-aqui` |
| `CORS_ORIGIN` | ⚠️ Opcional | Origem permitida para CORS | `https://app.example.com` |

## Comandos Úteis

### Local (Desenvolvimento)

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev:all

# Preparar banco de dados
npm run db:prepare

# Build local (teste)
npm run build
npm start
```

### Produção (Railway)

```bash
# Build e start são executados automaticamente pelo Railway
# Mas você pode testar localmente com:
npm run build
npm start
```

## Próximos Passos

1. ✅ Deploy no Railway
2. ✅ Banco de dados configurado
3. ✅ Testar criação de usuários
4. ⏭️ Configurar CI/CD (opcional)
5. ⏭️ Adicionar monitoramento (opcional)
6. ⏭️ Configurar backups do banco (Neon tem automático)

## Suporte

Se encontrar problemas:
1. Verifique os logs no Railway
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Teste localmente com as mesmas variáveis de ambiente
4. Verifique a documentação do [Railway](https://docs.railway.app) e [Neon](https://neon.tech/docs)

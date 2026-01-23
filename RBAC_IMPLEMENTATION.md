# Implementação RBAC - Controle de Acesso por Papel

## ✅ Resumo da Implementação

RBAC (Role-Based Access Control) foi implementado com sucesso no FUTTWITTER. Apenas usuários com papel `JOURNALIST` podem criar, editar e deletar publicações (news). Qualquer usuário autenticado pode ler posts e fazer comentários/reactions.

### Mudanças Realizadas

1. **Banco de Dados (seed.ts)**
   - ✅ Corrigido seed para usar campos corretos do schema `journalists`
   - ✅ Adicionada função `getNewsById` no storage para verificação de ownership

2. **Backend (routes.ts)**
   - ✅ Melhorado middleware `requireJournalist` para verificar:
     - Autenticação (401 se não autenticado)
     - Tipo de usuário na sessão (403 se não for JOURNALIST)
     - Existência do registro na tabela `journalists` (403 se não encontrado)
     - Status de aprovação (403 se não estiver APPROVED)
   - ✅ Adicionada rota `PATCH /api/news/:id` para editar notícias
   - ✅ Adicionada verificação de ownership nas rotas PATCH e DELETE (só pode editar/excluir próprias notícias)

3. **Frontend**
   - ✅ Já estava protegido:
     - Página `/jornalista` verifica `userType === 'JOURNALIST'`
     - Navbar só mostra link "Painel Jornalista" para journalists
     - Auth context já carrega `userType`

4. **Endpoint /api/auth/me**
   - ✅ Já retorna `userType` (confirmado)

## 📋 Endpoints Protegidos

### Rotas de News (Protegidas com `requireJournalist`)

- `POST /api/news` - Criar notícia (apenas JOURNALIST)
- `PATCH /api/news/:id` - Editar notícia (apenas JOURNALIST, apenas próprias notícias)
- `DELETE /api/news/:id` - Deletar notícia (apenas JOURNALIST, apenas próprias notícias)
- `GET /api/news/my-news` - Listar minhas notícias (apenas JOURNALIST)

### Rotas Públicas/Autenticadas

- `GET /api/news` - Listar todas as notícias (público, mas mostra interações se autenticado)
- `POST /api/news/:id/interaction` - Curtir/descurtir (qualquer usuário autenticado)

## 🚀 Comandos para Executar (PowerShell)

### 1. Instalar Dependências (se necessário)
```powershell
npm install
```

### 2. Aplicar Schema no Banco (Drizzle Push)
```powershell
npm run db:push
```

**Nota:** O schema já estava correto (não foi necessário adicionar coluna `userType` pois já existia). Este comando apenas garante que o schema está sincronizado.

### 3. Rodar Seed (criar usuário journalist de teste)
```powershell
npx tsx server/seed.ts
```

**Usuário journalist criado:**
- Email: `jornalista@brasileirao.com`
- Senha: `senha123`
- Status: `APPROVED`

**Usuário fan criado:**
- Email: `torcedor@brasileirao.com`
- Senha: `senha123`
- Tipo: `FAN`

### 4. Rodar Servidor de Desenvolvimento
```powershell
npm run dev:all
```

Ou separadamente:
```powershell
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

## 🧪 Checklist de Testes Manuais

### Teste 1: Usuário FAN (torcedor@brasileirao.com)

- [ ] **Login como FAN**
  - Login com `torcedor@brasileirao.com` / `senha123`
  - Deve fazer login com sucesso

- [ ] **Ver Posts**
  - Acessar `/dashboard`
  - Deve conseguir ver todas as notícias
  - Deve conseguir curtir/descurtir notícias

- [ ] **NÃO pode criar/editar/deletar**
  - Navbar NÃO deve mostrar link "Painel Jornalista"
  - Tentar acessar `/jornalista` diretamente
    - Deve mostrar mensagem "Você precisa ser um jornalista para acessar esta página"
  - Tentar criar post via API (curl abaixo)
    - Deve retornar 403

- [ ] **UI não mostra botão de criar**
  - Verificar que não há botão "Criar Post" visível

### Teste 2: Usuário JOURNALIST (jornalista@brasileirao.com)

- [ ] **Login como JOURNALIST**
  - Login com `jornalista@brasileirao.com` / `senha123`
  - Deve fazer login com sucesso

- [ ] **Ver Posts**
  - Acessar `/dashboard`
  - Deve conseguir ver todas as notícias
  - Deve conseguir curtir/descurtir notícias

- [ ] **Pode criar/editar/deletar**
  - Navbar DEVE mostrar link "Painel Jornalista"
  - Acessar `/jornalista`
    - Deve mostrar formulário de criação
  - Criar uma notícia
    - Deve criar com sucesso
    - Deve aparecer no feed
  - Editar uma notícia própria
    - Deve editar com sucesso
  - Deletar uma notícia própria
    - Deve deletar com sucesso

- [ ] **NÃO pode editar/deletar notícias de outros**
  - Tentar editar notícia de outro journalist (via API)
    - Deve retornar 403
  - Tentar deletar notícia de outro journalist (via API)
    - Deve retornar 403

### Teste 3: Usuário não autenticado

- [ ] **Ver Posts**
  - Acessar `/dashboard` sem login
  - Deve conseguir ver notícias (público)

- [ ] **NÃO pode criar/editar/deletar**
  - Tentar criar post via API
    - Deve retornar 401 (não autenticado)

## 🔧 Testes via cURL (PowerShell)

### Obter Cookie de Sessão (Login)

```powershell
# Login como FAN
$fanResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"torcedor@brasileirao.com","password":"senha123"}' -SessionVariable fanSession
$fanCookie = $fanSession.Cookies.GetCookies("http://localhost:5000") | Select-Object -First 1

# Login como JOURNALIST
$journalistResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"jornalista@brasileirao.com","password":"senha123"}' -SessionVariable journalistSession
$journalistCookie = $journalistSession.Cookies.GetCookies("http://localhost:5000") | Select-Object -First 1
```

### Teste 1: FAN tentando criar post (deve retornar 403)

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/news" -Method POST -ContentType "application/json" -Body '{"title":"Teste","content":"Conteúdo de teste","teamId":"flamengo","category":"NEWS"}' -WebSession $fanSession
```

**Resultado esperado:** Status 403 - "Acesso negado. Apenas jornalistas."

### Teste 2: JOURNALIST criando post (deve retornar 201)

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/news" -Method POST -ContentType "application/json" -Body '{"title":"Notícia de Teste","content":"Esta é uma notícia de teste criada via API","teamId":"flamengo","category":"NEWS"}' -WebSession $journalistSession
```

**Resultado esperado:** Status 201 com JSON da notícia criada

### Teste 3: Usuário não autenticado tentando criar post (deve retornar 401)

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/news" -Method POST -ContentType "application/json" -Body '{"title":"Teste","content":"Conteúdo","teamId":"flamengo","category":"NEWS"}'
```

**Resultado esperado:** Status 401 - "Não autenticado"

### Teste 4: JOURNALIST editando própria notícia

```powershell
# Primeiro, criar uma notícia e pegar o ID
$createResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/news" -Method POST -ContentType "application/json" -Body '{"title":"Notícia Original","content":"Conteúdo original","teamId":"flamengo","category":"NEWS"}' -WebSession $journalistSession
$newsId = ($createResponse.Content | ConvertFrom-Json).id

# Depois, editar
Invoke-WebRequest -Uri "http://localhost:5000/api/news/$newsId" -Method PATCH -ContentType "application/json" -Body '{"title":"Notícia Editada","content":"Conteúdo editado"}' -WebSession $journalistSession
```

**Resultado esperado:** Status 200 com JSON da notícia editada

### Teste 5: JOURNALIST tentando editar notícia de outro (deve retornar 403)

```powershell
# Usar ID de uma notícia criada por outro journalist
Invoke-WebRequest -Uri "http://localhost:5000/api/news/OUTRO_ID_AQUI" -Method PATCH -ContentType "application/json" -Body '{"title":"Tentativa de Edição"}' -WebSession $journalistSession
```

**Resultado esperado:** Status 403 - "Acesso negado. Você só pode editar suas próprias notícias."

## 📝 Commits Realizados

1. **feat(db): fix seed journalist fields and add getNewsById**
   - Corrigido seed para usar campos corretos do schema
   - Adicionada função `getNewsById` no storage

2. **feat(api): improve rbac middleware and protect news routes**
   - Melhorado middleware `requireJournalist`
   - Adicionada rota PATCH `/api/news/:id`
   - Adicionada verificação de ownership

## 🔍 Estrutura do Schema (Já Existente)

- `users.userType`: Enum `"FAN" | "JOURNALIST" | "ADMIN"` (default: "FAN")
- `journalists`: Tabela separada com:
  - `userId` (FK para users)
  - `organization`
  - `professionalId`
  - `status`: Enum `"PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED"` (default: "PENDING")
  - `verificationDate`

## ⚠️ Observações Importantes

1. **Enforcement no Backend**: Toda proteção está no backend. O frontend apenas esconde UI, mas não é a proteção real.

2. **Middleware requireJournalist**: Agora verifica:
   - Sessão autenticada
   - Tipo de usuário na sessão
   - Existência do registro na tabela `journalists`
   - Status de aprovação (deve ser "APPROVED")

3. **Ownership Verification**: Nas rotas PATCH e DELETE, verifica se a notícia pertence ao journalist logado.

4. **Schema Não Foi Modificado**: O schema já tinha tudo necessário. Apenas corrigimos o seed que estava usando campos incorretos.

## 👤 Admin e Jornalistas (Extensão)

### requireAdmin

- **Fonte**: `users.userType === 'ADMIN'` **ou** variável de ambiente `ADMIN_EMAILS`.
- **ADMIN_EMAILS**: lista de emails separados por vírgula (ex: `a@b.com,c@d.com`). Usado como fallback quando não há `userType` ADMIN no schema.
- Rotas admin usam `requireAuth` + `requireAdmin`.

### /api/auth/me (estendido)

Retorna também:

- `journalistStatus`: `"APPROVED"` | `"PENDING"` | `"REJECTED"` | `"SUSPENDED"` | `null` (tabela `journalists`)
- `isJournalist`: `true` somente se existir registro em `journalists` com `status === 'APPROVED'`
- `isAdmin`: `true` se `userType === 'ADMIN'` ou email em `ADMIN_EMAILS`

### Endpoints admin (admin-only)

- **GET /api/admin/users/search?q=**  
  Busca usuários por email ou nome. Retorna no máximo 10: `{ id, email, name, isJournalist, journalistStatus }`. Protegido por `requireAdmin`.

- **PATCH /api/admin/journalists/:userId**  
  Body: `{ action: "approve" | "reject" | "revoke" | "promote" }`
  - `approve`: cria/atualiza `journalists`, status `APPROVED`
  - `reject`: status `REJECTED`
  - `revoke`: remove registro de jornalista, `userType` → FAN (exceto se ADMIN)
  - `promote`: cria `journalists` com status `PENDING`, `userType` → JOURNALIST (exceto se ADMIN)
  - Não é permitido self-demotion de admin (revogar a si mesmo quando admin).
  - Não se altera `userType` para ADMIN por essa rota.

### Variáveis de ambiente

- **ADMIN_EMAILS** (opcional): emails separados por vírgula para considerar como admin quando `userType` não for ADMIN.
- **SESSION_SECRET**: já existente para sessão.

## ✅ Status Final

- ✅ RBAC implementado no backend
- ✅ Middleware robusto com verificação de DB
- ✅ Rotas protegidas (POST, PATCH, DELETE)
- ✅ Verificação de ownership
- ✅ Frontend já estava protegido
- ✅ Seed corrigido
- ✅ Commits atômicos criados

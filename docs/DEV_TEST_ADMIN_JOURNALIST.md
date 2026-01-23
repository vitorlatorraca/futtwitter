# Guia de Teste DEV - Admin e Jornalista

Este documento contém os passos para testar o fluxo completo de administração e jornalismo no sistema.

## Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL (Neon) configurado
- Variável `DATABASE_URL` configurada no `.env`

## Passo 1: Setup Inicial

Execute os seguintes comandos no PowerShell:

```powershell
# Instalar dependências
npm install

# Aplicar schema do banco (se usar drizzle-kit)
# npm run db:push

# Rodar seed para criar usuários DEV
npx tsx server/seed.ts
```

**Saída esperada:**
```
Starting database seed...
✓ Seeded X teams
✓ Created admin user (email: admin@futtwitter.dev, password: Admin@123)
✓ Created journalist user (email: maurinho@betting.dev, password: Senha@123, status: PENDING)
✓ Created fan user (email: torcedor@brasileirao.com, password: senha123)
⚠ Maurinho Betting is not APPROVED yet. Post will be created after approval via admin endpoint.
✅ Database seeded successfully!
```

## Passo 2: Iniciar Servidor

Em um terminal separado:

```powershell
npm run dev:all
# ou
npm run dev
```

O servidor deve iniciar em `http://localhost:3000` (Next.js) e `http://localhost:5000` (API).

## Passo 3: Testes de API via PowerShell

### 3.1. Login como Admin

```powershell
# Criar sessão
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# Login como admin
$loginBody = @{
    email = "admin@futtwitter.dev"
    password = "Admin@123"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody `
    -WebSession $session `
    -SessionVariable session

$loginResponse.Content | ConvertFrom-Json
```

**Resultado esperado:**
```json
{
  "id": "...",
  "name": "FUTTWITTER Admin",
  "email": "admin@futtwitter.dev",
  "userType": "ADMIN"
}
```

### 3.2. Verificar perfil do admin

```powershell
$meResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/me" `
    -Method GET `
    -WebSession $session

$meResponse.Content | ConvertFrom-Json
```

**Resultado esperado:**
```json
{
  "id": "...",
  "name": "FUTTWITTER Admin",
  "email": "admin@futtwitter.dev",
  "userType": "ADMIN",
  "isAdmin": true,
  "isJournalist": false,
  "journalistStatus": null
}
```

### 3.3. Buscar usuário Maurinho

```powershell
$searchResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/admin/users/search?q=maurinho" `
    -Method GET `
    -WebSession $session

$searchResponse.Content | ConvertFrom-Json
```

**Resultado esperado:**
```json
[
  {
    "id": "...",
    "email": "maurinho@betting.dev",
    "name": "Maurinho Betting",
    "journalistStatus": "PENDING",
    "isJournalist": false
  }
]
```

### 3.4. Promover Maurinho a jornalista (PENDING)

```powershell
$promoteBody = @{
    action = "promote"
} | ConvertTo-Json

$promoteResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/admin/journalists/$($maurinhoId)" `
    -Method PATCH `
    -ContentType "application/json" `
    -Body $promoteBody `
    -WebSession $session

$promoteResponse.Content | ConvertFrom-Json
```

**Nota:** Substitua `$maurinhoId` pelo ID retornado na busca anterior.

**Resultado esperado:**
```json
{
  "message": "Usuário promovido a jornalista (pendente)"
}
```

### 3.5. Aprovar Maurinho (APPROVED)

```powershell
$approveBody = @{
    action = "approve"
} | ConvertTo-Json

$approveResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/admin/journalists/$($maurinhoId)" `
    -Method PATCH `
    -ContentType "application/json" `
    -Body $approveBody `
    -WebSession $session

$approveResponse.Content | ConvertFrom-Json
```

**Resultado esperado:**
```json
{
  "message": "Jornalista aprovado"
}
```

### 3.6. Criar post do Corinthians (após aprovação)

Primeiro, precisamos obter o `journalistId` de Maurinho. Vamos fazer login como Maurinho:

```powershell
# Nova sessão para Maurinho
$maurinhoSession = New-Object Microsoft.PowerShell.Commands.WebRequestSession

$maurinhoLoginBody = @{
    email = "maurinho@betting.dev"
    password = "Senha@123"
} | ConvertTo-Json

$maurinhoLoginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $maurinhoLoginBody `
    -WebSession $maurinhoSession `
    -SessionVariable maurinhoSession

# Verificar perfil
$maurinhoMe = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/me" `
    -Method GET `
    -WebSession $maurinhoSession

$maurinhoData = $maurinhoMe.Content | ConvertFrom-Json
# $maurinhoData.isJournalist deve ser true
```

Agora criar o post:

```powershell
$postBody = @{
    teamId = "corinthians"
    title = "Corinthians: análise tática do momento"
    content = "O Corinthians vive um momento importante na temporada, com o técnico buscando consolidar um estilo de jogo que combine solidez defensiva e eficiência ofensiva. A equipe tem mostrado evolução tática em campo, com os jogadores demonstrando maior entrosamento e compreensão do sistema de jogo proposto."
    imageUrl = "https://picsum.photos/1200/630?random=corinthians"
    category = "ANALYSIS"
} | ConvertTo-Json

$postResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/news" `
    -Method POST `
    -ContentType "application/json" `
    -Body $postBody `
    -WebSession $maurinhoSession

$postResponse.Content | ConvertFrom-Json
```

**Resultado esperado:** Status 201 com o post criado.

### 3.7. Teste de segurança: Tentar postar como FAN (deve falhar com 403)

```powershell
# Login como FAN
$fanSession = New-Object Microsoft.PowerShell.Commands.WebRequestSession

$fanLoginBody = @{
    email = "torcedor@brasileirao.com"
    password = "senha123"
} | ConvertTo-Json

$fanLoginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $fanLoginBody `
    -WebSession $fanSession `
    -SessionVariable fanSession

# Tentar criar post (deve falhar)
try {
    $fanPostResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/news" `
        -Method POST `
        -ContentType "application/json" `
        -Body $postBody `
        -WebSession $fanSession `
        -ErrorAction Stop
} catch {
    $_.Exception.Response.StatusCode.value__
    # Deve retornar 403
}
```

**Resultado esperado:** Status 403 (Forbidden)

### 3.8. Teste de segurança: Tentar postar como Maurinho PENDING (deve falhar com 403)

Para testar isso, você precisaria:
1. Revogar o status de Maurinho (via admin)
2. Tentar postar (deve falhar)
3. Reaprovar (via admin)

Ou criar um novo usuário jornalista PENDING e tentar postar.

### 3.9. Verificar post no feed do Corinthians

```powershell
$feedResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/news?teamId=corinthians" `
    -Method GET

$feedResponse.Content | ConvertFrom-Json
```

**Resultado esperado:** Array com o post criado por Maurinho.

### 3.10. Verificar endpoint extended do Corinthians

```powershell
$extendedResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/teams/corinthians/extended" `
    -Method GET `
    -WebSession $maurinhoSession

$extendedResponse.Content | ConvertFrom-Json
```

**Resultado esperado:** Dados do time incluindo notícias.

## Passo 4: Testes de UI

### 4.1. Login como Admin

1. Acesse `http://localhost:3000`
2. Faça login com:
   - Email: `admin@futtwitter.dev`
   - Senha: `Admin@123`
3. Verifique que aparece uma aba/área "Admin" no perfil

### 4.2. Aprovar Maurinho via UI

1. Na área Admin, busque por "Maurinho"
2. Clique em "Aprovar" ou "Approve"
3. Verifique que o status muda para "Journalist" (badge verde)

### 4.3. Login como Maurinho

1. Faça logout do admin
2. Faça login com:
   - Email: `maurinho@betting.dev`
   - Senha: `Senha@123`
3. Verifique que consegue acessar a área de criação de posts

### 4.4. Criar post via UI

1. Como Maurinho, crie uma nova publicação
2. Selecione o time "Corinthians"
3. Adicione título, conteúdo e imagem
4. Publique
5. Verifique que o post aparece no feed

### 4.5. Verificar post no time Corinthians

1. Navegue até a página do Corinthians
2. Verifique que o post criado aparece na lista de notícias
3. Verifique que a imagem está carregando corretamente

## Checklist de Validação

- [ ] Admin consegue fazer login
- [ ] Admin vê aba/área Admin no perfil
- [ ] Admin consegue buscar usuários
- [ ] Admin consegue promover usuário a jornalista (PENDING)
- [ ] Admin consegue aprovar jornalista (APPROVED)
- [ ] FAN não consegue criar post (403)
- [ ] Jornalista PENDING não consegue criar post (403)
- [ ] Jornalista APPROVED consegue criar post (201)
- [ ] Post aparece no feed do Corinthians
- [ ] Post aparece na página extended do Corinthians
- [ ] Nenhum endpoint admin é acessível sem autenticação admin

## Troubleshooting

### Erro: "Não autenticado" (401)

- Verifique se fez login corretamente
- Verifique se a sessão está sendo mantida (cookies)
- Tente fazer logout e login novamente

### Erro: "Acesso negado" (403)

- Verifique se o usuário tem as permissões corretas
- Para admin: verifique `userType === 'ADMIN'` ou email em `ADMIN_EMAILS`
- Para jornalista: verifique `userType === 'JOURNALIST'` e `status === 'APPROVED'`

### Erro: "Usuário não encontrado" (404)

- Verifique se o seed foi executado corretamente
- Verifique se o ID do usuário está correto
- Execute o seed novamente: `npx tsx server/seed.ts`

### Post não aparece no feed

- Verifique se o `teamId` está correto ("corinthians")
- Verifique se o post está publicado (`isPublished: true`)
- Verifique se o jornalista está APPROVED
- Verifique se o `journalistId` está correto no post

### Seed não cria post automaticamente

- Isso é esperado! O post só é criado se o jornalista estiver APPROVED
- Aprove o jornalista via endpoint admin primeiro
- Depois execute o seed novamente OU crie o post manualmente via API/UI

## Credenciais DEV (apenas para desenvolvimento)

**Admin:**
- Email: `admin@futtwitter.dev`
- Senha: `Admin@123`

**Jornalista (Maurinho Betting):**
- Email: `maurinho@betting.dev`
- Senha: `Senha@123`
- Status inicial: PENDING (deve ser aprovado via admin)

**FAN (para testes):**
- Email: `torcedor@brasileirao.com`
- Senha: `senha123`

**⚠️ IMPORTANTE:** Estas credenciais são apenas para desenvolvimento. Nunca use em produção!

# Banco de Dados "Vai e Vem" — Transfer Rumors (Neon/Postgres)

Documentação do schema de rumores/negociações com avaliação dupla (torcida vendendo vs comprando).

## Migrations criadas

| Arquivo | Descrição |
|---------|-----------|
| `0011_vaievem_transfer_rumors.sql` | Cria `transfer_rumors`, `transfer_rumor_votes`, `transfer_rumor_comments` |

## Tabelas e colunas

### `transfer_rumors`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | varchar(36) PK | UUID |
| player_id | varchar(36) FK → players.id | Jogador |
| from_team_id | varchar(36) FK → teams.id | Time vendedor |
| to_team_id | varchar(36) FK → teams.id | Time comprador |
| status | transfer_rumor_status | RUMOR, NEGOTIATING, DONE, CANCELLED |
| fee_amount | numeric | Valor (opcional) |
| fee_currency | text | BRL, EUR (default BRL) |
| contract_until | date | Contrato até |
| source_url | text | URL da fonte |
| source_name | text | Ex: GE, UOL, Fabrizio |
| created_by_user_id | varchar(36) FK → users.id | Jornalista autor |
| created_at | timestamp | |
| updated_at | timestamp | |

**Constraint:** `from_team_id != to_team_id`

### `transfer_rumor_votes`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | varchar(36) PK | |
| rumor_id | varchar(36) FK → transfer_rumors.id CASCADE | |
| user_id | varchar(36) FK → users.id CASCADE | |
| side | transfer_vote_side | SELLING \| BUYING |
| vote | transfer_vote_value | LIKE \| DISLIKE |
| created_at | timestamp | |

**Unique:** (rumor_id, user_id, side) — 1 voto por lado

### `transfer_rumor_comments`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | varchar(36) PK | |
| rumor_id | varchar(36) FK → transfer_rumors.id CASCADE | |
| user_id | varchar(36) FK → users.id CASCADE | |
| content | text | |
| created_at | timestamp | |
| updated_at | timestamp | |
| is_deleted | boolean | default false |

## Enums

- **transfer_rumor_status:** RUMOR, NEGOTIATING, DONE, CANCELLED
- **transfer_vote_side:** SELLING, BUYING (já existente)
- **transfer_vote_value:** LIKE, DISLIKE (já existente)

## Seeds

```bash
npm run seed:transfer-rumors
# ou
npx tsx server/scripts/seed-transfer-rumors-demo.ts
```

**Pré-requisitos:** Times e jogadores (ex: `npm run seed:corinthians`).

O seed cria:
- 10 rumores envolvendo Corinthians (como comprador e vendedor)
- 3 jornalistas (users com role JOURNALIST)
- 20–40 votos (SELLING/BUYING respeitando teamId)
- 10–30 comentários

## API Endpoints

### Listar rumores

```
GET /api/transfer-rumors?status=RUMOR&q=rodrigo&teamId=corinthians
```

**Query params:**
- `status` — RUMOR | NEGOTIATING | DONE | CANCELLED
- `q` — busca por nome do jogador
- `teamId` — filtrar por time (from OU to)

**Resposta:** Array com rumor, author, player, fromTeam, toTeam, selling (likes/dislikes/userVote), buying (likes/dislikes/userVote).

### Buscar rumor por ID

```
GET /api/transfer-rumors/:id
```

### Criar rumor (jornalista)

```
POST /api/transfer-rumors
Body: { playerId, fromTeamId, toTeamId, status?, feeAmount?, feeCurrency?, sourceUrl?, sourceName? }
```

### Votar

```
POST /api/transfer-rumors/:id/vote
Body: { side: "SELLING"|"BUYING", vote: "LIKE"|"DISLIKE"|"CLEAR" }
```

**Regras:**
- SELLING: apenas se `user.teamId == fromTeamId`
- BUYING: apenas se `user.teamId == toTeamId`

### Comentários

```
GET /api/transfer-rumors/:id/comments
POST /api/transfer-rumors/:id/comments
Body: { content: string }
```

## Consultas SQL úteis

### 6.1 Listar rumores com agregados

```sql
SELECT
  r.id,
  r.status,
  r.created_at,
  p.name AS player_name,
  p.photo_url AS player_photo,
  ft.name AS from_team,
  tt.name AS to_team,
  u.name AS author_name,
  u.avatar_url AS author_avatar,
  (SELECT count(*) FROM transfer_rumor_votes v WHERE v.rumor_id = r.id AND v.side = 'SELLING' AND v.vote = 'LIKE') AS selling_likes,
  (SELECT count(*) FROM transfer_rumor_votes v WHERE v.rumor_id = r.id AND v.side = 'SELLING' AND v.vote = 'DISLIKE') AS selling_dislikes,
  (SELECT count(*) FROM transfer_rumor_votes v WHERE v.rumor_id = r.id AND v.side = 'BUYING' AND v.vote = 'LIKE') AS buying_likes,
  (SELECT count(*) FROM transfer_rumor_votes v WHERE v.rumor_id = r.id AND v.side = 'BUYING' AND v.vote = 'DISLIKE') AS buying_dislikes
FROM transfer_rumors r
JOIN players p ON p.id = r.player_id
JOIN teams ft ON ft.id = r.from_team_id
JOIN teams tt ON tt.id = r.to_team_id
JOIN users u ON u.id = r.created_by_user_id
ORDER BY r.created_at DESC;
```

### 6.2 Buscar por jogador

```sql
SELECT r.*, p.name
FROM transfer_rumors r
JOIN players p ON p.id = r.player_id
WHERE p.name ILIKE '%rodrigo%';
```

### 6.3 Filtrar por teamId (Meu Time)

```sql
SELECT r.*
FROM transfer_rumors r
WHERE r.from_team_id = 'corinthians' OR r.to_team_id = 'corinthians'
ORDER BY r.created_at DESC;
```

## Rodar migrations

```bash
npm run db:migrate
# ou
npx tsx server/scripts/run-migrations.ts
```

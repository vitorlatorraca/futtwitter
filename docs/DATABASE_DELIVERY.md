# Entrega: Camada de Banco de Dados FUTTWITTER

## 1. Tabelas Criadas/Existentes

O schema já possuía a maioria das tabelas. Foram adicionadas colunas opcionais em `players`:

| Tabela | Descrição |
|-------|-----------|
| `countries` | Países (id, name, code, flagEmoji) |
| `teams` | Times (id, name, shortName, countryId, foundedYear, stadiumName, crestUrl, etc.) |
| `competitions` | Competições (id, name, countryId, level, logoUrl) |
| `seasons` | Temporadas (id, competitionId, year, startDate, endDate) |
| `venues` | Estádios (id, name, city, countryId, capacity) |
| `players` | Jogadores (+ fullName, knownName, nationalityCountryId, primaryPosition, secondaryPositions, heightCm, preferredFoot) |
| `team_rosters` | Elenco por temporada (teamId, seasonId, playerId, squadNumber, role, status) |
| `contracts` | Contratos (teamRosterId, startDate, endDate, salaryWeekly, marketValue) |
| `match_games` | Jogos (seasonId, competitionId, venueId, kickoffAt, status, homeTeamId, awayTeamId, homeScore, awayScore) |
| `match_events` | Eventos (matchId, minute, type, teamId, playerId, relatedPlayerId) |
| `match_lineups` | Escalações (matchId, teamId, formation) |
| `match_lineup_players` | Jogadores na escalação (matchLineupId, playerId, isStarter, positionCode, minutesPlayed) |
| `player_match_stats` | Estatísticas por jogador (matchId, playerId, teamId, minutes, rating, goals, assists, etc.) |
| `team_match_stats` | Estatísticas por time (matchId, teamId, possession, shots, corners, fouls) |
| `injuries` | Lesões (playerId, teamId, type, status, startedAt, expectedReturnAt) |
| `transfers_sport` | Transferências (playerId, fromTeamId, toTeamId, fee, status) |
| `fixtures` | Jogos simplificados (legado, team-centric) |

## 2. Enums Criados

- `preferred_foot`: LEFT, RIGHT, BOTH
- `primary_position`: GK, CB, FB, LB, RB, WB, DM, CM, AM, W, LW, RW, ST, SS
- `roster_role`: STARTER, ROTATION, YOUTH, RESERVE
- `roster_status`: ACTIVE, LOANED_OUT, INJURED, SUSPENDED, TRANSFERRED
- `match_status`: SCHEDULED, LIVE, HT, FT, POSTPONED, CANCELED
- `match_event_type`: GOAL, OWN_GOAL, ASSIST, YELLOW, RED, SUBSTITUTION, PENALTY_SCORED, PENALTY_MISSED, VAR, INJURY
- `injury_status`: DAY_TO_DAY, OUT, DOUBTFUL, RECOVERED
- `transfer_status_sport`: RUMOR, CONFIRMED, CANCELED

## 3. Índices Criados

- `seasons_competition_year_unique`, `seasons_competition_idx`
- `team_rosters_team_season_player_unique`, `team_rosters_team_season_idx`, `team_rosters_player_idx`
- `match_games_home_team_kickoff_idx`, `match_games_away_team_kickoff_idx`, `match_games_competition_kickoff_idx`, `match_games_status_idx`
- `match_events_match_idx`, `match_events_match_minute_idx`
- `match_lineups_match_team_unique`, `match_lineups_match_idx`
- `match_lineup_players_lineup_player_unique`, `match_lineup_players_lineup_idx`
- `player_match_stats_match_player_unique`, `player_match_stats_match_idx`, `player_match_stats_player_idx`
- `team_match_stats_match_team_unique`, `team_match_stats_match_idx`
- `players_nationality_country_idx` (novo)

## 4. Comandos

```bash
# Migrar schema
npm run db:migrate

# Seed (pré-requisito: seed:corinthians)
npm run seed:corinthians
npm run db:seed
```

## 5. Endpoints API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/teams/:teamId/roster?season=2026&position=&sector=` | Elenco por temporada (team_rosters, fallback players) |
| GET | `/api/teams/:teamId/matches?type=upcoming\|recent\|all&limit=&competitionId=&season=` | Jogos (match_games preferido, fallback fixtures) |
| GET | `/api/matches/:matchId` | Detalhes completos (events, lineups, playerStats, teamStats) |
| GET | `/api/teams/:teamId/top-rated?limit=3` | Top jogadores mais bem avaliados (últimos 10 jogos) |

## 6. Exemplos de Resposta JSON

### GET /api/teams/corinthians/roster?season=2026

```json
{
  "roster": [
    {
      "id": "...",
      "playerId": "...",
      "squadNumber": 9,
      "role": "STARTER",
      "status": "ACTIVE",
      "name": "Yuri Alberto",
      "position": "Centre-Forward",
      "birthDate": "2001-03-18",
      "nationalityPrimary": "Brazil",
      "photoUrl": "/assets/players/corinthians/yuri-alberto.jpg",
      "sector": "FWD"
    }
  ],
  "season": 2026,
  "updatedAt": 1739356800000
}
```

### GET /api/teams/corinthians/matches?type=recent&limit=5

```json
{
  "matches": [
    {
      "id": "...",
      "kickoffAt": "2026-02-10T21:00:00.000Z",
      "status": "FT",
      "homeTeamId": "corinthians",
      "awayTeamId": "rb-bragantino",
      "homeTeamName": "Corinthians",
      "awayTeamName": "RB Bragantino",
      "homeScore": 2,
      "awayScore": 0,
      "round": null,
      "competition": { "id": "comp-paulista-srie-a1", "name": "Paulista Série A1", "logoUrl": null },
      "seasonYear": 2026,
      "venue": { "id": "...", "name": "Neo Química Arena", "city": "São Paulo" }
    }
  ],
  "source": "match_games",
  "updatedAt": 1739356800000
}
```

### GET /api/matches/:matchId

```json
{
  "match": {
    "id": "...",
    "kickoffAt": "...",
    "status": "FT",
    "homeTeamName": "Corinthians",
    "awayTeamName": "RB Bragantino",
    "homeScore": 2,
    "awayScore": 0,
    "competition": { "id": "...", "name": "Paulista Série A1", "logoUrl": null },
    "venue": { "id": "...", "name": "Neo Química Arena", "city": "São Paulo", "capacity": 49205 }
  },
  "events": [
    { "id": "...", "minute": 23, "type": "GOAL", "playerName": "Yuri Alberto", "relatedPlayerName": "Rodrigo Garro" }
  ],
  "lineups": [
    {
      "teamId": "corinthians",
      "teamName": "Corinthians",
      "formation": "4-2-3-1",
      "starters": [
        { "playerId": "...", "name": "Hugo Souza", "shirtNumber": 1, "positionCode": "GK", "minutesPlayed": 90 }
      ],
      "substitutes": []
    }
  ],
  "playerStats": [
    { "playerId": "...", "name": "Yuri Alberto", "minutes": 90, "rating": 8.2, "goals": 1, "assists": 0 }
  ],
  "teamStats": [
    { "teamId": "corinthians", "teamName": "Corinthians", "possession": 55, "shots": 12, "shotsOnTarget": 5, "corners": 6, "fouls": 14 }
  ],
  "source": "match_games"
}
```

### GET /api/teams/corinthians/top-rated?limit=3

```json
{
  "players": [
    {
      "playerId": "...",
      "name": "Rodrigo Garro",
      "photoUrl": "/assets/players/corinthians/rodrigo-garro.jpg",
      "position": "Attacking Midfield",
      "shirtNumber": 8,
      "avgRating": 8.2,
      "matchesPlayed": 5,
      "totalGoals": 2,
      "totalAssists": 3
    }
  ],
  "updatedAt": 1739356800000
}
```

## 7. Repositories

- `server/repositories/roster.repo.ts` – `getRosterByTeamAndSeason`, `getRosterByTeamLegacy`
- `server/repositories/matches.repo.ts` – `getMatchesByTeam`, `getMatchDetails`
- `server/repositories/players.repo.ts` – `getTopRatedByTeam`

## 8. Seed Realista

- **Corinthians**: 33 jogadores
- **Competições**: Brasileirão, Paulista, Supercopa
- **16 jogos**: 11 FT, 3 SCHEDULED, 1 POSTPONED
- **Eventos**: gols, cartões amarelos, substituições em 5 jogos
- **Stats**: ratings e player_match_stats em 5 jogos; team_match_stats em 5 jogos
- **Lineups**: 4-2-3-1 em 11 jogos finalizados
- **Lesão**: Gabriel Paulista (OUT)

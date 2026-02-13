# QA – Aba "Meu Time" (FUTTWITTER)

Checklist de teste manual e casos de borda para garantir experiência premium e consistência entre partida, escalação e notas.

---

## Comandos úteis

```bash
# Instalar dependências
npm install

# Rodar migrações / push do schema (Drizzle)
npx drizzle-kit push

# Seed do banco (times, jogadores, última partida Corinthians)
npm run db:seed
# ou
npx tsx server/seed.ts
# Para ter escalação real da última partida (11 titulares + suplentes) no card Tática:
npx tsx server/seed-corinthians-players.ts   # elenco Corinthians (nomes reais)
npx tsx server/seed-corinthians-last-match.ts  # partida demo + match_players (legado)

# Últimos 5 jogos REAIS do Corinthians (Forma recente + Featured Match)
npx tsx server/scripts/seed-corinthians-last5.ts
# Pré-requisito: seed.ts + seed-corinthians-players.ts já rodados.
# Idempotente: remove partidas isMock do Corinthians e insere as 5 (08/02 a 25/01).
# O jogo mais recente (Corinthians 0–1 Palmeiras) recebe 11 titulares para o TacticalBoard.

# Desenvolvimento (client + server)
npm run dev
# ou
npm run dev:all
```

---

## Ordem obrigatória da aba (Visão Geral)

1. **Header do time** – escudo, nome, país, técnico, competição, estádio, Favoritar/Comparar (disabled)
2. **Última partida (Featured Match)** – competição, rodada, data/hora, placar, status, escudos
3. **Contexto rápido** – forma recente (5 jogos) + situação no campeonato
4. **Tática / formação** – campo read-only com titulares da última partida
5. **Notas da torcida** – titulares e suplentes, slider 0–10 (step 0,5), votação por jogador

---

## 1) Header do time

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 1.1 | Abrir `/meu-time` com usuário logado e time (ex.: Corinthians) | Header com escudo, nome, liga, posição, país |
| 1.2 | Verificar técnico e estádio | Exibidos ou "—" se não configurados no clube |
| 1.3 | Verificar botões Favoritar e Comparar | Ambos disabled; tooltip "Em breve" ao passar o mouse |
| 1.4 | Time sem logo (ou URL quebrada) | Placeholder de escudo (fallback) |
| 1.5 | Escudo Corinthians | Sempre visível: fonte única em `client/src/lib/teamCrests.ts` (getTeamCrest). Local: `/assets/crests/corinthians.svg`. TeamBadge usa fallback (local → placeholder) se logoUrl do backend falhar. |

---

## 2) Featured Match (Última partida)

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 2.1 | Time com última partida finalizada (ex.: seed Corinthians) | Card com competição, rodada, data/hora (pt-BR), placar, status "Finished", dois escudos |
| 2.2 | Data/hora | Formato legível pt-BR (ex.: "domingo, 8 de fevereiro • 16:00") |
| 2.3 | Status | Badge: Finished (secondary), Live (destructive), Upcoming (outline) |
| 2.4 | Sem última partida (time novo ou sem jogos) | Empty state: "Sem partidas recentes para exibir" + botão "Ver calendário" (disabled, placeholder) |
| 2.5 | opponentLogoUrl / championshipRound / status ausentes | Sem crash; fallbacks (null/—) |

---

## 3) Recent Form (Forma recente)

Base de dados: os 5 jogos vêm do DB (endpoint extended retorna `matches`). Para o Corinthians, rode o seed dos últimos 5 jogos reais:

- `npx tsx server/scripts/seed-corinthians-last5.ts`

Isso popula: 08/02 Palmeiras (L), 05/02 Capivariano (W), 01/02 Flamengo (W), 28/01 Bahia (L), 25/01 Velo Clube (W).

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 3.1 | Time com ≥5 jogos finalizados | Até 5 blocos W/D/L (verde/cinza/vermelho) |
| 3.2 | Time com &lt;5 jogos | Blocos reais + placeholders "—" (tracejado) até completar 5 |
| 3.3 | Tooltip em cada bloco | Data, competição (se houver), placar, casa/fora |
| 3.4 | Nenhum jogo | Texto "Nenhum jogo recente" |
| 3.5 | Após seed-corinthians-last5 | Forma recente com exatamente 5 itens coerentes (L, W, W, L, W) |

---

## 4) Standings Summary (Situação no campeonato)

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 4.1 | Tabela disponível (leagueTable preenchido) | Posição, pontos, "X pts do líder" (se não for líder), "+Y pts acima do Z4" ou "Zona de rebaixamento" quando aplicável |
| 4.2 | Tabela vazia ou sem times | "Classificação indisponível (demo)" |
| 4.3 | position / points undefined | Sem crash; valores seguros (0, "—") |
| 4.4 | Delta líder / Z4 | Exibidos apenas quando dados existirem |

---

## 5) Tactical Board (Tática real)

**Regra: TacticalBoard não pode ficar vazio** quando o usuário tem última partida: deve mostrar formação, lista "Em campo" (titulares em ordem GK→DEF→MID→ATT) com nota da torcida, e campo com números na camisa.

### Verificação no Network

- **GET /api/matches/:id/lineup** — Status 200. Response: `{ matchId?, formation, starters: [{ playerId, name, position, shirtNumber? }], substitutes }`. Se `starters.length > 0`, o card mostra a lista "Em campo".
- **GET /api/matches/:id/ratings** — Status 200. Response: `[{ playerId, avgRating, voteCount }]`. A nota ao lado de cada jogador é a média da torcida nessa partida; se `voteCount === 0`, exibir "—".

### O que deve aparecer no UI

- Abaixo do badge da formação (ex.: 4-2-3-1): título **"Em campo"** e lista em ordem de posição (goleiro, defensores, meio, atacantes).
- Cada linha: **{SIGLA} {Nome} — {Nota}**, com siglas PT-BR: GOL, LD, ZAG, LE, VOL, MEI, ATA (ex.: "GOL Hugo Souza — 6.8"). Nota com uma casa decimal ou "—" se voteCount = 0.
- Campo (formação visual): mais compacto (altura ~260–320px conforme breakpoint).
- Se não houver lineup (starters vazio): mensagem **"Escalação indisponível para a última rodada."**
- Se houver menos de 11 titulares: listar os disponíveis e texto "Escalação incompleta —".

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 5.1 | Última partida com escalação (match_players) | Formação + lista "Em campo" (11 linhas Nome — Nota) + campo com número na camisa |
| 5.2 | Última partida sem match_players (ex.: seed não rodou) | Backend usa fallback: 11 jogadores do elenco por posição; lista e campo preenchidos |
| 5.3 | Formação não suportada (ex.: 5-3-2) | Fallback: grid genérico com jogadores distribuídos |
| 5.4 | Lineup 404 ou partida inexistente | Empty state: "Escalação indisponível" |
| 5.5 | Suplentes | Nunca aparecem no campo nem na lista "Em campo"; apenas titulares |
| 5.6 | Dev: console.debug | Em DEV, logs com matchId, lineup (startersCount), ratings (length) |

---

## 5.1) Card do elenco (grid por posição)

Cards minimalistas premium: **apenas** foto, nome, posição e overall. Sem idade, nacionalidade, origem, botão "Avaliar".

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| C.1 | Ver seção Elenco (ex.: DEFENSORES) | Card com: avatar (foto ou iniciais), nome, posição (ex.: CB, RB), overall com ícone de estrela |
| C.2 | Overall do banco | Se `players.overall` existir, exibir número; senão exibir "—" |
| C.3 | Foto ausente | Fallback: iniciais do nome no círculo (ex.: "YA" para Yuri Alberto) |
| C.4 | Campos removidos | Sem idade, nacionalidade, origem, botão "Avaliar" no card |
| C.5 | Grid responsivo | 1 col (mobile), 2 sm, 3 md, 4 lg |
| C.6 | Hover / clique | Card clicável (hover); no futuro pode abrir modal |

---

## 6) Fan Ratings (Notas da torcida)

Modelo: **voto único por jogador por partida** (sem edição). Botões 0–10; sem slider nem botão "Salvar".

| Passo | Ação | Resultado esperado |
|-------|------|--------------------|
| 6.1 | Usuário logado, última partida com escalação | Lista Titulares + Suplentes; por jogador: nome, média atual, (N votos); 11 botões clicáveis (0 a 10) |
| 6.2 | Clicar numa nota (ex.: 7) | Salvamento automático; spinner discreto "Salvando…"; toast "Nota salva!"; linha passa a "Sua nota: 7.0" e "✓ Avaliação registrada"; botões desabilitados |
| 6.3 | Tentar votar de novo no mesmo jogador | UI já bloqueada (botões desabilitados); se tentativa via API: 409 e toast "Você já avaliou este jogador nesta partida." |
| 6.4 | voteCount | Exibido quando > 0 (ex.: "(128 votos)") |
| 6.5 | Usuário não logado | Botões não exibidos; mensagem "Faça login para avaliar." |
| 6.6 | Erro ao salvar (ex.: 404 partida) | Toast com mensagem do servidor |
| 6.7 | **Teste voto único (backend)** | POST /api/ratings com mesmo (userId, matchId, playerId) duas vezes: segunda deve retornar **409** e body `{ message: "Você já avaliou este jogador nesta partida." }` |
| 6.8 | **Teste 409 no frontend** | Após votar, recarregar; tentar votar de novo (ou simular 409): toast de erro e UI permanece como "avaliado" |
| 6.9 | **Teste usuário não logado** | Sem sessão: GET /api/matches/:id/my-ratings retorna 401; na tela, não chamar my-ratings e exibir "Faça login para avaliar." |

---

## 7) Casos de borda (edge cases)

| Cenário | Como simular | Resultado esperado |
|---------|--------------|--------------------|
| Sem partida finalizada | Time sem jogos COMPLETED ou sem seed | Featured: empty state; TacticalBoard e FanRatings não quebram (podem não renderizar seção ou mostrar empty) |
| Sem lineup para a partida | Partida sem match_players | TacticalBoard: "Escalação indisponível"; FanRatings: lista vazia ou "Nenhum jogador para avaliar" |
| Sem standings | leagueTable vazio | "Classificação indisponível (demo)" |
| Sem login | Acessar /meu-time sem sessão | Empty state "Você precisa estar logado" (página já redireciona/block) |
| POST /api/ratings com matchId/jogador inválido | - | 404 com mensagem; front exibe toast |
| POST /api/ratings duplicado (já votou) | Enviar segundo POST mesmo userId/matchId/playerId | 409; mensagem "Você já avaliou este jogador nesta partida."; front toast e invalida myRatings |

---

## 8) Backend – Contratos

- **GET /api/matches/:id/lineup**  
  Resposta: `{ matchId, formation, starters: [{ playerId, name, position, shirtNumber? }], substitutes }`

- **GET /api/matches/:id/ratings**  
  Resposta: `[{ playerId, avgRating, voteCount }]`

- **GET /api/matches/:id/my-ratings** (autenticado)  
  Resposta: `[{ playerId, rating }]`

- **POST /api/ratings** (autenticado)  
  Body: `{ matchId, playerId, rating }`  
  Validação: match e player existem; rating entre 0 e 10 (step 0,5). **Voto único**: se já existir rating para (userId, matchId, playerId), retorna **409** com `{ message: "Você já avaliou este jogador nesta partida." }`. Sem upsert; avaliação irreversível.  
  Resposta 201: `{ playerId, matchId, rating, voteCount }`  
  Resposta 409: já votou neste jogador nesta partida.

---

## 9) React Query – queryKeys

- `['myTeamOverview', teamId, 'last-match']` – última partida
- `['lineup', matchId]` – escalação da partida
- `['ratings', matchId]` – médias por jogador
- `['myRatings', matchId]` – notas do usuário na partida

Ao carregar: GET /api/matches/:id/my-ratings define quais jogadores já foram avaliados (bloqueio no front). Ao salvar rating: atualização otimística de `myRatings`; invalidação de `ratings` e `myRatings`. Em caso de 409: invalidar `myRatings` e exibir toast; UI trava como "avaliado".

---

## 10) Checklist rápido pós-deploy

- [ ] Header com fallbacks (técnico/estádio/competição)
- [ ] Favoritar e Comparar disabled com tooltip "Em breve"
- [ ] Featured: empty state + CTA "Ver calendário" quando sem partida
- [ ] Recent form: máx. 5 itens, tooltip com data/competição/casa-fora, placeholders "—"
- [ ] Standings: "Classificação indisponível (demo)" quando sem dados; sem crash com undefined
- [ ] **TacticalBoard**: nunca vazio quando há última partida; validar Network `/api/matches/:id/lineup` 200 e `starters.length > 0`; fallback formação não suportada; empty "Escalação indisponível" só quando lineup 404
- [ ] **Card do elenco**: apenas foto (ou iniciais), nome, posição, overall (ou "—"); sem idade/nacionalidade/origem/botão Avaliar; grid 1/2/3/4 cols
- [ ] FanRatings: botões 0–10, voto único (sem edição); spinner ao salvar; toast de sucesso/erro; em 409 toast e UI bloqueada; CTA "Faça login para avaliar" quando não logado
- [ ] Console sem erros; sem regressões em Feed, Perfil, Notícias

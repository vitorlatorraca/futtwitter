# Entrega — Corinthians Elenco + Fotos + Tática Ideal + Página Premium

## Resumo

Implementação completa focada 100% no Corinthians, sem API externa de futebol. Inclui: elenco por setores, fotos locais (Wikimedia Commons), **tática ideal por clique no campo** (seleção via modal), dados verificados do clube e UI premium.

---

## Tática ideal — Clique para selecionar (não drag & drop)

- O usuário **clica em um slot** no campo (ex.: GK, LB, CB…).
- Abre um **Sheet "Selecionar jogador"** com lista filtrada por setor (GK/DEF/MID/FWD).
- Ao clicar em um jogador, o slot é preenchido (foto + nome + número).
- **Trocar jogador**: menu no slot → "Trocar jogador" (reabre o modal).
- **Remover do slot**: menu no slot → "Remover do slot".
- **Salvar minha tática** persiste em `user_lineups` (GET/POST `/api/lineups/me`).
- O mesmo jogador não pode estar em dois slots (mostrado como "já escalado" no picker).

### Arquivos da tática

- `client/src/components/team/formation-slots.ts` — Map formação → slot (slotId, sector, label).
- `client/src/components/team/PlayerPicker.tsx` — Sheet com busca, filtro por setor, "já escalado".
- `client/src/components/team/formation-view.tsx` — Slots clicáveis, sem drag & drop; integração com PlayerPicker e persistência.

---

## Títulos do Corinthians — Contagens verificadas

Contagens e anos conferidos em fontes oficiais e documentadas em `server/data/corinthians.sources.json`.

### Contagens finais (fev/2025)

| Título | Contagem | Observação |
|--------|----------|------------|
| Campeonato Brasileiro (Série A) | 7 | 1990, 1998, 1999, 2005, 2011, 2015, 2017 |
| Copa do Brasil | 4 | 1995, 2002, 2009, 2025 |
| Copa Libertadores da América | 1 | 2012 |
| Mundial de Clubes (FIFA + Intercontinental) | 2 | 2000 (Copa Intercontinental), 2012 (Mundial FIFA) |
| Recopa Sul-Americana | 1 | 2013 |
| Campeonato Paulista | 31 | Recorde de títulos; anos em corinthians.club.json |

### Critérios e divergências

- **Mundial**: Contamos 2 títulos. 2000 = Copa Intercontinental (Mundial pré-FIFA, reconhecido pela FIFA); 2012 = Mundial de Clubes FIFA. Fonte: site oficial, FIFA.
- **Brasileirão / Copa do Brasil**: CBF e site oficial do clube. Nenhuma divergência.
- **Libertadores / Recopa**: CONMEBOL. 1 e 1.
- **Paulista**: 31 títulos conforme FPF e mídia (Placar, UOL, Jovem Pan). Lista de anos conferida em Wikipedia PT e notícias.
- **Copa do Brasil 2025**: Incluída conforme dados oficiais do clube (conquista 2025).

Fontes utilizadas (links em `server/data/corinthians.sources.json`):

- Site Oficial Corinthians — Títulos  
- CBF (Brasileirão, Copa do Brasil)  
- CONMEBOL (Libertadores, Recopa)  
- FIFA (Mundial)  
- Wikipedia PT (Títulos do Corinthians)  
- FPF / mídia (Paulista)

---

## Arquivos alterados/criados

### Schema e backend
- `shared/schema.ts` — Campos `photoUrl`, `sector`, `slug` em players; tabela `user_lineups`
- `shared/player-sector.ts` — Regras posição → setor (GK|DEF|MID|FWD)
- `server/storage.ts` — `getUserLineup`, `upsertUserLineup`
- `server/routes.ts` — GET/POST `/api/lineups/me`; extended com `corinthiansClub`
- `server/data/corinthians.club.json` — Títulos corrigidos; `honours` com count + years
- `server/data/corinthians.sources.json` — Fontes consultadas (links)

### Frontend
- `client/src/components/team/formation-slots.ts` — **NOVO** — Configuração slot → setor por formação
- `client/src/components/team/PlayerPicker.tsx` — **NOVO** — Modal/Sheet seleção de jogador por setor
- `client/src/components/team/formation-view.tsx` — Clique no slot → PlayerPicker; Trocar/Remover; sem drag & drop
- `client/src/components/team/squad-list.tsx` — Suporte a `draggable` (removido do fluxo Corinthians)
- `client/src/components/team/corinthians-club-section.tsx` — História & Títulos: cards com contagem + anos (colapsável), texto de critérios
- `client/src/pages/meu-time.tsx` — Remoção de draggable; cópia ajustada para clique no campo

---

## Comandos para rodar e testar

```bash
npm run dev:all
```

1. Login com usuário Corinthians (`teamId === 'corinthians'`).
2. Abrir `/meu-time`.
3. **Tática**: Clicar em um slot → abre Sheet → selecionar jogador → slot preenchido. Menu no slot: Trocar / Remover. Salvar e recarregar para conferir persistência. Validar que o mesmo jogador não aparece em dois slots.
4. **Títulos**: Seção "História & Títulos" com contagens e anos; `corinthians.sources.json` com fontes; critérios em `docs/CORINTHIANS_DELIVERY.md`.

---

## Confirmação de testes

- [ ] App rodando sem erros
- [ ] Não existe mais drag & drop no campo
- [ ] Clique no slot abre modal de seleção
- [ ] Selecionar jogador preenche o slot
- [ ] Não é possível repetir o mesmo jogador em dois slots
- [ ] Remover jogador funciona
- [ ] Salvar e recarregar mantém a tática
- [ ] Seção "História & Títulos" mostra contagens corrigidas
- [ ] `server/data/corinthians.sources.json` atualizado com as fontes

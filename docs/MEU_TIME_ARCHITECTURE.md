# Arquitetura da página "Meu Time"

Este documento explica onde alterar **comportamento global** da página Meu Time e onde alterar **dados e aparência por clube**.

## Guia rápido: para mudar o Corinthians (ou outro time)

- **Pontos, vitórias, empates, derrotas:** edite `client/src/features/meu-time/clubs/corinthians.ts` → objeto `stats`.
- **Nome, estádio, liga, temporada, reputação, taças, cores:** no mesmo arquivo `corinthians.ts` (objeto `corinthiansConfig`).
- **Escudo:** coloque `badge.svg` ou `badge.png` em `client/public/assets/teams/corinthians/` ou defina `badgeSrc` no config.
- **Imagem do estádio:** defina `stadiumImageSrc` no config ou use a pasta `client/public/assets/stadiums/corinthians/`.
- **Layout/componentes globais (header, cards, abas, taças):** edite os arquivos em `client/src/features/meu-time/components/`.

---

## Onde mexer para mudanças **globais** (layout, componentes, UI)

- **Pasta:** `client/src/features/meu-time/`
- **Componentes reutilizáveis:**
  - `components/TeamHeaderCard.tsx` – header premium com escudo, nome, badges, temporada/estádio/reputação e cards de stats
  - `components/TeamStatsCards.tsx` – grid de pontos, vitórias, empates, derrotas
  - `components/TeamTabs.tsx` – abas (Visão Geral, Notícias, Jogos, etc.)
  - `components/TeamTrophies.tsx` – grid de taças com ícone, nome, quantidade e anos
  - `components/TeamHero.tsx` – wrapper de fundo (gradient + overlay)
- **Tipos e helpers:** `types.ts`, `helpers.ts`
- **Escudo global:** `client/src/components/team/TeamBadge.tsx`  
  Resolve o escudo em: `/assets/teams/{teamId}/badge.svg` → `badge.png` → `placeholder-badge.svg`. Use este componente em qualquer lugar que precise exibir o escudo do time.

Alterar layout, textos fixos, estilos dos cards ou da lista de taças deve ser feito nesses arquivos. **Não** altere dados específicos de um time (pontos, estádio, taças) aqui.

---

## Onde mexer para mudanças **por clube** (Corinthians, Palmeiras, etc.)

- **Pasta:** `client/src/features/meu-time/clubs/`
- **Arquivo por time:**
  - `corinthians.ts` – tudo que é específico do Corinthians (pontos, vitórias, empates, derrotas, estádio, taças, cores, reputação)
  - `palmeiras.ts` – idem para Palmeiras
- **Entrada central:** `clubs/index.ts` – exporta `getClubConfig(teamId)` e o fallback `defaultClubConfig`. Para adicionar um novo time, crie `clubs/{time}.ts` e registre em `clubs/index.ts`.

### O que pode ser editado no config do clube

| Campo | Descrição |
|-------|-----------|
| `teamId` | ID do time (ex: `corinthians`) |
| `displayName` | Nome exibido no header |
| `country`, `league`, `seasonLabel` | País, liga e temporada |
| `stadiumName`, `stadiumImageSrc` | Nome do estádio e URL da imagem (hero da seção estádio) |
| `badgeSrc` | (opcional) URL do escudo; se não informado, usa `/assets/teams/{teamId}/badge.svg` ou `.png` |
| `theme` | `primary`, `secondary`, `gradient` (cores do header) |
| `stats` | `points`, `wins`, `draws`, `losses` – **edite aqui para mudar os números do Corinthians (ou de qualquer time)** |
| `reputation` | 0–5 estrelas |
| `trophies` | Lista de taças: `name`, `count`, `years`, `icon` (path do PNG/SVG) |

**Exemplo:** para alterar pontos, vitórias, empates e derrotas do Corinthians, edite **apenas** `client/src/features/meu-time/clubs/corinthians.ts` → objeto `stats`.

---

## Resolver de stats (API vs config)

Os números exibidos (pontos, vitórias, empates, derrotas) vêm do **resolver** em `helpers.ts`:

1. Se a API (`/api/teams/:id/extended`) retornar `team` com `points`, `wins`, `draws`, `losses`, esses valores são usados.
2. Caso contrário, usa `clubConfig.stats` do arquivo do clube.
3. Fallback: zeros.

Assim, hoje você pode controlar tudo pelo config do clube; quando o backend tiver esses dados reais, eles passam a prevalecer sem mudar o layout.

---

## Assets

- **Escudos:** `client/public/assets/teams/{teamId}/badge.svg` ou `badge.png`. Fallback: `assets/teams/placeholder-badge.svg`.
- **Taças:** `client/public/assets/trophies/` – use os nomes referenciados no `clubConfig.trophies[].icon` (ex.: `libertadores.png`, `brasileirao.png`). Placeholder: `placeholder-trophy.svg`.
- **Estádios:** use `stadiumImageSrc` no config do clube; fallback da seção estádio: `assets/stadiums/placeholder.jpg`.

---

## Checklist de teste manual

- [ ] Abrir `/meu-time` com usuário do Corinthians: escudo aparece no header.
- [ ] Abrir `/meu-time` com usuário do Palmeiras: escudo e dados do Palmeiras.
- [ ] Stats (pontos/vitórias/empates/derrotas) refletem o config do clube (ou da API, se existir).
- [ ] Seção de taças exibe ícones (ou placeholder) e layout premium.
- [ ] Visão do estádio usa imagem do config (ex.: Neo Química Arena para Corinthians).
- [ ] Abas (Visão Geral, Notícias, Jogos, Estatísticas, Comunidade) funcionam.
- [ ] Nenhum erro no console; outras páginas (dashboard, perfil, etc.) não quebram.

# Vai e Vem – Mercado de Transferências

Página de rumores e transferências no estilo "Vai e Vem", com votação dupla (torcida vendendo vs comprando).

## Funcionalidades

- **Autor do rumor**: Cada rumor exibe o jornalista que criou (nome + badge "Jornalista")
- **Duas avaliações independentes**:
  - **Torcida vendendo (SELLING)**: likes/dislikes da torcida do time de origem
  - **Torcida comprando (BUYING)**: likes/dislikes da torcida do time de destino
- **Regra de permissão**: Só pode votar no lado do seu time (teamId do usuário = fromTeamId para SELLING, toTeamId para BUYING)

## Comandos

### Rodar migrations (antes do seed)

```bash
npm run db:migrate
# ou
npx tsx server/scripts/run-migrations.ts
```

### Rodar seed

```bash
npm run seed:transfers
# ou
npx tsx server/scripts/seed-transfers-demo.ts
```

**Pré-requisitos:** Times já seedados (o `npm run dev` faz isso automaticamente).

O script é idempotente: limpa as transferências existentes e re-insere os dados demo (8–17 rumores com autor e votos de exemplo).

## Como validar na UI

1. Inicie o servidor: `npm run dev`
2. Faça login (com usuário que tenha `teamId` selecionado) e acesse **Vai e Vem** no navbar (ou `/vai-e-vem`)
3. Verifique:
   - Lista com ~17 itens demo
   - "Por: {Nome do Jornalista}" + badge Jornalista em cada card
   - Dois blocos de votação: "Torcida {from} (vendendo)" e "Torcida {to} (comprando)"
   - Só pode votar no lado do seu time; tooltip "Apenas torcedores do {time} podem votar aqui" quando desabilitado
   - Tabs: Todos | Rumores | Em negociação | Fechado
   - Busca por nome de jogador, filtro por time

## Escudos (teamCrests)

A página usa somente `getTeamCrest(slug)` de `@/lib/teamCrests`. Corinthians sempre usa `/assets/crests/corinthians.png`.

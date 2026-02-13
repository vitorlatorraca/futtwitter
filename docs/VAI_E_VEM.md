# Vai e Vem – Mercado de Transferências

Página de rumores e transferências no estilo "Vai e Vem", com votação de opinião (👍/👎).

## Comando para rodar o seed

```bash
npm run seed:transfers
# ou
npx tsx server/scripts/seed-transfers-demo.ts
```

**Pré-requisitos:** Times já seedados (o `npm run dev` faz isso automaticamente).

O script é idempotente: limpa as transferências existentes e re-insere os dados demo.

## Como validar na UI

1. Inicie o servidor: `npm run dev`
2. Faça login e acesse **Vai e Vem** no navbar (ou `/vai-e-vem`)
3. Verifique:
   - Lista com ~17 itens demo
   - Tabs: Todos | Rumores | Em negociação | Fechado
   - Busca por nome de jogador
   - Filtro por time
   - Avatar, nome, posição, origem → destino (com escudos), status, termômetro 👍/👎
   - Clique em um item abre Drawer com detalhes + botões de voto
   - Usuário logado pode votar (1x por item); 409 se já votou
   - Usuário não logado vê tooltip "Faça login para votar"

## Escudos (teamCrests)

A página usa somente `getTeamCrest(slug)` de `@/lib/teamCrests`. Corinthians sempre usa `/assets/crests/corinthians.png`.

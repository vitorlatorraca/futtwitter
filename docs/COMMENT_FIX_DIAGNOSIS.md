# Diagnóstico e correção: erro ao comentar (500 / disconnected port)

## Endpoint que falhava

- **Rota:** `POST /api/news/:newsId/comments`
- **Uso no client:** `client/src/components/news-card.tsx` → `createCommentMutation` chama `apiRequest('POST', \`/api/news/${news.id}/comments\`, { content })`.
- **Payload:** `{ content: string }` (obrigatório, 1–2000 caracteres).

## Possíveis causas do 500 (e o que foi feito)

1. **Backend não logava stack:** erros eram só `console.error(err)` → **ajustado:** handler global em `server/index.ts` agora loga `err.stack`.
2. **Rota sem log em dev:** difícil saber se a requisição chegava → **ajustado:** em `NODE_ENV=development` a rota loga `userId`, `newsId`, `req.body`.
3. **Storage retornando `undefined`:** se `.returning()` viesse vazio (caso raro), a rota respondia 201 com `undefined` → **ajustado:** `storage.createComment` verifica o retorno e lança se não houver linha; a rota checa `comment` antes de responder.
4. **Tabelas `comments` / `comment_likes` inexistentes:** o insert falharia com erro de relação → **ação:** rodar `npm run db:push` para aplicar o schema (Drizzle).
5. **CORS / proxy / porta:** se o client estiver em outra origem (ex.: Vite em 5173 e API em 5002), é preciso `VITE_API_URL=http://localhost:5002` ou proxy no Vite → **ajustado:** proxy em `vite.config.ts` para `/api` → `http://127.0.0.1:5002` quando `VITE_API_URL` não está definido.

## “Disconnected port object”

Esse erro costuma aparecer quando uma requisição falha e alguma extensão do navegador (ou proxy) tenta usar um port já fechado. **Tratamento:** corrigir a causa do 500 (acima). Com o backend respondendo 201/4xx em JSON, o problema tende a sumir.

## Alterações feitas (resumo)

### Backend

- **server/index.ts:** error handler passa a logar `err.stack`.
- **server/routes.ts:**
  - `POST /api/news/:newsId/comments`: log em dev (userId, newsId, body); checagem de `userId` e de `comment` após `createComment`; em caso de erro, log de `error.stack`; resposta 201 com comentário no formato do feed (id, content, createdAt, author, likeCount, viewerHasLiked).
  - `GET /api/news/:newsId/comments`: em erro, log de `error.stack`.
- **server/storage.ts:** `createComment` valida o retorno do insert e lança se não houver linha.

### Client

- **client/src/components/news-card.tsx:**
  - Em dev: log da URL, body e resposta da mutation de comentário.
  - `onError`: mensagem de erro do servidor extraída do corpo da resposta (ex.: `500: {"message":"..."}`) e exibida no toast.

### Config / env

- **vite.config.ts:** proxy de `/api` para `http://127.0.0.1:5002` quando `VITE_API_URL` não está definido.
- **.env.example:** comentários sobre `PORT=5002` e `VITE_API_URL` para uso com backend na 5002.

## Como reproduzir e confirmar o fix

### Reproduzir o problema (antes do fix)

1. Subir o backend: `PORT=5002 npm run dev` (ou `npm run dev` se usar porta padrão).
2. Abrir o app (mesma origem ou client com proxy/VITE_API_URL certo).
3. Fazer login, ir ao feed, abrir uma notícia e expandir comentários.
4. Digitar um comentário e clicar em “Enviar”.
5. Se o 500 ocorrer: no terminal do server deve aparecer o stack trace; no console do browser (dev) a URL e o body do POST.

### Confirmar o fix

1. Garantir schema no DB: `npm run db:push`.
2. Subir o server (ex.: `PORT=5002 npm run dev`).
3. No client, fazer login → feed → abrir comentários de uma notícia → escrever e enviar.
4. Esperado: toast “Comentário publicado!”, campo limpo, lista de comentários atualizada sem recarregar a página.
5. Sem 500 em `POST /api/news/:id/comments`; feed (`GET /api/news`) e times (`GET /api/teams`) continuam respondendo normalmente.

### Regressões a evitar

- Feed continua carregando (`GET /api/news` sem 500).
- Comentar não dispara refetch do feed inteiro (apenas a query de comentários daquela notícia é invalidada).
- Erro “disconnected port” não deve mais aparecer após o 500 ser corrigido.

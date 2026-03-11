# 📱 Como Usar o Prompt com Cursor

## Passo 1: Abrir o Cursor
Abra o projeto FuteApp no Cursor IDE

## Passo 2: Copiar o Prompt
Copie o conteúdo abaixo e Cole no Chat do Cursor:

---

## PROMPT PARA COLAR NO CURSOR

```
Eu quero que meu FuteApp feed fique 100% IDÊNTICO ao design do Twitter.

Aqui estão os detalhes EXATOS:

### ESTRUTURA DO TWEET
- Padding: 12px (todos os lados)
- Border-bottom: 1px #2f3336
- Hover background: #181818
- Cursor: pointer
- Layout: flex row (avatar left + content right)

### AVATAR
- Size: 48px x 48px
- Shape: circular (border-radius: 50%)
- Margin-right: 12px
- Flex-shrink: 0

### HEADER (Name @handle · date)
- Gap: 4px PEQUENO entre items
- Font-size: 13px para @handle e date
- Font-size: 13px para nome também (ou 14px no máximo)
- Font-weight: 700 para nome, 400 para resto
- Color: #e1e8ed (nome), #657786 (@handle, ·, date)
- Hover nome: underline

### TWEET TEXT
- Font-size: 15px
- Line-height: 1.5
- Margin-top: 8px
- Color: #e1e8ed
- Break-words

### MEDIA (IMAGE)
- Margin-top: 12px
- Border-radius: 16px
- Max-height: 506px
- Width: 100%
- Object-fit: cover

### INTERACTION BUTTONS
Container:
- Gap: 64px (botões bem separados - NÃO use justify-between!)
- Margin-top: 12px
- Max-width: 425px
- Display: flex

Cada botão:
- Padding: 8px 0 (só vertical!)
- Display: flex
- Gap: 8px (entre ícone e número)
- Font-size: 13px para número
- Ícone: 16px
- Transition: color 0.2s, background 0.2s

CORES HOVER:
- Reply: cor #1da1f2, bg #1da1f2 com 10% opacity
- Retweet: cor #17bf63, bg #17bf63 com 10% opacity
- Like: cor #e74c3c, bg #e74c3c com 10% opacity
- Share: cor #1da1f2, bg #1da1f2 com 10% opacity

Quando liked:
- Coração preenchido (filled)
- Cor permanente #e74c3c

### FEED CONTAINER
- Max-width: 600px
- Centered (mx-auto)
- Flex flex-col
- Width: 100%
- Borders: left e right 1px #2f3336
- Background: #000000

### ARQUIVOS A EDITAR
1. /client/src/index.css - CSS classes tweet-*
2. /client/src/components/tweet-card.tsx - Estrutura HTML

Faça essas mudanças agora. Eu vou usar npm run dev para ver ao vivo no localhost:5175.
```

---

## Passo 3: Aguardar Alterações
O Cursor vai fazer as mudanças nos arquivos automaticamente

## Passo 4: Ver Ao Vivo
Abra seu navegador em: **http://localhost:5175/dashboard**

A página vai auto-recarregar quando as mudanças forem feitas (HMR do Vite)

## Passo 5: Comparar com Twitter
Abra Twitter.com em outra aba e compare lado a lado

---

## URL PRONTA PARA COPIAR

```
http://localhost:5175/dashboard
```

Copie, cole no navegador e pressione Enter!

---

## O QUE VOCÊ VAI VER

✅ Feed centralizado em 600px
✅ Tweets com avatar circular na esquerda
✅ Header compacto com nome, @handle e data
✅ Texto do tweet bem legível
✅ Botões de interação com cores (reply azul, retweet verde, like vermelho)
✅ Hover effects suaves
✅ Espaçamento exato como Twitter
✅ Animações smooth

---

## SE ALGO NÃO FUNCIONAR

1. Verificar se dev server está rodando:
   ```
   npm run dev
   ```

2. Limpar cache do navegador:
   - Pressione Ctrl+Shift+Delete
   - Limpar cookies e cache

3. Hard refresh:
   - Pressione Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)

---

## DICAS

- Se mudar cores, use o Inspector (F12) para verificar se está exato
- Cada hover effect deve ser instantâneo (0.2s)
- Tweets devem parecer clickable (cursor: pointer)
- Like deve preencher o coração quando ativado

---

**Pronto!** Seu FuteApp feed vai ficar idêntico ao Twitter! 🐦

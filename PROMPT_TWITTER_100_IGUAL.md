# 🎯 PROMPT TWITTER 100% IGUAL - VERSÃO FINAL

## ⚠️ IMPORTANTE
Este prompt é para GARANTIR que o design fique EXATAMENTE igual ao Twitter. Cada detalhe importa. Siga TUDO ao pé da letra.

---

## 🔧 ARQUIVOS A MODIFICAR

1. `/client/src/index.css` - Classes CSS dos tweets
2. `/client/src/components/tweet-card.tsx` - HTML/JSX do tweet
3. `/client/src/components/tweet-feed.tsx` - Container do feed

---

## 📐 ESPECIFICAÇÕES EXATAS DO TWITTER

### 1️⃣ TWEET CONTAINER (article.tweet-row)

```css
.tweet-row {
  display: flex;
  padding: 12px 16px;  /* 12px top/bottom, 16px left/right */
  border-bottom: 1px solid #2f3336;
  cursor: pointer;
  transition: background-color 0.2s ease;
  gap: 12px;  /* Entre avatar e content */
}

.tweet-row:hover {
  background-color: rgba(255, 255, 255, 0.03);  /* Muito sutil */
}
```

**Verificação:**
- [ ] Padding: 12px vertical, 16px horizontal
- [ ] Border inferior: #2f3336 (cinza escuro)
- [ ] Hover background: rgba(255,255,255,0.03)

---

### 2️⃣ AVATAR (div.tweet-avatar)

```css
.tweet-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;  /* Circular */
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tweet-avatar > div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 172, 81, 0.4) 0%, rgba(212, 172, 81, 0.2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #d4ac51;
}
```

**Verificação:**
- [ ] Tamanho: EXATO 48x48px (não 47, não 49)
- [ ] Shape: 100% circular (border-radius: 50%)
- [ ] Flex-shrink: 0 (não encolhe)
- [ ] Cor iniciais: #d4ac51 (gold)

---

### 3️⃣ CONTENT AREA (div.tweet-content)

```css
.tweet-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;  /* Importante para overflow */
}
```

**Verificação:**
- [ ] flex: 1 (toma espaço restante)
- [ ] min-width: 0 (evita overflow do texto)

---

### 4️⃣ HEADER (div.tweet-header)

```css
.tweet-header {
  display: flex;
  align-items: center;
  gap: 4px;  /* PEQUENO gap entre items */
  font-size: 13px;
  line-height: 1.25;
  flex-wrap: wrap;
}
```

**Verificação:**
- [ ] Gap: EXATO 4px (não 3, não 5)
- [ ] Font-size: 13px (para handle e timestamp)
- [ ] Line-height: 1.25

---

### 5️⃣ TWEET AUTHOR NAME (span.tweet-author)

```css
.tweet-author {
  font-weight: 700;  /* Bold */
  color: #e1e8ed;    /* Branco */
  font-size: 13px;
  cursor: pointer;
}

.tweet-author:hover {
  text-decoration: underline;
}
```

**Verificação:**
- [ ] Font-weight: 700 (bold)
- [ ] Color: #e1e8ed (branco)
- [ ] Font-size: 13px
- [ ] Hover: underline

---

### 6️⃣ TWEET HANDLE (span.tweet-handle)

```css
.tweet-handle {
  color: #657786;    /* Cinza médio */
  font-size: 13px;
  font-weight: 400;  /* Normal */
}
```

**Verificação:**
- [ ] Color: #657786
- [ ] Font-size: 13px
- [ ] Font-weight: 400

---

### 7️⃣ TIMESTAMP (span.tweet-timestamp)

```css
.tweet-timestamp {
  color: #657786;    /* Cinza médio */
  font-size: 13px;
  font-weight: 400;
}
```

**Verificação:**
- [ ] Color: #657786
- [ ] Font-size: 13px

---

### 8️⃣ TWEET TEXT (p.tweet-text)

```css
.tweet-text {
  color: #e1e8ed;
  font-size: 15px;
  line-height: 1.5;
  margin-top: 12px;
  margin-bottom: 0;
  word-break: break-word;
  overflow-wrap: break-word;
  font-weight: 400;
}
```

**Verificação:**
- [ ] Font-size: 15px (EXATO)
- [ ] Line-height: 1.5
- [ ] Color: #e1e8ed
- [ ] Margin-top: 12px
- [ ] Word-break: break-word

---

### 9️⃣ MEDIA/IMAGE (img.tweet-media)

```css
.tweet-media {
  margin-top: 12px;
  border-radius: 16px;
  max-height: 506px;
  width: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.tweet-media:hover {
  opacity: 0.8;
}
```

**Verificação:**
- [ ] Border-radius: 16px (não 12, não 20)
- [ ] Max-height: 506px
- [ ] Margin-top: 12px
- [ ] Object-fit: cover

---

### 🔟 INTERACTIONS CONTAINER (div.tweet-interactions)

```css
.tweet-interactions {
  display: flex;
  gap: 64px;  /* CRÍTICO: gap grande entre botões */
  margin-top: 12px;
  color: #657786;
  font-size: 13px;
  max-width: none;  /* Remover max-width */
}
```

**Verificação:**
- [ ] Gap: EXATO 64px (não 48, não 80)
- [ ] Margin-top: 12px
- [ ] Font-size: 13px
- [ ] Sem max-width

---

### 1️⃣1️⃣ INTERACTION BUTTON (button.tweet-interaction-btn)

```css
.tweet-interaction-btn {
  display: flex;
  align-items: center;
  gap: 8px;  /* Entre ícone e número */
  padding: 8px 0;  /* SÓ vertical! */
  background: none;
  border: none;
  cursor: pointer;
  color: #657786;
  font-size: 13px;
  transition: color 0.2s ease, background-color 0.2s ease;
  border-radius: 50%;
}

.tweet-interaction-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Verificação:**
- [ ] Padding: 8px 0 (SÓ vertical, sem horizontal)
- [ ] Gap: 8px
- [ ] Background: none (sem cor padrão)
- [ ] Border-radius: 50% (para efeito circular)
- [ ] Transition: 0.2s

---

### 1️⃣2️⃣ BUTTON HOVER STATES (CRÍTICO!)

#### REPLY BUTTON
```css
.tweet-reply-btn {
  color: #657786;
}

.tweet-reply-btn:hover {
  color: #1da1f2;  /* Azul Twitter exato */
  background-color: rgba(29, 161, 242, 0.1);  /* 10% opacity */
}

.tweet-reply-btn:active {
  background-color: rgba(29, 161, 242, 0.2);  /* 20% ao clicar */
}
```

#### RETWEET BUTTON
```css
.tweet-retweet-btn {
  color: #657786;
}

.tweet-retweet-btn:hover {
  color: #17bf63;  /* Verde Twitter exato */
  background-color: rgba(23, 191, 99, 0.1);
}

.tweet-retweet-btn:active {
  background-color: rgba(23, 191, 99, 0.2);
}
```

#### LIKE BUTTON
```css
.tweet-like-btn {
  color: #657786;
}

.tweet-like-btn:hover {
  color: #e74c3c;  /* Vermelho/Rosa Twitter */
  background-color: rgba(231, 76, 60, 0.1);
}

.tweet-like-btn.liked {
  color: #e74c3c;
}

.tweet-like-btn.liked:hover {
  background-color: rgba(231, 76, 60, 0.1);
}

.tweet-like-btn:active {
  background-color: rgba(231, 76, 60, 0.2);
}
```

#### SHARE BUTTON
```css
.tweet-share-btn {
  color: #657786;
}

.tweet-share-btn:hover {
  color: #1da1f2;  /* Azul Twitter */
  background-color: rgba(29, 161, 242, 0.1);
}

.tweet-share-btn:active {
  background-color: rgba(29, 161, 242, 0.2);
}
```

**Verificação:**
- [ ] Azul reply: #1da1f2
- [ ] Verde retweet: #17bf63
- [ ] Vermelho like: #e74c3c
- [ ] Background hover: 10% opacity
- [ ] Background active: 20% opacity

---

### 1️⃣3️⃣ FEED CONTAINER (div.tweet-feed)

```css
.tweet-feed {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  border-left: 1px solid #2f3336;
  border-right: 1px solid #2f3336;
  background-color: #000000;
}
```

**Verificação:**
- [ ] Max-width: 600px (EXATO)
- [ ] Centered: mx-auto
- [ ] Borders: left + right #2f3336
- [ ] Background: #000000

---

## 📝 MUDANÇAS NO tweet-card.tsx

Replace the interaction buttons section with:

```jsx
{/* Interaction Buttons */}
<div className="tweet-interactions">
  {/* Reply */}
  <button
    className="tweet-interaction-btn tweet-reply-btn"
    aria-label="Reply"
    disabled={!canInteract}
  >
    <MessageCircle size={16} />
    <span>0</span>
  </button>

  {/* Retweet */}
  <button
    className="tweet-interaction-btn tweet-retweet-btn"
    aria-label="Retweet"
    disabled={!canInteract}
  >
    <Repeat2 size={16} />
    <span>0</span>
  </button>

  {/* Like */}
  <button
    onClick={handleLike}
    disabled={!canInteract || isLiking}
    className={cn(
      'tweet-interaction-btn tweet-like-btn',
      news.userInteraction === 'LIKE' && 'liked'
    )}
    aria-label="Like"
  >
    {isLiking ? (
      <Loader2 size={16} className="animate-spin" />
    ) : (
      <Heart
        size={16}
        fill={news.userInteraction === 'LIKE' ? 'currentColor' : 'none'}
      />
    )}
    <span>0</span>
  </button>

  {/* Share */}
  <button
    className="tweet-interaction-btn tweet-share-btn"
    aria-label="Share"
    disabled={!canInteract}
  >
    <Share size={16} />
  </button>
</div>
```

---

## 🎨 COLORS CHEAT SHEET

```
Branco texto:      #e1e8ed (rgb(225, 232, 237))
Cinza texto:       #657786 (rgb(101, 119, 134))
Cinza border:      #2f3336 (rgb(47, 51, 54))
Bg hover:          rgba(255, 255, 255, 0.03)
Azul (reply):      #1da1f2 (rgb(29, 161, 242))
Verde (retweet):   #17bf63 (rgb(23, 191, 99))
Vermelho (like):   #e74c3c (rgb(231, 76, 60))
Preto (bg):        #000000 (rgb(0, 0, 0))
Gold (avatar):     #d4ac51 (rgb(212, 172, 81))
```

---

## ✅ CHECKLIST FINAL (Verificar TUDO!)

### Espacements
- [ ] Padding tweet: 12px vertical, 16px horizontal
- [ ] Avatar: 48x48px EXATO
- [ ] Header gap: 4px
- [ ] Tweet text margin-top: 12px
- [ ] Media margin-top: 12px
- [ ] Interactions gap: 64px
- [ ] Button padding: 8px 0
- [ ] Button gap: 8px

### Cores
- [ ] Nome: #e1e8ed
- [ ] Handle: #657786
- [ ] Border: #2f3336
- [ ] Hover bg: rgba(255,255,255,0.03)
- [ ] Azul: #1da1f2
- [ ] Verde: #17bf63
- [ ] Vermelho: #e74c3c

### Tipografia
- [ ] Nome: 13px, bold
- [ ] Handle: 13px, normal
- [ ] Texto: 15px, line-height 1.5
- [ ] Números: 13px

### Comportamento
- [ ] Hover do tweet inteiro: bg sutil
- [ ] Hover de cada botão: cor + bg 10% opacity
- [ ] Like liked: coração preenchido + cor permanente
- [ ] Disabled: opacity 0.5
- [ ] Transitions: 0.2s

### Layout
- [ ] Feed: 600px max-width, centered
- [ ] Borders left/right
- [ ] Avatar circular
- [ ] Texto quebra corretamente

---

## 🚀 COMO VERIFICAR SE FICOU IGUAL

1. Abra Twitter.com em uma aba
2. Abra seu FuteApp em outra aba
3. Coloque side-by-side
4. Compare:
   - Espaçamento entre elementos
   - Cores (use inspector F12 para pegar RGB exatos)
   - Comportamento de hover
   - Tamanho dos avatares
   - Font sizes

5. Use o Inspector (F12) para:
   - Inspecionar padding/margin
   - Verificar cores RGB
   - Verificar font-sizes

---

## ⚠️ ERROS COMUNS A EVITAR

❌ Não fazer: `justify-between` nos botões
✅ Fazer: `gap: 64px`

❌ Não fazer: `padding: 12px 16px` (errado)
✅ Fazer: `padding: 12px 16px` (certo - 12 top/bottom, 16 left/right)

❌ Não fazer: Avatar `40x40px` ou `50x50px`
✅ Fazer: `48x48px` EXATO

❌ Não fazer: Gap header `8px` ou `2px`
✅ Fazer: `4px` EXATO

❌ Não fazer: Cores aproximadas
✅ Fazer: Cores EXATAS RGB/HEX

❌ Não fazer: Transitions rápidas ou lentas
✅ Fazer: `0.2s` exato

---

## 📋 RESUMO RÁPIDO

**Se seguir TUDO que está neste prompt, seu feed ficará 100% idêntico ao Twitter.**

Cada número, cada cor, cada espaçamento importa. Não deixe nada de fora.

Sucesso! 🚀

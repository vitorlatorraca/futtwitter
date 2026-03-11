# 🐦 Twitter Feed Design - Prompt Completo para Cursor

## Objetivo Final
Transformar o FuteApp feed para ser **100% idêntico ao design do Twitter** em termos de:
- Layout visual
- Espaçamento
- Tipografia
- Cores
- Hover effects
- Comportamento dos botões

## Análise de Referência: Twitter Design

### 1. ESTRUTURA DO TWEET (Tweet Container)
- **Layout**: Flex row com avatar esquerda + conteúdo direita
- **Padding**: 12px horizontal, 12px vertical (12px em todos os lados)
- **Border**: 1px solid #2f3336 (cinza escuro) na base
- **Hover**: Background #181818 (cinza muito escuro) com transição suave
- **Cursor**: pointer em toda a area
- **Width**: Max 600px centralizado
- **Min-height**: ~100px aproximadamente

### 2. AVATAR
- **Tamanho**: 48px x 48px (exato)
- **Shape**: Círculo (border-radius: 50%)
- **Flex**: flex-shrink-0 (não diminui)
- **Margin-right**: 12px (gap do container)
- **Background**: Gradiente gold (já está bom, manter)

### 3. CONTENT AREA (Direita do avatar)
- **Display**: flex-1
- **Min-width**: 0 (evita overflow)
- **Estrutura interna**:
  - Header row (Name, @handle, ·, date)
  - Text content
  - Optional image
  - Interaction buttons

### 4. HEADER (Name, @handle, date)
- **Layout**: Flex row, wrap
- **Items**: [Name] [@handle] [·] [date]
- **Gap**: 4px entre items (muito pequeno)
- **Font-size**: 13px para handle e date
- **Color**:
  - Name: #e1e8ed (branco)
  - @handle: #657786 (cinza)
  - ·: #657786 (cinza)
  - date: #657786 (cinza)
- **Name font-weight**: 700 (bold)
- **Hover name**: underline

### 5. TWEET TEXT
- **Font-size**: 15px
- **Line-height**: 1.5 (1.5x)
- **Color**: #e1e8ed (branco)
- **Margin-top**: 8px (acima do header)
- **Word-break**: break-word
- **Letter-spacing**: normal

### 6. MEDIA (Imagem)
- **Margin-top**: 12px
- **Border-radius**: 16px (arredondado)
- **Max-height**: 506px
- **Width**: 100%
- **Object-fit**: cover
- **Cursor**: pointer

### 7. INTERACTION BUTTONS
**Container:**
- **Layout**: flex row
- **Gap**: 64px (IMPORTANTE - botões bem separados, não justify-between)
- **Margin-top**: 12px
- **Max-width**: 425px (deixa espaço para não ficar muito largo)
- **Font-size**: 13px
- **Color**: #657786 (cinza)

**Cada Botão:**
- **Display**: flex
- **Align-items**: center
- **Gap**: 8px (entre ícone e número)
- **Padding**: 8px 0 (só vertical, sem horizontal para Twitter exato)
- **Ícone-size**: 16px
- **Número-size**: 13px
- **Border-radius**: 50% (circular hover bg)
- **Transition**: color 0.2s, background 0.2s ease

**Cores Hover (importantes):**
- Reply (Comentário):
  - Hover color: #1da1f2 (azul Twitter)
  - Hover bg: #1da1f2 com 10% opacity (#1da1f208)
  - Background: 50px x 50px circular centered on icon

- Retweet:
  - Hover color: #17bf63 (verde Twitter)
  - Hover bg: #17bf63 com 10% opacity

- Like:
  - Hover color: #e74c3c (vermelho/rosa Twitter)
  - Hover bg: #e74c3c com 10% opacity
  - When liked: filled heart + permanent color

- Share:
  - Hover color: #1da1f2 (azul Twitter)
  - Hover bg: #1da1f2 com 10% opacity

**Disabled state:**
- opacity: 0.5
- cursor: not-allowed
- No hover effects

### 8. FEED CONTAINER
- **Max-width**: 600px
- **Display**: flex flex-col
- **Margin**: 0 auto
- **Width**: 100%
- **Borders**: left e right 1px #2f3336 (cinza escuro)
- **Background**: #000000 (preto)

## IMPLEMENTAÇÃO TÉCNICA

### Arquivos a Modificar:
1. `/client/src/index.css` - CSS utilities para tweets
2. `/client/src/components/tweet-card.tsx` - Componente principal
3. `/client/src/components/tweet-interactions.tsx` - Botões

### CSS Classes Necessárias:
```css
.tweet-feed {} /* Container do feed */
.tweet-row {} /* Um tweet inteiro */
.tweet-avatar {} /* Avatar circle */
.tweet-content {} /* Conteúdo direita */
.tweet-header {} /* Name, @handle, date */
.tweet-author {} /* Nome do jornalista */
.tweet-handle {} /* @handle */
.tweet-timestamp {} /* Data */
.tweet-text {} /* Texto do tweet */
.tweet-media {} /* Imagem */
.tweet-interactions {} /* Container dos botões */
.tweet-interaction-btn {} /* Cada botão */
```

## CHECKLIST DE VERIFICAÇÃO VISUAL

Quando terminar, verificar:
- [ ] Avatar é circular e 48x48px
- [ ] Header tem espaço pequeno (4px) entre nome, handle e data
- [ ] Texto do tweet tem 15px e margin-top 8px
- [ ] Imagem tem border-radius 16px
- [ ] Botões estão separados por 64px (não justos)
- [ ] Hover dos botões mostra cor + background circular
- [ ] Cores exatas:
  - Azul reply/share: #1da1f2
  - Verde retweet: #17bf63
  - Vermelho like: #e74c3c
- [ ] Transições suaves (0.2s)
- [ ] Like liked mostra coração preenchido e color permanente
- [ ] Padding/margin em todos os lugares está correto
- [ ] Feed tem borders left/right
- [ ] Hover do tweet inteiro mostra background #181818
- [ ] Feed centralizado em 600px

## CORES EXATAS DO TWITTER (Para copiar/colar)

```
Branco texto: #e1e8ed ou rgb(225, 232, 237)
Cinza texto: #657786 ou rgb(101, 119, 134)
Cinza escuro border: #2f3336 ou rgb(47, 51, 54)
Cinza bg hover: #181818 ou rgb(24, 24, 24)
Preto bg: #000000 ou rgb(0, 0, 0)
Azul (reply/share): #1da1f2 ou rgb(29, 161, 242)
Verde (retweet): #17bf63 ou rgb(23, 191, 99)
Vermelho (like): #e74c3c ou rgb(231, 76, 60)
```

## DICAS IMPORTANTES

1. **Não confundir `gap` com `justify-between`** - Twitter usa gap
2. **Hover background é circular** - Não é um retângulo, é um círculo ao redor do ícone
3. **Transições devem ser suaves** - 0.2s é padrão Twitter
4. **Números dos botões devem estar pequenos** - 13px
5. **Os botões devem ter 0 padding horizontal** - Apenas vertical para ser compacto
6. **Max-width do interactions é importante** - Evita que fique muito largo
7. **A imagem SEMPRE tem 16px border-radius** - Não é maior
8. **Font weights**: Nome é 700, resto é 400
9. **Sem decoração de text-underline no name por default** - Só ao hover
10. **Disabled buttons não têm hover effects** - Apenas opacity reduzida

## PRÓXIMAS ETAPAS

1. Atualizar `/client/src/index.css` com classes refinadas
2. Atualizar `/client/src/components/tweet-card.tsx` com estrutura correta
3. Verificar cores exatas usando inspector
4. Testar hover effects
5. Testar responsive no mobile
6. Testar states (liked, disabled)
7. Validar padding/margin com inspector do navegador

---

**Status**: Prompt criado para que Cursor execute e deixe 100% igual Twitter
**Versão**: 1.0
**Data**: 2026-03-10

# FUTTWITTER — Design System (Sofascore-inspired Dark Premium)

Este documento descreve os tokens, componentes e convenções do design system aplicado em toda a aplicação.

---

## 1. Tokens Globais

### CSS Variables (`.dark`)

Os tokens estão em `client/src/index.css` na seção `.dark`:

| Token | Valor | Uso |
|-------|-------|-----|
| `--background` | `215 28% 6%` | Fundo da página |
| `--card` | `216 22% 9%` | Painéis e cards |
| `--popover` | `216 22% 9%` | Modais, dropdowns |
| `--muted` | `216 20% 11%` | Áreas secundárias |
| `--border` | `0 0% 100% / 0.06` | Bordas sutis |
| `--foreground` | `220 30% 94%` | Texto principal |
| `--muted-foreground` | `220 25% 68%` | Texto secundário |
| `--ring` | `230 85% 65%` | Accent (focus ring) |

### Estados de Status (padronizados)

| Variante | Uso |
|----------|-----|
| `--success` | Vitórias (W), Fechado |
| `--warning` | Empates (D), Em breve, Rumor |
| `--danger` | Derrotas (L), Ao vivo |
| `--info` | Em negociação, Finalizado |

Classes utilitárias: `badge-success`, `badge-warning`, `badge-danger`, `badge-info`

---

## 2. Tipografia

Utilitários em `client/src/lib/ui.ts`:

```ts
import { typography } from "@/lib/ui";

// Exemplos:
<h1 className={typography.headingXL}>Título grande</h1>
<h2 className={typography.headingMD}>Subtítulo</h2>
<p className={typography.body}>Texto normal</p>
<p className={typography.caption}>Legenda</p>
```

| Classe | Descrição |
|--------|-----------|
| `headingXL` | `text-3xl sm:text-4xl font-bold` |
| `headingLG` | `text-2xl sm:text-3xl font-bold` |
| `headingMD` | `text-lg sm:text-xl font-semibold` |
| `body` | `text-sm sm:text-base` |
| `bodyMuted` | `text-sm sm:text-base text-muted-foreground` |
| `caption` | `text-xs text-muted-foreground` |
| `captionBold` | `text-xs font-semibold uppercase tracking-wider` |

---

## 3. Componentes UI Premium

### Panel

Container padrão para seções e painéis.

```tsx
import { Panel } from "@/components/ui-premium";

<Panel padding="md">  // sm | md | lg | none
  Conteúdo
</Panel>
```

- `rounded-2xl`  
- `bg-card`  
- `border border-white/5`  
- `shadow-sm`  

### SectionHeader

Título + subtítulo + ação opcional.

```tsx
import { SectionHeader } from "@/components/ui-premium";

<SectionHeader
  title="Título"
  subtitle="Descrição opcional"
  action={<Button variant="outline" size="sm">Ver</Button>}
/>
```

### StatBadge

Badges para W/D/L, status de partidas, status de transferências.

```tsx
import { StatBadge } from "@/components/ui-premium";

<StatBadge variant="W" size="sm" />
<StatBadge variant="upcoming" label="Em breve" />
<StatBadge variant="rumor" label="Rumor" />
<StatBadge variant="fechado" />
```

Variantes: `W`, `D`, `L`, `success`, `warning`, `danger`, `info`, `finished`, `live`, `upcoming`, `rumor`, `negociacao`, `fechado`

### Crest

Componente único para escudos. Corinthians sempre usa `corinthians.png`. Não usar `badge.svg`.

```tsx
import { Crest } from "@/components/ui-premium";

<Crest slug="corinthians" alt="Corinthians" size="md" ring />
```

- `slug`: slug do time (ex: `corinthians`, `palmeiras`)
- `size`: `xs` | `sm` | `md` | `lg`
- `ring`: borda opcional

Fallback: `/assets/crests/default.png`

### CompactList e CompactRow

Listas verticais compactas.

```tsx
import { CompactList, CompactRow } from "@/components/ui-premium";

<CompactList divided>
  <CompactRow as="button">
    <Avatar />
    <span>Item 1</span>
  </CompactRow>
</CompactList>
```

### EmptyState e LoadingSkeleton

```tsx
import { EmptyState, LoadingSkeleton } from "@/components/ui-premium";

<EmptyState
  icon={Newspaper}
  title="Nenhum resultado"
  description="Tente ajustar os filtros."
  actionLabel="Limpar"
  onAction={() => {}}
/>

<LoadingSkeleton variant="list" />  // card | list | row | text
```

---

## 4. Regras de Consistência

1. **Toda seção** deve usar `Panel` como container.
2. **Todo escudo** deve usar `Crest` (nunca `badge.svg`).
3. **Todo status** (W/D/L, Finished/Live/Upcoming, Rumor/Negociação/Fechado) deve usar `StatBadge`.

---

## 5. Criar um Painel Novo

```tsx
import { Panel, SectionHeader } from "@/components/ui-premium";

<Panel>
  <SectionHeader
    title="Título"
    subtitle="Subtítulo"
    action={<Button size="sm">Ação</Button>}
  />
  <div className="mt-4">
    {/* conteúdo */}
  </div>
</Panel>
```

---

## 6. Checklist de QA

- [ ] Nenhum lugar usa `badge.svg`
- [ ] Corinthians aparece com `corinthians.png` em todo lugar
- [ ] Todas as páginas estão com o mesmo “dark premium”
- [ ] Tipografia consistente
- [ ] Espaçamentos coerentes
- [ ] Loading/empty/error padronizados
- [ ] Build e lint passam

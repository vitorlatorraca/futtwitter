# Correções Aplicadas — Auditoria FUTTWITTER

**Data:** 2025-02-17  
**Relatório base:** `docs/FULL_AUDIT_REPORT.md`

## Resumo

Correções P1 (validateDOMNesting) e P2 (keys) aplicadas conforme plano de ação da auditoria.

---

## Correções P1 — validateDOMNesting (Link + Button)

**Problema:** `<Link><Button>...</Button></Link>` gera HTML inválido (`<a><button>`) e causa warning `validateDOMNesting`.

**Solução:** Usar `Button asChild` com `Link` como filho: `<Button asChild><Link href="...">...</Link></Button>`. O resultado é um único `<a>` com estilos de botão.

### Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `client/src/pages/jogos/lembra-desse-elenco.tsx` | 3 ocorrências: botão voltar, botões "Voltar aos Jogos" |
| `client/src/pages/jogos/adivinhe-elenco.tsx` | 2 ocorrências: botão voltar, botão "Voltar aos Jogos" |
| `client/src/pages/meu-time-elenco.tsx` | 1 ocorrência: botão "Voltar para Meu Time" |
| `client/src/pages/dashboard.tsx` | 1 ocorrência: botão "Ver" no painel |
| `client/src/pages/landing.tsx` | 6 ocorrências: todos os botões CTA |

---

## Correções P2 — React keys (ElencoPreviewMini)

**Problema:** Garantir keys únicas e estáveis em listas.

**Solução:** Usar `key={p.id ? `${p.id}-${index}` : `player-${index}`}` para evitar colisões mesmo em edge cases.

### Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `client/src/features/my-team-v2/ElencoPreviewMini.tsx` | `stableKey` agora usa `${p.id}-${index}` quando id existe |

---

## O que NÃO foi alterado

- Layout/estética global
- Nomes de rotas/API
- Features existentes
- Autenticação/sessão
- Dependências
- Fluxo de deploy e guard de db:push

---

## Como testar

1. `npm run dev` — deve subir sem erros
2. Abrir no browser:
   - `/` (landing) — clicar em "Criar Conta", "Já tenho conta"
   - `/meu-time` — overview
   - `/meu-time/elenco` — botão "Voltar para Meu Time"
   - `/jogos` → Lembra desse elenco? → Corinthians 2005
   - `/jogos/adivinhe-elenco/corinthians-2005-brasileirao` — botão voltar
   - `/vai-e-vem`
   - `/jornalista`
3. Console: sem warnings de validateDOMNesting ou "unique key"
4. `npm run build` — sucesso
5. `npm run start` + `GET /api/health` — 200 OK

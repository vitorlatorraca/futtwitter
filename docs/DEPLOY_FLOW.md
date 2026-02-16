# Fluxo de Desenvolvimento e Deploy

## Branches

| Branch | Uso |
|--------|-----|
| `main` | Produção estável. Deploy automático para produção. |
| `develop` | Staging. Testes e integração antes de merge em main. |

## Fluxo recomendado

1. **Desenvolver:** Crie branch a partir de `develop` (ex: `feature/meu-time-v2`)
2. **Testar:** Merge em `develop` → deploy em ambiente de preview/staging
3. **Publicar:** Merge `develop` → `main` quando estável

## Preview Deployments

### Railway

- Conecte o repositório ao Railway
- **Produção:** Serviço principal deploya a partir de `main`
- **Preview:** Crie um segundo serviço que deploya a partir de `develop`, ou use [Railway Preview](https://docs.railway.app/deploy/preview-environments) se disponível

### Render

- **Produção:** Branch `main`
- **Preview:** Ative "Preview Environments" para PRs ou branch `develop`

### Vercel (se usar frontend separado)

- **Produção:** Branch `main`
- **Preview:** Cada PR gera preview URL automaticamente

## Checklist antes de merge em main

- [ ] Testes passando em `develop`
- [ ] Migrations aplicadas (se houver mudança de schema)
- [ ] Variáveis de ambiente de produção configuradas
- [ ] Backup do banco feito (antes de migrations)

## Comandos

```bash
# Criar branch de feature
git checkout develop
git pull
git checkout -b feature/nome

# Após desenvolvimento
git add .
git commit -m "feat(scope): descrição"
git push origin feature/nome
# Abrir PR para develop

# Quando develop estável, merge em main
git checkout main
git pull
git merge develop
git push origin main
```

# Entrega da Prática 6

## Campos do PR

| Campo | Preencher com |
| --- | --- |
| Título | `[C216 L1] [Prática 6] Entrega do Relatório da Prática 6` |
| Base | `pratica-5`, enquanto o PR da V estiver pendente |
| Branch | `pratica-6` |
| Assignee | `alvarosamp` |
| Reviewer | `MatheusNetto1` |
| Labels | `Prática 6`, `Frontend`, `CI/CD`, `Em revisão` |
| Descrição | [Texto para o PR](pratica-6-pr-body.md) |

Essas labels já existem no repositório. A branch saiu de `pratica-5`, no
commit `51c0377`, sem merge entre as branches. Após o merge da V, confira se
a base da VI mudou para `aulas`. Se a V já tiver sido integrada antes de abrir
o PR, use `aulas` como base.

## Antes de enviar

- Copiar o título e a descrição, marcar o responsável e selecionar o reviewer.
- Aplicar pelo menos três labels.
- Usar Conventional Commits; há uma sugestão de commit abaixo.
- Conferir a base e os checks. A aprovação e o merge ficam com o professor.
- Fazer os ajustes solicitados no prazo de 24 horas informado no aviso.

## O que foi feito

O frontend fica em `frontend/`, ao lado do backend. Usa React com JavaScript,
npm, Vite e Tailwind v4. O formulário, a lista e o resumo ficam separados em
componentes. Os lançamentos ficam no estado React, sem API ou persistência.

O Biome cuida do lint, da formatação e dos imports. Os testes estão separados
em unitários, integração e E2E. O workflow `ci-frontend.yml` tem dois jobs:
qualidade e testes/build. O Makefile oferece os comandos com prefixo `front-`.

## Conferência local

```bash
make front-install
make front-e2e-install
make front-check
make front-dev
```

`make front-check` passou com Biome sem erros, 15 testes Vitest, 2 testes
Playwright e build gerado. Foram conferidos cadastro, filtro, edição, exclusão,
saldo e erros de validação. A tela foi conferida em desktop e celular de 390 px.
O teste no navegador também verifica erros JavaScript e a limpeza dos dados
ao recarregar a página.

## Publicar

```bash
git add frontend .github/workflows/ci-frontend.yml Makefile .gitignore readme.md docs/pratica-6-entrega.md docs/pratica-6-pr-body.md
git commit -m "feat(frontend): adiciona interface da pratica 6"
git push -u origin pratica-6
```

Depois, abra o PR com os campos acima e confira os checks no GitHub.

## Revisões anteriores

Nas revisões dos PRs [2](https://github.com/alvarosamp/c216-lab/pull/2),
[3](https://github.com/alvarosamp/c216-lab/pull/3) e
[4](https://github.com/alvarosamp/c216-lab/pull/4), o professor pediu descrição
das decisões, responsável, labels, Conventional Commits, base `aulas` e regras
de aprovação. Para a VI, o aviso permite usar a V como base enquanto ela aguarda
correção.

Na consulta de 31/10/2026, o PR da IV ainda estava sem descrição e sem assignee.
Os textos para ele continuam em `docs/pratica-4-pr-body.md` e
`docs/pratica-4-entrega.md`. O PR da V tinha descrição, assignee e labels,
sem comentários de revisão. Nenhum desses PRs foi alterado nesta conferência.

O ruleset `Proteção das branches principais` está ativo para `aulas` e para
a branch padrão: exige uma aprovação, Ruff e Pytest. Nesta conferência,
`make check` também passou no backend, com 18 testes, lint e formatação.

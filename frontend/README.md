# Frontend do Controle Financeiro

## Prática VII

O frontend agora consome a API FastAPI e persiste lançamentos no PostgreSQL.
Execute `make docker-up` na raiz e acesse `http://localhost:5173`.
As chamadas ficam em `src/services/transactions.js`. Para os testes de ponta
a ponta, instale o Chromium com `make front-e2e-install` e rode `make test`
com Docker ativo.

Prática VI: React com JavaScript, Vite, Tailwind CSS v4 e npm. O frontend
permite cadastrar, editar, excluir e filtrar receitas e despesas. O resumo
mostra receitas, despesas e saldo de todos os lançamentos, independentemente
do filtro da lista.

O frontend consulta a API e mantém os dados no PostgreSQL.

## Executar

Requisitos: Node.js 24 LTS, npm e GNU Make (Git Bash ou WSL no Windows).
Na raiz do repositório:

```bash
make front-install
make front-dev
```

Abra o endereço mostrado pelo Vite, normalmente `http://localhost:5173`.
Sem Make, entre em `frontend` e use `npm ci` e `npm run dev`.

## Qualidade e testes

```bash
make front-e2e-install
make front-check
```

O primeiro comando instala o Chromium usado pelo Playwright. O segundo verifica
lint, formatação e imports com Biome, executa Vitest, gera o build e executa
Playwright. O Playwright inicia os serviços com Docker Compose quando necessário.

Comandos individuais: `make front-lint`, `make front-format`,
`make front-format-check`, `make front-test`, `make front-test-e2e`,
`make front-build` e `make front-preview`.
Os scripts npm equivalentes estão no `package.json`; `npm run test:watch`
mantém o Vitest em modo interativo.

## Organização

- `src/components/`: formulário, lista e resumo financeiro.
- `src/App.jsx`: estado local e composição dos componentes.
- `src/validation.js`: validações e cálculos em centavos.
- `tests/unit/`: regras de validação e resumo com Vitest.
- `tests/integration/`: componentes trabalhando juntos com Testing Library.
- `tests/e2e/`: fluxo no Chromium com Playwright.
- `vite.config.js`: React, Tailwind e escopo dos testes Vitest.
- `biome.json`: lint, formatação e organização de imports.
- `../.github/workflows/ci-frontend.yml`: jobs de qualidade e testes/build.

A descrição aceita de 3 a 100 caracteres e a categoria opcional, até 50.
O valor deve ser positivo, com até duas casas decimais, usando vírgula ou ponto.
Os cálculos usam centavos inteiros; valores fora da precisão segura do
JavaScript são rejeitados no formulário.

## Referências

- [Tailwind com Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Configuração do Vitest](https://vitest.dev/config/)
- [Servidor de testes Playwright](https://playwright.dev/docs/test-webserver)


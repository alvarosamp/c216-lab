## Prática 7

Integrei o frontend do controle financeiro à API FastAPI. A listagem inicial
vem do PostgreSQL, e cadastro, edição e exclusão usam os endpoints existentes.
O serviço `src/services/transactions.js` centraliza as requisições e apresenta
mensagens para falhas de conexão e respostas de erro. Os dados permanecem após
recarregar a página.

Configurei CORS com origens explícitas, criei o Dockerfile do frontend e
adicionei o serviço ao Compose junto do backend e do PostgreSQL. O comando
`make test` reúne os testes do backend, Vitest e Playwright. O teste E2E
usa a API real e confere persistência, edição e exclusão.

## Verificação

- Biome: sem erros.
- Vitest: 15 testes passaram.
- Build do Vite: passou.
- Testes E2E com Docker: pendentes de execução em ambiente com Docker ativo.
- Testes do backend: pendentes de execução completa neste ambiente.

## Branch

A branch `pratica-7` foi criada a partir de `pratica-6`. A base do PR
deve ser `pratica-6` enquanto a prática anterior não for integrada; após
o merge, conferir se o GitHub ajustou a base para `aulas`.

Álvaro Careli — `alvarosamp`

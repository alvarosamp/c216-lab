# C216 Lab

Projeto das práticas de Sistemas Distribuídos: controle financeiro com API
FastAPI, banco PostgreSQL e frontend React.

## Frontend da Prática VI

O controle financeiro também possui uma interface React com JavaScript, Vite
e Tailwind CSS. Nesta prática, receitas e despesas ficam em memória, sem
integração com a API. Execute `make front-install` e `make front-dev`.
Para validar, instale o navegador com `make front-e2e-install` e execute
`make front-check`. Veja os detalhes em [frontend/README.md](frontend/README.md).

## API de lançamentos

A API permite cadastrar receitas e despesas no PostgreSQL. Os endpoints ficam em
`/transactions` e possuem operações de consulta, criação, alteração e exclusão.
O filtro `type` pode ser usado para listar somente receitas ou despesas:

```bash
curl "http://localhost:8000/transactions?type=expense"
```

O backend está dividido em rotas, schemas Pydantic, modelos SQLAlchemy,
repositório e serviço. Cada requisição recebe uma sessão de banco própria.
As alterações na estrutura do banco são versionadas com Alembic.

## Executando com Docker

Tenha Docker e Docker Compose instalados e execute:

```bash
make docker-up
```

A API ficará disponível em `http://localhost:8000`. Para verificar a saúde do
serviço, acesse `http://localhost:8000/health`.
O backend aplica `alembic upgrade head` antes de iniciar o servidor. Os dados
ficam no volume `postgres_data` e continuam disponíveis após reiniciar a API.

As credenciais de desenvolvimento e a porta podem ser sobrescritas antes de
iniciar os serviços:

```bash
POSTGRES_DB=finance POSTGRES_USER=finance POSTGRES_PASSWORD=finance BACKEND_PORT=8000 make docker-up
```

Use `make help` para consultar os demais comandos do projeto.

## Banco e migrations

Para executar a API fora do Docker, instale as dependências com `make install`,
suba somente o banco e aplique a migration:

```bash
docker compose up -d database
make db-upgrade
make run
```

A conexão local padrão é
`postgresql+psycopg://finance:finance@localhost:5432/finance`.
Defina `DATABASE_URL` para usar outra conexão. Dentro do Compose, o endereço do
banco é `database:5432`; fora dele, use `localhost` e a porta `POSTGRES_PORT`
(5432 por padrão).

Depois de alterar um modelo ORM, gere e revise a migration antes de aplicá-la:

```bash
make db-migration msg="descricao da alteracao"
make db-upgrade
make db-current
make db-history
```

Para conferir a persistência, cadastre um lançamento em `/docs`, anote seu ID,
execute `docker compose restart backend` e consulte o mesmo ID novamente.
Também é possível consultar a tabela pelo `make db-shell`:

```sql
SELECT * FROM transactions;
```

## Testes e qualidade

Execute todas as verificações locais com:

```bash
make check
```

Também é possível executar somente os testes com `make test`. O GitHub Actions
repete essas verificações automaticamente em pushes e pull requests, usando um
PostgreSQL exclusivo para os testes. Localmente, os testes usam SQLite
temporário; para executá-los com PostgreSQL, crie um banco exclusivo de testes e
defina `TEST_DATABASE_URL` antes de rodar `make test`.

# C216 Lab

Projeto das práticas de Sistemas Distribuídos. A aplicação é composta por uma
API FastAPI e um banco PostgreSQL, orquestrados com Docker Compose.

## Executando com Docker

Tenha Docker e Docker Compose instalados e execute:

```bash
make docker-up
```

A API ficará disponível em `http://localhost:8000`. Para verificar a saúde do
serviço, acesse `http://localhost:8000/health`.

As credenciais de desenvolvimento e a porta podem ser sobrescritas antes de
iniciar os serviços:

```bash
POSTGRES_DB=finance POSTGRES_USER=finance POSTGRES_PASSWORD=finance BACKEND_PORT=8000 make docker-up
```

Use `make help` para consultar os demais comandos do projeto.

## Testes e qualidade

Execute todas as verificações locais com:

```bash
make check
```

Também é possível executar somente os testes com `make test`. O GitHub Actions
repete essas verificações automaticamente em pushes e pull requests.

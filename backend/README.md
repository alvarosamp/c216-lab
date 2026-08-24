# Backend — Controle Financeiro

API inicial para um controle financeiro. Atualmente, disponibiliza o endpoint
`GET /health`, que confirma que o serviço está disponível.

## Requisitos

- Python 3.11
- Poetry
- GNU Make (ou Git Bash/WSL no Windows)

## Instalação

```bash
poetry install
```

## Comandos

```bash
make help
make test
make lint
make format
make run
```

Com o servidor em execução, acesse `http://127.0.0.1:8000/health`.

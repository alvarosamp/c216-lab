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

## Docker

Na raiz do repositório, execute `make docker-up` para construir a imagem e
iniciar a API junto com o PostgreSQL. O Compose injeta `DATABASE_URL` no backend
usando o nome DNS interno `database`, e só inicia a API depois que o banco
estiver saudável.

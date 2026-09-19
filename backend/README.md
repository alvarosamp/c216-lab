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
make format-check
make check
make run
```

## Testes

Os testes ficam em `backend/tests` e não dependem do PostgreSQL ou de serviços
externos. Na raiz do projeto, execute:

```bash
make test
```

Para executar localmente as mesmas verificações de qualidade usadas no CI:

```bash
make check
```

O workflow `.github/workflows/ci-backend.yml` executa a formatação, o lint e os
testes automaticamente em pushes e pull requests que alterem o backend.

Com o servidor em execução, acesse `http://127.0.0.1:8000/health`.

## Docker

Na raiz do repositório, execute `make docker-up` para construir a imagem e
iniciar a API junto com o PostgreSQL. O Compose injeta `DATABASE_URL` no backend
usando o nome DNS interno `database`, e só inicia a API depois que o banco
estiver saudável.

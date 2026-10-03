# Backend — Controle Financeiro

API simples para cadastrar receitas e despesas. Os dados ficam em memória e são
reiniciados junto com a aplicação.

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

Os testes unitários ficam em `tests/unit` e validam as regras do serviço. Os
testes de integração ficam em `tests/integration` e chamam os endpoints com o
`TestClient`. Na raiz do projeto, execute:

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

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/health` | Verifica se a API está disponível |
| GET | `/transactions` | Lista os lançamentos e aceita o filtro `type` |
| GET | `/transactions/{id}` | Busca um lançamento pelo ID |
| POST | `/transactions` | Cria um lançamento |
| PUT | `/transactions/{id}` | Substitui os dados de um lançamento |
| PATCH | `/transactions/{id}` | Altera parte de um lançamento |
| DELETE | `/transactions/{id}` | Exclui um lançamento |

Exemplo de cadastro:

```json
{
  "description": "Internet",
  "amount": "120.50",
  "type": "expense",
  "category": "Contas"
}
```

Os tipos aceitos são `income` e `expense`. A documentação interativa fica em
`http://127.0.0.1:8000/docs`.

## Docker

Na raiz do repositório, execute `make docker-up` para construir a imagem e
iniciar a API junto com o PostgreSQL. O Compose injeta `DATABASE_URL` no backend
usando o nome DNS interno `database`, e só inicia a API depois que o banco
estiver saudável.

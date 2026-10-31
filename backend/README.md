# Backend — Controle Financeiro

API para cadastrar receitas e despesas no PostgreSQL, com SQLAlchemy e Alembic.

## Requisitos

- Python 3.11
- Poetry
- GNU Make (ou Git Bash/WSL no Windows)

## Instalação

```bash
cd backend
poetry install
```

## Comandos

Na raiz do repositório:

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
No CI, os testes de integração usam PostgreSQL. Localmente, usam um arquivo
SQLite temporário, com o schema criado pela migration. Para testar em PostgreSQL,
defina `TEST_DATABASE_URL` apontando para um banco exclusivo de testes.
Cada teste de endpoint usa uma transação revertida no final.

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
As migrations são aplicadas antes de iniciar o servidor. O volume do banco
mantém os lançamentos mesmo quando o backend é reiniciado.

## Organização e banco

- `api/`: rotas e dependências HTTP.
- `schemas/`: validação dos dados de entrada e resposta com Pydantic.
- `models/`: tabela `transactions` mapeada com SQLAlchemy.
- `services/`: operações de lançamentos.
- `repositories/`: consultas, gravações e exclusões no banco.
- `database/`: base dos modelos, conexão e sessão por requisição.
- `alembic/`: histórico de alterações do schema.

O endereço da conexão vem de `DATABASE_URL`. Para rodar a API localmente, a
conexão padrão usa `localhost:5432`, banco `finance`, usuário `finance` e senha
`finance`. Na raiz, use `make db-upgrade` para aplicar migrations e
`make db-migration msg="descricao"` para gerar uma nova revisão.

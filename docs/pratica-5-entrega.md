# Entrega da Prática 5

## Configuração do PR

| Campo | Valor |
| --- | --- |
| Título | `[C216 L1] [Prática 5] Entrega do Relatório da Prática 5` |
| Base | `aulas` |
| Origem | `pratica-5` |
| Responsável / Assignee | `alvarosamp` |
| Reviewer | `MatheusNetto1` |
| Labels | `Prática 5`, `Backend`, `Database`, `PostgreSQL`, `Em revisão` |
| Descrição | Conteúdo de [pratica-5-pr-body.md](pratica-5-pr-body.md) |

O título segue o PR 2. A configuração considera a revisão do professor nesse
PR, que pediu descrição, responsável, labels, Conventional Commits e base
`aulas`. As labels acima existem no repositório. A publicação do branch e a
abertura do PR ficam com o autor.

## Conferência da aula

A seção “18. Prática” do vídeo da Prática V, visível por volta de 38min30s,
pede evoluir o recurso da Prática 4 para PostgreSQL:

- PostgreSQL no Docker Compose e conexão por variável de ambiente.
- SQLAlchemy, modelo ORM e schemas Pydantic separados.
- Repositório para acesso aos dados, utilizado pelo serviço.
- CRUD persistido no PostgreSQL.
- Alembic configurado e pelo menos uma migration.
- Aplicação funcionando após reiniciar.
- Testes básicos de integração, `make test` e `make lint` funcionando.

A implementação cobre esses itens. As verificações executadas estão abaixo.

A base utilizada foi a branch `pratica-4` deste repositório. Foram mantidos o
recurso de lançamentos, as rotas e as validações existentes, com as adaptações
de armazenamento necessárias para a Prática 5.

## Conferência item a item

| Requisito do checklist da aula | Comprovação | Resultado |
| --- | --- | --- |
| PostgreSQL funcionando pelo Docker Compose | Serviço `database` saudável, PostgreSQL 17 e tabela consultada por SQL | OK |
| Conexão configurada por variável de ambiente | `DATABASE_URL` em `database/session.py`, recebida pelo Compose | OK |
| SQLAlchemy integrado ao projeto | Dependência instalada e usada no repositório | OK |
| Pelo menos um modelo ORM | `models/transaction.py`, tabela `transactions` | OK |
| Schemas Pydantic separados dos modelos ORM | Modelos de entrada e resposta em `schemas/transaction.py` | OK |
| Repository para acesso aos dados | `TransactionRepository`, com consultas e gravações SQLAlchemy | OK |
| Service utilizando o repository | `TransactionService` recebe e utiliza o repositório | OK |
| CRUD básico persistido no PostgreSQL | POST, GET, PUT, PATCH e DELETE conferidos pela API | OK |
| Alembic configurado | `alembic.ini` e `alembic/env.py` com os metadados dos modelos | OK |
| Pelo menos uma migration criada | `0001_create_transactions.py`; banco em `0001 (head)` | OK |
| Aplicação funcionando após reiniciar | Mesmo ID consultado após `docker compose restart backend` | OK |
| Testes básicos de integração | Endpoints testados com repositório real e banco de testes | OK |
| `make test` funcionando | Executado por `make check`: 18 testes aprovados | OK |
| `make lint` funcionando | Executado por `make check`: sem erros | OK |

A conferência final repetiu `make check` com PostgreSQL: 18 testes aprovados,
lint e formatação sem erros. Os dois serviços continuaram saudáveis e
`alembic check` confirmou a ausência de diferenças entre banco e modelos.

## Verificações locais

- `make check`: 18 testes passaram; lint e formatação sem erros, em Python 3.11.
- Migração inicial aplicada ao banco temporário dos testes.
- Gravação, alteração e exclusão verificadas entre conexões distintas.
- Reversão, reaplicação e comparação da migration com os modelos verificadas.
- `docker compose config --quiet`: configuração válida.
- Imagem construída e serviços iniciados pelo Docker Compose, ambos saudáveis.
- Migration `0001 (head)` aplicada no PostgreSQL 17; `alembic check` sem diferenças.
- Lançamento cadastrado pela API e confirmado diretamente na tabela PostgreSQL.
- Backend reiniciado e mesmo lançamento consultado novamente com sucesso.
- PUT, PATCH, filtro por tipo, DELETE e consulta de ID excluído verificados pela API.
- `make check` repetido com `TEST_DATABASE_URL` em banco PostgreSQL exclusivo:
  18 testes passaram, lint e formatação sem erros.

A conferência no Docker usou o projeto isolado `c216-pratica5`, com API em
`http://localhost:18005/docs` e PostgreSQL na porta local `15435`. O cadastro
usado na conferência foi excluído ao final do teste de CRUD. A configuração
padrão do projeto continua usando as portas 8000 e 5432.

O prazo do healthcheck do banco foi ampliado para acomodar a primeira criação
dos arquivos do PostgreSQL, que demorou mais que o prazo anterior nesta máquina.

## Publicação manual

Depois de concluir a conferência local:

```bash
git add backend compose.yaml Makefile readme.md .gitignore .github/workflows/ci-backend.yml docs/pratica-5-entrega.md docs/pratica-5-pr-body.md
git commit -m "feat(db): adiciona persistencia com PostgreSQL e Alembic"
git push -u origin pratica-5
```

Abra o PR com os campos acima, copie a descrição e confira o resultado dos
checks no GitHub antes de entregar. O CI remoto só poderá ser confirmado após
a publicação.

## Referências

- [PR 2 e comentários do professor](https://github.com/alvarosamp/c216-lab/pull/2).
- [Labels do repositório](https://github.com/alvarosamp/c216-lab/labels).
- Vídeo “Modelo de Entrega e Atividade 1”: demonstração do formato do título.
- Vídeo “Persistência com PostgreSQL, SQLAlchemy & Migrations”, dentro do ZIP
  fornecido: estrutura, sessão, migrations e checklist da Prática 5.

Os vídeos foram conferidos visualmente por quadros, incluindo o checklist;
não houve transcrição integral do áudio.

## Entrega da Prática 5

Nesta prática, passei os lançamentos de receitas e despesas da memória para o
PostgreSQL. As operações de cadastro, consulta, alteração e exclusão continuam
nas mesmas rotas da Prática 4.

## Decisões de implementação

- Separei os schemas Pydantic dos modelos SQLAlchemy. Os schemas validam os
  dados da API e o modelo `Transaction` representa a tabela `transactions`.
- Mantive as rotas chamando o serviço e o serviço chamando o repositório. O
  repositório passou a usar uma sessão SQLAlchemy, recebida por dependência em
  cada requisição e fechada ao final.
- A conexão usa `DATABASE_URL`. No Docker, o backend acessa o serviço `database`
  e o PostgreSQL guarda os dados em um volume.
- Configurei o Alembic e a migration `0001`, que cria a tabela de lançamentos.
  No container, a migration é aplicada antes de iniciar a API. Também adicionei
  comandos de migrations ao Makefile.
- Mantive os campos e validações da Prática 4, com `Decimal` na API e `Numeric`
  no banco, sem acrescentar um limite de dígitos ao valor monetário. Mantive a
  validação de valor positivo e dos tipos `income` e `expense`.
- Os testes unitários isolam o serviço com um repositório simulado. Os testes
  de integração usam o repositório real e o schema criado pelo Alembic. O CI
  passou a executar esses testes com PostgreSQL.

## Validação

`make check` passou no Python 3.11: 18 testes, lint e formatação.
Repeti a suíte usando PostgreSQL em um banco exclusivo de testes, também com
18 testes passando. A imagem Docker foi construída e os dois serviços ficaram
saudáveis. Cadastrei um lançamento, confirmei o registro no PostgreSQL, reiniciei
o backend e consultei o mesmo ID com sucesso. Também conferi PUT, PATCH, filtro
por tipo e DELETE. O Alembic confirmou `0001 (head)` e nenhuma diferença entre
os modelos e o banco. Ampliei o prazo do healthcheck para a criação inicial do banco.

O teste de persistência verifica gravação, alteração e exclusão após reabrir a
conexão. Também verifica a reversão e reaplicação da migration.

Para conferir a aplicação, use `make docker-up` e abra
`http://localhost:8000/docs`. Cadastre um lançamento, reinicie o backend e
consulte o mesmo ID. Os comandos e a configuração da conexão estão no README.

## Entrega da Prática 4 — Arquiteturas e APIs com FastAPI

Organizei a API de controle financeiro em módulos e implementei as operações de
receitas e despesas. A aplicação permite listar, consultar, cadastrar, substituir,
atualizar parcialmente e excluir lançamentos, além de filtrar por tipo.

## Decisões de implementação

- Mantive `main.py` responsável pela criação da aplicação e inclusão do roteador.
  As rotas de saúde e lançamentos ficam em módulos separados para facilitar a manutenção.
- Separei as responsabilidades em rotas HTTP, modelos Pydantic, serviço e
  repositório. O serviço concentra as operações e o repositório concentra o acesso
  aos dados, seguindo a organização em camadas apresentada na aula.
- Usei modelos distintos para criação, substituição, atualização parcial e
  resposta. Os valores monetários usam `Decimal`, com validação de valor positivo
  e até duas casas decimais. O tipo aceita somente `income` ou `expense`.
- Usei Path Parameters para identificar lançamentos e o Query Parameter `type`
  para filtrar receitas e despesas. A API retorna 201 na criação, 204 na exclusão,
  404 para IDs inexistentes e 422 para entradas inválidas.
- Mantive o armazenamento em memória nesta etapa, conforme o foco da Prática 4
  em estrutura e API. O PostgreSQL está disponível no Compose, mas ainda não é
  utilizado pelo repositório; os lançamentos são perdidos ao reiniciar a aplicação.
- Separei os testes unitários do serviço dos testes de integração dos endpoints.
  A pipeline executa testes, lint e verificação de formatação.

## Correspondência com o checklist da aula

- [x] Estrutura de pastas organizada.
- [x] `main.py` responsável pela inicialização da aplicação.
- [x] Rotas separadas em módulos.
- [x] Pelo menos um GET e um POST.
- [x] Uso de Path e Query Parameters.
- [x] Modelos Pydantic.
- [x] Documentação automática disponibilizada pelo FastAPI em `/docs`.
- [x] Testes de saúde mantidos e testes de lançamentos passando localmente.

## Validação local

Na pasta `backend`, foram executados:

```text
python -m pytest                  -> 16 testes passaram
python -m ruff check .            -> sem erros
python -m ruff format --check .   -> 21 arquivos já formatados
```

Esta validação utilizou o ambiente disponível na máquina (Python 3.14.3), fora da
faixa declarada pelo projeto (`>=3.11,<3.14`). A reprodução pelo Poetry no ambiente
declarado e o resultado atual do GitHub Actions ainda precisam ser confirmados.

Para conferir interativamente, inicie a API e abra `http://localhost:8000/docs`.

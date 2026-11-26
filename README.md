# Strategy Lab — comparador de estratégias de investimento

Projeto final de C216 Sistemas Distribuídos. A aplicação permite criar séries de preços, definir estratégias de alocação e comparar simulações sobre **o mesmo ativo e período**. Os dados ficam no PostgreSQL e as simulações permanecem disponíveis após atualizar a página.

## Funcionalidades

- Cadastrar, consultar, editar e excluir séries de preços e estratégias pela interface.
- Adicionar e remover cotações por data; datas repetidas no mesmo ativo retornam conflito.
- Simular **comprar e manter** (compra inicial única) e **aporte mensal** (compra inicial mais aporte na primeira cotação disponível de cada mês seguinte).
- Consultar capital aportado, patrimônio final, retorno sobre aportes, queda máxima e volatilidade anualizada aproximada; visualizar a curva de patrimônio.
- Comparar resultados do **mesmo ativo e intervalo** e excluir simulações salvas.
- Criar dados fictícios de demonstração em um clique. Eles não representam cotações de mercado.

Os cálculos não incluem taxas, impostos, dividendos, proventos, inflação ou fracionamento de ativos. Retornos passados não são previsão nem recomendação financeira.

## Tecnologias e organização

| Parte | Tecnologias | Responsabilidade |
| --- | --- | --- |
| Interface | React, JavaScript, Vite, Tailwind CSS | Formulários, listagens, mensagens, comparação e gráfico |
| API | Python, FastAPI, Pydantic | Rotas REST e validação de entradas |
| Aplicação | Serviços e repositórios | Cálculo determinístico, regras e acesso aos dados |
| Persistência | PostgreSQL, SQLAlchemy, Alembic | Séries, cotações, estratégias e resultados versionados |
| Qualidade | Pytest, Vitest, Testing Library, Playwright, Ruff, Biome | Regras, endpoints, componentes e fluxo real |
| Execução | Poetry, npm, Docker Compose, Makefile, GitHub Actions | Dependências, serviços e verificações |

O código fica em `backend/src/investment_lab` (`api`, `services`, `repositories`, `models`, `schemas`) e `frontend/src` (`components`, API HTTP e interface). A migration inicial está em `backend/alembic/versions`.

## Executar

Pré-requisitos: Docker Desktop/Engine com Compose e `make`. Para desenvolver fora dos contêineres, use Python 3.11 a 3.13, Poetry 2.4.1, Node.js 22 e npm. Copie `.env.example` para `.env` se quiser alterar as configurações de desenvolvimento. Os valores padrão funcionam localmente sem criar o arquivo. Ao mudar usuário, senha ou banco do PostgreSQL, atualize também `DATABASE_URL` para apontar para `database:5432` dentro do Compose. Não versione credenciais reais.

```bash
make up
```

- Interface: <http://localhost:5173>
- Documentação interativa da API: <http://localhost:8000/docs>
- Estado da API: <http://localhost:8000/health>

O Compose inicia PostgreSQL, aguarda o banco ficar saudável, aplica `alembic upgrade head` e inicia API e interface. Os dados permanecem no volume `postgres_data`. Para acompanhar os serviços, use `make logs`; para parar sem apagar dados, `make down`. Se o navegador mostrar erro de API, consulte os logs e aguarde a migração terminar.

Para reproduzir a demonstração, clique em **Criar dados de exemplo** na Visão geral, execute a simulação preparada e crie uma segunda estratégia com as mesmas datas para ver a comparação. Depois atualize a página e confirme que o resultado continua presente.

## Variáveis de ambiente

O arquivo `.env.example` lista `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `DATABASE_URL`, `CORS_ORIGINS` e `VITE_API_URL`. O frontend no navegador acessa a API pela URL pública `http://localhost:8000`; o backend usa a URL interna `database:5432`. Se alterar as portas expostas, ajuste `VITE_API_URL` e `CORS_ORIGINS` em conjunto. Origens CORS são explícitas, sem `*`.

## Desenvolvimento, migrações e testes

```bash
make install          # instala dependências locais (Poetry e npm necessários)
make db-upgrade       # aplica migrations no backend do Compose
make backend-test     # Pytest
make frontend-test    # Vitest e Testing Library
make frontend-build   # build Vite
make e2e              # Playwright; requer make up e Chromium instalado
make check            # lint, testes, build e E2E em um comando; requer make up
```

Para criar uma migration após mudar os modelos: `make db-revision msg="descricao"`, revise o arquivo gerado e rode `make db-upgrade`. Para o E2E local, instale o Chromium uma vez com `cd frontend && npx playwright install chromium`. O teste E2E cria dados pela interface, chama a API, salva a simulação no PostgreSQL e verifica o resultado após recarregar. O CI executa testes e lint do backend e frontend, além do E2E com Compose em um runner Linux.

### Definição das métricas

- **Aporte mensal:** primeira cotação de cada mês posterior ao mês inicial, independentemente de quantos dias existem entre observações.
- **Retorno sobre aportes:** `valor final / total aportado - 1`; não é taxa anualizada nem TIR.
- **Queda máxima:** maior queda de um índice de retorno normalizado, sem tratar um novo aporte como lucro.
- **Volatilidade anualizada:** desvio padrão amostral dos retornos entre cotações consecutivas vezes `sqrt(252)`. Essa aproximação pressupõe observações por pregão; séries esparsas distorcem a leitura. Exibida como contexto de risco do ativo, igual para estratégias sobre o mesmo ativo e período.
- **Preço de compra:** fechamento informado; compras fracionárias são permitidas. Não há execução real de ordens.

## Vídeo demonstrativo

**Link do vídeo:** a inserir pelo aluno antes da entrega no Teams. O vídeo deve mostrar o Compose subindo, CRUD, duas estratégias no mesmo período, comparação, persistência após atualização e resultados do GitHub Actions, com narração do aluno (5 a 10 minutos recomendados no enunciado).

## Entrega

O projeto final fica na branch `projeto-final`. Abra um PR dessa branch para `main`, mantenha-o aberto e confira os checks de backend, frontend e E2E. Entregue no Teams o link do repositório, do PR e do vídeo. O vídeo precisa ser gravado e vinculado pelo aluno.

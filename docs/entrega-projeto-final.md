# Entrega do Projeto Final — C216 L1

## Configuração do Pull Request

- **Título:** `[C216 L1] [Projeto Final] Comparador de Estratégias de Investimento`
- **Origem (compare):** `projeto-final`
- **Destino (base):** `main`
- **Ação:** manter aberto durante a avaliação; não fazer merge.

## Descrição sugerida

### Projeto

Desenvolvi o Strategy Lab, um comparador de duas regras de investimento sobre séries de preços cadastradas no próprio sistema: compra inicial única e compra inicial com aportes mensais. É possível cadastrar e editar séries e estratégias, registrar cotações, executar simulações e comparar resultados no mesmo ativo e intervalo. As simulações são gravadas no PostgreSQL.

### Implementação

O frontend React consome a API FastAPI. O backend separa rotas, schemas, serviços, repositórios e modelos; o cálculo de aportes e métricas está em um serviço testável. SQLAlchemy e Alembic cuidam da persistência e da migração. Docker Compose inicia frontend, backend e banco; Makefile reúne os comandos. O GitHub Actions executa lint, testes e o cenário E2E com Playwright sobre os contêineres.

### Reprodução

Execute `make up` e abra `http://localhost:5173`. Clique em **Criar dados de exemplo** para preparar uma série fictícia e uma estratégia. Execute a simulação, adicione uma segunda estratégia para comparar no mesmo período e recarregue a página para confirmar a persistência. As regras de cálculo e limitações estão no README.

### Verificações

Os testes unitários de cálculo e persistência, testes de interface, lint, build e validação sintática do Compose foram executados localmente. O teste E2E integrado deve ser confirmado na aba **Checks** após o push/PR; o ambiente local de desenvolvimento não iniciou o Docker Desktop durante a preparação.

### Vídeo

[Vídeo demonstrativo no Google Drive](https://drive.google.com/drive/folders/14bsvN-OvFJeSU57WXkk8sI3pkYfC-2FX?usp=sharing). Repetir o link na entrega do Teams.

## Antes de entregar no Teams

1. Conferir que o push de `projeto-final` terminou e que os três jobs do CI passaram.
2. Abrir o PR com o título, origem e destino acima, deixando-o aberto.
3. Conferir se o link do vídeo permite acesso aos avaliadores e se a gravação mostra aplicação real, persistência, Compose e checks.
4. Confirmar o link do vídeo no README e aguardar os checks após o commit/push.
5. Enviar no Teams links do repositório, PR e vídeo até 28/11/2026.

.PHONY: help install test lint format format-check check run clean docker-build docker-up docker-down docker-logs docker-ps docker-restart db-shell db-upgrade db-migration db-current db-history

BACKEND_DIR := backend
POETRY := py -m poetry
PYTEST := $(POETRY) run pytest
UVICORN := $(POETRY) run uvicorn
RUFF := $(POETRY) run ruff
COMPOSE := docker compose

help:
	@echo "Comandos disponíveis:"
	@echo "  make install  - instala dependências"
	@echo "  make test     - executa testes"
	@echo "  make lint     - verifica o código"
	@echo "  make format   - formata o código"
	@echo "  make format-check - verifica a formatação sem alterar arquivos"
	@echo "  make check    - executa formatação, lint e testes"
	@echo "  make run      - inicia o servidor"
	@echo "  make clean    - remove arquivos temporários"
	@echo "  make docker-build   - constrói a imagem do backend"
	@echo "  make docker-up      - inicia backend e banco em segundo plano"
	@echo "  make docker-down    - encerra os containers"
	@echo "  make docker-logs    - acompanha os logs dos serviços"
	@echo "  make docker-ps      - exibe o estado dos serviços"
	@echo "  make docker-restart - reinicia os serviços"
	@echo "  make db-shell       - abre o terminal SQL do PostgreSQL"
	@echo "  make db-upgrade     - aplica as migrations"
	@echo "  make db-migration msg=descricao - gera uma migration"
	@echo "  make db-current     - mostra a migration atual"
	@echo "  make db-history     - mostra o histórico de migrations"

install:
	cd $(BACKEND_DIR) && $(POETRY) install

test:
	cd $(BACKEND_DIR) && $(PYTEST) -v

lint:
	cd $(BACKEND_DIR) && $(RUFF) check .

format:
	cd $(BACKEND_DIR) && $(RUFF) format .

format-check:
	cd $(BACKEND_DIR) && $(RUFF) format --check .

check: format-check lint test

run:
	cd $(BACKEND_DIR) && $(UVICORN) backend.main:app --reload

clean:
	find $(BACKEND_DIR) -type d -name "__pycache__" -exec rm -rf {} +
	find $(BACKEND_DIR) -type d -name ".pytest_cache" -exec rm -rf {} +

docker-build:
	$(COMPOSE) build

docker-up:
	$(COMPOSE) up -d --build

docker-down:
	$(COMPOSE) down

docker-logs:
	$(COMPOSE) logs -f

docker-ps:
	$(COMPOSE) ps

docker-restart:
	$(COMPOSE) restart

db-shell:
	$(COMPOSE) exec database psql -U $${POSTGRES_USER:-finance} -d $${POSTGRES_DB:-finance}

db-upgrade:
	cd $(BACKEND_DIR) && $(POETRY) run alembic upgrade head

db-migration:
	cd $(BACKEND_DIR) && $(POETRY) run alembic revision --autogenerate -m "$(msg)"

db-current:
	cd $(BACKEND_DIR) && $(POETRY) run alembic current

db-history:
	cd $(BACKEND_DIR) && $(POETRY) run alembic history

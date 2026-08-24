.PHONY: help install test lint format run clean

BACKEND_DIR := backend
POETRY := py -m poetry
PYTEST := $(POETRY) run pytest
UVICORN := $(POETRY) run uvicorn
RUFF := $(POETRY) run ruff

help:
	@echo "Comandos disponíveis:"
	@echo "  make install  - instala dependências"
	@echo "  make test     - executa testes"
	@echo "  make lint     - verifica o código"
	@echo "  make format   - formata o código"
	@echo "  make run      - inicia o servidor"
	@echo "  make clean    - remove arquivos temporários"

install:
	cd $(BACKEND_DIR) && $(POETRY) install

test:
	cd $(BACKEND_DIR) && $(PYTEST)

lint:
	cd $(BACKEND_DIR) && $(RUFF) check .

format:
	cd $(BACKEND_DIR) && $(RUFF) format .

run:
	cd $(BACKEND_DIR) && $(UVICORN) backend.main:app --reload

clean:
	find $(BACKEND_DIR) -type d -name "__pycache__" -exec rm -rf {} +
	find $(BACKEND_DIR) -type d -name ".pytest_cache" -exec rm -rf {} +

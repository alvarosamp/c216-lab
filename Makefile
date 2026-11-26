.PHONY: help up down logs install db-upgrade db-revision backend-test backend-lint frontend-test frontend-lint frontend-build e2e test check

help:
	@echo "make up | down | logs | install | db-upgrade | db-revision msg=... | test | check | e2e"

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

install:
	cd backend && poetry install
	cd frontend && npm ci

db-upgrade:
	docker compose exec backend poetry run alembic upgrade head

db-revision:
	cd backend && poetry run alembic revision --autogenerate -m "$(msg)"

backend-test:
	cd backend && poetry run pytest

backend-lint:
	cd backend && poetry run ruff check . && poetry run ruff format --check .

frontend-test:
	cd frontend && npm run test

frontend-lint:
	cd frontend && npm run lint

frontend-build:
	cd frontend && npm run build

e2e:
	cd frontend && npm run test:e2e

test: backend-test frontend-test e2e

check: backend-lint backend-test frontend-lint frontend-test frontend-build e2e

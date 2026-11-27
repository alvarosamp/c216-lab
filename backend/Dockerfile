FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
RUN pip install --no-cache-dir poetry==2.4.1 && poetry config virtualenvs.create false
COPY pyproject.toml poetry.lock ./
RUN poetry install --only main --no-root --no-interaction
COPY alembic.ini ./
COPY alembic ./alembic
COPY src ./src
RUN poetry install --only main --no-interaction
CMD ["sh", "-c", "poetry run alembic upgrade head && poetry run uvicorn investment_lab.main:app --host 0.0.0.0 --port 8000"]

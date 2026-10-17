import os
from collections.abc import Generator
from pathlib import Path

import pytest
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session

from alembic import command
from backend.database.session import get_db
from backend.main import app


@pytest.fixture(scope="session")
def database_engine(tmp_path_factory: pytest.TempPathFactory) -> Generator[Engine]:
    default_url = f"sqlite:///{tmp_path_factory.mktemp('database') / 'test.db'}"
    url = os.getenv("TEST_DATABASE_URL", default_url)
    config = Config(str(Path(__file__).resolve().parents[1] / "alembic.ini"))
    config.attributes["database_url"] = url
    command.upgrade(config, "head")
    options = {"check_same_thread": False} if url.startswith("sqlite") else {}
    engine = create_engine(url, connect_args=options)
    yield engine
    engine.dispose()


@pytest.fixture
def db_session(database_engine: Engine) -> Generator[Session]:
    with database_engine.connect() as connection:
        transaction = connection.begin()
        with Session(bind=connection, join_transaction_mode="rollback_only") as session:
            yield session
        transaction.rollback()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient]:
    def override_db() -> Generator[Session]:
        yield db_session

    app.dependency_overrides[get_db] = override_db
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()

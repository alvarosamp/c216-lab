from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient

from backend.api.dependencies import get_transaction_service
from backend.main import app
from backend.repositories.transaction_repository import TransactionRepository
from backend.services.transaction_service import TransactionService


@pytest.fixture
def client() -> Generator[TestClient]:
    service = TransactionService(TransactionRepository())
    app.dependency_overrides[get_transaction_service] = lambda: service

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()

from http import HTTPStatus

import pytest
from fastapi.testclient import TestClient

from backend.main import app


@pytest.fixture
def client() -> TestClient:
    """Create an isolated client for each test."""
    return TestClient(app)


def test_health_returns_success(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == HTTPStatus.OK


def test_health_returns_expected_body(client: TestClient) -> None:
    response = client.get("/health")

    assert response.json() == {"status": "ok"}


def test_health_returns_json(client: TestClient) -> None:
    response = client.get("/health")

    assert response.headers["content-type"] == "application/json"


@pytest.mark.parametrize("path", ["/missing", "/api", "/health/missing"])
def test_unknown_routes_return_not_found(client: TestClient, path: str) -> None:
    response = client.get(path)

    assert response.status_code == HTTPStatus.NOT_FOUND
    assert response.json() == {"detail": "Not Found"}


def test_health_rejects_post(client: TestClient) -> None:
    response = client.post("/health")

    assert response.status_code == HTTPStatus.METHOD_NOT_ALLOWED


def test_openapi_documents_health_route(client: TestClient) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == HTTPStatus.OK
    assert "/health" in response.json()["paths"]

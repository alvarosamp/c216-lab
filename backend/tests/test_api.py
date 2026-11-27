def test_full_flow_and_persistence(client):
    series = client.post(
        "/series",
        json={"name": "Série de exemplo", "symbol": "DEMO", "description": "Dados fictícios"},
    )
    assert series.status_code == 201
    series_id = series.json()["id"]
    assert (
        client.post(
            f"/series/{series_id}/points", json={"day": "2026-01-02", "price": "10"}
        ).status_code
        == 201
    )
    assert (
        client.post(
            f"/series/{series_id}/points", json={"day": "2026-02-02", "price": "12"}
        ).status_code
        == 201
    )
    assert (
        client.post(
            f"/series/{series_id}/points", json={"day": "2026-02-02", "price": "14"}
        ).status_code
        == 409
    )

    strategy = client.post(
        "/strategies",
        json={
            "name": "Aporte",
            "kind": "monthly_dca",
            "initial_capital": "100",
            "monthly_contribution": "60",
        },
    )
    assert strategy.status_code == 201
    strategy_id = strategy.json()["id"]
    result = client.post(
        "/simulations",
        json={
            "series_id": series_id,
            "strategy_id": strategy_id,
            "start_date": "2026-01-01",
            "end_date": "2026-02-28",
        },
    )
    assert result.status_code == 201
    assert result.json()["final_value"] == "180.00"
    assert client.get("/simulations").json()[0]["id"] == result.json()["id"]
    assert (
        client.put(
            f"/strategies/{strategy_id}",
            json={
                "name": "Aporte atualizado",
                "kind": "monthly_dca",
                "initial_capital": "100",
                "monthly_contribution": "50",
            },
        ).status_code
        == 200
    )
    assert client.delete(f"/simulations/{result.json()['id']}").status_code == 204
    assert client.delete(f"/strategies/{strategy_id}").status_code == 204
    assert client.get("/simulations").json() == []


def test_validation_and_missing_records(client):
    assert (
        client.post(
            "/strategies",
            json={
                "name": "Inconsistente",
                "kind": "buy_hold",
                "initial_capital": 100,
                "monthly_contribution": 10,
            },
        ).status_code
        == 422
    )
    assert client.put("/series/999", json={"name": "Teste", "symbol": "TEST"}).status_code == 404
    assert (
        client.post(
            "/simulations",
            json={
                "series_id": 99,
                "strategy_id": 98,
                "start_date": "2026-02-01",
                "end_date": "2026-01-01",
            },
        ).status_code
        == 422
    )

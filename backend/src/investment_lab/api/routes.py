from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from investment_lab.database import get_db
from investment_lab.models import Simulation
from investment_lab.repositories import catalog as repository
from investment_lab.schemas import (
    PointInput,
    PointOutput,
    SeriesInput,
    SeriesOutput,
    SimulationInput,
    SimulationOutput,
    StrategyInput,
    StrategyOutput,
)
from investment_lab.services import catalog as service

router = APIRouter()
Db = Annotated[Session, Depends(get_db)]


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/series", response_model=list[SeriesOutput])
def list_series(db: Db):
    return repository.list_series(db)


@router.post("/series", response_model=SeriesOutput, status_code=201)
def create_series(data: SeriesInput, db: Db):
    return service.series_or_404(db, service.create_series(db, data).id)


@router.put("/series/{series_id}", response_model=SeriesOutput)
def update_series(series_id: int, data: SeriesInput, db: Db):
    service.update_series(db, series_id, data)
    return service.series_or_404(db, series_id)


@router.delete("/series/{series_id}", status_code=204)
def delete_series(series_id: int, db: Db):
    service.delete_series(db, series_id)
    return Response(status_code=204)


@router.post("/series/{series_id}/points", response_model=PointOutput, status_code=201)
def create_point(series_id: int, data: PointInput, db: Db):
    return service.create_point(db, series_id, data)


@router.delete("/points/{point_id}", status_code=204)
def delete_point(point_id: int, db: Db):
    service.delete_point(db, point_id)
    return Response(status_code=204)


@router.get("/strategies", response_model=list[StrategyOutput])
def list_strategies(db: Db):
    return repository.list_strategies(db)


@router.post("/strategies", response_model=StrategyOutput, status_code=201)
def create_strategy(data: StrategyInput, db: Db):
    return service.create_strategy(db, data)


@router.put("/strategies/{strategy_id}", response_model=StrategyOutput)
def update_strategy(strategy_id: int, data: StrategyInput, db: Db):
    return service.update_strategy(db, strategy_id, data)


@router.delete("/strategies/{strategy_id}", status_code=204)
def delete_strategy(strategy_id: int, db: Db):
    service.delete_strategy(db, strategy_id)
    return Response(status_code=204)


@router.get("/simulations", response_model=list[SimulationOutput])
def list_simulations(db: Db):
    return repository.list_simulations(db)


@router.post("/simulations", response_model=SimulationOutput, status_code=201)
def run_simulation(data: SimulationInput, db: Db):
    return service.run_simulation(db, data)


@router.delete("/simulations/{simulation_id}", status_code=204)
def delete_simulation(simulation_id: int, db: Db):
    item = db.get(Simulation, simulation_id)
    if item is None:
        raise HTTPException(404, "Simulação não encontrada")
    db.delete(item)
    db.commit()
    return Response(status_code=204)

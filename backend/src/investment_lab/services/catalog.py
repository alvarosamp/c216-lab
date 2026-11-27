from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from investment_lab.models import MarketSeries, PricePoint, Simulation, Strategy
from investment_lab.repositories import catalog as repository
from investment_lab.schemas import PointInput, SeriesInput, SimulationInput, StrategyInput
from investment_lab.services.backtest import Observation, calculate_backtest


def save(db: Session, item):
    db.add(item)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(409, "Símbolo ou data já cadastrados") from exc
    db.refresh(item)
    return item


def series_or_404(db: Session, series_id: int) -> MarketSeries:
    item = repository.get_series(db, series_id)
    if item is None:
        raise HTTPException(404, "Série não encontrada")
    return item


def strategy_or_404(db: Session, strategy_id: int) -> Strategy:
    item = db.get(Strategy, strategy_id)
    if item is None:
        raise HTTPException(404, "Estratégia não encontrada")
    return item


def create_series(db: Session, data: SeriesInput) -> MarketSeries:
    return save(db, MarketSeries(**data.model_dump()))


def update_series(db: Session, series_id: int, data: SeriesInput) -> MarketSeries:
    item = series_or_404(db, series_id)
    for key, value in data.model_dump().items():
        setattr(item, key, value)
    return save(db, item)


def delete_series(db: Session, series_id: int) -> None:
    db.delete(series_or_404(db, series_id))
    db.commit()


def create_point(db: Session, series_id: int, data: PointInput) -> PricePoint:
    series_or_404(db, series_id)
    return save(db, PricePoint(series_id=series_id, **data.model_dump()))


def delete_point(db: Session, point_id: int) -> None:
    item = repository.get_point(db, point_id)
    if item is None:
        raise HTTPException(404, "Cotação não encontrada")
    db.delete(item)
    db.commit()


def create_strategy(db: Session, data: StrategyInput) -> Strategy:
    return save(db, Strategy(**data.model_dump()))


def update_strategy(db: Session, strategy_id: int, data: StrategyInput) -> Strategy:
    item = strategy_or_404(db, strategy_id)
    for key, value in data.model_dump().items():
        setattr(item, key, value)
    return save(db, item)


def delete_strategy(db: Session, strategy_id: int) -> None:
    db.delete(strategy_or_404(db, strategy_id))
    db.commit()


def run_simulation(db: Session, data: SimulationInput) -> Simulation:
    if data.start_date > data.end_date:
        raise HTTPException(422, "Data inicial deve preceder a data final")
    series = series_or_404(db, data.series_id)
    strategy = strategy_or_404(db, data.strategy_id)
    points = db.scalars(
        select(PricePoint)
        .where(
            PricePoint.series_id == series.id,
            PricePoint.day >= data.start_date,
            PricePoint.day <= data.end_date,
        )
        .order_by(PricePoint.day)
    ).all()
    try:
        result = calculate_backtest(
            [Observation(point.day, point.price) for point in points],
            strategy.kind,
            strategy.initial_capital,
            strategy.monthly_contribution,
        )
    except ValueError as exc:
        raise HTTPException(422, str(exc)) from exc
    return save(db, Simulation(**data.model_dump(), **result.__dict__))
